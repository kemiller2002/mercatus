#!/usr/bin/env node
// Verifies docs/modernization/traceability.json against the repository.
// I/O lives here; every rule lives in gate.mjs as a pure function.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { coverageOf, requirementIdsOf, runChecks } from "./gate.mjs";
import { isUiSource } from "./ui-conformance.mjs";

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith("--")) ?? process.cwd();
const showCoverage = args.includes("--coverage");
const readText = (p) => readFileSync(join(root, p), "utf8");
const readJson = (p) => JSON.parse(readText(p));

const doc = readJson("docs/modernization/traceability.json");

const trackedPaths = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const requirementFiles = readdirSync(join(root, "requirements"))
  .filter((f) => f.endsWith(".md"))
  .map((f) => `requirements/${f}`);
const idsByFile = new Map(requirementFiles.map((f) => [f, requirementIdsOf(readText(f))]));

const evidencePaths = [
  ...(doc.workflows ?? []).flatMap((w) => Object.values(w.gateEvidence ?? {}).flat()),
  ...(doc.findings ?? []).map((f) => f.resolution).filter(Boolean),
];
const existingPaths = new Set(evidencePaths.filter((p) => existsSync(join(root, p))));

const workItemIds = new Set(readJson(".ros/work/queue.json").items.map((i) => i.id));

const ui = {
  files: trackedPaths.filter(isUiSource).map((path) => ({ path, text: readText(path) })),
  packageJson: readJson("package.json"),
  foundations: readJson(".echelon/foundations.json"),
};

const violations = runChecks(doc, { idsByFile, existingPaths, workItemIds, trackedPaths, ui });

const summary = (doc.workflows ?? []).map((w) => `${w.id} ${w.status}`).join(", ");

const coverage = coverageOf(doc, idsByFile);
const coverageLine = `coverage: ${coverage.listed}/${coverage.total} requirement IDs listed, ${coverage.linked} linked to a rule, workflow, contract or test, ${coverage.deferred} deferred, ${coverage.untraced} untraced`;

violations.length
  ? (console.error(violations.map((v) => `FAIL ${v}`).join("\n")), (process.exitCode = 1))
  : console.log(`PASS modernization gate: ${doc.requirements.length} requirements, ${doc.domainRules.length} rules, ${doc.workflows.length} workflows (${summary}), ${doc.findings.length} findings; UI conformance: ${ui.files.length} UI source file(s)`);

console.log(coverageLine);
showCoverage &&
  console.log([...coverage.untracedByFile].map(([file, ids]) => `  ${file} (${ids.length}): ${ids.join(", ")}`).join("\n"));
