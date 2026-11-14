# Product Requirements

## 1. Governing requirements

ID: `PRD-01`

1. The system MUST follow Praxis (formerly ROS) for requirements, work decomposition, evidence, execution tracking, traceability, agent activity, cost, completion criteria, handoffs, and release readiness.
2. The system MUST follow SDE/Ordo. Important domain objects MUST expose explicit state, legal transitions, invariants, capabilities, obligations, evidence requirements, policy, version checks, history, and explicit external effects.
3. Illegal states SHOULD be unrepresentable where practical.
4. Agents MUST request legal transitions rather than arbitrarily mutate domain state.
5. The browser application MUST use Limen. HTML/CSS remain native rendering surfaces, application state and logic reside in the F#/WASM boundary, and JavaScript is minimized to necessary browser interop/event dispatch.
6. Domain and application logic SHOULD be F# unless a documented technical constraint justifies an exception.
7. The system MUST apply Visual Engineering to UI decisions and Communication Engineering to user-facing and externally published communication.
8. Evolution SHOULD be incremental and compatibility-preserving. Breaking changes require an explicit migration.
9. The browser UI MUST use Forma (with the Echelon theme), and printed or exported documents MUST use Folio, as specified in `requirements/UI-REQUIREMENTS.md` (UIR-01 to UIR-15).

## 2. Purpose

ID: `PRD-02`

The system MUST help Echelon:
- discover markets and problems;
- test market, problem, ICP, positioning, message, channel, and offer hypotheses;
- identify and qualify organizations and contacts;
- build and preserve relationships;
- create and govern marketing assets;
- execute campaigns and outreach;
- support sales conversations;
- develop opportunities;
- understand wins and losses;
- measure cost and commercial effectiveness;
- discover adjacent opportunities and potential pivots;
- learn from positive, negative, contradictory, and absent evidence.

The system MUST distinguish activity, output, engagement, evidence, opportunity, revenue, and learning.

## 3. Core domain

ID: `PRD-03`

Initial first-class entities:
MarketHypothesis, ICP, ProblemHypothesis, Organization, Contact, Relationship, Lead, Opportunity, Offering, Campaign, CampaignTarget, Experiment, Message, Asset, Interaction, Conversation, Observation, Evidence, Source, CustomerLanguage, Competitor, Alternative, Outcome, Decision, Obligation, AgentActivity, Metric, ChannelPolicy, ExternalEffect.

This is a discovery model and MAY evolve through evidence.

## 4. Market hypotheses

ID: `PRD-04`

A MarketHypothesis MUST support market/segment, organization characteristics, geography, buyer roles, users, problems, pressures, technology environment, ability to pay, urgency, alternatives, buying triggers, assumptions, supporting evidence, contradictory evidence, confidence, and state.

Suggested lifecycle:
Proposed -> Researching -> Testing -> Supported / Weak / Rejected -> Revisit.

The system MUST permit competing hypotheses and MUST NOT assume the current market remains correct.

## 5. Problem hypotheses

ID: `PRD-05`

Problems MUST be modeled independently from solutions.

A ProblemHypothesis SHOULD capture affected customer/role, current process, impact, frequency, severity, economic/operational consequence, workaround, alternatives, evidence, missing evidence, assumptions, and confidence.

Research MUST seek disconfirming evidence, not merely confirmation.

## 6. ICP

ID: `PRD-06`

An ICP is a versioned hypothesis, not static segmentation.

It MAY include industry, revenue, employees, technical complexity, maturity, AI adoption, modernization activity, regulation, decision structure, pain, budget, triggers, exclusions, and buyer characteristics.

Won and lost opportunities SHOULD be compared against ICP assumptions.

## 7. Evidence

ID: `PRD-07`

Evidence is first-class.

Every meaningful claim SHOULD be able to retain source, date, type, subject, claim, reliability, confidence, original material/reference, interpretation, and contradictory evidence.

The system MUST distinguish:
- observation;
- external claim;
- evidence;
- inference;
- hypothesis;
- conclusion;
- agent interpretation.

The system MUST answer "Why do we believe this?"

Negative results MUST be retained.

## 8. Organizations, contacts, and relationships

ID: `PRD-08`

Organizations MUST be first-class and MAY include industry, size, locations, leadership, business units, technology, initiatives, acquisitions, hiring, public statements, AI/modernization activity, known problems, vendors, relationships, and interaction history.

Contacts MUST remain independent from organizations and MAY include role, responsibilities, relationship, relationship strength, interests, priorities, problems, influence, buying role, preferred channel, and communication history.

Relationships MUST preserve history rather than reducing a person to a current CRM stage.

## 9. Lead discovery and qualification

ID: `PRD-09`

Lead discovery MAY use market research, announcements, news, hiring, conferences, referrals, inbound content, website engagement, public technical activity, business changes, and other legitimate public signals.

A lead MUST retain source, time, relevance, evidence, associated hypothesis, and confidence.

"An agent found a company" MUST NOT equal "qualified."

Qualification SHOULD consider problem fit, capability fit, urgency, economic value, authority, willingness, timing, access, strategic relevance, competitive position, and relationship. Uncertainty MUST be representable. Opaque single-number AI scoring is insufficient.

## 10. Opportunities and obligations

ID: `PRD-10`

Suggested opportunity states:
Discovered, Researching, Engaging, ProblemConfirmed, Qualified, Exploring, Proposal, Negotiation, Won, Lost, Dormant, Rejected.

Transitions MUST be evidence based.

Opportunities SHOULD expose unresolved obligations such as:
- identify decision maker;
- identify economic buyer;
- confirm problem;
- establish next interaction;
- test value hypothesis;
- resolve risk;
- understand procurement.

The UI SHOULD answer what unresolved work prevents advancement.

## 11. Campaigns and experiments

ID: `PRD-11`

A Campaign MUST include objective, target market, ICP, accounts/roles, problem hypothesis, message hypothesis, offer, channels, assets, duration, cost, expected outcome, success/failure criteria, stopping criteria, evidence, and results.

Campaign states MAY include Draft, ReadyForReview, Approved, Active, Paused, Completed, Evaluated.

CampaignTarget MUST be an explicit entity rather than a recipient list.

Experiments MUST remain distinct from campaign execution and SHOULD include hypothesis, independent variable, expected signal, audience, measurement, duration/sample target, stopping rules, interpretation rules, result, and learning.

## 12. Messaging and content

ID: `PRD-12`

The system MUST support message testing across market, role, problem, technical sophistication, maturity, trigger, offering, and channel.

Content assets MAY include articles, posts, videos, diagrams, presentations, case studies, frameworks, demos, conference material, whitepapers, landing pages, emails, and sales collateral.

Assets SHOULD link to ICP, role, problem, campaign, message, evidence, channel, and results.

A canonical asset MAY have channel-specific variants. Variants MUST remain traceable to the source asset.

AI-generated public content MUST be reviewable where policy requires.

## 13. Distribution and outreach

ID: `PRD-13`

Channels MAY include website, email, LinkedIn, Reddit, X, Meta/Facebook, video, conferences, groups, direct outreach, and referrals.

The system SHOULD support account/contact briefs, conversation starters, draft outreach, follow-up, meeting preparation, discovery questions, and recommended next moves.

Personalization MUST be evidence-grounded. The system MUST NOT fabricate familiarity or unsupported claims.

Initial first contact requires human approval.

## 14. Conversations, response, and learning

ID: `PRD-14`

Sales conversations SHOULD capture questions, problems, evidence, objections, commitments, unknowns, stakeholders, decision process, and next steps.

Responses MAY be classified as Interested, NotInterested, Referral, WrongPerson, FollowUpLater, Question, MeetingRequested, Unsubscribe, OutOfOffice, InvalidAddress, Unknown.

Agents MAY suggest classification, but source material and confidence MUST be preserved.

Conversations MAY update or contradict market, problem, ICP, message, and opportunity hypotheses.

## 15. Win/loss

ID: `PRD-15`

The system SHOULD preserve why an organization considered acting, acted, did not act, won, lost, selected alternatives, objected to message/pricing/timing, or lacked trust/access/fit.

Losses remain learning artifacts.

## 16. Metrics and economics

ID: `PRD-16`

Leading measures MAY include researched target accounts, validated problems, relevant conversations, response rates, relationship growth, qualified opportunities, and experiment evidence.

Lagging measures MAY include proposals, wins, revenue, margin, acquisition cost, sales cycle, and lifetime value.

Activity MUST NOT substitute for outcomes.

Costs SHOULD include human time, model/API spend, data, advertising, content, conferences, and software.

The system SHOULD calculate cost per meaningful conversation, qualified opportunity, customer, campaign, and channel where evidence permits.

Agent activity SHOULD retain agent, task, model, tokens/cost where available, duration, artifact, evidence, and downstream outcome.

## 17. Decision support and Clarity

ID: `PRD-17`

Recommendations SHOULD expose evidence, assumptions, uncertainty, benefits, risks, alternatives, and unresolved questions.

Clarity MAY be used for market selection, account prioritization, campaigns, opportunities, proposals, and experiments when useful. It SHOULD NOT be mechanically forced into every decision.

## 18. Agents

ID: `PRD-18`

Initial/specialized roles MAY include:
Researcher, Strategist, ExperimentDesigner, AccountAnalyst, ContentStrategist, ContentProducer, SalesAnalyst, LearningAgent, MarketListener, ProblemMiner, CustomerLanguageAnalyst, CompetitorMonitor, OpportunityScout, ContentOpportunityAgent, EngagementAgent.

Each agent MUST have bounded purpose, allowed inputs/actions, forbidden actions, outputs, capabilities, transition permissions, and escalation conditions.

Agent roles are independent of model/provider selection.

## 19. Knowledge

ID: `PRD-19`

The knowledge system SHOULD structure markets, customer language, problems, objections, competitors, alternatives, successful/failed messages, campaigns, experiments, account patterns, win/loss information, conversations, and evidence.

It MUST NOT treat an unstructured document/vector store as canonical truth.

## 20. Exploration and pivot discovery

ID: `PRD-20`

The system MUST support exploration as well as exploitation.

It SHOULD ask whether Echelon is pursuing the correct market at all and support investigation of emerging problems, underserved markets, technology shifts, declining demand, adjacent opportunities, unexpected responses, and transferable capabilities.

It MAY recommend investigation of a pivot. It MUST NOT silently pivot strategy.

## 21. Website and attribution

ID: `PRD-21`

The website SHOULD become part of the commercial system, supporting source/attribution, content interaction, calls to action, conversions, and return visits under explicit privacy rules.

Attribution SHOULD support multiple touches. The final interaction MUST NOT automatically be treated as causal.

## 22. Privacy, security, and audit

ID: `PRD-22`

The system MUST collect only legitimate, relevant information.

Credentials MUST NOT be stored in source-controlled domain data.

Capabilities SHOULD use least privilege.

Important actions MUST retain actor, previous/resulting state, requested transition, evidence, policy, timestamp, and external effect.

More consequential and less reversible actions SHOULD require stronger evidence and/or approval.

## 23. UX

ID: `PRD-23`

The application SHOULD make it easy to answer:
- What markets are we testing?
- What do we currently believe?
- Why do we believe it?
- What contradicts it?
- What evidence is new?
- Which accounts are interesting and why?
- Which opportunities are active?
- What is blocking them?
- What experiments are running?
- What worked or failed?
- What should we investigate next?
- What requires approval?
- Where should human time be spent?

## 24. Anti-requirements

ID: `PRD-24`

The system is NOT:
- a Salesforce clone;
- a generic CRM;
- a mass-email spam engine;
- an AI content mill;
- a social scheduler without strategy;
- an opaque lead-scoring engine;
- disconnected autonomous agents;
- a vector database presented as knowledge;
- a vanity-metric dashboard;
- an autonomous public representative without controls.

## 25. Initial vertical slice

ID: `PRD-25`

The first complete vertical slice SHOULD be:

MarketHypothesis -> ProblemHypothesis -> Organization discovery -> Observation/Evidence -> Lead -> Qualification -> Opportunity -> Outcome -> Learning.

It MUST exercise Praxis, Ordo (SDE), Limen, F#, states, transitions, evidence, obligations, policies, capabilities, audit, and agent boundaries before broad automation is added.


## 26. Commercial signal and memory requirements

ID: `PRD-26`

### 26.1 Signals

ID: `PRD-26.1`

The system MUST model a Signal separately from Observation and Evidence. A signal is a candidate indication that commercial conditions may have changed and requires interpretation before it can affect strategy.

Signals MAY include executive changes, acquisitions, hiring patterns, AI initiatives, technology migrations, production incidents, public complaints, regulatory changes, procurement activity, conference appearances, funding, product launches, organizational restructuring, and repeated customer-language patterns.

A signal SHOULD retain source observations, time window, affected organizations/markets/problems, confidence, interpretation status, expiry/staleness rules, and resulting obligations.

A signal MUST NOT automatically become a lead, opportunity, or market conclusion.

### 26.2 Commercial memory

ID: `PRD-26.2`

The system MUST retain prior experiments, campaigns, messages, offers, hypotheses, outcomes, failures, negative evidence, and contextual conditions so agents can determine whether substantially equivalent work has already been attempted.

Before proposing a repeated experiment, an agent SHOULD identify the prior attempt and explain what material condition has changed.

### 26.3 Evidence freshness

ID: `PRD-26.3`

Evidence SHOULD support effective-current projections. The system MUST be able to distinguish historically true evidence from evidence believed to remain currently applicable.

Stale evidence MUST NOT silently satisfy current transition requirements.

### 26.4 Negative knowledge

ID: `PRD-26.4`

The system MUST represent relevant searches or investigations that found no expected evidence when that absence is meaningful. Negative knowledge SHOULD retain scope, method, time, source set, expected finding, and expiry conditions.

Absence of evidence MUST NOT automatically be interpreted as evidence of absence.

### 26.5 Unknown external effects

ID: `PRD-26.5`

When an external operation may have occurred but confirmation is unavailable, the system MUST preserve an Unknown effect state and create a reconciliation obligation. It MUST NOT blindly retry a potentially non-idempotent operation.

## 27. GitHub-backed persistence requirements

ID: `PRD-27`

GitHub is the initial durable store, but domain semantics MUST remain independent of Git.

The persistence design MUST address:
- concurrent edits;
- optimistic version checks;
- merge conflicts;
- atomicity boundaries;
- immutable history;
- schema/version migration;
- large-history growth;
- repository API limits;
- partial writes;
- retries;
- corruption detection;
- recovery;
- indexing/projections for responsive UI;
- separation of secrets from commercial state.

Git commit success MUST NOT be confused with successful external commercial effects.

## 28. Mobile requirements

ID: `PRD-28`

The Limen application MUST be usable from a phone for core field workflows.

Mobile workflows SHOULD include:
- reviewing/approving outreach;
- recording conversation notes;
- capturing observations/evidence;
- creating follow-up obligations;
- checking opportunity blockers;
- reviewing campaign state;
- classifying replies;
- capturing conference/event contacts and context.

The design MUST follow current Visual Engineering accessibility and responsive-layout requirements.

## 29. Conference and field mode

ID: `PRD-29`

The system SHOULD support an event/conference mode optimized for rapid capture.

It SHOULD permit pre-event target research, introductions/meeting requests, on-site conversation/evidence capture, contact context, accessibility notes relevant to interaction logistics, follow-up obligations, post-event personalized outreach, conversion tracking, and event-level learning.

## 30. Claim governance

ID: `PRD-30`

Externally published factual and outcome claims MUST retain supporting evidence and an approval state.

The system SHOULD identify unsupported, stale, contradictory, or over-generalized claims before publication.

Agents MUST NOT convert internal hypotheses, estimates, or research conclusions into public facts without evidence and policy authorization.

## 31. Accessibility

ID: `PRD-31`

Accessibility is a system requirement rather than a late UI audit.

The application MUST support keyboard operation, semantic structure, visible focus, appropriate target sizing, zoom/reflow, reduced motion, non-color-only communication, accessible validation/errors, assistive-technology semantics, and contrast/readability requirements defined by Visual Engineering.

Accessibility-critical workflows MUST be included in acceptance testing.

The conformance target is WCAG 2.2 Level AA for the application and its printed or exported documents. The accessibility-critical workflows and their acceptance checks are defined in `UIR-07`.


## 32. Requirements discovered through scenario analysis

ID: `PRD-32`

The following additional concepts are required or strongly indicated by scenario analysis and MUST be treated as part of the design backlog:

- ResearchBudget and bounded research execution;
- ResearchQueue and progressive enrichment;
- TriageDecision;
- canonical identity and ExternalIdentity aliases;
- reversible MergeDecision;
- time-bounded PersonRole / OrganizationAffiliation;
- CommunicationEligibility independent of Contact state;
- evidence dependency/lineage graph and cycle detection;
- WorkClaim/lease for parallel agents;
- content-hash/version-scoped approvals;
- deferred/future obligations with eligibility recheck;
- provider capability registry and integration-health projection;
- rate-budget/backpressure for provider APIs;
- data classification and redaction/removal workflow;
- storage abstraction, archive/export, and migration path beyond GitHub;
- OfferingHypothesis and OfferingFit;
- operational/business capacity signals capable of pacing campaigns;
- jurisdiction-aware channel/outreach policy;
- recommendation-change provenance;
- retrospective classification of decision failures;
- simulation/dry-run and replay that cannot repeat external effects.

These concepts SHOULD be promoted to first-class aggregates/value objects only when doing so improves invariant enforcement or independent lifecycle management. The implementation MUST avoid entity proliferation for data that can safely remain a value object.
