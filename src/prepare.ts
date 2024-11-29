import { copy } from "https://deno.land/std@0.224.0/fs/copy.ts";

// Copy the 1st day as a template to all 24 days
for (let i = 2; i < 25; ++i) {
  await copy(`./src/days/1`, `./src/days/${i}`, { overwrite: true });
}
