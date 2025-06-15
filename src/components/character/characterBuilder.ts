import { SaveProficiencyArray, Stat, StatArray } from "../../types/stats";
import {
  Proficiency,
  Skill,
  SkillBonusArray,
  SkillProficiencyArray,
  StatsBySkill,
} from "../../types/skills";
import {
  CharacterGeneratorFormData,
  LevelChoices,
} from "./CharacterGeneratorView";
import {
  CharacterClass,
  MiscFeature,
  MiscFeatureId,
} from "../../types/characterClasses";
import {
  CharacterClassLevelData,
  CharacterSheetData,
  HitDice,
} from "../../types/characterSheetData";
import { MovementType } from "../../types/movement";

// Proficiencies:
// Tools, weapons, instruments, armor, languages?
// Feats/abilities?
// Actions, bonus actions, reactions?
// Vision, movement?
// Misc features
// "Level 0" characters?

// Spells learned/forgotten

// Species bonuses
// Background bonuses
// Hit dice

export type CalculatedCharacterV1 = {
  name: string;
  totalLevel: number;
  maxHp: number;
  stats: StatArray;
  statMods: StatArray;
  proficiencyBonus: number;
  skillProficiencies: SkillProficiencyArray;
  skillBonuses: SkillBonusArray;
  saveProficiencies: SaveProficiencyArray;
  saveBonuses: StatArray;
  miscFeatures?: MiscFeature[];
};

const generateSkillBonusArray = (
  skillProficiencyArray: SkillProficiencyArray,
  statMods: StatArray,
  pb: number,
): SkillBonusArray => {
  return Object.fromEntries(
    Object.entries(skillProficiencyArray).map(([skill, proficiency]) => [
      skill as Skill,
      statMods[StatsBySkill[skill as Skill]] + proficiency * pb,
    ]),
  ) as SkillBonusArray;
};

const generateStatModsArray = (stats: StatArray): StatArray => {
  return Object.fromEntries(
    Object.entries(stats).map(([stat, statValue]) => [
      stat as Stat,
      statMod(statValue),
    ]),
  ) as StatArray;
};

const statMod = (statValue: number) => {
  return Math.floor((statValue - 10) / 2);
};

const generateSaveBonusArray = (
  statMods: StatArray,
  saveProficiencies: SaveProficiencyArray,
  proficiencyBonus: number,
): StatArray => {
  return Object.fromEntries(
    Object.values(Stat).map((stat) => [
      stat,
      statMods[stat] + (saveProficiencies[stat] ? proficiencyBonus : 0),
    ]),
  ) as StatArray;
};

type LearnedSkillProficiency = {
  skill: Skill;
  proficiency: Proficiency;
};

export type LevelBonus = LevelChoices & {
  skillProfs?: LearnedSkillProficiency[];
};

const addASIBonus = (stats: StatArray, asis: Stat[]): StatArray => {
  const newStats = { ...stats };
  for (const stat of asis) {
    newStats[stat] += 1;
  }
  return newStats;
};

const addSkillProficiencies = (
  skillProficiencies: SkillProficiencyArray,
  learnedSkillProficiencies: LearnedSkillProficiency[],
): SkillProficiencyArray => {
  const newSkillProficiencies = { ...skillProficiencies };
  for (const learnedSkillProficiency of learnedSkillProficiencies) {
    newSkillProficiencies[learnedSkillProficiency.skill] =
      learnedSkillProficiency.proficiency;
  }
  return newSkillProficiencies;
};

const generateCharacterAtLevel = (
  name: string,
  baseStats: StatArray,
  levelBonuses: LevelBonus[],
  targetLevel: number,
): CalculatedCharacterV1 => {
  const levelBonusesInRange = levelBonuses.slice(0, targetLevel);
  let targetLevelSkillProficiencies = baseSkillProficiencyArray;

  let targetLevelStats = baseStats;
  levelBonusesInRange.forEach((levelBonus) => {
    if (levelBonus.asis != null) {
      targetLevelStats = addASIBonus(targetLevelStats, levelBonus.asis);
    }
  });
  const targetLevelStatMods = generateStatModsArray(targetLevelStats);

  let targetLevelHp = 0;
  levelBonusesInRange.forEach((levelBonus) => {
    targetLevelHp += Math.max(levelBonus.hp + targetLevelStatMods[Stat.CON], 1);

    if (levelBonus.skillProfs != null) {
      targetLevelSkillProficiencies = addSkillProficiencies(
        targetLevelSkillProficiencies,
        levelBonus.skillProfs,
      );
    }
  });

  const proficiencyBonus = Math.floor((targetLevel - 1) / 4) + 2;
  return {
    name,
    totalLevel: targetLevel,
    maxHp: targetLevelHp,
    stats: targetLevelStats,
    statMods: targetLevelStatMods,
    proficiencyBonus,
    skillProficiencies: targetLevelSkillProficiencies,
    skillBonuses: generateSkillBonusArray(
      targetLevelSkillProficiencies,
      targetLevelStatMods,
      proficiencyBonus,
    ),
    saveProficiencies: baseSaveProficiencyArray,
    saveBonuses: generateSaveBonusArray(
      targetLevelStatMods,
      baseSaveProficiencyArray,
      proficiencyBonus,
    ),
  };
};

export const generateCharacterAtEachLevel = (
  name: string,
  baseStats: StatArray,
  levelBonuses: LevelBonus[],
): CalculatedCharacterV1[] => {
  const characterByLevel = [];
  for (let level = 1; level <= levelBonuses.length; level++) {
    characterByLevel.push(
      generateCharacterAtLevel(name, baseStats, levelBonuses, level),
    );
  }
  return characterByLevel;
};

const generateCharacterSheetDataAtLevel = (
  formData: CharacterGeneratorFormData,
  targetLevel: number,
): CharacterSheetData => {
  const levelBonusesInRange = formData.levelChoices.slice(0, targetLevel);
  // let targetLevelSkillProficiencies = baseSkillProficiencyArray;

  let targetLevelStats = formData.baseStats;
  levelBonusesInRange.forEach((levelBonus) => {
    if (levelBonus.asis != null) {
      targetLevelStats = addASIBonus(targetLevelStats, levelBonus.asis);
    }
  });
  const targetLevelStatMods = generateStatModsArray(targetLevelStats);

  let targetLevelHp = 0;
  levelBonusesInRange.forEach((levelBonus) => {
    targetLevelHp += Math.max(levelBonus.hp + targetLevelStatMods[Stat.CON], 1);

    // if (levelBonus.skillProfs != null) {
    //   targetLevelSkillProficiencies = addSkillProficiencies(
    //     targetLevelSkillProficiencies,
    //     levelBonus.skillProfs,
    //   );
    // }
  });

  const classLevelsMap: { [key in CharacterClass]?: number } = {};
  const classLevels: CharacterClassLevelData[] = [];
  levelBonusesInRange.forEach((levelBonus) => {
    if (classLevelsMap[levelBonus.characterClass] == null) {
      classLevelsMap[levelBonus.characterClass] = classLevels.length;
      classLevels.push({ characterClass: levelBonus.characterClass, level: 0 });
    }
    classLevels[classLevelsMap[levelBonus.characterClass] as number].level += 1;
  });

  const hitDice: HitDice[] = [];

  const proficiencyBonus = Math.floor((targetLevel - 1) / 4) + 2;
  return {
    name: formData.characterName ?? "Placeholder name",
    maxHp: targetLevelHp,
    stats: targetLevelStats,
    statMods: targetLevelStatMods,
    proficiencyBonus,
    skillProficiencies: baseSkillProficiencyArray,
    skillBonuses: generateSkillBonusArray(
      baseSkillProficiencyArray,
      targetLevelStatMods,
      proficiencyBonus,
    ),
    saveProficiencies: baseSaveProficiencyArray,
    saveBonuses: generateSaveBonusArray(
      targetLevelStatMods,
      baseSaveProficiencyArray,
      proficiencyBonus,
    ),
    race: "Human",
    background: "Soldier",
    classLevels,
    armorClass: 10,
    movement: [{ type: MovementType.WALK, amount: 30 }],
    hitDice,
    miscProficiencies: [],
    features: [],
    spells: undefined,
    attacks: undefined,
    equipment: undefined,
  };
};

export const generateCharacterSheetDataAtEachLevel = (
  formData: CharacterGeneratorFormData,
): CharacterSheetData[] => {
  const characterByLevel = [];
  for (let level = 1; level <= formData.levelChoices.length; level++) {
    characterByLevel.push(generateCharacterSheetDataAtLevel(formData, level));
  }
  return characterByLevel;
};

const exampleBaseStatArray: StatArray = {
  [Stat.STR]: 10,
  [Stat.DEX]: 14,
  [Stat.CON]: 18,
  [Stat.INT]: 10,
  [Stat.WIS]: 10,
  [Stat.CHA]: 10,
};

const baseSkillProficiencyArray: SkillProficiencyArray = {
  [Skill.ATHLETICS]: Proficiency.NOT_PROFICIENT,
  [Skill.ACROBATICS]: Proficiency.NOT_PROFICIENT,
  [Skill.SLEIGHT_OF_HAND]: Proficiency.NOT_PROFICIENT,
  [Skill.STEALTH]: Proficiency.NOT_PROFICIENT,
  [Skill.ARCANA]: Proficiency.NOT_PROFICIENT,
  [Skill.HISTORY]: Proficiency.NOT_PROFICIENT,
  [Skill.INVESTIGATION]: Proficiency.NOT_PROFICIENT,
  [Skill.NATURE]: Proficiency.NOT_PROFICIENT,
  [Skill.RELIGION]: Proficiency.NOT_PROFICIENT,
  [Skill.ANIMAL_HANDLING]: Proficiency.NOT_PROFICIENT,
  [Skill.INSIGHT]: Proficiency.NOT_PROFICIENT,
  [Skill.MEDICINE]: Proficiency.NOT_PROFICIENT,
  [Skill.PERCEPTION]: Proficiency.NOT_PROFICIENT,
  [Skill.SURVIVAL]: Proficiency.NOT_PROFICIENT,
  [Skill.DECEPTION]: Proficiency.NOT_PROFICIENT,
  [Skill.INTIMIDATION]: Proficiency.NOT_PROFICIENT,
  [Skill.PERFORMANCE]: Proficiency.NOT_PROFICIENT,
  [Skill.PERSUASION]: Proficiency.NOT_PROFICIENT,
};

const baseSaveProficiencyArray: SaveProficiencyArray = {
  [Stat.STR]: false,
  [Stat.DEX]: false,
  [Stat.CON]: false,
  [Stat.INT]: false,
  [Stat.WIS]: false,
  [Stat.CHA]: false,
};

// Barbarian
const exampleLevelBonuses: LevelBonus[] = [
  {
    characterClass: CharacterClass.FIGHTER,
    hp: 12,
    skillProfs: [
      { skill: Skill.ATHLETICS, proficiency: Proficiency.EXPERTISE },
      { skill: Skill.INTIMIDATION, proficiency: Proficiency.PROFICIENT },
    ],
  },
  { characterClass: CharacterClass.FIGHTER, hp: 7 },
  { characterClass: CharacterClass.FIGHTER, hp: 7 },
  {
    characterClass: CharacterClass.FIGHTER,
    hp: 7,
    asis: [Stat.STR, Stat.CON],
  },
];

export const exampleCalculatedCharacter = generateCharacterAtEachLevel(
  "Placeholder name",
  exampleBaseStatArray,
  exampleLevelBonuses,
);

const basicFighterBaseStatArray: StatArray = {
  [Stat.STR]: 10,
  [Stat.DEX]: 10,
  [Stat.CON]: 10,
  [Stat.INT]: 10,
  [Stat.WIS]: 10,
  [Stat.CHA]: 10,
};

export const basicFighter = generateCharacterAtEachLevel(
  "Placeholder name",
  basicFighterBaseStatArray,
  [{ hp: 10, characterClass: CharacterClass.FIGHTER }],
);

export const placeholderCharacterSheetData: CharacterSheetData = {
  name: "John Placeholder",
  alignment: "Neutral good",
  race: "Human",
  background: "Soldier",
  classLevels: [],
  armorClass: 10,
  movement: [{ type: MovementType.WALK, amount: 30 }],
  maxHp: 0,
  hitDice: [],
  proficiencyBonus: 0,
  stats: {
    [Stat.STR]: 10,
    [Stat.DEX]: 10,
    [Stat.CON]: 10,
    [Stat.INT]: 10,
    [Stat.WIS]: 10,
    [Stat.CHA]: 10,
  },
  statMods: {
    [Stat.STR]: 0,
    [Stat.DEX]: 0,
    [Stat.CON]: 0,
    [Stat.INT]: 0,
    [Stat.WIS]: 0,
    [Stat.CHA]: 0,
  },
  saveProficiencies: {
    [Stat.STR]: false,
    [Stat.DEX]: false,
    [Stat.CON]: false,
    [Stat.INT]: false,
    [Stat.WIS]: false,
    [Stat.CHA]: false,
  },
  saveBonuses: {
    [Stat.STR]: 0,
    [Stat.DEX]: 0,
    [Stat.CON]: 0,
    [Stat.INT]: 0,
    [Stat.WIS]: 0,
    [Stat.CHA]: 0,
  },
  skillProficiencies: {
    [Skill.ATHLETICS]: Proficiency.NOT_PROFICIENT,
    [Skill.ACROBATICS]: Proficiency.NOT_PROFICIENT,
    [Skill.SLEIGHT_OF_HAND]: Proficiency.NOT_PROFICIENT,
    [Skill.STEALTH]: Proficiency.NOT_PROFICIENT,
    [Skill.ARCANA]: Proficiency.NOT_PROFICIENT,
    [Skill.HISTORY]: Proficiency.NOT_PROFICIENT,
    [Skill.INVESTIGATION]: Proficiency.NOT_PROFICIENT,
    [Skill.NATURE]: Proficiency.NOT_PROFICIENT,
    [Skill.RELIGION]: Proficiency.NOT_PROFICIENT,
    [Skill.ANIMAL_HANDLING]: Proficiency.NOT_PROFICIENT,
    [Skill.INSIGHT]: Proficiency.NOT_PROFICIENT,
    [Skill.MEDICINE]: Proficiency.NOT_PROFICIENT,
    [Skill.PERCEPTION]: Proficiency.NOT_PROFICIENT,
    [Skill.SURVIVAL]: Proficiency.NOT_PROFICIENT,
    [Skill.DECEPTION]: Proficiency.NOT_PROFICIENT,
    [Skill.INTIMIDATION]: Proficiency.NOT_PROFICIENT,
    [Skill.PERFORMANCE]: Proficiency.NOT_PROFICIENT,
    [Skill.PERSUASION]: Proficiency.NOT_PROFICIENT,
  },
  skillBonuses: {
    [Skill.ATHLETICS]: 0,
    [Skill.ACROBATICS]: 0,
    [Skill.SLEIGHT_OF_HAND]: 0,
    [Skill.STEALTH]: 0,
    [Skill.ARCANA]: 0,
    [Skill.HISTORY]: 0,
    [Skill.INVESTIGATION]: 0,
    [Skill.NATURE]: 0,
    [Skill.RELIGION]: 0,
    [Skill.ANIMAL_HANDLING]: 0,
    [Skill.INSIGHT]: 0,
    [Skill.MEDICINE]: 0,
    [Skill.PERCEPTION]: 0,
    [Skill.SURVIVAL]: 0,
    [Skill.DECEPTION]: 0,
    [Skill.INTIMIDATION]: 0,
    [Skill.PERFORMANCE]: 0,
    [Skill.PERSUASION]: 0,
  },
  miscProficiencies: [],
  features: [],
  spells: undefined,
  attacks: undefined,
  equipment: undefined,
};

export const exampleCharacterSheetData: CharacterSheetData = {
  name: "John Example",
  alignment: "Neutral good",
  race: "Human",
  background: "Soldier",
  classLevels: [
    { characterClass: CharacterClass.FIGHTER, level: 2 },
    { characterClass: CharacterClass.ROGUE, level: 1 },
  ],
  armorClass: 15,
  movement: [{ type: MovementType.WALK, amount: 30 }],
  maxHp: 27,
  hitDice: [
    { size: 10, number: 2 },
    { size: 8, number: 1 },
  ],
  proficiencyBonus: 2,
  stats: {
    [Stat.STR]: 16,
    [Stat.DEX]: 15,
    [Stat.CON]: 14,
    [Stat.INT]: 13,
    [Stat.WIS]: 11,
    [Stat.CHA]: 9,
  },
  statMods: {
    [Stat.STR]: 3,
    [Stat.DEX]: 2,
    [Stat.CON]: 2,
    [Stat.INT]: 1,
    [Stat.WIS]: 0,
    [Stat.CHA]: -1,
  },
  saveProficiencies: {
    [Stat.STR]: true,
    [Stat.DEX]: false,
    [Stat.CON]: true,
    [Stat.INT]: false,
    [Stat.WIS]: false,
    [Stat.CHA]: false,
  },
  saveBonuses: {
    [Stat.STR]: 5,
    [Stat.DEX]: 2,
    [Stat.CON]: 4,
    [Stat.INT]: 1,
    [Stat.WIS]: 0,
    [Stat.CHA]: -1,
  },
  skillProficiencies: {
    [Skill.ATHLETICS]: Proficiency.EXPERTISE,
    [Skill.ACROBATICS]: Proficiency.EXPERTISE,
    [Skill.SLEIGHT_OF_HAND]: Proficiency.PROFICIENT,
    [Skill.STEALTH]: Proficiency.NOT_PROFICIENT,
    [Skill.ARCANA]: Proficiency.NOT_PROFICIENT,
    [Skill.HISTORY]: Proficiency.PROFICIENT,
    [Skill.INVESTIGATION]: Proficiency.NOT_PROFICIENT,
    [Skill.NATURE]: Proficiency.NOT_PROFICIENT,
    [Skill.RELIGION]: Proficiency.NOT_PROFICIENT,
    [Skill.ANIMAL_HANDLING]: Proficiency.PROFICIENT,
    [Skill.INSIGHT]: Proficiency.NOT_PROFICIENT,
    [Skill.MEDICINE]: Proficiency.NOT_PROFICIENT,
    [Skill.PERCEPTION]: Proficiency.NOT_PROFICIENT,
    [Skill.SURVIVAL]: Proficiency.NOT_PROFICIENT,
    [Skill.DECEPTION]: Proficiency.NOT_PROFICIENT,
    [Skill.INTIMIDATION]: Proficiency.NOT_PROFICIENT,
    [Skill.PERFORMANCE]: Proficiency.NOT_PROFICIENT,
    [Skill.PERSUASION]: Proficiency.NOT_PROFICIENT,
  },
  skillBonuses: {
    [Skill.ATHLETICS]: 7,
    [Skill.ACROBATICS]: 6,
    [Skill.SLEIGHT_OF_HAND]: 4,
    [Skill.STEALTH]: 2,
    [Skill.ARCANA]: 1,
    [Skill.HISTORY]: 3,
    [Skill.INVESTIGATION]: 1,
    [Skill.NATURE]: 1,
    [Skill.RELIGION]: 1,
    [Skill.ANIMAL_HANDLING]: 2,
    [Skill.INSIGHT]: 0,
    [Skill.MEDICINE]: 0,
    [Skill.PERCEPTION]: 0,
    [Skill.SURVIVAL]: 0,
    [Skill.DECEPTION]: -1,
    [Skill.INTIMIDATION]: -1,
    [Skill.PERFORMANCE]: -1,
    [Skill.PERSUASION]: -1,
  },
  miscProficiencies: [
    {
      name: "All armor",
      proficiency: Proficiency.PROFICIENT,
    },
    {
      name: "Shields",
      proficiency: Proficiency.PROFICIENT,
    },
    {
      name: "Simple weapons",
      proficiency: Proficiency.PROFICIENT,
    },
    {
      name: "Martial weapons",
      proficiency: Proficiency.PROFICIENT,
    },
    {
      name: "Thieves' tools",
      proficiency: Proficiency.PROFICIENT,
    },
  ],
  features: [
    MiscFeatureId.FIGHTING_STYLE,
    MiscFeatureId.SECOND_WIND,
    `${MiscFeatureId.ACTION_SURGE} (x1)`,
    `${MiscFeatureId.SNEAK_ATTACK} (1d6)`,
    MiscFeatureId.THIEVES_CANT,
  ],
  spells: undefined,
  attacks: undefined,
  equipment: undefined,
};
