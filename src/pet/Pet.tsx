import { PetModel } from "./PetModel";
import { PetBehavior } from "./PetBehavior";
import { PetMovement } from "./PetMovement";
import { PetStateProvider } from "./PetState";

export function Pet() {
  return (
    <PetStateProvider>
      <PetMovement>
        <PetBehavior>
          <PetModel />
        </PetBehavior>
      </PetMovement>
    </PetStateProvider>
  );
}