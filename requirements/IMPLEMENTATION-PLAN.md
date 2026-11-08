# Implementation Plan

## Parallel workstreams

ID: `IMP-01`

The repository SHOULD use spare execution capacity to pressure-test the architecture in parallel while preserving contract-first development.

Workstreams:
1. Canonical integration contracts
2. Provider simulator and contract test harness
3. Proton adapter
4. Reddit listener
5. Observation/evidence engine
6. Customer-language system
7. Campaign domain/state machine
8. Content asset and channel-variant system
9. Channel policy engine
10. External-effect journal
11. Integration inbox
12. Commercial evidence model
13. Opportunity bridge
14. Metrics and learning
15. Agent roles/capabilities
16. Research source connectors
17. Limen UI shell
18. GitHub persistence/concurrency layer
19. Audit/replay tooling
20. Privacy/compliance
21. Campaign experimentation
22. Competitive intelligence
23. Conference mode
24. Relationship graph
25. Website integration
26. Content-to-outreach bridge

## Contract-first rule

ID: `IMP-02`

Interfaces/contracts SHOULD be defined before provider implementations.

A provider simulator SHOULD be built early so the complete commercial workflow can be exercised without credentials, API limits, or provider availability.

Every real provider SHOULD pass common contract tests plus provider-specific tests.

## Commercial knowledge graph

ID: `IMP-03`

The domain SHOULD behave as a graph even if the physical store is not a graph database.

Accounts, contacts, markets, problems, campaigns, observations, evidence, assets, conversations, relationships, and opportunities SHOULD be traversable through explicit relationships.

## Signal engine

ID: `IMP-04`

External events SHOULD create candidate signals, not automatic conclusions.

Signals MAY include executive changes, hiring changes, acquisitions, AI initiatives, product launches, repeated complaints, regulatory changes, conference activity, and other relevant events.

Signals MAY create obligations to investigate.

## Commercial memory

ID: `IMP-05`

The system MUST retain what was tried, what worked, what failed, why, and under what conditions.

Agents SHOULD be able to discover prior experiments and negative results before proposing substantially equivalent work.

## Recommended construction sequence

ID: `IMP-06`

1. Install/verify governing repository capabilities.
2. Normalize requirements into ROS work.
3. Define domain invariants and state models.
4. Define Integration.Contracts.
5. Build provider simulator.
6. Implement first end-to-end vertical slice.
7. Implement Proton.
8. Implement Observation/Evidence.
9. Implement Reddit listening.
10. Implement CustomerLanguage.
11. Implement campaign/policy/effect/inbox capabilities.
12. Implement Limen decision surfaces.
13. Implement learning and opportunity bridge.
14. Add additional providers only after the contract is proven.

## Architectural attack workstream

ID: `IMP-07`

At least one workstream SHOULD continuously challenge:
- GitHub persistence assumptions;
- concurrency;
- idempotency;
- SDE transition completeness;
- unknown external effects;
- stale evidence;
- provider differences;
- privacy boundaries;
- agent authority;
- recovery after partial failure;
- replay/auditability;
- whether a proposed abstraction is actually provider-neutral.

The purpose is to find where the architecture fails before production usage does.


## Deferred bootstrap requirement

ID: `IMP-08`

### REQ-BOOTSTRAP-001: Repository capability self-bootstrap

ID: `REQ-BOOTSTRAP-001`

Status: Deferred.

The repository MUST eventually provide a supported, repeatable mechanism that can install or upgrade ROS, SDE/Ordo, Visual Engineering, and Communication Engineering from a clean checkout and commit or otherwise materialize their managed repository artifacts safely.

Acceptance criteria:
- installs the repository's pinned/current approved capability versions;
- verifies each capability independently;
- preserves generated GitHub workflow files;
- does not require an Action to grant itself unsupported `GITHUB_TOKEN` permissions;
- handles GitHub's restriction on workflows creating or modifying workflow files;
- is idempotent;
- fails at the exact capability/step responsible for an error;
- does not hide failures with permissive shell handling;
- documents the bootstrap path for a new repository and an upgrade path for an existing repository;
- can be exercised by an automated validation test without mutating production state unexpectedly.

Current evidence: ROS 3.1.4 installation and verification completed successfully in the diagnostic Action, but committing the generated ROS workflow from that Action was rejected by GitHub. A subsequent attempt to add a `workflows: write` permission demonstrated that this is not a valid `GITHUB_TOKEN` workflow permission. This requirement is intentionally deferred so capability installation does not block product development.

Until REQ-BOOTSTRAP-001 is implemented, repository capability upgrades MAY be performed through an authorized development environment or repository tooling that has the necessary permission to create/update workflow files.
