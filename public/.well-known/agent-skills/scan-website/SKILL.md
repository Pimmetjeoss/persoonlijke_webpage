# Scan Website for Agent-Readiness

Scan any public website against 19 agent-readiness standards (robots.txt,
sitemap, Link headers, markdown negotiation, AI-bot rules, content signals,
Web Bot Auth, API catalog, OAuth discovery, MCP Server Card, A2A Agent Card,
Agent Skills, WebMCP, and 5 commerce protocols) and receive a score + failing
checks report.

## Requirements

- Send `POST https://code-lieshout.nl/agent-ready/api/scan` with JSON body `{"url": "https://TARGET.com"}`
- Response is `{success: boolean, data?: {domain, cached}, error?: string}`
- View full results at `https://code-lieshout.nl/agent-ready/<domain>`
- Rate limit: 10 scans per hour per IP
- Cache: identical domains re-use results within 24h

## Example

```bash
curl -X POST https://code-lieshout.nl/agent-ready/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## Validate

After scanning, visit `https://code-lieshout.nl/agent-ready/example.com` to see
the agent-readiness score (0-100), level (1-5), and detailed pass/fail report
per check.
