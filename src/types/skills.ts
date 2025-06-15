import { Stat } from "./stats";

export enum Skill {
  ATHLETICS = "Athletics",
  ACROBATICS = "Acrobatics",
  SLEIGHT_OF_HAND = "Sleight of Hand",
  STEALTH = "Stealth",
  ARCANA = "Arcana",
  HISTORY = "History",
  INVESTIGATION = "Investigation",
  NATURE = "Nature",
  RELIGION = "Religion",
  ANIMAL_HANDLING = "Animal Handling",
  INSIGHT = "Insight",
  MEDICINE = "Medicine",
  PERCEPTION = "Perception",
  SURVIVAL = "Survival",
  DECEPTION = "Deception",
  INTIMIDATION = "Intimidation",
  PERFORMANCE = "Performance",
  PERSUASION = "Persuasion",
}

export const StatsBySkill: { [key in Skill]: Stat } = {
  [Skill.ATHLETICS]: Stat.STR,
  [Skill.ACROBATICS]: Stat.DEX,
  [Skill.SLEIGHT_OF_HAND]: Stat.DEX,
  [Skill.STEALTH]: Stat.DEX,
  [Skill.ARCANA]: Stat.INT,
  [Skill.HISTORY]: Stat.INT,
  [Skill.INVESTIGATION]: Stat.INT,
  [Skill.NATURE]: Stat.INT,
  [Skill.RELIGION]: Stat.INT,
  [Skill.ANIMAL_HANDLING]: Stat.WIS,
  [Skill.INSIGHT]: Stat.WIS,
  [Skill.MEDICINE]: Stat.WIS,
  [Skill.PERCEPTION]: Stat.WIS,
  [Skill.SURVIVAL]: Stat.WIS,
  [Skill.DECEPTION]: Stat.CHA,
  [Skill.INTIMIDATION]: Stat.CHA,
  [Skill.PERFORMANCE]: Stat.CHA,
  [Skill.PERSUASION]: Stat.CHA,
};

export const SkillsByStat: { [key in Stat]: Skill[] } = {
  [Stat.STR]: [Skill.ATHLETICS],
  [Stat.DEX]: [Skill.ACROBATICS, Skill.SLEIGHT_OF_HAND, Skill.STEALTH],
  [Stat.CON]: [],
  [Stat.INT]: [
    Skill.ARCANA,
    Skill.HISTORY,
    Skill.INVESTIGATION,
    Skill.NATURE,
    Skill.RELIGION,
  ],
  [Stat.WIS]: [
    Skill.ANIMAL_HANDLING,
    Skill.INSIGHT,
    Skill.MEDICINE,
    Skill.PERCEPTION,
    Skill.SURVIVAL,
  ],
  [Stat.CHA]: [
    Skill.DECEPTION,
    Skill.INTIMIDATION,
    Skill.PERFORMANCE,
    Skill.PERSUASION,
  ],
};

export enum Proficiency {
  NOT_PROFICIENT = 0,
  PROFICIENT = 1,
  EXPERTISE = 2,
}

export type SkillProficiencyArray = {
  [key in Skill]: Proficiency;
};

export type SkillBonusArray = {
  [key in Skill]: number;
};
