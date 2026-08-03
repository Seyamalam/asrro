import {
  paginationOptsValidator,
  paginationResultValidator,
} from "convex/server"
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireExecutive, writeAudit } from "./_lib/auth"
import { adjustCounter } from "./_lib/counters"
import {
  cleanText,
  hashSecret,
  normalizeEmail,
  optionalText,
  randomSecret,
} from "./_lib/validation"
import { applicationFields } from "./model"

const applicationDoc = v.object({
  _id: v.id("membershipApplications"),
  _creationTime: v.number(),
  ...applicationFields,
})

const applicationInput = v.object({
  fullName: v.string(),
  profileAssetId: v.optional(v.id("assets")),
  dateOfBirth: v.optional(v.string()),
  gender: v.string(),
  bloodGroup: v.optional(v.string()),
  email: v.string(),
  phone: v.string(),
  institute: v.string(),
  universityName: v.optional(v.string()),
  department: v.string(),
  semester: v.optional(v.string()),
  studentId: v.string(),
  hscBatch: v.string(),
  address: v.string(),
  emergencyContact: v.string(),
  paymentMethod: v.union(
    v.literal("bkash"),
    v.literal("nagad"),
    v.literal("rocket")
  ),
  transactionId: v.string(),
  paymentAssetId: v.optional(v.id("assets")),
})

const trackedApplication = v.object({
  status: v.union(
    v.literal("pending"),
    v.literal("approved"),
    v.literal("rejected")
  ),
  submittedAt: v.number(),
  reviewedAt: v.optional(v.number()),
  reviewNote: v.optional(v.string()),
  memberUuid: v.optional(v.string()),
})

function defaultUuidCode(hscBatch: string, department: string) {
  const galaxies: Record<string, string> = {
    "20": "C",
    "21": "A",
    "22": "M",
    "23": "W",
  }
  const stars: Record<string, string> = {
    mechanical: "V",
    urp: "A",
    architecture: "B",
    pme: "C",
    cse: "R",
    eee: "P",
    civil: "Z",
    ete: "L",
    mie: "D",
    bme: "F",
    mme: "K",
    wre: "S",
  }
  const galaxy = galaxies[hscBatch.trim()]
  const star = stars[department.trim().toLowerCase()]
  return galaxy && star ? `${galaxy}${star}` : null
}

export const submitApplication = mutation({
  args: applicationInput.fields,
  returns: v.object({
    applicationId: v.id("membershipApplications"),
    applicationCode: v.string(),
    trackingToken: v.string(),
    status: v.literal("pending"),
  }),
  handler: async (ctx, args) => {
    const emailNormalized = normalizeEmail(args.email)
    const transactionId = cleanText(args.transactionId, "Transaction ID", 100)
    const duplicatePayment = await ctx.db
      .query("membershipApplications")
      .withIndex("by_transactionId", (q) =>
        q.eq("transactionId", transactionId)
      )
      .unique()
    if (duplicatePayment)
      throw new ConvexError("This transaction ID has already been submitted")

    const recent = await ctx.db
      .query("membershipApplications")
      .withIndex("by_emailNormalized_and_submittedAt", (q) =>
        q.eq("emailNormalized", emailNormalized)
      )
      .order("desc")
      .first()
    if (recent && recent.status !== "rejected") {
      throw new ConvexError(
        "An active application already exists for this email address"
      )
    }

    const identity = await ctx.auth.getUserIdentity()
    const trackingToken = randomSecret()
    const trackingTokenHash = await hashSecret(trackingToken)
    const now = Date.now()
    const applicationCode = `APP-${now.toString(36).toUpperCase()}-${trackingToken.slice(0, 6).toUpperCase()}`
    const applicationId = await ctx.db.insert("membershipApplications", {
      applicationCode,
      trackingTokenHash,
      identityToken: identity?.tokenIdentifier,
      fullName: cleanText(args.fullName, "Full name", 120),
      profileAssetId: args.profileAssetId,
      dateOfBirth: optionalText(args.dateOfBirth, "Date of birth", 20),
      gender: cleanText(args.gender, "Gender", 40),
      bloodGroup: optionalText(args.bloodGroup, "Blood group", 10),
      email: emailNormalized,
      emailNormalized,
      phone: cleanText(args.phone, "Phone", 30),
      institute: cleanText(args.institute, "Institute", 160),
      universityName: optionalText(args.universityName, "University", 160),
      department: cleanText(args.department, "Department", 100),
      semester: optionalText(args.semester, "Semester", 40),
      studentId: cleanText(args.studentId, "Student ID", 80),
      hscBatch: cleanText(args.hscBatch, "HSC batch", 20),
      address: cleanText(args.address, "Address", 500),
      emergencyContact: cleanText(
        args.emergencyContact,
        "Emergency contact",
        80
      ),
      paymentMethod: args.paymentMethod,
      transactionId,
      paymentAssetId: args.paymentAssetId,
      status: "pending",
      submittedAt: now,
    })
    await adjustCounter(ctx, "membershipApplications.total", 1)
    await adjustCounter(ctx, "membershipApplications.pending", 1)
    return {
      applicationId,
      applicationCode,
      trackingToken,
      status: "pending" as const,
    }
  },
})

export const trackApplication = query({
  args: { applicationCode: v.string(), trackingToken: v.string() },
  returns: v.union(trackedApplication, v.null()),
  handler: async (ctx, args) => {
    const application = await ctx.db
      .query("membershipApplications")
      .withIndex("by_applicationCode", (q) =>
        q.eq("applicationCode", args.applicationCode.trim())
      )
      .unique()
    if (
      !application ||
      application.trackingTokenHash !== (await hashSecret(args.trackingToken))
    )
      return null
    const member = application.memberId
      ? await ctx.db.get("members", application.memberId)
      : null
    return {
      status: application.status,
      submittedAt: application.submittedAt,
      reviewedAt: application.reviewedAt,
      reviewNote: application.reviewNote,
      memberUuid: member?.uuid,
    }
  },
})

export const listApplications = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    paginationOpts: paginationOptsValidator,
  },
  returns: paginationResultValidator(applicationDoc),
  handler: async (ctx, args) => {
    await requireExecutive(ctx)
    return await ctx.db
      .query("membershipApplications")
      .withIndex("by_status_and_submittedAt", (q) =>
        q.eq("status", args.status)
      )
      .order("desc")
      .paginate(args.paginationOpts)
  },
})

export const reviewApplication = mutation({
  args: {
    applicationId: v.id("membershipApplications"),
    decision: v.union(v.literal("approve"), v.literal("reject")),
    reviewNote: v.optional(v.string()),
  },
  returns: v.object({
    status: v.union(v.literal("approved"), v.literal("rejected")),
    memberId: v.optional(v.id("members")),
    uuid: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const actor = await requireExecutive(ctx)
    const application = await ctx.db.get(
      "membershipApplications",
      args.applicationId
    )
    if (!application) throw new ConvexError("Application not found")
    if (application.status !== "pending")
      throw new ConvexError("Application has already been reviewed")
    const now = Date.now()
    const reviewNote = optionalText(args.reviewNote, "Review note", 500)

    if (args.decision === "reject") {
      await ctx.db.patch("membershipApplications", application._id, {
        status: "rejected",
        reviewedAt: now,
        reviewedBy: actor._id,
        reviewNote,
      })
      await adjustCounter(ctx, "membershipApplications.pending", -1)
      await adjustCounter(ctx, "membershipApplications.rejected", 1)
      await writeAudit(
        ctx,
        actor,
        "membership.reject",
        "membershipApplication",
        application._id,
        `Rejected ${application.applicationCode}`
      )
      return { status: "rejected" as const }
    }

    const existing = await ctx.db
      .query("members")
      .withIndex("by_emailNormalized", (q) =>
        q.eq("emailNormalized", application.emailNormalized)
      )
      .unique()
    if (existing)
      throw new ConvexError("A member already exists for this email address")
    const mapping = await ctx.db
      .query("uuidMappings")
      .withIndex("by_hscBatch_and_department", (q) =>
        q
          .eq("hscBatch", application.hscBatch)
          .eq("department", application.department.toLowerCase())
      )
      .unique()
    const code = mapping?.active
      ? mapping.code
      : defaultUuidCode(application.hscBatch, application.department)
    if (!code)
      throw new ConvexError(
        "No UUID mapping is configured for this batch and department"
      )
    const counterKey = `uuid.${code}`
    const counter = await ctx.db
      .query("uuidCounters")
      .withIndex("by_key", (q) => q.eq("key", counterKey))
      .unique()
    const number = counter?.nextNumber ?? 1
    if (counter) {
      await ctx.db.patch("uuidCounters", counter._id, {
        nextNumber: number + 1,
        updatedAt: now,
      })
    } else {
      await ctx.db.insert("uuidCounters", {
        key: counterKey,
        nextNumber: 2,
        updatedAt: now,
      })
    }
    const uuid = `${code}-${String(number).padStart(3, "0")}`
    const duplicateUuid = await ctx.db
      .query("members")
      .withIndex("by_uuid", (q) => q.eq("uuid", uuid))
      .unique()
    if (duplicateUuid)
      throw new ConvexError(
        "UUID collision detected; repair the UUID counter before retrying"
      )
    const memberId = await ctx.db.insert("members", {
      identityToken: application.identityToken,
      applicationId: application._id,
      uuid,
      fullName: application.fullName,
      email: application.email,
      emailNormalized: application.emailNormalized,
      phone: application.phone,
      department: application.department,
      hscBatch: application.hscBatch,
      studentId: application.studentId,
      institute: application.institute,
      profileAssetId: application.profileAssetId,
      address: application.address,
      emergencyContact: application.emergencyContact,
      status: "active",
      systemRole: "member",
      joinedAt: now,
      updatedAt: now,
    })
    await ctx.db.patch("membershipApplications", application._id, {
      status: "approved",
      reviewedAt: now,
      reviewedBy: actor._id,
      reviewNote,
      memberId,
    })
    await ctx.db.insert("notifications", {
      memberId,
      kind: "membership_approved",
      title: "Membership approved",
      body: `Welcome to ASRRO. Your member UUID is ${uuid}.`,
      read: false,
      createdAt: now,
    })
    await adjustCounter(ctx, "membershipApplications.pending", -1)
    await adjustCounter(ctx, "members.active", 1)
    await adjustCounter(ctx, "membershipApplications.approved", 1)
    await writeAudit(
      ctx,
      actor,
      "membership.approve",
      "member",
      memberId,
      `Approved ${application.applicationCode} as ${uuid}`
    )
    return { status: "approved" as const, memberId, uuid }
  },
})

export const upsertUuidMapping = mutation({
  args: {
    hscBatch: v.string(),
    department: v.string(),
    galaxyName: v.string(),
    starName: v.string(),
    code: v.string(),
    active: v.boolean(),
  },
  returns: v.id("uuidMappings"),
  handler: async (ctx, args) => {
    const actor = await requireExecutive(ctx)
    const hscBatch = cleanText(args.hscBatch, "HSC batch", 20)
    const department = cleanText(
      args.department,
      "Department",
      100
    ).toLowerCase()
    const code = cleanText(args.code, "UUID code", 10).toUpperCase()
    if (!/^[A-Z0-9]{2,10}$/.test(code))
      throw new ConvexError("UUID code must be 2-10 letters or digits")
    const existing = await ctx.db
      .query("uuidMappings")
      .withIndex("by_hscBatch_and_department", (q) =>
        q.eq("hscBatch", hscBatch).eq("department", department)
      )
      .unique()
    const value = {
      hscBatch,
      department,
      galaxyName: cleanText(args.galaxyName, "Galaxy name", 80),
      starName: cleanText(args.starName, "Star name", 80),
      code,
      active: args.active,
      updatedAt: Date.now(),
    }
    const id = existing
      ? (await ctx.db.patch("uuidMappings", existing._id, value), existing._id)
      : await ctx.db.insert("uuidMappings", value)
    await writeAudit(
      ctx,
      actor,
      "uuid_mapping.upsert",
      "uuidMapping",
      id,
      `Configured ${hscBatch}/${department} as ${code}`
    )
    return id
  },
})
