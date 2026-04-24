import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agent-Ready Scanner API — Docs",
  description:
    "Technische documentatie voor de Agent-Ready Scanner API van Code Lieshout. Publiek endpoint voor het scannen van websites tegen 19 agent-readiness standaarden.",
}

export default function AgentReadyDocsPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <div className="mx-auto max-w-3xl p-6 lg:p-10 space-y-8">
        <div>
          <p
            className="uppercase text-xs tracking-widest mb-2"
            style={{ color: "hsl(142.1 76.2% 36.3%)" }}
          >
            API Documentation
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Agent-Ready Scanner API
          </h1>
          <p className="text-lg text-gray-700 mt-4">
            Publieke API voor het scannen van websites tegen 19 agent-readiness
            standaarden. Gratis te gebruiken, gecached per domein (24u),
            rate-limited op 10 scans/uur/IP.
          </p>
        </div>

        <section>
          <h2
            className="text-2xl font-bold mb-3"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            POST /agent-ready/api/scan
          </h2>
          <p className="text-gray-700 mb-3">
            Start een scan voor een publieke URL. Resultaten worden opgeslagen in
            Supabase en zijn bereikbaar via{" "}
            <code className="bg-white px-2 py-0.5 rounded">
              /agent-ready/[domain]
            </code>
            .
          </p>
          <pre className="bg-white rounded p-4 text-sm overflow-x-auto border-[2px]" style={{ borderColor: "hsl(144.9 80.4% 10%)" }}>
{`curl -X POST https://code-lieshout.nl/agent-ready/api/scan \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com"}'`}
          </pre>
          <p className="text-sm text-gray-600 mt-3">
            <strong>Response</strong>:{" "}
            <code className="bg-white px-2 py-0.5 rounded">
              {`{success: boolean, data?: {domain, cached}, error?: string}`}
            </code>
          </p>
        </section>

        <section>
          <h2
            className="text-2xl font-bold mb-3"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            GET /agent-ready/api/health
          </h2>
          <p className="text-gray-700">
            Health-check endpoint. Returns 200 OK als de API bereikbaar is.
          </p>
        </section>

        <section>
          <h2
            className="text-2xl font-bold mb-3"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Machine-readable specs
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              OpenAPI 3.1 spec:{" "}
              <Link
                href="/agent-ready/docs/openapi.json"
                className="underline"
                style={{ color: "hsl(142.1 76.2% 36.3%)" }}
              >
                /agent-ready/docs/openapi.json
              </Link>
            </li>
            <li>
              API Catalog (RFC 9727):{" "}
              <a
                href="/.well-known/api-catalog"
                className="underline"
                style={{ color: "hsl(142.1 76.2% 36.3%)" }}
              >
                /.well-known/api-catalog
              </a>
            </li>
            <li>
              MCP Server Card:{" "}
              <a
                href="/.well-known/mcp/server-card.json"
                className="underline"
                style={{ color: "hsl(142.1 76.2% 36.3%)" }}
              >
                /.well-known/mcp/server-card.json
              </a>
            </li>
          </ul>
        </section>

        <div className="pt-6">
          <Link
            href="/agent-ready"
            className="inline-block px-6 py-3 rounded-lg border-[3px] bg-white font-semibold uppercase tracking-wide text-sm"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              borderColor: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            ← Terug naar Scanner
          </Link>
        </div>
      </div>
    </div>
  )
}
