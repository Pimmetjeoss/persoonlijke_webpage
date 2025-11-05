"use client"

import { DitheringShader } from "./components/dithering-shader";
import { RandomizedTextEffect } from "@/app/components/random_tekst";
import { useTransition } from "@/app/components/transition_provider";

export default function DemoOne() {
  const { startTransition } = useTransition()

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={() => startTransition("/contact/example")}
    >
      <DitheringShader
              shape="swirl"
              type="4x4"
              colorBack="#0d3511"
              colorFront="#e8f8ea"
              pxSize={4}
              speed={0.9}
            />
      <div className="pointer-events-auto z-10 text-center text-7xl leading-none absolute font-semibold text-white tracking-tighter whitespace-pre-wrap">
        <RandomizedTextEffect text="CONTACT" />
      </div>
    </div>
  )
}