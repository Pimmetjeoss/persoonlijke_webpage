---
title: Wat is WebMCP? — Uitleg voor iedereen
description: WebMCP (Web Model Context Protocol) in gewone mensentaal. Wat het is, hoe het in vier stappen werkt, waarvoor je het gebruikt en wat het betekent voor je website.
canonical: https://code-lieshout.nl/webmcp
language: nl-NL
updated: 2026-08-29
---

# Wat is WebMCP?

> WebMCP is een vaste afspraak waarmee een website zijn eigen mogelijkheden uitlegt aan een AI-assistent — de gebruiksaanwijzing bij het pakket, niet het pakket zelf.

## Wat het is

Het internet is een enorm warenhuis. Mensen leren gaandeweg welke knop wat doet; een AI-assistent kan dat niet zomaar zien. WebMCP lost dat op: de website levert bij zichzelf een gestructureerde gebruiksaanwijzing aan, zodat elke assistent weet "dit kan ik hier, dit heb ik daarvoor nodig, zo vraag je het aan".

De volledige naam is **Web Model Context Protocol**: een standaardvorm waarin websites hun mogelijkheden en context uitleggen aan AI-modellen.

Belangrijk: de website zelf verandert niet. Zelfde design, zelfde knoppen, zelfde shop. WebMCP is een extra laag ernaast.

## Hoe het werkt, in vier stappen

1. **Jij stelt je vraag.** Je typt in je AI-assistent wat je wilt — "zoek een trainingspak" of "check of mijn pakket onderweg is".
2. **De assistent leest de handleiding.** De website biedt van zichzelf een lijst met mogelijkheden aan: zoeken, reserveren, status tonen. De assistent leest wat er kan, zonder te gokken.
3. **De assistent kiest de juiste handeling.** In plaats van naar een knopje te zoeken, roept de assistent de officiële functie aan die de site zelf heeft aangegeven.
4. **Jij geeft toestemming en ziet het resultaat.** De handeling gebeurt in jouw browser, met jouw account en jouw toestemming. Je ziet wat er gebeurt en bevestigt zelf.

## Waarvoor je het gebruikt

- **Acties uitvoeren met ChatGPT** — in de ingebouwde browser van de ChatGPT-desktopapp kan ChatGPT via WebMCP aangeboden Site tools gebruiken om bijvoorbeeld te zoeken, een winkelmand aan te passen of een reservering voor te bereiden. [Lees de officiële OpenAI-documentatie](https://learn.chatgpt.com/docs/webmcp).
- **Bestellen zonder te klikken** — iets laten zoeken en reserveren via de stappen die de site zelf aanbiedt.
- **Status en service** — "waar is mijn pakket", "is mijn afspraak gelukt", "tot hoe laat is het kantoor open": één vraag, één antwoord, in plaats van tien tabbladen.
- **De site legt zichzelf uit** — openingstijden, voorwaarden, voorraad en prijzen als gestructureerde informatie die een assistent meteen begrijpt.
- **Terugkerende taken** — elke maandag hetzelfde rapport, elke vrijdag dezelfde reservering: omdat de stappen vastliggen, kan een assistent ze betrouwbaar herhalen.

### Drie categorieën, concreet

Kijk je naar wat mensen hun assistent in de praktijk vragen, dan vallen die vragen in drie categorieën.

**1. Aankopen doen.** *Voorbeeld:* boodschappen voor een kinderfeestje, verdeeld over drie winkels; of die kaasstengels van vorige maand opnieuw bestellen waarvan je het merk niet meer weet. *Hoe WebMCP helpt:* de assistent zoekt de producten op bij elke winkel, vergelijkt de prijzen en legt ze klaar in een mandje of verlanglijst — in plaats van dat je zelf door twintig categorieën klikt.

**2. Formulieren invullen.** *Voorbeeld:* een garantieclaim voor een televisie die niet meer aangaat; een offerte bij een cateraar voor honderd gasten; de uren van deze week doorgeven; een tweedehands auto zoeken met zeven zitplaatsen. *Hoe WebMCP helpt:* de website biedt het formulier zelf aan als functie, met uitleg per veld. De assistent hoeft niet te zoeken wáár het formulier staat en gokt niet welk hokje waarvoor is: hij vult in wat je verteld hebt, jij drukt op verzenden.

**3. Zoeken en filteren.** *Voorbeeld:* een huurappartement met drie slaapkamers en een vaatwasser, op tien minuten lopen van het station; of een hotel in Berlijn onder de 300 euro met zwembad en ontbijt. *Hoe WebMCP helpt:* de site geeft zijn filters door zoals ze zijn, zodat één vraag in gewone taal in één keer wordt omgezet naar alle filters tegelijk.

## Zelf uitproberen

Deze sites registreren imperatieve WebMCP-tools die ChatGPT momenteel ondersteunt. Zet in de nieuwste ChatGPT-desktopapp Site tools aan en kies GPT-5.6 Sol of Terra. Plak daarna een van de voorbeeldvragen hieronder in het gesprek: elke vraag noemt zijn eigen URL, vraagt de pagina in de ingebouwde browser te openen en zegt erbij dat ChatGPT eerst om ontbrekende gegevens vraagt en pas op jouw bevestiging verstuurt. Blijft de browser dicht, open hem dan zelf via de werkbalk en ga eerst naar de pagina. De sites blijven ook gewoon met de hand te bedienen.

- **Deze website zelf** — [code-lieshout.nl](https://code-lieshout.nl) meldt vier functies aan: een agent-scan van een website, pagina-inhoud als platte tekst, een overzicht van alle secties en de contactgegevens. Probeer: *"Open https://code-lieshout.nl in je ingebouwde browser en gebruik de Site tools van deze pagina om een agent-readiness scan te draaien. Vraag mij eerst welke website ik gescand wil hebben. Laat daarna de uitkomst zien, vat de belangrijkste bevindingen samen en noem per punt wat ik zou moeten aanpassen."*
- **Sportwinkel** — [sport-shop-demo](https://googlechromelabs.github.io/webmcp-tools/demos/sport-shop-angular/): zoeken, filteren en het winkelmandje als losse functies. Probeer: *"Open https://googlechromelabs.github.io/webmcp-tools/demos/sport-shop-angular/ in je ingebouwde browser en gebruik de Site tools van deze pagina om een hardloopschoen onder de 100 euro te zoeken. Vraag mij eerst om eventuele ontbrekende gegevens, zoals maat en voorkeurskleur. Laat me daarna de gevonden schoenen zien en leg pas met mijn bevestiging de gekozen schoen in het mandje."*
- **Le Prikkel Bistro** — [onze eigen demo](https://code-lieshout.nl/webmcp/demos/bistro): een reserveringsformulier dat tegelijk een functie is. De assistent vult het in, jij bevestigt; vult hij iets fout in, dan krijgt hij de foutmelding per veld terug. Probeer: *"Open https://code-lieshout.nl/webmcp/demos/bistro in je ingebouwde browser en gebruik de Site tools van deze pagina om een tafel te reserveren voor twee personen op de eerstvolgende vrijdag om 19:30. Vraag mij eerst om eventuele ontbrekende verplichte gegevens. Vul daarna de reservering in, laat mij de gegevens controleren en verstuur de aanvraag pas definitief met mijn bevestiging."*
- **CinePrikkel** — [onze eigen demo](https://code-lieshout.nl/webmcp/demos/bioscoop): een stad kiezen, films op genre zoeken en een voorstelling klaarzetten. Probeer: *"Open https://code-lieshout.nl/webmcp/demos/bioscoop in je ingebouwde browser en gebruik de Site tools van deze pagina om te kijken welke thrillers er vanavond in Oss draaien. Vraag mij eerst om eventuele ontbrekende gegevens, zoals het aantal kaarten. Laat me daarna de voorstellingen zien en zet er pas met mijn bevestiging eentje klaar."*
- **PrikkelFabriek** — [onze eigen demo](https://code-lieshout.nl/webmcp/demos/fabriek): vijftien Site tools vormen samen een productielijn. De agent leest eerst recepten en protocollen en bedient daarna mijnen, voorraadbakken en machines. Probeer: *"Open https://code-lieshout.nl/webmcp/demos/fabriek in je ingebouwde browser en gebruik de Site tools van deze pagina om een elektromotor te bouwen. Vraag eerst het recept en het productieprotocol op en laat mij het stappenplan zien. Voer de stappen daarna uit en meld het meteen als een grondstof of machine ontbreekt."*
- **PrikkelThuis** — [onze eigen demo](https://code-lieshout.nl/webmcp/demos/slim-huis): een slim-huisdashboard dat zich aanpast aan de situatie. De assistent toont en ordent alleen de bediening die je nu nodig hebt. Probeer: *"Open https://code-lieshout.nl/webmcp/demos/slim-huis in je ingebouwde browser en gebruik de Site tools van deze pagina: er staat iemand voor de deur. Laat eerst zien wie het is en zet daarna de bediening van het slot voor me klaar. Ontgrendel de deur pas met mijn bevestiging."*

De externe demo's komen uit [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools). Alleen voorbeelden met imperatieve `document.modelContext.registerTool()`-registratie staan in deze ChatGPT-proeftuin; declaratieve formuliertools worden door ChatGPTs ingebouwde browser momenteel niet ontdekt.

## Veelgestelde vragen

**Heb ik iets extra's nodig?**
WebMCP is geen apart abonnement, maar Site tools vereisen momenteel wel de nieuwste ChatGPT-desktopapp, ingeschakelde Site tools en een ondersteund model zoals GPT-5.6 Sol of Terra. Buiten een ondersteunde agent blijft de website gewoon handmatig werken.

**Is dit veilig?**
Handelingen gebeuren in jouw browser, met jouw account en jouw toestemming. De website bepaalt zelf welke functies hij aanbiedt; jij ziet wat er gaat gebeuren en bevestigt zelf. Geen verrassende klikken op de achtergrond.

**Vervangt WebMCP de gewone website?**
Nee. De website blijft exact zoals hij is. WebMCP is een extra laag.

**Wat betekent de naam?**
Web Model Context Protocol: een vaste afspraak (protocol) waarmee een website zijn mogelijkheden en context (context) uitlegt aan een AI-model (model).

**Wat heeft Code Lieshout ermee te maken?**
Code Lieshout maakt websites klaar voor dit tijdperk — van snelheid en vindbaarheid tot WebMCP zelf. De gratis Agent-Ready scan controleert of een site er klaar voor is, inclusief de WebMCP-check.

## Verder lezen

- [Gratis Agent-Ready scan](https://code-lieshout.nl/agent-ready)
- [Wat is een MCP-server?](https://code-lieshout.nl/mcp-explorer)
- [AI-agents bij Code Lieshout](https://code-lieshout.nl/ai-agents)
- [Contact](https://code-lieshout.nl/contact)

---

PRIKKEL is een demonstratiemerk van Code Lieshout. Deze pagina is uitleg over een internetstandaard in ontwikkeling.
