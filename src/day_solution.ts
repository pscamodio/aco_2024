import { assert } from "./assert.ts";

export type SolutionFunction = (input: string) => Promise<string>;

type DaySolution = {
  part1: SolutionFunction;
  part2: SolutionFunction;
};

export async function run(
  day: number,
  part: 1 | 2,
  demo = false
): Promise<string> {
  const solutionUrl = `./days/${day}/solution.ts`;
  const solution = await import(solutionUrl);
  assert(isDaySolution(solution), `${solutionUrl} is not a valid day solution`);

  const input = await loadInput(day, demo);

  return solution[`part${part}`](input);
}

function loadInput(day: number, demo = false): Promise<string> {
  const inputUrl = `./src/days/${day}/${demo ? "demo_" : ""}input.txt`;
  return Deno.readTextFile(inputUrl);
}

function isDaySolution(module: unknown): module is DaySolution {
  return (
    typeof module === "object" &&
    !!module &&
    "part1" in module &&
    "part2" in module
  );
}
