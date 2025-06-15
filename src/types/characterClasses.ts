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
  // Cleric
  CHANNEL_DIVINITY = "Channel Divinity",
  DESTROY_UNDEAD = "Destroy Undead",
  DIVINE_INTERVENTION = "Divine Intervention",
  // Fighter
  FIGHTING_STYLE = "Fighting Style",
  SECOND_WIND = "Second Wind",
  ACTION_SURGE = "Action Surge",
  EXTRA_ATTACK = "Extra Attack",
  INDOMITABLE = "Indomitable",
  // Rogue
  EXPERTISE = "Expertise",
  SNEAK_ATTACK = "Sneak Attack",
  THIEVES_CANT = "Thieves' Cant",
  CUNNING_ACTION = "Cunning Action",
  UNCANNY_DODGE = "Uncanny Dodge",
  EVASION = "Evasion",
  RELIABLE_TALENT = "Reliable Talent",
  BLINDSENSE = "Blindsense",
  SLIPPERY_MIND = "Slippery Mind",
  ELUSIVE = "Elusive",
  STROKE_OF_LUCK = "Stroke of Luck",
  // Wizard
  ARCANE_RECOVERY = "Arcane Recovery",
  SPELL_MASTERY = "Spell Mastery",
  SIGNATURE_SPELLS = "Signature Spells",
}

export type MiscFeature = {
  id: MiscFeatureId;
  tier?: number;
};

const ClericLevels: { [level: number]: MiscFeature[] } = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [{ id: MiscFeatureId.DESTROY_UNDEAD, tier: 0.5 }],
  6: [],
  7: [],
  8: [{ id: MiscFeatureId.DESTROY_UNDEAD, tier: 1 }],
  9: [],
  10: [{ id: MiscFeatureId.DIVINE_INTERVENTION }],
  11: [{ id: MiscFeatureId.DESTROY_UNDEAD, tier: 2 }],
  12: [],
  13: [],
  14: [{ id: MiscFeatureId.DESTROY_UNDEAD, tier: 3 }],
  15: [],
  16: [],
  17: [{ id: MiscFeatureId.DESTROY_UNDEAD, tier: 4 }],
  18: [],
  19: [],
  20: [],
};

const FighterLevels: { [level: number]: MiscFeature[] } = {
  1: [{ id: MiscFeatureId.FIGHTING_STYLE }, { id: MiscFeatureId.SECOND_WIND }],
  2: [{ id: MiscFeatureId.ACTION_SURGE, tier: 1 }],
  3: [],
  4: [],
  5: [{ id: MiscFeatureId.EXTRA_ATTACK, tier: 1 }],
  6: [],
  7: [],
  8: [],
  9: [{ id: MiscFeatureId.INDOMITABLE, tier: 1 }],
  10: [],
  11: [{ id: MiscFeatureId.EXTRA_ATTACK, tier: 2 }],
  12: [],
  13: [{ id: MiscFeatureId.INDOMITABLE, tier: 2 }],
  14: [],
  15: [],
  16: [],
  17: [
    { id: MiscFeatureId.ACTION_SURGE, tier: 2 },
    { id: MiscFeatureId.INDOMITABLE, tier: 3 },
  ],
  18: [],
  19: [],
  20: [{ id: MiscFeatureId.EXTRA_ATTACK, tier: 3 }],
};

const RogueLevels: { [level: number]: MiscFeature[] } = {
  1: [
    { id: MiscFeatureId.EXPERTISE, tier: 2 },
    { id: MiscFeatureId.SNEAK_ATTACK },
    { id: MiscFeatureId.THIEVES_CANT },
  ],
  2: [{ id: MiscFeatureId.CUNNING_ACTION }],
  3: [],
  4: [],
  5: [{ id: MiscFeatureId.UNCANNY_DODGE }],
  6: [{ id: MiscFeatureId.EXPERTISE, tier: 4 }],
  7: [{ id: MiscFeatureId.EVASION }],
  8: [],
  9: [],
  10: [],
  11: [{ id: MiscFeatureId.RELIABLE_TALENT }],
  12: [],
  13: [],
  14: [{ id: MiscFeatureId.BLINDSENSE }],
  15: [{ id: MiscFeatureId.SLIPPERY_MIND }],
  16: [],
  17: [],
  18: [{ id: MiscFeatureId.ELUSIVE }],
  19: [],
  20: [{ id: MiscFeatureId.STROKE_OF_LUCK }],
};

const WizardLevels: { [level: number]: MiscFeature[] } = {
  1: [{ id: MiscFeatureId.ARCANE_RECOVERY }],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
  15: [],
  16: [],
  17: [],
  18: [{ id: MiscFeatureId.SPELL_MASTERY }],
  19: [],
  20: [{ id: MiscFeatureId.SIGNATURE_SPELLS }],
};

export const CharacterClassLevels = {
  [CharacterClass.CLERIC]: ClericLevels,
  [CharacterClass.FIGHTER]: FighterLevels,
  [CharacterClass.ROGUE]: RogueLevels,
  [CharacterClass.WIZARD]: WizardLevels,
};
