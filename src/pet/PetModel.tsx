import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function PetModel() {
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  const frontLeftLeg = useRef<THREE.Group>(null);
  const frontRightLeg = useRef<THREE.Group>(null);
  const backLeftLeg = useRef<THREE.Group>(null);
  const backRightLeg = useRef<THREE.Group>(null);

  const leftEar = useRef<THREE.Group>(null);
  const rightEar = useRef<THREE.Group>(null);

  const fur = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b87543",
        roughness: 0.9,
        metalness: 0.02,
      }),
    []
  );

  const lightFur = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#dfa06d",
        roughness: 0.9,
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
        color: "#080605",
        roughness: 0.15,
      }),
    []
  );

  const eyeHighlight = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
      }),
    []
  );

  const collar = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#28527a",
        roughness: 0.4,
        metalness: 0.2,
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

  /*
   * ==========================================
   * ANIMATION
   * ==========================================
   */

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    /*
     * Body breathing
     */
    if (bodyRef.current) {
      bodyRef.current.position.y =
        Math.sin(t * 2.2) * 0.015;

      bodyRef.current.rotation.z =
        Math.sin(t * 1.3) * 0.008;
    }

    /*
     * Tail wag
     */
    if (tailRef.current) {
      tailRef.current.rotation.x =
        Math.sin(t * 5) * 0.22;
    }

    /*
     * Ears naturally move slightly
     */
    if (leftEar.current) {
      leftEar.current.rotation.z =
        -0.35 + Math.sin(t * 1.7) * 0.025;
    }

    if (rightEar.current) {
      rightEar.current.rotation.z =
        0.35 + Math.sin(t * 1.7) * 0.025;
    }

    /*
     * Subtle head movement
     */
    if (headRef.current) {
      headRef.current.rotation.y =
        Math.sin(t * 0.8) * 0.025;

      headRef.current.rotation.z =
        Math.sin(t * 1.1) * 0.015;
    }
  });

  /*
   * ==========================================
   * WALKING LEG ANIMATION
   * ==========================================
   *
   * The four legs are independent.
   */

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    const walk = Math.sin(t * 9) * 0.35;

    if (frontLeftLeg.current) {
      frontLeftLeg.current.rotation.x = walk;
    }

    if (frontRightLeg.current) {
      frontRightLeg.current.rotation.x = -walk;
    }

    if (backLeftLeg.current) {
      backLeftLeg.current.rotation.x = -walk;
    }

    if (backRightLeg.current) {
      backRightLeg.current.rotation.x = walk;
    }
  });

  return (
    <group>

      {/* ======================================
          BODY
      ====================================== */}

      <group ref={bodyRef}>

        <mesh
          position={[0, 0.68, -0.05]}
          scale={[1.25, 0.65, 0.72]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1, 32, 24]} />
          <primitive
            object={fur}
            attach="material"
          />
        </mesh>

        {/* Back */}

        <mesh
          position={[0, 0.83, -0.18]}
          scale={[0.95, 0.4, 0.55]}
          castShadow
        >
          <sphereGeometry args={[1, 24, 16]} />
          <primitive
            object={fur}
            attach="material"
          />
        </mesh>

        {/* Belly */}

        <mesh
          position={[0, 0.48, 0.38]}
          scale={[0.92, 0.43, 0.44]}
          castShadow
        >
          <sphereGeometry args={[1, 24, 18]} />
          <primitive
            object={lightFur}
            attach="material"
          />
        </mesh>

        {/* Chest */}

        <mesh
          position={[0, 0.72, 0.5]}
          scale={[0.72, 0.72, 0.4]}
          castShadow
        >
          <sphereGeometry args={[1, 24, 18]} />
          <primitive
            object={lightFur}
            attach="material"
          />
        </mesh>

        {/* ==================================
            FRONT LEFT LEG
        ================================== */}

        <group
          ref={frontLeftLeg}
          position={[-0.48, 0.42, 0.38]}
        >
          <mesh
            scale={[0.21, 0.48, 0.21]}
            castShadow
          >
            <capsuleGeometry
              args={[0.45, 0.5, 8, 12]}
            />
            <primitive
              object={fur}
              attach="material"
            />
          </mesh>

          <mesh
            position={[0, -0.48, 0.02]}
            scale={[0.25, 0.12, 0.3]}
            castShadow
          >
            <sphereGeometry args={[1, 16, 12]} />
            <primitive
              object={darkFur}
              attach="material"
            />
          </mesh>
        </group>

        {/* ==================================
            FRONT RIGHT LEG
        ================================== */}

        <group
          ref={frontRightLeg}
          position={[0.48, 0.42, 0.38]}
        >
          <mesh
            scale={[0.21, 0.48, 0.21]}
            castShadow
          >
            <capsuleGeometry
              args={[0.45, 0.5, 8, 12]}
            />
            <primitive
              object={fur}
              attach="material"
            />
          </mesh>

          <mesh
            position={[0, -0.48, 0.02]}
            scale={[0.25, 0.12, 0.3]}
            castShadow
          >
            <sphereGeometry args={[1, 16, 12]} />
            <primitive
              object={darkFur}
              attach="material"
            />
          </mesh>
        </group>

        {/* ==================================
            BACK LEFT LEG
        ================================== */}

        <group
          ref={backLeftLeg}
          position={[-0.62, 0.45, -0.35]}
        >
          <mesh
            scale={[0.28, 0.48, 0.3]}
            castShadow
          >
            <capsuleGeometry
              args={[0.5, 0.5, 8, 12]}
            />
            <primitive
              object={fur}
              attach="material"
            />
          </mesh>

          <mesh
            position={[0, -0.48, -0.02]}
            scale={[0.29, 0.13, 0.32]}
            castShadow
          >
            <sphereGeometry args={[1, 16, 12]} />
            <primitive
              object={darkFur}
              attach="material"
            />
          </mesh>
        </group>

        {/* ==================================
            BACK RIGHT LEG
        ================================== */}

        <group
          ref={backRightLeg}
          position={[0.62, 0.45, -0.35]}
        >
          <mesh
            scale={[0.28, 0.48, 0.3]}
            castShadow
          >
            <capsuleGeometry
              args={[0.5, 0.5, 8, 12]}
            />
            <primitive
              object={fur}
              attach="material"
            />
          </mesh>

          <mesh
            position={[0, -0.48, -0.02]}
            scale={[0.29, 0.13, 0.32]}
            castShadow
          >
            <sphereGeometry args={[1, 16, 12]} />
            <primitive
              object={darkFur}
              attach="material"
            />
          </mesh>
        </group>

        {/* ==================================
            NECK
        ================================== */}

        <mesh
          position={[0, 1.0, 0.34]}
          rotation={[Math.PI / 3.2, 0, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.38, 0.52, 0.55, 24]}
          />
          <primitive
            object={fur}
            attach="material"
          />
        </mesh>

        {/* ==================================
            COLLAR
        ================================== */}

        <group position={[0, 1.12, 0.4]}>
          <mesh
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry
              args={[0.46, 0.055, 12, 32]}
            />
            <primitive
              object={collar}
              attach="material"
            />
          </mesh>

          <mesh
            position={[0, -0.12, 0.47]}
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

        {/* ==================================
            HEAD
        ================================== */}

        <group
          ref={headRef}
          position={[0, 1.42, 0.45]}
        >

          {/* Skull */}

          <mesh
            scale={[0.78, 0.74, 0.74]}
            castShadow
          >
            <sphereGeometry
              args={[1, 32, 24]}
            />
            <primitive
              object={fur}
              attach="material"
            />
          </mesh>

          {/* Face */}

          <mesh
            position={[0, -0.08, 0.42]}
            scale={[0.5, 0.38, 0.4]}
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

          {/* Muzzle */}

          <mesh
            position={[0, -0.05, 0.64]}
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

          {/* Nose */}

          <mesh
            position={[0, 0, 0.87]}
            scale={[0.15, 0.1, 0.1]}
            castShadow
          >
            <sphereGeometry
              args={[1, 20, 14]}
            />
            <primitive
              object={nose}
              attach="material"
            />
          </mesh>

          {/* Eyes */}

          {[-0.27, 0.27].map((x) => (
            <group
              key={x}
              position={[x, 0.16, 0.52]}
            >
              <mesh>
                <sphereGeometry
                  args={[0.095, 20, 16]}
                />
                <primitive
                  object={eye}
                  attach="material"
                />
              </mesh>

              <mesh
                position={[
                  x < 0 ? -0.025 : 0.025,
                  0.025,
                  0.075,
                ]}
              >
                <sphereGeometry
                  args={[0.025, 10, 8]}
                />
                <primitive
                  object={eyeHighlight}
                  attach="material"
                />
              </mesh>
            </group>
          ))}

          {/* ==================================
              LEFT EAR
          ================================== */}

          <group
            ref={leftEar}
            position={[-0.56, 0.34, 0.22]}
            rotation={[0.15, 0, -0.35]}
          >
            <mesh
              scale={[0.24, 0.5, 0.17]}
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

            <mesh
              position={[0, -0.03, 0.08]}
              scale={[0.12, 0.3, 0.05]}
            >
              <sphereGeometry
                args={[1, 16, 12]}
              />
              <primitive
                object={lightFur}
                attach="material"
              />
            </mesh>
          </group>

          {/* ==================================
              RIGHT EAR
          ================================== */}

          <group
            ref={rightEar}
            position={[0.56, 0.34, 0.22]}
            rotation={[0.15, 0, 0.35]}
          >
            <mesh
              scale={[0.24, 0.5, 0.17]}
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

            <mesh
              position={[0, -0.03, 0.08]}
              scale={[0.12, 0.3, 0.05]}
            >
              <sphereGeometry
                args={[1, 16, 12]}
              />
              <primitive
                object={lightFur}
                attach="material"
              />
            </mesh>
          </group>

        </group>

        {/* ==================================
            TAIL
        ================================== */}

        <group
          ref={tailRef}
          position={[0, 0.88, -0.68]}
        >
          <mesh
            rotation={[Math.PI / 2.6, 0, 0]}
            scale={[0.18, 0.7, 0.18]}
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
            position={[0, 0.46, -0.12]}
            scale={[0.23, 0.23, 0.23]}
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
    </group>
  );
}