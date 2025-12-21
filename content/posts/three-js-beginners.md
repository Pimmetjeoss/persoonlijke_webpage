---
title: "3D op het web: Three.js voor beginners"
date: "2025-01-20"
category: "Development"
excerpt: "Stap voor stap leren hoe je interactieve 3D experiences bouwt met Three.js en React."
---

# 3D op het web: Three.js voor beginners

Three.js maakt WebGL toegankelijk. Leer de fundamenten en bouw je eerste 3D scene.

## Wat is Three.js?

Three.js is een JavaScript library die WebGL abstraheert, zodat je complexe 3D graphics kunt maken zonder low-level GPU programmering.

**Gebruik cases:**
- Product visualizatie
- Games
- Data visualisatie
- Artistieke projecten
- VR/AR experiences

## Setup

```bash
npm install three
```

## De basis: Scene, Camera, Renderer

Elke Three.js app heeft deze 3 componenten:

```javascript
import * as THREE from 'three';

// 1. Scene - Container voor alle objects
const scene = new THREE.Scene();

// 2. Camera - Viewpoint
const camera = new THREE.PerspectiveCamera(
  75,                                  // FOV
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1,                                  // Near clipping plane
  1000                                  // Far clipping plane
);
camera.position.z = 5;

// 3. Renderer - Draws scene
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

## Je eerste object: Een kubus

```javascript
// Geometry - Shape
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material - Appearance
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Mesh - Geometry + Material
const cube = new THREE.Mesh(geometry, material);

// Add to scene
scene.add(cube);

// Render
renderer.render(scene, camera);
```

## Animation loop

```javascript
function animate() {
  requestAnimationFrame(animate);

  // Rotate cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
```

## Licht toevoegen

`MeshBasicMaterial` reageert niet op licht. Gebruik `MeshStandardMaterial`:

```javascript
// Update material
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.5,
  roughness: 0.5,
});

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
```

## React Three Fiber

Voor React apps, gebruik React Three Fiber:

```bash
npm install @react-three/fiber @react-three/drei
```

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Box() {
  const meshRef = useRef();

  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box />
      <OrbitControls />
    </Canvas>
  );
}
```

## Textures laden

```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/path/to/texture.jpg');

const material = new THREE.MeshStandardMaterial({
  map: texture,
});
```

Met React Three Fiber:

```jsx
import { useTexture } from '@react-three/drei';

function TexturedBox() {
  const texture = useTexture('/texture.jpg');

  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
```

## 3D Models laden (GLTF)

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();

loader.load('/model.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

Met React Three Fiber:

```jsx
import { useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/model.glb');
  return <primitive object={scene} />;
}
```

## Post-processing effecten

```jsx
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function App() {
  return (
    <Canvas>
      <Box />
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
}
```

## Performance optimalisatie

### 1. Instancing voor vele objecten

```jsx
import { Instances, Instance } from '@react-three/drei';

function ManyBoxes() {
  return (
    <Instances limit={1000}>
      <boxGeometry />
      <meshStandardMaterial />
      {Array.from({ length: 1000 }).map((_, i) => (
        <Instance key={i} position={[i * 2, 0, 0]} />
      ))}
    </Instances>
  );
}
```

### 2. Level of Detail (LOD)

```javascript
const lod = new THREE.LOD();

// High detail (close)
const highDetail = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  material
);
lod.addLevel(highDetail, 0);

// Low detail (far)
const lowDetail = new THREE.Mesh(
  new THREE.SphereGeometry(1, 8, 8),
  material
);
lod.addLevel(lowDetail, 50);

scene.add(lod);
```

### 3. Dispose unused resources

```javascript
// Cleanup
geometry.dispose();
material.dispose();
texture.dispose();
renderer.dispose();
```

## Debugging tools

```jsx
import { Stats, OrbitControls } from '@react-three/drei';

function App() {
  return (
    <Canvas>
      <Stats /> {/* FPS counter */}
      <OrbitControls /> {/* Mouse controls */}
      <axesHelper args={[5]} /> {/* XYZ axes */}
      <gridHelper args={[10, 10]} /> {/* Ground grid */}
    </Canvas>
  );
}
```

## Praktisch voorbeeld: Animated sphere

```jsx
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, OrbitControls } from '@react-three/drei';

function WobblySphere() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshWobbleMaterial
        color="hotpink"
        factor={1}
        speed={2}
        roughness={0}
        metalness={0.8}
      />
    </mesh>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <WobblySphere />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
```

## Shaders (Advanced)

Custom vertex & fragment shaders:

```jsx
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;

  void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 0.5, 1.0);
  }
`;

function CustomShaderMesh() {
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
```

## Resources

**Learning:**
- [Three.js Docs](https://threejs.org/docs/)
- [Three.js Journey](https://threejs-journey.com/) (Course)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)

**Assets:**
- [Sketchfab](https://sketchfab.com/) - Free 3D models
- [Poly Pizza](https://poly.pizza/) - Low-poly models
- [HDRI Haven](https://polyhaven.com/) - Free HDRIs

**Tools:**
- [Blender](https://www.blender.org/) - 3D modeling (free)
- [Spline](https://spline.design/) - Browser-based 3D

## Checklist

- [ ] Scene, Camera, Renderer opgezet
- [ ] Lights toegevoegd (ambient + directional/point)
- [ ] Materials reageren op licht (MeshStandardMaterial)
- [ ] Animation loop draait (requestAnimationFrame)
- [ ] OrbitControls voor interactiviteit
- [ ] Responsive (resize handler)
- [ ] Dispose resources on unmount
- [ ] Performance > 60 FPS

## Conclusie

Three.js opent een wereld van mogelijkheden voor web experiences. Start simpel:

1. **Leer de fundamenten** (scene, camera, renderer)
2. **Experimenteer** met geometries en materials
3. **Voeg interactiviteit toe** (OrbitControls, events)
4. **Optimaliseer** voor performance

> "The best way to learn Three.js is to build something."

**Volgende stappen:**
- Bouw een simpele scene met meerdere objects
- Voeg mouse interactivity toe
- Laad een 3D model
- Experimenteer met shaders
