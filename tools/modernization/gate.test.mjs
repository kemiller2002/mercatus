import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  GATE_CRITERIA,
  checkFindings,
  checkFormaGate,
  checkInventory,
  checkReferences,
  checkRequirementSources,
  checkRuleStatus,
  checkUniqueIds,
  checkWorkflowGate,
  headingsOf,
  inventoryOf,
} from "./gate.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const allGate = (value) => Object.fromEntries(GATE_CRITERIA.map((c) => [c, value]));

const base = () => ({
  schema: "mercatus.modernization-traceability/v1",
  implementationInventory: { fsharpProjects: 0, fsharpSources: 0, uiSources: 0, domainTests: 0 },
  requirements: [{ id: "R-1", file: "req.md", heading: "1. Lead" }],
  aggregates: [{ id: "A-1", requirements: ["R-1"], findings: ["F-1"] }],
  domainRules: [{ id: "DR-1", requirements: ["R-1"], tests: ["T-1"], status: "ambiguous", findings: ["F-1"] }],
  workflows: [{ id: "WF-1", requirements: ["R-1"], domainRules: ["DR-1"], findings: ["F-1"], gate: allGate(false), status: "blocked" }],
  uiContracts: [{ id: "UI-1", workflows: ["WF-1"], requirements: ["R-1"], formaStatus: "not-started" }],
  tests: [{ id: "T-1", requirement: "R-1", status: "missing" }],
  verificationChecks: [{ id: "C-1", tests: ["T-1"] }],
  findings: [{ id: "F-1", classification: "ambiguous-requirement", workItems: ["WI-1"] }],
});

const update = (doc, key, f) => ({ ...doc, [key]: doc[key].map(f) });

test("a consistent document has no violations", () => {
  const doc = base();
  assert.deepEqual(checkUniqueIds(doc), []);
  assert.deepEqual(checkReferences(doc), []);
  assert.deepEqual(checkRuleStatus(doc), []);
  assert.deepEqual(checkWorkflowGate(doc, new Set()), []);
  assert.deepEqual(checkFormaGate(doc), []);
  assert.deepEqual(checkFindings(doc, new Set(["WI-1"])), []);
  assert.deepEqual(checkInventory(doc, ["README.md"]), []);
});

test("duplicate ids across collections are rejected", () => {
  const doc = { ...base(), tests: [{ id: "R-1", requirement: "R-1" }] };
  assert.match(checkUniqueIds(doc)[0], /'R-1' is declared more than once/);
});

test("a requirement pointing at a missing heading or file is rejected", () => {
  const doc = base();
  assert.deepEqual(checkRequirementSources(doc, new Map([["req.md", new Set(["1. Lead"])]])), []);
  assert.match(checkRequirementSources(doc, new Map([["req.md", new Set(["2. Other"])]]))[0], /heading '1. Lead' not found/);
  assert.match(checkRequirementSources(doc, new Map())[0], /does not exist/);
});

test("dangling references are rejected", () => {
  const doc = update(base(), "workflows", (w) => ({ ...w, domainRules: ["DR-404"] }));
  assert.match(checkReferences(doc)[0], /WF-1: domainRules references unknown id 'DR-404'/);
});

test("an ambiguous rule must cite a finding, and a verified rule needs a passing test", () => {
  const noFinding = update(base(), "domainRules", (r) => ({ ...r, findings: [] }));
  assert.match(checkRuleStatus(noFinding)[0], /requires at least one finding/);
  const verified = update(base(), "domainRules", (r) => ({ ...r, status: "verified" }));
  assert.match(checkRuleStatus(verified)[0], /requires at least one passing test/);
  const passing = update(verified, "tests", (t) => ({ ...t, status: "passing" }));
  assert.deepEqual(checkRuleStatus(passing), []);
});

test("a workflow cannot be ready unless all six gate criteria hold with evidence", () => {
  const ready = update(base(), "workflows", (w) => ({ ...w, status: "ready" }));
  assert.ok(checkWorkflowGate(ready, new Set()).some((v) => /status 'ready' but not every gate criterion holds/.test(v)));

  const claimed = update(base(), "workflows", (w) => ({ ...w, gate: allGate(true), status: "ready" }));
  assert.equal(checkWorkflowGate(claimed, new Set()).length, GATE_CRITERIA.length);

  const evidence = Object.fromEntries(GATE_CRITERIA.map((c) => [c, ["evidence.md"]]));
  const proven = update(claimed, "workflows", (w) => ({ ...w, gateEvidence: evidence }));
  assert.deepEqual(checkWorkflowGate(proven, new Set(["evidence.md"])), []);
  assert.match(checkWorkflowGate(update(proven, "workflows", (w) => ({ ...w, status: "blocked" })), new Set(["evidence.md"]))[0], /status is 'blocked'/);
});

test("Forma work cannot start before the workflow's contracts are verified", () => {
  const started = update(base(), "uiContracts", (u) => ({ ...u, formaStatus: "in-progress" }));
  assert.match(checkFormaGate(started)[0], /UI-1: Forma work is 'in-progress' but WF-1 contracts are not verified/);
  const contracts = { ...allGate(false), domainModelVerified: true, transitionsDefined: true, authorizationEnforced: true, rulesTested: true };
  const verified = update(started, "workflows", (w) => ({ ...w, gate: contracts }));
  assert.deepEqual(checkFormaGate(verified), []);
});

test("actionable findings need a work item that exists in the Praxis queue", () => {
  assert.match(checkFindings(base(), new Set())[0], /'WI-1' is not in the Praxis queue/);
  const orphan = update(base(), "findings", (f) => ({ ...f, workItems: [] }));
  assert.match(checkFindings(orphan, new Set())[0], /actionable finding has no work item/);
  const verified = update(base(), "findings", (f) => ({ ...f, classification: "correct-and-verified", workItems: [] }));
  assert.match(checkFindings(verified, new Set())[0], /requires evidence/);
  const unknown = update(base(), "findings", (f) => ({ ...f, classification: "fine" }));
  assert.match(checkFindings(unknown, new Set(["WI-1"]))[0], /unknown classification/);
});

test("the audit fails once implementation appears without revising the inventory", () => {
  const paths = ["src/Mercatus.Domain/Mercatus.Domain.fsproj", "src/Mercatus.Domain/Lead.fs", "web/index.html", "tests/Mercatus.Domain.Tests/Mercatus.Domain.Tests.fsproj"];
  assert.deepEqual(inventoryOf(paths), { fsharpProjects: 2, fsharpSources: 1, uiSources: 1, domainTests: 1 });
  assert.equal(checkInventory(base(), paths).length, 4);
});

test("headingsOf extracts ATX headings of every level", () => {
  assert.deepEqual([...headingsOf("# A\ntext\n## 1. Lead  \n### 26.1 Signals\n#nospace")], ["A", "1. Lead", "26.1 Signals"]);
});

test("the committed traceability document passes the gate", () => {
  const out = execFileSync(process.execPath, [join(repoRoot, "tools/modernization/verify-gate.mjs"), repoRoot], { encoding: "utf8" });
  assert.match(out, /^PASS modernization gate/);
});

test("no workflow in the committed document claims readiness while its findings are open", () => {
  const doc = JSON.parse(readFileSync(join(repoRoot, "docs/modernization/traceability.json"), "utf8"));
  assert.ok(doc.workflows.every((w) => w.status === "blocked"));
  assert.ok(doc.uiContracts.every((u) => u.formaStatus === "not-started"));
});
