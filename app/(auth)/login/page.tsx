import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth/auth-form"
import { isAuthenticated } from "@/lib/auth-server"

export const metadata: Metadata = {
  title: "Member sign in",
  description: "Sign in to the secure ASRRO member and operations portal.",
  robots: { index: false, follow: false },
}

function safeCallbackUrl(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value
  return candidate?.startsWith("/") && !candidate.startsWith("//")
    ? candidate
    : "/dashboard"
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const { next } = await searchParams
  const callbackUrl = safeCallbackUrl(next)

  if (await isAuthenticated()) redirect(callbackUrl)

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#050c17] text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_12%_85%,rgba(37,99,235,0.16),transparent_35%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:72px_72px] opacity-[0.08]"
      />

      <div className="relative mx-auto grid min-h-svh max-w-[94rem] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden min-h-svh flex-col justify-between border-r border-white/8 p-12 lg:flex xl:p-16">
          <Link
            href="/"
            className="flex w-fit items-center gap-3 rounded-full focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
            aria-label="Back to ASRRO home"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white">
              <Image
                src="/asrro-logo.png"
                alt=""
                width={42}
                height={42}
                className="size-10 object-contain"
                priority
              />
            </span>
            <span>
              <span className="block font-heading text-base font-bold tracking-[0.16em]">
                ASRRO
              </span>
              <span className="block font-mono text-[9px] tracking-[0.18em] text-slate-500 uppercase">
                CUET · Bangladesh
              </span>
            </span>
          </Link>

          <div className="max-w-xl pb-10">
            <div className="mb-9 flex items-center gap-4">
              <span className="h-px w-14 bg-cyan-300/70" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-300 uppercase">
                Secure mission operations
              </span>
            </div>
            <p className="font-heading text-5xl leading-[1.04] font-medium tracking-[-0.05em] xl:text-6xl">
              Build together.
              <br />
              <span className="text-slate-500">Go beyond.</span>
            </p>
            <p className="mt-7 max-w-md text-base leading-7 text-slate-400">
              One workspace for member records, events, projects, research, and
              the teams moving ASRRO forward.
            </p>
          </div>

          <p className="font-mono text-[9px] tracking-[0.16em] text-slate-600 uppercase">
            Andromeda Space & Robotics Research Organization
          </p>
        </section>

        <section className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full">
            <Link
              href="/"
              className="mb-12 flex w-fit items-center gap-3 rounded-full focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none lg:hidden"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-white">
                <Image
                  src="/asrro-logo.png"
                  alt="ASRRO"
                  width={38}
                  height={38}
                  className="size-9 object-contain"
                  priority
                />
              </span>
              <span className="font-heading text-sm font-bold tracking-[0.16em]">
                ASRRO
              </span>
            </Link>
            <AuthForm callbackUrl={callbackUrl} />
          </div>
        </section>
      </div>
    </main>
  )
}
