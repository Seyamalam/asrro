import { CalendarCheck, Orbit, ShieldCheck } from "lucide-react"
import Image from "next/image"

import { MembershipCardDownloadButton } from "@/components/dashboard/membership-download-button"
import { currentMember } from "@/data/dashboard-data"
import { membershipQrPattern } from "@/data/membership-card"

export function MembershipCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative aspect-[85.6/53.98] w-full max-w-[46rem] overflow-hidden rounded-[1.4rem] bg-[#08182d] p-4 text-white shadow-[0_18px_60px_rgba(15,40,85,0.18)] sm:p-6">
      <div
        aria-hidden
        className="absolute -top-32 -right-28 size-72 rounded-full border border-blue-400/25"
      />
      <div
        aria-hidden
        className="absolute -top-16 -right-12 size-48 rounded-full border border-cyan-300/20"
      />
      <div
        aria-hidden
        className="absolute top-12 right-12 size-2 rounded-full bg-cyan-300 shadow-[0_0_18px_3px_rgba(103,232,249,0.45)]"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-white">
            <Image
              src="/asrro-logo.png"
              width={34}
              height={34}
              alt=""
              className="size-8 object-contain"
            />
          </span>
          <div>
            <p className="text-xs font-bold tracking-[0.16em]">ASRRO</p>
            <p className="mt-0.5 text-[8px] tracking-[0.14em] text-slate-400 uppercase">
              Andromeda mission member
            </p>
          </div>
        </div>
        <ShieldCheck
          className="size-5 text-cyan-300"
          aria-label="Active membership"
        />
      </div>
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6 sm:gap-5">
        <div className="min-w-0">
          <div className="mb-2 hidden size-12 place-items-center rounded-2xl border border-white/15 bg-white/8 text-base font-semibold sm:grid">
            {currentMember.initials}
          </div>
          <p className="truncate text-base font-semibold tracking-[-0.025em] sm:text-lg">
            {currentMember.name}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400 sm:mt-1 sm:text-xs">
            {currentMember.shortDepartment} · {currentMember.batch}
          </p>
          <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
            <div>
              <p className="text-[8px] tracking-[0.18em] text-slate-500 uppercase">
                Member UUID
              </p>
              <p className="mt-1 font-mono text-xs font-bold tracking-[0.1em] text-cyan-200 sm:text-sm sm:tracking-[0.12em]">
                {currentMember.uuid}
              </p>
            </div>
            <span className="h-7 w-px bg-white/10 sm:h-8" />
            <div>
              <p className="text-[8px] tracking-[0.18em] text-slate-500 uppercase">
                Valid until
              </p>
              <p className="mt-1 text-[10px] font-semibold sm:text-xs">
                DEC 2026
              </p>
            </div>
          </div>
        </div>
        <div
          className="grid size-16 shrink-0 grid-cols-[repeat(17,1fr)] rounded-lg bg-white p-1.5 shadow-lg sm:size-[5.5rem] sm:p-2"
          style={compact ? { width: 72, height: 72 } : undefined}
          aria-label={`QR code for member ${currentMember.uuid}`}
        >
          {membershipQrPattern.flatMap((row, rowIndex) =>
            [...row].map((cell, columnIndex) => (
              <span
                key={`${rowIndex}-${columnIndex}`}
                className={cell === "1" ? "bg-slate-950" : "bg-white"}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export function MembershipDetails() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5">
        <Orbit className="size-4 shrink-0 text-blue-600" />
        <div>
          <p className="text-[10px] tracking-wider text-slate-400 uppercase">
            Galaxy code
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
            Andromeda · Rigel
          </p>
        </div>
      </div>
      <div className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5">
        <CalendarCheck className="size-4 shrink-0 text-blue-600" />
        <div>
          <p className="text-[10px] tracking-wider text-slate-400 uppercase">
            Member since
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
            {currentMember.joined}
          </p>
        </div>
      </div>
      <MembershipCardDownloadButton
        className="sm:col-span-2"
        label="Download card as PDF"
      />
    </div>
  )
}
