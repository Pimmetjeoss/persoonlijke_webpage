import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MARKDOWN_ROUTES: Record<string, string> = {
  "/": "/home.md",
  "/about": "/about.md",
  "/portfolio": "/portfolio.md",
  "/ai-agents": "/ai-agents.md",
  "/contact": "/contact.md",
  "/blog": "/blog.md",
  "/jouw-website": "/jouw-website.md",
  "/agent-ready": "/agent-ready.md",
  "/faq": "/faq.md",
  "/sir-prikkel": "/sir-prikkel.md",
}

const KNOWN_FIRST_SEGMENTS = new Set([
  "about",
  "portfolio",
  "ai-agents",
  "contact",
  "blog",
  "jouw-website",
  "agent-ready",
  "faq",
  "FAQ",
  "sir-prikkel",
  "webmcp",
  "test",
  "webdesign",
  "database",
  "seo-dashboard",
  "google-score",
  "chatgpt-check",
  "agent-scan",
  "speed-check",
  "seo-geo-scan",
  "mcp-explorer",
  "cactus-3d",
  "klantenportaal",
  "under-construction",
  "about-me",
  "api",
  ".well-known",
])

const MARKDOWN_404_BODY = `# 404 — Pagina niet gevonden

Deze pagina bestaat niet op code-lieshout.nl.

Waar moet je zijn?

- Sitemap (alle pagina's): https://code-lieshout.nl/sitemap.xml
- Agent-overzicht (llms.txt): https://code-lieshout.nl/llms.txt
- Prijzen (machineleesbaar): https://code-lieshout.nl/pricing.md
- Contact met Pim: https://code-lieshout.nl/contact
- Home: https://code-lieshout.nl
`

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

  const pathname = request.nextUrl.pathname
  const accept = request.headers.get("accept") ?? ""
  const wantsMarkdown = accept.includes("text/markdown")

  // Serve static .md files (e.g. /about.md, /agents.md) with an explicit
  // markdown content type so AI-agents get text/markdown; charset=utf-8.
  if (pathname.endsWith(".md")) {
    const response = NextResponse.next()
    response.headers.set("Content-Type", "text/markdown; charset=utf-8")
    response.headers.set("Cache-Control", "public, max-age=300")
    response.headers.set("Vary", "Accept")
    return response
  }

  // acceptmarkdown.com content negotiation: serve the curated markdown
  // variant on the same URL when the client asks for text/markdown.
  // Vary: Accept voorkomt dat een CDN de HTML-variant aan agents serveert.
  const target = MARKDOWN_ROUTES[pathname]
  if (target && wantsMarkdown) {
    const response = NextResponse.rewrite(new URL(target, request.url))
    response.headers.set("Content-Type", "text/markdown; charset=utf-8")
    response.headers.set("Cache-Control", "public, max-age=300")
    response.headers.set("Vary", "Accept")
    return response
  }

  // Agent-vriendelijke 404: echte 404-status met markdown-body (sitemap-,
  // llms.txt- en contact-links) voor agents die om markdown vragen op een
  // onbekend pad. Browsers (Accept: text/html) blijven de HTML-404 krijgen.
  if (wantsMarkdown && request.method === "GET") {
    const hasExtension = /\.[a-z0-9]+$/i.test(pathname)
    const firstSegment = pathname.split("/").filter(Boolean)[0] ?? ""
    const known = pathname === "/" || KNOWN_FIRST_SEGMENTS.has(firstSegment)
    if (!hasExtension && !known) {
      return new NextResponse(MARKDOWN_404_BODY, {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "no-store",
          "Vary": "Accept",
        },
      })
    }
  }

  // Keep browser routes as HTML. Markdown remains available explicitly via
  // /about.md, etc. and via Accept-negotiation hierboven.
  if (target) {
    const next = NextResponse.next()
    next.headers.set("Link", `<${target}>; rel="alternate"; type="text/markdown"`)
    return next
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml)$).*)"],
}
