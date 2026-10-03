import { useMemo } from "react";
import * as THREE from "three";

/* =========================================================
   SHARED MATERIALS
========================================================= */

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: "#777873",
  roughness: 0.9,
  metalness: 0,
});

const concreteCapMaterial = new THREE.MeshStandardMaterial({
  color: "#686a66",
  roughness: 0.92,
});

const metalMaterial = new THREE.MeshStandardMaterial({
  color: "#292b2a",
  roughness: 0.48,
  metalness: 0.65,
});

const insulatorMaterial = new THREE.MeshStandardMaterial({
  color: "#d7d1bd",
  roughness: 0.7,
});

const warningMaterial = new THREE.MeshStandardMaterial({
  color: "#8b6e32",
  roughness: 0.8,
});

/* =========================================================
   CONCRETE UTILITY POLE
========================================================= */

function UtilityPole({
  position,
  height = 8.5,
  rotation = 0,
}: {
  position: [number, number, number];
  height?: number;
  rotation?: number;
}) {
  const poleGeometry = useMemo(
    () =>
      new THREE.CylinderGeometry(
        0.15,
        0.21,
        height,
        8
      ),
    [height]
  );

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
    >
      {/* Main concrete pole */}
      <mesh
        geometry={poleGeometry}
        position={[0, height / 2, 0]}
        material={concreteMaterial}
        castShadow
        receiveShadow
      />

      {/* Slightly wider buried/base section */}
      <mesh
        position={[0, 0.16, 0]}
        material={concreteCapMaterial}
        castShadow
      >
        <cylinderGeometry args={[0.25, 0.29, 0.32, 8]} />
      </mesh>

      {/* -----------------------------------------------
          MAIN CROSS ARM
      ------------------------------------------------ */}

      <mesh
        position={[0, height - 1.0, 0]}
        material={metalMaterial}
        castShadow
      >
        <boxGeometry args={[3.2, 0.12, 0.12]} />
      </mesh>

      {/* Cross-arm support */}
      <mesh
        position={[0, height - 1.45, 0]}
        rotation={[0, 0, Math.PI / 4]}
        material={metalMaterial}
      >
        <boxGeometry args={[0.85, 0.07, 0.07]} />
      </mesh>

      {/* -----------------------------------------------
          INSULATORS
      ------------------------------------------------ */}

      {[-1.15, 0, 1.15].map((x) => (
        <group
          key={x}
          position={[
            x,
            height - 0.78,
            0,
          ]}
        >
          <mesh material={metalMaterial}>
            <cylinderGeometry
              args={[0.035, 0.035, 0.28, 8]}
            />
          </mesh>

          <mesh
            position={[0, 0.2, 0]}
            material={insulatorMaterial}
          >
            <cylinderGeometry
              args={[0.12, 0.08, 0.18, 8]}
            />
          </mesh>
        </group>
      ))}

      {/* -----------------------------------------------
          SMALL LOWER COMMUNICATION ARM
      ------------------------------------------------ */}

      <mesh
        position={[0, height - 2.0, 0]}
        material={metalMaterial}
        castShadow
      >
        <boxGeometry args={[2.1, 0.075, 0.075]} />
      </mesh>

      {[-0.7, 0.7].map((x) => (
        <mesh
          key={x}
          position={[
            x,
            height - 1.82,
            0,
          ]}
          material={metalMaterial}
        >
          <cylinderGeometry
            args={[0.025, 0.025, 0.35, 6]}
          />
        </mesh>
      ))}

      {/* -----------------------------------------------
          SMALL IDENTIFICATION / WARNING PLATE
      ------------------------------------------------ */}

      <mesh
        position={[0, 2.2, -0.17]}
        material={warningMaterial}
      >
        <boxGeometry args={[0.24, 0.35, 0.025]} />
      </mesh>
    </group>
  );
}

/* =========================================================
   UTILITY POLES
========================================================= */

export function UtilityPoles() {
  return (
    <group>
      {/* Road-side pole 1 */}
      <UtilityPole
        position={[-10.5, 0, 10.0]}
        height={8.8}
        rotation={0.02}
      />

      {/* Road-side pole 2 */}
      <UtilityPole
        position={[0, 0, 9.4]}
        height={9.2}
        rotation={-0.015}
      />

      {/* Road-side pole 3 */}
      <UtilityPole
        position={[11.0, 0, 10.2]}
        height={8.7}
        rotation={0.025}
      />

      {/* Background pole */}
      <UtilityPole
        position={[-19, 0, 2]}
        height={9.5}
        rotation={-0.03}
      />
    </group>
  );
}