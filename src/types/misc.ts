import { Stat } from "./stats";

export enum MovementType {
  WALK = "Walk",
  CLIMB = "Climb",
  SWIM = "Swim",
  FLY = "Fly",
}

export type Movement = {
  mode: MovementType;
  amount: number;
};

export enum Size {
  TINY = "Tiny",
  SMALL = "Small",
  MEDIUM = "Medium",
  LARGE = "Large",
  HUGE = "Huge",
  GARGANTUAN = "Gargantuan",
}

export type ASI = {
  stat: Stat;
  amount: number;
};

export type Language = string;
