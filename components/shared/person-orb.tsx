import { cn } from "@/lib/utils"

export function PersonOrb({
  initials,
  className,
}: {
  initials: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative grid aspect-square place-items-center overflow-hidden rounded-full border border-[#3d8bff]/35 bg-[#0b2138] text-2xl font-semibold text-[#dffcff]",
        className
      )}
    >
      <span className="absolute h-[150%] w-[60%] rotate-[32deg] border-x border-[#57e6e6]/20" />
      <span className="relative">{initials}</span>
    </div>
  )
}
