import type { Metadata } from "next"
import { Images, Play } from "lucide-react"
import { PageHero } from "@/components/shared/page-hero"
import { SignalVisual } from "@/components/shared/signal-visual"
import { gallery } from "@/content/public-data"
export const metadata: Metadata = {
  title: "Gallery",
  description:
    "ASRRO event albums, field tests, workshops, and milestone archives.",
}
export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Visual archive / field evidence"
        title="Proof that we showed up."
        intro="A record of test days, workshops, competitions, quiet lab breakthroughs, and the people behind the systems."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[88rem] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((album, index) => (
            <article
              key={album.code}
              className={index === 0 ? "md:col-span-2" : ""}
            >
              <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#09182a]">
                <SignalVisual
                  code={album.code}
                  className={index === 0 ? "aspect-[16/7]" : "aspect-[16/10]"}
                />
                <div className="flex items-end justify-between gap-5 p-5">
                  <div>
                    <p className="font-mono text-[9px] tracking-[.16em] text-[#57e6e6] uppercase">
                      {album.tag} · {album.year}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      {album.title}
                    </h2>
                  </div>
                  <span className="flex shrink-0 items-center gap-2 text-sm text-[#8296ad]">
                    <Images className="size-4" />
                    {album.count}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-8 flex max-w-[88rem] items-center gap-4 rounded-2xl border border-[#3d8bff]/30 bg-[#0b1d31] p-6">
          <span className="grid size-12 place-items-center rounded-full bg-[#57e6e6] text-[#03101e]">
            <Play className="size-5 fill-current" />
          </span>
          <div>
            <p className="font-semibold">ASRRO field reel · 02:18</p>
            <p className="mt-1 text-sm text-[#8296ad]">
              A short film from the 2025 rover season.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
