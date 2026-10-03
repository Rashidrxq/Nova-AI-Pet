import { useFrame } from "@react-three/fiber";
import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from "three";

import { PetAnimation } from "./PetAnimation";
import { usePetState } from "./PetState";

interface PetMovementProps {
  children: ReactNode;
}

export function PetMovement({
  children,
}: PetMovementProps) {
  const groupRef = useRef<THREE.Group>(null);

  const target = useRef(
    new THREE.Vector3(5, 0, 7)
  );

  const direction = useRef(
    new THREE.Vector3()
  );

  const { state, setState } = usePetState();

  /*
   * Choose destination whenever
   * the dog enters WALKING.
   */
  useEffect(() => {
    if (state !== "walking") return;

    const x = THREE.MathUtils.randFloat(-7, 7);
    const z = THREE.MathUtils.randFloat(1, 9);

    target.current.set(x, 0, z);
  }, [state]);

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group) return;

    /*
     * IDLE / CURIOUS / HAPPY / SLEEPING
     * do not move around.
     */
    if (state !== "walking") {
      return;
    }

    const distance =
      group.position.distanceTo(
        target.current
      );

    /*
     * Destination reached.
     */
    if (distance < 0.4) {
      setState("idle");
      return;
    }

    /*
     * Calculate movement direction.
     */
    direction.current
      .subVectors(
        target.current,
        group.position
      )
      .normalize();

    const speed = 1.15;

    group.position.x +=
      direction.current.x *
      speed *
      delta;

    group.position.z +=
      direction.current.z *
      speed *
      delta;

    group.position.y = 0;

    /*
     * Turn toward destination.
     */
    const targetRotation =
      Math.atan2(
        direction.current.x,
        direction.current.z
      );

    group.rotation.y =
      THREE.MathUtils.lerp(
        group.rotation.y,
        targetRotation,
        6 * delta
      );
  });

  return (
    <group
      ref={groupRef}
      position={[5, 0, 7]}
    >
      <PetAnimation state={state}>
        {children}
      </PetAnimation>
    </group>
  );
}