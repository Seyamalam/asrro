"use client"

import { Check, Mail, Search, SlidersHorizontal, X } from "lucide-react"
import { useMemo, useState } from "react"

import { ActionButton, StatusPill } from "@/components/dashboard/dashboard-kit"
import { Checkbox } from "@/components/motion/checkbox"
import { Input } from "@/components/motion/input"
import { memberApplications } from "@/data/dashboard-data"

export function MembersTable() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const filtered = useMemo(
    () =>
      memberApplications.filter((application) =>
        `${application.name} ${application.department} ${application.id}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  )
  const allSelected =
    filtered.length > 0 &&
    filtered.every((application) => selected.includes(application.id))
  const toggleAll = (checked: boolean) =>
    setSelected(checked ? filtered.map((application) => application.id) : [])
  const toggleOne = (id: string, checked: boolean) =>
    setSelected((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id)
    )

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center dark:border-white/8">
        <Input
          value={query}
          onChange={setQuery}
          placeholder="Search applications…"
          leftIcon={<Search />}
          className="w-full sm:max-w-xs"
          classNames={{
            field: "h-9 rounded-xl bg-slate-50 dark:bg-white/5",
            input: "text-sm",
          }}
        />
        <ActionButton variant="secondary">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </ActionButton>
        {selected.length ? (
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <span className="self-center text-[11px] font-semibold text-slate-500">
              {selected.length} selected
            </span>
            <ActionButton variant="secondary">
              <Mail className="size-3.5" />
              Email
            </ActionButton>
            <ActionButton>
              <Check className="size-3.5" />
              Approve
            </ActionButton>
          </div>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase dark:border-white/8">
              <th className="w-12 px-5 py-3">
                <Checkbox
                  checked={allSelected}
                  indeterminate={selected.length > 0 && !allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all applications"
                />
              </th>
              <th className="py-3 pr-4">Applicant</th>
              <th className="py-3 pr-4">Academic</th>
              <th className="py-3 pr-4">Payment</th>
              <th className="py-3 pr-4">Submitted</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-5 text-right">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/8">
            {filtered.map((application) => (
              <tr
                key={application.id}
                className="hover:bg-slate-50/60 dark:hover:bg-white/[0.025]"
              >
                <td className="px-5 py-4">
                  <Checkbox
                    checked={selected.includes(application.id)}
                    onCheckedChange={(checked) =>
                      toggleOne(application.id, checked)
                    }
                    aria-label={`Select ${application.name}`}
                  />
                </td>
                <td className="py-4 pr-4">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {application.name}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {application.id}
                  </p>
                </td>
                <td className="py-4 pr-4 text-xs text-slate-600 dark:text-slate-300">
                  {application.department} · {application.batch}
                </td>
                <td className="py-4 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {application.paid}
                </td>
                <td className="py-4 pr-4 text-xs text-slate-500">
                  {application.submitted}
                </td>
                <td className="py-4 pr-4">
                  <StatusPill
                    tone={application.status === "Pending" ? "amber" : "blue"}
                  >
                    {application.status}
                  </StatusPill>
                </td>
                <td className="py-4 pr-5">
                  <div className="flex justify-end gap-1">
                    <ActionButton
                      variant="quiet"
                      aria-label={`Reject ${application.name}`}
                    >
                      <X className="size-3.5 text-rose-600" />
                    </ActionButton>
                    <ActionButton
                      variant="quiet"
                      aria-label={`Approve ${application.name}`}
                    >
                      <Check className="size-3.5 text-emerald-600" />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden dark:divide-white/8">
        {filtered.map((application) => (
          <article key={application.id} className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selected.includes(application.id)}
                onCheckedChange={(checked) =>
                  toggleOne(application.id, checked)
                }
                aria-label={`Select ${application.name}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {application.name}
                    </h3>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {application.id} · {application.submitted}
                    </p>
                  </div>
                  <StatusPill
                    tone={application.status === "Pending" ? "amber" : "blue"}
                  >
                    {application.status}
                  </StatusPill>
                </div>
                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-slate-500">
                    {application.department} · {application.batch}
                  </span>
                  <span className="font-semibold">{application.paid}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <ActionButton variant="danger">
                    <X className="size-3.5" />
                    Reject
                  </ActionButton>
                  <ActionButton>
                    <Check className="size-3.5" />
                    Approve
                  </ActionButton>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
