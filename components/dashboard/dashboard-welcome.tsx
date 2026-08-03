"use client"

import { useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import { authClient } from "@/lib/auth-client"

export function DashboardGreeting() {
  const member = useQuery(api.members.me)
  const session = authClient.useSession()
  const fullName = member?.fullName || session.data?.user.name || "member"
  const firstName = fullName.trim().split(/\s+/, 1)[0] || "member"

  return <>Good morning, {firstName}.</>
}

export function DashboardMembershipSummary() {
  const member = useQuery(api.members.me)

  if (member === undefined) return <>Loading your member record…</>
  if (!member) {
    return (
      <>
        Your portal account is ready. Link an approved membership record to
        unlock your personalized member details.
      </>
    )
  }

  return (
    <>
      Your membership is {member.status}. Here is what is moving across ASRRO
      this week.
    </>
  )
}
