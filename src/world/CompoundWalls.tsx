import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   SHARED MATERIALS
========================================================= */

function useCompoundMaterials() {
  return useMemo(() => {
    const plaster = new THREE.MeshStandardMaterial({
      color: "#d0ccc2",
      roughness: 0.92,
      metalness: 0,
    });

    const plasterLight = new THREE.MeshStandardMaterial({
      color: "#d8d4ca",
      roughness: 0.9,
      metalness: 0,
    });

    const concrete = new THREE.MeshStandardMaterial({
      color: "#aaa79f",
      roughness: 0.94,
      metalness: 0,
    });

    const weatheredConcrete = new THREE.MeshStandardMaterial({
      color: "#918d84",
      roughness: 1,
      metalness: 0,
    });

    const metal = new THREE.MeshStandardMaterial({
      color: "#202527",
      roughness: 0.38,
      metalness: 0.72,
    });

    const metalDark = new THREE.MeshStandardMaterial({
      color: "#15191b",
      roughness: 0.42,
      metalness: 0.68,
    });

    return {
      plaster,
      plasterLight,
      concrete,
      weatheredConcrete,
      metal,
      metalDark,
    };
  }, []);
}

/* =========================================================
   WALL SECTION
========================================================= */

function WallSection({
  position,
  size,
  materials,
}: {
  position: [number, number, number];
  size: [number, number, number];
  materials: ReturnType<typeof useCompoundMaterials>;
}) {
  const [width, height, depth] = size;

  return (
    <group position={position}>
      {/* Main plastered masonry */}
      <RoundedBox
        args={[width, height, depth]}
        radius={0.035}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <primitive object={materials.plaster} attach="material" />
      </RoundedBox>

      {/* Slightly darker lower plaster / dirt zone */}
      <mesh
        position={[0, -height / 2 + 0.13, depth / 2 + 0.008]}
        receiveShadow
      >
        <boxGeometry args={[width - 0.04, 0.22, 0.018]} />
        <primitive object={materials.weatheredConcrete} attach="material" />
      </mesh>

      {/* Concrete coping */}
      <RoundedBox
        position={[0, height / 2 + 0.10, 0]}
        args={[width + 0.12, 0.20, depth + 0.12]}
        radius={0.025}
        smoothness={3}
        castShadow
      >
        <primitive object={materials.concrete} attach="material" />
      </RoundedBox>
    </group>
  );
}

/* =========================================================
   WALL PILLAR
========================================================= */

function WallPillar({
  position,
  height = 2.3,
  materials,
}: {
  position: [number, number, number];
  height?: number;
  materials: ReturnType<typeof useCompoundMaterials>;
}) {
  return (
    <group position={position}>
      {/* Main pillar */}
      <RoundedBox
        position={[0, height / 2, 0]}
        args={[0.42, height, 0.46]}
        radius={0.045}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <primitive object={materials.plasterLight} attach="material" />
      </RoundedBox>

      {/* Pillar cap */}
      <RoundedBox
        position={[0, height + 0.10, 0]}
        args={[0.54, 0.20, 0.56]}
        radius={0.035}
        smoothness={3}
        castShadow
      >
        <primitive object={materials.concrete} attach="material" />
      </RoundedBox>
    </group>
  );
}

/* =========================================================
   GATE POST
========================================================= */

function GatePost({
  position,
  height = 2.7,
  materials,
}: {
  position: [number, number, number];
  height?: number;
  materials: ReturnType<typeof useCompoundMaterials>;
}) {
  return (
    <group position={position}>
      {/* Slightly wider base */}
      <RoundedBox
        position={[0, 0.25, 0]}
        args={[0.62, 0.5, 0.68]}
        radius={0.05}
        smoothness={3}
        castShadow
      >
        <primitive object={materials.concrete} attach="material" />
      </RoundedBox>

      {/* Main gate column */}
      <RoundedBox
        position={[0, height / 2, 0]}
        args={[0.52, height, 0.58]}
        radius={0.045}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <primitive object={materials.plasterLight} attach="material" />
      </RoundedBox>

      {/* Gate post cap */}
      <RoundedBox
        position={[0, height + 0.12, 0]}
        args={[0.66, 0.22, 0.72]}
        radius={0.035}
        smoothness={3}
        castShadow
      >
        <primitive object={materials.concrete} attach="material" />
      </RoundedBox>
    </group>
  );
}

/* =========================================================
   VEHICLE GATE
========================================================= */

function VehicleGate({
  width,
  materials,
}: {
  width: number;
  materials: ReturnType<typeof useCompoundMaterials>;
}) {
  const gateHeight = 2.05;

  const slatCount = 13;
  const innerWidth = width - 0.30;
  const spacing = innerWidth / slatCount;

  return (
    <group position={[0, 0, 14.12]}>
      {/* Gate outer frame */}
      <RoundedBox
        position={[0, gateHeight / 2, 0]}
        args={[width, gateHeight, 0.12]}
        radius={0.025}
        smoothness={2}
        castShadow
      >
        <primitive object={materials.metal} attach="material" />
      </RoundedBox>

      {/* Hide the center of the frame so the slats can be visible */}
      <mesh
        position={[0, gateHeight / 2, 0.07]}
        castShadow
      >
        <boxGeometry args={[width - 0.22, gateHeight - 0.22, 0.05]} />
        <meshStandardMaterial
          color="#252a2c"
          roughness={0.55}
          metalness={0.55}
        />
      </mesh>

      {/* Vertical metal slats */}
      {Array.from({ length: slatCount }).map((_, index) => {
        const x =
          -innerWidth / 2 +
          spacing / 2 +
          index * spacing;

        return (
          <mesh
            key={index}
            position={[x, gateHeight / 2, 0.15]}
            castShadow
          >
            <boxGeometry args={[0.055, gateHeight - 0.22, 0.08]} />
            <primitive object={materials.metalDark} attach="material" />
          </mesh>
        );
      })}

      {/* Structural horizontal supports */}
      {[0.45, 1.55].map((y) => (
        <mesh
          key={y}
          position={[0, y, 0.17]}
          castShadow
        >
          <boxGeometry args={[width - 0.24, 0.075, 0.08]} />
          <primitive object={materials.metal} attach="material" />
        </mesh>
      ))}

      {/* Bottom rail */}
      <mesh
        position={[0, 0.14, 0.17]}
        castShadow
      >
        <boxGeometry args={[width - 0.18, 0.12, 0.10]} />
        <primitive object={materials.metalDark} attach="material" />
      </mesh>

      {/* Gate hinge hardware */}
      <mesh
        position={[-width / 2 + 0.12, 0.65, 0.20]}
        castShadow
      >
        <cylinderGeometry args={[0.045, 0.045, 0.16, 12]} />
        <primitive object={materials.metalDark} attach="material" />
      </mesh>

      <mesh
        position={[-width / 2 + 0.12, 1.45, 0.20]}
        castShadow
      >
        <cylinderGeometry args={[0.045, 0.045, 0.16, 12]} />
        <primitive object={materials.metalDark} attach="material" />
      </mesh>

      {/* Simple handle / lock area */}
      <mesh
        position={[width * 0.30, 1.0, 0.22]}
        castShadow
      >
        <boxGeometry args={[0.12, 0.35, 0.07]} />
        <primitive object={materials.metal} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   PEDESTRIAN GATE
========================================================= */

function PedestrianGate({
  width,
  materials,
}: {
  width: number;
  materials: ReturnType<typeof useCompoundMaterials>;
}) {
  const gateHeight = 2.05;
  const slatCount = 4;
  const innerWidth = width - 0.25;
  const spacing = innerWidth / slatCount;

  return (
    <group position={[10.5, 0, 14.12]}>
      {/* Gate frame */}
      <RoundedBox
        position={[0, gateHeight / 2, 0]}
        args={[width, gateHeight, 0.11]}
        radius={0.025}
        smoothness={2}
        castShadow
      >
        <primitive object={materials.metal} attach="material" />
      </RoundedBox>

      {/* Vertical slats */}
      {Array.from({ length: slatCount }).map((_, index) => {
        const x =
          -innerWidth / 2 +
          spacing / 2 +
          index * spacing;

        return (
          <mesh
            key={index}
            position={[x, gateHeight / 2, 0.15]}
            castShadow
          >
            <boxGeometry args={[0.06, gateHeight - 0.22, 0.08]} />
            <primitive object={materials.metalDark} attach="material" />
          </mesh>
        );
      })}

      {/* Two structural rails */}
      {[0.45, 1.55].map((y) => (
        <mesh
          key={y}
          position={[0, y, 0.17]}
          castShadow
        >
          <boxGeometry args={[width - 0.20, 0.07, 0.08]} />
          <primitive object={materials.metal} attach="material" />
        </mesh>
      ))}

      {/* Handle */}
      <mesh
        position={[0.48, 1.0, 0.22]}
        castShadow
      >
        <boxGeometry args={[0.08, 0.32, 0.06]} />
        <primitive object={materials.metal} attach="material" />
      </mesh>

      {/* Hinges */}
      {[0.65, 1.45].map((y) => (
        <mesh
          key={y}
          position={[-width / 2 + 0.10, y, 0.20]}
          castShadow
        >
          <cylinderGeometry args={[0.035, 0.035, 0.14, 12]} />
          <primitive object={materials.metalDark} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   COMPOUND WALL
========================================================= */

export function CompoundWalls() {
  const materials = useCompoundMaterials();

  return (
    <group>
      {/* =================================================
          LEFT WALL
      ================================================= */}

      <WallSection
        position={[-14, 1.0, 0]}
        size={[0.3, 2, 28]}
        materials={materials}
      />

      {/* Pillars */}
      <WallPillar
        position={[-14, 0, -12]}
        materials={materials}
      />

      <WallPillar
        position={[-14, 0, -8]}
        materials={materials}
      />

      <WallPillar
        position={[-14, 0, -4]}
        materials={materials}
      />

      <WallPillar
        position={[-14, 0, 0]}
        materials={materials}
      />

      <WallPillar
        position={[-14, 0, 4]}
        materials={materials}
      />

      <WallPillar
        position={[-14, 0, 8]}
        materials={materials}
      />

      <WallPillar
        position={[-14, 0, 12]}
        materials={materials}
      />

      {/* =================================================
          RIGHT WALL
      ================================================= */}

      <WallSection
        position={[14, 1.0, 0]}
        size={[0.3, 2, 28]}
        materials={materials}
      />

      <WallPillar
        position={[14, 0, -12]}
        materials={materials}
      />

      <WallPillar
        position={[14, 0, -8]}
        materials={materials}
      />

      <WallPillar
        position={[14, 0, -4]}
        materials={materials}
      />

      <WallPillar
        position={[14, 0, 0]}
        materials={materials}
      />

      <WallPillar
        position={[14, 0, 4]}
        materials={materials}
      />

      <WallPillar
        position={[14, 0, 8]}
        materials={materials}
      />

      <WallPillar
        position={[14, 0, 12]}
        materials={materials}
      />

      {/* =================================================
          BACK WALL
      ================================================= */}

      <WallSection
        position={[0, 1.0, -14]}
        size={[28, 2, 0.3]}
        materials={materials}
      />

      <WallPillar
        position={[-12, 0, -14]}
        materials={materials}
      />

      <WallPillar
        position={[-8, 0, -14]}
        materials={materials}
      />

      <WallPillar
        position={[-4, 0, -14]}
        materials={materials}
      />

      <WallPillar
        position={[0, 0, -14]}
        materials={materials}
      />

      <WallPillar
        position={[4, 0, -14]}
        materials={materials}
      />

      <WallPillar
        position={[8, 0, -14]}
        materials={materials}
      />

      <WallPillar
        position={[12, 0, -14]}
        materials={materials}
      />

      {/* =================================================
          FRONT LEFT WALL
      ================================================= */}

      <WallSection
        position={[-9, 1.0, 14]}
        size={[10, 2, 0.3]}
        materials={materials}
      />

      <WallPillar
        position={[-13.7, 0, 14]}
        materials={materials}
      />

      <WallPillar
        position={[-9.5, 0, 14]}
        materials={materials}
      />

      <WallPillar
        position={[-5, 0, 14]}
        materials={materials}
      />

      {/* =================================================
          FRONT RIGHT WALL
      ================================================= */}

      <WallSection
        position={[9, 1.0, 14]}
        size={[10, 2, 0.3]}
        materials={materials}
      />

      <WallPillar
        position={[5, 0, 14]}
        materials={materials}
      />

      <WallPillar
        position={[9, 0, 14]}
        materials={materials}
      />

      <WallPillar
        position={[13.7, 0, 14]}
        materials={materials}
      />

      {/* =================================================
          VEHICLE GATE POSTS
      ================================================= */}

      <GatePost
        position={[-3.65, 0, 14]}
        height={2.7}
        materials={materials}
      />

      <GatePost
        position={[3.65, 0, 14]}
        height={2.7}
        materials={materials}
      />

      {/* =================================================
          VEHICLE GATE
      ================================================= */}

      <VehicleGate
        width={7}
        materials={materials}
      />

      {/* =================================================
          PEDESTRIAN GATE POSTS
      ================================================= */}

      <GatePost
        position={[9.35, 0, 14]}
        height={2.5}
        materials={materials}
      />

      <GatePost
        position={[11.65, 0, 14]}
        height={2.5}
        materials={materials}
      />

      {/* =================================================
          PEDESTRIAN GATE
      ================================================= */}

      <PedestrianGate
        width={2}
        materials={materials}
      />
    </group>
  );
}