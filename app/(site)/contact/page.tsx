import type { Metadata } from "next"
import {
  Mail,
  MapPin,
  Phone,
  Code2,
  BriefcaseBusiness,
  MessageCircle,
  Video,
  Camera,
} from "lucide-react"
import Link from "next/link"

import { ContactForm } from "@/components/site/contact-form"
import { PageHero } from "@/components/shared/page-hero"
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ASRRO at CUET for research, events, partnerships, and membership.",
}
const channels = [
  [Mail, "Email", "hello@asrro.org", "mailto:hello@asrro.org"],
  [Phone, "Phone", "+880 1712 345 678", "tel:+8801712345678"],
  [MapPin, "Office", "Student Activity Centre, CUET", "#map"],
] as const
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Ground station / contact"
        title="Open a channel."
        intro="Tell us whether you are asking about membership, an event, research collaboration, sponsorship, or a media request."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div className="space-y-3">
              {channels.map(([Icon, label, value, href]) => {
                const content = (
                  <>
                    <span className="grid size-11 place-items-center rounded-full bg-[#00a6b2]/10 text-[#007d89] dark:bg-[#65f2f1]/8 dark:text-[#65f2f1]">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-mono text-[9px] tracking-[.16em] text-[#587084] uppercase dark:text-[#71869e]">
                        {label}
                      </span>
                      <span className="mt-1 block text-[#182b3d] dark:text-[#dbe7f3]">
                        {value}
                      </span>
                    </span>
                  </>
                )
                const className =
                  "flex items-center gap-4 rounded-xl border border-[#2359d4]/15 bg-white/80 p-5 shadow-[0_12px_35px_rgba(35,89,212,.05)] transition hover:border-[#00a6b2]/40 dark:border-white/10 dark:bg-[#09182a] dark:shadow-none dark:hover:border-[#65f2f1]/40"

                return href.startsWith("#") ? (
                  <Link href={href} key={label} className={className}>
                    {content}
                  </Link>
                ) : (
                  <a href={href} key={label} className={className}>
                    {content}
                  </a>
                )
              })}
            </div>
            <div
              id="map"
              className="relative mt-5 min-h-64 overflow-hidden rounded-2xl border border-[#2359d4]/15 bg-[#e8f0f7] p-6 dark:border-white/10 dark:bg-[#08172a]"
            >
              <div className="absolute inset-0 [background-image:linear-gradient(#b7c9db_1px,transparent_1px),linear-gradient(90deg,#b7c9db_1px,transparent_1px)] [background-size:28px_28px] opacity-60 dark:[background-image:linear-gradient(#203551_1px,transparent_1px),linear-gradient(90deg,#203551_1px,transparent_1px)] dark:opacity-40" />
              <div className="relative grid h-full min-h-52 place-items-center text-center">
                <div>
                  <MapPin className="mx-auto size-7 text-[#d97706] dark:text-[#ffb84d]" />
                  <p className="mt-3 font-semibold">CUET Campus, Raozan</p>
                  <p className="mt-1 font-mono text-[9px] tracking-[.16em] text-[#587084] uppercase dark:text-[#71869e]">
                    23.4607° N · 91.9710° E
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              {[
                [MessageCircle, "Facebook"],
                [BriefcaseBusiness, "LinkedIn"],
                [Video, "YouTube"],
                [Code2, "GitHub"],
                [Camera, "Instagram"],
              ].map(([Icon, label]) => (
                <a
                  href={`https://${String(label).toLowerCase()}.com`}
                  aria-label={String(label)}
                  key={String(label)}
                  className="grid size-10 place-items-center rounded-full border border-[#2359d4]/15 text-[#587084] transition hover:border-[#00a6b2]/40 hover:text-[#007d89] dark:border-white/10 dark:text-[#8296ad] dark:hover:text-[#65f2f1]"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
