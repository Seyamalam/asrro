"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title="Change color theme"
      className={cn(
        "inline-grid size-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white/80 p-0 text-slate-700 shadow-sm backdrop-blur-xl transition hover:border-cyan-400 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none dark:border-white/12 dark:bg-white/6 dark:text-slate-200 dark:hover:border-cyan-300/60 dark:hover:text-white",
        className
      )}
    >
      <Moon className="size-4 dark:hidden" aria-hidden />
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <span className="sr-only dark:hidden">Switch to dark mode</span>
      <span className="sr-only hidden dark:inline">Switch to light mode</span>
    </button>
  )
}
