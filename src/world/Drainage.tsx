import { useMemo } from "react";
import * as THREE from "three";

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: "#9b9991",
  roughness: 0.92,
});

const darkConcreteMaterial = new THREE.MeshStandardMaterial({
  color: "#65645e",
  roughness: 1,
});

const dirtMaterial = new THREE.MeshStandardMaterial({
  color: "#665542",
  roughness: 1,
});

function DrainChannel({
  x,
  z,
  width,
  length,
}: {
  x: number;
  z: number;
  width: number;
  length: number;
}) {
  return (
    <group position={[x, 0.06, z]}>
      {/* Outer concrete channel */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* Dark recessed interior */}
      <mesh
        position={[0, 0.012, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry
          args={[width * 0.55, length * 0.96]}
        />
        <primitive
          object={darkConcreteMaterial}
          attach="material"
        />
      </mesh>

      {/* Inner dirt/water line */}
      <mesh
        position={[0, 0.018, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry
          args={[width * 0.22, length * 0.9]}
        />
        <primitive object={dirtMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function DrainSlab({
  x,
  z,
  width,
  length,
}: {
  x: number;
  z: number;
  width: number;
  length: number;
}) {
  return (
    <mesh
      position={[x, 0.15, z]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[width, 0.12, length]} />
      <primitive object={concreteMaterial} attach="material" />
    </mesh>
  );
}

export function Drainage() {
  const slabs = useMemo(
    () => [
      { x: -10, z: 8.8 },
      { x: -5, z: 8.8 },
      { x: 5, z: 8.8 },
      { x: 10, z: 8.8 },
    ],
    []
  );

  return (
    <group>
      {/* Main drainage channel */}
      <DrainChannel
        x={0}
        z={8.65}
        width={0.8}
        length={7}
      />

      {/* Covered sections */}
      {slabs.map((slab, index) => (
        <DrainSlab
          key={index}
          x={slab.x}
          z={slab.z}
          width={0.95}
          length={0.8}
        />
      ))}
    </group>
  );
}