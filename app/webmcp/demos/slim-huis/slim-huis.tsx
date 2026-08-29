"use client";

/**
 * Nederlandse bewerking van GoogleChromeLabs/webmcp-tools/demos/smart-home.
 * Copyright 2026 Google LLC — SPDX-License-Identifier: Apache-2.0
 */

import {
  BatteryCharging, Camera, CloudRain, Fan, Gauge, House, LampDesk,
  LockKeyhole, Music2, PanelLeftClose, Play, ShieldCheck, SunMedium,
  Sparkles, Thermometer, Wind,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { WebMcpToolDefinition } from "../webmcp";
import styles from "./slim-huis.module.css";

const TEGEL_IDS = [
  "weer", "thermostaat", "deurcamera", "voordeur_slot", "woonkamer_lampen",
  "muziek", "alarm", "luchtkwaliteit", "robotstofzuiger", "zonnepanelen",
] as const;
type TegelId = (typeof TEGEL_IDS)[number];
const START_TEGELS: TegelId[] = ["weer", "thermostaat", "zonnepanelen"];

const SCENARIOS: Array<{ label: string; prompt: string; ids: TegelId[] }> = [
  { label: "Er staat iemand voor de deur", prompt: "Er staat iemand voor de deur. Laat zien wie het is en geef me de bediening van het slot.", ids: ["deurcamera", "voordeur_slot"] },
  { label: "Maak het comfortabel", prompt: "Het is hier benauwd. Toon de temperatuur en luchtkwaliteit.", ids: ["thermostaat", "luchtkwaliteit"] },
  { label: "Ik ga van huis", prompt: "Ik ga weg. Toon alleen wat ik nodig heb om het huis veilig achter te laten.", ids: ["voordeur_slot", "alarm", "woonkamer_lampen", "robotstofzuiger"] },
];

function Kaart({ children, extraClass = "" }: { children: React.ReactNode; extraClass?: string }) {
  return <article className={`${styles.kaart} ${extraClass}`}>{children}</article>;
}

const TEGELS: Record<TegelId, () => React.ReactNode> = {
  weer: () => <Kaart extraClass={styles.weerKaart}><CloudRain aria-hidden="true" /><div><span className={styles.groteWaarde}>18°</span><p>Bewolkt · 20% kans op regen</p></div></Kaart>,
  thermostaat: () => <Kaart><header><h2>Thermostaat · beneden</h2><Thermometer aria-hidden="true" /></header><div className={styles.thermostaat}><button type="button">−</button><strong>20°</strong><button type="button">+</button></div><p className={styles.status}>Verwarmen naar 20°</p></Kaart>,
  deurcamera: () => <Kaart extraClass={styles.cameraKaart}><header><h2>Camera voordeur</h2><span className={styles.live}>● LIVE</span></header><div className={styles.cameraBeeld}><Camera aria-hidden="true" /><span>17:15:00</span></div></Kaart>,
  voordeur_slot: () => <Kaart><header><h2>Slot voordeur</h2><LockKeyhole aria-hidden="true" /></header><div className={styles.knoppen}><button type="button" className={styles.actief}>Vergrendel</button><button type="button">Ontgrendel</button></div><p>5 minuten geleden ontgrendeld</p></Kaart>,
  woonkamer_lampen: () => <Kaart><header><h2>Lampen woonkamer</h2><LampDesk aria-hidden="true" /></header><div className={styles.knoppen}><button type="button" className={styles.actief}>Aan</button><button type="button">Uit</button></div><p>Helderheid: 80%</p></Kaart>,
  muziek: () => <Kaart><header><h2>Muziek · woonkamer</h2><Music2 aria-hidden="true" /></header><div className={styles.album}><div><Music2 aria-hidden="true" /></div><span><strong>Neon Nights</strong><small>Synthwave Essentials</small></span></div><button type="button" className={styles.rond}><Play aria-hidden="true" /></button></Kaart>,
  alarm: () => <Kaart extraClass={styles.alarmKaart}><header><h2>Beveiliging</h2><ShieldCheck aria-hidden="true" /></header><strong className={styles.alarmStatus}>UITGESCHAKELD</strong><div className={styles.knoppen}><button type="button">Thuis</button><button type="button" className={styles.actief}>Afwezig</button></div></Kaart>,
  luchtkwaliteit: () => <Kaart><header><h2>Luchtkwaliteit · binnen</h2><Wind aria-hidden="true" /></header><div><span className={styles.goed}>12</span> <span className={styles.eenheid}>AQI · goed</span></div><p>PM2.5: 3,1 µg/m³ · VOC: 0,02 ppm</p></Kaart>,
  robotstofzuiger: () => <Kaart><header><h2>Robotstofzuiger</h2><Fan aria-hidden="true" /></header><div className={styles.apparaatStatus}><span><strong>In dock</strong><small>100% opgeladen</small></span><BatteryCharging aria-hidden="true" /></div><div className={styles.knoppen}><button type="button" className={styles.actief}>Start</button><button type="button">Naar dock</button></div></Kaart>,
  zonnepanelen: () => <Kaart><header><h2>Energieverdeling</h2><SunMedium aria-hidden="true" /></header><div className={styles.meterKop}><span>Opwek</span><strong>4,2 kW</strong></div><div className={styles.meter}><i style={{ width: "80%" }} /></div><div className={styles.meterKop}><span>Verbruik</span><strong>2,4 kW</strong></div><div className={styles.meter}><i style={{ width: "45%" }} /></div><p className={styles.status}>+1,8 kW terug naar het net</p></Kaart>,
};

function geldigeIds(value: unknown): TegelId[] {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is TegelId => typeof id === "string" && (TEGEL_IDS as readonly string[]).includes(id));
}

export function SlimHuis() {
  const [tegels, setTegels] = useState<TegelId[]>(START_TEGELS);
  const [agentActief, setAgentActief] = useState(false);
  const [melding, setMelding] = useState("Dashboard toont de dagelijkse samenvatting");

  const richtDashboardIn = useCallback((ids: TegelId[], uitleg: string) => {
    const uniek = [...new Set(ids)];
    if (uniek.length === 0) throw new Error(`Kies minimaal één geldige tegel: ${TEGEL_IDS.join(", ")}`);
    setAgentActief(true);
    setTegels(uniek);
    setMelding(uitleg || "Dashboard aangepast door de assistent");
    window.setTimeout(() => setAgentActief(false), 1600);
    return { success: true, zichtbareTegels: uniek, message: "Het dashboard is aangepast." };
  }, []);

  const tool = useMemo<WebMcpToolDefinition>(() => ({
    name: "richt_slim_huis_dashboard_in",
    description: "Toont en ordent de relevante bedieningspanelen op het dashboard van een slim huis. Bij bezoek aan de deur zijn deurcamera en voordeur_slot relevant. Bij weggaan zijn voordeur_slot, alarm, woonkamer_lampen en robotstofzuiger relevant.",
    inputSchema: { type: "object", properties: {
      tegelIds: { type: "array", items: { type: "string", enum: [...TEGEL_IDS] }, description: `Tegels die zichtbaar moeten zijn, in de gewenste volgorde: ${TEGEL_IDS.join(", ")}.` },
      uitleg: { type: "string", description: "Korte Nederlandse uitleg waarom deze tegels nu relevant zijn." },
    }, required: ["tegelIds", "uitleg"] },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    execute: (args: never) => {
      const invoer = args as { tegelIds?: unknown; uitleg?: unknown };
      return richtDashboardIn(geldigeIds(invoer.tegelIds), typeof invoer.uitleg === "string" ? invoer.uitleg : "");
    },
  }), [richtDashboardIn]);

  useEffect(() => {
    const controller = new AbortController();
    let timer: number | undefined;
    const registreer = () => {
      if (!document.modelContext) { timer = window.setTimeout(registreer, 50); return; }
      void document.modelContext.registerTool(tool, { signal: controller.signal });
    };
    registreer();
    return () => { controller.abort(); if (timer) window.clearTimeout(timer); };
  }, [tool]);

  const probeerScenario = (scenario: (typeof SCENARIOS)[number]) => {
    void navigator.clipboard?.writeText(scenario.prompt);
    richtDashboardIn(scenario.ids, `Demo: ${scenario.label}`);
  };

  return <main className={styles.app}>
    <aside className={styles.zijbalk}>
      <a className={styles.merk} href="/webmcp"><House aria-hidden="true" /><span>Prikkel<strong>Thuis</strong></span></a>
      <nav aria-label="Slim huis">
        <a className={styles.navActief} href="#dashboard"><Gauge aria-hidden="true" />Dashboard</a>
        <a href="#dashboard"><ShieldCheck aria-hidden="true" />Beveiliging</a>
        <a href="#dashboard"><Thermometer aria-hidden="true" />Klimaat</a>
        <a href="#dashboard"><SunMedium aria-hidden="true" />Energie</a>
        <a href="#dashboard"><Music2 aria-hidden="true" />Media</a>
      </nav>
      <div className={styles.webmcpBadge}><Sparkles aria-hidden="true" /><span><strong>1 WebMCP-tool actief</strong>De assistent kan dit dashboard inrichten.</span></div>
    </aside>
    <section className={styles.inhoud} id="dashboard">
      <header className={styles.paginaKop}><div><p className={styles.bovenregel}>ZATERDAG 29 AUGUSTUS</p><h1>Welkom thuis, Pim.</h1><p>Alles draait rustig. Wat wil je nu in beeld?</p></div><PanelLeftClose aria-hidden="true" /></header>
      <div className={styles.scenarios} aria-label="Voorbeeldopdrachten">{SCENARIOS.map((scenario) => <button type="button" key={scenario.label} onClick={() => probeerScenario(scenario)} title={`${scenario.prompt} (wordt ook gekopieerd)`}>{scenario.label}</button>)}</div>
      <AnimatePresence>{agentActief && <motion.div className={styles.agentMelding} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}><Sparkles aria-hidden="true" /><span><strong>Assistent richt je dashboard in</strong>{melding}</span></motion.div>}</AnimatePresence>
      <motion.div className={styles.grid} layout><AnimatePresence mode="popLayout">{tegels.map((id) => { const Tegel = TEGELS[id]; return <motion.div key={id} layout initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .92 }} transition={{ type: "spring", stiffness: 320, damping: 26 }}><Tegel /></motion.div>; })}</AnimatePresence></motion.div>
    </section>
  </main>;
}
