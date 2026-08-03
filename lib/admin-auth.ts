import { redirect } from "next/navigation"

import { api } from "@/convex/_generated/api"
import { fetchAuthQuery } from "@/lib/auth-server"

export async function requirePortalRole(
  minimum: "executive" | "super_admin" = "executive"
) {
  const member = await fetchAuthQuery(api.members.me)
  const allowed =
    member?.status === "active" &&
    (member.systemRole === "super_admin" ||
      (minimum === "executive" && member.systemRole === "executive"))
  if (!allowed) redirect("/dashboard")
  return member
}
