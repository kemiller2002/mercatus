import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { checkDomainPurity, checkDomainReferences, runArchitecture } from "./architecture.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("a domain project with no references passes", () => {
  assert.deepEqual(checkDomainReferences([{ path: "src/domain/D.fsproj", text: '<Compile Include="Core.fs" />' }]), []);
});

test("package and project references in the domain are rejected; elsewhere they are fine", () => {
  const v = checkDomainReferences([
    { path: "src/domain/D.fsproj", text: '<PackageReference Include="Newtonsoft.Json" Version="13.0.3" /><ProjectReference Include="../host/H.fsproj" />' },
    { path: "tests/T/T.fsproj", text: '<PackageReference Include="xunit" Version="2.9.3" />' },
  ]);
  assert.equal(v.length, 2);
  assert.match(v[0], /PackageReference 'Newtonsoft.Json'/);
  assert.match(v[1], /ProjectReference '..\/host\/H.fsproj'/);
});

test("ambient effects in domain sources are rejected", () => {
  const src = (text) => [{ path: "src/domain/X.fs", text }];
  assert.match(checkDomainPurity(src("let t = DateTimeOffset.UtcNow"))[0], /ambient clock/);
  assert.match(checkDomainPurity(src("open System.IO"))[0], /file system/);
  assert.match(checkDomainPurity(src("let g = Guid.NewGuid()"))[0], /nondeterminism/);
  assert.match(checkDomainPurity(src("let mutable n = 0"))[0], /mutable state/);
  assert.match(checkDomainPurity(src('printfn "x"'))[0], /console/);
});

test("comments and the Ctx clock are allowed", () => {
  assert.deepEqual(checkDomainPurity([{ path: "src/domain/X.fs", text: "// DateTime.Now is banned\nlet at (ctx: Ctx) = ctx.Now" }]), []);
});

test("the repository domain passes its architecture checks", () => {
  const dir = join(repoRoot, "src/domain");
  const files = readdirSync(dir)
    .filter((f) => /\.(fs|fsi|fsproj)$/.test(f))
    .map((f) => ({ path: `src/domain/${f}`, text: readFileSync(join(dir, f), "utf8") }));
  assert.ok(files.length > 0);
  assert.deepEqual(runArchitecture(files), []);
});
