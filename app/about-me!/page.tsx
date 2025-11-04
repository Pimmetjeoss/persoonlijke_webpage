'use client'

import { useState } from 'react'

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
            {/* All content in one continuous flow */}
            <div className='text-2xl md:text-4xl leading-relaxed'>
              {/* Section 0 - Always visible */}
              <span className='text-white transition-all duration-500'>
                Hola! ik ben{' '}
                <button
                  onClick={() => revealSection(1)}
                  className='border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-colors'
                >
                  Pim
                </button>
                {visibleSections.has(1) && <span className='text-white/60'> van Lieshout. Voorstellen blijft altijd een uitdaging, maar ik waag toch een poging. In mijn werk ben ik altijd gefascineerd geweest door{' '}
                  <button
                    onClick={() => revealSection(2)}
                    disabled={!visibleSections.has(1)}
                    className='border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-colors text-white'
                  >
                    procesoptimalisatie
                  </button>.</span>}
              </span>

              {/* Section 2 */}
              <span className={`transition-all duration-500 ${visibleSections.has(2) ? 'text-white/60 blur-0' : 'text-white/20 blur-md pointer-events-none'}`}>
                {' '}Buiten het werk om ben ik het liefst creatief bezig in de breedste zin van het woord — van niets iets maken! Sinds een jaar ben ik volledig gegrepen door het{' '}
                <button
                  onClick={() => revealSection(3)}
                  disabled={!visibleSections.has(2)}
                  className='border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-colors text-white'
                >
                  AI-virus
                </button>.
              </span>

              {/* Section 3 */}
              <span className={`transition-all duration-500 ${visibleSections.has(3) ? 'text-white/60 blur-0' : 'text-white/20 blur-md pointer-events-none'}`}>
                {' '}Voor mij is dit de perfecte combinatie waarin mijn passie voor procesverbetering en mijn creativiteit eindelijk volledig samenkomen. Daarom ben ik{' '}
              </span>

              {/* Section 0b - Always visible, inline */}
              <span className='text-white transition-all duration-500'>
                oprichter van{' '}
                <button
                  onClick={() => revealSection(4)}
                  className='border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-colors'
                >
                  Pimplify
                </button>.
              </span>

              {/* Section 4 */}
              <span className={`transition-all duration-500 ${visibleSections.has(4) ? 'text-white/60 blur-0' : 'text-white/20 blur-md pointer-events-none'}`}>
                {' '}Met Pimplify wil ik bedrijven helpen op een persoonlijke en pragmatische manier. Omdat ik recent ben gestart, kan ik met trots zeggen dat ik innovatief en flexibel genoeg ben om de modernste technieken op het gebied van{' '}
                <button
                  onClick={() => revealSection(5)}
                  disabled={!visibleSections.has(4)}
                  className='border border-white/30 rounded-full px-3 py-1 hover:bg-white/10 transition-colors text-white'
                >
                  AI en agents
                </button>{' '}
                te implementeren — tegen een fractie van de prijs die traditionele consultants vragen.
              </span>

              {/* Section 5 */}
              <span className={`transition-all duration-500 ${visibleSections.has(5) ? 'text-white/60 blur-0' : 'text-white/20 blur-md pointer-events-none'}`}>
                {' '}Functioneel ontwerp dat jij en ik allebei begrijpen. Een persoonlijke aanpak, vanuit jouw wens!
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default index;
