# WebMCP-evaluaties

Laatste volledige evaluatie: 29 augustus 2026.

De vier eigen demo's zijn getest met de officiële [`webmcp-evals`](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/webmcp-evals)-tooling, versie `0.0.4` (upstream commit `97e6fbe83fc3f2e3c6df2198b962dd2ad59cb924`). De live agent-evals gebruikten `gemini-2.5-flash` via de `GEMINI_API_KEY` uit `.env`.

| Demo | Cases | Deterministische smoke | Gemini (3 runs/case) | Uitkomst |
| --- | ---: | ---: | ---: | --- |
| Le Prikkel Bistro | 2 | 2/2 | 6/6 | Geslaagd |
| CinePrikkel | 2 | 5/5 | 15/15 | Geslaagd |
| PrikkelFabriek | 2 | 19/19 | 57/57 | Geslaagd |
| PrikkelThuis | 2 | 2/2 | 6/6 | Geslaagd |
| **Totaal** | **8** | **28/28** | **84/84** | **100%** |

De smoke-run bewijst dat Chrome iedere bedoelde tool ontdekt en dat alle verwachte calls tegen een verse pagina uitvoerbaar zijn. De Gemini-run beoordeelt daarnaast of een model vanuit een Nederlandse gebruikersvraag zelf de juiste toolnamen, argumenten en volgorde kiest. Iedere case is drie keer uitgevoerd. Dat is een bruikbaardere baseline dan één run, maar nog geen grote statistische steekproef.

## Bevindingen

- De eerste lokale run gebruikte `127.0.0.1` terwijl de bestaande Next.js-devserver op `localhost` draaide. Next.js blokkeerde daardoor clientbundels als cross-origin en er werden geen tools geregistreerd. De runner gebruikt nu consequent `localhost`.
- De demo-polyfill exposeerde alleen de oudere `document.modelContext`-naam. Hij koppelt die nu aan de native `navigator.modelContext`-API wanneer Chrome die aanbiedt, zodat zowel oudere clients als de officiële evaluator dezelfde registraties zien.
- Het Bistro-schema werd door Chrome wel intern geregistreerd, maar de CDP/WebMCP-interface liet het invoerschema weg wanneer de uitgebreide veldconstraints en beschrijvingen samen werden aangeboden. De tool houdt dezelfde DOM-validatie, maar publiceert een compact schema dat Chrome correct aan agents doorgeeft.
- Voor de vertrekopdracht koos Gemini aanvankelijk een verdedigbare maar andere set slim-huistegels. De toolomschrijving vermeldt nu expliciet welke bediening bij de twee gedemonstreerde situaties hoort.
- De fabriek mag de toestand en het hoofdprotocol in beide volgordes lezen; de eval gebruikt daarvoor de officiële `unordered`-constraint. De bioscoopcase vraagt expliciet om het volledige aanbod, zodat de verwachte zoekopdracht met `genre: "all"` reproduceerbaar is.
- Eén koude devserver-run leverde bij de eerste Bistro-case tijdelijk nul geregistreerde tools op; alle deterministische tests en de daaropvolgende drie Gemini-runs slaagden. Dit wijst op een timingfluctuatie tussen Next.js-hydration en de evaluator, niet op een fout in de toolcall.

## Opnieuw uitvoeren

```bash
npm run eval:webmcp:smoke
npm run eval:webmcp
```

De runner gebruikt een al draaiende site op `http://localhost:3000`, of start zelf `next dev`. Datumtokens in de bistro- en bioscoopcases worden bij iedere run naar vandaag en morgen omgezet. Standaard draait iedere Gemini-case drie keer; overschrijf dit zo nodig met `WEBMCP_EVAL_RUNS`. Een losse demo kan met `node scripts/run-webmcp-evals.mjs browser bioscoop` worden getest. JSON- en HTML-rapporten komen onder `.evals/webmcp/browser/`; deze gegenereerde rapporten staan in `.gitignore`.

De broncases staan in [`tests/webmcp-evals`](../tests/webmcp-evals) en de runner in [`scripts/run-webmcp-evals.mjs`](../scripts/run-webmcp-evals.mjs).
