# First-Slice Transitions

These tables define the legal transitions of the aggregates the PRD-25
vertical slice uses. They were accepted by the owner on 2026-11-15
(DF-MERCATUS-DOM-2026-0002). Each aggregate's section in
`requirements/DOMAIN-STATE-MODEL.md` points to its table here.

The source of truth is `requirements/slice-transitions.json`. The tables in
§4 are generated from it (`npm run render:transitions`). The modernization
gate fails if the tables and the JSON differ, and it checks the JSON on every
CI run:

- every state is reachable;
- no non-terminal state is a dead end;
- terminal states are left only by an explicit reopen (↺);
- each command and from-state pair has a single target;
- actors are valid;
- the states match DOMAIN-STATE-MODEL exactly.

## 1. Scope

ID: `TRN-00`

The tables cover MarketHypothesis, ProblemHypothesis, Observation,
Evidence, Organization, Lead, Opportunity, Obligation and LearningRecord.
Other aggregates (Contact, CommunicationEligibility, Campaign and outreach)
still lack accepted tables (FND-03, WI-0015).

Every command is evaluated through the DSM-01 envelope, alongside expected
version, capabilities, policy and blocking obligations, and returns exactly
one of the five TransitionResult cases. A command from any state the table
does not list MUST be Rejected.

Actor values:

- `human`: no agent may hold the capability for this command in the first
  slice.
- `agent-or-human`: an agent holding the capability may submit the command.
- `system`: the host issues the command, from time or from another
  aggregate's event.

## 2. Accepted decisions

ID: `TRN-DECISIONS`

The owner accepted every recommendation below on 2026-11-15
(DF-MERCATUS-DOM-2026-0002).

| # | Question | Recommendation | Alternative |
|---|---|---|---|
| P1 | Which MarketHypothesis lifecycle is authoritative (FND-04)? | DSM-02's states. PRD-04's "suggested lifecycle" is the subset Proposed → Researching → Testing → Supported/Weak/Rejected. | Adopt PRD-04's shorter list and drop Draft, Testable and Dormant. |
| P2 | What is the reopen state called (FND-05)? | `Reopened` for both hypothesis types. `Revisit` is renamed. | Keep two names. |
| P3 | Is Evidence `Stale` a stored state (FND-15)? | No. Freshness is the pure projection `effectiveCurrent(validity, now)`, and stale evidence raises a ReviewStaleEvidence obligation. A stored state goes stale silently between writes, which DR-EV-01 forbids. | Keep `Stale` as a stored state, set by a scheduled `MarkStale`. |
| P4 | Where does a converted Lead land (FND-11)? | A new Opportunity in `ProblemConfirmed`. Lead qualification proves fit and problem evidence; Opportunity qualification proves decision maker, buyer and value. | Land in Opportunity `Qualified`, merging the two qualifications. |
| P5 | Lost vs Rejected (FND-12)? | **Rejected** means Echelon chose not to pursue (fit, ethics, capacity). **Lost** means the buyer chose an alternative or did not decide after engagement. | One terminal `Closed` with a reason code. |
| P6 | How does an Opportunity regress (FND-12)? | Two explicit commands, `RegressToProblemConfirmed` and `RegressToQualified`. Each cites the evidence that invalidated a satisfied obligation, which Reopen turns back to Open. | A generic `Regress(to)` command. |
| P7 | What does Won require (FND-12, FND-20)? | A `CommercialOutcome` value: offering, value and a terms reference. | An Outcome aggregate with its own lifecycle (CLS-04 OutcomeValidation) from day one. |
| P8 | Who may do what in the slice (part of FND-18)? | See each table's Actor column. **Human-only:** Accept evidence, Corroborate, Support, Reject, Qualify, Convert, MarkWon/Lost, Waive, Accept learning. **Agents may:** discover, research, normalize, review, promote observations to Candidate evidence, contest, weaken, propose learning. | Allow agents to accept evidence under a policy. |
| P9 | New capabilities | `CanQualify`, `CanConvert`, `CanWaive` and `CanAcceptLearning` are named here. DSM lists none of them. | Fold them into existing capabilities. |

## 3. Illustrative types

ID: `TRN-TYPES`

This section is informative, not normative. States are union cases that carry
only what each state guarantees. Transitions are total, pure functions.
Freshness depends on the clock, so it is computed from `now` and never stored.

```fsharp
// Tier 1 (illustrative)
type Evidence =
    | Candidate   of EvidenceCore
    | Accepted    of EvidenceCore * Validity
    | Contested   of EvidenceCore * Validity * contradictions: EvidenceRef NonEmptyList
    | Superseded  of EvidenceCore * by: EvidenceId
    | Invalidated of EvidenceCore * Reason

let effectiveCurrent (now: DateTimeOffset) = function
    | Accepted (_, v) | Contested (_, v, _) -> v.ValidFrom <= now && now < v.ValidUntil
    | _ -> false

// Tier 2 (illustrative): the transition table is the match; anything else is Rejected.
let decide (now: DateTimeOffset) (actor: SessionActor) (cmd: OpportunityCommand) (opp: Opportunity) : TransitionResult<OpportunityEvent> =
    match opp, cmd with
    | Negotiation o, MarkWon outcome when Actor.isHuman actor -> Accepted (nel (Won (o.Id, outcome, now)))
    | Negotiation _, MarkWon _ -> Rejected (nel (MissingCapability HumanOnly))
    | state, cmd -> Rejected (nel (IllegalTransition (Opportunity.stateName state, OpportunityCommand.name cmd)))
```

## 4. Tables

ID: `TRN-TABLES`

↺ marks an explicit reopen out of a terminal state.

<!-- BEGIN generated: node tools/modernization/render-transitions.mjs -->

### MarketHypothesis (DSM-02; FND-03, FND-04, FND-05)

ID: `TRN-MARKET-HYPOTHESIS`

FND-04: DSM-02 states are authoritative; PRD-04's lifecycle is the 'suggested' subset and its 'Revisit' becomes the transition pair Reopen -> Reopened -> ResumeResearch. FND-05: both hypothesis types use 'Reopened'.

States: Draft, Proposed, Researching, Testable, Testing, Supported, Weak, **Rejected** (terminal, reopenable), **Dormant** (terminal, reopenable), Reopened (transitional: records why it was reopened). Initial: Draft.

| Command | From | To | Actor | Capability | Guard |
|---|---|---|---|---|---|
| Propose | Draft | Proposed | agent-or-human | CanPropose | proposition and market scope stated |
| StartResearch | Proposed | Researching | agent-or-human | CanStartResearch | — |
| MarkTestable | Researching | Testable | agent-or-human | CanMarkTestable | falsifiable proposition; defined population; explicit assumptions |
| StartTest | Testable | Testing | human | CanStartTest | test plan or Experiment linked |
| Support | Testing | Supported | human | CanSupport | supporting and counter-evidence reviews done (no open FindCounterEvidence); cited evidence effective-current |
| Weaken | Testing, Supported | Weak | agent-or-human | CanWeaken | cites contradicting or missing evidence |
| Reject | Researching, Testable, Testing, Weak | Rejected | human | CanReject | rationale and evidence preserved |
| MarkDormant | Proposed, Researching, Testable, Supported, Weak | Dormant | human | CanDormant | reason and revisit condition |
| Reopen ↺ | Supported, Weak, Rejected, Dormant | Reopened | agent-or-human | CanReopen | new evidence or revisit condition met; prior lifecycle preserved |
| ResumeResearch | Reopened | Researching | agent-or-human | CanStartResearch | — |

Non-transition commands (no state change): RecordEvidence, Edit.

### ProblemHypothesis (DSM-03; FND-03, FND-05)

ID: `TRN-PROBLEM-HYPOTHESIS`

FND-05: 'Revisit' is renamed 'Reopened', entered by Reopen and left by ResumeInvestigation.

States: Draft, Observed, Investigating, Corroborated, CommerciallyRelevant, Weak, **Rejected** (terminal, reopenable), Reopened (renamed from Revisit (FND-05)). Initial: Draft.

| Command | From | To | Actor | Capability | Guard |
|---|---|---|---|---|---|
| AttachFirstObservation | Draft | Observed | agent-or-human | CanAttachObservation | >=1 Observation; problem stated without an Echelon solution |
| Investigate | Observed | Investigating | agent-or-human | CanInvestigate | — |
| Corroborate | Investigating | Corroborated | human | CanCorroborate | affected actor and consequence explicit; >=2 independent effective-current Evidence; workaround recorded or Unknown |
| ConfirmCommercialRelevance | Corroborated | CommerciallyRelevant | human | CanTestCommercialRelevance | evidence beyond social attention (TestCommercialConsequence satisfied) |
| Weaken | Investigating, Corroborated, CommerciallyRelevant | Weak | agent-or-human | — | cites contradicting evidence |
| Reject | Observed, Investigating, Weak | Rejected | human | CanReject | rationale and evidence preserved |
| Reopen ↺ | Weak, Rejected | Reopened | agent-or-human | CanRevisit | new evidence |
| ResumeInvestigation | Reopened | Investigating | agent-or-human | CanInvestigate | — |

Non-transition commands (no state change): AttachObservation, AttachEvidence.

### Observation (DSM-04; FND-03)

ID: `TRN-OBSERVATION`

States: Captured, Normalized, Reviewed, **PromotedToEvidence** (terminal), **Dismissed** (terminal), **Superseded** (terminal). Initial: Captured.

| Command | From | To | Actor | Capability | Guard |
|---|---|---|---|---|---|
| Normalize | Captured | Normalized | agent-or-human | CanNormalize | source reference immutable; observed and captured times distinct |
| Review | Normalized | Reviewed | agent-or-human | CanReview | — |
| Promote | Reviewed | PromotedToEvidence | agent-or-human | CanPromote | creates Evidence in Candidate; interpretation stored on the Evidence, not the Observation |
| Dismiss | Captured, Normalized, Reviewed | Dismissed | agent-or-human | CanDismiss | reason |
| Supersede | Captured, Normalized, Reviewed | Superseded | agent-or-human | CanSupersede | newer Observation linked; provenance kept |

Non-transition commands (no state change): LinkDuplicate.

### Evidence (DSM-05; FND-03, FND-15)

ID: `TRN-EVIDENCE`

FND-15: 'Stale' is not a stored state. Freshness is the pure projection effectiveCurrent(validity, now), so 'Accepted but expired' cannot satisfy a current-evidence guard. MarkStale is replaced by the ReviewStaleEvidence obligation, raised when the projection turns stale.

States: Candidate, Accepted, Contested, **Superseded** (terminal), **Invalidated** (terminal). Initial: Candidate.

| Command | From | To | Actor | Capability | Guard |
|---|---|---|---|---|---|
| Accept | Candidate | Accepted | human | CanAccept | scope, claim, source, observation refs and validity window present; agent inference labelled as inference |
| Contest | Accepted | Contested | agent-or-human | CanContest | contradicting Evidence linked |
| Uphold | Contested | Accepted | human | CanAccept | rationale; contradiction kept |
| Supersede | Accepted, Contested | Superseded | agent-or-human | CanSupersede | newer Evidence linked |
| Invalidate | Candidate, Accepted, Contested | Invalidated | human | CanInvalidate | reason; dependants re-evaluated (EFF-01) |

Non-transition commands (no state change): LinkContradiction.

### Organization (DSM-06; FND-03)

ID: `TRN-ORGANIZATION`

States: Discovered, Researching, Researched, Candidate, Engaging, ActiveRelationship, Inactive (reactivatable). Initial: Discovered.

| Command | From | To | Actor | Capability | Guard |
|---|---|---|---|---|---|
| StartResearch | Discovered | Researching | agent-or-human | — | — |
| CompleteResearch | Researching | Researched | agent-or-human | — | no open ResolveIdentity or ResolveDuplicate obligation |
| MarkCandidate | Researched | Candidate | agent-or-human | — | ValidateICPFit satisfied with effective-current evidence |
| BeginEngagement | Candidate | Engaging | human | — | CommunicationEligibility not blocked at organization scope (DSM-07A); outside the first slice |
| EstablishRelationship | Engaging | ActiveRelationship | human | — | recorded interaction or Won opportunity |
| MarkInactive | Researched, Candidate, Engaging, ActiveRelationship | Inactive | agent-or-human | — | reason |
| Reactivate ↺ | Inactive | Researching | agent-or-human | — | reason; history kept |

Non-transition commands (no state change): ProposeMerge, ReverseMerge.

### Lead (DSM-08; FND-03, FND-11)

ID: `TRN-LEAD`

Extends WORKFLOW-BOUNDARY-REVIEW §4.1. FND-11: ConvertToOpportunity creates an Opportunity in ProblemConfirmed. Lead qualification establishes fit and problem evidence; Opportunity qualification (decision maker, economic buyer, value hypothesis) happens later. Disqualified leads can be reconsidered with new evidence.

States: Discovered, Researching, EvidenceReady, QualificationPending, Qualified, **Disqualified** (terminal, reconsiderable), Deferred, **Converted** (terminal). Initial: Discovered.

| Command | From | To | Actor | Capability | Guard |
|---|---|---|---|---|---|
| StartResearch | Discovered | Researching | agent-or-human | CanResearch | — |
| MarkEvidenceReady | Researching | EvidenceReady | agent-or-human | — | >=1 effective-current Evidence |
| RequestQualification | EvidenceReady | QualificationPending | agent-or-human | — | policy dimensions selected |
| Qualify | QualificationPending | Qualified | human | CanQualify | every required dimension assessed with effective-current evidence; no blocking obligation |
| Disqualify | QualificationPending | Disqualified | human | CanQualify | reason and evidence |
| Defer | QualificationPending | Deferred | agent-or-human | — | revisit condition; missing dimensions become obligations |
| Resume | Deferred | Researching | agent-or-human | — | revisit condition met |
| ConvertToOpportunity | Qualified | Converted | human | CanConvert | creates Opportunity in ProblemConfirmed, atomically (FND-19) |
| Reconsider ↺ | Disqualified | Researching | agent-or-human | — | new evidence; prior assessment kept |

### Opportunity (DSM-09; FND-03, FND-12, FND-20)

ID: `TRN-OPPORTUNITY`

FND-12: Rejected means Echelon chose not to pursue (fit, ethics, capacity) and can happen before engagement. Lost means the buyer chose an alternative or did not decide after engagement. Regression is explicit: RegressToProblemConfirmed and RegressToQualified reopen the obligations that the changed evidence invalidates. Won requires a CommercialOutcome value (FND-20). Converted leads enter at ProblemConfirmed (initial for direct creation: Discovered).

States: Discovered, Researching, Engaging, ProblemConfirmed, Qualified, Exploring, Proposal, Negotiation, **Won** (terminal), **Lost** (terminal, reopenable), **Dormant** (terminal, reopenable), **Rejected** (terminal, reconsiderable). Initial: Discovered; also entered at ProblemConfirmed.

| Command | From | To | Actor | Capability | Guard |
|---|---|---|---|---|---|
| StartResearch | Discovered | Researching | agent-or-human | — | — |
| BeginEngagement | Researching | Engaging | human | — | an interaction is recorded; outbound effects are outside the first slice |
| ConfirmProblem | Engaging | ProblemConfirmed | human | — | ConfirmProblem obligation satisfied by buyer-sourced evidence |
| Qualify | ProblemConfirmed | Qualified | human | CanQualify | IdentifyDecisionMaker, IdentifyEconomicBuyer, DefineValueHypothesis satisfied |
| Explore | Qualified | Exploring | human | — | — |
| StartProposal | Exploring | Proposal | human | CanPropose | problem and value context present (DR-OPP-01) |
| StartNegotiation | Proposal | Negotiation | human | — | — |
| MarkWon | Negotiation | Won | human | — | CommercialOutcome recorded (offering, value, terms reference) |
| MarkLost | Engaging, ProblemConfirmed, Qualified, Exploring, Proposal, Negotiation | Lost | human | — | reason; alternative or Unknown recorded; evidence |
| Reject | Discovered, Researching, Engaging, ProblemConfirmed, Qualified | Rejected | human | — | Echelon's reason (fit, ethics, capacity) |
| MarkDormant | Researching, Engaging, ProblemConfirmed, Qualified, Exploring, Proposal, Negotiation | Dormant | human | — | revisit condition; never on elapsed time alone |
| RegressToProblemConfirmed | Qualified, Exploring, Proposal, Negotiation | ProblemConfirmed | human | — | evidence invalidating a satisfied qualification obligation; obligation reopened |
| RegressToQualified | Exploring, Proposal, Negotiation | Qualified | human | — | evidence invalidating value or proposal context |
| Reopen ↺ | Lost, Dormant | Researching | agent-or-human | — | new evidence or revisit condition; history kept (SCN-34) |
| Reconsider ↺ | Rejected | Researching | human | — | rationale |

### Obligation (DSM-20; FND-14)

ID: `TRN-OBLIGATION`

Extends WORKFLOW-BOUNDARY-REVIEW §4.4: each Obligation declares the transition kinds it blocks. Reopen supports evidence-driven regression.

States: Open, Satisfied, **Waived** (terminal), **Expired** (terminal), **Superseded** (terminal). Initial: Open.

| Command | From | To | Actor | Capability | Guard |
|---|---|---|---|---|---|
| Satisfy | Open | Satisfied | agent-or-human | — | evidence refs that are effective-current |
| Waive | Open | Waived | human | CanWaive | rationale (DSM-20) |
| Expire | Open | Expired | system | — | due time passed and the kind is expirable; legal-deadline kinds never expire silently |
| Supersede | Open | Superseded | agent-or-human | — | replacement obligation linked |
| Reopen ↺ | Satisfied | Open | system | — | satisfying evidence invalidated or superseded |

### LearningRecord (DSM-23; FND-20)

ID: `TRN-LEARNING-RECORD`

New, accepted with the PRD-25 acceptance criteria. A LearningRecord turns outcomes and evidence into requested belief changes. Applying it submits ordinary hypothesis commands, each evaluated normally, and never writes hypothesis state directly. Each record names the single validation dimension it affects (CLS-10).

States: Proposed, Accepted, **Applied** (terminal), **Discarded** (terminal). Initial: Proposed.

| Command | From | To | Actor | Capability | Guard |
|---|---|---|---|---|---|
| Accept | Proposed | Accepted | human | CanAcceptLearning | >=1 outcome or evidence ref; >=1 affected hypothesis; one validation dimension named (CLS-10) |
| Apply | Accepted | Applied | system | — | submits the requested hypothesis commands; records each TransitionResult, including Deferred |
| Discard | Proposed, Accepted | Discarded | human | — | reason |

<!-- END generated -->

## 5. Change control

ID: `TRN-CHANGE`

To change a table, edit `requirements/slice-transitions.json` and run
`npm run render:transitions`. A change to an accepted table needs an owner
decision record. A change to the state list must also change
DOMAIN-STATE-MODEL, because the gate rejects any mismatch.
