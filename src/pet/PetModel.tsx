import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function PetModel() {
  const frontLeft = useRef<THREE.Group>(null);
  const frontRight = useRef<THREE.Group>(null);
  const backLeft = useRef<THREE.Group>(null);
  const backRight = useRef<THREE.Group>(null);

  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  const fur = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b87543",
        roughness: 0.9,
      }),
    []
  );

  const lightFur = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e2a473",
        roughness: 0.88,
      }),
    []
  );

  const darkFur = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4a2d1d",
        roughness: 0.95,
      }),
    []
  );

  const nose = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#120e0c",
        roughness: 0.35,
      }),
    []
  );

  const eye = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#050403",
        roughness: 0.1,
        metalness: 0.4,
      }),
    []
  );

  const collar = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#28527a",
        roughness: 0.4,
      }),
    []
  );

  const gold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d4af37",
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    /*
     * Walking rhythm
     *
     * Front-left + back-right
     * move together.
     *
     * Front-right + back-left
     * move opposite.
     */

    const gait = Math.sin(t * 7) * 0.38;
    const opposite = -gait;

    if (frontLeft.current) {
      frontLeft.current.rotation.x = gait;
    }

    if (backRight.current) {
      backRight.current.rotation.x = gait;
    }

    if (frontRight.current) {
      frontRight.current.rotation.x = opposite;
    }

    if (backLeft.current) {
      backLeft.current.rotation.x = opposite;
    }

    /* Body bounce */

    if (bodyRef.current) {
      bodyRef.current.position.y =
        Math.abs(Math.sin(t * 7)) * 0.035;
    }

    /* Head movement */

    if (headRef.current) {
      headRef.current.rotation.z =
        Math.sin(t * 3.5) * 0.025;

      headRef.current.rotation.x =
        Math.sin(t * 3.5) * 0.018;
    }

    /* Tail wag */

    if (tailRef.current) {
      tailRef.current.rotation.y =
        Math.sin(t * 9) * 0.28;
    }
  });

  return (
    <group>

      {/* =====================================
          ANIMATED BODY
      ===================================== */}

      <group ref={bodyRef}>

        {/* BODY */}

        <mesh
          position={[0, 0.62, -0.05]}
          scale={[1.25, 0.65, 0.72]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1, 32, 24]} />
          <primitive object={fur} attach="material" />
        </mesh>

        {/* BACK */}

        <mesh
          position={[0, 0.78, -0.15]}
          scale={[0.95, 0.42, 0.55]}
          castShadow
        >
          <sphereGeometry args={[1, 24, 16]} />
          <primitive object={fur} attach="material" />
        </mesh>

        {/* BELLY */}

        <mesh
          position={[0, 0.48, 0.35]}
          scale={[0.92, 0.45, 0.44]}
          castShadow
        >
          <sphereGeometry args={[1, 24, 18]} />
          <primitive object={lightFur} attach="material" />
        </mesh>

        {/* CHEST */}

        <mesh
          position={[0, 0.68, 0.48]}
          scale={[0.75, 0.75, 0.4]}
          castShadow
        >
          <sphereGeometry args={[1, 24, 18]} />
          <primitive object={lightFur} attach="material" />
        </mesh>

      </group>

      {/* =====================================
          NECK
      ===================================== */}

      <mesh
        position={[0, 0.88, 0.32]}
        rotation={[Math.PI / 3.2, 0, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.38, 0.52, 0.55, 24]}
        />
        <primitive object={fur} attach="material" />
      </mesh>

      {/* =====================================
          COLLAR
      ===================================== */}

      <group position={[0, 1.02, 0.36]}>
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <torusGeometry
            args={[0.45, 0.055, 12, 32]}
          />
          <primitive
            object={collar}
            attach="material"
          />
        </mesh>

        <mesh
          position={[0, -0.12, 0.46]}
          scale={[0.1, 0.1, 0.04]}
        >
          <cylinderGeometry
            args={[1, 1, 1, 16]}
          />
          <primitive
            object={gold}
            attach="material"
          />
        </mesh>
      </group>

      {/* =====================================
          HEAD
      ===================================== */}

      <group
        ref={headRef}
        position={[0, 1.25, 0.45]}
      >

        {/* HEAD */}

        <mesh
          scale={[0.78, 0.75, 0.75]}
          castShadow
        >
          <sphereGeometry
            args={[1, 32, 24]}
          />
          <primitive object={fur} attach="material" />
        </mesh>

        {/* CHEEKS */}

        <mesh
          position={[0, -0.08, 0.42]}
          scale={[0.52, 0.38, 0.4]}
          castShadow
        >
          <sphereGeometry
            args={[1, 24, 18]}
          />
          <primitive
            object={lightFur}
            attach="material"
          />
        </mesh>

        {/* MUZZLE */}

        <mesh
          position={[0, -0.05, 0.62]}
          scale={[0.32, 0.22, 0.28]}
          castShadow
        >
          <sphereGeometry
            args={[1, 24, 18]}
          />
          <primitive
            object={darkFur}
            attach="material"
          />
        </mesh>

        {/* NOSE */}

        <mesh
          position={[0, 0, 0.84]}
          scale={[0.15, 0.1, 0.1]}
          castShadow
        >
          <sphereGeometry
            args={[1, 16, 12]}
          />
          <primitive
            object={nose}
            attach="material"
          />
        </mesh>

        {/* EYES */}

        {[-0.27, 0.27].map((x) => (
          <mesh
            key={x}
            position={[x, 0.15, 0.52]}
            castShadow
          >
            <sphereGeometry
              args={[0.082, 24, 20]}
            />
            <primitive
              object={eye}
              attach="material"
            />
          </mesh>
        ))}

        {/* EARS */}

        {[-1, 1].map((dir) => (
          <mesh
            key={dir}
            position={[
              dir * 0.55,
              0.35,
              0.24,
            ]}
            rotation={[
              0.15,
              0,
              dir * -0.35,
            ]}
            scale={[
              0.22,
              0.48,
              0.16,
            ]}
            castShadow
          >
            <sphereGeometry
              args={[1, 20, 16]}
            />
            <primitive
              object={darkFur}
              attach="material"
            />
          </mesh>
        ))}

      </group>

      {/* =====================================
          FRONT LEFT LEG
      ===================================== */}

      <group
        ref={frontLeft}
        position={[-0.48, 0.28, 0.32]}
      >
        <mesh
          scale={[0.22, 0.52, 0.22]}
          castShadow
        >
          <capsuleGeometry
            args={[0.5, 0.4, 12, 18]}
          />
          <primitive
            object={fur}
            attach="material"
          />
        </mesh>
      </group>

      {/* FRONT RIGHT */}

      <group
        ref={frontRight}
        position={[0.48, 0.28, 0.32]}
      >
        <mesh
          scale={[0.22, 0.52, 0.22]}
          castShadow
        >
          <capsuleGeometry
            args={[0.5, 0.4, 12, 18]}
          />
          <primitive
            object={fur}
            attach="material"
          />
        </mesh>
      </group>

      {/* BACK LEFT */}

      <group
        ref={backLeft}
        position={[-0.58, 0.32, -0.32]}
      >
        <mesh
          scale={[0.28, 0.5, 0.3]}
          castShadow
        >
          <capsuleGeometry
            args={[0.55, 0.4, 12, 18]}
          />
          <primitive
            object={fur}
            attach="material"
          />
        </mesh>
      </group>

      {/* BACK RIGHT */}

      <group
        ref={backRight}
        position={[0.58, 0.32, -0.32]}
      >
        <mesh
          scale={[0.28, 0.5, 0.3]}
          castShadow
        >
          <capsuleGeometry
            args={[0.55, 0.4, 12, 18]}
          />
          <primitive
            object={fur}
            attach="material"
          />
        </mesh>
      </group>

      {/* =====================================
          PAWS
      ===================================== */}

      {[
        [-0.48, 0.06, 0.38],
        [0.48, 0.06, 0.38],
        [-0.58, 0.08, -0.38],
        [0.58, 0.08, -0.38],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={
            pos as [number, number, number]
          }
          scale={[0.24, 0.12, 0.32]}
          castShadow
        >
          <sphereGeometry
            args={[1, 20, 14]}
          />
          <primitive
            object={darkFur}
            attach="material"
          />
        </mesh>
      ))}

      {/* =====================================
          ANIMATED TAIL
      ===================================== */}

      <group
        ref={tailRef}
        position={[0, 0.78, -0.62]}
      >
        <mesh
          rotation={[
            Math.PI / 2.6,
            0,
            0,
          ]}
          scale={[0.18, 0.65, 0.18]}
          castShadow
        >
          <capsuleGeometry
            args={[0.45, 0.5, 10, 16]}
          />
          <primitive
            object={fur}
            attach="material"
          />
        </mesh>

        <mesh
          position={[0, 0.42, -0.12]}
          scale={[0.22, 0.22, 0.22]}
          castShadow
        >
          <sphereGeometry
            args={[1, 16, 14]}
          />
          <primitive
            object={lightFur}
            attach="material"
          />
        </mesh>
      </group>

    </group>
  );
}