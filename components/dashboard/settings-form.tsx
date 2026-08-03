"use client"

import { useMutation, useQuery } from "convex/react"
import { Save } from "lucide-react"
import { useMemo, useState } from "react"

import { api } from "@/convex/_generated/api"
import { ActionButton } from "@/components/dashboard/dashboard-kit"
import { AssetUploader } from "@/components/dashboard/asset-uploader"

const fields = [
  ["organization.name", "Organization name"],
  ["contact.email", "Contact email"],
  ["contact.phone", "Contact phone"],
  ["contact.address", "Office address"],
  ["contact.latitude", "Latitude"],
  ["contact.longitude", "Longitude"],
  ["social.facebook", "Facebook URL"],
  ["social.linkedin", "LinkedIn URL"],
  ["social.youtube", "YouTube URL"],
  ["social.github", "GitHub URL"],
  ["social.instagram", "Instagram URL"],
] as const

export function SettingsForm() {
  const settings = useQuery(api.content.listSettingsAdmin)
  const saveSetting = useMutation(api.content.upsertSetting)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  )
  const values = useMemo(
    () => ({
      ...Object.fromEntries(
        (settings ?? []).map((item) => [item.key, item.value])
      ),
      ...edits,
    }),
    [settings, edits]
  )

  async function save() {
    setState("saving")
    try {
      await Promise.all(
        [...fields, ["branding.logoAssetId", "Public logo asset"] as const].map(
          ([key, label]) =>
            saveSetting({
              key,
              value: values[key] ?? "",
              isPublic: true,
              description: label,
            })
        )
      )
      setState("saved")
    } catch {
      setState("error")
    }
  }

  return (
    <div className="p-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <label
            key={key}
            className={
              key === "organization.name" || key === "contact.address"
                ? "sm:col-span-2"
                : ""
            }
          >
            <span className="mb-2 block text-sm font-medium">{label}</span>
            <input
              value={values[key] ?? ""}
              onChange={(event) =>
                setEdits((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-white/5"
            />
          </label>
        ))}
        <div className="rounded-xl border border-dashed border-slate-300 p-5 sm:col-span-2 dark:border-white/15">
          <p className="mb-3 text-sm font-semibold">Public logo / hero asset</p>
          <AssetUploader
            kind="image"
            accept="image/*"
            onUploaded={(assetId) =>
              setEdits((current) => ({
                ...current,
                "branding.logoAssetId": assetId,
              }))
            }
          />
          {values["branding.logoAssetId"] ? (
            <p className="mt-2 text-xs text-emerald-600">
              Asset ready to save.
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-white/8">
        <p
          role="status"
          className={
            state === "error"
              ? "text-xs text-rose-600"
              : "text-xs text-emerald-600"
          }
        >
          {state === "saved"
            ? "Settings saved."
            : state === "error"
              ? "Settings could not be saved."
              : ""}
        </p>
        <ActionButton disabled={state === "saving"} onClick={() => void save()}>
          <Save className="size-3.5" />{" "}
          {state === "saving" ? "Saving…" : "Save changes"}
        </ActionButton>
      </div>
    </div>
  )
}
