import { assert } from "./assert.ts";
import { assertThrows } from "@std/assert";
import { describe, it } from "jsr:@std/testing/bdd";

describe("assert", () => {
  it("assert should do nothing if the condition is true", () => {
    assert(true, "");
  });

  it("assert should throw if the condition is false", () => {
    assertThrows(() => assert(false, "error message"), "error message");
  });
});
