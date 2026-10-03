import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Environment } from "./Environment";
import { House } from "./House";

export function World() {
  return (
    <Canvas
      shadows
      camera={{
        position: [12, 8, 16],
        fov: 40,
      }}
    >
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[8, 12, 10]}
        intensity={2}
        castShadow
      />

      <Environment />

      <House />

      <OrbitControls
        minDistance={8}
        maxDistance={35}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}