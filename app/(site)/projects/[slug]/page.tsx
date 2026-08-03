import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Code2, FileText, Trophy } from "lucide-react"
import { projects } from "@/content/public-data"
import { SignalVisual } from "@/components/shared/signal-visual"
import { SiteButton } from "@/components/shared/site-button"

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  return { title: project?.title ?? "Project", description: project?.summary }
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()
  return (
    <>
      <section className="px-5 pt-10 pb-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[88rem]">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-[#8fa7c0] hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div>
              <div className="mb-5 flex gap-2">
                <span className="rounded-full border border-[#57e6e6]/25 px-3 py-1 font-mono text-[9px] tracking-[.16em] text-[#57e6e6] uppercase">
                  {project.category}
                </span>
                <span className="rounded-full border border-[#ffb84d]/25 px-3 py-1 font-mono text-[9px] tracking-[.16em] text-[#ffb84d] uppercase">
                  {project.status}
                </span>
              </div>
              <h1 className="text-5xl leading-[.95] font-semibold tracking-[-.055em] sm:text-7xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-8 text-[#b9c8d9]">
                {project.summary}
              </p>
            </div>
            <SignalVisual
              code={project.slug.toUpperCase().slice(0, 12)}
              className="aspect-[16/10] rounded-2xl border border-white/10"
            />
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-[#081524] px-5 py-12 sm:px-8 lg:px-12">
        <dl className="mx-auto grid max-w-[88rem] grid-cols-2 gap-8 lg:grid-cols-4">
          {[
            ["Duration", project.duration],
            ["Team size", `${project.team.length} researchers`],
            ["Discipline", project.category],
            ["Record year", project.year],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="font-mono text-[9px] tracking-[.17em] text-[#71869e] uppercase">
                {term}
              </dt>
              <dd className="mt-2 text-lg text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="font-mono text-[10px] tracking-[.2em] text-[#57e6e6] uppercase">
              Current outcome
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em]">
              What the team proved.
            </h2>
            <p className="mt-5 text-xl leading-9 text-[#b9c8d9]">
              {project.outcome}
            </p>
            <h3 className="mt-12 text-xl font-semibold">Technical approach</h3>
            <p className="mt-4 leading-8 text-[#9fb1c5]">
              The team follows a staged research cycle: define measurable field
              constraints, prototype the riskiest subsystem first, integrate
              only after component tests pass, and publish a test log after each
              milestone.
            </p>
          </div>
          <aside className="rounded-2xl border border-white/10 bg-[#09182a] p-6">
            <p className="font-mono text-[10px] tracking-[.18em] text-[#71869e] uppercase">
              System stack
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#3d8bff]/30 px-3 py-1.5 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-8 font-mono text-[10px] tracking-[.18em] text-[#71869e] uppercase">
              Research team
            </p>
            <ul className="mt-4 divide-y divide-white/10">
              {project.team.map((name) => (
                <li key={name} className="py-3 text-[#b9c8d9]">
                  {name}
                </li>
              ))}
            </ul>
            <div className="mt-7 grid gap-3">
              <SiteButton href="#" variant="ghost">
                <Code2 className="size-4" />
                Repository
              </SiteButton>
              <SiteButton href="/publications" variant="ghost">
                <FileText className="size-4" />
                Related publications
              </SiteButton>
              {project.status === "Competition" ? (
                <p className="flex items-center gap-2 text-sm text-[#ffb84d]">
                  <Trophy className="size-4" />
                  Active competition entry
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
