import type { Metadata } from "next";
import Script from "next/script";
import { Be_Vietnam_Pro } from "next/font/google";
import { CinemaAssistant } from "./cinema-assistant";
import { CinePrikkel } from "./cineprikkel";
import styles from "./bioscoop.module.css";

const vietnam = Be_Vietnam_Pro({
  variable: "--font-vietnam",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CinePrikkel — WebMCP-demo",
  description:
    "Kies een stad, een genre en een voorstelling bij CinePrikkel. Een demo van imperatieve WebMCP: de filters en de kaartverkoop zijn functies die een AI-agent kan aanroepen.",
  alternates: {
    canonical: "https://code-lieshout.nl/webmcp/demos/bioscoop",
  },
  openGraph: {
    title: "CinePrikkel — WebMCP-demo",
    description:
      "Een bioscoop waarvan het zoeken, filteren en kaartjes kiezen ook functies zijn voor AI-agents. Imperatieve WebMCP in de praktijk.",
    url: "https://code-lieshout.nl/webmcp/demos/bioscoop",
    type: "website",
  },
};

/** CinePrikkel — Nederlandse kloon van de ticket-booking-demo van Google
 *  Chrome Labs (Apache-2.0). Tweede bewoner van app/webmcp/demos/, naast de
 *  bistro.
 *
 *  De bistro en deze bioscoop registreren allebei imperatieve Site tools met
 *  `document.modelContext.registerTool`, de route die ChatGPTs ingebouwde
 *  browser ondersteunt. Hier zijn een genrefilter, een stadskeuze en het
 *  aanklikken van een voorstelling afzonderlijke tools.
 *
 *  Vernederlandst ten opzichte van het origineel: zeven Nederlandse steden
 *  (met Oss), alle tijden in 24-uursnotatie en de hele interface in het
 *  Nederlands. Filmtitels en genres bleven Engels, zoals ze op een poster
 *  in een Nederlandse bioscoop ook staan.
 *
 *  De polyfill in public/vendor/ levert `document.modelContext` in browsers
 *  waar WebMCP nog niet ingebouwd is; in een browser die het wél heeft, doet
 *  hij niets.
 */
export default function CinePrikkelPage() {
  return (
    // .page draagt de kleurtokens en het lettertype; de demo en de assistent
    // hangen er allebei onder.
    <div className={`${vietnam.variable} ${styles.page}`}>
      <Script src="/vendor/webmcp-polyfill.js" strategy="afterInteractive" />
      <CinePrikkel />
      <CinemaAssistant />
    </div>
  );
}
