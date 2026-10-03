import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { Environment } from "./Environment";
import { House } from "./House";

export function World() {
  return (
    <Canvas
      shadows
      camera={{
        position: [12, 7, 15],
        fov: 40,
        near: 0.1,
        far: 150,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
    >
      <Environment />

      {/* Existing house */}
      <House />

      <OrbitControls
        minDistance={8}
        maxDistance={65}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 2.5, 0]}
      />
    </Canvas>
  );
}