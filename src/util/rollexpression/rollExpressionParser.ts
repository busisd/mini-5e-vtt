import { peek } from "../util";

export enum OperatorType {
  PLUS = "PLUS",
  MINUS = "MINUS",
  TIMES = "TIMES",
  DIVIDE = "DIVIDE",
}

export type Operator = {
  operator: OperatorType;
};

export type RollOperand = {
  numberOfDice: number;
  sidesPerDie: number;
  recursiveReroll: number;
  reroll: number;
  pickLowest: number;
  pick: number;
  drop: number;
};

export type NumberOperand = {
  value: number;
};

type ExpressionOperand = {
  operator: Operator;
  lhs: Operand;
  rhs: Operand;
};

export type ParsedToken = Operator | RollOperand | NumberOperand;

export type Operand = ExpressionOperand | RollOperand | NumberOperand;

const OPERATOR_PRECEDENCE = {
  [OperatorType.TIMES]: 2,
  [OperatorType.DIVIDE]: 2,
  [OperatorType.PLUS]: 1,
  [OperatorType.MINUS]: 1,
};

const precedence = (operator: Operator) => {
  return OPERATOR_PRECEDENCE[operator.operator];
};

const isOperator = (parsedToken: ParsedToken) => {
  return "operator" in parsedToken;
};

export const parseRollExpression = (
  parsedTokensOriginal: ParsedToken[],
): Operand => {
  if (parsedTokensOriginal.length === 0) {
    throw new Error("Received empty list of tokens");
  }

  const parsedTokens = [...parsedTokensOriginal];

  const operandStack: Operand[] = [];
  const operatorStack: Operator[] = [];

  // Shunting yard algorithm
  while (parsedTokens.length > 0) {
    const currentOperand = parsedTokens.shift();
    if (currentOperand == null || isOperator(currentOperand)) {
      throw new Error(
        `Expected an operand, but received: ${JSON.stringify(currentOperand)}`,
      );
    }
    operandStack.push(currentOperand);

    if (parsedTokens.length === 0) {
      break;
    }
    const currentOperator = parsedTokens.shift();
    if (currentOperator == null || !isOperator(currentOperator)) {
      throw new Error(
        `Expected an operator, but received: ${JSON.stringify(currentOperator)}`,
      );
    }

    while (
      operatorStack.length > 0 &&
      precedence(currentOperator) <= precedence(peek(operatorStack))
    ) {
      addExpressionOperand(operandStack, operatorStack);
    }
    operatorStack.push(currentOperator);
  }

  while (operatorStack.length > 0) {
    addExpressionOperand(operandStack, operatorStack);
  }

  if (operandStack.length > 1) {
    throw new Error(
      `Ended up with multiple operands: ${JSON.stringify(operandStack)}`,
    );
  }

  return operandStack[0];
};

/**
 * Pops the top two operands, and the top operator, and uses them
 * to generate an ExpressionOperand which is pushed onto the Operand
 * stack.
 * @param operandStack
 * @param operatorStack
 */
const addExpressionOperand = (
  operandStack: Operand[],
  operatorStack: Operator[],
) => {
  if (operatorStack.length < 1 || operandStack.length < 2) {
    throw new Error(
      `Too few operators or operands: ${JSON.stringify(operatorStack)}, ${JSON.stringify(operandStack)}`,
    );
  }
  const expressionOperand: ExpressionOperand = {
    operator: operatorStack.pop() as Operator,
    rhs: operandStack.pop() as Operand,
    lhs: operandStack.pop() as Operand,
  };
  operandStack.push(expressionOperand);
};
