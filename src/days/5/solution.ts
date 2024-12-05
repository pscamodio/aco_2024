import { SolutionFunction } from "../../day_solution.ts";

export const part1: SolutionFunction = (input) => {
  const { rules, updates } = parseInput(input);
  let total = 0;
  for (const update of updates) {
    if (isUpdateSorted(update, rules)) {
      const idx = Math.floor(update.length / 2);
      total += update[idx];
    }
  }
  return total;
};

export const part2: SolutionFunction = (input) => {
  const { rules, updates } = parseInput(input);
  let total = 0;
  for (const update of updates) {
    if (isUpdateSorted(update, rules)) continue;
    const sorted = toSorted(update, rules);
    console.log(update, sorted);
    const idx = Math.floor(sorted.length / 2);
    total += sorted[idx];
  }
  return total;
};

type Rule = {
  before: number;
  after: number;
};

type Update = number[];

function parseInput(input: string): { rules: Rule[]; updates: Update[] } {
  const rules: Rule[] = [];
  const updates: Update[] = [];
  const lines = input.split("\n");

  let parsingRules = true;

  for (const line of lines) {
    if (line.length === 0) {
      parsingRules = false;
      continue;
    }
    if (parsingRules) {
      const [before, after] = line.split("|").map(parseFloat);
      rules.push({ before, after });
    } else {
      updates.push(line.split(",").map(parseFloat));
    }
  }

  return { rules, updates };
}

function isUpdateSorted(update: number[], rules: Rule[]) {
  for (let i = 0; i < update.length - 1; i++) {
    for (let j = i + 1; j < update.length; j++) {
      if (!checkRules(update[i], update[j], rules)) {
        return false;
      }
    }
  }
  return true;
}

function checkRules(a: number, b: number, rules: Rule[]): boolean {
  for (const rule of rules) {
    if (rule.before === b && rule.after === a) {
      return false;
    }
  }
  return true;
}

function toSorted(update: number[], rules: Rule[]): number[] {
  return update.toSorted((a, b) => {
    if (rules.find((r) => r.before === a && r.after === b)) {
      return -1;
    }
    if (rules.find((r) => r.before === b && r.after === a)) {
      return +1;
    }
    return 0;
  });
}
