import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Share2 } from "lucide-react"
import { news } from "@/content/public-data"
export function generateStaticParams() {
  return news.map((item) => ({ slug: item.slug }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = news.find((n) => n.slug === slug)
  return { title: item?.title ?? "News", description: item?.summary }
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = news.find((n) => n.slug === slug)
  if (!item) notFound()
  return (
    <article>
      <header className="px-5 pt-10 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-[#8fa7c0] hover:text-white"
          >
            <ArrowLeft className="size-4" />
            All news
          </Link>
          <p className="mt-12 font-mono text-[10px] tracking-[.2em] text-[#57e6e6] uppercase">
            {item.category} · {item.date}
          </p>
          <h1 className="mt-5 text-5xl leading-[.96] font-semibold tracking-[-.055em] text-balance sm:text-7xl">
            {item.title}
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-[#b9c8d9]">
            {item.summary}
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-[#71869e]">
            <span>ASRRO Editorial Desk</span>
            <span>·</span>
            <span>{item.read}</span>
            <button
              aria-label="Share article"
              className="ml-auto grid size-11 place-items-center rounded-full border border-white/10"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </div>
      </header>
      <div className="border-y border-white/10 bg-[#081524] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl space-y-7 text-lg leading-9 text-[#b9c8d9]">
          <p>
            At ASRRO, a milestone becomes useful only when it is documented well
            enough for another team to question, reproduce, and improve. This
            update marks the latest checkpoint in that longer process.
          </p>
          <p>
            The team began by defining the operating constraints: limited access
            to specialized hardware, varied prior experience among members, and
            the need to produce evidence outside controlled demonstrations.
            Those constraints shaped a deliberately modular plan with short test
            cycles.
          </p>
          <h2 className="pt-5 text-3xl font-semibold tracking-[-.04em] text-white">
            What happens next
          </h2>
          <p>
            Over the coming weeks, the working group will consolidate test
            notes, publish a technical brief, and invite reviewers from the
            ASRRO alumni network and CUET faculty. The next public update will
            include measurable results and the decisions they changed.
          </p>
          <blockquote className="border-l-2 border-[#57e6e6] py-2 pl-6 text-2xl leading-9 font-medium text-[#e3f7ff]">
            Progress is not the prototype on the table. It is the knowledge the
            next team does not have to rediscover.
          </blockquote>
          <p>
            Questions, potential collaborations, and technical feedback are
            welcome at{" "}
            <a
              href="mailto:research@asrro.org"
              className="text-[#57e6e6] underline"
            >
              research@asrro.org
            </a>
            .
          </p>
        </div>
      </div>
    </article>
  )
}
