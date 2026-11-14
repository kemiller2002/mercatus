// Pure Forma/Folio conformance rules for Mercatus UI source (UIR-02..UIR-07,
// requirements/UI-REQUIREMENTS.md; DF-MERCATUS-FND-2026-0003).
//
// Every exported check is a total function from data to a list of violation
// strings. None performs I/O: verify-gate.mjs reads the files and passes them
// in. Each rule runs over the tracked UI source set that inventoryOf counts,
// so a rule can never quietly ignore a file the inventory has counted.

// Forma 1.x is brand-neutral and uses the forma- namespace (FORMA-NS-001).
// Mercatus is an Echelon application, so it loads echelon-theme after Forma,
// in the theme's documented order (Conditor web-package-upgrade-contract).
export const FORMA_PACKAGE = "@echelon-foundry/design-system";
export const FOLIO_PACKAGE = "@echelon-foundry/print-components";
export const THEME_PACKAGE = "@echelon-foundry/echelon-theme";

export const STYLESHEET_ORDER = Object.freeze([
  "design-system/dist/all.css",
  "echelon-theme/dist/echelon.css",
  "echelon-theme/dist/echelon-fonts.css",
  "echelon-theme/dist/echelon-app.css",
]);

export const BRAND = "echelon";

// Folio 0.4.x still registers ef-print-* elements and --ef-print-* properties.
// It has no Forma 1.x namespace release yet (UIX-01, docs/ui/UI-REVIEW.md).
// Those names are Folio's own public API, so they are exempt. Every other
// ef- name is a Forma 0.x leftover and fails.
const FOLIO_LEGACY_NAMES = /(?:--)?ef-print-[a-z0-9-]*/g;
const FORMA_LEGACY_NAME = /(?<![\w-])(?:--|data-|\.|<\/?)?ef-[a-z][a-z0-9-]*/g;

// Design systems that would compete with Forma for tokens, layout and components.
export const COMPETING_DESIGN_SYSTEMS = Object.freeze([
  "bootstrap",
  "tailwindcss",
  "bulma",
  "foundation-sites",
  "@mui/material",
  "@chakra-ui/react",
  "antd",
  "semantic-ui-css",
  "materialize-css",
]);

const isStylesheet = (path) => /\.s?css$/.test(path);
const isDocument = (path) => /\.html?$/.test(path);
export const isUiSource = (path) => /\.html?$|\.s?css$|\.[jt]sx$|\.vue$|\.svelte$/.test(path);
const stripCssComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, "");
const unique = (xs) => [...new Set(xs)];

export const uiFilesOf = (files) => files.filter((f) => isUiSource(f.path));

// A print surface is a file that declares print layout or uses Folio.
export const isPrintSurface = (file) =>
  /@media\s+print|@page\b|<ef-print-|print-components/.test(file.text);

export const checkFormaNamespace = (files) =>
  uiFilesOf(files).flatMap((f) =>
    unique(f.text.replace(FOLIO_LEGACY_NAMES, "").match(FORMA_LEGACY_NAME) ?? []).map(
      (name) => `${f.path}: '${name}' is a Forma 0.x name; Forma 1.x uses forma- (FORMA-NS-001; migrate with tools/NamespaceMigrator)`,
    ),
  );

const linkedStylesheets = (html) =>
  [...html.matchAll(/<link\b[^>]*\brel=["']?stylesheet["']?[^>]*>/gi)]
    .map((m) => /\bhref=["']([^"']+)["']/i.exec(m[0])?.[1] ?? "")
    .filter(Boolean);

const orderViolations = (path, hrefs) => {
  const positions = STYLESHEET_ORDER.map((suffix) => hrefs.findIndex((h) => h.endsWith(suffix)));
  const missing = STYLESHEET_ORDER.filter((_, i) => positions[i] < 0).map(
    (suffix) => `${path}: does not load ${suffix}`,
  );
  const present = positions.filter((p) => p >= 0);
  const ordered = present.every((p, i) => i === 0 || present[i - 1] < p);
  return [
    ...missing,
    ...(ordered ? [] : [`${path}: stylesheets must load in the order ${STYLESHEET_ORDER.join(" -> ")}`]),
  ];
};

// Every HTML document is a Forma page: the Echelon brand on <html> and Forma
// plus echelon-theme in the documented order. A fragment with no <html> is
// exempt.
export const checkDocumentShell = (files) =>
  uiFilesOf(files)
    .filter((f) => isDocument(f.path) && /<html[\s>]/i.test(f.text))
    .flatMap((f) => [
      ...(new RegExp(`<html\\b[^>]*\\bdata-forma-brand=["']${BRAND}["']`, "i").test(f.text)
        ? []
        : [`${f.path}: <html> must declare data-forma-brand="${BRAND}"`]),
      ...orderViolations(f.path, linkedStylesheets(f.text)),
    ]);

// Application stylesheets use Forma semantic tokens (var(--forma-*)), never
// raw color values. Raw values bypass the theme, dark mode and forced colors.
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/g;

export const checkTokenUse = (files) =>
  uiFilesOf(files)
    .filter((f) => isStylesheet(f.path))
    .flatMap((f) =>
      unique(stripCssComments(f.text).match(RAW_COLOR) ?? []).map(
        (value) => `${f.path}: raw color '${value}'; use a Forma semantic token (var(--forma-color-*))`,
      ),
    );

// Printed and exported documents are Folio documents (UIR-06).
export const checkPrintSurfaces = (files) =>
  uiFilesOf(files)
    .filter(isPrintSurface)
    .filter((f) => !/print-components|<ef-print-document\b/.test(f.text))
    .map((f) => `${f.path}: declares print layout without Folio (${FOLIO_PACKAGE} print.css or <ef-print-document>)`);

const dependencyNames = (pkg) =>
  ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"].flatMap((k) =>
    Object.keys(pkg?.[k] ?? {}),
  );

export const checkPackageBindings = (pkg) => {
  const names = new Set(dependencyNames(pkg));
  const runtime = new Set(Object.keys(pkg?.dependencies ?? {}));
  return [
    ...[FORMA_PACKAGE, FOLIO_PACKAGE, THEME_PACKAGE]
      .filter((n) => !runtime.has(n))
      .map((n) => `package.json: ${n} must be a pinned runtime dependency (DF-MERCATUS-FND-2026-0003)`),
    ...COMPETING_DESIGN_SYSTEMS.filter((n) => names.has(n)).map(
      (n) => `package.json: '${n}' competes with Forma; Mercatus UI uses Forma only (UIR-02)`,
    ),
  ];
};

// DF-MERCATUS-FND-2026-0002 restoration triggers, made executable: the first
// UI source makes Forma required, and the first print surface makes Folio
// required, in the same change.
export const checkFoundationTriggers = (files, foundations) => {
  const ui = uiFilesOf(files);
  const caps = foundations?.capabilities ?? {};
  return [
    ...(ui.length && caps.forma?.required !== true
      ? [`.echelon/foundations.json: ${ui.length} UI source file(s) exist, so forma.required must be true (DF-MERCATUS-FND-2026-0002)`]
      : []),
    ...(ui.some(isPrintSurface) && caps.folio?.required !== true
      ? [".echelon/foundations.json: a print surface exists, so folio.required must be true (DF-MERCATUS-FND-2026-0002)"]
      : []),
  ];
};

export const runUiConformance = ({ files, packageJson, foundations }) => [
  ...checkPackageBindings(packageJson),
  ...checkFoundationTriggers(files, foundations),
  ...checkFormaNamespace(files),
  ...checkDocumentShell(files),
  ...checkTokenUse(files),
  ...checkPrintSurfaces(files),
];
