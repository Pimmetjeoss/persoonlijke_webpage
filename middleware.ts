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

export function middleware(request: NextRequest) {
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
  matcher: ["/", "/about", "/portfolio", "/ai-agents", "/contact", "/blog"],
}
