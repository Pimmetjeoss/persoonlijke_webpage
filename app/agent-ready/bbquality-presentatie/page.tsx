import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRightIcon,
  BarChartIcon,
  CardStackIcon,
  ExclamationTriangleIcon,
  RocketIcon,
} from "@radix-ui/react-icons"
import StickyHeader from "@/app/components/sticky-header"
import { StickyFooter } from "@/app/components/sticky-footer"
import {
  IssueAccordionGroups,
  IssueAccordionList,
  type AccordionCheck,
  type AccordionGroup,
} from "./issue-accordion"
import {
  RobotsRecommendation,
  MarkdownRecommendation,
  ContentSignalsRecommendation,
  WebMcpRecommendation,
  McpServerCardRecommendation,
  ApiCatalogRecommendation,
  AgentSkillsRecommendation,
  A2aAgentCardRecommendation,
  OAuthDiscoveryRecommendation,
  OAuthProtectedResourceRecommendation,
  LinkHeadersRecommendation,
} from "./recommendations"

/*
 * STATISCHE BBQUALITY-PRESENTATIE (kopie van de bbquality.nl scan).
 *
 * Deze pagina is volledig zelfstandig: alle data en opmaak staan hieronder
 * hard ingebakken. Pas gerust alles aan — het raakt de live scan-pagina
 * (app/agent-ready/[domain]/page.tsx) of de scan-data NIET.
 *
 * Wil je de score of checks wijzigen? Bewerk simpelweg de SCAN-constante.
 */

// ---------------------------------------------------------------------------
// DATA — pas dit blok aan om de voorbeeldscore/checks te veranderen
// ---------------------------------------------------------------------------

const SCAN = {
  domain: "bbquality.nl",
  score: 31,
  level: 1,
  levelName: "Basic Web Presence",

  // Categorie-balken (boven). pass = geslaagd, total = aantal checks.
  categories: [
    { label: "Vindbaarheid", pass: 3, total: 3, optional: false },
    { label: "Content", pass: 0, total: 1, optional: false },
    { label: "Bot-toegang", pass: 1, total: 3, optional: false },
    { label: "Protocol-ontdekking", pass: 0, total: 7, optional: false },
    { label: "Commerce", pass: 0, total: 5, optional: true },
  ],

  // Volgende niveau-kaart
  nextLevel: {
    target: 2,
    name: "Bot-Aware",
    requirements: [
      {
        title: "Content Signals",
        description:
          "Declare AI content usage preferences with Content Signals in robots.txt",
      },
    ],
  },

  // De 14 kern-checks, gegroepeerd per categorie (volgorde = weergave).
  coreGroups: [
    {
      label: "Vindbaarheid",
      checks: [
        {
          title: "sitemap.xml",
          status: "pass",
          message: "sitemap.xml exists with valid structure",
        },
        {
          title: "robots.txt",
          status: "pass",
          message: "robots.txt exists with valid format",
          recommendation: <RobotsRecommendation />,
        },
        {
          title: "Link headers (RFC 8288)",
          status: "pass",
          message: "Found agent-useful Link relations: alternate",
          recommendation: <LinkHeadersRecommendation />,
        },
      ],
    },
    {
      label: "Content",
      checks: [
        {
          title: "Markdown voor agents",
          status: "fail",
          message: "Site does not support Markdown for Agents",
          recommendation: <MarkdownRecommendation />,
        },
      ],
    },
    {
      label: "Bot-toegang",
      checks: [
        {
          title: "Content Signals",
          status: "fail",
          message: "No Content Signals found in robots.txt",
          recommendation: <ContentSignalsRecommendation />,
        },
        {
          title: "Web Bot Auth",
          status: "neutral",
          message: "Web Bot Auth directory not found (informational only)",
        },
        {
          title: "AI-bot regels",
          status: "pass",
          message: "Found rules for AI bots: amazonbot",
        },
      ],
    },
    {
      label: "Protocol-ontdekking",
      checks: [
        {
          title: "WebMCP",
          status: "fail",
          message: "No WebMCP tools detected on page load",
          recommendation: <WebMcpRecommendation />,
        },
        {
          title: "MCP Server Card",
          status: "fail",
          message: "MCP Server Card not found",
          recommendation: <McpServerCardRecommendation />,
        },
        {
          title: "API Catalog",
          status: "fail",
          message: "API Catalog not found",
          recommendation: <ApiCatalogRecommendation />,
        },
        {
          title: "Agent Skills",
          status: "fail",
          message: "Agent Skills index not found",
          recommendation: <AgentSkillsRecommendation />,
        },
        {
          title: "A2A Agent Card",
          status: "fail",
          message: "A2A Agent Card not found",
          recommendation: <A2aAgentCardRecommendation />,
        },
        {
          title: "OAuth discovery",
          status: "fail",
          message: "No OAuth/OIDC discovery metadata found",
          recommendation: <OAuthDiscoveryRecommendation />,
        },
        {
          title: "OAuth Protected Resource",
          status: "fail",
          message: "No OAuth Protected Resource Metadata found",
          recommendation: <OAuthProtectedResourceRecommendation />,
        },
      ],
    },
  ] satisfies AccordionGroup[],

  // Optionele commerce-checks (tellen niet mee voor de score).
  commerceChecks: [
    {
      title: "Agentic Commerce Protocol",
      status: "neutral",
      message: "ACP discovery document not found (not a commerce site)",
    },
    {
      title: "AP2",
      status: "neutral",
      message: "AP2 not detected (no A2A Agent Card) (not a commerce site)",
    },
    {
      title: "MPP",
      status: "neutral",
      message: "MPP payment discovery not detected (not a commerce site)",
    },
    {
      title: "Universal Commerce Protocol",
      status: "neutral",
      message: "UCP profile not found (not a commerce site)",
    },
    {
      title: "x402 (Payment Required)",
      status: "neutral",
      message: "x402 payment protocol not detected (not a commerce site)",
    },
  ] satisfies AccordionCheck[],
}

const TIERS = [
  { name: "Rapport", cta: "Bestel rapport", accent: "hsl(141.7 76.6% 73.1%)" },
  {
    name: "Implementatie-dossier",
    cta: "Plan een gesprek",
    accent: "hsl(141.9 69.2% 58%)",
  },
  {
    name: "Subscription",
    cta: "Neem contact op",
    accent: "hsl(142.1 76.2% 36.3%)",
  },
]

// ---------------------------------------------------------------------------
// Kleuren & badges
// ---------------------------------------------------------------------------

const DARK = "hsl(144.9 80.4% 10%)"
const GREEN = "hsl(142.1 76.2% 36.3%)"
const LIGHT = "hsl(141 78.9% 85.1%)"
const PAGE_BG = "hsl(140.6 84.2% 92.5%)"

export const metadata: Metadata = {
  title: `Agent-readiness score voor ${SCAN.domain} — Code Lieshout`,
  description: `Hoe klaar is ${SCAN.domain} voor AI-agents? Bekijk de scan-score en verbeterpunten.`,
  robots: { index: false },
}

// ---------------------------------------------------------------------------
// Kleine presentatie-componenten (inline, dus vrij aanpasbaar)
// ---------------------------------------------------------------------------

function ResultSection({
  id,
  title,
  description,
  icon,
  children,
}: {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="w-full rounded-xl border-[3px] bg-white p-8 md:p-12 shadow-xl scroll-mt-32"
      style={{ borderColor: DARK }}
    >
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0" style={{ color: DARK }}>
          {icon}
        </div>
        <div className="flex-1">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ color: DARK }}
          >
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6">{description}</p>
          <div>{children}</div>
        </div>
      </div>
    </section>
  )
}

function ScoreDisplay() {
  const circumference = 2 * Math.PI * 70
  const dash = (Math.max(0, Math.min(100, SCAN.score)) / 100) * circumference

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90" aria-hidden>
          <circle cx="80" cy="80" r="70" fill="none" stroke={LIGHT} strokeWidth="12" />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={GREEN}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl md:text-6xl font-bold leading-none"
            style={{ color: DARK, fontFamily: "var(--font-fjalla-one)" }}
          >
            {SCAN.score}
          </span>
          <span className="text-sm text-gray-600">van 100</span>
        </div>
      </div>

      <div className="text-center md:text-left">
        <p
          className="uppercase text-xs tracking-widest mb-1"
          style={{ color: GREEN }}
        >
          Level {SCAN.level} / 5
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold"
          style={{ color: DARK, fontFamily: "var(--font-fjalla-one)" }}
        >
          {SCAN.levelName}
        </h2>
        <p className="text-gray-700 mt-2 max-w-md">
          Jouw website&apos;s agent-readiness score, gebaseerd op 14 kern-checks
          over 4 categorieën. 5 optionele commerce-checks tellen niet mee.
        </p>
      </div>
    </div>
  )
}

function CategoryBar() {
  return (
    <div className="space-y-4">
      {SCAN.categories.map((cat) => {
        const barPercentage =
          cat.total === 0 ? 0 : Math.round((cat.pass / cat.total) * 100)
        return (
          <div key={cat.label}>
            <div className="flex justify-between items-baseline mb-1 gap-2 flex-wrap">
              <span
                className="uppercase text-sm font-bold tracking-wide flex items-center gap-2"
                style={{ color: DARK, fontFamily: "var(--font-fjalla-one)" }}
              >
                {cat.label}
                {cat.optional && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded tracking-widest"
                    style={{ backgroundColor: LIGHT, color: DARK }}
                  >
                    OPTIONEEL
                  </span>
                )}
              </span>
              <span className="text-sm text-gray-600">
                {cat.pass}/{cat.total} checks
              </span>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden border-[2px]"
              style={{ borderColor: DARK }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${barPercentage}%`,
                  backgroundColor: cat.optional ? LIGHT : GREEN,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function NextLevelCard() {
  const nl = SCAN.nextLevel
  return (
    <div
      className="rounded-xl border-[3px] p-6 md:p-8"
      style={{ borderColor: DARK, backgroundColor: LIGHT }}
    >
      <p
        className="uppercase text-xs tracking-widest mb-1"
        style={{ color: GREEN }}
      >
        Volgend niveau: Level {nl.target}
      </p>
      <h3
        className="text-3xl md:text-4xl font-bold mb-4"
        style={{ color: DARK, fontFamily: "var(--font-fjalla-one)" }}
      >
        {nl.name}
      </h3>
      <ul className="space-y-3">
        {nl.requirements.map((req) => (
          <li
            key={req.title}
            className="flex items-start gap-3 text-sm md:text-base"
            style={{ color: DARK }}
          >
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
              style={{ backgroundColor: GREEN }}
            >
              →
            </span>
            <span>
              <strong>{req.title}:</strong> {req.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pagina
// ---------------------------------------------------------------------------

export default function BbqualityPresentatiePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG }}>
      <StickyHeader
        title={SCAN.domain.toUpperCase()}
        backgroundColor={PAGE_BG}
        hoverColor={LIGHT}
        startExpanded={true}
      />

      <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-10">
        <div>
          <p
            className="uppercase text-xs tracking-widest mb-1"
            style={{ color: GREEN }}
          >
            Agent-readiness scan
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{ color: DARK, fontFamily: "var(--font-fjalla-one)" }}
          >
            {SCAN.domain}
          </h1>
        </div>

        <ResultSection
          id="score"
          title="Jouw score"
          description="Gebaseerd op vindbaarheid, content, bot-toegang en protocol-ontdekking."
          icon={<BarChartIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="space-y-8">
            <ScoreDisplay />
            <CategoryBar />
          </div>
        </ResultSection>

        <NextLevelCard />

        <ResultSection
          id="checks"
          title="Kern-standaarden"
          description="De 14 standaarden die AI-agents gebruiken om jouw site te vinden, begrijpen en te benaderen. Deze bepalen je score."
          icon={<ExclamationTriangleIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <IssueAccordionGroups groups={SCAN.coreGroups} />
        </ResultSection>

        <ResultSection
          id="commerce"
          title="Commerce-protocollen (optioneel)"
          description="Deze 5 protocollen zijn relevant als je via je site betalingen of transacties aanbiedt aan AI-agents. Ze tellen niet mee voor je score."
          icon={<CardStackIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <IssueAccordionList
            checks={SCAN.commerceChecks}
            categoryLabel="Commerce"
          />
        </ResultSection>

        <ResultSection
          id="pakketten"
          title="Aan de slag"
          description="Van rapport tot volledig implementatie-dossier — zo kom je naar 100/100."
          icon={<RocketIcon className="w-10 h-10 md:w-12 md:h-12" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-xl border-[3px] p-6 bg-white flex flex-col"
                style={{ borderColor: DARK }}
              >
                <div
                  className="h-2 -mx-6 -mt-6 mb-4 rounded-t-[9px]"
                  style={{ backgroundColor: tier.accent }}
                />
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: DARK, fontFamily: "var(--font-fjalla-one)" }}
                >
                  {tier.name}
                </h3>
                <div className="flex-1" />
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide hover:underline"
                  style={{ color: DARK }}
                >
                  {tier.cta}
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </ResultSection>

        <div className="text-center">
          <Link
            href="/agent-ready"
            className="inline-block px-6 py-3 rounded-lg border-[3px] bg-white font-semibold uppercase tracking-wide text-sm"
            style={{
              color: DARK,
              borderColor: DARK,
              fontFamily: "var(--font-fjalla-one)",
            }}
          >
            Scan nog een site
          </Link>
        </div>

        <div className="h-8" />
      </div>
      <StickyFooter />
    </div>
  )
}
