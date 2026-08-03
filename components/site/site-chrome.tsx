import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh overflow-x-clip bg-[#06101f] text-[#eef8ff] selection:bg-[#57e6e6] selection:text-[#03101e]">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-[200] -translate-y-20 rounded-full bg-[#57e6e6] px-4 py-2 text-sm font-semibold text-[#03101e] focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  )
}
