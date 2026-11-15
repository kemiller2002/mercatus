# Mercatus current state

## Repository status

Conditor governs echelon-current 1.39.0: Praxis 3.25.0, Ordo 1.20.0,
Limen 0.9.1, Forma 1.0.1, echelon-theme 1.1.0 and Folio 0.4.1
(WI-0035, DF-MERCATUS-FND-2026-0003). The Tier 1/2 F# domain core for the first slice exists (`src/domain/`,
WI-0013). There is no host, persistence or UI code yet.

## Observed facts

- Scope: the Echelon Sales and Marketing system (DF-MERCATUS-DOM-2026-0001).
- Requirements live in `requirements/`, and every section has a stable ID.
- The domain model audit (WI-0012, `docs/modernization/`) found 27 issues.
  The four that needed owner decisions are resolved. The rest are tracked as
  WI-0013 to WI-0034.
- All 15 workflows are blocked by the modernization gate until the domain
  core exists.
- The requirements evaluation (WI-0036,
  `docs/requirements-evaluation/REQUIREMENTS-EVALUATION-2026-11.md`) added 43
  findings. The largest gaps are outbound compliance, personal data in Git,
  agent security, and missing acceptance criteria for `PRD-25`. They are
  tracked as WI-0037 to WI-0044.
- UI requirements (`requirements/UI-REQUIREMENTS.md`) make Forma and Folio
  mandatory. The modernization gate enforces the static rules. Folio 0.4.1 is
  not yet Forma 1.x aligned (EV-MERCATUS-UI-2026-0001, WI-0045).

- The first slice is defined. PRD-25 is a MUST bound to AC-01..16 and to
  SDP-01..06 (`docs/first-slice/PRD-25-ACCEPTANCE.md`). The transitions for
  its nine aggregates are accepted (`requirements/SLICE-TRANSITIONS.md`,
  DF-MERCATUS-DOM-2026-0002).

## Active work

Implement the Tier 1/2 F# core for the first slice against the accepted
tables (WI-0013, WI-0003). Open owner decisions: WI-0037 (personal-data
placement), WI-0039 and WI-0044. Resolve the critical specification findings (WI-0015, WI-0022,
WI-0025, WI-0029) and first-slice readiness (WI-0037, WI-0038). Then implement the Tier 1/2 F# core for the `PRD-25` vertical slice
(WI-0013, WI-0003).

## Largest decision-relevant unknown

The legal transitions, Lead-to-Opportunity conversion, obligation blocking
and authorization model for the first slice, and where personal data may be
stored (WI-0037).
