import { PetModel } from "./PetModel";
import { PetBehavior } from "./PetBehavior";
import { PetMovement } from "./PetMovement";
import { PetStateProvider } from "./PetState";
import { PetInteraction } from "./PetInteraction";

export function Pet() {
  return (
    <PetStateProvider>
      <PetMovement>
        <PetInteraction>
          <PetBehavior>
            <PetModel />
          </PetBehavior>
        </PetInteraction>
      </PetMovement>
    </PetStateProvider>
  );
}