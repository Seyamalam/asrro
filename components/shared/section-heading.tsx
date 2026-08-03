import type { ReactNode } from "react"

export function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string
  title: string
  copy?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-9 flex flex-col gap-5 border-t border-white/10 pt-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="mb-3 font-mono text-[10px] tracking-[0.24em] text-[#57e6e6] uppercase">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-balance text-[#f4fbff] sm:text-5xl">
          {title}
        </h2>
        {copy ? (
          <p className="mt-4 max-w-2xl leading-7 text-[#9fb1c5]">{copy}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
