import {
  paginationOptsValidator,
  paginationResultValidator,
} from "convex/server"
import { ConvexError, v } from "convex/values"
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server"
import type { Doc, Id } from "./_generated/dataModel"
import { requireExecutive, requireMember, writeAudit } from "./_lib/auth"
import { adjustCounter } from "./_lib/counters"
import {
  assertFiniteNonNegative,
  assertTimestampOrder,
  cleanText,
  hashSecret,
  normalizeEmail,
  optionalText,
  randomSecret,
} from "./_lib/validation"
import { eventFields, registrationFields } from "./model"

const eventDoc = v.object({
  _id: v.id("events"),
  _creationTime: v.number(),
  ...eventFields,
})
const registrationDoc = v.object({
  _id: v.id("eventRegistrations"),
  _creationTime: v.number(),
  ...registrationFields,
})

const eventInput = v.object({
  eventId: v.optional(v.id("events")),
  slug: v.string(),
  name: v.string(),
  summary: v.string(),
  description: v.string(),
  category: v.string(),
  scope: v.union(
    v.literal("intra_cuet"),
    v.literal("divisional"),
    v.literal("national")
  ),
  audience: v.union(
    v.literal("public"),
    v.literal("members"),
    v.literal("executives")
  ),
  status: v.union(
    v.literal("draft"),
    v.literal("published"),
    v.literal("cancelled"),
    v.literal("completed"),
    v.literal("archived")
  ),
  startsAt: v.number(),
  endsAt: v.number(),
  registrationDeadline: v.number(),
  venue: v.string(),
  organizer: v.string(),
  capacity: v.number(),
  rules: v.optional(v.string()),
  eligibility: v.string(),
  registrationFee: v.number(),
  currency: v.string(),
  contactName: v.string(),
  contactEmail: v.optional(v.string()),
  contactPhone: v.optional(v.string()),
  bannerAssetId: v.optional(v.id("assets")),
})

function publicRegistrationStatus(registration: Doc<"eventRegistrations">) {
  return {
    registrationId: registration._id,
    registrationCode: registration.registrationCode,
    status: registration.status,
    registeredAt: registration.registeredAt,
  }
}

const registrationReceipt = v.object({
  registrationId: v.id("eventRegistrations"),
  registrationCode: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("rejected"),
    v.literal("cancelled"),
    v.literal("attended"),
    v.literal("absent")
  ),
  registeredAt: v.number(),
})

const eventPhase = v.union(
  v.literal("upcoming"),
  v.literal("ongoing"),
  v.literal("past")
)

const directoryEvent = v.object({
  ...eventDoc.fields,
  phase: eventPhase,
})

const memberRegistration = v.object({
  ...registrationReceipt.fields,
  event: eventDoc,
})

const managedRegistration = v.object({
  ...registrationDoc.fields,
  participantName: v.string(),
  participantEmail: v.string(),
  participantPhone: v.string(),
  memberUuid: v.optional(v.string()),
})

function phaseFor(event: Doc<"events">, now: number) {
  if (event.endsAt < now || event.status === "completed") return "past" as const
  if (event.startsAt <= now) return "ongoing" as const
  return "upcoming" as const
}

function isCuetInstitution(value: string) {
  const normalized = value.toLowerCase().replaceAll(/[^a-z]/g, "")
  return (
    normalized.includes("cuet") ||
    normalized.includes("chittagonguniversityofengineeringtechnology")
  )
}

function enforceEligibility(
  event: Doc<"events">,
  details: {
    confirmed: boolean
    institution: string
    institutionDivision?: string
    studentId?: string
  }
) {
  if (!details.confirmed) {
    throw new ConvexError(
      "You must confirm that you meet the eligibility rules"
    )
  }
  if (event.scope === "intra_cuet") {
    if (!isCuetInstitution(details.institution)) {
      throw new ConvexError("Intra-CUET events are limited to CUET students")
    }
    if (!details.studentId?.trim()) {
      throw new ConvexError("A CUET student ID is required")
    }
  }
  if (
    event.scope === "divisional" &&
    !details.institutionDivision?.trim().toLowerCase().startsWith("chattogram")
  ) {
    throw new ConvexError(
      "Divisional events are limited to universities in Chattogram Division"
    )
  }
}

async function ensurePaymentReferenceAvailable(
  ctx: MutationCtx,
  event: Doc<"events">,
  transactionId?: string
) {
  if (event.registrationFee > 0 && !transactionId) {
    throw new ConvexError("A payment transaction ID is required")
  }
  if (!transactionId) return
  const duplicates = await ctx.db
    .query("eventRegistrations")
    .withIndex("by_eventId_and_transactionId", (q) =>
      q.eq("eventId", event._id).eq("transactionId", transactionId)
    )
    .take(20)
  if (duplicates.some((item) => item.status !== "cancelled")) {
    throw new ConvexError("This payment transaction ID has already been used")
  }
}

async function ensureRegistrationOpen(event: Doc<"events">) {
  if (event.status !== "published")
    throw new ConvexError("Event registration is not open")
  if (Date.now() > event.registrationDeadline)
    throw new ConvexError("The registration deadline has passed")
  if (event.activeRegistrationCount >= event.capacity)
    throw new ConvexError("The event has reached capacity")
}

async function insertRegistration(
  ctx: MutationCtx,
  event: Doc<"events">,
  details: {
    memberId?: Id<"members">
    identityToken?: string
    guestName?: string
    guestEmail?: string
    guestEmailNormalized?: string
    guestPhone?: string
    institution?: string
    institutionDivision?: string
    studentId?: string
    eligibilityConfirmed?: boolean
    transactionId?: string
  }
) {
  await ensureRegistrationOpen(event)
  const cancellationToken = randomSecret()
  const now = Date.now()
  const registrationCode = `REG-${event._id.slice(-6).toUpperCase()}-${now.toString(36).toUpperCase()}-${cancellationToken.slice(0, 4).toUpperCase()}`
  const status = event.registrationFee === 0 ? "confirmed" : "pending"
  const registrationId = await ctx.db.insert("eventRegistrations", {
    eventId: event._id,
    ...details,
    registrationCode,
    cancellationTokenHash: await hashSecret(cancellationToken),
    status,
    amountPaid: 0,
    registeredAt: now,
  })
  await ctx.db.patch("events", event._id, {
    activeRegistrationCount: event.activeRegistrationCount + 1,
    updatedAt: now,
  })
  const registration = await ctx.db.get("eventRegistrations", registrationId)
  if (!registration) throw new ConvexError("Registration could not be created")
  return { ...publicRegistrationStatus(registration), cancellationToken }
}

export const listPublic = query({
  args: {
    from: v.number(),
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  returns: paginationResultValidator(eventDoc),
  handler: async (ctx, args) => {
    if (args.category !== undefined) {
      return await ctx.db
        .query("events")
        .withIndex("by_category_and_status_and_startsAt", (q) =>
          q
            .eq("category", args.category!)
            .eq("status", "published")
            .gte("startsAt", args.from)
        )
        .order("asc")
        .paginate(args.paginationOpts)
    }
    return await ctx.db
      .query("events")
      .withIndex("by_status_and_startsAt", (q) =>
        q.eq("status", "published").gte("startsAt", args.from)
      )
      .order("asc")
      .paginate(args.paginationOpts)
  },
})

export const listPast = query({
  args: { before: v.number(), paginationOpts: paginationOptsValidator },
  returns: paginationResultValidator(eventDoc),
  handler: async (ctx, args) =>
    await ctx.db
      .query("events")
      .withIndex("by_status_and_startsAt", (q) =>
        q.eq("status", "published").lte("startsAt", args.before)
      )
      .order("desc")
      .paginate(args.paginationOpts),
})

export const listDirectory = query({
  args: { now: v.number() },
  returns: v.array(directoryEvent),
  handler: async (ctx, args) => {
    const [published, completed] = await Promise.all([
      ctx.db
        .query("events")
        .withIndex("by_status_and_startsAt", (q) => q.eq("status", "published"))
        .order("desc")
        .take(100),
      ctx.db
        .query("events")
        .withIndex("by_status_and_startsAt", (q) => q.eq("status", "completed"))
        .order("desc")
        .take(100),
    ])
    return [...published, ...completed]
      .sort((a, b) => b.startsAt - a.startsAt)
      .slice(0, 100)
      .map((event) => ({ ...event, phase: phaseFor(event, args.now) }))
  },
})

export const getPublicBySlug = query({
  args: { slug: v.string() },
  returns: v.union(eventDoc, v.null()),
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug.trim().toLowerCase()))
      .unique()
    return event?.status === "published" || event?.status === "completed"
      ? event
      : null
  },
})

export const registerGuest = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    institution: v.string(),
    institutionDivision: v.optional(v.string()),
    studentId: v.optional(v.string()),
    eligibilityConfirmed: v.boolean(),
    transactionId: v.optional(v.string()),
  },
  returns: registrationReceipt.extend({ cancellationToken: v.string() }),
  handler: async (ctx, args) => {
    const event = await ctx.db.get("events", args.eventId)
    if (!event) throw new ConvexError("Event not found")
    if (event.audience !== "public")
      throw new ConvexError("This event requires member access")
    const institution = cleanText(args.institution, "Institution", 160)
    const institutionDivision = optionalText(
      args.institutionDivision,
      "Institution division",
      80
    )
    const studentId = optionalText(args.studentId, "Student ID", 80)
    enforceEligibility(event, {
      confirmed: args.eligibilityConfirmed,
      institution,
      institutionDivision,
      studentId,
    })
    const transactionId = optionalText(
      args.transactionId,
      "Transaction ID",
      100
    )
    await ensurePaymentReferenceAvailable(ctx, event, transactionId)
    const guestEmailNormalized = normalizeEmail(args.email)
    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId_and_guestEmailNormalized", (q) =>
        q
          .eq("eventId", event._id)
          .eq("guestEmailNormalized", guestEmailNormalized)
      )
      .order("desc")
      .take(20)
    if (
      existing.some(
        (item) => item.status !== "cancelled" && item.status !== "rejected"
      )
    )
      throw new ConvexError("This email is already registered for the event")
    return await insertRegistration(ctx, event, {
      guestName: cleanText(args.name, "Name", 120),
      guestEmail: guestEmailNormalized,
      guestEmailNormalized,
      guestPhone: cleanText(args.phone, "Phone", 30),
      institution,
      institutionDivision,
      studentId,
      eligibilityConfirmed: true,
      transactionId,
    })
  },
})

export const registerMember = mutation({
  args: {
    eventId: v.id("events"),
    institutionDivision: v.optional(v.string()),
    eligibilityConfirmed: v.boolean(),
    transactionId: v.optional(v.string()),
  },
  returns: registrationReceipt,
  handler: async (ctx, args) => {
    const member = await requireMember(ctx)
    const event = await ctx.db.get("events", args.eventId)
    if (!event) throw new ConvexError("Event not found")
    if (
      event.audience === "executives" &&
      member.systemRole !== "executive" &&
      member.systemRole !== "super_admin"
    )
      throw new ConvexError("Executive access is required")
    const institutionDivision = optionalText(
      args.institutionDivision,
      "Institution division",
      80
    )
    enforceEligibility(event, {
      confirmed: args.eligibilityConfirmed,
      institution: member.institute,
      institutionDivision,
      studentId: member.studentId,
    })
    const transactionId = optionalText(
      args.transactionId,
      "Transaction ID",
      100
    )
    await ensurePaymentReferenceAvailable(ctx, event, transactionId)
    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId_and_memberId", (q) =>
        q.eq("eventId", event._id).eq("memberId", member._id)
      )
      .order("desc")
      .take(20)
    if (
      existing.some(
        (item) => item.status !== "cancelled" && item.status !== "rejected"
      )
    )
      throw new ConvexError("You are already registered for this event")
    const result = await insertRegistration(ctx, event, {
      memberId: member._id,
      identityToken: member.identityToken,
      institution: member.institute,
      institutionDivision,
      studentId: member.studentId,
      eligibilityConfirmed: true,
      transactionId,
    })
    await ctx.db.insert("notifications", {
      memberId: member._id,
      kind: "event_registration",
      title: "Event registration received",
      body: `Your registration for ${event.name} is ${result.status}.`,
      link: `/events/${event.slug}`,
      read: false,
      createdAt: Date.now(),
    })
    return publicRegistrationStatus({
      ...(await ctx.db.get("eventRegistrations", result.registrationId))!,
    })
  },
})

export const cancelGuest = mutation({
  args: { registrationCode: v.string(), cancellationToken: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_registrationCode", (q) =>
        q.eq("registrationCode", args.registrationCode.trim())
      )
      .unique()
    if (
      !registration ||
      registration.cancellationTokenHash !==
        (await hashSecret(args.cancellationToken))
    )
      throw new ConvexError("Registration not found")
    const event = await ctx.db.get("events", registration.eventId)
    if (!event) throw new ConvexError("Event not found")
    if (Date.now() > event.registrationDeadline)
      throw new ConvexError("Registration can no longer be cancelled")
    if (
      ["cancelled", "rejected", "attended", "absent"].includes(
        registration.status
      )
    )
      throw new ConvexError("Registration cannot be cancelled")
    await ctx.db.patch("eventRegistrations", registration._id, {
      status: "cancelled",
    })
    await ctx.db.patch("events", event._id, {
      activeRegistrationCount: Math.max(0, event.activeRegistrationCount - 1),
      updatedAt: Date.now(),
    })
    return null
  },
})

export const getGuestRegistrationStatus = query({
  args: { registrationCode: v.string(), cancellationToken: v.string() },
  returns: v.union(registrationReceipt.extend({ event: eventDoc }), v.null()),
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_registrationCode", (q) =>
        q.eq("registrationCode", args.registrationCode.trim())
      )
      .unique()
    if (
      !registration ||
      registration.cancellationTokenHash !==
        (await hashSecret(args.cancellationToken))
    ) {
      return null
    }
    const event = await ctx.db.get("events", registration.eventId)
    if (!event) return null
    return { ...publicRegistrationStatus(registration), event }
  },
})

export const cancelMine = mutation({
  args: { registrationId: v.id("eventRegistrations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const member = await requireMember(ctx)
    const registration = await ctx.db.get(
      "eventRegistrations",
      args.registrationId
    )
    if (!registration || registration.memberId !== member._id)
      throw new ConvexError("Registration not found")
    const event = await ctx.db.get("events", registration.eventId)
    if (!event || Date.now() > event.registrationDeadline)
      throw new ConvexError("Registration can no longer be cancelled")
    if (
      ["cancelled", "rejected", "attended", "absent"].includes(
        registration.status
      )
    )
      throw new ConvexError("Registration cannot be cancelled")
    await ctx.db.patch("eventRegistrations", registration._id, {
      status: "cancelled",
    })
    await ctx.db.patch("events", event._id, {
      activeRegistrationCount: Math.max(0, event.activeRegistrationCount - 1),
      updatedAt: Date.now(),
    })
    return null
  },
})

export const listMine = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: paginationResultValidator(registrationDoc),
  handler: async (ctx, args) => {
    const member = await requireMember(ctx)
    return await ctx.db
      .query("eventRegistrations")
      .withIndex("by_memberId_and_registeredAt", (q) =>
        q.eq("memberId", member._id)
      )
      .order("desc")
      .paginate(args.paginationOpts)
  },
})

export const memberDashboard = query({
  args: { now: v.number() },
  returns: v.object({
    openEvents: v.array(directoryEvent),
    registrations: v.array(memberRegistration),
  }),
  handler: async (ctx, args) => {
    const member = await requireMember(ctx)
    const [published, registrations] = await Promise.all([
      ctx.db
        .query("events")
        .withIndex("by_status_and_startsAt", (q) => q.eq("status", "published"))
        .order("asc")
        .take(100),
      ctx.db
        .query("eventRegistrations")
        .withIndex("by_memberId_and_registeredAt", (q) =>
          q.eq("memberId", member._id)
        )
        .order("desc")
        .take(200),
    ])
    const openEvents = published.flatMap((event) => {
      if (event.endsAt < args.now) return []
      const visible =
        event.audience !== "executives" ||
        member.systemRole === "executive" ||
        member.systemRole === "super_admin"
      return visible ? [{ ...event, phase: phaseFor(event, args.now) }] : []
    })
    const registrationViews = (
      await Promise.all(
        registrations.map(async (registration) => {
          const event = await ctx.db.get("events", registration.eventId)
          return event
            ? {
                ...publicRegistrationStatus(registration),
                event,
              }
            : null
        })
      )
    ).filter((view): view is NonNullable<typeof view> => view !== null)
    return { openEvents, registrations: registrationViews }
  },
})

export const listManagedEvents = query({
  args: {},
  returns: v.array(eventDoc),
  handler: async (ctx) => {
    await requireExecutive(ctx)
    const statuses = [
      "draft",
      "published",
      "cancelled",
      "completed",
      "archived",
    ] as const
    const groups = await Promise.all(
      statuses.map((status) =>
        ctx.db
          .query("events")
          .withIndex("by_status_and_startsAt", (q) => q.eq("status", status))
          .order("desc")
          .take(100)
      )
    )
    return groups
      .flat()
      .sort((a, b) => b.startsAt - a.startsAt)
      .slice(0, 300)
  },
})

export const listManagedRegistrations = query({
  args: {
    eventId: v.id("events"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("rejected"),
        v.literal("cancelled"),
        v.literal("attended"),
        v.literal("absent")
      )
    ),
  },
  returns: v.array(managedRegistration),
  handler: async (ctx, args) => {
    await requireExecutive(ctx)
    const registrations = args.status
      ? await ctx.db
          .query("eventRegistrations")
          .withIndex("by_eventId_and_status_and_registeredAt", (q) =>
            q.eq("eventId", args.eventId).eq("status", args.status!)
          )
          .order("desc")
          .take(500)
      : await ctx.db
          .query("eventRegistrations")
          .withIndex("by_eventId_and_registeredAt", (q) =>
            q.eq("eventId", args.eventId)
          )
          .order("desc")
          .take(500)
    return await Promise.all(
      registrations.map(async (registration) => {
        const member = registration.memberId
          ? await ctx.db.get("members", registration.memberId)
          : null
        return {
          ...registration,
          participantName:
            member?.fullName ?? registration.guestName ?? "Guest",
          participantEmail: member?.email ?? registration.guestEmail ?? "",
          participantPhone: member?.phone ?? registration.guestPhone ?? "",
          memberUuid: member?.uuid,
        }
      })
    )
  },
})

export const upsert = mutation({
  args: eventInput.fields,
  returns: v.id("events"),
  handler: async (ctx, args) => {
    const actor = await requireExecutive(ctx)
    assertTimestampOrder(args.startsAt, args.endsAt, "event dates")
    if (args.registrationDeadline > args.startsAt)
      throw new ConvexError(
        "Registration deadline must be before the event starts"
      )
    assertFiniteNonNegative(args.capacity, "Capacity")
    assertFiniteNonNegative(args.registrationFee, "Registration fee")
    const slug = cleanText(args.slug, "Slug", 100).toLowerCase()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      throw new ConvexError("Invalid event slug")
    const slugOwner = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()
    if (slugOwner && slugOwner._id !== args.eventId)
      throw new ConvexError("Event slug is already in use")
    const now = Date.now()
    const existing = args.eventId
      ? await ctx.db.get("events", args.eventId)
      : null
    if (args.eventId && !existing) throw new ConvexError("Event not found")
    if (existing && args.capacity < existing.activeRegistrationCount)
      throw new ConvexError(
        "Capacity cannot be lower than active registrations"
      )
    const value = {
      slug,
      name: cleanText(args.name, "Name", 160),
      summary: cleanText(args.summary, "Summary", 400),
      description: cleanText(args.description, "Description", 30_000),
      category: cleanText(args.category, "Category", 80),
      scope: args.scope,
      audience: args.audience,
      status: args.status,
      startsAt: args.startsAt,
      endsAt: args.endsAt,
      registrationDeadline: args.registrationDeadline,
      venue: cleanText(args.venue, "Venue", 200),
      organizer: cleanText(args.organizer, "Organizer", 160),
      capacity: Math.floor(args.capacity),
      activeRegistrationCount: existing?.activeRegistrationCount ?? 0,
      rules: optionalText(args.rules, "Rules", 20_000),
      eligibility: cleanText(args.eligibility, "Eligibility", 5_000),
      registrationFee: args.registrationFee,
      currency: cleanText(args.currency, "Currency", 10).toUpperCase(),
      contactName: cleanText(args.contactName, "Contact name", 120),
      contactEmail: args.contactEmail
        ? normalizeEmail(args.contactEmail)
        : undefined,
      contactPhone: optionalText(args.contactPhone, "Contact phone", 30),
      bannerAssetId: args.bannerAssetId,
      publishedAt:
        args.status === "published"
          ? (existing?.publishedAt ?? now)
          : existing?.publishedAt,
      createdBy: existing?.createdBy ?? actor._id,
      updatedAt: now,
    }
    const id = existing
      ? (await ctx.db.replace("events", existing._id, value), existing._id)
      : await ctx.db.insert("events", value)
    if (existing?.status !== "published" && value.status === "published") {
      await adjustCounter(ctx, "events.published", 1)
    } else if (
      existing?.status === "published" &&
      value.status !== "published"
    ) {
      await adjustCounter(ctx, "events.published", -1)
    }
    await writeAudit(
      ctx,
      actor,
      existing ? "event.update" : "event.create",
      "event",
      id,
      `${existing ? "Updated" : "Created"} ${value.name}`
    )
    return id
  },
})

export const archive = mutation({
  args: { eventId: v.id("events") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const actor = await requireExecutive(ctx)
    const event = await ctx.db.get("events", args.eventId)
    if (!event) throw new ConvexError("Event not found")
    if (event.status === "archived") return null
    if (event.status === "published") {
      await adjustCounter(ctx, "events.published", -1)
    }
    await ctx.db.patch("events", event._id, {
      status: "archived",
      updatedAt: Date.now(),
    })
    await writeAudit(
      ctx,
      actor,
      "event.archive",
      "event",
      event._id,
      `Archived ${event.name}`
    )
    return null
  },
})

export const clone = mutation({
  args: { eventId: v.id("events") },
  returns: v.id("events"),
  handler: async (ctx, args) => {
    const actor = await requireExecutive(ctx)
    const source = await ctx.db.get("events", args.eventId)
    if (!source) throw new ConvexError("Event not found")
    const suffix = Date.now().toString(36)
    const now = Date.now()
    const cloneId = await ctx.db.insert("events", {
      slug: `${source.slug}-copy-${suffix}`,
      name: `${source.name} (Copy)`,
      summary: source.summary,
      description: source.description,
      category: source.category,
      scope: source.scope,
      audience: source.audience,
      status: "draft",
      startsAt: source.startsAt,
      endsAt: source.endsAt,
      registrationDeadline: source.registrationDeadline,
      venue: source.venue,
      organizer: source.organizer,
      capacity: source.capacity,
      activeRegistrationCount: 0,
      rules: source.rules,
      eligibility: source.eligibility,
      registrationFee: source.registrationFee,
      currency: source.currency,
      contactName: source.contactName,
      contactEmail: source.contactEmail,
      contactPhone: source.contactPhone,
      bannerAssetId: source.bannerAssetId,
      createdBy: actor._id,
      updatedAt: now,
    })
    await writeAudit(
      ctx,
      actor,
      "event.clone",
      "event",
      cloneId,
      `Cloned ${source.name}`
    )
    return cloneId
  },
})

export const listRegistrations = query({
  args: {
    eventId: v.id("events"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("rejected"),
      v.literal("cancelled"),
      v.literal("attended"),
      v.literal("absent")
    ),
    paginationOpts: paginationOptsValidator,
  },
  returns: paginationResultValidator(registrationDoc),
  handler: async (ctx, args) => {
    await requireExecutive(ctx)
    return await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId_and_status_and_registeredAt", (q) =>
        q.eq("eventId", args.eventId).eq("status", args.status)
      )
      .order("desc")
      .paginate(args.paginationOpts)
  },
})

export const reviewRegistration = mutation({
  args: {
    registrationId: v.id("eventRegistrations"),
    status: v.union(v.literal("confirmed"), v.literal("rejected")),
    amountPaid: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const actor = await requireExecutive(ctx)
    const registration = await ctx.db.get(
      "eventRegistrations",
      args.registrationId
    )
    if (!registration) throw new ConvexError("Registration not found")
    const event = await ctx.db.get("events", registration.eventId)
    if (!event) throw new ConvexError("Event not found")
    const wasActive =
      registration.status === "pending" || registration.status === "confirmed"
    const willBeActive = args.status === "confirmed"
    if (
      !wasActive &&
      willBeActive &&
      event.activeRegistrationCount >= event.capacity
    )
      throw new ConvexError("The event has reached capacity")
    if (args.amountPaid !== undefined)
      assertFiniteNonNegative(args.amountPaid, "Amount paid")
    await ctx.db.patch("eventRegistrations", registration._id, {
      status: args.status,
      amountPaid:
        args.amountPaid ??
        (args.status === "confirmed"
          ? event.registrationFee
          : registration.amountPaid),
      reviewedAt: Date.now(),
      reviewedBy: actor._id,
    })
    if (wasActive !== willBeActive) {
      await ctx.db.patch("events", event._id, {
        activeRegistrationCount: Math.max(
          0,
          event.activeRegistrationCount + (willBeActive ? 1 : -1)
        ),
        updatedAt: Date.now(),
      })
    }
    await writeAudit(
      ctx,
      actor,
      "registration.review",
      "eventRegistration",
      registration._id,
      `Set ${registration.registrationCode} to ${args.status}`
    )
    return null
  },
})

export const markAttendance = mutation({
  args: { registrationId: v.id("eventRegistrations"), attended: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const actor = await requireExecutive(ctx)
    const registration = await ctx.db.get(
      "eventRegistrations",
      args.registrationId
    )
    if (!registration) throw new ConvexError("Registration not found")
    if (
      registration.status !== "confirmed" &&
      registration.status !== "attended" &&
      registration.status !== "absent"
    )
      throw new ConvexError(
        "Only confirmed registrations can have attendance marked"
      )
    await ctx.db.patch("eventRegistrations", registration._id, {
      status: args.attended ? "attended" : "absent",
      attendanceMarkedAt: Date.now(),
      reviewedBy: actor._id,
    })
    return null
  },
})

/** Idempotent development seed. Invoke explicitly with a real member ID. */
export const seedDemoEvents = internalMutation({
  args: { actorMemberId: v.id("members") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const actor = await ctx.db.get("members", args.actorMemberId)
    if (!actor) throw new ConvexError("Seed actor member not found")
    const definitions = [
      {
        slug: "robotics-foundations-workshop-2026",
        name: "Robotics Foundations Workshop",
        summary:
          "A practical introduction to sensing, control, and mobile robot integration.",
        description:
          "Build and test a compact mobile robot through guided hardware and control exercises.",
        category: "Workshop",
        scope: "intra_cuet" as const,
        audience: "members" as const,
        startsAt: Date.UTC(2026, 8, 18, 3, 0),
        endsAt: Date.UTC(2026, 8, 18, 11, 0),
        registrationDeadline: Date.UTC(2026, 8, 15, 17, 59),
        venue: "CUET Robotics Lab",
        capacity: 40,
        eligibility: "Current CUET students with an interest in robotics.",
        registrationFee: 0,
      },
      {
        slug: "chattogram-space-tech-bootcamp-2026",
        name: "Chattogram Space-Tech Bootcamp",
        summary:
          "Two days of spacecraft systems, embedded computing, and mission design.",
        description:
          "Teams move from mission requirements to a reviewed spacecraft subsystem concept.",
        category: "Bootcamp",
        scope: "divisional" as const,
        audience: "public" as const,
        startsAt: Date.UTC(2026, 9, 9, 3, 0),
        endsAt: Date.UTC(2026, 9, 10, 11, 0),
        registrationDeadline: Date.UTC(2026, 9, 4, 17, 59),
        venue: "CUET Central Auditorium",
        capacity: 120,
        eligibility: "Students of universities located in Chattogram Division.",
        registrationFee: 500,
      },
      {
        slug: "bangladesh-rover-challenge-2026",
        name: "Bangladesh Rover Challenge",
        summary:
          "A national field robotics competition for multidisciplinary university teams.",
        description:
          "Design, demonstrate, and defend a rover for a set of realistic field missions.",
        category: "Competition",
        scope: "national" as const,
        audience: "public" as const,
        startsAt: Date.UTC(2026, 10, 20, 2, 30),
        endsAt: Date.UTC(2026, 10, 21, 12, 0),
        registrationDeadline: Date.UTC(2026, 10, 5, 17, 59),
        venue: "CUET Main Field",
        capacity: 300,
        eligibility:
          "University students participating individually or in eligible teams.",
        registrationFee: 1500,
      },
    ]
    const now = Date.now()
    const existing = await Promise.all(
      definitions.map((definition) =>
        ctx.db
          .query("events")
          .withIndex("by_slug", (q) => q.eq("slug", definition.slug))
          .unique()
      )
    )
    const pending = definitions.filter((_, index) => !existing[index])
    await Promise.all(
      pending.map((definition) =>
        ctx.db.insert("events", {
          ...definition,
          organizer: "ASRRO",
          status: "published",
          activeRegistrationCount: 0,
          rules:
            "Use original work, follow venue safety instructions, and respect shared equipment.",
          currency: "BDT",
          contactName: "ASRRO Events Team",
          contactEmail: "events@asrro.org",
          publishedAt: now,
          createdBy: actor._id,
          updatedAt: now,
        })
      )
    )
    const inserted = pending.length
    if (inserted > 0) await adjustCounter(ctx, "events.published", inserted)
    return inserted
  },
})
