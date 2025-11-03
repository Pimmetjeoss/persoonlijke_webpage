"use client"

import { useRef } from "react"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import emailAnimation from "@/public/animations/email.json"
import instagramAnimation from "@/public/animations/instagram.json"
import linkedinAnimation from "@/public/animations/linkedin.json"

export default function AboutMe() {
  const emailRef = useRef<LottieRefCurrentProps>(null)
  const instagramRef = useRef<LottieRefCurrentProps>(null)
  const linkedinRef = useRef<LottieRefCurrentProps>(null)

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <section className='w-full h-screen'>
        <figure className='relative w-full h-full bg-black overflow-hidden'>
            <video autoPlay muted loop className='absolute top-0 left-0 w-full h-full object-cover'>
              <source
                src='https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4'
                type='video/mp4'
              />
            </video>
            <svg
              viewBox='0 0 1400 1000'
              preserveAspectRatio='xMidYMid slice'
              className='w-full absolute top-0 left-0 h-full'
            >
              <defs>
                <filter id='blur'>
                  <feGaussianBlur stdDeviation='3' />
                </filter>
                <mask id='mask' x='0' y='0' width='100%' height='100%'>
                  <rect
                    x='0'
                    y='0'
                    width='100%'
                    height='100%'
                    fill='white'
                  />
                  <text
                    x='700'
                    y='150'
                    fill='black'
                    textAnchor='middle'
                    filter='url(#blur)'
                    style={{ fontSize: '24px', fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' }}
                  >
                    <tspan x='700' dy='0'>Hola! Ik ben Pim van Lieshout. Voorstellen blijft altijd een uitdaging,</tspan>
                    <tspan x='700' dy='35'>maar ik waag toch een poging.</tspan>
                    <tspan x='700' dy='50'>In mijn werk ben ik altijd gefascineerd geweest door procesoptimalisatie.</tspan>
                    <tspan x='700' dy='50'>Buiten het werk om ben ik het liefst creatief bezig in de breedste zin</tspan>
                    <tspan x='700' dy='35'>van het woord — van niets iets maken!</tspan>
                    <tspan x='700' dy='50'>Sinds een jaar ben ik volledig gegrepen door het AI-virus.</tspan>
                    <tspan x='700' dy='50'>Voor mij is dit de perfecte combinatie waarin mijn passie voor</tspan>
                    <tspan x='700' dy='35'>procesverbetering en mijn creativiteit eindelijk volledig samenkomen.</tspan>
                    <tspan x='700' dy='50'>Daarom ben ik oprichter van Pimplify.</tspan>
                    <tspan x='700' dy='50'>Met Pimplify wil ik bedrijven helpen op een persoonlijke</tspan>
                    <tspan x='700' dy='35'>en pragmatische manier.</tspan>
                    <tspan x='700' dy='50'>Omdat ik recent ben gestart, kan ik met trots zeggen dat ik</tspan>
                    <tspan x='700' dy='35'>innovatief en flexibel genoeg ben om de modernste technieken</tspan>
                    <tspan x='700' dy='35'>op het gebied van AI en agents te implementeren — tegen een fractie</tspan>
                    <tspan x='700' dy='35'>van de prijs die traditionele consultants vragen.</tspan>
                    <tspan x='700' dy='50'>Functioneel ontwerp dat jij en ik allebei begrijpen.</tspan>
                    <tspan x='700' dy='35'>Een persoonlijke aanpak, vanuit jouw wens!</tspan>
                  </text>
                </mask>
              </defs>
              <rect
                x='0'
                y='0'
                width='100%'
                height='100%'
                fill='#000105'
                mask='url(#mask)'
              />
            </svg>
          </figure>
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
