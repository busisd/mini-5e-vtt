import {
  NumberOperand,
  OperatorType,
  ParsedToken,
  RollOperand,
} from "./rollExpressionParser";

const dicePrefixRegex = /^\d*d\d*/;
const flatBonusRegex = /^\d*$/;

const recursiveRerollSuffixRegex = /rr(?<val>\d+)/g;
const rerollSuffixRegex = /r(?<val>\d+)/g;
const pickLowestSuffixRegex = /pl(?<val>\d+)/g;
const pickSuffixRegex = /p(?<val>\d+)/g;
const dropSuffixRegex = /d(?<val>\d+)/g;

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
  } else if (tokenStr === "/") {
    return { operator: OperatorType.DIVIDE };
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
  let diceSuffixStr = tokenStr.substring(dicePrefixStr.length);

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

  const {
    newSuffixStr: newSuffixStrRecursiveReroll,
    tokenVal: recursiveReroll,
  } = parseSuffixValue(recursiveRerollSuffixRegex, diceSuffixStr);
  diceSuffixStr = newSuffixStrRecursiveReroll;
  const { newSuffixStr: newSuffixStrReroll, tokenVal: reroll } =
    parseSuffixValue(rerollSuffixRegex, diceSuffixStr);
  diceSuffixStr = newSuffixStrReroll;
  const { newSuffixStr: newSuffixStrPickLowest, tokenVal: pickLowest } =
    parseSuffixValue(pickLowestSuffixRegex, diceSuffixStr);
  diceSuffixStr = newSuffixStrPickLowest;
  const { newSuffixStr: newSuffixStrPick, tokenVal: pick } = parseSuffixValue(
    pickSuffixRegex,
    diceSuffixStr,
  );
  diceSuffixStr = newSuffixStrPick;
  const { newSuffixStr: newSuffixStrDrop, tokenVal: drop } = parseSuffixValue(
    dropSuffixRegex,
    diceSuffixStr,
  );
  diceSuffixStr = newSuffixStrDrop;

  if (diceSuffixStr.length > 0) {
    throw new Error(
      `Unrecognized suffix ${diceSuffixStr} in token ${tokenStr}`,
    );
  }

  for (const val of [recursiveReroll, reroll, pick, pickLowest, drop]) {
    if (val != null && val < 1) {
      throw new Error(
        `Token ${tokenStr} contains suffix with non-positive number: ${val}`,
      );
    }
  }

  if (recursiveReroll != null && recursiveReroll >= sidesPerDie) {
    throw new Error(
      `Token ${tokenStr} tries to recursively reroll a number >= than the sides per die`,
    );
  }
  if (reroll != null && reroll >= sidesPerDie) {
    throw new Error(
      `Token ${tokenStr} tries to reroll a number >= than the sides per die`,
    );
  }

  if (pick != null && pickLowest != null) {
    throw new Error(`Token ${tokenStr} tries to pick both highest and lowest`);
  }
  if (pickLowest != null && pickLowest > numberOfDice) {
    throw new Error(`Token ${tokenStr} tries to pick more dice than rolled`);
  }
  if (pick != null && pick > numberOfDice) {
    throw new Error(`Token ${tokenStr} tries to pick more dice than rolled`);
  }

  if (drop != null && drop > numberOfDice) {
    throw new Error(`Token ${tokenStr} tries to drop more dice than rolled`);
  }
  if ((pick ?? 0) + (drop ?? 0) > numberOfDice) {
    throw new Error(
      `Token ${tokenStr} tries to pick and drop more dice than rolled`,
    );
  }

  return {
    numberOfDice,
    sidesPerDie,
    recursiveReroll: recursiveReroll ?? 0,
    reroll: reroll ?? 0,
    pick: pick ?? Infinity,
    pickLowest: pickLowest ?? Infinity,
    drop: drop ?? 0,
  };
};

const parseSuffixValue = (regex: RegExp, suffixStr: string) => {
  const recursiveRerollMatches = [...suffixStr.matchAll(regex)];
  if (recursiveRerollMatches.length === 0)
    return { newSuffixStr: suffixStr, tokenVal: undefined };
  if (recursiveRerollMatches.length > 1) {
    throw new Error(
      `Token suffix ${suffixStr} has duplicate suffix operations`,
    );
  }

  const fullToken = recursiveRerollMatches[0][0];
  const tokenVal = parseInt(recursiveRerollMatches[0].groups?.val ?? "");
  if (isNaN(tokenVal)) {
    throw new Error(`Cannot parse value from suffix ${suffixStr}`);
  }

  return {
    newSuffixStr: suffixStr.replace(fullToken, ""),
    tokenVal,
  };
};

const parseNumberToken = (tokenStr: string): NumberOperand => {
  const value = parseInt(tokenStr);

  if (isNaN(value)) {
    throw new Error(`Could not parse number: ${tokenStr}`);
  }

  return { value };
};
