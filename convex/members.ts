import {
  paginationOptsValidator,
  paginationResultValidator,
} from "convex/server"
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import type { Doc } from "./_generated/dataModel"
import {
  currentMember,
  requireExecutive,
  requireMember,
  requireSuperAdmin,
  writeAudit,
} from "./_lib/auth"
import {
  cleanText,
  hashSecret,
  normalizeEmail,
  optionalText,
} from "./_lib/validation"
import { memberFields } from "./model"

const memberDoc = v.object({
  _id: v.id("members"),
  _creationTime: v.number(),
  ...memberFields,
})
const memberSelf = v.object({
  _id: v.id("members"),
  uuid: v.string(),
  fullName: v.string(),
  email: v.string(),
  phone: v.string(),
  department: v.string(),
  hscBatch: v.string(),
  studentId: v.string(),
  institute: v.string(),
  profileAssetId: v.optional(v.id("assets")),
  address: v.optional(v.string()),
  emergencyContact: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("active"),
    v.literal("suspended"),
    v.literal("alumni"),
    v.literal("rejected")
  ),
  systemRole: v.union(
    v.literal("member"),
    v.literal("executive"),
    v.literal("super_admin")
  ),
  joinedAt: v.number(),
  membershipValidUntil: v.optional(v.number()),
})

function presentMember(member: Doc<"members">) {
  return {
    _id: member._id,
    uuid: member.uuid,
    fullName: member.fullName,
    email: member.email,
    phone: member.phone,
    department: member.department,
    hscBatch: member.hscBatch,
    studentId: member.studentId,
    institute: member.institute,
    profileAssetId: member.profileAssetId,
    address: member.address,
    emergencyContact: member.emergencyContact,
    status: member.status,
    systemRole: member.systemRole,
    joinedAt: member.joinedAt,
    membershipValidUntil: member.membershipValidUntil,
  }
}

export const me = query({
  args: {},
  returns: v.union(memberSelf, v.null()),
  handler: async (ctx) => {
    const member = await currentMember(ctx)
    return member ? presentMember(member) : null
  },
})

export const updateMyProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    profileAssetId: v.optional(v.id("assets")),
  },
  returns: memberSelf,
  handler: async (ctx, args) => {
    const member = await requireMember(ctx)
    const patch: {
      fullName?: string
      phone?: string
      email?: string
      emailNormalized?: string
      address?: string
      emergencyContact?: string
      profileAssetId?: typeof args.profileAssetId
      updatedAt: number
    } = { updatedAt: Date.now() }
    if (args.fullName !== undefined)
      patch.fullName = cleanText(args.fullName, "Full name", 120)
    if (args.phone !== undefined)
      patch.phone = cleanText(args.phone, "Phone", 30)
    if (args.address !== undefined)
      patch.address = optionalText(args.address, "Address", 500)
    if (args.emergencyContact !== undefined)
      patch.emergencyContact = optionalText(
        args.emergencyContact,
        "Emergency contact",
        80
      )
    if (args.profileAssetId !== undefined)
      patch.profileAssetId = args.profileAssetId
    if (args.email !== undefined) {
      const emailNormalized = normalizeEmail(args.email)
      const duplicate = await ctx.db
        .query("members")
        .withIndex("by_emailNormalized", (q) =>
          q.eq("emailNormalized", emailNormalized)
        )
        .unique()
      if (duplicate && duplicate._id !== member._id)
        throw new ConvexError("Email address is already in use")
      patch.email = emailNormalized
      patch.emailNormalized = emailNormalized
    }
    await ctx.db.patch("members", member._id, patch)
    const updated = await ctx.db.get("members", member._id)
    if (!updated) throw new ConvexError("Member not found after update")
    return presentMember(updated)
  },
})

export const list = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("suspended"),
      v.literal("alumni"),
      v.literal("rejected")
    ),
    paginationOpts: paginationOptsValidator,
  },
  returns: paginationResultValidator(memberDoc),
  handler: async (ctx, args) => {
    await requireExecutive(ctx)
    return await ctx.db
      .query("members")
      .withIndex("by_status_and_joinedAt", (q) => q.eq("status", args.status))
      .order("desc")
      .paginate(args.paginationOpts)
  },
})

export const getByUuid = query({
  args: { uuid: v.string() },
  returns: v.union(memberDoc, v.null()),
  handler: async (ctx, args) => {
    await requireExecutive(ctx)
    return await ctx.db
      .query("members")
      .withIndex("by_uuid", (q) => q.eq("uuid", args.uuid.trim().toUpperCase()))
      .unique()
  },
})

export const setStatus = mutation({
  args: {
    memberId: v.id("members"),
    status: v.union(
      v.literal("active"),
      v.literal("suspended"),
      v.literal("alumni")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const actor = await requireExecutive(ctx)
    const member = await ctx.db.get("members", args.memberId)
    if (!member) throw new ConvexError("Member not found")
    if (
      member.systemRole === "super_admin" &&
      actor.systemRole !== "super_admin"
    ) {
      throw new ConvexError(
        "Only a super administrator may change this account"
      )
    }
    await ctx.db.patch("members", member._id, {
      status: args.status,
      updatedAt: Date.now(),
    })
    await writeAudit(
      ctx,
      actor,
      "member.status",
      "member",
      member._id,
      `Changed ${member.uuid} to ${args.status}`
    )
    return null
  },
})

export const setRole = mutation({
  args: {
    memberId: v.id("members"),
    systemRole: v.union(
      v.literal("member"),
      v.literal("executive"),
      v.literal("super_admin")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const actor = await requireSuperAdmin(ctx)
    const member = await ctx.db.get("members", args.memberId)
    if (!member) throw new ConvexError("Member not found")
    await ctx.db.patch("members", member._id, {
      systemRole: args.systemRole,
      updatedAt: Date.now(),
    })
    await writeAudit(
      ctx,
      actor,
      "member.role",
      "member",
      member._id,
      `Changed ${member.uuid} role to ${args.systemRole}`
    )
    return null
  },
})

export const linkMyIdentity = mutation({
  args: { applicationCode: v.string(), trackingToken: v.string() },
  returns: v.id("members"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError("Authentication is required")
    const existing = await currentMember(ctx)
    if (existing) return existing._id
    const application = await ctx.db
      .query("membershipApplications")
      .withIndex("by_applicationCode", (q) =>
        q.eq("applicationCode", args.applicationCode.trim())
      )
      .unique()
    if (
      !application ||
      application.status !== "approved" ||
      !application.memberId
    )
      throw new ConvexError("Approved application not found")
    if (
      application.trackingTokenHash !== (await hashSecret(args.trackingToken))
    )
      throw new ConvexError("Invalid tracking credentials")
    const member = await ctx.db.get("members", application.memberId)
    if (!member) throw new ConvexError("Member record not found")
    if (
      member.identityToken &&
      member.identityToken !== identity.tokenIdentifier
    )
      throw new ConvexError("Member is already linked to another identity")
    await ctx.db.patch("members", member._id, {
      identityToken: identity.tokenIdentifier,
      updatedAt: Date.now(),
    })
    await ctx.db.patch("membershipApplications", application._id, {
      identityToken: identity.tokenIdentifier,
    })
    return member._id
  },
})
