"use client"

import { useState, useRef } from "react"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import emailAnimation from "@/public/animations/email.json"
import instagramAnimation from "@/public/animations/instagram.json"
import linkedinAnimation from "@/public/animations/linkedin.json"

interface TextSegment {
  id: string
  text: string
  stage: number
  clickable: boolean
  trigger?: string
}

export default function AboutMe() {
  const emailRef = useRef<LottieRefCurrentProps>(null)
  const instagramRef = useRef<LottieRefCurrentProps>(null)
  const linkedinRef = useRef<LottieRefCurrentProps>(null)

  const [currentStage, setCurrentStage] = useState(0)
  const [revealedStages, setRevealedStages] = useState<Set<number>>(new Set([0]))

  const textSegments: TextSegment[] = [
    // Stage 0: Initial visible
    { id: 'greeting', text: 'Hola! ik ben', stage: 0, clickable: false },
    { id: 'pim', text: 'Pim', stage: 0, clickable: true, trigger: 'stage1' },

    // Stage 1: After clicking "Pim"
    { id: 'intro1', text: 'van Lieshout. Voorstellen blijft altijd een uitdaging, maar ik waag toch een poging.', stage: 1, clickable: false },
    { id: 'work-intro', text: 'In mijn werk ben ik altijd gefascineerd geweest door', stage: 1, clickable: false },
    { id: 'optimization', text: 'procesoptimalisatie.', stage: 1, clickable: true, trigger: 'stage2' },

    // Stage 2: After clicking "procesoptimalisatie"
    { id: 'creative', text: 'Buiten het werk om ben ik het liefst creatief bezig in de breedste zin van het woord — van niets iets maken!', stage: 2, clickable: false },
    { id: 'ai-intro', text: 'Sinds een jaar ben ik volledig gegrepen door het', stage: 2, clickable: false },
    { id: 'ai', text: 'AI-virus.', stage: 2, clickable: true, trigger: 'stage3' },

    // Stage 3: After clicking "AI-virus"
    { id: 'passion', text: 'Voor mij is dit de perfecte combinatie waarin mijn passie voor procesverbetering en mijn creativiteit eindelijk volledig samenkomen.', stage: 3, clickable: false },
    { id: 'founder', text: 'Daarom ben ik oprichter van', stage: 3, clickable: false },
    { id: 'pimplify', text: 'Pimplify.', stage: 3, clickable: true, trigger: 'stage4' },

    // Stage 4: After clicking "Pimplify"
    { id: 'mission', text: 'Met Pimplify wil ik bedrijven helpen op een persoonlijke en pragmatische manier.', stage: 4, clickable: false },
    { id: 'value-prop', text: 'Omdat ik recent ben gestart, kan ik met trots zeggen dat ik innovatief en flexibel genoeg ben om de modernste technieken op het gebied van', stage: 4, clickable: false },
    { id: 'ai-agents', text: 'AI en agents', stage: 4, clickable: true, trigger: 'stage5' },

    // Stage 5: Final reveal
    { id: 'price', text: 'te implementeren — tegen een fractie van de prijs die traditionele consultants vragen.', stage: 5, clickable: false },
    { id: 'closing', text: 'Functioneel ontwerp dat jij en ik allebei begrijpen. Een persoonlijke aanpak, vanuit jouw wens!', stage: 5, clickable: false },
  ]

  const handleClick = (trigger?: string) => {
    if (!trigger) return
    const nextStage = parseInt(trigger.replace('stage', ''))
    setRevealedStages(prev => new Set([...prev, nextStage]))
    setCurrentStage(nextStage)
  }

  const getSegmentClasses = (segment: TextSegment) => {
    const isRevealed = revealedStages.has(segment.stage)
    const isClickable = segment.clickable && segment.stage === currentStage

    let classes = 'inline transition-all duration-500 ease-in-out '

    // All text is visible (opacity 100%), but non-revealed text is blurred
    classes += 'opacity-100 '

    if (!isRevealed) {
      classes += 'blur-md pointer-events-none '
    } else {
      classes += 'blur-0 '
    }

    if (isClickable) {
      classes += 'text-[#22ff7e] underline decoration-2 underline-offset-4 cursor-pointer hover:scale-105 hover:text-[#2cb978] hover:shadow-[0_0_20px_rgba(34,255,126,0.5)] transition-transform '
    } else {
      classes += 'text-white '
    }

    return classes
  }

  return (
    <div className="relative min-h-screen">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-20"
      >
        <source
          src="https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay for better contrast */}
      <div className="fixed inset-0 bg-black/60 -z-10" />

      {/* Text content with mix-blend-mode screen */}
      <section className="relative z-10 flex items-center justify-center min-h-screen p-8 pb-32">
        <div className="max-w-4xl text-center">
          <div
            className="text-2xl md:text-4xl font-bold leading-relaxed italic"
            style={{ mixBlendMode: 'screen' }}
          >
            {textSegments.map((segment, index) => (
              <span
                key={segment.id}
                className={getSegmentClasses(segment)}
                onClick={() => segment.clickable && handleClick(segment.trigger)}
                role={segment.clickable ? 'button' : undefined}
                tabIndex={segment.clickable && segment.stage === currentStage ? 0 : undefined}
                aria-label={segment.clickable ? `Click to reveal more about ${segment.text}` : undefined}
                onKeyDown={(e) => {
                  if (segment.clickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    handleClick(segment.trigger)
                  }
                }}
              >
                {segment.text}
                {index < textSegments.length - 1 && ' '}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white w-full py-2 px-4 md:px-8 lg:px-16 border-t-2 border-black z-50">
        <div className="w-full flex items-center justify-end gap-4">
          {/* Lottie Icons - Before Copyright */}
          <div className="flex gap-3 items-center">
            <a
              href="mailto:your@email.com"
              className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
              onMouseEnter={() => emailRef.current?.play()}
              onMouseLeave={() => emailRef.current?.stop()}
            >
              <Lottie
                lottieRef={emailRef}
                animationData={emailAnimation}
                loop={true}
                autoplay={false}
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
              onMouseEnter={() => instagramRef.current?.play()}
              onMouseLeave={() => instagramRef.current?.stop()}
            >
              <Lottie
                lottieRef={instagramRef}
                animationData={instagramAnimation}
                loop={true}
                autoplay={false}
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
              onMouseEnter={() => linkedinRef.current?.play()}
              onMouseLeave={() => linkedinRef.current?.stop()}
            >
              <Lottie
                lottieRef={linkedinRef}
                animationData={linkedinAnimation}
                loop={true}
                autoplay={false}
              />
            </a>
          </div>

          {/* Copyright - Far Right */}
          <p className="text-black text-sm md:text-base font-medium">
            © 2025
          </p>
        </div>
      </div>
    </div>
  )
}
