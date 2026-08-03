import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FolderKanban,
  Microscope,
  Orbit,
  UsersRound,
} from "lucide-react"

import { MembershipCard } from "@/components/dashboard/membership-card"
import {
  MetricCard,
  PageHeader,
  Panel,
  ProgressBar,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import {
  currentMember,
  events,
  memberStats,
  notifications,
} from "@/data/dashboard-data"

const metricIcons = [CalendarDays, FolderKanban, Clock3, Microscope]
const metricTones = ["blue", "cyan", "violet", "amber"] as const

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Member overview"
        title={`Good morning, ${currentMember.firstName}.`}
        description="Your membership is active. Here is what is moving across ASRRO this week."
        actions={
          <a
            href="/dashboard/events"
            className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm outline-none hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Explore events <ArrowRight className="size-3.5" />
          </a>
        }
      />

      <section className="relative overflow-hidden rounded-3xl bg-[#0a1b33] p-5 text-white sm:p-6 lg:p-7">
        <div
          aria-hidden
          className="absolute -top-48 -right-20 size-96 rounded-full border border-blue-400/20"
        />
        <div
          aria-hidden
          className="absolute -top-28 -right-5 size-64 rounded-full border border-cyan-300/15"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
          <div>
            <div className="mb-8 flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-cyan-200 uppercase">
              <Orbit className="size-4" /> Mission status · 03 Aug 2026
            </div>
            <h2 className="max-w-2xl text-2xl font-semibold tracking-[-0.04em] text-balance sm:text-3xl">
              Your next launch window opens in 9 days.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Bangladesh Rover Challenge team check-in begins 12 August at
              08:15. Your participant confirmation is ready.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <StatusPill tone="green">Membership active</StatusPill>
              <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-medium text-slate-300">
                UUID {currentMember.uuid}
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">Profile readiness</p>
              <span className="text-xs text-cyan-200 tabular-nums">
                {currentMember.completion}%
              </span>
            </div>
            <ProgressBar
              value={currentMember.completion}
              className="mt-3 bg-white/10 [&>div]:bg-cyan-300"
            />
            <p className="mt-3 text-[11px] leading-5 text-slate-400">
              Add a profile photo and research interests to help project leads
              find you.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {memberStats.map((stat, index) => (
          <MetricCard
            key={stat.label}
            {...stat}
            icon={metricIcons[index]}
            tone={metricTones[index]}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,.65fr)]">
        <Panel
          title="Upcoming events"
          description="Your registrations and events open to members"
          action={
            <a
              href="/dashboard/events"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View all
            </a>
          }
        >
          <div className="divide-y divide-slate-100 dark:divide-white/8">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[4rem_1fr_auto] sm:items-center"
              >
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-blue-600">
                  <span className="text-[9px] font-semibold tracking-wider text-cyan-300 uppercase">
                    {event.date.split(" ", 2)[1]}
                  </span>
                  <span className="text-lg leading-5 font-bold">
                    {event.date.split(" ", 1)[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </h3>
                    <StatusPill
                      tone={
                        event.registration === "Confirmed"
                          ? "green"
                          : event.registration === "Waitlisted"
                            ? "amber"
                            : "slate"
                      }
                    >
                      {event.registration}
                    </StatusPill>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {event.time} · {event.venue}
                  </p>
                </div>
                <a
                  href="/dashboard/events"
                  aria-label={`View ${event.title}`}
                  className="grid size-9 place-items-center rounded-xl text-slate-400 outline-none hover:bg-slate-100 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-white/8"
                >
                  <ArrowRight className="size-4" />
                </a>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <MembershipCard compact />
          <Panel
            title="Latest signals"
            action={
              <a
                href="/dashboard/notifications"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                All notifications
              </a>
            }
          >
            <div className="divide-y divide-slate-100 dark:divide-white/8">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex gap-3 px-5 py-3.5">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.unread ? "bg-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,.12)]" : "bg-slate-300 dark:bg-slate-700"}`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs leading-5 font-semibold text-slate-800 dark:text-slate-100">
                      {notification.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
              <UsersRound className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                Project teams are recruiting
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Astra Rover and CubeSat Ground Station need controls, embedded,
                and outreach contributors.
              </p>
            </div>
          </div>
          <a
            href="/dashboard/projects"
            className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            Browse projects
          </a>
        </div>
      </Panel>
    </div>
  )
}
