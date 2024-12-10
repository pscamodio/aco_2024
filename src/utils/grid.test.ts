import { describe, it } from "jsr:@std/testing/bdd";
import { Grid, parseGrid } from "./grid.ts";
import { assert, assertEquals, assertThrows } from "@std/assert";
import { assertSpyCallArgs, assertSpyCalls, spy } from "jsr:@std/testing/mock";

const TEST_GRID = new Grid<string>([
  ["a", "a", "a"],
  ["b", "b", "b"],
  ["c", "c", "c"],
]);

describe("Grid", () => {
  describe("parseGrid", () => {
    it("should parse a grid of strings", () => {
      const grid = parseGrid("aaa\nbbb\nccc\n");
      assertEquals(grid.data, [
        ["a", "a", "a"],
        ["b", "b", "b"],
        ["c", "c", "c"],
      ]);
    });
    it("should parse a grid of numbers with a proper valueParser", () => {
      const grid = parseGrid("111\n222\n333\n", parseFloat);
      assertEquals(grid.data, [
        [1, 1, 1],
        [2, 2, 2],
        [3, 3, 3],
      ]);
    });
    it("should throw an error for non grid inputs", () => {
      assertThrows(
        () => parseGrid("aaa\nbbb\ncc\n"),
        "Input is not an uniform grid",
      );
    });
  });

  describe("width", () => {
    it("should return the width of the grid", () => {
      assertEquals(TEST_GRID.width, 3);
    });
  });

  describe("height", () => {
    it("should return the height of the grid", () => {
      assertEquals(TEST_GRID.height, 3);
    });
  });

  describe("forEachCell", () => {
    it("should call a callback for each cell in the grid", () => {
      const cbk = spy();
      TEST_GRID.forEachCell(cbk);
      assertSpyCallArgs(cbk, 0, [{ x: 0, y: 0 }, "a"]);
      assertSpyCallArgs(cbk, 1, [{ x: 1, y: 0 }, "a"]);
      assertSpyCallArgs(cbk, 2, [{ x: 2, y: 0 }, "a"]);
      assertSpyCallArgs(cbk, 3, [{ x: 0, y: 1 }, "b"]);
      assertSpyCallArgs(cbk, 4, [{ x: 1, y: 1 }, "b"]);
      assertSpyCallArgs(cbk, 5, [{ x: 2, y: 1 }, "b"]);
      assertSpyCallArgs(cbk, 6, [{ x: 0, y: 2 }, "c"]);
      assertSpyCallArgs(cbk, 7, [{ x: 1, y: 2 }, "c"]);
      assertSpyCallArgs(cbk, 8, [{ x: 2, y: 2 }, "c"]);
      assertSpyCalls(cbk, 9);
    });

    it("should allow to start for a different index", () => {
      const cbk = spy();
      TEST_GRID.forEachCell(cbk, { x: 1, y: 1 });
      assertSpyCallArgs(cbk, 0, [{ x: 1, y: 1 }, "b"]);
      assertSpyCallArgs(cbk, 1, [{ x: 2, y: 1 }, "b"]);
      assertSpyCallArgs(cbk, 2, [{ x: 0, y: 2 }, "c"]);
      assertSpyCallArgs(cbk, 3, [{ x: 1, y: 2 }, "c"]);
      assertSpyCallArgs(cbk, 4, [{ x: 2, y: 2 }, "c"]);
      assertSpyCalls(cbk, 5);
    });

    it("should throw an exception if the starting index is out of bound", () => {
      const cbk = spy();
      assertThrows(
        () => TEST_GRID.forEachCell(cbk, { x: -1, y: 0 }),
        "Start index is out of bound",
      );
      assertThrows(
        () => TEST_GRID.forEachCell(cbk, { x: 0, y: -1 }),
        "Start index is out of bound",
      );
      assertThrows(
        () => TEST_GRID.forEachCell(cbk, { x: 3, y: 0 }),
        "Start index is out of bound",
      );
      assertThrows(
        () => TEST_GRID.forEachCell(cbk, { x: 0, y: 3 }),
        "Start index is out of bound",
      );
      assertSpyCalls(cbk, 0);
    });
  });

  describe("next", () => {
    it("should compute the next index on the same row", () => {
      assertEquals(TEST_GRID.next({ x: 0, y: 0 }), { x: 1, y: 0 });
      assertEquals(TEST_GRID.next({ x: 1, y: 0 }), { x: 2, y: 0 });
      assertEquals(TEST_GRID.next({ x: 0, y: 1 }), { x: 1, y: 1 });
      assertEquals(TEST_GRID.next({ x: 1, y: 1 }), { x: 2, y: 1 });
      assertEquals(TEST_GRID.next({ x: 0, y: 2 }), { x: 1, y: 2 });
      assertEquals(TEST_GRID.next({ x: 1, y: 2 }), { x: 2, y: 2 });
    });

    it("should wrap to the next row", () => {
      assertEquals(TEST_GRID.next({ x: 2, y: 0 }), { x: 0, y: 1 });
      assertEquals(TEST_GRID.next({ x: 2, y: 1 }), { x: 0, y: 2 });
    });

    it("should return undefined if the next index is out of bound", () => {
      assertEquals(TEST_GRID.next({ x: 2, y: 2 }), undefined);
    });

    it("should throw an exception if the index is out of bound", () => {
      assertThrows(
        () => TEST_GRID.next({ x: -1, y: 0 }),
        "Index is out of bound",
      );
      assertThrows(
        () => TEST_GRID.next({ x: 0, y: -1 }),
        "Index is out of bound",
      );
      assertThrows(
        () => TEST_GRID.next({ x: 3, y: 0 }),
        "Index is out of bound",
      );
      assertThrows(
        () => TEST_GRID.next({ x: 0, y: 3 }),
        "Index is out of bound",
      );
    });
  });

  describe("findAll", () => {
    it("should return the index of all the cells with a specific value", () => {
      assertEquals(TEST_GRID.findAll("b"), [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]);
      assertEquals(TEST_GRID.findAll("c"), [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ]);
      assertEquals(TEST_GRID.findAll("d"), []);
    });
    it("should allow to start the search from a specific index", () => {
      assertEquals(TEST_GRID.findAll("a", { x: 1, y: 0 }), [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ]);
      assertEquals(TEST_GRID.findAll("a", { x: 2, y: 0 }), [{ x: 2, y: 0 }]);
      assertEquals(TEST_GRID.findAll("a", { x: 0, y: 1 }), []);
    });
    it("should throw an exception if the index is out of bound", () => {
      assertThrows(
        () => TEST_GRID.findAll("a", { x: -1, y: 0 }),
        "Index is out of bound",
      );
      assertThrows(
        () => TEST_GRID.findAll("a", { x: 0, y: -1 }),
        "Index is out of bound",
      );
      assertThrows(
        () => TEST_GRID.findAll("a", { x: 3, y: 0 }),
        "Index is out of bound",
      );
      assertThrows(
        () => TEST_GRID.findAll("a", { x: 0, y: 3 }),
        "Index is out of bound",
      );
    });
  });

  describe("isInside", () => {
    it("should return true for coords inside the grid", () => {
      assert(TEST_GRID.isInside({ x: 0, y: 0 }));
      assert(TEST_GRID.isInside({ x: 1, y: 0 }));
      assert(TEST_GRID.isInside({ x: 2, y: 0 }));
      assert(TEST_GRID.isInside({ x: 0, y: 1 }));
      assert(TEST_GRID.isInside({ x: 1, y: 1 }));
      assert(TEST_GRID.isInside({ x: 2, y: 1 }));
      assert(TEST_GRID.isInside({ x: 0, y: 2 }));
      assert(TEST_GRID.isInside({ x: 1, y: 2 }));
      assert(TEST_GRID.isInside({ x: 2, y: 2 }));
    });

    it("should return false for coord outside the grid", () => {
      assert(!TEST_GRID.isInside({ x: -1, y: 0 }));
      assert(!TEST_GRID.isInside({ x: 0, y: -1 }));
      assert(!TEST_GRID.isInside({ x: 3, y: 0 }));
      assert(!TEST_GRID.isInside({ x: 0, y: 3 }));
    });
  });

  describe("getCell", () => {
    it("should return the value in a grid cell", () => {
      assertEquals(TEST_GRID.getCell({ x: 0, y: 0 }), "a");
      assertEquals(TEST_GRID.getCell({ x: 1, y: 0 }), "a");
      assertEquals(TEST_GRID.getCell({ x: 2, y: 0 }), "a");
      assertEquals(TEST_GRID.getCell({ x: 0, y: 1 }), "b");
      assertEquals(TEST_GRID.getCell({ x: 1, y: 1 }), "b");
      assertEquals(TEST_GRID.getCell({ x: 2, y: 1 }), "b");
      assertEquals(TEST_GRID.getCell({ x: 0, y: 2 }), "c");
      assertEquals(TEST_GRID.getCell({ x: 1, y: 2 }), "c");
      assertEquals(TEST_GRID.getCell({ x: 2, y: 2 }), "c");
    });

    it("should throws for coord outside the grid", () => {
      assertThrows(() => TEST_GRID.getCell({ x: -1, y: 0 }));
      assertThrows(() => TEST_GRID.getCell({ x: 0, y: -1 }));
      assertThrows(() => TEST_GRID.getCell({ x: 3, y: 0 }));
      assertThrows(() => TEST_GRID.getCell({ x: 0, y: 3 }));
    });
  });

  describe("toString", () => {
    it("should return a string representation of the grid", () => {
      assertEquals(TEST_GRID.toString(), "aaa\nbbb\nccc");
    });
  });
});
