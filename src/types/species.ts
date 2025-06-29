import { ASI, Language, Movement, MovementType, Size } from "./misc";
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

type MiscSpeciesBonus = { id: string; amount?: number };

export type SpeciesBonuses = {
  asis: ASI[];
  movement: Movement[];
  size: Size.MEDIUM;
  miscBonuses: MiscSpeciesBonus[];
  languages: Language[];
};

const DwarfBonuses: SpeciesBonuses = {
  asis: [
    { stat: Stat.CON, amount: 2 },
    { stat: Stat.WIS, amount: 1 },
  ],
  movement: [{ mode: MovementType.WALK, amount: 25 }],
  size: Size.MEDIUM,
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

const ElfBonuses: SpeciesBonuses = {
  asis: [
    { stat: Stat.DEX, amount: 2 },
    { stat: Stat.INT, amount: 1 },
  ],
  movement: [{ mode: MovementType.WALK, amount: 30 }],
  size: Size.MEDIUM,
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

export const BonusesBySpecies: { [key in Species]: SpeciesBonuses } = {
  [Species.ELF]: ElfBonuses,
  [Species.DWARF]: DwarfBonuses,
};
