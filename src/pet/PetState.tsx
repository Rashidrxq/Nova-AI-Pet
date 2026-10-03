import { createContext, useContext, useEffect, useState } from "react";

export type PetMood =
  | "happy"
  | "hungry"
  | "thirsty"
  | "tired"
  | "sad"
  | "excited"
  | "sleeping";

type PetStats = {
  hunger: number;
  thirst: number;
  happiness: number;
  energy: number;
  health: number;
};

type PetStateContext = {
  stats: PetStats;
  mood: PetMood;

  feed: () => void;
  giveWater: () => void;
  play: () => void;
  sleep: () => void;
  pet: () => void;
};

const PetStateContext =
  createContext<PetStateContext | null>(null);

export function PetStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stats, setStats] = useState<PetStats>({
    hunger: 80,
    thirst: 80,
    happiness: 75,
    energy: 85,
    health: 100,
  });

  /*
   * Natural stat decay.
   *
   * hunger / thirst decrease faster.
   * happiness slowly decreases.
   * energy decreases while awake.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((previous) => ({
        hunger: Math.max(
          0,
          previous.hunger - 0.4
        ),

        thirst: Math.max(
          0,
          previous.thirst - 0.6
        ),

        happiness: Math.max(
          0,
          previous.happiness - 0.15
        ),

        energy: Math.max(
          0,
          previous.energy - 0.2
        ),

        health:
          previous.hunger < 15 ||
          previous.thirst < 15
            ? Math.max(
                0,
                previous.health - 0.1
              )
            : Math.min(
                100,
                previous.health + 0.02
              ),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /*
   * Determine current mood from stats.
   */
  let mood: PetMood = "happy";

  if (stats.energy < 15) {
    mood = "tired";
  } else if (stats.thirst < 20) {
    mood = "thirsty";
  } else if (stats.hunger < 20) {
    mood = "hungry";
  } else if (stats.happiness < 25) {
    mood = "sad";
  } else if (stats.happiness > 85) {
    mood = "excited";
  }

  /*
   * Feed
   */
  const feed = () => {
    setStats((previous) => ({
      ...previous,

      hunger: Math.min(
        100,
        previous.hunger + 35
      ),

      happiness: Math.min(
        100,
        previous.happiness + 5
      ),
    }));
  };

  /*
   * Water
   */
  const giveWater = () => {
    setStats((previous) => ({
      ...previous,

      thirst: Math.min(
        100,
        previous.thirst + 40
      ),

      happiness: Math.min(
        100,
        previous.happiness + 3
      ),
    }));
  };

  /*
   * Play
   */
  const play = () => {
    setStats((previous) => ({
      ...previous,

      happiness: Math.min(
        100,
        previous.happiness + 20
      ),

      energy: Math.max(
        0,
        previous.energy - 12
      ),

      hunger: Math.max(
        0,
        previous.hunger - 4
      ),

      thirst: Math.max(
        0,
        previous.thirst - 6
      ),
    }));
  };

  /*
   * Sleep
   */
  const sleep = () => {
    setStats((previous) => ({
      ...previous,

      energy: Math.min(
        100,
        previous.energy + 35
      ),

      happiness: Math.min(
        100,
        previous.happiness + 5
      ),
    }));
  };

  /*
   * Pet the dog
   */
  const pet = () => {
    setStats((previous) => ({
      ...previous,

      happiness: Math.min(
        100,
        previous.happiness + 8
      ),
    }));
  };

  return (
    <PetStateContext.Provider
      value={{
        stats,
        mood,
        feed,
        giveWater,
        play,
        sleep,
        pet,
      }}
    >
      {children}
    </PetStateContext.Provider>
  );
}

export function usePetState() {
  const context =
    useContext(PetStateContext);

  if (!context) {
    throw new Error(
      "usePetState must be used inside PetStateProvider"
    );
  }

  return context;
}