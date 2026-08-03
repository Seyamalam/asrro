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
                className="rounded-xl border border-[#2359d4]/15 bg-white/85 p-5 shadow-[0_12px_35px_rgba(35,89,212,.05)] dark:border-white/10 dark:bg-[#09182a] dark:shadow-none"
              >
                <p className="text-3xl font-semibold">{value}</p>
                <p className="mt-1 font-mono text-[9px] tracking-[.16em] text-[#587084] uppercase dark:text-[#71869e]">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="divide-y divide-[#2359d4]/15 border-y border-[#2359d4]/15 dark:divide-white/10 dark:border-white/10">
            {publications.map((item) => (
              <article
                key={item.id}
                className="grid gap-5 py-7 md:grid-cols-[3rem_1fr_11rem_3rem] md:items-center"
              >
                <span className="grid size-11 place-items-center rounded-lg border border-[#2359d4]/20 bg-[#eef3ff] text-[#2359d4] dark:border-[#3d8bff]/25 dark:bg-[#0b1d31] dark:text-[#65f2f1]">
                  {item.type === "Magazine" ? (
                    <BookOpen className="size-5" />
                  ) : (
                    <FileText className="size-5" />
                  )}
                </span>
                <div>
                  <p className="font-mono text-[9px] tracking-[.16em] text-[#007d89] uppercase dark:text-[#65f2f1]">
                    {item.type} · {item.id}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-.025em]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#587084] dark:text-[#8296ad]">
                    {item.authors}
                  </p>
                </div>
                <div className="text-sm text-[#425a70] dark:text-[#9fb1c5]">
                  <p>{item.venue}</p>
                  <p className="mt-1 text-[#587084] dark:text-[#71869e]">
                    {item.year}
                  </p>
                </div>
                <button
                  aria-label={`Download ${item.title}`}
                  className="grid size-11 place-items-center rounded-full border border-[#2359d4]/15 text-[#486076] transition hover:border-[#00a6b2]/50 hover:text-[#007d89] dark:border-white/10 dark:text-inherit dark:hover:border-[#65f2f1]/50 dark:hover:text-[#65f2f1]"
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
