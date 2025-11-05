"use client"

import { DitheringShader } from "./components/dithering-shader";
import { RandomizedTextEffect } from "@/app/components/random_tekst";
import { useTransition } from "@/app/components/transition_provider";

export default function DemoOne() {
  const { startTransition } = useTransition()

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
      onClick={() => startTransition("/MCP-server/example")}
    >
      <DitheringShader
              shape="ripple"
              type="2x2"
              colorBack="#16471c"
              colorFront="#86e89e"
              pxSize={2}
              speed={1.2}
            />
      <div className="pointer-events-auto z-10 text-center text-7xl leading-none absolute font-semibold text-white tracking-tighter whitespace-pre-wrap">
        <RandomizedTextEffect text="MCP-SERVER" />
      </div>
    </div>
  )
}