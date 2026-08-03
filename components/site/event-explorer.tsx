"use client"
import Link from "next/link"
import { useMemo, useState } from "react"
import { CalendarDays, Grid2X2, MapPin, ArrowUpRight } from "lucide-react"
import { events } from "@/content/public-data"
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs"
import { cn } from "@/lib/utils"

export function EventExplorer() {
  const [status, setStatus] = useState("Upcoming")
  const [mode, setMode] = useState<"cards" | "calendar">("cards")
  const list = useMemo(
    () => events.filter((event) => status === "All" || event.status === status),
    [status]
  )
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#09182a] p-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={status} onValueChange={setStatus} variant="pill">
          <TabsList className="flex-wrap bg-[#06101f]">
            {["Upcoming", "Ongoing", "Past", "All"].map((item) => (
              <TabsTrigger
                key={item}
                value={item}
                className={cn(
                  "text-[#8296ad]",
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
          className="flex rounded-full border border-white/10 bg-[#06101f] p-1"
          aria-label="Event view"
        >
          <button
            onClick={() => setMode("cards")}
            className={cn(
              "flex min-h-10 items-center gap-2 rounded-full px-3 text-sm",
              mode === "cards" ? "bg-white/10 text-white" : "text-[#8296ad]"
            )}
            aria-pressed={mode === "cards"}
          >
            <Grid2X2 className="size-4" />
            Cards
          </button>
          <button
            onClick={() => setMode("calendar")}
            className={cn(
              "flex min-h-10 items-center gap-2 rounded-full px-3 text-sm",
              mode === "calendar" ? "bg-white/10 text-white" : "text-[#8296ad]"
            )}
            aria-pressed={mode === "calendar"}
          >
            <CalendarDays className="size-4" />
            Calendar
          </button>
        </div>
      </div>
      {mode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      ) : (
        <CalendarMode list={list} />
      )}
    </div>
  )
}
function EventCard({ event }: { event: (typeof events)[number] }) {
  const fill = Math.round((event.registered / event.capacity) * 100)
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex min-h-[24rem] flex-col rounded-2xl border border-white/10 bg-[#09182a] p-6 hover:border-[#57e6e6]/45"
    >
      <div className="flex items-start justify-between">
        <div className="grid size-17 place-items-center rounded-xl border border-[#3d8bff]/35 bg-[#0b2138] text-center">
          <span>
            <span className="block font-mono text-[9px] tracking-[.18em] text-[#57e6e6]">
              {event.month}
            </span>
            <span className="block text-3xl font-semibold">{event.day}</span>
          </span>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[9px] tracking-[.14em] text-[#ffb84d] uppercase">
          {event.scope}
        </span>
      </div>
      <h2 className="mt-8 text-2xl font-semibold tracking-[-.035em] group-hover:text-[#57e6e6]">
        {event.title}
      </h2>
      <p className="mt-4 flex items-center gap-2 text-sm text-[#8fa7c0]">
        <MapPin className="size-4 shrink-0" />
        {event.venue}
      </p>
      <div className="mt-auto pt-7">
        <div className="mb-2 flex justify-between font-mono text-[9px] tracking-[.14em] text-[#71869e] uppercase">
          <span>
            {event.registered}/{event.capacity} registered
          </span>
          <span>{fill}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <span
            className="block h-full bg-[#57e6e6]"
            style={{ width: `${fill}%` }}
          />
        </div>
        <p className="mt-4 flex items-center justify-between text-sm text-[#b9c8d9]">
          View event brief <ArrowUpRight className="size-4" />
        </p>
      </div>
    </Link>
  )
}
function CalendarMode({ list }: { list: typeof events }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="grid grid-cols-7 border-b border-white/10 bg-[#09182a] text-center font-mono text-[9px] tracking-[.16em] text-[#71869e] uppercase">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d} className="py-3">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-white/10">
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 5
          const dayEvents = list.filter((e) => Number(e.day) === day)
          return (
            <div key={i} className="min-h-24 bg-[#071322] p-2">
              <span
                className={cn(
                  "text-xs",
                  day < 1 || day > 31 ? "text-transparent" : "text-[#71869e]"
                )}
              >
                {day}
              </span>
              {dayEvents.map((e) => (
                <Link
                  key={e.slug}
                  href={`/events/${e.slug}`}
                  className="mt-2 block rounded bg-[#3d8bff]/15 p-1.5 text-[10px] leading-tight text-[#bdeff2] hover:bg-[#3d8bff]/25"
                >
                  {e.title}
                </Link>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
