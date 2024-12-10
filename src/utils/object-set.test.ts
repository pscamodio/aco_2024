import { assert, assertEquals } from "@std/assert";
import { ObjectSet } from "./object-set.ts";
import { Vec2 } from "./vec2.ts";
import { describe, it } from "jsr:@std/testing/bdd";

describe("ObjectSet", () => {
  it("should discard duplicated values based on the defined key", () => {
    const set = new ObjectSet<Vec2>();
    set.add({ x: 0, y: 0 });
    set.add({ x: 0, y: 0 });
    set.add({ x: 1, y: 0 });
    set.add({ x: 1, y: 0 });
    set.add({ x: 0, y: 1 });
    set.add({ x: 0, y: 1 });
    set.add({ x: 1, y: 1 });
    set.add({ x: 1, y: 1 });
    set.add({ x: -1, y: -1 });
    set.add({ x: -1, y: -1 });
    assertEquals(set.size, 5);
  });

  it("should accept a list of initial values in construction", () => {
    const set = new ObjectSet<Vec2>([
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 },
      { x: -1, y: -1 },
    ]);
    assertEquals(set.size, 5);
  });

  it("should allow to check if a value is in the set", () => {
    const set = new ObjectSet<Vec2>();
    set.add({ x: 0, y: 0 });
    set.add({ x: 1, y: 0 });
    set.add({ x: 0, y: 1 });
    set.add({ x: 1, y: 1 });
    set.add({ x: -1, y: -1 });
    assert(set.has({ x: 0, y: 0 }));
    assert(set.has({ x: 1, y: 0 }));
    assert(set.has({ x: 0, y: 1 }));
    assert(set.has({ x: 1, y: 1 }));
    assert(set.has({ x: -1, y: -1 }));
    assert(!set.has({ x: 2, y: 0 }));
    assert(!set.has({ x: -2, y: 0 }));
  });
});
