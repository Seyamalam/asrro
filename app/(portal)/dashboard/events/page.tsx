import { CalendarRange, CheckCircle2, Clock3, TicketCheck } from "lucide-react"

import { EventCard } from "@/components/dashboard/event-card"
import {
  MetricCard,
  PageHeader,
  Panel,
} from "@/components/dashboard/dashboard-kit"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs"
import { events } from "@/data/dashboard-data"

export default function EventsPage() {
  const upcoming = events.filter((event) => event.status === "Upcoming")
  const registered = events.filter(
    (event) => event.registration === "Confirmed"
  )
  const attended = events.filter((event) => event.status === "Completed")
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Member events"
        title="Events & registrations"
        description="Discover eligible programs, track your confirmations, and revisit attended events."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Open events"
          value={upcoming.length}
          detail="Across national and CUET scopes"
          icon={CalendarRange}
          tone="blue"
        />
        <MetricCard
          label="Confirmed"
          value={registered.length}
          detail="Your active event registrations"
          icon={TicketCheck}
          tone="emerald"
        />
        <MetricCard
          label="Attended"
          value={12}
          detail="Since joining in September 2023"
          icon={CheckCircle2}
          tone="violet"
        />
      </div>
      <Tabs defaultValue="upcoming" variant="underline">
        <TabsList className="w-full overflow-x-auto bg-transparent">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="registered">My registrations</TabsTrigger>
          <TabsTrigger value="attended">Attended</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="registered">
          <div className="grid gap-4 md:grid-cols-2">
            {registered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="attended">
          <Panel>
            <div className="divide-y divide-slate-100 dark:divide-white/8">
              {attended.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    <Clock3 className="size-4" />
                  </span>
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {event.date} · {event.venue}
                    </p>
                  </div>
                  <button className="text-left text-xs font-semibold text-blue-600">
                    View participation record
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  )
}
