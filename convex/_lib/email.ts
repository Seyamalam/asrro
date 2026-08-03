import type { Id } from "../_generated/dataModel"
import type { MutationCtx } from "../_generated/server"
import { cleanText, normalizeEmail, optionalText } from "./validation"

export type EmailOutboxInput = {
  recipient: string
  recipientName?: string
  template: string
  subject: string
  textBody: string
  htmlBody?: string
  memberId?: Id<"members">
  applicationId?: Id<"membershipApplications">
  eventId?: Id<"events">
  registrationId?: Id<"eventRegistrations">
}

export async function enqueueEmail(ctx: MutationCtx, input: EmailOutboxInput) {
  const now = Date.now()
  return await ctx.db.insert("emailOutbox", {
    recipient: normalizeEmail(input.recipient),
    recipientName: optionalText(input.recipientName, "Recipient name", 120),
    template: cleanText(input.template, "Email template", 80),
    subject: cleanText(input.subject, "Email subject", 180),
    textBody: cleanText(input.textBody, "Email body", 20_000),
    htmlBody: optionalText(input.htmlBody, "HTML email body", 40_000),
    status: "queued",
    memberId: input.memberId,
    applicationId: input.applicationId,
    eventId: input.eventId,
    registrationId: input.registrationId,
    attempts: 0,
    createdAt: now,
    updatedAt: now,
  })
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

export function membershipDecisionEmail(input: {
  name: string
  decision: "approved" | "rejected"
  uuid?: string
  note?: string
}) {
  const name = input.name.trim()
  if (input.decision === "approved") {
    const textBody = `Hello ${name},\n\nYour ASRRO membership application has been approved. Your member UUID is ${input.uuid}. You can sign in to view your membership card.\n\nASRRO Membership Team`
    return {
      template: "membership_approved",
      subject: "Your ASRRO membership is approved",
      textBody,
      htmlBody: `<p>Hello ${escapeHtml(name)},</p><p>Your ASRRO membership application has been approved.</p><p><strong>Member UUID: ${escapeHtml(input.uuid ?? "")}</strong></p><p>You can sign in to view your membership card.</p><p>ASRRO Membership Team</p>`,
    }
  }
  const reason = input.note?.trim()
  const textBody = `Hello ${name},\n\nYour ASRRO membership application was not approved.${reason ? `\n\nReview note: ${reason}` : ""}\n\nContact the membership team if you need help.\n\nASRRO Membership Team`
  return {
    template: "membership_rejected",
    subject: "Update on your ASRRO membership application",
    textBody,
    htmlBody: `<p>Hello ${escapeHtml(name)},</p><p>Your ASRRO membership application was not approved.</p>${reason ? `<p><strong>Review note:</strong> ${escapeHtml(reason)}</p>` : ""}<p>Contact the membership team if you need help.</p><p>ASRRO Membership Team</p>`,
  }
}

export function announcementEmail(input: {
  name?: string
  subject: string
  message: string
}) {
  const greeting = input.name?.trim() ? `Hello ${input.name.trim()},` : "Hello,"
  return {
    template: "member_announcement",
    subject: input.subject,
    textBody: `${greeting}\n\n${input.message.trim()}\n\nASRRO`,
    htmlBody: `<p>${escapeHtml(greeting)}</p><p>${escapeHtml(input.message.trim()).replaceAll("\n", "<br>")}</p><p>ASRRO</p>`,
  }
}
