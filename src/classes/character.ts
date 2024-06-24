import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import { Stat, StatArray } from "./stats";
import { D20, DamageDie, DamageDieRoll, DieRoll } from "./dice";
import { DamageTypeMap } from "./damageTypes";
import { minOne } from "../util/util";

export class Character {
  stats: StatArray;
  pb: number;

  constructor(stats: StatArray, pb: number) {
    this.stats = stats;
    this.pb = pb;
  }

  mod(stat: Stat) {
    return Math.floor((this.stats[stat] - 10) / 2);
  }

  useAttack(
    attack: AttackAction,
    {
      advantage = false,
      disadvantage = false,
      advantageDice = 2,
      disadvantageDice = 2,
      extraDice = [] as DamageDie[],
    } = {},
  ) {
    const { result, rolls, chosenDie } = attack.rollToHit(this, {
      advantage,
      disadvantage,
      advantageDice,
      disadvantageDice,
    });
    // TODO: Return these results instead of logging them
    console.log(result, JSON.stringify(rolls));
    const isCritical = chosenDie.result === 20;
    console.log("Is critical hit?", isCritical);

    const damageResults = attack.rollDamage(this, { isCritical, extraDice });
    console.log(JSON.stringify(damageResults));
  }
}

export type AttackModFormula = (c: Character) => number;
export type DamageModFormula = (c: Character) => number;

export type AttackRollResult = {
  result: number;
  chosenDie: DieRoll;
  rolls: DieRoll[];
};

export type DamageResult = {
  rolls: DamageDieRoll[];
  damageByType: DamageTypeMap;
  totalDamage: number;
};

export class AttackAction {
  readonly attackModFormula: AttackModFormula;
  readonly damageModFormula: DamageModFormula;
  readonly damageDice: DamageDie[];

  constructor(
    attackModFormula: AttackModFormula,
    damageModFormula: DamageModFormula,
    damageDice: DamageDie[],
  ) {
    this.attackModFormula = attackModFormula;
    this.damageModFormula = damageModFormula;
    this.damageDice = damageDice;
  }

  rollToHit(
    attacker: Character,
    {
      advantage = false,
      disadvantage = false,
      advantageDice = 2,
      disadvantageDice = 2,
    } = {},
  ): AttackRollResult {
    let chosenDie;
    let rolls;
    if (advantage && !disadvantage) {
      rolls = D20.rollTimes(advantageDice);
      chosenDie = maxBy(rolls, (roll) => roll.result) as DieRoll;
    } else if (disadvantage && !advantage) {
      rolls = D20.rollTimes(disadvantageDice);
      chosenDie = minBy(rolls, (roll) => roll.result) as DieRoll;
    } else {
      rolls = D20.rollTimes(1);
      chosenDie = rolls[0];
    }

    return {
      result: minOne(chosenDie.result + this.attackModFormula(attacker)),
      chosenDie,
      rolls,
    };
  }

  rollDamage(
    attacker: Character,
    {
      isCritical = false,
      brutalCritical = 0,
      extraDice = [] as DamageDie[],
      extraNonDoubledDice = [] as DamageDie[],
    } = {},
  ): DamageResult {
    const baseDamageDie = this.damageDice[0];
    const baseDamageType = baseDamageDie.damageType;

    const damageRolls = this.damageDice.map((damageDie) => damageDie.roll());
    damageRolls.push(...extraDice.map((damageDie) => damageDie.roll()));
    damageRolls.push(
      ...extraNonDoubledDice.map((damageDie) => damageDie.roll()),
    );

    if (isCritical) {
      damageRolls.push(...this.damageDice.map((damageDie) => damageDie.roll()));
      for (let i = 0; i < brutalCritical; i++) {
        damageRolls.push(baseDamageDie.roll());
      }
      damageRolls.push(...extraDice.map((damageDie) => damageDie.roll()));
    }

    const damageByType = damageRolls.reduce(
      (currentMap: DamageTypeMap, damageRoll: DamageDieRoll) => {
        const currentTypeSum = currentMap[damageRoll.damageType] ?? 0;
        return {
          ...currentMap,
          [damageRoll.damageType]: currentTypeSum + damageRoll.result,
        };
      },
      {} as DamageTypeMap,
    );

    damageByType[baseDamageType] += this.damageModFormula(attacker);

    const totalDamage = Object.values(damageByType).reduce(
      (total, current) => total + current,
      0,
    );

    return {
      rolls: damageRolls,
      damageByType,
      totalDamage,
    };
  }
}

export class WeaponAttack extends AttackAction {
  static attackFormula(stat: Stat, magicBonus: number) {
    return (c: Character) => c.mod(stat) + c.pb + magicBonus;
  }

  static damageFormula(stat: Stat, magicBonus: number) {
    return (c: Character) => c.mod(stat) + magicBonus;
  }

  constructor(
    stat: Stat,
    weaponDie: DamageDie[],
    { magicAttackBonus = 0, magicDamageBonus = 0 } = {},
  ) {
    super(
      WeaponAttack.attackFormula(stat, magicAttackBonus),
      WeaponAttack.damageFormula(stat, magicDamageBonus),
      weaponDie,
    );
  }
}
