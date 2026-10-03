import { PetModel } from "./PetModel";

export function Pet() {
  return (
    <group
      position={[5, 0, 7]}
      scale={0.65}
    >
      <PetModel />
    </group>
  );
}