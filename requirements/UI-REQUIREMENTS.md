# UI Requirements

These requirements govern every Mercatus screen and every printed or exported
document. They implement PRD-01 items 5, 7 and 9, PRD-23, PRD-28 and PRD-31.
The keywords MUST, MUST NOT, SHOULD and MAY are used as in BCP 14
(RFC 2119, RFC 8174).

Sources: `docs/ui/UI-REVIEW.md` (findings UIREV-*),
`docs/requirements-evaluation/REQUIREMENTS-EVALUATION-2026-11.md` (REQ-EVAL-14,
-15, -16, -26, -27, -28, -37), the Visual Engineering context in
`.visual-engineering/`, and the pinned Forma 1.0.1, echelon-theme 1.1.0 and
Folio 0.4.1 packages (DF-MERCATUS-FND-2026-0003). Executable rules are in
`tools/modernization/ui-conformance.mjs`.

Status: proposed by WI-0036. The owner accepts or amends these requirements
through pull-request review.

## 1. Design-system foundation

ID: `UIR-01`

1. Every interactive screen MUST be built with Forma (`@echelon-foundry/design-system`), consumed as the exact release pin that Conditor governs. Forma CSS MUST NOT be copied, forked or vendored.
2. Every printed or exported document MUST be built with Folio (`@echelon-foundry/print-components`), consumed the same way.
3. Mercatus is an Echelon application. It MUST load `@echelon-foundry/echelon-theme` and set `data-forma-brand="echelon"` on `<html>`.
4. Forma, Folio and echelon-theme versions MUST move only through `conditor upgrade --current`, never by hand.
5. The change that adds the first screen MUST set Forma `required: true` in `.echelon/foundations.json`. The change that adds the first printed or exported document MUST do the same for Folio (DF-MERCATUS-FND-2026-0002). The modernization gate enforces both.

## 2. Single design system and namespace

ID: `UIR-02`

1. No other design system or CSS framework MAY be installed: no Bootstrap, Tailwind, Material or similar.
2. Application markup and CSS MUST use only Forma 1.x names: `.forma-*` classes, `--forma-*` properties, `data-forma-*` attributes and `<forma-*>` authoring tags. Forma 0.x `ef-*` names MUST NOT appear.
3. Exception UIX-01: Folio's own `ef-print-*` elements and `--ef-print-*` properties MAY appear, and only in print documents (UIR-06), until Folio publishes a Forma 1.x namespace release (EV-MERCATUS-UI-2026-0001).
4. Application-owned custom properties MUST use the `--mercatus-*` prefix. The application MUST NOT define new `--forma-*` properties.

## 3. Page shell, load order and typography

ID: `UIR-03`

1. Every page MUST load, in this order: Forma `dist/all.css`, echelon-theme `dist/echelon.css`, `dist/echelon-fonts.css`, then `dist/echelon-app.css`.
2. `<html>` MUST declare `lang` and `data-forma-brand="echelon"`.
3. `<body>` MUST declare `data-forma-type="application"`. Dense comparison regions (ledgers, evidence tables, the campaign console, signal triage) MUST use `data-forma-type="dense"` on the region. `data-forma-type` MUST NOT be placed on `<html>`.
4. The accessible large-text role (`data-forma-type="accessible"`), skins and themes MUST be user choices. They MUST NOT be inferred from a diagnosis or profile, and they MUST NOT change semantic meaning or the actions offered.
5. Application stylesheets MUST express colour through Forma semantic tokens. Raw colour values MUST NOT appear.

## 4. Start-up and application identity

ID: `UIR-04`

1. The page that the Limen engine mounts into MUST ship Forma's start-up screen (`.forma-startup` with `.forma-app-identity`, AIS-001) in its initial HTML.
2. The loader MUST set `data-forma-state` to `slow`, `failed` or `timed-out` truthfully, and MUST remove the start-up screen on mount.
3. The page MUST include a no-script message that names JavaScript and WebAssembly as requirements.
4. Start-up progress MUST NOT be fabricated.

## 5. Command presentation and result cases

ID: `UIR-05`

1. The UI MUST render the commands Tier 3 returns as `Available` and `Blocked`, and nothing else. `Blocked` commands MUST stay visible with their reasons. Hidden, disabled, blocked and pending MUST remain distinct states (C1, Forma CAP-001..003).
2. While a command is pending, the invoking control MUST carry `aria-busy="true"` and `aria-disabled="true"`. The engine MUST ignore repeat activation and reuse the same `IdempotencyKey` (C4). A pending form MUST disable its `<fieldset>`.
3. Each `TransitionResult` case MUST use the presentation that `docs/modernization/DOMAIN-UI-CONTRACTS.md` §4A assigns to it, and no other:
   - `Accepted`: a polite status confirmation.
   - `Rejected`: Forma validation summary and messages built from Tier 2 `Violation` values.
   - `Deferred`: an obligation panel listing the blocking obligations.
   - `Conflict`: conflict review with a diff of the changed facts. Reload and Cancel are the only actions.
   - `UnknownExternalEffect`: operation status reading "Not confirmed: reconciling", with a Reconcile action and no resend or retry.
4. Every domain state shown with a status lozenge MUST also carry explicit text. Forma's lozenge has four visual states (`ok`, `attention`, `unknown`, `blocked`). The state-to-lozenge mapping in DOMAIN-UI-CONTRACTS §4A is the only source for that mapping.

## 6. Printed and exported documents (Folio)

ID: `UIR-06`

1. Printed and exported documents MUST be separate print routes or documents built from Folio elements (`ef-print-document`, `-title-page`, `-section`, `-table`, `-metric`, `-finding`, `-toc`, `-page-number` and so on), with Folio `print.css`. Interactive pages MUST NOT load `print.css`, because Folio styles `html` globally.
2. The system MUST provide at least the print contracts PR-01 to PR-07 in DOMAIN-UI-CONTRACTS §4B: opportunity brief, evidence lineage report, decision packet, experiment result report, campaign evaluation, field capture summary, and data-subject access export.
3. Each document MUST be reproducible from a named view schema and its state fingerprint. It MUST show generation time and evidence freshness, and it MUST preserve claim scope and approval state (PRD-30).
4. Each document MUST exclude data classes the recipient is not entitled to see. Source-only metadata MUST NOT leak into the PDF.
5. Meaning MUST survive grayscale printing and disabled backgrounds, and status MUST always be written as text. Wide tables MUST use an authored landscape page.
6. Repeating headers and "Page X of Y" MAY be claimed only for Chromium tiers P1 and P2. Deterministic PDF export MUST block all network access during rendering.
7. Print branding MUST come from a single application-owned print stylesheet that maps Forma and echelon-theme values onto Folio's `--ef-print-*` properties. Forma tokens do not reach Folio by themselves (UIX-01).
8. Forma icons MUST NOT be printed through Folio's `forma-icons` tooling until EV-MERCATUS-UI-2026-0001 is retired. Icons in print MUST always have a text equivalent.

## 7. Accessibility conformance

ID: `UIR-07`

1. The application and its Folio outputs MUST conform to WCAG 2.2 Level AA. This includes 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum), 3.3.7 Redundant Entry and 3.3.8 Accessible Authentication (Minimum).
2. These are the accessibility-critical workflows:
   - UI-02 evidence inspector
   - UI-04 lead qualification
   - UI-05 opportunity blockers
   - UI-07 approval queue
   - UI-09 reply classification
   - UI-12 field capture
3. Each accessibility-critical workflow MUST pass all of the following, and the results MUST be recorded as evidence. A check that was not run is reported as unknown, never as a pass.
   - automated scanning (axe, zero serious or critical issues);
   - keyboard-only completion;
   - screen-reader completion (VoiceOver iOS and NVDA);
   - 400% zoom and 320 CSS px reflow;
   - 200% text and text-spacing overrides;
   - forced colours;
   - reduced motion.
4. Consequential states MUST survive the loss of any single visible channel (hue, icon, border, position, motion). These states are Unknown external effect, Blocked, Restricted or DoNotEngage, Stale evidence, and Conflict. They MUST be declared in a Visual Engineering robustness manifest and checked with its `robustness` command.
5. Every control MUST be reachable by role and accessible name, and every action's completion MUST be observable (Forma machine-operability contract). Coordinate-only, hover-only, pointer-only, colour-only, animation-only and fixed-delay paths MUST NOT be the only way to complete an action. Agents and tests use the same public path as people.

## 8. Information architecture and URL-addressable state

ID: `UIR-08`

1. The screen inventory is UI-01 to UI-13 in DOMAIN-UI-CONTRACTS §4. Each screen MUST be mapped to the PRD-23 questions it answers.
2. Every screen, record, filter, sort, tab, page, period, saved view and approval MUST have a stable, shareable URL that restores the same view after reload, subject to authorization. The URL MUST be produced by `Limen.Routing`, and `.echelon/routes.json` MUST list it.
3. Browser back and forward MUST work.
4. Links in Folio exports MUST resolve to the same URLs.
5. The UI MUST provide a skip link, a visible current location (`aria-current` and a scope trail) and a global search or command palette (EFF-10) that is keyboard-reachable from every screen.
6. Where Forma has no implemented pattern (application shell, breadcrumbs, data-table styling), the UI MUST use the documented substitutes: workspace or navigation shell, scope trail, data grid or dense ledger. The gap MUST be requested from Forma rather than forked locally.

## 9. Epistemic and evidence presentation

ID: `UIR-09`

1. Each epistemic kind in PRD-07 MUST have one consistent label, and MUST be identified by text rather than colour alone. The kinds are observation, claim, evidence, inference, hypothesis, conclusion and agent interpretation.
2. Wherever evidence is shown, the UI MUST show its freshness (current, stale, unknown) and provenance (source, observed and captured times, agent or human).
3. Confidence MUST NOT appear without a link to its evidence.
4. Unknown MUST NOT be shown as failed, partial MUST NOT be shown as complete, and loading MUST NOT be shown as empty. Coverage that is not known MUST be shown as not known.
5. Aggregate percentages or verdicts MUST NOT be invented without a defined aggregation rule (Visual Engineering "Semantic projection").
6. Views MUST support summary-to-lineage progressive disclosure, using Forma's provenance trail, evidence relationship and timeline patterns.

## 10. Approval surface

ID: `UIR-10`

1. An approval request MUST display all of the following:
   - the exact rendered material and its content hash;
   - the diff from the previously approved version;
   - the target, its current eligibility and the basis for it, and the jurisdiction;
   - the evidence and freshness behind each personalised claim;
   - the compliance-check result;
   - the effect that approval authorises.
2. Batch approval MUST create one version-bound Approval per item. It MUST visually separate items whose material differs beyond the declared template variables.
3. The surface MUST support reject-with-reason and edit-and-resubmit. Edit-and-resubmit creates a new version.
4. Approvals MUST be revocable until their effect enters Executing.
5. Approving from a phone MUST meet UIR-07 and MUST require the step-up authentication that WI-0041 defines.

## 11. Human-attention queue

ID: `UIR-11`

1. NeedsMyAttention MUST rank items by a declared, versioned policy. Legal due dates come first, followed by deadline, reversibility, value and risk.
2. Each item MUST show why it is in the queue and what happens if it is ignored.
3. The queue MUST support snooze with a revisit date, which creates an obligation. An item with a legal deadline MUST NOT be snoozed past that deadline.
4. The queue MUST support grouping (EFF-09), and MUST have empty and overflow states.

## 12. States, seams and offline capture

ID: `UIR-12`

1. Every view MUST design its loading, empty, error, success and recovery states.
2. Empty states MUST distinguish "none exist", "none match the filters" and "not loaded or coverage unknown".
3. Faults MUST be presented through Forma's Aegis fault family, never as raw errors.
4. Offline-tolerant capture (UI-12, PRD-28) MUST queue commands with idempotency keys, never local canonical state. Each queued item MUST show truthfully whether it is queued, sent, accepted or rejected on sync.
5. Persistence indicators MUST NOT claim that state was saved before Tier 3 accepted it.

## 13. Mobile composition

ID: `UIR-13`

1. UI-07, UI-09 and UI-12 MUST be designed phone-first. Every other screen MUST remain fully usable at 320 CSS px (PRD-28).
2. Narrow layouts MUST recompose rather than shrink, and MUST keep source, reading and focus order aligned.
3. Primary mobile actions SHOULD use Forma's mobile action bar. Phone-specific forks of Forma patterns MUST NOT be created.

## 14. Lifecycle and workflow diagrams

ID: `UIR-14`

1. Lifecycle diagrams of domain aggregates SHOULD be generated from the accepted Tier 1/2 transition tables, in the portable workflow format, and rendered statically as `.forma-diagram` with a text relations list and the current state marked.
2. A diagram MUST NOT be the source of which commands are available.
3. The runtime `<forma-workflow>` element MUST NOT be adopted until it is in the Registry channel and a screen needs its interactivity. It adds a second WebAssembly runtime.

## 15. UI verification

ID: `UIR-15`

1. The modernization gate MUST enforce the static rules UIR-01 to UIR-03 and UIR-06.1 (`tools/modernization/ui-conformance.mjs`).
2. Once a screen exists, CI MUST also run the following, recording UNKNOWN rather than PASS for anything not run:
   - Forma's TokenValidator, `forma-color validate` and NamespaceMigrator `--check` (excluding print documents);
   - `limen verify --strict` against a live boundary;
   - a Playwright suite per screen at widths 320, 390, 768 and 1280 and at 100% and 200% text, checking overflow, containment, focus visibility, tab sequence and action outcomes, plus axe;
   - the Visual Engineering robustness manifest (UIR-07.4).
3. Each print document MUST have a deterministic PDF test covering page numbers, grayscale and long tokens.
4. CHK-DOK-06 MUST assert that each `TransitionResult` case renders the presentation UIR-05.3 assigns to it.
