"use client"

import { useQuery } from "convex/react"
import { ArrowUpRight, CalendarDays, Grid2X2, MapPin } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"

const eventMonthFormatter = new Intl.DateTimeFormat("en-BD", {
  month: "short",
  timeZone: "Asia/Dhaka",
})
const eventDayFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  timeZone: "Asia/Dhaka",
})
const eventMonthYearFormatter = new Intl.DateTimeFormat("en-BD", {
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
})
const eventTimeFormatter = new Intl.DateTimeFormat("en-BD", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Dhaka",
})

type DirectoryEvent = Doc<"events"> & {
  phase: "upcoming" | "ongoing" | "past"
}

export function EventExplorer() {
  const [now] = useState(() => Date.now())
  const events = useQuery(api.events.listDirectory, { now })
  const [status, setStatus] = useState("upcoming")
  const [mode, setMode] = useState<"cards" | "calendar">("cards")
  const list = useMemo(
    () =>
      (events ?? []).filter(
        (event) => status === "all" || event.phase === status
      ),
    [events, status]
  )

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-[#2359d4]/15 bg-white p-4 shadow-[0_14px_40px_rgba(25,55,90,.07)] sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#09182a] dark:shadow-none">
        <Tabs value={status} onValueChange={setStatus} variant="pill">
          <TabsList className="flex-wrap bg-[#eef3f8] dark:bg-[#06101f]">
            {["upcoming", "ongoing", "past", "all"].map((item) => (
              <TabsTrigger
                key={item}
                value={item}
                className={cn(
                  "text-[#587084] capitalize dark:text-[#8296ad]",
                  status === item && "text-[#03101e]"
                )}
                indicatorClassName="bg-[#57e6e6]"
              >
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div
          className="flex border border-[#2359d4]/15 bg-[#eef3f8] p-1 dark:border-white/10 dark:bg-[#06101f]"
          aria-label="Event view"
        >
          {(["cards", "calendar"] as const).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setMode(item)}
              className={cn(
                "flex min-h-10 items-center gap-2 px-3 text-sm capitalize",
                mode === item
                  ? "bg-white text-[#07111f] shadow-sm dark:bg-white/10 dark:text-white"
                  : "text-[#587084] dark:text-[#8296ad]"
              )}
              aria-pressed={mode === item}
            >
              {item === "cards" ? (
                <Grid2X2 className="size-4" />
              ) : (
                <CalendarDays className="size-4" />
              )}
              {item}
            </button>
          ))}
        </div>
      </div>

      {events === undefined ? (
        <EventGridSkeleton />
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#2359d4]/25 p-12 text-center text-sm text-[#587084] dark:border-white/15 dark:text-[#8296ad]">
          No {status === "all" ? "" : status} events are available.
        </div>
      ) : mode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((event) => (
            <PublicEventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <CalendarMode list={list} />
      )}
    </div>
  )
}

function PublicEventCard({ event }: { event: DirectoryEvent }) {
  const fill = Math.min(
    100,
    Math.round((event.activeRegistrationCount / event.capacity) * 100)
  )
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex min-h-[24rem] flex-col rounded-xl border border-[#2359d4]/15 bg-white p-6 shadow-[0_12px_35px_rgba(25,55,90,.06)] transition hover:-translate-y-1 hover:border-[#00a6b2]/55 motion-reduce:transform-none dark:border-white/10 dark:bg-[#09182a] dark:shadow-none dark:hover:border-[#65f2f1]/45"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-17 place-items-center border border-[#2359d4]/25 bg-[#eef3f8] text-center dark:border-[#3d8bff]/35 dark:bg-[#0b2138]">
          <span>
            <span className="block font-mono text-[9px] tracking-[.18em] text-[#007d89] uppercase dark:text-[#65f2f1]">
              {eventMonthFormatter.format(event.startsAt)}
            </span>
            <span className="block text-3xl font-semibold">
              {eventDayFormatter.format(event.startsAt)}
            </span>
          </span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="border border-[#d97706]/25 px-3 py-1 font-mono text-[9px] tracking-[.14em] text-[#a95000] uppercase dark:border-white/10 dark:text-[#ffb84d]">
            {event.scope.replaceAll("_", " ")}
          </span>
          <span className="font-mono text-[9px] tracking-[.14em] text-[#587084] uppercase dark:text-[#8296ad]">
            {event.phase}
          </span>
        </div>
      </div>
      <p className="mt-7 font-mono text-[9px] tracking-[.14em] text-[#007d89] uppercase dark:text-[#65f2f1]">
        {event.category}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-.035em] group-hover:text-[#007d89] dark:group-hover:text-[#65f2f1]">
        {event.name}
      </h2>
      <p className="mt-4 flex items-center gap-2 text-sm text-[#587084] dark:text-[#8fa7c0]">
        <MapPin className="size-4 shrink-0" />
        {event.venue}
      </p>
      <div className="mt-auto pt-7">
        <div className="mb-2 flex justify-between font-mono text-[9px] tracking-[.14em] text-[#587084] uppercase dark:text-[#71869e]">
          <span>
            {event.activeRegistrationCount}/{event.capacity} registered
          </span>
          <span>{fill}%</span>
        </div>
        <div className="h-1 overflow-hidden bg-[#2359d4]/10 dark:bg-white/10">
          <span
            className="block h-full bg-[#57e6e6]"
            style={{ width: `${fill}%` }}
          />
        </div>
        <p className="mt-4 flex items-center justify-between text-sm text-[#425a70] dark:text-[#b9c8d9]">
          View event brief <ArrowUpRight className="size-4" />
        </p>
      </div>
    </Link>
  )
}

function CalendarMode({ list }: { list: DirectoryEvent[] }) {
  const grouped = new Map<string, DirectoryEvent[]>()
  for (const event of list) {
    const month = eventMonthYearFormatter.format(event.startsAt)
    grouped.set(month, [...(grouped.get(month) ?? []), event])
  }
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {[...grouped].map(([month, events]) => (
        <section
          key={month}
          className="overflow-hidden rounded-xl border border-[#2359d4]/15 bg-white dark:border-white/10 dark:bg-[#09182a]"
        >
          <h2 className="border-b border-[#2359d4]/15 px-5 py-4 text-sm font-semibold dark:border-white/10">
            {month}
          </h2>
          <div className="divide-y divide-[#2359d4]/10 dark:divide-white/8">
            {events.map((event) => (
              <Link
                key={event._id}
                href={`/events/${event.slug}`}
                className="flex min-h-16 items-center gap-4 px-5 py-3 hover:bg-[#2359d4]/5 dark:hover:bg-white/5"
              >
                <span className="w-8 text-center text-2xl font-semibold">
                  {eventDayFormatter.format(event.startsAt)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {event.name}
                  </span>
                  <span className="mt-1 block text-xs text-[#587084] dark:text-[#8296ad]">
                    {eventTimeFormatter.format(event.startsAt)} · {event.venue}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function EventGridSkeleton() {
  return (
    <div
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      aria-label="Loading events"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="min-h-96 animate-pulse rounded-xl bg-[#2359d4]/8 dark:bg-white/5"
        />
      ))}
    </div>
  )
}
