import { useMemo } from "react";
import * as THREE from "three";

/* =========================================================
   SHARED MATERIALS
========================================================= */

const grassMaterial = new THREE.MeshStandardMaterial({
  color: "#557d3f",
  roughness: 1,
});

const grassLightMaterial = new THREE.MeshStandardMaterial({
  color: "#6f914d",
  roughness: 1,
});

const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#3f6939",
  roughness: 0.95,
});

const bushDarkMaterial = new THREE.MeshStandardMaterial({
  color: "#315533",
  roughness: 1,
});

const bananaLeafMaterial = new THREE.MeshStandardMaterial({
  color: "#477842",
  roughness: 0.9,
  side: THREE.DoubleSide,
});

const stemMaterial = new THREE.MeshStandardMaterial({
  color: "#60734a",
  roughness: 1,
});

const soilMaterial = new THREE.MeshStandardMaterial({
  color: "#765b43",
  roughness: 1,
});

/* =========================================================
   GRASS CLUSTER
========================================================= */

function GrassCluster({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const blades = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2;

      return {
        x: Math.cos(angle) * 0.08,
        z: Math.sin(angle) * 0.08,
        rotation: angle,
        height: 0.35 + (i % 3) * 0.08,
      };
    });
  }, []);

  return (
    <group position={position} scale={scale}>
      {blades.map((blade, i) => (
        <mesh
          key={i}
          position={[blade.x, blade.height / 2, blade.z]}
          rotation={[
            0.18,
            blade.rotation,
            -0.12,
          ]}
        >
          <planeGeometry args={[0.055, blade.height]} />
          <primitive
            object={i % 2 === 0 ? grassMaterial : grassLightMaterial}
            attach="material"
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   SMALL BUSH
========================================================= */

function Bush({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.45, 8, 6]} />
        <primitive object={bushMaterial} attach="material" />
      </mesh>

      <mesh
        position={[-0.35, 0.25, 0.1]}
        castShadow
      >
        <sphereGeometry args={[0.32, 8, 6]} />
        <primitive
          object={bushDarkMaterial}
          attach="material"
        />
      </mesh>

      <mesh
        position={[0.35, 0.3, -0.05]}
        castShadow
      >
        <sphereGeometry args={[0.35, 8, 6]} />
        <primitive
          object={bushMaterial}
          attach="material"
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   BANANA PLANT
========================================================= */

function BananaPlant({
  position,
  scale = 1,
  rotation = 0,
}: {
  position: [number, number, number];
  scale?: number;
  rotation?: number;
}) {
  const leaves = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2;

      return {
        angle,
        height: 2.0 + (i % 3) * 0.12,
        length: 1.25 + (i % 2) * 0.25,
      };
    });
  }, []);

  return (
    <group
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
    >
      {/* Main stem */}
      <mesh
        position={[0, 1.1, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.13, 0.2, 2.2, 8]}
        />

        <primitive
          object={stemMaterial}
          attach="material"
        />
      </mesh>

      {/* Leaves */}
      <group position={[0, 2.05, 0]}>
        {leaves.map((leaf, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(leaf.angle) * 0.25,
              0,
              Math.sin(leaf.angle) * 0.25,
            ]}
            rotation={[
              0.35,
              leaf.angle,
              0,
            ]}
            castShadow
          >
            <planeGeometry
              args={[leaf.length, 0.42]}
            />

            <primitive
              object={bananaLeafMaterial}
              attach="material"
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* =========================================================
   ORNAMENTAL PLANT
========================================================= */

function OrnamentalPlant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = (i / 9) * Math.PI * 2;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.18,
              0.35,
              Math.sin(angle) * 0.18,
            ]}
            rotation={[
              0.55,
              angle,
              0,
            ]}
          >
            <planeGeometry args={[0.12, 0.75]} />

            <primitive
              object={grassLightMaterial}
              attach="material"
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* =========================================================
   SOIL PATCH
========================================================= */

function SoilPatch({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <mesh
      position={[
        position[0],
        0.012,
        position[2],
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={scale}
      receiveShadow
    >
      <circleGeometry args={[0.8, 12]} />

      <primitive
        object={soilMaterial}
        attach="material"
      />
    </mesh>
  );
}

/* =========================================================
   VEGETATION
========================================================= */

export function Vegetation() {
  return (
    <group>
      {/* =================================================
          GRASS
      ================================================= */}

      <GrassCluster
        position={[-11, 0, 8]}
        scale={1.1}
      />

      <GrassCluster
        position={[-8.5, 0, 10.5]}
        scale={0.8}
      />

      <GrassCluster
        position={[7.5, 0, 9]}
        scale={1.2}
      />

      <GrassCluster
        position={[11, 0, 7]}
        scale={0.75}
      />

      <GrassCluster
        position={[-15, 0, 3]}
        scale={0.9}
      />

      <GrassCluster
        position={[15, 0, 2]}
        scale={1}
      />

      {/* =================================================
          BUSHES
      ================================================= */}

      <Bush
        position={[-11.5, 0, 8.5]}
        scale={1.1}
      />

      <Bush
        position={[-9.5, 0, 9.8]}
        scale={0.8}
      />

      <Bush
        position={[10.5, 0, 8]}
        scale={1}
      />

      <Bush
        position={[13, 0, 6.5]}
        scale={0.75}
      />

      <Bush
        position={[-15, 0, -2]}
        scale={1.2}
      />

      {/* =================================================
          BANANA PLANTS
      ================================================= */}

      <BananaPlant
        position={[-13, 0, -1]}
        scale={1.15}
        rotation={0.4}
      />

      <BananaPlant
        position={[-11.8, 0, -0.2]}
        scale={0.9}
        rotation={1.1}
      />

      <BananaPlant
        position={[13.5, 0, -2]}
        scale={1}
        rotation={2}
      />

      {/* =================================================
          ORNAMENTAL PLANTS
      ================================================= */}

      <OrnamentalPlant
        position={[-4.8, 0, 6]}
        scale={0.9}
      />

      <OrnamentalPlant
        position={[4.7, 0, 6.5]}
        scale={1}
      />

      <OrnamentalPlant
        position={[-7, 0, 8.5]}
        scale={0.7}
      />

      <OrnamentalPlant
        position={[8, 0, 8.8]}
        scale={0.8}
      />

      {/* =================================================
          SOIL PATCHES
      ================================================= */}

      <SoilPatch
        position={[-13, 0, 5]}
        scale={1.2}
      />

      <SoilPatch
        position={[13, 0, 5]}
        scale={0.9}
      />

      <SoilPatch
        position={[-10, 0, -1]}
        scale={1}
      />

      <SoilPatch
        position={[11, 0, -3]}
        scale={1.3}
      />
    </group>
  );
}