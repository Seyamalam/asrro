import { CheckCircle2, FileCheck2, ReceiptText } from "lucide-react"

import {
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import {
  MembershipCard,
  MembershipDetails,
} from "@/components/dashboard/membership-card"
import {
  MembershipCardDownloadButton,
  MembershipReceiptDownloadButton,
} from "@/components/dashboard/membership-download-button"
import { currentMember } from "@/data/dashboard-data"

export default function MembershipPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Digital credential"
        title="Membership card"
        description="Your permanent ASRRO identity and membership payment records."
        actions={<MembershipCardDownloadButton label="Download card" />}
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)]">
        <div className="space-y-4">
          <MembershipCard />
          <Panel className="p-5">
            <MembershipDetails />
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel
            title="Membership record"
            description="Matched with the ASRRO member directory."
          >
            <dl className="divide-y divide-slate-100 px-5 dark:divide-white/8">
              {[
                [
                  "Status",
                  <StatusPill key="status" tone="green">
                    Active
                  </StatusPill>,
                ],
                ["Member UUID", currentMember.uuid],
                ["Department", currentMember.department],
                ["Academic batch", currentMember.batch],
                ["Validity", currentMember.validUntil],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {label}
                  </dt>
                  <dd className="text-right text-xs font-semibold text-slate-800 dark:text-slate-100">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel title="Payment receipts">
            <div className="divide-y divide-slate-100 dark:divide-white/8">
              {[
                {
                  period: "2026 annual membership",
                  date: "14 Jan 2026",
                  amount: "৳500",
                  id: "RCPT-260114-53",
                },
                {
                  period: "2025 annual membership",
                  date: "11 Jan 2025",
                  amount: "৳500",
                  id: "RCPT-250111-71",
                },
              ].map((receipt) => (
                <div
                  key={receipt.id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <ReceiptText className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {receipt.period}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {receipt.date} · {receipt.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold">{receipt.amount}</p>
                    <MembershipReceiptDownloadButton receipt={receipt} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-400/15 dark:bg-emerald-500/8 dark:text-emerald-100">
            <FileCheck2 className="size-5 shrink-0" />
            <div>
              <p className="text-xs font-semibold">Credential ready</p>
              <p className="mt-1 text-[11px] leading-5 opacity-75">
                The QR code and downloadable card use the same permanent member
                UUID.
              </p>
            </div>
            <CheckCircle2 className="ml-auto size-4 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
