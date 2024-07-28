import { useCallback, useState } from "react";
import "./DiceRollerView.css";
import random from "lodash/random";
import uniqueId from "lodash/uniqueId";
import DieSvg from "../svg/DieSvg";

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

const parseDiceString = (damageStr: string): DiceRollDefinition => {
  if (damageStr == null || damageStr.length === 0) {
    throw new Error("Enter an expression");
  }

  const tokens = damageStr.split("+").map((token) => token.trim());

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
        <DieSvg key={index} sides={dieRoll.sides} text={dieRoll.result} />
      ))}
      <br />
    </>
  );
};

// TODO:
//  - Store results in Redux so that they're maintained when switching tabs
//  - Better tokenizer and parser, support negative modifiers and parens
//  - More flexible definition and result types, support re-roll and drop modifiers on tokens
//  - Store results in scrollable panel

const DiceRollerView = () => {
  const [rawInput, setRawInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [results, setResults] = useState<DiceRollResult[]>([]);

  const onSubmit = useCallback(() => {
    setInputError(null);

    try {
      const parsedInput = parseDiceString(rawInput);
      const result = rollDice(parsedInput);
      setResults((currentResults) => [result, ...currentResults]);
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
        <DiceRollResultDisplay key={result.id} result={result} />
      ))}
    </>
  );
};

export default DiceRollerView;
