import { Sky } from "@react-three/drei";

import { Ground } from "./Ground";
import { Road } from "./Road";
import { Drainage } from "./Drainage";
import { CompoundWalls } from "./CompoundWalls";
import { Trees } from "./Trees";
import { Vegetation } from "./Vegetation";
import { UtilityPoles } from "./UtilityPoles";
import { PowerLines } from "./PowerLines";
import { StreetLights } from "./StreetLights";
import { BackgroundHouses } from "./BackgroundHouses";
import { Props } from "./Props";

export function Environment() {
  return (
    <group>
      {/* =================================================
          ATMOSPHERE
      ================================================= */}

      <color
        attach="background"
        args={["#9bbbd0"]}
      />

      <fog
        attach="fog"
        args={["#9bbbd0", 45, 85]}
      />

      {/* =================================================
          SKY
      ================================================= */}

      <Sky
        distance={450000}
        sunPosition={[-40, 35, -60]}
        inclination={0.48}
        azimuth={0.25}
        turbidity={7}
        rayleigh={1.8}
        mieCoefficient={0.004}
        mieDirectionalG={0.75}
      />

      {/* =================================================
          NATURAL ENVIRONMENT LIGHT
      ================================================= */}

      <hemisphereLight
        color="#b9d7e8"
        groundColor="#53634b"
        intensity={1.25}
      />

      {/* =================================================
          SUN
      ================================================= */}

      <directionalLight
        position={[-35, 30, -25]}
        intensity={2.2}
        color="#ffe3b5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0002}
      />

      {/* =================================================
          GROUND
      ================================================= */}

      <Ground />

      {/* =================================================
          ROAD + DRAINAGE
      ================================================= */}

      <Road />
      <Drainage />

      {/* =================================================
          PROPERTY
      ================================================= */}

      <CompoundWalls />

      {/* =================================================
          VEGETATION
      ================================================= */}

      <Trees />
      <Vegetation />

      {/* =================================================
          ELECTRICAL INFRASTRUCTURE
      ================================================= */}

      <UtilityPoles />
      <PowerLines />
      <StreetLights />

      {/* =================================================
          NEIGHBORHOOD
      ================================================= */}

      <BackgroundHouses />

      {/* =================================================
          EVERYDAY PROPS
      ================================================= */}

      <Props />
    </group>
  );
}