"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import type {
  WebMcpModelContext,
  WebMcpToolAnnotations,
  WebMcpToolDefinition,
} from "../webmcp/demos/webmcp"

type SiteToolDefinition = Omit<WebMcpToolDefinition, "execute"> & {
  execute: (input: Record<string, unknown>) => unknown | Promise<unknown>
}

type CompatibleModelContext = WebMcpModelContext & {
  provideContext?: (tools: SiteToolDefinition[]) => void
}

declare global {
  interface Navigator {
    /** Tijdelijke compatibiliteit met oudere WebMCP-prototypes. ChatGPT
        gebruikt de actuele API op `document.modelContext`. */
    modelContext?: CompatibleModelContext
  }
}

const ORIGIN = "https://code-lieshout.nl"

const readOnlyAnnotations = (openWorldHint = false): WebMcpToolAnnotations => ({
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint,
})

const TOOLS: SiteToolDefinition[] = [
  {
    name: "scan_agent_readiness",
    description:
      "Scan a public website for agent-readiness against 19 standards (robots.txt, markdown negotiation, MCP, OAuth discovery, etc.) and return the score, level and failing checks.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The full https URL to scan (e.g. https://example.com)",
        },
      },
      required: ["url"],
      additionalProperties: false,
    },
    annotations: readOnlyAnnotations(true),
    execute: async (input) => {
      const url = typeof input.url === "string" ? input.url : ""
      const res = await fetch(`${ORIGIN}/agent-ready/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      return {
        ...data,
        resultUrl: data?.data?.domain
          ? `${ORIGIN}/agent-ready/${data.data.domain}`
          : null,
      }
    },
  },
  {
    name: "list_site_sections",
    description:
      "List the main navigable sections of code-lieshout.nl with their URLs and a short description, so an agent can decide where to navigate.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    annotations: readOnlyAnnotations(),
    execute: async () => ({
      sections: [
        { url: `${ORIGIN}/`, label: "Home", description: "Overview of Code Lieshout" },
        { url: `${ORIGIN}/about`, label: "Over Pim", description: "About the founder" },
        { url: `${ORIGIN}/portfolio`, label: "Portfolio", description: "Recent projects and work experience" },
        { url: `${ORIGIN}/ai-agents`, label: "AI-agents", description: "AI agents explained + FAQ" },
        { url: `${ORIGIN}/blog`, label: "Blog", description: "Dutch articles on AI and web dev" },
        { url: `${ORIGIN}/contact`, label: "Contact", description: "How to reach Pim" },
        { url: `${ORIGIN}/agent-ready`, label: "Agent-Ready Scanner", description: "Free tool to scan websites" },
      ],
    }),
  },
  {
    name: "get_contact_info",
    description:
      "Return public contact information for Code Lieshout (email and phone) so an agent can relay it to the user.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    annotations: readOnlyAnnotations(),
    execute: async () => ({
      business: "Code Lieshout",
      founder: "Pim van Lieshout",
      email: "pim@code-lieshout.nl",
      phone: "+31612419980",
      website: ORIGIN,
      country: "Nederland",
      language: "nl-NL",
    }),
  },
  {
    name: "get_page_markdown",
    description:
      "Fetch a clean markdown version of a Code Lieshout page (e.g. /, /about, /ai-agents). Returns the agent-optimized content instead of raw HTML.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path on code-lieshout.nl, starting with /. Supported: /, /about, /portfolio, /ai-agents, /contact, /blog",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
    annotations: readOnlyAnnotations(),
    execute: async (input) => {
      const path = typeof input.path === "string" ? input.path : "/"
      const res = await fetch(`${ORIGIN}${path}`, {
        headers: { Accept: "text/markdown" },
      })
      const markdown = await res.text()
      return { path, markdown }
    },
  },
]

export function WebMcpRegistrar() {
  const pathname = usePathname()

  useEffect(() => {
    // Demo-routes bieden alleen hun eigen, taakgerichte tools aan. Zo krijgt
    // een restaurantagent geen algemene site- of scannertools ertussen.
    if (pathname.startsWith("/webmcp/demos/")) return

    const controller = new AbortController()
    let interval: ReturnType<typeof setInterval> | null = null
    let timeout: ReturnType<typeof setTimeout> | null = null

    const register = () => {
      const current =
        (document.modelContext as CompatibleModelContext | undefined) ?? navigator.modelContext
      if (!current) return false

      if (typeof current.registerTool === "function") {
        for (const tool of TOOLS) {
          Promise.resolve(current.registerTool(tool, { signal: controller.signal })).catch(() => {})
        }
      } else if (typeof current.provideContext === "function") {
        try {
          current.provideContext(TOOLS)
        } catch {
          // Silent fallback for older prototypes.
        }
      }

      return true
    }

    if (!register()) {
      interval = setInterval(() => {
        if (!register()) return
        if (interval) clearInterval(interval)
        interval = null
      }, 100)
      timeout = setTimeout(() => {
        if (interval) clearInterval(interval)
        interval = null
      }, 10_000)
    }

    return () => {
      controller.abort()
      if (interval) clearInterval(interval)
      if (timeout) clearTimeout(timeout)
    }
  }, [pathname])

  return null
}
