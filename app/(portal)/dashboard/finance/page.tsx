import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Banknote,
  Download,
  Landmark,
  Plus,
  WalletCards,
} from "lucide-react"

import {
  CashFlowChart,
  ExpenseDonut,
} from "@/components/dashboard/dashboard-charts"
import {
  ActionButton,
  Delta,
  MetricCard,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/dashboard/dashboard-kit"
import { formatMoney } from "@/lib/format"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs"
import { transactions } from "@/data/dashboard-data"

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Restricted finance"
        title="Financial operations"
        description="Income, expenditure, budgets, and audit-ready statements for authorized executives."
        actions={
          <>
            <ActionButton variant="secondary">
              <Download className="size-3.5" />
              Export report
            </ActionButton>
            <ActionButton>
              <Plus className="size-3.5" />
              Add transaction
            </ActionButton>
          </>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/60">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Landmark className="size-4 text-blue-600" />
          Reporting period
        </div>
        <Tabs defaultValue="monthly" variant="segment">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="hidden">
            {null}
          </TabsContent>
          <TabsContent value="quarterly" className="hidden">
            {null}
          </TabsContent>
          <TabsContent value="yearly" className="hidden">
            {null}
          </TabsContent>
        </Tabs>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Available balance"
          value={748_500}
          prefix="৳"
          detail="Across operating accounts"
          icon={WalletCards}
          tone="blue"
        />
        <MetricCard
          label="Income · August"
          value={184_000}
          prefix="৳"
          detail="12.4% above July pace"
          icon={ArrowDownToLine}
          tone="emerald"
        />
        <MetricCard
          label="Expense · August"
          value={121_000}
          prefix="৳"
          detail="8.2% below forecast"
          icon={ArrowUpFromLine}
          tone="amber"
        />
        <MetricCard
          label="Committed budget"
          value={312_000}
          prefix="৳"
          detail="Rover Challenge and equipment"
          icon={Banknote}
          tone="violet"
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,.6fr)]">
        <Panel
          title="Cash flow trend"
          description="Income and expenditure, March–August 2026"
          action={<Delta value="18.6% net growth" />}
        >
          <div className="p-5">
            <CashFlowChart />
          </div>
        </Panel>
        <Panel
          title="Expense allocation"
          description="Current quarter by category"
        >
          <div className="p-5">
            <ExpenseDonut />
          </div>
        </Panel>
      </div>
      <Panel
        title="Recent transactions"
        description="Latest verified ledger activity"
        action={
          <button type="button" className="text-xs font-semibold text-blue-600">
            View ledger
          </button>
        }
      >
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] tracking-wider text-slate-400 uppercase dark:border-white/8">
                <th className="px-5 py-3">Transaction</th>
                <th className="py-3">Category</th>
                <th className="py-3">Date</th>
                <th className="py-3">Type</th>
                <th className="px-5 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/8">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {transaction.id}
                    </p>
                  </td>
                  <td className="py-4 text-xs text-slate-500">
                    {transaction.category}
                  </td>
                  <td className="py-4 text-xs text-slate-500">
                    {transaction.date}
                  </td>
                  <td className="py-4">
                    <StatusPill
                      tone={transaction.type === "Income" ? "green" : "amber"}
                    >
                      {transaction.type}
                    </StatusPill>
                  </td>
                  <td
                    className={`px-5 py-4 text-right text-xs font-bold tabular-nums ${transaction.amount > 0 ? "text-emerald-600" : "text-slate-800 dark:text-slate-100"}`}
                  >
                    {transaction.amount > 0 ? "+" : "−"}
                    {formatMoney(Math.abs(transaction.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-slate-100 md:hidden dark:divide-white/8">
          {transactions.map((transaction) => (
            <article key={transaction.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {transaction.description}
                  </h3>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {transaction.id} · {transaction.date}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-xs font-bold ${transaction.amount > 0 ? "text-emerald-600" : "text-slate-800 dark:text-slate-100"}`}
                >
                  {transaction.amount > 0 ? "+" : "−"}
                  {formatMoney(Math.abs(transaction.amount))}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {transaction.category}
                </span>
                <StatusPill
                  tone={transaction.type === "Income" ? "green" : "amber"}
                >
                  {transaction.type}
                </StatusPill>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  )
}
