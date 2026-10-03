import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

/* =========================================================
   TYPES
========================================================= */

type Vec3 = [number, number, number];

/* =========================================================
   SHARED MATERIALS
========================================================= */

const wallMaterial = new THREE.MeshStandardMaterial({
  color: "#e7e2d8",
  roughness: 0.86,
});

const upperWallMaterial = new THREE.MeshStandardMaterial({
  color: "#eeeae1",
  roughness: 0.82,
});

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: "#b8b4aa",
  roughness: 0.9,
});

const darkConcreteMaterial = new THREE.MeshStandardMaterial({
  color: "#8e8a82",
  roughness: 0.92,
});

const frameMaterial = new THREE.MeshStandardMaterial({
  color: "#202529",
  roughness: 0.32,
  metalness: 0.7,
});

const woodMaterial = new THREE.MeshStandardMaterial({
  color: "#6b4028",
  roughness: 0.62,
});

const woodDarkMaterial = new THREE.MeshStandardMaterial({
  color: "#3f271b",
  roughness: 0.7,
});

const stoneMaterial = new THREE.MeshStandardMaterial({
  color: "#756d61",
  roughness: 0.96,
});

const roofMaterial = new THREE.MeshStandardMaterial({
  color: "#303235",
  roughness: 0.78,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: "#91b9c5",
  roughness: 0.08,
  metalness: 0.1,
  transmission: 0.12,
  transparent: true,
  opacity: 0.72,
  envMapIntensity: 1.1,
});

const warmGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: "#f4c58a",
  roughness: 0.18,
  metalness: 0.05,
  transmission: 0.05,
  transparent: true,
  opacity: 0.82,
  emissive: "#6e3e1c",
  emissiveIntensity: 0.08,
});

/* =========================================================
   WINDOW
========================================================= */

function Window({
  position,
  width = 2.4,
  height = 2.3,
  warm = false,
}: {
  position: Vec3;
  width?: number;
  height?: number;
  warm?: boolean;
}) {
  const glass = warm ? warmGlassMaterial : glassMaterial;

  return (
    <group position={position}>
      {/* recessed glass */}
      <mesh position={[0, 0, -0.045]}>
        <boxGeometry args={[width - 0.16, height - 0.16, 0.05]} />
        <primitive object={glass} attach="material" />
      </mesh>

      {/* outer frame */}
      <mesh position={[-width / 2, 0, 0.02]}>
        <boxGeometry args={[0.09, height, 0.16]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      <mesh position={[width / 2, 0, 0.02]}>
        <boxGeometry args={[0.09, height, 0.16]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      <mesh position={[0, height / 2, 0.02]}>
        <boxGeometry args={[width, 0.09, 0.16]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      <mesh position={[0, -height / 2, 0.02]}>
        <boxGeometry args={[width, 0.09, 0.16]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* vertical mullion */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[0.055, height - 0.12, 0.12]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* window sill */}
      <mesh position={[0, -height / 2 - 0.08, 0.02]}>
        <boxGeometry args={[width + 0.18, 0.12, 0.28]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   DOOR
========================================================= */

function Door() {
  return (
    <group position={[0, 1.35, 3.63]}>
      {/* deep doorway recess */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[1.9, 2.95, 0.2]} />
        <primitive object={woodDarkMaterial} attach="material" />
      </mesh>

      {/* door slab */}
      <mesh castShadow>
        <boxGeometry args={[1.52, 2.65, 0.12]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>

      {/* vertical wood divisions */}
      {[-0.42, 0, 0.42].map((x) => (
        <mesh key={x} position={[x, 0, 0.07]}>
          <boxGeometry args={[0.025, 2.45, 0.025]} />
          <primitive object={woodDarkMaterial} attach="material" />
        </mesh>
      ))}

      {/* door frame */}
      <mesh position={[-0.86, 0, 0.03]}>
        <boxGeometry args={[0.12, 2.85, 0.2]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      <mesh position={[0.86, 0, 0.03]}>
        <boxGeometry args={[0.12, 2.85, 0.2]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      <mesh position={[0, 1.43, 0.03]}>
        <boxGeometry args={[1.84, 0.12, 0.2]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* handle */}
      <mesh position={[0.48, 0, 0.11]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#caa45d"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* door step */}
      <mesh position={[0, -1.43, 0.12]} receiveShadow>
        <boxGeometry args={[1.9, 0.14, 0.65]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   BALCONY
========================================================= */

function Balcony() {
  return (
    <group position={[1.75, 4.38, 4.18]}>
      {/* slab */}
      <RoundedBox
        args={[5.0, 0.28, 2.15]}
        radius={0.035}
        smoothness={2}
        castShadow
        receiveShadow
      >
        <primitive object={concreteMaterial} attach="material" />
      </RoundedBox>

      {/* underside beam */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[5.05, 0.18, 2.2]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>

      {/* glass */}
      <mesh position={[0, 0.72, 1.0]}>
        <boxGeometry args={[4.85, 1.35, 0.055]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* top railing */}
      <mesh position={[0, 1.42, 1.0]}>
        <boxGeometry args={[5.0, 0.07, 0.07]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* posts */}
      {[-2.35, -1.15, 0, 1.15, 2.35].map((x) => (
        <mesh key={x} position={[x, 0.72, 1.0]}>
          <boxGeometry args={[0.045, 1.4, 0.045]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   STONE ACCENT
========================================================= */

function StoneAccent() {
  const stones = useMemo(() => {
    const result: {
      x: number;
      y: number;
      w: number;
      h: number;
      d: number;
    }[] = [];

    const rows = 9;

    for (let row = 0; row < rows; row++) {
      let x = -0.9;

      while (x < 0.9) {
        const width = 0.32 + Math.random() * 0.35;

        result.push({
          x,
          y: -2.1 + row * 0.5,
          w: width,
          h: 0.42,
          d: 0.08,
        });

        x += width + 0.025;
      }
    }

    return result;
  }, []);

  return (
    <group position={[-3.0, 2.45, 3.67]}>
      {/* backing wall */}
      <mesh>
        <boxGeometry args={[2.15, 4.9, 0.25]} />
        <primitive object={stoneMaterial} attach="material" />
      </mesh>

      {/* individual stone joints */}
      {stones.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.y, 0.16]}
        >
          <boxGeometry args={[s.w, s.h, s.d]} />
          <meshStandardMaterial
            color={
              i % 3 === 0
                ? "#81786b"
                : i % 3 === 1
                  ? "#6d665d"
                  : "#8b8173"
            }
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   ENTRANCE CANOPY
========================================================= */

function EntranceCanopy() {
  return (
    <group position={[0, 3.0, 4.5]}>
      {/* concrete slab */}
      <RoundedBox
        args={[3.7, 0.24, 1.9]}
        radius={0.035}
        smoothness={2}
        castShadow
      >
        <primitive object={concreteMaterial} attach="material" />
      </RoundedBox>

      {/* dark underside */}
      <mesh position={[0, -0.13, 0]}>
        <boxGeometry args={[3.65, 0.08, 1.85]} />
        <meshStandardMaterial
          color="#55514b"
          roughness={0.9}
        />
      </mesh>

      {/* thin fascia */}
      <mesh position={[0, 0, 0.92]}>
        <boxGeometry args={[3.72, 0.38, 0.08]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   ENTRANCE COLUMNS
========================================================= */

function EntranceColumns() {
  return (
    <>
      {[-1.55, 1.55].map((x) => (
        <group key={x} position={[x, 1.8, 4.65]}>
          <RoundedBox
            args={[0.32, 3.6, 0.32]}
            radius={0.025}
            smoothness={2}
            castShadow
          >
            <primitive object={wallMaterial} attach="material" />
          </RoundedBox>

          {/* base */}
          <mesh position={[0, -1.82, 0]}>
            <boxGeometry args={[0.48, 0.12, 0.48]} />
            <primitive object={darkConcreteMaterial} attach="material" />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* =========================================================
   FRONT STAIRS
========================================================= */

function Stairs() {
  return (
    <group position={[0, 0, 4.75]}>
      {[0, 1, 2, 3].map((step) => (
        <mesh
          key={step}
          position={[
            0,
            0.12 * step,
            1.35 + step * 0.43,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              3.25 - step * 0.12,
              0.24,
              0.62,
            ]}
          />

          <primitive
            object={concreteMaterial}
            attach="material"
          />
        </mesh>
      ))}

      {/* side cheek walls */}
      <mesh
        position={[-1.58, 0.35, 2.0]}
        castShadow
      >
        <boxGeometry args={[0.18, 0.7, 2.2]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>

      <mesh
        position={[1.58, 0.35, 2.0]}
        castShadow
      >
        <boxGeometry args={[0.18, 0.7, 2.2]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   ROOF
========================================================= */

function Roof() {
  return (
    <group>
      {/* main roof slab */}
      <RoundedBox
        args={[10.7, 0.38, 7.55]}
        radius={0.06}
        smoothness={3}
        position={[0.35, 6.35, 0]}
        castShadow
      >
        <primitive object={roofMaterial} attach="material" />
      </RoundedBox>

      {/* roof parapet */}
      <mesh position={[0.35, 6.58, -2.9]}>
        <boxGeometry args={[9.8, 0.25, 0.22]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      <mesh position={[-4.55, 6.58, 0]}>
        <boxGeometry args={[0.22, 0.25, 5.8]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* drainage/gutter front */}
      <mesh position={[0.35, 6.16, 3.75]}>
        <boxGeometry args={[10.9, 0.18, 0.18]} />
        <meshStandardMaterial
          color="#272a2c"
          roughness={0.5}
          metalness={0.65}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   FLOOR SLAB
========================================================= */

function FloorSlab() {
  return (
    <group>
      <RoundedBox
        args={[10.65, 0.3, 7.35]}
        radius={0.04}
        smoothness={2}
        position={[0.3, 4.15, 0]}
        castShadow
      >
        <primitive object={concreteMaterial} attach="material" />
      </RoundedBox>

      {/* underside shadow band */}
      <mesh position={[0.3, 3.98, 0]}>
        <boxGeometry args={[10.3, 0.12, 7.05]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* =========================================================
   MAIN HOUSE BODY
========================================================= */

function MainStructure() {
  return (
    <>
      {/* Ground floor */}
      <RoundedBox
        args={[10, 4, 7]}
        radius={0.055}
        smoothness={3}
        position={[0, 2, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </RoundedBox>

      {/* Upper floor */}
      <RoundedBox
        args={[8.4, 2.2, 6.7]}
        radius={0.045}
        smoothness={3}
        position={[0.8, 5.1, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={upperWallMaterial} attach="material" />
      </RoundedBox>

      {/* Upper floor front fascia */}
      <mesh position={[0.8, 3.95, 3.38]}>
        <boxGeometry args={[8.55, 0.18, 0.2]} />
        <primitive object={darkConcreteMaterial} attach="material" />
      </mesh>
    </>
  );
}

/* =========================================================
   WOOD ACCENT
========================================================= */

function WoodAccent() {
  return (
    <group>
      <mesh
        position={[3.9, 5.0, 3.47]}
        castShadow
      >
        <boxGeometry args={[0.25, 2.1, 6.35]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>

      {/* individual vertical timber lines */}
      {[-1.8, -0.6, 0.6, 1.8].map((y) => (
        <mesh
          key={y}
          position={[3.76, 5.0 + y * 0.45, 3.62]}
        >
          <boxGeometry args={[0.035, 0.55, 0.04]} />
          <primitive object={woodDarkMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   SIDE WALL DETAILS
========================================================= */

function SideDetails() {
  return (
    <>
      {/* AC outdoor unit */}
      <group position={[5.05, 2.3, -1.8]}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.65, 0.35]} />
          <meshStandardMaterial
            color="#d5d4ce"
            roughness={0.65}
          />
        </mesh>

        <mesh position={[0, 0, 0.19]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
          <meshStandardMaterial
            color="#777a77"
            roughness={0.8}
          />
        </mesh>
      </group>

      {/* drain pipe */}
      <mesh
        position={[4.72, 3.0, 2.95]}
        castShadow
      >
        <cylinderGeometry
          args={[0.065, 0.065, 5.9, 12]}
        />
        <meshStandardMaterial
          color="#6c6a64"
          roughness={0.8}
        />
      </mesh>

      {/* pipe elbow */}
      <mesh position={[4.72, 0.12, 2.95]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
        <meshStandardMaterial
          color="#686762"
          roughness={0.8}
        />
      </mesh>
    </>
  );
}

/* =========================================================
   HOUSE
========================================================= */

export function House() {
  const interiorLight = useMemo(
    () => new THREE.Color("#ffbd73"),
    []
  );

  return (
    <group position={[0, 0, -5]}>
      {/* Main architecture */}
      <MainStructure />

      <FloorSlab />

      <Roof />

      {/* Stone feature */}
      <StoneAccent />

      {/* Wood facade */}
      <WoodAccent />

      {/* Entrance */}
      <Door />
      <EntranceCanopy />
      <EntranceColumns />

      {/* Balcony */}
      <Balcony />

      {/* Stairs */}
      <Stairs />

      {/* Ground-floor windows */}
      <Window
        position={[-2.8, 2.45, 3.58]}
        width={2.55}
        height={2.35}
        warm
      />

      <Window
        position={[2.8, 2.45, 3.58]}
        width={2.55}
        height={2.35}
      />

      {/* Upper windows */}
      <Window
        position={[-1.9, 5.08, 3.43]}
        width={2.45}
        height={1.75}
        warm
      />

      <Window
        position={[3.2, 5.08, 3.43]}
        width={2.35}
        height={1.75}
        warm
      />

      {/* Side window */}
      <group position={[5.02, 2.45, -0.8]} rotation={[0, Math.PI / 2, 0]}>
        <Window
          position={[0, 0, 0]}
          width={1.8}
          height={1.9}
        />
      </group>

      {/* Construction / utility details */}
      <SideDetails />

      {/* Warm entrance light */}
      <pointLight
        position={[0, 2.7, 4.25]}
        intensity={2.4}
        distance={6}
        color={interiorLight}
      />

      {/* Interior glow */}
      <pointLight
        position={[-2.8, 2.6, 3.0]}
        intensity={1.2}
        distance={5}
        color="#ffcf91"
      />

      <pointLight
        position={[2.8, 2.6, 3.0]}
        intensity={0.9}
        distance={5}
        color="#ffd6a0"
      />
    </group>
  );
}