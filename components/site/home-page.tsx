import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { AnimatedNumber } from "@/components/motion/animated-number"
import { TextReveal } from "@/components/motion/text-reveal"
import { OrbitalHero } from "@/components/site/orbital-hero"
import { SectionHeading } from "@/components/shared/section-heading"
import { SignalVisual } from "@/components/shared/signal-visual"
import { SiteButton } from "@/components/shared/site-button"
import { events, news, projects } from "@/content/public-data"

const stats = [
  ["Active members", 428, "+"],
  ["Built projects", 37, ""],
  ["National events", 24, ""],
  ["Research papers", 16, ""],
] as const

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 px-5 pt-14 pb-16 sm:px-8 lg:px-12 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(#203551_1px,transparent_1px),linear-gradient(90deg,#203551_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_80%)] [background-size:44px_44px] opacity-20" />
        <div className="relative mx-auto grid max-w-[88rem] items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[.22em] text-[#57e6e6] uppercase">
              <span className="size-1.5 rounded-full bg-[#ffb84d] shadow-[0_0_12px_#ffb84d]" />
              Frontier technology research · CUET
            </p>
            <TextReveal
              as="h1"
              text={["Engineering the", "next horizon."]}
              className="max-w-4xl text-6xl leading-[.9] font-semibold tracking-[-.065em] text-[#f4fbff] sm:text-7xl xl:text-[6.7rem]"
              stagger={0.07}
            />
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#b9c8d9]">
              ASRRO is a student-led research organization turning ambitious
              questions in space, robotics, AI, and electronics into
              field-tested systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SiteButton href="/projects">Explore our work</SiteButton>
              <SiteButton href="/membership" variant="ghost">
                Join the mission
              </SiteButton>
            </div>
          </div>
          <OrbitalHero />
        </div>
      </section>
      <section className="border-b border-white/10 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[88rem] grid-cols-2 lg:grid-cols-4">
          {stats.map(([label, value, suffix]) => (
            <div
              key={label}
              className="border-white/10 px-3 py-8 even:border-l lg:border-l lg:px-6 lg:first:border-l-0"
            >
              <p className="text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">
                <AnimatedNumber value={value} />
                {suffix}
              </p>
              <p className="mt-2 font-mono text-[9px] tracking-[.18em] text-[#8296ad] uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[88rem]">
          <SectionHeading
            eyebrow="Selected systems / 2024—26"
            title="Ideas become instruments here."
            copy="Our teams work across disciplines, moving from research question to prototype, test data, and public documentation."
            action={
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-[#57e6e6]"
              >
                All projects <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#09182a] transition hover:-translate-y-1 hover:border-[#57e6e6]/45"
              >
                <SignalVisual
                  code={`P-${String(index + 1).padStart(2, "0")}`}
                  className="aspect-[16/10] border-b border-white/10"
                />
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between font-mono text-[9px] tracking-[.16em] text-[#8296ad] uppercase">
                    <span>{project.category}</span>
                    <span className="text-[#ffb84d]">{project.status}</span>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-.035em] text-white group-hover:text-[#57e6e6]">
                    {project.title}
                  </h3>
                  <p className="mt-3 leading-7 text-[#9fb1c5]">
                    {project.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-[#081524] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <SectionHeading
            eyebrow="Upcoming / field calendar"
            title="Meet us where the work happens."
            copy="Compete, train, question, and build alongside a national community of student engineers."
          />
          <div className="divide-y divide-white/10 border-t border-white/10">
            {events
              .filter((e) => e.status === "Upcoming")
              .map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="group grid gap-5 py-6 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
                >
                  <div>
                    <span className="block font-mono text-[10px] tracking-[.18em] text-[#57e6e6]">
                      {event.month}
                    </span>
                    <span className="text-4xl font-semibold tracking-[-.05em]">
                      {event.day}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-[#57e6e6]">
                      {event.title}
                    </h3>
                    <p className="mt-2 flex flex-wrap gap-4 text-sm text-[#8fa7c0]">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        {event.venue}
                      </span>
                    </p>
                  </div>
                  <ArrowRight className="hidden size-5 text-[#57e6e6] sm:block" />
                </Link>
              ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[88rem]">
          <SectionHeading
            eyebrow="Signal log / ASRRO news"
            title="From the lab and beyond."
            action={
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm text-[#57e6e6]"
              >
                View all updates <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {news.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group bg-[#09182a] p-6 hover:bg-[#0c1d32]"
              >
                <p className="font-mono text-[9px] tracking-[.18em] text-[#57e6e6] uppercase">
                  {item.category}
                </p>
                <h3 className="mt-8 text-xl leading-tight font-semibold tracking-[-.025em] group-hover:text-[#57e6e6]">
                  {item.title}
                </h3>
                <p className="mt-5 text-sm text-[#8296ad]">
                  {item.date} · {item.read}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl border border-[#3d8bff]/35 bg-[#0b1c31] p-8 sm:p-12 lg:flex lg:items-end lg:justify-between lg:p-16">
          <div>
            <p className="font-mono text-[10px] tracking-[.22em] text-[#ffb84d] uppercase">
              Membership intake · 2026
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
              Your curiosity belongs in the lab.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-[#aebed0]">
              Join project teams, skill sprints, field trials, and a community
              that learns by building.
            </p>
          </div>
          <SiteButton href="/membership" className="mt-8 shrink-0 lg:mt-0">
            Start application
          </SiteButton>
        </div>
      </section>
    </>
  )
}
