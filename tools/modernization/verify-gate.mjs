#!/usr/bin/env node
// Verifies docs/modernization/traceability.json against the repository.
// I/O lives here; every rule lives in gate.mjs as a pure function.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { requirementIdsOf, runChecks } from "./gate.mjs";

const root = process.argv[2] ?? process.cwd();
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

const violations = runChecks(doc, { idsByFile, existingPaths, workItemIds, trackedPaths });

const summary = (doc.workflows ?? []).map((w) => `${w.id} ${w.status}`).join(", ");

violations.length
  ? (console.error(violations.map((v) => `FAIL ${v}`).join("\n")), (process.exitCode = 1))
  : console.log(`PASS modernization gate: ${doc.requirements.length} requirements, ${doc.domainRules.length} rules, ${doc.workflows.length} workflows (${summary}), ${doc.findings.length} findings`);
