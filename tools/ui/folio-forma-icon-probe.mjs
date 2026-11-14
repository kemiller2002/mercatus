#!/usr/bin/env node
// Probe: can the installed Folio's Forma icon loader read the installed Forma's icons?
// Evidence for EV-MERCATUS-UI-2026-0001. Read-only; prints a JSON summary.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? process.cwd();
const pkgDir = (name) => join(root, "node_modules", "@echelon-foundry", name);
const versionOf = (name) => JSON.parse(readFileSync(join(pkgDir(name), "package.json"), "utf8")).version;

const { loadIconLibrary } = await import(join(pkgDir("print-components"), "tools", "forma-icons.mjs"));

const formaVersion = versionOf("design-system");
const result = loadIconLibrary({
  pin: { systemId: "forma", version: formaVersion },
  assetsRoot: join(pkgDir("design-system"), "dist", "icons"),
});

const codes = (result.findings ?? []).reduce((acc, f) => ({ ...acc, [f.code]: (acc[f.code] ?? 0) + 1 }), {});

console.log(
  JSON.stringify(
    {
      folio: versionOf("print-components"),
      forma: formaVersion,
      status: result.status,
      reason: result.reason ?? null,
      iconsLoaded: Object.keys(result.icons ?? {}).length,
      findingCodes: codes,
    },
    null,
    2,
  ),
);
