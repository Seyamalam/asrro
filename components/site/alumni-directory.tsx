"use client"
import { useMemo, useState } from "react"
import { Search, ExternalLink } from "lucide-react"
import { alumni } from "@/content/public-data"
import { PersonOrb } from "@/components/shared/person-orb"

export function AlumniDirectory() {
  const [query, setQuery] = useState("")
  const [department, setDepartment] = useState("All")
  const [year, setYear] = useState("All")
  const departments = ["All", ...new Set(alumni.map((a) => a.department))]
  const years = ["All", ...new Set(alumni.map((a) => a.year))]
  const list = useMemo(
    () =>
      alumni.filter(
        (a) =>
          (department === "All" || a.department === department) &&
          (year === "All" || a.year === year) &&
          `${a.name} ${a.workplace} ${a.interests.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [query, department, year]
  )
  return (
    <>
      <div className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-[#09182a] p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search alumni</span>
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#71869e]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, workplaces, or interests"
            className="h-12 w-full rounded-full border border-white/10 bg-[#06101f] pr-4 pl-11 outline-none focus:border-[#57e6e6]"
          />
        </label>
        <Select
          label="Department"
          value={department}
          options={departments}
          set={setDepartment}
        />
        <Select
          label="Graduation year"
          value={year}
          options={years}
          set={setYear}
        />
      </div>
      <p className="mb-5 font-mono text-[10px] tracking-[.18em] text-[#8296ad] uppercase">
        {list.length} alumni in view
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((person) => (
          <article
            key={person.name}
            className="rounded-2xl border border-white/10 bg-[#09182a] p-6"
          >
            <div className="flex items-start gap-4">
              <PersonOrb
                initials={person.initials}
                className="size-16 shrink-0 text-lg"
              />
              <div>
                <h2 className="text-xl font-semibold">{person.name}</h2>
                <p className="mt-1 text-sm text-[#57e6e6]">
                  {person.workplace}
                </p>
              </div>
              <ExternalLink className="ml-auto size-4 text-[#71869e]" />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm">
              <div>
                <dt className="font-mono text-[9px] tracking-[.15em] text-[#71869e] uppercase">
                  Department
                </dt>
                <dd className="mt-1 text-[#b9c8d9]">{person.department}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] tracking-[.15em] text-[#71869e] uppercase">
                  Batch / grad
                </dt>
                <dd className="mt-1 text-[#b9c8d9]">
                  {person.batch} / {person.year}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {person.interests.map((i) => (
                <span
                  key={i}
                  className="rounded-full border border-[#3d8bff]/25 px-2.5 py-1 text-xs text-[#9fb1c5]"
                >
                  {i}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
function Select({
  label,
  value,
  options,
  set,
}: {
  label: string
  value: string
  options: string[]
  set: (v: string) => void
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
        className="h-12 min-w-44 rounded-full border border-white/10 bg-[#06101f] px-4 outline-none focus:border-[#57e6e6]"
      >
        <option value="All">All {label.toLowerCase()}s</option>
        {options.slice(1).map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}
