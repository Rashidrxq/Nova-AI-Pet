import { useMemo } from "react";
import * as THREE from "three";

/* =========================================================
   POWER LINE MATERIAL
========================================================= */

const wireMaterial = new THREE.MeshStandardMaterial({
  color: "#252525",
  roughness: 0.65,
  metalness: 0.15,
});

/* =========================================================
   SAGGING POWER LINE
========================================================= */

function PowerLine({
  start,
  end,
  sag = 0.8,
}: {
  start: [number, number, number];
  end: [number, number, number];
  sag?: number;
}) {
  const geometry = useMemo(() => {
    const startVector = new THREE.Vector3(...start);
    const endVector = new THREE.Vector3(...end);

    const distance = startVector.distanceTo(endVector);

    /*
      Create intermediate points.

      The middle points are lowered to create
      realistic cable sag.
    */

    const points: THREE.Vector3[] = [];

    const segments = 12;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      const point = new THREE.Vector3().lerpVectors(
        startVector,
        endVector,
        t
      );

      /*
        Parabolic sag.

        t = 0   → no sag
        t = 0.5 → maximum sag
        t = 1   → no sag
      */

      const sagAmount =
        Math.sin(Math.PI * t) * sag;

      point.y -= sagAmount;

      points.push(point);
    }

    const curve = new THREE.CatmullRomCurve3(
      points
    );

    return new THREE.TubeGeometry(
      curve,
      Math.max(12, Math.floor(distance * 2)),
      0.025,
      6,
      false
    );
  }, [start, end, sag]);

  return (
    <mesh
      geometry={geometry}
      material={wireMaterial}
      castShadow
    />
  );
}

/* =========================================================
   POWER LINES
========================================================= */

export function PowerLines() {
  /*
    Our utility poles are approximately:

    Pole 1 → [-12, 0, 10.5]
    Pole 2 → [  0, 0, 10.5]
    Pole 3 → [ 12, 0, 10.5]

    Their cross arms are around 8m high.
  */

  const poleHeight = 8.5;
  const wireY = poleHeight - 0.38;

  return (
    <group>
      {/* =================================================
          MAIN POWER LINE 1
      ================================================= */}

      <PowerLine
        start={[-12, wireY, 10.5]}
        end={[0, wireY + 0.5, 10.5]}
        sag={0.75}
      />

      <PowerLine
        start={[0, wireY + 0.5, 10.5]}
        end={[12, wireY + 0.2, 10.5]}
        sag={0.85}
      />

      {/* =================================================
          SECOND POWER LINE
      ================================================= */}

      <PowerLine
        start={[-12, wireY - 0.15, 10.5]}
        end={[0, wireY + 0.35, 10.5]}
        sag={0.7}
      />

      <PowerLine
        start={[0, wireY + 0.35, 10.5]}
        end={[12, wireY, 10.5]}
        sag={0.8}
      />

      {/* =================================================
          THIRD POWER LINE
      ================================================= */}

      <PowerLine
        start={[-12, wireY - 0.3, 10.5]}
        end={[0, wireY + 0.2, 10.5]}
        sag={0.65}
      />

      <PowerLine
        start={[0, wireY + 0.2, 10.5]}
        end={[12, wireY - 0.1, 10.5]}
        sag={0.75}
      />

      {/* =================================================
          LOWER COMMUNICATION CABLE
      ================================================= */}

      <PowerLine
        start={[-12, 7.1, 10.5]}
        end={[0, 7.4, 10.5]}
        sag={0.45}
      />

      <PowerLine
        start={[0, 7.4, 10.5]}
        end={[12, 7.2, 10.5]}
        sag={0.5}
      />
    </group>
  );
}