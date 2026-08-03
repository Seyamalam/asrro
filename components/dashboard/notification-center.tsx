"use client"

import {
  Bell,
  CalendarDays,
  CheckCheck,
  Megaphone,
  Newspaper,
  UsersRound,
} from "lucide-react"
import { useState } from "react"

import { ActionButton } from "@/components/dashboard/dashboard-kit"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs"
import { notifications as initialNotifications } from "@/data/dashboard-data"

const kindIcons = {
  event: CalendarDays,
  committee: UsersRound,
  member: Bell,
  content: Newspaper,
}

function NotificationList({
  notifications,
}: {
  notifications: typeof initialNotifications
}) {
  if (!notifications.length)
    return (
      <div className="grid min-h-56 place-items-center p-8 text-center">
        <div>
          <CheckCheck className="mx-auto size-7 text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            You are all caught up
          </p>
          <p className="mt-1 text-xs text-slate-500">
            New signals will appear here.
          </p>
        </div>
      </div>
    )
  return (
    <div className="divide-y divide-slate-100 dark:divide-white/8">
      {notifications.map((notification) => {
        const Icon =
          kindIcons[notification.kind as keyof typeof kindIcons] ?? Megaphone
        return (
          <article
            key={notification.id}
            className={`flex gap-4 p-5 ${notification.unread ? "bg-blue-50/35 dark:bg-blue-500/[0.04]" : ""}`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex gap-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {notification.title}
                </h2>
                {notification.unread ? (
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />
                ) : null}
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {notification.body}
              </p>
              <p className="mt-2 text-[10px] text-slate-400">
                {notification.time}
              </p>
            </div>
            <button
              type="button"
              className="self-start text-[10px] font-semibold text-blue-600"
            >
              Open
            </button>
          </article>
        )
      })}
    </div>
  )
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unread = notifications.filter((item) => item.unread)
  return (
    <Tabs defaultValue="all" variant="underline">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 pt-2 sm:flex-row sm:items-end sm:justify-between dark:border-white/8">
        <TabsList className="bg-transparent">
          <TabsTrigger value="all">
            All{" "}
            <span className="ml-1 text-[10px] opacity-60">
              {notifications.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread{" "}
            <span className="ml-1 text-[10px] opacity-60">{unread.length}</span>
          </TabsTrigger>
        </TabsList>
        <ActionButton
          variant="quiet"
          className="mb-2 self-start"
          onClick={() =>
            setNotifications((items) =>
              items.map((item) => ({ ...item, unread: false }))
            )
          }
        >
          <CheckCheck className="size-3.5" />
          Mark all read
        </ActionButton>
      </div>
      <TabsContent value="all" className="mt-0">
        <NotificationList notifications={notifications} />
      </TabsContent>
      <TabsContent value="unread" className="mt-0">
        <NotificationList notifications={unread} />
      </TabsContent>
    </Tabs>
  )
}
