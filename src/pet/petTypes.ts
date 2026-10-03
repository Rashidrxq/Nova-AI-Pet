export type PetState =
  | "idle"
  | "walking"
  | "running"
  | "playing"
  | "eating"
  | "sleeping"
  | "following";

export interface PetStats {
  hunger: number;
  energy: number;
  happiness: number;
  affection: number;
}

export interface PetData {
  name: string;
  state: PetState;
  stats: PetStats;
}