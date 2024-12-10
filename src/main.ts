import { parseArgs } from "jsr:@std/cli/parse-args";
import { assert } from "./utils/assert.ts";
import { run } from "./day_solution.ts";
import { isNumber } from "https://deno.land/x/is_number/mod.ts";

try {
  // Parse cli arguments
  const args = parseArgs(Deno.args, {
    string: ["day", "part"],
    boolean: ["demo"],
  });
  const { day, part, demo } = args;
  assert(isNumber(day), "day is missing");
  assert(isNumber(part), "part is missing");

  console.log(
    `Running day ${day} part ${part} ${demo ? "with demo input" : ""}`,
  );
  const result = await run(day, part, demo);
  console.log(`Day ${day} part ${part} solution:\n${result}`);
} catch (reason) {
  console.error(reason);
  console.log("USAGE: deno run run --day DAY --part PART --demo");
  console.log("--day DAY -> day to run the solution for");
  console.log("--part PART -> 1 or 2, pick which day part solution to run");
  console.log("--demo -> if defined use the demo input and not the full input");
}
