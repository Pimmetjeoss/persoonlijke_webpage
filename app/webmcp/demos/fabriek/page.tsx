import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk } from "next/font/google";
import { FactoryAssistant } from "./factory-assistant";
import { PrikkelFabriek } from "./prikkelfabriek";
import styles from "./fabriek.module.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-factory",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PrikkelFabriek — WebMCP-demo",
  description:
    "Laat een AI-agent een elektromotor bouwen in PrikkelFabriek. Vijftien WebMCP-tools combineren machinebediening met recepten en productieprotocollen.",
  alternates: {
    canonical: "https://code-lieshout.nl/webmcp/demos/fabriek",
  },
  openGraph: {
    title: "PrikkelFabriek — WebMCP-demo",
    description:
      "Een interactieve fabriek waarin een AI-agent met WebMCP-tools grondstoffen delft, machines bedient en werkinstructies volgt.",
    url: "https://code-lieshout.nl/webmcp/demos/fabriek",
    type: "website",
  },
};

export default function PrikkelFabriekPage() {
  return (
    <div className={`${spaceGrotesk.variable} ${styles.page}`}>
      <Script src="/vendor/webmcp-polyfill.js" strategy="afterInteractive" />
      <PrikkelFabriek />
      <FactoryAssistant />
    </div>
  );
}
