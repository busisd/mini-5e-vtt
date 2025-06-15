export enum MovementType {
  WALK = "Walk",
  CLIMB = "Climb",
  SWIM = "Swim",
  FLY = "Fly",
}

export type Movement = {
  type: MovementType;
  amount: number;
};
