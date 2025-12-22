"use client"

import { useRef } from "react"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import homeAnimation from "@/public/animations/home.json"
import emailAnimation from "@/public/animations/email.json"
import instagramAnimation from "@/public/animations/instagram.json"
import linkedinAnimation from "@/public/animations/linkedin.json"
import whatsappAnimation from "@/public/animations/Whatsapp.json"

export function StickyFooter() {
  const homeRef = useRef<LottieRefCurrentProps>(null)
  const emailRef = useRef<LottieRefCurrentProps>(null)
  const instagramRef = useRef<LottieRefCurrentProps>(null)
  const linkedinRef = useRef<LottieRefCurrentProps>(null)
  const whatsappRef = useRef<LottieRefCurrentProps>(null)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white w-full py-2 px-4 md:px-8 lg:px-16 border-t-2 border-black z-50">
      <div className="w-full flex items-center justify-end gap-4">
        {/* Lottie Icons - Before Copyright */}
        <div className="flex gap-3 items-center">
          <a
            href="/portfolio"
            className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
            onMouseEnter={() => {
              if (homeRef.current) {
                homeRef.current.setSpeed(0.5)
                homeRef.current.play()
              }
            }}
            onMouseLeave={() => homeRef.current?.stop()}
          >
            <Lottie
              lottieRef={homeRef}
              animationData={homeAnimation}
              loop={true}
              autoplay={false}
            />
          </a>
          <a
            href="mailto:your@email.com"
            className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
            onMouseEnter={() => {
              if (emailRef.current) {
                emailRef.current.setSpeed(0.5)
                emailRef.current.play()
              }
            }}
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
            onMouseEnter={() => {
              if (instagramRef.current) {
                instagramRef.current.setSpeed(0.5)
                instagramRef.current.play()
              }
            }}
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
          <a
            href="#"
            className="w-6 h-6 md:w-8 md:h-8 cursor-pointer flex items-center justify-center"
            onMouseEnter={() => {
              if (whatsappRef.current) {
                whatsappRef.current.setSpeed(0.5)
                whatsappRef.current.play()
              }
            }}
            onMouseLeave={() => whatsappRef.current?.stop()}
          >
            <div className="w-5 h-5 md:w-7 md:h-7">
              <Lottie
                lottieRef={whatsappRef}
                animationData={whatsappAnimation}
                loop={true}
                autoplay={false}
              />
            </div>
          </a>
        </div>

        {/* Copyright - Far Right */}
        <p className="text-black text-sm md:text-base font-medium">
          © 2025
        </p>
      </div>
    </div>
  )
}
