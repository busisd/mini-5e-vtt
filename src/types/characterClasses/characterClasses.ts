export enum CharacterClass {
  CLERIC = "Cleric",
  FIGHTER = "Fighter",
  ROGUE = "Rogue",
  WIZARD = "Wizard",
}

export const ClassHitDie = {
  [CharacterClass.CLERIC]: 8,
  [CharacterClass.FIGHTER]: 10,
  [CharacterClass.ROGUE]: 8,
  [CharacterClass.WIZARD]: 6,
};

export enum MiscFeatureId {
  FIGHTING_STYLE = "Fighting style",
  SECOND_WIND = "Second wind",
  ACTION_SURGE = "Action Surge",
  EXTRA_ATTACK = "Extra Attack",
  INDOMITABLE = "Indomitable",
}

export type MiscFeature = {
  id: MiscFeatureId;
  tier?: number;
};
