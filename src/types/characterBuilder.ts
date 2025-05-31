import { Stat, StatArray } from "./stats";
import {
  Proficiency,
  Skill,
  SkillProficiencyArray,
  StatsBySkill,
} from "./skills";

// Proficiencies:
// Tools, weapons, instruments, armor, languages?
// Feats/abilities?
// Actions, bonus actions, reactions?
// Vision, movement?

// Spells learned/forgotten

// Species bonuses
// Background bonuses
// Hit dice

type SkillBonusArray = {
  [key in Skill]: number;
};

type SaveProficiencyArray = {
  [key in Stat]: boolean;
};

export type CalculatedCharacter = {
  totalLevel: number;
  maxHp: number;
  stats: StatArray;
  statMods: StatArray;
  proficiencyBonus: number;
  skillProficiencies: SkillProficiencyArray;
  skillBonuses: SkillBonusArray;
  saveProficiencies: SaveProficiencyArray;
  saveBonuses: StatArray;
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

type ASI = {
  stat: Stat;
  amount: number;
};

type LearnedSkillProficiency = {
  skill: Skill;
  proficiency: Proficiency;
};

export type LevelBonus = {
  rolledHp: number;
  asis?: ASI[];
  skillProfs?: LearnedSkillProficiency[];
};

const addASIBonus = (stats: StatArray, asis: ASI[]): StatArray => {
  const newStats = { ...stats };
  for (const asi of asis) {
    newStats[asi.stat] += asi.amount;
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
  baseStats: StatArray,
  levelBonuses: LevelBonus[],
  targetLevel: number,
): CalculatedCharacter => {
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
    targetLevelHp += Math.max(
      levelBonus.rolledHp + targetLevelStatMods[Stat.CON],
      1,
    );

    if (levelBonus.skillProfs != null) {
      targetLevelSkillProficiencies = addSkillProficiencies(
        targetLevelSkillProficiencies,
        levelBonus.skillProfs,
      );
    }
  });

  const proficiencyBonus = Math.floor(targetLevel / 4) + 2;
  return {
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

const generateCharacterAtEachLevel = (
  baseStats: StatArray,
  levelBonuses: LevelBonus[],
) => {
  const characterByLevel = [];
  for (let level = 1; level <= levelBonuses.length; level++) {
    characterByLevel.push(
      generateCharacterAtLevel(baseStats, levelBonuses, level),
    );
  }
  return characterByLevel;
};

const baseStatArray: StatArray = {
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
  [Stat.CON]: true,
  [Stat.INT]: false,
  [Stat.WIS]: false,
  [Stat.CHA]: true,
};

// Barbarian
const exampleLevelBonuses: LevelBonus[] = [
  {
    rolledHp: 12,
    skillProfs: [
      { skill: Skill.ATHLETICS, proficiency: Proficiency.EXPERTISE },
      { skill: Skill.INTIMIDATION, proficiency: Proficiency.PROFICIENT },
    ],
  },
  { rolledHp: 7 },
  { rolledHp: 7 },
  {
    rolledHp: 7,
    asis: [
      { stat: Stat.STR, amount: 2 },
      { stat: Stat.CON, amount: 2 },
    ],
  },
];

export const exampleCalculatedCharacter = generateCharacterAtEachLevel(
  baseStatArray,
  exampleLevelBonuses,
);
