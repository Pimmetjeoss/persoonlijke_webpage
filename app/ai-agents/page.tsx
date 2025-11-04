"use client"

import { DitheringShader } from "./components/dithering-shader";
import { useTransition } from "@/app/components/transition_provider"
import { RandomizedTextEffect } from "@/app/components/random_tekst"

export default function DemoOne() {
  const { startTransition } = useTransition()

  return (
    <div
      onClick={() => startTransition("/ai-agents1")}
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
    >
      <DitheringShader
              shape="wave"
              type="8x8"
              colorBack="#86EFAC"
              colorFront="#DCFCE7"
              pxSize={3}
              speed={0.6}
            />
      <div className="pointer-events-auto z-10 text-center text-7xl leading-none absolute font-semibold text-white tracking-tighter whitespace-pre-wrap">
        <RandomizedTextEffect text="AI & AGENTS" />
      </div>
    </div>
  )
}