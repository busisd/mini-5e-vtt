import {
  NumberOperand,
  OperatorType,
  ParsedToken,
  RollOperand,
} from "./rollExpressionParser";

const dicePrefixRegex = /^\d*d\d*/;
const flatBonusRegex = /^\d*$/;

export const parseTokens = (tokenStrings: string[]): ParsedToken[] => {
  return tokenStrings.map(parseToken);
};

export const parseToken = (tokenStr: string): ParsedToken => {
  if (tokenStr === "+") {
    return { operator: OperatorType.PLUS };
  } else if (tokenStr === "-") {
    return { operator: OperatorType.MINUS };
  } else if (tokenStr === "*") {
    return { operator: OperatorType.TIMES };
  } else if (dicePrefixRegex.test(tokenStr)) {
    return parseRollToken(tokenStr);
  } else if (flatBonusRegex.test(tokenStr)) {
    return parseNumberToken(tokenStr);
  }

  throw new Error(`Could not parse token: ${tokenStr}`);
};

const parseRollToken = (tokenStr: string): RollOperand => {
  const [dicePrefixStr] = dicePrefixRegex.exec(tokenStr) ?? [];
  if (dicePrefixStr == null) {
    throw new Error(`Could not parse token: ${tokenStr}`);
  }
  const [numberOfDiceStr, sidesPerDieStr] = dicePrefixStr.split("d");
  const diceSuffixStr = tokenStr.substring(dicePrefixStr.length);

  const numberOfDice = parseInt(numberOfDiceStr);
  const sidesPerDie = parseInt(sidesPerDieStr);

  if (isNaN(numberOfDice) || isNaN(sidesPerDie)) {
    throw new Error(`Could not parse number in token: ${tokenStr}`);
  }
  if (numberOfDice <= 0 || sidesPerDie <= 0) {
    throw new Error(
      `Invalid token ${tokenStr}: die values must be greater than 0`,
    );
  }

  // TODO: Support dice suffix operations
  // TODO: Guardrails on allowed values
  if (diceSuffixStr === "TODO") {
    console.log("TODO");
  }

  return {
    numberOfDice,
    sidesPerDie,
  };
};

const parseNumberToken = (tokenStr: string): NumberOperand => {
  const value = parseInt(tokenStr);

  if (isNaN(value)) {
    throw new Error(`Could not parse number: ${tokenStr}`);
  }

  return { value };
};
