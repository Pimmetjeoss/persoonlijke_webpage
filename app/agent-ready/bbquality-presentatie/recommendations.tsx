"use client"

/*
 * Aanbevelingsteksten die uitklappen bij een check.
 * Deze staan in een client-component zodat de (meervoudige) JSX volledig
 * client-side rendert en niet via de server/client-grens geserialiseerd wordt
 * (dat veroorzaakte een React "unique key"-waarschuwing).
 *
 * Wil je een nieuwe aanbeveling toevoegen? Maak hier een component, voeg 'm toe
 * aan de RECOMMENDATIONS-map onderaan, en koppel de sleutel in page.tsx via
 * `recommendationKey: "<sleutel>"`. Zo blijft alle JSX client-side (geen JSX
 * over de server/client-grens → geen React "unique key"-waarschuwing).
 */

import type { FC } from "react"

const GREEN = "hsl(142.1 76.2% 36.3%)"

export function RobotsRecommendation() {
  return (
    <div className="space-y-3">
      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          ✅ Wat goed staat
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Bestand bestaat, wordt als <code>text/plain</code> geserveerd (HTTP
            200) — geldig formaat.
          </li>
          <li>
            <code>Sitemap:</code> verwijst naar <code>sitemap_index.xml</code> en
            die is bereikbaar (200, geldige XML).
          </li>
          <li>
            <code>/wp-admin/</code> correct geblokkeerd, met{" "}
            <code>admin-ajax.php</code> toegestaan (standaard WordPress).
          </li>
          <li>
            Baidu en Yandex volledig geblokkeerd (<code>Disallow: /</code>) —
            bewuste keuze.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          ⚠️ Wat fout of zwak is
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>FAQ-blokkades werken niet.</strong> robots.txt kent geen
            regex; <code>/faq.*</code> en <code>/faq/.*</code> matchen alleen
            paden met een letterlijke punt. De echte pagina&apos;s{" "}
            <code>/faq</code> en <code>/faq/</code> (beide 200) blijven dus
            crawlbaar. Gebruik <code>Disallow: /faq</code> als je ze écht wilt
            blokkeren.
          </li>
          <li>
            <strong>Named-bot groepen erven de Disallow niet.</strong> Het blok
            voor bingbot/Amazonbot/Pinterest heeft alleen een{" "}
            <code>crawl-delay</code> en geen <code>Disallow</code>. Volgens de
            spec gebruikt een bot enkel zijn eigen groep — dus die mogen{" "}
            <code>/wp-admin/</code> wél crawlen. Herhaal de Disallow-regels binnen
            die groep.
          </li>
          <li>
            Slordige trailing spatie achter <code>User-agent: msnbot</code>.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          ❌ Wat ontbreekt
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Geen expliciete AI-bot regels</strong> (GPTBot, ClaudeBot,
            PerplexityBot, Google-Extended, CCBot). Ze vallen nu onder{" "}
            <code>*</code> — dus per ongeluk toegestaan.
          </li>
          <li>
            <strong>Geen Content Signals</strong> — dit is de easy win naar
            agent-ready Level 2.
          </li>
          <li>
            <strong>Andere Chinese bots niet afgevangen.</strong> Baidu is
            geblokkeerd, maar Bytespider (ByteDance), Sogou, 360Spider, PetalBot
            en YisouSpider staan er niet in en vallen onder <code>*</code>{" "}
            (toegestaan). Let op: robots.txt is vrijwillig — echt blokkeren doe je
            op server-/firewall-niveau.
          </li>
        </ul>
      </div>
    </div>
  )
}

export function ContentSignalsRecommendation() {
  return (
    <div className="space-y-3">
      <p>
        Met Content Signals leg je in je robots.txt vast hóe bots je content
        mogen gebruiken — uitgesplitst in drie losse signalen. Het is een{" "}
        <strong>voorkeur, geen technisch slot</strong>: combineer het met
        WAF-/firewallregels voor echte bescherming.
      </p>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          De drie signalen (elk yes/no)
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <code>search</code> — opnemen in een zoekindex (links + korte
            excerpts).
          </li>
          <li>
            <code>ai-input</code> — content live invoeren in AI-modellen (RAG,
            AI-zoekantwoorden).
          </li>
          <li>
            <code>ai-train</code> — gebruiken om AI-modellen te trainen of te
            fine-tunen.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Voorbeeld 1 — zoeken + AI-antwoorden toestaan, training blokkeren
        </p>
        <pre
          className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
        >
          {`User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /`}
        </pre>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Voorbeeld 2 — alle AI-gebruik blokkeren, wel vindbaar in zoekmachines
        </p>
        <pre
          className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
        >
          {`User-agent: *
Content-Signal: search=yes, ai-input=no, ai-train=no
Allow: /`}
        </pre>
      </div>
    </div>
  )
}

export function WebMcpRecommendation() {
  return (
    <div className="space-y-3">
      <p>
        WebMCP is een browser-API waarmee je website z&apos;n eigen functies als{" "}
        <strong>&quot;tools&quot;</strong> aanbiedt die een AI-agent direct in de
        pagina kan aanroepen. Agent en gebruiker werken zo in dezelfde interface
        met gedeelde context — de agent hergebruikt jouw bestaande app-logica in
        plaats van de UI na te bootsen.
      </p>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Wat het kan
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Tools registreren met naam, beschrijving, input-schema (JSON Schema)
            en een <code>execute</code>-callback.
          </li>
          <li>
            Annotaties meegeven (bijv. read-only of &quot;untrusted
            content&quot;).
          </li>
          <li>
            Tools selectief blootstellen aan specifieke origins (
            <code>exposedTo</code>).
          </li>
          <li>
            Agent krijgt gestructureerde input/output; bij wijziging vuurt een{" "}
            <code>toolchange</code>-event.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Voorbeelden van use cases
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Webshop: product-zoeken en afrekenen als tools voor een
            shopping-assistent.
          </li>
          <li>Productiviteitsapp: agent laat content aanmaken/bewerken.</li>
          <li>Klantenservice: support-workflows automatiseren.</li>
        </ul>
      </div>

      <p>
        Live demo:{" "}
        <a
          href="https://googlechromelabs.github.io/webmcp-tools/demos/sport-shop-angular/#/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
          style={{ color: GREEN }}
        >
          Chrome Labs WebMCP sport-shop demo
        </a>
      </p>
    </div>
  )
}

export function McpServerCardRecommendation() {
  return (
    <div className="space-y-3">
      <p>
        Een MCP Server Card is een klein <strong>&quot;menukaartje&quot;</strong>{" "}
        dat je op een vaste plek zet (
        <code>/.well-known/mcp/server-card.json</code>). Een AI-agent leest het en
        weet meteen welke tools je site aanbiedt, welk protocol je gebruikt en of
        er ingelogd moet worden — nog vóórdat hij verbindt of de pagina laadt.
      </p>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          In gewone taal
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Het is een <strong>aankondiging</strong>, niet het gereedschap zelf.
          </li>
          <li>
            Waar WebMCP de tools dáádwerkelijk in de browser zet, vertelt de
            Server Card vooraf: &quot;dit kun je verwachten&quot;.
          </li>
          <li>
            Je hebt het niet per se nodig (WebMCP-tools zijn ook zonder kaartje
            vindbaar), maar het maakt je site makkelijker te ontdekken voor
            agents.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Wat erop staat
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Naam + korte beschrijving van je tools</li>
          <li>Welk transport je gebruikt (bijv. WebMCP)</li>
          <li>Of er authenticatie nodig is</li>
          <li>Welke protocol-versie</li>
        </ul>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Hoe je het toevoegt
        </p>
        <p className="mb-2">
          Zet een JSON-bestandje neer op{" "}
          <code>/.well-known/mcp/server-card.json</code>, bijvoorbeeld:
        </p>
        <pre
          className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
        >
          {`{
  "serverInfo": { "name": "BBQuality", "version": "1.0.0" },
  "transport": "webmcp",
  "capabilities": {
    "tools": [
      { "name": "search_products",
        "description": "Zoek in het assortiment" }
    ]
  }
}`}
        </pre>
      </div>

      <p>
        Live voorbeeld:{" "}
        <a
          href="http://localhost:8888/shop/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
          style={{ color: GREEN }}
        >
          shop demo
        </a>
      </p>
    </div>
  )
}

export function ApiCatalogRecommendation() {
  return (
    <div className="space-y-3">
      <p>
        Een API Catalog (RFC 9727) is een soort <strong>telefoonboek van je
        API&apos;s</strong> op een vaste plek: <code>/.well-known/api-catalog</code>
        . Een agent leest het en weet meteen welke API&apos;s je aanbiedt en waar
        de documentatie staat — nog vóórdat hij ze gebruikt.
      </p>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Wat erop staat
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Links naar je API-endpoints</li>
          <li>
            Optioneel: gebruiksvoorwaarden, versie-info en links naar de
            OpenAPI-definities
          </li>
        </ul>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Formaat
        </p>
        <p>
          Linkset-JSON (<code>application/linkset+json</code>, RFC 9264).
          Minimaal voorbeeld:
        </p>
        <pre
          className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre mt-2"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
        >
          {`{
  "linkset": [
    {
      "anchor": "https://www.bbquality.nl/.well-known/api-catalog",
      "item": [
        { "href": "https://www.bbquality.nl/apis/shop" },
        { "href": "https://www.bbquality.nl/apis/orders" }
      ]
    }
  ]
}`}
        </pre>
      </div>
    </div>
  )
}

export function AgentSkillsRecommendation() {
  return (
    <div className="space-y-3">
      <p>
        Agent Skills is een open formaat (oorspronkelijk van Anthropic) om een
        AI-agent <strong>extra kennis en kant-en-klare werkwijzen</strong> te
        geven. Eén skill is gewoon een mapje met een <code>SKILL.md</code> erin:
        metadata (naam + beschrijving) plus instructies hoe een taak uit te
        voeren. Optioneel met scripts, voorbeelden en templates erbij.
      </p>

      <pre
        className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre"
        style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
      >
        {`my-skill/
├── SKILL.md      # Verplicht: metadata + instructies
├── scripts/      # Optioneel: uitvoerbare code
├── references/   # Optioneel: documentatie
└── assets/       # Optioneel: templates`}
      </pre>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Hoe het werkt (progressive disclosure)
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Ontdekken</strong> — de agent laadt eerst alleen naam +
            beschrijving van elke skill.
          </li>
          <li>
            <strong>Activeren</strong> — past een taak bij de beschrijving, dan
            leest hij de volledige <code>SKILL.md</code>.
          </li>
          <li>
            <strong>Uitvoeren</strong> — hij volgt de instructies en laadt
            scripts/bestanden pas als het nodig is.
          </li>
        </ul>
        <p className="mt-1 text-xs italic">
          Zo houdt een agent veel skills paraat met een kleine context-footprint.
        </p>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Ontdekbaar maken op je site (Cloudflare RFC)
        </p>
        <p className="mb-2">
          Publiceer een index op een vaste plek —{" "}
          <code>/.well-known/agent-skills/index.json</code> — die al je skills
          opsomt. Dit is precies wat de scan hierboven mist. Voorbeeld:
        </p>
        <pre
          className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
        >
          {`{
  "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  "skills": [
    {
      "name": "bestel-status",
      "type": "skill-md",
      "description": "Zoek de status van een BBQuality-bestelling op.",
      "url": "/.well-known/agent-skills/bestel-status/SKILL.md",
      "digest": "sha256:..."
    }
  ]
}`}
        </pre>
      </div>

      <p>
        Zo weet een agent welke gespecialiseerde taken hij voor jouw site kan
        uitvoeren — en de skill werkt in elke skills-compatibele agent (Claude,
        Cursor, Copilot, Goose, enz.).
      </p>

      <p>
        Voorbeeld van een echte skill om te bekijken of downloaden:{" "}
        <a
          href="https://github.com/Pimmetjeoss/persoonlijke_webpage/blob/main/.agents/skills/agent-ready-scan/SKILL.md"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
          style={{ color: GREEN }}
        >
          agent-ready-scan SKILL.md (GitHub)
        </a>{" "}
        — aanroepen in Codex met <code>$agent-ready-scan</code>
      </p>
    </div>
  )
}

export function A2aAgentCardRecommendation() {
  return (
    <div className="space-y-3">
      <p>
        A2A (Agent2Agent) is een open standaard waarmee losse AI-agents{" "}
        <strong>met elkaar</strong> communiceren — de ene agent kan een taak
        delegeren aan de andere. De Agent Card op{" "}
        <code>/.well-known/agent-card.json</code> is het visitekaartje van jouw
        agent: andere agents lezen het en weten wat &apos;ie kan en hoe ze
        &apos;m aanspreken.
      </p>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Verschil met MCP / WebMCP
        </p>
        <p>
          MCP en WebMCP gaan over een agent die <strong>tools</strong> gebruikt.
          A2A gaat over agents die <strong>elkaar</strong> aanspreken
          (taakdelegatie, ook langlopende async taken). Ze vullen elkaar aan.
        </p>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Wat erop staat
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Naam, beschrijving en versie van je agent</li>
          <li>Service-endpoint (waar de agent te bereiken is)</li>
          <li>Capabilities (streaming, push-notificaties)</li>
          <li>Skills (taken die de agent kan uitvoeren)</li>
          <li>Security schemes (API-key, OAuth2, mTLS)</li>
        </ul>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Minimaal voorbeeld
        </p>
        <pre
          className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
        >
          {`{
  "name": "BBQuality Assistent",
  "description": "Helpt met producten, bestellingen en bereiding.",
  "url": "https://www.bbquality.nl/a2a",
  "version": "1.0.0",
  "capabilities": { "streaming": true },
  "skills": [
    { "id": "bestel-status",
      "name": "Bestelstatus opvragen",
      "description": "Geeft de status van een bestelling." }
  ]
}`}
        </pre>
      </div>
    </div>
  )
}

export function OAuthDiscoveryRecommendation() {
  return (
    <div className="space-y-3">
      <p>
        OAuth discovery laat een agent automatisch ontdekken{" "}
        <strong>waar en hoe</strong> hij tokens ophaalt om beveiligde delen van je
        site te benaderen. Je zet daarvoor een metadata-document op een vaste plek —
        twee varianten die naast elkaar kunnen bestaan:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <code>/.well-known/oauth-authorization-server</code> — OAuth 2.0
          Authorization Server Metadata (RFC 8414)
        </li>
        <li>
          <code>/.well-known/openid-configuration</code> — OpenID Connect
          Discovery (als je OIDC/login gebruikt)
        </li>
      </ul>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Wat erop staat
        </p>
        <p>
          <code>issuer</code>, <code>authorization_endpoint</code>,{" "}
          <code>token_endpoint</code>, <code>jwks_uri</code>,{" "}
          <code>scopes_supported</code> en <code>grant_types_supported</code> —
          alles wat een client nodig heeft om de OAuth-flow te starten.
        </p>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Minimaal voorbeeld
        </p>
        <pre
          className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
        >
          {`{
  "issuer": "https://www.bbquality.nl",
  "authorization_endpoint": "https://www.bbquality.nl/oauth/authorize",
  "token_endpoint": "https://www.bbquality.nl/oauth/token",
  "jwks_uri": "https://www.bbquality.nl/oauth/jwks",
  "scopes_supported": ["orders:read"],
  "grant_types_supported": ["authorization_code"]
}`}
        </pre>
      </div>

      <p className="text-xs italic">
        Alleen relevant als je een eigen authorization server of login hebt waar
        agents tegen moeten inloggen. Heb je geen beveiligde agent-API? Dan kun je
        deze check gerust laten staan.
      </p>
    </div>
  )
}

export function OAuthProtectedResourceRecommendation() {
  return (
    <div className="space-y-3">
      <p>
        Dit is de tegenhanger van OAuth discovery, maar dan vanuit de{" "}
        <strong>beveiligde resource</strong> (je API) gezien. Op{" "}
        <code>/.well-known/oauth-protected-resource</code> (RFC 9728) vertel je een
        agent: &quot;deze API is beschermd, en dít is de authorization server waar
        je een token moet halen.&quot;
      </p>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Hoe het samenwerkt
        </p>
        <p>
          Agent leest dit document → vindt je <code>authorization_servers</code> →
          haalt daar via OAuth discovery (RFC 8414 / OIDC) een token → benadert je
          API. Dit is precies de schakel die MCP gebruikt om beveiligde servers aan
          agents te koppelen.
        </p>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Minimaal voorbeeld
        </p>
        <pre
          className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
        >
          {`{
  "resource": "https://www.bbquality.nl/api",
  "authorization_servers": ["https://www.bbquality.nl"],
  "scopes_supported": ["orders:read"],
  "bearer_methods_supported": ["header"]
}`}
        </pre>
      </div>

      <p className="text-xs italic">
        Net als OAuth discovery: alleen nodig als je beschermde, agent-toegankelijke
        API&apos;s of MCP-servers aanbiedt.
      </p>
    </div>
  )
}

export function LinkHeadersRecommendation() {
  return (
    <div className="space-y-3">
      <p>
        De <code>Link</code> HTTP-header (RFC 8288, &quot;Web Linking&quot;) drukt
        relaties tussen resources uit, zodat een agent gerelateerde bronnen
        ontdekt zónder de HTML te hoeven parsen. Elke link heeft een doel-URI en
        een relatietype (<code>rel</code>) — het is de HTTP-versie van{" "}
        <code>&lt;link rel=...&gt;</code> uit HTML.
      </p>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          ✅ Waarom geslaagd
        </p>
        <p>
          bbquality stuurt een <code>Link</code>-header mee met relatietype{" "}
          <code>alternate</code> (de WordPress wp-json JSON-versie). De scan vindt
          dus minstens één agent-bruikbare relatie — vandaar groen.
        </p>
      </div>

      <div>
        <p className="font-bold uppercase text-xs tracking-wide mb-1">
          Nog rijker maken (optioneel)
        </p>
        <p className="mb-2">
          Voeg meer agent-nuttige relaties toe, zodat agents in één header je
          sitemap, markdown-versie, API-catalogus of agent-card vinden:
        </p>
        <pre
          className="rounded-md border-[2px] p-3 text-xs overflow-x-auto whitespace-pre"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", backgroundColor: "white" }}
        >
          {`Link: </sitemap.xml>; rel="sitemap",
      </home.md>; rel="alternate"; type="text/markdown",
      </.well-known/api-catalog>; rel="api-catalog"`}
        </pre>
      </div>
    </div>
  )
}

export function MarkdownRecommendation() {
  return (
    <div className="space-y-2">
      <p>
        Markdown for Agents serveert een schone markdown-versie van je pagina
        zodra een AI-agent die opvraagt via de header{" "}
        <code>Accept: text/markdown</code>. Dat scheelt tokens en geeft agents
        beter verwerkbare content dan ruwe HTML.
      </p>
      <p>
        Voorbeeld van een eigen markdown-pagina op code-lieshout.nl:{" "}
        <a
          href="https://code-lieshout.nl/agent-ready.md"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
          style={{ color: GREEN }}
        >
          code-lieshout.nl/agent-ready.md
        </a>
      </p>
    </div>
  )
}

/**
 * Registry: koppelt een sleutel-string aan de bijbehorende aanbeveling-component.
 * page.tsx geeft alleen de sleutel door (geen JSX), zodat de accordion de
 * component volledig client-side rendert.
 */
export const RECOMMENDATIONS: Record<string, FC> = {
  robots: RobotsRecommendation,
  linkHeaders: LinkHeadersRecommendation,
  markdown: MarkdownRecommendation,
  contentSignals: ContentSignalsRecommendation,
  webMcp: WebMcpRecommendation,
  mcpServerCard: McpServerCardRecommendation,
  apiCatalog: ApiCatalogRecommendation,
  agentSkills: AgentSkillsRecommendation,
  a2a: A2aAgentCardRecommendation,
  oauthDiscovery: OAuthDiscoveryRecommendation,
  oauthProtectedResource: OAuthProtectedResourceRecommendation,
}
