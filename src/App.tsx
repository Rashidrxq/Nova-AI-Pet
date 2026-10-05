import { World } from "./world/World";
import { PetStateProvider } from "./pet/PetState";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <PetStateProvider>
        <World />
      </PetStateProvider>
    </div>
  );
}

export default App;