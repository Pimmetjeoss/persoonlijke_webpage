---
title: "AGI, zijn we er al? Oordeel niet op taken, maar op mechanisme en aanpassing"
date: "2026-09-12"
category: "AI Begrijpen"
excerpt: "Tech-CEO's roepen dat AGI is bereikt, critici wijzen op wat modellen níét kunnen. Beide kampen praten langs elkaar heen: de een meet het mechanisme, de ander de capaciteiten. Een analyse van waar we werkelijk staan — en waarom de harness nu het halve werk doet."
featuredImage: "/images/blog/agi-mechanisme-capaciteiten.jpg"
---

Volgens Jensen Huang heeft OpenAI met **GPT-6 Astra** AGI bereikt — draaiend op NVIDIA-chips, voegde hij er veelbetekenend aan toe. Tech-CEO's buitelen over elkaar heen met de claim dat algemene kunstmatige intelligentie er is of binnen handbereik ligt. En toch is niemand het erover eens wat AGI eigenlijk ís. Dat maakt het debat tegelijk vaag en economisch beladen: er hangen miljarden aan investeringen, datacenterbouw en bedrijfswaarderingen aan vast. Om er zinnig over te praten helpt één onderscheid: beoordeel AGI langs twee assen, **mechanisme** en **capaciteiten**, en houd ze strikt uit elkaar.

## Twee assen in plaats van één definitie

Het debat over machine-intelligentie gaat terug tot de jaren tachtig. Filosoof en fysicus Roger Penrose stelde toen dat menselijk begrip fundamenteel niet-algoritmisch is en dus nooit door een computer kan worden voortgebracht — een conclusie die hij losjes afleidde uit wiskundige stellingen uit de jaren dertig. Het klassieke kader uit die tijd sprak van **zwakke AI** (smalle, domeinspecifieke intelligentie, die we allang hebben) tegenover **sterke AI** (een systeem met een eigen geest).

Dat oude kader helpt nog steeds, maar het publieke debat gaat allang niet meer over de filosofische vraag of een model een bewustzijn heeft. Het gaat over wat modellen kunnen. Daarom is een indeling in twee assen praktischer. **Mechanisme** gaat over hoe intelligentie wordt verworven en bijgewerkt: leert het systeem echt iets nieuws, of voert het alleen uit wat er in het lab is ingebakken? **Capaciteiten** gaan over welke taken het kan demonstreren. Voor- en tegenstanders van de stelling "AGI is bereikt" springen voortdurend tussen die twee assen heen en weer — en juist dat heen-en-weer maakt het debat zo verwarrend.

Eén geruststellende observatie vooraf: hoezeer modelarchitecturen ook termen uit de neurowetenschap lenen, ze lijken in werkelijkheid nauwelijks op het menselijk brein. Als we dicht bij AGI zijn, dan in elk geval zonder het mechanisme van menselijke intelligentie te hebben nagebouwd. Dat hoeft blijkbaar ook niet.

## Het mechanisme: tijdens inferentie leert het model niets

De scherpste mechanisme-kritiek komt van François Chollet, de bedenker van de ARC-AGI-benchmark. In een interview redeneert hij dat we AGI nog niet hebben bereikt, en zijn argument komt neer op één eis: kan het systeem **in nieuwe situaties nieuwe vaardigheden verwerven**? Modellen als Astra worden maandenlang in een datacenter gefabriceerd tot er een checkpoint wordt vrijgegeven — maar de intelligentie die in de parameters is gebakken, ligt tijdens inferentie min of meer vast. Naar die maatstaf is er nog geen AGI.

Dat wringt met de scores. Astra haalt volgens de analyse **tot 99,9 procent op ARC-AGI 3**, een test die juist is ontworpen om te meten of een model ter plekke onuitgesproken regels leert — terwijl hetzelfde model met een andere harness sterk verschillend scoorde. De verklaring zit niet in het model, maar in de **harness** eromheen. Het verschil is geen meetfout, maar een les over waar het leren plaatsvindt.

> Bij agentische benchmarks is de harness onderdeel van het resultaat: contextmanagement, geheugen, een executieomgeving en herstel van fouten doen het aanpassingswerk dat het model zelf niet doet.

Wie een model combineert met een harness als Codex — met skills, databasetoegang, een terminal en lussen — besteedt in feite een moeilijk architectuurprobleem uit aan handgeschreven code. Het model alleen heeft AGI nog niet bereikt, maar voor het **gehele systeem van model plus harness** valt redelijk te beweren dat we vroege tekenen zien. De maker van Claude Code omschreef die harnesslaag als een afweging waarmee engineeringwerk het vermogen van het model met 10 tot 20 procent kan oprekken.

Daar zit wel een spanning, bekend als de bittere les van Richard Sutton: handgemaakte structuur wordt op den duur steevast verslagen door geleerd gedrag. Alles wat nu nog met regels en programma's in de harness is getimmerd, zou uiteindelijk door het model zelf moeten worden overgenomen. Zolang dat niet zo is, blijft de harness een pleister — een effectieve, maar een pleister.

## De capaciteiten: algemene intelligentie is geen takenlijstje

Aan de andere as staat de capaciteiten-kritiek, waarvan Yann LeCun de bekendste vertolker is. Zijn bezwaar: de vermeende AGI kan geen badkamer repareren, niet op kinderen passen en niet volledig autonoom rijden. Grote taalmodellen zijn volgens hem doodlopend, juist omdat ze dit soort taken niet aankunnen.

Dat klinkt vernietigend, maar als argument is het zwak — en een elf jaar oud blog van Tim Urban laat zien waarom. In zijn bekende stuk over de weg van **ANI via AGI naar ASI** beschrijft Urban algemene intelligentie als iets fundamenteel anders dan een verzameling smalle specialismen. Een systeem kan best AGI zijn terwijl het op afzonderlijke taken onderdoet voor een smal, gespecialiseerd systeem. Algemene intelligentie gaat niet over het afvinken van een takenlijstje, maar over **het overdragen van kennis, redeneren en zich aanpassen aan veranderende omstandigheden**.

Wie AGI meet door willekeurige taken op te sommen die het niet kan, meet dus het verkeerde. De relevante vraag is hoe goed een systeem leert overdragen naar situaties die het niet eerder zag. Precies daar — bij die overdraagbaarheid — ligt ook de brug naar het mechanisme-argument: een model dat tijdens inferentie niets nieuws leert, zal zich per definitie moeizaam aanpassen.

## AGI als economisch narratief

 Daarmee zou je kunnen concluderen dat het hele AGI-debat zinloos is. Velen vinden dat ook. De topman van Anthropic noemde AGI een marketingterm — om vervolgens zelf marketingtermen te gebruiken over een "land van genieën in een datacenter". Maar wetenschappelijk leeg of niet: de term heeft enorm **economisch gewicht**. Beloften over AGI binnen vijf tot tien jaar sturen hoe financiering wordt toegewezen, hoe AI-bedrijven worden gewaardeerd, hoeveel er in datacenters wordt geïnvesteerd en welke techneuten worden binnengehaald.

En overbeloftes hebben een voorgeschiedenis: twee eerdere **AI-winters** werden allebei gekenmerkt door hoop en beloften die in ondermaatse resultaten eindigden. Generatieve AI is onmiskenbaar krachtiger dan alles wat eraan voorafging, maar AGI is inmiddels niet alleen een wetenschappelijke hypothese — het is een economisch narratief dat meebepaalt waar het geld heen stroomt. Dat maakt het moeilijk om het er níét over te hebben.

Bovendien meet ieder bedrijf AGI anders, dus bereiken ze het per definitie op verschillende momenten. Jensens uitspraak dat OpenAI AGI bereikte *met NVIDIA-chips* zegt minstens zoveel over positionering als over intelligentie. Het verplaatsen van de doelpalen — elke keer de definitie bijstellen zodra een mijlpaal is gehaald — dreigt dezelfde cyclus te herhalen: een toekomst die altijd vijf jaar van vandaag verwijderd is. Houd er bovendien rekening mee dat het eerste systeem dat terecht het AGI-label krijgt, op veel taken minder capabel kan zijn dan bestaande smalle modellen. Wie AGI opbouwt tot iets dat van de ene op de andere dag alles verandert, organiseert zijn eigen teleurstelling.

## Eindoordeel: vroege tekenen, geen finish

AGI is er niet als je het mechanisme als maatstaf neemt: modellen leren tijdens inferentie niets nieuws, en het aanpassingsvermogen dat benchmarks laten zien, komt grotendeels uit de handgebouwde harness. Tegelijk is het te goedkoop om AGI af te serveren met een lijstje taken die modellen niet kunnen — algemene intelligentie is overdraagbaarheid, geen takenlijst. Wat overblijft is een nuchtere tussenstand: vroege tekenen op systeemniveau, een pleister die nog door geleerd gedrag vervangen moet worden, en een term die evenveel over geld als over intelligentie gaat.

- **Scheid mechanisme en capaciteiten:** wie AGI claimt of ontkent moet eerst zeggen welke as hij bedoelt.
- **Het model leert niets nieuws tijdens inferentie** — de parameters liggen vast na de training in het datacenter.
- **De harness doet het halve werk:** tot 99,9 procent op ARC-AGI 3 dankzij contextmanagement, geheugen en foutherstel eromheen — terwijl hetzelfde model met een andere harness sterk verschillend scoort.
- **Takenlijstjes bewijzen weinig:** algemene intelligentie is kennisoverdracht en aanpassing, geen verzameling smalle specialismen.
- **AGI is ook economie:** financiering, waarderingen en datacenterbouw hangen aan de belofte, wat het debat vertekent.
- **Beheer verwachtingen:** het eerste echte AGI-systeem kan op veel taken zwakker zijn dan bestaande smalle modellen — en verandert niet van de ene op de andere dag alles.
