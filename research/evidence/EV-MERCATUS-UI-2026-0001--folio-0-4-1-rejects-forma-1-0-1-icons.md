---
id: EV-MERCATUS-UI-2026-0001
title: Folio 0.4.1 cannot load Forma 1.0.1 icons and still uses the retired ef- namespace
research_area: ui-integration
evidence_type: primary
source_title: Reproducible probe against the installed Registry packages
source_author: Mercatus WI-0036
source_uri: tools/ui/folio-forma-icon-probe.mjs
source_date: 2026-11-14
retrieved: 2026-11-14
created_by_agent: claude
confidence: high
supports: []
contradicts: []
related_theories: []
tags: [forma, folio, integration, icons, namespace]
provenance:
  contributions:
    EXE-20261114T101312954Z-4bf1312a:
      operations: [created]
      at: 2026-11-14T10:18:21.740Z
      actor:
        kind: agent
        id: anthropic/claude-code
        provider: anthropic
        model: unknown
        runtime: claude-code
      reason: "Reproducible probe: Folio 0.4.1 rejects Forma 1.0.1 icons"
---

# Evidence Record

## Evidence summary

The Registry channel `echelon-current` 1.39.0 selects Forma 1.0.1 and Folio
0.4.1 together. With both installed from their SHA-256-verified release assets,
Folio's Forma icon loader (`tools/forma-icons.mjs`, `loadIconLibrary`) loads
none of Forma's 80 icons and returns `status: "unavailable"`, with 80
`icon.grammar` findings.

## Exact claim supported or contradicted

Folio 0.4.1 is not yet aligned with the Forma 1.x namespace (FORMA-NS-001).
Specifically:

1. Its icon grammar requires `class="ef-icon__svg"`. Forma 1.0.1 icons use
   `class="forma-icon__svg"`.
2. It registers `ef-print-*` custom elements and styles them with
   `--ef-print-*` properties. `print.css` uses no `--forma-*` token, so
   printed output does not inherit Forma 1.x theme tokens or the Echelon
   theme.

Conditor qualifies both releases, but its compatibility graph has no
Folio-to-Forma edge (`conditor compatibility`), so nothing catches this.

## Source provenance

- `node_modules/@echelon-foundry/print-components` 0.4.1, from
  `https://github.com/kemiller2002/folio/releases/download/v0.4.1/echelon-foundry-print-components-0.4.1.tgz`
  (sha256 `57c6a0ec…aeea1b`, which matches the Registry).
- `node_modules/@echelon-foundry/design-system` 1.0.1, from
  `https://github.com/kemiller2002/forma/releases/download/v1.0.1/echelon-foundry-design-system-1.0.1.tgz`
  (sha256 `db4a8bf7…242056`, which matches the Registry).

## Relevant excerpt or data

```text
$ node tools/ui/folio-forma-icon-probe.mjs
{ "folio": "0.4.1", "forma": "1.0.1", "status": "unavailable",
  "reason": "Bundled icon geometry failed verification.",
  "iconsLoaded": 0, "findingCodes": { "icon.grammar": 80 } }
```

- Folio `tools/forma-icons.mjs` line 24:
  `const svgRoot = /^<svg xmlns=… class="ef-icon__svg" …/`
- Forma `dist/icons/add.svg`: `class="forma-icon__svg"`
- Folio `src/styles/print.css`: 0 occurrences of `--forma-`; 15 distinct
  `--ef-print-*` properties.

## Interpretation

Mercatus can use Folio's print primitives (pagination, sections, headers,
footers, page numbers) with Forma 1.x pages today. It cannot use Folio's
Forma icon tooling (`forma-icons`, `forma-icon-print`). Printed output must
also map Forma tokens onto Folio's `--ef-print-*` properties itself, in a
single application-owned bridge stylesheet, until Folio ships a Forma 1.x
release. This is UIX-01 in `docs/ui/UI-REVIEW.md`.

## Limitations

- The probe exercises the icon path and the namespace only. Print rendering
  (pagination, margin boxes, PDF) was not tested.
- Folio's upstream `main` (2026-10-22) is the source of 0.4.1. A Forma 1.x
  aligned Folio may be in progress elsewhere. This record covers only the
  Registry-selected releases.

## Counterevidence

None found. Folio's own tests pin a Forma 0.x release set, which is why its
CI passes.

## Reproduction or verification notes

`npm ci && node tools/ui/folio-forma-icon-probe.mjs`. If Folio becomes Forma
1.x aligned, the probe will report `status` other than `unavailable` and
`iconsLoaded: 80`. When that happens, retire UIX-01 and the token bridge.
