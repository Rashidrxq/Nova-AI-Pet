import {
  useRef,
  type ReactNode,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { usePetState } from "./PetState";

interface PetInteractionProps {
  children: ReactNode;
}

export function PetInteraction({
  children,
}: PetInteractionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const reaction = useRef(0);
  const { setState } = usePetState();

  const handleClick = (
    event: THREE.Event & {
      stopPropagation?: () => void;
    }
  ) => {
    event.stopPropagation?.();

    setState("happy");
    reaction.current = 1.5;
  };

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group) return;

    if (reaction.current > 0) {
      reaction.current -= delta;

      group.position.y =
        Math.abs(
          Math.sin(
            (1.5 - reaction.current) * 14
          )
        ) * 0.12;

      group.rotation.z =
        Math.sin(
          (1.5 - reaction.current) * 12
        ) * 0.035;
    } else {
      group.position.y = THREE.MathUtils.lerp(
        group.position.y,
        0,
        delta * 8
      );

      group.rotation.z = THREE.MathUtils.lerp(
        group.rotation.z,
        0,
        delta * 8
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
    >
      {children}
    </group>
  );
}