import type { ReactNode } from "react"
import type { Metadata } from "next"
import { SiteChrome } from "@/components/site/site-chrome"

export const metadata: Metadata = {
  title: { template: "%s · ASRRO", default: "ASRRO" },
  description:
    "Space, robotics, AI, and frontier engineering at CUET, Bangladesh.",
}
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
