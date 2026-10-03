import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type Props = {
  children: React.ReactNode;
};

export function PetBehavior({ children }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const time = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    time.current += delta;

    const t = time.current;

    // ----------------------------------------
    // BREATHING
    // ----------------------------------------

    const breathing = 1 + Math.sin(t * 2.2) * 0.012;

    groupRef.current.scale.set(
      breathing,
      1 + Math.sin(t * 2.2) * 0.008,
      breathing
    );

    // ----------------------------------------
    // SUBTLE BODY MOVEMENT
    // ----------------------------------------

    groupRef.current.rotation.y =
      Math.sin(t * 0.45) * 0.025;

    // Slight vertical body movement
    groupRef.current.position.y =
      Math.sin(t * 2.2) * 0.008;

    // ----------------------------------------
    // NATURAL IDLE SWAY
    // ----------------------------------------

    groupRef.current.rotation.z =
      Math.sin(t * 0.7) * 0.008;
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}