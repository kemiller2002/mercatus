// Pure architecture checks for the Tier 1/2 domain (WI-0013;
// WORKFLOW-BOUNDARY-REVIEW §5 "Tier 1 references only FSharp.Core").
// Every exported check is a total function from data to violation strings.

export const DOMAIN_DIR = "src/domain/";

const isDomainProject = (path) => path.startsWith(DOMAIN_DIR) && path.endsWith(".fsproj");
const isDomainSource = (path) => path.startsWith(DOMAIN_DIR) && /\.fsi?$/.test(path);

// The domain may depend on nothing but FSharp.Core (implicit in the SDK).
export const checkDomainReferences = (files) =>
  files
    .filter((f) => isDomainProject(f.path))
    .flatMap((f) =>
      [...f.text.matchAll(/<(PackageReference|ProjectReference|Reference)\s+Include="([^"]+)"/g)].map(
        ([, kind, name]) => `${f.path}: ${kind} '${name}' is not allowed; Tier 1/2 references only FSharp.Core`,
      ),
    );

// Ambient effects that would make a decision impure. The clock, identity and
// all outside facts arrive through Ctx.
const IMPURE = [
  [/\bSystem\.IO\b|\bFile\.|\bDirectory\./, "file system access"],
  [/\bSystem\.Net\b|\bHttpClient\b/, "network access"],
  [/\bDateTime(Offset)?\.(Now|UtcNow|Today)\b/, "the ambient clock (use Ctx.Now)"],
  [/\bRandom\b|\bGuid\.NewGuid\b/, "nondeterminism"],
  [/\bConsole\.|\bprintfn\b|\beprintfn\b/, "console output"],
  [/\bEnvironment\./, "process environment"],
  [/\bmutable\b|<-/, "mutable state"],
];

const stripComments = (text) => text.replace(/\(\*[\s\S]*?\*\)/g, "").replace(/\/\/.*$/gm, "");

export const checkDomainPurity = (files) =>
  files
    .filter((f) => isDomainSource(f.path))
    .flatMap((f) => {
      const code = stripComments(f.text);
      return IMPURE.filter(([re]) => re.test(code)).map(([, what]) => `${f.path}: Tier 1/2 code uses ${what}`);
    });

export const runArchitecture = (files) => [...checkDomainReferences(files), ...checkDomainPurity(files)];
