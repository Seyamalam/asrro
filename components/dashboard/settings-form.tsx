"use client"

import { CheckCircle2, Globe2, Mail, Palette, Save, Share2 } from "lucide-react"
import { useState } from "react"

import { ActionButton } from "@/components/dashboard/dashboard-kit"
import { Checkbox } from "@/components/motion/checkbox"
import { Input } from "@/components/motion/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs"

export function SettingsForm() {
  const [saved, setSaved] = useState(false)
  const [sections, setSections] = useState({
    events: true,
    projects: true,
    publications: true,
    alumni: true,
  })
  return (
    <Tabs defaultValue="website" variant="underline">
      <TabsList className="w-full overflow-x-auto bg-transparent px-4 pt-2">
        <TabsTrigger value="website">
          <Globe2 className="mr-2 size-3.5" />
          Website
        </TabsTrigger>
        <TabsTrigger value="branding">
          <Palette className="mr-2 size-3.5" />
          Branding
        </TabsTrigger>
        <TabsTrigger value="social">
          <Share2 className="mr-2 size-3.5" />
          Social
        </TabsTrigger>
        <TabsTrigger value="email">
          <Mail className="mr-2 size-3.5" />
          Email
        </TabsTrigger>
      </TabsList>
      <TabsContent value="website" className="p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Organization name"
            defaultValue="Andromeda Space and Robotics Research Organization"
            className="sm:col-span-2"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <Input
            label="Contact email"
            defaultValue="hello@asrro.org"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <Input
            label="Contact phone"
            defaultValue="+880 1700 000 000"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <div className="sm:col-span-2">
            <p className="mb-3 text-sm font-medium">Homepage sections</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(sections).map(([key, value]) => (
                <Checkbox
                  key={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    setSections((current) => ({ ...current, [key]: checked }))
                  }
                  label={key[0].toUpperCase() + key.slice(1)}
                />
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="branding" className="p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Primary color"
            defaultValue="#2563EB"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <Input
            label="Accent color"
            defaultValue="#06B6D4"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center sm:col-span-2 dark:border-white/15">
            <Palette className="mx-auto size-5 text-blue-600" />
            <p className="mt-2 text-xs font-semibold">Logo and hero assets</p>
            <p className="mt-1 text-[11px] text-slate-500">
              PNG, SVG, or WebP · maximum 5 MB
            </p>
            <ActionButton variant="secondary" className="mt-4">
              Upload asset
            </ActionButton>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="social" className="p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Facebook"
            defaultValue="facebook.com/asrrocuet"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <Input
            label="LinkedIn"
            defaultValue="linkedin.com/company/asrro"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <Input
            label="YouTube"
            defaultValue="youtube.com/@asrro"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <Input
            label="GitHub"
            defaultValue="github.com/asrro"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
        </div>
      </TabsContent>
      <TabsContent value="email" className="p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Sender name"
            defaultValue="ASRRO Portal"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <Input
            label="Reply-to address"
            defaultValue="membership@asrro.org"
            classNames={{ field: "rounded-xl bg-slate-50 dark:bg-white/5" }}
          />
          <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500 sm:col-span-2 dark:bg-white/5">
            Approval, rejection, event reminder, and committee announcement
            templates are configured and active.
          </div>
        </div>
      </TabsContent>
      <div className="flex items-center justify-between border-t border-slate-100 p-5 dark:border-white/8">
        <p
          aria-live="polite"
          className="flex items-center gap-2 text-xs text-emerald-600"
        >
          {saved ? (
            <>
              <CheckCircle2 className="size-4" />
              Settings saved.
            </>
          ) : null}
        </p>
        <ActionButton onClick={() => setSaved(true)}>
          <Save className="size-3.5" />
          Save changes
        </ActionButton>
      </div>
    </Tabs>
  )
}
