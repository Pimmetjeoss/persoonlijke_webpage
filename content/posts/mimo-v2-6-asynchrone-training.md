---
title: "MiMo V2.6: de uitdaging zit niet alleen in meer GPU's"
date: "2026-10-17"
category: "AI Begrijpen"
excerpt: "De analyse van MiMo V2.6 laat zien waarom reinforcement learning vooral een coördinatieprobleem is. Minder wachtende GPU's betekent meer werk aan synchronisatie, trainingsdata en betrouwbare beloningen."
featuredImage: "/images/blog/mimo-v2-6-asynchrone-training.jpg"
youtubeVideoId: "WvI90l7c5Zs"
youtubeVideoTitle: "MiMo V2.6 explained in 12min.."
---

Meer GPU's helpen een AI-model niet vooruit wanneer een groot deel van die chips op elkaar staat te wachten. Dat is de interessante les uit Caleb Writes Codes analyse van Xiaomi's MiMo V2.6: bij reinforcement learning bepaalt niet alleen de hoeveelheid rekenkracht het tempo, maar vooral hoe het systeem uiteenlopende taken verdeelt en resultaten weer samenbrengt.

De maker beschrijft een post-trainingsfase op duizenden GPU's die binnen enkele dagen zou zijn afgerond. Die schaal- en tijdclaims zijn hier niet onafhankelijk gereproduceerd. De technische afweging erachter is breder relevant: **hogere hardwarebezetting vraagt om software die met ongelijke looptijden en verschillende modelversies kan omgaan.**

## Waarom reinforcement learning zoveel wachttijd veroorzaakt

Tijdens pretraining leert een taalmodel doorgaans het volgende token voorspellen op basis van bestaande tekst. De trainingsvoorbeelden kunnen vooraf in batches worden ingedeeld, waardoor de hoeveelheid werk beter te plannen is.

Bij reinforcement learning, kortweg RL, genereert het model zelf pogingen. Zo'n poging heet een rollout: een reeks redeneerstappen, antwoorden en eventueel toolaanroepen die uiteindelijk een resultaat oplevert. Een beoordelaar bepaalt vervolgens hoe goed dat resultaat was.

Die rollouts zijn niet even lang. Een agent vindt snel een oplossing, een andere probeert een extra route en een derde wacht op een tool. Wanneer alle uitvoerders na iedere ronde op de langzaamste moeten wachten, staan sommige GPU's stil terwijl elders nog werk loopt. Meer chips toevoegen maakt die ongelijkheid niet vanzelf kleiner.

De uitdaging is dus om twee processen efficiënt te combineren: nieuwe ervaringen verzamelen en met die ervaringen de modelgewichten bijwerken.

## Onderbreken bespaart wachten, maar veroorzaakt herberekening

Een mogelijke aanpak is partial rollout. Een langlopende poging wordt tijdelijk onderbroken, zodat een trainingsstap niet onbeperkt hoeft te wachten. Later gaat de poging verder.

Dat klinkt als het pauzeren van een download, maar een taalmodel verandert tijdens training. De gewichten waarmee het vervolg wordt berekend, kunnen inmiddels verschillen van de gewichten waarmee het eerste deel is gemaakt.

Daarom kan ook de **KV-cache** opnieuw moeten worden opgebouwd. Die cache bewaart tussenresultaten uit eerdere tokens, zodat het model niet telkens de volledige context opnieuw hoeft te verwerken. Wanneer de onderliggende gewichten veranderen, zijn die opgeslagen berekeningen niet zonder meer passend bij de nieuwe modelversie.

Het voordeel is minder stilstand. De prijs is extra rekenwerk en ingewikkelder beheer van lopende pogingen. Of de aanpak netto sneller is, hangt af van hoeveel wachttijd ermee verdwijnt en hoeveel herberekening daarvoor nodig is.

## Asynchroon trainen ruilt stilstand in voor versieverschillen

In een asynchroon systeem hoeven het genereren van ervaringen en het trainen niet voortdurend op elkaar te wachten. De inference-engine, die nieuwe tokens produceert, kan doorgaan terwijl de trainingssoftware de gewichten bijwerkt.

Daardoor ontstaat policy staleness: de ervaringen komen van een oudere versie van het model dan de versie die ermee wordt getraind. De policy is hier het gedrag van het model, vastgelegd in de kansen die het aan mogelijke vervolgtokens geeft.

Caleb beschrijft hoe de trainingsberekening rekening houdt met verschillen tussen de oude en actuele tokenkansen. Zulke correcties maken oude ervaringen bruikbaarder, maar heffen het probleem niet onbeperkt op. Als beide versies te ver uit elkaar lopen, kan de training instabiel worden. Het systeem moet dus tegelijk doorwerken en bewaken hoe ver de generator achterloopt.

Een tweede verschil kan uit numerieke precisie komen. Tokens genereren met lagere precisie kan efficiënter zijn, terwijl training een andere precisie gebruikt. Zelfs bij dezelfde modelversie kunnen berekeningen dan afwijken. Hardwarebezetting is daarmee niet de enige maatstaf: de verzamelde ervaringen moeten ook geschikt blijven om van te leren.

Deze spanning is niet nieuw voor de MiMo-familie. Xiaomi beschrijft in de [technische documentatie van MiMo-V2-Flash](https://github.com/XiaomiMiMo/MiMo-V2-Flash) al partial rollouts, fijnmazige taakplanning en maatregelen tegen verschillen tussen inference en training. Dat ondersteunt de bredere infrastructuurproblematiek, maar bevestigt niet automatisch de afzonderlijke releaseclaims over V2.6.

## Niet iedere poging levert een nuttig leersignaal op

De analyse bespreekt ook meerdere pogingen per opdracht. Wanneer sommige pogingen slagen en andere mislukken, ontstaat een vergelijking: welk gedrag werkte relatief goed binnen dezelfde groep?

De beschreven dynamic sampler houdt groepen met zowel geslaagde als mislukte pogingen over. Groepen waarin alles slaagt of alles faalt, bieden binnen deze relatieve vergelijking weinig onderscheid. Dat betekent niet dat zulke opdrachten voor ieder trainingsalgoritme waardeloos zijn; het zegt iets over de gekozen manier om een beloningssignaal te berekenen.

Daar zit een belangrijke beperking. Een hogere doorvoer van tokens is nog geen hogere doorvoer van nuttige leerervaringen. Een trainingssysteem moet ook opdrachten selecteren die het model werkelijk iets laten onderscheiden.

En de beoordelaar blijft bepalend. Een agent die een test doorstaat via een ongewenste omweg, kan op papier succesvol zijn en toch verkeerd gedrag aanleren. De video noemt daarom ook het ontmoedigen van onnodig tokengebruik en verkeerde toolaanroepen. Zulke maatregelen proberen niet alleen de uitkomst, maar ook de weg ernaartoe te verbeteren.

## Trainingskosten zijn niet de prijs van een compleet model

Caleb noemt ongeveer 2,6 miljoen dollar aan compute voor de Pro-variant en 854.000 dollar voor Flash. Dat zijn bedragen uit zijn bespreking van de post-training, geen door ons gecontroleerde totale ontwikkelkosten.

Het onderscheid is essentieel. Pretraining, dataverzameling, experimenten, mislukte runs, personeel en infrastructuur kunnen daarbuiten vallen. Ook bewijst een korte trainingsduur niet dat dezelfde prestatie goedkoop met een klein cluster kan worden herhaald: minder dagen kan juist betekenen dat veel hardware tegelijk nodig is.

Voor een zakelijke beoordeling zijn daarom zowel de afbakening van de kosten als de kwaliteit van het eindresultaat nodig. Vergelijk geen volledige modelontwikkeling met alleen de laatste optimalisatiefase.

## Conclusie

De waarde van de MiMo V2.6-analyse zit vooral in het zicht op de machinekamer van moderne AI. Reinforcement learning op grote schaal is geen kwestie van een trainingsscript op meer GPU's starten. Het vraagt om taakplanning, controle op modelversies, bruikbare beloningen en een afweging tussen herberekening en wachttijd.

De concrete schaal- en kostenclaims vragen aanvullende verificatie. De ontwerpvraag is ondertussen helder: hoeveel betrouwbare vooruitgang levert iedere ingezette eenheid rekenkracht op? Een drukke GPU is pas productief wanneer het werk ook bruikbaar is voor de volgende trainingsstap.
