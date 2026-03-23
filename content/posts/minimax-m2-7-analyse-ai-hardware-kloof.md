---
title: "MiniMax M2.7: Hoe een Chinese AI de wereldwijde chip-oorlog slim vrijspeelt"
date: "2026-03-23"
category: "AI & Technologie"
excerpt: "Een diepgaande blik op de release van het AI-model MiniMax M2.7. Ontdek hoe deze AI omgaat met hardware-tekorten, spotgoedkoop is en zichzelf sneller helpt ontwikkelen."
featuredImage: "/images/blog/minimax-m2-7-analyse-ai-hardware-kloof.png"
---

Welkom in de sneltrein van de kunstmatige intelligentie, waar de ontwikkelingen elkaar in razend tempo opvolgen. Terwijl veel mensen nog proberen te begrijpen wat AI vandaag de dag allemaal kan, staat de volgende generatie alweer voor de deur. In een fascinerende en verhelderende video op het YouTube-kanaal 'Caleb Writes Code' wordt de recente release van het nieuwe Chinese AI-model, genaamd MiniMax M2.7, onder de loep genomen. Deze update trekt enorm veel aandacht in de techwereld, en dat is niet zonder reden. Het verhaal achter dit model gaat namelijk over veel meer dan alleen een software-update. Het is een meeslepend verhaal over de wereldwijde strijd om computerchips, de ingenieuze manieren waarop bedrijven hiermee omgaan, en de eerste stappen naar AI die zijn eigen ontwikkelaars helpt. In deze blogpost duiken we in de belangrijkste lessen uit de video en vertalen we de technische termen naar begrijpelijke taal.

### Kernpunt 1: De groeiende hardware-muur tussen de VS en China

Om te begrijpen waarom MiniMax M2.7 zo bijzonder is, moeten we eerst kijken naar de fundering van AI: de computerchips (hardware) waarop deze modellen draaien. Er is momenteel een gigantische kloof aan het ontstaan in de wereldwijde beschikbaarheid van deze rekenkracht. Volgens de analyse in de video loopt China momenteel zo'n twee tot drie jaar achter op de Verenigde Staten als het gaat om de technologie van deze chips. Dit komt niet doordat ze geen computers hebben, maar omdat ze simpelweg geen toegang hebben tot het juiste *type* chips.

De Verenigde Staten verkopen momenteel als beste optie de 'Nvidia H200' chip aan China, die onlangs weer in productie is gegaan voor deze specifieke markt. Maar vergis je niet: deze chip is gebaseerd op een oudere techniek die de 'Hopper-architectuur' wordt genoemd. Ondertussen zitten de grote techreuzen in de VS—zoals OpenAI, Oracle en Meta—niet stil. Zij maken zich momenteel klaar om de gloednieuwe, hypermoderne 'VR Rubin' chips in gebruik te nemen.

Wat is hiervan het gevolg? Chinese laboratoria stuiten op een onzichtbare muur. Als zij hun AI-modellen sneller antwoorden willen laten geven (bijvoorbeeld meer dan 100 stukjes tekst, oftewel 'tokens', per seconde), moeten ze simpelweg meer van die oudere chips naast elkaar zetten. Dit kost enorm veel geld en energie. Amerikaanse bedrijven kunnen met hun nieuwe Rubin-chips veel krachtigere AI laten draaien op een gigantische snelheid, zonder dat de kosten zo extreem oplopen. China wordt hierdoor gedwongen om creatief te worden met de beperkte middelen die ze hebben.

### Kernpunt 2: Topkwaliteit voor een prikkie

Je zou misschien denken dat de achterstand in chips een doodsteek is voor een bedrijf als MiniMax. De video laat echter briljant zien hoe zij van dit nadeel een strategisch voordeel maken. Ze proberen niet langer mee te doen aan de race om de allersnelste AI ter wereld te bouwen, maar richten zich op een enorm belangrijk (en winstgevend) alternatief: betaalbaarheid voor achtergrondtaken.

MiniMax M2.7 richt zich op de markt van '50 tot 100 tokens per seconde'. Dit is een bescheiden snelheid, ongeveer vergelijkbaar met een vlotte lezer. Maar het prijskaartje dat hieraan hangt, is revolutionair. Als je het MiniMax M2.7 model een vol jaar lang, 24 uur per dag, 7 dagen per week onafgebroken zou laten draaien, kost je dat in totaal ongeveer $2.000. Laten we dit eens vergelijken met de Amerikaanse topmodellen (de zogenaamde 'frontier models') zoals GPT 5.4 of Opus 4.7. Als je dezelfde hoeveelheid werk door deze giganten laat uitvoeren, kost dat je tussen de $23.000 en $39.000 per jaar. Dat is tien tot twintig keer zo duur!

Caleb legt uit dat we hierdoor een duidelijke splitsing in de markt gaan zien. Gebruikers moeten zich afvragen: "Heb ik voor deze specifieke taak een peperduur, supersnel model nodig? Of kan ik het werk ook laten doen door een AI die slechts $2.000 kost en op een rustiger tempo op de achtergrond zijn werk doet?" Voor zogenoemde 'agentic' taken—waarbij een AI zelfstandig en langdurig problemen oplost zonder dat jij direct op een antwoord zit te wachten—is MiniMax een droom die uitkomt.

### Kernpunt 3: AI die helpt bij het bouwen van AI (Zelf-evolutie)

Een van de meest in het oog springende delen van de video gaat over een recent bericht van MiniMax met de bijna beangstigende titel: 'Vroege echo's van zelf-evolutie'. Klinkt dit als een sciencefictionfilm waarin robots de wereld overnemen? Gelukkig niet. De presentator van de video is heel duidelijk: we zijn nog ver verwijderd van een systeem dat helemaal zelf nadenkt en zijn eigen code herschrijft.

Maar wat gebeurt er dan wel? MiniMax heeft ontdekt hoe ze AI kunnen inzetten om het saaie, handmatige werk van hun eigen programmeurs te automatiseren. Net zoals softwareontwikkelaars hun code continu moeten testen en aanpassen, moeten bouwers van AI continu aan honderden knoppen (hyperparameters) draaien om het model zo slim mogelijk te maken. Normaal is dit monnikenwerk. MiniMax heeft nu AI-assistenten (agents) gebouwd die dit testwerk deels zelfstandig uitvoeren, waarbij de mens alleen nog toezicht houdt.

Volgens de video heeft deze AI inmiddels al 30% tot 50% van het volledige trainingsproces overgenomen. De AI gaf zelfs suggesties om zijn eigen testomgeving te verbeteren! Het resultaat van deze automatisering is verbluffend: de vorige versie van het model (M2.5) kwam uit op 12 februari. Slechts 34 dagen later lanceerden ze al de opvolger, M2.7. Deze razendsnelle ontwikkelingscyclus bewijst hoe krachtig het is als AI wordt ingezet om nieuwe AI te bouwen.

### Kernpunt 4: Onder de motorkap: Slimme keuzes en een groot geheugen

Tot slot duiken we even de techniek in, maar zonder dat het te ingewikkeld wordt. Hoe past de M2.7 in de huidige markt? Het model bestaat uit 230 miljard parameters. Dit getal geeft de 'grootte' van het AI-brein aan. Het is een flink model, maar precies klein genoeg zodat bedrijven het nog lokaal op hun eigen servers kunnen draaien. Dit is fantastisch nieuws voor bedrijven die strenge privacyregels hebben en hun gegevens niet naar een cloud in Amerika willen sturen.

Daarnaast heeft de MiniMax M2.7 een enorm 'werkgeheugen', ook wel het contextvenster genoemd, van maar liefst 200.000 tokens. Dit betekent dat je de AI een stapel dikke boeken tegelijk te lezen kunt geven, en dat hij al die informatie feilloos onthoudt tijdens jullie gesprek.

Toch kleeft hier een groot risico aan. Om al die informatie te verwerken, gebruikt MiniMax een methode die 'full attention' (volledige aandacht) wordt genoemd. Deze methode is berucht om de enorme hoeveelheid geheugen die het opslurpt naarmate je er meer tekst instopt. Concurrenten stappen al over op hybride systemen die veel zuiniger met rekenkracht omgaan. Omdat we weten dat de Chinese laboratoria kampen met verouderde chips, legt deze rekenintensieve methode een enorme druk op hun systemen. Dat ze er toch in slagen dit model succesvol aan te bieden, maakt het een fascinerende keuze om de komende tijd in de gaten te houden.

### Conclusie: Een toekomst vol creatieve oplossingen

Als we de grondige analyse van Caleb Writes Code samenvatten, zien we een duidelijk beeld van de toekomst van AI. Aan de ene kant toont het de pijnlijke realiteit van de geopolitieke chip-oorlog: China moet het doen met hardware die jaren achterloopt op de Verenigde Staten. Maar aan de andere kant bewijst MiniMax M2.7 dat de winnaar niet altijd degene is met de snelste computer.

Door slim te focussen op de markt voor betaalbare, langdurige taken ($2000 per jaar in plaats van $39.000) en door hun eigen werkprocessen deels te automatiseren via AI, leveren ze een product af dat internationaal hoge ogen gooit. Op belangrijke kwaliteitstests (zoals Pinchbench) scoren ze zelfs een indrukwekkende vierde plaats.

De toekomst zal uitwijzen of hun verouderde apparatuur bestand is tegen de alsmaar groeiende vraag naar meer rekenkracht, vooral met hun zware 'full attention' benadering. De blik is nu al gericht op het aankomende M3-model: zal dat model de techniek compleet moeten omgooien om te overleven? Eén ding is helder: de wereld van AI wordt volwassener. Het draait niet langer alleen om de vraag "Wie bouwt de slimste robot?", maar om "Wie biedt de beste en meest betaalbare oplossing voor de gebruiker?" En in die laatste categorie is MiniMax een absolute pionier gebleken.

*Deze blogpost is gebaseerd op een video van [Caleb Williams](https://www.youtube.com/@CalebWritesCode). [Bekijk de originele video](https://www.youtube.com/watch?v=aBT4-CL2X0s).*
