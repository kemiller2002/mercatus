# Mercatus UI Review (Forma and Folio)

- **Work item:** WI-0036
- **Date:** 2026-11-14
- **Status:** complete for the planned UI. Mercatus has no rendered UI yet, so
  this review covers the screen contracts, requirements and pinned packages,
  not built pages.
- **Outputs:** `requirements/UI-REQUIREMENTS.md` (UIR-01 to UIR-15), the
  revised `docs/modernization/DOMAIN-UI-CONTRACTS.md` (C9–C13, §4A–§4C,
  CHK-UI-*), `tools/modernization/ui-conformance.mjs`, and
  EV-MERCATUS-UI-2026-0001.

## 1. What was reviewed

| Input | Version |
|---|---|
| Screen contracts UI-01 to UI-13 and rules C1–C8 | `docs/modernization/DOMAIN-UI-CONTRACTS.md` (WI-0012) |
| UX requirements | PRD-01, PRD-07, PRD-10, PRD-13, PRD-23, PRD-28, PRD-29, PRD-30, PRD-31, EFF-01, EFF-09, EFF-10, EFF-11, SCN-09, SCN-10, SCN-33 |
| Forma | `@echelon-foundry/design-system` 1.0.1 (installed package, catalog, accessibility, Ordo/Limen and machine-operability contracts) |
| Echelon theme | `@echelon-foundry/echelon-theme` 1.1.0 |
| Folio | `@echelon-foundry/print-components` 0.4.1 (installed package, `AGENT-USAGE.md`, `print.css`, icon tooling) |
| Limen | 0.9.1 (boundary, routing, lifecycle CLI) |
| Conditor | `fsharp-limen-web` scaffold and the web-package upgrade contract |
| Visual Engineering | context 1.0.1, source commit `b648cdef291d39c443ccb10215529ad69afe8b32` |

**Method.** Each screen was read against the Visual Engineering decision
checklist (primary task, first glance, deliberate verification,
authoritative state, consequential states and their failure boundary). It was
then read against Forma's catalog and contracts and Folio's print rules.
Package claims were checked against the installed release bytes, not the
newer upstream branches. The one runtime claim (icon compatibility) was
reproduced by executing it (`tools/ui/folio-forma-icon-probe.mjs`).

## 2. Findings

Severity is the impact if the first screens were built without the fix.
"Applied" means fixed in this branch. A work item means the fix needs
upstream action or the first screen.

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| UIREV-01 | critical | Forma and Folio were not required anywhere in `requirements/`. Nothing stopped a screen being built with another framework, or a report being built without Folio. | Applied: PRD-01.9, UIR-01, UIR-02. Gate rule `checkPackageBindings`. |
| UIREV-02 | critical | The baseline was Forma 0.4.1. Forma 1.0 renamed `ef-` to `forma-` and moved the Echelon brand into echelon-theme. Screens written against 0.4.1 would need a codemod migration, and drift reported the pin below the supported range. | Applied: WI-0035 moved the pin to 1.0.1 plus theme 1.1.0. Gate rule `checkFormaNamespace`. |
| UIREV-03 | high | No WCAG level was set, and no accessibility-critical workflow was named, although PRD-31 requires acceptance testing of such workflows. | Applied: PRD-31 (WCAG 2.2 AA), UIR-07. |
| UIREV-04 | high | Result presentation (C5) named the cases but not their patterns or text. Forma's lozenge has four states, so domain states would be collapsed. That is a Visual Engineering "semantic projection" anti-pattern. | Applied: DOMAIN-UI-CONTRACTS §4A, UIR-05, C10. |
| UIREV-05 | high | There were no print or export contracts, although proof assets, decision packets, diagnostic reports and access exports are required (PCR, CEX, PGS, PRD-30). | Applied: §4B PR-01 to PR-07, UIR-06, Folio gate (`checkFolioGate`). |
| UIREV-06 | high | **UIX-01: Folio 0.4.1 is not Forma 1.x aligned.** It uses `ef-print-*` names, its `--ef-print-*` tokens ignore Forma and the theme, and its icon loader rejects all 80 Forma 1.0.1 icons. Its `print.css` also styles `html` globally. | Applied: separate print routes, a single token-bridge stylesheet, an icon ban and a scoped `ef-print` exemption (UIR-02.3, UIR-06). Upstream: WI-0045. Evidence: EV-MERCATUS-UI-2026-0001. |
| UIREV-07 | high | No URL-addressable state was required. Deep links, sharing, reload and the links in Folio exports depend on it. | Applied: UIR-08, C12, CHK-UI-04. |
| UIREV-08 | high | The approval surface was unspecified. EFF-09 grouping conflicts with DSM-19 version binding, and the approver could not see eligibility, evidence or the diff. | Applied: UIR-10. Mobile step-up depends on WI-0041. |
| UIREV-09 | medium | There was no start-up or WebAssembly-load presentation, so a slow load would show a blank page. | Applied: UIR-04 (AIS-001). |
| UIREV-10 | medium | There was no pending-action presentation, although C4 requires idempotency. Double submission was likely. | Applied: UIR-05.2, C11. |
| UIREV-11 | medium | There were no empty, loading, error or offline states. UI-12 said "offline-tolerant" without the truth of the queue being shown. | Applied: UIR-12. |
| UIREV-12 | medium | No density or typography role was set per screen. Forma's default role is the marketing scale (h1 up to 7.25rem), which is wrong for operations screens. | Applied: UIR-03.3, §4C "Type role". |
| UIREV-13 | medium | Agents are first-class actors (C6), yet there was no machine-operability rule. | Applied: UIR-07.5, C13. |
| UIREV-14 | medium | Epistemic kinds, freshness and provenance had no presentation rule. | Applied: UIR-09. |
| UIREV-15 | medium | The human-attention queue had no ranking, explanation or snooze rule. | Applied: UIR-11. |
| UIREV-16 | medium | Forma's P0 application shell, breadcrumbs and data-table styling are not implemented. Dashboard grid, split pane and operation status reflow on the viewport, not the container. | Applied: substitutes in UIR-08.6 and §4C. Upstream: WI-0046. |
| UIREV-17 | medium | No conformance tooling was in the verification checks. | Applied: CHK-UI-01 runs now. CHK-UI-02 to -05 are defined. Adoption: WI-0047. |
| UIREV-18 | low | Lifecycle diagrams were unplanned. forma-workflow 2.0.0 adds a second WebAssembly runtime and is not in the Registry channel. | Applied: UIR-14 (static rendering only). |
| UIREV-19 | low | Folio 0.4.1 declares `engines.node >=24 <25`, while the repository CI and the Conditor scaffold use Node 22. `npm ci` warns with EBADENGINE. | Recorded: WI-0045. Choose the Node line when the first print document is built. |
| UIREV-20 | low | `@echelon-foundry/forma-conformance` and Visual Engineering's `UI-LAYOUT-INTERACTION` contract are referenced by Forma but are not in the Registry channel or the local VE context. | Recorded: WI-0047. Treat as external references until registered. |

## 3. Screen-by-screen review

| UI | Primary task (first glance) | Deliberate verification | Consequential states and failure boundary | Review result |
|---|---|---|---|---|
| UI-01 Belief board | What do we believe, and how strongly? | Evidence behind each belief, and its contradictions | Stale evidence; Reopened. Text plus lozenge plus freshness, so it survives losing hue | OK with UIR-09 and UIR-14. Columns must not encode state by colour. |
| UI-02 Evidence inspector | Is this evidence current, and where did it come from? | Full lineage, contradictions, agent vs human | Stale, Contested, Superseded. Each needs text (single-channel risk) | Accessibility-critical (UIR-07). Use the dense type role for the lineage table. |
| UI-03 Organization & contact | Can we engage this account? | Restriction source, including inheritance | Restricted or DoNotEngage must lead the panel. Lifting is gated by capability | OK. The eligibility panel comes before permissions (§4C). |
| UI-04 Lead qualification | What is missing to qualify? | Evidence per dimension | Blocked `Qualify` must stay visible with its reasons | OK with UIR-05.1. Accessibility-critical. |
| UI-05 Opportunity & blockers | What blocks advancement? | Each obligation and its owner | Deferred, Conflict | OK with §4A. Accessibility-critical. Must remain usable on a phone (PRD-28). |
| UI-06 Experiment board | What is running, and what did we learn? | Interpretation vs result | Stopped vs Completed | OK. The lane board must not rely on column position alone. |
| UI-07 Approval queue | What needs my approval now? | Exact content, hash and diff | Scope mismatch, Revoked | Highest risk. Phone-first, step-up authentication, one approval per item (UIR-10). |
| UI-08 Outreach status | Did it send? | Effect reconciliation | Unknown is never shown as failed, and no resend is offered | OK with §4A. Single source of truth: FND-07. |
| UI-09 Reply classification | What is this reply? | Agent suggestion vs confirmation | Unsubscribe applies immediately | Phone-first, accessibility-critical. |
| UI-10 Campaign console | Is the campaign healthy? | Per-target state | Paused vs Cancelled | Dense role. Pagination, not virtualisation (A11Y-053). |
| UI-11 Signal triage | Which signals matter? | Source and relevance | Not relevant vs Converted | Dense role. Collection toolbar and filter summary. |
| UI-12 Field capture | Capture fast, and lose nothing | Sync outcome per item | Queued, sent, accepted or rejected on sync | Phone-first, accessibility-critical. The offline queue must be truthful (UIR-12.4). |
| UI-13 Next actions | Where should my time go? | Why each item is listed | A legal deadline cannot be snoozed past due | Needs a ranking policy (UIR-11). |

## 4. What the contracts already did well (kept)

- C1 (the UI never computes legality) matches Forma ORDO-001..005 and Visual
  Engineering "semantic projection".
- `UnknownExternalEffect` is never shown as failure, and no resend is offered.
  This matches `.forma-operation-status` and the anti-pattern list.
- `Conflict` shows the changed facts (`.forma-conflict-review`), and
  `Deferred` lists obligations (`.forma-obligation-panel`).
- The gate that blocks Forma work until a workflow's contracts are verified
  now also covers Folio (`checkFolioGate`).

## 5. Visual Engineering handoff report

- **Context:** Visual Engineering 1.0.1, source commit `b648cdef291d39c443ccb10215529ad69afe8b32`. `visual-engineering verify` passed.
- **Principles applied:**
  - semantic projection (no strengthened certainty, legality from the authority);
  - semantic channel survivability (text on every state, robustness manifest);
  - hierarchy and density by task (type roles);
  - responsive recomposition (phone-first screens);
  - accessibility as architecture (WCAG 2.2 AA, named critical workflows);
  - application-polish seams (UIR-12);
  - machine operability.
- **Verification performed:**
  - static conformance rules, run in CI with 15 tests;
  - the Folio/Forma icon probe;
  - package bytes verified against Registry SHA-256.
- **Not performed (unknown, not pass):** no rendering, keyboard, zoom, forced-colour, screen-reader, robustness or print-PDF verification. Nothing renders yet. These are CHK-UI-02 to -05.
- **Deviations:** the `ef-print-*` exemption (UIX-01) is a justified, time-bound deviation from UIR-02. It is retired by WI-0045.
- **Semantic-projection assumptions:** Tier 3 `Available`/`Blocked` and the ExternalEffect projection are the authorities for actions and send state (FND-07). The UI reads them and never derives them.
- **Open questions:**
  - the owner's acceptance of WCAG 2.2 AA and the accessibility-critical list;
  - Node 22 vs 24 for print CI;
  - whether forma-workflow's runtime element is ever wanted.
