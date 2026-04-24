export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return Response.json(
    {
      status: "ok",
      service: "agent-ready-scanner",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  )
}
