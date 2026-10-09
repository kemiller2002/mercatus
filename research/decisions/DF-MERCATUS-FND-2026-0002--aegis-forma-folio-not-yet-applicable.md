---
id: DF-MERCATUS-FND-2026-0002
title: Aegis, Forma and Folio are not yet applicable to Mercatus, which has no application code; the first application slice makes each required again
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
  - .echelon/foundations.json
  - .github/workflows/echelon-foundations.yml
  - research/decisions/DF-MERCATUS-FND-2026-0001--limen-boundary-not-yet-applicable.md
  - README.md
tags: [governance, foundations, aegis, forma, folio, applicability]
provenance:
  contributions:
    EXE-20261009T005857648Z-5cb8f7f4:
      operations: [created]
      at: 2026-10-09T00:59:35.190Z
      actor:
        kind: agent
        id: anthropic/claude-code
        provider: anthropic
        model: unknown
        runtime: claude-code
      reason: "Declare Aegis, Forma and Folio not yet applicable; run foundations verify in CI"
---

# DF-MERCATUS-FND-2026-0002: Aegis, Forma and Folio are not yet applicable to Mercatus

- **Date:** 2026-10-09
- **Status:** accepted
- **Decision type:** applicability declaration, with restoration triggers
- **Work item:** WI-0011
- **Authority:** portfolio coordinator instruction: install the foundations
  if they really are required, otherwise correct `foundations.json` and
  record why, and make `praxis foundations verify` pass in CI.

## Context

WI-0001 installed `.echelon/foundations.json` from the template, with every
capability `required: true`. No applicability decision was taken at the time.
As a result, `./praxis foundations verify` failed on main:

- ECHELON-FND-AEGIS-001: Aegis is required but not installed or declared.
- ECHELON-FND-FORMA-001: Forma is required but not installed or declared.
- ECHELON-FND-FOLIO-001: Folio is required but not installed or declared.

The `echelon-foundations.yml` workflow was deferred to WI-0003, so CI did not
show the failure.

For a required capability, the verifier checks four things (Praxis
`docs/application-foundations.md`): installed, pinned, **used** and
evidence. "Used" means source evidence that the capability is consumed:
"merely adding a package does not satisfy the contract". Concretely:

- **Aegis:** `EchelonFoundry.Aegis.Core` in a project file, plus
  `open Aegis` or `Aegis.guard`/`Aegis.capture` in F# source.
- **Forma and Folio:** their packages referenced from application source.

Mercatus has no application code. It has no `.fsproj`, no `src/`, and no UI
or document-rendering source. It holds requirements, research and governance
(see DF-MERCATUS-FND-2026-0001). Installing the three packages now would
therefore fail as ECHELON-FND-*-003 (declared but not used). The only ways to
make that pass would be placeholder code or dropping the usage check, and
both would misrepresent the repository.

## Decision

1. `.echelon/foundations.json` declares Aegis, Forma and Folio
   `required: false`. Their versions (1.0.0, 0.4.1, 0.3.0) and Aegis's
   `boundaryManifest` stay as the baselines to adopt, so restoring a
   capability is a one-word change. The verifier reports them as N/A, not
   PASS.
2. Limen, Ordo and Praxis stay required. They pass because the repository
   really does consume them: Limen through its installation and its recorded
   not-yet-applicable boundary, Ordo and Praxis through their lifecycles.
3. `.github/workflows/echelon-foundations.yml` adds the portfolio's standard
   reusable `foundations-verify.yml`, pinned to the same Praxis ref as Strata
   and Vigila. CI now runs `praxis foundations verify` on every push and pull
   request.

## Restoration triggers

Each capability becomes `required: true` again, and this record is
superseded, in the change that introduces the corresponding code:

- **Aegis:** the first F#/.NET project. Engine and integration code are
  expected to be F#, and Aegis governs their fault boundaries.
- **Forma:** the first user-facing browser UI. Mercatus's browser
  application is planned on Limen (README).
- **Folio:** the first printable or exported document surface, for example
  reports or case material.

The first application slice (WI-0003) is expected to restore at least Aegis
and Forma, together with the Limen paths that DF-MERCATUS-FND-2026-0001 names.

## Consequences

- `./praxis foundations verify` passes locally and in CI. It reports Aegis,
  Forma and Folio as N/A, and Limen, Ordo and Praxis as PASS.
- WI-0003 no longer needs to add the foundations workflow. Its remaining
  scope is to restore the capabilities and Limen paths above with real code.
