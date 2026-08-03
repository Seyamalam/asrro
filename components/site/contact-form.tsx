"use client"
import { useMutation } from "convex/react"
import { CheckCircle2, Send } from "lucide-react"
import { useState, type FormEvent } from "react"
import { api } from "@/convex/_generated/api"

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submitMessage = useMutation(api.contact.submit)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setSubmitting(true)
    setError(null)
    try {
      await submitMessage({
        name: String(data.get("name")),
        email: String(data.get("email")),
        subject: String(data.get("subject")),
        message: String(data.get("message")),
      })
      form.reset()
      setSent(true)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The message could not be sent. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (sent)
    return (
      <div
        role="status"
        className="grid min-h-[25rem] place-items-center rounded-2xl border border-[#57e6e6]/30 bg-[#57e6e6]/5 p-8 text-center"
      >
        <div>
          <CheckCircle2 className="mx-auto size-10 text-[#57e6e6]" />
          <h2 className="mt-5 text-2xl font-semibold">Message in the queue.</h2>
          <p className="mt-3 max-w-md text-[#9fb1c5]">
            The ASRRO team usually responds within two working days. Keep an eye
            on your inbox for the reply.
          </p>
          <button
            className="mt-6 text-sm text-[#57e6e6] underline"
            onClick={() => setSent(false)}
          >
            Send another message
          </button>
        </div>
      </div>
    )
  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event)
      }}
      className="rounded-2xl border border-white/10 bg-[#09182a] p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Your full name" />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
        />
        <div className="sm:col-span-2">
          <Field
            label="Subject"
            name="subject"
            placeholder="What would you like to discuss?"
          />
        </div>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Message</span>
          <textarea
            required
            name="message"
            rows={6}
            placeholder="Include any dates, project names, or event details that will help us reply."
            className="w-full rounded-xl border border-white/10 bg-[#06101f] px-4 py-3 outline-none placeholder:text-[#52677e] focus:border-[#57e6e6]"
          />
        </label>
      </div>
      {error ? (
        <p role="alert" className="mt-5 text-sm leading-6 text-red-300">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#57e6e6] px-5 font-semibold text-[#03101e]"
      >
        {submitting ? "Sending…" : "Send message"} <Send className="size-4" />
      </button>
    </form>
  )
}
function Field({
  label,
  ...props
}: {
  label: string
  name: string
  type?: string
  placeholder: string
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        required
        className="h-12 w-full rounded-full border border-white/10 bg-[#06101f] px-4 outline-none placeholder:text-[#52677e] focus:border-[#57e6e6]"
        {...props}
      />
    </label>
  )
}
