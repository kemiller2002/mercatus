# Mercatus architecture

## Current architecture

No product code exists yet. The accepted direction (PRD-01, DOMAIN-UI-CONTRACTS):

| Tier | Responsibility | Technology |
|---|---|---|
| 1 Semantic model | types that make illegal states unrepresentable | F# |
| 2 Domain rules | pure `(View, Command, Actor, Grants, Now) -> TransitionResult` | F# |
| 3 Application contracts | queries to views, commands to results, effect coordination | F# |
| 4 Hosts | browser UI (Limen kernel + Forma pages, Folio print documents), GitHub store, Proton, listeners | Limen, Forma, Folio |

## Boundaries that are costly to reverse

- Where personal data is stored (WI-0037); Git history is not erasable.
- The single authority for outbound send state (FND-07, WI-0018).
- The command gateway: agents request transitions and never hold store write credentials (WI-0041).
- The UI never computes legality; it renders `Available` and `Blocked` from Tier 3 (C1).

## Architectural constraints

- Canonical records remain independent of any model vendor or chat.
- Secrets and personal data never enter fixtures, logs or prompts.
- Projections never replace canonical records (EFF-01, C7).
- Screens use Forma; printed and exported documents use Folio (UIR-01).
- Toolchain and UI package versions move only through `conditor upgrade --current`.

## References

- `requirements/` (canonical), `docs/modernization/` (gate, contracts, traceability)
- `docs/ui/UI-INTEGRATION.md` (first-screen layout)
