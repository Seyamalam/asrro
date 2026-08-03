export default function DashboardLoading() {
  return (
    <div
      className="animate-pulse space-y-6"
      aria-label="Loading portal content"
    >
      <div className="space-y-3">
        <div className="h-3 w-28 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-white/10" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-32 rounded-2xl bg-slate-200 dark:bg-white/10"
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-white/10" />
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-white/10" />
      </div>
    </div>
  )
}
