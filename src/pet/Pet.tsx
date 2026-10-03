import { PetModel } from "./PetModel";

export function Pet() {
  return (
    <group position={[0, 0, 5]}>
      <PetModel />
    </group>
  );
}