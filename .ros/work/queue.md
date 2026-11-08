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
| WI-0014 | FND-02: Assign stable requirement IDs to canonical requirements (owner decision) | ready | modernization, domain-audit | medium |
| WI-0015 | FND-03: Specify explicit transition tables for every aggregate in DOMAIN-STATE-MODEL | captured | modernization, domain-audit | high |
| WI-0016 | FND-04/05: Reconcile MarketHypothesis and ProblemHypothesis lifecycles (Revisit vs Reopened, PRD 4 vs DSM 2) | captured | modernization, domain-audit | medium |
| WI-0017 | FND-06: Reconcile Campaign and CampaignTarget lifecycles between PRD, INT and DSM | captured | modernization, domain-audit | low |
| WI-0018 | FND-07: Establish a single authority for outbound send state (CampaignTarget vs OutreachMessage vs ExternalEffect) | captured | modernization, domain-audit | high |
| WI-0019 | FND-08: Define ExternalEffect Unknown vs ReconciliationRequired and OutreachMessage DeliveryUnknown semantics | captured | modernization, domain-audit | medium |
| WI-0020 | FND-09: Owner decision on removing DoNotContact/Reachable from Contact lifecycle in favour of CommunicationEligibility | ready | modernization, domain-audit | high |
| WI-0021 | FND-10: Owner decision on Organization DoNotEngage precedence over contact eligibility | ready | modernization, domain-audit | medium |
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
| WI-0032 | FND-21: Owner decision: reconcile the template project charter/handoff with the Sales and Marketing product scope | ready | modernization, domain-audit | high |
| WI-0033 | FND-22: Identify the authoritative Ordo playbook (no artifact of that name exists in Ordo) | captured | modernization, domain-audit | low |
| WI-0034 | FND-23/24: Define first-contact approval scope and the targets of CampaignTarget.Converted and Signal.ConvertedToWork | captured | modernization, domain-audit | medium |
