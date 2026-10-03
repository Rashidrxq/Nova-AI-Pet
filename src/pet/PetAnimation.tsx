import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";

interface PetAnimationProps {
  children: ReactNode;
  isWalking: boolean;
}

export function PetAnimation({
  children,
  isWalking,
}: PetAnimationProps) {
  const modelRef = useRef<THREE.Group>(null);

  const time = useRef(0);

  useFrame((_, delta) => {
    const model = modelRef.current;

    if (!model) return;

    time.current += delta;

    const t = time.current;

    // ==========================================
    // WALKING ANIMATION
    // ==========================================

    if (isWalking) {
      const walkCycle = t * 9;

      // Natural vertical bounce
      const bounce =
        Math.abs(Math.sin(walkCycle)) * 0.035;

      model.position.y = THREE.MathUtils.lerp(
        model.position.y,
        bounce,
        delta * 10
      );

      // Body sway
      const sway =
        Math.sin(walkCycle) * 0.025;

      model.rotation.z = THREE.MathUtils.lerp(
        model.rotation.z,
        sway,
        delta * 8
      );

      // Slight compression
      const scaleY =
        1 + Math.sin(walkCycle) * 0.015;

      model.scale.y = THREE.MathUtils.lerp(
        model.scale.y,
        scaleY,
        delta * 10
      );
    }

    // ==========================================
    // IDLE ANIMATION
    // ==========================================

    else {
      // Breathing
      const breathing =
        Math.sin(t * 2.2) * 0.018;

      model.position.y = THREE.MathUtils.lerp(
        model.position.y,
        breathing,
        delta * 5
      );

      // Gentle body movement
      const idleSway =
        Math.sin(t * 1.3) * 0.012;

      model.rotation.z = THREE.MathUtils.lerp(
        model.rotation.z,
        idleSway,
        delta * 4
      );

      // Return to normal size
      model.scale.y = THREE.MathUtils.lerp(
        model.scale.y,
        1,
        delta * 5
      );
    }
  });

  return (
    <group ref={modelRef}>
      {children}
    </group>
  );
}