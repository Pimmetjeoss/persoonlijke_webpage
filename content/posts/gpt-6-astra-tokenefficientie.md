---
title: "GPT-6 Astra: verzadigde benchmarks, maar de echte doorbraak is tokenefficiëntie"
date: "2026-09-07"
category: "Modellen & Releases"
excerpt: "OpenAI's GPT-6 Astra haalt 99,9 procent op ARC-AGI-3 en verzadigt meerdere expertbenchmarks. Toch misleiden de ranglijsten: het werkelijk interessante verhaal is dat het model hetzelfde werk doet met de helft van de tokens."
featuredImage: "/images/blog/gpt-6-astra-tokenefficientie.png"
---

OpenAI heeft met **GPT-6 Astra** een model uitgebracht dat meerdere toonaangevende benchmarks praktisch verzadigt: 99,9 procent op ARC-AGI-3, 97,6 procent op FrontierMath Tier 4 en een volledige score op ExploitBench. Dat zijn cijfers die een paar jaar geleden nog als mijlpalen voor kunstmatige algemene intelligentie werden beschreven. Tegelijkertijd plaatst een bekende samengestelde ranglijst hetzelfde model slechts op de vijfde plaats. Beide kunnen waar zijn — en juist die spanning maakt Astra interessant. Niet de vraag welk model "wint", maar wat benchmarks eigenlijk meten en waar de werkelijke vooruitgang zit: het model levert vergelijkbare kwaliteit met fors minder tokens.

## Samengestelde scores meten de verpakking, niet het model

Benchmarks hebben een legitieme functie: ze meten domeinspecifieke bekwaamheid, van wiskunde tot software-engineering. Het probleem ontstaat een laag hoger, wanneer scores worden samengevoegd tot één indexcijfer dat intelligentie als geheel zou moeten uitdrukken. Elke zo'n samenvoeging is een **wrapper**: een abstractie die details verbergt. Net als in programmeren kan een wrapper verhelderend of misleidend zijn, afhankelijk van wat hij weglaat.

Dat Artificial Analysis met zijn eigen samengestelde index Astra vijfde plaatst, zegt daarom meer over de index dan over het model. Van de veertien benchmarks die OpenAI in zijn aankondiging uitlicht, overlapt er slechts één met de set die die index volgt. Wie twee verschillende meetlatten naast elkaar legt, krijgt verschillende winnaars. De les is niet dat de ene lijst liegt en de andere de waarheid spreekt, maar dat een enkel ranglijstcijfer geen oordeel over een model kan dragen. Daarvoor moet je onder de motorkap kijken, benchmark voor benchmark.

## ARC-AGI-3: 99,9 procent met een harness-kanttekening

ARC-AGI-3 geldt als een van de abstractste redeneertests: het model krijgt interactieve puzzelomgevingen voorgeschoteld zonder uitgelegde spelregels en moet via actie-tokens tot oplossingen komen. De evaluatie verloopt niet via screenshots of video, maar via een tekstuele gridrepresentatie die als object wordt uitgewisseld. Astra's score van **99,9 procent** klinkt als volledige verzadiging — maar onder welke omstandigheden die score tot stand kwam, doet ertoe.

Het ARC-evaluatiekader kent drie datasets: publiek, semi-privaat en volledig privaat. NVIDIA scoorde onlangs 100 procent op de **publieke** set, met AVO, een agentische laag rond een concurrerend model die onder meer persistent geheugen en contextmanagement toevoegt. Astra's 99,9 procent werd behaald op de **semi-private** set, waarvan de omgevingen verborgen zijn maar de evaluatie via externe API-aanroepen loopt — met een restrisico op datalekkage. Bovendien maakt de gebruikte **harness** een groot verschil: met de harness van de ARC-organisatie zelf scoorde Astra 62,7 procent, met OpenAI's eigen harness 99,9 procent.

> Het verschil tussen 62,7 en 99,9 procent is geen meetfout, maar een les: bij agentische benchmarks is de harness onderdeel van het resultaat.

Dat relativeert de vergelijking zonder de prestatie weg te schrijven. Het betekent wel dat zo'n score twee dingen tegelijk meet: de redeneerkracht van het model én de kwaliteit van de infrastructuur eromheen. Voor wie modellen via een eigen harness inzet, is dat onderscheid praktisch relevant.

## FrontierMath en ExploitBench: verzadiging als signaal

Naast ARC-AGI-3 rapporteert OpenAI verzadiging op meer expertbenchmarks. Op **FrontierMath Tier 4**, een set extreem moeilijke wiskundeproblemen opgesteld door tientallen wiskundigen en onafhankelijk afgenomen, haalt Astra 97,6 procent — tegen 87,8 procent voor Anthropic's Fable 5.1. Omdat de dataset volledig privé blijft en de afname buiten OpenAI om loopt, is dit een van de schoonste vergelijkingen in de aankondiging. Op **ExploitBench**, dat meet of een model kwetsbaarheden kan omzetten in werkende exploits, rapporteert OpenAI een volledige score van 100 procent, tegen 78,5 procent voor voorganger GPT-5.6 Sol.

Al deze cijfers zijn **makerclaims**: gepubliceerd door OpenAI, gemeten onder OpenAI's condities. Ze zijn onderling vergelijkbaar binnen die opzet, maar nog geen onafhankelijk bewijs. Wat ze wel signaleren is een patroon: de klassieke expertbenchmarks raken op. Wanneer meerdere modellen richting de 100 procent kruipen, verliest de benchmark zijn onderscheidend vermogen en moet de sector op zoek naar zwaardere tests — of naar andere dimensies van kwaliteit.

## DeepSWE en de Pareto-grens: de helft van de tokens

Die andere dimensie is zichtbaar in **DeepSWE**, een benchmark voor realistisch software-engineeringwerk waar nog géén verzadiging is opgetreden. Frontiermodellen clusteren daar rond de 70 procent zonder duidelijke uitschieter; Astra scoort circa 74 procent, enkele procentpunten boven een maanden ouder model. Op het eerste gezicht onderweldigend — totdat je naar de kolom kijkt die er echt toe doet: het aantal gegenereerde outputtokens. Astra verbruikt grofweg **de helft** van de tokens van zijn voorganger voor hetzelfde resultaat.

Dat onderscheid tussen **tokenefficiëntie** en **kostenefficiëntie** is cruciaal. Kostenefficiënt is Astra nadrukkelijk niet: met een opgegeven prijs van 10 dollar per miljoen invoertokens en 50 dollar per miljoen uitvoertokens is het model ruim twee keer zo duur als zijn voorganger. Maar per voltooide taak — de eenheid die voor gebruikers telt — kan de rekening alsnog lager uitvallen, juist omdat er minder tokens nodig zijn. Vergelijkbare modellen van concurrenten scoren in de buurt op DeepSWE, maar zouden er vier tot vijf keer zoveel tokens voor nodig hebben.

Hier ontstaat een interessante spanning voor de sector. Als modellen steeds minder tokens produceren voor dezelfde hoeveelheid werk, stijgt het effectieve aanbod van intelligentie per token — terwijl laboratoria hun omzet grotendeels per token factureren. Bij de huidige prijsstelling vloeit die efficiëntiewinst voorlopig vooral naar de marge van de aanbieder. Voor concurrerende labs wordt de opgave daarmee scherper geformuleerd: niet alleen OpenAI's capaciteiten evenaren, maar dat doen met even weinig werk per taak.

## Wat is nog een goed model?

Kort voor Astra verscheen Anthropic's Fable 5.1, dat op sommige meetlatten als het betere model uit de bus komt. Die heen-en-weer laat zien dat de definitie van een goed model verschuift: van simpelweg het intelligentste model naar het **nuttigste** model. Tokenefficiëntie, kostenefficiëntie, snelheid en prestaties op realistische use cases wegen steeds zwaarder dan het vermogen om academische tests te maximaliseren.

Daar past ook de computer-use-demo bij de aankondiging in: een model dat via spraak zelfstandig dingen bouwt op een computer. De ervaringen met agentisch computergebruik zijn tot nu toe wisselend, en niemand zou dit met AGI verwarren. Maar de richting is duidelijk: modellen worden beoordeeld op wat ze in een echte omgeving tot stand brengen, niet op wat ze op papier weten. Onafhankelijke metingen waarin Astra een besturingssysteem-taak in circa 40 minuten afrondt waar de voorganger er 75 voor nodig had, wijzen in die richting — snelheid als kwaliteitsdimensie naast intelligentie.

## Conclusie

GPT-6 Astra is geen overwinning op een ranglijst, maar een casus in hoe je AI-vooruitgang moet lezen. De verzadigde expertbenchmarks tonen aan dat het model tot de top behoort; de harness-gevoeligheid van ARC-AGI-3 toont aan dat zulke scores altijd binnen hun meetopzet gelezen moeten worden; en de tokenefficiëntie op DeepSWE toont waar de structurele winst zit. Wie alleen naar samengestelde indexcijfers kijkt, mist precies datgene wat Astra bijzonder maakt.

- Samengestelde ranglijsten verbergen meer dan ze onthullen; één overlappende benchmark van de veertien maakt vergelijking tussen lijsten zinloos.
- Astra's 99,9 procent op ARC-AGI-3 geldt onder OpenAI's eigen harness op een semi-private set; met een neutrale harness is de score 62,7 procent.
- FrontierMath Tier 4 (97,6 procent) en ExploitBench (100 procent) zijn de schoonste verzadigingssignalen, maar blijven makerclaims tot onafhankelijke replicatie.
- De werkelijke doorbraak is tokenefficiëntie: vergelijkbare kwaliteit met circa de helft van de outputtokens.
- Hoge tokenprijzen betekenen dat die efficiëntiewinst voorlopig vooral de marge van de aanbieder dient, niet de rekening van de gebruiker.
- De maatstaf verschuift van het intelligentste naar het nuttigste model: efficiëntie, snelheid en realistische taken tellen steeds zwaarder mee.
