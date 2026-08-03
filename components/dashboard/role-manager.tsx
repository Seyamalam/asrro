"use client"

import { useMutation, usePaginatedQuery } from "convex/react"
import { useState } from "react"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { ActionButton, StatusPill } from "@/components/dashboard/dashboard-kit"

export function RoleManager() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.members.list,
    { status: "active" },
    { initialNumItems: 50 }
  )
  const setRole = useMutation(api.members.setRole)
  const [pending, setPending] = useState<Id<"members"> | null>(null)
  const [message, setMessage] = useState("")
  return (
    <div>
      <div className="divide-y divide-slate-100 dark:divide-white/8">
        {results.map((member) => (
          <article
            key={member._id}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">{member.fullName}</h2>
              <p className="mt-1 text-xs text-slate-500">
                {member.uuid} · {member.email}
              </p>
            </div>
            <StatusPill
              tone={
                member.systemRole === "super_admin"
                  ? "violet"
                  : member.systemRole === "executive"
                    ? "blue"
                    : "slate"
              }
            >
              {member.systemRole}
            </StatusPill>
            <select
              defaultValue={member.systemRole}
              disabled={pending === member._id}
              onChange={(event) => {
                const role = event.target.value as
                  "member" | "executive" | "super_admin"
                setPending(member._id)
                setMessage("")
                void setRole({ memberId: member._id, systemRole: role })
                  .then(() => setMessage(`Updated ${member.fullName}.`))
                  .catch((error: unknown) =>
                    setMessage(
                      error instanceof Error
                        ? error.message
                        : "Role update failed"
                    )
                  )
                  .finally(() => setPending(null))
              }}
              className="h-9 rounded-lg border border-slate-200 px-2 text-xs dark:border-white/10 dark:bg-slate-900"
            >
              <option value="member">Member</option>
              <option value="executive">Executive</option>
              <option value="super_admin">Super admin</option>
            </select>
          </article>
        ))}
      </div>
      {status === "CanLoadMore" ? (
        <ActionButton
          className="m-5"
          variant="secondary"
          onClick={() => loadMore(50)}
        >
          Load more members
        </ActionButton>
      ) : null}
      <p role="status" className="px-5 pb-5 text-xs text-emerald-600">
        {message}
      </p>
    </div>
  )
}
