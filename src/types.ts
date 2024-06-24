enum Stat {
  STR = "Strength",
  DEX = "Dexterity",
  CON = "Constitution",
  INT = "Intelligence",
  WIS = "Wisdom",
  CHA = "Charisma",
}

type StatArray = {
  [key in Stat]: number;
};

enum DamageType {
  ACID = "Acid",
  BLUDGEONING = "Bludgeoning",
  COLD = "Cold",
  FIRE = "Fire",
  FORCE = "Force",
  LIGHTNING = "Lightning",
  NECROTIC = "Necrotic",
  PIERCING = "Piercing",
  POISON = "Poison",
  PSYCHIC = "Psychic",
  RADIANT = "Radiant",
  SLASHING = "Slashing",
  THUNDER = "Thunder",
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type DieRoll = {
  sides: number;
  result: number;
};

class Die {
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

const D4 = new Die(4);
const D6 = new Die(6);
const D8 = new Die(8);
const D10 = new Die(10);
const D12 = new Die(12);
const D20 = new Die(20);

class Character {
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
    { proficient = true, advantage = false, disadvantage = false } = {},
  ) {
    const attackMod = this.mod(attack.attackStat);
    const pbMod = proficient ? this.pb : 0;
    const { result, rolls } = attack.rollToHit(attackMod, pbMod, {
      advantage,
      disadvantage,
    });

    console.log(result, JSON.stringify(rolls));
  }
}

function makeStatArray(stats: number[]) {
  return {
    [Stat.STR]: stats[0],
    [Stat.DEX]: stats[1],
    [Stat.CON]: stats[2],
    [Stat.INT]: stats[3],
    [Stat.WIS]: stats[4],
    [Stat.CHA]: stats[5],
  };
}

class AttackAction {
  attackStat: Stat;
  damageStat: Stat | null;

  constructor(attackStat: Stat, damageStat: Stat | null) {
    this.attackStat = attackStat;
    this.damageStat = damageStat;
  }

  rollToHit(
    statMod: number,
    pbMod: number,
    {
      advantage = false,
      advantageDice = 2,
      disadvantage = false,
      disadvantageDice = 2,
    } = {},
  ) {
    let chosenResult;
    let rolls;

    if (advantage && !disadvantage) {
      rolls = D20.rollTimes(advantageDice);
      chosenResult = Math.max(...rolls.map((roll) => roll.result));
    } else if (disadvantage && !advantage) {
      rolls = D20.rollTimes(disadvantageDice);
      chosenResult = Math.min(...rolls.map((roll) => roll.result));
    } else {
      rolls = D20.rollTimes(1);
      chosenResult = rolls[0].result;
    }

    return {
      result: Math.max(chosenResult + statMod + pbMod, 1),
      rolls,
    };
  }
}

// TODO: Make attacks just contain a Formula (callback fxn accepting Character)
// Stat-based attack can be a helper function that returns that Formula
const goblin = new Character(makeStatArray([8, 14, 10, 10, 8, 8]), 2);
const shortbow = new AttackAction(Stat.DEX, Stat.DEX);
console.log(goblin, shortbow);
goblin.useAttack(shortbow);
goblin.useAttack(shortbow, { advantage: true });
goblin.useAttack(shortbow, { disadvantage: true });
