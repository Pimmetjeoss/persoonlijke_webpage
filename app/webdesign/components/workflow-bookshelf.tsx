"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Werkwijze-boekenplank: elke stap van het webdesign-proces staat als een
 * linnen band op een doorlopende plank. Klik een boek aan en het schuift
 * naar voren met de info van die stap.
 *
 * Constructie naar het voorbeeld van MengTo/complete-shelf: de rug van elk
 * boek wijst naar de camera en krijgt een procedurele canvas-texture met
 * linnenweefsel en een folie-titel (romeins cijfer + gedraaide titel).
 */

export type ShelfStep = {
  slug: string;
  roman: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  foil: string;
  width: number;
  height: number;
};

const INK = "hsl(144.9 80.4% 10%)";

/** Zet "hsl(H S% L%)" om naar hex zodat canvas/THREE hem overal snappen. */
function hslToHex(hsl: string): string {
  const m = hsl.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/);
  if (!m) return "#4a7c59";
  const h = Number(m[1]) / 360;
  const sat = Number(m[2]) / 100;
  const l = Number(m[3]) / 100;
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const a = sat * Math.min(l, 1 - l);
    const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * v)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Linnen-rug: basiskleur + weefdraadjes + rand-schaduw, zoals complete-shelf. */
function makeSpineTexture(step: ShelfStep): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d")!;
  const random = seededRandom(hashSeed(`${step.slug}-spine`));

  ctx.fillStyle = hslToHex(step.color);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Zacht randlicht/schaduw over de breedte van de rug
  const shade = ctx.createLinearGradient(0, 0, canvas.width, 0);
  shade.addColorStop(0, "rgba(0,0,0,0.2)");
  shade.addColorStop(0.14, "rgba(255,255,255,0.055)");
  shade.addColorStop(0.62, "rgba(255,255,255,0.012)");
  shade.addColorStop(1, "rgba(0,0,0,0.16)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Linnenweefsel: korte horizontale/verticale draadjes
  for (let thread = 0; thread < 1900; thread += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const vertical = random() > 0.42;
    ctx.strokeStyle =
      random() > 0.5
        ? `rgba(255,255,255,${0.018 + random() * 0.038})`
        : `rgba(0,0,0,${0.018 + random() * 0.032})`;
    ctx.lineWidth = 0.45 + random() * 0.7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      vertical ? x + (random() - 0.5) * 1.2 : x + 8 + random() * 28,
      vertical ? y + 8 + random() * 34 : y + (random() - 0.5) * 1.2
    );
    ctx.stroke();
  }

  // Onderaan iets donkerder
  const bottomShade = ctx.createLinearGradient(0, canvas.height * 0.82, 0, canvas.height);
  bottomShade.addColorStop(0, "rgba(0,0,0,0)");
  bottomShade.addColorStop(1, "rgba(0,0,0,0.12)");
  ctx.fillStyle = bottomShade;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Folie-laag op de rug: kaderrand, romeins cijfer boven, gedraaide titel. */
function makeSpineFoilTexture(step: ShelfStep): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4.5;
  ctx.strokeRect(34, 38, canvas.width - 68, canvas.height - 76);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '700 40px "Fjalla One", Inter, "Helvetica Neue", Arial, sans-serif';
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "5px";
  } catch {
    /* letterSpacing wordt niet overal ondersteund */
  }
  ctx.fillText(step.roman, canvas.width * 0.5, 118);

  ctx.save();
  ctx.translate(canvas.width * 0.5, canvas.height * 0.52);
  ctx.rotate(Math.PI / 2);
  ctx.font = `700 ${step.title.length > 12 ? 62 : 72}px "Fjalla One", Inter, Arial, sans-serif`;
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "2px";
  } catch {
    /* idem */
  }
  ctx.fillText(step.title.toUpperCase(), 0, 0);
  ctx.restore();

  // Sierring onderaan
  ctx.beginPath();
  ctx.arc(canvas.width * 0.5, canvas.height - 120, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.5 - 24, canvas.height - 120);
  ctx.lineTo(canvas.width * 0.5 + 24, canvas.height - 120);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function Book({
  step,
  index,
  selected,
  onSelect,
}: {
  step: ShelfStep;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const materials = useMemo(() => {
    const spineTex = makeSpineTexture(step);
    const foilTex = makeSpineFoilTexture(step);
    const cloth = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(hslToHex(step.color)),
      map: spineTex,
      roughness: 0.96,
      metalness: 0.03,
      sheen: 0.32,
      sheenRoughness: 0.76,
      sheenColor: new THREE.Color(hslToHex(step.foil)),
    });
    const clothPlain = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(hslToHex(step.color)),
      roughness: 0.95,
      metalness: 0.03,
      sheen: 0.28,
      sheenRoughness: 0.78,
      sheenColor: new THREE.Color(hslToHex(step.foil)),
    });
    const foil = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hslToHex(step.foil)),
      alphaMap: foilTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      roughness: 0.3,
      metalness: 0.55,
      emissive: new THREE.Color(hslToHex(step.foil)),
      emissiveIntensity: 0.35,
    });
    const paper = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#efe7d3"),
      roughness: 0.95,
    });
    const headband = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hslToHex(step.foil)),
      roughness: 0.5,
      metalness: 0.35,
    });
    return { cloth, clothPlain, foil, paper, headband };
  }, [step]);

  const w = step.width;
  const h = step.height;
  const d = 0.34;

  const targetX = selected ? 0 : (index - 2.5) * 1.16;
  const targetZ = selected ? 1.5 : hovered ? 0.14 : 0;

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 6, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, 8, delta);
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      selected ? -Math.PI / 10 : 0,
      6,
      delta
    );
    g.position.y = THREE.MathUtils.damp(
      g.position.y,
      hovered && !selected ? 0.07 : 0,
      10,
      delta
    );
  });

  return (
    <group
      ref={group}
      position={[targetX, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* boekblok (pagina's) */}
      <mesh castShadow receiveShadow position={[0, h / 2, -0.03]}>
        <boxGeometry args={[w - 0.03, h - 0.02, d - 0.07]} />
        <meshStandardMaterial {...materials.paper} attach="material" />
      </mesh>
      {/* kaftborden links/rechts */}
      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[(side * (w + 0.028)) / 2, h / 2, -0.03]}>
          <boxGeometry args={[0.03, h + 0.02, d]} />
          <meshStandardMaterial {...materials.clothPlain} attach="material" />
        </mesh>
      ))}
      {/* kop- en staartbord */}
      {[-1, 1].map((side) => (
        <mesh key={`cap-${side}`} position={[0, h / 2 + (side * (h + 0.02)) / 2, -0.03]}>
          <boxGeometry args={[w + 0.06, 0.03, d]} />
          <meshStandardMaterial {...materials.clothPlain} attach="material" />
        </mesh>
      ))}
      {/* rug naar de camera */}
      <mesh castShadow position={[0, h / 2, d / 2 - 0.015]}>
        <boxGeometry args={[w + 0.06, h + 0.03, 0.03]} />
        <meshStandardMaterial {...materials.cloth} attach="material" />
      </mesh>
      {/* folie-opdruk op de rug */}
      <mesh position={[0, h / 2, d / 2 + 0.004]}>
        <planeGeometry args={[w + 0.05, h + 0.02]} />
        <meshStandardMaterial {...materials.foil} attach="material" />
      </mesh>
      {/* kop- en staartband */}
      {[-1, 1].map((side) => (
        <mesh
          key={`band-${side}`}
          position={[0, h / 2 + side * ((h - 0.02) / 2), -0.03]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.012, 0.012, (d - 0.08) * 0.88, 12]} />
          <meshStandardMaterial {...materials.headband} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

export default function WorkflowBookshelf({ steps }: { steps: ShelfStep[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = selected !== null ? steps[selected] : null;

  return (
    <div className="space-y-6">
      <div
        className="relative overflow-hidden rounded-xl border-[3px] bg-white shadow-xl"
        style={{ borderColor: INK }}
      >
        <div className="h-[340px] md:h-[420px]">
          <Canvas
            shadows
            camera={{ position: [0, 1.15, 5.6], fov: 40 }}
            dpr={[1, 2]}
            onCreated={({ camera }) => camera.lookAt(0, 0.65, 0)}
          >
            <color attach="background" args={["#fdfbf4"]} />
            <ambientLight intensity={0.95} />
            <directionalLight
              position={[3, 5, 4]}
              intensity={1.35}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-4, 2, 3]} intensity={0.45} />
            {steps.map((step, i) => (
              <Book
                key={step.slug}
                step={step}
                index={i}
                selected={selected === i}
                onSelect={() => setSelected(selected === i ? null : i)}
              />
            ))}
            {/* plank */}
            <mesh receiveShadow position={[0, -0.14, 0]}>
              <boxGeometry args={[7.6, 0.16, 1.1]} />
              <meshStandardMaterial color="#8a5a34" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.02, 0.56]}>
              <boxGeometry args={[7.6, 0.1, 0.04]} />
              <meshStandardMaterial color="#6f4526" roughness={0.8} />
            </mesh>
          </Canvas>
        </div>
        <p
          className="border-t-[3px] px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em]"
          style={{ borderColor: INK, color: INK }}
        >
          {current
            ? `${current.roman} · ${current.title}`
            : "Klik op een boek om de stap te openen"}
        </p>
      </div>

      {/* Detailpaneel */}
      <div className="relative min-h-[120px]">
        {current ? (
          <div
            key={current.slug}
            data-shelf-detail
            className="rounded-xl border-[3px] bg-white p-6 shadow-lg md:p-8"
            style={{ borderColor: INK }}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span
                className="inline-flex items-center justify-center rounded-md border-[3px] px-2 py-0.5 text-sm font-black"
                style={{
                  borderColor: INK,
                  backgroundColor: current.color,
                  color: "#fff",
                }}
              >
                {current.roman}
              </span>
              <h3
                className="text-3xl font-bold uppercase tracking-tight md:text-4xl"
                style={{ color: INK }}
              >
                {current.title}
              </h3>
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                {current.subtitle}
              </span>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              {current.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/webdesign/${current.slug}`}
                className="rounded-full border-[3px] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] transition-colors hover:bg-[hsl(144.9_80.4%_10%)] hover:text-white"
                style={{ borderColor: INK, color: INK }}
              >
                Bekijk deze stap
              </Link>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full border-[3px] border-transparent px-5 py-3 text-sm font-bold uppercase tracking-[0.16em]"
                style={{ color: "hsl(144.9 80.4% 30%)" }}
              >
                Terug naar de plank
              </button>
            </div>
          </div>
        ) : (
          <p className="text-base font-semibold text-gray-600 md:hidden">
            Tik op een boek voor meer info over die stap.
          </p>
        )}
      </div>
    </div>
  );
}
