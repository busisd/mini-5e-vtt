import { CharacterClass } from "./characterClasses";
import { Movement } from "./movement";
import { Proficiency, SkillBonusArray, SkillProficiencyArray } from "./skills";
import { SaveProficiencyArray, StatArray } from "./stats";

export type CharacterClassLevelData = {
  characterClass: CharacterClass;
  characterSubclass?: string;
  level: number;
};

export type HitDice = {
  size: number;
  number: number;
};

export type MiscProficiency = {
  name: string;
  proficiency: Proficiency;
};

/**
 * Data displayed in a character sheet. Does not include temporary
 * information such as lost HP, expended resources, etc.
 */
export type CharacterSheetData = {
  name: string;
  alignment?: string;
  race: string;
  background: string;
  classLevels: CharacterClassLevelData[];
  armorClass: number;
  movement: Movement[];
  maxHp: number;
  hitDice: HitDice[];
  proficiencyBonus: number;
  stats: StatArray;
  statMods: StatArray;
  saveProficiencies: SaveProficiencyArray;
  saveBonuses: StatArray;
  skillProficiencies: SkillProficiencyArray;
  skillBonuses: SkillBonusArray;
  miscProficiencies: MiscProficiency[];
  features: string[];
  spells: unknown; // TODO
  attacks: unknown; // TODO
  equipment: unknown; // TODO
};
