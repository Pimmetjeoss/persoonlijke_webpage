'use client'

import { useState } from 'react'
import { StickyFooter } from '@/app/components/sticky-footer'

function index() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set([0]))

  const revealSection = (section: number) => {
    setVisibleSections(prev => new Set([...prev, section]))
  }

  return (
    <>
      <section className='relative w-full min-h-screen bg-black'>
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className='absolute inset-0 w-full h-full object-cover opacity-10'
        >
          <source
            src='https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4'
            type='video/mp4'
          />
        </video>

        {/* Text content */}
        <div className='relative z-10 flex items-center justify-center min-h-screen px-8 py-20'>
          <div className='max-w-4xl'>
            {/* All content in one continuous flow - render everything, blur what's not revealed */}
            <div className='text-2xl md:text-4xl leading-relaxed' style={{ willChange: 'filter', mixBlendMode: 'screen' }}>
              <span className='text-white'>Hola! ik ben </span>
              <button
                onClick={() => revealSection(1)}
                className='border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-colors'
                style={{ color: 'hsl(141.7, 76.6%, 73.1%)' }}
              >
                Pim
              </button>
              <span className={`px-4 py-2 rounded-lg transition-all duration-500 ${visibleSections.has(1) ? 'text-white/60 blur-0 bg-black/30' : 'text-white/20 blur-md pointer-events-none'}`}>
                {' '}van Lieshout. Voorstellen blijft altijd een uitdaging, maar ik waag toch een poging. In mijn werk ben ik altijd gefascineerd geweest door{' '}
              </span>
              <button
                onClick={() => revealSection(2)}
                disabled={!visibleSections.has(1)}
                className={`border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-all duration-500 ${visibleSections.has(1) ? 'blur-0' : 'blur-md pointer-events-none'}`}
                style={{ color: visibleSections.has(1) ? 'hsl(141.7, 76.6%, 73.1%)' : 'rgba(255, 255, 255, 0.2)' }}
              >
                procesoptimalisatie
              </button>
              <span className={`px-4 py-2 rounded-lg transition-all duration-500 ${visibleSections.has(2) ? 'text-white/60 blur-0 bg-black/30' : 'text-white/20 blur-md pointer-events-none'}`}>
                . Buiten het werk om ben ik het liefst creatief bezig in de breedste zin van het woord — van niets iets maken! Sinds een jaar ben ik volledig gegrepen door het{' '}
              </span>
              <button
                onClick={() => revealSection(3)}
                disabled={!visibleSections.has(2)}
                className={`border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-all duration-500 ${visibleSections.has(2) ? 'blur-0' : 'blur-md pointer-events-none'}`}
                style={{ color: visibleSections.has(2) ? 'hsl(141.7, 76.6%, 73.1%)' : 'rgba(255, 255, 255, 0.2)' }}
              >
                AI-virus
              </button>
              <span className={`px-4 py-2 rounded-lg transition-all duration-500 ${visibleSections.has(3) ? 'text-white/60 blur-0 bg-black/30' : 'text-white/20 blur-md pointer-events-none'}`}>
                . Voor mij is dit de perfecte combinatie waarin mijn passie voor procesverbetering en mijn creativiteit eindelijk volledig samenkomen. Daarom ben ik{' '}
              </span>
              <span className='text-white'>oprichter van </span>
              <button
                onClick={() => revealSection(4)}
                className='border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-colors'
                style={{ color: 'hsl(141.7, 76.6%, 73.1%)' }}
              >
                Pimplify
              </button>
              <span className={`px-4 py-2 rounded-lg transition-all duration-500 ${visibleSections.has(4) ? 'text-white/60 blur-0 bg-black/30' : 'text-white/20 blur-md pointer-events-none'}`}>
                . Met Pimplify wil ik bedrijven helpen op een persoonlijke en pragmatische manier. Omdat ik recent ben gestart, kan ik met trots zeggen dat ik innovatief en flexibel genoeg ben om de modernste technieken op het gebied van{' '}
              </span>
              <button
                onClick={() => revealSection(5)}
                disabled={!visibleSections.has(4)}
                className={`border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-all duration-500 ${visibleSections.has(4) ? 'blur-0' : 'blur-md pointer-events-none'}`}
                style={{ color: visibleSections.has(4) ? 'hsl(141.7, 76.6%, 73.1%)' : 'rgba(255, 255, 255, 0.2)' }}
              >
                AI en agents
              </button>
              <span className={`px-4 py-2 rounded-lg transition-all duration-500 ${visibleSections.has(5) ? 'text-white/60 blur-0 bg-black/30' : 'text-white/20 blur-md pointer-events-none'}`}>
                {' '}te implementeren — tegen een fractie van de prijs die traditionele consultants vragen. Functioneel ontwerp dat jij en ik allebei begrijpen. Een persoonlijke aanpak, vanuit jouw wens!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with reveal animation */}
      <div className={`relative z-50 transition-all duration-1000 ${visibleSections.has(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <StickyFooter />
      </div>
    </>
  );
}

export default index;
