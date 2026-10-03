import { useMemo } from "react";
import * as THREE from "three";


const poleMaterial = new THREE.MeshStandardMaterial({
  color: "#3b3d3b",
  roughness: 0.65,
  metalness: 0.55,
});

const lampMaterial = new THREE.MeshStandardMaterial({
  color: "#242525",
  roughness: 0.5,
  metalness: 0.7,
});

const lightMaterial = new THREE.MeshStandardMaterial({
  color: "#ffe0a8",
  emissive: "#d99a4a",
  emissiveIntensity: 1.5,
  roughness: 0.35,
});

/* =========================================================
   SINGLE STREET LIGHT
========================================================= */

function StreetLight({
  position,
  height = 7.4,
}: {
  position: [number, number, number];
  height?: number;
}) {
  const poleGeometry = useMemo(
    () =>
      new THREE.CylinderGeometry(
        0.055,
        0.09,
        height,
        8
      ),
    [height]
  );

  return (
    <group position={position}>
      {/* Pole */}
      <mesh
        geometry={poleGeometry}
        position={[0, height / 2, 0]}
        material={poleMaterial}
        castShadow
      />

      {/* Small base */}
      <mesh
        position={[0, 0.08, 0]}
        material={poleMaterial}
      >
        <cylinderGeometry
          args={[0.16, 0.19, 0.16, 8]}
        />
      </mesh>

      {/* Curved-looking lamp arm */}
      <mesh
        position={[0.35, height - 0.2, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        material={poleMaterial}
      >
        <cylinderGeometry
          args={[0.045, 0.045, 0.7, 8]}
        />
      </mesh>

      {/* Lamp housing */}
      <mesh
        position={[0.68, height - 0.2, 0]}
        rotation={[0, 0, -0.08]}
        material={lampMaterial}
        castShadow
      >
        <boxGeometry args={[0.42, 0.16, 0.22]} />
      </mesh>

      {/* Warm lamp surface */}
      <mesh
        position={[0.68, height - 0.29, 0]}
        material={lightMaterial}
      >
        <boxGeometry args={[0.28, 0.035, 0.14]} />
      </mesh>

      {/* Actual light */}
      <pointLight
        position={[0.68, height - 0.38, 0]}
        color="#ffd28a"
        intensity={0.8}
        distance={7}
        decay={2}
      />
    </group>
  );
}

/* =========================================================
   STREET LIGHTS
========================================================= */

export function StreetLights() {
  return (
    <group>
      {/* Between first and second utility pole */}
      <StreetLight
        position={[-6, 0, 10.0]}
        height={7.2}
      />

      {/* Between second and third utility pole */}
      <StreetLight
        position={[6, 0, 10.0]}
        height={7.2}
      />
    </group>
  );
}