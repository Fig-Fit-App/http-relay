import { z } from "zod"

export const ProxyMethods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
] as const

export const ProxyRequestSchema = z.object({
  method: z.enum(ProxyMethods),
  url: z.url(),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.unknown().optional(),
})

export type ProxyRequest = z.infer<typeof ProxyRequestSchema>
