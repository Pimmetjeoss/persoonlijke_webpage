import {
  IsItAgentReadyResponseSchema,
  type IsItAgentReadyResponse,
} from "./schemas"

const ENDPOINT = "https://isitagentready.com/api/scan"
const REQUEST_TIMEOUT_MS = 45_000

export type ScanError = {
  code: "timeout" | "network" | "upstream" | "parse"
  message: string
}

export type ScanOutcome =
  | { ok: true; data: IsItAgentReadyResponse }
  | { ok: false; error: ScanError }

export async function runScan(targetUrl: string): Promise<ScanOutcome> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "CodeLieshout-AgentReadyScanner/1.0 (+https://code-lieshout.nl)",
      },
      body: JSON.stringify({ url: targetUrl }),
      signal: controller.signal,
    })

    if (!res.ok) {
      return {
        ok: false,
        error: {
          code: "upstream",
          message: `Scan service gaf status ${res.status} terug.`,
        },
      }
    }

    const json: unknown = await res.json()
    const parsed = IsItAgentReadyResponseSchema.safeParse(json)
    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: "parse",
          message: "Scan-resultaat had een onverwacht formaat.",
        },
      }
    }

    return { ok: true, data: parsed.data }
  } catch (err) {
    if ((err as Error)?.name === "AbortError") {
      return {
        ok: false,
        error: {
          code: "timeout",
          message: "De scan duurde te lang en is gestopt.",
        },
      }
    }
    return {
      ok: false,
      error: {
        code: "network",
        message: "Kon geen verbinding maken met de scan-service.",
      },
    }
  } finally {
    clearTimeout(timer)
  }
}
