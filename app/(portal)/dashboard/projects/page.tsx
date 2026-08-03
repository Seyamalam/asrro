import {
  Boxes,
  Filter,
  FlaskConical,
  FolderKanban,
  Plus,
  Search,
  UsersRound,
} from "lucide-react"

import {
  ActionButton,
  MetricCard,
  PageHeader,
  Panel,
  ProgressBar,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import { projects } from "@/data/dashboard-data"

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Research portfolio"
        title="Projects"
        description="Track project delivery, team ownership, and work ready for the public portfolio."
        actions={
          <ActionButton>
            <Plus className="size-3.5" />
            Create project
          </ActionButton>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active projects"
          value={17}
          detail="Across six technology domains"
          icon={FolderKanban}
          tone="blue"
        />
        <MetricCard
          label="Research tracks"
          value={6}
          detail="3 preparing publications"
          icon={FlaskConical}
          tone="violet"
        />
        <MetricCard
          label="Contributors"
          value={94}
          detail="22 open project roles"
          icon={UsersRound}
          tone="cyan"
        />
        <MetricCard
          label="Equipment assigned"
          value={138}
          detail="96% inventory accounted for"
          icon={Boxes}
          tone="amber"
        />
      </div>
      <Panel
        title="Project inventory"
        description="Delivery status and member allocation"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row dark:border-white/8">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 text-xs text-slate-400 dark:bg-white/5">
            <Search className="size-3.5" />
            Search projects, leads, or domains
          </div>
          <ActionButton variant="secondary">
            <Filter className="size-3.5" />
            Filter
          </ActionButton>
        </div>
        <div className="grid gap-px bg-slate-100 md:grid-cols-2 dark:bg-white/8">
          {projects.map((project) => (
            <article
              key={project.title}
              className="bg-white p-5 dark:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                    {project.domain}
                  </p>
                  <h2 className="mt-1.5 text-base font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                    {project.title}
                  </h2>
                </div>
                <StatusPill
                  tone={
                    project.status === "Completed"
                      ? "green"
                      : project.status === "Research"
                        ? "violet"
                        : "blue"
                  }
                >
                  {project.status}
                </StatusPill>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">
                  Lead ·{" "}
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">
                    {project.lead}
                  </strong>
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <UsersRound className="size-3" />
                  {project.team}
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-[10px] text-slate-400">
                  <span>Delivery progress</span>
                  <span>{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/8">
                <span className="text-[10px] text-slate-400">
                  Updated {project.updated}
                </span>
                <button className="text-[11px] font-semibold text-blue-600">
                  Open workspace
                </button>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  )
}
