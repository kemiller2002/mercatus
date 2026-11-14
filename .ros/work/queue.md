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
| WI-0035 | Install Conditor locally, repair the Conditor lock drift and move mercatus to echelon-current 1.39.0 (Praxis, Ordo, Limen, Forma, Folio, echelon-theme) | complete |  | medium |
| WI-0036 | Evaluate all requirements, research Forma/Folio/Limen integration, and review the UI contracts so Mercatus screens use Forma and Folio | complete |  | medium |
| WI-0037 | REQ-EVAL-01/07/20/21/35: Decide personal-data placement (crypto-shredding or deletable store), data classes, separate access-controlled commercial store, GitHub limits and backup/RPO before any real personal data is written | captured | requirements-evaluation,privacy,persistence | high |
| WI-0038 | REQ-EVAL-03: Rewrite PRD-25 as a MUST with numbered acceptance criteria, a synthetic-data policy and a LearningRecord definition (first-slice readiness checklist) | captured | requirements-evaluation,first-slice | high |
| WI-0039 | REQ-EVAL-02/04/05/13/23/24/25/36/38/39: Outbound compliance gate B: lawful basis and consent provenance on DSM-07A, message content and opt-out SLA, unsubscribe scope and lifting rule (owner amendment of DF-MERCATUS-DOM-2026-0001), jurisdiction default-deny, deliverability, endorsements, AI disclosure | captured | requirements-evaluation,compliance,owner-decision | high |
| WI-0040 | REQ-EVAL-06/34: Data-subject-rights workflow, retention schedule and compliance ownership (controller, LIA, DPIA, ROPA) | captured | requirements-evaluation,privacy,compliance | high |
| WI-0041 | REQ-EVAL-08/09/10/22: Agent security: untrusted ingested content and prompt-injection tests, command gateway (agents never hold store write credentials), human authentication and step-up, secrets management | captured | requirements-evaluation,security | high |
| WI-0042 | REQ-EVAL-11/12: Provider terms assessment (Reddit approval and deletion sync, LinkedIn manual assist) and Proton Mail Bridge realities (Message-ID reconciliation, no Delivered state) | captured | requirements-evaluation,integration | high |
| WI-0043 | REQ-EVAL-17/18/30: Extend DOMAIN-VERIFICATION test classes, add non-functional targets, and make traceability cover every normative requirement (64 of 302 today) | captured | requirements-evaluation,verification | medium |
| WI-0044 | REQ-EVAL-19/29/31/32/33/41/42/43 and FND-21 reopen: Normative framework (BCP 14, document status, precedence, glossary, concept ownership), implementation-order reconciliation, operating mode, time semantics, budget defaults, stale template context/handoff text | captured | requirements-evaluation,editorial,owner-decision | medium |
| WI-0045 | UIX-01: Request a Forma 1.x aligned Folio release (forma- namespace, Forma icon grammar, Forma tokens, Node 22/24 engines) and then retire the print token bridge and the ef-print exemption (EV-MERCATUS-UI-2026-0001) | captured | ui,folio,forma,upstream | high |
| WI-0046 | UIREV: Raise Forma consumer gap requests for the unimplemented P0 patterns Mercatus needs (application shell, breadcrumbs, data-table styling, tag/chip, inline message) and container-based reflow for dashboard grid, split pane and operation status | captured | ui,forma,upstream | medium |
| WI-0047 | UIREV: Adopt Forma/VE browser conformance tooling with the first screen: TokenValidator, forma-color, NamespaceMigrator --check, forma-conformance Playwright suite, axe, VE robustness manifest, Folio PDF tests (CHK-UI-02..05) | captured | ui,verification | medium |
| WI-0048 | Editorial: replace stale template context (research queue, decisions, risks, architecture, handoff header) with the Sales and Marketing scope; fix audit count, LEG-01 target and IMP-08 evidence (REQ-EVAL-31; non-decision part of WI-0044) | complete | editorial,context | medium |
| WI-0049 | Traceability coverage report and ratchet in the modernization gate: count traced vs untraced requirement IDs and fail on regression (REQ-EVAL-30; first part of WI-0043) | ready | verification,traceability | medium |
| WI-0050 | Scheduled Conditor drift advisory in CI against echelon-registry, failing when a pin falls below the supported range | ready | ci,conditor,toolchain | medium |
