import type { Metadata } from "next"
import { ArrowDownToLine, BookOpen, FileText } from "lucide-react"
import { PageHero } from "@/components/shared/page-hero"
import { publications } from "@/content/public-data"
export const metadata: Metadata = {
  title: "Publications",
  description:
    "ASRRO research papers, technical reports, magazines, and annual publications.",
}
export default function PublicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Knowledge base / public record"
        title="Research should leave a trail."
        intro="Papers, reports, magazines, and field notes that make ASRRO work legible, reviewable, and reusable."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[88rem]">
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Research papers", "12"],
              ["Technical reports", "19"],
              ["Annual issues", "07"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-[#09182a] p-5"
              >
                <p className="text-3xl font-semibold">{value}</p>
                <p className="mt-1 font-mono text-[9px] tracking-[.16em] text-[#71869e] uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {publications.map((item) => (
              <article
                key={item.id}
                className="grid gap-5 py-7 md:grid-cols-[3rem_1fr_11rem_3rem] md:items-center"
              >
                <span className="grid size-11 place-items-center rounded-lg border border-[#3d8bff]/25 bg-[#0b1d31] text-[#57e6e6]">
                  {item.type === "Magazine" ? (
                    <BookOpen className="size-5" />
                  ) : (
                    <FileText className="size-5" />
                  )}
                </span>
                <div>
                  <p className="font-mono text-[9px] tracking-[.16em] text-[#57e6e6] uppercase">
                    {item.type} · {item.id}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-.025em]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#8296ad]">{item.authors}</p>
                </div>
                <div className="text-sm text-[#9fb1c5]">
                  <p>{item.venue}</p>
                  <p className="mt-1 text-[#71869e]">{item.year}</p>
                </div>
                <button
                  aria-label={`Download ${item.title}`}
                  className="grid size-11 place-items-center rounded-full border border-white/10 hover:border-[#57e6e6]/50 hover:text-[#57e6e6]"
                >
                  <ArrowDownToLine className="size-4" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
