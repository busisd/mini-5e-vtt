import { AttackRollResult, DamageRollResult } from "../classes/character";
import { DieRoll } from "../classes/dice";
import { plaintextSvg, sidesToSvg, svgElement } from "../svg/diceSvg";

const getD20RollColor = (roll: DieRoll) => {
  if (roll.result === 20) {
    return "#27751e";
  } else if (roll.result === 1) {
    return "#a32431";
  } else {
    return "black";
  }
};

export const addAttackRolls = (attackResult: AttackRollResult) => {
  for (const roll of attackResult.rolls) {
    const rollSvgFn = sidesToSvg(roll.sides);
    const rollSvg = rollSvgFn(`${roll.result}`, {
      color: getD20RollColor(roll),
    });
    document.body.appendChild(svgElement(rollSvg));
  }

  if (attackResult.modifier !== 0) {
    const plusOrMinus = attackResult.modifier > 0 ? "+" : "-";
    document.body.appendChild(
      svgElement(plaintextSvg(plusOrMinus, { width: 100 })),
    );
    document.body.appendChild(
      svgElement(
        plaintextSvg(`${Math.abs(attackResult.modifier)}`, { width: 100 }),
      ),
    );
  }
  document.body.appendChild(svgElement(plaintextSvg("=>", { width: 100 })));
  document.body.appendChild(
    svgElement(
      plaintextSvg(`${attackResult.result}`, {
        color: getD20RollColor(attackResult.chosenDie),
        width: 100,
      }),
    ),
  );
};

export const addDamageRolls = (rolls: DieRoll[]) => {
  for (const roll of rolls) {
    document.body.appendChild(
      svgElement(sidesToSvg(roll.sides)(String(roll.result))),
    );
  }
};

export const addResults = ({
  attackResult,
  damageResult,
}: {
  attackResult: AttackRollResult;
  damageResult: DamageRollResult;
}) => {
  addAttackRolls(attackResult);
  document.body.appendChild(document.createElement("br"));
  addDamageRolls(damageResult.rolls);
  document.body.appendChild(document.createElement("br"));
};
