import { test } from "node:test";
import assert from "node:assert/strict";
import {
  STYLESHEET_ORDER,
  checkDocumentShell,
  checkFormaNamespace,
  checkFoundationTriggers,
  checkPackageBindings,
  checkPrintSurfaces,
  checkTokenUse,
  isPrintSurface,
  runUiConformance,
} from "./ui-conformance.mjs";

const links = (hrefs) => hrefs.map((h) => `<link rel="stylesheet" href="${h}">`).join("\n");
const formaHrefs = STYLESHEET_ORDER.map((s) => `/node_modules/@echelon-foundry/${s}`);
const page = ({ brand = ' data-forma-brand="echelon"', hrefs = formaHrefs, body = "" } = {}) => ({
  path: "src/app/index.html",
  text: `<!doctype html><html lang="en"${brand}><head>${links(hrefs)}</head><body>${body}</body></html>`,
});

const pkg = (deps = {}, dev = {}) => ({
  dependencies: {
    "@echelon-foundry/design-system": "x",
    "@echelon-foundry/print-components": "y",
    "@echelon-foundry/echelon-theme": "z",
    ...deps,
  },
  devDependencies: dev,
});

const foundations = (forma, folio) => ({ capabilities: { forma: { required: forma }, folio: { required: folio } } });

test("a repository with no UI source and the bindings in place conforms", () => {
  assert.deepEqual(runUiConformance({ files: [], packageJson: pkg(), foundations: foundations(false, false) }), []);
});

test("Forma, Folio and the theme must be runtime dependencies", () => {
  const v = checkPackageBindings({ dependencies: {}, devDependencies: { "@echelon-foundry/design-system": "x" } });
  assert.equal(v.length, 3);
  assert.match(v[0], /design-system must be a pinned runtime dependency/);
});

test("a competing design system is rejected", () => {
  assert.match(checkPackageBindings(pkg({}, { tailwindcss: "4.0.0" }))[0], /'tailwindcss' competes with Forma/);
});

test("a conforming page passes the document shell check", () => {
  assert.deepEqual(checkDocumentShell([page()]), []);
});

test("a page without the Echelon brand attribute fails", () => {
  assert.match(checkDocumentShell([page({ brand: "" })])[0], /data-forma-brand="echelon"/);
});

test("a page missing Forma or loading the theme first fails", () => {
  assert.match(checkDocumentShell([page({ hrefs: formaHrefs.slice(1) })])[0], /does not load design-system\/dist\/all.css/);
  const swapped = [formaHrefs[1], formaHrefs[0], ...formaHrefs.slice(2)];
  assert.match(checkDocumentShell([page({ hrefs: swapped })])[0], /must load in the order/);
});

test("an HTML fragment without <html> is not a page", () => {
  assert.deepEqual(checkDocumentShell([{ path: "src/app/row.html", text: "<tr class=\"forma-table__row\"></tr>" }]), []);
});

test("Forma 0.x names fail in every form", () => {
  const files = [
    { path: "a.html", text: '<div class="ef-record-header"></div>' },
    { path: "b.css", text: ".ef-button { color: var(--ef-color-text); }" },
    { path: "c.html", text: '<html data-ef-brand="echelon"><ef-switch></ef-switch>' },
  ];
  const v = checkFormaNamespace(files);
  ["'ef-record-header'", "'.ef-button'", "'--ef-color-text'", "'data-ef-brand'", "'<ef-switch'"].forEach((n) =>
    assert.ok(v.some((x) => x.includes(n)), `expected a violation for ${n}`),
  );
});

test("Folio's ef-print namespace is exempt and forma- names pass", () => {
  const text = '<ef-print-document><ef-print-section style="--ef-print-space: 1rem" class="forma-stack"></ef-print-section></ef-print-document>';
  assert.deepEqual(checkFormaNamespace([{ path: "r.html", text }]), []);
});

test("words that merely contain ef- are not flagged", () => {
  assert.deepEqual(checkFormaNamespace([{ path: "p.html", text: "<p>The chef-led brief</p>" }]), []);
});

test("raw colors fail in application stylesheets; tokens and comments pass", () => {
  const css = "/* #fff in a comment */ .x { color: var(--forma-color-text); border-color: #d0d0d0; background: rgb(0 0 0); }";
  const v = checkTokenUse([{ path: "src/app/app.css", text: css }]);
  assert.equal(v.length, 2);
  assert.match(v[0], /raw color '#d0d0d0'/);
  assert.match(v[1], /raw color 'rgb\('/);
});

test("raw colors in HTML are left to the document checks", () => {
  assert.deepEqual(checkTokenUse([{ path: "p.html", text: '<p style="color:#000">x</p>' }]), []);
});

test("print layout requires Folio", () => {
  const bare = { path: "src/print/brief.css", text: "@media print { .x { break-inside: avoid; } }" };
  const folio = { path: "src/print/brief.html", text: '<link rel="stylesheet" href="@echelon-foundry/print-components/print.css"><ef-print-document></ef-print-document>' };
  assert.ok(isPrintSurface(bare) && isPrintSurface(folio));
  assert.match(checkPrintSurfaces([bare])[0], /without Folio/);
  assert.deepEqual(checkPrintSurfaces([folio]), []);
});

test("the first UI source makes Forma required and the first print surface makes Folio required", () => {
  const ui = [{ path: "src/app/app.css", text: ".x{}" }];
  const print = [{ path: "src/print/p.css", text: "@page { size: A4; }" }];
  assert.deepEqual(checkFoundationTriggers([], foundations(false, false)), []);
  assert.match(checkFoundationTriggers(ui, foundations(false, false))[0], /forma.required must be true/);
  assert.deepEqual(checkFoundationTriggers(ui, foundations(true, false)), []);
  assert.match(checkFoundationTriggers(print, foundations(true, false))[0], /folio.required must be true/);
  assert.deepEqual(checkFoundationTriggers(print, foundations(true, true)), []);
});

test("non-UI files are ignored by every rule", () => {
  const files = [{ path: "docs/notes.md", text: ".ef-old #fff @media print" }];
  assert.deepEqual(runUiConformance({ files, packageJson: pkg(), foundations: foundations(false, false) }), []);
});
