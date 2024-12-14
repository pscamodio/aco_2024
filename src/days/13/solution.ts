import { SolutionFunction } from "../../day_solution.ts";
import { assert } from "../../utils/assert.ts";
import { add, Vec2 } from "../../utils/vec2.ts";

const PRICES: Vec2 = {
  x: 3,
  y: 1,
};

const OFFSET = 10_000_000_000_000;

export const part1: SolutionFunction = (input) => {
  const arcade = parse(input);
  const wins = arcade.map(computePresses).filter(({ x, y }) => {
    return Number.isInteger(x) && Number.isInteger(y);
  });
  return wins.reduce(
    (tot, next) => tot + next.x * PRICES.x + next.y * PRICES.y,
    0
  );
};

export const part2: SolutionFunction = (input) => {
  const arcade = parse(input).map((claw) => ({
    ...claw,
    prize: add(claw.prize, { x: OFFSET, y: OFFSET }),
  }));
  const wins = arcade.map(computePresses).filter(({ x, y }) => {
    return Number.isInteger(x) && Number.isInteger(y);
  });
  return wins.reduce(
    (tot, next) => tot + next.x * PRICES.x + next.y * PRICES.y,
    0
  );
};

type ClawMachine = {
  a: Vec2;
  b: Vec2;
  prize: Vec2;
};

type Arcade = ClawMachine[];

function computePresses(machine: ClawMachine): Vec2 {
  const { a, b, prize } = machine;
  const D = a.x * b.y - a.y * b.x;
  const Da = prize.x * b.y - prize.y * b.x;
  const Db = a.x * prize.y - a.y * prize.x;

  const aPresses = Da / D;
  const bPresses = Db / D;
  return {
    x: aPresses,
    y: bPresses,
  };
}

function parse(input: string): Arcade {
  const machines = input.split("\n\n");
  return machines.map(parseMachine);
}

function parseMachine(input: string): ClawMachine {
  const [a, b, prize] = input.split("\n");
  return {
    a: parseButton(a),
    b: parseButton(b),
    prize: parsePrize(prize),
  };
}

function parseButton(input: string): Vec2 {
  const matches = input.match(/X\+(\d+), Y\+(\d+)/);
  assert(matches, "Invalid button");
  return {
    x: +matches[1],
    y: +matches[2],
  };
}

function parsePrize(input: string): Vec2 {
  const matches = input.match(/X=(\d+), Y=(\d+)/);
  assert(matches, "Invalid prize");
  return {
    x: +matches[1],
    y: +matches[2],
  };
}
