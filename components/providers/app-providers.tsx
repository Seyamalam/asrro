"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import type { ReactNode } from "react"

import { ThemeProvider } from "@/components/theme-provider"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null

export function AppProviders({ children }: { children: ReactNode }) {
  const content = convexClient ? (
    <ConvexProvider client={convexClient}>{children}</ConvexProvider>
  ) : (
    children
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {content}
    </ThemeProvider>
  )
}
