# Work Queue

| ID | Work | Status | Tags | Priority |
|---|---|---|---|---|
| ROS-INSTALL-3-6-0 | ROS-INSTALL-3-6-0 | complete |  |  |
| WI-0001 | Install current Echelon capabilities (Praxis 3.6.0, Ordo 1.4.0, Visual Engineering 1.0.0, Communication Engineering 1.0.0, Limen 0.7.1) and declare foundations | complete |  | medium |
| WI-0002 | Defer limen-verify workflow until the first application slice | complete |  | medium |
| WI-0003 | Add limen-verify and echelon-foundations workflows with the first application slice | captured | foundations, limen | high |
| WI-0004 | Move mercatus to Praxis 3.7.1 (ROS -> Praxis rename) and Ordo 1.4.0 | complete | praxis, ordo, toolchain | medium |
| WI-0005 | Adopt the Praxis CI batching policy (GH-2) | complete | ci, praxis | medium |
| WI-0006 | Declare Praxis 3.7.1 as the foundations baseline | complete | praxis, foundations | medium |
| WI-0007 | Move mercatus to Ordo 1.4.1 | complete | ordo, toolchain | medium |
| WI-0008 | Move mercatus to Praxis 3.7.2, Ordo 1.4.2, Visual Engineering 1.0.1 and adopt Conditor | complete | praxis, ordo, toolchain | medium |
| WI-0009 | Move mercatus to Ordo 1.5.0 via echelon-current 1.2.0 (conditor upgrade --current) | complete |  | medium |
| WI-0010 | Upgrade Limen 0.7.1 -> 0.9.0; declare the Limen boundary not yet applicable and restore limen-verify | complete |  | medium |
| WI-0011 | Declare Aegis, Forma and Folio not yet applicable and run foundations verify in CI | complete |  | medium |
| WI-0012 | Domain model and workflow validation gate before Forma modernization | complete | modernization, domain, ordo | high |
| WI-0013 | FND-01: Implement the Tier 1/2 F# semantic core for the first vertical slice (no domain implementation exists) | captured | modernization, domain-audit | high |
| WI-0014 | FND-02: Assign stable requirement IDs to canonical requirements (owner decision) | complete | modernization, domain-audit | medium |
| WI-0015 | FND-03: Specify explicit transition tables for every aggregate in DOMAIN-STATE-MODEL | captured | modernization, domain-audit | high |
| WI-0016 | FND-04/05: Reconcile MarketHypothesis and ProblemHypothesis lifecycles (Revisit vs Reopened, PRD 4 vs DSM 2) | captured | modernization, domain-audit | medium |
| WI-0017 | FND-06: Reconcile Campaign and CampaignTarget lifecycles between PRD, INT and DSM | captured | modernization, domain-audit | low |
| WI-0018 | FND-07: Establish a single authority for outbound send state (CampaignTarget vs OutreachMessage vs ExternalEffect) | captured | modernization, domain-audit | high |
| WI-0019 | FND-08: Define ExternalEffect Unknown vs ReconciliationRequired and OutreachMessage DeliveryUnknown semantics | captured | modernization, domain-audit | medium |
| WI-0020 | FND-09: Owner decision on removing DoNotContact/Reachable from Contact lifecycle in favour of CommunicationEligibility | complete | modernization, domain-audit | high |
| WI-0021 | FND-10: Owner decision on Organization DoNotEngage precedence over contact eligibility | complete | modernization, domain-audit | medium |
| WI-0022 | FND-11: Define Lead-to-Opportunity conversion and the relationship between Lead and Opportunity qualification | captured | modernization, domain-audit | high |
| WI-0023 | FND-12: Define Opportunity Lost vs Rejected, regression transitions and the Outcome model required for Won | captured | modernization, domain-audit | medium |
| WI-0024 | FND-13: Add or remove Failed experiment state (DSM 14 invariant references failed experiments) | captured | modernization, domain-audit | low |
| WI-0025 | FND-14: Specify blocking-obligation semantics (which obligation kinds block which transitions) | captured | modernization, domain-audit | high |
| WI-0026 | FND-15: Decide evidence freshness representation (stored Stale state vs effective-current projection) | captured | modernization, domain-audit | medium |
| WI-0027 | FND-16: Complete Claim lifecycle and define published-asset behaviour when a claim becomes stale | captured | modernization, domain-audit | medium |
| WI-0028 | FND-17: Define Approval Requested vs Pending, Consumed scope, and CampaignTarget approval-state duplication | captured | modernization, domain-audit | medium |
| WI-0029 | FND-18: Define the authorization model (actors, roles, capability grants, agent transition permissions) | captured | modernization, domain-audit | high |
| WI-0030 | FND-19: Define the persistence contract, aggregate ownership and atomicity boundaries for GitHub-backed storage | captured | modernization, domain-audit | high |
| WI-0031 | FND-20: Classify PRD 3 entities without a model as aggregates or value objects | captured | modernization, domain-audit | medium |
| WI-0032 | FND-21: Owner decision: reconcile the template project charter/handoff with the Sales and Marketing product scope | complete | modernization, domain-audit | high |
| WI-0033 | FND-22: Identify the authoritative Ordo playbook (no artifact of that name exists in Ordo) | captured | modernization, domain-audit | low |
| WI-0034 | FND-23/24: Define first-contact approval scope and the targets of CampaignTarget.Converted and Signal.ConvertedToWork | captured | modernization, domain-audit | medium |
| WI-0035 | Deploy the Mercatus project site to GitHub Pages | active | site, pages | high |
| WI-0036 | Requirements completeness review: identify what is missing | active | requirements, review | high |
| WI-0037 | GAP-01: Decide the private data store and erasure model (personal data must not go in the public code repository) | captured | requirements, gap-analysis | high |
| WI-0038 | GAP-02: Define legal outreach and personal-data requirements per target jurisdiction | captured | requirements, gap-analysis | high |
| WI-0039 | GAP-03: Decide the host/runtime tier (workers, scheduler, webhook inbox, agent runtime) | captured | requirements, gap-analysis | high |
| WI-0040 | GAP-04: Define human users, sign-in and human roles | captured | requirements, gap-analysis | high |
| WI-0041 | GAP-05: Verify provider capabilities (Proton, Reddit, LinkedIn, X, Meta) against official documentation and choose the email provider | captured | requirements, gap-analysis | high |
| WI-0042 | GAP-06: Specify secrets and credential management | captured | requirements, gap-analysis | high |
| WI-0043 | GAP-07: Require untrusted-content isolation for agents and a global emergency stop | captured | requirements, gap-analysis | high |
| WI-0044 | GAP-08: Fold the later commercial concepts (PCR, CLS, CPR, RDC) into the domain model | captured | requirements, gap-analysis | high |
| WI-0045 | GAP-09: Choose one canonical definition for concepts defined several ways (Claim, roles, triggers, proof levels, lifecycles) | captured | requirements, gap-analysis | high |
| WI-0046 | GAP-10: Owner decision on whether Mercatus manages engagement delivery; move PCR-24 to HelixNote | captured | requirements, gap-analysis | medium |
| WI-0047 | GAP-11: Establish one authoritative build order (PRD-25 vs IMP-06 vs INT-21) | captured | requirements, gap-analysis | high |
| WI-0048 | GAP-12: Map requirements to releases (slice 1, slice 2, later) | captured | requirements, gap-analysis | high |
| WI-0049 | GAP-13: Add acceptance criteria and provisional policy values for slice-1 requirements | captured | requirements, gap-analysis | high |
| WI-0050 | GAP-14: Specify non-functional requirements (performance, scale, availability, backup, devices, offline, language) | captured | requirements, gap-analysis | medium |
| WI-0051 | GAP-15: Specify how people are notified of approvals, follow-ups, Unknown effects and budget breaches | captured | requirements, gap-analysis | medium |
| WI-0052 | GAP-16: Define integration boundaries for calendar, revenue/accounting, website consent and initial data import | captured | requirements, gap-analysis | medium |
| WI-0053 | GAP-17: Assign an automation posture to each workflow (EFF-13) | captured | requirements, gap-analysis | medium |
| WI-0054 | GAP-18: Mark each requirement document as system requirement or commercial operating practice | captured | requirements, gap-analysis | low |
| WI-0055 | GAP-20: Trace SCN, PCR-34 and PGS scenarios to domain rules and planned tests | captured | requirements, gap-analysis | medium |
