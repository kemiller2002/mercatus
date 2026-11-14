# Mercatus handoff

## Objective

Build Mercatus, the Echelon Sales and Marketing system (DF-MERCATUS-DOM-2026-0001). The
sections below the WI-0012 heading are current; the bootstrap notes above them are historical.

## Current state

- ROS 3.6.0 greenfield profile installed on 2026-10-06.
- Project charter is a draft.
- No first vertical slice, evidence record, hypothesis, or experiment has been
  accepted.
- The operating system is under evaluation.

## Validation

Run:

```bash
./ros registry check
./ros validate
```

## Continuity

An executor session is disposable. Before handing off, commit and push the
work, record `./ros work checkpoint --id ID --occurred-at NOW --summary ...
--next-action ...`, and push the `.ros/` state. A successor reads
`./ros work context ID --text` and takes over with `./ros work continue`.

## Unresolved questions

1. What concrete communication problem and user should the first slice serve?
2. What baseline workflow will be used for comparison?
3. What data, privacy, safety, and accessibility constraints apply?
4. Which outcome would distinguish useful engineering from additional process?

## Next action

Complete `PROJECT-CHARTER.md`, choose the first bounded outcome, and record its
baseline and acceptance criteria in `context/CURRENT-STATE.md`.

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
