import { PetModel } from "./PetModel";
import { PetBehavior } from "./PetBehavior";
import { PetMovement } from "./PetMovement";
import { PetInteraction } from "./PetInteraction";

export function Pet() {
  return (
    <PetMovement>
      <PetInteraction>
        <PetBehavior>
          <PetModel />
        </PetBehavior>
      </PetInteraction>
    </PetMovement>
  );
}