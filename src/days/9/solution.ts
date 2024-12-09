import { SolutionFunction } from "../../day_solution.ts";
import { assert } from "../../utils/assert.ts";

export const part1: SolutionFunction = (input) => {
  const desc = input.split("").map(parseFloat);

  const blocks: string[] = [];
  for (const [index, value] of desc.entries()) {
    const isEmpty = index % 2 == 1;
    if (isEmpty) {
      blocks.push(...".".repeat(value));
    } else {
      const fileId = index / 2;
      for (let i = 0; i < value; ++i) {
        blocks.push(fileId.toString());
      }
    }
  }

  let emptyBlockId = blocks.findIndex((block) => block === ".");
  while (emptyBlockId != -1) {
    const toCopy: string | undefined = blocks.pop();
    assert(toCopy, "block list should not be empty");
    blocks[emptyBlockId] = toCopy;
    while (blocks.at(-1) === ".") {
      blocks.pop();
    }
    emptyBlockId = blocks.findIndex((block) => block === ".");
  }

  let checksum = 0;
  for (const [index, value] of blocks.entries()) {
    checksum += index * +value;
  }

  return checksum;
};

type Block = {
  size: number;
  id?: number;
};

type Disk = Array<Block>;

function isValid<T>(x: T | undefined): x is T {
  return !!x;
}

export const part2: SolutionFunction = (input) => {
  const disk = parseInput(input);
  const candidates = disk
    .map((block) => block.id)
    .filter(isValid)
    .reverse();

  // Defragment
  for (const toMove of candidates) {
    const toMoveIndex = disk.findIndex((block) => block.id === toMove);
    if (toMoveIndex === -1) break;
    const toMoveBlock = disk[toMoveIndex];
    const targetIndex = disk.findIndex(
      (block) => block.size >= toMoveBlock.size && block.id === undefined
    );
    if (targetIndex === -1 || targetIndex > toMoveIndex) continue;

    // Remove the block to move
    disk.splice(toMoveIndex, 1, { size: toMoveBlock.size });

    // Move the block in the new position
    const targetBlock = disk[targetIndex];
    if (targetBlock.size === toMoveBlock.size) {
      // Replace the empty block
      disk.splice(targetIndex, 1, toMoveBlock);

      compactSpace(disk, toMoveIndex);
    } else {
      // Shrink the empty block
      disk.splice(targetIndex, 0, toMoveBlock);
      targetBlock.size -= toMoveBlock.size;

      compactSpace(disk, toMoveIndex + 1);
    }
  }
  let cursor = 0;
  let checksum = 0;
  for (const block of disk) {
    for (let blockId = 0; blockId < block.size; ++blockId) {
      if (block.id) {
        checksum += block.id * cursor;
      }
      cursor++;
    }
  }

  return checksum;
};

function compactSpace(disk: Disk, newSpaceIndex: number) {
  const newSpaceBlock = disk[newSpaceIndex];
  const nextBlock = disk.at(newSpaceIndex + 1);
  if (nextBlock && nextBlock.id === undefined) {
    disk.splice(newSpaceIndex + 1, 1);
    newSpaceBlock.size += nextBlock.size;
  }
  const prevBlock = disk[newSpaceIndex - 1];
  if (prevBlock.id === undefined) {
    disk.splice(newSpaceIndex, 1);
    prevBlock.size += newSpaceBlock.size;
  }
}

function parseInput(input: string): Disk {
  const disk: Disk = [];
  for (const [index, value] of input.split("").entries()) {
    if (+value === 0) continue;
    disk.push({
      id: index % 2 == 0 ? index / 2 : undefined,
      size: parseFloat(value),
    });
  }
  return disk;
}
