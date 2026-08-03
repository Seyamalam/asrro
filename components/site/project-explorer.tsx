"use client"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowUpRight, Search } from "lucide-react"
import { projects } from "@/content/public-data"
import { SignalVisual } from "@/components/shared/signal-visual"

const categories = [
  "All",
  "Robotics",
  "AI",
  "Space",
  "Embedded Systems",
  "IoT",
  "Electronics",
]
const statuses = ["All", "Ongoing", "Completed", "Research", "Competition"]

export function ProjectExplorer() {
  const [category, setCategory] = useState("All")
  const [status, setStatus] = useState("All")
  const [query, setQuery] = useState("")
  const filtered = useMemo(
    () =>
      projects.filter(
        (project) =>
          (category === "All" || project.category === category) &&
          (status === "All" || project.status === status) &&
          `${project.title} ${project.summary} ${project.stack.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [category, status, query]
  )
  return (
    <div>
      <div className="mb-8 grid gap-4 rounded-2xl border border-white/10 bg-[#09182a] p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <label className="relative">
          <span className="sr-only">Search projects</span>
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#71869e]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or technology"
            className="h-12 w-full rounded-full border border-white/10 bg-[#06101f] pr-4 pl-11 text-sm outline-none placeholder:text-[#60758c] focus:border-[#57e6e6]"
          />
        </label>
        <FilterGroup
          label="Discipline"
          options={categories}
          value={category}
          onChange={setCategory}
        />
        <FilterGroup
          label="Status"
          options={statuses}
          value={status}
          onChange={setStatus}
        />
      </div>
      <p className="mb-5 font-mono text-[10px] tracking-[.18em] text-[#8296ad] uppercase">
        {filtered.length} mission records
      </p>
      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#09182a] transition hover:-translate-y-1 hover:border-[#57e6e6]/50"
            >
              <SignalVisual
                code={`R&D—${String(index + 1).padStart(2, "0")}`}
                className="aspect-[16/9] border-b border-white/10"
                compact
              />
              <div className="p-6">
                <div className="flex items-center justify-between font-mono text-[9px] tracking-[.17em] text-[#8296ad] uppercase">
                  <span>{project.category}</span>
                  <span className="text-[#ffb84d]">{project.status}</span>
                </div>
                <h2 className="mt-5 flex items-start justify-between gap-4 text-2xl font-semibold tracking-[-.035em] group-hover:text-[#57e6e6]">
                  {project.title}
                  <ArrowUpRight className="mt-1 size-4 shrink-0" />
                </h2>
                <p className="mt-3 leading-7 text-[#9fb1c5]">
                  {project.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] text-[#8fa7c0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-[#9fb1c5]">
          No project records match those filters. Try another discipline or
          clear the search.
        </div>
      )}
    </div>
  )
}
function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 min-w-40 rounded-full border border-white/10 bg-[#06101f] px-4 text-sm text-[#dce9f5] outline-none focus:border-[#57e6e6]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}
