import { SolutionFunction } from "../../day_solution.ts";
import {
  findAll,
  forEachCell,
  Grid,
  isInside,
  next,
  parseGrid,
} from "../../utils/grid.ts";
import { ObjectSet } from "../../utils/object-set.ts";
import { add, sub, Vec2 } from "../../utils/vec2.ts";

export const part1: SolutionFunction = (input) => {
  const grid = parseGrid(input);
  const antinodes = new ObjectSet<Vec2>();
  forEachCell(grid, (coord, value) => {
    if (value === ".") return;
    const others = findAll(grid, value, next(grid, coord));
    for (const other of others) {
      const diff = sub(other, coord);
      if (isInside(grid, sub(coord, diff))) {
        antinodes.add(sub(coord, diff));
      }
      if (isInside(grid, add(other, diff))) {
        antinodes.add(add(other, diff));
      }
    }
  });
  return antinodes.size;
};

export const part2: SolutionFunction = (input) => {
  const grid = parseGrid(input);
  const antinodes = new ObjectSet<Vec2>();
  forEachCell(grid, (coord, value) => {
    if (value === ".") return;
    const others = findAll(grid, value, next(grid, coord));
    if (others.length > 0) antinodes.add(coord);
    for (const other of others) {
      const diff = sub(other, coord);
      checkBefore(grid, antinodes, coord, diff);
      checkAfter(grid, antinodes, coord, diff);
    }
  });
  return antinodes.size;
};

function checkBefore(
  grid: Grid<string>,
  antinodes: ObjectSet<Vec2>,
  coord: Vec2,
  diff: Vec2
): void {
  let toCheck = sub(coord, diff);
  while (isInside(grid, toCheck)) {
    antinodes.add(toCheck);
    toCheck = sub(toCheck, diff);
  }
}

function checkAfter(
  grid: Grid<string>,
  antinodes: ObjectSet<Vec2>,
  coord: Vec2,
  diff: Vec2
): void {
  let toCheck = add(coord, diff);
  while (isInside(grid, toCheck)) {
    antinodes.add(toCheck);
    toCheck = add(toCheck, diff);
  }
}
