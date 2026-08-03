"use client"
import { useMutation } from "convex/react"
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react"
import { useState, type FormEvent } from "react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"

const steps = ["Identity", "Academic", "Contact", "Payment"]
export function MembershipFlow() {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{
    applicationCode: string
    trackingToken: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const submitApplication = useMutation(api.membership.submitApplication)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const values = Object.fromEntries(
      [...new FormData(event.currentTarget)].map(([key, value]) => [
        key,
        String(value),
      ])
    )
    const nextDraft = { ...draft, ...values }
    setDraft(nextDraft)

    if (step < 3) {
      setStep((currentStep) => currentStep + 1)
      return
    }

    setSubmitting(true)
    try {
      const response = await submitApplication({
        fullName: nextDraft.fullName,
        ...(nextDraft.dob ? { dateOfBirth: nextDraft.dob } : {}),
        gender: nextDraft.gender,
        ...(nextDraft.blood ? { bloodGroup: nextDraft.blood } : {}),
        email: nextDraft.email,
        phone: nextDraft.phone,
        institute: "CUET",
        universityName: "Chittagong University of Engineering & Technology",
        department: nextDraft.department,
        semester: nextDraft.semester,
        studentId: nextDraft.studentId,
        hscBatch: nextDraft.hsc,
        address: nextDraft.address,
        emergencyContact: nextDraft.emergency,
        paymentMethod: paymentMethod(nextDraft.payment),
        transactionId: nextDraft.transaction,
      })
      setResult({
        applicationCode: response.applicationCode,
        trackingToken: response.trackingToken,
      })
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The application could not be submitted. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (result)
    return (
      <div className="rounded-3xl border border-[#57e6e6]/35 bg-[#0a1c2f] p-10 text-center sm:p-16">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#57e6e6]/10 text-[#57e6e6]">
          <Check className="size-7" />
        </div>
        <p className="mt-6 font-mono text-[10px] tracking-[.2em] text-[#ffb84d] uppercase">
          Application received
        </p>
        <h2 className="mt-4 text-3xl font-semibold">
          Your record is queued for review.
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#9fb1c5]">
          Keep both references somewhere private. You will need them to check
          the status of this application.
        </p>
        <dl className="mx-auto mt-6 grid max-w-lg gap-3 rounded-2xl border border-white/10 bg-[#06101f] p-5 text-left sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] tracking-[.16em] text-[#8296ad] uppercase">
              Application code
            </dt>
            <dd className="mt-2 font-mono text-sm text-white">
              {result.applicationCode}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[.16em] text-[#8296ad] uppercase">
              Tracking token
            </dt>
            <dd className="mt-2 font-mono text-sm break-all text-white">
              {result.trackingToken}
            </dd>
          </div>
        </dl>
        <button
          onClick={() => {
            setStep(0)
            setDraft({})
            setResult(null)
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
        onSubmit={(event) => {
          void handleSubmit(event)
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
              <Field
                label="Full name"
                name="fullName"
                defaultValue={draft.fullName}
              />
              <Field
                label="Date of birth (optional)"
                name="dob"
                type="date"
                required={false}
                defaultValue={draft.dob}
              />
              <Select
                label="Gender"
                name="gender"
                defaultValue={draft.gender}
                options={["Female", "Male", "Non-binary", "Prefer not to say"]}
              />
              <Select
                label="Blood group"
                name="blood"
                defaultValue={draft.blood}
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              />
            </>
          )}
          {step === 1 && (
            <>
              <Field
                label="Student ID"
                name="studentId"
                defaultValue={draft.studentId}
              />
              <Select
                label="Department"
                name="department"
                defaultValue={draft.department}
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
              <Field
                label="Current semester"
                name="semester"
                defaultValue={draft.semester}
              />
              <Field label="HSC batch" name="hsc" defaultValue={draft.hsc} />
            </>
          )}
          {step === 2 && (
            <>
              <Field
                label="Email"
                name="email"
                type="email"
                defaultValue={draft.email}
              />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                defaultValue={draft.phone}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Current address"
                  name="address"
                  defaultValue={draft.address}
                />
              </div>
              <Field
                label="Emergency contact"
                name="emergency"
                type="tel"
                defaultValue={draft.emergency}
              />
            </>
          )}
          {step === 3 && (
            <>
              <Select
                label="Payment method"
                name="payment"
                defaultValue={draft.payment}
                options={["bKash", "Nagad", "Rocket"]}
              />
              <Field
                label="Transaction ID"
                name="transaction"
                defaultValue={draft.transaction}
              />
              <div className="rounded-xl border border-[#ffb84d]/25 bg-[#ffb84d]/5 p-4 text-sm leading-6 text-[#d8c29f] sm:col-span-2">
                Membership fee: <strong className="text-white">BDT 300</strong>.
                Send payment using your phone number as the reference, then
                enter the transaction ID.
              </div>
            </>
          )}
        </div>
        {error ? (
          <p role="alert" className="mt-5 text-sm leading-6 text-red-300">
            {error}
          </p>
        ) : null}
        <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-[#9fb1c5] disabled:opacity-30"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#57e6e6] px-5 font-semibold text-[#03101e]"
          >
            {submitting
              ? "Submitting…"
              : step === 3
                ? "Submit application"
                : "Continue"}
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
  required?: boolean
  defaultValue?: string
}) {
  const { required = true, ...fieldProps } = props
  return (
    <label>
      <span className="mb-2 block text-sm">{label}</span>
      <input
        required={required}
        className="h-12 w-full rounded-full border border-white/10 bg-[#06101f] px-4 outline-none focus:border-[#57e6e6]"
        {...fieldProps}
      />
    </label>
  )
}
function Select({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string
  name: string
  options: string[]
  defaultValue?: string
}) {
  return (
    <label>
      <span className="mb-2 block text-sm">{label}</span>
      <select
        required
        name={name}
        defaultValue={defaultValue ?? ""}
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

function paymentMethod(value: string | undefined) {
  if (value === "bKash") return "bkash" as const
  if (value === "Nagad") return "nagad" as const
  return "rocket" as const
}
