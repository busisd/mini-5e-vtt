import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";
import { randInt } from "../util";
import {
  Operand,
  Operator,
  OperatorType,
  parseRollExpression,
  RollOperand,
} from "./rollExpressionParser";
import { tokenizeDiceString } from "./rollExpressionTokenizer";
import { parseTokens } from "./tokenParser";
import uniqueId from "lodash/uniqueId";

const isExpressionOperand = (operand: Operand) => "operator" in operand;
const isRollOperand = (operand: Operand) => "numberOfDice" in operand;
const isNumberOperand = (operand: Operand) => "value" in operand;

export type DiceRollResult = {
  dieRolls: SingleDieRollResult[];
  droppedRolls: SingleDieRollResult[];
  total: number;
  numberOfDice: number;
  sidesPerDie: number;
};
export type SingleDieRollResult = {
  roll: number;
  rerolls: number[];
  id: string;
};

export type NumberResult = {
  value: number;
};

export type EvaluatedResultEntry = Operator | DiceRollResult | NumberResult;

type DiceExpressionRecursiveResult = {
  results: EvaluatedResultEntry[];
  total: number;
};

export type DiceExpressionResult = DiceExpressionRecursiveResult & {
  id: string;
};

export const evaluateParsedExpression = (operand: Operand) => {
  return {
    ...evaluateOperand(operand),
    id: uniqueId("diceExpressionResult"),
  };
};

const evaluateOperand = (operand: Operand): DiceExpressionRecursiveResult => {
  if (isExpressionOperand(operand)) {
    const lhsResult = evaluateOperand(operand.lhs);
    const operatorResult = [operand.operator];
    const rhsResult = evaluateOperand(operand.rhs);
    return {
      results: lhsResult.results.concat(operatorResult, rhsResult.results),
      total: operate(
        operand.operator.operator,
        lhsResult.total,
        rhsResult.total,
      ),
    };
  } else if (isRollOperand(operand)) {
    const rollOperandResult = evaluateRollOperand(operand);
    return {
      results: [rollOperandResult],
      total: rollOperandResult.total,
    };
  } else if (isNumberOperand(operand)) {
    return {
      results: [
        {
          value: operand.value,
        },
      ],
      total: operand.value,
    };
  } else {
    throw new Error(`Unrecognized operand: ${operand}`);
  }
};

const evaluateRollOperand = (operand: RollOperand): DiceRollResult => {
  const dieRolls: SingleDieRollResult[] = [];

  for (let dieIndex = 0; dieIndex < operand.numberOfDice; dieIndex++) {
    let roll = randInt(1, operand.sidesPerDie);
    const rerolls = [];
    let hasRerolled = false;

    while (
      (!hasRerolled && roll <= operand.reroll) ||
      roll <= operand.recursiveReroll
    ) {
      if (roll <= operand.recursiveReroll) {
        rerolls.push(roll);
        roll = randInt(1, operand.sidesPerDie);
      } else {
        // roll <= operand.reroll
        hasRerolled = true;
        rerolls.push(roll);
        roll = randInt(1, operand.sidesPerDie);
      }
    }

    dieRolls.push({
      roll,
      rerolls,
      id: uniqueId("SingleDieRollResult"),
    });
  }

  const droppedRolls: SingleDieRollResult[] = [];
  for (let dropIndex = 0; dropIndex < operand.drop; dropIndex++) {
    dropLowestDie(dieRolls, droppedRolls);
  }
  while (dieRolls.length > operand.pickLowest) {
    dropHighestDie(dieRolls, droppedRolls);
  }
  while (dieRolls.length > operand.pick) {
    dropLowestDie(dieRolls, droppedRolls);
  }

  const total = dieRolls.reduce(
    (runningTotal: number, currentRoll: SingleDieRollResult) =>
      runningTotal + currentRoll.roll,
    0,
  );

  return {
    dieRolls,
    droppedRolls,
    total,
    numberOfDice: operand.numberOfDice,
    sidesPerDie: operand.sidesPerDie,
  };
};

const dropLowestDie = (
  dieRolls: SingleDieRollResult[],
  droppedRolls: SingleDieRollResult[],
) => {
  const lowestRoll = minBy(dieRolls, "roll") as SingleDieRollResult;
  const lowestRollIndex = dieRolls.indexOf(lowestRoll);
  dieRolls.splice(lowestRollIndex, 1);
  droppedRolls.push(lowestRoll);
};

const dropHighestDie = (
  dieRolls: SingleDieRollResult[],
  droppedRolls: SingleDieRollResult[],
) => {
  const highestRoll = maxBy(dieRolls, "roll") as SingleDieRollResult;
  const highestRollIndex = dieRolls.indexOf(highestRoll);
  dieRolls.splice(highestRollIndex, 1);
  droppedRolls.push(highestRoll);
};

const operate = (operator: OperatorType, lhs: number, rhs: number) => {
  switch (operator) {
    case OperatorType.PLUS:
      return lhs + rhs;
    case OperatorType.MINUS:
      return lhs - rhs;
    case OperatorType.TIMES:
      return lhs * rhs;
    case OperatorType.DIVIDE:
      return Math.ceil(lhs / rhs);
  }
};

export const evaluateDiceExpression = (
  diceExpression: string,
): DiceExpressionResult => {
  const tokenizedExpression = tokenizeDiceString(diceExpression);
  if (tokenizedExpression.length === 0) {
    throw new Error("Received empty expression");
  }
  const parsedTokensExpression = parseTokens(tokenizedExpression);
  const parsedExpression = parseRollExpression(parsedTokensExpression);
  return evaluateParsedExpression(parsedExpression);
};
