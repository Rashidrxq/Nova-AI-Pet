import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PetState =
  | "idle"
  | "walking"
  | "curious"
  | "happy"
  | "sleeping";

interface PetStateContextValue {
  state: PetState;
  setState: (state: PetState) => void;

  isIdle: boolean;
  isWalking: boolean;
  isCurious: boolean;
  isHappy: boolean;
  isSleeping: boolean;
}

const PetStateContext =
  createContext<PetStateContextValue | null>(null);

export function PetStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] =
    useState<PetState>("idle");

  const value = useMemo(
    () => ({
      state,
      setState,

      isIdle: state === "idle",
      isWalking: state === "walking",
      isCurious: state === "curious",
      isHappy: state === "happy",
      isSleeping: state === "sleeping",
    }),
    [state]
  );

  return (
    <PetStateContext.Provider value={value}>
      {children}
    </PetStateContext.Provider>
  );
}

export function usePetState() {
  const context = useContext(PetStateContext);

  if (!context) {
    throw new Error(
      "usePetState must be used inside PetStateProvider"
    );
  }

  return context;
}