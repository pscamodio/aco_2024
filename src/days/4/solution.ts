import { SolutionFunction } from "../../day_solution.ts";

export const part1: SolutionFunction = (input) => {
  const rows = lines(input);
  const cols = columns(rows);
  const leftD = leftDiagonals(rows);
  const rightD = rightDiagonals(rows);
  const toCheck = [...rows, ...cols, ...leftD, ...rightD];
  return toCheck.flatMap(countXMas).reduce((val, next) => val + next, 0);
};

export const part2: SolutionFunction = (input) => {
  // prettier-ignore
  const MASKS = [
    [
        "M.S", 
        ".A.", 
        "M.S"
    ],
    [
        "M.M", 
        ".A.", 
        "S.S"
    ],
    [
        "S.M", 
        ".A.", 
        "S.M"
    ],
    [
        "S.S", 
        ".A.", 
        "M.M"
    ],
  ];

  const rows = lines(input);
  const size = rows.length;
  let cnt = 0;
  for (let rowId = 0; rowId < size - 2; rowId++) {
    for (let colId = 0; colId < size - 2; colId++) {
      for (const mask of MASKS) {
        if (checkMask(rows, mask, rowId, colId)) {
          cnt++;
        }
      }
    }
  }
  return cnt;
};

function lines(input: string): string[] {
  return input.split("\n");
}

function columns(rows: string[]): string[] {
  const size = rows.length;
  const cols = Array.from(new Array(size), () => "");
  for (let id = 0; id < size; ++id) {
    for (let colId = 0; colId < size; colId++) {
      cols[colId] += rows[id][colId];
    }
  }
  return cols;
}

function leftDiagonals(rows: string[]): string[] {
  const size = rows.length;
  const diags = [];
  for (let colId = 0; colId < size - 3; ++colId) {
    let diag = "";
    for (let id = 0; id < size - colId; ++id) {
      diag += rows[id][colId + id];
    }
    diags.push(diag);
  }
  for (let rowId = 1; rowId < size - 3; ++rowId) {
    let diag = "";
    for (let id = 0; id < size - rowId; ++id) {
      diag += rows[rowId + id][id];
    }
    diags.push(diag);
  }
  return diags;
}

function rightDiagonals(rows: string[]): string[] {
  const size = rows.length;
  const diags = [];
  for (let colId = 3; colId < size; ++colId) {
    let diag = "";
    for (let id = 0; id < colId + 1; ++id) {
      diag += rows[id][colId - id];
    }
    diags.push(diag);
  }
  for (let rowId = 1; rowId < size - 3; ++rowId) {
    let diag = "";
    for (let id = 0; id < size - rowId; ++id) {
      diag += rows[rowId + id][size - id - 1];
    }
    diags.push(diag);
  }
  return diags;
}

function countXMas(line: string): number {
  const frontMatches = line.matchAll(/XMAS/g).toArray().length;
  const inverted = line.split("").toReversed().join("");
  const reverseMatches = inverted.matchAll(/XMAS/g).toArray().length;
  return frontMatches + reverseMatches;
}

function checkMask(
  input: string[],
  mask: string[],
  startRow: number,
  startCol: number
): boolean {
  const sz = mask.length;
  for (let row = 0; row < sz; row++) {
    for (let col = 0; col < sz; col++) {
      const maskVal = mask[row][col];
      const inputVal = input[startRow + row][startCol + col];
      if (maskVal !== "." && maskVal !== inputVal) {
        return false;
      }
    }
  }
  return true;
}
