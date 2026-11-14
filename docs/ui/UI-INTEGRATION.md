# Mercatus UI Integration: Forma, Folio, Echelon theme and Limen

- **Work items:** WI-0035 (bindings), WI-0036 (contract and gate)
- **Date:** 2026-11-14
- **Decision:** DF-MERCATUS-FND-2026-0003
- **Requirements:** `requirements/UI-REQUIREMENTS.md` (UIR-01 to UIR-15)

This guide is the integration contract for the first screen (WI-0003 and
WI-0013). Everything in section 1 is already in place. Sections 2 to 5
describe what the first screen and the first print document must add.

## 1. What is installed and governed now

| Package | Pin (exact) | Governed by | Foundations |
|---|---|---|---|
| `@echelon-foundry/design-system` (Forma) 1.0.1 | GitHub release asset `forma/releases/download/v1.0.1/…-1.0.1.tgz` | Conditor (`conditor.json`) | `forma` 1.0.1, `required: false` |
| `@echelon-foundry/echelon-theme` 1.1.0 | GitHub release asset `echelon-design-system/releases/download/v1.1.0/…-1.1.0.tgz` | Conditor (optional component) | not a capability |
| `@echelon-foundry/print-components` (Folio) 0.4.1 | GitHub release asset `folio/releases/download/v0.4.1/…-0.4.1.tgz` | Conditor | `folio` 0.4.1, `required: false` |
| `@echelon-foundry/limen` 0.9.1 | npm `0.9.1` | Conditor | `limen` 0.9.1, `required: true` (boundary not yet applicable) |

Each tarball's SHA-256 was checked against the Registry channel
`echelon-current` 1.39.0 (`.conditor/authority/resolved-release-set.json`).

**Upgrades:** run `conditor upgrade --current --check --resolved-set <set>
--resolved-set-sha256 <sha>`, review the plan, then authorize its digest.
Never run `npm install` against these packages by hand.

**Running Conditor in a cloud session:** run it with `GH_TOKEN` and
`GITHUB_TOKEN` unset. Conditor sends any token it finds as a GitHub auth
header, which overrides the session proxy's own credentials.

**Enforced now** by `node tools/modernization/verify-gate.mjs` in CI
(`tools/modernization/ui-conformance.mjs`):

- the three packages are runtime dependencies, and there is no competing
  design system;
- no Forma 0.x `ef-` names (Folio's `ef-print-*` is exempt);
- every HTML document sets `data-forma-brand="echelon"` and loads the
  stylesheets in order;
- no raw colours in application CSS;
- print layout only through Folio;
- the first UI file requires `forma.required: true`, and the first print
  surface requires `folio.required: true`.

## 2. Target layout for the first slice

Conditor's `fsharp-limen-web` scaffold cannot be applied in place. Mercatus
is an adopted repository, `upgrade` refuses a new `scaffold` field, and `init`
refuses the four files that already exist. The first slice therefore builds
the scaffold's layout by hand, following Conditor's templates
(`src/Conditor.Core/Scaffolding.fs`):

```text
App.slnx
src/engine/            F# engine (Tier 1–3), Aegis bound, Limen.Routing routes
src/kernel/            Limen kernel + Forma pages
  index.html           the mount page (section 3)
  print/<doc>.html     one Folio document per print contract (section 4)
  styles/app.css       --mercatus-* tokens and layout only, no raw colours
  styles/print-bridge.css   the only place Forma values reach Folio
tests/App.Engine.Tests/
tests/browser/         Playwright (CHK-UI-02, CHK-UI-05)
.echelon/routes.json   echelon.routes/v1, hash mode (UIR-08)
```

The same change must:

1. Replace `limen.config.json`'s `notApplicable` with the real boundary
   (`{"engine": ["src/engine"], "kernel": ["src/kernel"]}`) and supersede
   DF-MERCATUS-FND-2026-0001.
2. Set `forma.required: true`, add the `routing` capability, add
   `limen-fsharp` 0.9.0 and Aegis 1.0.0 to `conditor.json`, and supersede
   DF-MERCATUS-FND-2026-0002. The gate fails if the first UI file lands
   without the Forma change.
3. Set the screen's `formaStatus`, only after its workflows' contract
   criteria are true in `traceability.json`.

## 3. Mount page shell (UIR-03, UIR-04)

```html
<!doctype html>
<html lang="en" data-forma-brand="echelon">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mercatus</title>
  <link rel="stylesheet" href="/node_modules/@echelon-foundry/design-system/dist/all.css">
  <link rel="stylesheet" href="/node_modules/@echelon-foundry/echelon-theme/dist/echelon.css">
  <link rel="stylesheet" href="/node_modules/@echelon-foundry/echelon-theme/dist/echelon-fonts.css">
  <link rel="stylesheet" href="/node_modules/@echelon-foundry/echelon-theme/dist/echelon-app.css">
  <link rel="stylesheet" href="/styles/app.css">
</head>
<body data-forma-type="application">
  <a class="forma-skip-link" href="#main">Skip to main content</a>
  <!-- AIS-001: present in the initial HTML; the loader sets data-forma-state
       (slow | failed | timed-out) and removes it on mount. Never fake progress. -->
  <section class="forma-startup" role="status" aria-live="polite">
    <div class="forma-app-identity"><!-- inline SVG mark (currentColor) + "Mercatus" --></div>
    <p>Starting Mercatus…</p>
  </section>
  <noscript>Mercatus needs JavaScript and WebAssembly to run.</noscript>
  <main id="main"></main>
</body>
</html>
```

Copy exact class structures from the pinned Forma patterns in
`node_modules/@echelon-foundry/design-system/patterns/`
(`startup.html`, `app-identity.html`, `record-header.html`,
`obligation-panel.html`, `operation-status.html`, `conflict-review.html`,
`data-grid.html`, `dense-ledger.html`). §4A and §4C of
`docs/modernization/DOMAIN-UI-CONTRACTS.md` map each screen and each result
case to its pattern.

## 4. Print documents (UIR-06)

Folio styles `html` globally and is still in the `ef-` namespace (UIX-01).
Print documents therefore get their own pages. They load Folio's `print.css`
and never Forma's `all.css`; the gate enforces both:

```html
<!doctype html>
<html lang="en" data-forma-brand="echelon">
<head>
  <meta charset="utf-8">
  <title>Opportunity brief</title>
  <link rel="stylesheet" href="/node_modules/@echelon-foundry/echelon-theme/dist/echelon-fonts.css">
  <link rel="stylesheet" href="/node_modules/@echelon-foundry/print-components/src/styles/print.css">
  <link rel="stylesheet" href="/styles/print-bridge.css">
  <script type="module" src="/node_modules/@echelon-foundry/print-components/src/components/register.js"></script>
</head>
<body>
  <ef-print-document>
    <ef-print-title-page>…</ef-print-title-page>
    <ef-print-section>…</ef-print-section>
  </ef-print-document>
</body>
</html>
```

`print-bridge.css` is the single place where Forma and theme values reach
Folio. It loads Forma's `tokens.css` for the custom properties only:

```css
@import url("/node_modules/@echelon-foundry/design-system/dist/tokens.css");
:root {
  --ef-print-text: var(--forma-color-text-primary);
  --ef-print-muted: var(--forma-color-text-secondary);
  --ef-print-rule: var(--forma-color-border-functional);
  --ef-print-accent: var(--forma-color-accent-primary);
  --ef-print-surface: var(--forma-color-surface-secondary);
}
```

Print rules:

- Status is always written as text.
- Meaning must survive grayscale printing.
- Wide tables use a landscape named page.
- "Page X of Y" is claimed only for Chromium P1/P2.
- Deterministic PDF uses Folio's offline printer with the network blocked.
- No Forma icons through Folio's `forma-icons` tooling until
  `npm run probe:folio-forma` reports `iconsLoaded: 80`.

## 5. Verification to add with the first screen (WI-0047)

| Check | Tool |
|---|---|
| CHK-UI-01 (now) | `node tools/modernization/verify-gate.mjs`, `npm run test:modernization` |
| Token, colour and namespace | Forma `tools/TokenValidator` (.NET 10), `npx forma-color validate`, `tools/NamespaceMigrator -- --check` (print pages excluded) |
| CHK-UI-02 | Playwright 1.63.0 with `@echelon-foundry/forma-conformance` (widths 320/390/768/1280, 100%/200% text, overflow, containment, focus, tab order, action outcome) plus `@axe-core/playwright` |
| CHK-UI-03 | `npx @echelon-foundry/visual-engineering robustness --manifest visual-robustness.json` |
| CHK-UI-04 | `npx @echelon-foundry/limen@<installed> verify --strict` and `limen wasm-check` |
| CHK-UI-05 | Folio deterministic PDF tests (page numbers, grayscale, long tokens) |

Anything not run is reported as UNKNOWN, never as PASS.
