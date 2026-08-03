"use client"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = ["Identity", "Academic", "Contact", "Payment"]
export function MembershipFlow() {
  const [step, setStep] = useState(0)
  const [complete, setComplete] = useState(false)
  if (complete)
    return (
      <div className="rounded-3xl border border-[#57e6e6]/35 bg-[#0a1c2f] p-10 text-center sm:p-16">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#57e6e6]/10 text-[#57e6e6]">
          <Check className="size-7" />
        </div>
        <p className="mt-6 font-mono text-[10px] tracking-[.2em] text-[#ffb84d] uppercase">
          Application preview complete
        </p>
        <h2 className="mt-4 text-3xl font-semibold">
          Your record is ready for review.
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#9fb1c5]">
          This demonstration does not store personal data. In the connected
          portal, you would receive a tracking reference and confirmation email
          here.
        </p>
        <button
          onClick={() => {
            setStep(0)
            setComplete(false)
          }}
          className="mt-7 text-sm text-[#57e6e6] underline"
        >
          Start over
        </button>
      </div>
    )
  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside>
        <ol className="grid grid-cols-4 gap-2 lg:grid-cols-1">
          {steps.map((label, index) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3",
                index === step
                  ? "border-[#57e6e6]/40 bg-[#57e6e6]/5"
                  : "border-white/10"
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full font-mono text-[10px]",
                  index < step
                    ? "bg-[#57e6e6] text-[#03101e]"
                    : "bg-white/5 text-[#9fb1c5]"
                )}
              >
                {index < step ? <Check className="size-3" /> : index + 1}
              </span>
              <span className="hidden text-sm lg:block">{label}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 hidden rounded-xl border border-white/10 p-4 text-xs leading-5 text-[#8296ad] lg:block">
          <ShieldCheck className="mb-3 size-5 text-[#57e6e6]" />
          Your personal and payment records are visible only to authorized
          committee reviewers.
        </div>
      </aside>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (step === 3) setComplete(true)
          else setStep((s) => s + 1)
        }}
        className="rounded-2xl border border-white/10 bg-[#09182a] p-6 sm:p-8"
      >
        <p className="font-mono text-[10px] tracking-[.2em] text-[#57e6e6] uppercase">
          Step {step + 1} of 4
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">
          {
            [
              "Tell us who you are.",
              "Your CUET journey.",
              "How can we reach you?",
              "Confirm membership fee.",
            ][step]
          }
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {step === 0 && (
            <>
              <Field label="Full name" name="fullName" />
              <Field label="Date of birth" name="dob" type="date" />
              <Select
                label="Gender"
                name="gender"
                options={["Female", "Male", "Non-binary", "Prefer not to say"]}
              />
              <Select
                label="Blood group"
                name="blood"
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              />
            </>
          )}
          {step === 1 && (
            <>
              <Field label="Student ID" name="studentId" />
              <Select
                label="Department"
                name="department"
                options={[
                  "CSE",
                  "EEE",
                  "ME",
                  "ETE",
                  "CE",
                  "MIE",
                  "URP",
                  "Architecture",
                  "PME",
                  "WRE",
                ]}
              />
              <Field label="Current semester" name="semester" />
              <Field label="HSC batch" name="hsc" />
            </>
          )}
          {step === 2 && (
            <>
              <Field label="Email" name="email" type="email" />
              <Field label="Phone number" name="phone" type="tel" />
              <div className="sm:col-span-2">
                <Field label="Current address" name="address" />
              </div>
              <Field label="Emergency contact" name="emergency" type="tel" />
            </>
          )}
          {step === 3 && (
            <>
              <Select
                label="Payment method"
                name="payment"
                options={["bKash", "Nagad", "Rocket"]}
              />
              <Field label="Transaction ID" name="transaction" />
              <div className="rounded-xl border border-[#ffb84d]/25 bg-[#ffb84d]/5 p-4 text-sm leading-6 text-[#d8c29f] sm:col-span-2">
                Membership fee: <strong className="text-white">BDT 300</strong>.
                Send payment using your phone number as the reference, then
                enter the transaction ID.
              </div>
            </>
          )}
        </div>
        <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-[#9fb1c5] disabled:opacity-30"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#57e6e6] px-5 font-semibold text-[#03101e]"
          >
            {step === 3 ? "Review application" : "Continue"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
function Field({
  label,
  ...props
}: {
  label: string
  name: string
  type?: string
}) {
  return (
    <label>
      <span className="mb-2 block text-sm">{label}</span>
      <input
        required
        className="h-12 w-full rounded-full border border-white/10 bg-[#06101f] px-4 outline-none focus:border-[#57e6e6]"
        {...props}
      />
    </label>
  )
}
function Select({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: string[]
}) {
  return (
    <label>
      <span className="mb-2 block text-sm">{label}</span>
      <select
        required
        name={name}
        defaultValue=""
        className="h-12 w-full rounded-full border border-white/10 bg-[#06101f] px-4 outline-none focus:border-[#57e6e6]"
      >
        <option value="" disabled>
          Select one
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}
