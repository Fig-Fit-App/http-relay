export type ProxyMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"

export type ProxyFetchInput = {
  method: ProxyMethod
  url: string
  headers?: Record<string, string>
  body?: unknown
}

export type HttpRelayClientOptions = {
  baseUrl: string
  token: string
  fetch?: typeof globalThis.fetch
}

export class HttpRelayError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message)
    this.name = "HttpRelayError"
  }
}

export class HttpRelayClient {
  private readonly baseUrl: string
  private readonly token: string
  private readonly fetchImpl: typeof globalThis.fetch

  constructor(options: HttpRelayClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "")
    this.token = options.token
    this.fetchImpl = options.fetch ?? globalThis.fetch.bind(globalThis)
  }

  async fetch(input: ProxyFetchInput): Promise<Response> {
    const res = await this.fetchImpl(`${this.baseUrl}/v1/proxy`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        method: input.method,
        url: input.url,
        headers: input.headers,
        body: input.body,
      }),
    })

    if (res.status === 401) {
      throw new HttpRelayError("Relay unauthorized", 401)
    }

    if (res.status >= 400 && res.headers.get("content-type")?.includes("application/json")) {
      const cloned = res.clone()
      try {
        const errBody = await cloned.json()
        if (errBody && typeof errBody === "object" && "error" in errBody) {
          // Relay-level error (not upstream). Upstream errors are forwarded as-is.
          if (res.status !== 502 && res.status !== 504) {
            // Keep returning Response for upstream; only throw for relay validation failures
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    return res
  }

  async fetchJson<T = unknown>(input: ProxyFetchInput): Promise<{
    status: number
    data: T
  }> {
    const res = await this.fetch(input)
    const data = (await res.json()) as T
    return { status: res.status, data }
  }
}

export function createHttpRelayClient(options: HttpRelayClientOptions) {
  return new HttpRelayClient(options)
}
