import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

/* =====================================================================
   CONSTANTS
===================================================================== */
const TERRAIN_SIZE = 100;
const TERRAIN_SEGMENTS = 200;
const FLAT_RADIUS = 15; // central property stays perfectly flat
const FLAT_BLEND = 22; // distance over which hills ramp up
const NOISE_SCALE = 0.14;
const HEIGHT_AMPLITUDE = 2.15;
const GROUND_Y = -0.05; // whole ground group is lowered slightly

const ROAD_HALF_WIDTH = 10; // no grass on |z| < this ...
const ROAD_HALF_LENGTH = 26; // ... and |x| < this

const GRASS_CANDIDATES = 70000;
const GRASS_AREA = 90;
const ROCK_CANDIDATES = 260;
const WEED_CANDIDATES = 900;
const FLOWER_CANDIDATES = 500;
const WIND_STRENGTH = 0.22;

const SPLAT_SIZE = 256;
const FLOWER_COLORS = ["#f4f1e8", "#f2d64b", "#b08be0", "#e87f9e"];

/* =====================================================================
   HELPERS
===================================================================== */
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function createSeededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* One shared noise instance for terrain, one for scatter density.
   Everything (mesh, grass, rocks, weeds) reads the SAME height function. */
const terrainNoise = createNoise2D(createSeededRandom(12345));
const scatterNoise = createNoise2D(createSeededRandom(56789));

/** World-space terrain height. x and z are WORLD coordinates. */
function getHeight(x: number, z: number) {
  const d = Math.hypot(x, z);
  const blend = smoothstep(FLAT_RADIUS, FLAT_RADIUS + FLAT_BLEND, d);
  if (blend <= 0) return 0;

  const s = NOISE_SCALE;
  const n =
    terrainNoise(x * s, z * s) * 1.1 +
    terrainNoise(x * s * 2.3 + 40, z * s * 2.3 + 17) * 0.75 +
    terrainNoise(x * s * 5.1 + 90, z * s * 5.1 + 33) * 0.35 +
    terrainNoise(x * s * 11.7 + 11, z * s * 11.7 + 71) * 0.12;

  return n * blend * HEIGHT_AMPLITUDE * 0.7;
}

function getSlope(x: number, z: number) {
  const e = 0.6;
  const dx = getHeight(x + e, z) - getHeight(x - e, z);
  const dz = getHeight(x, z + e) - getHeight(x, z - e);
  return Math.hypot(dx, dz) / (2 * e);
}

/** Dirt and rock amounts (0..1) at a world position. */
function getSurface(x: number, z: number) {
  const d = Math.hypot(x, z);
  const slope = getSlope(x, z);

  const n =
    scatterNoise(x * 0.07 + 3, z * 0.07 + 9) * 0.65 +
    scatterNoise(x * 0.23 + 50, z * 0.23 + 20) * 0.35;

  const lawnFade = smoothstep(FLAT_RADIUS - 6, FLAT_RADIUS + 8, d);
  const dirt = Math.max(smoothstep(0.3, 0.55, n) * lawnFade, smoothstep(0.25, 0.6, slope));
  const rock = smoothstep(0.55, 0.95, slope);

  return { dirt: Math.min(dirt, 1), rock };
}

function isExcluded(x: number, z: number, margin: number) {
  if (Math.hypot(x, z) < FLAT_RADIUS + margin) return true;
  if (Math.abs(z) < ROAD_HALF_WIDTH && Math.abs(x) < ROAD_HALF_LENGTH) return true;
  return false;
}

/* Reusable temporaries */
const _m = new THREE.Matrix4();
const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _e = new THREE.Euler();
const _c = new THREE.Color();

function setInstance(
  mesh: THREE.InstancedMesh,
  index: number,
  pos: [number, number, number],
  rot: [number, number, number],
  scale: [number, number, number]
) {
  _p.set(pos[0], pos[1], pos[2]);
  _q.setFromEuler(_e.set(rot[0], rot[1], rot[2]));
  _s.set(scale[0], scale[1], scale[2]);
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(index, _m);
}

function finishInstances(mesh: THREE.InstancedMesh, placed: number) {
  mesh.count = placed;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.frustumCulled = false;
}

/* =====================================================================
   TEXTURES (tileable, procedural)
===================================================================== */
function createTileTexture(
  base: [number, number, number],
  seed: number,
  lowFreq: number,
  grain: number
) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const rand = createSeededRandom(seed);
  const ph = [rand() * 6.28, rand() * 6.28, rand() * 6.28, rand() * 6.28];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * Math.PI * 2;
      const v = (y / size) * Math.PI * 2;
      // integer frequencies => seamless tiling
      const low =
        Math.sin(u * 2 + ph[0]) * Math.sin(v * 3 + ph[1]) * 0.5 +
        Math.sin(u * 5 + v * 4 + ph[2]) * 0.3 +
        Math.sin(u * 9 - v * 7 + ph[3]) * 0.2;
      const f = 1 + low * lowFreq + (rand() - 0.5) * grain;
      const i = (y * size + x) * 4;
      img.data[i] = THREE.MathUtils.clamp(base[0] * f, 0, 255);
      img.data[i + 1] = THREE.MathUtils.clamp(base[1] * f, 0, 255);
      img.data[i + 2] = THREE.MathUtils.clamp(base[2] * f, 0, 255);
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Bakes dirt (R) and rock (G) amounts over the whole terrain. */
function createSplatTexture() {
  const data = new Uint8Array(SPLAT_SIZE * SPLAT_SIZE * 4);
  for (let j = 0; j < SPLAT_SIZE; j++) {
    for (let i = 0; i < SPLAT_SIZE; i++) {
      const x = (i / (SPLAT_SIZE - 1) - 0.5) * TERRAIN_SIZE;
      const z = (j / (SPLAT_SIZE - 1) - 0.5) * TERRAIN_SIZE;
      const s = getSurface(x, z);
      const k = (j * SPLAT_SIZE + i) * 4;
      data[k] = s.dirt * 255;
      data[k + 1] = s.rock * 255;
      data[k + 2] = 0;
      data[k + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, SPLAT_SIZE, SPLAT_SIZE, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

/* =====================================================================
   MATERIALS
===================================================================== */
function createTerrainMaterial(
  grassTex: THREE.Texture,
  soilTex: THREE.Texture,
  rockTex: THREE.Texture,
  splatTex: THREE.Texture
) {
  const material = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uGrassTex = { value: grassTex };
    shader.uniforms.uSoilTex = { value: soilTex };
    shader.uniforms.uRockTex = { value: rockTex };
    shader.uniforms.uSplat = { value: splatTex };
    shader.uniforms.uSize = { value: TERRAIN_SIZE };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
         varying vec3 vWPos;
         varying vec3 vWNormal;`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         vWPos = (modelMatrix * vec4(position, 1.0)).xyz;
         vWNormal = normalize(mat3(modelMatrix) * normal);`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform sampler2D uGrassTex;
         uniform sampler2D uSoilTex;
         uniform sampler2D uRockTex;
         uniform sampler2D uSplat;
         uniform float uSize;
         varying vec3 vWPos;
         varying vec3 vWNormal;`
      )
      .replace(
        "#include <map_fragment>",
        `
         vec2 p = vWPos.xz;

         // two grass scales multiplied together hide visible tiling
         vec3 g1 = texture2D(uGrassTex, p * 0.20).rgb;
         vec3 g2 = texture2D(uGrassTex, p * 0.047 + 0.37).rgb;
         vec3 grass = g1 * g2 * 1.9;

         vec3 soil = texture2D(uSoilTex, p * 0.16).rgb;
         vec3 rock = texture2D(uRockTex, p * 0.12).rgb;

         vec4 splat = texture2D(uSplat, p / uSize + 0.5);
         float breakup = texture2D(uSoilTex, p * 0.55).r - 0.5;
         float dirt = smoothstep(0.35, 0.65, splat.r + breakup * 0.5);
         float rockAmt = smoothstep(0.4, 0.8, splat.g + breakup * 0.4);

         vec3 col = mix(grass, soil, dirt);
         col = mix(col, rock, rockAmt);
         diffuseColor.rgb = col;
        `
      );
  };

  return material;
}

function createGrassMaterial(uniforms: {
  uTime: { value: number };
  uWind: { value: number };
}) {
  const material = new THREE.MeshStandardMaterial({
    roughness: 0.95,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  material.onBeforeCompile = (shader) => {
    // shared uniform objects so useFrame can update them
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uWind = uniforms.uWind;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform float uTime;
         uniform float uWind;
         varying float vH;`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         vH = position.y;
         float phase = instanceMatrix[3].x * 0.35 + instanceMatrix[3].z * 0.27;
         float tip = position.y * position.y;
         float gust = sin(uTime * 1.4 + phase) + 0.5 * sin(uTime * 2.7 + phase * 1.7);
         transformed.x += gust * tip * uWind;
         transformed.z += cos(uTime * 1.1 + phase) * tip * uWind * 0.6;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         varying float vH;`
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
         diffuseColor.rgb *= mix(0.45, 1.15, vH);`
      );
  };

  return material;
}

/* =====================================================================
   GEOMETRIES
===================================================================== */
/** Tapered, slightly curved blade, base at y=0, height 1. */
function createBladeGeometry(width: number) {
  const g = new THREE.PlaneGeometry(width, 1, 1, 4);
  g.translate(0, 0.5, 0);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const t = p.getY(i);
    p.setX(i, p.getX(i) * (1 - t * 0.92));
    p.setZ(i, t * t * 0.15);
  }
  g.computeVertexNormals();
  return g;
}

function createRockGeometry() {
  const g = new THREE.IcosahedronGeometry(1, 2);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // position-based noise => duplicate vertices move identically (no cracks)
    const n = terrainNoise(v.x * 2 + v.z * 1.3, v.y * 2.3 - v.z) * 0.28;
    v.multiplyScalar(1 + n);
    v.y *= 0.7;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/* =====================================================================
   INSTANCE BUILDERS
===================================================================== */
function buildGrass(geometry: THREE.BufferGeometry, material: THREE.Material) {
  const mesh = new THREE.InstancedMesh(geometry, material, GRASS_CANDIDATES);
  const rand = createSeededRandom(1001);
  let n = 0;

  for (let i = 0; i < GRASS_CANDIDATES; i++) {
    const x = (rand() - 0.5) * GRASS_AREA;
    const z = (rand() - 0.5) * GRASS_AREA;
    if (isExcluded(x, z, 1)) continue;

    // density fades toward the edges of the field
    const d = Math.hypot(x, z);
    if (rand() > 1 - smoothstep(GRASS_AREA * 0.3, GRASS_AREA * 0.5, d)) continue;

    const surf = getSurface(x, z);
    if (surf.dirt > 0.55) continue;

    const density = (scatterNoise(x * 0.12 + 8, z * 0.12 + 5) + 1) * 0.5;
    if (density < 0.25 || rand() > density + 0.2) continue;

    const h = THREE.MathUtils.lerp(0.25, 0.8, rand()) * (0.7 + density * 0.6);
    const w = THREE.MathUtils.lerp(0.8, 1.5, rand());

    setInstance(
      mesh,
      n,
      [x, getHeight(x, z), z],
      [(rand() - 0.5) * 0.4, rand() * Math.PI * 2, (rand() - 0.5) * 0.3],
      [w, h, w]
    );

    _c.setHSL(
      THREE.MathUtils.lerp(0.23, 0.31, rand()),
      0.45,
      THREE.MathUtils.lerp(0.22, 0.4, density) * (0.9 + rand() * 0.2)
    );
    mesh.setColorAt(n, _c);
    n++;
  }

  finishInstances(mesh, n);
  mesh.receiveShadow = true;
  return mesh;
}

function buildRocks(geometry: THREE.BufferGeometry, material: THREE.Material) {
  const mesh = new THREE.InstancedMesh(geometry, material, ROCK_CANDIDATES);
  const rand = createSeededRandom(2002);
  let n = 0;

  for (let i = 0; i < ROCK_CANDIDATES; i++) {
    const x = (rand() - 0.5) * 92;
    const z = (rand() - 0.5) * 92;
    if (isExcluded(x, z, 1)) continue;

    const surf = getSurface(x, z);
    const near = Math.max(surf.dirt, surf.rock);
    if (near < 0.15 && rand() > 0.25) continue; // cluster rocks around dirt

    const boulder = rand() < 0.08;
    const size = boulder
      ? THREE.MathUtils.lerp(0.7, 1.3, rand())
      : THREE.MathUtils.lerp(0.1, 0.4, rand());

    setInstance(
      mesh,
      n,
      [x, getHeight(x, z) - size * 0.2, z], // half-buried
      [rand() * 0.4, rand() * Math.PI * 2, rand() * 0.4],
      [size * THREE.MathUtils.lerp(0.8, 1.3, rand()), size, size * THREE.MathUtils.lerp(0.8, 1.3, rand())]
    );

    _c.setHSL(0.09, 0.08, THREE.MathUtils.lerp(0.3, 0.5, rand()));
    mesh.setColorAt(n, _c);
    n++;
  }

  finishInstances(mesh, n);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function buildWeeds(geometry: THREE.BufferGeometry, material: THREE.Material) {
  const mesh = new THREE.InstancedMesh(geometry, material, WEED_CANDIDATES);
  const rand = createSeededRandom(3003);
  let n = 0;

  for (let i = 0; i < WEED_CANDIDATES; i++) {
    const x = (rand() - 0.5) * 88;
    const z = (rand() - 0.5) * 88;
    if (isExcluded(x, z, 2)) continue;
    if (getSurface(x, z).dirt > 0.7) continue;

    const density = (scatterNoise(x * 0.11 + 31, z * 0.11 + 18) + 1) * 0.5;
    if (density < 0.4) continue;

    // each weed is a small fan of 3 broad leaves
    const clumpY = rand() * Math.PI * 2;
    for (let k = 0; k < 3 && n < WEED_CANDIDATES; k++) {
      const h = THREE.MathUtils.lerp(0.2, 0.5, rand());
      setInstance(
        mesh,
        n,
        [x + (rand() - 0.5) * 0.15, getHeight(x, z), z + (rand() - 0.5) * 0.15],
        [(rand() - 0.5) * 0.5, clumpY + k * 2.1, 0.35 + rand() * 0.4],
        [1, h, 1]
      );
      _c.setHSL(THREE.MathUtils.lerp(0.22, 0.32, rand()), 0.5, THREE.MathUtils.lerp(0.3, 0.45, rand()));
      mesh.setColorAt(n, _c);
      n++;
    }
  }

  finishInstances(mesh, n);
  mesh.receiveShadow = true;
  return mesh;
}

function buildFlowers(geometry: THREE.BufferGeometry, material: THREE.Material) {
  const mesh = new THREE.InstancedMesh(geometry, material, FLOWER_CANDIDATES);
  const rand = createSeededRandom(4004);
  let n = 0;

  for (let i = 0; i < FLOWER_CANDIDATES; i++) {
    const x = (rand() - 0.5) * 86;
    const z = (rand() - 0.5) * 86;
    if (isExcluded(x, z, 2)) continue;
    if (getSurface(x, z).dirt > 0.4) continue;

    // flowers grow in patches
    if (scatterNoise(x * 0.09 + 70, z * 0.09 + 40) < 0.25) continue;

    const s = THREE.MathUtils.lerp(0.7, 1.4, rand());
    setInstance(
      mesh,
      n,
      [x, getHeight(x, z) + 0.18 + rand() * 0.2, z],
      [0, 0, 0],
      [s, s * 0.7, s]
    );
    _c.set(FLOWER_COLORS[Math.floor(rand() * FLOWER_COLORS.length)]);
    mesh.setColorAt(n, _c);
    n++;
  }

  finishInstances(mesh, n);
  return mesh;
}

/* =====================================================================
   COMPONENT
===================================================================== */
export function Ground() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWind: { value: WIND_STRENGTH },
    }),
    []
  );

  const textures = useMemo(
    () => ({
      grass: createTileTexture([86, 128, 58], 11, 0.35, 0.45),
      soil: createTileTexture([112, 80, 58], 22, 0.3, 0.55),
      rock: createTileTexture([122, 116, 104], 33, 0.25, 0.4),
      splat: createSplatTexture(),
    }),
    []
  );

  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_SEGMENTS,
      TERRAIN_SEGMENTS
    );
    const position = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      // mesh is rotated -PI/2 on X, so world z = -local y
      position.setZ(i, getHeight(x, -y));
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const terrainMaterial = useMemo(
    () => createTerrainMaterial(textures.grass, textures.soil, textures.rock, textures.splat),
    [textures]
  );
  const grassMaterial = useMemo(() => createGrassMaterial(uniforms), [uniforms]);
  const rockMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0, flatShading: true }),
    []
  );
  const weedMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0, side: THREE.DoubleSide }),
    []
  );
  const flowerMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0 }),
    []
  );

  const grassGeometry = useMemo(() => createBladeGeometry(0.07), []);
  const weedGeometry = useMemo(() => createBladeGeometry(0.18), []);
  const rockGeometry = useMemo(() => createRockGeometry(), []);
  const flowerGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 6, 4), []);

  const grass = useMemo(() => buildGrass(grassGeometry, grassMaterial), [grassGeometry, grassMaterial]);
  const rocks = useMemo(() => buildRocks(rockGeometry, rockMaterial), [rockGeometry, rockMaterial]);
  const weeds = useMemo(() => buildWeeds(weedGeometry, weedMaterial), [weedGeometry, weedMaterial]);
  const flowers = useMemo(
    () => buildFlowers(flowerGeometry, flowerMaterial),
    [flowerGeometry, flowerMaterial]
  );

  // dispose everything on unmount
  useEffect(() => {
    return () => {
      terrainGeometry.dispose();
      terrainMaterial.dispose();
      grassMaterial.dispose();
      rockMaterial.dispose();
      weedMaterial.dispose();
      flowerMaterial.dispose();
      grassGeometry.dispose();
      weedGeometry.dispose();
      rockGeometry.dispose();
      flowerGeometry.dispose();
      grass.dispose();
      rocks.dispose();
      weeds.dispose();
      flowers.dispose();
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [
    terrainGeometry,
    terrainMaterial,
    grassMaterial,
    rockMaterial,
    weedMaterial,
    flowerMaterial,
    grassGeometry,
    weedGeometry,
    rockGeometry,
    flowerGeometry,
    grass,
    rocks,
    weeds,
    flowers,
    textures,
  ]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group position={[0, GROUND_Y, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={terrainGeometry}
        material={terrainMaterial}
        receiveShadow
      />
      <primitive object={grass} />
      <primitive object={rocks} />
      <primitive object={weeds} />
      <primitive object={flowers} />
    </group>
  );
}