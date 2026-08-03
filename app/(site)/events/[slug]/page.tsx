import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CircleDollarSign,
  CheckCircle2,
} from "lucide-react"
import { events } from "@/content/public-data"

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = events.find((e) => e.slug === slug)
  return { title: event?.title ?? "Event", description: event?.description }
}
export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = events.find((e) => e.slug === slug)
  if (!event) notFound()
  const fill = Math.round((event.registered / event.capacity) * 100)
  return (
    <>
      <section className="px-5 pt-10 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-[88rem]">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-[#587084] transition hover:text-[#07111f] dark:text-[#8fa7c0] dark:hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to events
          </Link>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#00a6b2]/30 px-3 py-1 font-mono text-[9px] tracking-[.16em] text-[#007d89] uppercase dark:border-[#65f2f1]/25 dark:text-[#65f2f1]">
                  {event.category}
                </span>
                <span className="rounded-full border border-[#d97706]/30 px-3 py-1 font-mono text-[9px] tracking-[.16em] text-[#b85f00] uppercase dark:border-[#ffb84d]/25 dark:text-[#ffb84d]">
                  {event.scope}
                </span>
              </div>
              <h1 className="max-w-5xl text-5xl leading-[.94] font-semibold tracking-[-.055em] sm:text-7xl">
                {event.title}
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-8 text-[#425a70] dark:text-[#b9c8d9]">
                {event.description}
              </p>
            </div>
            <div className="rounded-2xl border border-[#2359d4]/25 bg-[#eef3ff] p-6 shadow-[0_16px_45px_rgba(35,89,212,.08)] dark:border-[#3d8bff]/35 dark:bg-[#0b1d31] dark:shadow-none">
              <p className="font-mono text-[9px] tracking-[.17em] text-[#587084] uppercase dark:text-[#71869e]">
                Registration status
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {event.status === "Past"
                  ? "Event complete"
                  : event.status === "Ongoing"
                    ? "Now in progress"
                    : "Registration open"}
              </p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#2359d4]/10 dark:bg-white/10">
                <span
                  className="block h-full bg-[#00a6b2] dark:bg-[#65f2f1]"
                  style={{ width: `${fill}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#587084] dark:text-[#8296ad]">
                {event.registered} of {event.capacity} places claimed
              </p>
              <button
                disabled={event.status === "Past"}
                className="mt-6 min-h-11 w-full rounded-full bg-[#00a6b2] px-5 font-semibold text-white transition hover:bg-[#007d89] disabled:bg-[#2359d4]/10 disabled:text-[#6b7f92] dark:bg-[#65f2f1] dark:text-[#03101e] dark:hover:bg-[#8bf7f5] dark:disabled:bg-white/10 dark:disabled:text-[#71869e]"
              >
                {event.status === "Past"
                  ? "Registration closed"
                  : "Register interest"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-[#2359d4]/15 bg-[#eaf0f6] px-5 py-10 sm:px-8 lg:px-12 dark:border-white/10 dark:bg-[#081524]">
        <dl className="mx-auto grid max-w-[88rem] gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              CalendarDays,
              "Date",
              event.endDate ? `${event.date} — ${event.endDate}` : event.date,
            ],
            [Clock, "Time", event.time],
            [MapPin, "Venue", event.venue],
            [CircleDollarSign, "Fee", event.fee],
          ].map(([Icon, label, value]) => (
            <div key={String(label)} className="flex gap-3">
              <Icon className="mt-1 size-5 shrink-0 text-[#007d89] dark:text-[#65f2f1]" />
              <div>
                <dt className="font-mono text-[9px] tracking-[.16em] text-[#587084] uppercase dark:text-[#71869e]">
                  {String(label)}
                </dt>
                <dd className="mt-1 text-[#182b3d] dark:text-[#dbe7f3]">
                  {String(value)}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </section>
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[1fr_22rem]">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-.04em]">
              Event brief
            </h2>
            <p className="mt-5 leading-8 text-[#425a70] dark:text-[#9fb1c5]">
              Participants receive the detailed schedule and preparation guide
              after registration. Sessions combine concise instruction with
              coached practice, documented checkpoints, and an end-of-day
              technical reflection.
            </p>
            <h3 className="mt-10 text-xl font-semibold">Eligibility</h3>
            <p className="mt-3 leading-7 text-[#425a70] dark:text-[#b9c8d9]">
              {event.eligibility}
            </p>
            <h3 className="mt-10 text-xl font-semibold">Participation rules</h3>
            <ul className="mt-4 space-y-3 text-[#425a70] dark:text-[#9fb1c5]">
              {[
                "Use original work and credit all external material.",
                "Follow venue safety instructions and respect shared equipment.",
                "Cancellation is available until the published registration deadline.",
              ].map((rule) => (
                <li key={rule} className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#007d89] dark:text-[#65f2f1]" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-2xl border border-[#2359d4]/15 bg-white/85 p-6 shadow-[0_14px_40px_rgba(35,89,212,.05)] dark:border-white/10 dark:bg-[#09182a] dark:shadow-none">
            <Users className="size-5 text-[#d97706] dark:text-[#ffb84d]" />
            <p className="mt-5 font-mono text-[9px] tracking-[.16em] text-[#587084] uppercase dark:text-[#71869e]">
              Organizer
            </p>
            <p className="mt-2 font-semibold">ASRRO Events & Technical Wings</p>
            <p className="mt-6 font-mono text-[9px] tracking-[.16em] text-[#587084] uppercase dark:text-[#71869e]">
              Contact person
            </p>
            <p className="mt-2 text-[#425a70] dark:text-[#b9c8d9]">
              Samin Ahmed
              <br />
              <a
                href="mailto:events@asrro.org"
                className="text-[#007d89] dark:text-[#65f2f1]"
              >
                events@asrro.org
              </a>
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
