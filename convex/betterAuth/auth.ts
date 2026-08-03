import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { betterAuth, type BetterAuthOptions } from "better-auth"

import { components } from "../_generated/api"
import type { DataModel } from "../_generated/dataModel"
import authConfig from "../auth.config"
import schema from "./schema"

export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
  }
)

function getTrustedOrigins() {
  return [
    process.env.SITE_URL,
    ...(process.env.TRUSTED_ORIGINS?.split(",") ?? []),
  ]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin))
}

export function createAuthOptions(ctx: GenericCtx<DataModel>) {
  return {
    appName: "ASRRO Portal",
    baseURL: process.env.SITE_URL,
    trustedOrigins: getTrustedOrigins(),
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    plugins: [convex({ authConfig })],
  } satisfies BetterAuthOptions
}

export const options = createAuthOptions({} as GenericCtx<DataModel>)

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx))
