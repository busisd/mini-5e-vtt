export enum Stat {
  STR = "Strength",
  DEX = "Dexterity",
  CON = "Constitution",
  INT = "Intelligence",
  WIS = "Wisdom",
  CHA = "Charisma",
}

export type StatArray = {
  [key in Stat]: number;
};
