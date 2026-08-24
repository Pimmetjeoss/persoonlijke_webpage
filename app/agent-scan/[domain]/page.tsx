import type { Metadata } from "next"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { getLatestByDomain } from "@/lib/agent-scan/cache"
import { ReportSchema } from "@/lib/agent-scan/schemas"
import { ReportContent } from "../components/report-content"
import { ScanningView } from "../components/scanning-view"

type PageProps = {
  params: Promise<{ domain: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params
  const decoded = decodeURIComponent(domain)
  return {
    title: `Agent-scan score voor ${decoded} — Code Lieshout`,
    description: `Hoe klaar is ${decoded} voor AI-agents? Bekijk de agent-scan score en verbeterpunten.`,
    robots: { index: false },
  }
}

export default async function AgentScanResultPage({ params }: PageProps) {
  const { domain: rawDomain } = await params
  const domain = decodeURIComponent(rawDomain).toLowerCase()

  const row = await getLatestByDomain(domain)
  const parsed = row?.raw ? ReportSchema.safeParse(row.raw) : null
  const hasReport = row?.status === "done" && parsed?.success === true

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title={domain.toUpperCase()}
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />

      <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-10">
        {hasReport && parsed?.success ? (
          <ReportContent domain={domain} report={parsed.data} />
        ) : (
          <ScanningView domain={domain} />
        )}
      </div>

      <StickyFooter />
    </div>
  )
}
