---
title: "Inference Engines: Waarom AI Draaien Zoveel Complexer Is Geworden"
date: "2026-03-16"
category: "AI & Technologie"
excerpt: "Van 2.000 naar 1 miljoen tokens, van honderden miljoenen naar triljoenen parameters: ontdek waarom moderne AI-inferentie een compleet nieuwe aanpak vereist en hoe inference engines die uitdaging aanpakken."
featuredImage: "/images/blog/inference-engines-waarom-ai-draaien-zoveel-complexer-is-geworden.png"
---

# Inference Engines: Waarom AI Draaien Zoveel Complexer Is Geworden

AI draait vandaag de dag fundamenteel anders dan slechts vijf jaar geleden. En dat is geen kleine update — het is een complete hertekening van hoe we machine learning modellen in productie brengen. In deel 1 van deze serie legt Caleb uit waarom inference zo dramatisch is veranderd, en wat moderne inference engines doen om bij te blijven.

## Van Klein naar Onvoorstelbaar Groot

In 2021 was GPT-1 van OpenAI nog maar 117 miljoen parameters groot. GPT-2 deed het met 1,5 miljard. Die modellen pasten nog comfortabel op één grafische kaart. De context window? Zo'n 2.000 tokens — genoeg voor een paar alinea's tekst.

Spoelenvoor naar nu. Frontiermodellen zoals Gemini, Grok, GPT-4 en Claude Opus draaien op *triljoenen* parameters. De context window is geëxplodeerd naar 1 miljoen tokens. En hoewel Mixture of Experts (MoE) de inferentie efficiënter heeft gemaakt, blijft de fundamentele uitdaging: de modellen groeien sneller dan de onderliggende hardware.

PCIe, HBM en NVMe — de technologieën achter communicatie tussen SSD, CPU, RAM en GPU — zijn zeker verbeterd. Maar de modelgroei heeft die vooruitgang volledig overvleugeld.

## Het Verrassende Inzicht Over Model Splitting

Voor de hardware-revolutie van Nvidia was er een interessante ontdekking uit academisch onderzoek. Als je twee kleine modellen had (GPT-1 en GPT-2), was de intuïtieve aanpak: zet elk model op een aparte grafische kaart. Logisch toch?

Niet per se. Een casestudy liet zien dat het *splitsen van één model over twee kaarten* een **1,3 keer hogere prestatie** opleverde. Waarom?

De sleutel zit in het concept van **SLO: Service Level Objective**. Stel: een forward pass duurt 0,4 seconden. Met een SLO-schaalfactor van 5 heb je dus 2 seconden speling. Als 80% van de requests naar het nieuwe model gaan (het Pareto-principe), zag het gesplitste model een **6,6 keer lagere latency** bij piekbelasting. Dat is enorm.

Maar dit model is inmiddels achterhaald. Moderne kaarten zijn zo krachtig dat het spliten van kleine modellen niet meer nodig — én niet meer zinvol — is.

## De Nieuwe Werkelijkheid: Één Model, Heel Het Cluster

Vandaag is de situatie omgedraaid. We reserveren niet meer één kaart per model — we reserveren een *heel cluster* van GPU's voor slechts één model.

Neem als voorbeeld Grok 4, waarvan vermoed wordt dat het een 2 biljoen parameter model is. Zelfs bij INT4-precisie heb je **1 terabyte geheugen** nodig. Dat vereist minimaal vier van de nieuwste Rubin-chips van Nvidia. En dat is alleen het basisgeval.

Dit verandert alles aan hoe inference engines moeten werken. De focus verschuift van *het slim inplannen van meerdere modellen* naar *het optimaal bedienen van één enkel, kolossaal model*.

## Hoe Moderne Inference Engines Optimaliseren

### 1. Batching

Met 2 seconden SLO-speling kun je inkomende requests bundelen. In plaats van elk request individueel te verwerken — waarbij de GPU steeds opnieuw dezelfde modelgewichten uit het geheugen moet laden — worden meerdere requests samengevoegd tot één grote berekening.

Dit bespaart enorm veel redundant werk: kernel-operaties zoals matrix-vermenigvuldiging (GEMM), layer normalization, softmax en attention hoeven niet steeds opnieuw geïnitialiseerd te worden voor elk afzonderlijk verzoek.

### 2. Kernel Fusion

Inference engines fuseren veelvoorkomende opeenvolgende operaties tot één gecombineerde kernel. Minder overhead, snellere doorvoer. Dit is één van de meest directe optimalisaties die vandaag standaard is.

### 3. Paged Attention voor KV Cache

Dit is misschien wel de meest impactvolle innovatie van de afgelopen jaren. Het probleem: bij een context window van 1 miljoen tokens groeit de KV-cache (Key-Value cache voor de attention mechanismen) enorm. En niemand weet van tevoren hoe lang een LLM-response wordt.

De oplossing: **Paged Attention**, een mechanisme geleend uit besturingssystemen (denk aan virtueel geheugen). Door de KV-cache op te splitsen in pagina's die dynamisch worden toegewezen, kan een inference engine als vLLM de cache dramatisch efficiënter beheren. Dit was een doorbraak die andere inference engines ver achter zich liet.

## De Grote Spelers

Welke inference engines domineren vandaag?

- **vLLM** — baanbrekend in KV-cache beheer via Paged Attention
- **SGLang** — gefocust op gestructureerde output en snelheid
- **TensorRT-LLM** — Nvidia's eigen framework, geoptimaliseerd voor Nvidia hardware
- **Nvidia Dynamo Framework** — het nieuwste platform voor grootschalige inferentie

Elk heeft zijn eigen aanpak en sterktes. Deel 2 van deze serie zal dieper ingaan op de verschillen — Caleb bezoekt hiervoor eerst het Nvidia GTC 2026 conferentie (16-19 maart).

## Conclusie: Inference Is Een Eigen Vakgebied Geworden

Wat vijf jaar geleden een relatief eenvoudig probleem was — zet een model op een GPU en klaar — is uitgegroeid tot een complex, specialistisch vakgebied. De uitdagingen van geheugenmanagement, latency-optimalisatie en efficiënt batchen bij triljoenen parameters vereisen dedicated engineering.

De inference engine is niet langer een bijzaak. Het is de ruggengraat van moderne AI-productie.

---

🎥 Bekijk de originele video: [Inference Engines (Part 1) — Caleb Writes Code](https://www.youtube.com/watch?v=uqUZ_H_m2Yg)
