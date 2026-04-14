---
title: "AutoResearch: Hoe AI Zichzelf Verbetert Zonder Jouw Hulp"
date: "2026-04-04"
category: "AI & Technologie"
excerpt: "Andrej Karpathy's AutoResearch laat AI-agenten zichzelf iteratief verbeteren — van ELO 750 naar 2600 in een schaakmotor. Wat betekent dit voor de toekomst van softwareontwikkeling?"
featuredImage: "/images/blog/autoresearch-ai-zelfverbetering-karpathy.png"
---

# AutoResearch: Hoe AI Zichzelf Verbetert Zonder Menselijke Tussenkomst

Stel je een AI-agent voor die een schaakmotor begint met een ELO van 750 — het niveau van een beginner. Na urenlang zelf experimenteren, zonder enige menselijke input, speelt diezelfde motor op ELO 2600: grootmeesterniveau. Dit is AutoResearch, en het verandert hoe we denken over softwareontwikkeling.

## Een Restaurantsimulatie als Startpunt

De kracht van AutoResearch wordt het duidelijkst aan de hand van een concreet voorbeeld. Een restaurant waar bestellingen binnenkomen en ingrediënten verbruiken. Het huidige algoritme faalt meer dan de helft van de bestellingen omdat de voorraad uitraakt voordat nieuwe aanvullingen arriveren.

AutoResearch werd op dit probleem losgelaten — zonder directe instructies over hoe het algoritme verbeterd moest worden. Het resultaat? Een volledig nieuw algoritme dat:

- Direct op dag één begint met bestellen, anticiperend op de aanvoertijd van 3-5 dagen
- Bestellingen groepeert in grotere hoeveelheden in plaats van één voor één
- Voorraad actief op een veilig niveau houdt

## Het Mechanisme: Iteratief Experiment

Hoe werkt AutoResearch? De kern is een experimentlus die:

1. **Wijzigingen voorstelt** aan het algoritme
2. **Experiments uitvoert** in de simulatie
3. **Evalueert** of de wijziging de doelstelling verbetert
4. **Behoudt successen**, verwerpt mislukkingen

Dit is vergelijkbaar met evolutie: alleen de "fit" varianten overleven.

## De Structuur is Cruciaal

AutoResearch werkt binnen strikte grenzen die de mens definieert:

- **goals.py**: Wat wil je bereiken?
- **prepare.py**: Hoe evalueer je succes?
- **Beperkt domein**: AutoResearch mag alleen het doelalgorithme aanpassen, niet de evaluatielogica

De kracht van AutoResearch zit juist in wat het níet kan: het kan de spelregels niet veranderen, alleen beter spelen binnen die regels.

## Het Werkkapitaalprobleem: Evaluatie Verfijnen

De restaurantsimulatie laat een subtiel maar belangrijk probleem zien. Nadat AutoResearch de voorraad optimaliseerde, bleef de voorraad stabiel — maar het bedrijf had nauwelijks werkkapitaal meer. De evaluatie moest aangescherpt worden: niet alleen maximaliseer de voorraad, maar ook het werkkapitaal.

Les: garbage in, garbage out — ook voor AI-zelfverbetering.

## Vibe Coding vs. AutoResearch

AutoResearch is fundamenteel anders dan vibe coding, waarbij een mens en AI samen feature voor feature bouwen. Bij AutoResearch is er nul menselijke tussenkomst tijdens de iteratieloop.

Dit maakt AutoResearch geschikt voor een specifiek type probleem:
- **Meetbaar succes**: Er moet een duidelijke evaluatiefunctie zijn
- **Simuleerbaar domein**: Je hebt een omgeving nodig waar experimenten snel kunnen draaien
- **Nauw gedefinieerd**: "Maak dit restaurant beter" is te vaag; "maximaliseer werkkapitaal" werkt

## De Grenzen van Zelfontwikkeling

AutoResearch is geen pad naar singulariteit — althans niet zomaar:
- Vereist een feedbackloop (simulatie of testomgeving)
- Werkt niet voor open-ended problemen zonder duidelijke evaluatiemetriek
- Richting en structuur moeten van een mens komen

## Een Nieuwe Benadering van Softwareontwikkeling

AutoResearch suggereert dat de rol van softwareontwikkelaars fundamenteel aan het verschuiven is. In plaats van "hoe implementeer ik dit algoritme", wordt de vraag: "hoe definieer ik het probleem en de evaluatiecriteria zo dat een AI het kan oplossen?"

Softwareontwikkeling wordt steeds meer over het ontwerpen van de juiste structuur — en minder over het handmatig schrijven van elke regel code.

---

*Deze blogpost is gebaseerd op een video van [Caleb Williams](https://www.youtube.com/@CalebWritesCode). [Bekijk de originele video](https://www.youtube.com/watch?v=5-ekc3eXNvs).*
