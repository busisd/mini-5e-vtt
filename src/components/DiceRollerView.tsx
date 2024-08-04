import React, { useCallback, useState } from "react";
import DieSvg, { TextSvg } from "../svg/DieSvg";
import {
  DiceExpressionResult,
  evaluateDiceExpression,
  EvaluatedResultEntry,
} from "../util/rollexpression/rollExpressionEvaluator";
import { OperatorType } from "../util/rollexpression/rollExpressionParser";
import "./DiceRollerView.css";

const getErrorMessage = (e: unknown) =>
  (e as Error)?.message ?? "Unknown error";

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
    case OperatorType.DIVIDE:
      return "/";
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
//  - Bulk roll + histogram
//  - Fix svg widths for text - all dice in one svg?

const DiceRollerView = () => {
  const [rawInput, setRawInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [results, setResults] = useState<DiceExpressionResult[]>([]);

  const onSubmit = useCallback(() => {
    setInputError(null);

    try {
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
      <button onClick={onSubmit}>Roll dice</button>{" "}
      <button onClick={() => setResults([])}>Clear</button>
      <br />
      {results.map((result) => (
        // <DiceRollResultDisplay key={result.id} result={result} />
        <DiceExpressionResultDisplay key={result.id} result={result} />
      ))}
    </>
  );
};

export default DiceRollerView;
