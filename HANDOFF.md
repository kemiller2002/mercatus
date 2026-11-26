# Mercatus handoff

## Objective

Build Mercatus, the Echelon Sales and Marketing system (DF-MERCATUS-DOM-2026-0001). The
sections below are dated milestone notes; the newest is last.

## Current state

- Governed by Conditor at echelon-current 1.43.0 (WI-0054): Praxis 3.26.0,
  Ordo 1.20.0, Limen 0.9.1, Forma 1.0.1, echelon-theme 1.1.0, Folio 0.4.1.
  The optional Aegis declaration in `.echelon/foundations.json` is 2.0.2.
- No application code yet. The domain model and UI contracts are specified;
  all 15 workflows are blocked by the modernization gate.
- See `context/CURRENT-STATE.md` for the live summary and the sections below
  for each milestone.

## Validation

```bash
./praxis registry check
./praxis validate
./praxis foundations verify
node tools/modernization/verify-gate.mjs
npm run test:modernization
conditor status --target .    # with GH_TOKEN/GITHUB_TOKEN unset in cloud sessions
```

## Continuity

Commit and push, then `./praxis work checkpoint --id ID --occurred-at NOW
--summary ... --next-action ...`, then push `.ros/`. A successor reads
`./praxis work context ID --text` and takes over with `./praxis work continue`.

## Next action

Owner decisions WI-0039 and WI-0044; first-slice readiness WI-0037 and WI-0038;
then the specification fixes WI-0015, WI-0022, WI-0025, WI-0029.

## WI-0012: domain model and workflow validation gate (2026-11-08)

- Mercatus has no application code; the domain model exists only in
  `requirements/`. No workflow passes the modernization gate and no Forma work
  has started (there is no UI to migrate).
- Deliverables: `docs/modernization/DOMAIN-MODEL-AUDIT.md`,
  `WORKFLOW-BOUNDARY-REVIEW.md`, `DOMAIN-UI-CONTRACTS.md`, and the
  machine-readable `traceability.json`.
- Gate check: `node tools/modernization/verify-gate.mjs` and
  `node --test tools/modernization/gate.test.mjs` (CI job `modernization-gate`).
- 27 findings; 22 actionable ones are filed as WI-0013 to WI-0034. Owner
  decisions first: WI-0032 (charter vs product scope), WI-0014, WI-0020, WI-0021.
- Next: resolve the critical specification findings (WI-0015, WI-0022,
  WI-0025, WI-0029), then WI-0013/WI-0003 implements the Tier 1/2 F# core for
  the PRD §25 vertical slice.

## WI-0035 and WI-0036: toolchain, requirements evaluation and UI (2026-11-14)

- **Toolchain:** Conditor now governs echelon-current 1.39.0: Praxis 3.25.0, Ordo
  1.20.0, Limen 0.9.1, Forma 1.0.1, echelon-theme 1.1.0 and Folio 0.4.1. Run
  `conditor status --target .`, with `GH_TOKEN` and `GITHUB_TOKEN` unset in
  cloud sessions.
- **Requirements:** the evaluation is in
  `docs/requirements-evaluation/REQUIREMENTS-EVALUATION-2026-11.md`. Follow-ups
  are WI-0037 to WI-0044; WI-0039 and WI-0044 need owner decisions.
- **UI:** the requirements are `requirements/UI-REQUIREMENTS.md` (UIR-01 to
  UIR-15). The review is `docs/ui/UI-REVIEW.md`, and the integration guide for
  the first screen is `docs/ui/UI-INTEGRATION.md`. Print contracts PR-01 to
  PR-07 are gated like screens.
- **Gate:** `node tools/modernization/verify-gate.mjs` and
  `npm run test:modernization` (31 tests).
- **Open:** Folio's Forma 1.x alignment (WI-0045), Forma pattern gaps
  (WI-0046), and browser conformance tooling with the first screen (WI-0047).

## WI-0048 to WI-0050: context refresh, coverage ratchet, drift advisory (2026-11-14)

- The context files now describe the Sales and Marketing scope (they no
  longer describe the template pilot).
- `node tools/modernization/verify-gate.mjs` prints requirement coverage
  (81 of 317 listed, 75 linked) and fails if it changes without a
  baseline edit in `traceability.json` `coverage`. Add `--coverage` to list
  the untraced IDs.
- `.github/workflows/conditor-drift.yml` runs weekly (Monday 06:17 UTC) and on
  demand. It fails only when a pin is below the Registry's supported range.

## WI-0051 and WI-0052: first-slice proposals (2026-11-14)

- `docs/proposals/PRD-25-ACCEPTANCE.md` holds acceptance criteria AC-01..16,
  the synthetic-data policy SDP-01..06, CommercialOutcome and
  LearningRecord, and replacement text for PRD-25. Owner questions Q1..Q6.
- `docs/proposals/SLICE-TRANSITION-TABLES.md` and `slice-transitions.json`
  hold transition tables for 9 aggregates (67 commands). Owner decisions
  P1..P9. Regenerate the tables with `npm run render:transitions`.
- Gate additions: CHK-TRN-01 (transition proposal coherence) and CHK-DATA-01
  (synthetic fixtures). 50 tests.
- Both documents are proposals. Accepting them advances WI-0038, WI-0015,
  WI-0016, WI-0022, WI-0023, WI-0025 and WI-0026.

## WI-0038: first-slice decisions accepted (2026-11-15)

- The owner accepted every recommendation (Q1–Q6, P1–P9), recorded as
  DF-MERCATUS-DOM-2026-0002.
- PRD-25 is now normative and points to `docs/first-slice/PRD-25-ACCEPTANCE.md`.
- The transition tables moved to `requirements/SLICE-TRANSITIONS.md` and
  `requirements/slice-transitions.json`, with IDs TRN-*. The earlier
  `docs/proposals/` paths are gone.
- DOMAIN-STATE-MODEL is amended:
  - ProblemHypothesis Revisit is renamed Reopened.
  - Evidence Stale is removed; freshness is a projection.
  - DSM-08 and DSM-09 define conversion, Lost vs Rejected, regression and
    CommercialOutcome.
  - New DSM-23 LearningRecord.
- FND-04, FND-05, FND-11, FND-12 and FND-15 are resolved. Coverage is 94
  listed and 88 linked.
- **Next:** WI-0013 and WI-0003, the F# core for the slice. Tier 2 must match
  every table exhaustively before any workflow's `transitionsDefined` flips.

## WI-0013: first-slice F# domain core (2026-11-15)

- `Mercatus.slnx`, `src/domain/` (Tier 1/2, FSharp.Core only), and
  `tests/Mercatus.Domain.Tests/` (xUnit). Build with .NET 10:
  `dotnet test Mercatus.slnx -c Release`, or `npm run test:domain`.
- Each of the nine aggregates has typed states, typed commands and one
  exhaustive `decide`. FS0025 (incomplete match) is a build error. Freshness
  is `Evidence.effectiveCurrent`, and blocking is `Obligation.blocking`.
- The conformance suite tries every command from every state against
  `requirements/slice-transitions.json`. It covers targets, illegal
  transitions, actor rules, capabilities and blocking obligations. A mutation
  test confirmed it catches drift. Guard tests cover AC-04..07 and AC-11, and
  a pure happy path covers part of AC-02. 25 tests in total.
- Gate additions: CHK-ARCH-01 (no references and no ambient effects in
  `src/domain`), and an inventory revised to 2/9/0/5. CI runs the
  `build-and-test.yml` workflow.
- Aegis is restored with the first host project, not the domain
  (DF-MERCATUS-FND-2026-0004).
- **Next:** Tier 3 command handling (expected version, idempotency, event
  envelope, replay) and the store port with its contract tests (AC-08..10).
  Then the Limen host and the Forma screens (WI-0003).

## WI-0053: echelon-current 1.42.0 (2026-11-25)

- Conditor 0.10.29 `upgrade --current` against the 1.42.0 linux-x64 set
  (`sha256:6be3bc97…`, plan `sha256:d208f17e…`): no component version
  changed; the registry authority and lock moved from 1.39.0 to 1.42.0.
  Second-plan drift: none.
- 1.42.0 supports Aegis `>=2.0.0 <3.0.0`, so `conditor drift --fail-on fail`
  failed on the optional Aegis 1.0.0 declaration in `.echelon/foundations.json`
  (not in `conditor.json`, so Conditor does not move it). It is now 2.0.2, and
  `docs/ui/UI-INTEGRATION.md` names Aegis 2.0.2 for the first UI slice.
