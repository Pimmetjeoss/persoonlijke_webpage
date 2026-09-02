import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CopyPromptButton } from "./copy-prompt-button";
import { SmoothScroll } from "./smooth-scroll";
import styles from "./webmcp.module.css";

export const metadata: Metadata = {
  title: "Wat is WebMCP? — Uitleg voor iedereen",
  description:
    "WebMCP in gewone mensentaal: wat het is, hoe het werkt en wat je ermee kunt. Een uitleg in de stijl van een gebruiksaanwijzing — geen voorkennis nodig.",
  alternates: {
    canonical: "https://code-lieshout.nl/webmcp",
    types: {
      "text/markdown": "https://code-lieshout.nl/webmcp.md",
    },
  },
  openGraph: {
    title: "Wat is WebMCP? — Uitleg voor iedereen",
    description:
      "WebMCP in gewone mensentaal: wat het is, hoe het werkt en wat je ermee kunt. Geen voorkennis nodig.",
    url: "https://code-lieshout.nl/webmcp",
    type: "website",
  },
};

const IMAGES = "/webmcp/images";

/** Pijl-naar-rechts, identiek in de hero-CTA, beide tekstkaarten en de CTA-band. */
function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8h11M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Plus-teken in de ronde FAQ-knop. */
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const STEPS = [
  {
    kicker: "STAP 1 VAN 4",
    number: "1",
    title: "Jij stelt je vraag",
    body: "Je typt in je AI-assistent wat je wilt. Bijvoorbeeld: “zoek een trainingspak voor mijn zoon” of “check of mijn pakket al onderweg is”. Meer hoef jij niet te doen.",
    figure: (
      <Image
        src={`${IMAGES}/webmcp-stap-1-vraag.jpg`}
        alt="Persoon met handleiding en gereedschap die zich afvraagt hoe de onderdelen in elkaar passen"
        width={448}
        height={251}
      />
    ),
  },
  {
    kicker: "STAP 2 VAN 4",
    number: "2",
    title: "De assistent leest de handleiding",
    body: "De website biedt van zichzelf een lijstje aan: “ik kan zoeken, ik kan reserveren, ik kan status tonen”. De assistent leest wat er mogelijk is — zonder te gokken.",
    figure: (
      <Image
        src={`${IMAGES}/webmcp-stap-2-handleiding.jpg`}
        alt="Persoon die met een handleiding in de hand telefonisch hulp krijgt bij het monteren"
        width={487}
        height={281}
      />
    ),
  },
  {
    kicker: "STAP 3 VAN 4",
    number: "3",
    title: "De assistent kiest de juiste handeling",
    body: "In plaats van te zoeken naar een knopje, roept de assistent de officiële functie aan die de website zelf heeft aangegeven. Net als: “pak schroef B voor gat B”. Precies goed, elke keer.",
    figure: (
      <svg viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <rect x="14" y="20" width="52" height="28" rx="8" stroke="var(--color-ink-black)" strokeWidth="3" />
        <line x1="26" y1="34" x2="48" y2="34" stroke="var(--color-ink-black)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M62 34l24 24m0 0 3-10m-3 10-10-3"
          stroke="var(--color-ink-black)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="84" cy="18" r="8" stroke="var(--color-ikea-yellow)" strokeWidth="4" />
      </svg>
    ),
  },
  {
    kicker: "STAP 4 VAN 4",
    number: "4",
    title: "Jij geeft toestemming en ziet resultaat",
    body: "De handeling gebeurt in jouw browser, met jouw account en jouw toestemming. Je ziet precies wat er gebeurt — en bevestigt zelf. Zo behoud jij de controle.",
    figure: (
      <svg viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <circle cx="48" cy="36" r="26" stroke="var(--color-ink-black)" strokeWidth="3" />
        <path
          d="m36 36 8 8 16-18"
          stroke="var(--color-ikea-yellow)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/** De drie categorieën waarin het gebruik van WebMCP in de praktijk uiteenvalt.
 *  Bewust in mensentaal: geen functienamen, geen code — die horen op een
 *  pagina voor website-eigenaren, niet in een instructie "voor iedereen". */
const CATEGORIEEN = [
  {
    kicker: "CATEGORIE 1 VAN 3",
    title: "Aankopen doen",
    voorbeeld:
      "Boodschappen voor een kinderfeestje, verdeeld over drie winkels. Of gewoon die kaasstengels van vorige maand opnieuw bestellen — waarvan je het merk niet meer weet.",
    hoe: "De assistent zoekt de producten op bij elke winkel, vergelijkt de prijzen en legt ze klaar in een mandje of verlanglijst. Jij klikt niet door twintig categorieën; jij bekijkt de lijst en rekent af.",
  },
  {
    kicker: "CATEGORIE 2 VAN 3",
    title: "Formulieren invullen",
    voorbeeld:
      "Een garantieclaim voor een televisie die niet meer aangaat. Een offerte bij een cateraar voor honderd gasten. De uren van deze week doorgeven. Of een tweedehands auto zoeken met zeven zitplaatsen.",
    hoe: "De website biedt het formulier zelf aan als functie, met uitleg per veld. De assistent hoeft niet te zoeken wáár het formulier staat en gokt niet welk hokje waarvoor is: hij vult in wat jij verteld hebt, en jij drukt op verzenden.",
  },
  {
    kicker: "CATEGORIE 3 VAN 3",
    title: "Zoeken en filteren",
    voorbeeld:
      "Een huurappartement met drie slaapkamers en een vaatwasser, op tien minuten lopen van het station. Of een hotel in Berlijn onder de 300 euro, met zwembad en ontbijt.",
    hoe: "De site geeft zijn filters door zoals ze zijn. Eén vraag in gewone taal wordt in één keer omgezet naar alle filters tegelijk, in plaats van dat jij twaalf schuifjes op de goede stand zet.",
  },
];

/** Proeftuin-band: sites die hun functies nu al als WebMCP-tools aanbieden.
 *  Nieuwe demo toevoegen = één object erbij; de grid vult zichzelf.
 *  `href` extern (https://) opent in een nieuw tabblad, intern via <Link>.
 *  De externe demo's komen uit GoogleChromeLabs/webmcp-tools; de bistro,
 *  CinePrikkel en PrikkelFabriek zijn onze eigen Nederlandse demo's en staan
 *  onder /webmcp/demos/. */
const PROEFTUIN = [
  {
    kicker: "EIGEN SITE",
    title: "Deze website zelf",
    body:
      "Code Lieshout meldt vier functies aan: een agent-scan van een website, de pagina-inhoud als platte tekst, een overzicht van alle secties en de contactgegevens.",
    prompt:
      "Open https://code-lieshout.nl in je ingebouwde browser en gebruik de Site tools van de pagina om de site op agent-readiness te scannen. Vat de uitkomst voor me samen.",
    href: "/",
    linkLabel: "Open de startpagina",
  },
  {
    kicker: "WEBSHOP",
    title: "Sportwinkel",
    body:
      "Een winkel die zoeken, filteren en het winkelmandje als losse functies aanbiedt. De assistent klikt niet — hij gebruikt de knoppen die de site zelf aanreikt.",
    prompt:
      "Open https://googlechromelabs.github.io/webmcp-tools/demos/sport-shop-angular/ in je ingebouwde browser en zoek met de Site tools van de pagina een hardloopschoen onder de 100 euro. Leg hem in mijn mandje.",
    href: "https://googlechromelabs.github.io/webmcp-tools/demos/sport-shop-angular/",
    linkLabel: "Open de sportwinkel",
  },
  {
    kicker: "EIGEN DEMO",
    title: "Le Prikkel Bistro",
    body:
      "Een reserveringsformulier dat tegelijk een functie is. De assistent vult naam, datum, tijd en tafelvoorkeur in; jij ziet wat hij invulde en drukt zelf op bevestigen. Vult hij iets fout in, dan krijgt hij de foutmelding per veld terug.",
    prompt:
      "Open https://code-lieshout.nl/webmcp/demos/bistro in je ingebouwde browser en reserveer met de Site tools van de pagina een tafel voor twee personen, vrijdagavond om half acht.",
    href: "/webmcp/demos/bistro",
    linkLabel: "Open de bistro",
  },
  {
    kicker: "EIGEN DEMO",
    title: "CinePrikkel",
    body:
      "Een bioscoop in zeven Nederlandse steden. Hier is niet één formulier de functie, maar het zoeken zelf: de stad kiezen, op genre filteren en een voorstelling aanklikken zijn alle drie functies die de assistent kan gebruiken.",
    prompt:
      "Open https://code-lieshout.nl/webmcp/demos/bioscoop in je ingebouwde browser en gebruik de Site tools van de pagina: ik zit in Oss, welke thrillers draaien er? Zet er vanavond eentje klaar.",
    href: "/webmcp/demos/bioscoop",
    linkLabel: "Open de bioscoop",
  },
  {
    kicker: "EIGEN DEMO",
    title: "PrikkelFabriek",
    body:
      "Een productielijn met vijftien Site tools. De assistent bedient niet alleen mijnen en machines, maar vraagt ook recepten en productieprotocollen op om een meerstapsopdracht betrouwbaar af te maken.",
    prompt:
      "Open https://code-lieshout.nl/webmcp/demos/fabriek in je ingebouwde browser en bouw met de Site tools van de pagina een elektromotor.",
    href: "/webmcp/demos/fabriek",
    linkLabel: "Open de fabriek",
  },
  {
    kicker: "EIGEN DEMO",
    title: "PrikkelThuis",
    body:
      "Een slim-huisdashboard dat zich aanpast aan de situatie. De assistent toont en ordent alleen de bediening die je nu nodig hebt — van deurcamera en slot tot klimaat en energie.",
    prompt:
      "Open https://code-lieshout.nl/webmcp/demos/slim-huis in je ingebouwde browser en gebruik de Site tools van de pagina: er staat iemand voor de deur. Laat zien wie het is en geef me de bediening van het slot.",
    href: "/webmcp/demos/slim-huis",
    linkLabel: "Open PrikkelThuis",
  },
];

const FAQ = [
  {
    question: "Heb ik iets extra’s nodig?",
    answer:
      "WebMCP is geen apart abonnement. Voor Site tools in ChatGPT heb je momenteel wel de nieuwste desktopapp, ingeschakelde Site tools en GPT-5.6 Sol of Terra nodig. Buiten een ondersteunde agent blijft de website gewoon handmatig werken.",
  },
  {
    question: "Is dit veilig?",
    answer:
      "De afspraak is dat handelingen in jouw browser gebeuren, met jouw account en jouw toestemming. De website bepaalt zelf welke functies het aanbiedt — jij ziet wat er gaat gebeuren en bevestigt zelf. Geen verrassende klikken op de achtergrond.",
  },
  {
    question: "Vervangt WebMCP de gewone website?",
    answer:
      "Nee. De website blijft exact zoals hij is: zelfde design, zelfde knoppen, zelfde shop. WebMCP is een extra laag — de handleiding die ernaast ligt, voor wie die wil gebruiken.",
  },
  {
    question: "Wat betekent de naam eigenlijk?",
    answer:
      "Web Model Context Protocol. Vertaald: een vaste afspraak (protocol) waarmee een website zijn mogelijkheden en context uitlegt aan een AI-model (model). Of simpeler: de standaard-manier waarop websites en AI-assistenten met elkaar praten.",
  },
  {
    question: "Wat heeft PRIKKEL ermee te maken?",
    answer:
      "PRIKKEL maakt websites klaar voor dit nieuwe tijdperk — van snelheid en vindbaarheid tot WebMCP zelf. Wil je weten of jouw site er klaar voor is? Draai de gratis scan via de gele knop hierboven.",
  },
];

/** FAQPage-schema uit dezelfde bron als de zichtbare FAQ, zodat ze niet uiteen kunnen lopen. */
const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function WebmcpPage() {
  return (
    <div className={styles.page}>
      <SmoothScroll />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      {/* ===== Topnavigatie ===== */}
      <header className={styles.topnav}>
        <div className={`${styles.container} ${styles.topnavInner}`}>
          <a className={styles.brandBadge} href="#top" aria-label="PRIKKEL — naar boven">
            <Image
              src={`${IMAGES}/prikkel-logo.png`}
              alt="PRIKKEL logo"
              width={120}
              height={46}
              loading="eager"
            />
          </a>
          <nav className={styles.topnavLinks} aria-label="Paginasecties">
            <a href="#wat-is">Wat is het?</a>
            <a href="#hoe-werkt-het">Zo werkt het</a>
            <a href="#toepassingen">Toepassingen</a>
            <a href="#zelf-testen">Zelf testen</a>
            <a href="#faq">Vragen</a>
            <Link className={styles.topnavCta} href="/agent-ready">
              Gratis scan
            </Link>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ===== Handleiding-kop ===== */}
        <div className={`${styles.container} ${styles.manualStrip}`}>
          <p className={`${styles.manualStripInner} ${styles.tCaption}`} role="note">
            <span>INSTRUCTIE 1 VAN 1</span>
            <span>ONDERWERP: WEBMCP</span>
            <span>VOOR: IEDEREEN</span>
            <span>LEESTIJD: ± 4 MIN</span>
            <span>GEREEDSCHAP NODIG: GEEN</span>
          </p>
        </div>

        {/* ===== Hero: 2/3 mediakaart + 1/3 gele CTA ===== */}
        <section className={`${styles.container} ${styles.hero}`}>
          <div className={styles.heroGrid}>
            <div className={styles.mediaCard}>
              <Image
                src={`${IMAGES}/prikkel-gevel.jpg`}
                alt="Gele PRIKKEL-letters op een blauwe golfplaten gevel tegen een blauwe lucht"
                fill
                sizes="(max-width: 960px) 100vw, 62vw"
                priority
              />
              <div className={styles.mediaCardOverlay} aria-hidden="true" />
              <div className={styles.mediaCardContent}>
                <p className={styles.mediaCardKicker}>De gebruiksaanwijzing voor het moderne web</p>
                <h1 className={`${styles.mediaCardTitle} ${styles.tDisplay}`}>Wat is WebMCP?</h1>
              </div>
              <a className={styles.mediaCardControl} href="#wat-is" aria-label="Scroll naar de uitleg">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 2v11M3.5 8.5 8 13l4.5-4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div className={styles.ctaCard}>
              <div>
                <h2 className={`${styles.ctaCardTitle} ${styles.tDisplay}`}>
                  Snap het in 4{" "}stappen.
                </h2>
                <p className={styles.ctaCardNote}>
                  Geen voorkennis nodig. Geen installeren. Gewoon lezen, zoals bij een platte-pakket-handleiding.
                </p>
              </div>
              <a
                className={styles.arrowButton}
                href="#hoe-werkt-het"
                aria-label="Naar de uitleg in 4 stappen"
              >
                <ArrowRightIcon />
              </a>
            </div>
          </div>
        </section>

        {/* ===== Lees dit eerst ===== */}
        <section className={`${styles.container} ${styles.readfirst}`}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="12.5" stroke="var(--color-ink-black)" strokeWidth="2" />
            <path d="M14 8v7" stroke="var(--color-ink-black)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="14" cy="19.5" r="1.6" fill="var(--color-ink-black)" />
          </svg>
          <div>
            <h2 className={styles.readfirstTitle}>Lees dit eerst</h2>
            <p>
              WebMCP is niets dat jij hoeft te kopen, installeren of onderhouden. Het is
              een <strong>afsprakenstelsel</strong>: net zoals een USB-stekker overal in hetzelfde
              stopcontact past, legt WebMCP vast hoe websites en AI-assistenten met elkaar praten. Na
              het lezen van deze instructie begrijp je wat het is en waarom het bestaat.
            </p>
            <span className={styles.tCaption}>
              WAARSCHUWING: GEEN TECHNISCHE KENNIS VEREIST. BIJ OPHOPING VAN VRAGEN: ZIE PUNT 4
              (VEELGESTELDE VRAGEN).
            </span>
          </div>
        </section>

        {/* ===== 01 · Wat is WebMCP ===== */}
        <section className={`${styles.container} ${styles.section}`} id="wat-is">
          <header className={styles.sectionHead}>
            <span className={`${styles.sectionIndex} ${styles.tCaption}`}>01</span>
            <h2 className={styles.tDisplay}>Wat is WebMCP?</h2>
          </header>

          <div className={styles.twoCol}>
            <div className={styles.prose}>
              <p>
                Stel je voor: het internet is een enorm warenhuis. <strong>Jij</strong> loopt er rond,
                pakt dingen aan en klikt op knoppen — dat heb jij ooit geleerd.
                Een <strong>AI-assistent</strong> (zoals ChatGPT of een digitale helper in je browser) wil
                dat ook voor je doen. Maar die assistent kan niet zomaar “zien” welke knop wat doet.
              </p>
              <p>
                <strong>WebMCP</strong> is de oplossing: een vaste manier waarop een website bij
                zichzelf een <strong>gebruiksaanwijzing</strong> levert. Net zoals een IKEA-pakket een
                handleiding met stappen (“stap 3: deze schroef hoort hier”) meekrijgt, zegt een website
                met WebMCP tegen elke
                AI-assistent: <em>“Dit kan ik. Dit heb ik daarvoor nodig. Zo vraag je het aan.”</em>
              </p>
              <p>
                De volledige naam is <strong>Web Model Context Protocol</strong>. In gewone mensentaal:
                een standaardvorm waarin websites hun mogelijkheden uitleggen aan AI-modellen. Geen
                gokwerk meer, geen priegelen in de broncode — gewoon een keurige handleiding die bij het
                pakket zit.
              </p>
              <div className={styles.callout}>
                <p>
                  <strong>Goed om te weten:</strong> de website zelf blijft precies zoals hij was. WebMCP
                  is een extra laag — de handleiding <em>om</em> het meubel, niet het meubel zelf.
                </p>
              </div>
            </div>

            <div className={styles.illustrationPanel}>
              <svg
                viewBox="0 0 460 300"
                fill="none"
                role="img"
                aria-label="Schema: een AI-assistent leest de gebruiksaanwijzing van een website en kan daarmee acties uitvoeren"
              >
                {/* Browservenster */}
                <rect x="20" y="40" width="200" height="220" rx="8" stroke="var(--color-ink-black)" strokeWidth="3" />
                <line x1="20" y1="76" x2="220" y2="76" stroke="var(--color-ink-black)" strokeWidth="3" />
                <circle cx="40" cy="58" r="5" stroke="var(--color-ink-black)" strokeWidth="2.5" />
                <circle cx="58" cy="58" r="5" stroke="var(--color-ink-black)" strokeWidth="2.5" />
                <circle cx="76" cy="58" r="5" stroke="var(--color-ink-black)" strokeWidth="2.5" />
                {/* Drie 'tools' in de site */}
                <rect x="40" y="96" width="160" height="40" rx="8" stroke="var(--color-ink-black)" strokeWidth="2.5" />
                <text
                  x="52"
                  y="121"
                  fontFamily="'Noto IKEA', Inter, DM Sans, ui-sans-serif, system-ui, sans-serif"
                  fontSize="16"
                  fontWeight="700"
                  fill="var(--color-ink-black)"
                >
                  ZOEK
                </text>
                <rect x="40" y="148" width="160" height="40" rx="8" stroke="var(--color-ink-black)" strokeWidth="2.5" />
                <text
                  x="52"
                  y="173"
                  fontFamily="'Noto IKEA', Inter, DM Sans, ui-sans-serif, system-ui, sans-serif"
                  fontSize="16"
                  fontWeight="700"
                  fill="var(--color-ink-black)"
                >
                  BOEK
                </text>
                <rect x="40" y="200" width="160" height="40" rx="8" stroke="var(--color-ink-black)" strokeWidth="2.5" />
                <text
                  x="52"
                  y="225"
                  fontFamily="'Noto IKEA', Inter, DM Sans, ui-sans-serif, system-ui, sans-serif"
                  fontSize="16"
                  fontWeight="700"
                  fill="var(--color-ink-black)"
                >
                  STATUS
                </text>
                {/* Assistent */}
                <circle cx="370" cy="150" r="52" stroke="var(--color-ink-black)" strokeWidth="3" />
                <text
                  x="370"
                  y="144"
                  textAnchor="middle"
                  fontFamily="'Noto IKEA', Inter, DM Sans, ui-sans-serif, system-ui, sans-serif"
                  fontSize="20"
                  fontWeight="700"
                  fill="var(--color-ink-black)"
                >
                  AI
                </text>
                <text
                  x="370"
                  y="168"
                  textAnchor="middle"
                  fontFamily="'Noto IKEA', Inter, DM Sans, ui-sans-serif, system-ui, sans-serif"
                  fontSize="13"
                  fill="var(--color-ink-black)"
                >
                  assistent
                </text>
                <line
                  x1="330"
                  y1="118"
                  x2="370"
                  y2="80"
                  stroke="var(--color-ink-black)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  cx="374"
                  cy="76"
                  r="4"
                  fill="var(--color-ikea-yellow)"
                  stroke="var(--color-ink-black)"
                  strokeWidth="2.5"
                />
                {/* Verbinding */}
                <path
                  d="M226 120 C 272 120, 272 132, 314 132"
                  stroke="var(--color-ink-black)"
                  strokeWidth="2.5"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                />
                <path
                  d="M314 176 C 272 176, 272 188, 226 188"
                  stroke="var(--color-ink-black)"
                  strokeWidth="2.5"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                />
                <path d="m314 132 -8 -5v10z" fill="var(--color-ink-black)" />
                <path d="m226 188 8 -5v10z" fill="var(--color-ink-black)" />
                <text
                  x="270"
                  y="112"
                  textAnchor="middle"
                  fontFamily="'Noto IKEA', Inter, DM Sans, ui-sans-serif, system-ui, sans-serif"
                  fontSize="13"
                  fill="var(--color-ink-black)"
                >
                  handleiding
                </text>
                <text
                  x="270"
                  y="210"
                  textAnchor="middle"
                  fontFamily="'Noto IKEA', Inter, DM Sans, ui-sans-serif, system-ui, sans-serif"
                  fontSize="13"
                  fill="var(--color-ink-black)"
                >
                  actie
                </text>
              </svg>
            </div>
          </div>
        </section>

        {/* ===== 02 · Zo werkt het ===== */}
        <section className={`${styles.container} ${styles.section}`} id="hoe-werkt-het">
          <header className={styles.sectionHead}>
            <span className={`${styles.sectionIndex} ${styles.tCaption}`}>02</span>
            <h2 className={styles.tDisplay}>Zo werkt het</h2>
          </header>

          <div className={styles.steps}>
            {STEPS.map((step) => (
              <article className={styles.stepCard} key={step.number}>
                <span className={`${styles.tCaption} ${styles.stepCardKicker}`}>{step.kicker}</span>
                <span className={styles.stepCardNumber} aria-hidden="true">
                  {step.number}
                </span>
                <h3 className={styles.stepCardTitle}>{step.title}</h3>
                <p>{step.body}</p>
                <div className={styles.stepCardFigure}>{step.figure}</div>
              </article>
            ))}
          </div>
        </section>

        {/* ===== 03 · Waarvoor gebruik je het ===== */}
        <section className={`${styles.container} ${styles.section}`} id="toepassingen">
          <header className={styles.sectionHead}>
            <span className={`${styles.sectionIndex} ${styles.tCaption}`}>03</span>
            <h2 className={styles.tDisplay}>Waarvoor kun je het gebruiken?</h2>
          </header>

          <div className={styles.cardsGrid}>
            <article className={styles.storyCard}>
              <Image
                src={`${IMAGES}/kledingkast-chatgpt.jpg`}
                alt="Overzichtelijke inloopkast met kleding, schoenen en opberglades"
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
              />
              <div className={styles.storyCardOverlay} aria-hidden="true" />
              <div className={styles.storyCardContent}>
                <p className={styles.storyCardKicker}>CHATGPT</p>
                <h3 className={styles.storyCardTitle}>Van advies naar actie</h3>
                <p className={styles.storyCardText}>
                  Vraag om een outfit, product of reservering. Met WebMCP kan ChatGPT niet alleen
                  adviseren, maar de volgende stap ook voor je uitvoeren.
                </p>
              </div>
            </article>

            <article className={`${styles.textCard} ${styles.textCardBordered}`}>
              <p className={styles.textCardKicker}>CHATGPT &amp; WEBMCP</p>
              <h3 className={styles.textCardTitle}>ChatGPT kan nu ook acties uitvoeren</h3>
              <p>
                In de ingebouwde browser van de ChatGPT-desktopapp kan ChatGPT de functies gebruiken
                die een website via WebMCP aanbiedt. Denk aan zoeken, een winkelmand aanpassen of een
                reservering afronden.
              </p>
              <p>
                Jij geeft de opdracht. ChatGPT kiest de juiste site-tool. Voor gevoelige of
                definitieve acties blijven de normale veiligheids- en bevestigingsregels gelden.
              </p>
              <div className={styles.textCardFooter}>
                <a
                  className={styles.arrowButton}
                  href="https://learn.chatgpt.com/docs/webmcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lees de officiële OpenAI-documentatie over Site tools en WebMCP"
                >
                  <ArrowRightIcon />
                </a>
              </div>
            </article>

            <article className={styles.storyCard}>
              <Image
                src={`${IMAGES}/zweedse-gehaktballetjes.jpeg`}
                alt="Zweedse gehaktballetjes met friet, roomsaus en cranberrysaus"
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
              />
              <div className={styles.storyCardOverlay} aria-hidden="true" />
              <div className={styles.storyCardContent}>
                <p className={styles.storyCardKicker}>BESTELLEN</p>
                <h3 className={styles.storyCardTitle}>Bestellen zonder te klikken</h3>
                <p className={styles.storyCardText}>
                  Vraag je assistent om iets te zoeken en te reserveren. De website vertelt zelf welke
                  stappen er bestaan — de assistent volgt de handleiding.
                </p>
              </div>
            </article>

            <article className={`${styles.textCard} ${styles.textCardBordered}`}>
              <p className={styles.textCardKicker}>STATUS &amp; SERVICE</p>
              <h3 className={styles.textCardTitle}>Vraag het rechtstreeks aan de bron</h3>
              <p>
                Waar is mijn pakket? Is mijn afspraak gelukt? Tot hoe laat is het kantoor? In plaats van
                zoeken en scrollen haalt je assistent het antwoord op via de functies die de site zelf
                aanbiedt.
              </p>
              <p>Eén vraag, één antwoord. Geen tien tabbladen.</p>
              <div className={styles.textCardFooter}>
                <a
                  className={styles.arrowButton}
                  href="#faq"
                  aria-label="Meer weten? Naar veelgestelde vragen"
                >
                  <ArrowRightIcon />
                </a>
              </div>
            </article>

            <article className={styles.storyCard}>
              <Image
                src={`${IMAGES}/prikkel-hout.jpg`}
                alt="Gele PRIKKEL-letters met schaduw op een blauwe houten wand"
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
              />
              <div className={styles.storyCardOverlay} aria-hidden="true" />
              <div className={styles.storyCardContent}>
                <p className={styles.storyCardKicker}>INFORMATIE</p>
                <h3 className={styles.storyCardTitle}>De site legt zichzelf uit</h3>
                <p className={styles.storyCardText}>
                  Openingstijden, voorwaarden, voorraad, prijzen: met WebMCP geeft een website
                  gestructureerde informatie die een assistent meteen begrijpt.
                </p>
              </div>
            </article>

            <article className={`${styles.textCard} ${styles.textCardBordered}`}>
              <p className={styles.textCardKicker}>TERUGKERENDE TAKEN</p>
              <h3 className={styles.textCardTitle}>Elke week hetzelfde? Laat het lopen.</h3>
              <p>
                Elke maandag hetzelfde rapport, elke vrijdag dezelfde reservering. Omdat de stappen in
                een vaste handleiding staan, kan je assistent ze betrouwbaar herhalen.
              </p>
              <p>Stap 1, stap 2, stap 3 — zoals het bedoeld is.</p>
              <div className={styles.textCardFooter}>
                <a
                  className={styles.arrowButton}
                  href="#hoe-werkt-het"
                  aria-label="Zo werkt het, naar boven"
                >
                  <ArrowRightIcon />
                </a>
              </div>
            </article>
          </div>
          <p className={styles.useCasesLead}>
            Kijk je naar wat mensen hun assistent in de praktijk vragen, dan vallen die vragen in drie
            categorieën. Voor alle drie geldt hetzelfde: de site biedt zijn eigen functies aan, de
            assistent gebruikt ze.
          </p>

          <div className={styles.useCases}>
            {CATEGORIEEN.map((categorie) => (
              <article className={styles.useCase} key={categorie.title}>
                <div className={styles.useCaseLabel}>
                  <span className={`${styles.useCaseKicker} ${styles.tCaption}`}>
                    {categorie.kicker}
                  </span>
                  <h3 className={styles.useCaseTitle}>{categorie.title}</h3>
                </div>
                <dl className={styles.useCaseBody}>
                  <dt className={`${styles.useCaseTerm} ${styles.tCaption}`}>VOORBEELD</dt>
                  <dd className={styles.useCaseText}>{categorie.voorbeeld}</dd>
                  <dt className={`${styles.useCaseTerm} ${styles.tCaption}`}>HOE WEBMCP HELPT</dt>
                  <dd className={styles.useCaseText}>{categorie.hoe}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>


        {/* ===== Gele proeftuin-band: zelf testen met ChatGPT ===== */}
        <section className={styles.container} id="zelf-testen">
          <div className={styles.tryBand}>
            <div className={styles.tryBandHead}>
              <p className={`${styles.tryBandKicker} ${styles.tCaption}`}>
                PROEFTUIN · SITE TOOLS IN CHATGPT
              </p>
              <h2 className={`${styles.tryBandTitle} ${styles.tHeading}`}>
                Probeer het zelf met ChatGPT
              </h2>
              <p className={styles.tryBandIntro}>
                De sites hieronder registreren imperatieve WebMCP-tools die ChatGPT als Site tools kan
                ontdekken. Zet in de nieuwste ChatGPT-desktopapp Site tools aan en kies GPT-5.6 Sol of
                Terra. Kopieer daarna de prompt van een kaart en plak hem in het gesprek: elke prompt
                noemt de URL en vraagt ChatGPT die in de ingebouwde browser te openen. Via gewone
                websearch werkt het niet — de functies bestaan alleen in een draaiende pagina.
              </p>
            </div>

            <ul className={styles.tryGrid}>
              {PROEFTUIN.map((item) => {
                const isExtern = item.href.startsWith("http");

                return (
                  <li key={item.title} className={styles.tryCard}>
                    <p className={styles.tryCardKicker}>{item.kicker}</p>
                    <h3 className={styles.tryCardTitle}>{item.title}</h3>
                    <p className={styles.tryCardText}>{item.body}</p>
                    <div className={styles.tryCardPrompt}>
                      <CopyPromptButton
                        text={item.prompt}
                        className={styles.tryCardCopy}
                        doneClassName={styles.tryCardCopyDone}
                      />
                      <p className={styles.tryCardPromptText}>“{item.prompt}”</p>
                    </div>
                    <div className={styles.tryCardFooter}>
                      {isExtern ? (
                        <a
                          className={styles.tryCardLink}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.linkLabel}
                          <ArrowRightIcon />
                        </a>
                      ) : (
                        <Link className={styles.tryCardLink} href={item.href}>
                          {item.linkLabel}
                          <ArrowRightIcon />
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className={`${styles.tryBandNote} ${styles.tCaption}`} role="note">
              LET OP: WEBMCP IS EEN STANDAARD IN ONTWIKKELING. GEBEURT ER NIETS? DAN ONDERSTEUNT JOUW
              BROWSER OF ASSISTENT DE FUNCTIES NOG NIET — DE SITES BLIJVEN GEWOON MET DE HAND TE
              BEDIENEN.
            </p>
          </div>
        </section>

        {/* ===== Gele CTA-band ===== */}
        <section className={styles.container}>
          <div className={styles.ctaBand}>
            <div>
              <h2 className={`${styles.ctaBandTitle} ${styles.tHeading}`}>Klaar om het zelf te zien?</h2>
              <p>
                Draai de gratis Agent-Ready scan en ontdek in enkele seconden hoe agent-vriendelijk jouw
                website al is — inclusief de WebMCP-check.
              </p>
            </div>
            <Link
              className={styles.arrowButton}
              href="/agent-ready"
              aria-label="Naar de gratis Agent-Ready scan"
            >
              <ArrowRightIcon />
            </Link>
          </div>
        </section>

        {/* ===== 04 · Veelgestelde vragen ===== */}
        <section className={`${styles.container} ${styles.section}`} id="faq">
          <header className={styles.sectionHead}>
            <span className={`${styles.sectionIndex} ${styles.tCaption}`}>04</span>
            <h2 className={styles.tDisplay}>Veelgestelde vragen</h2>
          </header>

          <div className={styles.faq}>
            {FAQ.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span className={styles.faqIcon} aria-hidden="true">
                    <PlusIcon />
                  </span>
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className={`${styles.container} ${styles.footer}`}>
        <div className={styles.footerStrip}>
          <Link href="/">
            Terug naar code-lieshout.nl
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2 6h8m0 0L6.5 2.5M10 6 6.5 9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <a href="#top">
            Naar boven
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="m2 8 4-4 4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        <p className={`${styles.footerFineprint} ${styles.tCaption}`}>
          <span>PRIKKEL is een demonstratiemerk van Code Lieshout</span>
          <span>Instructie WEBMCP-NL · Versie 1.0</span>
          <span>Deze pagina is uitleg over een internetstandaard in ontwikkeling</span>
          <span>© 2026 Code Lieshout</span>
        </p>
      </footer>
    </div>
  );
}
