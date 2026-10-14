# EDF demand-creation vertical slice: implementation contract

**Status:** Proposed for approval and Praxis intake. No code or external campaign is implemented by this specification.
**Source:** `docs/strategy/DEMAND-CREATION.md`
**Crosswalk:** `requirements/DEMAND-CREATION-CROSSWALK.csv`

## User job and hypothesis
A VP Engineering or CTO suspects a throughput problem but may not recognize recurring rework, architecture decisions, and insufficient diagnostic evidence as competing causes. We test whether a short, neutral, evidence-grounded experience helps them distinguish symptoms from causal explanations and choose a proportionate next action.

## First user-facing journey
1. Present a concise scenario with clearly labeled illustrative facts and alternate hypotheses.
2. Offer an accessible, ungated 3–10 minute assessment; all questions have a plain-language rationale, skip option, and explicit unknown state.
3. Show a non-prescriptive results packet: observed answers, possible interpretations, missing evidence, counter-hypotheses, limitations and next evidence to collect.
4. Provide a transparent impact *scenario*, never an implied factual savings estimate. Inputs: recurrence frequency, hours per occurrence, affected roles, loaded hourly rates (optional), recovery cost, and an uncertainty range. Display formulas and scenario sensitivity. Do not equate cost with recoverable savings.
5. Compare at least three next actions: internal investigation, bounded independent EDF diagnostic, and defer/monitor.
6. Offer an optional, separately consented contact request; no email required to view or retain results locally.
7. Record only permitted, privacy-minimized experiment events and compare against a predeclared baseline.

## Explicit domain contracts
- `ProblemRecognitionExperience`: ID, revision, audience, ProblemPattern reference, scenario, approved Claim/ProofAsset references, questions, accessibility checks, approval status, publication eligibility.
- `AssessmentResponse`: experience revision, answer set with typed Unknown/Skipped, transient calculation values, consent scope; avoid collecting personally identifying information by default.
- `RecognitionResult`: hypotheses, evidence pointers, missing evidence, alternatives, impact scenario with assumptions, and safe next actions. No unsupported causal certainty.
- `ExperimentAssignment`: experiment version, assignment mechanism, exposure eligibility, variant, contamination and opt-out handling.
- `RecognitionOutcome`: pre/post understanding and confidence instruments, observed action, qualification, and attribution limitations. Keep commercial stages independent.
- `CommercialEffect`: only existing approved Mercatus ExternalEffect and channel policy boundaries can authorize contact, publication or outbound provider operations.

Prefer extending canonical Mercatus aggregates and contracts over creating new overlapping state stores. Proposed type names are subject to the domain reconciliation.

## Acceptance gates
- No lead capture gate for informational results; keyboard, screen reader and mobile navigation are verified.
- A user can skip all optional questions without false precision or a misleading score.
- Every published claim is linked to approved evidence; a scenario cannot present fictional numbers as customer outcomes.
- Calculations are deterministic and tested for zero, missing, negative, extreme, inconsistent, and uncertain inputs.
- A result explicitly permits 'do nothing yet' when the consequence or evidence is insufficient.
- No raw assessment response or contact information leaves the browser without informed consent and a valid retention policy.
- Recognition is measured independently of clicks, contact requests, qualification, purchase, outcome and repeatability.
- An experiment cannot start without baseline, audience, sample/decision rules, privacy review, owner and stopping criteria.
- Outbound effects fail closed until verified capability and human approval gates pass.

## Recommended execution sequence
1. **Contract and baseline:** resolve the first vertical slice decision in `PROJECT-CHARTER.md`, establish canonical model ownership, approve an interview instrument, and define baseline.
2. **Static scenario and accessibility:** implement scenario + alternate hypotheses with approved/illustrative claims, test screen reader/keyboard/mobile.
3. **Assessment and typed uncertainty:** build deterministic question/result flow and test privacy, skips and contradictory answers.
4. **Impact scenario and options:** implement transparent formulas and sensitivity with tests.
5. **Experiment and measurement:** instrument consented events and comparison baseline; preregister interpretation/stopping rules.
6. **Commercial handoff:** optionally connect a human-approved diagnostic request to the existing opportunity bridge and external-effect journal.
7. **Reuse evaluation:** extract only demonstrated reusable contracts for Clarity and HelixNote.

## Completion evidence
Provide tests, screenshots/accessibility evidence, calculations with fixtures, consent audit, experiment preregistration, and a reproducible manual end-to-end run. Record decisions and work-item checkpoints through Praxis/ROS. This document does not assert that those tests or implementation already exist.
