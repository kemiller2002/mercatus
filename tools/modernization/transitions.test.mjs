import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  checkAgainstDsm,
  checkAggregate,
  checkProposal,
  checkRendered,
  dsmStatesOf,
  expectedStates,
  renderTables,
  spliceGenerated,
} from "./transitions.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const cmd = (name, from, to, o = {}) => ({ name, from: [from].flat(), to, actor: "human", capability: null, guard: "—", ...o });
const agg = () => ({
  id: "Thing",
  source: "DSM-99",
  initial: "A",
  states: [{ name: "A" }, { name: "B" }, { name: "C", terminal: true }],
  commands: [cmd("Go", "A", "B"), cmd("Finish", "B", "C")],
});
const dsm = new Map([["DSM-99", ["A", "B", "C"]]]);
const withCommands = (commands) => ({ ...agg(), commands });

test("a coherent aggregate has no violations", () => {
  assert.deepEqual(checkAggregate(agg()), []);
  assert.deepEqual(checkAgainstDsm(agg(), dsm), []);
});

test("unknown states in commands, initial or entry states are rejected", () => {
  const v = checkAggregate({ ...withCommands([cmd("Go", "A", "Z"), cmd("Finish", "Q", "C")]), entryStates: ["Y"] });
  assert.ok(v.some((x) => /to-state 'Z' is not a state/.test(x)));
  assert.ok(v.some((x) => /from-state 'Q' is not a state/.test(x)));
  assert.ok(v.some((x) => /entry state 'Y' is not a state/.test(x)));
  assert.match(checkAggregate({ ...agg(), initial: "X" })[0], /initial state 'X' is not a state/);
});

test("unreachable states and dead ends are rejected", () => {
  const v = checkAggregate(withCommands([cmd("Go", "A", "B")]));
  assert.ok(v.some((x) => /state 'C' is unreachable/.test(x)));
  assert.ok(v.some((x) => /non-terminal state 'B' has no outgoing command/.test(x)));
});

test("an entry state makes its successors reachable", () => {
  const a = { ...agg(), entryStates: ["B"], commands: [cmd("Finish", "B", "C"), cmd("Back", "B", "A"), cmd("Go", "A", "B")] };
  assert.deepEqual(checkAggregate(a), []);
});

test("leaving a terminal state requires an explicit reopen", () => {
  const leaving = withCommands([...agg().commands, cmd("Again", "C", "A")]);
  assert.match(checkAggregate(leaving)[0], /leaves terminal state 'C' without reopen: true/);
  assert.deepEqual(checkAggregate(withCommands([...agg().commands, cmd("Again", "C", "A", { reopen: true })])), []);
});

test("non-deterministic commands, self-transitions and bad actors are rejected", () => {
  const v = checkAggregate(withCommands([...agg().commands, cmd("Go", "A", "C"), cmd("Stay", "B", "B"), cmd("X", "A", "C", { actor: "robot" })]));
  assert.ok(v.some((x) => /command 'Go' from 'A' is declared twice/.test(x)));
  assert.ok(v.some((x) => /self-transition on 'B'/.test(x)));
  assert.ok(v.some((x) => /actor 'robot'/.test(x)));
});

test("departures from the DSM must be declared in amends", () => {
  const renamed = { ...agg(), states: [{ name: "A" }, { name: "B2" }, { name: "C", terminal: true }], commands: [cmd("Go", "A", "B2"), cmd("Finish", "B2", "C")] };
  const v = checkAgainstDsm(renamed, dsm);
  assert.ok(v.some((x) => /DSM-99 state 'B' is missing/.test(x)));
  assert.ok(v.some((x) => /state 'B2' is not in DSM-99/.test(x)));
  assert.deepEqual(checkAgainstDsm({ ...renamed, amends: { renamed: { B: "B2" } } }, dsm), []);
  assert.deepEqual(expectedStates(["A", "Stale", "B"], { removed: ["Stale"], added: ["D"] }), ["A", "B", "D"]);
});

test("dsmStatesOf reads the States line under each DSM ID", () => {
  const md = "## 2. X\n\nID: `DSM-02`\n\nStates:\nDraft, Proposed, Done.\n\n## 3. Y\n\nID: `DSM-03`\n\nNo states here.\n";
  assert.deepEqual([...dsmStatesOf(md)], [["DSM-02", ["Draft", "Proposed", "Done"]]]);
});

test("generated tables must match the data", () => {
  const doc = { schema: "mercatus.transition-proposal/v1", aggregates: [agg()] };
  const md = `intro\n${renderTables(doc)}\noutro\n`;
  assert.deepEqual(checkRendered(md, doc), []);
  const changed = { ...doc, aggregates: [{ ...agg(), commands: [cmd("Go", "A", "B"), cmd("Finish", "B", "C", { guard: "new guard" })] }] };
  assert.match(checkRendered(md, changed)[0], /generated tables are stale/);
  assert.match(checkRendered("no markers", doc)[0], /no generated-table markers/);
  assert.equal(spliceGenerated("no markers", "x"), null);
});

test("the repository proposal passes against the real DOMAIN-STATE-MODEL", () => {
  const doc = JSON.parse(readFileSync(join(repoRoot, "requirements/slice-transitions.json"), "utf8"));
  const dsmStates = dsmStatesOf(readFileSync(join(repoRoot, "requirements/DOMAIN-STATE-MODEL.md"), "utf8"));
  assert.deepEqual(checkProposal(doc, dsmStates), []);
  assert.deepEqual(checkRendered(readFileSync(join(repoRoot, "requirements/SLICE-TRANSITIONS.md"), "utf8"), doc), []);
});
