import { useMemo } from "react";
import * as THREE from "three";

const ROAD_LENGTH = 40;

const ROAD_Z_START = 8.5;
const ROAD_Z_END = 15.5;

function createRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function RoadSurface() {
  const geometry = useMemo(() => {
    const nx = 200;
    const nz = 10;
    const random = createRandom(99);

    const halfLength = ROAD_LENGTH / 2;

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let j = 0; j <= nz; j++) {
      const t = j / nz;

      for (let i = 0; i <= nx; i++) {
        const x =
          -halfLength +
          (i / nx) * ROAD_LENGTH;

        const edge =
          j === 0 || j === nz
            ? (random() - 0.5) * 0.18
            : 0;

        const z =
          ROAD_Z_START +
          t * (ROAD_Z_END - ROAD_Z_START) +
          edge;

        // Slight road crown
        const crown =
          0.045 *
          (1 - Math.pow(2 * t - 1, 2));

        // Very subtle surface variation
        const variation =
          Math.sin(x * 0.4) * 0.004 +
          Math.sin(x * 1.7 + t * 5) * 0.0015;

        const edgeDrop =
          j === 0 || j === nz
            ? -0.012
            : 0;

        positions.push(
          x,
          0.03 +
            crown +
            variation +
            edgeDrop,
          z
        );

        uvs.push(
          (x + halfLength) / 36,
          t
        );
      }
    }

    for (let j = 0; j < nz; j++) {
      for (let i = 0; i < nx; i++) {
        const a =
          j * (nx + 1) + i;

        const b =
          a + nx + 1;

        indices.push(
          a,
          b,
          a + 1,

          a + 1,
          b,
          b + 1
        );
      }
    }

    const geometry =
      new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        positions,
        3
      )
    );

    geometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(
        uvs,
        2
      )
    );

    geometry.setIndex(indices);

    geometry.computeVertexNormals();

    return geometry;
  }, []);

  return (
    <mesh
      geometry={geometry}
      receiveShadow
    >
      <meshStandardMaterial
        color="#292b29"
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}

function RoadShoulder({
  side,
}: {
  side: -1 | 1;
}) {
  const geometry = useMemo(() => {
    const segments = 30;
    const width = 0.8;

    const positions: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      const z =
        ROAD_Z_START +
        t * (ROAD_Z_END - ROAD_Z_START);

      const roadEdge =
        side * (ROAD_LENGTH / 2);

      const innerX =
        roadEdge -
        side * 0.02;

      const outerX =
        roadEdge +
        side * width;

      const irregular =
        Math.sin(i * 1.8) * 0.08;

      positions.push(
        innerX,
        0.018,
        z
      );

      positions.push(
        outerX,
        0.012,
        z + irregular
      );
    }

    for (let i = 0; i < segments; i++) {
      const a = i * 2;
      const b = a + 2;

      indices.push(
        a,
        b,
        a + 1,

        a + 1,
        b,
        b + 1
      );
    }

    const geometry =
      new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        positions,
        3
      )
    );

    geometry.setIndex(indices);

    geometry.computeVertexNormals();

    return geometry;
  }, [side]);

  return (
    <mesh
      geometry={geometry}
      receiveShadow
    >
      <meshStandardMaterial
        color="#756d5f"
        roughness={0.98}
        metalness={0}
      />
    </mesh>
  );
}

function RoadPatch({
  position,
  scale,
  rotation = 0,
}: {
  position: [number, number, number];
  scale: [number, number];
  rotation?: number;
}) {
  return (
    <mesh
      position={[
        position[0],
        0.078,
        position[2],
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        rotation,
      ]}
      scale={[
        scale[0],
        scale[1],
        1,
      ]}
      receiveShadow
    >
      <circleGeometry args={[1, 10]} />

      <meshStandardMaterial
        color="#343633"
        roughness={0.96}
        metalness={0}
      />
    </mesh>
  );
}

function RoadCrack({
  points,
}: {
  points: THREE.Vector3[];
}) {
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#202220",
        transparent: true,
        opacity: 0.38,
      }),
    []
  );

  const line = useMemo(() => {
    const curve =
      new THREE.CatmullRomCurve3(
        points
      );

    const geometry =
      new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(12)
      );

    return new THREE.Line(
      geometry,
      material
    );
  }, [material, points]);

  return (
    <primitive
      object={line}
      position={[0, 0.078, 0]}
    />
  );
}

function RoadDebris() {
  const debris = useMemo(() => {
    const random = createRandom(421);

    return Array.from(
      { length: 24 },
      (_, i) => {
        const side =
          i % 2 === 0 ? -1 : 1;

        const x =
          side *
          (
            ROAD_LENGTH / 2 +
            0.25 +
            random() * 1.1
          );

        const z =
          ROAD_Z_START +
          random() *
            (ROAD_Z_END - ROAD_Z_START);

        const scale =
          0.025 +
          random() * 0.055;

        return {
          position: [
            x,
            0.055,
            z,
          ] as [
            number,
            number,
            number
          ],

          scale,

          rotation:
            random() * Math.PI,
        };
      }
    );
  }, []);

  return (
    <>
      {debris.map(
        (item, index) => (
          <mesh
            key={index}
            position={
              item.position
            }
            rotation={[
              0,
              item.rotation,
              0,
            ]}
            scale={[
              item.scale,
              item.scale * 0.45,
              item.scale,
            ]}
          >
            <dodecahedronGeometry
              args={[1, 0]}
            />

            <meshStandardMaterial
              color={
                index % 3 === 0
                  ? "#8b8273"
                  : "#5f5b52"
              }
              roughness={1}
            />
          </mesh>
        )
      )}
    </>
  );
}

export function Road() {
  return (
    <group>
      {/* Main asphalt */}
      <RoadSurface />

      {/* Road shoulders */}
      <RoadShoulder side={-1} />
      <RoadShoulder side={1} />

      {/* Repaired asphalt areas */}
      <RoadPatch
        position={[-7.5, 0, 10.9]}
        scale={[1.7, 0.45]}
        rotation={0.15}
      />

      <RoadPatch
        position={[8.5, 0, 13.1]}
        scale={[1.1, 0.32]}
        rotation={-0.2}
      />

      <RoadPatch
        position={[-1.5, 0, 12.8]}
        scale={[0.65, 0.25]}
        rotation={0.35}
      />

      {/* Small cracks */}
      <RoadCrack
        points={[
          new THREE.Vector3(-13, 0, 11.2),
          new THREE.Vector3(-12.5, 0, 11.35),
          new THREE.Vector3(-12, 0, 11.28),
          new THREE.Vector3(-11.6, 0, 11.5),
        ]}
      />

      <RoadCrack
        points={[
          new THREE.Vector3(9.5, 0, 13.5),
          new THREE.Vector3(10, 0, 13.35),
          new THREE.Vector3(10.5, 0, 13.4),
          new THREE.Vector3(10.8, 0, 13.2),
        ]}
      />

      <RoadCrack
        points={[
          new THREE.Vector3(-2.5, 0, 14.1),
          new THREE.Vector3(-2.1, 0, 14),
          new THREE.Vector3(-1.9, 0, 13.8),
        ]}
      />

      {/* Small stones / debris */}
      <RoadDebris />
    </group>
  );
}