import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(8787),
    RELAY_TOKEN: z.string().min(1),
    ALLOWED_HOSTS: z.string().optional(),
    REQUEST_TIMEOUT_MS: z.coerce.number().default(30_000),
    MAX_BODY_BYTES: z.coerce.number().default(1_048_576),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})

export function allowedHosts(): string[] | null {
  if (!env.ALLOWED_HOSTS) return null
  return env.ALLOWED_HOSTS.split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean)
}
