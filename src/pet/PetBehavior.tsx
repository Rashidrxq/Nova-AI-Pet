import { useEffect } from "react";
import { usePetState } from "./PetState";

export function PetBehavior({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    state,
    setState,
  } = usePetState();

  useEffect(() => {
    if (state !== "idle") return;

    const timer = window.setTimeout(() => {
      const random = Math.random();

      if (random < 0.55) {
        setState("walking");
      } else if (random < 0.75) {
        setState("curious");
      } else if (random < 0.9) {
        setState("sleeping");
      } else {
        setState("happy");
      }
    }, 3000 + Math.random() * 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [state, setState]);

  useEffect(() => {
    if (state === "walking") {
      const timer = window.setTimeout(() => {
        setState("idle");
      }, 5000 + Math.random() * 4000);

      return () => {
        window.clearTimeout(timer);
      };
    }

    if (state === "curious") {
      const timer = window.setTimeout(() => {
        setState("idle");
      }, 2500);

      return () => {
        window.clearTimeout(timer);
      };
    }

    if (state === "happy") {
      const timer = window.setTimeout(() => {
        setState("idle");
      }, 2000);

      return () => {
        window.clearTimeout(timer);
      };
    }

    if (state === "sleeping") {
      const timer = window.setTimeout(() => {
        setState("idle");
      }, 8000);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [state, setState]);

  return <>{children}</>;
}