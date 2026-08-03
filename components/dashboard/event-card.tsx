import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react"

import {
  ActionButton,
  ProgressBar,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import type { PortalEvent } from "@/data/dashboard-data"

export function EventCard({
  event,
  administrative = false,
}: {
  event: PortalEvent
  administrative?: boolean
}) {
  const filled = Math.round((event.registered / event.capacity) * 100)
  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_35px_rgba(15,23,42,0.06)] motion-reduce:transform-none dark:border-white/10 dark:bg-slate-950/60 dark:hover:border-blue-400/25">
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          <CalendarDays className="size-5" />
        </div>
        <StatusPill
          tone={
            event.status === "Completed"
              ? "slate"
              : event.registered === event.capacity
                ? "amber"
                : "blue"
          }
        >
          {event.status}
        </StatusPill>
      </div>
      <p className="mt-4 text-[10px] font-bold tracking-[0.15em] text-blue-600 uppercase dark:text-blue-300">
        {event.category} · {event.scope}
      </p>
      <h3 className="mt-1.5 min-h-12 text-base leading-6 font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
        {event.title}
      </h3>
      <div className="mt-3 grid gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <CalendarDays className="size-3.5" />
          {event.date} · {event.time}
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="size-3.5" />
          {event.venue}
        </span>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Users className="size-3" />
            {event.registered} registered
          </span>
          <span>{filled}% full</span>
        </div>
        <ProgressBar value={filled} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/8">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {administrative
            ? `${event.capacity - event.registered} seats left`
            : event.registration}
        </span>
        <ActionButton variant="quiet" className="-mr-2">
          {administrative ? "Manage" : "View event"}
          <ArrowUpRight className="size-3.5" />
        </ActionButton>
      </div>
    </article>
  )
}
