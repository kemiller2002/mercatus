// Pure checks for docs/modernization/traceability.json.
//
// Every exported check is a total function from data to a list of
// violation strings. No check performs I/O; verify-gate.mjs gathers the
// facts (files, headings, work items, tracked paths) and passes them in.

import { runUiConformance } from "./ui-conformance.mjs";

export const GATE_CRITERIA = Object.freeze([
  "domainModelVerified",
  "transitionsDefined",
  "authorizationEnforced",
  "rulesTested",
  "formaFollowsContracts",
  "endToEndDemonstrated",
]);

export const CLASSIFICATIONS = Object.freeze([
  "correct-and-verified",
  "correct-but-insufficiently-tested",
  "incorrect-implementation",
  "missing-business-behavior",
  "ambiguous-requirement",
  "architecture-violation",
  "requiring-owner-decision",
]);

const FORMA_ACTIVE = Object.freeze(["in-progress", "done"]);

const ids = (xs) => (xs ?? []).map((x) => x.id);
const idSet = (xs) => new Set(ids(xs));
const missingFrom = (set) => (ref) => !set.has(ref);
const unresolved = (owner, field, refs, set) =>
  (refs ?? []).filter(missingFrom(set)).map((ref) => `${owner}: ${field} references unknown id '${ref}'`);

const COLLECTIONS = Object.freeze([
  "requirements",
  "aggregates",
  "domainRules",
  "workflows",
  "uiContracts",
  "printContracts",
  "tests",
  "verificationChecks",
  "findings",
]);

export const checkShape = (doc) => [
  ...(doc?.schema === "mercatus.modernization-traceability/v1" ? [] : ["schema: expected mercatus.modernization-traceability/v1"]),
  ...COLLECTIONS.filter((c) => !Array.isArray(doc?.[c])).map((c) => `shape: '${c}' must be an array`),
];

export const checkUniqueIds = (doc) => {
  const all = COLLECTIONS.flatMap((c) => ids(doc[c]));
  const dupes = [...new Set(all.filter((id, i) => all.indexOf(id) !== i))];
  return dupes.map((id) => `ids: '${id}' is declared more than once`);
};

// Requirement sections (## to ####) must carry a stable ID line directly under the heading
// (DF-MERCATUS-DOM-2026-0001). The requirement document is the only source of the ID.
const HEADING = /^#{2,4}\s+(.+?)\s*$/;
const ID_LINE = /^ID: `([A-Z][A-Z0-9]*(?:-[A-Z0-9.]+)+)`\s*$/;

export const requirementIdsOf = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const nextNonBlank = (i) => lines.slice(i + 1).find((l) => l.trim() !== "") ?? "";
  const sections = lines
    .map((line, i) => [HEADING.exec(line), i])
    .filter(([m]) => m)
    .map(([m, i]) => ({ heading: m[1], id: ID_LINE.exec(nextNonBlank(i))?.[1] ?? null }));
  return {
    ids: sections.filter((x) => x.id).map((x) => x.id),
    missing: sections.filter((x) => !x.id).map((x) => x.heading),
  };
};

// idsByFile: Map<path, {ids, missing}> for every requirements/*.md file.
export const checkRequirementIds = (idsByFile) => {
  const all = [...idsByFile.values()].flatMap((x) => x.ids);
  const dupes = [...new Set(all.filter((id, i) => all.indexOf(id) !== i))];
  return [
    ...[...idsByFile].flatMap(([file, x]) => x.missing.map((h) => `${file}: section '${h}' has no stable ID line`)),
    ...dupes.map((id) => `requirements: ID '${id}' is used by more than one section`),
  ];
};

export const checkRequirementSources = (doc, idsByFile) =>
  doc.requirements.flatMap((r) =>
    !idsByFile.has(r.file)
      ? [`${r.id}: source file '${r.file}' does not exist`]
      : idsByFile.get(r.file).ids.includes(r.id)
        ? []
        : [`${r.id}: no section with this ID in ${r.file}`],
  );

export const checkReferences = (doc) => {
  const req = idSet(doc.requirements);
  const rules = idSet(doc.domainRules);
  const wfs = idSet(doc.workflows);
  const tests = idSet(doc.tests);
  const fnd = idSet(doc.findings);
  return [
    ...doc.aggregates.flatMap((a) => [
      ...unresolved(a.id, "requirements", a.requirements, req),
      ...unresolved(a.id, "findings", a.findings, fnd),
    ]),
    ...doc.domainRules.flatMap((r) => [
      ...unresolved(r.id, "requirements", r.requirements, req),
      ...unresolved(r.id, "tests", r.tests, tests),
      ...unresolved(r.id, "findings", r.findings, fnd),
    ]),
    ...doc.workflows.flatMap((w) => [
      ...unresolved(w.id, "requirements", w.requirements, req),
      ...unresolved(w.id, "domainRules", w.domainRules, rules),
      ...unresolved(w.id, "findings", w.findings, fnd),
    ]),
    ...[...doc.uiContracts, ...(doc.printContracts ?? [])].flatMap((u) => [
      ...unresolved(u.id, "workflows", u.workflows, wfs),
      ...unresolved(u.id, "requirements", u.requirements, req),
    ]),
    ...doc.tests.flatMap((t) => unresolved(t.id, "requirement", [t.requirement], req)),
    ...doc.verificationChecks.flatMap((c) => unresolved(c.id, "tests", c.tests, tests)),
  ];
};

// A rule with an ambiguous or missing status must cite the finding that tracks it.
export const checkRuleStatus = (doc) => {
  const passing = new Set(doc.tests.filter((t) => t.status === "passing").map((t) => t.id));
  return doc.domainRules.flatMap((r) => [
    ...(["ambiguous", "missing"].includes(r.status) && !(r.findings ?? []).length
      ? [`${r.id}: status '${r.status}' requires at least one finding`]
      : []),
    ...(r.status === "verified" && !(r.tests ?? []).some((t) => passing.has(t))
      ? [`${r.id}: status 'verified' requires at least one passing test`]
      : []),
  ]);
};

// existingPaths: Set of repository paths that exist.
export const checkWorkflowGate = (doc, existingPaths) =>
  doc.workflows.flatMap((w) => {
    const gate = w.gate ?? {};
    const absent = GATE_CRITERIA.filter((c) => typeof gate[c] !== "boolean").map(
      (c) => `${w.id}: gate criterion '${c}' must be a boolean`,
    );
    const evidence = w.gateEvidence ?? {};
    const unevidenced = GATE_CRITERIA.filter((c) => gate[c] === true)
      .filter((c) => !(evidence[c] ?? []).length || !(evidence[c] ?? []).every((p) => existingPaths.has(p)))
      .map((c) => `${w.id}: gate criterion '${c}' is true without existing evidence paths`);
    const passed = GATE_CRITERIA.every((c) => gate[c] === true);
    const status =
      w.status === "ready" && !passed
        ? [`${w.id}: status 'ready' but not every gate criterion holds`]
        : w.status !== "ready" && passed
          ? [`${w.id}: every gate criterion holds but status is '${w.status}'`]
          : [];
    return [...absent, ...unevidenced, ...status];
  });

// Forma work may only start once the workflow's domain and application contracts are verified.
const CONTRACT_CRITERIA = Object.freeze(["domainModelVerified", "transitionsDefined", "authorizationEnforced", "rulesTested"]);

const contractGate = (doc, contracts, statusField, label) => {
  const byId = new Map(doc.workflows.map((w) => [w.id, w]));
  const contractsVerified = (wid) => CONTRACT_CRITERIA.every((c) => byId.get(wid)?.gate?.[c] === true);
  return (contracts ?? [])
    .filter((u) => FORMA_ACTIVE.includes(u[statusField]))
    .flatMap((u) =>
      (u.workflows ?? [])
        .filter((wid) => !contractsVerified(wid))
        .map((wid) => `${u.id}: ${label} work is '${u[statusField]}' but ${wid} contracts are not verified`),
    );
};

export const checkFormaGate = (doc) => contractGate(doc, doc.uiContracts, "formaStatus", "Forma");

// Folio print surfaces follow the same rule as Forma screens (UIR-06).
export const checkFolioGate = (doc) => contractGate(doc, doc.printContracts, "folioStatus", "Folio");

// workItemIds: Set of ids present in .ros/work/queue.json; existingPaths: repository paths that exist.
export const checkFindings = (doc, workItemIds, existingPaths = new Set()) =>
  doc.findings.flatMap((f) => [
    ...(f.status === "resolved" && !(f.resolution && existingPaths.has(f.resolution))
      ? [`${f.id}: resolved finding must cite an existing decision record`]
      : []),
    ...(CLASSIFICATIONS.includes(f.classification) ? [] : [`${f.id}: unknown classification '${f.classification}'`]),
    ...(f.classification !== "correct-and-verified" && !(f.workItems ?? []).length
      ? [`${f.id}: actionable finding has no work item`]
      : []),
    ...(f.classification === "correct-and-verified" && !(f.evidence ?? []).length
      ? [`${f.id}: 'correct-and-verified' requires evidence`]
      : []),
    ...(f.workItems ?? []).filter(missingFrom(workItemIds)).map((wi) => `${f.id}: work item '${wi}' is not in the Praxis queue`),
  ]);

const matches = (patterns) => (path) => patterns.some((p) => p.test(path));

export const inventoryOf = (trackedPaths) => ({
  fsharpProjects: trackedPaths.filter(matches([/\.fsproj$/])).length,
  fsharpSources: trackedPaths.filter(matches([/\.fsi?$/, /\.fsx$/])).length,
  uiSources: trackedPaths.filter(matches([/\.html?$/, /\.s?css$/, /\.[jt]sx$/, /\.vue$/, /\.svelte$/])).length,
  domainTests: trackedPaths.filter(matches([/Tests?[^/]*\.fsproj$/, /Tests?\/.*\.fs$/])).length,
});

// The audit's "no implementation" premise must stay true, or the audit must be revised.
export const checkInventory = (doc, trackedPaths) => {
  const actual = inventoryOf(trackedPaths);
  return Object.entries(actual)
    .filter(([k, v]) => doc.implementationInventory?.[k] !== v)
    .map(([k, v]) => `inventory: ${k} declared ${doc.implementationInventory?.[k]} but repository has ${v}; revise the audit`);
};

export const runChecks = (doc, facts) => {
  const shape = checkShape(doc);
  return shape.length
    ? shape
    : [
        ...checkUniqueIds(doc),
        ...checkRequirementIds(facts.idsByFile),
        ...checkRequirementSources(doc, facts.idsByFile),
        ...checkReferences(doc),
        ...checkRuleStatus(doc),
        ...checkWorkflowGate(doc, facts.existingPaths),
        ...checkFormaGate(doc),
        ...checkFolioGate(doc),
        ...checkFindings(doc, facts.workItemIds, facts.existingPaths),
        ...checkInventory(doc, facts.trackedPaths),
        ...checkCoverage(doc, facts.idsByFile),
        ...(facts.ui ? runUiConformance(facts.ui) : []),
      ];
};

// Requirement coverage (REQ-EVAL-30, WI-0049). "Listed" means the ID appears in
// traceability requirements[]. "Linked" means a domain rule, workflow, UI or
// print contract, or test also references it. Deferred IDs carry an explicit
// reason and count as neither. The ratchet makes every change in coverage a
// deliberate edit of the recorded baseline.
const linkedIdsOf = (doc) =>
  new Set([
    ...doc.domainRules.flatMap((r) => r.requirements ?? []),
    ...doc.workflows.flatMap((w) => w.requirements ?? []),
    ...doc.uiContracts.flatMap((u) => u.requirements ?? []),
    ...(doc.printContracts ?? []).flatMap((p) => p.requirements ?? []),
    ...doc.tests.map((t) => t.requirement),
  ]);

export const coverageOf = (doc, idsByFile) => {
  const all = [...idsByFile.values()].flatMap((x) => x.ids);
  const deferred = new Set((doc.coverage?.deferred ?? []).map((d) => d.id));
  const listed = new Set(doc.requirements.map((r) => r.id));
  const linked = linkedIdsOf(doc);
  const untraced = all.filter((id) => !listed.has(id) && !deferred.has(id));
  const untracedByFile = new Map(
    [...idsByFile].map(([file, x]) => [file, x.ids.filter((id) => untraced.includes(id))]).filter(([, ids]) => ids.length),
  );
  return {
    total: all.length,
    listed: all.filter((id) => listed.has(id)).length,
    linked: all.filter((id) => listed.has(id) && linked.has(id)).length,
    deferred: all.filter((id) => deferred.has(id)).length,
    untraced: untraced.length,
    untracedByFile,
  };
};

const ratchet = (name, actual, baseline) =>
  typeof baseline !== "number"
    ? [`coverage: baseline '${name}' must be a number`]
    : actual < baseline
      ? [`coverage: ${name} fell from ${baseline} to ${actual}; restore the trace or record a deferral`]
      : actual > baseline
        ? [`coverage: ${name} rose from ${baseline} to ${actual}; raise coverage.baseline.${name} to ${actual}`]
        : [];

export const checkCoverage = (doc, idsByFile) => {
  const all = new Set([...idsByFile.values()].flatMap((x) => x.ids));
  const listed = new Set(doc.requirements.map((r) => r.id));
  const deferred = doc.coverage?.deferred ?? [];
  const c = coverageOf(doc, idsByFile);
  return [
    ...deferred.filter((d) => !all.has(d.id)).map((d) => `coverage: deferred '${d.id}' is not a requirement ID`),
    ...deferred.filter((d) => !(d.reason ?? "").trim()).map((d) => `coverage: deferred '${d.id}' has no reason`),
    ...deferred.filter((d) => listed.has(d.id)).map((d) => `coverage: '${d.id}' is both traced and deferred`),
    ...ratchet("listed", c.listed, doc.coverage?.baseline?.listed),
    ...ratchet("linked", c.linked, doc.coverage?.baseline?.linked),
  ];
};
