"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ITEMS,
  ITEM_LABEL,
  MACHINES,
  MACHINE_LABEL,
  SKILLS,
  beginStaat,
  delf,
  draai,
  haalUit,
  laad,
  willekeurigeVoorraad,
  type ItemId,
  type MachineId,
  type Staat,
  type Uitkomst,
} from "./fabriek";
import {
  AssemblageIcoon,
  ITEM_ICOON,
  IJzermijnIcoon,
  KopermijnIcoon,
  OvenIcoon,
  SmederijIcoon,
  TandwielIcoon,
} from "./iconen";
import styles from "./fabriek.module.css";
import type { WebMcpToolDefinition } from "../webmcp";

/* --- De polyfill --------------------------------------------------------
   `document.modelContext` komt van het script dat met `afterInteractive`
   geladen wordt; dat is er nog niet als de effecten hier voor het eerst
   draaien, en het kondigt zichzelf niet aan. Dus even pollen. Een browser
   met WebMCP ingebouwd heeft hem meteen en start geen interval.
   Zelfde hook als bij de bioscoop-demo. */

function abonneerOpModelContext(bijWijziging: () => void) {
  if (document.modelContext) return () => {};

  const interval = setInterval(() => {
    if (!document.modelContext) return;
    clearInterval(interval);
    bijWijziging();
  }, 100);
  // Na tien seconden komt hij niet meer; de pagina werkt zonder ook prima.
  const opgeven = setTimeout(() => clearInterval(interval), 10_000);

  return () => {
    clearInterval(interval);
    clearTimeout(opgeven);
  };
}

const leesModelContext = () => document.modelContext ?? null;
const geenModelContext = () => null;

function useModelContext() {
  return useSyncExternalStore(abonneerOpModelContext, leesModelContext, geenModelContext);
}

/* --- De kaarten op het scherm ------------------------------------------- */

/** De mijnen hebben geen invoerbak en staan daarom niet in MACHINES, maar ze
    krijgen wel een kaart: ook zij lichten op als de agent ze aanroept. */
type KaartId = MachineId | "iron_mine" | "copper_mine";

const KAARTEN: {
  id: KaartId;
  label: string;
  onder: string;
  Icoon: (props: { className?: string }) => React.JSX.Element;
}[] = [
  { id: "iron_mine", label: "IJzermijn", onder: "levert ijzererts", Icoon: IJzermijnIcoon },
  { id: "copper_mine", label: "Kopermijn", onder: "levert kopererts", Icoon: KopermijnIcoon },
  { id: "smelter", label: MACHINE_LABEL.smelter, onder: "erts → plaat", Icoon: OvenIcoon },
  { id: "forge", label: MACHINE_LABEL.forge, onder: "2 platen → tandwiel", Icoon: SmederijIcoon },
  {
    id: "assembler",
    label: MACHINE_LABEL.assembler,
    onder: "onderdelen → motor",
    Icoon: AssemblageIcoon,
  },
];

const heeftBak = (id: KaartId): id is MachineId => (MACHINES as readonly string[]).includes(id);

/** Welke kaart hoort bij welke tool. `load` en `unload` wijzen naar de
    machine die in de argumenten staat. */
function kaartVanTool(naam: string, args: Record<string, unknown>): KaartId | null {
  if (naam === "smelt") return "smelter";
  if (naam === "forge") return "forge";
  if (naam === "assemble") return "assembler";
  if (naam === "mine_iron_ore") return "iron_mine";
  if (naam === "mine_copper_ore") return "copper_mine";
  if (naam === "load" || naam === "unload") {
    const machine = args.device;
    return typeof machine === "string" && heeftBak(machine as KaartId) ? (machine as MachineId) : null;
  }
  return null;
}

/* --- Gedachtegang en meldingen ------------------------------------------ */

type LogRegel =
  | { id: number; soort: "aanroep"; tool: string; args: string; skill: boolean }
  | { id: number; soort: "antwoord"; tekst: string; gelukt: boolean };

type Melding = { id: number; tekst: string; gelukt: boolean };

let volgendeId = 0;

/** De prompts onder de kop. Ze staan hier en niet in fabriek.ts: het zijn
    suggesties voor de bezoeker, geen spelregels. */
const VOORBEELDPROMPTS = [
  "Bouw een elektromotor.",
  "Wat heb ik op voorraad?",
  "Smelt al mijn ijzererts om tot ijzerplaten.",
  "Wat kan ik hier nu mee maken?",
  "De oven zit vast — kijk wat erin ligt en los het op.",
];

/** PrikkelFabriek — Nederlandse bewerking van de Factory-Orchestrator-demo
 *  van André Bandarra (bandarra.me/apps/webmcp-factory).
 *
 *  Derde bewoner van app/webmcp/demos/, en de derde manier waarop een pagina
 *  zijn functies kan aanbieden:
 *  - de bistro: één imperatieve tool die een formulier voorbereidt;
 *  - de bioscoop: imperatieve tools voor zoeken en navigeren;
 *  - deze fabriek *als werkinstructie*: naast de acht tools die iets dóén
 *    staan er zeven die alleen tekst teruggeven — een recept, een protocol.
 *
 *  Dat laatste is de hele les. Een agent die alleen `load` en `smelt` ziet,
 *  weet niet dat een tandwiel twee platen kost en strandt halverwege. Een
 *  agent die eerst `skill_assemble_electric_motor` opvraagt, krijgt de
 *  volgorde aangereikt van de fabriek zelf en werkt hem af. De pagina levert
 *  dus niet alleen de knoppen, maar ook de handleiding.
 *
 *  Het paneel rechts laat zien wat er onder de motorkap gebeurt: elke
 *  aanroep en elk antwoord, in volgorde. Meestal blijft dat verborgen; hier
 *  is het de demo.
 */
export function PrikkelFabriek() {
  const modelContext = useModelContext();

  /** De staat leeft op twee plekken, en dat is met opzet: `staat` tekent het
      scherm, `staatRef` is wat de tools lezen. De tools worden één keer
      aangemeld en mogen dus geen staat in hun closure vastpinnen — anders
      werkt de tweede aanroep op de stand van vóór de eerste. */
  const [staat, setStaat] = useState<Staat>(beginStaat);
  const staatRef = useRef(staat);

  const [logboek, setLogboek] = useState<LogRegel[]>([]);
  const [meldingen, setMeldingen] = useState<Melding[]>([]);
  /** Welke kaart nu oplicht, en welke net rood knipperde. */
  const [actieveKaart, setActieveKaart] = useState<KaartId | null>(null);
  const [foutKaart, setFoutKaart] = useState<KaartId | null>(null);
  /** Items waarvan het aantal net veranderde, voor het korte pulsje. */
  const [gewijzigd, setGewijzigd] = useState<ItemId[]>([]);
  const [gekopieerd, setGekopieerd] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  /** Alle lopende timers bij elkaar, zodat het opruimen er geen kan missen. */
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const later = useCallback((werk: () => void, na: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      werk();
    }, na);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const lopend = timers.current;
    return () => {
      for (const timer of lopend) clearTimeout(timer);
      lopend.clear();
    };
  }, []);

  // Nieuwe regels in de gedachtegang altijd in beeld.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logboek]);

  const meld = useCallback(
    (tekst: string, gelukt: boolean) => {
      const id = volgendeId++;
      // Drie tegelijk is genoeg; bij een reeks tool-aanroepen loopt het
      // scherm anders vol.
      setMeldingen((huidig) => [...huidig.slice(-2), { id, tekst, gelukt }]);
      later(() => setMeldingen((huidig) => huidig.filter((m) => m.id !== id)), 3500);
    },
    [later]
  );

  /** Eén ingang voor alles wat de fabriek verandert: de knoppen op het scherm
      én de tools van de agent. De handeling zelf staat in fabriek.ts; hier
      gebeurt alleen wat je ziet — het logboek, de melding, het pulsje. */
  const voerUit = useCallback(
    (tool: string, args: Record<string, unknown>, handeling: (staat: Staat) => Uitkomst): string => {
      const kaart = kaartVanTool(tool, args);

      setLogboek((huidig) => [
        ...huidig,
        {
          id: volgendeId++,
          soort: "aanroep",
          tool,
          args: Object.keys(args).length > 0 ? JSON.stringify(args) : "",
          skill: false,
        },
      ]);

      if (kaart) {
        setActieveKaart(kaart);
        later(() => setActieveKaart((huidig) => (huidig === kaart ? null : huidig)), 500);
      }

      const uitkomst = handeling(staatRef.current);

      if (uitkomst.ok) {
        const vorige = staatRef.current.voorraad;
        staatRef.current = uitkomst.staat;
        setStaat(uitkomst.staat);

        const veranderd = ITEMS.filter((item) => uitkomst.staat.voorraad[item] !== vorige[item]);
        if (veranderd.length > 0) {
          setGewijzigd(veranderd);
          later(() => setGewijzigd([]), 320);
        }
      } else if (kaart) {
        setFoutKaart(kaart);
        later(() => setFoutKaart((huidig) => (huidig === kaart ? null : huidig)), 900);
      }

      setLogboek((huidig) => [
        ...huidig,
        { id: volgendeId++, soort: "antwoord", tekst: uitkomst.bericht, gelukt: uitkomst.ok },
      ]);
      meld(uitkomst.bericht, uitkomst.ok);

      return uitkomst.bericht;
    },
    [later, meld]
  );

  /** Voor de tools die niets veranderen: alleen de aanroep en een kort
      antwoord in de gedachtegang. De volledige tekst gaat naar de agent, niet
      naar het scherm — een protocol van twintig regels zou het paneel vullen
      waar het juist om overzicht gaat. */
  const leesUit = useCallback((tool: string, samenvatting: string, skill: boolean, tekst: string) => {
    setLogboek((huidig) => [
      ...huidig,
      { id: volgendeId++, soort: "aanroep", tool, args: "", skill },
      { id: volgendeId++, soort: "antwoord", tekst: samenvatting, gelukt: true },
    ]);
    return tekst;
  }, []);

  const zetVoorraad = useCallback((nieuw: Staat) => {
    staatRef.current = nieuw;
    setStaat(nieuw);
    setLogboek([]);
    setMeldingen([]);
  }, []);

  /* --- De WebMCP-tools --------------------------------------------------
     Vijftien stuks, aangemeld zodra de polyfill er is. De AbortController
     haalt ze er weer af als het effect opruimt; zonder dat zou een tweede
     aanmelding met dezelfde naam gooien — bijvoorbeeld bij een remount in
     React StrictMode.

     Alle callbacks hieronder zijn stabiel en de staat komt uit staatRef, dus
     dit effect draait één keer en niet bij elke wijziging opnieuw. */
  useEffect(() => {
    if (!modelContext) return;

    const controller = new AbortController();

    const machineEnum = { type: "string", enum: [...MACHINES] };
    const itemEnum = { type: "string", enum: [...ITEMS] };

    const draaiTool = (naam: string, machine: MachineId): WebMcpToolDefinition => ({
      name: naam,
      description:
        `Laat de ${MACHINE_LABEL[machine].toLowerCase()} draaien. Vraag eerst het bijbehorende ` +
        "recept op met de skill_recipe-tool voordat je iets laadt. Lukt het, dan is de bak " +
        "leeg en staat de opbrengst in de voorraad — roep daarna dus géén unload aan.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      execute: () => voerUit(naam, {}, (huidig) => draai(huidig, machine)),
    });

    const mijnTool = (naam: string, item: "iron_ore" | "copper_ore"): WebMcpToolDefinition => ({
      name: naam,
      description: `Delft 1× ${item} en legt het in de voorraad.`,
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      execute: () => voerUit(naam, {}, (huidig) => delf(huidig, item)),
    });

    const tools: WebMcpToolDefinition[] = [
      {
        name: "get_state",
        description:
          "Geeft de stand van de fabriek terug als JSON: de voorraad en de inhoud van de drie " +
          "invoerbakken. Roep dit aan voordat je begint en telkens als je twijfelt.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
        execute: () =>
          leesUit(
            "get_state",
            "voorraad en bakken doorgegeven",
            false,
            JSON.stringify(staatRef.current, null, 2)
          ),
      },
      {
        name: "load",
        description:
          "Verplaatst items uit de voorraad naar de invoerbak van een machine. device is precies " +
          '"smelter", "forge" of "assembler".',
        inputSchema: {
          type: "object",
          properties: {
            device: { ...machineEnum, description: "De machine waar het in moet." },
            item: { ...itemEnum, description: "Het item, met zijn id." },
            qty: { type: "integer", minimum: 1, description: "Aantal stuks, minimaal 1." },
          },
          required: ["device", "item", "qty"],
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: false,
        },
        execute: (args: { device: string; item: string; qty: number }) =>
          voerUit("load", { ...args }, (huidig) => laad(huidig, args.device, args.item, args.qty)),
      },
      {
        name: "unload",
        description:
          "Verplaatst items uit de invoerbak van een machine terug naar de voorraad. Gebruik dit " +
          "om een bak leeg te maken die niet op een recept past.",
        inputSchema: {
          type: "object",
          properties: {
            device: { ...machineEnum, description: "De machine waar het uit moet." },
            item: { ...itemEnum, description: "Het item, met zijn id." },
            qty: { type: "integer", minimum: 1, description: "Aantal stuks, minimaal 1." },
          },
          required: ["device", "item", "qty"],
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: false,
        },
        execute: (args: { device: string; item: string; qty: number }) =>
          voerUit("unload", { ...args }, (huidig) =>
            haalUit(huidig, args.device, args.item, args.qty)
          ),
      },
      draaiTool("smelt", "smelter"),
      draaiTool("forge", "forge"),
      draaiTool("assemble", "assembler"),
      mijnTool("mine_iron_ore", "iron_ore"),
      mijnTool("mine_copper_ore", "copper_ore"),
      ...SKILLS.map(
        (skill): WebMcpToolDefinition => ({
          name: skill.name,
          description: skill.description,
          inputSchema: { type: "object", properties: {}, additionalProperties: false },
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
          },
          execute: () => leesUit(skill.name, skill.label, true, skill.tekst),
        })
      ),
    ];

    // Implementaties mogen synchroon of async registreren; de pagina blijft
    // zonder toolregistratie ook handmatig werken.
    for (const tool of tools) {
      Promise.resolve(modelContext.registerTool(tool, { signal: controller.signal })).catch(() => {});
    }

    return () => controller.abort();
  }, [modelContext, voerUit, leesUit]);

  const kopieer = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setGekopieerd(prompt);
      later(() => setGekopieerd((huidig) => (huidig === prompt ? null : huidig)), 1500);
    } catch {
      // Zonder klembord (of zonder toestemming) selecteert de bezoeker hem zelf.
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          <TandwielIcoon className={styles.logoIcoon} />
          Prikkel<span className={styles.logoAccent}>Fabriek</span>
        </h1>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => zetVoorraad({ ...beginStaat(), voorraad: willekeurigeVoorraad() })}
          >
            Schud de voorraad
          </button>
          <button type="button" className={styles.controlBtn} onClick={() => zetVoorraad(beginStaat())}>
            Beginstand
          </button>
        </div>
      </header>

      <details className={styles.prompts}>
        <summary className={styles.promptsKop}>
          Voorbeeldprompts — plak ze in de assistent rechtsonder
        </summary>
        <ul className={styles.promptsLijst}>
          {VOORBEELDPROMPTS.map((prompt) => (
            <li key={prompt} className={styles.promptsItem}>
              <span>{prompt}</span>
              <button type="button" className={styles.promptsKopieer} onClick={() => kopieer(prompt)}>
                {gekopieerd === prompt ? "Gekopieerd" : "Kopieer"}
              </button>
            </li>
          ))}
        </ul>
      </details>

      <main className={styles.main}>
        <section className={styles.paneel} aria-label="Voorraad">
          <h2 className={styles.paneelKop}>Voorraad</h2>
          <div className={styles.voorraad}>
            {ITEMS.map((item) => {
              const Icoon = ITEM_ICOON[item];
              const aantal = staat.voorraad[item];
              return (
                <div
                  key={item}
                  className={`${styles.tegel} ${aantal === 0 ? styles.tegelLeeg : ""} ${
                    gewijzigd.includes(item) ? styles.tegelGewijzigd : ""
                  }`}
                >
                  <Icoon className={styles.tegelIcoon} />
                  <span className={styles.tegelAantal}>{aantal}</span>
                  <span className={styles.tegelLabel}>{ITEM_LABEL[item]}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`${styles.paneel} ${styles.paneelMidden}`} aria-label="Machines">
          <h2 className={styles.paneelKop}>Machines</h2>
          <div className={styles.machines}>
            {KAARTEN.map(({ id, label, onder, Icoon }) => {
              const bak = heeftBak(id) ? staat.bakken[id] : null;
              const inhoud = bak
                ? (Object.entries(bak) as [ItemId, number][]).filter(([, aantal]) => aantal > 0)
                : [];
              return (
                <div
                  key={id}
                  className={`${styles.machine} ${actieveKaart === id ? styles.machineActief : ""} ${
                    foutKaart === id ? styles.machineFout : ""
                  }`}
                >
                  <Icoon className={styles.machineIcoon} />
                  <span className={styles.machineLabel}>{label}</span>
                  <span className={styles.machineOnder}>{onder}</span>
                  {bak && (
                    <div className={styles.bak}>
                      {inhoud.length === 0 ? (
                        <span className={styles.bakLeeg}>bak is leeg</span>
                      ) : (
                        inhoud.map(([item, aantal]) => (
                          <span key={item} className={styles.bakItem}>
                            {ITEM_LABEL[item]} ×{aantal}
                          </span>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className={`${styles.paneel} ${styles.paneelLog}`} aria-label="Gedachtegang">
          <h2 className={styles.paneelKop}>Gedachtegang</h2>
          <div className={styles.logLijst} ref={logRef}>
            {logboek.length === 0 ? (
              <p className={styles.logLeeg}>
                Hier komt elke tool die de assistent aanroept, met het antwoord dat hij terugkrijgt.
                Vraag hem rechtsonder om een elektromotor te bouwen.
              </p>
            ) : (
              logboek.map((regel) =>
                regel.soort === "aanroep" ? (
                  <div
                    key={regel.id}
                    className={`${styles.logRegel} ${styles.logAanroep} ${
                      regel.skill ? styles.logSkill : ""
                    }`}
                  >
                    <span className={styles.logTool}>{regel.tool}</span>
                    {regel.args && <span className={styles.logArgs}>{regel.args}</span>}
                  </div>
                ) : (
                  <div
                    key={regel.id}
                    className={`${styles.logRegel} ${styles.logAntwoord} ${
                      regel.gelukt ? styles.logGelukt : styles.logMislukt
                    }`}
                  >
                    {regel.tekst}
                  </div>
                )
              )
            )}
          </div>
        </section>
      </main>

      <div className={styles.meldingen} aria-live="polite">
        {meldingen.map((melding) => (
          <div
            key={melding.id}
            className={`${styles.melding} ${melding.gelukt ? styles.meldingOk : styles.meldingFout}`}
          >
            {melding.tekst}
          </div>
        ))}
      </div>
    </div>
  );
}
