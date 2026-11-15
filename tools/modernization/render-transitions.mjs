#!/usr/bin/env node
// Regenerates the tables in requirements/SLICE-TRANSITIONS.md from
// requirements/slice-transitions.json. I/O lives here; rendering is pure
// (transitions.mjs). --check exits 1 instead of writing when the file is stale.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderTables, spliceGenerated } from "./transitions.mjs";

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith("--")) ?? process.cwd();
const docPath = join(root, "requirements/SLICE-TRANSITIONS.md");
const markdown = readFileSync(docPath, "utf8");
const spliced = spliceGenerated(markdown, renderTables(JSON.parse(readFileSync(join(root, "requirements/slice-transitions.json"), "utf8"))));

spliced === null
  ? (console.error("FAIL generated-table markers not found"), (process.exitCode = 1))
  : spliced === markdown
    ? console.log("transition tables are current")
    : args.includes("--check")
      ? (console.error("FAIL transition tables are stale"), (process.exitCode = 1))
      : (writeFileSync(docPath, spliced), console.log("wrote requirements/SLICE-TRANSITIONS.md"));
