"use client"

import { useRef } from "react";
import {
  BuildingIcon,
  MapPinIcon,
  PhoneIcon,
  VideoIcon,
  ExternalLinkIcon,
  BarChart2Icon,
} from "lucide-react";
import { SectionCard } from "@/app/test/components/section-card";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";
import { useTransition } from "@/app/components/transition_provider";

// Icon wrappers to match SectionCard's ComponentType<{ className?: string }>
function BuildingIconWrapped({ className }: { className?: string }) {
  return <BuildingIcon className={className} />;
}
function MapPinIconWrapped({ className }: { className?: string }) {
  return <MapPinIcon className={className} />;
}
function PhoneIconWrapped({ className }: { className?: string }) {
  return <PhoneIcon className={className} />;
}
function VideoIconWrapped({ className }: { className?: string }) {
  return <VideoIcon className={className} />;
}
function ExternalLinkIconWrapped({ className }: { className?: string }) {
  return <ExternalLinkIcon className={className} />;
}
function BarChart2IconWrapped({ className }: { className?: string }) {
  return <BarChart2Icon className={className} />;
}

export default function UnivasPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { startTransition } = useTransition();

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="UNIVAST RETAIL"
        backgroundColor="hsl(142.1 76.2% 36.3%)"
        hoverColor="hsl(141.9 69.2% 58%)"
        startExpanded={true}
      />

      <div className="mx-auto max-w-5xl p-6 lg:p-10 pt-16">

        {/* Hero sectie */}
        <TimelineContent animationNum={1} timelineRef={pageRef} once={true}>
          <div
            className="w-full rounded-xl border-[3px] p-10 md:p-16 mb-10 flex flex-col gap-6"
            style={{
              borderColor: "hsl(144.9 80.4% 10%)",
              backgroundColor: "hsl(142.1 76.2% 36.3%)",
            }}
          >
            <p
              className="text-sm font-mono uppercase tracking-widest"
              style={{ color: "hsl(141.9 69.2% 58%)" }}
            >
              Case Study
            </p>
            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85]"
              style={{ color: "hsl(138.5 76.5% 96.7%)" }}
            >
              UNIVAST<br />RETAIL
            </h1>
            <p
              className="text-xl md:text-2xl max-w-2xl"
              style={{ color: "hsl(141.7 76.6% 73.1%)" }}
            >
              Van data naar deal — AI-tools voor de scherpste retailvastgoedmakelaar van Den Bosch.
            </p>
            <div className="flex gap-4 mt-2 flex-wrap">
              <span
                className="px-4 py-1 rounded-full border-2 text-sm font-mono"
                style={{
                  borderColor: "hsl(141.7 76.6% 73.1%)",
                  color: "hsl(141.7 76.6% 73.1%)",
                }}
              >
                Vestigingsplaatsanalyse
              </span>
              <span
                className="px-4 py-1 rounded-full border-2 text-sm font-mono"
                style={{
                  borderColor: "hsl(141.7 76.6% 73.1%)",
                  color: "hsl(141.7 76.6% 73.1%)",
                }}
              >
                AI Bel-agent
              </span>
              <span
                className="px-4 py-1 rounded-full border-2 text-sm font-mono"
                style={{
                  borderColor: "hsl(141.7 76.6% 73.1%)",
                  color: "hsl(141.7 76.6% 73.1%)",
                }}
              >
                Remotion Video
              </span>
            </div>
          </div>
        </TimelineContent>

        {/* Wie is Univast */}
        <TimelineContent animationNum={2} timelineRef={pageRef} once={true}>
          <SectionCard
            id="wie-is-univast"
            title="Wie is Univast Retail?"
            description="Een onafhankelijk makelaarskantoor, gespecialiseerd in winkelvastgoed op A-locaties."
            Icon={BuildingIconWrapped}
          >
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                Univast Retail is opgericht in 2010 en heeft sindsdien een sterke positie opgebouwd
                in de markt voor retailvastgoed op toplocaties door heel Nederland. Vanuit hun
                kantoor in <strong>&#39;s-Hertogenbosch (Den Bosch)</strong> bedienen zij zowel retailers als
                vastgoedeigenaren die actief zijn op de A-locaties van Nederlandse winkelstraten.
              </p>
              <p>
                Het winkellandschap veranderde ingrijpend door de opkomst van e-commerce, teruglopende
                omzetten in fysieke winkels en golven van faillissementen. Univast zag in deze transitie
                ook kansen: door dagelijks in de winkelstraten aanwezig te zijn en een breed netwerk van
                marktpartijen te onderhouden, bouwen zij aan een unieke marktkennis die hun klanten direct
                ten goede komt.
              </p>
              <p>
                Hun diensten omvatten <strong>aanhuur en verhuur</strong> van winkelvastgoed,
                <strong> koop en verkoop</strong> van beleggingspanden, <strong>heronderhandeling</strong>
                {" "}van huurovereenkomsten en <strong>commercieel beheer</strong> namens opdrachtgevers.
                Een compact maar slagvaardig kantoor met diepe marktkennis.
              </p>
            </div>
          </SectionCard>
        </TimelineContent>

        {/* Locatie & Markt */}
        <TimelineContent animationNum={3} timelineRef={pageRef} once={true}>
          <SectionCard
            id="locatie-markt"
            title="Retail op A-locaties"
            description="Waar elke vierkante meter telt — Univast kent de Nederlandse winkelstraat als geen ander."
            Icon={MapPinIconWrapped}
            className="mt-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              <div
                className="rounded-xl p-6 border-2"
                style={{
                  borderColor: "hsl(142.1 76.2% 36.3%)",
                  backgroundColor: "hsl(140.6 84.2% 92.5%)",
                }}
              >
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: "hsl(142.1 76.2% 36.3%)" }}
                >
                  2010
                </div>
                <div className="text-gray-600 text-sm">Opgericht in Den Bosch</div>
              </div>
              <div
                className="rounded-xl p-6 border-2"
                style={{
                  borderColor: "hsl(142.1 76.2% 36.3%)",
                  backgroundColor: "hsl(140.6 84.2% 92.5%)",
                }}
              >
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: "hsl(142.1 76.2% 36.3%)" }}
                >
                  A-loc
                </div>
                <div className="text-gray-600 text-sm">Alleen toppositie winkelstraten</div>
              </div>
              <div
                className="rounded-xl p-6 border-2"
                style={{
                  borderColor: "hsl(142.1 76.2% 36.3%)",
                  backgroundColor: "hsl(140.6 84.2% 92.5%)",
                }}
              >
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: "hsl(142.1 76.2% 36.3%)" }}
                >
                  4 diensten
                </div>
                <div className="text-gray-600 text-sm">Aanhuur, verhuur, koop, beheer</div>
              </div>
            </div>
          </SectionCard>
        </TimelineContent>

        {/* De samenwerking */}
        <TimelineContent animationNum={4} timelineRef={pageRef} once={true}>
          <SectionCard
            id="samenwerking"
            title="De samenwerking"
            description="Drie AI-gedreven tools gebouwd door Code Lieshout voor Univast Retail."
            Icon={PhoneIconWrapped}
            className="mt-8"
          >
            <div className="space-y-8 mt-2">
              {/* Tool 1 */}
              <div
                className="rounded-xl border-2 p-6"
                style={{
                  borderColor: "hsl(142.1 76.2% 36.3%)",
                  backgroundColor: "hsl(140.6 84.2% 92.5%)",
                }}
              >
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: "hsl(144.9 80.4% 10%)" }}
                >
                  🗺️ Vestigingsplaatsanalyse Tool
                </h3>
                <p className="text-gray-700 text-base">
                  Een op maat gemaakte analysetool die retailers en vastgoedeigenaren helpt bij het
                  beoordelen van potentiële winkellocaties. De tool combineert passantendata,
                  demografische gegevens en concurrentieanalyse tot een overzichtelijk rapport.
                  Univast kan hiermee sneller en beter onderbouwd adviseren — en zet zich daarmee
                  duidelijk apart van traditionele makelaars.
                </p>
              </div>

              {/* Tool 2 */}
              <div
                className="rounded-xl border-2 p-6"
                style={{
                  borderColor: "hsl(142.1 76.2% 36.3%)",
                  backgroundColor: "hsl(140.6 84.2% 92.5%)",
                }}
              >
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: "hsl(144.9 80.4% 10%)" }}
                >
                  📞 ElevenLabs Bel-agent
                </h3>
                <p className="text-gray-700 text-base">
                  Een AI-gestuurde telefoonagent op basis van ElevenLabs, die namens Univast
                  outbound calls kan voeren naar potentiële huurders of verkopers. De agent klinkt
                  natuurlijk, past zijn toonzetting aan op de gesprekspartner en kwalificeert leads
                  volledig automatisch — zodat het team van Univast hun tijd kan steken in wat écht
                  telt: de deal sluiten.
                </p>
              </div>

              {/* Tool 3 */}
              <div
                className="rounded-xl border-2 p-6"
                style={{
                  borderColor: "hsl(142.1 76.2% 36.3%)",
                  backgroundColor: "hsl(140.6 84.2% 92.5%)",
                }}
              >
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: "hsl(144.9 80.4% 10%)" }}
                >
                  🎬 Remotion Locatievideo
                </h3>
                <p className="text-gray-700 text-base">
                  Met Remotion — een React-gebaseerde video engine — maakt Code Lieshout
                  professionele locatievideos die automatisch gegenereerd worden op basis van
                  vastgoeddata. De eerste video toont de <strong>Helftheuvelpassage 98</strong> in
                  Den Bosch en laat zien hoe data en design samenkomen in een wervende
                  presentatie die direct inzetbaar is voor marketing en acquisitie.
                </p>
              </div>
            </div>
          </SectionCard>
        </TimelineContent>

        {/* Locatieanalyse: Helftheuvelpassage 98 */}
        <TimelineContent animationNum={5} timelineRef={pageRef} once={true}>
          <SectionCard
            id="locatieanalyse"
            title="Locatieanalyse: Helftheuvelpassage 98"
            description="Data-gedreven analyse van passanten, locatiefactoren en verhuurkansen voor Den Bosch."
            Icon={BarChart2IconWrapped}
            className="mt-8"
          >
            {/* Locatiefactoren */}
            <div className="space-y-3 mt-2 mb-8">
              <h3 className="text-xl font-bold" style={{ color: "hsl(144.9 80.4% 10%)" }}>📊 Locatiefactoren</h3>
              <div className="space-y-3">
                {[
                  {
                    title: "80+ winkels onder één dak",
                    desc: "De Helftheuvelpassage is het grootste overdekte winkelcentrum van 's-Hertogenbosch en de omliggende regio. Volledig weerbestendig — 365 dagen per jaar bereikbaar.",
                  },
                  {
                    title: "Sterke huurbasis & bewezen formules",
                    desc: "Ankers als supermarkten, mode- en sportretail zorgen voor vaste publieksstromen. Huurprijzen in het centrum liggen rond €280–€415/m²/jaar, afhankelijk van unit en zichtbaarheid.",
                  },
                  {
                    title: "Verzorgingsgebied: >150.000 inwoners",
                    desc: "Den Bosch fungeert als regionaal koopcentrum voor de Bommelerwaard, Maasland en Meierij. Primair verzorgingsgebied omvat ruim 150.000 inwoners met goede OV- en auto-ontsluiting.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 border-2"
                    style={{
                      borderColor: "hsl(142.1 76.2% 36.3%)",
                      backgroundColor: "hsl(140.6 84.2% 92.5%)",
                    }}
                  >
                    <div className="font-bold text-base mb-1" style={{ color: "hsl(144.9 80.4% 10%)" }}>{item.title}</div>
                    <div className="text-gray-700 text-sm">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Passantendata */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4" style={{ color: "hsl(144.9 80.4% 10%)" }}>🚶 Passantendata</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { value: "~18.000", label: "BEZOEKERS / WEEK\n(schoolweken)" },
                  { value: "vr/za", label: "PIEKMOMENTEN\n(koopavond & zaterdag)" },
                  { value: "B+", label: "LOCATIEKLASSE\n(inpandig / overdekt)" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 text-center"
                    style={{ backgroundColor: "hsl(144.9 80.4% 10%)" }}
                  >
                    <div
                      className="text-2xl font-bold mb-2"
                      style={{ color: "hsl(141.9 69.2% 58%)" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs font-mono uppercase"
                      style={{ color: "hsl(141.7 76.6% 73.1%)", whiteSpace: "pre-line" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-sm">
                <strong>Profiel bezoeker:</strong> Breed publiek — gezinnen, jongeren en senioren — met een sterke mix van boodschappen en recreatief winkelen. Gemiddelde verblijfsduur in overdekte passages ligt 20–35% hoger dan in open winkelstraten. Unit 98 profiteert van centraal gelegen routing binnen het complex.
              </p>
              <p className="text-gray-400 text-xs mt-2 italic">
                * Indicatieve data op basis van publiek beschikbare CBS- en retailbenchmarkgegevens.
              </p>
            </div>

            {/* Verhuurkansen */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: "hsl(144.9 80.4% 10%)" }}>💼 Kansen nieuwe huurder</h3>
              <div className="space-y-3">
                {[
                  {
                    category: "Food & Beleving",
                    badge: "HOGE KANS",
                    badgeColor: "hsl(142.1 70.6% 45.3%)",
                    desc: "Snacks, smoothies, coffee-to-go of een kleine lunchbar passen perfect bij de bezoekersfrequentie en verblijfsduur. Bestaande horecahuurders trekken door kruisverkoop extra conversie.",
                  },
                  {
                    category: "Lifestyle & Personal Care",
                    badge: "HOGE KANS",
                    badgeColor: "hsl(142.1 70.6% 45.3%)",
                    desc: "Beautyretail, parfumerie, accessoires en wellness-concepten groeien in binnenstedelijke passages. Passanten besteden meer impulsief aan personal care dan aan mode.",
                  },
                  {
                    category: "Conceptstore / Pop-up",
                    badge: "GROEIEND",
                    badgeColor: "hsl(142.4 71.8% 29.2%)",
                    desc: "Kortlopende verhuur aan digitale merken die offline willen testen (D2C) of seizoensconcepten. Lagere drempel, snel gevuld — en levert waardevolle data op over klantgedrag.",
                  },
                  {
                    category: "Dienstverlening / Zorg",
                    badge: "STABIEL",
                    badgeColor: "hsl(143.8 61.2% 20.2%)",
                    desc: "Fysiotherapie, optiek, hoortoestelzaak of andere paramedische dienstverlening zorgt voor vaste klantenstroom onafhankelijk van consumentensentiment. Bewezen ankerfunctie binnen passages.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 border-2"
                    style={{
                      borderColor: "hsl(142.1 76.2% 36.3%)",
                      backgroundColor: "hsl(140.6 84.2% 92.5%)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-base" style={{ color: "hsl(144.9 80.4% 10%)" }}>{item.category}</div>
                      <span
                        className="text-xs font-mono px-2 py-1 rounded text-white"
                        style={{ backgroundColor: item.badgeColor }}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-gray-700 text-sm">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </TimelineContent>

        {/* Video sectie */}
        <TimelineContent animationNum={6} timelineRef={pageRef} once={true}>
          <SectionCard
            id="video"
            title="Helftheuvelpassage 98"
            description="Remotion locatievideo — automatisch gegenereerd, professioneel resultaat."
            Icon={VideoIconWrapped}
            className="mt-8"
          >
            <div className="mt-4 rounded-xl overflow-hidden border-2" style={{ borderColor: "hsl(142.1 76.2% 36.3%)" }}>
              <video
                src="/univast-helft.mp4"
                controls
                className="w-full"
                style={{ display: "block" }}
              >
                Je browser ondersteunt geen video. Probeer een andere browser.
              </video>
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              Locatievideo voor Helftheuvelpassage 98, Den Bosch — gegenereerd met Remotion op basis van vastgoeddata.
            </p>
          </SectionCard>
        </TimelineContent>

        {/* Afsluiting */}
        <TimelineContent animationNum={7} timelineRef={pageRef} once={true}>
          <div
            className="w-full rounded-xl border-[3px] p-10 md:p-14 mt-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{
              borderColor: "hsl(144.9 80.4% 10%)",
              backgroundColor: "hsl(144.9 80.4% 10%)",
            }}
          >
            <div>
              <p
                className="text-sm font-mono uppercase tracking-widest mb-3"
                style={{ color: "hsl(141.9 69.2% 58%)" }}
              >
                Meer weten?
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: "hsl(138.5 76.5% 96.7%)" }}
              >
                Bezoek Univast Retail
              </h2>
              <p style={{ color: "hsl(141.7 76.6% 73.1%)" }} className="text-lg max-w-md">
                Univast Retail — onafhankelijk makelaarskantoor gespecialiseerd in winkelvastgoed
                op A-locaties in Nederland, gevestigd in &#39;s-Hertogenbosch.
              </p>
            </div>
            <div className="flex flex-col gap-4 flex-shrink-0">
              <a
                href="https://www.univast.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "hsl(142.1 76.2% 36.3%)",
                  color: "hsl(138.5 76.5% 96.7%)",
                }}
              >
                <ExternalLinkIconWrapped className="w-5 h-5" />
                univast.eu
              </a>
              <button
                onClick={() => startTransition("/")}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 border-2"
                style={{
                  borderColor: "hsl(141.9 69.2% 58%)",
                  color: "hsl(141.9 69.2% 58%)",
                  backgroundColor: "transparent",
                }}
              >
                ← Terug naar portfolio
              </button>
            </div>
          </div>
        </TimelineContent>

      </div>
      <StickyFooter />
    </div>
  );
}
