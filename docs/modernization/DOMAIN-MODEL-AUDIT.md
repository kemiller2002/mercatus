# Mercatus Domain Model Audit

- **Work item:** WI-0012
- **Date:** 2026-11-08
- **Repository baseline:** `16a5e4e` (main)
- **Gate reference:** Echelon Mercatus modernization, "Domain Model and Workflow Validation" gate
- **Machine-readable source of truth:** [`traceability.json`](traceability.json), checked by
  `node tools/modernization/verify-gate.mjs` (CI job `modernization-gate`)
- **Update 2026-11-08:** the owner resolved FND-02, FND-09, FND-10 and FND-21
  in [DF-MERCATUS-DOM-2026-0001](../../research/decisions/DF-MERCATUS-DOM-2026-0001--owner-decisions-scope-ids-single-source-negative-precedence.md). Those findings are marked
  resolved below. The original analysis is kept as the record of why.
- **Companion documents:** [`WORKFLOW-BOUNDARY-REVIEW.md`](WORKFLOW-BOUNDARY-REVIEW.md),
  [`DOMAIN-UI-CONTRACTS.md`](DOMAIN-UI-CONTRACTS.md)

## 1. Summary

Mercatus has **no domain implementation**. There are no F# projects, no F#
source files, no domain types or discriminated unions, no transition
functions, no persistence code, no UI and no domain tests. The tracked tree
holds 97 Markdown files, 61 JSON files, four CI workflows, the Praxis
launchers and one Node launcher (`tools/ros_fs_launcher.mjs`). This agrees
with the accepted decisions
[DF-MERCATUS-FND-2026-0001](../../research/decisions/DF-MERCATUS-FND-2026-0001--limen-boundary-not-yet-applicable.md)
and
[DF-MERCATUS-FND-2026-0002](../../research/decisions/DF-MERCATUS-FND-2026-0002--aegis-forma-folio-not-yet-applicable.md).

The domain model therefore exists **only as requirements**, mainly
`requirements/DOMAIN-STATE-MODEL.md` (DSM), `requirements/PRODUCT-REQUIREMENTS.md`
(PRD) and `requirements/INTEGRATION-REQUIREMENTS.md` (INT). This audit
evaluates that specified model as the authoritative domain model. It does not
assume the specification is correct.

The main consequences:

1. **No workflow passes the acceptance gate.** All 15 workflows are `blocked`
   (see the workflow review). None of the six gate criteria can hold without
   code, tests and evidence.
2. **There is nothing to migrate to Forma.** The UI is not legacy. It does not
   exist yet. Any Forma screen is new construction, and the gate forbids
   starting it before its workflow's contracts are verified. No Forma work was
   started.
3. **The specification has defects that must be fixed before code is written.**
   27 findings are recorded below. 22 are actionable and were filed as Praxis
   work items WI-0013 to WI-0034. Five of them are critical and block the first
   vertical slice (PRD §25).

No business rule was changed. Where this audit proposes a resolution, the
proposal is labelled as such and assigned to a work item for owner decision.

## 2. Method

1. **Inventory.** `git ls-files` was run over the tracked tree and classified
   by extension. The inventory is recorded in `traceability.json` and
   re-checked mechanically on every CI run. If code appears, the gate check
   fails until this audit is revised.
2. **Requirement extraction.** At audit time, only `REQ-BOOTSTRAP-001` had
   a stable ID (FND-02). After the owner's decision, every requirement section
   carries a stable `` ID: `...` `` line in its own document (`PRD-09`,
   `DSM-12`, `INT-13`, `SCN-08`, ...). The gate check fails if a section lacks
   an ID, an ID is duplicated, or traceability cites a missing ID.
3. **Cross-document comparison.** Every aggregate was compared across DSM, PRD,
   INT, SCENARIOS-AND-EXPANSION and DOMAIN-VERIFICATION. The audit looked for
   divergent lifecycles, duplicated authority, representable invalid states and
   unspecified transitions.
4. **Doctrine comparison.** The model was compared with the Echelon four-tier
   specification (`.sde/architecture/FOUR-TIER-ARCHITECTURE.md`, SDE 1.5.0) and
   with the current Ordo doctrine at `kemiller2002/ordo@db6d39e`
   (`STATE-DIRECTED-ENGINEERING`, `DECISION-AND-EVIDENCE-SEMANTICS`,
   `BOUNDARY-PRESERVATION`). No Ordo artifact is named "playbook" (FND-22). The
   doctrine documents were used as the playbook.

## 3. Discovered domain model (specified, unimplemented)

### 3.1 Aggregates with a specified state set

| Aggregate | DSM § | States | Transitions specified | Capabilities specified |
|---|---|---|---|---|
| MarketHypothesis | 2 | Draft, Proposed, Researching, Testable, Testing, Supported, Weak, Rejected, Dormant, Reopened | no | yes |
| ProblemHypothesis | 3 | Draft, Observed, Investigating, Corroborated, CommerciallyRelevant, Weak, Rejected, Revisit | no | yes |
| Observation | 4 | Captured, Normalized, Reviewed, PromotedToEvidence, Dismissed, Superseded | no | yes |
| Evidence | 5 | Candidate, Accepted, Contested, Stale, Superseded, Invalidated | no | yes |
| Organization | 6 | Discovered, Researching, Researched, Candidate, Engaging, ActiveRelationship, Inactive *(DoNotEngage moved to eligibility, FND-10)* | no | no |
| Contact | 7 | Discovered, Unverified, Verified, Engaged, Inactive *(Reachable/DoNotContact moved to eligibility, FND-09)* | no | no |
| CommunicationEligibility | 7a | restrictions DoNotContact, Unsubscribed, InvalidAddress, DoNotEngage; permissions RelationshipOnly, MarketingAllowed, DirectOutreachAllowed, ExistingCustomer | partial (set/lift restriction) | yes |
| Lead | 8 | Discovered, Researching, EvidenceReady, QualificationPending, Qualified, Disqualified, Deferred, Converted | partial (linear chain) | no |
| Opportunity | 9 | Discovered … Won, Lost, Dormant, Rejected (12) | no | no |
| Campaign | 11 | Draft, ReadyForReview, Approved, Active, Paused, Completed, Evaluated, Cancelled | no | no |
| CampaignTarget | 12 | 13 states, Identified … Suppressed | no | no |
| OutreachMessage | 13 | 11 states, Draft … Cancelled | send path only | no |
| Experiment | 14 | Draft, Designed, Ready, Running, Stopped, Completed, Interpreted, Archived | no | no |
| Signal | 15 | Detected, Triaged, Investigating, Relevant, NotRelevant, Expired, ConvertedToWork | no | no |
| Asset | 16 | Draft, ReviewRequired, Approved, Published, Retired, Superseded | no | no |
| Claim | 16 | Proposed, EvidenceLinked, Reviewed, Approved, Stale, Rejected | no | no |
| ExternalEffect | 17 | Requested, Authorized, Executing, Confirmed, Failed, Unknown, ReconciliationRequired, Reconciled | no | no |
| IntegrationInboxItem | 18 | Received, Deduplicated, Normalized, Routed, Applied, NeedsReview, Failed, DeadLettered | no | no |
| Approval | 19 | Requested, Pending, Approved, Rejected, Expired, Revoked, Consumed | no | no |
| Obligation | 20 | Open, Satisfied, Waived, Expired, Superseded | no | no |

Relationship (DSM §10) and Decision (DSM §21) are deliberately specified as
history/projection and as a record, not as state machines. This audit
considers both choices correct.

### 3.2 Entities without a model

PRD §3 lists 29 first-class entities. Thirteen have no state model, no value
model and no statement that they are value objects: ICP, Offering,
Interaction, Conversation, Outcome, Source, CustomerLanguage, Competitor,
Alternative, ChannelPolicy, AgentActivity, Metric, and Message (PRD) versus
OutreachMessage (DSM). PRD §32 adds 21 more candidate concepts and says they
should become aggregates only when that improves invariant enforcement. That
classification has not been done (FND-20). Outcome is load-bearing: DSM §9
requires "Won requires a defined commercial outcome", and PRD §25 ends the
vertical slice at Outcome → Learning.

### 3.3 Relationships

The specified graph is: MarketHypothesis ↔ ProblemHypothesis (many-to-many,
evidence-linked); Observation → Evidence (promotion, lineage);
Evidence → {hypotheses, Lead qualification, Claim} (support/contradiction);
Organization ↔ Contact (time-bounded affiliation, PRD §32); Lead →
{Organization, Contact, ProblemHypothesis, MarketHypothesis, Offering} →
Opportunity (conversion); Campaign → CampaignTarget → OutreachMessage →
ExternalEffect; IntegrationInboxItem → {CampaignTarget, Contact eligibility};
Approval → {OutreachMessage, Asset, Campaign} (version-scoped);
Obligation → any aggregate (blocking). Signal → work (an Obligation or a
research item, never a Lead or Opportunity directly).

### 3.4 Transition envelope (DSM §1)

Every command carries identity, expected version, actor, capabilities, policy
version, evidence status, blocking obligations, idempotency key and
correlation/causation IDs. It yields exactly one of `Accepted`, `Rejected`,
`Deferred`, `Conflict` or `UnknownExternalEffect`. This agrees with Ordo
doctrine §5 ("Unknown is not Failed") and §6 (capability is semantic
authority, not authentication). FND-26 records it as correct but untested.

### 3.5 Persistence contracts and data ownership

PRD §27 lists 14 concerns for GitHub-backed storage, including optimistic
version checks, atomicity, immutable history, partial writes and corruption
detection. It defines no contract: there is no aggregate-to-storage-unit
mapping, no atomicity boundary, no event-versus-snapshot decision, and no
statement of which aggregate owns which cross-aggregate fact, for example who
owns "suppressed" (FND-19).

### 3.6 Authorization boundaries

Capabilities are named for 4 of 19 aggregates. No actor model exists: there
are no roles, no grants, no mapping from the PRD §18 agent roles to
capabilities, and no "human-only" transition list beyond "first contact
requires human approval". DSM §22 requires agent authority to be
capability-scoped and revocable, which needs a grant model (FND-18).

### 3.7 Existing domain tests

None. DOMAIN-VERIFICATION.md requires 20 test classes and seven architecture
tests. All are recorded as `missing` in `traceability.json`
(`TST-01`…`TST-20`).

## 4. Findings

Classification vocabulary is the gate's: *correct and verified*, *correct but
insufficiently tested*, *incorrect implementation*, *missing business
behavior*, *ambiguous requirement*, *architecture violation*, *requiring owner
decision*. No finding is *incorrect implementation*, because there is no
implementation.

### Critical (block the first vertical slice)

**FND-01. No domain implementation exists.** *Missing business behavior.*
→ WI-0013, WI-0003.
No Tier 1 types, no Tier 2 transitions and no tests exist, so no gate
criterion can be satisfied. Restoration triggers in DF-MERCATUS-FND-2026-0002
apply: the first F# project restores Aegis, and the first UI restores Forma.

**FND-03. Transitions are unspecified for 17 of 19 aggregates.** *Missing
business behavior.* → WI-0015.
The DSM lists states but not legal edges. Lead has a linear chain with no
edges out of Deferred, and OutreachMessage has only its send path. PRD §1.2
requires explicit legal transitions. Without them, "make invalid transitions
impossible through types" cannot be implemented. Proposed tables, marked as
proposals, are in WORKFLOW-BOUNDARY-REVIEW §4.

**FND-07. Send state is duplicated across three aggregates.** *Architecture
violation.* → WI-0018.
CampaignTarget (`ApprovedToSend → SendRequested → Sent`), OutreachMessage
(`Approved → Queued → Sending → Sent | DeliveryUnknown | Delivered | Failed`)
and ExternalEffect (`Requested → … → Confirmed | Failed | Unknown`) each
record send progress. The combination `CampaignTarget=Sent ∧
OutreachMessage=DeliveryUnknown ∧ ExternalEffect=Failed` is representable.
This violates Ordo's single-semantic-authority rule.
*Proposal:* ExternalEffect is the only authority for "did the provider act".
OutreachMessage owns content and approval lineage. CampaignTarget owns
targeting and response, and its send-related states become a projection.

**FND-11. Lead and Opportunity qualification overlap, and the conversion
target is undefined.** *Ambiguous requirement.* → WI-0022.
Both aggregates have `Qualified`. DSM §8 converts a Qualified Lead into an
Opportunity, but the Opportunity's initial state is not stated. If it starts
at `Discovered`, qualification happens twice. If it starts at `Qualified`,
Opportunity's earlier states are unreachable for converted leads. PRD §25 runs
through this edge.

**FND-14. Blocking-obligation semantics are unspecified.** *Missing business
behavior.* → WI-0025.
DSM §20 says "blocking obligations prevent specified transitions", but nothing
specifies which obligation kinds block which transitions, or whether blocking
is a property of the kind or of the instance. PRD §10 ("what unresolved work
prevents advancement") and UI-05 depend on this.
*Proposal:* an `Obligation` carries `Blocks: TransitionKind Set`, set by Tier 2
policy when it is created. Tier 2 returns `Deferred [obligationIds]` while any
blocking obligation is Open.

**FND-18. No authorization model.** *Missing business behavior.* → WI-0029.
See §3.6. The same command must be authorized identically from UI, API,
workflow or agent. That requires one Tier 2 capability evaluation over a
host-supplied `Actor * CapabilityGrant list`, which is not yet specified.

### High

**FND-08. Unknown, ReconciliationRequired and DeliveryUnknown are not
distinguished.** *Ambiguous requirement.* → WI-0019.
ExternalEffect has both `Unknown` and `ReconciliationRequired` with no stated
difference. OutreachMessage repeats the idea as `DeliveryUnknown`. Ordo
doctrine §5 needs one Unknown state plus a reconciliation *obligation*.
*Proposal:* drop `ReconciliationRequired` as a state, because the obligation
carries it.

**FND-09. Contact lifecycle duplicates CommunicationEligibility.** *Requiring
owner decision.* → WI-0020. **Resolved (DF-MERCATUS-DOM-2026-0001: "one source of truth").**
CommunicationEligibility (`DSM-07A`) is now the only owner of
contactability.
DSM §7 gives Contact the states `DoNotContact` and `Reachable` and also
requires a separate CommunicationEligibility (DSM §7, INT, PRD §32). As a
result, `Contact=Engaged ∧ Eligibility=DoNotContact` and
`Contact=DoNotContact ∧ Eligibility=MarketingAllowed` are both representable.
*Proposal:* remove `DoNotContact` and `Reachable` from Contact, and keep them
only in eligibility. This changes a business rule's representation, so the
owner must decide.

**FND-12. Opportunity Lost vs Rejected, regression and Outcome are
undefined.** *Ambiguous requirement.* → WI-0023.
"Rejected" has no definition: it could mean rejected by Echelon or by the
buyer. "May regress when evidence changes" has no edges. Won needs an Outcome
model that does not exist (FND-20).

**FND-15. Evidence `Stale` as a stored state conflicts with effective-current
projection.** *Ambiguous requirement.* → WI-0026.
Staleness depends on time. A stored `Accepted` evidence item can be stale at
evaluation time, so `Accepted ∧ expired` is representable and DR-EV-01 could
be bypassed by a stale projection.
*Proposal:* freshness is computed by Tier 2 at evaluation from a validity
policy and the transition time. A stored `Stale` state records only an
explicit human or agent assessment.

**FND-17. Approval semantics are incomplete.** *Ambiguous requirement.*
→ WI-0028.
`Requested` vs `Pending` is undefined. `Consumed` implies single use, but a
campaign approval covers many sends. CampaignTarget's
`ApprovalRequired/ApprovedToSend` duplicates the Approval aggregate.

**FND-19. No persistence contract.** *Missing business behavior.* → WI-0030.
See §3.5.

**FND-21. The project charter conflicts with the product scope.** *Requiring
owner decision.* → WI-0032. **Resolved (DF-MERCATUS-DOM-2026-0001: the Sales and Marketing
system).** The charter, current state and handoff are updated.
`PROJECT-CHARTER.md`, `HANDOFF.md` and `context/CURRENT-STATE.md` still
describe a template "communication problem" pilot with no intended users. The
README and `requirements/` describe the Echelon Sales and Marketing system.
The gate's "authoritative requirements" are therefore unconfirmed at charter
level.

### Medium and low

| ID | Classification | Finding | Work item |
|---|---|---|---|
| FND-02 | Requiring owner decision | Requirements lacked stable IDs. **Resolved:** every section now carries one | WI-0014 |
| FND-04 | Ambiguous requirement | MarketHypothesis lifecycle in PRD §4 (Proposed→Researching→Testing→…→Revisit) differs from DSM §2 (adds Draft, Testable, Dormant; Reopened) | WI-0016 |
| FND-05 | Ambiguous requirement | The reopen state is `Reopened` for MarketHypothesis and `Revisit` for ProblemHypothesis | WI-0016 |
| FND-06 | Ambiguous requirement | Campaign `Cancelled` and CampaignTarget `ApprovalRequired`/`SendRequested`/`Suppressed` appear in DSM only | WI-0017 |
| FND-10 | Requiring owner decision | Whether `Organization=DoNotEngage` overrides an individual contact's eligibility was undefined. **Resolved:** a negative always overrides a positive, and a restriction stays active until explicitly lifted | WI-0021 |
| FND-13 | Ambiguous requirement | DSM §14 says "stopped/failed experiments remain queryable", but there is no Failed state | WI-0024 |
| FND-16 | Missing business behavior | Claim has no Superseded/Retired state, and nothing defines what happens to a Published asset when a claim becomes Stale | WI-0027 |
| FND-20 | Missing business behavior | 13 PRD §3 entities have no model (§3.2) | WI-0031 |
| FND-22 | Ambiguous requirement | No Ordo artifact named "playbook" exists; the doctrine at `db6d39e` was used | WI-0033 |
| FND-23 | Ambiguous requirement | The unit of "first contact requires human approval" (contact, organization, channel, campaign) is undefined | WI-0034 |
| FND-24 | Ambiguous requirement | The targets of `CampaignTarget.Converted` and `Signal.ConvertedToWork` are undefined | WI-0034 |

### Correct (not actionable as defects)

| ID | Classification | Finding |
|---|---|---|
| FND-25 | Correct and verified | Aegis, Forma and Folio `required: false` with restoration triggers matches the repository. Verified by the inventory check. |
| FND-26 | Correct but insufficiently tested | The five transition-result kinds agree with Ordo Unknown-effect and capability doctrine. Tests are tracked under WI-0013. |
| FND-27 | Correct but insufficiently tested | Suppression dominance and send-time eligibility agree across DSM §12, DSM §22, INT and Scenario 8. Tests are tracked under WI-0013. |

## 5. Inconsistent representations of the same concept

| Concept | Representations | Finding |
|---|---|---|
| "Has the message been sent?" | CampaignTarget.Sent, OutreachMessage.Sent/Delivered, ExternalEffect.Confirmed | FND-07 |
| "Outcome unknown" | ExternalEffect.Unknown, ExternalEffect.ReconciliationRequired, OutreachMessage.DeliveryUnknown | FND-08 |
| "May we contact this person?" | Contact.DoNotContact/Reachable, CommunicationEligibility, Organization.DoNotEngage, CampaignTarget.Suppressed. **Resolved:** CommunicationEligibility only; CampaignTarget.Suppressed remains a projection to settle under FND-07 | FND-09, FND-10 |
| "Approved" | Approval.Approved, CampaignTarget.ApprovedToSend, OutreachMessage.Approved, Campaign.Approved, Asset.Approved, Claim.Approved | FND-17 |
| "Qualified" | Lead.Qualified, Opportunity.Qualified, CampaignTarget.QualifiedForOutreach | FND-11 |
| "Reopened" | MarketHypothesis.Reopened, ProblemHypothesis.Revisit, Opportunity (Dormant→?) | FND-05, FND-12 |
| "Stale" | Evidence.Stale, Claim.Stale, effective-current projection | FND-15, FND-16 |

## 6. Architecture assessment against the four-tier specification

Nothing is implemented, so nothing violates the four tiers yet. The
specification itself is consistent with the tiers in three respects: effects
are requested as data, Unknown is first-class, and adapters are thin (INT,
"Integration inbox"). It conflicts with the Ordo single-authority principle
where FND-07, FND-09 and FND-17 apply. The target layering for the first
slice is:

```text
Tier 4  Host            Mercatus.Host.GitHub, Mercatus.Host.Proton, Limen browser host
Tier 3  Application     Mercatus.Application  (use cases, projections, effect coordination)
Tier 2  Transition      Mercatus.Domain.Transitions (pure: command × state → TransitionResult)
Tier 1  Semantic Model  Mercatus.Domain.Semantic (netstandard2.0, FSharp.Core only)
```

Forma, which is zero-runtime HTML/CSS/tokens, and the Limen F#/WASM
presentation layer sit beside Tier 4 as a host. They consume Tier 3 contracts
only (DOMAIN-UI-CONTRACTS).

## 7. Next actions

1. ~~Owner decisions: WI-0032, WI-0014, WI-0020, WI-0021.~~ Done in
   DF-MERCATUS-DOM-2026-0001.
2. Specification fixes that unblock the first slice: WI-0015, WI-0022,
   WI-0025, WI-0029, then WI-0018, WI-0019, WI-0026, WI-0028.
3. WI-0013 / WI-0003: implement the Tier 1/2 core for PRD §25 (WF-01, WF-02,
   WF-03, WF-05, WF-06, WF-14). This restores Aegis and the Limen boundary and
   makes CHK-DOK-01…07 executable.
4. Only then may UI-01, UI-02, UI-04 and UI-05 begin on Forma, each after its
   workflow's contract criteria are recorded as true in `traceability.json`.
   The gate check enforces this.
