import {
  paginationOptsValidator,
  paginationResultValidator,
} from "convex/server"
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireMember } from "./_lib/auth"
import { notificationFields } from "./model"

const notificationDoc = v.object({
  _id: v.id("notifications"),
  _creationTime: v.number(),
  ...notificationFields,
})

export const listMine = query({
  args: { unreadOnly: v.boolean(), paginationOpts: paginationOptsValidator },
  returns: paginationResultValidator(notificationDoc),
  handler: async (ctx, args) => {
    const member = await requireMember(ctx)
    if (args.unreadOnly) {
      return await ctx.db
        .query("notifications")
        .withIndex("by_memberId_and_read_and_createdAt", (q) =>
          q.eq("memberId", member._id).eq("read", false)
        )
        .order("desc")
        .paginate(args.paginationOpts)
    }
    return await ctx.db
      .query("notifications")
      .withIndex("by_memberId_and_createdAt", (q) =>
        q.eq("memberId", member._id)
      )
      .order("desc")
      .paginate(args.paginationOpts)
  },
})

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const member = await requireMember(ctx)
    const notification = await ctx.db.get("notifications", args.notificationId)
    if (!notification || notification.memberId !== member._id)
      throw new ConvexError("Notification not found")
    if (!notification.read)
      await ctx.db.patch("notifications", notification._id, {
        read: true,
        readAt: Date.now(),
      })
    return null
  },
})
