// Pure checks for docs/modernization/traceability.json.
//
// Every exported check is a total function from data to a list of
// violation strings. No check performs I/O; verify-gate.mjs gathers the
// facts (files, headings, work items, tracked paths) and passes them in.

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

// headingsByFile: Map<path, Set<heading text>>; a missing key means the file does not exist.
export const checkRequirementSources = (doc, headingsByFile) =>
  doc.requirements.flatMap((r) =>
    !headingsByFile.has(r.file)
      ? [`${r.id}: source file '${r.file}' does not exist`]
      : headingsByFile.get(r.file).has(r.heading)
        ? []
        : [`${r.id}: heading '${r.heading}' not found in ${r.file}`],
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
    ...doc.uiContracts.flatMap((u) => [
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

export const checkFormaGate = (doc) => {
  const byId = new Map(doc.workflows.map((w) => [w.id, w]));
  const contractsVerified = (wid) => CONTRACT_CRITERIA.every((c) => byId.get(wid)?.gate?.[c] === true);
  return doc.uiContracts
    .filter((u) => FORMA_ACTIVE.includes(u.formaStatus))
    .flatMap((u) =>
      (u.workflows ?? [])
        .filter((wid) => !contractsVerified(wid))
        .map((wid) => `${u.id}: Forma work is '${u.formaStatus}' but ${wid} contracts are not verified`),
    );
};

// workItemIds: Set of ids present in .ros/work/queue.json.
export const checkFindings = (doc, workItemIds) =>
  doc.findings.flatMap((f) => [
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
        ...checkRequirementSources(doc, facts.headingsByFile),
        ...checkReferences(doc),
        ...checkRuleStatus(doc),
        ...checkWorkflowGate(doc, facts.existingPaths),
        ...checkFormaGate(doc),
        ...checkFindings(doc, facts.workItemIds),
        ...checkInventory(doc, facts.trackedPaths),
      ];
};

export const headingsOf = (markdown) =>
  new Set(
    markdown
      .split(/\r?\n/)
      .map((line) => /^#{1,6}\s+(.+?)\s*$/.exec(line))
      .filter(Boolean)
      .map((m) => m[1]),
  );
