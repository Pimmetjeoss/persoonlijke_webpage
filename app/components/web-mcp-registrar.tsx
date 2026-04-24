"use client"

import { useEffect } from "react"

type ToolDefinition = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input: Record<string, unknown>) => Promise<unknown>
}

type ModelContext = {
  registerTool?: (tool: ToolDefinition, options?: { signal?: AbortSignal }) => void
  provideContext?: (tools: ToolDefinition[]) => void
}

declare global {
  interface Navigator {
    modelContext?: ModelContext
  }
}

const ORIGIN = "https://code-lieshout.nl"

const TOOLS: ToolDefinition[] = [
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
    },
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
    },
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
    },
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
    },
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
  useEffect(() => {
    if (typeof navigator === "undefined") return
    const ctx = navigator.modelContext
    if (!ctx) return

    const controller = new AbortController()

    if (typeof ctx.registerTool === "function") {
      for (const tool of TOOLS) {
        try {
          ctx.registerTool(tool, { signal: controller.signal })
        } catch {
          // Silently ignore individual tool-registration failures.
        }
      }
    } else if (typeof ctx.provideContext === "function") {
      try {
        ctx.provideContext(TOOLS)
      } catch {
        // Silent fallback.
      }
    }

    return () => controller.abort()
  }, [])

  return null
}
