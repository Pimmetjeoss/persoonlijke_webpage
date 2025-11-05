"use client"

import { DitheringShader } from "./components/dithering-shader";
import { RandomizedTextEffect } from "@/app/components/random_tekst";
import { useTransition } from "@/app/components/transition_provider";

export default function DemoOne() {
  const { startTransition } = useTransition()

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={() => startTransition("/website/example")}
    >
      <DitheringShader
              shape="warp"
              type="4x4"
              colorBack="#0d4721"
              colorFront="#86e89e"
              pxSize={4}
              speed={0.8}
            />
      <div className="pointer-events-auto z-10 text-center text-7xl leading-none absolute font-semibold text-white tracking-tighter whitespace-pre-wrap">
        <RandomizedTextEffect text="WEBSITE" />
      </div>
    </div>
  )
}