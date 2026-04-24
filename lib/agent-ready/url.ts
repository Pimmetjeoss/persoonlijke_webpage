const PRIVATE_HOSTS = new Set([
  "localhost",
  "localhost.localdomain",
  "0.0.0.0",
  "127.0.0.1",
  "::1",
])

function isPrivateIp(host: string): boolean {
  if (/^10\./.test(host)) return true
  if (/^192\.168\./.test(host)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true
  if (/^169\.254\./.test(host)) return true
  if (/^fe80:/i.test(host)) return true
  if (/^f[cd][0-9a-f]{2}:/i.test(host)) return true
  return false
}

export type ValidateResult =
  | { ok: true; url: URL; domain: string }
  | { ok: false; error: string }

export function validateScanTarget(input: string): ValidateResult {
  const trimmed = (input ?? "").trim()
  if (!trimmed) return { ok: false, error: "Voer een URL in." }
  if (trimmed.length > 2048) return { ok: false, error: "URL is te lang." }

  let withProtocol = trimmed
  if (!/^https?:\/\//i.test(withProtocol)) {
    withProtocol = `https://${withProtocol}`
  }

  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    return { ok: false, error: "Ongeldige URL." }
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, error: "Alleen http(s) URLs worden gescand." }
  }

  const host = url.hostname.toLowerCase()
  if (!host) return { ok: false, error: "Ongeldige hostnaam." }
  if (PRIVATE_HOSTS.has(host)) {
    return { ok: false, error: "Lokale adressen kunnen niet worden gescand." }
  }
  if (isPrivateIp(host)) {
    return { ok: false, error: "Privé IP-ranges worden niet ondersteund." }
  }
  if (!host.includes(".")) {
    return { ok: false, error: "Voer een geldig domein in (bv. voorbeeld.nl)." }
  }

  const normalizedHost = host.replace(/^www\./, "")
  url.hostname = host
  url.hash = ""
  url.search = ""
  url.pathname = "/"

  return { ok: true, url, domain: normalizedHost }
}

export function domainForPath(domain: string): string {
  return encodeURIComponent(domain)
}
