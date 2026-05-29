import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const dynamic = "force-static"

export async function GET() {
  const markdown = await readFile(join(process.cwd(), "public", "home.md"), "utf8")
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  })
}
