# Mercatus current state

## Repository status

Praxis 3.7.2, Ordo 1.5.0 and Limen 0.9.0 are installed. There is no
application code yet.

## Observed facts

- Scope: the Echelon Sales and Marketing system (DF-MERCATUS-DOM-2026-0001).
- Requirements live in `requirements/`, and every section has a stable ID.
- The domain model audit (WI-0012, `docs/modernization/`) found 27 issues.
  The four that needed owner decisions are resolved. The rest are tracked as
  WI-0013 to WI-0034.
- All 15 workflows are blocked by the modernization gate until the domain
  core exists.

## Active work

Resolve the critical specification findings (WI-0015, WI-0022, WI-0025,
WI-0029). Then implement the Tier 1/2 F# core for the `PRD-25` vertical slice
(WI-0013, WI-0003).

## Largest decision-relevant unknown

The legal transitions, Lead-to-Opportunity conversion, obligation blocking
and authorization model for the first slice.
