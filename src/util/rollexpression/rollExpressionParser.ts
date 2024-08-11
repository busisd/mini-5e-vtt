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

export enum ParenType {
  L = "L",
  R = "R",
}

export type Paren = {
  paren: ParenType;
};

export const L_PAREN = "L_PAREN";
export const R_PAREN = "R_PAREN";

export type ContextOperand = {
  key: string;
  parenWrapped?: boolean;
};

export type RollOperand = {
  numberOfDice: number;
  sidesPerDie: number;
  recursiveReroll: number;
  reroll: number;
  pickLowest: number;
  pick: number;
  drop: number;
  parenWrapped?: boolean;
};

export type NumberOperand = {
  value: number;
  parenWrapped?: boolean;
};

type ExpressionOperand = {
  operator: Operator;
  lhs: Operand;
  rhs: Operand;
  parenWrapped?: boolean;
};

export type ParsedToken =
  | Operator
  | Paren
  | ContextOperand
  | RollOperand
  | NumberOperand;

export type Operand =
  | ExpressionOperand
  | ContextOperand
  | RollOperand
  | NumberOperand;

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

const isParen = (
  parsedToken: ParsedToken | undefined,
): parsedToken is Paren => {
  if (parsedToken == null) return false;
  return "paren" in parsedToken;
};

const isLParen = (
  parsedToken: ParsedToken | undefined,
): parsedToken is Paren => {
  return isParen(parsedToken) && parsedToken.paren === ParenType.L;
};

const isRParen = (
  parsedToken: ParsedToken | undefined,
): parsedToken is Paren => {
  return isParen(parsedToken) && parsedToken.paren === ParenType.R;
};

export const parseRollExpression = (
  parsedTokensOriginal: ParsedToken[],
): Operand => {
  if (parsedTokensOriginal.length === 0) {
    throw new Error("Received empty list of tokens");
  }

  const parsedTokens = [...parsedTokensOriginal];

  const operandStack: Operand[] = [];
  const operatorStack: (Operator | Paren)[] = [];

  // Shunting yard algorithm
  while (parsedTokens.length > 0) {
    let currentOperand = parsedTokens.shift();
    while (isLParen(currentOperand)) {
      operatorStack.push(currentOperand);
      currentOperand = parsedTokens.shift();
    }
    if (
      currentOperand == null ||
      isOperator(currentOperand) ||
      isParen(currentOperand)
    ) {
      throw new Error(
        `Expected an operand, but received: ${JSON.stringify(currentOperand)}`,
      );
    }
    operandStack.push(currentOperand);

    let currentOperator = parsedTokens.shift();
    while (isRParen(currentOperator)) {
      while (!isLParen(peek(operatorStack))) {
        if (operatorStack.length === 0) {
          throw new Error(
            "Found right-parenthesis without matching left-parenthesis",
          );
        }
        addExpressionOperand(operandStack, operatorStack);
      }

      // Pop the LParen off the operatorStack
      operatorStack.pop();
      peek(operandStack).parenWrapped = true;
      currentOperator = parsedTokens.shift();
    }
    if (currentOperator == null) {
      break;
    }
    if (!isOperator(currentOperator)) {
      throw new Error(
        `Expected an operator, but received: ${JSON.stringify(currentOperator)}`,
      );
    }

    while (
      operatorStack.length > 0 &&
      isOperator(peek(operatorStack)) &&
      precedence(currentOperator) <= precedence(peek(operatorStack) as Operator)
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
  operatorStack: (Operator | Paren)[],
) => {
  if (operatorStack.length < 1 || operandStack.length < 2) {
    throw new Error(
      `Too few operators or operands: ${JSON.stringify(operatorStack)}, ${JSON.stringify(operandStack)}`,
    );
  }
  if (isParen(peek(operatorStack))) {
    throw new Error("Expected operator but received parenthesis");
  }
  const expressionOperand: ExpressionOperand = {
    operator: operatorStack.pop() as Operator,
    rhs: operandStack.pop() as Operand,
    lhs: operandStack.pop() as Operand,
  };
  operandStack.push(expressionOperand);
};
