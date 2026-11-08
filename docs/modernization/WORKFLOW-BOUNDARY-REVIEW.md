# Mercatus Workflow Boundary Review

- **Work item:** WI-0012
- **Date:** 2026-11-08
- **Inputs:** [`DOMAIN-MODEL-AUDIT.md`](DOMAIN-MODEL-AUDIT.md), `requirements/`,
  `.sde/architecture/FOUR-TIER-ARCHITECTURE.md`, Ordo doctrine at
  `kemiller2002/ordo@db6d39e`
- **Machine-readable mapping:** `workflows[]` in [`traceability.json`](traceability.json)

## 1. Gate status

A workflow is complete only when all six criteria hold. The gate check
(`tools/modernization/verify-gate.mjs`) refuses `status: ready` unless every
criterion is `true` and backed by an evidence path that exists in the
repository. It also refuses any Forma work on a screen whose workflow has
unverified contracts.

| Workflow | Domain verified | Transitions defined | Authorization enforced | Rules tested | Forma follows contracts | E2E demonstrated | Status |
|---|---|---|---|---|---|---|---|
| WF-01 Market/problem hypothesis research | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-02 Observation capture → evidence | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-03 Evidence lifecycle & freshness | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-04 Organization/contact identity & merge | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-05 Lead qualification & conversion | ✗ | ✗ (partial) | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-06 Opportunity progression & win/loss | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-07 Signal triage | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-08 Campaign lifecycle | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-09 Outreach send & reconciliation | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-10 Inbound, reply classification, suppression | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-11 Experiment lifecycle | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-12 Asset/claim publication | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-13 Approval lifecycle | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-14 Obligation lifecycle | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |
| WF-15 Capability-scoped agent requests | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | blocked |

Every workflow is blocked by FND-01, because no implementation exists. The
other blockers for each workflow are listed below.

## 2. Ordo patterns applied

The following doctrine-level patterns were used to evaluate each workflow.
They come from `DECISION-AND-EVIDENCE-SEMANTICS.md` and
`BOUNDARY-PRESERVATION.md`.

| Pattern | Rule | Where it matters |
|---|---|---|
| P1 Single semantic authority | One Tier 1/2 owner per fact; Tier 3 never re-decides legality | WF-09 (FND-07), WF-04/10 (FND-09) |
| P2 Effects as data | Tier 2 *requests* an effect; Tier 4 performs; Tier 2 interprets Succeeded/Failed/Unknown | WF-09, WF-12 |
| P3 Unknown ≠ Failed | Unknown keeps a reconciliation obligation; no retry/compensation before observation unless retry-safety is proven | WF-09 (FND-08) |
| P4 Capability is authority, not authentication | Host establishes capabilities; provider output or confidence never creates authority | WF-15 (FND-18) |
| P5 Minimal semantically complete view | Each decision reads a versioned view that includes every fact able to change legality | All. Evidence freshness (FND-15) and eligibility at send time are view facts. |
| P6 Scoped coverage / negative knowledge | Complete, Partial and Unknown are distinct; absence is supported only by Complete coverage of the same scope | WF-01, WF-03 |
| P7 Derived-evidence closure | Derivation is acyclic and all inputs exist | WF-03 |
| P8 Three-contract boundary | Wire contract ≠ domain contract ≠ presentation contract; translation is explicit | All UI contracts |

## 3. Workflow reviews

Each workflow is reviewed against the gate's eight questions: (1) initiating
event, (2) actor and permissions, (3) states and transitions, (4) rules,
(5) dependencies and side effects, (6) failure and recovery,
(7) requirements, and (8) tests and evidence. Rule IDs (`DR-*`) and
requirement IDs refer to `traceability.json`.

### WF-01 Market and problem hypothesis research

1. **Initiating event:** a human or Strategist/Researcher agent proposes a
   hypothesis, or a signal or observation suggests one.
2. **Actor:** human owner or Strategist agent, holding `CanPropose`,
   `CanStartResearch`, `CanEvaluate`, `CanSupport` and `CanReject`. No grant
   model exists yet (FND-18).
3. **States:** DSM §2 and §3. Transitions are unspecified (FND-03). The two
   source lifecycles conflict (FND-04) and name the reopen state differently
   (FND-05).
4. **Rules:** DR-MH-01, DR-MH-02, DR-MH-03, DR-PH-01, DR-PH-02, DR-NK-01.
5. **Dependencies and side effects:** none external. Creates obligations
   (FindCounterEvidence, DefineProblem, …).
6. **Failure and recovery:** evaluation without a counter-evidence review →
   `Deferred [FindCounterEvidence]`. Stale supporting evidence → `Deferred`
   with a refresh obligation (SCN-11).
7. **Requirements:** DSM-02, DSM-03, PRD-04, PRD-05, PRD-25.
8. **Tests and evidence:** none. TST-01, TST-02, TST-03 and TST-07 are
   required.

### WF-02 Observation capture and evidence promotion

1. **Initiating event:** a human captures an observation (including on mobile
   in field mode), or an adapter delivers one through the inbox.
2. **Actor:** human, MarketListener or Researcher agent with `CanNormalize`,
   `CanReview` and `CanPromote`. Promotion to Accepted evidence may need human
   review (policy undefined, FND-18).
3. **States:** Observation per DSM §4. `PromotedToEvidence` creates Evidence in
   `Candidate`.
4. **Rules:** DR-OBS-01, DR-EV-02.
5. **Dependencies and side effects:** source systems (Tier 4) for capture
   only. Promotion is pure.
6. **Failure and recovery:** a duplicate observation is linked, never deleted.
   A sensitive-data capture needs a redaction workflow (PRD §32, unmodelled,
   FND-20).
7. **Requirements:** DSM-04, DSM-05, PRD-07, PRD-28.
8. **Tests and evidence:** none. TST-03 is required.

### WF-03 Evidence lifecycle, freshness and contradiction

1. **Initiating event:** evidence is accepted, contested, invalidated or
   linked to a contradiction, or its validity window elapses.
2. **Actor:** human reviewer or Researcher agent with `CanAccept`, `CanContest`
   and `CanInvalidate`.
3. **States:** DSM §5. Whether `Stale` is a stored state or computed is
   ambiguous (FND-15).
4. **Rules:** DR-EV-01, DR-EV-02, DR-EV-03, DR-NK-01.
5. **Dependencies and side effects:** none. Invalidating evidence re-evaluates
   dependants (an incremental projection, EFF-01).
6. **Failure and recovery:** a cycle in derived evidence → `Rejected
   [DerivationCycle]`. A disappearing source keeps the derived history
   (Scenario 28).
7. **Requirements:** DSM-05, PRD-26.3, PRD-26.4, SCN-11, SCN-30.
8. **Tests and evidence:** none. TST-06, TST-07 and TST-16 are required.

### WF-04 Organization and contact discovery, identity and merge

1. **Initiating event:** a discovery observation, a duplicate identity
   detection, or a job change (Scenario 3).
2. **Actor:** Researcher/AccountAnalyst agent or human. A merge needs a
   reversible MergeDecision. Who may merge is undefined (FND-18).
3. **States:** DSM §6, §7 and §7a. Contactability lives only in
   CommunicationEligibility. Restrictions (including organization-level
   DoNotEngage) override permissions and stay active until explicitly lifted
   (DR-ELIG-01, DR-ELIG-02; FND-09 and FND-10 resolved).
4. **Rules:** DR-ORG-01, DR-CON-01, DR-ELIG-01, DR-ELIG-02.
5. **Dependencies and side effects:** none external.
6. **Failure and recovery:** a wrong merge → reverse the merge with provenance
   preserved.
7. **Requirements:** DSM-06, DSM-07, PRD-08, PRD-32.
8. **Tests and evidence:** none. TST-15 is required.

### WF-05 Lead discovery, qualification and conversion (vertical slice)

1. **Initiating event:** an agent or human discovers a candidate commercial
   connection.
2. **Actor:** OpportunityScout/AccountAnalyst agents may discover and research.
   Whether `Qualify` and `ConvertToOpportunity` are human-only is undefined
   (FND-18).
3. **States:** DSM §8. The linear chain is specified, but edges out of
   `Deferred` and the conversion target are not (FND-03, FND-11). See §4.1 for
   a proposal.
4. **Rules:** DR-LEAD-01, DR-LEAD-02, DR-LEAD-03.
5. **Dependencies and side effects:** none external. Conversion creates an
   Opportunity, a cross-aggregate atomicity question (FND-19).
6. **Failure and recovery:** missing qualification dimensions → `Deferred`
   with obligations (FND-14). A concurrent edit → `Conflict`.
7. **Requirements:** DSM-08, PRD-09, PRD-25.
8. **Tests and evidence:** none. TST-01, TST-02, TST-05 and TST-08 are
   required.

### WF-06 Opportunity progression, outcome and win/loss

1. **Initiating event:** a conversion from a Lead, new evidence, a
   conversation outcome, or a buyer decision.
2. **Actor:** human owner. SalesAnalyst agent may *request* transitions.
   `Proposal` needs proposal capability (DR-OPP-01).
3. **States:** DSM §9. Lost vs Rejected, regression and Outcome are undefined
   (FND-12).
4. **Rules:** DR-OPP-01, DR-OPP-02, DR-ENV-04, DR-OBL-01.
5. **Dependencies and side effects:** none external. Win/loss feeds
   learning projections.
6. **Failure and recovery:** a stale version → `Conflict` with the changed
   facts (SCN-10). A dormant opportunity reopens with its history (SCN-34).
7. **Requirements:** DSM-09, PRD-10, SCN-10, SCN-34.
8. **Tests and evidence:** none. TST-01, TST-02, TST-05 and TST-08 are
   required.

### WF-07 Signal triage

1. **Initiating event:** an adapter or listener detects a candidate
   commercial change.
2. **Actor:** MarketListener/CompetitorMonitor agents triage. A human decides
   relevance where policy requires.
3. **States:** DSM §15. The target of `ConvertedToWork` is undefined (FND-24).
4. **Rules:** DR-SIG-01.
5. **Dependencies and side effects:** listening adapters (Tier 4, read-only).
6. **Failure and recovery:** expiry → `Expired`. Uncorroborated →
   `Investigating` with a FindCorroboration obligation.
7. **Requirements:** DSM-15, PRD-26.1.
8. **Tests and evidence:** none. TST-02 is required.

### WF-08 Campaign lifecycle

1. **Initiating event:** a human or ContentStrategist drafts a campaign.
2. **Actor:** the drafter, a reviewer, and an approver with activation
   capability. Separation of duties is undefined (FND-18).
3. **States:** DSM §11 (PRD §11 omits `Cancelled`, FND-06). See §4.3.
4. **Rules:** DR-CMP-01, DR-CMP-02.
5. **Dependencies and side effects:** activation enables WF-09 effects. A
   pause blocks them.
6. **Failure and recovery:** a budget or stop threshold is crossed → `Paused`
   by policy (TST-19). A pause racing a queued send → DR-CMP-02 (TST-14).
7. **Requirements:** DSM-11, PRD-11.
8. **Tests and evidence:** none.

### WF-09 Outreach send and delivery reconciliation

1. **Initiating event:** `RequestSend` for a prepared message to a target in
   an Active campaign.
2. **Actor:** EngagementAgent may draft and request. A human approves first
   contact (PRD §13, unit undefined FND-23). Only Tier 4 executes.
3. **States:** spread across CampaignTarget, OutreachMessage and
   ExternalEffect (FND-07). Unknown semantics are unclear (FND-08). See §4.2
   for the proposed single-authority split.
4. **Rules:** DR-SEND-01, DR-SEND-02, DR-SEND-03, DR-EFF-01, DR-EFF-02,
   DR-APR-01.
5. **Dependencies and side effects:** the Proton adapter (Tier 4). It is the
   only workflow that sends to an external party, and the highest-risk one.
6. **Failure and recovery:** provider timeout → `Unknown` plus a
   ReconcileDelivery obligation, with no automatic retry (SCN-09).
   Unsubscribe while queued → the effect is cancelled if not committed, or
   reconciled if Unknown (SCN-08). Send succeeded but persistence failed →
   reconciliation from the provider id (DR-EFF-02).
7. **Requirements:** DSM-12, DSM-13, DSM-17, INT-10, INT-13,
   PRD-13, SCN-08, SCN-09.
8. **Tests and evidence:** none. TST-09, TST-10, TST-12 and TST-13 are
   required.

### WF-10 Inbound processing, reply classification and suppression

1. **Initiating event:** the provider delivers an inbound event to the
   integration inbox.
2. **Actor:** an adapter (Tier 4) normalizes. The domain processor applies the
   event. An agent may *suggest* a classification, but an unsubscribe applies
   immediately and does not wait for approval.
3. **States:** DSM §18 for the inbox item. An unsubscribe sets a restriction
   in CommunicationEligibility, the single source of truth (`DSM-07A`).
4. **Rules:** DR-INBOX-01, DR-SEND-01, DR-CON-01, DR-ELIG-01, DR-ELIG-02.
5. **Dependencies and side effects:** provider webhooks or polling. A
   duplicate delivery must be absorbed.
6. **Failure and recovery:** unroutable → `NeedsReview`. Repeated failure →
   `DeadLettered`, with no loss.
7. **Requirements:** DSM-18, INT-14, INT-11, PRD-14, SCN-08.
8. **Tests and evidence:** none. TST-11 and TST-13 are required.

### WF-11 Experiment lifecycle

1. **Initiating event:** an ExperimentDesigner or human designs a test of a
   hypothesis.
2. **Actor:** the designer, and an approver for Running where the experiment
   has external effects.
3. **States:** DSM §14. A Failed state is missing (FND-13).
4. **Rules:** DR-EXP-01.
5. **Dependencies and side effects:** may drive campaigns (WF-08). Results are
   immutable.
6. **Failure and recovery:** a stop rule fires → `Stopped`, which remains
   queryable.
7. **Requirements:** DSM-14, PRD-11.
8. **Tests and evidence:** none.

### WF-12 Asset and claim governance and publication

1. **Initiating event:** a content strategy produces an asset or variant.
2. **Actor:** ContentProducer drafts. A human reviews and approves claims and
   publication.
3. **States:** DSM §16. The Claim lifecycle is incomplete (FND-16).
4. **Rules:** DR-CLM-01, DR-APR-01, DR-EFF-01.
5. **Dependencies and side effects:** publishing adapters (Tier 4).
6. **Failure and recovery:** a stale claim at publish time → `Deferred
   [RefreshClaimEvidence]`. A publish with an unknown outcome → reconcile.
7. **Requirements:** DSM-16, PRD-30, INT-16.
8. **Tests and evidence:** none. TST-06 and TST-12 are required.

### WF-13 Approval lifecycle (cross-cutting)

1. **Initiating event:** a transition requiring approval returns `Deferred
   [ApprovalRequired scope]`.
2. **Actor:** a human approver with a capability for that scope.
3. **States:** DSM §19. The meaning of Requested vs Pending and of Consumed is
   undefined (FND-17).
4. **Rules:** DR-APR-01.
5. **Dependencies and side effects:** none.
6. **Failure and recovery:** the material is edited after approval → the
   approval is invalidated by a content-hash mismatch (SCN-33).
7. **Requirements:** DSM-19, SCN-33, PRD-13.
8. **Tests and evidence:** none. TST-12 is required.

### WF-14 Obligation lifecycle (cross-cutting)

1. **Initiating event:** Tier 2 creates an obligation as a transition outcome
   or a `Deferred` result.
2. **Actor:** any actor may satisfy one with evidence. Waiving needs
   capability plus rationale.
3. **States:** DSM §20. Blocking semantics are missing (FND-14).
4. **Rules:** DR-OBL-01.
5. **Dependencies and side effects:** scheduled re-checks for deferred or
   future obligations (PRD §32).
6. **Failure and recovery:** expiry → `Expired`, and the blocked transition
   stays blocked unless policy supersedes it.
7. **Requirements:** DSM-20, PRD-10.
8. **Tests and evidence:** none. TST-05 is required.

### WF-15 Capability-scoped agent requests and work claims

1. **Initiating event:** an agent selects work and requests a transition.
2. **Actor:** an agent role (PRD §18) with granted, revocable capabilities.
3. **States:** WorkClaim/lease (PRD §32) is unmodelled (FND-20).
4. **Rules:** DR-AUTH-01, DR-ENV-03.
5. **Dependencies and side effects:** none directly. Agents never call
   providers (INT-15).
6. **Failure and recovery:** a revoked capability mid-task → `Rejected
   [CapabilityRevoked]`. An expired lease → the work is released.
7. **Requirements:** PRD-18, PRD-22, INT-15, DSM-22, PRD-32.
8. **Tests and evidence:** none. TST-04 and TST-18 are required.

## 4. Proposed transition tables (owner confirmation required)

These tables are **proposals derived from the requirements**. They are not
accepted business rules. They are tracked in WI-0015, WI-0018, WI-0022,
WI-0023 and WI-0025. They show how the types make invalid transitions
impossible: each state is a union case carrying only the data that state
guarantees, and each command is accepted only from the listed source states.

### 4.1 Lead (DSM §8; FND-03, FND-11)

| From | Command | To | Guard |
|---|---|---|---|
| Discovered | StartResearch | Researching | CanResearch |
| Researching | MarkEvidenceReady | EvidenceReady | ≥1 effective-current Evidence |
| EvidenceReady | RequestQualification | QualificationPending | policy dimensions selected |
| QualificationPending | Qualify | Qualified | every required dimension assessed; no blocking obligation |
| QualificationPending | Disqualify | Disqualified | reason + evidence |
| QualificationPending | Defer | Deferred | revisit condition |
| Deferred | Resume *(proposed)* | Researching | revisit condition met or human |
| Qualified | ConvertToOpportunity | Converted | creates Opportunity in `ProblemConfirmed` *(proposed, FND-11)* |

```fsharp
// Tier 1, illustrative: Qualified carries the assessment, so Converted cannot exist without one.
type Lead =
    | Discovered of LeadCore
    | Researching of LeadCore
    | EvidenceReady of LeadCore * EvidenceRef NonEmptyList
    | QualificationPending of LeadCore * QualificationPolicyId
    | Qualified of LeadCore * QualificationAssessment
    | Disqualified of LeadCore * Reason * EvidenceRef list
    | Deferred of LeadCore * RevisitCondition
    | Converted of LeadCore * QualificationAssessment * OpportunityId
```

### 4.2 Outbound send: single authority (FND-07, FND-08)

| Aggregate | Owns | Send-related states |
|---|---|---|
| OutreachMessage | content, versions, approval lineage | Draft → ReadyForReview → Approved → Cancelled |
| ExternalEffect | whether the provider acted | Requested → Authorized → Executing → Confirmed \| Failed \| Unknown → Reconciled |
| CampaignTarget | targeting and response | Identified → … → MessagePrepared → Responded → FollowUpDue → Converted \| Closed \| Suppressed; "sent" is a projection of its ExternalEffect |

`Unknown` creates a `ReconcileEffect` obligation. `ReconciliationRequired` and
`DeliveryUnknown` are removed as states.

### 4.3 Campaign (DSM §11; FND-06)

| From | Command | To | Guard |
|---|---|---|---|
| Draft | SubmitForReview | ReadyForReview | DR-CMP-01 fields present |
| ReadyForReview | Approve | Approved | Approval for current campaign hash |
| ReadyForReview | ReturnToDraft | Draft | — |
| Approved | Activate | Active | approval not invalidated; budget available |
| Active | Pause | Paused | — (always permitted) |
| Paused | Resume | Active | stop rules not tripped |
| Active, Paused | Complete | Completed | — |
| Completed | Evaluate | Evaluated | results and interpretation recorded separately |
| Draft, ReadyForReview, Approved, Paused | Cancel | Cancelled | reason |

### 4.4 Obligation blocking (FND-14)

```fsharp
type Obligation =
    { Id: ObligationId; Kind: ObligationKind; Subject: AggregateRef
      Blocks: Set<TransitionKind>; State: ObligationState }
and ObligationState =
    | Open
    | Satisfied of EvidenceRef NonEmptyList
    | Waived of ActorRef * Rationale
    | Expired of DateTimeOffset
    | Superseded of ObligationId

// Tier 2: a transition is Deferred while any Open obligation on its subject blocks its kind.
let blocking kind subject =
    List.filter (fun o -> o.Subject = subject && o.State = Open && Set.contains kind o.Blocks)
```

## 5. Independent verification required before Forma

For each workflow, the evidence required to flip a gate criterion to `true`
and to record it under `gateEvidence` in `traceability.json`:

| Criterion | Evidence |
|---|---|
| domainModelVerified | Tier 1 F# types merged; architecture check shows Tier 1 references only FSharp.Core; owner sign-off on the workflow's open findings |
| transitionsDefined | accepted transition table in `requirements/` plus exhaustive Tier 2 match |
| authorizationEnforced | CHK-DOK-03 passing: the same command is denied from UI, API, agent and workflow origins |
| rulesTested | CHK-DOK-01, CHK-DOK-02 and CHK-DOK-05 passing for the workflow's DR-* rules |
| formaFollowsContracts | CHK-DOK-06 passing: the screen's commands ⊆ the Tier 2 command set, and every TransitionResult case is rendered |
| endToEndDemonstrated | an E2E run (Playwright against Limen host plus provider simulator) recorded as Praxis evidence by a verifier other than the implementer |
