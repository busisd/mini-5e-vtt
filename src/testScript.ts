import { Character, WeaponAttack } from "./classes/character";
import { DamageType } from "./classes/damageTypes";
import { DamageDie } from "./classes/dice";
import { Stat } from "./classes/stats";

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

const goblin = new Character(makeStatArray([8, 14, 10, 10, 8, 8]), 2);
const shortbow = new WeaponAttack(Stat.DEX, [
  new DamageDie(6, DamageType.PIERCING),
]);
const shortbowPlusOne = new WeaponAttack(
  Stat.DEX,
  [new DamageDie(6, DamageType.PIERCING)],
  { magicAttackBonus: 1, magicDamageBonus: 1 },
);

console.log(goblin, shortbow);
console.log("Goblin with shortbow:");
goblin.useAttack(shortbow);
console.log("Goblin with shortbow and advantage:");
goblin.useAttack(shortbow, { advantage: true });
console.log("Goblin with shortbow and disadvantage:");
goblin.useAttack(shortbow, { disadvantage: true });
console.log("Goblin with shortbow+1 and advantage:");
goblin.useAttack(shortbowPlusOne, { advantage: true });
console.log("Goblin with shortbow+1, divine strike, and advantage:");
goblin.useAttack(shortbowPlusOne, {
  advantage: true,
  extraDice: [new DamageDie(8, DamageType.RADIANT)],
});
