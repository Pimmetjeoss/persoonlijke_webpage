---
title: "Google TPU 8t en 8i zijn er: Zo verandert het AI-chiplandschap"
date: "2026-05-03"
category: "AI & Technologie"
excerpt: "Google's nieuwe TPU 8t voor training en 8i voor inferentie veranderen de AI-hardware race. Met het Virgo Network als backbone daagt Google NVIDIA uit op efficiëntie en kosten."
featuredImage: "/images/blog/google-tpu-8t-8i-ai-chiplandschap.png"
---

# Google TPU 8t en 8i zijn er: Zo verandert het AI-chiplandschap

De AI-chip race is heviger dan ooit. Google heeft zijn nieuwste TPU's gelanceerd: de **8t voor training** en de **8i voor inferentie**. Ze herdefiniëren hoe we AI-modellen op schaal draaien.

## Wat zijn TPU's eigenlijk?

Een TPU (Tensor Processing Unit) is een **ASIC** — een chip die speciaal is ontworpen voor machine learning workloads. Dit in tegenstelling tot NVIDIA GPU's die *general purpose* zijn.

Het voordeel? Extreme efficiëntie voor precies de taken waarvoor ze gebouwd zijn.

## Scale Up vs. Scale Out: Twee strategieën

### Scale Up (Verticaal schalen)
Je maakt één chip krachtiger. Meer transistors, meer geheugen, snellere verbindingen.

**Voordelen:**
- Minder communicatie-overhead tussen chips
- Lagere latency voor enkelvoudige taken
- Eenvoudiger programmeermodel

**Nadelen:**
- Fysieke grenzen aan wat één chip kan
- Extreem hoge kosten per chip

### Scale Out (Horizontaal schalen)
Je verbindt veel chips met elkaar via Google's nieuwe **Virgo Network** — met enorme doorvoer als resultaat.

**Voordelen:**
- Bijna onbeperkte schaalbaarheid
- Betere kosten-efficiëntie op grote schaal

**Nadelen:**
- Netwerkcommunicatie introduceert latency
- Complexer om te programmeren

## De TPU 8t en 8i in detail

### TPU 8t (Training)
De 8t is geoptimaliseerd voor het **trainen van grote modellen**. Bij training verwerk je enorme hoeveelheden data in batches en update je continu de modelgewichten. Dit vereist hoge geheugenbandbreedtes, efficiënte gradient berekeningen en snelle chip-tot-chip communicatie via het Virgo Network.

### TPU 8i (Inferentie)
De 8i focust op **het draaien van al-getrainde modellen** voor eindgebruikers. Inferentie heeft andere eisen: lage latency, hoge throughput en energieefficiëntie want je draait 24/7.

Het Virgo Network verbindt meerdere 8i-chips en maakt **extreem hoge throughput** mogelijk — essentieel als je miljoenen gebruikers tegelijkertijd bedient.

## Het Economische Speelveld

De vraagcurve voor AI is steil. Naarmate modellen beter worden en meer mensen ze gebruiken, exploderen de kosten voor compute. Dit creëert een vicieuze cirkel:

1. Betere modellen → meer gebruikers
2. Meer gebruikers → meer inferentie kosten
3. Meer kosten → druk op efficiency
4. Efficiency-druk → nieuwe hardware zoals de TPU 8i

Google's strategie is helder: door het Virgo Network en gespecialiseerde chips te combineren, kunnen ze tokens **goedkoper serveren** dan NVIDIA-gebaseerde oplossingen — zeker op eigen Cloud infrastructure.

## Implicaties voor de AI-industrie

1. **Toenemende verticale integratie**: Google controleert steeds meer van de stack — van hardware tot model tot cloud service.
2. **Druk op NVIDIA**: Elke efficiënte TPU-deployment is een potentiële GPU-sale die NVIDIA misloopt.
3. **Democratisering via cloud**: Kleine bedrijven huren toegang tot Google's TPU-clusters.
4. **Specialisatie wint**: De trend van ASIC's over GPU's voor AI zet door.

## Conclusie

Google's TPU 8t en 8i zijn meer dan nieuwe chips — ze zijn een strategische zet in de AI-hardware race. Met het Virgo Network als backbone en duidelijke scheiding tussen training en inferentie, positioneert Google zich als serieuze challenger voor NVIDIA's dominantie.

De economie van AI-tokens wordt steeds interessanter — en Google speelt slim mee.

---

*Deze blogpost is gebaseerd op een video van [Caleb Williams](https://www.youtube.com/@CalebWritesCode). [Bekijk de originele video](https://www.youtube.com/watch?v=b_KxiTPBIb0).*
