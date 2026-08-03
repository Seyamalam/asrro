import { PageHeader, Panel } from "@/components/dashboard/dashboard-kit"
import { MembersTable } from "@/components/dashboard/members-table"
import { RoleManager } from "@/components/dashboard/role-manager"
import { requirePortalRole } from "@/lib/admin-auth"

export default async function MembersPage() {
  await requirePortalRole("super_admin")
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Membership operations"
        title="Members and applications"
        description="Review pending membership applications and assign portal roles to active members."
      />
      <Panel title="Pending applications">
        <MembersTable />
      </Panel>
      <Panel title="Active members">
        <RoleManager />
      </Panel>
    </div>
  )
}
