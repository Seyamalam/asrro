import Image from "next/image"

import { cn } from "@/lib/utils"

export function AsrroMark({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <span
      className={cn(
        "relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_8px_30px_rgba(5,12,23,0.14)] dark:border-white/15",
        className
      )}
    >
      <Image
        src="/asrro-logo.png"
        alt=""
        width={725}
        height={725}
        loading={priority ? "eager" : "lazy"}
        className="size-full object-contain"
      />
    </span>
  )
}
