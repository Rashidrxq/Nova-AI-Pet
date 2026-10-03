import { useMemo } from "react";
import * as THREE from "three";

const GRASS_COLORS = [
  "#718f5b",
  "#789662",
  "#6b8756",
  "#819c68",
];

const SOIL_COLORS = [
  "#66503f",
  "#705641",
  "#604a39",
];

export function Ground() {
  const grassMaterials = useMemo(
    () =>
      GRASS_COLORS.map(
        (color) =>
          new THREE.MeshStandardMaterial({
            color,
            roughness: 1,
            metalness: 0,
          })
      ),
    []
  );

  const soilMaterials = useMemo(
    () =>
      SOIL_COLORS.map(
        (color) =>
          new THREE.MeshStandardMaterial({
            color,
            roughness: 1,
            metalness: 0,
          })
      ),
    []
  );

  /*
   * Slightly irregular terrain.
   * The deformation is intentionally very small so the
   * house, road and compound remain properly grounded.
   */
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(
      100,
      100,
      40,
      40
    );

    const position =
      geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);

      const distance =
        Math.sqrt(x * x + y * y);

      /*
       * Keep the central property area relatively flat.
       * More variation is allowed farther away.
       */
      const influence = THREE.MathUtils.clamp(
        (distance - 15) / 35,
        0,
        1
      );

      const variation =
        (
          Math.sin(x * 0.32) *
          Math.cos(y * 0.27) *
          0.045
        ) * influence;

      position.setZ(i, variation);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  /*
   * Natural irregular soil patches.
   */
  const soilPatches = useMemo(
    () => [
      {
        position: [-15, -0.045, -8] as [
          number,
          number,
          number
        ],
        scale: [1.25, 0.8, 1] as [
          number,
          number,
          number
        ],
        rotation: 0.35,
        material: soilMaterials[0],
      },

      {
        position: [16, -0.045, 5] as [
          number,
          number,
          number
        ],
        scale: [1.15, 0.75, 1] as [
          number,
          number,
          number
        ],
        rotation: -0.45,
        material: soilMaterials[1],
      },

      {
        position: [-12, -0.045, 15] as [
          number,
          number,
          number
        ],
        scale: [0.9, 0.65, 1] as [
          number,
          number,
          number
        ],
        rotation: 0.8,
        material: soilMaterials[2],
      },

      {
        position: [22, -0.045, -16] as [
          number,
          number,
          number
        ],
        scale: [1.4, 0.7, 1] as [
          number,
          number,
          number
        ],
        rotation: -0.2,
        material: soilMaterials[0],
      },
    ],
    [soilMaterials]
  );

  /*
   * Small natural grass/soil transition patches.
   */
  const smallPatches = useMemo(
    () => [
      [-8, -0.035, -13],
      [8, -0.035, -11],
      [-20, -0.035, 4],
      [20, -0.035, 14],
      [-7, -0.035, 18],
      [14, -0.035, -20],
    ] as [number, number, number][],
    []
  );

  return (
    <group>
      {/* =================================================
          MAIN TERRAIN
      ================================================= */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        geometry={terrainGeometry}
        receiveShadow
        material={grassMaterials[0]}
      />

      {/* =================================================
          SUBTLE GRASS COLOR VARIATION
      ================================================= */}

      {smallPatches.map((position, index) => (
        <mesh
          key={`grass-${index}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={position}
          receiveShadow
        >
          <circleGeometry
            args={[
              1.5 + (index % 3) * 0.45,
              20,
            ]}
          />

          <primitive
            object={
              grassMaterials[
                (index + 1) %
                  grassMaterials.length
              ]
            }
            attach="material"
          />
        </mesh>
      ))}

      {/* =================================================
          EXPOSED SOIL
      ================================================= */}

      {soilPatches.map(
        (patch, index) => (
          <mesh
            key={`soil-${index}`}
            rotation={[
              -Math.PI / 2,
              0,
              patch.rotation,
            ]}
            position={patch.position}
            scale={patch.scale}
            receiveShadow
            material={patch.material}
          >
            <circleGeometry args={[3, 28]} />
          </mesh>
        )
      )}

      {/* =================================================
          SMALL STONE / DIRT DETAILS
      ================================================= */}

      <mesh
        position={[-18, 0.01, 11]}
        rotation={[
          0.2,
          0.4,
          0.15,
        ]}
        scale={[1.2, 0.35, 0.7]}
        castShadow
      >
        <dodecahedronGeometry args={[0.18, 0]} />

        <meshStandardMaterial
          color="#77705f"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[19, 0.01, -3]}
        rotation={[
          0.3,
          0.7,
          0.1,
        ]}
        scale={[0.8, 0.3, 0.6]}
      >
        <dodecahedronGeometry args={[0.16, 0]} />

        <meshStandardMaterial
          color="#696254"
          roughness={1}
        />
      </mesh>
    </group>
  );
}