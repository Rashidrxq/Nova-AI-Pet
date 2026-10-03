import { useMemo } from "react";
import * as THREE from "three";

type BackgroundHouseProps = {
  position: [number, number, number];
  scale?: number;
  wallColor?: string;
  roofColor?: string;
  roofType?: "tile" | "flat";
};

function BackgroundHouse({
  position,
  scale = 1,
  wallColor = "#d8d1c5",
  roofColor = "#7b4d35",
  roofType = "tile",
}: BackgroundHouseProps) {
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: wallColor,
        roughness: 0.88,
      }),
    [wallColor]
  );

  const roofMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: roofColor,
        roughness: 0.92,
      }),
    [roofColor]
  );

  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#303234",
        roughness: 0.5,
        metalness: 0.25,
      }),
    []
  );

  return (
    <group position={position} scale={scale}>
      {/* Main building */}
      <mesh
        position={[0, 2.2, 0]}
        castShadow
        receiveShadow
        material={wallMaterial}
      >
        <boxGeometry args={[7, 4.4, 5.5]} />
      </mesh>

      {/* Roof */}
      {roofType === "tile" ? (
        <group position={[0, 4.65, 0]}>
          {/* Left roof slope */}
          <mesh
            rotation={[0, 0, -0.48]}
            castShadow
            material={roofMaterial}
          >
            <boxGeometry args={[4.1, 0.22, 6.1]} />
          </mesh>

          {/* Right roof slope */}
          <mesh
            rotation={[0, 0, 0.48]}
            castShadow
            material={roofMaterial}
          >
            <boxGeometry args={[4.1, 0.22, 6.1]} />
          </mesh>
        </group>
      ) : (
        <mesh
          position={[0, 4.55, 0]}
          castShadow
          material={roofMaterial}
        >
          <boxGeometry args={[7.4, 0.35, 5.9]} />
        </mesh>
      )}

      {/* Front door */}
      <mesh
        position={[0, 1.35, 2.78]}
        material={frameMaterial}
      >
        <boxGeometry args={[1.1, 2.3, 0.08]} />
      </mesh>

      {/* Windows */}
      <mesh
        position={[-2.1, 2.35, 2.78]}
        material={frameMaterial}
      >
        <boxGeometry args={[1.5, 1.35, 0.08]} />
      </mesh>

      <mesh
        position={[2.1, 2.35, 2.78]}
        material={frameMaterial}
      >
        <boxGeometry args={[1.5, 1.35, 0.08]} />
      </mesh>

      {/* Small veranda */}
      <mesh
        position={[0, 0.18, 3.35]}
        receiveShadow
        material={wallMaterial}
      >
        <boxGeometry args={[4.8, 0.25, 1.4]} />
      </mesh>

      {/* Veranda columns */}
      {[-1.8, 1.8].map((x) => (
        <mesh
          key={x}
          position={[x, 1.45, 3.65]}
          castShadow
          material={wallMaterial}
        >
          <boxGeometry args={[0.22, 2.7, 0.22]} />
        </mesh>
      ))}
    </group>
  );
}

function BackgroundVegetation({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 2.6, 7]} />
        <meshStandardMaterial
          color="#62503b"
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 2.8, 0]} castShadow>
        <sphereGeometry args={[1.25, 10, 7]} />
        <meshStandardMaterial
          color="#42683d"
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

export function BackgroundHouses() {
  return (
    <group>
      {/* Far left */}
      <BackgroundHouse
        position={[-27, 0, -18]}
        scale={1.15}
        wallColor="#d9cbb8"
        roofColor="#754936"
        roofType="tile"
      />

      {/* Far right */}
      <BackgroundHouse
        position={[27, 0, -20]}
        scale={1.25}
        wallColor="#d6d9cf"
        roofColor="#6e4937"
        roofType="tile"
      />

      {/* Rear left */}
      <BackgroundHouse
        position={[-19, 0, -30]}
        scale={1.35}
        wallColor="#cfc8b9"
        roofColor="#806047"
        roofType="flat"
      />

      {/* Rear right */}
      <BackgroundHouse
        position={[20, 0, -32]}
        scale={1.4}
        wallColor="#ddd2c5"
        roofColor="#72513d"
        roofType="tile"
      />

      {/* Vegetation hiding parts of houses */}
      <BackgroundVegetation position={[-23, 0, -16]} />
      <BackgroundVegetation position={[-30, 0, -21]} />

      <BackgroundVegetation position={[23, 0, -18]} />
      <BackgroundVegetation position={[30, 0, -23]} />

      <BackgroundVegetation position={[-15, 0, -28]} />
      <BackgroundVegetation position={[15, 0, -29]} />
    </group>
  );
}