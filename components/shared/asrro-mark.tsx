import { cn } from "@/lib/utils"

export function AsrroMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 place-items-center rounded-full border border-[#57e6e6]/45",
        className
      )}
      aria-hidden
    >
      <span className="absolute size-2 rounded-full bg-[#57e6e6] shadow-[0_0_14px_#57e6e6]" />
      <span className="absolute h-4 w-8 -rotate-[24deg] rounded-[50%] border border-[#3d8bff]" />
      <span className="absolute top-[8px] right-[2px] size-1.5 rounded-full bg-[#ffb84d]" />
    </span>
  )
}
