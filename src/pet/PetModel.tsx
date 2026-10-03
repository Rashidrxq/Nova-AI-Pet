import { useMemo } from "react";
import * as THREE from "three";

export function PetModel() {
  const furMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b97845",
        roughness: 0.9,
      }),
    []
  );

  const darkFurMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4a2d20",
        roughness: 0.95,
      }),
    []
  );

  const noseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#171311",
        roughness: 0.65,
      }),
    []
  );

  const eyeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#111111",
        roughness: 0.35,
      }),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      {/* ================= BODY ================= */}

      <mesh
        position={[0, 1.05, 0]}
        scale={[1.45, 0.8, 0.7]}
        castShadow
      >
        <sphereGeometry args={[1, 20, 14]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      {/* ================= CHEST ================= */}

      <mesh
        position={[0, 1.12, 0.58]}
        scale={[0.72, 0.7, 0.35]}
        castShadow
      >
        <sphereGeometry args={[1, 16, 12]} />
        <primitive object={darkFurMaterial} attach="material" />
      </mesh>

      {/* ================= NECK ================= */}

      <mesh
        position={[0, 1.55, 0.55]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.48, 0.58, 0.7, 16]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      {/* ================= HEAD ================= */}

      <group position={[0, 2.05, 0.65]}>
        <mesh
          scale={[0.82, 0.78, 0.72]}
          castShadow
        >
          <sphereGeometry args={[1, 20, 16]} />
          <primitive object={furMaterial} attach="material" />
        </mesh>

        {/* Muzzle */}

        <mesh
          position={[0, -0.12, 0.66]}
          scale={[0.48, 0.35, 0.38]}
          castShadow
        >
          <sphereGeometry args={[1, 16, 12]} />
          <primitive object={darkFurMaterial} attach="material" />
        </mesh>

        {/* Nose */}

        <mesh
          position={[0, -0.05, 0.99]}
          scale={[0.18, 0.13, 0.12]}
          castShadow
        >
          <sphereGeometry args={[1, 16, 10]} />
          <primitive object={noseMaterial} attach="material" />
        </mesh>

        {/* Left eye */}

        <mesh
          position={[-0.29, 0.16, 0.64]}
          castShadow
        >
          <sphereGeometry args={[0.09, 12, 10]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>

        {/* Right eye */}

        <mesh
          position={[0.29, 0.16, 0.64]}
          castShadow
        >
          <sphereGeometry args={[0.09, 12, 10]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>

        {/* Left ear */}

        <mesh
          position={[-0.58, 0.42, 0]}
          rotation={[0, 0, -0.25]}
          scale={[0.34, 0.65, 0.22]}
          castShadow
        >
          <sphereGeometry args={[1, 14, 10]} />
          <primitive object={darkFurMaterial} attach="material" />
        </mesh>

        {/* Right ear */}

        <mesh
          position={[0.58, 0.42, 0]}
          rotation={[0, 0, 0.25]}
          scale={[0.34, 0.65, 0.22]}
          castShadow
        >
          <sphereGeometry args={[1, 14, 10]} />
          <primitive object={darkFurMaterial} attach="material" />
        </mesh>
      </group>

      {/* ================= FRONT LEGS ================= */}

      <mesh
        position={[-0.55, 0.48, 0.42]}
        scale={[0.25, 0.7, 0.25]}
        castShadow
      >
        <capsuleGeometry args={[1, 1, 6, 10]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      <mesh
        position={[0.55, 0.48, 0.42]}
        scale={[0.25, 0.7, 0.25]}
        castShadow
      >
        <capsuleGeometry args={[1, 1, 6, 10]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      {/* ================= BACK LEGS ================= */}

      <mesh
        position={[-0.62, 0.52, -0.38]}
        scale={[0.3, 0.72, 0.3]}
        castShadow
      >
        <capsuleGeometry args={[1, 1, 6, 10]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      <mesh
        position={[0.62, 0.52, -0.38]}
        scale={[0.3, 0.72, 0.3]}
        castShadow
      >
        <capsuleGeometry args={[1, 1, 6, 10]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      {/* ================= PAWS ================= */}

      {[
        [-0.55, 0.12, 0.48],
        [0.55, 0.12, 0.48],
        [-0.62, 0.14, -0.42],
        [0.62, 0.14, -0.42],
      ].map((position, index) => (
        <mesh
          key={index}
          position={position as [number, number, number]}
          scale={[0.32, 0.16, 0.38]}
          castShadow
        >
          <sphereGeometry args={[1, 14, 10]} />
          <primitive object={darkFurMaterial} attach="material" />
        </mesh>
      ))}

      {/* ================= TAIL ================= */}

      <mesh
        position={[0, 1.25, -0.78]}
        rotation={[Math.PI / 2.5, 0, 0]}
        scale={[0.22, 0.9, 0.22]}
        castShadow
      >
        <capsuleGeometry args={[1, 1, 6, 10]} />
        <primitive object={furMaterial} attach="material" />
      </mesh>

      {/* Tail tip */}

      <mesh
        position={[0, 1.82, -1.02]}
        scale={[0.3, 0.3, 0.3]}
        castShadow
      >
        <sphereGeometry args={[1, 12, 8]} />
        <primitive object={darkFurMaterial} attach="material" />
      </mesh>
    </group>
  );
}