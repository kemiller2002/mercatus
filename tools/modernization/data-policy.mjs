// Pure synthetic-data rules for fixtures (WI-0051; proposed SDP-01..SDP-06 in
// docs/proposals/PRD-25-ACCEPTANCE.md; REQ-EVAL-01). Every exported check is a
// total function from data to violation strings. verify-gate.mjs reads the
// files.
//
// Until the owner decides where personal data may live (WI-0037), the only
// data the repository may hold about people and organizations is synthetic.
// Git history cannot be erased, so these checks run before anything is
// committed, not after.

// RFC 2606 / RFC 6761 reserved names: they can never belong to a real party.
const RESERVED_DOMAIN = /(^|\.)(example\.(com|org|net)|example|test|invalid|localhost)$/i;

// NANP numbers 555-0100..555-0199 are reserved for fiction.
const FICTIONAL_PHONE = /^\+?1?[\s.-]*\(?\d{3}\)?[\s.-]*555[\s.-]*01\d\d$/;

const PHONE_KEY = /^(phone|telephone|tel|mobile|cell|fax)(number)?$/i;

export const isFixture = (path) => /(^|\/)fixtures?\//.test(path) && /\.(json|jsonl|csv|ya?ml|md|txt)$/.test(path);

const emailsIn = (text) => [...text.matchAll(/[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)/g)].map((m) => [m[0], m[1]]);
const urlHostsIn = (text) => [...text.matchAll(/https?:\/\/([A-Za-z0-9.-]+)/g)].map((m) => m[1]);

const isSyntheticJson = (text) => {
  try {
    const v = JSON.parse(text);
    return v !== null && typeof v === "object" && !Array.isArray(v) && v.synthetic === true;
  } catch {
    return false;
  }
};

const isSyntheticLines = (text) => text.split(/\r?\n/).some((l) => /\bsynthetic:\s*true\b|\bSYNTHETIC\b/.test(l));

const jsonLeaves = (value, key = "") =>
  Array.isArray(value)
    ? value.flatMap((v) => jsonLeaves(v, key))
    : value !== null && typeof value === "object"
      ? Object.entries(value).flatMap(([k, v]) => jsonLeaves(v, k))
      : [[key, value]];

const phonesIn = (path, text) => {
  if (!/\.json$/.test(path)) return [];
  try {
    return jsonLeaves(JSON.parse(text))
      .filter(([k, v]) => PHONE_KEY.test(k) && typeof v === "string")
      .map(([, v]) => v);
  } catch {
    return [];
  }
};

export const checkFixtures = (files) =>
  files
    .filter((f) => isFixture(f.path))
    .flatMap((f) => [
      ...((/\.json$/.test(f.path) ? isSyntheticJson(f.text) : isSyntheticLines(f.text))
        ? []
        : [`${f.path}: fixture is not marked synthetic (JSON: top-level "synthetic": true; other files: a "synthetic: true" or SYNTHETIC line)`]),
      ...emailsIn(f.text)
        .filter(([, domain]) => !RESERVED_DOMAIN.test(domain))
        .map(([email]) => `${f.path}: email '${email}' does not use a reserved domain (example.com/.org/.net, .example, .test, .invalid)`),
      ...urlHostsIn(f.text)
        .filter((host) => !RESERVED_DOMAIN.test(host))
        .map((host) => `${f.path}: URL host '${host}' is not a reserved domain`),
      ...phonesIn(f.path, f.text)
        .filter((p) => !FICTIONAL_PHONE.test(p.trim()))
        .map((p) => `${f.path}: phone '${p}' is not in the fictional 555-0100..0199 range`),
    ]);
