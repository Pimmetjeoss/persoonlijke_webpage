"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { createCactusKnightModel, type CactusKnightRuntime } from "./create-cactus-knight-model";
import styles from "./cactus-3d.module.css";

type ViewName = "front" | "side" | "back";

const CAMERA_VIEWS: Record<ViewName, THREE.Vector3> = {
  front: new THREE.Vector3(2.4, 3.8, 9.2),
  side: new THREE.Vector3(10.6, 3.65, 0.45),
  back: new THREE.Vector3(-0.35, 3.9, -10.7),
};

const references = [
  {
    label: "voorzijde",
    src: "/webdesign/mascots/reference-views/cactus-knight-front-three-quarter.jpeg",
  },
  {
    label: "achterzijde",
    src: "/webdesign/mascots/reference-views/cactus-knight-back.jpeg",
  },
  {
    label: "zijaanzicht",
    src: "/webdesign/mascots/reference-views/cactus-knight-side-three-quarter.jpeg",
  },
];

function CameraRig({ view }: { view: ViewName }) {
  const camera = useThree((state) => state.camera);
  const target = useMemo(() => CAMERA_VIEWS[view].clone(), [view]);
  const settling = useRef(true);

  useEffect(() => {
    settling.current = true;
  }, [view]);

  useFrame(() => {
    if (!settling.current) return;
    camera.position.lerp(target, 0.085);
    camera.lookAt(0, 2.2, 0);
    if (camera.position.distanceTo(target) < 0.025) {
      camera.position.copy(target);
      settling.current = false;
    }
  });
  return null;
}

function Knight({ reducedMotion }: { reducedMotion: boolean }) {
  const model = useMemo(() => createCactusKnightModel(), []);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    return () => {
      model.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
      });
    };
  }, [model]);

  useFrame(({ clock }) => {
    if (!modelRef.current || reducedMotion) return;
    const t = clock.getElapsedTime();
    const runtime = modelRef.current.userData.sculptRuntime as CactusKnightRuntime;
    modelRef.current.position.y = Math.sin(t * 1.3) * 0.035;
    modelRef.current.rotation.z = Math.sin(t * 0.72) * 0.014;
    const leftArm = runtime.nodes["left-arm"];
    const rightArm = runtime.nodes["right-arm"];
    if (leftArm) leftArm.rotation.z = 0.56 + Math.sin(t * 1.05) * 0.035;
    if (rightArm) rightArm.rotation.z = -0.36 - Math.sin(t * 1.05) * 0.025;
  });

  return (
    <group scale={[1.15, 0.95, 1.05]}>
      <primitive ref={modelRef} object={model} />
    </group>
  );
}

function Stage({ view, autoRotate, reducedMotion }: { view: ViewName; autoRotate: boolean; reducedMotion: boolean }) {
  return (
    <Canvas
      className={styles.canvas}
      camera={{ position: [2.4, 3.8, 9.2], fov: 37, near: 0.1, far: 60 }}
      dpr={[1, 1.7]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
      fallback={
        <Image
          src="/webdesign/mascots/reference-views/cactus-knight-front-three-quarter.jpeg"
          alt="Cactus-ridder referentie"
          width={707}
          height={1536}
          loading="eager"
          sizes="(max-width: 1040px) 100vw, 64vw"
          className={styles.fallback}
        />
      }
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#dff8df"]} />
        <hemisphereLight args={[0xeaf7ff, 0x17351f, 1.8]} />
        <directionalLight
          castShadow
          color={0xfff3d2}
          intensity={4.2}
          position={[-4.5, 8, 6]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={6}
          shadow-camera-bottom={-1}
        />
        <directionalLight color={0x9fc8ff} intensity={1.25} position={[5, 3, 1]} />
        <spotLight color={0xe7ffd9} intensity={18} angle={0.46} penumbra={0.78} position={[0, 7, -6]} />
        <Knight reducedMotion={reducedMotion} />
        <ContactShadows
          position={[0, 0.04, 0]}
          opacity={0.42}
          scale={7}
          blur={2.6}
          far={5.5}
          color="#0a2b16"
          resolution={512}
        />
        <CameraRig view={view} />
        <OrbitControls
          makeDefault
          target={[0, 2.2, 0]}
          enablePan={false}
          minDistance={8.2}
          maxDistance={14}
          minPolarAngle={Math.PI * 0.22}
          maxPolarAngle={Math.PI * 0.68}
          autoRotate={autoRotate && !reducedMotion}
          autoRotateSpeed={0.75}
          enableDamping
          dampingFactor={0.055}
        />
      </Suspense>
    </Canvas>
  );
}

export default function CactusKnightExperience() {
  const [view, setView] = useState<ViewName>("front");
  const [autoRotate, setAutoRotate] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a href="/portfolio" className={styles.backLink} aria-label="Terug naar portfolio">
          <span aria-hidden="true">←</span> Code Lieshout
        </a>
        <div className={styles.headerMark}>
          <span>experimenteel model</span>
          <strong>01 / cactus-ridder</strong>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="cactus-title">
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Eén mascotte. Drie hoeken. Volledig in code.</p>
          <h1 id="cactus-title">De cactus-ridder<br />krijgt diepte.</h1>
          <p className={styles.intro}>
            Geen geïmporteerd 3D-model. Helm, ribben, stekels, ogen en scharnieren zijn opgebouwd uit
            procedurele Three.js-geometrie — klaar om te draaien, bewegen en verder te animeren.
          </p>
          <dl className={styles.metrics}>
            <div><dt>22</dt><dd>onderdelen</dd></div>
            <div><dt>03</dt><dd>referentiehoeken</dd></div>
            <div><dt>0</dt><dd>mesh-bestanden</dd></div>
          </dl>
        </div>

        <div className={styles.viewerColumn}>
          <div className={styles.stage} aria-label="Interactief 3D-model van de Code Lieshout cactus-ridder">
            <div className={styles.stageLabel}>sleep om te draaien · scroll om te zoomen</div>
            <Stage view={view} autoRotate={autoRotate} reducedMotion={reducedMotion} />
            <div className={styles.stageIndex} aria-hidden="true">CL<br />3D</div>
          </div>

          <div className={styles.controls} aria-label="Modelweergave">
            <div className={styles.viewButtons}>
              {(["front", "side", "back"] as ViewName[]).map((name) => (
                <button
                  key={name}
                  type="button"
                  className={view === name ? styles.activeButton : undefined}
                  onClick={() => setView(name)}
                >
                  {name === "front" ? "voor" : name === "side" ? "zij" : "achter"}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.rotateButton}
              aria-pressed={autoRotate}
              onClick={() => setAutoRotate((value) => !value)}
            >
              <span className={autoRotate ? styles.liveDot : styles.pausedDot} aria-hidden="true" />
              {autoRotate ? "rotatie aan" : "rotatie uit"}
            </button>
          </div>
        </div>
      </section>

      <section className={styles.references} aria-labelledby="reference-title">
        <div className={styles.referenceHeading}>
          <p>Bronmateriaal</p>
          <h2 id="reference-title">Van sticker naar ruimtelijk karakter.</h2>
        </div>
        <div className={styles.referenceStrip}>
          {references.map((reference, index) => (
            <figure key={reference.src} className={styles.referenceFigure}>
              <Image
                src={reference.src}
                alt={`Cactus-ridder ${reference.label}`}
                width={360}
                height={520}
                loading="eager"
                className={styles.referenceImage}
              />
              <figcaption><span>0{index + 1}</span>{reference.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Procedurele reconstructie · Three.js r180 · React Three Fiber</p>
        <a href="/contact">Iets bijzonders bouwen? <span>→</span></a>
      </footer>
    </main>
  );
}
