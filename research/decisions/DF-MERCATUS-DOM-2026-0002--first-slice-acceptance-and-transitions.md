---
id: DF-MERCATUS-DOM-2026-0002
title: "Owner decisions: PRD-25 acceptance criteria, synthetic-data policy, and first-slice transition tables"
status: accepted
decision_type: domain
created: 2026-11-15
updated: 2026-11-15
created_by_agent: claude
confidence: high
supersedes: []
superseded_by: []
evidence: []
related_documents:
  - requirements/PRODUCT-REQUIREMENTS.md
  - requirements/DOMAIN-STATE-MODEL.md
  - requirements/SLICE-TRANSITIONS.md
  - requirements/slice-transitions.json
  - docs/first-slice/PRD-25-ACCEPTANCE.md
  - docs/modernization/DOMAIN-MODEL-AUDIT.md
  - docs/modernization/WORKFLOW-BOUNDARY-REVIEW.md
tags: [domain, first-slice, transitions, data-policy, owner-decision]
provenance:
  contributions:
    EXE-20261115T090949131Z-253a3bae:
      operations: [created]
      at: 2026-11-15T09:11:40.184Z
      actor:
        kind: agent
        id: anthropic/claude-code
        provider: anthropic
        model: unknown
        runtime: claude-code
      reason: "Record owner acceptance of PRD-25 criteria, synthetic-data policy and first-slice transitions"
---

# DF-MERCATUS-DOM-2026-0002: First-slice acceptance and transitions

- **Date:** 2026-11-15
- **Status:** accepted
- **Work items:** WI-0038 (applies the decision); WI-0051 and WI-0052
  (drafted the proposals, merged in PR #18)
- **Authority:** repository owner. On 2026-11-15 the owner answered the
  proposals' questions Q1–Q6 and decisions P1–P9 with "Accept all
  recommendations". The owner holds decision authority over business rules
  (`PROJECT-CHARTER.md`).

## Decisions

### PRD-25 acceptance (Q1–Q6, `docs/first-slice/PRD-25-ACCEPTANCE.md`)

- **Q1.** PRD-25 becomes a MUST. It is bound to acceptance criteria AC-01 to
  AC-16 and to the synthetic-data policy SDP-01 to SDP-06. Outbound effects
  are excluded. The slice stores no real personal data until WI-0037 is
  decided.
- **Q2.** The slice includes three Forma screens: UI-02, UI-04 and UI-05.
- **Q3.** SDP-01 to SDP-06 apply now, independent of WI-0037. SDP-02 to
  SDP-04 are enforced in CI (CHK-DATA-01).
- **Q4.** The slice may use an in-memory or file store behind the Tier 3 port
  and its contract tests.
- **Q5.** The transition decisions below are accepted.
- **Q6.** The AC-16 independent verifier is the owner, or a separate agent
  session acting under its own identity.

### Transitions (P1–P9, `requirements/SLICE-TRANSITIONS.md`)

- **P1 (FND-04).** DSM-02's MarketHypothesis states are authoritative. PRD-04's
  lifecycle is the suggested subset of them.
- **P2 (FND-05).** Both hypothesis types name the reopen state `Reopened`.
  ProblemHypothesis `Revisit` is renamed.
- **P3 (FND-15).** Evidence freshness is the projection
  `effectiveCurrent(validity, now)`, not a stored state. `Stale` and
  `CanMarkStale` are removed from DSM-05.
- **P4 (FND-11).** A converted Lead creates an Opportunity in
  `ProblemConfirmed`.
- **P5 (FND-12).** **Rejected** means Echelon chose not to pursue. **Lost**
  means the buyer chose an alternative or did not decide.
- **P6 (FND-12).** Regression uses explicit commands:
  `RegressToProblemConfirmed` and `RegressToQualified`.
- **P7 (FND-12, FND-20).** Won requires a CommercialOutcome value.
- **P8 (part of FND-18).** The actor column of each table is the first-slice
  authorization model. Agents never accept evidence, qualify, convert, mark
  Won or Lost, waive, or accept learning.
- **P9.** New capabilities: CanQualify, CanConvert, CanWaive and
  CanAcceptLearning. A new aggregate, LearningRecord, is added as DSM-23.

## Consequences

- FND-04, FND-05, FND-11, FND-12 and FND-15 are resolved by this record.
  FND-03 (other aggregates), FND-14 (blocking-kind semantics), FND-18 (the full
  authorization model) and FND-20 (other unmodelled entities) remain open. This
  record narrows each of them.
- The gate verifies that `requirements/slice-transitions.json` and
  DOMAIN-STATE-MODEL declare the same states, and that the rendered tables are
  current.
- No workflow gate criterion changes. `transitionsDefined` becomes true for a
  workflow only when Tier 2 implements an exhaustive match for its table
  (WORKFLOW-BOUNDARY-REVIEW §5).
- The next step is WI-0013 and WI-0003: the Tier 1/2 F# core for the slice.
