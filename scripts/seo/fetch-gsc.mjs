#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULTS, GSC_WORKFLOWS, SEO_DATA_DIR } from "./config.mjs";
import { ensureDir, parseJsonOutput, sanitizeText, timestamp, writeJson } from "./lib.mjs";

function runCli(file, args) {
  return new Promise((resolve) => {
    const child = spawn(file, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, HOME: DEFAULTS.gscHome, NO_COLOR: "1" },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      resolve({ ok: false, exitCode: null, stdout, stderr: error.message });
    });
    child.on("close", (exitCode) => {
      resolve({ ok: exitCode === 0, exitCode, stdout, stderr });
    });
  });
}

async function executableExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const runId = timestamp();
  const cli = DEFAULTS.gscCli;
  const cliAvailable = await executableExists(cli);
  const workflowResults = {};
  const rawRoot = path.join(SEO_DATA_DIR, "raw", "gsc");

  await ensureDir(rawRoot);

  if (!cliAvailable) {
    const snapshot = {
      source: "gsc",
      status: "unavailable",
      generatedAt: new Date().toISOString(),
      site: DEFAULTS.site,
      message: `GSC CLI not found at ${cli}`,
      workflows: workflowResults,
    };
    await writeJson(path.join(SEO_DATA_DIR, "snapshots", "gsc-latest.json"), snapshot);
    console.log(`GSC unavailable: ${snapshot.message}`);
    return;
  }

  for (const workflow of GSC_WORKFLOWS) {
    const args = workflow.args(DEFAULTS);
    const result = await runCli(cli, args);
    const payload = {
      workflow: workflow.id,
      label: workflow.label,
      site: DEFAULTS.site,
      generatedAt: new Date().toISOString(),
      command: [path.basename(cli), ...args],
      ok: result.ok,
      exitCode: result.exitCode,
      data: result.ok ? parseJsonOutput(result.stdout) : null,
      error: result.ok ? null : sanitizeText(result.stderr || result.stdout).slice(0, 1200),
    };
    workflowResults[workflow.id] = payload;
    await writeJson(path.join(rawRoot, workflow.id, `${runId}.json`), payload);
    console.log(`${workflow.id}: ${result.ok ? "ok" : "unavailable"}`);
  }

  await writeJson(path.join(SEO_DATA_DIR, "snapshots", "gsc-latest.json"), {
    source: "gsc",
    status: "ok",
    generatedAt: new Date().toISOString(),
    site: DEFAULTS.site,
    days: DEFAULTS.days,
    period: DEFAULTS.period,
    workflows: workflowResults,
  });
}

main().catch((error) => {
  console.error(sanitizeText(error?.message || error));
  process.exit(1);
});
