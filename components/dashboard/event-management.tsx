"use client"

import { useMutation, useQuery } from "convex/react"
import {
  CalendarPlus,
  CheckCircle2,
  Copy,
  Download,
  TicketCheck,
  UsersRound,
} from "lucide-react"
import {
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react"

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
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import {
  downloadParticipantsCsv,
  downloadParticipantsPdf,
  downloadParticipantsXlsx,
  type ParticipantExportRow,
} from "@/lib/event-documents"

export function EventManagement() {
  const events = useQuery(api.events.listManagedEvents)
  const [selectedId, setSelectedId] = useState<Id<"events"> | null>(null)
  const [editing, setEditing] = useState<Doc<"events"> | null | undefined>(
    undefined
  )
  const [message, setMessage] = useState("")
  const effectiveSelectedId = selectedId ?? events?.[0]?._id ?? null
  const selected =
    events?.find((event) => event._id === effectiveSelectedId) ?? null
  const registrations = useQuery(
    api.events.listManagedRegistrations,
    effectiveSelectedId ? { eventId: effectiveSelectedId } : "skip"
  )
  const upsert = useMutation(api.events.upsert)
  const archive = useMutation(api.events.archive)
  const clone = useMutation(api.events.clone)
  const review = useMutation(api.events.reviewRegistration)
  const attendance = useMutation(api.events.markAttendance)

  const live = events?.filter((event) => event.status === "published") ?? []
  const totalRegistrations =
    events?.reduce(
      (total, event) => total + event.activeRegistrationCount,
      0
    ) ?? 0
  const capacity =
    events?.reduce((total, event) => total + event.capacity, 0) ?? 0
  const attended =
    registrations?.filter((item) => item.status === "attended").length ?? 0
  const decidedAttendance =
    registrations?.filter(
      (item) => item.status === "attended" || item.status === "absent"
    ).length ?? 0

  async function onSave(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault()
    const form = new FormData(formEvent.currentTarget)
    const text = (name: string) => String(form.get(name) ?? "")
    try {
      const eventId = await upsert({
        eventId: editing?._id,
        slug: text("slug"),
        name: text("name"),
        summary: text("summary"),
        description: text("description"),
        category: text("category"),
        scope: text("scope") as "intra_cuet" | "divisional" | "national",
        audience: text("audience") as "public" | "members" | "executives",
        status: text("status") as
          "draft" | "published" | "cancelled" | "completed" | "archived",
        startsAt: new Date(text("startsAt")).getTime(),
        endsAt: new Date(text("endsAt")).getTime(),
        registrationDeadline: new Date(text("registrationDeadline")).getTime(),
        venue: text("venue"),
        organizer: text("organizer"),
        capacity: Number(text("capacity")),
        rules: text("rules") || undefined,
        eligibility: text("eligibility"),
        registrationFee: Number(text("registrationFee")),
        currency: text("currency"),
        contactName: text("contactName"),
        contactEmail: text("contactEmail") || undefined,
        contactPhone: text("contactPhone") || undefined,
      })
      setSelectedId(eventId)
      setEditing(undefined)
      setMessage("Event saved.")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save event"
      )
    }
  }

  const exportRows: ParticipantExportRow[] = (registrations ?? []).map(
    (item) => ({
      registrationCode: item.registrationCode,
      participantName: item.participantName,
      participantEmail: item.participantEmail,
      participantPhone: item.participantPhone,
      memberUuid: item.memberUuid,
      institution: item.institution,
      institutionDivision: item.institutionDivision,
      studentId: item.studentId,
      status: item.status,
      amountPaid: item.amountPaid,
      transactionId: item.transactionId,
      registeredAt: item.registeredAt,
    })
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Event control"
        title="Event operations"
        description="Publish programs, manage registrations, and capture reliable attendance."
        actions={
          <ActionButton onClick={() => setEditing(null)}>
            <CalendarPlus className="size-3.5" /> Create event
          </ActionButton>
        }
      />
      {message && (
        <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-500/10 dark:text-blue-200">
          {message}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Live events"
          value={live.length}
          detail="Published programs"
          icon={CalendarPlus}
          tone="blue"
        />
        <MetricCard
          label="Registrations"
          value={totalRegistrations}
          detail="Active across all events"
          icon={TicketCheck}
          tone="violet"
        />
        <MetricCard
          label="Seats available"
          value={Math.max(0, capacity - totalRegistrations)}
          detail="Across configured capacity"
          icon={UsersRound}
          tone="cyan"
        />
        <MetricCard
          label="Attendance rate"
          value={
            decidedAttendance
              ? Math.round((attended / decidedAttendance) * 100)
              : 0
          }
          suffix="%"
          detail="For selected event"
          icon={CheckCircle2}
          tone="emerald"
        />
      </div>
      {editing !== undefined && (
        <EventEditor
          event={editing}
          onSave={onSave}
          onClose={() => setEditing(undefined)}
        />
      )}
      <Tabs defaultValue="events" variant="underline">
        <TabsList className="w-full overflow-x-auto bg-transparent">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {events?.map((event) => (
              <article
                key={event._id}
                className={`rounded-2xl border bg-white p-5 dark:bg-slate-950/60 ${event._id === effectiveSelectedId ? "border-blue-500" : "border-slate-200 dark:border-white/10"}`}
              >
                <div className="flex items-center justify-between">
                  <StatusPill
                    tone={
                      event.status === "published"
                        ? "green"
                        : event.status === "draft"
                          ? "amber"
                          : "slate"
                    }
                  >
                    {event.status}
                  </StatusPill>
                  <span className="text-xs text-slate-500">
                    {event.activeRegistrationCount}/{event.capacity}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold">{event.name}</h2>
                <p className="mt-2 text-xs text-slate-500">
                  {new Date(event.startsAt).toLocaleString()} · {event.venue}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedId(event._id)}
                    className="text-xs font-semibold text-blue-600"
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => setEditing(event)}
                    className="text-xs font-semibold text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      void (async () => {
                        const id = await clone({ eventId: event._id })
                        setSelectedId(id)
                        setMessage("Draft clone created.")
                      })()
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600"
                  >
                    <Copy className="size-3" /> Clone
                  </button>
                  {event.status !== "archived" && (
                    <button
                      onClick={() =>
                        void (async () => {
                          await archive({ eventId: event._id })
                          setMessage("Event archived.")
                        })()
                      }
                      className="text-xs font-semibold text-red-600"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="registrations">
          <Panel
            title={
              selected ? `${selected.name} registrations` : "Select an event"
            }
            description="Payment and eligibility review"
            action={
              selected && (
                <div className="flex flex-wrap gap-2">
                  <ExportButton
                    label="CSV"
                    onClick={() =>
                      downloadParticipantsCsv(selected.name, exportRows)
                    }
                  />
                  <ExportButton
                    label="XLSX"
                    onClick={() =>
                      downloadParticipantsXlsx(selected.name, exportRows)
                    }
                  />
                  <ExportButton
                    label="PDF"
                    onClick={() =>
                      downloadParticipantsPdf(selected.name, exportRows)
                    }
                  />
                </div>
              )
            }
          >
            <RegistrationTable
              items={registrations ?? []}
              onReview={async (id, status, amountPaid) => {
                try {
                  await review({ registrationId: id, status, amountPaid })
                  setMessage(`Registration ${status}.`)
                } catch (error) {
                  setMessage(
                    error instanceof Error ? error.message : "Review failed"
                  )
                }
              }}
            />
          </Panel>
        </TabsContent>
        <TabsContent value="attendance">
          <Panel
            title={selected ? `${selected.name} attendance` : "Select an event"}
          >
            <div className="divide-y divide-slate-100 dark:divide-white/8">
              {registrations
                ?.filter((item) =>
                  ["confirmed", "attended", "absent"].includes(item.status)
                )
                .map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {item.participantName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.registrationCode}
                      </p>
                    </div>
                    <StatusPill
                      tone={
                        item.status === "attended"
                          ? "green"
                          : item.status === "absent"
                            ? "slate"
                            : "blue"
                      }
                    >
                      {item.status}
                    </StatusPill>
                    <button
                      onClick={() =>
                        void attendance({
                          registrationId: item._id,
                          attended: true,
                        })
                      }
                      className="text-xs font-semibold text-emerald-600"
                    >
                      Present
                    </button>
                    <button
                      onClick={() =>
                        void attendance({
                          registrationId: item._id,
                          attended: false,
                        })
                      }
                      className="text-xs font-semibold text-slate-600"
                    >
                      Absent
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

function ExportButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void | Promise<void>
}) {
  return (
    <button
      onClick={() => void onClick()}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold dark:border-white/10"
    >
      <Download className="size-3" />
      {label}
    </button>
  )
}

type ManagedRegistration = Doc<"eventRegistrations"> & {
  participantName: string
  participantEmail: string
  participantPhone: string
  memberUuid?: string
}
function RegistrationTable({
  items,
  onReview,
}: {
  items: ManagedRegistration[]
  onReview: (
    id: Id<"eventRegistrations">,
    status: "confirmed" | "rejected",
    amountPaid?: number
  ) => Promise<void>
}) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-white/8">
      {items.map((item) => (
        <article
          key={item._id}
          className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-center"
        >
          <div>
            <h3 className="text-sm font-semibold">{item.participantName}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {item.participantEmail} · {item.institution ?? "Member profile"}
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <p>{item.registrationCode}</p>
            <p className="mt-1">
              Payment: {item.transactionId ?? "Free"} · {item.amountPaid}
            </p>
          </div>
          <StatusPill
            tone={
              item.status === "confirmed" || item.status === "attended"
                ? "green"
                : item.status === "pending"
                  ? "amber"
                  : "slate"
            }
          >
            {item.status}
          </StatusPill>
          <div className="flex gap-2">
            {item.status === "pending" && (
              <>
                <button
                  onClick={() =>
                    void onReview(
                      item._id,
                      "confirmed",
                      item.transactionId ? undefined : 0
                    )
                  }
                  className="text-xs font-semibold text-emerald-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => void onReview(item._id, "rejected")}
                  className="text-xs font-semibold text-red-600"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </article>
      ))}
      {items.length === 0 && (
        <p className="p-8 text-center text-sm text-slate-500">
          No registrations for this event.
        </p>
      )}
    </div>
  )
}

function EventEditor({
  event,
  onSave,
  onClose,
}: {
  event: Doc<"events"> | null
  onSave: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onClose: () => void
}) {
  const local = (value?: number) =>
    value
      ? new Date(value - new Date(value).getTimezoneOffset() * 60_000)
          .toISOString()
          .slice(0, 16)
      : ""
  return (
    <Panel title={event ? `Edit ${event.name}` : "Create event"}>
      <form
        onSubmit={(formEvent) => void onSave(formEvent)}
        className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3"
      >
        <EditorInput
          name="name"
          label="Name"
          defaultValue={event?.name}
          required
        />
        <EditorInput
          name="slug"
          label="Slug"
          defaultValue={event?.slug}
          required
        />
        <EditorInput
          name="category"
          label="Category"
          defaultValue={event?.category ?? "Workshop"}
          required
        />
        <EditorSelect
          name="scope"
          label="Scope"
          defaultValue={event?.scope ?? "national"}
          options={["intra_cuet", "divisional", "national"]}
        />
        <EditorSelect
          name="audience"
          label="Audience"
          defaultValue={event?.audience ?? "public"}
          options={["public", "members", "executives"]}
        />
        <EditorSelect
          name="status"
          label="Status"
          defaultValue={event?.status ?? "draft"}
          options={["draft", "published", "cancelled", "completed", "archived"]}
        />
        <EditorInput
          name="startsAt"
          label="Starts"
          type="datetime-local"
          defaultValue={local(event?.startsAt)}
          required
        />
        <EditorInput
          name="endsAt"
          label="Ends"
          type="datetime-local"
          defaultValue={local(event?.endsAt)}
          required
        />
        <EditorInput
          name="registrationDeadline"
          label="Registration deadline"
          type="datetime-local"
          defaultValue={local(event?.registrationDeadline)}
          required
        />
        <EditorInput
          name="venue"
          label="Venue"
          defaultValue={event?.venue}
          required
        />
        <EditorInput
          name="organizer"
          label="Organizer"
          defaultValue={event?.organizer ?? "ASRRO"}
          required
        />
        <EditorInput
          name="capacity"
          label="Capacity"
          type="number"
          min="1"
          defaultValue={event?.capacity ?? 100}
          required
        />
        <EditorInput
          name="registrationFee"
          label="Fee"
          type="number"
          min="0"
          defaultValue={event?.registrationFee ?? 0}
          required
        />
        <EditorInput
          name="currency"
          label="Currency"
          defaultValue={event?.currency ?? "BDT"}
          required
        />
        <EditorInput
          name="contactName"
          label="Contact name"
          defaultValue={event?.contactName}
          required
        />
        <EditorInput
          name="contactEmail"
          label="Contact email"
          type="email"
          defaultValue={event?.contactEmail}
        />
        <EditorInput
          name="contactPhone"
          label="Contact phone"
          defaultValue={event?.contactPhone}
        />
        <EditorArea
          name="summary"
          label="Summary"
          defaultValue={event?.summary}
          required
        />
        <EditorArea
          name="description"
          label="Description"
          defaultValue={event?.description}
          required
        />
        <EditorArea
          name="eligibility"
          label="Eligibility"
          defaultValue={event?.eligibility}
          required
        />
        <EditorArea name="rules" label="Rules" defaultValue={event?.rules} />
        <div className="flex gap-2 md:col-span-2 xl:col-span-3">
          <ActionButton type="submit">Save event</ActionButton>
          <ActionButton type="button" variant="secondary" onClick={onClose}>
            Cancel
          </ActionButton>
        </div>
      </form>
    </Panel>
  )
}
function EditorInput({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span>{label}</span>
      <input
        {...props}
        className="min-h-10 rounded-lg border border-slate-200 bg-transparent px-3 dark:border-white/10"
      />
    </label>
  )
}
function EditorArea({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span>{label}</span>
      <textarea
        {...props}
        rows={3}
        className="rounded-lg border border-slate-200 bg-transparent p-3 dark:border-white/10"
      />
    </label>
  )
}
function EditorSelect({
  label,
  options,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: string[]
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span>{label}</span>
      <select
        {...props}
        className="min-h-10 rounded-lg border border-slate-200 bg-transparent px-3 dark:border-white/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  )
}
