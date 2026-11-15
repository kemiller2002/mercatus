// Pure checks and rendering for requirements/slice-transitions.json
// (WI-0052). Every exported function is total and performs no I/O.
//
// The proposal is data: one entry per aggregate, listing its states and its
// commands (name, from-states, to-state, actor, capability, guard). The checks
// prove the tables are internally coherent (every state reachable, no dead
// ends, terminal states left only by an explicit reopen, deterministic
// commands). They also prove the proposal departs from requirements/
// DOMAIN-STATE-MODEL.md only where it says so in `amends`.

export const ACTORS = Object.freeze(["human", "agent-or-human", "system"]);

const unique = (xs) => [...new Set(xs)];
const duplicates = (xs) => unique(xs.filter((x, i) => xs.indexOf(x) !== i));

// "## 8. Lead\n\nID: `DSM-08`\n\nStates:\nA, B, C.\n" -> Map("DSM-08" -> ["A","B","C"])
export const dsmStatesOf = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const idAt = lines.map((l) => /^ID: `(DSM-[0-9A-Z]+)`/.exec(l)?.[1] ?? null);
  const sectionId = (i) => idAt.slice(0, i + 1).filter(Boolean).at(-1) ?? null;
  return new Map(
    lines
      .map((l, i) => [l.trim(), i])
      .filter(([l]) => l === "States:")
      .map(([, i]) => [
        sectionId(i),
        (lines.slice(i + 1).find((l) => l.trim() !== "") ?? "")
          .replace(/\.\s*$/, "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      ])
      .filter(([id]) => id),
  );
};

export const expectedStates = (dsmStates, amends = {}) => {
  const renamed = amends.renamed ?? {};
  return unique([
    ...dsmStates.filter((x) => !(amends.removed ?? []).includes(x)).map((x) => renamed[x] ?? x),
    ...(amends.added ?? []),
  ]);
};

const reachable = (a) => {
  const step = (seen) => {
    const next = unique([
      ...seen,
      ...a.commands.filter((c) => c.from.some((f) => seen.includes(f))).map((c) => c.to),
    ]);
    return next.length === seen.length ? seen : step(next);
  };
  return step(unique([a.initial, ...(a.entryStates ?? [])]));
};

export const checkAggregate = (a) => {
  const names = a.states.map((s) => s.name);
  const has = (x) => names.includes(x);
  const terminal = new Set(a.states.filter((s) => s.terminal).map((s) => s.name));
  const pairs = a.commands.flatMap((c) => c.from.map((f) => `${c.name}@${f}`));
  const reach = reachable(a);
  return [
    ...duplicates(names).map((x) => `${a.id}: state '${x}' declared twice`),
    ...(has(a.initial) ? [] : [`${a.id}: initial state '${a.initial}' is not a state`]),
    ...(a.entryStates ?? []).filter((x) => !has(x)).map((x) => `${a.id}: entry state '${x}' is not a state`),
    ...a.commands.flatMap((c) => [
      ...c.from.filter((f) => !has(f)).map((f) => `${a.id}.${c.name}: from-state '${f}' is not a state`),
      ...(has(c.to) ? [] : [`${a.id}.${c.name}: to-state '${c.to}' is not a state`]),
      ...(ACTORS.includes(c.actor) ? [] : [`${a.id}.${c.name}: actor '${c.actor}' must be one of ${ACTORS.join(", ")}`]),
      ...(c.from.length ? [] : [`${a.id}.${c.name}: has no from-state`]),
      ...c.from.filter((f) => terminal.has(f) && !c.reopen).map((f) => `${a.id}.${c.name}: leaves terminal state '${f}' without reopen: true`),
      ...c.from.filter((f) => f === c.to).map((f) => `${a.id}.${c.name}: self-transition on '${f}'; model it as a non-transition command`),
    ]),
    ...duplicates(pairs).map((p) => `${a.id}: command '${p.replace("@", "' from '")}' is declared twice (non-deterministic)`),
    ...names.filter((x) => !reach.includes(x)).map((x) => `${a.id}: state '${x}' is unreachable from ${a.initial}`),
    ...names
      .filter((x) => !terminal.has(x) && !a.commands.some((c) => c.from.includes(x)))
      .map((x) => `${a.id}: non-terminal state '${x}' has no outgoing command`),
  ];
};

// dsmStates: Map from DSM-* id to its declared states.
export const checkAgainstDsm = (a, dsmStates) => {
  const base = a.source?.startsWith("DSM-") ? dsmStates.get(a.source) : [];
  if (base === undefined) return [`${a.id}: source ${a.source} has no States list in DOMAIN-STATE-MODEL.md`];
  const expected = expectedStates(base, a.amends);
  const actual = a.states.map((s) => s.name);
  return [
    ...expected.filter((x) => !actual.includes(x)).map((x) => `${a.id}: ${a.source} state '${x}' is missing and not declared in amends`),
    ...actual.filter((x) => !expected.includes(x)).map((x) => `${a.id}: state '${x}' is not in ${a.source} and not declared in amends`),
  ];
};

export const checkProposal = (doc, dsmStates) => [
  ...(doc?.schema === "mercatus.transition-proposal/v1" ? [] : ["transitions: expected schema mercatus.transition-proposal/v1"]),
  ...(Array.isArray(doc?.aggregates) ? [] : ["transitions: 'aggregates' must be an array"]),
  ...duplicates((doc?.aggregates ?? []).map((a) => a.id)).map((id) => `transitions: aggregate '${id}' declared twice`),
  ...(doc?.status === "accepted"
    ? (doc?.aggregates ?? []).filter((a) => !a.requirementId).map((a) => `${a.id}: an accepted table needs a requirementId`)
    : []),
  ...duplicates((doc?.aggregates ?? []).map((a) => a.requirementId).filter(Boolean)).map((id) => `transitions: requirementId '${id}' used twice`),
  ...(doc?.aggregates ?? []).flatMap((a) => [...checkAggregate(a), ...checkAgainstDsm(a, dsmStates)]),
];

// Markdown rendering of the tables, so the human-readable proposal can never
// drift from the data (the gate compares the committed file with this output).
const cell = (x) => String(x).replaceAll("|", "\\|");

const renderAggregate = (a) =>
  [
    `### ${a.id} (${a.source}${a.findings?.length ? `; ${a.findings.join(", ")}` : ""})`,
    "",
    ...(a.requirementId ? [`ID: \`${a.requirementId}\``, ""] : []),
    ...(a.resolves ? [a.resolves, ""] : []),
    `States: ${a.states.map((s) => (s.terminal ? `**${s.name}** (terminal${s.note ? `, ${s.note}` : ""})` : s.note ? `${s.name} (${s.note})` : s.name)).join(", ")}. Initial: ${a.initial}${a.entryStates?.length ? `; also entered at ${a.entryStates.join(", ")}` : ""}.`,
    ...(a.amends ? ["", `Amends ${a.source}: ${JSON.stringify(a.amends)}`] : []),
    "",
    "| Command | From | To | Actor | Capability | Guard |",
    "|---|---|---|---|---|---|",
    ...a.commands.map(
      (c) => `| ${c.name}${c.reopen ? " ↺" : ""} | ${c.from.join(", ")} | ${c.to} | ${c.actor} | ${c.capability ?? "—"} | ${cell(c.guard)} |`,
    ),
    ...(a.nonTransitions?.length ? ["", `Non-transition commands (no state change): ${a.nonTransitions.join(", ")}.`] : []),
    "",
  ].join("\n");

export const BEGIN = "<!-- BEGIN generated: node tools/modernization/render-transitions.mjs -->";
export const END = "<!-- END generated -->";

export const renderTables = (doc) => [BEGIN, "", ...doc.aggregates.map(renderAggregate), END].join("\n");

export const spliceGenerated = (markdown, generated) => {
  const start = markdown.indexOf(BEGIN);
  const end = markdown.indexOf(END);
  return start < 0 || end < start ? null : markdown.slice(0, start) + generated + markdown.slice(end + END.length);
};

export const checkRendered = (markdown, doc) => {
  const spliced = spliceGenerated(markdown, renderTables(doc));
  return spliced === null
    ? ["transitions: the proposal document has no generated-table markers"]
    : spliced === markdown
      ? []
      : ["transitions: generated tables are stale; run node tools/modernization/render-transitions.mjs"];
};
