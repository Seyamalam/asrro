import {
  paginationOptsValidator,
  paginationResultValidator,
} from "convex/server"
import { ConvexError, v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation, mutation, query } from "./_generated/server"
import { requirePermission } from "./_lib/auth"
import { announcementEmail, enqueueEmail } from "./_lib/email"
import { cleanText, normalizeEmail, optionalText } from "./_lib/validation"
import { emailOutboxFields } from "./model"

const outboxDoc = v.object({
  _id: v.id("emailOutbox"),
  _creationTime: v.number(),
  ...emailOutboxFields,
})

const enqueueArgs = {
  recipient: v.string(),
  recipientName: v.optional(v.string()),
  template: v.string(),
  subject: v.string(),
  textBody: v.string(),
  htmlBody: v.optional(v.string()),
  memberId: v.optional(v.id("members")),
  applicationId: v.optional(v.id("membershipApplications")),
  eventId: v.optional(v.id("events")),
  registrationId: v.optional(v.id("eventRegistrations")),
}

export const enqueue = internalMutation({
  args: enqueueArgs,
  returns: v.id("emailOutbox"),
  handler: async (ctx, args) => {
    const outboxId = await enqueueEmail(ctx, args)
    await ctx.scheduler.runAfter(0, internal.emailActions.deliver, { outboxId })
    return outboxId
  },
})

export const list = query({
  args: {
    status: v.union(
      v.literal("queued"),
      v.literal("sending"),
      v.literal("sent"),
      v.literal("failed")
    ),
    paginationOpts: paginationOptsValidator,
  },
  returns: paginationResultValidator(outboxDoc),
  handler: async (ctx, args) => {
    await requirePermission(ctx, "notifications_send")
    return await ctx.db
      .query("emailOutbox")
      .withIndex("by_status_and_createdAt", (q) => q.eq("status", args.status))
      .order("desc")
      .paginate(args.paginationOpts)
  },
})

export const bulkEmailMembers = mutation({
  args: {
    memberIds: v.array(v.id("members")),
    subject: v.string(),
    message: v.string(),
  },
  returns: v.object({ queued: v.number() }),
  handler: async (ctx, args) => {
    await requirePermission(ctx, "notifications_send")
    const uniqueIds = [...new Set(args.memberIds)]
    if (uniqueIds.length === 0 || uniqueIds.length > 50) {
      throw new ConvexError("Select between 1 and 50 members")
    }
    const subject = cleanText(args.subject, "Subject", 180)
    const message = cleanText(args.message, "Message", 10_000)
    let queued = 0
    for (const memberId of uniqueIds) {
      const member = await ctx.db.get("members", memberId)
      if (!member) continue
      const content = announcementEmail({
        name: member.fullName,
        subject,
        message,
      })
      const outboxId = await enqueueEmail(ctx, {
        recipient: member.email,
        recipientName: member.fullName,
        memberId,
        ...content,
      })
      await ctx.scheduler.runAfter(0, internal.emailActions.deliver, {
        outboxId,
      })
      queued += 1
    }
    return { queued }
  },
})

export const claimForDelivery = internalMutation({
  args: { outboxId: v.id("emailOutbox") },
  returns: v.union(outboxDoc, v.null()),
  handler: async (ctx, args) => {
    const item = await ctx.db.get("emailOutbox", args.outboxId)
    if (!item || (item.status !== "queued" && item.status !== "failed")) {
      return null
    }
    await ctx.db.patch("emailOutbox", item._id, {
      status: "sending",
      attempts: item.attempts + 1,
      lastError: undefined,
      updatedAt: Date.now(),
    })
    return {
      ...item,
      status: "sending" as const,
      attempts: item.attempts + 1,
      lastError: undefined,
      updatedAt: Date.now(),
    }
  },
})

export const completeDelivery = internalMutation({
  args: {
    outboxId: v.id("emailOutbox"),
    success: v.boolean(),
    providerMessageId: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const item = await ctx.db.get("emailOutbox", args.outboxId)
    if (!item) return null
    const now = Date.now()
    await ctx.db.patch("emailOutbox", item._id, {
      status: args.success ? "sent" : "failed",
      providerMessageId: optionalText(
        args.providerMessageId,
        "Provider message ID",
        300
      ),
      lastError: optionalText(args.error, "Email delivery error", 1000),
      sentAt: args.success ? now : undefined,
      updatedAt: now,
    })
    return null
  },
})

export const queueOneForTesting = internalMutation({
  args: enqueueArgs,
  returns: v.id("emailOutbox"),
  handler: async (ctx, args) =>
    await enqueueEmail(ctx, {
      ...args,
      recipient: normalizeEmail(args.recipient),
    }),
})
