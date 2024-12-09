import { SolutionFunction } from "../../day_solution.ts";
import { assert } from "../../utils/assert.ts";

type Coord = {
  x: number;
  y: number;
};

type Map = string[][];

export const part1: SolutionFunction = (input) => {
  const map = input.split("\n").map((s) => s.split(""));
  return findVisited(map).count();
};

export const part2: SolutionFunction = (input) => {
  const map = input.split("\n").map((s) => s.split(""));
  const visited = findVisited(map);
  const loopObstacles = visited.data.filter((pos) => {
    return checkLoop(map, pos);
  });
  return loopObstacles.length;
};

function add(a: Coord, b: Coord): Coord {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

function isSame(a: Coord, b: Coord): boolean {
  return a.x === b.x && a.y === b.y;
}

function isObstruction(map: Map, coord: Coord): boolean {
  return map[coord.y][coord.x] === "#";
}

function rotateLeft(direction: Coord): Coord {
  if (direction.x == 0 && direction.y == 1) {
    return { x: -1, y: 0 };
  }
  if (direction.x == 1 && direction.y == 0) {
    return { x: 0, y: 1 };
  }
  if (direction.x == 0 && direction.y == -1) {
    return { x: 1, y: 0 };
  }
  return { x: 0, y: -1 };
}

function isOutOfBound(map: Map, position: Coord): boolean {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= map.length ||
    position.y >= map.length
  );
}

class CoordSet {
  data: Coord[] = [];

  add(coord: Coord) {
    if (this.data.find((value) => isSame(value, coord))) return;
    this.data.push(coord);
  }

  count(): number {
    return this.data.length;
  }
}

function findVisited(map: Map): CoordSet {
  const startingRow = map.findIndex((row) => row.includes("^"));
  let pos = {
    x: map[startingRow].indexOf("^"),
    y: startingRow,
  };
  const visited = new CoordSet();
  let direction = {
    x: 0,
    y: -1,
  };
  while (!isOutOfBound(map, pos)) {
    visited.add(pos);
    let next = add(pos, direction);
    if (isOutOfBound(map, next)) {
      break;
    }
    while (isObstruction(map, next)) {
      direction = rotateLeft(direction);
      next = add(pos, direction);
    }
    pos = next;
  }
  return visited;
}

class CoordDirectionSet {
  data = new Set<string>();

  visit(coord: Coord, direction: Coord): boolean {
    const key = JSON.stringify({ coord, direction });
    const isLoop = this.data.has(key);
    if (isLoop) return true;
    this.data.add(key);
    return false;
  }
}

function checkLoop(map: Map, obstacle: Coord): boolean {
  const startingRow = map.findIndex((row) => row.includes("^"));
  let guardPos = {
    x: map[startingRow].indexOf("^"),
    y: startingRow,
  };
  if (isSame(guardPos, obstacle)) return false;

  const oldValue = map[obstacle.y][obstacle.x];
  map[obstacle.y][obstacle.x] = "#";

  let direction = {
    x: 0,
    y: -1,
  };
  const queue = new CoordDirectionSet();
  while (true) {
    let next = add(guardPos, direction);
    while (!isOutOfBound(map, next) && !isObstruction(map, next)) {
      guardPos = next;
      next = add(guardPos, direction);
    }
    if (isOutOfBound(map, next)) {
      map[obstacle.y][obstacle.x] = oldValue;
      return false;
    }
    assert(isObstruction(map, next), "Need to be obstruction");
    if (queue.visit(next, direction)) {
      map[obstacle.y][obstacle.x] = oldValue;
      return true;
    }
    while (isObstruction(map, next)) {
      direction = rotateLeft(direction);
      next = add(guardPos, direction);
    }
  }
}
