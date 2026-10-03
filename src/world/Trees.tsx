import { useMemo } from "react";
import * as THREE from "three";

/* =========================================================
   SHARED MATERIALS
========================================================= */

const trunkMaterial = new THREE.MeshStandardMaterial({
  color: "#5b402c",
  roughness: 0.92,
});

const trunkLightMaterial = new THREE.MeshStandardMaterial({
  color: "#765438",
  roughness: 0.95,
});

const leafMaterials = [
  new THREE.MeshStandardMaterial({
    color: "#2f632f",
    roughness: 0.92,
  }),

  new THREE.MeshStandardMaterial({
    color: "#3f7738",
    roughness: 0.9,
  }),

  new THREE.MeshStandardMaterial({
    color: "#568d40",
    roughness: 0.88,
  }),

  new THREE.MeshStandardMaterial({
    color: "#6b9d45",
    roughness: 0.9,
  }),
];

const coconutLeafMaterial = new THREE.MeshStandardMaterial({
  color: "#3f7537",
  roughness: 0.9,
  side: THREE.DoubleSide,
});

const coconutYoungLeafMaterial = new THREE.MeshStandardMaterial({
  color: "#619947",
  roughness: 0.9,
  side: THREE.DoubleSide,
});

/* =========================================================
   SMALL HELPERS
========================================================= */

function seededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

/* =========================================================
   BROAD LEAF CLUSTER
   Small overlapping foliage masses instead of one sphere.
========================================================= */

function LeafCluster({
  position,
  scale = 1,
  material,
  rotation = 0,
}: {
  position: [number, number, number];
  scale?: number;
  material: THREE.Material;
  rotation?: number;
}) {
  return (
    <mesh
      position={position}
      rotation={[0, rotation, 0]}
      scale={[scale, scale * 0.82, scale]}
      castShadow
    >
      <icosahedronGeometry args={[1, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* =========================================================
   BROAD LEAF TREE

   Designed to resemble the reference:
   - thick branching trunk
   - multiple foliage masses
   - irregular crown
   - layered green tones
========================================================= */

function BroadLeafTree({
  position,
  scale = 1,
  seed = 1,
}: {
  position: [number, number, number];
  scale?: number;
  seed?: number;
}) {
  const random = useMemo(() => seededRandom(seed), [seed]);

  const branches = useMemo<{
    position: [number, number, number];
    rotation: [number, number, number];
    length: number;
  }[]>(() => {
    return [
      {
        position: [-0.55, 3.25, 0],
        rotation: [0, 0, -0.38] as [number, number, number],
        length: 2.1,
      },
      {
        position: [0.5, 3.35, 0.05],
        rotation: [0, 0, 0.38] as [number, number, number],
        length: 2.0,
      },
      {
        position: [-0.25, 3.8, 0.05],
        rotation: [0.08, 0, -0.22] as [number, number, number],
        length: 1.6,
      },
      {
        position: [0.3, 3.9, -0.05],
        rotation: [-0.05, 0, 0.24] as [number, number, number],
        length: 1.55,
      },
    ];
  }, []);

  const foliage = useMemo(() => {
    const result: {
      position: [number, number, number];
      scale: number;
      material: THREE.Material;
      rotation: number;
    }[] = [];

    const clusters = 20;

    for (let i = 0; i < clusters; i++) {
      const angle = random() * Math.PI * 2;

      const radius =
        i < 8
          ? 0.7 + random() * 0.7
          : 1.15 + random() * 1.05;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.8;

      const y =
        4.3 +
        random() * 2.0 -
        radius * 0.18;

      const size =
        0.7 +
        random() * 0.65;

      result.push({
        position: [x, y, z],
        scale: size,
        material:
          leafMaterials[
            Math.floor(random() * leafMaterials.length)
          ],
        rotation: random() * Math.PI,
      });
    }

    return result;
  }, [random]);

  return (
    <group
      position={position}
      scale={scale}
    >
      {/* Main trunk */}

      <mesh
        position={[0, 2.45, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.42, 0.58, 4.9, 12]}
        />
        <primitive
          object={trunkMaterial}
          attach="material"
        />
      </mesh>

      {/* Slight trunk flare */}

      <mesh
        position={[0, 0.35, 0]}
        scale={[1.2, 0.65, 1.2]}
        castShadow
      >
        <cylinderGeometry
          args={[0.55, 0.75, 0.7, 12]}
        />
        <primitive
          object={trunkLightMaterial}
          attach="material"
        />
      </mesh>

      {/* Branches */}

      {branches.map((branch, index) => (
        <mesh
          key={index}
          position={branch.position}
          rotation={branch.rotation}
          castShadow
        >
          <cylinderGeometry
            args={[
              0.12,
              0.23,
              branch.length,
              8,
            ]}
          />
          <primitive
            object={trunkLightMaterial}
            attach="material"
          />
        </mesh>
      ))}

      {/* Layered foliage */}

      {foliage.map((leaf, index) => (
        <LeafCluster
          key={index}
          position={leaf.position}
          scale={leaf.scale}
          material={leaf.material}
          rotation={leaf.rotation}
        />
      ))}

      {/* Darker inner foliage */}

      <LeafCluster
        position={[0, 4.75, 0]}
        scale={1.2}
        material={leafMaterials[0]}
      />

      <LeafCluster
        position={[-0.7, 5.1, 0.1]}
        scale={1.15}
        material={leafMaterials[1]}
      />

      <LeafCluster
        position={[0.75, 5.15, -0.1]}
        scale={1.2}
        material={leafMaterials[2]}
      />
    </group>
  );
}

/* =========================================================
   COCONUT FROND

   Instead of one rectangular box, each palm leaf is built
   from several tapered-looking leaf sections.
========================================================= */

function CoconutFrond({
  angle,
  length = 2.7,
  height = 5.8,
  seed = 1,
}: {
  angle: number;
  length?: number;
  height?: number;
  seed?: number;
}) {
  const random = useMemo(
    () => seededRandom(seed),
    [seed]
  );

  const segments = 7;

  return (
    <group
      position={[0, height, 0]}
      rotation={[0, angle, 0]}
    >
      {/* Main central stem */}

      <mesh
        position={[0, -0.15, length * 0.45]}
        rotation={[
          -0.28,
          0,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.045,
            0.075,
            length,
            6,
          ]}
        />
        <primitive
          object={coconutLeafMaterial}
          attach="material"
        />
      </mesh>

      {/* Individual leaflets */}

      {Array.from({
        length: segments,
      }).map((_, index) => {
        const t = index / segments;

        const z =
          0.45 +
          t * length * 0.75;

        const spread =
          0.25 +
          t * 0.7;

        const side =
          index % 2 === 0 ? 1 : -1;

        const leafletLength =
          0.65 +
          t * 0.65 +
          random() * 0.15;

        return (
          <mesh
            key={index}
            position={[
              side * spread,
              -0.08 - t * 0.45,
              z,
            ]}
            rotation={[
              -0.45 - t * 0.25,
              side * 0.22,
              side * 0.35,
            ]}
            scale={[
              1,
              1,
              leafletLength,
            ]}
            castShadow
          >
            <planeGeometry
              args={[0.28, 1]}
            />

            <primitive
              object={
                index < 2
                  ? coconutYoungLeafMaterial
                  : coconutLeafMaterial
              }
              attach="material"
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* =========================================================
   COCONUT TREE
========================================================= */

function CoconutTree({
  position,
  scale = 1,
  rotation = 0,
}: {
  position: [number, number, number];
  scale?: number;
  rotation?: number;
}) {
  const fronds = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => ({
      angle:
        (i / 9) * Math.PI * 2,
      length:
        2.3 +
        Math.sin(i * 2.3) * 0.35,
    }));
  }, []);

  return (
    <group
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
    >
      {/* Lower trunk */}

      <mesh
        position={[0, 2.25, 0]}
        rotation={[0, 0, -0.035]}
        castShadow
      >
        <cylinderGeometry
          args={[0.24, 0.38, 4.5, 12]}
        />

        <primitive
          object={trunkMaterial}
          attach="material"
        />
      </mesh>

      {/* Upper trunk */}

      <mesh
        position={[0.04, 4.45, 0]}
        rotation={[0, 0, 0.025]}
        castShadow
      >
        <cylinderGeometry
          args={[0.16, 0.24, 1.9, 10]}
        />

        <primitive
          object={trunkLightMaterial}
          attach="material"
        />
      </mesh>

      {/* Small trunk rings */}

      {Array.from({
        length: 8,
      }).map((_, index) => (
        <mesh
          key={index}
          position={[
            0,
            1.15 + index * 0.45,
            0,
          ]}
          rotation={[
            0,
            0,
            -0.035,
          ]}
        >
          <torusGeometry
            args={[
              0.25 -
                index * 0.008,
              0.018,
              5,
              12,
            ]}
          />

          <meshStandardMaterial
            color="#4b3526"
            roughness={1}
          />
        </mesh>
      ))}

      {/* Crown */}

      <group>
        {fronds.map(
          (frond, index) => (
            <CoconutFrond
              key={index}
              angle={frond.angle}
              length={frond.length}
              height={5.65}
              seed={index + 20}
            />
          )
        )}

        {/* Coconut cluster */}

        <mesh
          position={[0, 5.45, 0]}
          scale={[0.48, 0.38, 0.48]}
          castShadow
        >
          <icosahedronGeometry
            args={[1, 1]}
          />

          <primitive
            object={leafMaterials[0]}
            attach="material"
          />
        </mesh>

        {/* Coconut fruits */}

        {Array.from({
          length: 5,
        }).map((_, index) => {
          const angle =
            (index / 5) *
            Math.PI *
            2;

          return (
            <mesh
              key={index}
              position={[
                Math.cos(angle) * 0.28,
                5.2,
                Math.sin(angle) * 0.28,
              ]}
              scale={0.11}
              castShadow
            >
              <sphereGeometry
                args={[1, 8, 8]}
              />

              <meshStandardMaterial
                color="#6c542d"
                roughness={0.95}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/* =========================================================
   ARECA PALM

   Thin multiple trunks + smaller natural crown.
========================================================= */

function ArecaPalm({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const trunkPositions = [
    [-0.16, 0],
    [0, 0.04],
    [0.18, -0.02],
  ];

  return (
    <group
      position={position}
      scale={scale}
    >
      {trunkPositions.map(
        ([x, z], index) => (
          <mesh
            key={index}
            position={[
              x,
              2.25,
              z,
            ]}
            rotation={[
              0,
              0,
              x * 0.12,
            ]}
            castShadow
          >
            <cylinderGeometry
              args={[
                0.06,
                0.105,
                4.5,
                8,
              ]}
            />

            <primitive
              object={trunkLightMaterial}
              attach="material"
            />
          </mesh>
        )
      )}

      {/* Crown */}

      {Array.from({
        length: 8,
      }).map((_, index) => {
        const angle =
          (index / 8) *
          Math.PI *
          2;

        return (
          <CoconutFrond
            key={index}
            angle={angle}
            length={1.55}
            height={4.5}
            seed={100 + index}
          />
        );
      })}
    </group>
  );
}

/* =========================================================
   TREES
========================================================= */

export function Trees() {
  return (
    <group>
      {/* ================================================
          COCONUT TREES
      ================================================= */}

      <CoconutTree
        position={[-10, 0, -4]}
        scale={1.05}
        rotation={0.3}
      />

      <CoconutTree
        position={[11, 0, -7]}
        scale={0.9}
        rotation={1.1}
      />

      <CoconutTree
        position={[17, 0, 1]}
        scale={1.15}
        rotation={2.2}
      />

      {/* ================================================
          ARECA PALMS
      ================================================= */}

      <ArecaPalm
        position={[-12, 0, 5]}
        scale={0.9}
      />

      <ArecaPalm
        position={[-10.8, 0, 5.8]}
        scale={1.05}
      />

      <ArecaPalm
        position={[12, 0, 5]}
        scale={0.85}
      />

      {/* ================================================
          LARGE BROAD-LEAF TREES
      ================================================= */}

      <BroadLeafTree
        position={[-20, 0, -10]}
        scale={1.3}
        seed={10}
      />

      <BroadLeafTree
        position={[21, 0, -12]}
        scale={1.5}
        seed={20}
      />

      <BroadLeafTree
        position={[-24, 0, 8]}
        scale={1.15}
        seed={30}
      />

      <BroadLeafTree
        position={[26, 0, 8]}
        scale={1.2}
        seed={40}
      />
    </group>
  );
}