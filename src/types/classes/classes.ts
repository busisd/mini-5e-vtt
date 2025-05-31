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
}
