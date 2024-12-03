import { assert } from "../../assert.ts";
import { SolutionFunction } from "../../day_solution.ts";

export const part1: SolutionFunction = (input) => {
  const matches = input.matchAll(/mul\(\d{1,3},\d{1,3}\)/g);
  let total = 0;
  for (const match of matches) {
    total += runMul(match.toString());
  }
  return total;
};

export const part2: SolutionFunction = (input) => {
  const regex = /do\(\)|don't\(\)|mul\(\d{1,3},\d{1,3}\)/gm;
  const matches = input.matchAll(regex);
  let total = 0;
  let mulEnabled = true;
  for (const match of matches) {
    if (match.toString() === "do()") {
      mulEnabled = true;
    } else if (match.toString() === "don't()") {
      mulEnabled = false;
    } else {
      if (mulEnabled) {
        total += runMul(match.toString());
      }
    }
  }
  return total;
};

function runMul(token: string): number {
  const matches = token.match(/mul\((\d+),(\d+)\)/);
  assert(matches, "Invalid mul string");
  const val1 = matches[1];
  const val2 = matches[2];
  return +val1 * +val2;
}
