---
title: "Haiku 5.5: goedkope desktopagents zijn nog geen betrouwbare collega's"
date: "2026-10-10"
category: "Modellen & Releases"
excerpt: "Haiku 5.5 maakt snelle AI-assistenten betaalbaarder. Maar een desktopdemo laat zien waarom lage tokenprijzen en hoge benchmarks niet hetzelfde zijn als betrouwbaar afgerond werk."
featuredImage: "/images/blog/haiku-5-5-desktopagents.jpg"
youtubeVideoId: "PVe-ibLRLaw"
youtubeVideoTitle: "Haiku 5.5 explained in 7min.."
---

Haiku 5.5 verschuift de aandacht van maximale intelligentie naar AI die vaak, snel en goedkoop kan meewerken. Anthropic positioneert het model voor repetitieve taken, live ondersteuning en browsergebruik. De interessante vraag is niet of zo'n klein model een topmodel vervangt, maar hoeveel dagelijkse handelingen ermee kunnen worden uitgevoerd zonder dat kosten of wachttijd het voordeel opeten.

De desktopassistent Atticus van Caleb Writes Code maakt die belofte concreet. Hij zoekt documentatie op, opent vensters en past instellingen aan op basis van gesproken opdrachten. Tegelijk toont dezelfde demonstratie een beperking: een eenvoudig ogende filtertaak wordt niet afgemaakt. **Goedkope intelligentie verlaagt de drempel voor automatisering, maar neemt het controlewerk niet vanzelf weg.**

## De waarde zit in veel kleine taken

Een zwaar redeneermodel is niet voor iedere actie nodig. Een document samenvatten, een vraag classificeren of relevante documentatie openen vraagt vaak meer om voorspelbaarheid en snelheid dan om maximale redeneercapaciteit.

In de [aankondiging van Haiku 5.5](https://anthropic.com/claude-haiku-5-5) noemt Anthropic juist dit soort hoogvolumegebruik. Het model kan ook als subagent naast Opus en Sonnet werken: een afzonderlijke agent handelt een afgebakend onderdeel af, terwijl een sterker model de complexere beslissingen neemt. Haiku krijgt bovendien een instelbaar inspanningsniveau, waarmee gebruikers kunnen sturen op kosten tegenover modelkwaliteit.

Dat past bij een andere manier van AI-producten bouwen. Niet één model doet alles; een systeem verdeelt het werk. Routinetaken gaan naar een goedkope uitvoerder. Onduidelijke opdrachten, uitzonderingen en ingrijpende acties worden doorgeschakeld naar een sterker model of een mens.

De vergelijking met GPT-6 Luna in de video draait om diezelfde afweging. Volgens de maker levert Haiku meer modelkwaliteit tegen een bescheiden meerprijs, maar is Luna in zijn vergelijking kostenefficiënter. Dat is geen universele ranglijst. De uitkomst hangt af van de gekozen taken, instellingen en het aantal herstelpogingen.

## Een goedkope interactie is niet de volledige taakprijs

Caleb rapporteert voor zijn Atticus-interacties gemiddeld ongeveer **0,001 dollar per interactie**. Dat is een praktijkclaim uit zijn eigen opstelling, geen algemeen tarief voor een complete desktopworkflow. Het transcript specificeert niet alle kostenposten of een reproduceerbare meetmethode.

De architectuur verklaart waarom zo'n bedrag niet zomaar kan worden overgenomen. Atticus verwerkt spraak lokaal op een GPU, gebruikt Haiku via een API en stuurt informatie over het scherm terug naar het model. Naast modelgebruik blijven dus lokale hardware, spraakverwerking en de agentsoftware nodig.

Ook de contextlengte doet ertoe. De maker beschrijft een hoger tarief zodra een prompt boven 100.000 tokens uitkomt. Lange gesprekken, herhaald meegestuurde schermafbeeldingen en een groeiende actiegeschiedenis kunnen het verbruik veranderen. Voor een zakelijke toepassing moet daarom de volledige sessie worden gemeten, niet alleen één gunstig gekozen aanroep.

Een bruikbare kostenvergelijking omvat:

- modelverbruik over de volledige taak, inclusief herstelpogingen;
- lokale verwerking en eventuele andere betaalde diensten;
- wachttijd en menselijke bijsturing;
- het aandeel opdrachten dat daadwerkelijk correct wordt afgerond.

De relevante maatstaf is de prijs van een gecontroleerd resultaat. Een bijna gratis poging die een medewerker opnieuw moet uitvoeren, kan alsnog een dure workflow opleveren.

## Computergebruik vraagt meer dan tekst genereren

Bij computergebruik kijkt een agent naar de interface, kiest een actie en krijgt daarna nieuwe informatie terug. Hij moet niet alleen begrijpen wat de gebruiker bedoelt, maar ook herkennen waar hij zich bevindt, of een klik effect had en wanneer de opdracht klaar is.

Anthropic rapporteert voor Haiku 5.5 **72,4 procent op de offline subset van OSWorld 2.1**. In dezelfde tabel staat GPT-6 Luna op 48,9 procent. Dat zijn door Anthropic gepubliceerde evaluatieresultaten binnen een specifieke testopzet, geen onafhankelijke garantie voor prestaties op iedere bedrijfsdesktop.

Het onderscheid tussen die offline subset en algemeen browsergebruik is belangrijk. Een benchmarkscore laat zien hoe het model presteert in de geteste omgeving. Een website met veranderende filters, onverwachte pop-ups of een afwijkende schermindeling kan andere fouten uitlokken. Ook de software rondom het model bepaalt welke acties mogelijk zijn en hoe mislukkingen worden opgevangen.

Een hoger percentage is dus een relevant signaal, maar nog geen vrijbrief om een agent onbeperkt toegang te geven tot accounts, documenten of betalingen.

## De mislukte filtertaak is de belangrijkste demonstratie

Atticus voert in de video enkele overzichtelijke opdrachten uit: gerelateerde papers zoeken, PyTorch-documentatie openen en Excel naar een donkere weergave omschakelen. Daarna vraagt Caleb de assistent om op Artificial Analysis alleen modellen onder een bepaalde prijs te tonen.

De agent opent de juiste omgeving, maar concludeert eerst dat filteren op kosten niet kan. Na een explicietere vervolgopdracht schakelt hij enkele modellen uit en stopt vervolgens opnieuw te vroeg. Volgens de maker duurt de getoonde operatie ongeveer **33 seconden**, terwijl hij de taak zelf sneller had kunnen uitvoeren.

Dit is één demonstratie, geen representatieve prestatietest. Toch maakt ze een belangrijk productprobleem zichtbaar. Een agent kan de opdracht begrijpen en meerdere juiste acties uitvoeren, maar alsnog falen op het eindcriterium. De gebruiker moet dan constateren dat het resultaat incompleet is, de instructie aanscherpen en opnieuw controleren.

Een hoge tokensnelheid lost dat niet rechtstreeks op. De totale doorlooptijd bevat ook schermverwerking, toolaanroepen, wachttijd op de interface en verkeerde afslagen. Sneller tekst produceren is slechts één onderdeel van sneller werk afronden.

## Gebruik een API waar dat kan, de interface waar dat moet

Schermbediening is aantrekkelijk omdat ze ook werkt bij software zonder bruikbare integratie. Dat maakt desktopagents inzetbaar voor bestaande applicaties en websites die niet voor automatisering zijn ontworpen.

Maar wanneer een taak via een API of een gestructureerd commando kan worden uitgevoerd, is dat doorgaans beter controleerbaar. Het systeem krijgt expliciete invoer en uitvoer, in plaats van te moeten afleiden of een knop werkelijk is ingedrukt. Het risico op fouten door een gewijzigde lay-out wordt kleiner.

Een robuuste agent combineert daarom beide routes. Gebruik gestructureerde tools voor bekende acties, schermbediening voor de resterende stappen en een expliciete controle aan het einde. Laat het systeem bijvoorbeeld controleren of de gewenste instelling daadwerkelijk is veranderd, in plaats van alleen een succesvolle klik te melden.

Voor gevoelige acties horen daar beperkte rechten en menselijke bevestiging bij. Goedkope inferentie maakt veel pogingen betaalbaar, maar maakt een verkeerde wijziging niet minder ingrijpend.

## Cloud tegenover lokaal blijft een bredere afweging

Caleb vertelt dat hij Atticus van een lokaal Qwen-model naar Haiku via de API heeft verplaatst. Zijn argument is economisch: bij zijn gebruik en elektriciteitskosten kan cloudgebruik voordeliger zijn. Zonder volledige meting van belasting, hardwareverbruik en taakvolume is dat geen algemene conclusie over lokale AI.

Lokaal draaien kan nog steeds waarde hebben wanneer gegevens het apparaat niet mogen verlaten, internettoegang ontbreekt of een organisatie afhankelijkheid van een leverancier wil beperken. Cloudmodellen besparen daarentegen beheer en kunnen aantrekkelijk zijn bij incidenteel gebruik.

Voor een desktopagent is privacy extra relevant. Schermafbeeldingen kunnen klantgegevens, broncode of interne documenten bevatten. Een ontwerp met lokale spraakherkenning betekent niet automatisch dat ook de rest van de workflow lokaal blijft. Teams moeten vastleggen welke scherminformatie naar de modelaanbieder gaat en welke toepassingen buiten bereik blijven.

## Conclusie

Haiku 5.5 maakt een nuttige categorie AI beter bereikbaar: snelle uitvoerders voor veel kleine taken. De officiële benchmarkresultaten en de Atticus-demo geven reden om die rol serieus te testen, maar niet om afgerond werk te veronderstellen zodra een agent overtuigend begint.

De praktische winst ontstaat door afgebakende opdrachten, passende tools en controle van het eindresultaat. Wie desktopagents beoordeelt, moet daarom niet alleen naar tokenprijzen of modelranglijsten kijken, maar naar **taaksucces, totale doorlooptijd en benodigde menselijke bijsturing**. Pas als die samen verbeteren, wordt een goedkope assistent ook een bruikbare collega.
