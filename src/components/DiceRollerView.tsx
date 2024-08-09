import React, { useCallback, useState } from "react";
import DieSvg, { TextSvg } from "../svg/DieSvg";
import {
  DiceExpressionResult,
  evaluateDiceExpression,
  EvaluatedResultEntry,
} from "../util/rollexpression/rollExpressionEvaluator";
import { OperatorType } from "../util/rollexpression/rollExpressionParser";
import "./DiceRollerView.css";
import { Field, Form, Formik } from "formik";

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

const dieRollColor = (roll: number, sidesPerDie: number) => {
  if (roll === sidesPerDie) {
    return "green";
  } else if (roll === 1) {
    return "maroon";
  } else {
    return "black";
  }
};

const droppedDieRollColor = (roll: number, sidesPerDie: number) => {
  if (roll === sidesPerDie) {
    return "#96c996";
  } else if (roll === 1) {
    return "#e7b4b4";
  } else {
    return "lightgrey";
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
                  color={dieRollColor(dieRoll.roll, resultEntry.sidesPerDie)}
                />
              ))}
              {resultEntry.droppedRolls.map((dieRoll) => (
                <DieSvg
                  key={dieRoll.id}
                  sides={resultEntry.sidesPerDie}
                  text={dieRoll.roll}
                  color={droppedDieRollColor(
                    dieRoll.roll,
                    resultEntry.sidesPerDie,
                  )}
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
      <br />
      <TextSvg text={`Total: ${result.total}`} height={60} />
      <hr />
    </>
  );
};

// TODO:
//  - Store results in Redux so that they're maintained when switching tabs
//  - Store results in scrollable panel
//  - Support parens
//  - Context reference values?
//  - Show rerolls in tooltip or on-click in little popup
//  - Bulk roll + histogram

const DiceRollerView = () => {
  const [inputError, setInputError] = useState<string | null>(null);
  const [results, setResults] = useState<DiceExpressionResult[]>([]);

  const onSubmit = useCallback(
    ({ diceRollExpression }: { diceRollExpression: string }) => {
      setInputError(null);

      try {
        const evaluatedExpression = evaluateDiceExpression(diceRollExpression);

        setResults((currentResults) => [
          evaluatedExpression,
          ...currentResults,
        ]);
      } catch (e) {
        setInputError(getErrorMessage(e));
      }
    },
    [],
  );

  return (
    <>
      <Formik initialValues={{ diceRollExpression: "" }} onSubmit={onSubmit}>
        {() => (
          <Form>
            <Field name="diceRollExpression" placeholder="Example: 1d8 + 2" />
            {inputError && <span className="input-error"> {inputError} </span>}
            <br />
            <button type="submit">Roll dice</button>{" "}
            <button onClick={() => setResults([])} type="button">
              Clear
            </button>
          </Form>
        )}
      </Formik>
      {results.map((result) => (
        <DiceExpressionResultDisplay key={result.id} result={result} />
      ))}
    </>
  );
};

export default DiceRollerView;
