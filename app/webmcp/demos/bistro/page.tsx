import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display } from "next/font/google";
import { BistroAssistant } from "./bistro-assistant";
import { ReservationForm } from "./reservation-form";
import styles from "./bistro.module.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Le Prikkel Bistro — WebMCP-demo",
  description:
    "Reserveer online een tafel bij Le Prikkel Bistro. Een demo van declaratieve WebMCP: het reserveringsformulier is tegelijk een tool die een AI-agent kan invullen.",
  alternates: {
    canonical: "https://code-lieshout.nl/webmcp/demos/bistro",
  },
  openGraph: {
    title: "Le Prikkel Bistro — WebMCP-demo",
    description:
      "Een reserveringsformulier dat tegelijk een tool is voor AI-agents. Declaratieve WebMCP in de praktijk.",
    url: "https://code-lieshout.nl/webmcp/demos/bistro",
    type: "website",
  },
};

/** Le Prikkel Bistro — Nederlandse kloon van de french-bistro-demo van
 *  Google Chrome Labs (Apache-2.0), omgekleurd naar de groenschaal uit
 *  kleuren.txt. Eerste bewoner van app/webmcp/demos/; volgende demo's
 *  krijgen hier een eigen map naast.
 *
 *  Het punt van de demo: het formulier in <ReservationForm /> draagt de
 *  attributen `toolname`, `tooldescription` en `toolparamdescription`. Dat
 *  is alles wat er nodig is om het voor een AI-agent tot een bruikbare tool
 *  te maken — geen aparte API, geen tweede implementatie. De polyfill in
 *  public/vendor/ levert `document.modelContext` in browsers waar WebMCP
 *  nog niet ingebouwd is; in een browser die het wél heeft, doet hij niets.
 */
export default function LePrikkelBistroPage() {
  return (
    <div className={`${playfair.variable} ${styles.page}`}>
      <Script src="/vendor/webmcp-polyfill.js" strategy="afterInteractive" />
      <ReservationForm />
      <BistroAssistant />
    </div>
  );
}
