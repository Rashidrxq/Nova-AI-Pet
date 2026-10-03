import { useMemo } from "react";
import * as THREE from "three";

export function Ground() {
  const grassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#718f5b",
        roughness: 1,
        metalness: 0,
      }),
    []
  );

  const soilMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#6b5140",
        roughness: 1,
        metalness: 0,
      }),
    []
  );

  return (
    <group>
      {/* Main terrain */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        receiveShadow
        material={grassMaterial}
      >
        <planeGeometry args={[100, 100, 20, 20]} />
      </mesh>

      {/* Small natural soil patches */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-15, -0.045, -8]}
        receiveShadow
        material={soilMaterial}
      >
        <circleGeometry args={[3.5, 32]} />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[16, -0.045, 5]}
        receiveShadow
        material={soilMaterial}
      >
        <circleGeometry args={[2.5, 32]} />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-12, -0.045, 15]}
        receiveShadow
        material={soilMaterial}
      >
        <circleGeometry args={[2, 32]} />
      </mesh>
    </group>
  );
}