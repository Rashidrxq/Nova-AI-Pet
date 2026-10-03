import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";

import type { PetState } from "./PetState";

interface PetAnimationProps {
  children: ReactNode;
  state: PetState;
}

export function PetAnimation({
  children,
  state,
}: PetAnimationProps) {
  const modelRef =
    useRef<THREE.Group>(null);

  const time = useRef(0);

  useFrame((_, delta) => {
    const model = modelRef.current;

    if (!model) return;

    time.current += delta;

    const t = time.current;

    /*
     * ============================
     * WALKING
     * ============================
     */
    if (state === "walking") {
      model.position.y =
        Math.abs(Math.sin(t * 9)) * 0.035;

      model.rotation.z =
        Math.sin(t * 9) * 0.025;

      model.scale.y =
        1 + Math.sin(t * 9) * 0.015;

      return;
    }

    /*
     * ============================
     * HAPPY
     * ============================
     */
    if (state === "happy") {
      model.position.y =
        Math.abs(Math.sin(t * 10)) * 0.09;

      model.rotation.z =
        Math.sin(t * 8) * 0.035;

      return;
    }

    /*
     * ============================
     * CURIOUS
     * ============================
     */
    if (state === "curious") {
      model.position.y =
        Math.sin(t * 2) * 0.025;

      model.rotation.z =
        Math.sin(t * 2.5) * 0.08;

      return;
    }

    /*
     * ============================
     * SLEEPING
     * ============================
     */
    if (state === "sleeping") {
      model.position.y =
        Math.sin(t * 1.5) * 0.012;

      model.rotation.z =
        Math.sin(t * 1.1) * 0.015;

      model.scale.y =
        1 + Math.sin(t * 1.5) * 0.01;

      return;
    }

    /*
     * ============================
     * IDLE
     * ============================
     */

    model.position.y =
      Math.sin(t * 2.2) * 0.018;

    model.rotation.z =
      Math.sin(t * 1.3) * 0.012;

    model.scale.y =
      THREE.MathUtils.lerp(
        model.scale.y,
        1,
        delta * 5
      );
  });

  return (
    <group ref={modelRef}>
      {children}
    </group>
  );
}