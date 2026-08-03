import {
  CalendarClock,
  Download,
  Plus,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react"

import {
  ActionButton,
  MetricCard,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import { committee } from "@/data/dashboard-data"

export default function CommitteePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governance"
        title="Executive committee"
        description="Maintain the current leadership roster, positions, and committee session history."
        actions={
          <>
            <ActionButton variant="secondary">
              <Download className="size-3.5" />
              Export PDF
            </ActionButton>
            <ActionButton>
              <Plus className="size-3.5" />
              Assign position
            </ActionButton>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Committee members"
          value={18}
          detail="2025–26 executive session"
          icon={UsersRound}
          tone="blue"
        />
        <MetricCard
          label="Leadership roles"
          value={10}
          detail="All critical positions filled"
          icon={ShieldCheck}
          tone="emerald"
        />
        <MetricCard
          label="Term remaining"
          value={5}
          suffix=" mo"
          detail="Handover begins January 2027"
          icon={CalendarClock}
          tone="violet"
        />
      </div>
      <Panel
        title="Current committee · 2025–26"
        description="Position order follows the organization’s governance structure."
      >
        <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-3 dark:bg-white/8">
          {committee.map((member) => (
            <article
              key={member.name}
              className="group bg-white p-5 dark:bg-slate-950"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#0a1b33] text-xs font-bold text-white">
                  {member.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {member.name}
                      </h2>
                      <p className="mt-1 text-[11px] font-medium text-blue-600 dark:text-blue-300">
                        {member.position}
                      </p>
                    </div>
                    <StatusPill
                      tone={member.status === "Active" ? "green" : "amber"}
                    >
                      {member.status}
                    </StatusPill>
                  </div>
                  <p className="mt-3 text-[10px] tracking-wider text-slate-400 uppercase">
                    {member.department} · Session {member.session}
                  </p>
                </div>
              </div>
              <button className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600">
                <UserCog className="size-3.5" />
                Manage assignment
              </button>
            </article>
          ))}
        </div>
      </Panel>
      <Panel className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              Committee archive
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Preserved rosters are available for 2018–19 through 2024–25.
            </p>
          </div>
          <ActionButton variant="secondary">
            Browse previous sessions
          </ActionButton>
        </div>
      </Panel>
    </div>
  )
}
