#!/usr/bin/env node
import { exec } from "node:child_process";
import path from "node:path";
import { DEFAULTS, SEO_DATA_DIR } from "./config.mjs";
import { parseJsonOutput, sanitizeText, timestamp, writeJson } from "./lib.mjs";

function renderTemplate(command) {
  return command
    .replaceAll("{property}", DEFAULTS.ga4Property)
    .replaceAll("{days}", String(DEFAULTS.days))
    .replaceAll("{period}", DEFAULTS.period)
    .replaceAll("{limit}", String(DEFAULTS.limit));
}

function runCommand(command) {
  return new Promise((resolve) => {
    exec(command, { env: { ...process.env, NO_COLOR: "1" }, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({ ok: !error, exitCode: error?.code ?? 0, stdout, stderr });
    });
  });
}

async function main() {
  const runId = timestamp();
  const command = DEFAULTS.ga4Command.trim();
  const rawFile = path.join(SEO_DATA_DIR, "raw", "ga4", "organic", `${runId}.json`);
  const latestFile = path.join(SEO_DATA_DIR, "snapshots", "ga4-latest.json");

  if (!command) {
    const snapshot = {
      source: "ga4",
      status: "unavailable",
      generatedAt: new Date().toISOString(),
      property: DEFAULTS.ga4Property,
      message:
        "SEO_GA4_COMMAND is not configured. Point it to the existing Analytics MCP/GA4 read-only export command; placeholders: {property}, {days}, {limit}.",
      data: null,
    };
    await writeJson(rawFile, snapshot);
    await writeJson(latestFile, snapshot);
    console.log("GA4 unavailable: SEO_GA4_COMMAND not configured");
    return;
  }

  const rendered = renderTemplate(command);
  const result = await runCommand(rendered);
  const data = result.ok ? parseJsonOutput(result.stdout) : null;
  const embeddedError = data && typeof data === "object" && typeof data.error === "string" ? data.error : null;
  const snapshot = {
    source: "ga4",
    status: result.ok && !embeddedError ? "ok" : result.ok ? "partial" : "error",
    generatedAt: new Date().toISOString(),
    property: DEFAULTS.ga4Property,
    command: "SEO_GA4_COMMAND",
    ok: result.ok && !embeddedError,
    exitCode: result.exitCode,
    data,
    error: embeddedError || (result.ok ? null : sanitizeText(result.stderr || result.stdout).slice(0, 1200)),
  };

  await writeJson(rawFile, snapshot);
  await writeJson(latestFile, snapshot);
  console.log(`GA4: ${snapshot.status}`);
}

main().catch((error) => {
  console.error(sanitizeText(error?.message || error));
  process.exit(1);
});
