import {
  CharacterClass,
  CharacterClassLevels,
  ClassHitDie,
  ClassSaveProficiencies,
  MiscFeature,
  MiscFeatureId,
} from "../../types/characterClasses";
import {
  CharacterClassLevelData,
  CharacterSheetData,
  HitDice,
} from "../../types/characterSheetData";
import { MovementType } from "../../types/movement";
import {
  Proficiency,
  Skill,
  SkillBonusArray,
  SkillProficiencyArray,
  StatsBySkill,
} from "../../types/skills";
import { SaveProficiencyArray, Stat, StatArray } from "../../types/stats";
import { isEmptyStr } from "../../util/util";
import {
  CharacterGeneratorFormData,
  LevelChoices,
} from "./CharacterGeneratorView";

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

const generateCharacterAtLevelV1 = (
  name: string,
  baseStats: StatArray,
  levelBonuses: LevelBonus[],
  targetLevel: number,
): CalculatedCharacterV1 => {
  const levelBonusesInRange = levelBonuses.slice(0, targetLevel);
  let targetLevelSkillProficiencies = baseSkillProficiencies;

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
    saveProficiencies: baseSaveProficiencies,
    saveBonuses: generateSaveBonusArray(
      targetLevelStatMods,
      baseSaveProficiencies,
      proficiencyBonus,
    ),
  };
};

export const generateCharacterAtEachLevelV1 = (
  name: string,
  baseStats: StatArray,
  levelBonuses: LevelBonus[],
): CalculatedCharacterV1[] => {
  const characterByLevel = [];
  for (let level = 1; level <= levelBonuses.length; level++) {
    characterByLevel.push(
      generateCharacterAtLevelV1(name, baseStats, levelBonuses, level),
    );
  }
  return characterByLevel;
};

const generateCharacterSheetDataAtLevel = (
  formData: CharacterGeneratorFormData,
  targetLevel: number,
): CharacterSheetData => {
  const firstLevelClass = formData.levelChoices[0].characterClass;
  const saveProficiencies = { ...baseSaveProficiencies };
  ClassSaveProficiencies[firstLevelClass].forEach((stat) => {
    saveProficiencies[stat] = true;
  });

  const levelChoicesInRange = formData.levelChoices.slice(0, targetLevel);

  const targetLevelSkillProficiencies = { ...baseSkillProficiencies };

  let targetLevelStats = formData.baseStats;
  levelChoicesInRange.forEach((levelChoice) => {
    if (levelChoice.asis != null) {
      targetLevelStats = addASIBonus(targetLevelStats, levelChoice.asis);
    }
  });
  const targetLevelStatMods = generateStatModsArray(targetLevelStats);

  const features: MiscFeatureId[] = [];
  const currentLevels = Object.fromEntries(
    Object.values(CharacterClass).map((characterClass: CharacterClass) => [
      characterClass,
      0,
    ]),
  ) as { [key in CharacterClass]: number };
  levelChoicesInRange.forEach((levelChoice) => {
    currentLevels[levelChoice.characterClass] += 1;
    features.push(
      ...CharacterClassLevels[levelChoice.characterClass][
        currentLevels[levelChoice.characterClass]
      ].map((feature) => feature.id),
    );
  });

  let targetLevelHp = 0;
  levelChoicesInRange.forEach((levelChoice) => {
    targetLevelHp += Math.max(
      levelChoice.hp + targetLevelStatMods[Stat.CON],
      1,
    );
  });

  const classLevelsMap: { [key in CharacterClass]?: number } = {};
  const classLevels: CharacterClassLevelData[] = [];
  levelChoicesInRange.forEach((levelChoice) => {
    if (classLevelsMap[levelChoice.characterClass] == null) {
      classLevelsMap[levelChoice.characterClass] = classLevels.length;
      classLevels.push({
        characterClass: levelChoice.characterClass,
        level: 0,
      });
    }
    classLevels[classLevelsMap[levelChoice.characterClass] as number].level +=
      1;
  });

  const hitDiceMap: { [key: number]: number } = {};
  levelChoicesInRange.forEach((levelChoice) => {
    const dieSize = ClassHitDie[levelChoice.characterClass];
    if (hitDiceMap[dieSize] == null) {
      hitDiceMap[dieSize] = 0;
    }
    hitDiceMap[dieSize] += 1;
  });
  const hitDice: HitDice[] = Object.entries(hitDiceMap).map(
    ([size, number]) => ({ size: parseInt(size), number }),
  );

  const proficiencyBonus = Math.floor((targetLevel - 1) / 4) + 2;
  return {
    name: isEmptyStr(formData.characterName)
      ? "Placeholder Name"
      : (formData.characterName as string),
    alignment: "Neutral good",
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
    saveProficiencies,
    saveBonuses: generateSaveBonusArray(
      targetLevelStatMods,
      saveProficiencies,
      proficiencyBonus,
    ),
    race: "Human",
    background: "Soldier",
    classLevels,
    armorClass: 10,
    movement: [{ type: MovementType.WALK, amount: 30 }],
    hitDice,
    miscProficiencies: [],
    features,
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

const baseSkillProficiencies: SkillProficiencyArray = {
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

const baseSaveProficiencies: SaveProficiencyArray = {
  [Stat.STR]: false,
  [Stat.DEX]: false,
  [Stat.CON]: false,
  [Stat.INT]: false,
  [Stat.WIS]: false,
  [Stat.CHA]: false,
};
