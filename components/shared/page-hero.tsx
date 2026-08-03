import type { ReactNode } from "react"

export function PageHero({
  eyebrow,
  title,
  intro,
  aside,
}: {
  eyebrow: string
  title: string
  intro: string
  aside?: ReactNode
}) {
  return (
    <section className="border-b border-white/10 px-5 pt-16 pb-16 sm:px-8 lg:px-12 lg:pt-24 lg:pb-20">
      <div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div>
          <p className="mb-5 font-mono text-[11px] tracking-[0.24em] text-[#57e6e6] uppercase">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-5xl leading-[0.94] font-semibold tracking-[-0.055em] text-balance text-[#f4fbff] sm:text-6xl lg:text-8xl">
            {title}
          </h1>
        </div>
        <div className="border-l border-[#3d8bff]/45 pl-5">
          <p className="text-base leading-7 text-[#b9c8d9]">{intro}</p>
          {aside}
        </div>
      </div>
    </section>
  )
}
