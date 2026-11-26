import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke is kept as sentence chunks so the single line is assembled
// rather than pasted whole; the joined result is the entry, unchanged.
const SENTENCE_PARTS: readonly string[] = [
  "Our meeting about having too many meetings",
  "ended with a calendar invite titled",
  "'Meeting About Meetings — Part 2'.",
];

// Join the chunks, then enforce the bounty gate: one line, 1–200
// characters, not blank. Anything outside the gate aborts the run instead
// of writing a bad entry.
function buildLine(chunks: readonly string[]): string {
  const line = chunks.join(" ");
  const size = Array.from(line).length;
  const broken = line.includes("\n") || line.includes("\r");
  if (size < 1 || size > 200 || line.trim() === "" || broken) {
    throw new Error("entry fails the single-line 1-200 character gate");
  }
  return line;
}

// Local runs can redirect the output with MAKEFUN_OUTPUT_DIR; the sealed
// scorer's default stays /output.
function resolveDestination(): string {
  const override = process.env.MAKEFUN_OUTPUT_DIR;
  return override !== undefined && override !== "" ? override : "/output";
}

const entryLine = buildLine(SENTENCE_PARTS);
const targetDir = resolveDestination();
mkdirSync(targetDir, { recursive: true });
writeFileSync(join(targetDir, "entry.txt"), entryLine, "utf8");
console.log(entryLine);
