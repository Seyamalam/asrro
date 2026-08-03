import {
  BadgeCheck,
  GraduationCap,
  HeartPulse,
  IdCard,
  UserRound,
} from "lucide-react"

import {
  PageHeader,
  Panel,
  ProgressBar,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import { ProfileEditor } from "@/components/dashboard/profile-editor"
import { currentMember } from "@/data/dashboard-data"

const identity = [
  { label: "ASRRO UUID", value: currentMember.uuid, icon: IdCard },
  { label: "Student ID", value: currentMember.studentId, icon: GraduationCap },
  { label: "Department", value: currentMember.department, icon: UserRound },
  { label: "Blood group", value: currentMember.bloodGroup, icon: HeartPulse },
]

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Member record"
        title="My profile"
        description="Keep your contact details current. Verified academic fields are managed by the membership team."
      />
      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <Panel className="p-5">
          <div className="grid size-20 place-items-center rounded-2xl bg-[#0a1b33] text-xl font-bold text-white">
            {currentMember.initials}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {currentMember.name}
            </h2>
            <BadgeCheck className="size-4 text-blue-600" />
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {currentMember.role} · {currentMember.session}
          </p>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-[11px]">
              <span className="text-slate-500">Profile readiness</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentMember.completion}%
              </span>
            </div>
            <ProgressBar value={currentMember.completion} />
          </div>
          <div className="mt-5 border-t border-slate-100 pt-5 dark:border-white/8">
            <StatusPill tone="green">Verified active member</StatusPill>
            <p className="mt-3 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Joined {currentMember.joined}. Membership remains valid through{" "}
              {currentMember.validUntil}.
            </p>
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel
            title="Verified identity"
            description="Contact the membership secretary to correct these records."
          >
            <div className="grid gap-px bg-slate-100 sm:grid-cols-2 dark:bg-white/8">
              {identity.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex gap-3 bg-white p-5 dark:bg-slate-950"
                >
                  <Icon className="size-4 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-[10px] tracking-wider text-slate-400 uppercase">
                      {label}
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel
            title="Editable information"
            description="These changes appear in internal member and project directories."
          >
            <ProfileEditor />
          </Panel>
        </div>
      </div>
    </div>
  )
}
