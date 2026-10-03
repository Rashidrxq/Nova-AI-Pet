import { useFrame } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

import { PetAnimation } from "./PetAnimation";

interface PetMovementProps {
  children: ReactNode;
}

export function PetMovement({ children }: PetMovementProps) {
  const groupRef = useRef<THREE.Group>(null);

  const target = useRef(
    new THREE.Vector3(5, 0, 7)
  );

  const velocity = useRef(
    new THREE.Vector3()
  );

  const waitTimer = useRef(1.5);

  const [isWalking, setIsWalking] = useState(false);

  const chooseNewTarget = () => {
    const x = THREE.MathUtils.randFloat(-7, 7);
    const z = THREE.MathUtils.randFloat(1, 9);

    target.current.set(x, 0, z);
    setIsWalking(true);
  };

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group) return;

    const current = group.position;

    const distance = current.distanceTo(
      target.current
    );

    // ------------------------------------------
    // DOG REACHED DESTINATION
    // ------------------------------------------

    if (distance < 0.45) {
      setIsWalking(false);

      waitTimer.current -= delta;

      if (waitTimer.current <= 0) {
        waitTimer.current = THREE.MathUtils.randFloat(
          1.5,
          4
        );

        chooseNewTarget();
      }

      return;
    }

    // ------------------------------------------
    // WALKING
    // ------------------------------------------

    setIsWalking(true);

    const direction = new THREE.Vector3()
      .subVectors(target.current, current)
      .normalize();

    const speed = 1.15;

    velocity.current
      .copy(direction)
      .multiplyScalar(speed * delta);

    current.add(velocity.current);

    // Keep dog on ground
    current.y = 0;

    // ------------------------------------------
    // FACE WALKING DIRECTION
    // ------------------------------------------

    const targetRotation = Math.atan2(
      direction.x,
      direction.z
    );

    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      targetRotation,
      5 * delta
    );
  });

  return (
    <group
      ref={groupRef}
      position={[5, 0, 7]}
    >
      <PetAnimation isWalking={isWalking}>
        {children}
      </PetAnimation>
    </group>
  );
}