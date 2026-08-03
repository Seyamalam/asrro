"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu,
  Search,
  X,
  FolderKanban,
  CalendarDays,
  Newspaper,
  Users,
  FileText,
} from "lucide-react"
import { useMemo, useState } from "react"
import {
  CommandPalette,
  type CommandItem,
} from "@/components/motion/command-palette"
import { AsrroMark } from "@/components/shared/asrro-mark"
import { searchIndex } from "@/content/public-data"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/committee", label: "People" },
  { href: "/publications", label: "Research" },
  { href: "/news", label: "News" },
]
const icons = {
  Project: FolderKanban,
  Event: CalendarDays,
  News: Newspaper,
  Alumni: Users,
  Committee: Users,
  Publication: FileText,
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const commands = useMemo<CommandItem[]>(
    () =>
      searchIndex.map((item, index) => ({
        id: `${item.type}-${index}`,
        label: item.title,
        group: item.type,
        keywords: item.keywords,
        icon: icons[item.type as keyof typeof icons],
        onSelect: () => router.push(item.href),
      })),
    [router]
  )

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06101f]/90 text-[#eef8ff] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-[94rem] items-center gap-5 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="mr-auto flex items-center gap-3 rounded-sm focus-visible:ring-2 focus-visible:ring-[#57e6e6] focus-visible:outline-none"
          aria-label="ASRRO home"
        >
          <AsrroMark />
          <span>
            <span className="block text-sm font-bold tracking-[0.15em]">
              ASRRO
            </span>
            <span className="hidden font-mono text-[8px] tracking-[0.15em] text-[#8fa7c0] uppercase sm:block">
              CUET · Bangladesh
            </span>
          </span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm transition hover:text-[#57e6e6] focus-visible:ring-2 focus-visible:ring-[#57e6e6] focus-visible:outline-none",
                pathname.startsWith(item.href)
                  ? "bg-white/8 text-white"
                  : "text-[#aebed0]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-3 text-[#b9c8d9] transition hover:border-[#57e6e6]/50 hover:text-white focus-visible:ring-2 focus-visible:ring-[#57e6e6] focus-visible:outline-none"
          aria-label="Open site search"
        >
          <Search className="size-4" />
          <span className="hidden text-xs xl:block">Search</span>
          <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] xl:block">
            ⌘K
          </kbd>
        </button>
        <Link
          href="/membership"
          className="hidden min-h-11 items-center rounded-full bg-[#57e6e6] px-4 text-sm font-semibold text-[#03101e] hover:bg-[#81f0ef] sm:flex"
        >
          Join ASRRO
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border border-white/15 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {menuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-white/10 px-5 py-5 lg:hidden"
        >
          <div className="grid gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-lg text-[#dbe9f5] hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/gallery"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-lg text-[#dbe9f5]"
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-lg text-[#dbe9f5]"
            >
              Contact
            </Link>
            <Link
              href="/membership"
              onClick={() => setMenuOpen(false)}
              className="mt-3 rounded-full bg-[#57e6e6] px-4 py-3 text-center font-semibold text-[#03101e]"
            >
              Join ASRRO
            </Link>
          </div>
        </nav>
      ) : null}
      <CommandPalette
        items={commands}
        open={searchOpen}
        onOpenChange={setSearchOpen}
        placeholder="Search projects, events, people, and research…"
        emptyMessage="No mission record matches that search."
      />
    </header>
  )
}
