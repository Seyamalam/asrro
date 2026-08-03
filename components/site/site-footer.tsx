import Link from "next/link"
import {
  Code2,
  BriefcaseBusiness,
  Video,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react"
import { AsrroMark } from "@/components/shared/asrro-mark"

const links = [
  [
    "Organization",
    [
      ["About", "/about"],
      ["Committee", "/committee"],
      ["Alumni", "/alumni"],
      ["Contact", "/contact"],
    ],
  ],
  [
    "Explore",
    [
      ["Projects", "/projects"],
      ["Events", "/events"],
      ["Gallery", "/gallery"],
      ["Publications", "/publications"],
      ["News", "/news"],
    ],
  ],
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#030a14] px-5 pt-16 pb-8 text-[#b9c8d9] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[88rem]">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-lg">
            <div className="mb-5 flex items-center gap-3">
              <AsrroMark />
              <span className="font-bold tracking-[0.18em] text-white">
                ASRRO
              </span>
            </div>
            <p className="text-lg leading-8">
              Building practical capacity in space science, robotics, and
              intelligent systems—from Chattogram to the frontier.
            </p>
            <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-[#71869e] uppercase">
              Chittagong University of Engineering & Technology
            </p>
          </div>
          {links.map(([title, items]) => (
            <div key={title}>
              <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-[#57e6e6] uppercase">
                {title}
              </p>
              <ul className="space-y-3">
                {items.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      className="inline-flex items-center gap-1 hover:text-white"
                      href={href}
                    >
                      {label}
                      <ArrowUpRight className="size-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-6 text-xs text-[#71869e] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Andromeda Space and Robotics Research Organization.</p>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-white"
            >
              <MessageCircle className="size-4" />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-white"
            >
              <BriefcaseBusiness className="size-4" />
            </a>
            <a
              href="https://youtube.com"
              aria-label="YouTube"
              className="hover:text-white"
            >
              <Video className="size-4" />
            </a>
            <a
              href="https://github.com"
              aria-label="GitHub"
              className="hover:text-white"
            >
              <Code2 className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
