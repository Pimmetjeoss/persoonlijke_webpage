# Get Page Markdown

Fetch a curated markdown version of a Code Lieshout page instead of raw HTML.
Content is written specifically for AI-agent consumption (concise, well-structured,
with cross-links).

## Requirements

- Send `GET https://code-lieshout.nl/<path>` with header `Accept: text/markdown`
- Supported paths: `/`, `/about`, `/portfolio`, `/ai-agents`, `/contact`, `/blog`
- Response has `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`
- Browsers without the Accept header receive normal HTML (content negotiation)

## Example

```bash
curl -H "Accept: text/markdown" https://code-lieshout.nl/
curl -H "Accept: text/markdown" https://code-lieshout.nl/ai-agents
```

## Validate

```bash
curl -sI -H "Accept: text/markdown" https://code-lieshout.nl/ | grep -i content-type
# Expected: Content-Type: text/markdown; charset=utf-8
```
