import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The entrypoint is deliberately tiny: it only carries the roast from
// the repository into the grader's output directory, so the judged
// artifact stays exactly the one line the builder wrote.
// It refuses to run without an output directory, and it refuses
// entries that are empty or longer than the bounty allows.

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set");
}

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

let entry: string;
try {
  entry = readFileSync(entryPath, "utf8");
} catch (error) {
  fail(`cannot read entry.txt: ${(error as Error).message}`);
}

if (entry!.trim().length === 0) {
  fail("entry.txt is empty or whitespace only");
}

if (entry!.length > 200) {
  fail(`entry is ${entry!.length} characters, over the 200 character limit`);
}

mkdirSync(outputDir!, { recursive: true });
writeFileSync(join(outputDir!, "entry.txt"), entry!);
