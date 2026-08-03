"use client"

import { Mail, MapPin, Phone, Save, ShieldCheck } from "lucide-react"
import { useState } from "react"

import { ActionButton } from "@/components/dashboard/dashboard-kit"
import { Input } from "@/components/motion/input"
import { currentMember } from "@/data/dashboard-data"

export function ProfileEditor() {
  const [saved, setSaved] = useState(false)
  return (
    <div className="grid gap-5 p-5 sm:grid-cols-2">
      <Input
        label="Email address"
        defaultValue={currentMember.email}
        leftIcon={<Mail />}
        success
        classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
      />
      <Input
        label="Phone number"
        defaultValue={currentMember.phone}
        leftIcon={<Phone />}
        classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
      />
      <Input
        label="Current address"
        defaultValue={currentMember.address}
        leftIcon={<MapPin />}
        className="sm:col-span-2"
        classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
      />
      <Input
        label="Research interests"
        defaultValue="Autonomous systems, computer vision, embedded AI"
        className="sm:col-span-2"
        classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
      />
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
        <p
          aria-live="polite"
          className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
        >
          {saved ? (
            <>
              <ShieldCheck className="size-4 text-emerald-600" />
              Profile changes saved.
            </>
          ) : (
            "Only contact details and research interests can be changed here."
          )}
        </p>
        <ActionButton onClick={() => setSaved(true)}>
          <Save className="size-3.5" />
          Save changes
        </ActionButton>
      </div>
    </div>
  )
}
