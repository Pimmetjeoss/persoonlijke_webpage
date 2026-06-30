"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { Group } from "three";

function FloatingGeometry() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.18 + pointer.y * 0.1;
    groupRef.current.rotation.y = t * 0.22 + pointer.x * 0.12;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#8de6aa"
          roughness={0.55}
          metalness={0.05}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
      <mesh position={[1.75, -0.45, -0.8]} rotation={[0.6, 0.2, 0.4]}>
        <torusGeometry args={[0.58, 0.035, 10, 64]} />
        <meshStandardMaterial color="#0b301e" roughness={0.45} transparent opacity={0.28} />
      </mesh>
      <mesh position={[-1.55, 0.55, -0.6]} rotation={[0.2, 0.4, 0.1]}>
        <octahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial color="#34a853" roughness={0.6} transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

export function AwardMotionLayer({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 4]} intensity={1.4} />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}

export function AwardInteractions() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hoverItems = gsap.utils.toArray<HTMLElement>("[data-award-hover]");
    const cleanups: Array<() => void> = [];

    hoverItems.forEach((item) => {
      const target = item.querySelector<HTMLElement>("[data-award-target]") ?? item;
      const onEnter = () => {
        gsap.to(target, {
          y: -6,
          scale: 1.018,
          rotate: item.dataset.awardTilt === "true" ? -0.6 : 0,
          boxShadow: "0 26px 70px rgba(11, 48, 30, 0.18)",
          duration: 0.45,
          ease: "power3.out",
        });
      };
      const onLeave = () => {
        gsap.to(target, {
          y: 0,
          scale: 1,
          rotate: 0,
          boxShadow: "0 10px 28px rgba(11, 48, 30, 0.10)",
          duration: 0.55,
          ease: "elastic.out(1, 0.55)",
        });
      };
      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);
      item.addEventListener("focusin", onEnter);
      item.addEventListener("focusout", onLeave);
      cleanups.push(() => {
        item.removeEventListener("mouseenter", onEnter);
        item.removeEventListener("mouseleave", onLeave);
        item.removeEventListener("focusin", onEnter);
        item.removeEventListener("focusout", onLeave);
      });
    });

    const revealItems = gsap.utils.toArray<HTMLElement>("[data-award-reveal]");
    gsap.fromTo(
      revealItems,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: undefined,
      },
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      gsap.killTweensOf(hoverItems);
      gsap.killTweensOf(revealItems);
    };
  }, []);

  return null;
}
