---
title: "Gemini 4 Argon: een miljoen outputtokens verandert de bottleneck"
date: "2026-10-03"
category: "Modellen & Releases"
excerpt: "Google vergroot de uitvoerruimte van Gemini 4 Argon van 64.000 naar één miljoen tokens. Dat maakt langere AI-taken mogelijk, maar verplaatst het probleem naar betrouwbaarheid, controle en totale kosten."
featuredImage: "/images/blog/gemini-4-argon-lange-ai-taken.jpg"
---

<!-- youtube-video: 1ZbNgx6Gscw | Gemini 4 Argon explained in 5min.. -->

Google positioneert Gemini 4 Argon niet als een model voor één slimme prompt, maar als een motor voor werk dat urenlang kan doorlopen: grote codebases migreren, dossiers analyseren en kwetsbaarheden onderzoeken. De opvallendste technische verandering is daarom niet alleen een hogere benchmarkscore. Het model mag volgens Google tot **één miljoen outputtokens** in één traject genereren, tegenover 64.000 bij de vorige limiet.

Dat vergroot het bereik van autonome AI-systemen aanzienlijk. Tegelijk ontstaat een nieuwe vraag: wat heb je aan een extreem lange uitvoer als fouten, kosten en controlewerk onderweg sneller oplopen dan de waarde van het resultaat?

## Outputruimte is iets anders dan context

Bij taalmodellen worden twee limieten gemakkelijk door elkaar gehaald. Het **contextvenster** bepaalt hoeveel invoer en eerdere conversatie het model tegelijk kan meenemen. De **outputlimiet** bepaalt hoeveel nieuwe tokens het daarna zelf mag produceren.

Een groot contextvenster helpt bij het lezen van een omvangrijke codebase of een stapel documenten. Een grote outputlimiet is vooral relevant wanneer het model lang moet blijven handelen of redeneren: bestanden aanpassen, tests uitvoeren, resultaten beoordelen en opnieuw proberen. Argon verschuift die tweede grens van 64.000 naar één miljoen tokens.

Dat betekent niet dat iedere taak nu een antwoord van boeklengte nodig heeft. De praktische winst zit in de ruimte voor lange trajecten waarin een agent veel kleine acties achter elkaar uitvoert zonder steeds een volledig nieuwe sessie te beginnen. Denk aan:

- een migratie die honderden bestanden raakt;
- juridisch of financieel onderzoek met meerdere tussencontroles;
- beveiligingsonderzoek waarbij een fout eerst moet worden gevonden, gereproduceerd en hersteld;
- een langlopende programmeertaak waarin tests en profielmetingen de volgende stap bepalen.

De [aankondiging van Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/) noemt precies dit soort complexe, langdurige workflows als de kern van Argon. De eerste toegang wordt gefaseerd verstrekt, aanvankelijk onder meer aan geselecteerde cyberverdedigers via het Fairwind-programma.

## Een miljoen tokens is geen miljoen betrouwbare stappen

Een langer traject maakt een model niet automatisch consistenter. Autoregressieve modellen bouwen ieder volgend token voort op alles wat daarvoor is gegenereerd. Een kleine verkeerde aanname kan daardoor tientallen stappen later nog doorwerken.

De videoanalyse gebruikt een eenvoudige kansberekening om dat risico te illustreren: wanneer iedere losse stap 99 procent betrouwbaar zou zijn en fouten onafhankelijk waren, blijft na honderd stappen ongeveer 37 procent kans over dat alle stappen goed gingen. Dat is geen realistisch voorspelmodel voor taalmodellen — tokens zijn geen onafhankelijke beslissingen — maar het maakt de kern wel duidelijk. **Lokale betrouwbaarheid stapelt niet vanzelf op tot betrouwbare uitvoering over een lange horizon.**

Voor productiegebruik wordt de infrastructuur rond het model daarom belangrijker naarmate het traject langer wordt. Een agent heeft controlepunten nodig: tests, schema-validatie, rechtenbeperkingen, herstelstrategieën en momenten waarop een mens het resultaat kan beoordelen. Een miljoen outputtokens zonder zulke begrenzing is vooral een groter oppervlak waarop iets verkeerd kan gaan.

## Benchmarks vertellen maar een deel van het verhaal

In de analyse wordt een score van 77,9 procent op DeepSWE aangehaald als teken dat Argon sterk presteert bij softwareontwikkeling. De maker plaatst daar direct een kanttekening bij: publieke taken en oplossingen kunnen na verloop van tijd in trainings- of afstemmingsdata terechtkomen. Bovendien raken populaire benchmarks steeds sneller verzadigd.

Dat maakt een hoge score niet waardeloos, maar wel smaller dan de ranglijst suggereert. Een benchmark meet prestaties binnen een afgebakende opzet. Een langdurige bedrijfsworkflow stelt andere eisen:

- blijft het model na duizenden acties hetzelfde doel volgen?
- herkent het wanneer een eerdere aanname niet klopt?
- kan het wijzigingen veilig terugdraaien?
- zijn de resultaten reproduceerbaar en controleerbaar?
- hoeveel menselijke review blijft nodig voordat de uitvoer naar productie mag?

Google onderbouwt Argon vooral met eigen praktijkvoorbeelden, waaronder codeconversies, optimalisaties in datacenters en beveiligingswerk. Dat zijn relevante signalen, maar nog steeds makerclaims. Zonder onafhankelijke replicatie zeggen ze vooral waar Google het model voor wil inzetten, niet hoe betrouwbaar iedere organisatie dezelfde resultaten zal behalen.

## De echte concurrentie zit in model én gereedschap

Een sterk model is slechts één laag van een bruikbaar agentsysteem. De **harness** eromheen bepaalt hoe het model bestanden leest, tools aanroept, geheugen gebruikt, tests interpreteert en fouten herstelt. Juist bij lange taken kan een goede harness een theoretisch minder sterk model praktischer maken dan een model met een hogere benchmarkscore maar zwakkere gereedschappen.

De video stelt dat Google hier nog een distributie- en productvraagstuk heeft. Ontwikkelaars kiezen niet alleen op modelkwaliteit, maar ook op de volwassenheid van de programmeeromgeving, integraties en het bestaande ecosysteem. Een outputlimiet van één miljoen tokens helpt pas wanneer de agent die ruimte doelgericht kan gebruiken.

Daar komt prijs bij. Google kondigt voor Argon een introductietarief aan van 2 dollar per miljoen inputtokens en 10 dollar per miljoen outputtokens; na de introductieperiode verdubbelen die tarieven volgens de officiële productaankondiging. Een agent die daadwerkelijk honderdduizenden outputtokens gebruikt, maakt de totale taakprijs dus belangrijker dan de aantrekkelijke prijs per miljoen op zichzelf.

## Langere trajecten veranderen het ontwerp van AI-producten

De grootste betekenis van Argon is niet dat gebruikers voortaan extreem lange antwoorden moeten lezen. Het model laat zien dat aanbieders verwachten dat AI steeds vaker **werkprocessen** uitvoert in plaats van losse antwoorden geeft.

Dat vraagt om een andere productarchitectuur. De interface moet niet alleen een chatvenster tonen, maar ook voortgang, beslissingen, wijzigingen en risico’s zichtbaar maken. Teams moeten budgetten instellen per taak, tussentijdse resultaten bewaren en duidelijke stopvoorwaarden formuleren. Voor gevoelige workflows hoort daar een auditlog bij dat laat zien welke bronnen, commando’s en controles zijn gebruikt.

De langere uitvoerruimte kan tegelijk verspilling maskeren. Als een model een taak oplost met veel meer tokens dan nodig, betaalt de gebruiker voor omwegen. Tokenefficiëntie blijft daarom relevant: niet hoeveel tekst een model kán genereren, maar hoeveel betrouwbare stappen het nodig heeft om een gecontroleerd resultaat te leveren.

## Eindoordeel

Gemini 4 Argon verlegt een serieuze technische grens. Eén miljoen outputtokens maakt agentische taken mogelijk die eerder door sessielimieten werden opgebroken. Voor codeonderhoud, onderzoek en cyberverdediging kan dat waardevol zijn.

Maar de nieuwe limiet lost de moeilijkste problemen niet op. Langere trajecten vergroten juist het belang van verificatie, veilige gereedschappen, kostenbeheersing en menselijke controle. Argons echte test is daarom niet of het een miljoen tokens kan produceren, maar of organisaties daarmee **meer betrouwbaar werk per euro en per reviewuur** krijgen.

De kernpunten:

- één miljoen outputtokens vergroot vooral de ruimte voor langlopende agenttaken;
- een grote outputlimiet is niet hetzelfde als een groot contextvenster;
- foutaccumulatie maakt controlepunten belangrijker, niet minder belangrijk;
- benchmarkresultaten moeten naast onafhankelijke praktijktests worden gelegd;
- model, harness en prijs bepalen samen de bruikbaarheid;
- de winst zit in gecontroleerde uitvoering, niet in maximale tekstlengte.
