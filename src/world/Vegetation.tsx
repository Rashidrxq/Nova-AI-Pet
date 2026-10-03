import { useMemo } from "react";
import * as THREE from "three";

/* =========================================================
   SHARED MATERIALS
========================================================= */

const grassMaterial = new THREE.MeshStandardMaterial({
  color: "#527d45",
  roughness: 1,
});

const grassLightMaterial = new THREE.MeshStandardMaterial({
  color: "#6f934f",
  roughness: 1,
});

const shrubMaterial = new THREE.MeshStandardMaterial({
  color: "#3f693d",
  roughness: 0.95,
});

const shrubDarkMaterial = new THREE.MeshStandardMaterial({
  color: "#315532",
  roughness: 0.98,
});

const bananaStemMaterial = new THREE.MeshStandardMaterial({
  color: "#66734b",
  roughness: 0.95,
});

const bananaLeafMaterial = new THREE.MeshStandardMaterial({
  color: "#527c42",
  roughness: 0.9,
});

const soilMaterial = new THREE.MeshStandardMaterial({
  color: "#6d543c",
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
    return Array.from({ length: 7 }, (_, i) => ({
      x: (Math.random() - 0.5) * 0.45,
      z: (Math.random() - 0.5) * 0.45,
      rotation: Math.random() * Math.PI,
      height: 0.25 + Math.random() * 0.35,
      width: 0.025 + Math.random() * 0.025,
      material:
        i % 3 === 0
          ? grassLightMaterial
          : grassMaterial,
    }));
  }, []);

  return (
    <group
      position={position}
      scale={scale}
    >
      {blades.map((blade, index) => (
        <mesh
          key={index}
          position={[
            blade.x,
            blade.height / 2,
            blade.z,
          ]}
          rotation={[
            0.15,
            blade.rotation,
            0.08,
          ]}
          material={blade.material}
        >
          <boxGeometry
            args={[
              blade.width,
              blade.height,
              0.025,
            ]}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   SHRUB
========================================================= */

function Shrub({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group
      position={position}
      scale={scale}
    >
      <mesh
        position={[0, 0.45, 0]}
        material={shrubMaterial}
        castShadow
      >
        <sphereGeometry
          args={[0.65, 10, 7]}
        />
      </mesh>

      <mesh
        position={[-0.45, 0.35, 0.15]}
        material={shrubDarkMaterial}
        castShadow
      >
        <sphereGeometry
          args={[0.42, 9, 6]}
        />
      </mesh>

      <mesh
        position={[0.45, 0.3, -0.1]}
        material={shrubMaterial}
        castShadow
      >
        <sphereGeometry
          args={[0.48, 9, 6]}
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
  return (
    <group
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
    >
      {/* Stem */}
      <mesh
        position={[0, 1.25, 0]}
        material={bananaStemMaterial}
      >
        <cylinderGeometry
          args={[0.13, 0.2, 2.5, 8]}
        />
      </mesh>

      {/* Leaves */}
      {Array.from({ length: 7 }).map(
        (_, index) => {
          const angle =
            (index / 7) * Math.PI * 2;

          return (
            <mesh
              key={index}
              position={[
                Math.cos(angle) * 0.55,
                2.5 -
                  Math.abs(
                    Math.sin(index * 1.7)
                  ) *
                    0.35,
                Math.sin(angle) * 0.55,
              ]}
              rotation={[
                0.15 + index * 0.015,
                angle,
                0.15,
              ]}
              material={bananaLeafMaterial}
              castShadow
            >
              <boxGeometry
                args={[1.9, 0.045, 0.42]}
              />
            </mesh>
          );
        }
      )}
    </group>
  );
}

/* =========================================================
   SMALL ORNAMENTAL PLANT
========================================================= */

function OrnamentalPlant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group
      position={position}
      scale={scale}
    >
      {Array.from({ length: 6 }).map(
        (_, index) => {
          const angle =
            (index / 6) * Math.PI * 2;

          return (
            <mesh
              key={index}
              position={[
                Math.cos(angle) * 0.18,
                0.35,
                Math.sin(angle) * 0.18,
              ]}
              rotation={[
                0.35,
                angle,
                0.05,
              ]}
              material={
                index % 2 === 0
                  ? shrubMaterial
                  : grassLightMaterial
              }
            >
              <boxGeometry
                args={[0.65, 0.06, 0.12]}
              />
            </mesh>
          );
        }
      )}
    </group>
  );
}

/* =========================================================
   SMALL SOIL PATCH
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
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={scale}
      material={soilMaterial}
    >
      <circleGeometry args={[0.7, 12]} />
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
          GRASS CLUSTERS
      ================================================= */}

      <GrassCluster
        position={[-8.5, 0, 7.5]}
        scale={1.2}
      />

      <GrassCluster
        position={[-6.8, 0, 8.4]}
        scale={0.8}
      />

      <GrassCluster
        position={[7.5, 0, 7.8]}
        scale={1.1}
      />

      <GrassCluster
        position={[9.2, 0, 8.6]}
        scale={0.7}
      />

      <GrassCluster
        position={[-15, 0, 2]}
        scale={1.3}
      />

      <GrassCluster
        position={[15, 0, -1]}
        scale={1.1}
      />

      <GrassCluster
        position={[-18, 0, -9]}
        scale={1.5}
      />

      <GrassCluster
        position={[18, 0, -10]}
        scale={1.4}
      />

      {/* =================================================
          SHRUBS
      ================================================= */}

      <Shrub
        position={[-8.5, 0, 5.8]}
        scale={0.8}
      />

      <Shrub
        position={[-6.8, 0, 6.5]}
        scale={0.65}
      />

      <Shrub
        position={[7.8, 0, 6.2]}
        scale={0.9}
      />

      <Shrub
        position={[9.5, 0, 5.7]}
        scale={0.7}
      />

      <Shrub
        position={[-15.5, 0, 6]}
        scale={1.1}
      />

      <Shrub
        position={[15.5, 0, 5]}
        scale={1}
      />

      {/* =================================================
          BANANA PLANTS
      ================================================= */}

      <BananaPlant
        position={[-15, 0, -1]}
        scale={0.9}
        rotation={0.3}
      />

      <BananaPlant
        position={[-16, 0, -2]}
        scale={0.75}
        rotation={1.2}
      />

      <BananaPlant
        position={[15, 0, -4]}
        scale={1}
        rotation={2.1}
      />

      {/* =================================================
          ORNAMENTAL PLANTS
      ================================================= */}

      <OrnamentalPlant
        position={[-4.5, 0, 6.3]}
        scale={0.8}
      />

      <OrnamentalPlant
        position={[4.8, 0, 6.2]}
        scale={0.9}
      />

      <OrnamentalPlant
        position={[6.3, 0, 6.5]}
        scale={0.7}
      />

      {/* =================================================
          SOIL PATCHES
      ================================================= */}

      <SoilPatch
        position={[-9.5, 0.012, 7]}
        scale={1.1}
      />

      <SoilPatch
        position={[8.8, 0.012, 7.3]}
        scale={0.8}
      />

      <SoilPatch
        position={[-15.5, 0.012, 4]}
        scale={1.2}
      />

      <SoilPatch
        position={[16, 0.012, 3]}
        scale={0.9}
      />
    </group>
  );
}