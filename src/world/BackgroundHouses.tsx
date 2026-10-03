import { useMemo } from "react";
import * as THREE from "three";

const wallMaterials = [
  new THREE.MeshStandardMaterial({
    color: "#d8d0c2",
    roughness: 0.88,
  }),
  new THREE.MeshStandardMaterial({
    color: "#c9d0c5",
    roughness: 0.9,
  }),
  new THREE.MeshStandardMaterial({
    color: "#ddd6c8",
    roughness: 0.87,
  }),
];

const roofMaterials = [
  new THREE.MeshStandardMaterial({
    color: "#7b4935",
    roughness: 0.95,
  }),
  new THREE.MeshStandardMaterial({
    color: "#5f5145",
    roughness: 0.92,
  }),
];

function BackgroundHouse({
  position,
  scale = 1,
  wallIndex = 0,
  roofIndex = 0,
}: {
  position: [number, number, number];
  scale?: number;
  wallIndex?: number;
  roofIndex?: number;
}) {
  const wallMaterial = wallMaterials[wallIndex];
  const roofMaterial = roofMaterials[roofIndex];

  return (
    <group
      position={position}
      scale={scale}
    >
      {/* Main building */}
      <mesh
        position={[0, 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[7, 4, 5]} />
        <primitive
          object={wallMaterial}
          attach="material"
        />
      </mesh>

      {/* Roof */}
      <mesh
        position={[0, 4.35, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[7.6, 0.35, 5.6]} />
        <primitive
          object={roofMaterial}
          attach="material"
        />
      </mesh>

      {/* Front veranda */}
      <mesh
        position={[0, 1.1, 2.8]}
        receiveShadow
      >
        <boxGeometry args={[4.8, 0.18, 1.3]} />
        <primitive
          object={wallMaterial}
          attach="material"
        />
      </mesh>

      {/* Entrance */}
      <mesh position={[0, 1.35, 2.55]}>
        <boxGeometry args={[1, 2.3, 0.08]} />
        <meshStandardMaterial
          color="#684631"
          roughness={0.7}
        />
      </mesh>

      {/* Windows */}
      {[-2.1, 2.1].map((x) => (
        <mesh
          key={x}
          position={[x, 2.3, 2.53]}
        >
          <boxGeometry args={[1.4, 1.3, 0.08]} />
          <meshStandardMaterial
            color="#617b7b"
            roughness={0.18}
            metalness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

function SmallRoofHouse({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c8c1b4",
        roughness: 0.9,
      }),
    []
  );

  const roofMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#704535",
        roughness: 0.95,
      }),
    []
  );

  return (
    <group
      position={position}
      scale={scale}
    >
      <mesh
        position={[0, 1.5, 0]}
        castShadow
      >
        <boxGeometry args={[6, 3, 4.5]} />
        <primitive
          object={wallMaterial}
          attach="material"
        />
      </mesh>

      {/* Sloped-looking roof volume */}
      <mesh
        position={[0, 3.25, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[6.5, 0.5, 5]} />
        <primitive
          object={roofMaterial}
          attach="material"
        />
      </mesh>

      <mesh
        position={[0, 1.6, 2.28]}
      >
        <boxGeometry args={[0.9, 1.9, 0.08]} />
        <meshStandardMaterial
          color="#684633"
          roughness={0.75}
        />
      </mesh>

      <mesh
        position={[-1.8, 2, 2.28]}
      >
        <boxGeometry args={[1.2, 1.1, 0.08]} />
        <meshStandardMaterial
          color="#6f8582"
          roughness={0.25}
        />
      </mesh>

      <mesh
        position={[1.8, 2, 2.28]}
      >
        <boxGeometry args={[1.2, 1.1, 0.08]} />
        <meshStandardMaterial
          color="#6f8582"
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

export function BackgroundHouses() {
  return (
    <group>
      {/* Left side */}
      <BackgroundHouse
        position={[-25, 0, -10]}
        scale={1.15}
        wallIndex={0}
        roofIndex={0}
      />

      <SmallRoofHouse
        position={[-31, 0, 4]}
        scale={0.9}
      />

      {/* Right side */}
      <BackgroundHouse
        position={[25, 0, -8]}
        scale={0.95}
        wallIndex={1}
        roofIndex={1}
      />

      <SmallRoofHouse
        position={[31, 0, 3]}
        scale={1.05}
      />

      {/* Far background */}
      <BackgroundHouse
        position={[0, 0, -32]}
        scale={1.25}
        wallIndex={2}
        roofIndex={0}
      />
    </group>
  );
}
