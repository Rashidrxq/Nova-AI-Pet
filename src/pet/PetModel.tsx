import { useMemo } from "react";
import * as THREE from "three";

export function PetModel() {
  // Enhanced PBR Materials with richer roughness profiles
  const fur = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b87543",
        roughness: 0.9,
        metalness: 0.02,
        bumpScale: 0.02,
      }),
    []
  );

  const lightFur = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#dfa371",
        roughness: 0.88,
        metalness: 0.02,
      }),
    []
  );

  const darkFur = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4a2d1d",
        roughness: 0.95,
        metalness: 0.02,
      }),
    []
  );

  const nose = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#120e0c",
        roughness: 0.4,
        metalness: 0.1,
      }),
    []
  );

  const eye = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#050403",
        roughness: 0.1,
        metalness: 0.8,
      }),
    []
  );

  const eyeHighlight = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
      }),
    []
  );

  const collar = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#28527a",
        roughness: 0.4,
        metalness: 0.2,
      }),
    []
  );

  const tagRing = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d4af37",
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );

  return (
    <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1}>
      {/* =====================================================
          BODY & CORE ANATOMY
      ===================================================== */}

      {/* Main Torso */}
      <mesh position={[0, 1.02, -0.05]} scale={[1.4, 0.76, 0.78]} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 24]} />
        <primitive object={fur} attach="material" />
      </mesh>

      {/* Upper Back Arch */}
      <mesh position={[0, 1.25, -0.2]} scale={[1.1, 0.5, 0.6]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <primitive object={fur} attach="material" />
      </mesh>

      {/* Soft Underbelly */}
      <mesh position={[0, 0.85, 0.42]} scale={[1.02, 0.52, 0.48]} castShadow>
        <sphereGeometry args={[1, 24, 18]} />
        <primitive object={lightFur} attach="material" />
      </mesh>

      {/* =====================================================
          CHEST & NECK
      ===================================================== */}

      <mesh position={[0, 1.18, 0.58]} scale={[0.82, 0.85, 0.45]} castShadow>
        <sphereGeometry args={[1, 24, 18]} />
        <primitive object={lightFur} attach="material" />
      </mesh>

      <mesh position={[0, 1.52, 0.44]} rotation={[Math.PI / 2.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.64, 0.75, 24]} />
        <primitive object={fur} attach="material" />
      </mesh>

      {/* Collar & Tag */}
      <group position={[0, 1.7, 0.46]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.54, 0.065, 12, 32]} />
          <primitive object={collar} attach="material" />
        </mesh>
        {/* Metallic Tag */}
        <mesh position={[0, -0.15, 0.56]} scale={[0.12, 0.12, 0.05]} castShadow>
          <cylinderGeometry args={[1, 1, 1, 16]} />
          <primitive object={tagRing} attach="material" />
        </mesh>
      </group>

      {/* =====================================================
          HEAD & FACIAL FEATURES
      ===================================================== */}

      <group position={[0, 2.12, 0.6]}>
        {/* Cranium */}
        <mesh scale={[0.84, 0.8, 0.8]} castShadow>
          <sphereGeometry args={[1, 32, 24]} />
          <primitive object={fur} attach="material" />
        </mesh>

        {/* Cheeks / Brow Structure */}
        <mesh position={[0, -0.1, 0.55]} scale={[0.58, 0.44, 0.45]} castShadow>
          <sphereGeometry args={[1, 24, 18]} />
          <primitive object={lightFur} attach="material" />
        </mesh>

        {/* Snout / Muzzle */}
        <mesh position={[0, -0.06, 0.8]} scale={[0.36, 0.26, 0.34]} castShadow>
          <sphereGeometry args={[1, 24, 18]} />
          <primitive object={darkFur} attach="material" />
        </mesh>

        {/* Detailed 3D Nose */}
        <group position={[0, 0.01, 1.08]}>
          <mesh scale={[0.18, 0.12, 0.13]} castShadow>
            <sphereGeometry args={[1, 16, 12]} />
            <primitive object={nose} attach="material" />
          </mesh>
          {/* Nostrils Highlight / Split */}
          <mesh position={[0, -0.02, 0.04]} scale={[0.04, 0.02, 0.04]}>
            <sphereGeometry args={[1, 8, 8]} />
            <primitive object={darkFur} attach="material" />
          </mesh>
        </group>

        {/* Eyes with Depth */}
        {[-0.31, 0.31].map((xSide, i) => (
          <group key={i} position={[xSide, 0.18, 0.68]}>
            {/* Eye Socket Shadow */}
            <mesh scale={[0.12, 0.12, 0.08]}>
              <sphereGeometry args={[1, 16, 12]} />
              <primitive object={darkFur} attach="material" />
            </mesh>
            {/* Eyeball */}
            <mesh castShadow>
              <sphereGeometry args={[0.095, 24, 20]} />
              <primitive object={eye} attach="material" />
            </mesh>
            {/* Primary Highlight */}
            <mesh position={[xSide < 0 ? -0.03 : 0.03, 0.03, 0.07]}>
              <sphereGeometry args={[0.025, 12, 10]} />
              <primitive object={eyeHighlight} attach="material" />
            </mesh>
            {/* Secondary Soft Highlight */}
            <mesh position={[xSide < 0 ? 0.02 : -0.02, -0.03, 0.08]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <primitive object={eyeHighlight} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Expressive Floppy Ears */}
        {[-1, 1].map((dir, i) => (
          <group key={i} position={[dir * 0.62, 0.42, 0.32]} rotation={[0.1, 0, dir * -0.4]}>
            <mesh scale={[0.26, 0.58, 0.2]} castShadow>
              <sphereGeometry args={[1, 20, 16]} />
              <primitive object={darkFur} attach="material" />
            </mesh>
            <mesh position={[0, -0.02, 0.08]} scale={[0.14, 0.35, 0.06]}>
              <sphereGeometry args={[1, 16, 12]} />
              <primitive object={lightFur} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* =====================================================
          LIMBS & PAWS
      ===================================================== */}

      {/* Front Legs */}
      {[-0.56, 0.56].map((xSide, i) => (
        <group key={i} position={[xSide, 0.45, 0.42]}>
          <mesh scale={[0.25, 0.68, 0.25]} castShadow>
            <capsuleGeometry args={[0.6, 0.6, 12, 18]} />
            <primitive object={fur} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Back Legs (Hips) */}
      {[-0.7, 0.7].map((xSide, i) => (
        <group key={i} position={[xSide, 0.52, -0.4]}>
          <mesh rotation={[0.2, 0, xSide * 0.1]} scale={[0.32, 0.65, 0.35]} castShadow>
            <capsuleGeometry args={[0.65, 0.65, 12, 18]} />
            <primitive object={fur} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Paws with Toe Definition */}
      {[
        [-0.56, 0.08, 0.48],
        [0.56, 0.08, 0.48],
        [-0.7, 0.12, -0.48],
        [0.7, 0.12, -0.48],
      ].map((pos, index) => (
        <mesh
          key={index}
          position={pos as [number, number, number]}
          scale={[0.28, 0.14, 0.36]}
          castShadow
        >
          <sphereGeometry args={[1, 20, 14]} />
          <primitive object={darkFur} attach="material" />
        </mesh>
      ))}

      {/* =====================================================
          TAIL
      ===================================================== */}

      <group position={[0, 1.3, -0.76]}>
        <mesh rotation={[Math.PI / 2.5, 0, 0]} scale={[0.22, 0.85, 0.22]} castShadow>
          <capsuleGeometry args={[0.5, 0.6, 10, 16]} />
          <primitive object={fur} attach="material" />
        </mesh>
        {/* Fluffy Tip */}
        <mesh position={[0, 0.58, -0.16]} scale={[0.28, 0.28, 0.28]} castShadow>
          <sphereGeometry args={[1, 16, 14]} />
          <primitive object={lightFur} attach="material" />
        </mesh>
      </group>
    </group>
  );
}