"use client"

import {
  Bell,
  BookOpenText,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  CreditCard,
  FileBarChart,
  FolderKanban,
  Gauge,
  Menu,
  Moon,
  PanelLeftClose,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useMemo, useState, type ReactNode } from "react"

import {
  AnimatedSidebar,
  AnimatedSidebarClose,
  AnimatedSidebarContent,
  AnimatedSidebarFooter,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarHeader,
  AnimatedSidebarInset,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarProvider,
  AnimatedSidebarRail,
  AnimatedSidebarTrigger,
  useAnimatedSidebar,
} from "@/components/motion/animated-sidebar"
import {
  CommandPalette,
  type CommandItem,
} from "@/components/motion/command-palette"
import { currentMember, type PortalRole } from "@/data/dashboard-data"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  minimumRole: PortalRole
  badge?: string
  keywords?: string[]
}

const memberNav: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: Gauge,
    minimumRole: "member",
    keywords: ["home", "summary"],
  },
  {
    label: "My profile",
    href: "/dashboard/profile",
    icon: UserRound,
    minimumRole: "member",
    keywords: ["personal", "account"],
  },
  {
    label: "Membership card",
    href: "/dashboard/membership",
    icon: CreditCard,
    minimumRole: "member",
    keywords: ["uuid", "download", "qr"],
  },
  {
    label: "Events",
    href: "/dashboard/events",
    icon: CalendarDays,
    minimumRole: "member",
    keywords: ["register", "attended", "upcoming"],
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    minimumRole: "member",
    badge: "2",
    keywords: ["updates", "announcements"],
  },
]

const executiveNav: NavItem[] = [
  {
    label: "Members",
    href: "/dashboard/members",
    icon: UsersRound,
    minimumRole: "executive",
    badge: "5",
    keywords: ["approval", "applications", "bulk"],
  },
  {
    label: "Event operations",
    href: "/dashboard/event-management",
    icon: ClipboardCheck,
    minimumRole: "executive",
    keywords: ["registration", "attendance", "manage"],
  },
  {
    label: "Committee",
    href: "/dashboard/committee",
    icon: ShieldCheck,
    minimumRole: "executive",
    keywords: ["executive", "positions", "session"],
  },
  {
    label: "Finance",
    href: "/dashboard/finance",
    icon: ChartNoAxesCombined,
    minimumRole: "executive",
    keywords: ["income", "expense", "budget"],
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
    minimumRole: "executive",
    keywords: ["portfolio", "inventory"],
  },
  {
    label: "Content",
    href: "/dashboard/content",
    icon: BookOpenText,
    minimumRole: "executive",
    keywords: ["blog", "gallery", "publications"],
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart,
    minimumRole: "executive",
    keywords: ["export", "pdf", "csv", "excel"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    minimumRole: "admin",
    keywords: ["website", "theme", "email"],
  },
]

const roleRank: Record<PortalRole, number> = {
  member: 0,
  executive: 1,
  admin: 2,
}

function isActivePath(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href)
}

function ShellTopbar({ onSearch }: { onSearch: () => void }) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const active = [...memberNav, ...executiveNav].find((item) =>
    isActivePath(pathname, item.href)
  )

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-white/8 dark:bg-[#07101e]/85">
      <AnimatedSidebarTrigger className="-ml-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:hover:bg-white/8 dark:hover:text-white">
        <Menu className="size-5" />
      </AnimatedSidebarTrigger>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
          {active?.label ?? "ASRRO portal"}
        </p>
        <p className="hidden text-[10px] tracking-[0.16em] text-slate-400 uppercase sm:block">
          Mission operations · CUET
        </p>
      </div>
      <button
        type="button"
        onClick={onSearch}
        className="hidden h-9 w-full max-w-[18rem] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-left text-xs text-slate-400 transition outline-none hover:border-slate-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 sm:flex dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
      >
        <Search className="size-3.5" />
        <span className="flex-1">Search portal</span>
        <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[9px] dark:border-white/10 dark:bg-white/5">
          ⌘K
        </kbd>
      </button>
      <button
        type="button"
        aria-label="Search portal"
        onClick={onSearch}
        className="grid size-9 place-items-center rounded-xl text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 sm:hidden dark:hover:bg-white/8"
      >
        <Search className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Toggle color theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="grid size-9 place-items-center rounded-xl text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-white/8"
      >
        <Sun className="hidden size-4 dark:block" />
        <Moon className="size-4 dark:hidden" />
      </button>
      <a
        href="/dashboard/notifications"
        aria-label="Notifications, 2 unread"
        className="relative grid size-9 place-items-center rounded-xl text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-white/8"
      >
        <Bell className="size-4" />
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#07101e]" />
      </a>
      <a
        href="/dashboard/profile"
        className="grid size-9 place-items-center rounded-xl bg-slate-950 text-[11px] font-bold text-white ring-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-600"
      >
        {currentMember.initials}
      </a>
    </header>
  )
}

function SidebarBrand() {
  const { state } = useAnimatedSidebar()
  const collapsed = state === "collapsed"
  return (
    <div className="flex h-12 items-center gap-3 overflow-hidden">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-white/95 dark:ring-white/10">
        <Image
          src="/asrro-logo.png"
          alt="ASRRO"
          width={34}
          height={34}
          className="size-8 object-contain"
          priority
        />
      </div>
      <div
        className={cn(
          "min-w-0 transition-opacity",
          collapsed && "pointer-events-none opacity-0"
        )}
        aria-hidden={collapsed}
      >
        <p className="truncate text-sm font-bold tracking-[-0.02em] text-white">
          ASRRO
        </p>
        <p className="truncate text-[9px] tracking-[0.15em] text-slate-400 uppercase">
          Mission portal
        </p>
      </div>
    </div>
  )
}

function SidebarNav({ role }: { role: PortalRole }) {
  const pathname = usePathname()
  const renderItems = (items: NavItem[]) =>
    items
      .filter((item) => roleRank[role] >= roleRank[item.minimumRole])
      .map((item) => (
        <AnimatedSidebarMenuItem key={item.href}>
          <AnimatedSidebarMenuButton
            href={item.href}
            icon={<item.icon className="size-[18px]" />}
            badge={
              item.badge ? (
                <span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold text-blue-300">
                  {item.badge}
                </span>
              ) : undefined
            }
            isActive={isActivePath(pathname, item.href)}
            className="text-slate-400 hover:text-white focus-visible:bg-white/8 focus-visible:ring-blue-400 data-[active=true]:text-white"
          >
            {item.label}
          </AnimatedSidebarMenuButton>
        </AnimatedSidebarMenuItem>
      ))

  return (
    <>
      <AnimatedSidebarGroup>
        <AnimatedSidebarGroupLabel className="text-slate-500">
          Member space
        </AnimatedSidebarGroupLabel>
        <AnimatedSidebarGroupContent>
          <AnimatedSidebarMenu>{renderItems(memberNav)}</AnimatedSidebarMenu>
        </AnimatedSidebarGroupContent>
      </AnimatedSidebarGroup>
      {roleRank[role] >= roleRank.executive ? (
        <AnimatedSidebarGroup>
          <AnimatedSidebarGroupLabel className="text-slate-500">
            Operations
          </AnimatedSidebarGroupLabel>
          <AnimatedSidebarGroupContent>
            <AnimatedSidebarMenu>
              {renderItems(executiveNav)}
            </AnimatedSidebarMenu>
          </AnimatedSidebarGroupContent>
        </AnimatedSidebarGroup>
      ) : null}
    </>
  )
}

function RoleSwitcher({
  role,
  onRoleChange,
}: {
  role: PortalRole
  onRoleChange: (role: PortalRole) => void
}) {
  const { state } = useAnimatedSidebar()
  const collapsed = state === "collapsed"
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-500 text-[10px] font-bold text-white">
        SR
      </div>
      <div
        className={cn(
          "min-w-0 flex-1 transition-opacity",
          collapsed && "pointer-events-none opacity-0"
        )}
        aria-hidden={collapsed}
      >
        <p className="truncate text-xs font-semibold text-white">
          {currentMember.name}
        </p>
        <label className="sr-only" htmlFor="portal-role">
          Preview portal role
        </label>
        <select
          id="portal-role"
          value={role}
          onChange={(event) => onRoleChange(event.target.value as PortalRole)}
          className="mt-0.5 w-full appearance-none bg-transparent text-[10px] text-slate-400 outline-none focus:text-white"
        >
          <option value="member" className="text-slate-950">
            General member
          </option>
          <option value="executive" className="text-slate-950">
            Executive
          </option>
          <option value="admin" className="text-slate-950">
            Super admin
          </option>
        </select>
      </div>
    </div>
  )
}

export function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [role, setRole] = useState<PortalRole>(currentMember.access)
  const [searchOpen, setSearchOpen] = useState(false)
  const visibleNav = useMemo(
    () =>
      [...memberNav, ...executiveNav].filter(
        (item) => roleRank[role] >= roleRank[item.minimumRole]
      ),
    [role]
  )
  const commandItems = useMemo<CommandItem[]>(
    () =>
      visibleNav.map((item) => ({
        id: item.href,
        label: item.label,
        group: item.minimumRole === "member" ? "Member space" : "Operations",
        keywords: item.keywords,
        icon: item.icon,
        hint: item.badge ? `${item.badge} new` : undefined,
        onSelect: () => router.push(item.href),
      })),
    [router, visibleNav]
  )

  const updateRole = (nextRole: PortalRole) => {
    setRole(nextRole)
    localStorage.setItem("asrro-portal-role", nextRole)
  }

  return (
    <AnimatedSidebarProvider
      className="dashboard-theme bg-[#f5f7fb] text-slate-950 dark:bg-[#07101e] dark:text-slate-100"
      style={{
        "--sidebar-width": "16.75rem",
        "--sidebar-width-icon": "4.75rem",
        "--sidebar-width-mobile": "18.5rem",
      }}
    >
      <AnimatedSidebar
        ariaLabel="Portal navigation"
        panelClassName="border-slate-800 bg-[#091526] text-white"
        className="z-40"
      >
        <AnimatedSidebarHeader className="border-b border-white/8 px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <SidebarBrand />
            <AnimatedSidebarClose className="text-slate-400 hover:bg-white/8 hover:text-white md:hidden">
              <X className="size-4" />
            </AnimatedSidebarClose>
          </div>
        </AnimatedSidebarHeader>
        <AnimatedSidebarContent className="[scrollbar-color:rgba(148,163,184,.25)_transparent] px-2 py-3">
          <SidebarNav role={role} />
        </AnimatedSidebarContent>
        <AnimatedSidebarFooter className="border-white/8 p-3">
          <RoleSwitcher role={role} onRoleChange={updateRole} />
        </AnimatedSidebarFooter>
        <AnimatedSidebarRail className="hover:after:bg-blue-400/40" />
      </AnimatedSidebar>
      <AnimatedSidebarInset className="bg-[#f5f7fb] dark:bg-[#07101e]">
        <ShellTopbar onSearch={() => setSearchOpen(true)} />
        <div className="relative flex-1">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-48 overflow-hidden"
          >
            <div className="absolute -top-36 -right-16 size-80 rounded-full border border-blue-200/50 dark:border-blue-500/10" />
            <div className="absolute -top-24 -right-4 size-52 rounded-full border border-cyan-200/60 dark:border-cyan-500/10" />
          </div>
          <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </div>
        <button
          type="button"
          aria-label="Collapse sidebar"
          title="Collapse sidebar (Ctrl+B)"
          className="fixed bottom-5 left-3 z-30 hidden size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm outline-none hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-500 md:grid dark:border-white/10 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
          onClick={() =>
            dispatchEvent(
              new KeyboardEvent("keydown", { key: "b", ctrlKey: true })
            )
          }
        >
          <PanelLeftClose className="size-4" />
        </button>
      </AnimatedSidebarInset>
      <CommandPalette
        items={commandItems}
        open={searchOpen}
        onOpenChange={setSearchOpen}
        placeholder="Search members, events, projects, and tools…"
        emptyMessage="No portal destination matches that search."
      />
    </AnimatedSidebarProvider>
  )
}
