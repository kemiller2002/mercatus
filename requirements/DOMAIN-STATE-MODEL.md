# Domain State Model and Transition Requirements

This document converts the commercial requirements into explicit SDE/Ordo state, invariant, capability, obligation, and transition requirements. Names are provisional until implementation proves or disproves them.

## 1. System-wide transition envelope

ID: `DSM-01`

Every state-changing command MUST evaluate:
- aggregate identifier and expected version;
- current state;
- requested transition;
- actor identity and actor type;
- actor capabilities;
- applicable policies and policy version;
- required evidence and its effective-current status;
- unresolved blocking obligations;
- invariants;
- external-effect implications;
- idempotency key where applicable;
- transition time and correlation/causation identifiers.

A transition result MUST be one of:
- Accepted with emitted domain events;
- Rejected with explicit violated invariant/policy/capability;
- Deferred with explicit missing evidence/obligation;
- Conflict because expected version is stale;
- UnknownExternalEffect where an external side effect cannot be confirmed.

Agents MUST receive legal capabilities from current state rather than infer allowed mutations from prose.

## 2. MarketHypothesis

ID: `DSM-02`

States:
Draft, Proposed, Researching, Testable, Testing, Supported, Weak, Rejected, Dormant, Reopened.

Core invariants:
- has a falsifiable proposition before Testable;
- has a defined target population/market scope;
- assumptions are explicit;
- evidence references cannot be replaced by a confidence number;
- Supported requires both supporting evidence review and counterevidence review;
- Rejected preserves evidence and rationale;
- reopening preserves prior lifecycle.

Capabilities:
CanEdit, CanPropose, CanStartResearch, CanMarkTestable, CanStartTest, CanRecordEvidence, CanEvaluate, CanSupport, CanWeaken, CanReject, CanDormant, CanReopen.

Obligations MAY include DefinePopulation, DefineProblem, IdentifyBuyer, FindCounterEvidence, EstablishBuyingTrigger, TestReachability, TestWillingnessToEngage, ReviewStaleEvidence.

## 3. ProblemHypothesis

ID: `DSM-03`

States:
Draft, Observed, Investigating, Corroborated, CommerciallyRelevant, Weak, Rejected, Revisit.

Invariants:
- problem is represented independently from an Echelon solution;
- affected actor and consequence are explicit before Corroborated;
- CommerciallyRelevant requires evidence beyond social attention;
- workaround/alternative is unknown or recorded, never silently assumed absent.

Capabilities:
CanInvestigate, CanAttachObservation, CanAttachEvidence, CanCorroborate, CanTestCommercialRelevance, CanReject, CanRevisit.

Obligations:
FindIndependentEvidence, IdentifyConsequence, IdentifyCurrentAlternative, IdentifyFrequency, IdentifyOwner, TestCommercialConsequence.

## 4. Observation

ID: `DSM-04`

States:
Captured, Normalized, Reviewed, PromotedToEvidence, Dismissed, Superseded.

Invariants:
- original source/reference is immutable;
- interpretation is not stored as raw observation;
- capture time and observed time are distinguishable;
- duplicate observations can be linked without deleting provenance.

Capabilities:
CanNormalize, CanReview, CanPromote, CanDismiss, CanSupersede.

## 5. Evidence

ID: `DSM-05`

States:
Candidate, Accepted, Contested, Stale, Superseded, Invalidated.

Evidence includes scope, claim, source, observation references, strength/type, collected/observed time, effective-current assessment, confidence where useful, contradictions, and interpretation.

Invariants:
- evidence never becomes stronger merely because an agent repeats it;
- stale evidence cannot satisfy a current-evidence requirement;
- contradictory evidence is retained;
- source deletion does not silently erase derived history;
- agent-generated inference is not mislabeled as source evidence.

Capabilities:
CanAccept, CanContest, CanMarkStale, CanSupersede, CanInvalidate, CanLinkContradiction.

## 6. Organization

ID: `DSM-06`

States:
Discovered, Researching, Researched, Candidate, Engaging, ActiveRelationship, Inactive.

Organization status is distinct from opportunity status.

DoNotEngage is not a lifecycle state. It is an organization-level communication restriction held in CommunicationEligibility (section 7a), the single source of truth for whether anyone at the organization may be contacted (DF-MERCATUS-DOM-2026-0001).

Obligations MAY include ResolveIdentity, ResolveDuplicate, IdentifyRelevantRoles, ValidateICPFit, RefreshEvidence.

Invariants include canonical identity/alias handling and prohibition on merging organizations without provenance and reversible merge history.

## 7. Contact

ID: `DSM-07`

States:
Discovered, Unverified, Verified, Engaged, Inactive.

Whether a contact may be contacted is not part of contact state. CommunicationEligibility (section 7a) is the single source of truth for it; contact state MUST NOT encode or imply reachability (DF-MERCATUS-DOM-2026-0001).

Invariants:
- identity confidence is explicit;
- role freshness can expire;
- contact and organization linkage has effective dates;
- unsubscribe/do-not-contact cannot be overridden by campaign membership.

## 7a. CommunicationEligibility

ID: `DSM-07A`

CommunicationEligibility is the single source of truth for whether, and how, a contact or an organization may be contacted. No other aggregate, projection, campaign, or agent may hold its own copy of this decision (DF-MERCATUS-DOM-2026-0001).

Restrictions (negative):
DoNotContact, Unsubscribed, InvalidAddress at contact scope; DoNotEngage at organization scope.

Permissions (positive):
RelationshipOnly, MarketingAllowed, DirectOutreachAllowed, ExistingCustomer.

Invariants:
- a negative always overrides a positive, at any scope: an organization-level DoNotEngage blocks every contact affiliated with that organization, whatever that contact's own permissions;
- a restriction is active from the moment it is set until it is explicitly lifted; it is evaluated at send time, not only when a target is added;
- a restriction can be lifted only by an explicit, authorized transition that records actor, rationale, and time; it never lapses through campaign membership, inference, elapsed time, or agent action;
- lifting a restriction does not delete it: the history of when it was set and lifted is retained;
- eligibility for a contact is derived as: blocked if any applicable restriction (contact scope or any current organization affiliation) is active, otherwise the granted permissions.

Capabilities:
CanSetRestriction, CanLiftRestriction, CanGrantPermission. Agents MUST NOT hold CanLiftRestriction.

## 8. Lead

ID: `DSM-08`

States:
Discovered, Researching, EvidenceReady, QualificationPending, Qualified, Disqualified, Deferred, Converted.

A Lead is a candidate commercial connection between evidence, organization/contact, problem, market, and potential offering. It is not merely a person.

Qualification dimensions SHOULD remain inspectable rather than collapse to one opaque score.

Transitions:
DiscoverLead -> StartResearch -> MarkEvidenceReady -> RequestQualification -> Qualify/Disqualify/Defer -> ConvertToOpportunity.

Qualify MUST require the policy-selected evidence dimensions. Missing information produces obligations rather than fabricated values.

## 9. Opportunity

ID: `DSM-09`

States:
Discovered, Researching, Engaging, ProblemConfirmed, Qualified, Exploring, Proposal, Negotiation, Won, Lost, Dormant, Rejected.

Invariants:
- Won requires a defined commercial outcome;
- Proposal requires problem/value context and authorized proposal capability;
- stage advancement cannot be based solely on elapsed time;
- Lost retains reason/evidence/alternative when known;
- Dormant is distinct from Lost;
- an opportunity may regress when evidence changes.

Obligations:
ConfirmProblem, IdentifyDecisionMaker, IdentifyEconomicBuyer, DefineValueHypothesis, EstablishNextInteraction, ResolveRisk, UnderstandProcurement, ConfirmTiming, RecordAlternative, FollowUp.

## 10. Relationship

ID: `DSM-10`

Relationship SHOULD be modeled as history/projection rather than a single mutable CRM label.

Events MAY include Introduced, InteractionRecorded, TrustSignalObserved, ReferralGiven, ReferralReceived, RelationshipStrengthChanged, DormancyObserved, Reengaged.

Relationship strength MUST expose its evidence and recency.

## 11. Campaign

ID: `DSM-11`

States:
Draft, ReadyForReview, Approved, Active, Paused, Completed, Evaluated, Cancelled.

Invariants:
- Active requires objective, audience, hypothesis, success/failure criteria, stop rules, budget/cost policy, channel policy, and required approval;
- Paused prevents new outbound effects;
- Completed does not imply successful;
- Evaluated requires results and interpretation to be distinct.

## 12. CampaignTarget

ID: `DSM-12`

States:
Identified, Researched, QualifiedForOutreach, MessagePrepared, ApprovalRequired, ApprovedToSend, SendRequested, Sent, Responded, FollowUpDue, Converted, Closed, Suppressed.

Invariants:
- eligibility checked at send time, not only when target was added;
- a response can stop pending sequence work;
- Suppressed prevents outbound marketing effects;
- duplicate target/provider identity cannot create duplicate sends.

## 13. OutreachMessage

ID: `DSM-13`

States:
Draft, ReadyForReview, Approved, Queued, Sending, Sent, DeliveryUnknown, Delivered, Failed, Responded, Cancelled.

The system MUST distinguish content approval from send eligibility.

External send transition:
Approved + eligible + capability + policy + idempotency -> Sending -> Sent/DeliveryUnknown/Failed.

DeliveryUnknown creates ReconcileDelivery obligation and MUST NOT automatically retry.

## 14. Experiment

ID: `DSM-14`

States:
Draft, Designed, Ready, Running, Stopped, Completed, Interpreted, Archived.

Invariants:
- hypothesis and expected signal defined before Running;
- interpretation criteria established before results where practical;
- result data cannot be rewritten to match interpretation;
- stopped/failed experiments remain queryable.

## 15. Signal

ID: `DSM-15`

States:
Detected, Triaged, Investigating, Relevant, NotRelevant, Expired, ConvertedToWork.

A Signal cannot directly create an Opportunity without the intervening evidence/qualification policy.

Obligations MAY include VerifySource, FindCorroboration, DetermineAffectedMarket, DetermineAffectedOrganization, DetermineCommercialMeaning.

## 16. Asset and public claims

ID: `DSM-16`

Asset states:
Draft, ReviewRequired, Approved, Published, Retired, Superseded.

Claim states:
Proposed, EvidenceLinked, Reviewed, Approved, Stale, Rejected.

Publishing MUST verify that governed claims remain approved/effective-current.

## 17. ExternalEffect

ID: `DSM-17`

States:
Requested, Authorized, Executing, Confirmed, Failed, Unknown, ReconciliationRequired, Reconciled.

Unknown is a first-class state.

Every effect MUST retain idempotency/correlation information sufficient for provider-specific reconciliation where possible.

## 18. IntegrationInboxItem

ID: `DSM-18`

States:
Received, Deduplicated, Normalized, Routed, Applied, NeedsReview, Failed, DeadLettered.

Processing MUST be idempotent. Provider redelivery MUST NOT duplicate domain effects.

## 19. Approval

ID: `DSM-19`

States:
Requested, Pending, Approved, Rejected, Expired, Revoked, Consumed.

Approval scope MUST include exact action/material/version. Editing approved material invalidates or narrows approval according to policy.

## 20. Obligation

ID: `DSM-20`

States:
Open, Satisfied, Waived, Expired, Superseded.

Waiver requires actor capability and rationale. Blocking obligations prevent specified transitions.

## 21. Decision

ID: `DSM-21`

A Decision SHOULD retain options, evidence, assumptions, unknowns, risks, reversibility, decision posture, actor, time, and later outcome. Decisions SHOULD be reviewable against subsequent evidence.

## 22. Cross-aggregate invariants

ID: `DSM-22`

- DoNotContact/Unsubscribed/DoNotEngage dominates campaign intent; a negative eligibility restriction always overrides a positive permission (section 7a).
- Each fact has exactly one authoritative owner; other aggregates and projections reference it rather than copy it.
- Stale evidence cannot silently authorize current consequential transitions.
- Human approval is version-specific.
- Provider success without local persistence becomes reconciliation work.
- Local persistence without provider confirmation never implies provider success.
- A campaign pause blocks new campaign effects even when messages were previously queued unless policy explicitly permits already-in-flight effects.
- Organization/contact merges preserve references and audit history.
- Deleting/retiring content does not erase historical campaign evidence.
- Agent authority is capability-scoped and revocable.
- Confidence never substitutes for evidence.
- No state machine may use an Unknown value to bypass a required invariant; Unknown must produce an explicit legal path or obligation.
