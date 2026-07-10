"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Points,
  Raycaster,
  ShaderMaterial,
  Vector2,
} from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

const pointVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;

  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (7.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const pointFragmentShader = `
  varying vec3 vColor;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(center);
    if (distanceFromCenter > 0.5) discard;
    float softEdge = 1.0 - smoothstep(0.38, 0.5, distanceFromCenter);
    gl_FragColor = vec4(vColor, softEdge);
  }
`;

function InteractivePointCube() {
  const pointsRef = useRef<Points<BufferGeometry, ShaderMaterial>>(null);
  const hoveredPoint = useRef<number | null>(null);
  const pointer = useRef(new Vector2(2, 2));
  const raycaster = useRef(new Raycaster());
  const { gl, size } = useThree();

  const geometry = useMemo(() => {
    const box = new BoxGeometry(3.4, 3.4, 3.4, 16, 16, 16);
    box.deleteAttribute("normal");
    box.deleteAttribute("uv");
    const mergedBox = mergeVertices(box);
    const positions = mergedBox.getAttribute("position");
    const colors: number[] = [];
    const sizes = new Float32Array(positions.count);
    const color = new Color();

    for (let index = 0; index < positions.count; index += 1) {
      color.setHSL(0.36 + 0.055 * (index / positions.count), 0.72, 0.38);
      color.toArray(colors, index * 3);
      sizes[index] = 5.5;
    }

    const pointsGeometry = new BufferGeometry();
    pointsGeometry.setAttribute("position", positions.clone());
    pointsGeometry.setAttribute("customColor", new Float32BufferAttribute(colors, 3));
    pointsGeometry.setAttribute("size", new BufferAttribute(sizes, 1));
    mergedBox.dispose();
    box.dispose();
    return pointsGeometry;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: pointVertexShader,
        fragmentShader: pointFragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      const bounds = gl.domElement.getBoundingClientRect();
      pointer.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.current.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    };

    document.addEventListener("pointermove", updatePointer, { passive: true });
    return () => document.removeEventListener("pointermove", updatePointer);
  }, [gl]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      points.rotation.x += delta * 0.035;
      points.rotation.y += delta * 0.07;
    }

    raycaster.current.params.Points = { threshold: 0.09 };
    raycaster.current.setFromCamera(pointer.current, state.camera);

    const hit = raycaster.current.intersectObject(points, false)[0];
    const nextHovered = hit?.index ?? null;
    if (nextHovered === hoveredPoint.current) return;

    const sizes = geometry.getAttribute("size") as BufferAttribute;
    if (hoveredPoint.current !== null) sizes.setX(hoveredPoint.current, 5.5);
    if (nextHovered !== null) sizes.setX(nextHovered, 13);
    sizes.needsUpdate = true;
    hoveredPoint.current = nextHovered;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      position={[size.width >= 768 ? 2.05 : 0, 0.1, 0]}
      rotation={[0.22, 0.38, 0]}
      scale={size.width >= 768 ? 0.78 : 0.72}
    />
  );
}

export function InteractivePointsLayer({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <Canvas
        className="opacity-35 md:opacity-55"
        camera={{ position: [0, 0, 6.4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <InteractivePointCube />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/75 to-transparent md:bg-gradient-to-r md:from-white md:via-white/85 md:to-transparent" />
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
