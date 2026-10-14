# Demand Creation: Mercatus Reconciliation and Proposed Execution Plan

**Status:** Proposed; pending requirement-by-requirement reconciliation and human strategy approval  
**Date:** 2026-10-14  
**Authoritative repository:** `kemiller2002/mercatus`

## Why this is an extension, not a new marketing system

Mercatus already models market/problem hypotheses, evidence, customer language, ICPs, commercial motions, claims, proof, buying triggers, experiments, learning and approved external effects. The proposed demand-creation initiative makes its central commercial operating goal explicit:

**Help potential customers recognize a real problem, judge whether its consequences justify action, understand the available alternatives, and take a justified next step.**

This is not a license to invent demand, manipulate fears, claim cost savings without evidence, or autonomously contact prospects. We retain demand capture for buyers who already recognize their needs.

## Canonical predecessor coverage

Existing source | What already exists | Demand-creation treatment
---|---|---
`requirements/PRODUCT-REQUIREMENTS.md` | Problem/market hypotheses, ICP, campaigns, metrics, evidence, channel policies | Extend; do not create duplicate aggregate owners
`requirements/PORTFOLIO-COMMERCIAL-REQUIREMENTS.md` | Offering, ProblemPattern, CommercialMotion, Claim, ProofAsset, diagnostic qualification, cross-sell and economics | Reuse as canonical concepts
`requirements/PORTFOLIO-GTM-SCENARIOS.md` | Problem-first scenarios for Clarity, EDF, HelixNote, Echelon Foundry and portfolio combinations | Reuse and test proposed recognition journeys
`requirements/COMMERCIAL-EXPERIMENTS.md` | Problem-first vs product-first tests, diagnostics, proof, timing, substitution, conversions and falsification | Extend with experiment assignment and recognition measurement
`requirements/COMMERCIAL-LEARNING-STATE.md` | Independent states for problem, message, offer, outcome, acquisition and proof | Extend with experience-level measurements, preserving independent states
`requirements/COMPETITIVE-PRESSURE-REQUIREMENTS.md` | Competitive alternatives, bounded diagnostics, independence and proof gaps | Reuse the alternative and independence guards
`requirements/INTEGRATION-REQUIREMENTS.md` | Provider-neutral listening, research, publishing, and authorization | Reuse for pilot channels; no premature connector build
`requirements/RESEARCH-DRIVEN-COMMERCIAL-REQUIREMENTS.md` | Stakeholder groups, forwardable proof, customer research and offer economics | Reuse for buyer committee and forwardability
`requirements/IMPLEMENTATION-PLAN.md` | Research, state, contracts, simulators, observation and bounded vertical slices | Implement one end-to-end problem-recognition slice before parallelizing

## Candidate requirement catalog

- `requirements/DEMAND-CREATION-CANDIDATES.md` contains **94 proposed source requirements**, retaining IDs `DC-001` through `DC-108` (IDs intentionally have category gaps).
- `requirements/DEMAND-CREATION-CANDIDATES.json` mirrors the same source requirements as machine-readable intake material.
- These are **not 94 new executable tasks**. Many are extensions or restatements of established Mercatus obligations.
- Neither a new file nor a GitHub issue is itself an accepted ROS work item. Preserve `DC-###` as source identity when reconciling to existing or new `.ros/work` items.
- For each candidate record disposition as **ExistingCovered**, **ExistingNeedsStrengthening**, **New**, **Conflicts**, or **Deferred**. Capture affected canonical requirement section, rationale and acceptance evidence. Only accepted deltas become executable slices.

### Preliminary overlap crosswalk (requires individual verification)

Candidate family | IDs | Existing coverage and likely delta
---|---|---
Portfolio governance | DC-001..009 | ProblemPattern, Offering, CommercialMotion and campaign approval already exist; add explicit initiative-to-problem inventory and demand-mode separation
Research and evidence | DC-010..019 | Existing evidence/provenance/counterevidence; potentially strengthen recognition baselines and nonleading interview instruments
Recognition journeys | DC-020..028 | New candidate journey/state/asset sequencing and comprehension testing, built on existing Asset/Campaign/ProblemPattern objects
Impact and economics | DC-030..037 | Existing commercial economics and economic-value-of-information; new candidate interactive impact estimators and uncertainty/sensitivity presentation
Interactive diagnostics | DC-040..048 | Existing BoundedDiagnostic/DiagnosticQualification; new candidate self-service assessment contracts, scored results and consent boundaries
Experiments | DC-050..057 | Existing controlled tests and falsification; potentially new randomization/assignment, stopping/contamination and explicit awareness measurement
Distribution | DC-060..067 | Existing channel contracts, policies and approved effects; potentially new reusable research-backed journey packaging, not new autonomous broadcast
Commercial conversion | DC-070..075 | Existing offer ladder, BuyingGroup and conversion record; strengthen diagnostic-to-offer handoffs without forcing product selection
Measurement | DC-080..087 | Existing stage-specific states and outcomes; potentially new recognition-change instruments and exposure-to-action attribution
Architecture and traceability | DC-090..099 | ROS/Ordo, Limen, Forma, Folio, Aegis and source provenance already governed; verify exact versioned use and append-only lineage
Privacy and quality | DC-100..108 | Existing approval, anti-spam, privacy and evidence constraints; strengthen privacy of self-assessment and unsupported-calculator-claim checks

This table identifies likely overlap, not proof of full equivalence. The per-ID acceptance criteria and existing implementations must be checked before merge into canonical domain requirements or ROS queue.

## Proposed first vertical slice: EDF problem-recognition journey

**Candidate audience:** VP Engineering/CTO at a software organization experiencing recurring defects, rework or missed delivery commitments. This ICP is a hypothesis, not a validated market.

**Candidate problem hypothesis:** Some engineering leaders misattribute recurring rework to low individual throughput because causes are structural, decision-related, or architectural.

**User-visible path:**
1. Read a clearly hypothetical but credible recurring-rework scenario.
2. Take an ungated 3–10 minute self-assessment based on explicitly sourced questions.
3. Get a result that separates observations, hypotheses, missing evidence and alternative explanations.
4. Inspect an impact scenario with user-entered values, sensitivity ranges and visible limitations, not a fabricated definitive cost.
5. Compare reasonable options, including no engagement or an internal investigation.
6. Optionally request a bounded EDF diagnostic conversation with consent, policy and buyer-qualification gates.
7. Record anonymized/consented recognition and action outcomes; compare against a product-first message or comparable baseline.

**Must fail closed:** If scoring, impact claims, sources, permissions or approvals are incomplete, present a research-only artifact or block the commercial/public release. Never make an invented savings claim.

## Proposed horizontal implementation slices

Slice | Purpose | Acceptance evidence
---|---|---
DC-SLICE-01 Research and domain reconciliation | Crosswalk source catalog, baseline interviews and pilot approval criteria | Each accepted candidate traces to canonical requirements and clear source/acceptance IDs
DC-SLICE-02 EDF recognition experience | Scenario, accessible responsive journey and learning state | User can reach an informative result without forced lead capture
DC-SLICE-03 Diagnostic and consequence model | Versioned scoring, typed unknowns, no false precision, meaningful alternatives | Deterministic tests, uncertainty tests and privacy checks pass
DC-SLICE-04 Controlled commercial experiment | Variant assignments, approved assets, qualified CTA, evidence collection | A preregistered comparison tracks recognition and buyer-qualified action separately
DC-SLICE-05 Reuse for Clarity and HelixNote | Same journey contracts with distinct customer problems and honest counterexamples | No duplicate domain engines, independently verified hypotheses and proof
DC-SLICE-06 Safe channel scaling | Verified providers, approval gates and measured channel effectiveness | No unauthorized external effects; no engagement-to-revenue promotion

Prefer coherent slices over launching one agent per DC requirement. No work should be auto-marked complete merely because planning documents are committed.

## Pilot campaign references

- `research/experiments/DEMAND-CREATION-PILOTS.md`: EDF, Clarity and HelixNote experiment briefs.
- `docs/strategy/DEMAND-CREATION.md`: portfolio strategy, success gates, 90-day plan, audiences, measurement and governance.

## Decision needed after review

1. Approve, revise or reject problem-awareness demand creation as the primary Mercatus strategy.
2. Decide whether EDF is the first bounded vertical slice, in line with `HANDOFF.md` and `PROJECT-CHARTER.md` (which currently leave first slice unselected).
3. Reconcile `DC-###` candidates against existing requirements using Praxis/ROS tools and capture accepted slices in `.ros/work`.
4. Only then authorize implementation and any real external-facing experiment.

**Nothing in this PR authorizes outbound messages, publication, autonomous prospects research involving personal data, or actual campaign launch.**
