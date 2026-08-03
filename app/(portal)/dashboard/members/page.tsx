import {
  CheckCircle2,
  Clock3,
  Download,
  UserPlus,
  UsersRound,
} from "lucide-react"

import {
  ActionButton,
  MetricCard,
  PageHeader,
  Panel,
} from "@/components/dashboard/dashboard-kit"
import { MembersTable } from "@/components/dashboard/members-table"

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Executive operations"
        title="Member management"
        description="Review applications, manage the member lifecycle, and communicate with cohorts."
        actions={
          <>
            <ActionButton variant="secondary">
              <Download className="size-3.5" />
              Export
            </ActionButton>
            <ActionButton>
              <UserPlus className="size-3.5" />
              Add member
            </ActionButton>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active members"
          value={1248}
          detail="+84 this academic year"
          icon={UsersRound}
          tone="blue"
        />
        <MetricCard
          label="Pending review"
          value={26}
          detail="5 need payment verification"
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          label="Approved this month"
          value={61}
          detail="92% approval rate"
          icon={CheckCircle2}
          tone="emerald"
        />
        <MetricCard
          label="New applications"
          value={118}
          detail="Last 30 days"
          icon={UserPlus}
          tone="violet"
        />
      </div>
      <Panel
        title="Applications awaiting action"
        description="Verify academic details and payment evidence before assigning a permanent UUID."
      >
        <MembersTable />
      </Panel>
    </div>
  )
}
