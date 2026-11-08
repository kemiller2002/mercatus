---
id: PROJECT-CHARTER-mercatus
title: Mercatus Project Charter
status: draft
version: 0.2.0
created: 2026-10-06
updated: 2026-11-08
---

# Mercatus project charter

## Purpose

Mercatus is the Echelon Sales and Marketing system: an evidence-driven
commercial intelligence and execution system (DF-MERCATUS-DOM-2026-0001). It
treats sales and marketing as explicit state, evidence, hypotheses, controlled
transitions, obligations, experiments, external effects, outcomes and
learning. It is not a conventional CRM, a mass-outreach engine or a
collection of disconnected agents (`PRD-24`).

The canonical requirements are in `requirements/`. Every section carries a
stable ID.

## Intended users

Echelon's own commercial work: discovering markets and problems, qualifying
organizations and contacts, running campaigns and outreach, developing
opportunities, and learning from outcomes (`PRD-02`). Agents act only through
capability-scoped transitions (`PRD-18`).

## First bounded outcome

The initial vertical slice (`PRD-25`): MarketHypothesis → ProblemHypothesis →
Organization discovery → Observation/Evidence → Lead → Qualification →
Opportunity → Outcome → Learning. It must exercise Praxis, Ordo, Limen, F#,
states, transitions, evidence, obligations, policies, capabilities, audit and
agent boundaries before broad automation is added.

## Included

- The Tier 1/2 F# domain core for the first slice, with the domain tests
  required by `DVR-01`.
- Its application contracts and, once those contracts are verified, its
  Limen/Forma screens (`docs/modernization/DOMAIN-UI-CONTRACTS.md`).
- Evidence and decision traceability through Praxis.

## Excluded (for the first slice)

- Real outbound sending to external parties before WF-09 passes its gate.
- Production handling of secrets or personal data before a privacy and threat
  review (`PRD-22`).
- Additional providers before the integration contract is proven (`IMP-06`).

## Success criteria

- The first slice's workflows pass the modernization gate
  (`docs/modernization/WORKFLOW-BOUNDARY-REVIEW.md`).
- Material decisions cite their evidence and alternatives.
- A successor can continue from repository records without chat history.

## Owners and decision authority

The repository owner holds decision authority over business rules. Agents
record proposals and do not change business rules silently.
