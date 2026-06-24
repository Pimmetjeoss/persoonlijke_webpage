import type { Metadata } from "next"
import { BarChartIcon, RocketIcon } from "@radix-ui/react-icons"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import { ResultSection } from "@/app/google-score/components/result-section"
import { RequestForm } from "./components/request-form"

export const metadata: Metadata = {
  title: "Gratis SEO/GEO scan aanvragen - Code Lieshout",
  description:
    "Vraag een gratis SEO/GEO scan aan en ontdek hoe jouw website beter gevonden wordt in Google en AI-antwoorden.",
  robots: { index: false },
}

type PageProps = {
  searchParams: Promise<{
    website?: string
    score?: string
  }>
}

export default async function SeoGeoScanPage({ searchParams }: PageProps) {
  const params = await searchParams
  const parsedScore = Number.parseFloat(params.score ?? "")
  const initialScore = Number.isFinite(parsedScore) ? parsedScore : null

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="SEO/GEO SCAN"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />

      <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-10">
        <div>
          <p
            className="uppercase text-xs tracking-widest mb-1"
            style={{ color: "hsl(142.1 76.2% 36.3%)" }}
          >
            Gratis scan
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: "hsl(144.9 80.4% 10%)",
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Level up naar de absolute top
          </h1>
        </div>

        <ResultSection
          id="aanvraag"
          title="Vraag je gratis SEO/GEO scan aan"
          description="Ik kijk hoe jouw website beter vindbaar wordt in Google en in AI-antwoorden."
          icon={<BarChartIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <RequestForm
            initialWebsite={params.website ?? ""}
            initialScore={initialScore}
          />
        </ResultSection>

        <ResultSection
          id="wat-je-krijgt"
          title="Wat je krijgt"
          description="Geen generiek rapport, maar concrete kansen op basis van jouw website."
          icon={<RocketIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Waar Google je nu wel en niet goed begrijpt.",
              "Welke pagina's kansrijk zijn voor AI-antwoorden.",
              "Welke stappen je dichter bij de absolute top brengen.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border-[3px] p-5 bg-white"
                style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
              >
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </ResultSection>

        <div className="h-8" />
      </div>
      <StickyFooter />
    </div>
  )
}
