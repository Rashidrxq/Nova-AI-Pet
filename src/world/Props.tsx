import { useMemo } from "react";
import * as THREE from "three";

/* =========================================================
   SHARED MATERIALS
========================================================= */

const metalMaterial = new THREE.MeshStandardMaterial({
  color: "#25282a",
  roughness: 0.48,
  metalness: 0.65,
});

const rubberMaterial = new THREE.MeshStandardMaterial({
  color: "#171819",
  roughness: 0.92,
});

const plasticMaterial = new THREE.MeshStandardMaterial({
  color: "#555b57",
  roughness: 0.82,
});

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: "#aaa79f",
  roughness: 0.92,
});

const woodMaterial = new THREE.MeshStandardMaterial({
  color: "#76543d",
  roughness: 0.78,
});

const ceramicMaterial = new THREE.MeshStandardMaterial({
  color: "#c8bba5",
  roughness: 0.86,
});

/* =========================================================
   PARKED CAR
========================================================= */

function Car({
  position = [5.5, 0, 9] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#7d8583",
        roughness: 0.42,
        metalness: 0.2,
      }),
    []
  );

  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* Main body */}
      <mesh
        position={[0, 0.75, 0]}
        castShadow
        receiveShadow
        material={bodyMaterial}
      >
        <boxGeometry args={[4.1, 0.9, 1.75]} />
      </mesh>

      {/* Cabin */}
      <mesh
        position={[-0.15, 1.35, 0]}
        castShadow
        material={bodyMaterial}
      >
        <boxGeometry args={[2.3, 0.75, 1.55]} />
      </mesh>

      {/* Windows */}
      <mesh position={[-0.65, 1.38, 0.79]}>
        <boxGeometry args={[1.0, 0.48, 0.025]} />
        <meshStandardMaterial
          color="#27353a"
          roughness={0.18}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0.55, 1.38, 0.79]}>
        <boxGeometry args={[0.85, 0.48, 0.025]} />
        <meshStandardMaterial
          color="#27353a"
          roughness={0.18}
          metalness={0.2}
        />
      </mesh>

      {/* Wheels */}
      {[
        [-1.35, 0.48, 0.92],
        [1.35, 0.48, 0.92],
        [-1.35, 0.48, -0.92],
        [1.35, 0.48, -0.92],
      ].map(([x, y, z], i) => (
        <mesh
          key={i}
          position={[x, y, z]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          material={rubberMaterial}
        >
          <cylinderGeometry args={[0.38, 0.38, 0.22, 16]} />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   SCOOTER
========================================================= */

function Scooter({
  position = [-5, 0, 10] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position} rotation={[0, -0.35, 0]}>
      {/* Main body */}
      <mesh
        position={[0, 0.65, 0]}
        castShadow
        material={metalMaterial}
      >
        <boxGeometry args={[1.45, 0.42, 0.45]} />
      </mesh>

      {/* Front column */}
      <mesh
        position={[-0.48, 1.15, 0]}
        rotation={[0, 0, -0.15]}
        castShadow
        material={metalMaterial}
      >
        <cylinderGeometry args={[0.055, 0.055, 1.25, 8]} />
      </mesh>

      {/* Handlebar */}
      <mesh
        position={[-0.56, 1.68, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={metalMaterial}
      >
        <cylinderGeometry args={[0.035, 0.035, 0.65, 8]} />
      </mesh>

      {/* Seat */}
      <mesh
        position={[0.35, 1.08, 0]}
        castShadow
        material={rubberMaterial}
      >
        <boxGeometry args={[0.85, 0.16, 0.4]} />
      </mesh>

      {/* Wheels */}
      <mesh
        position={[-0.52, 0.4, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        material={rubberMaterial}
      >
        <cylinderGeometry args={[0.28, 0.28, 0.12, 16]} />
      </mesh>

      <mesh
        position={[0.72, 0.4, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        material={rubberMaterial}
      >
        <cylinderGeometry args={[0.28, 0.28, 0.12, 16]} />
      </mesh>

      {/* Headlight */}
      <mesh position={[-0.72, 1.35, 0]}>
        <sphereGeometry args={[0.13, 12, 8]} />
        <meshStandardMaterial
          color="#fff1c2"
          emissive="#fff1c2"
          emissiveIntensity={0.15}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   GARBAGE BIN
========================================================= */

function GarbageBin({
  position = [-10.8, 0, 11] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh
        position={[0, 0.65, 0]}
        castShadow
        material={plasticMaterial}
      >
        <boxGeometry args={[0.75, 1.25, 0.65]} />
      </mesh>

      {/* Lid */}
      <mesh
        position={[0, 1.32, 0]}
        castShadow
        material={plasticMaterial}
      >
        <boxGeometry args={[0.85, 0.12, 0.72]} />
      </mesh>

      {/* Wheels */}
      {[-0.25, 0.25].map((x) => (
        <mesh
          key={x}
          position={[x, 0.18, -0.3]}
          rotation={[Math.PI / 2, 0, 0]}
          material={rubberMaterial}
        >
          <cylinderGeometry args={[0.09, 0.09, 0.1, 12]} />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   FLOWER POT
========================================================= */

function FlowerPot({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Pot */}
      <mesh
        position={[0, 0.22, 0]}
        castShadow
        material={ceramicMaterial}
      >
        <cylinderGeometry args={[0.28, 0.22, 0.44, 12]} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.035, 12]} />
        <meshStandardMaterial
          color="#4b3928"
          roughness={1}
        />
      </mesh>

      {/* Plant stems */}
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh
          key={i}
          position={[x, 0.75 + i * 0.03, 0]}
          rotation={[0.08 * i, 0, 0]}
        >
          <cylinderGeometry args={[0.018, 0.018, 0.6, 6]} />
          <meshStandardMaterial
            color="#41663c"
            roughness={0.95}
          />
        </mesh>
      ))}

      {/* Leaves */}
      <mesh position={[-0.12, 0.98, 0]}>
        <sphereGeometry args={[0.14, 7, 5]} />
        <meshStandardMaterial
          color="#4c793f"
          roughness={0.95}
        />
      </mesh>

      <mesh position={[0.1, 1.02, 0.02]}>
        <sphereGeometry args={[0.16, 7, 5]} />
        <meshStandardMaterial
          color="#547f45"
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   OUTDOOR BENCH
========================================================= */

function Bench({
  position = [7, 0, 5] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh
        position={[0, 0.75, 0]}
        castShadow
        material={woodMaterial}
      >
        <boxGeometry args={[1.8, 0.16, 0.5]} />
      </mesh>

      {/* Legs */}
      {[-0.65, 0.65].map((x) => (
        <mesh
          key={x}
          position={[x, 0.38, 0]}
          castShadow
          material={metalMaterial}
        >
          <boxGeometry args={[0.12, 0.75, 0.4]} />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   METER BOX
========================================================= */

function MeterBox({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh
        castShadow
        material={concreteMaterial}
      >
        <boxGeometry args={[0.7, 1.0, 0.18]} />
      </mesh>

      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[0.52, 0.72, 0.025]} />
        <meshStandardMaterial
          color="#242728"
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   WATER PIPE
========================================================= */

function WaterPipe({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        material={plasticMaterial}
      >
        <cylinderGeometry args={[0.045, 0.045, 1.8, 8]} />
      </mesh>

      <mesh
        position={[0.9, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={plasticMaterial}
      >
        <cylinderGeometry args={[0.045, 0.045, 0.3, 8]} />
      </mesh>
    </group>
  );
}

/* =========================================================
   PROPS
========================================================= */

export function Props() {
  return (
    <group>
      {/* Vehicle */}
      <Car position={[5.5, 0, 9]} />

      {/* Scooter */}
      <Scooter position={[-5.2, 0, 10]} />

      {/* Garbage bin */}
      <GarbageBin position={[-10.8, 0, 11]} />

      {/* Bench */}
      <Bench position={[7, 0, 5]} />

      {/* Flower pots */}
      <FlowerPot position={[-4.8, 0, 5.1]} />
      <FlowerPot position={[4.8, 0, 5.2]} scale={0.85} />
      <FlowerPot position={[6.2, 0, 4.8]} scale={0.75} />

      {/* Electrical meter */}
      <MeterBox position={[13.78, 1.35, 7]} />

      {/* Water pipe */}
      <WaterPipe position={[-12.8, 0.45, 7]} />
    </group>
  );
}