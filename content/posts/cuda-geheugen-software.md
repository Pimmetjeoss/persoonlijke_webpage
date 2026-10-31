---
title: "CUDA: waarom snelle AI meer vraagt dan een krachtige GPU"
date: "2026-10-31"
category: "Hardware & Infrastructuur"
excerpt: "CUDA verbindt GPU-rekenkracht met bruikbare software. De uitdaging zit in geheugen, taakverdeling en een ecosysteem dat prestaties levert zonder iedere applicatie vanaf nul te optimaliseren."
featuredImage: "/images/blog/cuda-geheugen-software.jpg"
youtubeVideoId: "s48xeUP_2qI"
youtubeVideoTitle: "CUDA is hard.."
---

Een krachtige GPU maakt een AI-model niet vanzelf snel. De chip moet gegevens op tijd aangeleverd krijgen, werk verdelen over veel gelijktijdige uitvoerders en tussentijdse resultaten bewaren in beperkt snel geheugen. CUDA is de softwarelaag waarmee ontwikkelaars die hardware bruikbaar maken. Juist de afstemming tussen geheugen en rekenwerk verklaart waarom het platform meer is dan een verzameling handige functies.

Caleb Writes Code bespreekt dat in zijn uitleg over CUDA, met bijdragen van NVIDIA's Stephen Jones. De interessantste les is niet een theoretische piekprestatie, maar de afstand tussen wat een chip op papier kan en wat een echte applicatie ervan benut. **Snellere hardware levert pas voordeel wanneer de software de juiste beperking aanpakt.**

## De rekenkern wacht niet op dezelfde manier als een gebruiker

Bij het lokaal draaien van een taalmodel staan de modelgewichten aanvankelijk bijvoorbeeld op een SSD. Software laadt ze naar het geheugen van de GPU. Maar ook daar is geheugen geen uniforme opslagruimte waar iedere berekening even snel bij kan.

GPU's hebben verschillende niveaus: groot devicegeheugen, caches en kleinere opslag dicht bij de rekeneenheden. Registers bewaren waarden voor individuele threads. Shared memory is werkgeheugen dat threads binnen een block samen kunnen gebruiken. Een thread is een kleine uitvoerder van programma-instructies; een block groepeert zulke uitvoerders voor samenwerking.

Die kleinere geheugens zijn geen onvolledige versie van het grote geheugen. Ze hebben een andere functie en nemen kostbare ruimte op de chip in. Alles even groot en even snel maken is geen realistische ontwerpkeuze. De programmeur moet daarom bedenken welke gegevens herhaald nodig zijn en waar die het best kunnen blijven.

Daarbij is een naam soms misleidend. CUDA kent ook local memory: logisch hoort die opslag bij één thread, maar fysiek bevindt ze zich in devicegeheugen. 'Lokaal' betekent dus niet automatisch dat een waarde in een snel register staat.

## Een kernel verdeelt werk én schaarse ruimte

Een CUDA-kernel is een functie die op de GPU door veel threads wordt uitgevoerd. Bij een matrixvermenigvuldiging kan de software het werk opdelen in tegels: kleinere stukken van de matrices die gezamenlijk een deel van de uitkomst opleveren. Door gegevens slim te hergebruiken hoeft de GPU minder vaak dezelfde informatie uit het grote geheugen te halen.

De hardware groepeert threads in warps van 32. Blocks worden toegewezen aan streaming multiprocessors, kortweg SM's: de onderdelen van de GPU die het werk uitvoeren. Het programmeermodel en de hardwareverdeling hangen samen, maar zijn niet hetzelfde. Een programmeur beschrijft threads en blocks; de hardware plant de uitvoering binnen haar mogelijkheden.

Een grotere hoeveelheid snel werkgeheugen per block kan hergebruik verbeteren. Tegelijk blijft er dan minder ruimte over voor andere blocks op dezelfde SM. Ook veel registers per thread kunnen het aantal gelijktijdig aanwezige threads beperken. Registers beperken is evenmin gratis: de compiler kan waarden naar local memory verplaatsen, waardoor extra geheugentoegang ontstaat.

Dat is de centrale trade-off: **meer gelijktijdig werk en minder dataverkeer zijn allebei nuttig, maar niet altijd tegelijk maximaal haalbaar.** De [CUDA-programmeergids](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/advanced-kernel-programming.html) beschrijft hoe registergebruik en shared memory de bezetting begrenzen. Een hoge bezetting is op zichzelf nog geen bewijs van de snelste uitvoering; daarvoor moet de concrete kernel worden gemeten.

## Een theoretisch rekensommetje is geen applicatiebenchmark

De video illustreert parallelle verwerking met een theoretische berekening van de tijd voor een groot aantal operaties. Zo'n voorbeeld helpt het mechanisme te begrijpen, maar is geen meting van een volledig taalmodel. Het bewijst ook niet hoeveel tokens een gebruiker per seconde ontvangt.

In een applicatie tellen meer factoren mee: de vorm van matrices, de gebruikte precisie, dataverplaatsing, synchronisatie en de volgorde van kernels. Bovendien kan de beperkende factor veranderen. Een bewerking die vooral op geheugen wacht, heeft weinig aan extra theoretische rekenkracht zolang dezelfde gegevens even langzaam worden aangevoerd.

Daarom is 'de GPU is sneller' een onvolledig antwoord op een zakelijke prestatievraag. Meet liever de eigen taak met representatieve invoer en dezelfde kwaliteitseisen. Maak daarbij onderscheid tussen hoe lang één verzoek duurt en hoeveel verzoeken het systeem gezamenlijk verwerkt. Een instelling die de totale doorvoer verbetert, hoeft de wachttijd van één gebruiker niet te verkorten.

## Het ecosysteem voorkomt dat iedere ontwikkelaar opnieuw begint

De meeste applicatiebouwers schrijven niet iedere matrixbewerking zelf. Ze gebruiken frameworks en bibliotheken die het gespecialiseerde werk al bevatten. cuBLAS biedt geoptimaliseerde lineaire algebra; cuDNN richt zich op bewerkingen voor deep learning. Daarmee wordt een deel van de hardwarekennis herbruikbaar.

CUDA omvat daarnaast gereedschap om code te compileren, een runtime voor onder meer geheugenbeheer en kernelstarts, en interfaces naar de driver. Het is dus niet alleen een programmeertaal of één bibliotheek. De waarde zit ook in de samenwerking tussen deze lagen en de software die anderen erop bouwen.

Dat maakt de kosten van overstappen naar een ander platform breder dan de aanschafprijs van een GPU. Een organisatie moet ook kijken naar ondersteunde operatoren, bestaande eigen kernels, profileringsgereedschap en de ervaring van het team. Dat betekent niet dat alternatieven onbruikbaar zijn. Het betekent dat een hardwarevergelijking zonder softwaremigratiekosten een deel van de rekening mist.

Bij meerdere GPU's komt communicatie erbij. NCCL is een softwarebibliotheek voor het uitwisselen en combineren van gegevens tussen GPU's. NVLink is daarentegen een hardwareverbinding. Volgens de [NCCL-documentatie](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/overview.html) kan de bibliotheek verschillende verbindingen benutten. Software en interconnect vullen elkaar dus aan; ze zijn geen namen voor hetzelfde onderdeel.

## Draagbaarheid is nuttig, maar niet onbeperkt

CUDA helpt ontwikkelaars verschillende generaties NVIDIA-GPU's te ondersteunen. Een rol daarin speelt PTX: een tussenrepresentatie van programma-instructies die verder kan worden vertaald naar machinecode voor de doelarchitectuur. Een driver kan geschikte PTX tijdens het laden compileren.

Dat is geen garantie dat ieder oud programma op iedere nieuwe of oudere GPU werkt. Compatibiliteit hangt onder meer af van het gekozen doelplatform, gebruikte functies, meegeleverde code en beschikbare driverondersteuning. Architectuurspecifieke optimalisaties kunnen de inzetbaarheid beperken. En code die correct draait, benut niet automatisch alle mogelijkheden van een nieuwe chip.

Voor beheerders betekent dit dat 'CUDA wordt ondersteund' nog geen complete implementatiecheck is. Controleer de combinatie van GPU, driver, framework en benodigde bibliotheken. Test daarna de echte workload, niet alleen of de omgeving kan starten.

## Conclusie

CUDA maakt zichtbaar waarom AI-infrastructuur niet ophoudt bij het bestellen van rekenkracht. Geheugenplaatsing, taakverdeling, bibliotheken en compatibiliteit bepalen samen hoeveel bruikbaar werk een applicatie uit een GPU haalt.

Voor een technische of zakelijke afweging zijn vooral deze punten relevant:

- Zoek eerst uit of rekenwerk, geheugen of communicatie de taak begrenst.
- Gebruik bestaande geoptimaliseerde bibliotheken voordat eigen kernels het uitgangspunt worden.
- Behandel theoretische piekprestaties niet als gemeten applicatiesnelheid.
- Neem softwareonderhoud en migratie mee in de hardwarekeuze.
- Controleer compatibiliteit én prestaties met de werkelijk gebruikte omgeving.

De beste keuze is daarmee niet automatisch de chip met het hoogste getal op de specificatielijst. Het is de combinatie van hardware en software die de eigen taak aantoonbaar goed uitvoert.
