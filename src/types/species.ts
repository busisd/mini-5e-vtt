import { Stat } from "./stats";

export enum Species {
  DWARF = "Dwarf",
  ELF = "Elf",
  // HALFLING = "Halfling",
  // HUMAN = "Human",
  // DRAGONBORN = "Dragonborn",
  // GNOME = "Gnome",
  // HALF_ELF = "Half-Elf",
  // HALF_ORC = "Half-Orc",
  // TIEFLING = "Tiefling",
}

export enum Size {
  TINY = "Tiny",
  SMALL = "Small",
  MEDIUM = "Medium",
  LARGE = "Large",
  HUGE = "Huge",
  GARGANTUAN = "Gargantuan",
}

const DwarfBonuses = {
  asis: [
    { stat: Stat.CON, amount: 2 },
    { stat: Stat.WIS, amount: 1 },
  ],
  baseSpeed: 25,
  size: "Medium",
  miscBonuses: [
    { id: "Darkvision", amount: 60 },
    { id: "Dwarven Resilience" },
    { id: "Dwarven Combat Training" },
    { id: "Tool Proficiency (Dwarf)" },
    { id: "Stonecunning" },
    { id: "Dwarven Toughness" },
  ],
  languages: ["Common", "Dwarvish"],
};

const ElfBonuses = {
  asis: [
    { stat: Stat.DEX, amount: 2 },
    { stat: Stat.INT, amount: 1 },
  ],
  baseSpeed: 30,
  size: "Medium",
  miscBonuses: [
    { id: "Darkvision", amount: 60 },
    { id: "Keen Senses" },
    { id: "Fey Ancestry" },
    { id: "Trance" },
    { id: "Elf Weapon Training" },
    { id: "Cantrip" },
    { id: "Extra Language" },
  ],
  languages: ["Common", "Elvish"],
};

export const SpeciesBonuses = {
  [Species.ELF]: ElfBonuses,
  [Species.DWARF]: DwarfBonuses,
};
