import { financeTrend } from "@/data/dashboard-data"

export function CashFlowChart() {
  const width = 620
  const height = 210
  const insetX = 18
  const insetY = 18
  const max = Math.max(
    ...financeTrend.flatMap((point) => [point.income, point.expense])
  )
  const x = (index: number) =>
    insetX + (index * (width - insetX * 2)) / (financeTrend.length - 1)
  const y = (value: number) =>
    height - insetY - (value / max) * (height - insetY * 2)
  const income = financeTrend
    .map((point, index) => `${x(index)},${y(point.income)}`)
    .join(" ")
  const expense = financeTrend
    .map((point, index) => `${x(index)},${y(point.expense)}`)
    .join(" ")

  return (
    <div>
      <div className="mb-4 flex items-center gap-5 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-blue-600" />
          Income
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-cyan-500" />
          Expense
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height + 32}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="Income and expense trend from March through August"
      >
        <defs>
          <linearGradient id="income-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((line) => (
          <line
            key={line}
            x1="0"
            y1={height - line * (height - 30)}
            x2={width}
            y2={height - line * (height - 30)}
            stroke="currentColor"
            className="text-slate-200 dark:text-white/8"
            strokeDasharray="3 5"
          />
        ))}
        <polygon
          points={`${insetX},${height - insetY} ${income} ${width - insetX},${height - insetY}`}
          fill="url(#income-fill)"
        />
        <polyline
          points={income}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={expense}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {financeTrend.map((point, index) => (
          <g key={point.month}>
            <circle
              cx={x(index)}
              cy={y(point.income)}
              r="3.5"
              fill="#fff"
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            <text
              x={x(index)}
              y={height + 22}
              textAnchor="middle"
              className="fill-slate-400 text-[10px]"
            >
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export function ExpenseDonut() {
  const categories = [
    { label: "Events", value: 38, color: "#2563eb" },
    { label: "Equipment", value: 27, color: "#06b6d4" },
    { label: "Travel", value: 18, color: "#8b5cf6" },
    { label: "Operations", value: 17, color: "#f59e0b" },
  ]
  return (
    <div className="flex flex-col items-center gap-6 py-2 sm:flex-row sm:justify-center">
      <div
        className="relative size-36 shrink-0 rounded-full"
        style={{
          background:
            "conic-gradient(#2563eb 0 38%, #06b6d4 38% 65%, #8b5cf6 65% 83%, #f59e0b 83% 100%)",
        }}
        role="img"
        aria-label="Expense categories: events 38 percent, equipment 27 percent, travel 18 percent, operations 17 percent"
      >
        <div className="absolute inset-5 grid place-items-center rounded-full bg-white text-center dark:bg-slate-950">
          <span>
            <strong className="block text-xl text-slate-950 dark:text-white">
              ৳427k
            </strong>
            <span className="text-[10px] tracking-wider text-slate-400 uppercase">
              Expenses
            </span>
          </span>
        </div>
      </div>
      <div className="grid w-full gap-3">
        {categories.map((category) => (
          <div
            key={category.label}
            className="flex items-center justify-between gap-6 text-xs"
          >
            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.label}
            </span>
            <span className="font-semibold text-slate-800 tabular-nums dark:text-slate-200">
              {category.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
