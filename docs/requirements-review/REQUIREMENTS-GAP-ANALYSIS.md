# Mercatus Requirements Gap Analysis

- **Work item:** WI-0036
- **Date:** 2026-11-12
- **Scope:** all 15 documents in `requirements/` (313 sections with stable IDs)
- **Question:** what is missing, contradictory or unbuildable in the requirements as they stand?
- **Related:** the domain-model findings `FND-01`…`FND-27` in
  [`../modernization/DOMAIN-MODEL-AUDIT.md`](../modernization/DOMAIN-MODEL-AUDIT.md).
  This review does not repeat them. It covers everything else.

## Summary

The requirements are strong on commercial *reasoning*: evidence, hypotheses,
experiments, learning, honesty about uncertainty, and agent restraint. They are
weak on what is needed to *build and operate* the system safely:

- where it runs;
- who uses it;
- where the data lives and whether it may legally be kept there;
- whether the chosen providers can do what is assumed;
- what "done" means for any requirement.

There are 20 gaps, `GAP-01` to `GAP-20`. Seven are **blockers**: building or
handling real data before resolving them risks rework, legal exposure or
leaked personal data. Eight need an owner decision. One (`GAP-19`) is fixed in
this change.

| Severity | Gaps |
|---|---|
| Blocker | GAP-01, GAP-02, GAP-03, GAP-04, GAP-05, GAP-06, GAP-07 |
| High | GAP-08, GAP-09, GAP-10, GAP-11, GAP-12, GAP-13 |
| Medium | GAP-14, GAP-15, GAP-16, GAP-17, GAP-18, GAP-20 |
| Fixed | GAP-19 |

## Blockers

### GAP-01. Personal data would be stored in a public Git repository, with no way to erase it

*Owner decision needed.*

- **What the requirements say:** "GitHub is the initial durable store"
  (`PRD-27`, `README.md`). Persistence must provide "immutable history"
  (`PRD-27`). Contacts, conversations, complaints and notes are commercial
  state (`PRD-08`, `PRD-14`, `SCN-35`).
- **What is missing:**
  - Nothing says the data store must be **private** or **separate from the
    code repository**. `kemiller2002/mercatus` is **public** (checked
    2026-11-12).
  - Nothing reconciles immutable Git history with removing data. `SCN-36`
    requires redaction or removal, and data-protection law gives people a
    right to erasure (GAP-02). A commit cannot be deleted from Git history in
    practice once it has been pushed and cloned.
  - There is no retention policy and no data-classification scheme. `SCN-36`
    and `PRD-32` name both but define neither.
- **Why it matters:** this is the one gap that could cause irreversible harm
  the first time real contact data is written.
- **Resolution needed:**
  - Decide where commercial data lives: a private repository, another store,
    or Git holding only references.
  - Decide how erasure works, for example per-person encryption keys that can
    be destroyed (crypto-shredding), or personal data kept outside Git.
  - Define data classes and retention periods.
  - Add a gate check that refuses domain data in the code repository.

### GAP-02. No concrete legal requirements for outreach and personal data

*Owner decision needed: which jurisdictions Echelon will contact.*

- **What exists:** `SCN-47` asks for "jurisdiction-aware channel/outreach
  policy". `PRD-22` says to collect only legitimate, relevant information.
- **What is missing:** the obligations themselves:
  - lawful basis per contact and purpose, with its evidence;
  - consent records where consent is the basis;
  - an unsubscribe mechanism and sender identification in every marketing
    message;
  - honouring opt-outs within the legal deadline;
  - data-subject access and erasure requests;
  - a record of processing;
  - rules for data gathered from public sources such as Reddit, conference
    lists and badge photos (`SCN-14`).
- **Resolution needed:** a compliance requirement set per target jurisdiction
  (for example US CAN-SPAM, UK/EU GDPR and PECR, Canada CASL), reviewed by a
  qualified person. Map it onto CommunicationEligibility (`DSM-07A`) and
  ChannelPolicy (`INT-15`).

### GAP-03. Nothing says where the system runs

*Owner decision needed.*

- **What the requirements say:**
  - The browser application runs on Limen/F#/WASM (`PRD-01`).
  - GitHub is the store (`PRD-27`).
  - Agents do research and outreach (`PRD-18`).
  - Provider events arrive through an integration inbox (`INT-14`).
  - Scheduled obligations fire later (`EFF-15`).
  - Unknown effects are reconciled (`INT-13`).
- **What is missing:** a browser app plus a Git repository cannot receive
  webhooks, run scheduled work, poll providers, hold provider credentials or
  run agents. No requirement defines a server, worker, scheduler, queue,
  webhook endpoint or agent runtime, or their hosting, cost and failure
  behaviour.
- **Resolution needed:** an architecture decision (a `DF-` record) for the
  host tier: what runs where, how agents are launched and stopped, and how the
  browser app talks to it. This is Tier 4 of the four-tier architecture, and
  the specification has none.

### GAP-04. Human users, sign-in and roles are undefined

*Owner decision needed.*

- **What exists:**
  - Agent roles (`PRD-18`).
  - Human approval of first contact (`PRD-13`).
  - "Human-only approvals" (`SCN-39`).
  - A note that Kevin personally delivers work (`PCR-31`).
- **What is missing:**
  - Who the human users are: just the founder, or a team.
  - How a person signs in to the browser app.
  - What human roles exist (owner, reviewer, approver).
  - Whether one person may both draft and approve.
  - How a session or device is revoked.

  WI-0029 (the capability model) cannot be finished without this.
- **Resolution needed:** a user and identity requirement. The minimum
  viable answer may be "single owner, GitHub sign-in", but it must be written
  down.

### GAP-05. The chosen providers may not support what is assumed

*Owner decision needed: the email provider.*

`INT-20` itself requires that "capabilities MUST be verified against current
provider documentation and actual account/API access". That has not been
done. Preliminary findings come from third-party sources only and must be
confirmed against official documentation:

- **Proton Mail** (`INT-09`, "the first outbound communication adapter"):
  - No public sending API was found.
  - The documented routes are:
    - Proton Mail Bridge: a local desktop app exposing SMTP/IMAP on
      127.0.0.1, reported to require a paid plan;
    - SMTP submission tokens, reported to require a business plan.
  - Bridge does not fit a server-side worker (GAP-03).
  - Inbound replies, delivery status and threading (`INT-09`, `INT-14`) are
    unconfirmed.
- **Reddit** (`INT-06`, prioritized for listening): commercial use reportedly
  requires Reddit's approval and a separate agreement, with no published
  price. Mercatus is a commercial use.
- **LinkedIn, X, Meta** (`INT-07`, `INT-08`): `INT-21` already lists LinkedIn
  "when feasible". There is no feasibility evidence for any of them.

**Resolution needed:** a provider-verification record per provider, as
`INT-20` requires, before WF-09 and WF-10 are designed in detail. Possibly
also a decision to start with a provider that offers an API for sending,
delivery status and inbound mail.

### GAP-06. Secrets and credential management is only a prohibition

- **What exists:** credentials "MUST NOT be stored in source-controlled domain
  data" (`PRD-22`, `INT-19`). Least privilege applies per capability
  (`INT-19`).
- **What is missing:**
  - where credentials do live;
  - who and what can read them;
  - rotation;
  - revocation on compromise;
  - per-agent scoping;
  - audit of credential use;
  - behaviour when a credential expires mid-campaign (`INT-18` names the
    scenario but not the requirement).
- **Resolution needed:** a secrets requirement, tied to the GAP-03 host
  decision.

### GAP-07. Untrusted inbound content can steer agents, and there is no global stop

- **What exists:** agents must request transitions rather than call providers
  (`INT-15`, `PRD-18`). Agent output is not evidence (`DSM-05`). Agent
  authority is revocable (`DSM-22`).
- **What is missing:**
  - Agents will read Reddit posts, inbound email, web pages and documents
    (`INT-05`, `INT-14`, `SCN-14`). Nothing requires that content to be
    treated as **untrusted data** and kept separate from agent instructions,
    so it cannot steer an agent into requesting outreach, publication or a
    claim.
  - There is no **global stop**: a single control that halts all agents and
    all pending outbound effects at once.
- **Resolution needed:**
  - requirements for isolating untrusted content;
  - rules that an agent acting on ingested text cannot satisfy an approval
    or eligibility guard;
  - an emergency-stop capability with audit.

## High

### GAP-08. About thirty later commercial concepts are not in the domain model

The domain model (`DSM-01`…`DSM-22`) covers 20 domain concepts. The later
documents add concepts with no aggregate-or-value-object decision, no
transitions and no invariants in the model. Several have state lists written
only in prose:

| Source | Concepts |
|---|---|
| `PCR-01`…`PCR-31` | Offering (rich fields), ProblemPattern, CommercialMotion, offer ladder, ProofAsset, CaseStudy *(states)*, BuyerRole/StakeholderRole, BuyingTrigger/TriggerPattern, DiagnosticQualification, discovery questions, ObjectionPattern and ObjectionOccurrence, pricing experiments, ReferralSource and ReferralIntroduction, partner hypotheses, Workshop, Diagnostic, referenceability permission |
| `CLS-01`…`CLS-10` | Seven validation state machines (Problem, Message, Offer, Outcome, Delivery, Acquisition, Proof) and OfferingRole *(states)* |
| `CPR-01`…`CPR-17` | DifferentiationHypothesis *(states)*, IndependencePolicy, BoundedDiagnostic, UncertaintyReduction, EvidenceBurden, DecisionWindow, PoliticalValidationRisk, InterventionFollowThrough *(states)* |
| `RDC-01`…`RDC-14` | BuyingGroup, InternalAlignment *(states)*, TriggerFamily, time-to-value, disqualifying conditions |

This is wider than FND-20 (WI-0031), which covers only the 13 thin entities in
`PRD-03`. **Resolution:** fold these into DSM using the `PRD-32` rule (promote
to an aggregate only when that improves invariant enforcement), together with
WI-0031.

### GAP-09. The same concept is defined several ways across documents

The owner's "one source of truth" decision (DF-MERCATUS-DOM-2026-0001) applies
to the requirements themselves:

| Concept | Competing definitions |
|---|---|
| Claim | `DSM-16` (states only) vs `PCR-05` (fields only) |
| Buyer roles | `PCR-08` (9 roles) vs `RDC-01` (11 roles, different names) |
| Triggers | `LEG-04`, `PCR-09` BuyingTrigger/TriggerPattern, `RDC-06` TriggerFamily, `CPR-16` TriggerUrgency |
| Proof levels | `PGS-PART7` (6 levels), `CLS-07` ProofValidation (6, different names), `CEX-04` (5), `PCR-06` ProofAsset types |
| MarketHypothesis lifecycle | `PRD-04`, `DSM-02` and `LEG-02` (a third version with ReadyForTest, Active, ReevaluationRequired); see also FND-04 |
| Evidence strength | `LEG-03` (weak/moderate/strong with examples) vs `DSM-05` ("strength/type", undefined) |
| Offering | Offering (`PCR-01`), OfferingHypothesis and OfferingFit (`PRD-32`, `SCN-20`, `SCN-21`), EngagementHypothesis (`SCN-44`) |
| Problem | ProblemHypothesis (`DSM-03`) vs ProblemPattern (`PCR-02`); the relationship is unstated |

**Resolution:** pick one canonical definition per concept, and have the other
documents reference it by ID.

### GAP-10. Scope boundary: sales and marketing, or also delivery?

- `PCR-22` (workshop facilitator guides and exercises) and `PCR-23`
  (diagnostic intake, investigation plan, findings, deliverable) describe
  running the engagement.
- `PCR-24` is a requirement on **HelixNote's** product telemetry, not on
  Mercatus.
- `PCR-31` and `SCN-46` track delivery capacity.
- The anti-requirements (`PRD-24`) rule out a generic CRM but say nothing
  about delivery management.

**Owner decision needed:** does Mercatus manage engagement delivery, or does
it only record the commercial facts delivery produces? `PCR-24` should move
to HelixNote's requirements either way.

### GAP-11. Three conflicting build orders

- `PRD-25`: the vertical slice from hypothesis to learning, with no outreach.
- `IMP-06`: contracts, then simulator, then slice, then Proton.
- `INT-21`: contracts, simulator, Proton, …, with the Limen UI in eleventh
  place.

They disagree on whether outreach comes before or after the first slice.
**Resolution:** one authoritative release plan; the other two reference it.

### GAP-12. No release scoping or priorities

- There are 313 sections of MUST, SHOULD and MAY with no mapping to releases.
- The only defined milestone is `PRD-25`, a single sentence with no
  acceptance criteria.
- Nothing distinguishes "required for the first slice" from "aspirational".

**Resolution:** a release map, at minimum slice 1, slice 2 and later,
recorded against requirement IDs in `traceability.json`.

### GAP-13. Acceptance criteria and policy values are missing

- Only `REQ-BOOTSTRAP-001` has acceptance criteria.
- The policies the domain depends on have no values:
  - evidence freshness windows (`PRD-26.3`, `SCN-11`);
  - which qualification dimensions a lead needs (`DSM-08`);
  - daily and campaign send limits (`INT-17`);
  - budget and approval thresholds (`EFF-07`, `SCN-27`);
  - research stopping criteria (`SCN-41`);
  - stop and pivot thresholds (`CEX-11`).
- The requirements rightly say these are versioned policy data (`SCN-50`),
  but no initial policy is defined, so no guard can be tested.

**Resolution:** acceptance criteria for slice-1 requirements, plus initial
policy values marked as provisional.

## Medium

### GAP-14. Non-functional requirements are missing

- **Performance:** only `SCN-38`'s "answer on phone in 30 seconds" exists.
- **Expected scale:** number of organizations, contacts, events and agents
  is not stated.
- **Availability:** no target.
- **Backup and restore:** no recovery point or recovery time objectives.
- **Browsers and devices:** no support matrix.
- **Offline capture:** whether it is in scope is left open (`SCN-13`, "if
  feasible").
- **Outreach language:** the language of outreach and localization are not
  addressed (`SCN-47` covers jurisdiction, not language).

### GAP-15. No notification requirement

Pending approvals, due follow-ups, Unknown effects, budget breaches and
replies all need a person's attention (`EFF-01` NeedsMyAttention, `EFF-09`).
Nothing says how a person is told when they are not looking at the app.

### GAP-16. Missing integration boundaries

- **Calendar and meetings:** conversations and follow-ups are central
  (`PRD-14`, `SCN-15`), but there is no calendar boundary.
- **Revenue, invoicing and accounting:** Won, revenue and margin metrics
  (`PRD-16`, `SCN-26`, `CEX-10`) have no source of truth.
- **Website analytics and consent:** `PRD-21` and `PCR-19` assume visit data
  but require no consent mechanism (see GAP-02).
- **Initial data import:** there is no requirement for importing existing
  contacts or history from the predecessor repository, email or LinkedIn.

### GAP-17. Automation posture is required but never assigned

`EFF-13` says each workflow SHOULD declare Manual, Assistive, ApprovalGated or
PolicyAutonomous. None does. The 15 workflows in
`WORKFLOW-BOUNDARY-REVIEW.md` need one each, which also bounds what agents
may do in slice 1.

### GAP-18. Some documents read as research notes, not binding requirements

- `PRD`, `DSM` and `INT` use RFC-style MUST, SHOULD and MAY.
- `CEX`, `CLS`, `CPR`, `RDC` and parts of `PCR` mostly use lowercase "must",
  imperatives such as "Add X" or "Track Y", or describe experiments to run.

It is unclear which statements bind the software and which describe how
Echelon will run its business. **Resolution:** mark each document (or
section) as either a *system requirement* or a *commercial operating
practice*.

### GAP-20. Scenario requirements are not traced to rules or tests

`DVR-01` requires a test for every scenario in `SCENARIOS-AND-EXPANSION.md`.
None of these scenario sets has a mapping to domain rules or planned tests:

- the 50 `SCN-*` scenarios;
- the 20 portfolio scenario tests in `PCR-34`;
- the 38 `PGS-*` scenarios.

`traceability.json` currently cites 7 of them.

## Fixed in this change

### GAP-19. Eleven requirement sections had no stable ID

My stable-ID pass (WI-0014) assigned IDs only to `##`–`####` headings. Eleven
sections under top-level `#` headings were missed:

- `COMMERCIAL-EXPERIMENTS.md`: "Stop and pivot rules", "Positive escalation
  rules" and "Required experiment record". These are now `CEX-11`, `CEX-12`
  and `CEX-13`.
- `PORTFOLIO-GTM-SCENARIOS.md`: Parts I–VIII, now `PGS-PART1` to
  `PGS-PART8`. Parts VI–VIII contain MUST requirements.

The gate check now treats every heading except the document title as a
section that must carry an ID, and a test covers that.

## What is in good shape

These were checked and need no change:

- The evidence model, negative knowledge and uncertainty (`PRD-07`,
  `PRD-26.4`, `SCN-29`, `SCN-30`, `SCN-42`).
- Unknown external effects and reconciliation (`PRD-26.5`, `INT-13`, `SCN-09`).
- Separating commercial validation dimensions so they cannot advance each
  other (the `CLS` key invariant).
- Honest commercial measurement (`PCR-32`, `LEG-09`, `CEX-12`).
- Agent restraint (`LEG-07`, `PCR-05`, `PCR-14`).
- Accessibility as a system requirement (`PRD-31`).

## Sources for GAP-05

These are third-party sources and are not authoritative. `INT-20` requires
confirmation against official provider documentation.

- Proton: [Proton Mail API guide (rapidevelopers)](https://rapidevelopers.com/flutterflow-integrations/protonmail-api),
  [Swoosh ProtonBridge adapter](https://swoosh.hexdocs.pm/Swoosh.Adapters.ProtonBridge.md),
  [hydroxide (unofficial bridge)](https://github.com/emersion/hydroxide),
  [proton-mail-bridge-client](https://pypi.org/project/proton-mail-bridge-client/1.0.0/)
- Reddit: [Reddit API pricing 2026 (data365)](https://data365.co/blog/reddit-api-pricing),
  [Reddit API pricing tiers (xpoz)](https://www.xpoz.ai/blog/guides/reddit-api-pricing-tiers-and-alternatives/),
  [Free Reddit API in 2026 (apiserpent)](https://apiserpent.com/blog/free-reddit-api)

## Work items

Each open gap is a Praxis backlog item, tagged `gap-analysis`:

| Gap | Work item | Gap | Work item |
|---|---|---|---|
| GAP-01 | WI-0037 | GAP-11 | WI-0047 |
| GAP-02 | WI-0038 | GAP-12 | WI-0048 |
| GAP-03 | WI-0039 | GAP-13 | WI-0049 |
| GAP-04 | WI-0040 | GAP-14 | WI-0050 |
| GAP-05 | WI-0041 | GAP-15 | WI-0051 |
| GAP-06 | WI-0042 | GAP-16 | WI-0052 |
| GAP-07 | WI-0043 | GAP-17 | WI-0053 |
| GAP-08 | WI-0044 | GAP-18 | WI-0054 |
| GAP-09 | WI-0045 | GAP-20 | WI-0055 |
| GAP-10 | WI-0046 | GAP-19 | fixed in WI-0036 |
