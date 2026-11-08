# Mercatus Domain–UI Contracts

- **Work item:** WI-0012
- **Date:** 2026-11-08
- **Status:** proposed. No contract is verified, and no Forma work has started.
- **Machine-readable mapping:** `uiContracts[]` and `verificationChecks[]` in
  [`traceability.json`](traceability.json)

## 1. Position

Mercatus has no UI, so there is nothing to migrate. Every Forma screen will
be new construction. The gate allows a screen to begin only when the
workflows it consumes have `domainModelVerified`, `transitionsDefined`,
`authorizationEnforced` and `rulesTested` all `true`. The gate check fails CI
if a `uiContracts[].formaStatus` becomes `in-progress` or `done` before that.

Forma (`@echelon-foundry/design-system`, pinned baseline 0.4.1, currently
`required: false` per DF-MERCATUS-FND-2026-0002) is **zero-runtime**: semantic
HTML, CSS, tokens and accessibility contracts. Behaviour belongs to the
consuming application, which is Limen (F#/WASM) for Mercatus (PRD §1.5).
Forma therefore cannot hold business rules. The risk is that the Limen
presentation layer re-decides legality. The contracts below exist to prevent
that.

## 2. Enforced layering

```text
Forma markup/tokens  ─┐
Limen presentation    ├─ Tier 4 host (browser)   renders Views, dispatches Commands, owns no legality
                      │
Application contracts ─  Tier 3                  query → View; command → TransitionResult; effect coordination
Domain rules          ─  Tier 2                  pure: (View, Command, Actor, Grants, Now) → TransitionResult
Semantic model        ─  Tier 1                  types that make illegal states unrepresentable
Authorized infra ops  ─  Tier 4 hosts            GitHub store, Proton, listeners. Invoked only by Tier 3 for effects Tier 2 requested
```

Rules every screen must satisfy:

| # | Rule | Check |
|---|---|---|
| C1 | The UI never computes whether a command is legal. It renders `Available` and `Blocked` exactly as Tier 3 returns them. | CHK-DOK-06 |
| C2 | The UI submits commands only through the Tier 3 `submit` contract, never to storage or providers. | DVR-02 "domain mutation bypassing transition functions" |
| C3 | Actor identity and grants come from the host session, never from the command payload. | CHK-DOK-03 |
| C4 | Every command carries `ExpectedVersion` (the view's fingerprint), an `IdempotencyKey` and a `CorrelationId`. | TST-08, TST-09 |
| C5 | The UI renders all five result cases distinctly. `UnknownExternalEffect` is never shown as failure (SCN-09). `Conflict` shows the changed facts (SCN-10). `Deferred` lists the blocking obligations (PRD §10). | CHK-DOK-06 |
| C6 | The same Tier 2 function handles the command whether it originates from UI, API, agent or workflow. No UI-only path exists. | CHK-DOK-03 |
| C7 | Views are projections and are never written back as canonical state (EFF-01). | TST-17 |
| C8 | Validation messages come from Tier 2 `Violation` values, rendered with Forma's accessible error pattern (PRD §31). The UI adds no rule of its own. | CHK-DOK-06, accessibility acceptance |

## 3. Generic contract (Tier 3 surface)

```fsharp
// Illustrative F#. Tier 3 signatures that every screen consumes.
type ViewEnvelope<'view, 'command> =
    { ViewSchema: string                 // e.g. "LeadQualificationView/v1" (Ordo: view schema is part of identity)
      Fingerprint: StateFingerprint      // becomes ExpectedVersion on submit
      View: 'view
      Available: AvailableCommand<'command> list   // derived by Tier 2 from current state and grants
      Blocked: BlockedCommand list }               // with reasons: missing capability, open obligations, stale evidence

and BlockedCommand =
    { Command: CommandName; Reasons: BlockReason NonEmptyList }

and BlockReason =
    | MissingCapability of Capability
    | OpenObligation of ObligationId * ObligationKind
    | EvidenceNotCurrent of EvidenceRef
    | ApprovalRequired of ApprovalScope
    | Suppressed of EligibilityReason

type CommandEnvelope<'command> =
    { Command: 'command
      ExpectedVersion: StateFingerprint
      IdempotencyKey: IdempotencyKey
      CorrelationId: CorrelationId }      // no Actor field: C3

type TransitionResult<'event> =
    | Accepted of 'event NonEmptyList
    | Rejected of Violation NonEmptyList
    | Deferred of MissingRequirement NonEmptyList
    | Conflict of expected: StateFingerprint * actual: StateFingerprint * changed: FactChange list
    | UnknownExternalEffect of EffectId * ObligationId

type ScreenContract<'view, 'command, 'event> =
    { Query: SessionActor -> QueryArgs -> Async<Result<ViewEnvelope<'view, 'command>, QueryError>>
      Submit: SessionActor -> CommandEnvelope<'command> -> Async<TransitionResult<'event>> }
```

## 4. Screen contracts

| UI | Screen | View | Commands (subset of the Tier 2 command set) | Workflows | Requirements | Blocked by |
|---|---|---|---|---|---|---|
| UI-01 | Belief board | HypothesisBoardView/v1 | ProposeHypothesis, StartResearch, MarkTestable, RecordEvidence, Evaluate, Reopen | WF-01, WF-03 | PRD-23 | FND-03, FND-04, FND-05, FND-15 |
| UI-02 | Evidence inspector | EvidenceLineageView/v1 | AcceptEvidence, ContestEvidence, MarkStale, LinkContradiction, SupersedeEvidence | WF-02, WF-03 | PRD-07, PRD-23, PRD-26.3, PRD-26.4 | FND-15 |
| UI-03 | Organization & contact | AccountView/v1 | ResolveIdentity, ProposeMerge, ReverseMerge, SetRestriction, LiftRestriction, GrantPermission | WF-04 | PRD-08, PRD-23, DSM-07A | FND-03 |
| UI-04 | Lead qualification | LeadQualificationView/v1 | StartResearch, MarkEvidenceReady, RequestQualification, Qualify, Disqualify, Defer, ConvertToOpportunity | WF-05 | PRD-09, PRD-25 | FND-11, FND-14 |
| UI-05 | Opportunity & blockers | OpportunityBlockersView/v1 | AdvanceStage, Regress, MarkDormant, MarkLost, MarkWon, SatisfyObligation, WaiveObligation | WF-06, WF-14 | PRD-10, PRD-23, PRD-28, SCN-10 | FND-12, FND-14 |
| UI-06 | Experiment board | ExperimentBoardView/v1 | Design, MarkReady, Run, Stop, Complete, Interpret, Archive | WF-11 | PRD-11, PRD-23 | FND-13 |
| UI-07 | Approval queue (mobile) | ApprovalQueueView/v1 | Approve, Reject, Revoke | WF-13, WF-09, WF-12 | PRD-23, PRD-28, SCN-33 | FND-17, FND-23 |
| UI-08 | Outreach composer & status | OutreachStatusView/v1 | DraftMessage, SubmitForReview, RequestSend, CancelQueued, StartReconciliation | WF-09 | PRD-13, SCN-08, SCN-09 | FND-07, FND-08 |
| UI-09 | Reply classification (mobile) | InboxTriageView/v1 | ClassifyReply, ConfirmSuppression, RouteToReview | WF-10 | PRD-14, PRD-28 | FND-03 |
| UI-10 | Campaign console | CampaignConsoleView/v1 | SubmitForReview, Activate, Pause, Resume, Complete, Evaluate, Cancel | WF-08 | PRD-11, PRD-28 | FND-06 |
| UI-11 | Signal triage | SignalTriageView/v1 | Triage, Investigate, MarkRelevant, MarkNotRelevant, ConvertToWork | WF-07 | PRD-26.1 | FND-24 |
| UI-12 | Field capture (conference) | FieldCaptureView/v1 | CaptureObservation, CaptureContact, CreateFollowUpObligation | WF-02, WF-04, WF-14 | PRD-28, PRD-31 | FND-14 |
| UI-13 | Next actions | NextActionsView/v1 | ClaimWork, ReleaseWork | WF-14, WF-15 | PRD-23 | FND-18, FND-20 |

FND-01 (no implementation) and FND-18 (no authorization model) block every
row.

Command names are provisional. They become authoritative only when the
Tier 2 command union is merged. CHK-DOK-06 then checks each screen's commands
against that union.

### Screen-specific contract notes

- **UI-04 / UI-05:** `Qualify` and `AdvanceStage` appear under `Available`
  only when Tier 2 says so. Otherwise they appear under `Blocked` with
  `OpenObligation` and `EvidenceNotCurrent` reasons, which is how PRD §10's
  "what prevents advancement" is answered.
- **UI-07:** an approval displays and binds the content hash it approves. If
  the material changed, the server returns `Rejected [ApprovalScopeMismatch]`
  and the UI shows the diff (SCN-33).
- **UI-08:** send status is read from the ExternalEffect projection, which is
  the single authority (FND-07). `Unknown` shows "Delivery not confirmed:
  reconciling" and offers no resend action (SCN-09, Ordo P3).
- **UI-09:** an `Unsubscribe` classification suggested by an agent is applied
  as suppression immediately on the domain side. The UI only confirms it and
  cannot defer it (DR-SEND-01).
- **UI-03:** the eligibility panel shows any active restriction, including an
  inherited organization DoNotEngage, ahead of permissions. `LiftRestriction`
  appears only for actors with `CanLiftRestriction`, which agents never hold,
  and it requires a rationale (DR-ELIG-02).
- **UI-12:** must work offline-tolerant on a phone. Captured items are
  commands queued with idempotency keys, never local canonical state (C7).

## 5. Verification checks (Dokimos and gate)

| Check | Kind | Verifies | Status | Becomes executable with |
|---|---|---|---|---|
| CHK-GATE | executable | traceability integrity; workflow gate; Forma gate; work-item links; inventory honesty | **passing** (`node tools/modernization/verify-gate.mjs`, `node --test tools/modernization/gate.test.mjs`) | — |
| CHK-DOK-01 | dokimos | domain invariants (property tests) | defined, not executable | WI-0013 |
| CHK-DOK-02 | dokimos | valid and invalid transitions | defined, not executable | WI-0015 |
| CHK-DOK-03 | dokimos | authorization boundaries across all origins | defined, not executable | WI-0029 |
| CHK-DOK-04 | dokimos | persistence consistency (concurrency, idempotency, projection rebuild) | defined, not executable | WI-0030 |
| CHK-DOK-05 | dokimos | workflow failure and recovery (Unknown, duplicates, races) | defined, not executable | WI-0018 |
| CHK-DOK-06 | dokimos | domain-to-UI contract compatibility | defined, not executable | WI-0013 |
| CHK-DOK-07 | dokimos | regression ratchet against accepted behaviour | defined, not executable | WI-0013 |

Dokimos 0.2.0 (in the resolved release set) measures code quality over source
revisions. It has nothing to measure until source exists. CHK-DOK-01…07 are
recorded as defined but not executable rather than reported as passing. When
WI-0013 lands, they run as F# test suites whose results Dokimos ingests, and
`dokimos ratchet check` supplies CHK-DOK-07 evidence to Praxis
(`docs/work-protocol.md`, `dokimos-ratchet`).

## 6. Change control

- To start Forma work on a screen: set the workflow's four contract criteria
  to `true` with `gateEvidence` paths in `traceability.json`, then set the
  screen's `formaStatus`. CI rejects any other order.
- When code first appears, the inventory check fails. The audit must then be
  revised with an updated `implementationInventory`, which forces this
  document set to be revisited.
