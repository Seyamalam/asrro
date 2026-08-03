"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string
  showLabel?: boolean
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:border-cyan-400 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none dark:border-white/12 dark:bg-white/6 dark:text-slate-200 dark:hover:border-cyan-300/60 dark:hover:text-white",
        className
      )}
    >
      <Sun className="size-4 dark:hidden" aria-hidden />
      <Moon className="hidden size-4 dark:block" aria-hidden />
      {showLabel ? (
        <>
          <span className="dark:hidden">Dark mode</span>
          <span className="hidden dark:inline">Light mode</span>
        </>
      ) : null}
    </button>
  )
}
