import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/shared/page-hero"
import { SignalVisual } from "@/components/shared/signal-visual"
import { news } from "@/content/public-data"
export const metadata: Metadata = {
  title: "News & Field Notes",
  description:
    "ASRRO news, project updates, announcements, and alumni field notes.",
}
export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Signal log / news & field notes"
        title="What changed, and why it matters."
        intro="Announcements, project milestones, research context, and lessons carried back from the field."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[88rem]">
          <Link
            href={`/news/${news[0].slug}`}
            className="group grid overflow-hidden rounded-2xl border border-white/10 bg-[#09182a] lg:grid-cols-[1.1fr_.9fr]"
          >
            <SignalVisual
              code="LATEST—0728"
              className="min-h-72 border-b border-white/10 lg:border-r lg:border-b-0"
            />
            <div className="flex flex-col justify-between p-8 sm:p-10">
              <div>
                <p className="font-mono text-[9px] tracking-[.17em] text-[#57e6e6] uppercase">
                  Latest · {news[0].category}
                </p>
                <h2 className="mt-5 text-4xl leading-tight font-semibold tracking-[-.045em] group-hover:text-[#57e6e6]">
                  {news[0].title}
                </h2>
                <p className="mt-5 leading-7 text-[#9fb1c5]">
                  {news[0].summary}
                </p>
              </div>
              <p className="mt-10 flex items-center justify-between text-sm text-[#8296ad]">
                {news[0].date} · {news[0].read}
                <ArrowUpRight className="size-4" />
              </p>
            </div>
          </Link>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {news.slice(1).map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group rounded-2xl border border-white/10 bg-[#09182a] p-6 hover:border-[#57e6e6]/40"
              >
                <p className="font-mono text-[9px] tracking-[.16em] text-[#57e6e6] uppercase">
                  {item.category}
                </p>
                <h2 className="mt-12 text-2xl font-semibold tracking-[-.035em] group-hover:text-[#57e6e6]">
                  {item.title}
                </h2>
                <p className="mt-4 leading-7 text-[#9fb1c5]">{item.summary}</p>
                <p className="mt-8 text-sm text-[#71869e]">
                  {item.date} · {item.read}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
