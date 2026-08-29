import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import process from "node:process";

const mode = process.argv[2] ?? "browser";
const requestedTarget = process.argv[3];
if (!new Set(["browser", "smoke"]).has(mode)) {
  console.error("Gebruik: node scripts/run-webmcp-evals.mjs [browser|smoke]");
  process.exit(2);
}

const root = resolve(import.meta.dirname, "..");
const port = Number(process.env.WEBMCP_EVAL_PORT ?? 3000);
const baseUrl = process.env.WEBMCP_EVAL_BASE_URL ?? `http://localhost:${port}`;
const outputDir = resolve(root, ".evals", "webmcp", mode);
const resolvedDir = resolve(root, ".evals", "webmcp", "resolved");
const nodeCommand = process.env.npm_node_execpath ?? process.execPath;
const npmCli =
  process.env.npm_execpath ?? join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
const npxCli = join(dirname(npmCli), "npx-cli.js");
const allTargets = [
  ["bistro", "/webmcp/demos/bistro"],
  ["bioscoop", "/webmcp/demos/bioscoop"],
  ["fabriek", "/webmcp/demos/fabriek"],
  ["slim-huis", "/webmcp/demos/slim-huis"],
];
const targets = requestedTarget
  ? allTargets.filter(([name]) => name === requestedTarget)
  : allTargets;
if (requestedTarget && targets.length === 0) {
  console.error(`Onbekende demo: ${requestedTarget}. Kies: ${allTargets.map(([name]) => name).join(", ")}`);
  process.exit(2);
}

function localDate(offsetDays = 0) {
  const value = new Date();
  value.setDate(value.getDate() + offsetDays);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

async function resolveEvalFile(name) {
  const source = resolve(root, "tests", "webmcp-evals", `${name}.json`);
  const destination = resolve(resolvedDir, `${name}.json`);
  const contents = (await readFile(source, "utf8"))
    .replaceAll("__TODAY__", localDate())
    .replaceAll("__TOMORROW__", localDate(1));
  JSON.parse(contents);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, contents);
  return destination;
}

async function isServerReady() {
  try {
    const response = await fetch(`${baseUrl}/webmcp/demos/bistro`);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(child) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Next.js stopte met code ${child.exitCode}.`);
    if (await isServerReady()) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error(`De lokale site werd niet binnen 90 seconden bereikbaar op ${baseUrl}.`);
}

function run(commandName, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(commandName, args, { cwd: root, stdio: "inherit", ...options });
    child.once("error", rejectRun);
    child.once("exit", (code, signal) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${commandName} stopte met ${signal ?? `code ${code}`}.`));
    });
  });
}

let server;
try {
  if (!(await isServerReady())) {
    server = spawn(
      nodeCommand,
      [npmCli, "run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)],
      {
        cwd: root,
        stdio: "inherit",
        windowsHide: true,
      },
    );
    await waitForServer(server);
  }

  await mkdir(outputDir, { recursive: true });
  for (const [name, route] of targets) {
    const evalFile = await resolveEvalFile(name);
    const args = [
      "--yes",
      "webmcp-evals@0.0.4",
      "--chrome-channel",
      "chrome",
      "--output-dir",
      join(outputDir, name),
    ];
    if (mode === "browser") {
      args.push(
        "--backend",
        "vercel",
        "--model",
        process.env.WEBMCP_EVAL_MODEL ?? "gemini-2.5-flash",
        "--runs",
        process.env.WEBMCP_EVAL_RUNS ?? "3",
        "--max-steps",
        name === "fabriek" ? "24" : "8",
      );
    }
    args.push(mode, "--url", `${baseUrl}${route}`, "--evals", evalFile);
    if (mode === "browser") args.push("--reporter", "console", "json", "html");
    else args.push("--verbose");
    console.log(`\n=== ${mode}: ${name} ===`);
    await run(nodeCommand, [npxCli, ...args]);
  }
} finally {
  if (server && server.exitCode === null) server.kill("SIGTERM");
}
