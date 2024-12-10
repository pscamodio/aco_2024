import { describe, it } from "jsr:@std/testing/bdd";
import { assertSpyCall, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { memoize } from "./memoize.ts";

describe("memoize", () => {
  it("should forward calls to memoized function", () => {
    const f = spy((arg: string) => arg);

    const memoized = memoize(f);
    memoized("arg");

    assertSpyCall(f, 0, {
      args: ["arg"],
    });
  });

  it("should cache calls with the same arguments", () => {
    const f = spy((arg: string) => arg);

    const memoized = memoize(f);
    memoized("arg");
    memoized("arg");

    assertSpyCall(f, 0, {
      args: ["arg"],
    });
    assertSpyCalls(f, 1);
  });

  it("should use the provided computeKey function to compute the cache key from the arguments", () => {
    const f = spy((arg: string) => arg);
    const computeKey = spy((arg: string) => arg);

    const memoized = memoize(f, computeKey);
    memoized("arg");
    memoized("arg");
    memoized("arg2");

    assertSpyCall(computeKey, 0, {
      args: ["arg"],
    });
    assertSpyCall(computeKey, 1, {
      args: ["arg"],
    });
    assertSpyCall(computeKey, 2, {
      args: ["arg2"],
    });
    assertSpyCalls(computeKey, 3);
  });
});
