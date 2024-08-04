import random from "lodash/random";
import uniqueId from "lodash/uniqueId";
import React, { useCallback, useState } from "react";
import DieSvg, { TextSvg } from "../svg/DieSvg";
import {
  DiceExpressionResult,
  evaluateDiceExpression,
  EvaluatedResultEntry,
} from "../util/rollexpression/rollExpressionEvaluator";
import { tokenizeDiceString } from "../util/rollexpression/rollExpressionTokenizer";
import "./DiceRollerView.css";
import { OperatorType } from "../util/rollexpression/rollExpressionParser";

/*** Parsing logic ***/
const diceRegex = /^[1-9]\d*d[1-9]\d*$/;
const flatBonusRegex = /^[1-9]\d*$/;

type DiceRollDefinition = {
  dice: number[];
  flatBonuses: number[];
};

type DiceRollResult = {
  rolls: { result: number; sides: number }[];
  flatBonuses: number[];
  id: string;
};

const rollDice = ({
  dice,
  flatBonuses,
}: DiceRollDefinition): DiceRollResult => {
  const rolls = dice.map((sides) => ({
    sides,
    result: random(1, sides),
  }));

  return {
    rolls,
    flatBonuses,
    id: uniqueId("roll"),
  };
};

const parseDiceString = (diceStr: string): DiceRollDefinition => {
  if (diceStr == null || diceStr.length === 0) {
    throw new Error("Enter an expression");
  }

  const tokens = diceStr.split("+").map((token) => token.trim());

  // const tokenizedTokens = tokenizeDiceString(diceStr);
  // console.log("tokenizedTokens", tokenizedTokens);
  // const parsedTokens = parseTokens(tokenizedTokens);
  // console.log("parsedTokens", parsedTokens);
  // const parsedExpression = parseRollExpression(parsedTokens);
  // console.log("parsedExpression", parsedExpression);
  // const evaluatedExpression = evaluateOperand(parsedExpression);
  // console.log("evaluatedExpression", evaluatedExpression);

  const dice: number[] = [];
  const flatBonuses: number[] = [];
  tokens.forEach((token) => {
    if (diceRegex.test(token)) {
      dice.push(...parseDiceToken(token));
    } else if (flatBonusRegex.test(token)) {
      flatBonuses.push(parseFlatBonusToken(token));
    } else {
      throw new Error(`Could not parse token: ${token}`);
    }
  });

  return { dice, flatBonuses };
};

const parseDiceToken = (damageToken: string) => {
  const [amountString, maxRollString] = damageToken.split("d");
  const amount = parseInt(amountString);
  const maxRoll = parseInt(maxRollString);

  const dice: number[] = [];
  for (let i = 0; i < amount; i++) {
    dice.push(maxRoll);
  }

  return dice;
};

const parseFlatBonusToken = (damageToken: string) => {
  return parseInt(damageToken);
};

const getErrorMessage = (e: unknown) =>
  (e as Error)?.message ?? "Unknown error";

const DiceRollResultDisplay = ({ result }: { result: DiceRollResult }) => {
  return (
    <>
      {result.rolls.map((dieRoll, index) => (
        <DieSvg
          key={index}
          sides={dieRoll.sides}
          text={dieRoll.result}
          color={index > 0 ? "lightgrey" : "black"}
        />
      ))}
      <br />
    </>
  );
};

const isOperatorEntry = (resultEntry: EvaluatedResultEntry) =>
  "operator" in resultEntry;
const isRollEntry = (resultEntry: EvaluatedResultEntry) =>
  "dieRolls" in resultEntry;
const isNumberEntry = (resultEntry: EvaluatedResultEntry) =>
  "value" in resultEntry;

const operatorText = (operator: OperatorType): string => {
  switch (operator) {
    case OperatorType.PLUS:
      return "+";
    case OperatorType.MINUS:
      return "-";
    case OperatorType.TIMES:
      return "*";
  }
};

const DiceExpressionResultDisplay = ({
  result,
}: {
  result: DiceExpressionResult;
}) => {
  // TODO: Split out into individual components
  return (
    <>
      {result.results.map((resultEntry, index) => {
        if (isOperatorEntry(resultEntry)) {
          return (
            <TextSvg
              text={operatorText(resultEntry.operator)}
              key={`${resultEntry.operator}-${index}`}
            />
          );
        } else if (isRollEntry(resultEntry)) {
          return (
            <React.Fragment key={`${resultEntry.total}-${index}`}>
              {resultEntry.dieRolls.map((dieRoll) => (
                <DieSvg
                  key={dieRoll.id}
                  sides={resultEntry.sidesPerDie}
                  text={dieRoll.roll}
                  color={"black"}
                />
              ))}
              {resultEntry.droppedRolls.map((dieRoll) => (
                <DieSvg
                  key={dieRoll.id}
                  sides={resultEntry.sidesPerDie}
                  text={dieRoll.roll}
                  color={"lightgrey"}
                />
              ))}
            </React.Fragment>
          );
        } else if (isNumberEntry(resultEntry)) {
          return (
            <TextSvg
              text={resultEntry.value}
              key={`${resultEntry.value}-${index}`}
            />
          );
        } else {
          console.error("Unexpected result entry", resultEntry);
          return undefined;
        }
      })}
      Total={result.total}
      <br />
    </>
  );
};

// TODO:
//  - Store results in Redux so that they're maintained when switching tabs
//  - Store results in scrollable panel
//  - Press Enter to submit
//  - Support parens
//  - Context reference values?
//  - Show rerolls in tooltip or on-click in little popup

const DiceRollerView = () => {
  const [rawInput, setRawInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [results, setResults] = useState<DiceExpressionResult[]>([]);

  const onSubmit = useCallback(() => {
    setInputError(null);

    try {
      console.log(tokenizeDiceString(rawInput));

      // const parsedInput = parseDiceString(rawInput);
      // const result = rollDice(parsedInput);

      const evaluatedExpression = evaluateDiceExpression(rawInput);

      setResults((currentResults) => [evaluatedExpression, ...currentResults]);
    } catch (e) {
      setInputError(getErrorMessage(e));
    }
  }, [rawInput]);

  return (
    <>
      <input
        placeholder="Example: 1d8 + 2"
        onBlur={(e) => setRawInput(e.target.value)}
      />{" "}
      {inputError && <span className="input-error"> {inputError} </span>}
      <br />
      <button onClick={onSubmit}>Roll dice</button>
      <br />
      {results.map((result) => (
        // <DiceRollResultDisplay key={result.id} result={result} />
        <DiceExpressionResultDisplay key={result.id} result={result} />
      ))}
    </>
  );
};

export default DiceRollerView;
