import { Character, WeaponAttack } from "./types/character";
import { DamageType } from "./types/damageTypes";
import { DamageDie } from "./types/dice";
import { Stat } from "./types/stats";
import { addResults } from "./components/rollDisplays";
import { plaintextSvg, svgElement } from "./svg/diceSvg";

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
const greatAxe = new WeaponAttack(Stat.STR, [
  new DamageDie(12, DamageType.SLASHING),
]);
const longsword2H = new WeaponAttack(Stat.STR, [
  new DamageDie(10, DamageType.SLASHING),
]);
const lotsOfD6Attack = new WeaponAttack(Stat.STR, [
  new DamageDie(6, DamageType.SLASHING),
  new DamageDie(6, DamageType.SLASHING),
  new DamageDie(6, DamageType.SLASHING),
  new DamageDie(6, DamageType.SLASHING),
  new DamageDie(6, DamageType.SLASHING),
  new DamageDie(6, DamageType.SLASHING),
]);

const zero = new Character(makeStatArray([10, 10, 10, 10, 10, 10]), 2);
const weakling = new Character(makeStatArray([4, 6, 10, 10, 10, 10]), 2);

console.log(goblin, shortbow);

// console.log("Goblin with shortbow:");
// document.body.appendChild(svgElement(plaintextSvg("Goblin with shortbow:", {width: 2000})));
// document.body.appendChild(document.createElement("br"));
// addResults(goblin.useAttack(shortbow));
// document.body.appendChild(document.createElement("br"));

// console.log("Goblin with shortbow and advantage:");
// document.body.appendChild(svgElement(plaintextSvg("Goblin with shortbow and advantage:", {width: 2000})));
// document.body.appendChild(document.createElement("br"));
// addResults(goblin.useAttack(shortbow, { advantage: true }));
// document.body.appendChild(document.createElement("br"));

// console.log("Goblin with shortbow and disadvantage:");
// document.body.appendChild(svgElement(plaintextSvg("Goblin with shortbow and disadvantage:", {width: 2000})));
// document.body.appendChild(document.createElement("br"));
// addResults(goblin.useAttack(shortbow, { disadvantage: true }));
// document.body.appendChild(document.createElement("br"));

// console.log("Goblin with shortbow+1 and advantage:");
// document.body.appendChild(svgElement(plaintextSvg("Goblin with shortbow+1 and advantage:", {width: 2000})));
// document.body.appendChild(document.createElement("br"));
// addResults(goblin.useAttack(shortbowPlusOne, { advantage: true }));
// document.body.appendChild(document.createElement("br"));

console.log("Goblin with shortbow+1, divine strike, and advantage:");
document.body.appendChild(
  svgElement(
    plaintextSvg("Goblin with shortbow+1, divine strike, and advantage:", {
      width: 2000,
    }),
  ),
);
document.body.appendChild(document.createElement("br"));
addResults(
  goblin.useAttack(shortbowPlusOne, {
    advantage: true,
    extraDice: [new DamageDie(8, DamageType.RADIANT)],
  }),
);
document.body.appendChild(document.createElement("br"));

console.log("Zero:");
document.body.appendChild(svgElement(plaintextSvg("Zero:", { width: 2000 })));
document.body.appendChild(document.createElement("br"));
addResults(
  zero.useAttack(longsword2H, { attackModOptions: { isProficient: false } }),
);
document.body.appendChild(document.createElement("br"));

console.log("Weakling:");
document.body.appendChild(
  svgElement(plaintextSvg("Weakling:", { width: 2000 })),
);
document.body.appendChild(document.createElement("br"));
addResults(
  weakling.useAttack(longsword2H, {
    attackModOptions: { isProficient: false },
  }),
);
document.body.appendChild(document.createElement("br"));

console.log("D10 damage with disadvantage:");
document.body.appendChild(
  svgElement(plaintextSvg("D10 damage with disadvantage:", { width: 2000 })),
);
document.body.appendChild(document.createElement("br"));
addResults(goblin.useAttack(longsword2H, { disadvantage: true }));
document.body.appendChild(document.createElement("br"));

console.log("Goblin barbarian with greataxe, and d6 and d4 extra damage:");
document.body.appendChild(
  svgElement(
    plaintextSvg(
      "Goblin barbarian with greataxe, and d6 and d4 extra damage:",
      { width: 2000 },
    ),
  ),
);
document.body.appendChild(document.createElement("br"));
addResults(
  goblin.useAttack(greatAxe, {
    advantage: true,
    extraDice: [
      new DamageDie(6, DamageType.LIGHTNING),
      new DamageDie(4, DamageType.SLASHING),
    ],
  }),
);
document.body.appendChild(document.createElement("br"));

console.log("Lots of D6:");
document.body.appendChild(
  svgElement(plaintextSvg("Lots of D6:", { width: 2000 })),
);
document.body.appendChild(document.createElement("br"));
addResults(
  goblin.useAttack(lotsOfD6Attack, {
    advantage: true,
    extraDice: [
      new DamageDie(6, DamageType.LIGHTNING),
      new DamageDie(6, DamageType.LIGHTNING),
    ],
  }),
);
document.body.appendChild(document.createElement("br"));
