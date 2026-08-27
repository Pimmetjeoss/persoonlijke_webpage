import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export type ProceduralModelOptions = {
  wireframe?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  textureSize?: number;
  textureAnisotropy?: number;
  qualityPriority?: 'reference-fidelity' | 'balanced';
};

export type ProceduralModelRuntime = {
  nodes: Record<string, THREE.Object3D>;
  meshes: Record<string, THREE.Mesh>;
  sockets: Record<string, THREE.Object3D>;
  colliders: Record<string, unknown>;
  destructionGroups: Record<string, THREE.Object3D[]>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type SculptMaterialSpec = Record<string, any>;

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function readLayerNumber(value: unknown, keys: string[], fallback: number): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    for (const key of keys) {
      if (typeof record[key] === 'number') return record[key] as number;
    }
  }
  return fallback;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = /^#[0-9a-f]{3}$/i.test(hex)
    ? '#' + hex.slice(1).split('').map((part) => part + part).join('')
    : hex;
  const value = /^#[0-9a-f]{6}$/i.test(normalized) ? Number.parseInt(normalized.slice(1), 16) : 0x8a7a5f;
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function materialPalette(spec: SculptMaterialSpec): string[] {
  const palette = spec.colorVariation?.palette;
  if (Array.isArray(palette) && palette.length > 0) return palette.filter((value) => typeof value === 'string');
  const secondary = spec.albedo?.secondary;
  const colors = [spec.baseColor ?? spec.color ?? spec.albedo?.dominant, ...(Array.isArray(secondary) ? secondary : [])];
  return colors.filter((value): value is string => typeof value === 'string' && value.startsWith('#'));
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothCurve(value: number): number {
  return value * value * (3 - 2 * value);
}

function periodicHash(x: number, y: number, seed: number, periodX: number, periodY: number): number {
  const wrappedX = ((x % periodX) + periodX) % periodX;
  const wrappedY = ((y % periodY) + periodY) % periodY;
  let value = Math.imul(wrappedX + seed * 17, 374761393) ^ Math.imul(wrappedY + seed * 31, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function periodicValueNoise(u: number, v: number, seed: number, periodX: number, periodY: number): number {
  const x = u * periodX;
  const y = v * periodY;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = smoothCurve(x - x0);
  const ty = smoothCurve(y - y0);
  const a = periodicHash(x0, y0, seed, periodX, periodY);
  const b = periodicHash(x0 + 1, y0, seed, periodX, periodY);
  const c = periodicHash(x0, y0 + 1, seed, periodX, periodY);
  const d = periodicHash(x0 + 1, y0 + 1, seed, periodX, periodY);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, tx), THREE.MathUtils.lerp(c, d, tx), ty);
}

type SurfaceBand = {
  frequency: number;
  amplitude: number;
  stretchX: number;
  stretchY: number;
  ridge: boolean;
};

function surfaceBands(spec: SculptMaterialSpec): SurfaceBand[] {
  const source = Array.isArray(spec.surfaceFrequencyBands) ? spec.surfaceFrequencyBands : [];
  const parsed = source.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') return [];
    const band = item as Record<string, unknown>;
    const frequency = typeof band.frequency === 'number' ? band.frequency : 0;
    const amplitude = typeof band.amplitude === 'number' ? band.amplitude : 0;
    if (frequency <= 0 || amplitude <= 0) return [];
    const stretch = Array.isArray(band.stretch) ? band.stretch : [1, 1];
    const description = `${String(band.pattern ?? '')} ${String(band.role ?? '')}`.toLowerCase();
    return [{
      frequency,
      amplitude,
      stretchX: typeof stretch[0] === 'number' ? Math.max(0.1, stretch[0]) : 1,
      stretchY: typeof stretch[1] === 'number' ? Math.max(0.1, stretch[1]) : 1,
      ridge: /(ridge|groove|grain|fiber|striated|crack)/.test(description),
    }];
  });
  return parsed.length > 0 ? parsed : [
    { frequency: 2, amplitude: 0.42, stretchX: 1, stretchY: 1, ridge: false },
    { frequency: 12, amplitude: 0.22, stretchX: 1, stretchY: 1, ridge: false },
    { frequency: 56, amplitude: 0.08, stretchX: 1, stretchY: 1, ridge: false },
  ];
}

function sampleSurface(u: number, v: number, bands: SurfaceBand[], seed: number): number {
  let value = 0;
  let weight = 0;
  for (let index = 0; index < bands.length; index += 1) {
    const band = bands[index];
    const periodX = Math.max(1, Math.round(band.frequency * band.stretchX));
    const periodY = Math.max(1, Math.round(band.frequency * band.stretchY));
    let sample = periodicValueNoise(u, v, seed + index * 1013, periodX, periodY);
    if (band.ridge) sample = 1 - Math.abs(sample * 2 - 1);
    value += sample * band.amplitude;
    weight += band.amplitude;
  }
  return weight > 0 ? clamp01(value / weight) : 0.5;
}

function mixPalette(colors: [number, number, number][], value: number): [number, number, number] {
  if (colors.length === 1) return colors[0];
  const scaled = clamp01(value) * (colors.length - 1);
  const index = Math.min(colors.length - 2, Math.floor(scaled));
  const mix = scaled - index;
  const a = colors[index];
  const b = colors[index + 1];
  return [
    Math.round(THREE.MathUtils.lerp(a[0], b[0], mix)),
    Math.round(THREE.MathUtils.lerp(a[1], b[1], mix)),
    Math.round(THREE.MathUtils.lerp(a[2], b[2], mix)),
  ];
}

type ColorGradientStop = { offset: number; color: string };
type ColorGradientSpec = {
  type: 'linear' | 'radial';
  axis: [number, number];
  stops: ColorGradientStop[];
};

function parseRgba(value: string): [number, number, number] {
  const match = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(value);
  if (!match) return [138, 122, 95];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

// Analytical per-pixel gradient sample. The extraction schema's colorGradient carries
// exact rgba(...) stop colors (see extract_part_color_recipe.py), so this samples the
// same trend directly in JS math rather than round-tripping through a Canvas 2D
// createLinearGradient/createRadialGradient object — same visual result, and it composes
// directly with the existing noise/height-correlated colorVariation blend below.
function sampleColorGradient(gradient: ColorGradientSpec, u: number, v: number): [number, number, number] {
  const stops = gradient.stops.length >= 2 ? gradient.stops : [{ offset: 0, color: 'rgba(138,122,95,1)' }, { offset: 1, color: 'rgba(138,122,95,1)' }];
  let t: number;
  if (gradient.type === 'radial') {
    const [cx, cy] = gradient.axis;
    const dx = u - cx;
    const dy = v - cy;
    const maxRadius = Math.max(0.001, Math.hypot(Math.max(cx, 1 - cx), Math.max(cy, 1 - cy)));
    t = clamp01(Math.hypot(dx, dy) / maxRadius);
  } else {
    const [ax, ay] = gradient.axis;
    const projection = (u - 0.5) * ax + (v - 0.5) * ay;
    const maxProjection = 0.5 * (Math.abs(ax) + Math.abs(ay)) || 0.5;
    t = clamp01(projection / maxProjection + 0.5);
  }
  const scaled = t * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.max(0, Math.floor(scaled)));
  const mix = scaled - index;
  const a = parseRgba(stops[index].color);
  const b = parseRgba(stops[index + 1].color);
  return [
    THREE.MathUtils.lerp(a[0], b[0], mix),
    THREE.MathUtils.lerp(a[1], b[1], mix),
    THREE.MathUtils.lerp(a[2], b[2], mix),
  ];
}

function writePixel(data: Uint8ClampedArray, offset: number, red: number, green: number, blue: number): void {
  data[offset] = Math.max(0, Math.min(255, Math.round(red)));
  data[offset + 1] = Math.max(0, Math.min(255, Math.round(green)));
  data[offset + 2] = Math.max(0, Math.min(255, Math.round(blue)));
  data[offset + 3] = 255;
}

function makeCanvas(size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function createMapTexture(
  canvas: HTMLCanvasElement,
  colorSpace: THREE.ColorSpace,
  spec: SculptMaterialSpec,
  options: ProceduralModelOptions,
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  const projection = spec.textureProjection && typeof spec.textureProjection === 'object' ? spec.textureProjection : {};
  const repeat = Array.isArray(projection.repeat) ? projection.repeat : [2, 2];
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(
    typeof repeat[0] === 'number' ? repeat[0] : 2,
    typeof repeat[1] === 'number' ? repeat[1] : 2,
  );
  texture.anisotropy = Math.max(1, Math.round(options.textureAnisotropy ?? projection.anisotropy ?? 8));
  texture.needsUpdate = true;
  return texture;
}

type ProceduralTextureSet = {
  albedo: THREE.Texture;
  roughness: THREE.Texture;
  height: THREE.Texture;
  normal: THREE.Texture;
  ao: THREE.Texture;
  source: 'reference-pixel-extraction' | 'procedural';
};

function referenceMapUrl(spec: SculptMaterialSpec, channel: string): string | null {
  const reference = spec.referencePbr;
  if (!reference || typeof reference !== 'object') return null;
  if (reference.usable === false) return null;
  const confidence = typeof reference.confidence === 'number'
    ? reference.confidence
    : (typeof reference.estimatedFidelity === 'number' ? reference.estimatedFidelity : 0);
  const threshold = typeof reference.targetThreshold === 'number' ? reference.targetThreshold : 0.7;
  if (confidence < threshold) return null;
  const maps = reference.maps;
  if (!maps || typeof maps !== 'object') return null;
  const map = (maps as Record<string, unknown>)[channel];
  if (!map || typeof map !== 'object') return null;
  const record = map as Record<string, unknown>;
  const url = typeof record.url === 'string' && record.url.trim() ? record.url : record.path;
  return typeof url === 'string' && url.trim() ? url : null;
}

function createLoadedMapTexture(
  url: string,
  colorSpace: THREE.ColorSpace,
  spec: SculptMaterialSpec,
  options: ProceduralModelOptions,
): THREE.Texture {
  const texture = new THREE.TextureLoader().load(url);
  const projection = spec.textureProjection && typeof spec.textureProjection === 'object' ? spec.textureProjection : {};
  const repeat = Array.isArray(projection.repeat) ? projection.repeat : [1, 1];
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(
    typeof repeat[0] === 'number' ? repeat[0] : 1,
    typeof repeat[1] === 'number' ? repeat[1] : 1,
  );
  texture.anisotropy = Math.max(1, Math.round(options.textureAnisotropy ?? projection.anisotropy ?? 8));
  texture.needsUpdate = true;
  return texture;
}

function makeReferenceTextureSet(spec: SculptMaterialSpec, options: ProceduralModelOptions): ProceduralTextureSet | null {
  const albedo = referenceMapUrl(spec, 'albedo');
  const roughness = referenceMapUrl(spec, 'roughness');
  const height = referenceMapUrl(spec, 'height');
  const normal = referenceMapUrl(spec, 'normal');
  const ao = referenceMapUrl(spec, 'ao');
  if (!albedo || !roughness || !height || !normal || !ao) return null;
  return {
    albedo: createLoadedMapTexture(albedo, THREE.SRGBColorSpace, spec, options),
    roughness: createLoadedMapTexture(roughness, THREE.NoColorSpace, spec, options),
    height: createLoadedMapTexture(height, THREE.NoColorSpace, spec, options),
    normal: createLoadedMapTexture(normal, THREE.NoColorSpace, spec, options),
    ao: createLoadedMapTexture(ao, THREE.NoColorSpace, spec, options),
    source: 'reference-pixel-extraction',
  };
}

function makeProceduralTextureSet(
  id: string,
  spec: SculptMaterialSpec,
  options: ProceduralModelOptions,
): ProceduralTextureSet | null {
  if (typeof document === 'undefined') return null;
  const qualityFirst = (options.qualityPriority ?? 'reference-fidelity') === 'reference-fidelity';
  const requested = options.textureSize ?? spec.textureResolution;
  const requestedSize = typeof requested === 'number' && Number.isFinite(requested)
    ? requested
    : (qualityFirst ? 1024 : 512);
  const size = Math.max(256, Math.min(2048, 2 ** Math.round(Math.log2(requestedSize))));
  const canvases = {
    albedo: makeCanvas(size),
    roughness: makeCanvas(size),
    height: makeCanvas(size),
    normal: makeCanvas(size),
    ao: makeCanvas(size),
  };
  const contexts = {
    albedo: canvases.albedo.getContext('2d'),
    roughness: canvases.roughness.getContext('2d'),
    height: canvases.height.getContext('2d'),
    normal: canvases.normal.getContext('2d'),
    ao: canvases.ao.getContext('2d'),
  };
  if (!contexts.albedo || !contexts.roughness || !contexts.height || !contexts.normal || !contexts.ao) return null;
  const images = {
    albedo: contexts.albedo.createImageData(size, size),
    roughness: contexts.roughness.createImageData(size, size),
    height: contexts.height.createImageData(size, size),
    normal: contexts.normal.createImageData(size, size),
    ao: contexts.ao.createImageData(size, size),
  };
  const seed = hashString(id);
  const bands = surfaceBands(spec);
  const heightField = new Float32Array(size * size);
  const roughnessField = new Float32Array(size * size);
  const palette = materialPalette(spec);
  const fallback = typeof spec.baseColor === 'string' ? spec.baseColor : '#8A7A5F';
  const colors = (palette.length >= 2 ? palette : [fallback, '#6E614B', '#A08F70']).map(hexToRgb);
  const baseRoughness = clamp01(readLayerNumber(spec.roughness, ['base'], 0.76));
  const roughnessVariation = clamp01(readLayerNumber(spec.roughness, ['variation'], 0.18));
  const colorAmplitude = clamp01(readLayerNumber(spec.colorVariation, ['amplitude', 'variation'], 0.18));
  const heightCorrelation = clamp01(readLayerNumber(spec.colorVariation, ['heightCorrelation'], 0.3));
  const colorGradient: ColorGradientSpec | undefined = spec.colorGradient;
  for (let y = 0; y < size; y += 1) {
    const v = y / size;
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const index = y * size + x;
      const height = sampleSurface(u, v, bands, seed + 101);
      const roughNoise = sampleSurface(u, v, bands, seed + 7001);
      const colorNoise = sampleSurface(u, v, bands, seed + 15013);
      heightField[index] = height;
      roughnessField[index] = clamp01(baseRoughness + (roughNoise - 0.5) * roughnessVariation * 2);
      let color: [number, number, number];
      if (colorGradient) {
        // Evidence-derived spatial gradient (Plan 1.3 Workstream C) takes priority
        // over the noise-based palette blend below — it is a measured trend, not a guess.
        color = sampleColorGradient(colorGradient, u, v);
      } else {
        const paletteValue = clamp01(
          0.5 + (colorNoise - 0.5) * colorAmplitude * 2 + (height - 0.5) * heightCorrelation
        );
        color = mixPalette(colors, paletteValue);
      }
      writePixel(images.albedo.data, index * 4, color[0], color[1], color[2]);
    }
  }
  const normalStrength = Math.max(0.05, readLayerNumber(spec.normal, ['strength', 'amplitude'], 0.35));
  const aoStrength = clamp01(readLayerNumber(spec.ambientOcclusion, ['cavityStrength', 'strength'], 0.35));
  for (let y = 0; y < size; y += 1) {
    const up = ((y - 1 + size) % size) * size;
    const down = ((y + 1) % size) * size;
    for (let x = 0; x < size; x += 1) {
      const left = (x - 1 + size) % size;
      const right = (x + 1) % size;
      const index = y * size + x;
      const center = heightField[index];
      const dx = (heightField[y * size + right] - heightField[y * size + left]) * normalStrength * 6;
      const dy = (heightField[down + x] - heightField[up + x]) * normalStrength * 6;
      const inverseLength = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const normalX = -dx * inverseLength;
      const normalY = -dy * inverseLength;
      const normalZ = inverseLength;
      const neighborAverage = (
        heightField[y * size + left] + heightField[y * size + right]
        + heightField[up + x] + heightField[down + x]
      ) * 0.25;
      const cavity = Math.max(0, neighborAverage - center);
      const ao = clamp01(1 - aoStrength * (cavity * 12 + (1 - center) * 0.16));
      const offset = index * 4;
      const heightByte = center * 255;
      const roughnessByte = roughnessField[index] * 255;
      writePixel(images.height.data, offset, heightByte, heightByte, heightByte);
      writePixel(images.roughness.data, offset, roughnessByte, roughnessByte, roughnessByte);
      writePixel(
        images.normal.data, offset,
        (normalX * 0.5 + 0.5) * 255,
        (normalY * 0.5 + 0.5) * 255,
        (normalZ * 0.5 + 0.5) * 255,
      );
      writePixel(images.ao.data, offset, ao * 255, ao * 255, ao * 255);
    }
  }
  contexts.albedo.putImageData(images.albedo, 0, 0);
  contexts.roughness.putImageData(images.roughness, 0, 0);
  contexts.height.putImageData(images.height, 0, 0);
  contexts.normal.putImageData(images.normal, 0, 0);
  contexts.ao.putImageData(images.ao, 0, 0);
  return {
    albedo: createMapTexture(canvases.albedo, THREE.SRGBColorSpace, spec, options),
    roughness: createMapTexture(canvases.roughness, THREE.NoColorSpace, spec, options),
    height: createMapTexture(canvases.height, THREE.NoColorSpace, spec, options),
    normal: createMapTexture(canvases.normal, THREE.NoColorSpace, spec, options),
    ao: createMapTexture(canvases.ao, THREE.NoColorSpace, spec, options),
    source: 'procedural',
  };
}

function createSculptMaterial(id: string, spec: SculptMaterialSpec, options: ProceduralModelOptions): THREE.MeshPhysicalMaterial {
  const textures = makeReferenceTextureSet(spec, options) ?? makeProceduralTextureSet(id, spec, options);
  const material = new THREE.MeshPhysicalMaterial({
    color: textures ? 0xffffff : new THREE.Color(typeof spec.baseColor === 'string' ? spec.baseColor : '#8A7A5F'),
    roughness: textures ? 1 : clamp01(readLayerNumber(spec.roughness, ['base'], 0.76)),
    metalness: clamp01(readLayerNumber(spec.metalness, ['base'], 0.0)),
    clearcoat: clamp01(readLayerNumber(spec.clearcoat, ['base', 'amount'], 0)),
    clearcoatRoughness: clamp01(readLayerNumber(spec.clearcoatRoughness, ['base'], 0.25)),
    transmission: clamp01(readLayerNumber(spec.transmission, ['base', 'amount'], 0)),
    ior: Math.max(1, readLayerNumber(spec.ior, ['base', 'value'], 1.5)),
    thickness: Math.max(0, readLayerNumber(spec.thickness, ['base', 'amount'], 0)),
    attenuationDistance: Math.max(0.001, readLayerNumber(spec.attenuationDistance, ['base', 'value'], Infinity)),
    attenuationColor: new THREE.Color(typeof spec.attenuationColor === 'string' ? spec.attenuationColor : '#ffffff'),
    sheen: clamp01(readLayerNumber(spec.sheen, ['base', 'amount'], 0)),
    sheenColor: new THREE.Color(typeof spec.sheenColor === 'string' ? spec.sheenColor : '#ffffff'),
    sheenRoughness: clamp01(readLayerNumber(spec.sheenRoughness, ['base'], 1.0)),
    iridescence: clamp01(readLayerNumber(spec.iridescence, ['base', 'amount'], 0)),
    iridescenceIOR: Math.max(1, readLayerNumber(spec.iridescenceIOR, ['base', 'value'], 1.3)),
    anisotropy: clamp01(readLayerNumber(spec.anisotropy, ['base', 'amount'], 0)),
    anisotropyRotation: readLayerNumber(spec.anisotropy, ['rotation'], 0),
    specularIntensity: clamp01(readLayerNumber(spec.specularIntensity, ['base'], 1.0)),
    specularColor: new THREE.Color(typeof spec.specularColor === 'string' ? spec.specularColor : '#ffffff'),
    emissive: new THREE.Color(typeof spec.emissive === 'string' ? spec.emissive : '#000000'),
    emissiveIntensity: Math.max(0, readLayerNumber(spec.emissiveIntensity, ['base'], 1.0)),
    opacity: clamp01(readLayerNumber(spec.opacity, ['base'], 1)),
    transparent: readLayerNumber(spec.transmission, ['base', 'amount'], 0) > 0 || readLayerNumber(spec.opacity, ['base'], 1) < 1,
    alphaTest: Math.max(0, readLayerNumber(spec.alpha, ['cutoff', 'alphaTest'], 0)),
    wireframe: options.wireframe ?? false,
    side: spec.doubleSided === true ? THREE.DoubleSide : THREE.FrontSide,
  });
  if (textures) {
    material.map = textures.albedo;
    material.roughnessMap = textures.roughness;
    material.normalMap = textures.normal;
    material.normalScale.setScalar(Math.max(0.05, readLayerNumber(spec.normal, ['strength', 'amplitude'], 0.35)));
    material.aoMap = textures.ao;
    material.aoMap.channel = 0;
    material.aoMapIntensity = readLayerNumber(spec.ambientOcclusion, ['cavityStrength', 'strength'], 0.35);
    const bumpScale = Math.max(0, readLayerNumber(spec.bump, ['amplitude', 'strength'], 0));
    if (bumpScale > 0) {
      material.bumpMap = textures.height;
      material.bumpScale = bumpScale;
    }
    const displacementScale = Math.max(0, readLayerNumber(spec.displacement, ['amplitude', 'strength'], 0));
    if (displacementScale > 0) {
      material.displacementMap = textures.height;
      material.displacementScale = displacementScale;
      material.displacementBias = -displacementScale * 0.5;
    }
  }
  material.envMapIntensity = readLayerNumber(spec, ['envMapIntensity'], 0.8);
  material.userData.sculptMaterial = spec;
  material.userData.proceduralMapsIndependent = true;
  material.userData.pbrTextureSource = textures?.source ?? 'flat-fallback';
  material.userData.referencePbr = spec.referencePbr ?? null;
  material.needsUpdate = true;
  return material;
}

type AttachmentEndpoint = {
  start: THREE.Vector3;
  midpoint: THREE.Vector3;
  quaternion: THREE.Quaternion;
  length: number;
  baseRadius: number;
  endRadius: number;
};

function readVector3(value: unknown, fallback: [number, number, number]): THREE.Vector3 {
  if (Array.isArray(value) && value.length === 3 && value.every((item) => typeof item === 'number')) {
    return new THREE.Vector3(value[0], value[1], value[2]);
  }
  return new THREE.Vector3(fallback[0], fallback[1], fallback[2]);
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function makeAttachmentEndpoint(attachment: unknown): AttachmentEndpoint | null {
  if (!attachment || typeof attachment !== 'object') return null;
  const record = attachment as Record<string, unknown>;
  const start = readVector3(record.localStart, [0, 0, 0]);
  const end = readVector3(record.localEnd, [0, 1, 0]);
  const delta = end.clone().sub(start);
  const length = delta.length();
  if (length <= 0.0001) return null;
  const direction = delta.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  const baseRadius = Math.max(0.005, readNumber(record.baseRadius, 0.06));
  const endRadius = Math.max(0.003, readNumber(record.endRadius, baseRadius * 0.55));
  return {
    start,
    midpoint: delta.multiplyScalar(0.5),
    quaternion,
    length,
    baseRadius,
    endRadius,
  };
}

// Generated from ObjectSculptSpec target: Code Lieshout Cactus Knight
// Sculpt build pass: blockout
// This factory is intentionally pass-gated. Finish browser screenshot review before unlocking deeper passes.
export function createCodeLieshoutCactusKnightModel(options: ProceduralModelOptions = {}): THREE.Group {
  const root = new THREE.Group();
  root.name = "Code Lieshout Cactus Knight";

  const materialMap: Record<string, THREE.Material> = {};
  materialMap["hidden"] = createSculptMaterial(
    "hidden",
    {"id": "hidden", "name": "Hidden utility", "type": "standard", "shaderModel": "MeshStandardMaterial / PBR approximation", "baseColor": "#101410", "color": "#101410", "albedo": {"dominant": "#101410", "secondary": ["#101410"]}, "colorVariation": {"palette": ["#101410", "#101410"], "pattern": "vertical watercolor-like tonal drift", "amplitude": 0.12, "heightCorrelation": 0.25}, "textureResolution": 1024, "textureProjection": {"mode": "uv", "repeat": [2.0, 2.0], "anisotropy": 8, "texelDensityIntent": "Preserve stable world/object-scale detail; do not stretch micro detail with component scale."}, "surfaceFrequencyBands": [{"id": "macro", "frequency": 2.0, "amplitude": 0.42, "role": "broad color and height breakup"}, {"id": "meso", "frequency": 12.0, "amplitude": 0.22, "role": "ridges, pores, grain, dents, or equivalent visible relief"}, {"id": "micro", "frequency": 56.0, "amplitude": 0.08, "role": "highlight breakup visible under grazing light"}], "roughness": {"base": 1, "variation": 0.08, "map": "procedural://hidden-roughness"}, "metalness": {"base": 0, "variation": 0}, "normal": {"pattern": "independent procedural micro-height", "strength": 0, "scale": 24, "space": "tangent"}, "bump": {"pattern": "none", "amplitude": 0.0, "scale": 1.0}, "displacement": {"pattern": "none", "amplitude": 0.0, "scale": 1.0, "silhouetteAffects": false}, "ambientOcclusion": {"cavityStrength": 0.28, "contactShadowBias": 0.34, "notes": "Independent cavity and contact response."}, "wear": {"edgeWear": 0.0, "scratches": [], "chips": []}, "dirt": {"amount": 0.0, "cavityBias": 0.0, "color": "#2F2A22"}, "localOverrides": [{"id": "utilityMask", "region": "container only", "opacity": 0}], "shaderNotes": ["Prefer MeshPhysicalMaterial when clearcoat, sheen, transmission, or thin-surface response is observed; otherwise use MeshStandardMaterial-compatible PBR channels.", "Generate albedo, roughness, height/normal, and AO independently; never alias albedo into roughness.", "Use normal/bump/displacement only when they map to observed surface relief.", "Use displacement geometry when the observed relief changes the close-up silhouette; texture-only relief is insufficient there."], "notes": "Derived from the admitted illustration views; stylized PBR, not inverse-rendered photography.", "qualityTier": "utility", "opacity": {"base": 0}},
    options
  );
  materialMap["cactus-green"] = createSculptMaterial(
    "cactus-green",
    {"id": "cactus-green", "name": "Ribbed cactus skin", "type": "standard", "shaderModel": "MeshStandardMaterial / PBR approximation", "baseColor": "#78A93F", "color": "#78A93F", "albedo": {"dominant": "#78A93F", "secondary": ["#A7CF62", "#426E2F"]}, "colorVariation": {"palette": ["#78A93F", "#A7CF62", "#426E2F"], "pattern": "vertical watercolor-like tonal drift", "amplitude": 0.12, "heightCorrelation": 0.25}, "textureResolution": 1024, "textureProjection": {"mode": "uv", "repeat": [2.0, 2.0], "anisotropy": 8, "texelDensityIntent": "Preserve stable world/object-scale detail; do not stretch micro detail with component scale."}, "surfaceFrequencyBands": [{"id": "macro", "frequency": 2.0, "amplitude": 0.42, "role": "broad color and height breakup"}, {"id": "meso", "frequency": 12.0, "amplitude": 0.22, "role": "ridges, pores, grain, dents, or equivalent visible relief"}, {"id": "micro", "frequency": 56.0, "amplitude": 0.08, "role": "highlight breakup visible under grazing light"}], "roughness": {"base": 0.68, "variation": 0.08, "map": "procedural://cactus-green-roughness"}, "metalness": {"base": 0, "variation": 0}, "normal": {"pattern": "independent procedural micro-height", "strength": 0.28, "scale": 24, "space": "tangent"}, "bump": {"pattern": "none", "amplitude": 0.0, "scale": 1.0}, "displacement": {"pattern": "none", "amplitude": 0.0, "scale": 1.0, "silhouetteAffects": false}, "ambientOcclusion": {"cavityStrength": 0.28, "contactShadowBias": 0.34, "notes": "Independent cavity and contact response."}, "wear": {"edgeWear": 0.0, "scratches": [], "chips": []}, "dirt": {"amount": 0.0, "cavityBias": 0.0, "color": "#2F2A22"}, "localOverrides": [{"id": "ribHighlights", "region": "raised vertical ribs", "color": "#A7CF62", "roughness": 0.58}, {"id": "stickerHalo", "region": "outer presentation contour", "color": "#F5F5E9", "roughness": 0.9}], "shaderNotes": ["Prefer MeshPhysicalMaterial when clearcoat, sheen, transmission, or thin-surface response is observed; otherwise use MeshStandardMaterial-compatible PBR channels.", "Generate albedo, roughness, height/normal, and AO independently; never alias albedo into roughness.", "Use normal/bump/displacement only when they map to observed surface relief.", "Use displacement geometry when the observed relief changes the close-up silhouette; texture-only relief is insufficient there."], "notes": "Derived from the admitted illustration views; stylized PBR, not inverse-rendered photography.", "qualityTier": "hero"},
    options
  );
  materialMap["helmet-metal"] = createSculptMaterial(
    "helmet-metal",
    {"id": "helmet-metal", "name": "Warm brushed steel", "type": "standard", "shaderModel": "MeshStandardMaterial / PBR approximation", "baseColor": "#B7B5A8", "color": "#B7B5A8", "albedo": {"dominant": "#B7B5A8", "secondary": ["#E6E0CB", "#697078"]}, "colorVariation": {"palette": ["#B7B5A8", "#E6E0CB", "#697078"], "pattern": "vertical watercolor-like tonal drift", "amplitude": 0.12, "heightCorrelation": 0.25}, "textureResolution": 1024, "textureProjection": {"mode": "uv", "repeat": [2.0, 2.0], "anisotropy": 8, "texelDensityIntent": "Preserve stable world/object-scale detail; do not stretch micro detail with component scale."}, "surfaceFrequencyBands": [{"id": "macro", "frequency": 2.0, "amplitude": 0.42, "role": "broad color and height breakup"}, {"id": "meso", "frequency": 12.0, "amplitude": 0.22, "role": "ridges, pores, grain, dents, or equivalent visible relief"}, {"id": "micro", "frequency": 56.0, "amplitude": 0.08, "role": "highlight breakup visible under grazing light"}], "roughness": {"base": 0.3, "variation": 0.08, "map": "procedural://helmet-metal-roughness"}, "metalness": {"base": 0.82, "variation": 0.04}, "normal": {"pattern": "independent procedural micro-height", "strength": 0.18, "scale": 24, "space": "tangent"}, "bump": {"pattern": "none", "amplitude": 0.0, "scale": 1.0}, "displacement": {"pattern": "none", "amplitude": 0.0, "scale": 1.0, "silhouetteAffects": false}, "ambientOcclusion": {"cavityStrength": 0.28, "contactShadowBias": 0.34, "notes": "Independent cavity and contact response."}, "wear": {"edgeWear": 0.0, "scratches": [], "chips": []}, "dirt": {"amount": 0.0, "cavityBias": 0.0, "color": "#2F2A22"}, "localOverrides": [{"id": "domeFinish", "region": "helmet dome and straps", "color": "#C9C5B5", "roughness": 0.24}, {"id": "edgeShade", "region": "band and visor lower edges", "color": "#777A75", "roughness": 0.38}], "shaderNotes": ["Prefer MeshPhysicalMaterial when clearcoat, sheen, transmission, or thin-surface response is observed; otherwise use MeshStandardMaterial-compatible PBR channels.", "Generate albedo, roughness, height/normal, and AO independently; never alias albedo into roughness.", "Use normal/bump/displacement only when they map to observed surface relief.", "Use displacement geometry when the observed relief changes the close-up silhouette; texture-only relief is insufficient there."], "notes": "Derived from the admitted illustration views; stylized PBR, not inverse-rendered photography.", "qualityTier": "hero"},
    options
  );
  materialMap["ink-black"] = createSculptMaterial(
    "ink-black",
    {"id": "ink-black", "name": "Mascot ink", "type": "standard", "shaderModel": "MeshStandardMaterial / PBR approximation", "baseColor": "#111713", "color": "#111713", "albedo": {"dominant": "#111713", "secondary": ["#050706"]}, "colorVariation": {"palette": ["#111713", "#050706"], "pattern": "vertical watercolor-like tonal drift", "amplitude": 0.12, "heightCorrelation": 0.25}, "textureResolution": 1024, "textureProjection": {"mode": "uv", "repeat": [2.0, 2.0], "anisotropy": 8, "texelDensityIntent": "Preserve stable world/object-scale detail; do not stretch micro detail with component scale."}, "surfaceFrequencyBands": [{"id": "macro", "frequency": 2.0, "amplitude": 0.42, "role": "broad color and height breakup"}, {"id": "meso", "frequency": 12.0, "amplitude": 0.22, "role": "ridges, pores, grain, dents, or equivalent visible relief"}, {"id": "micro", "frequency": 56.0, "amplitude": 0.08, "role": "highlight breakup visible under grazing light"}], "roughness": {"base": 0.82, "variation": 0.08, "map": "procedural://ink-black-roughness"}, "metalness": {"base": 0, "variation": 0}, "normal": {"pattern": "independent procedural micro-height", "strength": 0.05, "scale": 24, "space": "tangent"}, "bump": {"pattern": "none", "amplitude": 0.0, "scale": 1.0}, "displacement": {"pattern": "none", "amplitude": 0.0, "scale": 1.0, "silhouetteAffects": false}, "ambientOcclusion": {"cavityStrength": 0.28, "contactShadowBias": 0.34, "notes": "Independent cavity and contact response."}, "wear": {"edgeWear": 0.0, "scratches": [], "chips": []}, "dirt": {"amount": 0.0, "cavityBias": 0.0, "color": "#2F2A22"}, "localOverrides": [{"id": "eyeInk", "region": "eyes brows slots and outline", "color": "#080B08", "roughness": 0.86}], "shaderNotes": ["Prefer MeshPhysicalMaterial when clearcoat, sheen, transmission, or thin-surface response is observed; otherwise use MeshStandardMaterial-compatible PBR channels.", "Generate albedo, roughness, height/normal, and AO independently; never alias albedo into roughness.", "Use normal/bump/displacement only when they map to observed surface relief.", "Use displacement geometry when the observed relief changes the close-up silhouette; texture-only relief is insufficient there."], "notes": "Derived from the admitted illustration views; stylized PBR, not inverse-rendered photography.", "qualityTier": "hero"},
    options
  );
  materialMap["tablet-silver"] = createSculptMaterial(
    "tablet-silver",
    {"id": "tablet-silver", "name": "Satin tablet", "type": "standard", "shaderModel": "MeshStandardMaterial / PBR approximation", "baseColor": "#C8C8C1", "color": "#C8C8C1", "albedo": {"dominant": "#C8C8C1", "secondary": ["#F0EDE0", "#6E7374"]}, "colorVariation": {"palette": ["#C8C8C1", "#F0EDE0", "#6E7374"], "pattern": "vertical watercolor-like tonal drift", "amplitude": 0.12, "heightCorrelation": 0.25}, "textureResolution": 1024, "textureProjection": {"mode": "uv", "repeat": [2.0, 2.0], "anisotropy": 8, "texelDensityIntent": "Preserve stable world/object-scale detail; do not stretch micro detail with component scale."}, "surfaceFrequencyBands": [{"id": "macro", "frequency": 2.0, "amplitude": 0.42, "role": "broad color and height breakup"}, {"id": "meso", "frequency": 12.0, "amplitude": 0.22, "role": "ridges, pores, grain, dents, or equivalent visible relief"}, {"id": "micro", "frequency": 56.0, "amplitude": 0.08, "role": "highlight breakup visible under grazing light"}], "roughness": {"base": 0.34, "variation": 0.08, "map": "procedural://tablet-silver-roughness"}, "metalness": {"base": 0.72, "variation": 0.04}, "normal": {"pattern": "independent procedural micro-height", "strength": 0.12, "scale": 24, "space": "tangent"}, "bump": {"pattern": "none", "amplitude": 0.0, "scale": 1.0}, "displacement": {"pattern": "none", "amplitude": 0.0, "scale": 1.0, "silhouetteAffects": false}, "ambientOcclusion": {"cavityStrength": 0.28, "contactShadowBias": 0.34, "notes": "Independent cavity and contact response."}, "wear": {"edgeWear": 0.0, "scratches": [], "chips": []}, "dirt": {"amount": 0.0, "cavityBias": 0.0, "color": "#2F2A22"}, "localOverrides": [{"id": "tabletEdge", "region": "beveled perimeter", "color": "#43494A", "roughness": 0.46}], "shaderNotes": ["Prefer MeshPhysicalMaterial when clearcoat, sheen, transmission, or thin-surface response is observed; otherwise use MeshStandardMaterial-compatible PBR channels.", "Generate albedo, roughness, height/normal, and AO independently; never alias albedo into roughness.", "Use normal/bump/displacement only when they map to observed surface relief.", "Use displacement geometry when the observed relief changes the close-up silhouette; texture-only relief is insufficient there."], "notes": "Derived from the admitted illustration views; stylized PBR, not inverse-rendered photography.", "qualityTier": "hero"},
    options
  );

  const nodes: Record<string, THREE.Object3D> = { root };
  const meshes: Record<string, THREE.Mesh> = {};
  const sockets: Record<string, THREE.Object3D> = {};
  const colliders: Record<string, unknown> = {};
  const destructionGroups: Record<string, THREE.Object3D[]> = {};

  const attachment_root_0 = null;
  const endpoint_root_0 = makeAttachmentEndpoint(attachment_root_0);
  const node_root_0 = new THREE.Group();
  node_root_0.name = "Cactus Knight Root__pivot";
  if (endpoint_root_0) {
    node_root_0.position.copy(endpoint_root_0.start);
    node_root_0.rotation.set(0, 0, 0);
    node_root_0.scale.set(1, 1, 1);
  } else {
    node_root_0.position.set(0.0, 0.0, 0.0);
    node_root_0.rotation.set(0.0, 0.0, 0.0);
    node_root_0.scale.set(1.0, 1.0, 1.0);
  }
  node_root_0.userData.sculptComponent = {"id": "root", "name": "Cactus Knight Root", "level": "macro", "role": "static-part", "importance": 1, "confidence": 0.92, "primitive": "box", "topologyClass": "material-only", "topologyRationale": "Cactus Knight Root is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": null, "attachment": null, "dimensions": {"width": 1, "height": 1, "depth": 1, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "root", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "root", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hidden"}}, "material": "hidden", "materialLayers": ["hidden"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(16, 20, 16, 0.0)", "secondaryAlbedo": "rgba(16, 20, 16, 0.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_root_0.userData.actionProfile = {"animationRole": "root", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "root", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hidden"}};
  (nodes["root"] ?? root).add(node_root_0);
  nodes["root"] = node_root_0;
  const mesh_root_0Geometry = endpoint_root_0
    ? new THREE.CylinderGeometry(endpoint_root_0.endRadius, endpoint_root_0.baseRadius, endpoint_root_0.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_root_0 = new THREE.Mesh(
    mesh_root_0Geometry,
    materialMap["hidden"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_root_0.name = "Cactus Knight Root";
  if (endpoint_root_0) {
    mesh_root_0.position.copy(endpoint_root_0.midpoint);
    mesh_root_0.quaternion.copy(endpoint_root_0.quaternion);
  }
  mesh_root_0.castShadow = options.castShadow ?? true;
  mesh_root_0.receiveShadow = options.receiveShadow ?? true;
  mesh_root_0.userData.sculptComponent = {"id": "root", "name": "Cactus Knight Root", "level": "macro", "role": "static-part", "importance": 1, "confidence": 0.92, "primitive": "box", "topologyClass": "material-only", "topologyRationale": "Cactus Knight Root is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": null, "attachment": null, "dimensions": {"width": 1, "height": 1, "depth": 1, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "root", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "root", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "hidden"}}, "material": "hidden", "materialLayers": ["hidden"], "deformations": [], "joints": [], "seams": [], "localFeatures": [], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(16, 20, 16, 0.0)", "secondaryAlbedo": "rgba(16, 20, 16, 0.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_root_0.add(mesh_root_0);
  meshes["root"] = mesh_root_0;
  colliders["root"] = {"type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["root"] ??= [];
  destructionGroups["root"].push(node_root_0);

  const attachment_body_1 = {"parentId": "root", "parentSocket": "root-surface", "localStart": [0, 0, 0], "localEnd": [0, 3.15, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_body_1 = makeAttachmentEndpoint(attachment_body_1);
  const node_body_1 = new THREE.Group();
  node_body_1.name = "Rounded ribbed cactus body__pivot";
  if (endpoint_body_1) {
    node_body_1.position.copy(endpoint_body_1.start);
    node_body_1.rotation.set(0, 0, 0);
    node_body_1.scale.set(1, 1, 1);
  } else {
    node_body_1.position.set(0.0, 1.95, 0.0);
    node_body_1.rotation.set(0.0, 0.0, 0.0);
    node_body_1.scale.set(1.0, 1.0, 1.0);
  }
  node_body_1.userData.sculptComponent = {"id": "body", "name": "Rounded ribbed cactus body", "level": "macro", "role": "static-part", "importance": 1, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Rounded ribbed cactus body is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": {"parentId": "root", "parentSocket": "root-surface", "localStart": [0, 0, 0], "localEnd": [0, 3.15, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 2.2, "height": 3.15, "depth": 1.35, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 1.95, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [2.2, 3.15, 1.35], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "body", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "verticalRibs", "type": "ridge", "count": 6}, {"id": "spineClusters", "type": "fastener", "distribution": "sparse along rib seams"}, {"id": "angryEyes", "type": "face-system", "placement": "front upper third"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_body_1.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [2.2, 3.15, 1.35], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "body", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}};
  (nodes["root"] ?? root).add(node_body_1);
  nodes["body"] = node_body_1;
  const mesh_body_1Geometry = endpoint_body_1
    ? new THREE.CylinderGeometry(endpoint_body_1.endRadius, endpoint_body_1.baseRadius, endpoint_body_1.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_body_1 = new THREE.Mesh(
    mesh_body_1Geometry,
    materialMap["cactus-green"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_body_1.name = "Rounded ribbed cactus body";
  if (endpoint_body_1) {
    mesh_body_1.position.copy(endpoint_body_1.midpoint);
    mesh_body_1.quaternion.copy(endpoint_body_1.quaternion);
  }
  mesh_body_1.castShadow = options.castShadow ?? true;
  mesh_body_1.receiveShadow = options.receiveShadow ?? true;
  mesh_body_1.userData.sculptComponent = {"id": "body", "name": "Rounded ribbed cactus body", "level": "macro", "role": "static-part", "importance": 1, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Rounded ribbed cactus body is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "root", "attachment": {"parentId": "root", "parentSocket": "root-surface", "localStart": [0, 0, 0], "localEnd": [0, 3.15, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 2.2, "height": 3.15, "depth": 1.35, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 1.95, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [2.2, 3.15, 1.35], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "body", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "verticalRibs", "type": "ridge", "count": 6}, {"id": "spineClusters", "type": "fastener", "distribution": "sparse along rib seams"}, {"id": "angryEyes", "type": "face-system", "placement": "front upper third"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_body_1.add(mesh_body_1);
  meshes["body"] = mesh_body_1;
  colliders["body"] = {"type": "capsule", "offset": [0, 0, 0], "scale": [2.2, 3.15, 1.35], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["body"] ??= [];
  destructionGroups["body"].push(node_body_1);

  const attachment_left_arm_2 = {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.55, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_left_arm_2 = makeAttachmentEndpoint(attachment_left_arm_2);
  const node_left_arm_2 = new THREE.Group();
  node_left_arm_2.name = "Left tapered cactus arm__pivot";
  if (endpoint_left_arm_2) {
    node_left_arm_2.position.copy(endpoint_left_arm_2.start);
    node_left_arm_2.rotation.set(0, 0, 0);
    node_left_arm_2.scale.set(1, 1, 1);
  } else {
    node_left_arm_2.position.set(-1.08, 1.75, -0.04);
    node_left_arm_2.rotation.set(0.0, 0.0, 0.55);
    node_left_arm_2.scale.set(1.0, 1.0, 1.0);
  }
  node_left_arm_2.userData.sculptComponent = {"id": "left-arm", "name": "Left tapered cactus arm", "level": "meso", "role": "arm", "importance": 0.8, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Left tapered cactus arm is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.55, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.55, "height": 1.55, "depth": 0.58, "units": "world", "confidence": 0.92}, "transform": {"position": [-1.08, 1.75, -0.04], "rotation": [0, 0, 0.55], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "arm", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.55, 1.55, 0.58], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-arm", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "armRibGrooves", "type": "groove", "count": 3}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_left_arm_2.userData.actionProfile = {"animationRole": "arm", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.55, 1.55, 0.58], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-arm", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}};
  (nodes["body"] ?? root).add(node_left_arm_2);
  nodes["left-arm"] = node_left_arm_2;
  const mesh_left_arm_2Geometry = endpoint_left_arm_2
    ? new THREE.CylinderGeometry(endpoint_left_arm_2.endRadius, endpoint_left_arm_2.baseRadius, endpoint_left_arm_2.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_left_arm_2 = new THREE.Mesh(
    mesh_left_arm_2Geometry,
    materialMap["cactus-green"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_left_arm_2.name = "Left tapered cactus arm";
  if (endpoint_left_arm_2) {
    mesh_left_arm_2.position.copy(endpoint_left_arm_2.midpoint);
    mesh_left_arm_2.quaternion.copy(endpoint_left_arm_2.quaternion);
  }
  mesh_left_arm_2.castShadow = options.castShadow ?? true;
  mesh_left_arm_2.receiveShadow = options.receiveShadow ?? true;
  mesh_left_arm_2.userData.sculptComponent = {"id": "left-arm", "name": "Left tapered cactus arm", "level": "meso", "role": "arm", "importance": 0.8, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Left tapered cactus arm is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.55, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.55, "height": 1.55, "depth": 0.58, "units": "world", "confidence": 0.92}, "transform": {"position": [-1.08, 1.75, -0.04], "rotation": [0, 0, 0.55], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "arm", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.55, 1.55, 0.58], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-arm", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "armRibGrooves", "type": "groove", "count": 3}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_left_arm_2.add(mesh_left_arm_2);
  meshes["left-arm"] = mesh_left_arm_2;
  colliders["left-arm"] = {"type": "capsule", "offset": [0, 0, 0], "scale": [0.55, 1.55, 0.58], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["left-arm"] ??= [];
  destructionGroups["left-arm"].push(node_left_arm_2);

  const attachment_right_arm_3 = {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.5, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_right_arm_3 = makeAttachmentEndpoint(attachment_right_arm_3);
  const node_right_arm_3 = new THREE.Group();
  node_right_arm_3.name = "Right tapered cactus arm__pivot";
  if (endpoint_right_arm_3) {
    node_right_arm_3.position.copy(endpoint_right_arm_3.start);
    node_right_arm_3.rotation.set(0, 0, 0);
    node_right_arm_3.scale.set(1, 1, 1);
  } else {
    node_right_arm_3.position.set(1.02, 1.72, 0.18);
    node_right_arm_3.rotation.set(0.0, 0.0, -0.36);
    node_right_arm_3.scale.set(1.0, 1.0, 1.0);
  }
  node_right_arm_3.userData.sculptComponent = {"id": "right-arm", "name": "Right tapered cactus arm", "level": "meso", "role": "arm", "importance": 0.8, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Right tapered cactus arm is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.5, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.55, "height": 1.5, "depth": 0.58, "units": "world", "confidence": 0.92}, "transform": {"position": [1.02, 1.72, 0.18], "rotation": [0, 0, -0.36], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "arm", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.55, 1.5, 0.58], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-arm", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightArmGrooves", "type": "groove", "count": 3}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_right_arm_3.userData.actionProfile = {"animationRole": "arm", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.55, 1.5, 0.58], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-arm", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}};
  (nodes["body"] ?? root).add(node_right_arm_3);
  nodes["right-arm"] = node_right_arm_3;
  const mesh_right_arm_3Geometry = endpoint_right_arm_3
    ? new THREE.CylinderGeometry(endpoint_right_arm_3.endRadius, endpoint_right_arm_3.baseRadius, endpoint_right_arm_3.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_right_arm_3 = new THREE.Mesh(
    mesh_right_arm_3Geometry,
    materialMap["cactus-green"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_right_arm_3.name = "Right tapered cactus arm";
  if (endpoint_right_arm_3) {
    mesh_right_arm_3.position.copy(endpoint_right_arm_3.midpoint);
    mesh_right_arm_3.quaternion.copy(endpoint_right_arm_3.quaternion);
  }
  mesh_right_arm_3.castShadow = options.castShadow ?? true;
  mesh_right_arm_3.receiveShadow = options.receiveShadow ?? true;
  mesh_right_arm_3.userData.sculptComponent = {"id": "right-arm", "name": "Right tapered cactus arm", "level": "meso", "role": "arm", "importance": 0.8, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Right tapered cactus arm is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.5, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.55, "height": 1.5, "depth": 0.58, "units": "world", "confidence": 0.92}, "transform": {"position": [1.02, 1.72, 0.18], "rotation": [0, 0, -0.36], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "arm", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.55, 1.5, 0.58], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-arm", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightArmGrooves", "type": "groove", "count": 3}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_right_arm_3.add(mesh_right_arm_3);
  meshes["right-arm"] = mesh_right_arm_3;
  colliders["right-arm"] = {"type": "capsule", "offset": [0, 0, 0], "scale": [0.55, 1.5, 0.58], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["right-arm"] ??= [];
  destructionGroups["right-arm"].push(node_right_arm_3);

  const attachment_left_foot_4 = {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.92, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_left_foot_4 = makeAttachmentEndpoint(attachment_left_foot_4);
  const node_left_foot_4 = new THREE.Group();
  node_left_foot_4.name = "Left rounded foot__pivot";
  if (endpoint_left_foot_4) {
    node_left_foot_4.position.copy(endpoint_left_foot_4.start);
    node_left_foot_4.rotation.set(0, 0, 0);
    node_left_foot_4.scale.set(1, 1, 1);
  } else {
    node_left_foot_4.position.set(-0.48, 0.45, 0.0);
    node_left_foot_4.rotation.set(0.0, 0.0, 0.0);
    node_left_foot_4.scale.set(1.0, 1.0, 1.0);
  }
  node_left_foot_4.userData.sculptComponent = {"id": "left-foot", "name": "Left rounded foot", "level": "macro", "role": "leg", "importance": 0.8, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Left rounded foot is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.92, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.82, "height": 0.92, "depth": 0.85, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.48, 0.45, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "leg", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.82, 0.92, 0.85], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-foot", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "centerSplit", "type": "negative-space", "side": "left"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_left_foot_4.userData.actionProfile = {"animationRole": "leg", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.82, 0.92, 0.85], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-foot", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}};
  (nodes["body"] ?? root).add(node_left_foot_4);
  nodes["left-foot"] = node_left_foot_4;
  const mesh_left_foot_4Geometry = endpoint_left_foot_4
    ? new THREE.CylinderGeometry(endpoint_left_foot_4.endRadius, endpoint_left_foot_4.baseRadius, endpoint_left_foot_4.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_left_foot_4 = new THREE.Mesh(
    mesh_left_foot_4Geometry,
    materialMap["cactus-green"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_left_foot_4.name = "Left rounded foot";
  if (endpoint_left_foot_4) {
    mesh_left_foot_4.position.copy(endpoint_left_foot_4.midpoint);
    mesh_left_foot_4.quaternion.copy(endpoint_left_foot_4.quaternion);
  }
  mesh_left_foot_4.castShadow = options.castShadow ?? true;
  mesh_left_foot_4.receiveShadow = options.receiveShadow ?? true;
  mesh_left_foot_4.userData.sculptComponent = {"id": "left-foot", "name": "Left rounded foot", "level": "macro", "role": "leg", "importance": 0.8, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Left rounded foot is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.92, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.82, "height": 0.92, "depth": 0.85, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.48, 0.45, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "leg", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.82, 0.92, 0.85], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-foot", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "centerSplit", "type": "negative-space", "side": "left"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_left_foot_4.add(mesh_left_foot_4);
  meshes["left-foot"] = mesh_left_foot_4;
  colliders["left-foot"] = {"type": "capsule", "offset": [0, 0, 0], "scale": [0.82, 0.92, 0.85], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["left-foot"] ??= [];
  destructionGroups["left-foot"].push(node_left_foot_4);

  const attachment_right_foot_5 = {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.92, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_right_foot_5 = makeAttachmentEndpoint(attachment_right_foot_5);
  const node_right_foot_5 = new THREE.Group();
  node_right_foot_5.name = "Right rounded foot__pivot";
  if (endpoint_right_foot_5) {
    node_right_foot_5.position.copy(endpoint_right_foot_5.start);
    node_right_foot_5.rotation.set(0, 0, 0);
    node_right_foot_5.scale.set(1, 1, 1);
  } else {
    node_right_foot_5.position.set(0.48, 0.45, 0.0);
    node_right_foot_5.rotation.set(0.0, 0.0, 0.0);
    node_right_foot_5.scale.set(1.0, 1.0, 1.0);
  }
  node_right_foot_5.userData.sculptComponent = {"id": "right-foot", "name": "Right rounded foot", "level": "macro", "role": "leg", "importance": 0.8, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Right rounded foot is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.92, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.82, "height": 0.92, "depth": 0.85, "units": "world", "confidence": 0.92}, "transform": {"position": [0.48, 0.45, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "leg", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.82, 0.92, 0.85], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-foot", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightFootRibs", "type": "ridge", "count": 2}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_right_foot_5.userData.actionProfile = {"animationRole": "leg", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.82, 0.92, 0.85], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-foot", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}};
  (nodes["body"] ?? root).add(node_right_foot_5);
  nodes["right-foot"] = node_right_foot_5;
  const mesh_right_foot_5Geometry = endpoint_right_foot_5
    ? new THREE.CylinderGeometry(endpoint_right_foot_5.endRadius, endpoint_right_foot_5.baseRadius, endpoint_right_foot_5.length, 32, 12)
    : new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
  const mesh_right_foot_5 = new THREE.Mesh(
    mesh_right_foot_5Geometry,
    materialMap["cactus-green"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_right_foot_5.name = "Right rounded foot";
  if (endpoint_right_foot_5) {
    mesh_right_foot_5.position.copy(endpoint_right_foot_5.midpoint);
    mesh_right_foot_5.quaternion.copy(endpoint_right_foot_5.quaternion);
  }
  mesh_right_foot_5.castShadow = options.castShadow ?? true;
  mesh_right_foot_5.receiveShadow = options.receiveShadow ?? true;
  mesh_right_foot_5.userData.sculptComponent = {"id": "right-foot", "name": "Right rounded foot", "level": "macro", "role": "leg", "importance": 0.8, "confidence": 0.92, "primitive": "capsule", "topologyClass": "assembled-solid", "topologyRationale": "Right rounded foot is resolved as a distinct capsule volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.92, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.82, "height": 0.92, "depth": 0.85, "units": "world", "confidence": 0.92}, "transform": {"position": [0.48, 0.45, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "leg", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.82, 0.92, 0.85], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-foot", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "cactus-green"}}, "material": "cactus-green", "materialLayers": ["cactus-green"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightFootRibs", "type": "ridge", "count": 2}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.02, "normalPattern": "vertical rib grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(120, 169, 63, 1.0)", "secondaryAlbedo": "rgba(66, 110, 47, 1.0)", "materialClass": "skin", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_right_foot_5.add(mesh_right_foot_5);
  meshes["right-foot"] = mesh_right_foot_5;
  colliders["right-foot"] = {"type": "capsule", "offset": [0, 0, 0], "scale": [0.82, 0.92, 0.85], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["right-foot"] ??= [];
  destructionGroups["right-foot"].push(node_right_foot_5);

  const attachment_helmet_dome_6 = {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.25, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_helmet_dome_6 = makeAttachmentEndpoint(attachment_helmet_dome_6);
  const node_helmet_dome_6 = new THREE.Group();
  node_helmet_dome_6.name = "Knight helmet dome__pivot";
  if (endpoint_helmet_dome_6) {
    node_helmet_dome_6.position.copy(endpoint_helmet_dome_6.start);
    node_helmet_dome_6.rotation.set(0, 0, 0);
    node_helmet_dome_6.scale.set(1, 1, 1);
  } else {
    node_helmet_dome_6.position.set(0.0, 3.85, 0.0);
    node_helmet_dome_6.rotation.set(0.0, 0.0, 0.0);
    node_helmet_dome_6.scale.set(1.0, 1.0, 1.0);
  }
  node_helmet_dome_6.userData.sculptComponent = {"id": "helmet-dome", "name": "Knight helmet dome", "level": "macro", "role": "static-part", "importance": 1, "confidence": 0.92, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Knight helmet dome is resolved as a distinct ellipsoid volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.25, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 2.28, "height": 1.25, "depth": 1.62, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 3.85, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [2.28, 1.25, 1.62], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "helmet-dome", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "crownStrap", "type": "raised-band", "orientation": "front-to-back"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_helmet_dome_6.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [2.28, 1.25, 1.62], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "helmet-dome", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}};
  (nodes["body"] ?? root).add(node_helmet_dome_6);
  nodes["helmet-dome"] = node_helmet_dome_6;
  const mesh_helmet_dome_6Geometry = endpoint_helmet_dome_6
    ? new THREE.CylinderGeometry(endpoint_helmet_dome_6.endRadius, endpoint_helmet_dome_6.baseRadius, endpoint_helmet_dome_6.length, 32, 12)
    : new THREE.SphereGeometry(0.5, 64, 40);
  const mesh_helmet_dome_6 = new THREE.Mesh(
    mesh_helmet_dome_6Geometry,
    materialMap["helmet-metal"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_helmet_dome_6.name = "Knight helmet dome";
  if (endpoint_helmet_dome_6) {
    mesh_helmet_dome_6.position.copy(endpoint_helmet_dome_6.midpoint);
    mesh_helmet_dome_6.quaternion.copy(endpoint_helmet_dome_6.quaternion);
  }
  mesh_helmet_dome_6.castShadow = options.castShadow ?? true;
  mesh_helmet_dome_6.receiveShadow = options.receiveShadow ?? true;
  mesh_helmet_dome_6.userData.sculptComponent = {"id": "helmet-dome", "name": "Knight helmet dome", "level": "macro", "role": "static-part", "importance": 1, "confidence": 0.92, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Knight helmet dome is resolved as a distinct ellipsoid volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.25, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 2.28, "height": 1.25, "depth": 1.62, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 3.85, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [2.28, 1.25, 1.62], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "helmet-dome", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "crownStrap", "type": "raised-band", "orientation": "front-to-back"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_helmet_dome_6.add(mesh_helmet_dome_6);
  meshes["helmet-dome"] = mesh_helmet_dome_6;
  colliders["helmet-dome"] = {"type": "capsule", "offset": [0, 0, 0], "scale": [2.28, 1.25, 1.62], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["helmet-dome"] ??= [];
  destructionGroups["helmet-dome"].push(node_helmet_dome_6);

  const attachment_helmet_band_7 = {"parentId": "helmet-dome", "parentSocket": "helmet-dome-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.24, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_helmet_band_7 = makeAttachmentEndpoint(attachment_helmet_band_7);
  const node_helmet_band_7 = new THREE.Group();
  node_helmet_band_7.name = "Riveted helmet band__pivot";
  if (endpoint_helmet_band_7) {
    node_helmet_band_7.position.copy(endpoint_helmet_band_7.start);
    node_helmet_band_7.rotation.set(0, 0, 0);
    node_helmet_band_7.scale.set(1, 1, 1);
  } else {
    node_helmet_band_7.position.set(0.0, 3.38, 0.0);
    node_helmet_band_7.rotation.set(0.0, 0.0, 0.0);
    node_helmet_band_7.scale.set(1.0, 1.0, 1.0);
  }
  node_helmet_band_7.userData.sculptComponent = {"id": "helmet-band", "name": "Riveted helmet band", "level": "meso", "role": "static-part", "importance": 0.92, "confidence": 0.92, "primitive": "torus", "topologyClass": "assembled-solid", "topologyRationale": "Riveted helmet band is resolved as a distinct torus volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-dome", "attachment": {"parentId": "helmet-dome", "parentSocket": "helmet-dome-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.24, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 2.38, "height": 0.24, "depth": 1.7, "radius": 1.1, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 3.38, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [2.38, 0.24, 1.7], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "helmet-band", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rivetHeads", "type": "fastener", "count": 10}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_helmet_band_7.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [2.38, 0.24, 1.7], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "helmet-band", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}};
  (nodes["helmet-dome"] ?? root).add(node_helmet_band_7);
  nodes["helmet-band"] = node_helmet_band_7;
  const mesh_helmet_band_7Geometry = endpoint_helmet_band_7
    ? new THREE.CylinderGeometry(endpoint_helmet_band_7.endRadius, endpoint_helmet_band_7.baseRadius, endpoint_helmet_band_7.length, 32, 12)
    : new THREE.TorusGeometry(0.45, 0.08, 24, 96);
  const mesh_helmet_band_7 = new THREE.Mesh(
    mesh_helmet_band_7Geometry,
    materialMap["helmet-metal"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_helmet_band_7.name = "Riveted helmet band";
  if (endpoint_helmet_band_7) {
    mesh_helmet_band_7.position.copy(endpoint_helmet_band_7.midpoint);
    mesh_helmet_band_7.quaternion.copy(endpoint_helmet_band_7.quaternion);
  }
  mesh_helmet_band_7.castShadow = options.castShadow ?? true;
  mesh_helmet_band_7.receiveShadow = options.receiveShadow ?? true;
  mesh_helmet_band_7.userData.sculptComponent = {"id": "helmet-band", "name": "Riveted helmet band", "level": "meso", "role": "static-part", "importance": 0.92, "confidence": 0.92, "primitive": "torus", "topologyClass": "assembled-solid", "topologyRationale": "Riveted helmet band is resolved as a distinct torus volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-dome", "attachment": {"parentId": "helmet-dome", "parentSocket": "helmet-dome-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.24, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 2.38, "height": 0.24, "depth": 1.7, "radius": 1.1, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 3.38, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [2.38, 0.24, 1.7], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "helmet-band", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rivetHeads", "type": "fastener", "count": 10}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_helmet_band_7.add(mesh_helmet_band_7);
  meshes["helmet-band"] = mesh_helmet_band_7;
  colliders["helmet-band"] = {"type": "box", "offset": [0, 0, 0], "scale": [2.38, 0.24, 1.7], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["helmet-band"] ??= [];
  destructionGroups["helmet-band"].push(node_helmet_band_7);

  const attachment_visor_8 = {"parentId": "helmet-band", "parentSocket": "helmet-band-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.72, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_visor_8 = makeAttachmentEndpoint(attachment_visor_8);
  const node_visor_8 = new THREE.Group();
  node_visor_8.name = "Raised slotted visor__pivot";
  if (endpoint_visor_8) {
    node_visor_8.position.copy(endpoint_visor_8.start);
    node_visor_8.rotation.set(0, 0, 0);
    node_visor_8.scale.set(1, 1, 1);
  } else {
    node_visor_8.position.set(0.0, 3.35, 0.82);
    node_visor_8.rotation.set(-0.08, 0.0, 0.0);
    node_visor_8.scale.set(1.0, 1.0, 1.0);
  }
  node_visor_8.userData.sculptComponent = {"id": "visor", "name": "Raised slotted visor", "level": "macro", "role": "hinged-panel", "importance": 1, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Raised slotted visor is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-band", "attachment": {"parentId": "helmet-band", "parentSocket": "helmet-band-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.72, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 2.08, "height": 0.72, "depth": 0.18, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 3.35, 0.82], "rotation": [-0.08, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "hinged-panel", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [2.08, 0.72, 0.18], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "visor", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventSlots", "type": "hole", "count": 5}, {"id": "sidePivots", "type": "hinge", "count": 2}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_visor_8.userData.actionProfile = {"animationRole": "hinged-panel", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [2.08, 0.72, 0.18], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "visor", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}};
  (nodes["helmet-band"] ?? root).add(node_visor_8);
  nodes["visor"] = node_visor_8;
  const mesh_visor_8Geometry = endpoint_visor_8
    ? new THREE.CylinderGeometry(endpoint_visor_8.endRadius, endpoint_visor_8.baseRadius, endpoint_visor_8.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_visor_8 = new THREE.Mesh(
    mesh_visor_8Geometry,
    materialMap["helmet-metal"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_visor_8.name = "Raised slotted visor";
  if (endpoint_visor_8) {
    mesh_visor_8.position.copy(endpoint_visor_8.midpoint);
    mesh_visor_8.quaternion.copy(endpoint_visor_8.quaternion);
  }
  mesh_visor_8.castShadow = options.castShadow ?? true;
  mesh_visor_8.receiveShadow = options.receiveShadow ?? true;
  mesh_visor_8.userData.sculptComponent = {"id": "visor", "name": "Raised slotted visor", "level": "macro", "role": "hinged-panel", "importance": 1, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Raised slotted visor is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-band", "attachment": {"parentId": "helmet-band", "parentSocket": "helmet-band-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.72, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 2.08, "height": 0.72, "depth": 0.18, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 3.35, 0.82], "rotation": [-0.08, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "hinged-panel", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [2.08, 0.72, 0.18], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "visor", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventSlots", "type": "hole", "count": 5}, {"id": "sidePivots", "type": "hinge", "count": 2}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_visor_8.add(mesh_visor_8);
  meshes["visor"] = mesh_visor_8;
  colliders["visor"] = {"type": "box", "offset": [0, 0, 0], "scale": [2.08, 0.72, 0.18], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["visor"] ??= [];
  destructionGroups["visor"].push(node_visor_8);

  const attachment_crown_strap_9 = {"parentId": "helmet-dome", "parentSocket": "helmet-dome-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.1, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_crown_strap_9 = makeAttachmentEndpoint(attachment_crown_strap_9);
  const node_crown_strap_9 = new THREE.Group();
  node_crown_strap_9.name = "Helmet crown strap__pivot";
  if (endpoint_crown_strap_9) {
    node_crown_strap_9.position.copy(endpoint_crown_strap_9.start);
    node_crown_strap_9.rotation.set(0, 0, 0);
    node_crown_strap_9.scale.set(1, 1, 1);
  } else {
    node_crown_strap_9.position.set(0.0, 4.12, 0.72);
    node_crown_strap_9.rotation.set(-0.62, 0.0, 0.0);
    node_crown_strap_9.scale.set(1.0, 1.0, 1.0);
  }
  node_crown_strap_9.userData.sculptComponent = {"id": "crown-strap", "name": "Helmet crown strap", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Helmet crown strap is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-dome", "attachment": {"parentId": "helmet-dome", "parentSocket": "helmet-dome-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.1, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.28, "height": 1.1, "depth": 0.09, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 4.12, 0.72], "rotation": [-0.62, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.28, 1.1, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "crown-strap", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "strapRivets", "type": "fastener", "count": 4}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_crown_strap_9.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.28, 1.1, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "crown-strap", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}};
  (nodes["helmet-dome"] ?? root).add(node_crown_strap_9);
  nodes["crown-strap"] = node_crown_strap_9;
  const mesh_crown_strap_9Geometry = endpoint_crown_strap_9
    ? new THREE.CylinderGeometry(endpoint_crown_strap_9.endRadius, endpoint_crown_strap_9.baseRadius, endpoint_crown_strap_9.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_crown_strap_9 = new THREE.Mesh(
    mesh_crown_strap_9Geometry,
    materialMap["helmet-metal"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_crown_strap_9.name = "Helmet crown strap";
  if (endpoint_crown_strap_9) {
    mesh_crown_strap_9.position.copy(endpoint_crown_strap_9.midpoint);
    mesh_crown_strap_9.quaternion.copy(endpoint_crown_strap_9.quaternion);
  }
  mesh_crown_strap_9.castShadow = options.castShadow ?? true;
  mesh_crown_strap_9.receiveShadow = options.receiveShadow ?? true;
  mesh_crown_strap_9.userData.sculptComponent = {"id": "crown-strap", "name": "Helmet crown strap", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Helmet crown strap is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-dome", "attachment": {"parentId": "helmet-dome", "parentSocket": "helmet-dome-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.1, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.28, "height": 1.1, "depth": 0.09, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 4.12, 0.72], "rotation": [-0.62, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.28, 1.1, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "crown-strap", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "strapRivets", "type": "fastener", "count": 4}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_crown_strap_9.add(mesh_crown_strap_9);
  meshes["crown-strap"] = mesh_crown_strap_9;
  colliders["crown-strap"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.28, 1.1, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["crown-strap"] ??= [];
  destructionGroups["crown-strap"].push(node_crown_strap_9);

  const attachment_left_eye_10 = {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.38, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_left_eye_10 = makeAttachmentEndpoint(attachment_left_eye_10);
  const node_left_eye_10 = new THREE.Group();
  node_left_eye_10.name = "Left drop eye__pivot";
  if (endpoint_left_eye_10) {
    node_left_eye_10.position.copy(endpoint_left_eye_10.start);
    node_left_eye_10.rotation.set(0, 0, 0);
    node_left_eye_10.scale.set(1, 1, 1);
  } else {
    node_left_eye_10.position.set(-0.43, 2.88, 0.7);
    node_left_eye_10.rotation.set(0.0, 0.0, 0.0);
    node_left_eye_10.scale.set(1.0, 1.0, 1.0);
  }
  node_left_eye_10.userData.sculptComponent = {"id": "left-eye", "name": "Left drop eye", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Left drop eye is resolved as a distinct ellipsoid volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.38, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.18, "height": 0.38, "depth": 0.09, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.43, 2.88, 0.7], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.18, 0.38, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-eye", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "leftEyeDrop", "type": "contour"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_left_eye_10.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.18, 0.38, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-eye", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}};
  (nodes["body"] ?? root).add(node_left_eye_10);
  nodes["left-eye"] = node_left_eye_10;
  const mesh_left_eye_10Geometry = endpoint_left_eye_10
    ? new THREE.CylinderGeometry(endpoint_left_eye_10.endRadius, endpoint_left_eye_10.baseRadius, endpoint_left_eye_10.length, 32, 12)
    : new THREE.SphereGeometry(0.5, 64, 40);
  const mesh_left_eye_10 = new THREE.Mesh(
    mesh_left_eye_10Geometry,
    materialMap["ink-black"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_left_eye_10.name = "Left drop eye";
  if (endpoint_left_eye_10) {
    mesh_left_eye_10.position.copy(endpoint_left_eye_10.midpoint);
    mesh_left_eye_10.quaternion.copy(endpoint_left_eye_10.quaternion);
  }
  mesh_left_eye_10.castShadow = options.castShadow ?? true;
  mesh_left_eye_10.receiveShadow = options.receiveShadow ?? true;
  mesh_left_eye_10.userData.sculptComponent = {"id": "left-eye", "name": "Left drop eye", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Left drop eye is resolved as a distinct ellipsoid volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.38, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.18, "height": 0.38, "depth": 0.09, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.43, 2.88, 0.7], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.18, 0.38, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-eye", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "leftEyeDrop", "type": "contour"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_left_eye_10.add(mesh_left_eye_10);
  meshes["left-eye"] = mesh_left_eye_10;
  colliders["left-eye"] = {"type": "capsule", "offset": [0, 0, 0], "scale": [0.18, 0.38, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["left-eye"] ??= [];
  destructionGroups["left-eye"].push(node_left_eye_10);

  const attachment_right_eye_11 = {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.38, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_right_eye_11 = makeAttachmentEndpoint(attachment_right_eye_11);
  const node_right_eye_11 = new THREE.Group();
  node_right_eye_11.name = "Right drop eye__pivot";
  if (endpoint_right_eye_11) {
    node_right_eye_11.position.copy(endpoint_right_eye_11.start);
    node_right_eye_11.rotation.set(0, 0, 0);
    node_right_eye_11.scale.set(1, 1, 1);
  } else {
    node_right_eye_11.position.set(0.43, 2.88, 0.7);
    node_right_eye_11.rotation.set(0.0, 0.0, 0.0);
    node_right_eye_11.scale.set(1.0, 1.0, 1.0);
  }
  node_right_eye_11.userData.sculptComponent = {"id": "right-eye", "name": "Right drop eye", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Right drop eye is resolved as a distinct ellipsoid volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.38, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.18, "height": 0.38, "depth": 0.09, "units": "world", "confidence": 0.92}, "transform": {"position": [0.43, 2.88, 0.7], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.18, 0.38, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-eye", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightEyeDrop", "type": "contour"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_right_eye_11.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.18, 0.38, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-eye", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}};
  (nodes["body"] ?? root).add(node_right_eye_11);
  nodes["right-eye"] = node_right_eye_11;
  const mesh_right_eye_11Geometry = endpoint_right_eye_11
    ? new THREE.CylinderGeometry(endpoint_right_eye_11.endRadius, endpoint_right_eye_11.baseRadius, endpoint_right_eye_11.length, 32, 12)
    : new THREE.SphereGeometry(0.5, 64, 40);
  const mesh_right_eye_11 = new THREE.Mesh(
    mesh_right_eye_11Geometry,
    materialMap["ink-black"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_right_eye_11.name = "Right drop eye";
  if (endpoint_right_eye_11) {
    mesh_right_eye_11.position.copy(endpoint_right_eye_11.midpoint);
    mesh_right_eye_11.quaternion.copy(endpoint_right_eye_11.quaternion);
  }
  mesh_right_eye_11.castShadow = options.castShadow ?? true;
  mesh_right_eye_11.receiveShadow = options.receiveShadow ?? true;
  mesh_right_eye_11.userData.sculptComponent = {"id": "right-eye", "name": "Right drop eye", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "ellipsoid", "topologyClass": "assembled-solid", "topologyRationale": "Right drop eye is resolved as a distinct ellipsoid volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.38, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.18, "height": 0.38, "depth": 0.09, "units": "world", "confidence": 0.92}, "transform": {"position": [0.43, 2.88, 0.7], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "capsule", "offset": [0, 0, 0], "scale": [0.18, 0.38, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-eye", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightEyeDrop", "type": "contour"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_right_eye_11.add(mesh_right_eye_11);
  meshes["right-eye"] = mesh_right_eye_11;
  colliders["right-eye"] = {"type": "capsule", "offset": [0, 0, 0], "scale": [0.18, 0.38, 0.09], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["right-eye"] ??= [];
  destructionGroups["right-eye"].push(node_right_eye_11);

  const attachment_left_brow_12 = {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.11, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_left_brow_12 = makeAttachmentEndpoint(attachment_left_brow_12);
  const node_left_brow_12 = new THREE.Group();
  node_left_brow_12.name = "Left angry brow__pivot";
  if (endpoint_left_brow_12) {
    node_left_brow_12.position.copy(endpoint_left_brow_12.start);
    node_left_brow_12.rotation.set(0, 0, 0);
    node_left_brow_12.scale.set(1, 1, 1);
  } else {
    node_left_brow_12.position.set(-0.43, 3.18, 0.72);
    node_left_brow_12.rotation.set(0.0, 0.0, -0.38);
    node_left_brow_12.scale.set(1.0, 1.0, 1.0);
  }
  node_left_brow_12.userData.sculptComponent = {"id": "left-brow", "name": "Left angry brow", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Left angry brow is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.11, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.5, "height": 0.11, "depth": 0.1, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.43, 3.18, 0.72], "rotation": [0, 0, -0.38], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.5, 0.11, 0.1], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-brow", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "leftBrowAngle", "type": "linework"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_left_brow_12.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.5, 0.11, 0.1], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-brow", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}};
  (nodes["body"] ?? root).add(node_left_brow_12);
  nodes["left-brow"] = node_left_brow_12;
  const mesh_left_brow_12Geometry = endpoint_left_brow_12
    ? new THREE.CylinderGeometry(endpoint_left_brow_12.endRadius, endpoint_left_brow_12.baseRadius, endpoint_left_brow_12.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_left_brow_12 = new THREE.Mesh(
    mesh_left_brow_12Geometry,
    materialMap["ink-black"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_left_brow_12.name = "Left angry brow";
  if (endpoint_left_brow_12) {
    mesh_left_brow_12.position.copy(endpoint_left_brow_12.midpoint);
    mesh_left_brow_12.quaternion.copy(endpoint_left_brow_12.quaternion);
  }
  mesh_left_brow_12.castShadow = options.castShadow ?? true;
  mesh_left_brow_12.receiveShadow = options.receiveShadow ?? true;
  mesh_left_brow_12.userData.sculptComponent = {"id": "left-brow", "name": "Left angry brow", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Left angry brow is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.11, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.5, "height": 0.11, "depth": 0.1, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.43, 3.18, 0.72], "rotation": [0, 0, -0.38], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.5, 0.11, 0.1], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "left-brow", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "leftBrowAngle", "type": "linework"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_left_brow_12.add(mesh_left_brow_12);
  meshes["left-brow"] = mesh_left_brow_12;
  colliders["left-brow"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.5, 0.11, 0.1], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["left-brow"] ??= [];
  destructionGroups["left-brow"].push(node_left_brow_12);

  const attachment_right_brow_13 = {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.11, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_right_brow_13 = makeAttachmentEndpoint(attachment_right_brow_13);
  const node_right_brow_13 = new THREE.Group();
  node_right_brow_13.name = "Right angry brow__pivot";
  if (endpoint_right_brow_13) {
    node_right_brow_13.position.copy(endpoint_right_brow_13.start);
    node_right_brow_13.rotation.set(0, 0, 0);
    node_right_brow_13.scale.set(1, 1, 1);
  } else {
    node_right_brow_13.position.set(0.43, 3.18, 0.72);
    node_right_brow_13.rotation.set(0.0, 0.0, 0.38);
    node_right_brow_13.scale.set(1.0, 1.0, 1.0);
  }
  node_right_brow_13.userData.sculptComponent = {"id": "right-brow", "name": "Right angry brow", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Right angry brow is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.11, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.5, "height": 0.11, "depth": 0.1, "units": "world", "confidence": 0.92}, "transform": {"position": [0.43, 3.18, 0.72], "rotation": [0, 0, 0.38], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.5, 0.11, 0.1], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-brow", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightBrowAngle", "type": "linework"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_right_brow_13.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.5, 0.11, 0.1], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-brow", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}};
  (nodes["body"] ?? root).add(node_right_brow_13);
  nodes["right-brow"] = node_right_brow_13;
  const mesh_right_brow_13Geometry = endpoint_right_brow_13
    ? new THREE.CylinderGeometry(endpoint_right_brow_13.endRadius, endpoint_right_brow_13.baseRadius, endpoint_right_brow_13.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_right_brow_13 = new THREE.Mesh(
    mesh_right_brow_13Geometry,
    materialMap["ink-black"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_right_brow_13.name = "Right angry brow";
  if (endpoint_right_brow_13) {
    mesh_right_brow_13.position.copy(endpoint_right_brow_13.midpoint);
    mesh_right_brow_13.quaternion.copy(endpoint_right_brow_13.quaternion);
  }
  mesh_right_brow_13.castShadow = options.castShadow ?? true;
  mesh_right_brow_13.receiveShadow = options.receiveShadow ?? true;
  mesh_right_brow_13.userData.sculptComponent = {"id": "right-brow", "name": "Right angry brow", "level": "meso", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Right angry brow is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "body", "attachment": {"parentId": "body", "parentSocket": "body-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.11, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.5, "height": 0.11, "depth": 0.1, "units": "world", "confidence": 0.92}, "transform": {"position": [0.43, 3.18, 0.72], "rotation": [0, 0, 0.38], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.5, 0.11, 0.1], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "right-brow", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightBrowAngle", "type": "linework"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_right_brow_13.add(mesh_right_brow_13);
  meshes["right-brow"] = mesh_right_brow_13;
  colliders["right-brow"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.5, 0.11, 0.1], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["right-brow"] ??= [];
  destructionGroups["right-brow"].push(node_right_brow_13);

  const attachment_tablet_14 = {"parentId": "right-arm", "parentSocket": "right-arm-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.12, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_tablet_14 = makeAttachmentEndpoint(attachment_tablet_14);
  const node_tablet_14 = new THREE.Group();
  node_tablet_14.name = "Silver tablet plate__pivot";
  if (endpoint_tablet_14) {
    node_tablet_14.position.copy(endpoint_tablet_14.start);
    node_tablet_14.rotation.set(0, 0, 0);
    node_tablet_14.scale.set(1, 1, 1);
  } else {
    node_tablet_14.position.set(0.86, 1.35, 0.42);
    node_tablet_14.rotation.set(0.05, 0.0, -0.14);
    node_tablet_14.scale.set(1.0, 1.0, 1.0);
  }
  node_tablet_14.userData.sculptComponent = {"id": "tablet", "name": "Silver tablet plate", "level": "meso", "role": "prop", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Silver tablet plate is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "right-arm", "attachment": {"parentId": "right-arm", "parentSocket": "right-arm-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.12, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.85, "height": 1.12, "depth": 0.12, "units": "world", "confidence": 0.92}, "transform": {"position": [0.86, 1.35, 0.42], "rotation": [0.05, 0, -0.14], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "prop", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.85, 1.12, 0.12], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "tablet", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "tablet-silver"}}, "material": "tablet-silver", "materialLayers": ["tablet-silver"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "beveledPlate", "type": "bevel", "radius": 0.05}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(200, 200, 193, 1.0)", "secondaryAlbedo": "rgba(110, 115, 116, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_tablet_14.userData.actionProfile = {"animationRole": "prop", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.85, 1.12, 0.12], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "tablet", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "tablet-silver"}};
  (nodes["right-arm"] ?? root).add(node_tablet_14);
  nodes["tablet"] = node_tablet_14;
  const mesh_tablet_14Geometry = endpoint_tablet_14
    ? new THREE.CylinderGeometry(endpoint_tablet_14.endRadius, endpoint_tablet_14.baseRadius, endpoint_tablet_14.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_tablet_14 = new THREE.Mesh(
    mesh_tablet_14Geometry,
    materialMap["tablet-silver"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_tablet_14.name = "Silver tablet plate";
  if (endpoint_tablet_14) {
    mesh_tablet_14.position.copy(endpoint_tablet_14.midpoint);
    mesh_tablet_14.quaternion.copy(endpoint_tablet_14.quaternion);
  }
  mesh_tablet_14.castShadow = options.castShadow ?? true;
  mesh_tablet_14.receiveShadow = options.receiveShadow ?? true;
  mesh_tablet_14.userData.sculptComponent = {"id": "tablet", "name": "Silver tablet plate", "level": "meso", "role": "prop", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Silver tablet plate is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "right-arm", "attachment": {"parentId": "right-arm", "parentSocket": "right-arm-surface", "localStart": [0, 0, 0], "localEnd": [0, 1.12, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.85, "height": 1.12, "depth": 0.12, "units": "world", "confidence": 0.92}, "transform": {"position": [0.86, 1.35, 0.42], "rotation": [0.05, 0, -0.14], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "prop", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.85, 1.12, 0.12], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "tablet", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "tablet-silver"}}, "material": "tablet-silver", "materialLayers": ["tablet-silver"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "beveledPlate", "type": "bevel", "radius": 0.05}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(200, 200, 193, 1.0)", "secondaryAlbedo": "rgba(110, 115, 116, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_tablet_14.add(mesh_tablet_14);
  meshes["tablet"] = mesh_tablet_14;
  colliders["tablet"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.85, 1.12, 0.12], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["tablet"] ??= [];
  destructionGroups["tablet"].push(node_tablet_14);

  const attachment_vent_1_15 = {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_vent_1_15 = makeAttachmentEndpoint(attachment_vent_1_15);
  const node_vent_1_15 = new THREE.Group();
  node_vent_1_15.name = "Visor vent slot 1__pivot";
  if (endpoint_vent_1_15) {
    node_vent_1_15.position.copy(endpoint_vent_1_15.start);
    node_vent_1_15.rotation.set(0, 0, 0);
    node_vent_1_15.scale.set(1, 1, 1);
  } else {
    node_vent_1_15.position.set(-0.65, 3.35, 0.93);
    node_vent_1_15.rotation.set(0.0, 0.0, 0.0);
    node_vent_1_15.scale.set(1.0, 1.0, 1.0);
  }
  node_vent_1_15.userData.sculptComponent = {"id": "vent-1", "name": "Visor vent slot 1", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 1 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.65, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-1", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut1", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_1_15.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-1", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}};
  (nodes["visor"] ?? root).add(node_vent_1_15);
  nodes["vent-1"] = node_vent_1_15;
  const mesh_vent_1_15Geometry = endpoint_vent_1_15
    ? new THREE.CylinderGeometry(endpoint_vent_1_15.endRadius, endpoint_vent_1_15.baseRadius, endpoint_vent_1_15.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_vent_1_15 = new THREE.Mesh(
    mesh_vent_1_15Geometry,
    materialMap["ink-black"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_vent_1_15.name = "Visor vent slot 1";
  if (endpoint_vent_1_15) {
    mesh_vent_1_15.position.copy(endpoint_vent_1_15.midpoint);
    mesh_vent_1_15.quaternion.copy(endpoint_vent_1_15.quaternion);
  }
  mesh_vent_1_15.castShadow = options.castShadow ?? true;
  mesh_vent_1_15.receiveShadow = options.receiveShadow ?? true;
  mesh_vent_1_15.userData.sculptComponent = {"id": "vent-1", "name": "Visor vent slot 1", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 1 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.65, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-1", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut1", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_1_15.add(mesh_vent_1_15);
  meshes["vent-1"] = mesh_vent_1_15;
  colliders["vent-1"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["vent-1"] ??= [];
  destructionGroups["vent-1"].push(node_vent_1_15);

  const attachment_vent_2_16 = {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_vent_2_16 = makeAttachmentEndpoint(attachment_vent_2_16);
  const node_vent_2_16 = new THREE.Group();
  node_vent_2_16.name = "Visor vent slot 2__pivot";
  if (endpoint_vent_2_16) {
    node_vent_2_16.position.copy(endpoint_vent_2_16.start);
    node_vent_2_16.rotation.set(0, 0, 0);
    node_vent_2_16.scale.set(1, 1, 1);
  } else {
    node_vent_2_16.position.set(-0.32, 3.35, 0.93);
    node_vent_2_16.rotation.set(0.0, 0.0, 0.0);
    node_vent_2_16.scale.set(1.0, 1.0, 1.0);
  }
  node_vent_2_16.userData.sculptComponent = {"id": "vent-2", "name": "Visor vent slot 2", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 2 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.32, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-2", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut2", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_2_16.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-2", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}};
  (nodes["visor"] ?? root).add(node_vent_2_16);
  nodes["vent-2"] = node_vent_2_16;
  const mesh_vent_2_16Geometry = endpoint_vent_2_16
    ? new THREE.CylinderGeometry(endpoint_vent_2_16.endRadius, endpoint_vent_2_16.baseRadius, endpoint_vent_2_16.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_vent_2_16 = new THREE.Mesh(
    mesh_vent_2_16Geometry,
    materialMap["ink-black"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_vent_2_16.name = "Visor vent slot 2";
  if (endpoint_vent_2_16) {
    mesh_vent_2_16.position.copy(endpoint_vent_2_16.midpoint);
    mesh_vent_2_16.quaternion.copy(endpoint_vent_2_16.quaternion);
  }
  mesh_vent_2_16.castShadow = options.castShadow ?? true;
  mesh_vent_2_16.receiveShadow = options.receiveShadow ?? true;
  mesh_vent_2_16.userData.sculptComponent = {"id": "vent-2", "name": "Visor vent slot 2", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 2 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [-0.32, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-2", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut2", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_2_16.add(mesh_vent_2_16);
  meshes["vent-2"] = mesh_vent_2_16;
  colliders["vent-2"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["vent-2"] ??= [];
  destructionGroups["vent-2"].push(node_vent_2_16);

  const attachment_vent_3_17 = {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_vent_3_17 = makeAttachmentEndpoint(attachment_vent_3_17);
  const node_vent_3_17 = new THREE.Group();
  node_vent_3_17.name = "Visor vent slot 3__pivot";
  if (endpoint_vent_3_17) {
    node_vent_3_17.position.copy(endpoint_vent_3_17.start);
    node_vent_3_17.rotation.set(0, 0, 0);
    node_vent_3_17.scale.set(1, 1, 1);
  } else {
    node_vent_3_17.position.set(0.0, 3.35, 0.93);
    node_vent_3_17.rotation.set(0.0, 0.0, 0.0);
    node_vent_3_17.scale.set(1.0, 1.0, 1.0);
  }
  node_vent_3_17.userData.sculptComponent = {"id": "vent-3", "name": "Visor vent slot 3", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 3 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-3", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut3", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_3_17.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-3", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}};
  (nodes["visor"] ?? root).add(node_vent_3_17);
  nodes["vent-3"] = node_vent_3_17;
  const mesh_vent_3_17Geometry = endpoint_vent_3_17
    ? new THREE.CylinderGeometry(endpoint_vent_3_17.endRadius, endpoint_vent_3_17.baseRadius, endpoint_vent_3_17.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_vent_3_17 = new THREE.Mesh(
    mesh_vent_3_17Geometry,
    materialMap["ink-black"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_vent_3_17.name = "Visor vent slot 3";
  if (endpoint_vent_3_17) {
    mesh_vent_3_17.position.copy(endpoint_vent_3_17.midpoint);
    mesh_vent_3_17.quaternion.copy(endpoint_vent_3_17.quaternion);
  }
  mesh_vent_3_17.castShadow = options.castShadow ?? true;
  mesh_vent_3_17.receiveShadow = options.receiveShadow ?? true;
  mesh_vent_3_17.userData.sculptComponent = {"id": "vent-3", "name": "Visor vent slot 3", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 3 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [0, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-3", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut3", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_3_17.add(mesh_vent_3_17);
  meshes["vent-3"] = mesh_vent_3_17;
  colliders["vent-3"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["vent-3"] ??= [];
  destructionGroups["vent-3"].push(node_vent_3_17);

  const attachment_vent_4_18 = {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_vent_4_18 = makeAttachmentEndpoint(attachment_vent_4_18);
  const node_vent_4_18 = new THREE.Group();
  node_vent_4_18.name = "Visor vent slot 4__pivot";
  if (endpoint_vent_4_18) {
    node_vent_4_18.position.copy(endpoint_vent_4_18.start);
    node_vent_4_18.rotation.set(0, 0, 0);
    node_vent_4_18.scale.set(1, 1, 1);
  } else {
    node_vent_4_18.position.set(0.32, 3.35, 0.93);
    node_vent_4_18.rotation.set(0.0, 0.0, 0.0);
    node_vent_4_18.scale.set(1.0, 1.0, 1.0);
  }
  node_vent_4_18.userData.sculptComponent = {"id": "vent-4", "name": "Visor vent slot 4", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 4 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [0.32, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-4", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut4", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_4_18.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-4", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}};
  (nodes["visor"] ?? root).add(node_vent_4_18);
  nodes["vent-4"] = node_vent_4_18;
  const mesh_vent_4_18Geometry = endpoint_vent_4_18
    ? new THREE.CylinderGeometry(endpoint_vent_4_18.endRadius, endpoint_vent_4_18.baseRadius, endpoint_vent_4_18.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_vent_4_18 = new THREE.Mesh(
    mesh_vent_4_18Geometry,
    materialMap["ink-black"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_vent_4_18.name = "Visor vent slot 4";
  if (endpoint_vent_4_18) {
    mesh_vent_4_18.position.copy(endpoint_vent_4_18.midpoint);
    mesh_vent_4_18.quaternion.copy(endpoint_vent_4_18.quaternion);
  }
  mesh_vent_4_18.castShadow = options.castShadow ?? true;
  mesh_vent_4_18.receiveShadow = options.receiveShadow ?? true;
  mesh_vent_4_18.userData.sculptComponent = {"id": "vent-4", "name": "Visor vent slot 4", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 4 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [0.32, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-4", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut4", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_4_18.add(mesh_vent_4_18);
  meshes["vent-4"] = mesh_vent_4_18;
  colliders["vent-4"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["vent-4"] ??= [];
  destructionGroups["vent-4"].push(node_vent_4_18);

  const attachment_vent_5_19 = {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_vent_5_19 = makeAttachmentEndpoint(attachment_vent_5_19);
  const node_vent_5_19 = new THREE.Group();
  node_vent_5_19.name = "Visor vent slot 5__pivot";
  if (endpoint_vent_5_19) {
    node_vent_5_19.position.copy(endpoint_vent_5_19.start);
    node_vent_5_19.rotation.set(0, 0, 0);
    node_vent_5_19.scale.set(1, 1, 1);
  } else {
    node_vent_5_19.position.set(0.65, 3.35, 0.93);
    node_vent_5_19.rotation.set(0.0, 0.0, 0.0);
    node_vent_5_19.scale.set(1.0, 1.0, 1.0);
  }
  node_vent_5_19.userData.sculptComponent = {"id": "vent-5", "name": "Visor vent slot 5", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 5 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [0.65, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-5", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut5", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_5_19.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-5", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}};
  (nodes["visor"] ?? root).add(node_vent_5_19);
  nodes["vent-5"] = node_vent_5_19;
  const mesh_vent_5_19Geometry = endpoint_vent_5_19
    ? new THREE.CylinderGeometry(endpoint_vent_5_19.endRadius, endpoint_vent_5_19.baseRadius, endpoint_vent_5_19.length, 32, 12)
    : new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
  const mesh_vent_5_19 = new THREE.Mesh(
    mesh_vent_5_19Geometry,
    materialMap["ink-black"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_vent_5_19.name = "Visor vent slot 5";
  if (endpoint_vent_5_19) {
    mesh_vent_5_19.position.copy(endpoint_vent_5_19.midpoint);
    mesh_vent_5_19.quaternion.copy(endpoint_vent_5_19.quaternion);
  }
  mesh_vent_5_19.castShadow = options.castShadow ?? true;
  mesh_vent_5_19.receiveShadow = options.receiveShadow ?? true;
  mesh_vent_5_19.userData.sculptComponent = {"id": "vent-5", "name": "Visor vent slot 5", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "box", "topologyClass": "assembled-solid", "topologyRationale": "Visor vent slot 5 is resolved as a distinct box volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "visor", "attachment": {"parentId": "visor", "parentSocket": "visor-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.43, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.13, "height": 0.43, "depth": 0.05, "units": "world", "confidence": 0.92}, "transform": {"position": [0.65, 3.35, 0.93], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "vent-5", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "ink-black"}}, "material": "ink-black", "materialLayers": ["ink-black"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "ventCut5", "type": "hole"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(17, 23, 19, 1.0)", "secondaryAlbedo": "rgba(5, 7, 6, 1.0)", "materialClass": "plastic", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_vent_5_19.add(mesh_vent_5_19);
  meshes["vent-5"] = mesh_vent_5_19;
  colliders["vent-5"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.13, 0.43, 0.05], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["vent-5"] ??= [];
  destructionGroups["vent-5"].push(node_vent_5_19);

  const attachment_pivot_left_20 = {"parentId": "helmet-band", "parentSocket": "helmet-band-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.09, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_pivot_left_20 = makeAttachmentEndpoint(attachment_pivot_left_20);
  const node_pivot_left_20 = new THREE.Group();
  node_pivot_left_20.name = "Left visor pivot__pivot";
  if (endpoint_pivot_left_20) {
    node_pivot_left_20.position.copy(endpoint_pivot_left_20.start);
    node_pivot_left_20.rotation.set(0, 0, 0);
    node_pivot_left_20.scale.set(1, 1, 1);
  } else {
    node_pivot_left_20.position.set(-1.05, 3.42, 0.55);
    node_pivot_left_20.rotation.set(1.57, 0.0, 0.0);
    node_pivot_left_20.scale.set(1.0, 1.0, 1.0);
  }
  node_pivot_left_20.userData.sculptComponent = {"id": "pivot-left", "name": "Left visor pivot", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "cylinder", "topologyClass": "assembled-solid", "topologyRationale": "Left visor pivot is resolved as a distinct cylinder volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-band", "attachment": {"parentId": "helmet-band", "parentSocket": "helmet-band-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.09, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.23, "height": 0.09, "depth": 0.23, "radius": 0.115, "units": "world", "confidence": 0.92}, "transform": {"position": [-1.05, 3.42, 0.55], "rotation": [1.57, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.23, 0.09, 0.23], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "pivot-left", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "leftPivotRing", "type": "fastener"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_pivot_left_20.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.23, 0.09, 0.23], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "pivot-left", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}};
  (nodes["helmet-band"] ?? root).add(node_pivot_left_20);
  nodes["pivot-left"] = node_pivot_left_20;
  const mesh_pivot_left_20Geometry = endpoint_pivot_left_20
    ? new THREE.CylinderGeometry(endpoint_pivot_left_20.endRadius, endpoint_pivot_left_20.baseRadius, endpoint_pivot_left_20.length, 32, 12)
    : new THREE.CylinderGeometry(0.5, 0.5, 1, 48, 16);
  const mesh_pivot_left_20 = new THREE.Mesh(
    mesh_pivot_left_20Geometry,
    materialMap["helmet-metal"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_pivot_left_20.name = "Left visor pivot";
  if (endpoint_pivot_left_20) {
    mesh_pivot_left_20.position.copy(endpoint_pivot_left_20.midpoint);
    mesh_pivot_left_20.quaternion.copy(endpoint_pivot_left_20.quaternion);
  }
  mesh_pivot_left_20.castShadow = options.castShadow ?? true;
  mesh_pivot_left_20.receiveShadow = options.receiveShadow ?? true;
  mesh_pivot_left_20.userData.sculptComponent = {"id": "pivot-left", "name": "Left visor pivot", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "cylinder", "topologyClass": "assembled-solid", "topologyRationale": "Left visor pivot is resolved as a distinct cylinder volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-band", "attachment": {"parentId": "helmet-band", "parentSocket": "helmet-band-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.09, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.23, "height": 0.09, "depth": 0.23, "radius": 0.115, "units": "world", "confidence": 0.92}, "transform": {"position": [-1.05, 3.42, 0.55], "rotation": [1.57, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.23, 0.09, 0.23], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "pivot-left", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "leftPivotRing", "type": "fastener"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_pivot_left_20.add(mesh_pivot_left_20);
  meshes["pivot-left"] = mesh_pivot_left_20;
  colliders["pivot-left"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.23, 0.09, 0.23], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["pivot-left"] ??= [];
  destructionGroups["pivot-left"].push(node_pivot_left_20);

  const attachment_pivot_right_21 = {"parentId": "helmet-band", "parentSocket": "helmet-band-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.09, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]};
  const endpoint_pivot_right_21 = makeAttachmentEndpoint(attachment_pivot_right_21);
  const node_pivot_right_21 = new THREE.Group();
  node_pivot_right_21.name = "Right visor pivot__pivot";
  if (endpoint_pivot_right_21) {
    node_pivot_right_21.position.copy(endpoint_pivot_right_21.start);
    node_pivot_right_21.rotation.set(0, 0, 0);
    node_pivot_right_21.scale.set(1, 1, 1);
  } else {
    node_pivot_right_21.position.set(1.05, 3.42, 0.55);
    node_pivot_right_21.rotation.set(1.57, 0.0, 0.0);
    node_pivot_right_21.scale.set(1.0, 1.0, 1.0);
  }
  node_pivot_right_21.userData.sculptComponent = {"id": "pivot-right", "name": "Right visor pivot", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "cylinder", "topologyClass": "assembled-solid", "topologyRationale": "Right visor pivot is resolved as a distinct cylinder volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-band", "attachment": {"parentId": "helmet-band", "parentSocket": "helmet-band-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.09, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.23, "height": 0.09, "depth": 0.23, "radius": 0.115, "units": "world", "confidence": 0.92}, "transform": {"position": [1.05, 3.42, 0.55], "rotation": [1.57, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.23, 0.09, 0.23], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "pivot-right", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightPivotRing", "type": "fastener"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_pivot_right_21.userData.actionProfile = {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.23, 0.09, 0.23], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "pivot-right", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}};
  (nodes["helmet-band"] ?? root).add(node_pivot_right_21);
  nodes["pivot-right"] = node_pivot_right_21;
  const mesh_pivot_right_21Geometry = endpoint_pivot_right_21
    ? new THREE.CylinderGeometry(endpoint_pivot_right_21.endRadius, endpoint_pivot_right_21.baseRadius, endpoint_pivot_right_21.length, 32, 12)
    : new THREE.CylinderGeometry(0.5, 0.5, 1, 48, 16);
  const mesh_pivot_right_21 = new THREE.Mesh(
    mesh_pivot_right_21Geometry,
    materialMap["helmet-metal"] ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh_pivot_right_21.name = "Right visor pivot";
  if (endpoint_pivot_right_21) {
    mesh_pivot_right_21.position.copy(endpoint_pivot_right_21.midpoint);
    mesh_pivot_right_21.quaternion.copy(endpoint_pivot_right_21.quaternion);
  }
  mesh_pivot_right_21.castShadow = options.castShadow ?? true;
  mesh_pivot_right_21.receiveShadow = options.receiveShadow ?? true;
  mesh_pivot_right_21.userData.sculptComponent = {"id": "pivot-right", "name": "Right visor pivot", "level": "micro", "role": "static-part", "importance": 0.8, "confidence": 0.92, "primitive": "cylinder", "topologyClass": "assembled-solid", "topologyRationale": "Right visor pivot is resolved as a distinct cylinder volume by the admitted front, rear and side silhouettes.", "geometryDescriptor": {"topologyIntent": "stylized character part", "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1}, "deformationStack": [], "uvStrategy": "generated procedural coordinates", "normalStrategy": "smooth vertex normals"}, "parent": "helmet-band", "attachment": {"parentId": "helmet-band", "parentSocket": "helmet-band-surface", "localStart": [0, 0, 0], "localEnd": [0, 0.09, 0], "contactType": "embedded", "embedDepth": 0.04, "gapTolerance": 0.015, "evidenceRefs": ["front-three-quarter", "side-three-quarter"]}, "dimensions": {"width": 0.23, "height": 0.09, "depth": 0.23, "radius": 0.115, "units": "world", "confidence": 0.92}, "transform": {"position": [1.05, 3.42, 0.55], "rotation": [1.57, 0, 0], "scale": [1, 1, 1]}, "actionProfile": {"animationRole": "static-part", "pivot": {"mode": "center", "localPosition": [0, 0, 0], "axis": [0, 1, 0], "confidence": 0.7}, "transformChannels": {"translate": true, "rotate": true, "scale": true, "bend": false, "twist": false, "detach": false, "visibility": true, "materialState": false}, "sockets": [], "collider": {"type": "box", "offset": [0, 0, 0], "scale": [0.23, 0.09, 0.23], "isTrigger": false, "notes": "simplified runtime proxy"}, "constraints": [], "destruction": {"breakable": false, "fractureGroup": "pivot-right", "seamRefs": [], "detachableFragments": [], "breakImpulse": 0.0, "debrisMaterial": "helmet-metal"}}, "material": "helmet-metal", "materialLayers": ["helmet-metal"], "deformations": [], "joints": [], "seams": [], "localFeatures": [{"id": "rightPivotRing", "type": "fastener"}], "surfaceDetail": {"macroRoughness": 0.2, "microRoughness": 0.08, "bumpAmplitude": 0.006, "normalPattern": "fine brushed grain", "displacementPattern": "none", "occlusionPattern": "cavity at joins and grooves", "edgeWearPattern": "subtle edge lightening", "notes": "Stylized but responsive under grazing light."}, "evidenceRefs": ["front-three-quarter", "back", "side-three-quarter"], "details": [], "fidelityTier": "implementation", "colorMaterialRecipe": {"dominantAlbedo": "rgba(183, 181, 168, 1.0)", "secondaryAlbedo": "rgba(105, 112, 120, 1.0)", "materialClass": "metal", "materialClassConfidence": 0.9, "evidenceRefs": ["front-three-quarter"]}};
  node_pivot_right_21.add(mesh_pivot_right_21);
  meshes["pivot-right"] = mesh_pivot_right_21;
  colliders["pivot-right"] = {"type": "box", "offset": [0, 0, 0], "scale": [0.23, 0.09, 0.23], "isTrigger": false, "notes": "simplified runtime proxy"};
  destructionGroups["pivot-right"] ??= [];
  destructionGroups["pivot-right"].push(node_pivot_right_21);

  root.userData.sculptRuntime = { nodes, meshes, sockets, colliders, destructionGroups } satisfies ProceduralModelRuntime;
  root.userData.lookDevTargets = {"qualityPriority": "stylized-reference", "materialPass": {"albedoPaletteRequired": true, "roughnessVariationRequired": true, "normalOrBumpRequired": true, "localOverridesRequired": true, "minimumTextureResolution": 1024, "preferredTextureResolution": 2048, "independentMapChannels": ["albedo", "roughness", "height", "normal", "ambient-occlusion"], "requiredSurfaceFrequencyBands": ["macro", "meso", "micro"], "geometryReliefRequiredWhenSilhouetteAffected": true, "referencePbrExtraction": {"requiredWhenSourceImagePresent": false, "targetThreshold": 0.7, "stopOnLowConfidence": true, "script": "forge/stage1_intake/extract_pbr_evidence.py", "acceptedLimitation": "single-image extraction is reference-derived inference, not exact photogrammetry"}, "mustAvoid": ["single flat albedo per material", "uniform roughness", "albedo texture reused as roughness/height/normal/AO", "single-frequency random noise", "plastic-looking smooth bark, stone, cloth, foliage, or aged material", "local color/detail described only in prose without material masks", "claiming exact PBR recovery when confidence is below the target threshold"]}, "lightingPass": {"requiredTerms": ["key light", "fill light", "rim or environment light", "exposure", "tone mapping", "background", "contact shadow"], "mustAvoid": ["ambient-only lighting", "flat value range", "missing contact shadow", "reference lighting copied without separating material readability"]}, "screenshotReview": ["Compare albedo palette and local color zones.", "Compare roughness/normal/bump response under light.", "Compare cavity dirt, edge wear, stains, moss, scratches, or other local masks.", "Compare key/fill/rim structure, exposure, tone mapping, background, and contact shadows.", "Capture a neutral-light render to verify material readability without reference lighting.", "Capture a grazing-light close-up to expose flat normals, uniform roughness, tiling, and plastic highlights.", "Capture a reference-matched render from the same camera framing as the source."]};
  root.userData.actionReadiness = {
    note: 'Use root.userData.sculptRuntime.nodes for transforms, sockets for attachments, colliders for physics proxies, and destructionGroups for breakable sets.',
  };
  return root;
}

export function createCodeLieshoutCactusKnightLookDevLights(
  mode: 'neutral' | 'grazing' | 'reference' = 'neutral',
): THREE.Group {
  const lights = new THREE.Group();
  lights.name = "Code Lieshout Cactus Knight look-dev lights";
  const hemi = new THREE.HemisphereLight(
    mode === 'reference' ? 0xfff0d6 : 0xf2f4ff,
    0x363b42,
    mode === 'grazing' ? 0.28 : mode === 'reference' ? 0.72 : 0.85,
  );
  lights.add(hemi);
  const key = new THREE.DirectionalLight(
    mode === 'reference' ? 0xffcf8a : 0xfff4e8,
    mode === 'grazing' ? 4.2 : mode === 'reference' ? 2.6 : 2.15,
  );
  if (mode === 'grazing') key.position.set(7.5, 1.1, 4.0);
  else if (mode === 'reference') key.position.set(-4.5, 7.5, 5.0);
  else key.position.set(-4.0, 6.0, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(4096, 4096);
  key.shadow.bias = -0.00025;
  key.shadow.normalBias = 0.018;
  key.shadow.radius = 7;
  key.shadow.blurSamples = 24;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -2.6;
  key.shadow.camera.right = 2.6;
  key.shadow.camera.top = 2.6;
  key.shadow.camera.bottom = -2.6;
  key.shadow.camera.updateProjectionMatrix();
  lights.add(key);
  const fill = new THREE.DirectionalLight(0xa8c4ff, mode === 'grazing' ? 0.12 : 0.42);
  fill.position.set(4.0, 3.0, 3.5);
  lights.add(fill);
  const rim = new THREE.DirectionalLight(0xfff1c4, mode === 'grazing' ? 0.28 : 0.85);
  rim.position.set(0.5, 4.5, -6.0);
  lights.add(rim);
  lights.userData.reviewMode = mode;
  lights.userData.lightingFromPhoto = ["Warm key light from upper camera-left; exposure 1.05 with ACES filmic tone mapping.", "Cool low-intensity fill from camera-right to preserve green rib shadows.", "Soft rim/environment light plus contact shadow under both feet; pale green presentation background."];
  lights.userData.lookDevTargets = {"qualityPriority": "stylized-reference", "materialPass": {"albedoPaletteRequired": true, "roughnessVariationRequired": true, "normalOrBumpRequired": true, "localOverridesRequired": true, "minimumTextureResolution": 1024, "preferredTextureResolution": 2048, "independentMapChannels": ["albedo", "roughness", "height", "normal", "ambient-occlusion"], "requiredSurfaceFrequencyBands": ["macro", "meso", "micro"], "geometryReliefRequiredWhenSilhouetteAffected": true, "referencePbrExtraction": {"requiredWhenSourceImagePresent": false, "targetThreshold": 0.7, "stopOnLowConfidence": true, "script": "forge/stage1_intake/extract_pbr_evidence.py", "acceptedLimitation": "single-image extraction is reference-derived inference, not exact photogrammetry"}, "mustAvoid": ["single flat albedo per material", "uniform roughness", "albedo texture reused as roughness/height/normal/AO", "single-frequency random noise", "plastic-looking smooth bark, stone, cloth, foliage, or aged material", "local color/detail described only in prose without material masks", "claiming exact PBR recovery when confidence is below the target threshold"]}, "lightingPass": {"requiredTerms": ["key light", "fill light", "rim or environment light", "exposure", "tone mapping", "background", "contact shadow"], "mustAvoid": ["ambient-only lighting", "flat value range", "missing contact shadow", "reference lighting copied without separating material readability"]}, "screenshotReview": ["Compare albedo palette and local color zones.", "Compare roughness/normal/bump response under light.", "Compare cavity dirt, edge wear, stains, moss, scratches, or other local masks.", "Compare key/fill/rim structure, exposure, tone mapping, background, and contact shadows.", "Capture a neutral-light render to verify material readability without reference lighting.", "Capture a grazing-light close-up to expose flat normals, uniform roughness, tiling, and plastic highlights.", "Capture a reference-matched render from the same camera framing as the source."]};
  return lights;
}

// PBR materials (clearcoat/iridescence/transmission/anisotropy) need an environment
// map to visually behave as intended — call this once per renderer and assign the
// result to scene.environment before rendering. No external HDR asset required.
export function createCodeLieshoutCactusKnightEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return texture;
}

// Plan 1.3 §3.2 — auto-framing by bounding box. The Divine Eye can only compare a
// render to the reference if the object is FRAMED consistently (an object framed
// differently scores as wrong even when its shape is right). This positions the camera
// deterministically from the object's bounding box so it fills the frame at a stable
// margin, and sets near/far to the object scale. Call after adding the model to the
// scene, and again on resize (after updating camera.aspect).
export function frameCodeLieshoutCactusKnightCamera(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  options: { margin?: number; azimuthDeg?: number; elevationDeg?: number } = {},
): void {
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const margin = options.margin ?? 1.15;
  const maxDim = Math.max(size.x, size.y, size.z) * margin;
  const fov = (camera.fov * Math.PI) / 180;
  // distance so the largest object dimension fits vertically in the frame
  const distance = (maxDim / 2) / Math.tan(fov / 2);
  const az = ((options.azimuthDeg ?? 0) * Math.PI) / 180;
  const el = ((options.elevationDeg ?? 0) * Math.PI) / 180;
  const dir = new THREE.Vector3(
    Math.sin(az) * Math.cos(el),
    Math.sin(el),
    Math.cos(az) * Math.cos(el),
  );
  camera.position.copy(center).addScaledVector(dir, distance);
  camera.near = Math.max(0.01, distance - maxDim);
  camera.far = distance + maxDim * 2;
  camera.lookAt(center);
  camera.updateProjectionMatrix();
}

// Plan 1.3 §3.2c — PRESENTATION composer (DOF + bloom). CRITICAL (R-POSTFX): this is
// for the showcase/hero render ONLY. The Divine Eye's EVALUATION render MUST use a
// plain renderer with NO composer — bloom blows highlights and DOF blurs edges, which
// would corrupt the deterministic IoU/DCD/edge/blowout signals. Enable dof/bloom ONLY
// when the reference photo actually exhibits them (detect_reference_effects.py authorizes).
export function createCodeLieshoutCactusKnightPresentationComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  options: { dof?: boolean; bloom?: boolean; bloomStrength?: number; dofFocus?: number; dofAperture?: number } = {},
): EffectComposer {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  if (options.dof) {
    composer.addPass(new BokehPass(scene, camera, {
      focus: options.dofFocus ?? 10.0,
      aperture: options.dofAperture ?? 0.0002,
      maxblur: 0.01,
    }));
  }
  if (options.bloom) {
    const size = new THREE.Vector2();
    renderer.getSize(size);
    composer.addPass(new UnrealBloomPass(size, options.bloomStrength ?? 0.4, 0.4, 0.85));
  }
  return composer;
}
