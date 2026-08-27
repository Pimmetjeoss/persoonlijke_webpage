import * as THREE from "three";

export type CactusKnightRuntime = {
  nodes: Record<string, THREE.Object3D>;
  meshes: Record<string, THREE.Mesh>;
  sockets: Record<string, THREE.Object3D>;
  colliders: Record<string, unknown>;
  destructionGroups: Record<string, THREE.Object3D[]>;
};

const ink = new THREE.MeshStandardMaterial({
  color: 0x09100b,
  roughness: 0.88,
  metalness: 0.02,
});

const cactus = new THREE.MeshPhysicalMaterial({
  color: 0x79aa3f,
  roughness: 0.62,
  metalness: 0,
  clearcoat: 0.12,
  clearcoatRoughness: 0.46,
});

const cactusLight = new THREE.MeshPhysicalMaterial({
  color: 0xa6ce61,
  roughness: 0.58,
  metalness: 0,
  clearcoat: 0.1,
  clearcoatRoughness: 0.5,
});

const steel = new THREE.MeshPhysicalMaterial({
  color: 0xbdb9a8,
  roughness: 0.27,
  metalness: 0.84,
  clearcoat: 0.24,
  clearcoatRoughness: 0.16,
});

const steelDark = new THREE.MeshPhysicalMaterial({
  color: 0x6c7373,
  roughness: 0.34,
  metalness: 0.78,
  clearcoat: 0.18,
});

const outline = new THREE.MeshBasicMaterial({
  color: 0x0b110d,
  side: THREE.BackSide,
});

function addOutlinedMesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  name: string,
  outlineScale = 1.045,
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);

  const shell = new THREE.Mesh(geometry, outline);
  shell.name = `${name}-outline`;
  shell.scale.multiplyScalar(outlineScale);
  shell.castShadow = false;
  shell.receiveShadow = false;
  mesh.add(shell);
  return mesh;
}

function roundedPlateGeometry(width: number, height: number, radius: number, depth: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: radius * 0.34,
    bevelThickness: radius * 0.3,
    bevelSegments: 3,
    curveSegments: 5,
  }).center();
}

function visorGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.04, -0.34);
  shape.quadraticCurveTo(0, -0.46, 1.04, -0.34);
  shape.lineTo(0.92, 0.34);
  shape.quadraticCurveTo(0, 0.5, -0.92, 0.34);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSize: 0.055,
    bevelThickness: 0.045,
    bevelSegments: 3,
    curveSegments: 8,
  }).center();
}

function dropGeometry(width: number, height: number, depth: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, height * 0.5);
  shape.bezierCurveTo(width * 0.5, height * 0.18, width * 0.48, -height * 0.5, 0, -height * 0.5);
  shape.bezierCurveTo(-width * 0.48, -height * 0.5, -width * 0.5, height * 0.18, 0, height * 0.5);
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.018,
    bevelThickness: 0.015,
    bevelSegments: 2,
    curveSegments: 8,
  }).center();
}

function createRibbedBody(root: THREE.Group, runtime: CactusKnightRuntime) {
  const body = new THREE.Group();
  body.name = "body";
  body.position.y = 2.04;
  root.add(body);
  runtime.nodes.body = body;
  runtime.destructionGroups["body-shell"] = [body];

  const coreGeo = new THREE.CapsuleGeometry(0.83, 1.75, 12, 28);
  const core = addOutlinedMesh(body, coreGeo, cactus, "body-core", 1.035);
  core.scale.set(1.18, 1, 0.84);
  runtime.meshes[core.name] = core;

  const ribGeo = new THREE.CapsuleGeometry(0.16, 1.92, 8, 18);
  const ribAngles = [-1.05, -0.7, -0.34, 0, 0.34, 0.7, 1.05];
  ribAngles.forEach((angle, index) => {
    const rib = new THREE.Mesh(ribGeo, index % 2 ? cactus : cactusLight);
    rib.name = `body-rib-${index + 1}`;
    rib.position.set(Math.sin(angle) * 0.82, 0.02, Math.cos(angle) * 0.58);
    rib.scale.z = 0.72;
    rib.castShadow = true;
    rib.receiveShadow = true;
    body.add(rib);
    runtime.meshes[rib.name] = rib;
  });

  const frontRibAngles = [Math.PI - 0.72, Math.PI - 0.35, Math.PI, Math.PI + 0.35, Math.PI + 0.72];
  frontRibAngles.forEach((angle, index) => {
    const rib = new THREE.Mesh(ribGeo, index % 2 ? cactus : cactusLight);
    rib.name = `rear-rib-${index + 1}`;
    rib.position.set(Math.sin(angle) * 0.82, 0.02, Math.cos(angle) * 0.58);
    rib.scale.z = 0.72;
    rib.castShadow = true;
    body.add(rib);
  });

  return body;
}

function createArm(
  root: THREE.Group,
  runtime: CactusKnightRuntime,
  id: "left-arm" | "right-arm",
  x: number,
  zRotation: number,
  z: number,
) {
  const pivot = new THREE.Group();
  pivot.name = id;
  pivot.position.set(x, 2.16, z);
  pivot.rotation.z = zRotation;
  root.add(pivot);
  runtime.nodes[id] = pivot;
  runtime.sockets[`${id}-shoulder`] = pivot;

  const geo = new THREE.CapsuleGeometry(0.27, 0.92, 9, 20);
  const arm = addOutlinedMesh(pivot, geo, cactus, `${id}-mesh`, 1.055);
  arm.position.y = -0.48;
  arm.scale.z = 0.82;
  runtime.meshes[arm.name] = arm;

  for (const offset of [-0.13, 0.13]) {
    const grooveGeo = new THREE.CapsuleGeometry(0.018, 0.72, 4, 8);
    const groove = new THREE.Mesh(grooveGeo, ink);
    groove.position.set(offset, -0.48, 0.245);
    groove.scale.z = 0.3;
    pivot.add(groove);
  }
  return pivot;
}

function createFoot(root: THREE.Group, runtime: CactusKnightRuntime, id: string, x: number) {
  const pivot = new THREE.Group();
  pivot.name = id;
  pivot.position.set(x, 0.58, 0);
  root.add(pivot);
  runtime.nodes[id] = pivot;

  const geo = new THREE.CapsuleGeometry(0.39, 0.42, 10, 22);
  const foot = addOutlinedMesh(pivot, geo, cactus, `${id}-mesh`, 1.055);
  foot.scale.z = 0.9;
  runtime.meshes[foot.name] = foot;
  return pivot;
}

function createHelmet(root: THREE.Group, runtime: CactusKnightRuntime) {
  const helmet = new THREE.Group();
  helmet.name = "helmet";
  helmet.position.y = 3.58;
  root.add(helmet);
  runtime.nodes.helmet = helmet;
  runtime.destructionGroups.helmet = [helmet];

  const domeGeo = new THREE.SphereGeometry(1.13, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = addOutlinedMesh(helmet, domeGeo, steel, "helmet-dome", 1.035);
  dome.scale.z = 0.74;
  runtime.meshes[dome.name] = dome;

  const bandGeo = new THREE.SphereGeometry(
    1.14,
    40,
    6,
    0,
    Math.PI * 2,
    Math.PI / 2 - 0.115,
    0.23,
  );
  const band = addOutlinedMesh(helmet, bandGeo, steelDark, "helmet-band", 1.035);
  band.position.z = -0.04;
  band.scale.z = 0.74;
  runtime.meshes[band.name] = band;

  const strapCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.03, 0.8),
    new THREE.Vector3(0, 1.36, 0),
    new THREE.Vector3(0, 0.03, -0.8),
  );
  const strapGeo = new THREE.TubeGeometry(strapCurve, 32, 0.09, 10, false);
  const strap = addOutlinedMesh(helmet, strapGeo, steelDark, "helmet-crown-strap", 1.12);
  runtime.meshes[strap.name] = strap;

  const visor = new THREE.Group();
  visor.name = "visor";
  visor.position.set(0, -0.03, 0.76);
  visor.rotation.x = -0.08;
  helmet.add(visor);
  runtime.nodes.visor = visor;

  const plate = addOutlinedMesh(visor, visorGeometry(), steel, "visor-plate", 1.045);
  runtime.meshes[plate.name] = plate;

  const slotGeo = roundedPlateGeometry(0.14, 0.46, 0.04, 0.035);
  [-0.66, -0.33, 0, 0.33, 0.66].forEach((x, index) => {
    const slot = new THREE.Mesh(slotGeo, ink);
    slot.name = `visor-slot-${index + 1}`;
    slot.position.set(x, 0.01, 0.11);
    slot.rotation.z = x * -0.055;
    visor.add(slot);
    runtime.meshes[slot.name] = slot;
  });

  const pivotGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 24);
  [-1.04, 1.04].forEach((x, index) => {
    const pivot = addOutlinedMesh(helmet, pivotGeo, steelDark, `visor-pivot-${index + 1}`, 1.1);
    pivot.position.set(x, -0.03, 0.54);
    pivot.rotation.z = Math.PI / 2;
    runtime.meshes[pivot.name] = pivot;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.115, 18), steel);
    cap.position.copy(pivot.position);
    cap.rotation.z = Math.PI / 2;
    helmet.add(cap);
  });

  const rivetGeo = new THREE.SphereGeometry(0.055, 12, 8);
  const rivetPositions = [
    [-0.76, 0.03, 0.7], [-0.38, 0.03, 0.78], [0.38, 0.03, 0.78], [0.76, 0.03, 0.7],
    [0, 0.42, 0.72], [0, 0.78, 0.52], [0, 1.02, 0.2],
  ] as const;
  rivetPositions.forEach((position, index) => {
    const rivet = new THREE.Mesh(rivetGeo, steel);
    rivet.name = `helmet-rivet-${index + 1}`;
    rivet.position.set(position[0], position[1], position[2]);
    helmet.add(rivet);
  });

  return helmet;
}

function createFace(root: THREE.Group, runtime: CactusKnightRuntime) {
  const face = new THREE.Group();
  face.name = "face";
  root.add(face);
  runtime.nodes.face = face;

  const eyeGeo = dropGeometry(0.22, 0.42, 0.055);
  [-0.43, 0.43].forEach((x, index) => {
    const eye = new THREE.Mesh(eyeGeo, ink);
    eye.name = index === 0 ? "left-eye" : "right-eye";
    eye.position.set(x, 2.84, 0.72);
    face.add(eye);
    runtime.meshes[eye.name] = eye;
  });

  const browGeo = roundedPlateGeometry(0.54, 0.105, 0.05, 0.055);
  const leftBrow = new THREE.Mesh(browGeo, ink);
  leftBrow.name = "left-brow";
  leftBrow.position.set(-0.43, 3.07, 0.76);
  leftBrow.rotation.z = -0.38;
  face.add(leftBrow);
  const rightBrow = leftBrow.clone();
  rightBrow.name = "right-brow";
  rightBrow.position.x = 0.43;
  rightBrow.rotation.z = 0.38;
  face.add(rightBrow);
  runtime.meshes[leftBrow.name] = leftBrow;
  runtime.meshes[rightBrow.name] = rightBrow;
}

function createTablet(root: THREE.Group, runtime: CactusKnightRuntime) {
  const tablet = new THREE.Group();
  tablet.name = "tablet";
  tablet.position.set(0.92, 1.48, 0.43);
  tablet.rotation.set(0.04, -0.08, -0.15);
  root.add(tablet);
  runtime.nodes.tablet = tablet;

  const geometry = roundedPlateGeometry(0.86, 1.12, 0.08, 0.12);
  const plate = addOutlinedMesh(tablet, geometry, steel, "tablet-plate", 1.055);
  runtime.meshes[plate.name] = plate;

  const screen = new THREE.Mesh(roundedPlateGeometry(0.7, 0.92, 0.06, 0.018), steelDark);
  screen.position.z = 0.085;
  tablet.add(screen);
  return tablet;
}

function createSpines(root: THREE.Group) {
  const count = 34;
  const geometry = new THREE.ConeGeometry(0.025, 0.16, 6);
  const spines = new THREE.InstancedMesh(geometry, ink, count);
  spines.name = "cactus-spines";
  spines.castShadow = true;
  const dummy = new THREE.Object3D();
  let index = 0;
  for (let row = 0; row < 7; row += 1) {
    const y = 0.88 + row * 0.42;
    for (const side of [-1, 1]) {
      const z = row % 2 ? 0.06 : -0.08;
      dummy.position.set(side * (0.92 + (row % 3) * 0.02), y, z);
      dummy.rotation.z = side * -Math.PI / 2;
      dummy.rotation.y = row * 0.37;
      dummy.updateMatrix();
      spines.setMatrixAt(index++, dummy.matrix);
    }
  }
  for (; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const y = 1.0 + ((index * 0.37) % 2.55);
    dummy.position.set(Math.sin(angle) * 0.86, y, Math.cos(angle) * 0.61);
    dummy.rotation.set(Math.cos(angle) * 0.7, 0, -Math.sin(angle) * 0.7);
    dummy.updateMatrix();
    spines.setMatrixAt(index, dummy.matrix);
  }
  spines.instanceMatrix.needsUpdate = true;
  root.add(spines);
}

export function createCactusKnightModel(): THREE.Group {
  const root = new THREE.Group();
  root.name = "Code Lieshout Cactus Knight";
  root.rotation.y = -0.15;

  const runtime: CactusKnightRuntime = {
    nodes: { root },
    meshes: {},
    sockets: {},
    colliders: {
      body: { type: "capsule", center: [0, 2.04, 0], radius: 0.88, height: 2.7 },
    },
    destructionGroups: {},
  };

  createRibbedBody(root, runtime);
  createArm(root, runtime, "left-arm", -0.99, 0.56, -0.04);
  createArm(root, runtime, "right-arm", 0.99, -0.36, 0.16);
  createFoot(root, runtime, "left-foot", -0.47);
  createFoot(root, runtime, "right-foot", 0.47);
  createHelmet(root, runtime);
  createFace(root, runtime);
  createTablet(root, runtime);
  createSpines(root);

  root.userData.sculptRuntime = runtime;
  root.userData.actionReadiness = {
    animatedNodes: ["root", "left-arm", "right-arm", "visor"],
    note: "Named pivots expose the mascot for idle sway, gestures and visor motion.",
  };
  return root;
}
