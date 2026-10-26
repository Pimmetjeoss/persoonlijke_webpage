---
title: "PHP2Shell: AI vindt het lek, maar wie krijgt de patch online?"
date: "2026-10-26"
category: "Hardware & Infrastructuur"
excerpt: "De kritieke PHP2Shell-lekken laten zien waarom snellere bugdetectie niet genoeg is. De echte uitdaging zit in veilige enginewijzigingen, gecoördineerde updates en controle van de draaiende omgeving."
featuredImage: "/images/blog/php2shell-patchbeheer.jpg"
youtubeVideoId: "6VmA4x1lh1M"
youtubeVideoTitle: "PHP security crisis explained.."
---

PHP2Shell maakt een ongemakkelijke spanning zichtbaar: AI helpt beveiligingsonderzoekers sneller kwetsbaarheden vinden, terwijl het veilig repareren en uitrollen ervan mensenwerk blijft. Twee kritieke fouten in PHP kunnen onder bepaalde omstandigheden een aanvaller zonder inloggegevens code op een webserver laten uitvoeren. De reparaties zijn beschikbaar, maar daarmee is niet iedere draaiende website automatisch beschermd.

Caleb Writes Code legt de kwetsbaarheid uit als een geheugenprobleem. De bredere les zit in wat daarna gebeurt: een fout in de programmeertaal moet worden opgelost zonder het ecosysteem te ontregelen, hostingpartijen moeten pakketten beschikbaar maken en beheerders moeten controleren of hun applicatie daadwerkelijk de gerepareerde runtime gebruikt. **Een gevonden lek en een gepubliceerde patch zijn twee mijlpalen, geen afgeronde beveiligingsoperatie.**

## Wat er misgaat wanneer geheugen opraakt

PHP reserveert tijdens een verzoek geheugen voor gegevens die het verwerkt. Als een bewerking mislukt doordat onvoldoende geheugen beschikbaar is, moet de runtime het verzoek afbreken en correct opruimen. Juist die uitzonderingsroute blijkt kwetsbaar.

De officiële advisory voor CVE-2026-109618 beschrijft dat geheugen in sommige situaties al bereikbaar is voordat het volledig is geïnitialiseerd. Een voortijdige afbreking kan de administratie in een ongeldige toestand achterlaten. Bij het opruimen kan PHP vervolgens ongeldige gegevens gebruiken. Onder de juiste omstandigheden leidt dat tot remote code execution: het uitvoeren van code op afstand.

De tweede kwetsbaarheid, CVE-2026-109619, betreft achterblijvende globale toestand. De twee problemen worden gezamenlijk onder de naam PHP2Shell besproken. Voor beheerders is het belangrijkste niet de precieze exploitroute, maar dat alleen de ene fout aanpakken geen complete oplossing voor beide oplevert.

Ook de uitvoeromgeving doet ertoe. De advisory beschrijft aangetoonde uitvoering van code via Apache mod_php. Voor PHP-FPM ondersteunt broncodeanalyse de kwetsbaarheid, maar vermeldt dezelfde advisory geen volledig gedemonstreerde FPM-exploit. Dat is een relevante beperking van het bewijs, geen reden om FPM-installaties ongepatcht te laten.

## Welke PHP-versies de reparaties bevatten

Op 21 oktober bracht het PHP-project beveiligingsreleases uit voor de ondersteunde branches. Volgens de [officiële beveiligingsinformatie van PHP](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w) bevatten de volgende versies de reparatie:

- PHP 8.2.35;
- PHP 8.3.36;
- PHP 8.4.27;
- PHP 8.5.12.

Gebruik binnen de gekozen branch een gerepareerde of nieuwere release. Bij distributiepakketten kan een leverancier een beveiligingsfix terugzetten naar een eigen pakketversie. Controleer dan de security advisory van die leverancier; alleen het upstream-versienummer vertelt niet altijd het hele verhaal.

Een CMS-update is bovendien niet hetzelfde als een PHP-update. WordPress, Drupal en andere applicaties draaien boven op de runtime. Een actueel CMS kan nog steeds op een kwetsbare PHP-installatie staan. Omgekeerd is een bijgewerkte runtime geen vervanging voor onderhoud aan plugins en applicatiecode.

Voor beheerde hosting hoort daarom een concrete vraag bij de leverancier: is de fix actief op de omgeving die deze website werkelijk bedient? Bij containers moet ook het gebruikte image worden vernieuwd en uitgerold. Alleen een nieuw image bouwen verandert bestaande draaiende containers niet.

## Waarom de reparatie meer vraagt dan een AI-antwoord

De video benadrukt de tijd tussen melding en openbaarmaking. De PHP Foundation geeft daarbij belangrijke context: eerste aanwijzingen voor het geheugenprobleem kwamen al tijdens eerder beveiligingswerk naar voren. Later maakten rapporten van Calif, OpenAI en Wiz de concrete impact duidelijk.

De vertraging was volgens de Foundation niet alleen een kwestie van een ontbrekende codewijziging. Verschillende oplossingen hadden nadelen voor compatibiliteit, prestaties, beschikbaarheid of externe extensies. De kleine groep ontwikkelaars met voldoende kennis van de engine moest daarin een keuze maken. De Foundation noemt het vastlopen van dat proces zelf een structureel probleem.

Dat onderscheid voorkomt een te simpele conclusie. Uit één disclosuretijdlijn volgt niet dat AI bugs altijd sneller vindt dan ze kunnen worden gerepareerd. Wel laat deze casus zien dat **meer detectiecapaciteit niet automatisch meer reparatiecapaciteit betekent**. Iemand moet meldingen beoordelen, duplicaten herkennen, een oplossing ontwerpen, regressies testen en de uitrol coördineren.

AI kan ook aan die kant helpen. De Foundation beschrijft gebruik van hulpmiddelen bij validatie en het groeperen van meldingen. De verantwoordelijkheid voor beslissingen en patches blijft bij mensen die de codebasis en gevolgen begrijpen.

## Openbaarmaking is een logistiek beveiligingsprobleem

Een gecoördineerde openbaarmaking geeft pakketbeheerders en hostingpartijen tijd om updates voor te bereiden. Daardoor kunnen gebruikers patchen zodra technische details publiek worden. Dat werkt alleen wanneer betrokken partijen zich aan dezelfde timing houden.

Volgens de [terugblik van de PHP Foundation](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/) circuleerden op 20 oktober al CVE-nummers. PHP vervroegde daarop de geplande release van 22 naar 21 oktober. Daarna verscheen per ongeluk een demonstratievideo van Calif. Op de ochtend van 21 oktober publiceerde Chainguard bovendien images met de reparatie, ruim zes uur vóór het vervroegde releasemoment.

Een voortijdig zichtbaar gemaakte fix kan aanvallers informatie geven terwijl andere gebruikers nog op installeerbare pakketten wachten. Maar onmiddellijk alles vrijgeven is ook niet zonder nadeel: distributies moeten de reparatie nog kunnen leveren. De afweging gaat dus niet over geheimhouding als doel op zichzelf, maar over het verkleinen van het moment waarop aanvallers meer handelingsruimte hebben dan beheerders.

AWS meldt bovendien een exploitpoging tegen zijn MadPot-honeypots op 17 oktober, vóór de publieke disclosure. Dat is geen bewijs dat klantomgevingen toen succesvol waren overgenomen. AWS zegt expliciet dat onduidelijk is of de waargenomen pogingen op echte systemen zouden zijn geslaagd. Het signaal is wel reden om bij onderzoek niet uitsluitend vanaf de publicatiedatum terug te kijken.

## Wat een websitebeheerder nu moet controleren

De praktische opdracht is overzichtelijker dan de technische fout, maar vraagt bewijs per omgeving:

- **Inventariseer de runtime.** Breng websites, containers, workers en hostingpakketten met PHP in beeld. Controleer de versie van de webomgeving, niet alleen die van een losse commandline-installatie.
- **Verifieer de reparatie.** Gebruik een gerepareerde release of een door de leverancier bevestigde backport. Controleer na de uitrol of de nieuwe runtime daadwerkelijk actief is.
- **Test de applicatie.** Controleer belangrijke functies zoals inloggen, formulieren, uploads en achtergrondtaken. Een noodupdate moet zowel het lek dichten als de dienstverlening bruikbaar houden.
- **Onderzoek verdachte activiteit.** Kijk naast webverzoeken ook naar onverwachte processen, bestandswijzigingen en andere signalen van misbruik. Een gewone HTTP-status bewijst niet dat een verzoek onschadelijk was.
- **Leg verantwoordelijkheid vast.** Spreek af wie patches beoordeelt, wie de uitrol uitvoert en wie het resultaat controleert. Voorkom dat iedere partij aanneemt dat een ander het al heeft geregeld.

Tijdelijke filters of beperkingen kunnen de blootstelling verkleinen, maar zijn niet gelijkwaardig aan de volledige update. Wijzig geheugenlimieten of uploadgedrag niet blind op basis van een losse tip: zulke ingrepen kunnen beschikbaarheid en applicatiefunctionaliteit beïnvloeden. Laat tijdelijke maatregelen aansluiten op de officiële advisories en de eigen hostingarchitectuur.

## Conclusie

PHP2Shell laat niet zien dat PHP per definitie onbruikbaar is of dat AI beveiliging vanzelf oplost. Het laat zien hoe kwetsbaar het traject tussen ontdekking en aantoonbaar herstel kan zijn. Snellere analyse helpt pas echt wanneer ervaren ontwikkelaars, leveranciers en beheerders die snelheid kunnen omzetten in betrouwbare updates.

Voor website-eigenaren is de belangrijkste uitkomst daarom geen percentage of spectaculaire demo. Het is een controleerbaar antwoord op drie vragen: draait mijn omgeving op een gerepareerde runtime, werkt de applicatie nog correct en is er aanleiding om eerder misbruik te onderzoeken? Pas met die antwoorden wordt een beschikbare patch ook een afgeronde beheeractie.
