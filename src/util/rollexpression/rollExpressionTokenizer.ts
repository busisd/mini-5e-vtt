const whitespaceRegex = /\s/;
const operators = new Set(["+", "-", "*", "/"]);

class DiceStringIterator {
  #position: number;
  #end: number;
  #diceString: string;

  constructor(diceString: string) {
    this.#position = 0;
    this.#diceString = diceString.trim();
    this.#end = this.#diceString.length;
  }

  #charAt(index: number) {
    return this.#diceString[index];
  }

  #currentChar(): string {
    return this.#charAt(this.#position);
  }

  #nextChar(): string {
    this.#position++;
    return this.#currentChar();
  }

  nextToken(): string {
    // Skip whitespace
    while (whitespaceRegex.test(this.#currentChar())) {
      this.#position++;
    }

    let currentChar = this.#currentChar();

    // If it's a length-1 operator, return immediately
    if (operators.has(currentChar)) {
      this.#position++;
      return currentChar;
    }

    // Iterate until the next whitespace or operator
    const startingPosition = this.#position;
    do {
      currentChar = this.#nextChar();
    } while (
      !whitespaceRegex.test(currentChar) &&
      !operators.has(currentChar) &&
      this.hasNext()
    );

    return this.#diceString.substring(startingPosition, this.#position);
  }

  hasNext(): boolean {
    return this.#position < this.#end;
  }
}

export const tokenizeDiceString = (diceStr: string): string[] => {
  const tokens: string[] = [];
  const iterator = new DiceStringIterator(diceStr ?? "");
  while (iterator.hasNext()) {
    tokens.push(iterator.nextToken());
  }
  return tokens;
};
