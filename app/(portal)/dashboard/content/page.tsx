import {
  BookOpenText,
  Eye,
  FileText,
  Image as ImageIcon,
  Newspaper,
  PenLine,
  Plus,
  Video,
} from "lucide-react"

import {
  ActionButton,
  MetricCard,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs"

const content = [
  {
    title: "ASRRO Journal · Volume 04",
    type: "Publication",
    author: "Research wing",
    updated: "2 Aug 2026",
    status: "Published",
    views: "1.8k",
  },
  {
    title: "Inside the Astra Rover controls stack",
    type: "Blog",
    author: "Mehedi Hasan",
    updated: "1 Aug 2026",
    status: "Review",
    views: "—",
  },
  {
    title: "Bangladesh Rover Challenge announcement",
    type: "News",
    author: "PR wing",
    updated: "29 Jul 2026",
    status: "Published",
    views: "4.2k",
  },
  {
    title: "CubeSat ground station field notes",
    type: "Research",
    author: "Tasnim Arefin",
    updated: "27 Jul 2026",
    status: "Draft",
    views: "—",
  },
]

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Public publishing"
        title="Content studio"
        description="Manage news, research publications, gallery albums, and public-facing organizational stories."
        actions={
          <ActionButton>
            <Plus className="size-3.5" />
            New content
          </ActionButton>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Published stories"
          value={86}
          detail="Across news and the journal"
          icon={Newspaper}
          tone="blue"
        />
        <MetricCard
          label="Research documents"
          value={24}
          detail="8 peer-reviewed papers"
          icon={FileText}
          tone="violet"
        />
        <MetricCard
          label="Gallery assets"
          value={1240}
          detail="In 48 event albums"
          icon={ImageIcon}
          tone="cyan"
        />
        <MetricCard
          label="Monthly readers"
          value={18_600}
          detail="+22% over July"
          icon={Eye}
          tone="emerald"
        />
      </div>
      <Tabs defaultValue="editorial" variant="underline">
        <TabsList className="w-full overflow-x-auto bg-transparent">
          <TabsTrigger value="editorial">Editorial</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
        </TabsList>
        <TabsContent value="editorial">
          <Panel
            title="Editorial queue"
            description="Draft, review, and published content"
          >
            <div className="divide-y divide-slate-100 dark:divide-white/8">
              {content.map((item) => (
                <article
                  key={item.title}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <BookOpenText className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {item.type} · {item.author} · {item.updated}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-5">
                    <StatusPill
                      tone={
                        item.status === "Published"
                          ? "green"
                          : item.status === "Review"
                            ? "amber"
                            : "slate"
                      }
                    >
                      {item.status}
                    </StatusPill>
                    <span className="text-[11px] text-slate-400">
                      {item.views} views
                    </span>
                    <button className="text-[11px] font-semibold text-blue-600">
                      Edit
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </TabsContent>
        <TabsContent value="gallery">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Rover Challenge 2025",
                count: "148 photos",
                icon: ImageIcon,
              },
              {
                title: "Space Week workshops",
                count: "64 photos · 3 videos",
                icon: Video,
              },
              { title: "Research lab", count: "38 photos", icon: ImageIcon },
            ].map(({ title, count, icon: Icon }) => (
              <Panel key={title} className="p-5">
                <div className="grid aspect-[16/8] place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/5">
                  <Icon className="size-7" />
                </div>
                <h2 className="mt-4 text-sm font-semibold">{title}</h2>
                <p className="mt-1 text-xs text-slate-500">{count}</p>
                <button className="mt-4 text-[11px] font-semibold text-blue-600">
                  Manage album
                </button>
              </Panel>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="publications">
          <Panel className="p-8 text-center">
            <PenLine className="mx-auto size-7 text-violet-600" />
            <h2 className="mt-4 text-sm font-semibold">
              Research publication workflow
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
              Upload manuscript files, add authors and citations, then send them
              through editorial review before publication.
            </p>
            <ActionButton className="mt-5">Add publication</ActionButton>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  )
}
