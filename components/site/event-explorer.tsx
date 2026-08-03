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
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-[#2359d4]/15 bg-white p-4 shadow-[0_14px_40px_rgba(25,55,90,.07)] sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#09182a] dark:shadow-none">
        <Tabs value={status} onValueChange={setStatus} variant="pill">
          <TabsList className="flex-wrap bg-[#eef3f8] dark:bg-[#06101f]">
            {["Upcoming", "Ongoing", "Past", "All"].map((item) => (
              <TabsTrigger
                key={item}
                value={item}
                className={cn(
                  "text-[#587084] dark:text-[#8296ad]",
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
          <button
            onClick={() => setMode("cards")}
            className={cn(
              "flex min-h-10 items-center gap-2 px-3 text-sm",
              mode === "cards"
                ? "bg-white text-[#07111f] shadow-sm dark:bg-white/10 dark:text-white"
                : "text-[#587084] dark:text-[#8296ad]"
            )}
            aria-pressed={mode === "cards"}
          >
            <Grid2X2 className="size-4" />
            Cards
          </button>
          <button
            onClick={() => setMode("calendar")}
            className={cn(
              "flex min-h-10 items-center gap-2 px-3 text-sm",
              mode === "calendar"
                ? "bg-white text-[#07111f] shadow-sm dark:bg-white/10 dark:text-white"
                : "text-[#587084] dark:text-[#8296ad]"
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
      className="group flex min-h-[24rem] flex-col rounded-xl border border-[#2359d4]/15 bg-white p-6 shadow-[0_12px_35px_rgba(25,55,90,.06)] transition hover:-translate-y-1 hover:border-[#00a6b2]/55 motion-reduce:transform-none dark:border-white/10 dark:bg-[#09182a] dark:shadow-none dark:hover:border-[#65f2f1]/45"
    >
      <div className="flex items-start justify-between">
        <div className="grid size-17 place-items-center border border-[#2359d4]/25 bg-[#eef3f8] text-center dark:border-[#3d8bff]/35 dark:bg-[#0b2138]">
          <span>
            <span className="block font-mono text-[9px] tracking-[.18em] text-[#007d89] dark:text-[#65f2f1]">
              {event.month}
            </span>
            <span className="block text-3xl font-semibold">{event.day}</span>
          </span>
        </div>
        <span className="border border-[#d97706]/25 px-3 py-1 font-mono text-[9px] tracking-[.14em] text-[#a95000] uppercase dark:border-white/10 dark:text-[#ffb84d]">
          {event.scope}
        </span>
      </div>
      <h2 className="mt-8 text-2xl font-semibold tracking-[-.035em] group-hover:text-[#007d89] dark:group-hover:text-[#65f2f1]">
        {event.title}
      </h2>
      <p className="mt-4 flex items-center gap-2 text-sm text-[#587084] dark:text-[#8fa7c0]">
        <MapPin className="size-4 shrink-0" />
        {event.venue}
      </p>
      <div className="mt-auto pt-7">
        <div className="mb-2 flex justify-between font-mono text-[9px] tracking-[.14em] text-[#587084] uppercase dark:text-[#71869e]">
          <span>
            {event.registered}/{event.capacity} registered
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
function CalendarMode({ list }: { list: typeof events }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#2359d4]/15 dark:border-white/10">
      <div className="grid grid-cols-7 border-b border-[#2359d4]/15 bg-white text-center font-mono text-[9px] tracking-[.16em] text-[#587084] uppercase dark:border-white/10 dark:bg-[#09182a] dark:text-[#71869e]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d} className="py-3">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-[#2359d4]/15 dark:bg-white/10">
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 5
          const dayEvents = list.filter((e) => Number(e.day) === day)
          return (
            <div
              key={i}
              className="min-h-24 bg-[#f7f9fc] p-2 dark:bg-[#071322]"
            >
              <span
                className={cn(
                  "text-xs",
                  day < 1 || day > 31
                    ? "text-transparent"
                    : "text-[#587084] dark:text-[#71869e]"
                )}
              >
                {day}
              </span>
              {dayEvents.map((e) => (
                <Link
                  key={e.slug}
                  href={`/events/${e.slug}`}
                  className="mt-2 block bg-[#2359d4]/10 p-1.5 text-[10px] leading-tight text-[#17439d] hover:bg-[#2359d4]/20 dark:bg-[#3d8bff]/15 dark:text-[#bdeff2] dark:hover:bg-[#3d8bff]/25"
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
