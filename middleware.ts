import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MARKDOWN_ROUTES: Record<string, string> = {
  "/": "/index.md",
  "/about": "/about.md",
  "/portfolio": "/portfolio.md",
  "/ai-agents": "/ai-agents.md",
  "/contact": "/contact.md",
  "/blog": "/blog.md",
}

const BOT_PATTERNS = [
  { name: "GPTBot", family: "openai", pattern: /GPTBot/i },
  { name: "ChatGPT-User", family: "openai", pattern: /ChatGPT-User/i },
  { name: "OAI-SearchBot", family: "openai", pattern: /OAI-SearchBot/i },
  { name: "ClaudeBot", family: "anthropic", pattern: /ClaudeBot/i },
  { name: "Claude-User", family: "anthropic", pattern: /Claude-User/i },
  { name: "anthropic-ai", family: "anthropic", pattern: /anthropic-ai/i },
  { name: "PerplexityBot", family: "perplexity", pattern: /PerplexityBot/i },
  { name: "Perplexity-User", family: "perplexity", pattern: /Perplexity-User/i },
  { name: "Google-Extended", family: "google", pattern: /Google-Extended/i },
  { name: "Googlebot", family: "google", pattern: /Googlebot/i },
  { name: "Applebot-Extended", family: "apple", pattern: /Applebot-Extended/i },
  { name: "Applebot", family: "apple", pattern: /Applebot/i },
  { name: "meta-externalagent", family: "meta", pattern: /meta-externalagent/i },
  { name: "FacebookBot", family: "meta", pattern: /FacebookBot/i },
  { name: "CCBot", family: "common-crawl", pattern: /CCBot/i },
  { name: "Bytespider", family: "other", pattern: /Bytespider/i },
  { name: "Amazonbot", family: "other", pattern: /Amazonbot/i },
  { name: "Bingbot", family: "other", pattern: /bingbot/i },
  { name: "YouBot", family: "other", pattern: /YouBot/i },
  { name: "DuckAssistBot", family: "other", pattern: /DuckAssistBot/i },
]

function classifyBot(userAgent: string) {
  const match = BOT_PATTERNS.find((bot) => bot.pattern.test(userAgent))
  if (match) return { botName: match.name, family: match.family }
  if (/bot|crawler|spider|crawl|slurp/i.test(userAgent)) return { botName: "Other crawler", family: "other" }
  return null
}

function logBotVisit(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? ""
  const bot = classifyBot(userAgent)
  if (!bot) return

  console.info("[bot-visit]", JSON.stringify({
    ...bot,
    path: request.nextUrl.pathname,
    userAgent: userAgent.slice(0, 240),
    country: request.headers.get("x-vercel-ip-country") ?? undefined,
  }))
}

export function middleware(request: NextRequest) {
  logBotVisit(request)

  const target = MARKDOWN_ROUTES[request.nextUrl.pathname]
  if (!target) {
    return NextResponse.next()
  }

  const accept = request.headers.get("accept") ?? ""
  if (!accept.toLowerCase().includes("text/markdown")) {
    const next = NextResponse.next()
    next.headers.set("Vary", "Accept")
    return next
  }

  const markdownUrl = new URL(target, request.url)
  const response = NextResponse.rewrite(markdownUrl)
  response.headers.set("Content-Type", "text/markdown; charset=utf-8")
  response.headers.set("Vary", "Accept")
  response.headers.set("Cache-Control", "public, max-age=300")
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml)$).*)"],
}
