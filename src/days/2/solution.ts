import { SolutionFunction } from "../../day_solution.ts";

export const part1: SolutionFunction = (input) => {
  const levels = parseInput(input);

  return levels.filter(checkIsSafe).length;
};

export const part2: SolutionFunction = (input) => {
  const levels = parseInput(input);

  return levels.filter((level) => {
    if (checkIsSafe(level)) {
      return true;
    } else {
      for (const dampened of getDampenedLevels(level)) {
        if (checkIsSafe(dampened)) {
          return true;
        }
      }
    }
    return false;
  }).length;
};

type Level = number[];

type Direction = 1 | -1;

function parseInput(input: string): Level[] {
  return input.split("\n").map((line) => line.split(" ").map(parseFloat));
}

function checkChange(
  first: number,
  second: number,
): { direction: Direction; change: number } {
  const diff = second - first;
  const change = Math.abs(diff);
  const direction = diff > 0 ? 1 : -1;
  return { direction, change };
}

function checkIsSafe(level: Level): boolean {
  let isSafe = true;
  let levelDirection: 1 | -1;
  for (const [index, value] of level.entries()) {
    if (!isSafe || index == level.length - 1) break;

    const { direction, change } = checkChange(value, level[index + 1]);
    levelDirection ??= direction;
    isSafe &&= levelDirection === direction && change !== 0 && change <= 3;
  }
  return isSafe;
}

function getDampenedLevels(level: Level): Level[] {
  const levels: Level[] = [];
  for (const index of level.keys()) {
    const dampened = [...level];
    dampened.splice(index, 1);
    levels.push(dampened);
  }
  return levels;
}
