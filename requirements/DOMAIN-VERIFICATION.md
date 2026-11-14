# Domain Verification and Scenario Test Requirements

The implementation MUST turn the domain requirements into executable tests.

## Required test classes

ID: `DVR-01`

1. State transition tests for every aggregate.
2. Illegal-transition tests.
3. Invariant property tests where practical.
4. Capability/authorization tests.
5. Obligation-blocking tests.
6. Evidence freshness tests.
7. Negative-knowledge tests.
8. Optimistic-concurrency tests.
9. Idempotency tests.
10. External-effect Unknown/reconciliation tests.
11. Provider duplicate-event tests.
12. Approval version/hash invalidation tests.
13. Suppression/unsubscribe race tests.
14. Campaign pause race tests.
15. Entity merge/unmerge provenance tests.
16. Evidence dependency/cycle tests.
17. Projection rebuild/equivalence tests.
18. Agent authority tests.
19. Cost/budget stop tests.
20. Scenario tests corresponding to every scenario in SCENARIOS-AND-EXPANSION.md.

## Architecture tests

ID: `DVR-02`

Tests MUST detect:
- provider types leaking into domain;
- direct provider calls from agents;
- domain mutation bypassing transition functions;
- secrets committed as domain data;
- projections used as canonical write models;
- public claims without required evidence/approval;
- unsupported use of JavaScript where Limen/F# should own application behavior.

## Traceability

ID: `DVR-03`

Every implemented requirement SHOULD be traceable to tests and implementation evidence through Praxis (formerly ROS) and `docs/modernization/traceability.json`. Requirement IDs and test names SHOULD preserve that mapping.
