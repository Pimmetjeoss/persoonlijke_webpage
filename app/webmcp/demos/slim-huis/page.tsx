import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk } from "next/font/google";
import { SlimHuis } from "./slim-huis";
import styles from "./slim-huis.module.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-slim-huis",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PrikkelThuis — WebMCP-demo",
  description:
    "Laat een AI-agent een slim-huisdashboard aanpassen aan wat er nu gebeurt. Een Nederlandse WebMCP-demo naar het smart-homevoorbeeld van Google Chrome Labs.",
  alternates: { canonical: "https://code-lieshout.nl/webmcp/demos/slim-huis" },
  openGraph: {
    title: "PrikkelThuis — WebMCP-demo",
    description: "Een slim-huisdashboard waarvan een AI-agent de relevante bedieningspanelen kan tonen en ordenen.",
    url: "https://code-lieshout.nl/webmcp/demos/slim-huis",
    type: "website",
  },
};

export default function SlimHuisPage() {
  return (
    <div className={`${spaceGrotesk.variable} ${styles.page}`}>
      <Script src="/vendor/webmcp-polyfill.js" strategy="afterInteractive" />
      <SlimHuis />
    </div>
  );
}
