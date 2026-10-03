import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

/* =========================================================
   MATERIALS
========================================================= */

const plasterMaterial = new THREE.MeshStandardMaterial({
  color: "#ddd9cf",
  roughness: 0.88,
});

const plasterDarkMaterial = new THREE.MeshStandardMaterial({
  color: "#c9c5bb",
  roughness: 0.92,
});

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: "#aaa79f",
  roughness: 0.9,
});

const darkConcreteMaterial = new THREE.MeshStandardMaterial({
  color: "#45433f",
  roughness: 0.8,
});

const woodMaterial = new THREE.MeshStandardMaterial({
  color: "#70462d",
  roughness: 0.65,
});

const darkWoodMaterial = new THREE.MeshStandardMaterial({
  color: "#4b3021",
  roughness: 0.7,
});

const metalMaterial = new THREE.MeshStandardMaterial({
  color: "#25282a",
  metalness: 0.75,
  roughness: 0.3,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: "#8fb8c2",
  metalness: 0.05,
  roughness: 0.08,
  transmission: 0.15,
  transparent: true,
  opacity: 0.72,
});

const stoneMaterial = new THREE.MeshStandardMaterial({
  color: "#81766a",
  roughness: 0.98,
});

/* =========================================================
   WINDOW
========================================================= */

function Window({
  position,
  width = 2.2,
  height = 2.1,
}: {
  position: [number, number, number];
  width?: number;
  height?: number;
}) {
  return (
    <group position={position}>
      {/* Recess */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[width + 0.18, height + 0.18, 0.16]} />
        <meshStandardMaterial
          color="#b9b5ac"
          roughness={0.9}
        />
      </mesh>

      {/* Glass */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[width, height, 0.055]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Frame */}
      <mesh position={[-width / 2, 0, 0.1]}>
        <boxGeometry args={[0.08, height + 0.12, 0.1]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      <mesh position={[width / 2, 0, 0.1]}>
        <boxGeometry args={[0.08, height + 0.12, 0.1]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      <mesh position={[0, height / 2, 0.1]}>
        <boxGeometry args={[width + 0.12, 0.08, 0.1]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      <mesh position={[0, -height / 2, 0.1]}>
        <boxGeometry args={[width + 0.12, 0.08, 0.1]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      {/* Center mullion */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[0.055, height, 0.08]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      {/* Horizontal mullion */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[width, 0.045, 0.08]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      {/* Window sill */}
      <mesh position={[0, -height / 2 - 0.09, 0.02]}>
        <boxGeometry args={[width + 0.22, 0.12, 0.24]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   DOOR
========================================================= */

function MainDoor() {
  return (
    <group position={[0, 1.35, 3.16]}>
      {/* Door recess */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[1.85, 2.85, 0.25]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>

      {/* Wooden door */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[1.55, 2.65, 0.12]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>

      {/* Vertical wood strips */}
      {[-0.55, -0.18, 0.18, 0.55].map((x) => (
        <mesh key={x} position={[x, 0, 0.15]}>
          <boxGeometry args={[0.025, 2.55, 0.025]} />
          <primitive object={darkWoodMaterial} attach="material" />
        </mesh>
      ))}

      {/* Handle */}
      <mesh position={[0.52, 0, 0.18]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#c39b52"
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   STONE WALL
========================================================= */

function StoneFeatureWall() {
  return (
    <group position={[-3.35, 2.45, 3.08]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.15, 4.9, 0.3]} />
        <primitive object={stoneMaterial} attach="material" />
      </mesh>

      {/* Irregular stone joints */}
      {[-1.9, -1.0, -0.05, 0.9, 1.85].map((y, i) => (
        <mesh key={i} position={[0, y, 0.17]}>
          <boxGeometry args={[2.05, 0.035, 0.025]} />
          <meshStandardMaterial
            color="#62594f"
            roughness={1}
          />
        </mesh>
      ))}

      {[-0.65, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.175]}>
          <boxGeometry args={[0.035, 4.7, 0.025]} />
          <meshStandardMaterial
            color="#62594f"
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   BALCONY
========================================================= */

function Balcony() {
  return (
    <group position={[1.7, 4.55, 3.65]}>
      {/* Floor slab */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.7, 0.25, 1.65]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* Front glass */}
      <mesh position={[0, 0.72, 0.75]}>
        <boxGeometry args={[4.5, 1.25, 0.045]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Top rail */}
      <mesh position={[0, 1.35, 0.78]}>
        <boxGeometry args={[4.65, 0.07, 0.07]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      {/* Posts */}
      {[-2.2, -1.1, 0, 1.1, 2.2].map((x) => (
        <mesh key={x} position={[x, 0.68, 0.78]}>
          <boxGeometry args={[0.045, 1.3, 0.045]} />
          <primitive object={metalMaterial} attach="material" />
        </mesh>
      ))}

      {/* Side railing */}
      <mesh
        position={[2.2, 0.68, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[1.5, 1.3, 0.045]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   FRONT PORCH
========================================================= */

function EntrancePorch() {
  return (
    <group>
      {/* Porch slab */}
      <mesh
        position={[0, 0.18, 3.95]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4.3, 0.35, 2.8]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* Roof */}
      <mesh
        position={[0, 3.35, 4.0]}
        castShadow
      >
        <boxGeometry args={[4.6, 0.22, 2.5]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>

      {/* Columns */}
      {[-1.85, 1.85].map((x) => (
        <mesh
          key={x}
          position={[x, 1.8, 4.35]}
          castShadow
        >
          <boxGeometry args={[0.3, 3.4, 0.3]} />
          <primitive object={plasterMaterial} attach="material" />
        </mesh>
      ))}

      {/* Porch side wood panel */}
      <mesh
        position={[2.05, 2.0, 4.25]}
        castShadow
      >
        <boxGeometry args={[0.12, 3.0, 1.8]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   FRONT STEPS
========================================================= */

function FrontSteps() {
  return (
    <group position={[0, 0, 5.0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0, i * 0.16, i * 0.45]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              3.8 - i * 0.18,
              0.28,
              0.6,
            ]}
          />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   ROOF
========================================================= */

function Roof() {
  return (
    <group>
      {/* Main sloped roof */}
      <mesh
        position={[0, 7.15, 0]}
        rotation={[0, 0, -0.0]}
        castShadow
      >
        <boxGeometry args={[10.5, 0.35, 7.6]} />
        <primitive object={darkWoodMaterial} attach="material" />
      </mesh>

      {/* Roof tiles / ribs */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            -4.7 + i * 0.85,
            7.34,
            0,
          ]}
          castShadow
        >
          <boxGeometry args={[0.7, 0.12, 7.3]} />
          <meshStandardMaterial
            color="#6d4430"
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Flat roof block */}
      <mesh
        position={[2.5, 7.05, -1.0]}
        castShadow
      >
        <boxGeometry args={[4.5, 0.35, 4.7]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* Roof fascia */}
      <mesh position={[0, 6.85, 3.72]}>
        <boxGeometry args={[10.8, 0.28, 0.18]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   GUTTERS
========================================================= */

function Gutters() {
  return (
    <group>
      {/* Front gutter */}
      <mesh position={[0, 6.7, 3.85]}>
        <boxGeometry args={[10.4, 0.16, 0.18]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      {/* Downpipes */}
      <mesh position={[-4.8, 3.4, 3.8]}>
        <cylinderGeometry args={[0.055, 0.055, 6.5, 12]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      <mesh position={[4.8, 3.4, 3.8]}>
        <cylinderGeometry args={[0.055, 0.055, 6.5, 12]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   AC UNIT
========================================================= */

function ACUnit({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Main unit */}
      <RoundedBox
        args={[1.2, 0.55, 0.38]}
        radius={0.06}
        smoothness={3}
        castShadow
      >
        <meshStandardMaterial
          color="#e7e5df"
          roughness={0.65}
        />
      </RoundedBox>

      {/* Fan */}
      <mesh position={[0, 0, 0.2]}>
        <circleGeometry args={[0.18, 24]} />
        <meshStandardMaterial
          color="#444"
          roughness={0.7}
        />
      </mesh>

      {/* Mount */}
      <mesh position={[0, -0.38, 0]}>
        <boxGeometry args={[1.35, 0.08, 0.45]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   WOOD FINS
========================================================= */

function WoodFins() {
  return (
    <group position={[3.55, 4.8, 3.45]}>
      {[-1.5, -0.75, 0, 0.75, 1.5].map((x) => (
        <mesh
          key={x}
          position={[x, 0, 0]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.18, 3.2, 0.28]} />
          <primitive object={woodMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   HOUSE
========================================================= */

export function House() {
  return (
    <group position={[0, 0, 0]}>
      
      {/* =====================================================
          GROUND FLOOR
      ===================================================== */}

      <mesh
        position={[0, 2.15, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[9.8, 4.3, 6.8]} />
        <primitive object={plasterMaterial} attach="material" />
      </mesh>

      {/* =====================================================
          SECOND FLOOR
      ===================================================== */}

      <mesh
        position={[0.65, 5.25, -0.1]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[8.2, 2.1, 6.35]} />
        <primitive object={plasterMaterial} attach="material" />
      </mesh>

      {/* =====================================================
          FLOOR SLAB
      ===================================================== */}

      <mesh
        position={[0.25, 4.25, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[10.2, 0.28, 7.15]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* =====================================================
          FRONT ARCHITECTURAL FRAME
      ===================================================== */}

      <mesh
        position={[0, 4.9, 3.38]}
        castShadow
      >
        <boxGeometry args={[10.0, 0.22, 0.28]} />
        <primitive object={plasterDarkMaterial} attach="material" />
      </mesh>

      {/* =====================================================
          WINDOWS — GROUND FLOOR
      ===================================================== */}

      <Window
        position={[-2.8, 2.45, 3.47]}
        width={2.25}
        height={2.25}
      />

      <Window
        position={[2.75, 2.45, 3.47]}
        width={2.25}
        height={2.25}
      />

      {/* =====================================================
          WINDOWS — FIRST FLOOR
      ===================================================== */}

      <Window
        position={[-2.05, 5.35, 3.28]}
        width={2.25}
        height={1.65}
      />

      <Window
        position={[3.05, 5.35, 3.28]}
        width={2.15}
        height={1.65}
      />

      {/* =====================================================
          MAIN DOOR
      ===================================================== */}

      <MainDoor />

      {/* =====================================================
          PORCH
      ===================================================== */}

      <EntrancePorch />

      {/* =====================================================
          STONE ACCENT
      ===================================================== */}

      <StoneFeatureWall />

      {/* =====================================================
          BALCONY
      ===================================================== */}

      <Balcony />

      {/* =====================================================
          WOOD FINS
      ===================================================== */}

      <WoodFins />

      {/* =====================================================
          STAIRS
      ===================================================== */}

      <FrontSteps />

      {/* =====================================================
          ROOF
      ===================================================== */}

      <Roof />

      {/* =====================================================
          GUTTERS
      ===================================================== */}

      <Gutters />

      {/* =====================================================
          AC UNITS
      ===================================================== */}

      <ACUnit position={[-4.9, 3.0, -1.7]} />

      <ACUnit position={[4.9, 5.0, -1.7]} />

      {/* =====================================================
          SMALL SIDE VENTILATION
      ===================================================== */}

      <mesh position={[-4.95, 1.4, 1.0]}>
        <boxGeometry args={[0.04, 0.7, 1.2]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      {/* =====================================================
          ELECTRICAL METER BOX
      ===================================================== */}

      <group position={[4.9, 1.25, 2.2]}>
        <mesh>
          <boxGeometry args={[0.45, 0.65, 0.12]} />
          <meshStandardMaterial
            color="#d7d5ce"
            roughness={0.8}
          />
        </mesh>

        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.32, 0.35, 0.025]} />
          <meshStandardMaterial
            color="#242424"
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* =====================================================
          WARM ENTRY LIGHT
      ===================================================== */}

      <pointLight
        position={[0, 2.7, 4.45]}
        intensity={2.2}
        distance={5}
        color="#ffd09a"
        castShadow
      />

      {/* Small wall lights */}
      <pointLight
        position={[-3.7, 2.8, 3.7]}
        intensity={0.7}
        distance={3}
        color="#ffd7a5"
      />

      <pointLight
        position={[3.7, 2.8, 3.7]}
        intensity={0.7}
        distance={3}
        color="#ffd7a5"
      />
    </group>
  );
}