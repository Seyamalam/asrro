import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { PageHero } from "@/components/shared/page-hero"
import { PersonOrb } from "@/components/shared/person-orb"
import { committee } from "@/content/public-data"

export const metadata: Metadata = {
  title: "Executive Committee",
  description: "Meet ASRRO's current executive committee.",
}
export default function CommitteePage() {
  return (
    <>
      <PageHero
        eyebrow="Executive committee / 2025—26"
        title="Stewards of the mission."
        intro="Elected student leaders coordinate research, events, finance, publications, and member development across ASRRO."
        aside={
          <p className="mt-5 font-mono text-[10px] tracking-[.18em] text-[#ffb84d] uppercase">
            Term closes · June 2027
          </p>
        }
      />
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[88rem] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {committee.map((person, index) => (
            <article
              key={person.name}
              className="group rounded-2xl border border-white/10 bg-[#09182a] p-6"
            >
              <div className="flex items-start justify-between">
                <PersonOrb initials={person.initials} className="size-20" />
                <span className="font-mono text-[9px] text-[#71869e]">
                  EC-{String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-8 font-mono text-[9px] tracking-[.17em] text-[#57e6e6] uppercase">
                {person.role}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]">
                {person.name}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#8fa7c0]">
                {person.department}
                <br />
                Session {person.session}
              </p>
              <a
                href={`mailto:${person.name.toLowerCase().replaceAll(" ", ".")}@asrro.org`}
                className="mt-6 inline-flex items-center gap-2 text-sm text-[#b9c8d9] hover:text-[#57e6e6]"
              >
                <Mail className="size-4" />
                Contact
              </a>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-[88rem] text-sm text-[#71869e]">
          For formal correspondence, write to{" "}
          <a className="text-[#57e6e6]" href="mailto:secretariat@asrro.org">
            secretariat@asrro.org
          </a>
          . Personal contacts are shared only with consent.
        </p>
      </section>
    </>
  )
}
