import { useMemo } from "react";
import * as THREE from "three";

/* =========================================================
   SHARED MATERIALS
========================================================= */

const poleMaterial = new THREE.MeshStandardMaterial({
  color: "#8b8a82",
  roughness: 0.9,
});

const concreteDarkMaterial = new THREE.MeshStandardMaterial({
  color: "#6f706b",
  roughness: 0.95,
});

const metalMaterial = new THREE.MeshStandardMaterial({
  color: "#343638",
  metalness: 0.7,
  roughness: 0.4,
});

const insulatorMaterial = new THREE.MeshStandardMaterial({
  color: "#d8d5c9",
  roughness: 0.7,
});

/* =========================================================
   SINGLE UTILITY POLE
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
        0.13,
        0.18,
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
      {/* =================================================
          MAIN CONCRETE POLE
      ================================================= */}

      <mesh
        geometry={poleGeometry}
        position={[0, height / 2, 0]}
        material={poleMaterial}
        castShadow
        receiveShadow
      />

      {/* =================================================
          SMALL BASE / FOOTING
      ================================================= */}

      <mesh
        position={[0, 0.08, 0]}
        material={concreteDarkMaterial}
        receiveShadow
      >
        <cylinderGeometry
          args={[0.24, 0.28, 0.16, 8]}
        />
      </mesh>

      {/* =================================================
          CROSS ARM
      ================================================= */}

      <mesh
        position={[0, height - 0.65, 0]}
        material={metalMaterial}
        castShadow
      >
        <boxGeometry
          args={[3.1, 0.12, 0.12]}
        />
      </mesh>

      {/* =================================================
          CROSS ARM SUPPORT
      ================================================= */}

      <mesh
        position={[0, height - 1.0, 0]}
        rotation={[0, 0, Math.PI / 4]}
        material={metalMaterial}
      >
        <boxGeometry
          args={[0.75, 0.07, 0.07]}
        />
      </mesh>

      {/* =================================================
          INSULATORS
      ================================================= */}

      {[-1.2, 0, 1.2].map((x) => (
        <group
          key={x}
          position={[x, height - 0.38, 0]}
        >
          {/* Insulator stem */}
          <mesh
            material={metalMaterial}
          >
            <cylinderGeometry
              args={[0.025, 0.025, 0.22, 8]}
            />
          </mesh>

          {/* Insulator */}
          <mesh
            position={[0, 0.15, 0]}
            material={insulatorMaterial}
          >
            <cylinderGeometry
              args={[0.07, 0.09, 0.18, 8]}
            />
          </mesh>
        </group>
      ))}

      {/* =================================================
          SECOND SMALL CROSS ARM
      ================================================= */}

      <mesh
        position={[0, height - 1.35, 0]}
        material={metalMaterial}
        castShadow
      >
        <boxGeometry
          args={[1.8, 0.09, 0.09]}
        />
      </mesh>

      {[-0.65, 0.65].map((x) => (
        <mesh
          key={x}
          position={[
            x,
            height - 1.18,
            0,
          ]}
          material={insulatorMaterial}
        >
          <cylinderGeometry
            args={[0.055, 0.075, 0.18, 8]}
          />
        </mesh>
      ))}

      {/* =================================================
          SMALL WARNING PLATE
      ================================================= */}

      <mesh
        position={[
          0,
          height * 0.45,
          0.16,
        ]}
        material={concreteDarkMaterial}
      >
        <boxGeometry
          args={[0.22, 0.38, 0.025]}
        />
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
      {/* Roadside pole 1 */}
      <UtilityPole
        position={[-12, 0, 10.5]}
        height={8.5}
        rotation={0}
      />

      {/* Roadside pole 2 */}
      <UtilityPole
        position={[0, 0, 10.5]}
        height={9}
        rotation={0}
      />

      {/* Roadside pole 3 */}
      <UtilityPole
        position={[12, 0, 10.5]}
        height={8.7}
        rotation={0}
      />
    </group>
  );
}