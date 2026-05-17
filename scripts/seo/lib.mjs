import fs from "node:fs/promises";
import path from "node:path";

const SECRET_PATTERNS = [
  /ya29\.[0-9A-Za-z._-]+/g,
  /[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g,
  /("(?:client_secret|refresh_token|access_token|private_key|api_key)"\s*:\s*")[^"]+(")/gi,
];

export function sanitizeText(value) {
  let text = String(value ?? "");
  for (const pattern of SECRET_PATTERNS) {
    text = text.replace(pattern, (match, prefix, suffix) => `${prefix || ""}[REDACTED]${suffix || ""}`);
  }
  return text;
}

export function timestamp() {
  return new Date().toISOString().replaceAll(":", "-").replace(/\.\d{3}Z$/, "Z");
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function readJsonIfExists(file, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function parseJsonOutput(stdout) {
  const text = stdout.trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const start = Math.min(...["{", "["].map((needle) => {
      const index = text.indexOf(needle);
      return index === -1 ? Number.POSITIVE_INFINITY : index;
    }));
    if (!Number.isFinite(start)) return { raw: sanitizeText(text) };
    try {
      return JSON.parse(text.slice(start));
    } catch {
      return { raw: sanitizeText(text.slice(0, 4000)) };
    }
  }
}

export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  for (const key of ["rows", "data", "items", "results", "queries", "pages", "top_pages", "daily_data", "events"]) {
    const maybeRows = value[key];
    if (Array.isArray(maybeRows)) return maybeRows;
  }
  return [];
}

export function numberFrom(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function pickString(row, keys, fallback = "—") {
  for (const key of keys) {
    const value = row?.[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

export function pickNumber(row, keys, fallback = 0) {
  for (const key of keys) {
    const value = row?.[key];
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return fallback;
}

export function latestByDate(items, getDate) {
  return [...items].sort((a, b) => String(getDate(b)).localeCompare(String(getDate(a))));
}

export function safeStatus(status, detail = "") {
  return { status, detail: sanitizeText(detail).slice(0, 600) };
}
