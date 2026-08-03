import { CalendarCheck, Download, Orbit, ShieldCheck } from "lucide-react"
import Image from "next/image"

import { ActionButton } from "@/components/dashboard/dashboard-kit"
import { currentMember } from "@/data/dashboard-data"

const qrPattern = [
  "11111110101011111",
  "10000010111010001",
  "10111010001010111",
  "10111010111010111",
  "10111010101010111",
  "10000010011010001",
  "11111110101011111",
  "00000000110000000",
  "11010111101100101",
  "00101100010111010",
  "10110110111010111",
  "01001001000101000",
  "11111110110110101",
  "10000010001101010",
  "10111010110111101",
  "10000010101000110",
  "11111110110110101",
]

export function MembershipCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[1.4rem] bg-[#08182d] p-5 text-white shadow-[0_18px_60px_rgba(15,40,85,0.18)] sm:p-6">
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
      <div className="relative flex items-start justify-between gap-4">
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
          aria-label="Verified membership"
        />
      </div>
      <div className="relative mt-8 flex items-end justify-between gap-5">
        <div className="min-w-0">
          <div className="mb-4 grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/8 text-lg font-semibold">
            {currentMember.initials}
          </div>
          <p className="truncate text-lg font-semibold tracking-[-0.025em]">
            {currentMember.name}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {currentMember.shortDepartment} · {currentMember.batch}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div>
              <p className="text-[8px] tracking-[0.18em] text-slate-500 uppercase">
                Member UUID
              </p>
              <p className="mt-1 font-mono text-sm font-bold tracking-[0.12em] text-cyan-200">
                {currentMember.uuid}
              </p>
            </div>
            <span className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-[8px] tracking-[0.18em] text-slate-500 uppercase">
                Valid until
              </p>
              <p className="mt-1 text-xs font-semibold">DEC 2026</p>
            </div>
          </div>
        </div>
        <div
          className="grid shrink-0 grid-cols-[repeat(17,1fr)] rounded-lg bg-white p-2 shadow-lg"
          style={{ width: compact ? 72 : 88, height: compact ? 72 : 88 }}
          aria-label={`QR code for member ${currentMember.uuid}`}
        >
          {qrPattern.flatMap((row, rowIndex) =>
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
      <ActionButton className="sm:col-span-2">
        <Download className="size-3.5" /> Download card as PDF
      </ActionButton>
    </div>
  )
}
