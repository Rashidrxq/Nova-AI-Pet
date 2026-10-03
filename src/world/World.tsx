import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { Environment } from "./Environment";
import { House } from "./House";

export function World() {
  return (
    <Canvas
      shadows={{
        type: THREE.PCFSoftShadowMap,
      }}
      camera={{
        position: [12, 7, 15],
        fov: 40,
        near: 0.1,
        far: 150,
      }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      dpr={[1, 2]}
    >
      {/* ================================
          COMPLETE WORLD
      ================================= */}

      <Environment />

      {/* ================================
          MAIN HOUSE
      ================================= */}

      <House />

      {/* ================================
          ARCHITECTURAL CAMERA
      ================================= */}

      <OrbitControls
        makeDefault
        target={[0, 2.5, 0]}
        minDistance={8}
        maxDistance={65}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping
        dampingFactor={0.06}
      />
    </Canvas>
  );
}