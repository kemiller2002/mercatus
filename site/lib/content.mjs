// Pure content transforms for the Mercatus site. No I/O.
import { posix } from "node:path";
import { Marked } from "marked";

export const REPO_URL = "https://github.com/kemiller2002/mercatus";

export const escapeHtml = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Splits a leading YAML front matter block into simple scalar fields and the body.
export const splitFrontMatter = (text) => {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  const scalar = (line) => /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
  const unquote = (v) => v.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  return m
    ? {
        meta: Object.fromEntries(
          m[1]
            .split(/\r?\n/)
            .filter((l) => !/^\s/.test(l))
            .map(scalar)
            .filter(Boolean)
            .map(([, k, v]) => [k, unquote(v.trim())]),
        ),
        body: text.slice(m[0].length),
      }
    : { meta: {}, body: text };
};

export const firstHeading = (markdown) => /^#\s+(.+?)\s*$/m.exec(markdown)?.[1] ?? null;

export const dropFirstHeading = (markdown) => markdown.replace(/^#\s+.+\r?\n/m, "");

// Folds each "ID: `X`" line into the heading above it as a "{#X}" marker so the heading
// renders with the stable requirement ID as its anchor (DF-MERCATUS-DOM-2026-0001).
export const foldRequirementIds = (markdown) =>
  markdown.replace(/^(#{2,4}\s+.+?)\s*\r?\n(?:\s*\r?\n)*ID: `([A-Z][A-Z0-9]*(?:-[A-Z0-9.]+)+)`[ \t]*$/gm, "$1 {#$2}");

const ID_MARKER = /\s*\{#([A-Z][A-Z0-9]*(?:-[A-Z0-9.]+)+)\}\s*$/;

// Resolves a markdown link written relative to sourcePath.
// pathToUrl: Map<repo path, site url>. Returns the href to emit.
export const resolveHref = (href, sourcePath, pathToUrl) => {
  if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return href;
  const [path, fragment] = href.split("#");
  const repoPath = posix.normalize(posix.join(posix.dirname(sourcePath), decodeURI(path)));
  const suffix = fragment ? `#${fragment}` : "";
  return pathToUrl.has(repoPath)
    ? `${pathToUrl.get(repoPath)}${suffix}`
    : repoPath.startsWith("..")
      ? href
      : `${REPO_URL}/blob/main/${repoPath}${suffix}`;
};

// Returns (markdown) => html for one source file.
// requirementUrl: Map<requirement ID, url with anchor>.
export const markdownRenderer = ({ sourcePath, pathToUrl, requirementUrl }) => {
  const seen = new Map();
  const uniqueSlug = (base) => {
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, text }) {
        const marker = ID_MARKER.exec(text);
        const inner = this.parser.parseInline(tokens).replace(/\s*\{#[^}]*\}\s*$/, "");
        const id = marker ? marker[1] : uniqueSlug(slugify(inner) || "section");
        const badge = marker ? ` <span class="req-id">${escapeHtml(id)}</span>` : "";
        return `<h${depth} id="${escapeHtml(id)}">${inner}${badge} <a class="anchor" href="#${escapeHtml(id)}" aria-label="Link to this section">#</a></h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const target = resolveHref(href, sourcePath, pathToUrl);
        const t = title ? ` title="${escapeHtml(title)}"` : "";
        return `<a href="${escapeHtml(target)}"${t}>${this.parser.parseInline(tokens)}</a>`;
      },
      codespan({ text }) {
        const raw = text.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#39;", "'");
        const url = requirementUrl.get(raw);
        return url ? `<a class="req-ref" href="${escapeHtml(url)}"><code>${text}</code></a>` : `<code>${text}</code>`;
      },
      table(token) {
        const cell = (c, tag) => {
          const align = c.align ? ` style="text-align:${c.align}"` : "";
          return `<${tag}${align}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        };
        const head = `<tr>${token.header.map((c) => cell(c, "th")).join("")}</tr>`;
        const rows = token.rows.map((r) => `<tr>${r.map((c) => cell(c, "td")).join("")}</tr>`).join("\n");
        return `<div class="table-wrap" role="region" tabindex="0" aria-label="Scrollable table"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>\n`;
      },
      html({ text }) {
        return escapeHtml(text);
      },
    },
  });
  return (markdown) => marked.parse(foldRequirementIds(markdown));
};

// ---------------------------------------------------------------------------
// Modernization status projection (docs/modernization/traceability.json).
// Labels never strengthen a state: unmet is "Not met", unexecutable is not "passing".

export const CRITERIA = Object.freeze([
  ["domainModelVerified", "Domain model verified"],
  ["transitionsDefined", "Transitions defined"],
  ["authorizationEnforced", "Authorization enforced"],
  ["rulesTested", "Rules tested"],
  ["formaFollowsContracts", "Forma follows contracts"],
  ["endToEndDemonstrated", "End-to-end demonstrated"],
]);

const LABELS = Object.freeze({
  blocked: "Blocked",
  ready: "Ready",
  open: "Open",
  resolved: "Resolved",
  "not-started": "Not started",
  "in-progress": "In progress",
  done: "Done",
  passing: "Passing",
  "defined-not-executable": "Defined, not yet executable",
  "correct-and-verified": "Correct and verified",
  "correct-but-insufficiently-tested": "Correct but insufficiently tested",
  "incorrect-implementation": "Incorrect implementation",
  "missing-business-behavior": "Missing business behavior",
  "ambiguous-requirement": "Ambiguous requirement",
  "architecture-violation": "Architecture violation",
  "requiring-owner-decision": "Requiring owner decision",
});

export const label = (value) => LABELS[value] ?? (value ? String(value) : "Unknown");

const SEVERITY_ORDER = Object.freeze(["critical", "high", "medium", "low", "info"]);
const bySeverity = (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);

export const statusModel = (doc) => {
  const workflows = doc.workflows.map((w) => ({
    id: w.id,
    name: w.name,
    status: label(w.status),
    statusKey: w.status,
    criteria: CRITERIA.map(([key, name]) => ({ name, met: w.gate?.[key] === true })),
    openFindings: (w.findings ?? []).filter((f) => doc.findings.find((x) => x.id === f)?.status !== "resolved"),
  }));
  const findings = doc.findings.map((f) => ({ ...f, statusLabel: label(f.status ?? "open"), classificationLabel: label(f.classification) }));
  return {
    workflows,
    counts: {
      workflows: workflows.length,
      blocked: workflows.filter((w) => w.statusKey === "blocked").length,
      ready: workflows.filter((w) => w.statusKey === "ready").length,
      openFindings: findings.filter((f) => f.status !== "resolved" && !f.classification.startsWith("correct")).length,
      resolvedFindings: findings.filter((f) => f.status === "resolved").length,
    },
    openFindings: findings.filter((f) => f.status !== "resolved" && !f.classification.startsWith("correct")).sort(bySeverity),
    resolvedFindings: findings.filter((f) => f.status === "resolved"),
    confirmedFindings: findings.filter((f) => f.classification.startsWith("correct")),
    screens: doc.uiContracts.map((u) => ({ ...u, formaLabel: label(u.formaStatus) })),
    checks: doc.verificationChecks.map((c) => ({ ...c, statusLabel: label(c.status) })),
    inventory: doc.implementationInventory,
  };
};
