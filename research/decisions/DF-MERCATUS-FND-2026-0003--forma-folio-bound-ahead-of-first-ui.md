---
id: DF-MERCATUS-FND-2026-0003
title: Forma 1.0.1, Folio 0.4.1 and echelon-theme 1.1.0 are installed and governed by Conditor before the first UI; foundations stay N/A until application source uses them
status: accepted
decision_type: applicability
created: 2026-11-14
updated: 2026-11-14
created_by_agent: claude
confidence: high
supersedes: []
superseded_by: []
evidence: []
related_documents:
  - conditor.json
  - .conditor/lock.json
  - .echelon/foundations.json
  - package.json
  - research/decisions/DF-MERCATUS-FND-2026-0002--aegis-forma-folio-not-yet-applicable.md
  - docs/ui/UI-INTEGRATION.md
tags: [governance, foundations, forma, folio, echelon-theme, conditor, applicability]
provenance:
  contributions:
    EXE-20261114T100832798Z-1b15c02c:
      operations: [created]
      at: 2026-11-14T10:12:34.041Z
      actor:
        kind: agent
        id: anthropic/claude-code
        provider: anthropic
        model: unknown
        runtime: claude-code
      reason: "Bind Forma 1.0.1, Folio 0.4.1 and echelon-theme 1.1.0 under Conditor ahead of the first UI"
---

# DF-MERCATUS-FND-2026-0003: Forma, Folio and the Echelon theme are bound before the first UI

- **Date:** 2026-11-14
- **Status:** accepted
- **Decision type:** applicability amendment (amends, does not supersede,
  DF-MERCATUS-FND-2026-0002)
- **Work item:** WI-0035
- **Authority:** repository owner instruction (2026-11-14): install Conditor
  and Praxis, set up the integration with its fixes, and make sure the UI
  uses Forma and Folio.

## Context

DF-MERCATUS-FND-2026-0002 declared Forma (0.4.1) and Folio (0.3.0) not yet
applicable because Mercatus has no application code. It kept their versions
as baselines and named the first user-facing UI (Forma) and the first
printable or exported surface (Folio) as restoration triggers.

Since then the Registry channel `echelon-current` moved to 1.39.0. It selects
Forma 1.0.1, Folio 0.4.1 and the optional `echelon-theme` 1.1.0. Forma 1.0.0
is a breaking boundary: the `ef-` namespace became `forma-` (FORMA-NS-001)
and the Echelon brand moved out of Forma into `echelon-theme` (BNR-001,
EDS-ADR-002). `conditor drift` reported Forma 0.4.1 as **below the supported
range** (`>=1.0.0 <2.0.0`) of the channel profile, an overall `fail`.

Because no UI source exists, no code needs migrating across that boundary.
Moving now costs nothing and means the first screen is written against the
current namespace rather than migrated later.

## Decision

1. `package.json` pins the exact, SHA-256-verified Registry release assets
   of `@echelon-foundry/design-system` 1.0.1 (Forma),
   `@echelon-foundry/print-components` 0.4.1 (Folio) and
   `@echelon-foundry/echelon-theme` 1.1.0, locked in `package-lock.json`.
2. `conditor.json` declares `forma` 1.0.1, `folio` 0.4.1, `limen` and
   `echelon-theme` 1.1.0 (optional, as the Registry selects it). From now on
   Conditor owns these pins: `conditor upgrade --current` moves them, and they
   are never hand-edited (Conditor `docs/web-package-upgrade-contract.md`,
   CON-330..333). The declaration was applied in the same authorized current
   upgrade that moved Praxis 3.7.2 -> 3.25.0, Ordo 1.5.0 -> 1.20.0 and Limen
   0.9.0 -> 0.9.1.
3. `.echelon/foundations.json` keeps Forma and Folio `required: false`, with
   their baselines moved to 1.0.1 and 0.4.1. The foundations verifier's
   "used" check needs real application source. Placeholder code to make it
   pass would misrepresent the repository, so the reason in
   DF-MERCATUS-FND-2026-0002 still holds.
4. The UI requirements now make Forma and Folio mandatory for every screen
   and every printed or exported surface (`requirements/UI-REQUIREMENTS.md`).
   The restoration triggers in DF-MERCATUS-FND-2026-0002 are unchanged: the
   change that adds the first screen sets Forma `required: true`, and the
   change that adds the first printable or exported surface does the same for
   Folio.

## Alternatives considered

- **Leave the pins at 0.4.1/0.3.0 until the first UI.** Rejected. Drift fails
  below the supported range, and the first UI would have to start on a
  namespace that is already retired.
- **Set Forma and Folio `required: true` now.** Rejected. Foundations verify
  would fail ECHELON-FND-*-003 (declared but unused) until real code exists.
- **Apply the `fsharp-limen-web` scaffold now.** Deferred. Conditor applies
  scaffolds at `init`. Mercatus is an adopted repository, and the modernization
  gate (WI-0012) blocks screens until the first-slice workflows pass. See
  `docs/ui/UI-INTEGRATION.md` for the planned layout.

## Consequences

- `conditor status` verifies all eight declared components. `conditor drift`
  no longer reports Forma below its supported range.
- `praxis foundations verify` passes. Aegis, Forma and Folio are N/A, and
  Limen, Ordo and Praxis are PASS.
- A Forma or Folio move is now a `conditor upgrade --current` plan with a
  digest, never a manual `npm install`.
