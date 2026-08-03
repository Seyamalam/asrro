import { ConvexError } from "convex/values"
import type { Doc } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

type ReadCtx = QueryCtx | MutationCtx

export async function currentIdentityToken(ctx: ReadCtx) {
  const identity = await ctx.auth.getUserIdentity()
  return identity?.tokenIdentifier ?? null
}

export async function currentMember(
  ctx: ReadCtx
): Promise<Doc<"members"> | null> {
  const token = await currentIdentityToken(ctx)
  if (!token) return null
  return await ctx.db
    .query("members")
    .withIndex("by_identityToken", (q) => q.eq("identityToken", token))
    .unique()
}

export async function requireMember(ctx: ReadCtx): Promise<Doc<"members">> {
  const member = await currentMember(ctx)
  if (!member || member.status !== "active") {
    throw new ConvexError("Active membership is required")
  }
  return member
}

export async function requireExecutive(ctx: ReadCtx): Promise<Doc<"members">> {
  const member = await requireMember(ctx)
  if (
    member.systemRole !== "executive" &&
    member.systemRole !== "super_admin"
  ) {
    throw new ConvexError("Executive access is required")
  }
  return member
}

export async function requireSuperAdmin(ctx: ReadCtx): Promise<Doc<"members">> {
  const member = await requireMember(ctx)
  if (member.systemRole !== "super_admin") {
    throw new ConvexError("Super administrator access is required")
  }
  return member
}

export async function requireFinanceAccess(
  ctx: ReadCtx
): Promise<Doc<"members">> {
  const member = await requireMember(ctx)
  if (member.systemRole === "super_admin") return member
  if (member.systemRole !== "executive") {
    throw new ConvexError("Finance access is required")
  }

  const currentTerm = await ctx.db
    .query("committeeTerms")
    .withIndex("by_status_and_startsAt", (q) => q.eq("status", "current"))
    .order("desc")
    .first()
  if (!currentTerm) throw new ConvexError("Finance access is not configured")

  const appointment = await ctx.db
    .query("committeeMembers")
    .withIndex("by_memberId_and_termId", (q) =>
      q.eq("memberId", member._id).eq("termId", currentTerm._id)
    )
    .unique()
  const allowed = new Set([
    "president",
    "vice_president",
    "financial_secretary",
    "organizing_secretary",
  ])
  if (!appointment || !allowed.has(appointment.positionKey)) {
    throw new ConvexError(
      "Your committee position does not grant finance access"
    )
  }
  return member
}

export async function writeAudit(
  ctx: MutationCtx,
  actor: Doc<"members">,
  action: string,
  entityType: string,
  entityId: string | undefined,
  summary: string
) {
  await ctx.db.insert("auditLogs", {
    actorMemberId: actor._id,
    action,
    entityType,
    entityId,
    summary,
    createdAt: Date.now(),
  })
}
