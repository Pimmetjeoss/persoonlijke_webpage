import type { IsItAgentReadyResponse } from "./schemas"

const TRANSIENT_UNABLE_TO_CHECK_RE =
  /operation was aborted|aborted|timeout|timed out|all requests failed/i

export function hasTransientUnableToCheck(
  response: IsItAgentReadyResponse,
): boolean {
  for (const category of Object.values(response.checks ?? {})) {
    for (const check of Object.values(category ?? {})) {
      if (
        check.status === "unableToCheck" &&
        TRANSIENT_UNABLE_TO_CHECK_RE.test(check.message ?? "")
      ) {
        return true
      }
    }
  }

  return false
}

export function isCacheableScan(response: IsItAgentReadyResponse | null): boolean {
  return Boolean(response && !hasTransientUnableToCheck(response))
}
