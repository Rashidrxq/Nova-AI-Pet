import { Ground } from "./Ground";
import { Road } from "./Road";
import { Drainage } from "./Drainage";
import { CompoundWalls } from "./CompoundWalls";
import { BackgroundHouses } from "./BackgroundHouses";
import { UtilityPoles } from "./UtilityPoles";
import { Trees } from "./Trees";
import { Vegetation } from "./Vegetation";


export function Environment() {
  return (
    <group>
    <Ground />
<Road />
<Drainage />

<CompoundWalls />

<UtilityPoles />

<BackgroundHouses />

<Trees />
<Vegetation />
    </group>
  );
}