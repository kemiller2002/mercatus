---
id: DF-MERCATUS-FND-2026-0001
title: The Limen boundary is not yet applicable to Mercatus, which has no engine or kernel code; the first application slice restores it
status: accepted
decision_type: applicability
created: 2026-10-09
updated: 2026-10-09
created_by_agent: claude
confidence: high
supersedes: []
superseded_by: []
evidence: []
related_documents:
  - limen.config.json
  - .echelon/limen.json
  - .echelon/foundations.json
  - .github/workflows/limen-verify.yml
  - README.md
tags: [governance, foundations, limen, applicability]
provenance:
  contributions:
    EXE-20261009T003343840Z-454bbc38:
      operations: [created]
      at: 2026-10-09T00:34:20.450Z
      actor:
        kind: agent
        id: anthropic/claude-code
        provider: anthropic
        model: unknown
        runtime: claude-code
      reason: "Declare the Limen boundary not yet applicable during the Limen 0.9.0 rollout"
---

# DF-MERCATUS-FND-2026-0001: The Limen boundary is not yet applicable to Mercatus

- **Date:** 2026-10-09
- **Status:** accepted
- **Decision type:** applicability declaration, with a restoration trigger
- **Work item:** WI-0010
- **Authority:** portfolio coordinator instruction for the Limen 0.9.0
  rollout: fix the false configuration rather than inventing code.

## Context

The README states that Mercatus's browser application will use Limen, and
`.echelon/foundations.json` requires Limen. Until now, however,
`limen.config.json` declared an engine at `src/engine` and a kernel at
`src/kernel`, and neither exists. The repository holds requirements,
research, governance and tool installations only. Its one script,
`tools/ros_fs_launcher.mjs`, is the Praxis launcher.

As a result, `limen verify --strict` failed on main under 0.7.1 with
LIMEN010 (both paths absent) and LIMEN012 (no engine code checked). WI-0002
removed the tool-owned `limen-verify.yml` so that this failure would not run
in CI. That left the Limen installation recorded but unverified, and the
manifest itself failed strict verification (LIMEN007). The configuration
described a boundary the repository does not have.

## Decision

1. `limen.config.json` declares the boundary not applicable, using Limen's
   supported mechanism: `"boundary": { "notApplicable": { "rationale": … } }`
   (Limen `docs/20-lifecycle-cli.md`, verdict `not-applicable`). The
   rationale cites this record and names the restoration trigger.
2. `limen-verify.yml` is restored by `limen upgrade` (0.9.0), byte-identical
   to what Limen writes, so CI re-checks the declaration on every push and pull
   request.
3. `.echelon/foundations.json` keeps Limen `required: true`, pinned to 0.9.0.
   Limen remains the chosen architecture for the planned browser
   application; only the boundary check has nothing to check yet.

This is an honest verdict, not a pass. Limen reports `not-applicable` rather
than `passed`, and no placeholder engine or kernel code was added.

## Restoration trigger

The first engine or kernel source file to land ends this declaration. That
change, planned as WI-0003, must:

- replace `notApplicable` with the real engine and kernel paths in the same
  change;
- supersede this record.

Adding browser, WASM, engine or kernel code while this declaration stands is a
defect.

## Consequences

- `limen verify --strict` runs in CI and passes with verdict `not-applicable`.
- WI-0003's scope narrows: the Limen workflow is already present, and
  WI-0003 replaces the declaration with real paths and adds the foundations
  workflow.
- Unchanged by this record: `./praxis foundations verify` still reports
  Aegis, Forma and Folio as required but not installed. That predates this
  change and is outside its scope.
