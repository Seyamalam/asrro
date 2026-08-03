"use client"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Search, ArrowUpRight } from "lucide-react"
import { searchIndex } from "@/content/public-data"
export function SearchSurface() {
  const [query, setQuery] = useState("")
  const [type, setType] = useState("All")
  const types = ["All", ...new Set(searchIndex.map((i) => i.type))]
  const list = useMemo(
    () =>
      searchIndex.filter(
        (item) =>
          (type === "All" || item.type === type) &&
          `${item.title} ${item.type} ${item.keywords.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [query, type]
  )
  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-[#09182a] p-4">
        <label className="relative block">
          <Search className="absolute top-1/2 left-5 size-5 -translate-y-1/2 text-[#71869e]" />
          <span className="sr-only">Search ASRRO</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, events, people, research…"
            className="h-16 w-full rounded-full border border-white/10 bg-[#06101f] pr-5 pl-14 text-lg outline-none placeholder:text-[#52677e] focus:border-[#57e6e6]"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {types.map((item) => (
            <button
              key={item}
              onClick={() => setType(item)}
              aria-pressed={type === item}
              className={
                type === item
                  ? "rounded-full bg-[#57e6e6] px-3 py-1.5 text-xs font-semibold text-[#03101e]"
                  : "rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#9fb1c5]"
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <p className="my-6 font-mono text-[10px] tracking-[.18em] text-[#71869e] uppercase">
        {list.length} indexed records
      </p>
      <div className="divide-y divide-white/10 border-y border-white/10">
        {list.slice(0, 24).map((item, index) => (
          <Link
            key={`${item.type}-${item.title}`}
            href={item.href}
            className="group grid gap-2 py-5 sm:grid-cols-[3rem_8rem_1fr_auto] sm:items-center"
          >
            <span className="font-mono text-[9px] text-[#52677e]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[9px] tracking-[.16em] text-[#57e6e6] uppercase">
              {item.type}
            </span>
            <span className="text-lg font-semibold group-hover:text-[#57e6e6]">
              {item.title}
            </span>
            <ArrowUpRight className="size-4 text-[#71869e]" />
          </Link>
        ))}
      </div>
      {list.length ? null : (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-[#9fb1c5]">
          No indexed records match that search. Try a broader term or select
          “All”.
        </div>
      )}
    </>
  )
}
