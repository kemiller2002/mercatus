---
id: DF-MERCATUS-FND-2026-0004
title: The Aegis restoration trigger is the first host or integration project, not the pure Tier 1/2 domain library
status: accepted
decision_type: applicability
created: 2026-11-15
updated: 2026-11-15
created_by_agent: claude
confidence: high
supersedes: []
superseded_by: []
evidence: []
related_documents:
  - research/decisions/DF-MERCATUS-FND-2026-0002--aegis-forma-folio-not-yet-applicable.md
  - docs/modernization/WORKFLOW-BOUNDARY-REVIEW.md
  - docs/modernization/DOMAIN-UI-CONTRACTS.md
  - src/domain/Mercatus.Domain.fsproj
  - tools/modernization/architecture.mjs
tags: [governance, foundations, aegis, architecture, applicability]
provenance:
  contributions:
    EXE-20261115T122951039Z-f1d4cc56:
      operations: [created]
      at: 2026-11-15T12:38:17.577Z
      actor:
        kind: agent
        id: anthropic/claude-code
        provider: anthropic
        model: unknown
        runtime: claude-code
      reason: "Make the Aegis restoration trigger precise: first host or integration project, not the pure domain"
---

# DF-MERCATUS-FND-2026-0004: Aegis is restored with the first host project

- **Date:** 2026-11-15
- **Status:** accepted
- **Decision type:** applicability clarification. It amends the Aegis
  trigger in DF-MERCATUS-FND-2026-0002 and leaves the rest of that record
  unchanged.
- **Work item:** WI-0013

## Context

DF-MERCATUS-FND-2026-0002 says Aegis becomes required with "the first
F#/.NET project", because "engine and integration code are expected to be
F#, and Aegis governs their fault boundaries".

WI-0013 adds the first F# project, `src/domain/Mercatus.Domain.fsproj`. It is
the Tier 1/2 semantic model and its pure domain rules. Two requirements
already in force conflict with binding Aegis there:

- WORKFLOW-BOUNDARY-REVIEW §5 requires the Tier 1 references to be
  FSharp.Core only (`domainModelVerified`).
- DOMAIN-UI-CONTRACTS §2 places fault-prone work (storage, providers,
  listeners) in Tier 4 hosts, invoked only by Tier 3.

The domain has no fault boundary. It performs no I/O and every outcome is a
`TransitionResult` value. The new gate check `CHK-ARCH-01` now enforces
this: no references and no ambient effects.

## Decision

1. Aegis is restored, and `.echelon/foundations.json` sets
   `aegis.required: true`, in the change that adds the first **host or
   integration** project. That means the Tier 3 application layer, the
   Limen engine host (WI-0003), the GitHub store adapter (WI-0030) or a
   provider adapter, whichever lands first.
2. The pure domain library never references Aegis. Hosts map faults with
   Aegis and translate them into results the domain understands.
3. The original reasoning still holds, because Aegis governs the code that
   can fail. Only the trigger is made precise.

## Consequences

- WI-0013 lands without Aegis, and `praxis foundations verify` still reports
  Aegis as N/A, which is truthful.
- The first host project must add `EchelonFoundry.Aegis.Core`, use it in
  source, set `aegis.required: true`, and supersede DF-MERCATUS-FND-2026-0002
  and this record. Foundations verify fails ECHELON-FND-AEGIS-003 if it is
  declared but unused, so the restoration cannot be faked.
