'use client'

import { useState } from 'react'
import { StickyFooter } from '@/app/components/sticky-footer'
import Sketchbook, { SPREADS } from './sketchbook'

function Index() {
  const [showStory] = useState(true)

  return (
    <>
      {/* SEO content — server-side rendered, visueel verborgen */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
        }}
      >
        <h1>Pim van Lieshout — AI &amp; Webontwikkelaar in Lieshout</h1>
        <p>
          Pim van Lieshout is oprichter van Code Lieshout, een webdesign bureau in Lieshout
          (Noord-Brabant). Hij combineert procesoptimalisatie met moderne AI-technologie en bouwt
          AI-agents, web-applicaties en automatiseringen voor Nederlandse MKB-bedrijven.
          Gespecialiseerd in Next.js, React en agentic AI — pragmatisch, persoonlijk en
          op maat. Pim is bereikbaar via pim@code-lieshout.nl of 06-12419980.
        </p>
        <ul>
          <li>Pim Lieshout — oprichter Code Lieshout</li>
          <li>AI specialist en developer in Lieshout</li>
          <li>Procesoptimalisatie met AI-agents</li>
          <li>Webdesign bureau Noord-Brabant</li>
          <li>Full-stack developer (Next.js, React, TypeScript)</li>
        </ul>
      </div>

      {/* Sketchbook — het interactieve over-mij verhaal als bladerbaar schetsboek */}
      <Sketchbook />

      {/* Toegankelijke tekstversie van het verhaal (visueel subtiel onder het boek) */}
      {showStory && (
        <section
          aria-label="Het verhaal in tekst"
          style={{
            width: 'min(760px, 88vw)',
            margin: 'clamp(24px, 4vh, 48px) auto clamp(56px, 8vh, 96px)',
            fontFamily: "'Newsreader SB', Georgia, serif",
            fontSize: 'clamp(16px, 1.6vw, 19px)',
            lineHeight: 1.74,
            color: '#22301f',
          }}
        >
          <p style={{ margin: 0 }}>
            Hola! Ik ben Pim van Lieshout. Voorstellen blijft altijd een uitdaging, maar ik waag
            toch een poging. In mijn werk ben ik altijd gefascineerd geweest door procesoptimalisatie.
            Buiten het werk om ben ik het liefst creatief bezig in de breedste zin van het woord —
            van niets iets maken! Sinds een jaar ben ik volledig gegrepen door het AI-virus. Voor mij
            is dit de perfecte combinatie waarin mijn passie voor procesverbetering en mijn creativiteit
            eindelijk volledig samenkomen. Daarom ben ik oprichter van Code Lieshout. Met Code Lieshout
            wil ik bedrijven helpen op een persoonlijke en pragmatische manier — innovatief en flexibel
            genoeg om de modernste technieken op het gebied van AI en agents te implementeren, tegen een
            fractie van de prijs die traditionele consultants vragen.{' '}
            <a href='/contact' style={{ color: '#3c7a46', textDecoration: 'underline', textUnderlineOffset: 4 }}>
              Neem contact op →
            </a>
          </p>
          <p style={{ margin: '1.4em 0 0', fontSize: '0.82em', letterSpacing: '0.08em', textTransform: 'uppercase' as const, opacity: 0.55 }}>
            Blader door de spreads hierboven:{' '}
            {SPREADS.map((s) => s.title.toLowerCase()).join(' · ')}
          </p>
        </section>
      )}

      <StickyFooter />
    </>
  )
}

export default Index
