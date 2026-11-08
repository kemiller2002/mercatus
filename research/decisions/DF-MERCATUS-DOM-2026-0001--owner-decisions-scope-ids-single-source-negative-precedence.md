---
id: DF-MERCATUS-DOM-2026-0001
title: "Owner decisions: Sales and Marketing scope, stable requirement IDs, one source of truth, and negative eligibility precedence"
status: accepted
decision_type: domain
created: 2026-11-08
updated: 2026-11-08
created_by_agent: claude
confidence: high
supersedes: []
superseded_by: []
evidence: []
related_documents:
  - docs/modernization/DOMAIN-MODEL-AUDIT.md
  - requirements/DOMAIN-STATE-MODEL.md
  - requirements/INTEGRATION-REQUIREMENTS.md
  - PROJECT-CHARTER.md
tags: [domain, requirements, eligibility, governance, owner-decision]
provenance:
  contributions:
    EXE-20261108T163703269Z-61e14de4:
      operations: [created]
      at: 2026-11-08T16:39:43.134Z
      actor:
        kind: agent
        id: anthropic/claude-code
        provider: anthropic
        model: unknown
        runtime: claude-code
      reason: "Record owner decisions on scope, stable requirement IDs, single source of truth and negative eligibility precedence"
---

# DF-MERCATUS-DOM-2026-0001: Owner decisions from the domain model audit

- **Date:** 2026-11-08
- **Status:** accepted
- **Decision type:** domain and requirements governance
- **Work items:** WI-0032, WI-0014, WI-0020, WI-0021
- **Authority:** repository owner, answering the four owner-decision findings
  of `docs/modernization/DOMAIN-MODEL-AUDIT.md` (FND-21, FND-02, FND-09,
  FND-10). The owner's words are quoted under each decision.

## Decision 1: Mercatus is the Echelon Sales and Marketing system (FND-21, WI-0032)

> "Sales and marketing system"

The template charter's "communication problem" pilot is withdrawn. The
authoritative scope is the evidence-driven commercial intelligence and
execution system described in `README.md` and `requirements/`. The charter,
current state and handoff are updated to match. The first bounded outcome is
the vertical slice in `PRD-25`.

## Decision 2: Requirements carry stable IDs (FND-02, WI-0014)

> "Stable ids"

Every `##`, `###` and `####` section in `requirements/*.md` carries an
`` ID: `...` `` line directly under its heading. The rules are:

1. The ID lives in the requirement document itself. It is the only source of
   the ID. No separate index is kept.
2. The prefix names the document (`PRD`, `DSM`, `INT`, `DVR`, `EFF`, `SCN`,
   `IMP`, `LEG`, `OPD`, `PCR`, `PGS`, `CEX`, `CLS`, `CPR`, `RDC`). The suffix is
   the section's number where it has one (`PRD-09`, `PRD-26.1`, `SCN-08`,
   `PGS-C01`). Otherwise it is assigned once, in document order (`INT-11`).
   An ID already in the heading (`REQ-BOOTSTRAP-001`) is kept.
3. Once assigned, an ID never changes or gets reused. Renaming or moving a
   section keeps its ID. A new section takes a new, unused ID, for example
   `DSM-07A` for a section inserted after `DSM-07`.
4. `tools/modernization/verify-gate.mjs` fails CI if a section lacks an ID,
   if an ID is duplicated, or if traceability cites an ID that no longer
   exists.

The interim IDs published in WI-0012 are kept, except the descriptive
`INT-*` and `DVR-*` names. Those become `INT-01`, `INT-10`, `INT-11`,
`INT-13`, `INT-14`, `INT-15`, `INT-16`, `DVR-01`, `DVR-02` and `DVR-03`. They
were never merged.

## Decision 3: One source of truth (FND-09, WI-0020)

> "We need one source of truth"

Each fact has exactly one authoritative owner. Other aggregates and
projections reference that fact rather than keep their own copy. Applied
here:

- **CommunicationEligibility** (`DSM-07A`) is the only place that records
  whether a contact or organization may be contacted.
- `Reachable` and `DoNotContact` are removed from the Contact lifecycle.
  `DoNotEngage` is removed from the Organization lifecycle and becomes an
  organization-scope restriction in CommunicationEligibility.

The principle also governs the open findings with duplicated authority. It
directs their resolution, and they still need their own transition
specifications:

- FND-07: send state (WI-0018).
- FND-08: Unknown effect states (WI-0019).
- FND-17: approval state (WI-0028).

## Decision 4: Negative always overrides positive (FND-10, WI-0021)

> "Do not engage takes precedence, negative always overrides positive. We can
> change negative if we need to but it should be active if it's set to that"

1. A restriction (DoNotContact, Unsubscribed, InvalidAddress, DoNotEngage)
   always overrides any permission, at any scope. An organization's
   DoNotEngage blocks every affiliated contact, whatever that contact's own
   permissions.
2. A restriction is active from the moment it is set until it is explicitly
   lifted. It is evaluated at send time.
3. A restriction can be lifted. Lifting it is an explicit, authorized
   transition that records actor, rationale and time. It never lapses through
   campaign membership, inference, elapsed time or agent action. Agents may
   not lift restrictions.
4. Lifting keeps history. The record of when a restriction was set and lifted
   is retained.

## Consequences

- `requirements/DOMAIN-STATE-MODEL.md` §6, §7, new §7a and §22 and
  `requirements/INTEGRATION-REQUIREMENTS.md` (`INT-11`) are amended.
- Domain rules DR-CON-01 and DR-ELIG-01 in
  `docs/modernization/traceability.json` become specified. They are still
  unimplemented, and the workflows stay blocked by FND-01.
- WF-04 and WF-10 lose their owner-decision blockers. FND-02, FND-09, FND-10
  and FND-21 are resolved.
