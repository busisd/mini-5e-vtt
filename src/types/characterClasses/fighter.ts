import { MiscFeature, MiscFeatureId } from "./characterClasses";

export const FighterLevels: { [level: number]: MiscFeature[] } = {
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
