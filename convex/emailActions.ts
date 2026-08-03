"use node"

import { ConvexError, v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"

export const deliver = internalAction({
  args: { outboxId: v.id("emailOutbox") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const email = await ctx.runMutation(internal.emails.claimForDelivery, args)
    if (!email) return null
    const providerUrl =
      process.env.EMAIL_PROVIDER_URL ?? "https://api.resend.com/emails"
    const apiKey =
      process.env.EMAIL_PROVIDER_API_KEY ?? process.env.RESEND_API_KEY
    const from = process.env.EMAIL_FROM
    if (!apiKey || !from) {
      await ctx.runMutation(internal.emails.completeDelivery, {
        outboxId: email._id,
        success: false,
        error:
          "Email provider is not configured (EMAIL_FROM and EMAIL_PROVIDER_API_KEY or RESEND_API_KEY are required)",
      })
      return null
    }

    try {
      const response = await fetch(providerUrl, {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [email.recipient],
          subject: email.subject,
          text: email.textBody,
          html: email.htmlBody,
        }),
      })
      if (!response.ok) {
        const errorBody = await response.text().catch(() => "")
        let providerMessage = ""
        try {
          providerMessage =
            (JSON.parse(errorBody) as { message?: string }).message ?? ""
        } catch {
          providerMessage = errorBody
        }
        throw new ConvexError(
          providerMessage || `Email provider returned HTTP ${response.status}`
        )
      }
      const body = (await response.json().catch(() => null)) as {
        id?: string
      } | null
      await ctx.runMutation(internal.emails.completeDelivery, {
        outboxId: email._id,
        success: true,
        providerMessageId: body?.id,
      })
    } catch (error) {
      await ctx.runMutation(internal.emails.completeDelivery, {
        outboxId: email._id,
        success: false,
        error: error instanceof Error ? error.message : "Email delivery failed",
      })
    }
    return null
  },
})
