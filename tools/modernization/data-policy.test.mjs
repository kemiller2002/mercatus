import { test } from "node:test";
import assert from "node:assert/strict";
import { checkFixtures, isFixture } from "./data-policy.mjs";

const json = (path, value) => ({ path, text: JSON.stringify(value) });

test("only fixture data files are in scope", () => {
  assert.ok(isFixture("tests/App.Engine.Tests/fixtures/slice.json"));
  assert.ok(isFixture("fixtures/orgs.csv"));
  assert.ok(!isFixture("src/engine/Lead.fs"));
  assert.ok(!isFixture("docs/fixtures-guide.md"));
  assert.deepEqual(checkFixtures([{ path: "README.md", text: "mail jane@realcorp.com" }]), []);
});

test("a synthetic fixture with reserved domains and fictional phones passes", () => {
  const f = json("fixtures/slice.json", {
    synthetic: true,
    organizations: [{ name: "Northwind Assay", site: "https://northwind.example" }],
    contacts: [{ email: "ada@northwind.example", phone: "+1 (312) 555-0142" }, { email: "ops@example.com", mobile: "312-555-0199" }],
  });
  assert.deepEqual(checkFixtures([f]), []);
});

test("fixtures must be marked synthetic", () => {
  assert.match(checkFixtures([json("fixtures/a.json", { orgs: [] })])[0], /not marked synthetic/);
  assert.match(checkFixtures([{ path: "fixtures/a.csv", text: "name\nNorthwind" }])[0], /not marked synthetic/);
  assert.deepEqual(checkFixtures([{ path: "fixtures/a.csv", text: "# SYNTHETIC\nname\nNorthwind" }]), []);
  assert.match(checkFixtures([{ path: "fixtures/bad.json", text: "{not json" }])[0], /not marked synthetic/);
});

test("real-looking emails, URL hosts and phone numbers are rejected", () => {
  const f = json("fixtures/leak.json", {
    synthetic: true,
    contact: { email: "jane.doe@acme.com", phone: "+1 312 867 5309" },
    source: "https://www.reddit.com/r/devops/comments/abc",
  });
  const v = checkFixtures([f]);
  assert.ok(v.some((x) => /email 'jane.doe@acme.com'/.test(x)));
  assert.ok(v.some((x) => /URL host 'www.reddit.com'/.test(x)));
  assert.ok(v.some((x) => /phone '\+1 312 867 5309'/.test(x)));
});

test("lookalike domains do not count as reserved", () => {
  const v = checkFixtures([json("fixtures/x.json", { synthetic: true, email: "a@example.com.evil.io", site: "https://notexample.com" })]);
  assert.equal(v.length, 2);
});
