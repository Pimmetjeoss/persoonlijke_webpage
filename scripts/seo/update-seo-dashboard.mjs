#!/usr/bin/env node
import { spawn } from "node:child_process";

function runStep(label, args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { stdio: "inherit", env: process.env });
    child.on("close", (code) => {
      if (code === 0) resolve(true);
      else {
        console.error(`${label} failed with exit code ${code}`);
        resolve(false);
      }
    });
    child.on("error", (error) => {
      console.error(`${label} failed: ${error.message}`);
      resolve(false);
    });
  });
}

const steps = [
  ["GSC fetch", ["scripts/seo/fetch-gsc.mjs"]],
  ["GA4 fetch", ["scripts/seo/fetch-ga4.mjs"]],
  ["PageSpeed fetch", ["scripts/seo/fetch-pagespeed.mjs"]],
  ["CrUX fetch", ["scripts/seo/fetch-crux.mjs"]],
  ["GBP fetch", ["scripts/seo/fetch-gbp.mjs"]],
  ["Dashboard generation", ["scripts/seo/generate-dashboard-data.mjs"]],
];

let hardFailure = false;
for (const [label, args] of steps) {
  const ok = await runStep(label, args);
  if (!ok && label === "Dashboard generation") hardFailure = true;
}

process.exit(hardFailure ? 1 : 0);
