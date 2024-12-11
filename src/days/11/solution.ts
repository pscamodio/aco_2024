import { SolutionFunction } from "../../day_solution.ts";
import { memoize } from "../../utils/memoize.ts";

export const part1: SolutionFunction = (input) => {
  const startValues = input.split(" ").map(parseFloat);
  const stones = startValues.reduce(
    (tot, value) => tot + countExpansions(value, 25),
    0
  );
  return stones;
};

export const part2: SolutionFunction = (input) => {
  const startValues = input.split(" ").map(parseFloat);
  const stones = startValues.reduce(
    (tot, value) => tot + countExpansions(value, 75),
    0
  );
  return stones;
};

const countExpansions = memoize((value: number, iterations: number): number => {
  if (iterations === 0) return 1;
  const expand = blink(value);
  return expand.reduce(
    (tot, val) => tot + countExpansions(val, iterations - 1),
    0
  );
});

const blink = memoize((value: number): number[] => {
  if (value === 0) {
    return [1];
  } else if (value.toString().length % 2 == 0) {
    const strValue = value.toString();
    const val1 = +strValue.substring(0, strValue.length / 2);
    const val2 = +strValue.substring(strValue.length / 2);
    return [val1, val2];
  }
  return [value * 2024];
});
