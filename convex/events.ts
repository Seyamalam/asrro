import {
  paginationOptsValidator,
  paginationResultValidator,
} from "convex/server"
import { ConvexError, v } from "convex/values"
import { mutation, query, type MutationCtx } from "./_generated/server"
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

export const getPublicBySlug = query({
  args: { slug: v.string() },
  returns: v.union(eventDoc, v.null()),
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug.trim().toLowerCase()))
      .unique()
    return event?.status === "published" ? event : null
  },
})

export const registerGuest = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    institution: v.string(),
    transactionId: v.optional(v.string()),
  },
  returns: registrationReceipt.extend({ cancellationToken: v.string() }),
  handler: async (ctx, args) => {
    const event = await ctx.db.get("events", args.eventId)
    if (!event) throw new ConvexError("Event not found")
    if (event.audience !== "public")
      throw new ConvexError("This event requires member access")
    const guestEmailNormalized = normalizeEmail(args.email)
    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId_and_guestEmailNormalized", (q) =>
        q
          .eq("eventId", event._id)
          .eq("guestEmailNormalized", guestEmailNormalized)
      )
      .unique()
    if (
      existing &&
      existing.status !== "cancelled" &&
      existing.status !== "rejected"
    )
      throw new ConvexError("This email is already registered for the event")
    return await insertRegistration(ctx, event, {
      guestName: cleanText(args.name, "Name", 120),
      guestEmail: guestEmailNormalized,
      guestEmailNormalized,
      guestPhone: cleanText(args.phone, "Phone", 30),
      institution: cleanText(args.institution, "Institution", 160),
      transactionId: optionalText(args.transactionId, "Transaction ID", 100),
    })
  },
})

export const registerMember = mutation({
  args: { eventId: v.id("events"), transactionId: v.optional(v.string()) },
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
    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId_and_memberId", (q) =>
        q.eq("eventId", event._id).eq("memberId", member._id)
      )
      .unique()
    if (
      existing &&
      existing.status !== "cancelled" &&
      existing.status !== "rejected"
    )
      throw new ConvexError("You are already registered for this event")
    const result = await insertRegistration(ctx, event, {
      memberId: member._id,
      identityToken: member.identityToken,
      transactionId: optionalText(args.transactionId, "Transaction ID", 100),
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
      amountPaid: args.amountPaid ?? registration.amountPaid,
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
