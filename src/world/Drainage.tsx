import { useMemo } from "react";
import * as THREE from "three";

/* =====================================================
   SHARED MATERIALS
===================================================== */

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: "#8c8981",
  roughness: 0.92,
});

const concreteDarkMaterial = new THREE.MeshStandardMaterial({
  color: "#62615c",
  roughness: 1,
});

const dirtMaterial = new THREE.MeshStandardMaterial({
  color: "#66513d",
  roughness: 1,
});

/* =====================================================
   DRAINAGE CHANNEL
===================================================== */

function DrainChannel({
  position,
  length,
}: {
  position: [number, number, number];
  length: number;
}) {
  return (
    <group position={position}>
      {/* Left concrete edge */}
      <mesh
        position={[-0.42, 0.12, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.12, 0.24, length]} />
        <primitive object={concreteMaterial} />
      </mesh>

      {/* Right concrete edge */}
      <mesh
        position={[0.42, 0.12, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.12, 0.24, length]} />
        <primitive object={concreteMaterial} />
      </mesh>

      {/* Drain floor */}
      <mesh
        position={[0, 0.025, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.75, 0.06, length]} />
        <primitive object={concreteDarkMaterial} />
      </mesh>

      {/* Slight dark interior */}
      <mesh
        position={[0, 0.075, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.55, 0.025, length]} />
        <primitive object={dirtMaterial} />
      </mesh>
    </group>
  );
}

/* =====================================================
   DRAIN COVER
===================================================== */

function DrainCover({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
    >
      {/* Concrete slab */}
      <mesh
        receiveShadow
        castShadow
      >
        <boxGeometry args={[1.0, 0.12, 1.25]} />

        <primitive object={concreteMaterial} />
      </mesh>

      {/* Small recessed center */}
      <mesh
        position={[0, 0.065, 0]}
      >
        <boxGeometry args={[0.72, 0.025, 0.85]} />

        <primitive object={concreteDarkMaterial} />
      </mesh>
    </group>
  );
}

/* =====================================================
   DIRT / EDGE PATCH
===================================================== */

function DirtPatch({
  position,
  scale,
  rotation = 0,
}: {
  position: [number, number, number];
  scale: [number, number];
  rotation?: number;
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(-0.5, -0.2);
    shape.quadraticCurveTo(
      -0.1,
      -0.55,
      0.35,
      -0.15
    );
    shape.quadraticCurveTo(
      0.6,
      0.15,
      0.2,
      0.45
    );
    shape.quadraticCurveTo(
      -0.3,
      0.55,
      -0.5,
      -0.2
    );

    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <mesh
      geometry={geometry}
      position={[
        position[0],
        0.025,
        position[2],
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        rotation,
      ]}
      scale={[
        scale[0],
        1,
        scale[1],
      ]}
      receiveShadow
    >
      <primitive object={dirtMaterial} />
    </mesh>
  );
}

/* =====================================================
   DRAINAGE
===================================================== */

export function Drainage() {
  /*
    Road:
    approximately z = 12

    Compound front:
    approximately z = 14

    Drain runs between them.
  */

  const drainLength = 40;

  return (
    <group>
      {/* =============================================
          MAIN DRAIN
      ============================================= */}

      <DrainChannel
        position={[0, 0, 9.65]}
        length={drainLength}
      />

      {/* =============================================
          PARTIAL COVER SLABS
      ============================================= */}

      <DrainCover
        position={[-17, 0.16, 9.65]}
        rotation={0}
      />

      <DrainCover
        position={[-13.5, 0.16, 9.65]}
        rotation={0}
      />

      <DrainCover
        position={[-9.5, 0.16, 9.65]}
        rotation={0}
      />

      <DrainCover
        position={[-4.5, 0.16, 9.65]}
        rotation={0}
      />

      <DrainCover
        position={[0, 0.16, 9.65]}
        rotation={0}
      />

      <DrainCover
        position={[5, 0.16, 9.65]}
        rotation={0}
      />

      <DrainCover
        position={[10, 0.16, 9.65]}
        rotation={0}
      />

      <DrainCover
        position={[14.5, 0.16, 9.65]}
        rotation={0}
      />

      <DrainCover
        position={[18, 0.16, 9.65]}
        rotation={0}
      />

      {/* =============================================
          NATURAL DIRT ACCUMULATION
      ============================================= */}

      <DirtPatch
        position={[-15.5, 0, 10.15]}
        scale={[1.4, 0.45]}
        rotation={0.2}
      />

      <DirtPatch
        position={[-7, 0, 10.05]}
        scale={[0.9, 0.35]}
        rotation={-0.4}
      />

      <DirtPatch
        position={[3.5, 0, 10.1]}
        scale={[1.2, 0.4]}
        rotation={0.5}
      />

      <DirtPatch
        position={[12.5, 0, 10.0]}
        scale={[0.8, 0.3]}
        rotation={-0.3}
      />

      {/* =============================================
          SMALL DRAIN CONNECTIONS
      ============================================= */}

      <mesh
        position={[-10, 0.08, 11.3]}
        receiveShadow
      >
        <boxGeometry args={[0.8, 0.12, 2.2]} />
        <primitive object={concreteMaterial} />
      </mesh>

      <mesh
        position={[10, 0.08, 11.3]}
        receiveShadow
      >
        <boxGeometry args={[0.8, 0.12, 2.2]} />
        <primitive object={concreteMaterial} />
      </mesh>
    </group>
  );
}