# Mercatus known risks

Updated 2026-11-14 (WI-0048) from the requirements evaluation
(`docs/requirements-evaluation/REQUIREMENTS-EVALUATION-2026-11.md`) and the UI
review (`docs/ui/UI-REVIEW.md`).

| Risk | Likelihood | Impact | Mitigation | Tracked by |
|---|---|---|---|---|
| Personal data is committed to Git history and cannot be erased | Medium | High | Synthetic fixtures only until the placement decision; data classes | WI-0037 (REQ-EVAL-01, -07) |
| Outbound messages breach anti-spam or privacy law | Low until Gate B | High | Charter excludes real sending until WF-09 passes; compliance requirements | WI-0039, WI-0040 |
| Ingested external text steers an agent (prompt injection) | Medium | High | Treat ingested content as data; command gateway; injection tests | WI-0041 |
| Provider terms forbid the planned use (Reddit approval, LinkedIn automation) | Medium | Medium | Provider terms assessment before each integration | WI-0042 |
| The first slice starts without a definition of done | Medium | Medium | Numbered PRD-25 acceptance criteria | WI-0038 |
| Folio and Forma diverge (namespace, icons, tokens) | High (today) | Medium | Separate print pages, token bridge, icon ban; upstream request | WI-0045, EV-MERCATUS-UI-2026-0001 |
| Documentation drifts from implementation | Medium | High | Modernization gate (inventory honesty, traceability, UI conformance) in CI | CHK-GATE |
| Process overhead exceeds decision value | Medium | Medium | Smallest process that preserves correctness; batch CI | AGENTS.md |
