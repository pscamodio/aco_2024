import { SolutionFunction } from "../../day_solution.ts";

export const part1: SolutionFunction = (input) => {
  const [list1, list2] = parseInput(input).map((l) => l.toSorted());

  return list1.reduce((prev, current, index) => {
    return prev + Math.abs(current - list2[index]);
  }, 0);
};

export const part2: SolutionFunction = (input) => {
  const [list1, list2] = parseInput(input).map((l) => l.toSorted());

  return list1.reduce((prev, current) => {
    return prev + current * list2.filter((val) => val === current).length;
  }, 0);
};

function parseInput(input: string): [number[], number[]] {
  const ret: [number[], number[]] = [[], []];
  input.split("\n").forEach((value) => {
    const [num1, num2] = value.split("   ");
    ret[0].push(parseInt(num1));
    ret[1].push(parseInt(num2));
  });
  return ret;
}
