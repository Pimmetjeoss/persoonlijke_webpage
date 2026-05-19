export type BotFamily = "openai" | "anthropic" | "perplexity" | "google" | "apple" | "meta" | "common-crawl" | "other";

type AnalyticsEngineDataset = {
  writeDataPoint(point: { blobs?: string[]; doubles?: number[]; indexes?: string[] }): void;
};

type WorkerExecutionContext = {
  waitUntil(promise: Promise<unknown>): void;
};

export interface Env {
  BOT_ANALYTICS?: AnalyticsEngineDataset;
  IP_HASH_SALT?: string;
  UPSTREAM_ORIGIN?: string;
}

interface BotMatch {
  botName: string;
  family: BotFamily;
}

const BOT_PATTERNS: Array<BotMatch & { pattern: RegExp }> = [
  { botName: "GPTBot", family: "openai", pattern: /GPTBot/i },
  { botName: "ChatGPT-User", family: "openai", pattern: /ChatGPT-User/i },
  { botName: "OAI-SearchBot", family: "openai", pattern: /OAI-SearchBot/i },
  { botName: "ClaudeBot", family: "anthropic", pattern: /ClaudeBot/i },
  { botName: "Claude-User", family: "anthropic", pattern: /Claude-User/i },
  { botName: "anthropic-ai", family: "anthropic", pattern: /anthropic-ai/i },
  { botName: "PerplexityBot", family: "perplexity", pattern: /PerplexityBot/i },
  { botName: "Perplexity-User", family: "perplexity", pattern: /Perplexity-User/i },
  { botName: "Google-Extended", family: "google", pattern: /Google-Extended/i },
  { botName: "Googlebot", family: "google", pattern: /Googlebot/i },
  { botName: "Applebot-Extended", family: "apple", pattern: /Applebot-Extended/i },
  { botName: "Applebot", family: "apple", pattern: /Applebot/i },
  { botName: "meta-externalagent", family: "meta", pattern: /meta-externalagent/i },
  { botName: "FacebookBot", family: "meta", pattern: /FacebookBot/i },
  { botName: "CCBot", family: "common-crawl", pattern: /CCBot/i },
  { botName: "Bytespider", family: "other", pattern: /Bytespider/i },
  { botName: "Amazonbot", family: "other", pattern: /Amazonbot/i },
  { botName: "Bingbot", family: "other", pattern: /bingbot/i },
  { botName: "YouBot", family: "other", pattern: /YouBot/i },
  { botName: "DuckAssistBot", family: "other", pattern: /DuckAssistBot/i },
];

function classifyBot(userAgent: string): BotMatch | null {
  const match = BOT_PATTERNS.find((bot) => bot.pattern.test(userAgent));
  if (match) return { botName: match.botName, family: match.family };
  if (/bot|crawler|spider|crawl|slurp/i.test(userAgent)) return { botName: "Other crawler", family: "other" };
  return null;
}

async function hashIp(ip: string, salt = ""): Promise<string> {
  if (!ip) return "";
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

function upstreamRequest(request: Request, env: Env): Request {
  if (!env.UPSTREAM_ORIGIN) return request;
  const incoming = new URL(request.url);
  const upstream = new URL(env.UPSTREAM_ORIGIN);
  incoming.protocol = upstream.protocol;
  incoming.host = upstream.host;
  return new Request(incoming, request);
}

async function logBotVisit(request: Request, response: Response, env: Env, match: BotMatch, userAgent: string) {
  if (!env.BOT_ANALYTICS) return;
  const url = new URL(request.url);
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const ipHash = await hashIp(ip, env.IP_HASH_SALT || "");
  env.BOT_ANALYTICS.writeDataPoint({
    blobs: [
      match.botName,
      match.family,
      url.pathname,
      request.method,
      request.headers.get("CF-IPCountry") || "",
      userAgent.slice(0, 220),
      ipHash,
    ],
    doubles: [response.status],
    indexes: [match.botName],
  });
}

const worker = {
  async fetch(request: Request, env: Env, ctx: WorkerExecutionContext): Promise<Response> {
    const userAgent = request.headers.get("User-Agent") || "";
    const match = classifyBot(userAgent);
    const response = await fetch(upstreamRequest(request, env));
    if (match) ctx.waitUntil(logBotVisit(request, response, env, match, userAgent));
    return response;
  },
};

export default worker;
