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
              {channels.map(([Icon, label, value, href]) => (
                <a
                  href={href}
                  key={label}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#09182a] p-5 hover:border-[#57e6e6]/40"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-[#57e6e6]/8 text-[#57e6e6]">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-mono text-[9px] tracking-[.16em] text-[#71869e] uppercase">
                      {label}
                    </span>
                    <span className="mt-1 block text-[#dbe7f3]">{value}</span>
                  </span>
                </a>
              ))}
            </div>
            <div
              id="map"
              className="relative mt-5 min-h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#08172a] p-6"
            >
              <div className="absolute inset-0 [background-image:linear-gradient(#203551_1px,transparent_1px),linear-gradient(90deg,#203551_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
              <div className="relative grid h-full min-h-52 place-items-center text-center">
                <div>
                  <MapPin className="mx-auto size-7 text-[#ffb84d]" />
                  <p className="mt-3 font-semibold">CUET Campus, Raozan</p>
                  <p className="mt-1 font-mono text-[9px] tracking-[.16em] text-[#71869e] uppercase">
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
                  className="grid size-10 place-items-center rounded-full border border-white/10 text-[#8296ad] hover:text-[#57e6e6]"
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
