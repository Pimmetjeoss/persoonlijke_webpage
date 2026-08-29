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
    "Reserveer online een tafel bij Le Prikkel Bistro. Een demo van WebMCP Site tools: een AI-agent kan de aanvraag invullen en de bezoeker bevestigt.",
  alternates: {
    canonical: "https://code-lieshout.nl/webmcp/demos/bistro",
  },
  openGraph: {
    title: "Le Prikkel Bistro — WebMCP-demo",
    description:
      "Een reserveringsformulier dat via een WebMCP Site tool door AI-agents kan worden voorbereid.",
    url: "https://code-lieshout.nl/webmcp/demos/bistro",
    type: "website",
  },
};

/** Le Prikkel Bistro — Nederlandse kloon van de french-bistro-demo van
 *  Google Chrome Labs (Apache-2.0), omgekleurd naar de groenschaal uit
 *  kleuren.txt. Eerste bewoner van app/webmcp/demos/; volgende demo's
 *  krijgen hier een eigen map naast.
 *
 *  Het formulier in <ReservationForm /> registreert op de bovenliggende
 *  pagina een imperatieve Site tool met `document.modelContext.registerTool`.
 *  Die route wordt ondersteund door ChatGPTs ingebouwde browser. De tool en
 *  de bezoeker delen dezelfde formulier-DOM en validatie. De polyfill in
 *  public/vendor/ levert `document.modelContext` in andere browsers.
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
