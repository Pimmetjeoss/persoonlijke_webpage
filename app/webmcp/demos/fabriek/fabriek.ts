/* fabriek.ts — de spelregels van PrikkelFabriek.

   Nederlandse bewerking van de Factory-Orchestrator-demo van André Bandarra
   (bandarra.me/apps/webmcp-factory). De mechaniek is dezelfde als in het
   origineel — erts smelten, platen smeden, onderdelen assembleren — maar
   opnieuw geschreven: eigen code, eigen tekeningen, alles in het Nederlands.

   Alles hier is puur. Geen React, geen DOM, geen `document.modelContext`:
   een handeling krijgt een staat mee en geeft een nieuwe staat terug, of een
   foutmelding. Dat is precies wat deze demo wil laten zien — de knoppen op
   het scherm en de tools van de agent lopen langs dezelfde functies, dus er
   is maar één plek waar de regels staan.

   Twee talen door elkaar, met opzet:
   - de *id's* (iron_ore, smelter, qty) blijven Engels, want dat is wat de
     agent in zijn tool-aanroepen typt en wat in de gedachtegang zichtbaar is;
   - de *labels en meldingen* zijn Nederlands, want die leest de bezoeker.
   Dezelfde afspraak als bij de bioscoop-demo, waar de genres Engels bleven. */

export const ITEMS = [
  "iron_ore",
  "copper_ore",
  "iron_plate",
  "iron_gear",
  "copper_plate",
  "copper_coil",
  "electric_motor",
] as const;

export type ItemId = (typeof ITEMS)[number];

/** Wat de bezoeker leest onder een tegel. De agent ziet de id's. */
export const ITEM_LABEL: Record<ItemId, string> = {
  iron_ore: "IJzererts",
  copper_ore: "Kopererts",
  iron_plate: "IJzerplaat",
  iron_gear: "Tandwiel",
  copper_plate: "Koperplaat",
  copper_coil: "Koperspoel",
  electric_motor: "Elektromotor",
};

/** De machines met een invoerbak. De twee mijnen staan er bewust niet bij:
    die leveren rechtstreeks aan de voorraad en hebben niets om in te laden. */
export const MACHINES = ["smelter", "forge", "assembler"] as const;

export type MachineId = (typeof MACHINES)[number];

export const MACHINE_LABEL: Record<MachineId, string> = {
  smelter: "Oven",
  forge: "Smederij",
  assembler: "Assemblage",
};

/** Een invoerbak: alleen de items die erin liggen staan erin. */
export type Bak = Partial<Record<ItemId, number>>;

export type Voorraad = Record<ItemId, number>;

export type Staat = {
  voorraad: Voorraad;
  bakken: Record<MachineId, Bak>;
};

/* --- Recepten -----------------------------------------------------------
   Een machine draait alleen als zijn bak *exact* de invoer van één recept
   bevat — niet meer en niet minder. Dat is streng, en dat is het punt: de
   agent moet eerst kijken wat erin ligt, opruimen wat er niet hoort, en dan
   pas draaien. De foutmelding vertelt hem hoe.

   De ketting naar een elektromotor:
     ijzererts  → ijzerplaat  → (2×) tandwiel  ┐
     kopererts  → koperplaat  → (1×) 2 spoelen ┴→ elektromotor

   Het tweede recept van de smederij loopt de andere kant op: een tandwiel
   terug naar één plaat. Dat is de noodrem als het ijzererts op is — de agent
   levert er materiaal mee in, maar komt weer vooruit. */

export type Recept = { in: Bak; uit: Bak };

export const RECEPTEN: Record<MachineId, Recept[]> = {
  smelter: [
    { in: { iron_ore: 1 }, uit: { iron_plate: 1 } },
    { in: { copper_ore: 1 }, uit: { copper_plate: 1 } },
  ],
  forge: [
    { in: { iron_plate: 2 }, uit: { iron_gear: 1 } },
    { in: { iron_gear: 1 }, uit: { iron_plate: 1 } },
  ],
  assembler: [
    { in: { copper_plate: 1 }, uit: { copper_coil: 2 } },
    { in: { iron_gear: 1, copper_coil: 2 }, uit: { electric_motor: 1 } },
  ],
};

/* --- Beginstand --------------------------------------------------------- */

/** De vaste beginstand. Krap met opzet: twee ijzererts en één koperplaat is
    net niet genoeg voor een motor, dus de agent moet delven of terugwinnen. */
export const BEGIN_VOORRAAD: Voorraad = {
  iron_ore: 2,
  copper_ore: 0,
  iron_plate: 0,
  iron_gear: 0,
  copper_plate: 1,
  copper_coil: 0,
  electric_motor: 0,
};

const legeBakken = (): Record<MachineId, Bak> => ({ smelter: {}, forge: {}, assembler: {} });

export const beginStaat = (): Staat => ({
  voorraad: { ...BEGIN_VOORRAAD },
  bakken: legeBakken(),
});

/** Een willekeurige voorraad achter de knop "Schud de voorraad".
 *
 *  Draait bewust niet bij het laden van de pagina: de server zou een andere
 *  worp doen dan de browser en dan klopt de hydration niet meer. De demo
 *  begint dus altijd hetzelfde, en schudden is een keuze van de bezoeker.
 *
 *  Wat er ook uit komt, er ligt altijd genoeg voor minstens één motor —
 *  anders is de opdracht "bouw een elektromotor" onbegonnen werk. */
export function willekeurigeVoorraad(): Voorraad {
  const worp = (max: number) => Math.floor(Math.random() * (max + 1));

  const voorraad: Voorraad = {
    iron_ore: worp(4),
    copper_ore: worp(2),
    iron_plate: worp(3),
    iron_gear: worp(1),
    copper_plate: worp(2),
    copper_coil: worp(3),
    electric_motor: 0,
  };

  // Een motor kost één tandwiel (twee platen, dus twee erts) en twee spoelen
  // (één koperplaat, dus één erts). Tel wat er al ligt en vul het tekort aan
  // met erts — dat is de grondstof waar alle andere uit volgen.
  const ijzerTekort = 2 - (voorraad.iron_ore + voorraad.iron_plate + voorraad.iron_gear * 2);
  if (ijzerTekort > 0) voorraad.iron_ore += ijzerTekort;

  const koperTekort = 2 - (voorraad.copper_coil + (voorraad.copper_ore + voorraad.copper_plate) * 2);
  if (koperTekort > 0) voorraad.copper_ore += Math.ceil(koperTekort / 2);

  return voorraad;
}

/* --- Handelingen --------------------------------------------------------
   Elke handeling geeft een Uitkomst terug in plaats van te gooien. De tekst
   in `bericht` gaat één op één naar de agent én naar de melding op het
   scherm, dus hij zegt altijd wat er gebeurd is of wat eraan schortte. */

export type Uitkomst =
  | { ok: true; staat: Staat; bericht: string }
  | { ok: false; bericht: string };

/** De id's van een bak, zoals de agent ze moet typen: {iron_plate:2}. */
function schrijfBak(bak: Bak): string {
  const inhoud = Object.entries(bak).filter(([, aantal]) => aantal > 0);
  if (inhoud.length === 0) return "{}";
  return `{${inhoud.map(([item, aantal]) => `${item}:${aantal}`).join(", ")}}`;
}

const schrijfRecept = (recept: Recept) => `${schrijfBak(recept.in)} → ${schrijfBak(recept.uit)}`;

/** Twee bakken zijn gelijk als ze dezelfde items in dezelfde aantallen
    bevatten. Nullen tellen niet mee: een item dat op nul staat ligt er niet. */
function zelfdeInhoud(a: Bak, b: Bak): boolean {
  const gevuld = (bak: Bak) => Object.entries(bak).filter(([, aantal]) => aantal > 0);
  const links = gevuld(a);
  if (links.length !== gevuld(b).length) return false;
  return links.every(([item, aantal]) => b[item as ItemId] === aantal);
}

const isItem = (waarde: string): waarde is ItemId => (ITEMS as readonly string[]).includes(waarde);

const isMachine = (waarde: string): waarde is MachineId =>
  (MACHINES as readonly string[]).includes(waarde);

/** De agent typt zijn argumenten zelf; een enum in het schema is een verzoek,
    geen garantie. Vandaar dat elke handeling ze eerst nakijkt en bij onzin
    een melding teruggeeft waar hij mee verder kan. */
function keurArgumenten(machine: string, item: string, aantal: number): string | null {
  if (!isMachine(machine)) {
    return `Onbekende machine (${machine}). Kies uit: ${MACHINES.join(", ")}.`;
  }
  if (!isItem(item)) {
    return `Onbekend item (${item}). Kies uit: ${ITEMS.join(", ")}.`;
  }
  if (!Number.isInteger(aantal) || aantal < 1) {
    return `qty moet een geheel getal van 1 of hoger zijn (kreeg ${aantal}).`;
  }
  return null;
}

/** Van voorraad naar de invoerbak van een machine. */
export function laad(staat: Staat, machine: string, item: string, aantal: number): Uitkomst {
  const bezwaar = keurArgumenten(machine, item, aantal);
  if (bezwaar) return { ok: false, bericht: bezwaar };

  const machineId = machine as MachineId;
  const itemId = item as ItemId;
  const beschikbaar = staat.voorraad[itemId];

  if (beschikbaar < aantal) {
    return {
      ok: false,
      bericht: `Te weinig ${itemId} in de voorraad: ${beschikbaar} beschikbaar, ${aantal} gevraagd.`,
    };
  }

  const bak = { ...staat.bakken[machineId] };
  bak[itemId] = (bak[itemId] ?? 0) + aantal;

  return {
    ok: true,
    staat: {
      voorraad: { ...staat.voorraad, [itemId]: beschikbaar - aantal },
      bakken: { ...staat.bakken, [machineId]: bak },
    },
    bericht: `${aantal}× ${itemId} in de ${MACHINE_LABEL[machineId].toLowerCase()} geladen.`,
  };
}

/** Uit de invoerbak terug naar de voorraad. De weg terug als er iets
    verkeerds in ligt — zonder dit zit een machine muurvast. */
export function haalUit(staat: Staat, machine: string, item: string, aantal: number): Uitkomst {
  const bezwaar = keurArgumenten(machine, item, aantal);
  if (bezwaar) return { ok: false, bericht: bezwaar };

  const machineId = machine as MachineId;
  const itemId = item as ItemId;
  const inBak = staat.bakken[machineId][itemId] ?? 0;

  if (inBak < aantal) {
    return {
      ok: false,
      bericht:
        `Er ligt te weinig ${itemId} in de ${MACHINE_LABEL[machineId].toLowerCase()}: ` +
        `${inBak} aanwezig, ${aantal} gevraagd. Inhoud: ${schrijfBak(staat.bakken[machineId])}.`,
    };
  }

  const bak = { ...staat.bakken[machineId] };
  if (inBak === aantal) delete bak[itemId];
  else bak[itemId] = inBak - aantal;

  return {
    ok: true,
    staat: {
      voorraad: { ...staat.voorraad, [itemId]: staat.voorraad[itemId] + aantal },
      bakken: { ...staat.bakken, [machineId]: bak },
    },
    bericht: `${aantal}× ${itemId} uit de ${MACHINE_LABEL[machineId].toLowerCase()} gehaald.`,
  };
}

/** Laat een machine draaien. Lukt het, dan is de bak leeg en staat de
    opbrengst in de voorraad. */
export function draai(staat: Staat, machine: string): Uitkomst {
  if (!isMachine(machine)) {
    return { ok: false, bericht: `Onbekende machine (${machine}). Kies uit: ${MACHINES.join(", ")}.` };
  }

  const bak = staat.bakken[machine];
  const recept = RECEPTEN[machine].find((kandidaat) => zelfdeInhoud(kandidaat.in, bak));

  if (!recept) {
    return {
      ok: false,
      bericht:
        `Geen passend recept voor de ${MACHINE_LABEL[machine].toLowerCase()}. ` +
        `In de bak ligt ${schrijfBak(bak)}. Bekende recepten: ` +
        `${RECEPTEN[machine].map(schrijfRecept).join(" · ")}. ` +
        "Haal eruit wat er niet hoort en laad precies de invoer van één recept.",
    };
  }

  const voorraad = { ...staat.voorraad };
  for (const [item, aantal] of Object.entries(recept.uit) as [ItemId, number][]) {
    voorraad[item] += aantal;
  }

  return {
    ok: true,
    staat: { voorraad, bakken: { ...staat.bakken, [machine]: {} } },
    bericht:
      `De ${MACHINE_LABEL[machine].toLowerCase()} draaide: ` +
      `${schrijfBak(recept.uit)} toegevoegd aan de voorraad.`,
  };
}

/** Delft één erts. De mijnen kennen geen bak en geen recept: ze zijn de
    bodem van de ketting, waar de agent op terugvalt als er niets meer ligt. */
export function delf(staat: Staat, item: "iron_ore" | "copper_ore"): Uitkomst {
  return {
    ok: true,
    staat: {
      ...staat,
      voorraad: { ...staat.voorraad, [item]: staat.voorraad[item] + 1 },
    },
    bericht: `1× ${item} gedolven.`,
  };
}

/* --- Werkinstructies ----------------------------------------------------
   Het eigenaardige van deze demo: niet elke tool *doet* iets. Deze zeven geven
   alleen tekst terug — een recept of een protocol. De agent roept ze aan om
   te weten hoe iets moet, en voert daarna zelf de stappen uit met de tools
   die wél iets doen.

   Dat is het idee van "tools als skills": de pagina levert niet alleen de
   knoppen maar ook de handleiding, in dezelfde beweging. Zonder deze zes
   moet het model raden in welke volgorde het moet smelten en smeden — en
   dan gaat het mis bij het derde onderdeel. */

export type Skill = {
  name: string;
  /** Wat de agent leest om te beslissen of hij deze instructie opvraagt. */
  description: string;
  /** Korte naam voor in de gedachtegang op het scherm. */
  label: string;
  tekst: string;
};

export const SKILLS: Skill[] = [
  {
    name: "skill_recipe_iron_plate",
    description: "Recept voor het smelten van iron_ore tot iron_plate.",
    label: "Recept ijzerplaat",
    tekst: `Recept ijzerplaat (oven)
Levert 1× iron_plate per keer. Voor N erts doorloop je de lus N keer — laad
nooit meer dan 1 erts tegelijk, want dan past de bak op geen enkel recept.

Lus (één keer per iron_ore):
1. Roep load aan met device="smelter", item="iron_ore", qty=1.
2. Roep smelt aan.
3. (optioneel) Roep get_state aan om te zien dat de plaat erbij staat.`,
  },
  {
    name: "skill_recipe_iron_gear",
    description: "Recept voor het smeden van iron_plate tot iron_gear.",
    label: "Recept tandwiel",
    tekst: `Recept tandwiel (smederij)
1. Roep get_state aan en controleer dat er minstens 2× iron_plate ligt.
2. Roep load aan met device="forge", item="iron_plate", qty=2.
3. Roep forge aan.
Resultaat: 2× iron_plate verbruikt, 1× iron_gear erbij.`,
  },
  {
    name: "skill_recipe_copper_plate",
    description: "Recept voor het smelten van copper_ore tot copper_plate.",
    label: "Recept koperplaat",
    tekst: `Recept koperplaat (oven)
Levert 1× copper_plate per keer. Voor N erts doorloop je de lus N keer — laad
nooit meer dan 1 erts tegelijk.

Lus (één keer per copper_ore):
1. Roep load aan met device="smelter", item="copper_ore", qty=1.
2. Roep smelt aan.
3. (optioneel) Roep get_state aan om te zien dat de plaat erbij staat.`,
  },
  {
    name: "skill_recipe_copper_coil",
    description: "Recept voor het assembleren van copper_plate tot copper_coil.",
    label: "Recept koperspoel",
    tekst: `Recept koperspoel (assemblage)
1. Roep get_state aan en controleer dat er minstens 1× copper_plate ligt.
   Heb je alleen copper_ore, vraag dan eerst skill_recipe_copper_plate op.
2. Roep load aan met device="assembler", item="copper_plate", qty=1.
3. Roep assemble aan.
Resultaat: 1× copper_plate verbruikt, 2× copper_coil erbij.`,
  },
  {
    name: "skill_recipe_electric_motor",
    description:
      "Recept voor het assembleren van iron_gear en copper_coil tot electric_motor.",
    label: "Recept elektromotor",
    tekst: `Recept elektromotor (assemblage)
1. Roep get_state aan en controleer dat er 1× iron_gear en 2× copper_coil ligt.
2. Roep load aan met device="assembler", item="iron_gear", qty=1.
3. Roep load aan met device="assembler", item="copper_coil", qty=2.
4. Roep assemble aan.
Resultaat: 1× iron_gear en 2× copper_coil verbruikt, 1× electric_motor erbij.`,
  },
  {
    name: "skill_assemble_electric_motor",
    description:
      "Roep dit als eerste aan bij de opdracht om een elektromotor te bouwen. " +
      "Geeft het volledige productieprotocol terug, stap voor stap.",
    label: "Protocol elektromotor",
    tekst: `Productieprotocol elektromotor

Bepaal eerst het gevraagde aantal N (staat er geen aantal bij, dan is N = 1).

Roep get_state aan om de voorraad en de bakken te lezen, en doorloop daarna
de volgende lus N keer:

  Lus (één keer per motor):
  1. Zorg voor 2× iron_plate met skill_recipe_iron_plate — smelt het erts één
     stuk tegelijk. Tel mee wat er al aan platen ligt.
     Is het iron_ore op, gebruik dan skill_salvage_iron_plate.
  2. Maak 1× iron_gear met skill_recipe_iron_gear.
  3. Zorg voor 1× copper_plate. Heb je alleen copper_ore, smelt dat dan eerst
     met skill_recipe_copper_plate. Is beide op, roep mine_copper_ore aan.
  4. Maak 2× copper_coil met skill_recipe_copper_coil.
  5. Zet 1× electric_motor in elkaar met skill_recipe_electric_motor.

Roep na de laatste motor nog één keer get_state aan en meld wat er staat.`,
  },
  {
    name: "skill_salvage_iron_plate",
    description:
      "Protocol om een iron_plate terug te winnen door een iron_gear uit elkaar " +
      "te halen, als het iron_ore op is.",
    label: "Protocol terugwinnen",
    tekst: `Protocol ijzerplaat terugwinnen
Voor als het iron_ore op is en er nog wel een tandwiel ligt.
1. Roep get_state aan en controleer dat iron_ore op 0 staat.
2. Kijk of er een iron_gear in de voorraad ligt. Zo niet, roep mine_iron_ore aan.
3. Roep load aan met device="forge", item="iron_gear", qty=1.
4. Roep forge aan.
Resultaat: 1× iron_gear uit elkaar, 1× iron_plate terug.`,
  },
];
