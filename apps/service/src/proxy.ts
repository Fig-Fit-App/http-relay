import { allowedHosts, env } from "./env"
import type { ProxyRequest } from "./schemas"

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
])

export class ProxyError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ProxyError"
  }
}

export function assertProxyUrl(rawUrl: string): URL {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new ProxyError("Invalid URL", 400)
  }

  if (url.protocol !== "https:") {
    throw new ProxyError("Only HTTPS URLs are allowed", 400)
  }

  const hosts = allowedHosts()
  if (hosts && !hosts.includes(url.hostname.toLowerCase())) {
    throw new ProxyError(`Host not allowed: ${url.hostname}`, 403)
  }

  return url
}

function buildUpstreamHeaders(headers?: Record<string, string>): Headers {
  const out = new Headers()
  if (!headers) return out

  for (const [key, value] of Object.entries(headers)) {
    if (HOP_BY_HOP.has(key.toLowerCase())) continue
    out.set(key, value)
  }
  return out
}

function serializeBody(body: unknown): {
  body: BodyInit | undefined
  contentType?: string
} {
  if (body === undefined || body === null) {
    return { body: undefined }
  }
  if (typeof body === "string") {
    return { body }
  }
  return {
    body: JSON.stringify(body),
    contentType: "application/json",
  }
}

export async function forwardProxy(req: ProxyRequest): Promise<Response> {
  const url = assertProxyUrl(req.url)
  const headers = buildUpstreamHeaders(req.headers)
  const serialized = serializeBody(req.body)

  if (serialized.body !== undefined) {
    const size =
      typeof serialized.body === "string"
        ? new TextEncoder().encode(serialized.body).byteLength
        : 0
    if (size > env.MAX_BODY_BYTES) {
      throw new ProxyError("Request body too large", 413)
    }
    if (serialized.contentType && !headers.has("content-type")) {
      headers.set("content-type", serialized.contentType)
    }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), env.REQUEST_TIMEOUT_MS)

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : serialized.body,
      signal: controller.signal,
    })

    const responseHeaders = new Headers()
    const contentType = upstream.headers.get("content-type")
    if (contentType) responseHeaders.set("content-type", contentType)

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    })
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ProxyError("Upstream request timed out", 504)
    }
    throw new ProxyError(
      err instanceof Error ? err.message : "Upstream request failed",
      502,
    )
  } finally {
    clearTimeout(timer)
  }
}
