import { assert } from "@std/assert/assert";
import { add, distance, isSame, sub } from "./vec2.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "jsr:@std/testing/bdd";

describe("Vec2", () => {
  it("isSame should return true if the Vec2 are the same", () => {
    const value = { x: 0, y: 0 };
    assert(isSame(value, value));
  });

  it("isSame should return true if the Vec2 have the same values", () => {
    assert(isSame({ x: 0, y: 0 }, { x: 0, y: 0 }));
  });

  it("isSame should return false if the Vec2 have different values", () => {
    assert(!isSame({ x: 0, y: 0 }, { x: 1, y: 0 }));
    assert(!isSame({ x: 1, y: 0 }, { x: 0, y: 0 }));
    assert(!isSame({ x: 0, y: 1 }, { x: 0, y: 0 }));
    assert(!isSame({ x: 0, y: 0 }, { x: 0, y: 1 }));
  });

  it("add should sum the components of two Vec2", () => {
    assert(isSame(add({ x: 0, y: 0 }, { x: 1, y: 1 }), { x: 1, y: 1 }));
    assert(isSame(add({ x: 2, y: 2 }, { x: -1, y: -1 }), { x: 1, y: 1 }));
    assert(
      isSame(add({ x: 10, y: 10 }, { x: 100, y: 100 }), { x: 110, y: 110 }),
    );
    assert(
      isSame(add({ x: 10, y: 10 }, { x: -100, y: -100 }), { x: -90, y: -90 }),
    );
  });

  it("sub should subtract the components of two Vec2", () => {
    assert(isSame(sub({ x: 0, y: 0 }, { x: 1, y: 1 }), { x: -1, y: -1 }));
    assert(isSame(sub({ x: 2, y: 2 }, { x: -1, y: -1 }), { x: 3, y: 3 }));
    assert(
      isSame(sub({ x: 10, y: 10 }, { x: 100, y: 100 }), { x: -90, y: -90 }),
    );
    assert(
      isSame(sub({ x: 10, y: 10 }, { x: -100, y: -100 }), { x: 110, y: 110 }),
    );
  });

  it("distance should compute the absolute distance between two points", () => {
    assertEquals(distance({ x: 0, y: 0 }, { x: 2, y: 2 }), 2);
    assertEquals(distance({ x: 0, y: 0 }, { x: 1, y: 1 }), 1);
    assertEquals(distance({ x: 1, y: 1 }, { x: 2, y: 2 }), 1);
    assertEquals(distance({ x: 0, y: 2 }, { x: 4, y: 6 }), 4);
    assertEquals(distance({ x: 10, y: 10 }, { x: 0, y: 0 }), 10);
  });
});
