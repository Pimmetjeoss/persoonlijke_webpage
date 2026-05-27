---
name: agent-ready-scan
description: >
  Scan een website tegen de agent-readiness standaarden (robots.txt, sitemap,
  Link headers, markdown-negotiation, AI-bot regels, Content Signals, WebMCP,
  MCP Server Card, A2A Agent Card, API Catalog, Agent Skills, OAuth) en geef een
  score van 0–100, een level (1–5) en concrete verbeterpunten terug. Gebruik
  deze skill zodra de gebruiker wil weten hoe klaar een website is voor
  AI-agents — bij zinnen als "is mijn site agent-ready", "agent readiness
  check", "scan deze site voor AI", "hoe vindbaar ben ik voor ChatGPT / Claude /
  Perplexity", "AI-readiness", "check mijn llms.txt / WebMCP / MCP", of wanneer
  iemand een URL deelt en vraagt of die klaar is voor AI-agents. Activeer ook bij
  twijfel zodra het over de AI- of agent-vindbaarheid van een website gaat, ook
  als de gebruiker het woord "scan" niet letterlijk gebruikt.
---

# Agent-Ready Scan

Deze skill laat je een publieke website scannen tegen 14 kern-standaarden (plus
5 optionele commerce-protocollen) die AI-agents gebruiken om een site te vinden,
begrijpen en te benaderen. De scan draait op de API van code-lieshout.nl; jij
hoeft alleen de juiste call te doen en het resultaat netjes te presenteren.

## Werkwijze

### Stap 1 — Vraag de URL (als die er nog niet is)
Je hebt één publieke URL nodig, bijvoorbeeld `https://bbquality.nl`. Heeft de
gebruiker al een domein of URL genoemd, gebruik die dan direct — vraag niet
nog eens.

### Stap 2 — Roep de scan-API aan
Doe een `POST` naar de scan-API met de URL als JSON-body:

```bash
curl -s -X POST https://code-lieshout.nl/agent-ready/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://DOELSITE.nl"}'
```

Belangrijk om te weten:
- **Rate limit:** 10 scans per uur per IP. Bij overschrijding krijg je HTTP 429.
- **Cache:** dezelfde URL hergebruikt het resultaat binnen 24 uur (`cached: true`).
  Dat is normaal en prima — meld het hooguit terloops.

### Stap 3 — Verwerk de JSON-response
Bij succes ziet de response er zo uit:

```json
{
  "success": true,
  "data": {
    "domain": "bbquality.nl",
    "cached": false,
    "score": 31,
    "level": 1,
    "levelName": "Basic Web Presence",
    "reportUrl": "https://code-lieshout.nl/agent-ready/bbquality.nl",
    "failing": [
      { "check": "markdownNegotiation", "category": "contentAccessibility",
        "message": "Site does not support Markdown for Agents" }
    ]
  }
}
```

- `score` — 0 t/m 100 (alleen de kern-checks tellen mee).
- `level` — 1 t/m 5 (`levelName` is de bijbehorende naam).
- `failing` — de gezakte kern-checks die de score drukken. Een lege lijst betekent
  dat alle kern-checks geslaagd zijn.
- `reportUrl` — link naar het volledige, visuele rapport.

Bij een fout is `success` `false` en staat de reden in `error`. Zie
[Foutafhandeling](#foutafhandeling).

Ontbreekt het veld `score` in `data` (oudere API-versie die alleen `domain` en
`cached` teruggaf)? Verzin dan geen cijfers — meld dat de scan is uitgevoerd en
verwijs naar `https://code-lieshout.nl/agent-ready/{domain}` voor de uitslag.

### Stap 4 — Presenteer het resultaat
Gebruik dit vaste rapportformat zodat de uitkomst meteen leesbaar is. Vertaal de
`check`-sleutels naar leesbare namen met de [labeltabel](#labeltabel) hieronder
— toon dus "Markdown voor agents", niet `markdownNegotiation`.

```markdown
# Agent-readiness: {domain}

**Score: {score}/100 — Level {level}/5 ({levelName})**
Volledig rapport: {reportUrl}

## Verbeterpunten
- **{leesbaar label}** ({categorie}) — {message}
- ...
```

Als `failing` leeg is, schrijf dan: "Alle kern-checks geslaagd 🎉" in plaats van
een lijst. Sluit af met 1–2 zinnen die de belangrijkste eerstvolgende winst
benoemen (de check die het makkelijkst te fixen is, bijv. Content Signals of
llms.txt).

## Labeltabel

Vertaal `check`-sleutels naar deze leesbare namen:

| sleutel | label |
|---|---|
| `robotsTxt` | robots.txt |
| `sitemap` | sitemap.xml |
| `linkHeaders` | Link headers (RFC 8288) |
| `markdownNegotiation` | Markdown voor agents |
| `llmsTxt` | llms.txt |
| `robotsTxtAiRules` | AI-bot regels |
| `contentSignals` | Content Signals |
| `webBotAuth` | Web Bot Auth |
| `apiCatalog` | API Catalog |
| `oauthDiscovery` | OAuth discovery |
| `oauthProtectedResource` | OAuth Protected Resource |
| `mcpServerCard` | MCP Server Card |
| `a2aAgentCard` | A2A Agent Card |
| `agentSkills` | Agent Skills |
| `webMcp` | WebMCP |

Categorie-sleutels: `discoverability` = Vindbaarheid, `contentAccessibility` =
Content, `botAccessControl` = Bot-toegang, `discovery` = Protocol-ontdekking.

## Foutafhandeling

Reageer rustig en behulpzaam, niet technisch-paniekerig:

- **HTTP 400 / "Geen URL meegegeven" / "Ongeldige JSON body"** — de URL ontbreekt
  of klopt niet. Vraag om een geldige publieke URL (met `https://`).
- **HTTP 429 / limiet bereikt** — er zijn 10 scans in het afgelopen uur gedaan.
  Leg uit dat de gebruiker een uur moet wachten, of een al gescande site
  (`cached`) opnieuw kan opvragen.
- **HTTP 502 / scan mislukte** — de doelsite was niet bereikbaar of weigerde de
  scan. Controleer de URL en of de site publiek online staat.
- **HTTP 500 / "Er ging iets mis"** — tijdelijke serverfout. Stel voor het later
  opnieuw te proberen.

Verzin nooit een score als de API geen geldige `data` teruggeeft — meld dan
gewoon de fout.

## Goed om te weten

- Dit is een **wrapper** om de scanner van code-lieshout.nl; de skill voert zelf
  geen losse checks uit. Eén `POST` levert de complete uitslag.
- De score gaat alleen over de 14 kern-checks. De 5 commerce-protocollen (x402,
  ACP, AP2, MPP, UCP) tellen niet mee en zitten niet in `failing`.
- Wil de gebruiker per verbeterpunt uitleg of een fix? Verwijs naar het volledige
  rapport op `reportUrl`, of leg de betreffende standaard uit op basis van de
  `message`.
