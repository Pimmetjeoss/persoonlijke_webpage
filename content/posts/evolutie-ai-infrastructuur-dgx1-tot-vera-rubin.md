---
title: "De Evolutie van AI-Infrastructuur: Van DGX-1 tot Vera Rubin"
date: "2026-03-30"
category: "AI & Technologie"
excerpt: "Ontdek hoe de vraag naar rekenkracht voor AI is geëvolueerd, van de eerste Transformer-modellen tot de nieuwste agentische systemen met NVIDIA's Vera Rubin-architectuur en Groq 3 LPX."
featuredImage: "/images/blog/evolutie-ai-infrastructuur-dgx1-tot-vera-rubin.png"
---

De wereld van kunstmatige intelligentie (AI) ontwikkelt zich in een ongekend tempo, en de drijvende kracht achter deze revolutie is vaak onzichtbaar voor de eindgebruiker: de fysieke hardware en infrastructuur. In een recente en uiterst boeiende video van het YouTube-kanaal "Caleb Writes Code", getiteld "How GPU is scaling with AI..", neemt de presentator ons mee op een diepgaande reis door de geschiedenis en de toekomst van AI-infrastructuur. Aan de hand van een exclusief interview tijdens de GTC-conferentie met Nvidia-experts Joe Deair en Stuart Pittz, ontrafelt de video de complexe wisselwerking tussen steeds slimmer wordende AI-modellen en de gigantische rekenkracht die nodig is om ze te ondersteunen.

## De Oorsprong: De Transformer-Revolutie en de Vroege Schaalfasen

Om de huidige staat van GPU-scaling te begrijpen, moeten we teruggaan naar het jaar 2017. In dat jaar introduceerde Google de baanbrekende "Transformer"-architectuur, een uitvinding die de basis zou vormen voor de moderne AI-revolutie. Het jaar daarop nam OpenAI dit concept en introduceerde GPT, wat een directe adaptatie was van deze Transformer-architectuur. Vanaf dat moment vonden er voortdurend nieuwe doorbraken plaats, en bij elke stap moest de onderliggende AI-infrastructuur meegroeien om deze innovaties te kunnen dragen.

Tussen 2016 en 2018 was de AI-industrie echter nog sterk zoekende; men wist simpelweg nog niet hoe gigantisch groot GPT en Transformers daadwerkelijk zouden gaan worden. De schaalvergroting was ronduit verbijsterend: toen GPT-1 eind 2018 uitkwam, bevatte het model 117 miljoen parameters, maar slechts twee jaar later telde GPT-3 maar liefst 175 miljard parameters. Deze astronomische groei betekende dat de AI-infrastructuur zich in een razend tempo moest aanpassen om dergelijke schaalvergroting te kunnen ondersteunen.

Nvidia-CEO Jensen Huang omschrijft deze evolutie treffend in vier verschillende fasen van schaalvergroting: "pre-training scaling", "post-training scaling", "reasoning scaling", en momenteel bevinden we ons in de fase van "agentic scaling". In elk van deze fasen is er sprake van een wederzijdse afhankelijkheid; de AI-infrastructuur wordt gedreven door de eisen van de AI-modellen, maar tegelijkertijd wordt de ontwikkeling van nieuwe AI-modellen ook gestuurd en beperkt door de mogelijkheden van de bestaande infrastructuur.

## De Symbiose Tussen AI-Modellen en Infrastructuur

Deze wisselwerking tussen hardware en software wordt prachtig geïllustreerd door een opvallend fenomeen in de markt. Rond het jaar 2022 was er een opmerkelijk "gat" in de ontwikkeling van AI-modellen: de categorie van modellen met 20 tot 70 miljard parameters was een relatief onderbediende markt. De reden voor het bestaan van deze kloof bleek grotendeels te verklaren vanuit de beperkingen en eigenaardigheden van de AI-infrastructuur.

Volgens theorieën van onderzoekers vond er rond 2010 een verschuiving plaats waarbij onderzoekers hun lokale werkstations op de universiteit inruilden voor de cloud. Dit gaf hen plotseling de vrijheid om veel grotere modellen te bouwen. Een andere theorie stelt dat ontwikkelaars bewust probeerden de technische en logistieke rompslomp te vermijden die gepaard gaat met het opsplitsen van een model over meerdere grafische kaarten wanneer het een bepaalde grootte bereikt.

Tegenwoordig is dit obstakel echter grotendeels verholpen. De huidige AI-infrastructuur is dermate veelzijdig en krachtig geworden dat modellen met een dergelijke grootte nu juist uitstekend presteren. Bovendien heeft de industrie de precisie van berekeningen verlaagd van FP16 naar INT8, vervolgens naar INT4, of zelfs naar het native NVFP4-formaat. Deze verlaging in precisie legt van nature een veel lagere druk op de AI-infrastructuur, wat aantoont hoe softwarematige optimalisaties de beperkingen van de hardware kunnen verlichten.

## De Evolutie van de Hardware: Van Losse Kaarten naar Blackwell NVL72

Voor het jaar 2017 nam Nvidia een enorme sprong in het diepe met de lancering van hun eerste product in de DGX-lijn: de DGX-1. Het concept achter deze DGX-1 was even simpel als geniaal. In plaats van te werken met één enkele P100-kaart die slechts 16 GB aan VRAM bood, besloot Nvidia om acht van deze kaarten samen te weven tot een enkele topologie, wat resulteerde in een gecombineerd geheugen van 128 GB. Dankzij de introductie van de nieuwe NVLink 1-technologie konden deze acht grafische kaarten met elkaar communiceren op een ongekende snelheid van 160 GB per seconde.

Vanaf dat moment volgde de ene generatie na de andere zich in rap tempo op: de Pascal-architectuur in 2016, Volta in 2017, en vervolgens Ampere en Hopper richting de jaren 2020 en daarna. Waar individuele chips aanvankelijk 16 GB tot later 192 GB aan VRAM boden, zorgde de DGX-configuratie met acht gekoppelde GPU's voor capaciteiten variërend van 128 GB tot maar liefst 1,5 Terabyte aan VRAM.

Echter, de lancering van ChatGPT eind 2022 veranderde alles. De gebruikersbasis van ChatGPT explodeerde en groeide binnen slechts twee maanden naar 100 miljoen gebruikers, en telt momenteel meer dan 800 miljoen wekelijks actieve gebruikers. Deze ongekende en exponentiële vraag legde een gigantische druk op de bestaande Hopper-architectuur.

Dit leidde in 2024 tot de volgende grote generatiesprong: de Blackwell-architectuur. Met Blackwell introduceerde Nvidia een zogeheten "rack scale level" genaamd de NVL72. In plaats van een verbinding tussen acht kaarten, liet de NVL72-architectuur maar liefst 72 grafische kaarten met elkaar communiceren op volledige bandbreedte. De prestatiewinst was ontzagwekkend: uiteindelijk bleek uit benchmarks dat Blackwell met NVL72 maar liefst 50 keer meer prestaties per watt opleverde ten opzichte van de vorige generatie.

## Het "Agentic" Tijdperk: Van Racks naar Geïntegreerde Pods

Het jaar 2024 markeerde het begin van het zogenaamde "Agentic era". Dit werd ingeluid doordat agentische applicaties zoals Langchain en Cursor rond 2024 volwassen begonnen te worden, gevolgd door brede publieke adoptie van tools zoals Claude Code en Manis in 2025.

Deze verschuiving had een fundamentele impact op het gebruik van AI. Waar gebruikers voorheen simpele, op chat gebaseerde interacties hadden, evolueerde het gebruik naar veel meer actiegedreven werkzaamheden. Denk hierbij aan AI die zelfstandig het web doorzoekt, code schrijft, code compileert en complexe taken beheert.

Deze drastische verandering vereiste wederom een enorme aanpassing in de AI-infrastructuur. Het ging plotseling niet alleen meer om rauwe doorvoersnelheid van de GPU; agentische applicaties stelden veel hogere eisen aan betere CPU's, betere en snellere opslag, geavanceerdere netwerkverbindingen en een veel snellere vorm van "inference".

Als reactie hierop evolueerde de hardware van losse GPU's, naar 8 GPU's in een DGX, naar 72 GPU's in de NVL72, naar uiteindelijk een volledig geïntegreerde "pod". Tegenwoordig is er niet meer sprake van één type rack, maar van een hele reeks racks die specifiek zijn ontworpen om naadloos samen te werken. Dit immense systeem omvat nu het Vera CPU-rack, het NVL72 GPU-rack, gespecialiseerde STX-racks voor AI-native opslag, en de LPX-rackarchitectuur voor het netwerkgedeelte.

## Groq, LPX en de Zoektocht naar Snellere Inference

Met de opkomst van complexe agentische taken groeide niet alleen de vraag naar rekenkracht, maar ook de honger naar exponentieel snellere inference. Om agentische systemen in real-time te laten functioneren, moeten ze extreem snel data kunnen verwerken en antwoorden kunnen formuleren.

Om deze enorme kloof te dichten, deed Nvidia een opvallende strategische zet met de acquisitie van het bedrijf Groq. Dit resulteerde in de release van de Groq 3 LPU, een technologie die het gat in snelle inference moet overbruggen. De Nvidia Groq 3 LPX is een "rack scale inference accelerator", ontworpen voor het Vera Rubin platform. Deze LPX werkt in tandem met de NVL72-racks die zijn voorzien van Rubin GPU's. In feite brengt Nvidia hiermee twee extreme computers samen: de enorme rekenkracht van de Rubin GPU's wordt gecombineerd met het razendsnelle SRAM-geheugen van de LPU's.

De resultaten zijn baanbrekend. De integratie levert een inference-proces op dat tot wel 35 keer meer tokens per megawatt kan produceren voor extreem grote modellen. Dit betekent dat men nu in staat is om gigantische modellen van een biljoen parameters te draaien met een invoercontext van wel 400.000 tokens.

## De Toekomst: Tiers van Intelligentie en Ruimtedatacenters

De consensus is dat agentische systemen de vraag naar tokens en pure rekenkracht in de toekomst letterlijk "off the charts" zullen laten gaan. Nvidia voorziet een toekomst waarin er verschillende niveaus ("tiers") van inference zullen bestaan, die fungeren als een soort virtuele beroepsbevolking. Enerzijds zal er altijd behoefte blijven aan extreme volumes van goedkope tokens met een relatief basale intelligentie. Anderzijds zullen agenten voor specifieke taken specifieke intelligentieniveaus vereisen.

En alsof dat nog niet genoeg is, kijkt Nvidia zelfs al voorbij de grenzen van onze planeet. Men denkt serieus na over de toekomst van inference buiten de terrestrische datacenters op aarde, met de Vera Rubin Space One module — een concept gericht op het bouwen van "orbitale datacenters" om AI-inference in de ruimte te faciliteren.

## Conclusie

De evolutie van kunstmatige intelligentie is een fascinerende dans tussen de grenzeloze ambities van softwareontwikkelaars en de fysieke realiteit van hardware-ingenieurs. De industrie heeft in nog geen decennium tijd een adembenemende transformatie ondergaan. Van de onverwachte schaalvergroting door de Transformer-architectuur tot de integratie van 72 GPU's in de gigantische NVL72-racks en de razendsnelle Groq 3 LPU's; elke keer dat software de grenzen opzocht, beantwoordde de infrastructuur met revolutionaire innovaties.

Vandaag de dag staan we aan de vooravond van het agentische tijdperk, een tijdperk waarin AI niet langer slechts praatjes maakt, maar daadwerkelijk complexe acties uitvoert als een virtuele medewerker. Dit vereist datacenters in de vorm van massale, perfect georkestreerde pods, en creëert een toekomstvisie die zo ver reikt dat men zelfs datacenters in de ruimte overweegt. Eén ding is zeker: zolang AI blijft dromen, zal de infrastructuur blijven bouwen.

---

*Deze blogpost is gebaseerd op een video van [Caleb Williams](https://www.youtube.com/@CalebWritesCode). [Bekijk de originele video](https://www.youtube.com/watch?v=SUXn_hbKpEw).*
