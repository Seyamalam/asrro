import {
  CalendarPlus,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  QrCode,
  TicketCheck,
  UsersRound,
} from "lucide-react"

import {
  ActionButton,
  MetricCard,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import { EventCard } from "@/components/dashboard/event-card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs"
import { events } from "@/data/dashboard-data"

const registrations = [
  {
    name: "Mahin Islam",
    team: "Neptune Dynamics",
    event: "Rover Challenge",
    payment: "Verified",
    status: "Accepted",
  },
  {
    name: "Jannatul Ferdous",
    team: "Orbitron",
    event: "Rover Challenge",
    payment: "Review",
    status: "Pending",
  },
  {
    name: "Rayhan Kabir",
    team: "Individual",
    event: "Orbital Mechanics",
    payment: "Free",
    status: "Accepted",
  },
  {
    name: "Sumaiya Noor",
    team: "TechNova",
    event: "Embedded Bootcamp",
    payment: "Verified",
    status: "Waitlisted",
  },
]

export default function EventManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Event control"
        title="Event operations"
        description="Publish programs, manage registrations, and capture reliable attendance."
        actions={
          <>
            <ActionButton variant="secondary">
              <Copy className="size-3.5" />
              Clone event
            </ActionButton>
            <ActionButton>
              <CalendarPlus className="size-3.5" />
              Create event
            </ActionButton>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Live events"
          value={3}
          detail="1 closes registration this week"
          icon={ClipboardCheck}
          tone="blue"
        />
        <MetricCard
          label="Registrations"
          value={519}
          detail="Across upcoming events"
          icon={TicketCheck}
          tone="violet"
        />
        <MetricCard
          label="Seats available"
          value={181}
          detail="74% overall capacity"
          icon={UsersRound}
          tone="cyan"
        />
        <MetricCard
          label="Attendance rate"
          value={87}
          suffix="%"
          detail="Trailing 12-event average"
          icon={CheckCircle2}
          tone="emerald"
        />
      </div>
      <Tabs defaultValue="events" variant="underline">
        <TabsList className="w-full overflow-x-auto bg-transparent">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} administrative />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="registrations">
          <Panel
            title="Recent registrations"
            description="Payment status and eligibility review"
            action={
              <ActionButton variant="secondary">
                <Download className="size-3.5" />
                Export
              </ActionButton>
            }
          >
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] tracking-wider text-slate-400 uppercase dark:border-white/8">
                    <th className="px-5 py-3">Participant</th>
                    <th className="py-3">Event</th>
                    <th className="py-3">Payment</th>
                    <th className="py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/8">
                  {registrations.map((item) => (
                    <tr key={item.name}>
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {item.team}
                        </p>
                      </td>
                      <td className="py-4 text-xs text-slate-600 dark:text-slate-300">
                        {item.event}
                      </td>
                      <td className="py-4">
                        <StatusPill
                          tone={item.payment === "Review" ? "amber" : "green"}
                        >
                          {item.payment}
                        </StatusPill>
                      </td>
                      <td className="py-4">
                        <StatusPill
                          tone={
                            item.status === "Accepted"
                              ? "green"
                              : item.status === "Pending"
                                ? "amber"
                                : "violet"
                          }
                        >
                          {item.status}
                        </StatusPill>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-xs font-semibold text-blue-600">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-100 md:hidden dark:divide-white/8">
              {registrations.map((item) => (
                <article key={item.name} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {item.team} · {item.event}
                      </p>
                    </div>
                    <StatusPill
                      tone={
                        item.status === "Accepted"
                          ? "green"
                          : item.status === "Pending"
                            ? "amber"
                            : "violet"
                      }
                    >
                      {item.status}
                    </StatusPill>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <StatusPill
                      tone={item.payment === "Review" ? "amber" : "green"}
                    >
                      {item.payment}
                    </StatusPill>
                    <button className="text-xs font-semibold text-blue-600">
                      Review application
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </TabsContent>
        <TabsContent value="attendance">
          <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
            <Panel className="grid min-h-72 place-items-center p-8 text-center">
              <div>
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <QrCode className="size-7" />
                </span>
                <h2 className="mt-4 text-base font-semibold">
                  Open attendance scanner
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                  Scan participant confirmations at check-in or search the
                  registration list manually.
                </p>
                <ActionButton className="mt-5">Start scanning</ActionButton>
              </div>
            </Panel>
            <Panel title="Today’s check-in">
              <div className="p-5">
                <p className="text-3xl font-semibold tracking-tight">
                  0{" "}
                  <span className="text-sm font-normal text-slate-400">
                    / 0
                  </span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  No event is currently in its attendance window.
                </p>
              </div>
            </Panel>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
