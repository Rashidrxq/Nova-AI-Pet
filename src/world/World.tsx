import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { Environment } from "./Environment";
import { House } from "./House";
import { Pet } from "../pet/Pet";

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
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#9bbbd0"]} />

      <ambientLight intensity={2} />

      <directionalLight
        position={[10, 15, 10]}
        intensity={3}
      />

      <Environment />

      <House />

      {/* NOVA TEST */}
      <Pet />

      <OrbitControls
        makeDefault
        target={[0, 1, 5]}
        minDistance={3}
        maxDistance={65}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping
      />
    </Canvas>
  );
}