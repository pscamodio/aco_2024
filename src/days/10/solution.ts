import { SolutionFunction } from "../../day_solution.ts";
import { memoize } from "../../utils/memoize.ts";
import {
  findAll,
  getCell,
  Grid,
  isInside,
  parseGrid,
} from "../../utils/grid.ts";
import { ObjectSet } from "../../utils/object-set.ts";
import { add, Vec2 } from "../../utils/vec2.ts";

export const part1: SolutionFunction = (input) => {
  const grid = parseGrid(input, parseFloat);
  const trailHeads = findAll(grid, 0);
  return trailHeads.reduce(
    (val, head) => val + computeTrailScore(grid, head),
    0
  );
};

export const part2: SolutionFunction = (input) => {
  const grid = parseGrid(input, parseFloat);
  const trailHeads = findAll(grid, 0);
  return trailHeads.reduce(
    (val, head) => val + computeTrailRating(grid, head),
    0
  );
};

function computeTrailScore(grid: Grid<number>, trailHead: Vec2): number {
  const findFunction = memoize(findPeaks, (_, pos) => JSON.stringify(pos));
  const peaks: Vec2[] = [];
  findFunction(grid, trailHead, peaks);
  return new ObjectSet<Vec2>(peaks).size;
}

function computeTrailRating(grid: Grid<number>, trailHead: Vec2): number {
  const findFunction = memoize(findPeaks, (_, pos) => JSON.stringify(pos));
  const peaks: Vec2[] = [];
  findFunction(grid, trailHead, peaks);
  return peaks.length;
}

function findPeaks(grid: Grid<number>, pos: Vec2, peaks: Vec2[]) {
  if (getCell(grid, pos) === 9) {
    peaks.push(pos);
    return;
  }
  const paths = findPaths(grid, pos);
  for (const path of paths) {
    findPeaks(grid, path, peaks);
  }
}

function findPaths(grid: Grid<number>, pos: Vec2): Vec2[] {
  const possiblePaths: Vec2[] = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ].map((dir) => add(pos, dir));
  const posHeight = getCell(grid, pos);
  return possiblePaths.filter(
    (path) => isInside(grid, path) && getCell(grid, path) === posHeight + 1
  );
}
