import type { Metadata } from "next"
import type { ReactNode } from "react"

import { PortalShell } from "@/components/dashboard/portal-shell"

export const metadata: Metadata = {
  title: {
    default: "Mission Portal | ASRRO",
    template: "%s | ASRRO Portal",
  },
  description: "Member and executive operations portal for ASRRO.",
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>
}
