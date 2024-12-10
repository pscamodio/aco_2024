import { assert } from "./assert.ts";
import { Vec2 } from "./vec2.ts";

export type GridValues = number | string;

export type Grid<T extends GridValues = GridValues> = Array<Array<T>>;

export type ValueParser<T extends GridValues> = (value: string) => T;

export function parseGrid(input: string): Grid<string>;
export function parseGrid(
  input: string,
  valueParser: ValueParser<number>
): Grid<number>;
export function parseGrid<T extends GridValues>(
  input: string,
  valueParser?: ValueParser<T>
): Grid<T> {
  const grid = input
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split(""));
  assert(
    grid.every((row) => row.length === grid[0].length),
    "input is not an uniform grid"
  );
  if (valueParser) {
    return grid.map((row) => row.map(valueParser));
  }
  // @ts-expect-error if no value parser is defined the expected return is a grid of strings
  return grid;
}

export function forEachCell<T extends GridValues>(
  grid: Grid<T>,
  cbk: (coord: Vec2, value: T) => void,
  start: Vec2 = { x: 0, y: 0 }
): void {
  const { width, height } = gridSize(grid);
  for (let y = start.y; y < height; y++) {
    for (let x = y == start.y ? start.x : 0; x < width; x++) {
      cbk({ x, y }, getCell(grid, { x, y }));
    }
  }
}

export function next(grid: Grid, coord: Vec2): Vec2 {
  const { width } = gridSize(grid);
  if (coord.x === width - 1) {
    return {
      x: 0,
      y: coord.y + 1,
    };
  }
  return {
    x: coord.x + 1,
    y: coord.y,
  };
}

export function findAll<T extends GridValues>(
  grid: Grid<T>,
  toFind: T,
  start: Vec2 = { x: 0, y: 0 }
): Vec2[] {
  const coords: Vec2[] = [];
  forEachCell(
    grid,
    (coord, value) => {
      if (value === toFind) {
        coords.push(coord);
      }
    },
    start
  );
  return coords;
}

export function gridSize(grid: Grid): { width: number; height: number } {
  const width = grid[0].length;
  const height = grid.length;
  return { width, height };
}

export function isInside(grid: Grid, coord: Vec2) {
  const width = grid[0].length;
  const height = grid.length;
  const { x, y } = coord;
  return x >= 0 && y >= 0 && x < width && y < height;
}

export function getCell<T extends GridValues>(grid: Grid<T>, coord: Vec2): T {
  const value = grid.at(coord.y)?.at(coord.x);
  assert(
    value !== undefined,
    `Grid access out of bound. Grid width ${grid[0].length}, Grid height ${
      grid.length
    }, coord ${JSON.stringify(coord)}`
  );
  return value;
}

export function printGrid<T extends number | string>(grid: Grid<T>): void {
  console.log(grid.map((row) => row.join("")).join("\n"));
}
