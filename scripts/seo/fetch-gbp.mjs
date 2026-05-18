#!/usr/bin/env node
import { exec } from "node:child_process";
import path from "node:path";
import { DEFAULTS, SEO_DATA_DIR } from "./config.mjs";
import { parseJsonOutput, sanitizeText, timestamp, writeJson } from "./lib.mjs";

function renderTemplate(command) {
  return command
    .replaceAll("{location}", DEFAULTS.gbpLocation)
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
  const command = DEFAULTS.gbpCommand.trim();
  const rawFile = path.join(SEO_DATA_DIR, "raw", "gbp", `${runId}.json`);
  const latestFile = path.join(SEO_DATA_DIR, "snapshots", "gbp-latest.json");

  if (!command) {
    const snapshot = {
      source: "gbp",
      status: "unavailable",
      generatedAt: new Date().toISOString(),
      location: DEFAULTS.gbpLocation || null,
      message: "SEO_GBP_COMMAND is not configured. Point it to a read-only Google Business Profile export command; placeholders: {location}, {days}, {limit}.",
      data: null,
    };
    await writeJson(rawFile, snapshot);
    await writeJson(latestFile, snapshot);
    console.log("GBP unavailable: SEO_GBP_COMMAND not configured");
    return;
  }

  const rendered = renderTemplate(command);
  const result = await runCommand(rendered);
  const data = result.ok ? parseJsonOutput(result.stdout) : null;
  const embeddedError = data && typeof data === "object" && typeof data.error === "string" ? data.error : null;
  const snapshot = {
    source: "gbp",
    status: result.ok && !embeddedError ? "ok" : result.ok ? "partial" : "error",
    generatedAt: new Date().toISOString(),
    location: DEFAULTS.gbpLocation || null,
    command: "SEO_GBP_COMMAND",
    ok: result.ok && !embeddedError,
    exitCode: result.exitCode,
    data,
    error: embeddedError || (result.ok ? null : sanitizeText(result.stderr || result.stdout).slice(0, 1200)),
  };

  await writeJson(rawFile, snapshot);
  await writeJson(latestFile, snapshot);
  console.log(`GBP: ${snapshot.status}`);
}

main().catch((error) => {
  console.error(sanitizeText(error?.message || error));
  process.exit(1);
});
