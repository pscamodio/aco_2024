import { assert } from "./assert.ts";
import { Vec2 } from "./vec2.ts";

export type GridValues = number | string;
export type ValueParser<T extends GridValues> = (value: string) => T;

export class Grid<T extends GridValues = GridValues> {
  constructor(public data: Array<Array<T>>) {
    assert(
      data.every((row) => row.length === data[0].length),
      "The grid is not uniform",
    );
  }

  get height(): number {
    return this.data.length;
  }

  get width(): number {
    return this.data[0].length;
  }

  forEachCell(
    cbk: (coord: Vec2, value: T) => void,
    start: Vec2 = { x: 0, y: 0 },
  ): void {
    assert(this.isInside(start), "Start index is out of bound");
    for (let y = start.y; y < this.height; y++) {
      for (let x = y == start.y ? start.x : 0; x < this.width; x++) {
        cbk({ x, y }, this.getCell({ x, y }));
      }
    }
  }

  next(coord: Vec2): Vec2 | undefined {
    assert(this.isInside(coord), "Index is out of bound");
    if (coord.x === this.width - 1) {
      if (coord.y === this.height - 1) return;
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

  findAll(toFind: T, start: Vec2 = { x: 0, y: 0 }): Vec2[] {
    assert(this.isInside(start), "Start index is out of bound");
    const coords: Vec2[] = [];
    this.forEachCell((coord, value) => {
      if (value === toFind) {
        coords.push(coord);
      }
    }, start);
    return coords;
  }

  isInside(coord: Vec2) {
    const { x, y } = coord;
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  getCell(coord: Vec2): T {
    assert(this.isInside(coord), "Start index is out of bound");
    const value = this.data[coord.y][coord.x];
    return value;
  }

  toString(): string {
    return this.data.map((row) => row.join("")).join("\n");
  }
}

export function parseGrid(input: string): Grid<string>;
export function parseGrid(
  input: string,
  valueParser: ValueParser<number>,
): Grid<number>;
export function parseGrid<T extends GridValues>(
  input: string,
  valueParser?: ValueParser<T>,
): Grid<T> {
  const grid = input
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split(""));
  assert(
    grid.every((row) => row.length === grid[0].length),
    "input is not an uniform grid",
  );
  if (valueParser) {
    return new Grid<T>(grid.map((row) => row.map(valueParser)));
  }
  // @ts-expect-error if no value parser is defined the expected return is a grid of strings
  return new Grid<T>(grid);
}
