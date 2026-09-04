import Link from "next/link";

const privacySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://code-lieshout.nl/privacy",
  url: "https://code-lieshout.nl/privacy",
  name: "Privacyverklaring — Code Lieshout",
  description:
    "Privacyverklaring van Code Lieshout: welke persoonsgegevens worden verwerkt, met welk doel en wat jouw rechten zijn.",
  inLanguage: "nl-NL",
  datePublished: "2026-09-04",
  dateModified: "2026-09-04",
  author: { "@id": "https://code-lieshout.nl/#pim" },
  publisher: { "@id": "https://code-lieshout.nl/#business" },
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen px-6 py-16 md:py-24"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <article className="mx-auto max-w-3xl">
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "hsl(142.1 76.2% 36.3%)" }}
        >
          Privacy
        </p>
        <h1
          className="mt-4 text-4xl md:text-6xl font-bold tracking-tight"
          style={{ color: "hsl(144.9 80.4% 10%)" }}
        >
          Privacyverklaring Code Lieshout
        </h1>
        <p
          className="mt-4 text-base"
          style={{ color: "hsl(143.8 61.2% 20.2%)" }}
        >
          Laatst bijgewerkt: 4 september 2026. Kort samengevat: deze site verzamelt
          zo min mogelijk gegevens, verkoopt niets door en plaatst alleen
          analytische cookies als je daar toestemming voor geeft.
        </p>

        <div
          className="mt-8 space-y-6 rounded-xl border-[3px] bg-white p-8 md:p-10 text-lg leading-relaxed"
          style={{ borderColor: "hsl(144.9 80.4% 10%)", color: "hsl(144.9 80.4% 10%)" }}
        >
          <section>
            <h2 className="text-2xl font-bold">1. Wie is verantwoordelijk?</h2>
            <p className="mt-2">
              Code Lieshout, Eventer 17, 5351 SK Berghem (KvK 99344882) is
              verwerkingsverantwoordelijke voor de gegevens op deze website.
              Vragen over privacy? Mail naar{" "}
              <a className="underline" href="mailto:pim@code-lieshout.nl">
                pim@code-lieshout.nl
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">2. Welke gegevens verwerken we?</h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>
                <strong>Contactgegevens die je zelf stuurt</strong> (naam, e-mailadres,
                telefoonnummer) wanneer je mailt of belt voor een aanvraag.
              </li>
              <li>
                <strong>Technische loggegevens</strong> van de hostingpartij (Vercel),
                zoals IP-adres en bezochte pagina&apos;s, voor beveiliging en storinganalyse.
              </li>
              <li>
                <strong>Analytische gegevens</strong> via Google Analytics en Microsoft
                Clarity — alleen als je via de cookiebanner toestemming geeft.
              </li>
            </ul>
            <p className="mt-2">
              Deze site heeft geen contactformulier en geen accounts: er wordt niets
              opgeslagen wat je niet zelf actief verstuurt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">3. Waarvoor gebruiken we ze?</h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Reageren op aanvragen en offertes (grondslag: overeenkomst/voorbereiding).</li>
              <li>Beveiligen en verbeteren van de website (grondslag: gerechtvaardigd belang).</li>
              <li>Anonieme statistiek over bezoek (grondslag: toestemming via cookiebanner).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">4. Delen met derden</h2>
            <p className="mt-2">
              We verkopen je gegevens nooit. Verwerkers die we inschakelen zijn de
              hostingpartij (Vercel), Google Analytics en Microsoft Clarity — elk met
              een eigen privacybeleid en alleen voor zover nodig voor bovenstaande doelen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">5. Bewaartermijnen</h2>
            <p className="mt-2">
              E-mails over aanvragen bewaren we maximaal 2 jaar. Analytische gegevens
              worden maximaal 14 maanden bewaard. Technische logs worden automatisch
              geroteerd door de hostingpartij.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">6. Jouw rechten</h2>
            <p className="mt-2">
              Je hebt recht op inzage, correctie, verwijdering, beperking, overdraagbaarheid
              en bezwaar (AVG). Mail je verzoek naar{" "}
              <a className="underline" href="mailto:pim@code-lieshout.nl">
                pim@code-lieshout.nl
              </a>{" "}
              — je krijgt binnen één maand reactie. Klagen kan bij de Autoriteit
              Persoonsgegevens.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">7. Cookies</h2>
            <p className="mt-2">
              Functionele opslag (zoals je cookiekeuze) is noodzakelijk. Analytische
              cookies (Google Analytics, Clarity) worden alleen geplaatst na toestemming
              via de cookiebanner; je kunt je keuze daar altijd aanpassen door de
              opgeslagen voorkeur te wissen.
            </p>
          </section>
        </div>

        <nav aria-label="Privacy-navigatie" className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-full border-2 bg-white px-5 py-2 font-medium"
            style={{ borderColor: "hsl(144.9 80.4% 10%)", color: "hsl(144.9 80.4% 10%)" }}
          >
            Contact
          </Link>
          <Link
            href="/faq"
            className="rounded-full border-2 bg-white px-5 py-2 font-medium"
            style={{ borderColor: "hsl(144.9 80.4% 10%)", color: "hsl(144.9 80.4% 10%)" }}
          >
            FAQ
          </Link>
        </nav>
      </article>
    </div>
  );
}
