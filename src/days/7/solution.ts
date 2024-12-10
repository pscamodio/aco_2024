import { SolutionFunction } from "../../day_solution.ts";
import { memoize } from "../../utils/memoize.ts";

export const part1: SolutionFunction = (input) => {
  return computeCalibrationResult(input, ["+", "*"]);
};

export const part2: SolutionFunction = (input) => {
  return computeCalibrationResult(input, ["+", "*", "||"]);
};

type InputEquation = {
  /** Expected result of the equation */
  target: number;

  /** Values of the equation */
  values: number[];
};

/**
 * @param input to parse
 * @returns the list of equation to check
 */
function parseInput(input: string): InputEquation[] {
  return input.split("\n").map((line) => {
    const [target, valuesString] = line.split(":");
    const values = valuesString.trim().split(" ").map(parseFloat);
    return { target: parseFloat(target), values };
  });
}

/** All possible operations to use to compose the equation */
type PossibleOperations =
  /** Multiplication (a, b) => a * b */
  | "*"
  /** Sum (a, b) => a + b */
  | "+"
  /** String Catenation (a, b) => ab */
  | "||";

/**
 * @param input data to analize
 * @param allowedOperations list of allowed operations while composing equations
 * @returns the sum of the values of all the input equations that have a valid set of operations
 */
function computeCalibrationResult(
  input: string,
  allowedOperations: Array<PossibleOperations>,
): number {
  const equations = parseInput(input);
  let totalCalibrationValue = 0;
  for (const eq of equations) {
    const combinations = generateOpCombinations(
      eq.values.length - 1,
      allowedOperations,
    );
    for (const operations of combinations) {
      const eqResult = evaluateEquations(eq.values, operations);
      if (eqResult === eq.target) {
        totalCalibrationValue += eq.target;
        break;
      }
    }
  }
  return totalCalibrationValue;
}

/**
 * @param length of the operations list (one less the number of equation values)
 * @param allowedOperations that can be used in composing the full equation
 * @returns all the possible combinations of the operations
 */
const generateOpCombinations = memoize(function generateOpCombinations<
  const Operations extends PossibleOperations[] = PossibleOperations[],
>(
  length: number,
  allowedOperations: Operations,
): Array<Array<Operations[number]>> {
  const combinations: Array<Array<Operations[number]>> = [];
  for (let i = 0; i < Math.pow(allowedOperations.length, length); i++) {
    combinations.push(
      i
        .toString(allowedOperations.length)
        .padStart(length, "0")
        .split("")
        .map((x) => allowedOperations[+x]),
    );
  }
  return combinations;
});

/**
 * @param values of the equations
 * @param operations for the equations
 * @returns the result of evaluating the equations with the values and operations passed
 */
function evaluateEquations(
  values: number[],
  operations: PossibleOperations[],
): number {
  let res = values[0];
  for (const [index, op] of operations.entries()) {
    if (op === "+") {
      res += values[index + 1];
    } else if (op === "*") {
      res *= values[index + 1];
    } else {
      res = parseFloat(res.toString() + values[index + 1].toString());
    }
  }
  return res;
}
