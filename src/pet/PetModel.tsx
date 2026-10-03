import { useMemo } from "react";
import * as THREE from "three";

/*
 * NOVA — procedural dog
 *
 * Designed for the existing low-poly residential world.
 * The important difference from the previous version:
 *
 * - body surfaces are irregular rather than perfect spheres
 * - head has a proper muzzle / cheek / brow silhouette
 * - legs have upper/lower anatomy
 * - paws are flattened and grounded
 * - ears are elongated and floppy
 * - tail is curved instead of a straight capsule
 * - fur clumps break up the silhouette
 */

function FurMesh({
  geometry,
  material,
  position,
  scale,
  rotation,
  castShadow = true,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
}) {
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow={castShadow}
    />
  );
}

export function PetModel() {
  /* =========================================================
     MATERIALS
  ========================================================= */

  const fur = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#a9683d",
        roughness: 0.94,
        metalness: 0,
      }),
    []
  );

  const furLight = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d99a67",
        roughness: 0.96,
        metalness: 0,
      }),
    []
  );

  const furCream = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e5b27f",
        roughness: 0.97,
        metalness: 0,
      }),
    []
  );

  const furDark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#633b28",
        roughness: 0.98,
        metalness: 0,
      }),
    []
  );

  const nose = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#15100d",
        roughness: 0.25,
        metalness: 0,
        clearcoat: 0.65,
        clearcoatRoughness: 0.18,
      }),
    []
  );

  const eye = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#24140d",
        roughness: 0.12,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
    []
  );

  const eyeWhite = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f4eee5",
        roughness: 0.7,
      }),
    []
  );

  const collar = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#245a87",
        roughness: 0.5,
        metalness: 0.05,
      }),
    []
  );

  const gold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c69a32",
        roughness: 0.28,
        metalness: 0.75,
      }),
    []
  );

  const tongue = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c96f76",
        roughness: 0.9,
      }),
    []
  );

  /* =========================================================
     GEOMETRIES
  ========================================================= */

  const bodyGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 32, 20);
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      const variation =
        Math.sin(x * 7.0 + z * 3.0) * 0.018 +
        Math.sin(y * 11.0 + x * 4.0) * 0.012;

      position.setXYZ(
        i,
        x * (1 + variation),
        y * (1 + variation),
        z * (1 + variation)
      );
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  const headGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 32, 24);
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      const forward = Math.max(z, 0);

      position.setXYZ(
        i,
        x * (1 + forward * 0.035),
        y * (1 + forward * 0.02),
        z
      );
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  const muzzleGeometry = useMemo(
    () => new THREE.SphereGeometry(1, 24, 16),
    []
  );

  const legGeometry = useMemo(
    () => new THREE.CapsuleGeometry(0.5, 0.75, 8, 16),
    []
  );

  const pawGeometry = useMemo(
    () => new THREE.SphereGeometry(1, 20, 12),
    []
  );

  const earGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 20, 16);
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      /*
       * Pull the lower portion down.
       * This produces a floppy ear silhouette rather
       * than a simple oval.
       */
      const drop = (1 - y) * 0.15;

      position.setXYZ(
        i,
        x,
        y - drop,
        z
      );
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  /* =========================================================
     FUR CLUMP GEOMETRY
  ========================================================= */

  const furClumpGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(
      0.075,
      0.34,
      5,
      2
    );

    return geometry;
  }, []);

  /* =========================================================
     FUR CLUMPS
  ========================================================= */

  const furClumps = useMemo(() => {
    const items: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: [number, number, number];
    }[] = [];

    /*
     * Body fur.
     *
     * Not hundreds of objects.
     * A controlled number of clumps breaks the
     * perfect CG silhouette.
     */

    const points = [
      [-1.12, 0.72, 0.0],
      [-1.0, 0.95, -0.2],
      [-0.92, 0.55, 0.3],
      [-0.75, 1.02, -0.38],

      [1.12, 0.72, 0.0],
      [1.0, 0.95, -0.2],
      [0.92, 0.55, 0.3],
      [0.75, 1.02, -0.38],

      [-0.6, 1.16, 0.35],
      [-0.3, 1.24, 0.4],
      [0.3, 1.24, 0.4],
      [0.6, 1.16, 0.35],

      [-0.7, 0.4, 0.48],
      [-0.35, 0.3, 0.55],
      [0.35, 0.3, 0.55],
      [0.7, 0.4, 0.48],
    ];

    points.forEach((p, index) => {
      items.push({
        position: p as [number, number, number],
        rotation: [
          index % 2 === 0 ? 0.5 : -0.35,
          index * 0.4,
          index % 3 === 0 ? 0.35 : -0.2,
        ],
        scale: [
          0.8 + (index % 3) * 0.1,
          0.8 + (index % 2) * 0.18,
          0.8,
        ],
      });
    });

    return items;
  }, []);

  /* =========================================================
     BODY
  ========================================================= */

  return (
    <group
      position={[0, 0, 0]}
      scale={1}
    >

      {/* =====================================================
          MAIN BODY
      ===================================================== */}

      <FurMesh
        geometry={bodyGeometry}
        material={fur}
        position={[0, 0.82, -0.08]}
        scale={[1.42, 0.78, 0.78]}
      />

      {/* Shoulder volume */}

      <FurMesh
        geometry={bodyGeometry}
        material={furLight}
        position={[0, 0.86, 0.42]}
        scale={[0.82, 0.72, 0.52]}
      />

      {/* Chest */}

      <FurMesh
        geometry={bodyGeometry}
        material={furCream}
        position={[0, 0.76, 0.58]}
        scale={[0.62, 0.66, 0.38]}
      />

      {/* Belly */}

      <FurMesh
        geometry={bodyGeometry}
        material={furLight}
        position={[0, 0.48, 0.18]}
        scale={[0.94, 0.42, 0.48]}
      />

      {/* =====================================================
          NECK
      ===================================================== */}

      <FurMesh
        geometry={bodyGeometry}
        material={fur}
        position={[0, 1.22, 0.42]}
        scale={[0.55, 0.72, 0.5]}
      />

      {/* =====================================================
          HEAD
      ===================================================== */}

      <FurMesh
        geometry={headGeometry}
        material={furLight}
        position={[0, 1.82, 0.52]}
        scale={[0.78, 0.76, 0.72]}
      />

      {/* Brow */}

      <FurMesh
        geometry={bodyGeometry}
        material={fur}
        position={[0, 2.05, 0.56]}
        scale={[0.64, 0.42, 0.58]}
      />

      {/* =====================================================
          CHEEKS
      ===================================================== */}

      <FurMesh
        geometry={muzzleGeometry}
        material={furCream}
        position={[-0.27, 1.67, 0.96]}
        scale={[0.38, 0.31, 0.4]}
      />

      <FurMesh
        geometry={muzzleGeometry}
        material={furCream}
        position={[0.27, 1.67, 0.96]}
        scale={[0.38, 0.31, 0.4]}
      />

      {/* =====================================================
          MUZZLE
      ===================================================== */}

      <FurMesh
        geometry={muzzleGeometry}
        material={furDark}
        position={[0, 1.68, 1.06]}
        scale={[0.48, 0.31, 0.38]}
      />

      {/* =====================================================
          NOSE
      ===================================================== */}

      <mesh
        position={[0, 1.75, 1.38]}
        scale={[0.19, 0.13, 0.15]}
        material={nose}
        castShadow
      >
        <sphereGeometry args={[1, 20, 14]} />
      </mesh>

      {/* Nose lower bridge */}

      <mesh
        position={[0, 1.67, 1.31]}
        scale={[0.13, 0.08, 0.11]}
        material={nose}
      >
        <sphereGeometry args={[1, 16, 10]} />
      </mesh>

      {/* =====================================================
          EYES
      ===================================================== */}

      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 0.285, 1.94, 1.03]}
        >

          {/* Eye socket */}

          <mesh
            scale={[0.145, 0.13, 0.08]}
            material={furDark}
          >
            <sphereGeometry args={[1, 16, 12]} />
          </mesh>

          {/* Eyeball */}

          <mesh
            position={[0, 0, 0.055]}
            scale={[0.09, 0.09, 0.07]}
            material={eye}
            castShadow
          >
            <sphereGeometry args={[1, 24, 18]} />
          </mesh>

          {/* Catchlight */}

          <mesh
            position={[
              side * -0.025,
              0.025,
              0.115,
            ]}
            material={eyeWhite}
          >
            <sphereGeometry args={[0.025, 10, 8]} />
          </mesh>
        </group>
      ))}

      {/* =====================================================
          FLOPPY EARS
      ===================================================== */}

      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 0.68, 1.95, 0.55]}
          rotation={[
            0.1,
            side * 0.08,
            side * -0.25,
          ]}
        >

          <FurMesh
            geometry={earGeometry}
            material={furDark}
            scale={[0.34, 0.76, 0.23]}
          />

          {/* Inner ear */}

          <mesh
            position={[0, -0.06, 0.18]}
            scale={[0.18, 0.48, 0.055]}
            material={furCream}
          >
            <sphereGeometry args={[1, 16, 12]} />
          </mesh>

        </group>
      ))}

      {/* =====================================================
          MOUTH
      ===================================================== */}

      <mesh
        position={[0, 1.55, 1.32]}
        rotation={[0.12, 0, 0]}
        scale={[0.27, 0.025, 0.05]}
        material={nose}
      >
        <sphereGeometry args={[1, 16, 8]} />
      </mesh>

      {/* Tongue */}

      <mesh
        position={[0, 1.47, 1.34]}
        rotation={[0.18, 0, 0]}
        scale={[0.13, 0.25, 0.07]}
        material={tongue}
        castShadow
      >
        <capsuleGeometry args={[0.5, 0.5, 8, 12]} />
      </mesh>

      {/* =====================================================
          FRONT LEGS
      ===================================================== */}

      {[-0.5, 0.5].map((side) => (
        <group
          key={side}
          position={[side, 0.42, 0.43]}
        >

          {/* upper leg */}

          <mesh
            position={[0, 0.28, 0]}
            scale={[0.28, 0.55, 0.28]}
            material={fur}
            castShadow
          >
            <capsuleGeometry args={[0.42, 0.5, 8, 14]} />
          </mesh>

          {/* lower leg */}

          <mesh
            position={[0, -0.1, 0.02]}
            scale={[0.21, 0.45, 0.21]}
            material={furLight}
            castShadow
          >
            <capsuleGeometry args={[0.34, 0.42, 8, 14]} />
          </mesh>

          {/* paw */}

          <mesh
            position={[0, -0.39, 0.08]}
            scale={[0.28, 0.13, 0.39]}
            material={furCream}
            castShadow
          >
            <sphereGeometry args={[1, 20, 12]} />
          </mesh>

          {/* toes */}

          {[-0.09, 0, 0.09].map((toe) => (
            <mesh
              key={toe}
              position={[toe, -0.43, 0.34]}
              scale={[0.055, 0.045, 0.09]}
              material={furDark}
            >
              <sphereGeometry args={[1, 8, 6]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* =====================================================
          REAR LEGS
      ===================================================== */}

      {[-0.65, 0.65].map((side) => (
        <group
          key={side}
          position={[side, 0.43, -0.38]}
        >

          {/* large thigh */}

          <mesh
            position={[0, 0.22, 0]}
            scale={[0.42, 0.55, 0.43]}
            material={fur}
            castShadow
          >
            <sphereGeometry args={[1, 20, 14]} />
          </mesh>

          {/* lower hock */}

          <mesh
            position={[0, -0.18, 0.02]}
            scale={[0.23, 0.46, 0.23]}
            material={furLight}
            castShadow
          >
            <capsuleGeometry args={[0.34, 0.45, 8, 14]} />
          </mesh>

          {/* rear paw */}

          <mesh
            position={[0, -0.45, 0.12]}
            scale={[0.29, 0.13, 0.38]}
            material={furCream}
            castShadow
          >
            <sphereGeometry args={[1, 20, 12]} />
          </mesh>

        </group>
      ))}

      {/* =====================================================
          TAIL
      ===================================================== */}

      <group position={[0, 1.0, -0.72]}>

        <mesh
          rotation={[0.65, 0, 0]}
          scale={[0.28, 0.95, 0.28]}
          material={fur}
          castShadow
        >
          <capsuleGeometry args={[0.42, 0.8, 8, 14]} />
        </mesh>

        <mesh
          position={[0, 0.68, -0.18]}
          rotation={[0.3, 0, 0]}
          scale={[0.34, 0.55, 0.34]}
          material={furLight}
          castShadow
        >
          <sphereGeometry args={[1, 18, 12]} />
        </mesh>

        {/* fluffy tail tip */}

        <mesh
          position={[0, 1.0, -0.28]}
          scale={[0.38, 0.4, 0.38]}
          material={furCream}
          castShadow
        >
          <sphereGeometry args={[1, 18, 12]} />
        </mesh>

      </group>

      {/* =====================================================
          COLLAR
      ===================================================== */}

      <group position={[0, 1.34, 0.42]}>

        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          material={collar}
          castShadow
        >
          <torusGeometry
            args={[0.48, 0.065, 12, 32]}
          />
        </mesh>

        {/* collar buckle */}

        <mesh
          position={[0, -0.05, 0.47]}
          scale={[0.09, 0.11, 0.04]}
          material={gold}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>

        {/* NOVA tag */}

        <mesh
          position={[0, -0.19, 0.5]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.12, 0.12, 0.035]}
          material={gold}
          castShadow
        >
          <cylinderGeometry args={[1, 1, 1, 24]} />
        </mesh>

      </group>

      {/* =====================================================
          FUR SILHOUETTE CLUMPS
      ===================================================== */}

      {furClumps.map((item, index) => (
        <FurMesh
          key={index}
          geometry={furClumpGeometry}
          material={index % 3 === 0 ? furCream : furLight}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
          castShadow={false}
        />
      ))}

      {/* =====================================================
          NECK / CHEST FUR
      ===================================================== */}

      {Array.from({ length: 7 }).map((_, i) => {
        const x = (i - 3) * 0.13;

        return (
          <mesh
            key={i}
            position={[x, 1.25 - Math.abs(x) * 0.25, 0.78]}
            rotation={[
              -0.35,
              0,
              x * 0.4,
            ]}
            scale={[0.1, 0.28, 0.1]}
            material={furCream}
            castShadow={false}
          >
            <coneGeometry args={[0.7, 1.5, 6]} />
          </mesh>
        );
      })}

    </group>
  );
}