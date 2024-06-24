import { DamageType } from "./damageTypes";
import { randInt } from "../util/util";

export class Die {
  readonly sides: number;

  constructor(sides: number) {
    this.sides = sides;
  }

  roll(): DieRoll {
    return {
      sides: this.sides,
      result: randInt(1, this.sides),
    };
  }

  rollTimes(times: number): DieRoll[] {
    const rolls = [];
    for (let i = 0; i < times; i++) {
      rolls.push(this.roll());
    }
    return rolls;
  }
}

export type DieRoll = {
  sides: number;
  result: number;
};

export class DamageDie extends Die {
  damageType: DamageType;

  constructor(sides: number, damageType: DamageType) {
    super(sides);
    this.damageType = damageType;
  }

  roll(): DamageDieRoll {
    return {
      ...super.roll(),
      damageType: this.damageType,
    };
  }

  rollTimes(times: number): DamageDieRoll[] {
    return super.rollTimes(times).map((dieRoll) => ({
      ...dieRoll,
      damageType: this.damageType,
    }));
  }
}

export type DamageDieRoll = DieRoll & {
  damageType: DamageType;
};

export const D4 = new Die(4);
export const D6 = new Die(6);
export const D8 = new Die(8);
export const D10 = new Die(10);
export const D12 = new Die(12);
export const D20 = new Die(20);
export const D100 = new Die(100);
