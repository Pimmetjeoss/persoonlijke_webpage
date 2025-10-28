"use client"

import { useRef } from "react"
import { WorkExperience } from "./components"
import { Footer } from "./components/footer"
import { Navigation } from "./components/navigation"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import emailAnimation from "@/public/animations/email.json"
import instagramAnimation from "@/public/animations/instagram.json"
import linkedinAnimation from "@/public/animations/linkedin.json"

export default function Portfolio() {
  const emailRef = useRef<LottieRefCurrentProps>(null)
  const instagramRef = useRef<LottieRefCurrentProps>(null)
  const linkedinRef = useRef<LottieRefCurrentProps>(null)

  return (
    <div className="relative min-h-screen">
      <Navigation />
      <WorkExperience />

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
