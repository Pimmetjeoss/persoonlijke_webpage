import type { Metadata } from "next";

import CactusKnightExperience from "./cactus-knight-experience";

export const metadata: Metadata = {
  title: "Cactus-ridder in 3D",
  description: "Een procedurele Three.js-reconstructie van de Code Lieshout cactus-ridder.",
  robots: { index: false, follow: false },
};

export default function Cactus3DPage() {
  return <CactusKnightExperience />;
}
