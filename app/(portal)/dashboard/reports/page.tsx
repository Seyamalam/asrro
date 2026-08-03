import {
  CalendarRange,
  Download,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  RefreshCw,
} from "lucide-react"

import {
  ActionButton,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import { reports } from "@/data/dashboard-data"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reporting centre"
        title="Reports & exports"
        description="Generate member, event, finance, committee, and project records in operational formats."
        actions={
          <ActionButton variant="secondary">
            <RefreshCw className="size-3.5" />
            Refresh sources
          </ActionButton>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <Panel
          title="Available reports"
          description="Exports use the latest verified portal data."
        >
          <div className="divide-y divide-slate-100 dark:divide-white/8">
            {reports.map((report) => (
              <article
                key={report.name}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <FileBarChart className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {report.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {report.description}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400">
                    Updated {report.updated}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.formats.map((format) => (
                    <button
                      key={format}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-[10px] font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 dark:border-white/10 dark:text-slate-300"
                    >
                      <Download className="size-3" />
                      {format}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Panel>
        <aside className="space-y-4">
          <Panel className="p-5">
            <CalendarRange className="size-5 text-blue-600" />
            <h2 className="mt-4 text-sm font-semibold">Report period</h2>
            <label
              className="mt-4 block text-[10px] font-semibold tracking-wider text-slate-400 uppercase"
              htmlFor="report-from"
            >
              From
            </label>
            <input
              id="report-from"
              type="date"
              defaultValue="2026-01-01"
              className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5"
            />
            <label
              className="mt-3 block text-[10px] font-semibold tracking-wider text-slate-400 uppercase"
              htmlFor="report-to"
            >
              To
            </label>
            <input
              id="report-to"
              type="date"
              defaultValue="2026-08-03"
              className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5"
            />
          </Panel>
          <Panel className="p-5">
            <h2 className="text-sm font-semibold">Recent exports</h2>
            <div className="mt-4 space-y-4">
              {[
                { name: "July finance", icon: FileSpreadsheet, type: "Excel" },
                { name: "Rover participants", icon: FileText, type: "PDF" },
              ].map(({ name, icon: Icon, type }) => (
                <div key={name} className="flex items-center gap-3">
                  <Icon className="size-4 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{name}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Generated 2 Aug
                    </p>
                  </div>
                  <StatusPill>{type}</StatusPill>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}
