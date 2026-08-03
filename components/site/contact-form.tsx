"use client"
import { useState } from "react"
import { CheckCircle2, Send } from "lucide-react"

export function ContactForm() {
  const [sent, setSent] = useState(false)
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
            The ASRRO team usually responds within two working days. A copy has
            been prepared for your email.
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
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
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
      <button
        type="submit"
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#57e6e6] px-5 font-semibold text-[#03101e]"
      >
        Send message <Send className="size-4" />
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
