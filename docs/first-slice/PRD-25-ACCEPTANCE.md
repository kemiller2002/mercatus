# First Vertical Slice: Acceptance Criteria (PRD-25)

- **Work items:** WI-0051 (draft), WI-0038 (accepted)
- **Date:** 2026-11-14
- **Status:** **accepted** by the owner on 2026-11-15
  (DF-MERCATUS-DOM-2026-0002). PRD-25 now carries the §7 text and makes these
  criteria normative.
- **Companion:** `requirements/SLICE-TRANSITIONS.md` gives the
  states and commands this slice exercises.
- **Addresses:** REQ-EVAL-03. The slice has no acceptance criteria, no data
  policy and no definition of "Learning". The first-slice readiness checklist
  in `docs/requirements-evaluation/REQUIREMENTS-EVALUATION-2026-11.md` §6 is
  part of this.

## 1. What the slice proves

The slice proves that one commercial belief can be carried from hypothesis to
learning without breaking any of these rules:

- every change is a legal, attributed transition;
- evidence stays distinct from interpretation and must be current to count;
- missing information becomes an obligation, never a fabricated value;
- agents act only through their capabilities;
- an outcome changes beliefs only through ordinary, reviewable transitions.

It does **not** prove reach, deliverability or revenue. Outbound sending,
real contacts and providers are excluded (charter; Gate B).

## 2. The fixture world (synthetic)

The slice runs on one deterministic, versioned fixture set. It must be
synthetic and must pass `checkFixtures` (§4).

| Entity | Count | Notes |
|---|---|---|
| MarketHypothesis | 2 | competing: "regulated mid-market software teams" vs "agencies" |
| ProblemHypothesis | 3 | one corroborated, one weakened by contradicting evidence, one rejected |
| Organization | 5 | fictional names; domains under `.example` |
| Observation | 12 | including 2 duplicates and 2 that contradict |
| Evidence | 8 | including 1 that goes stale during the scenario clock and 1 contested |
| Lead | 3 | qualified and converted; deferred then resumed; disqualified |
| Opportunity | 2 | one Won with a CommercialOutcome; one Lost with an alternative recorded |
| LearningRecord | 2 | one applied and supporting a hypothesis; one whose application is Deferred by an open obligation |

The scenario uses an injected clock. Freshness, deadlines and due dates are
evaluated against it, never against wall time.

## 3. Acceptance criteria

Each criterion names the check that proves it. A criterion whose check has not
run is **unknown**, not passed.

| AC | Criterion | Check |
|---|---|---|
| AC-01 | The fixture world in §2 loads deterministically from versioned fixtures. Two loads produce byte-identical projections. | slice test, CHK-DOK-07 |
| AC-02 | The **happy path** runs end to end through Tier 3 commands only: MarketHypothesis Draft → Testing → Supported; ProblemHypothesis → Corroborated; Organization → Candidate; Observation → PromotedToEvidence; Evidence → Accepted; Lead → Qualified → Converted; Opportunity ProblemConfirmed → Won; LearningRecord → Applied, supporting the market hypothesis. | E2E scenario |
| AC-03 | Every command in the accepted transition tables has a test from each legal source state, and a test proving rejection from every other state. | TST-01, TST-02, CHK-DOK-02 |
| AC-04 | Each non-happy result is demonstrated at least once: `Rejected` (illegal state, missing capability), `Deferred` (blocking obligation, stale evidence) and `Conflict` (stale expected version). `UnknownExternalEffect` is unreachable because the slice has no external effects, and a test asserts this. | CHK-DOK-05 |
| AC-05 | Stale evidence cannot satisfy `Lead.Qualify`, `ProblemHypothesis.Corroborate` or `MarketHypothesis.Support`. Advancing the clock past validity turns an Accepted result into Deferred, and raises ReviewStaleEvidence. | TST-06, DR-EV-01 |
| AC-06 | `MarketHypothesis.Support` is Deferred while a FindCounterEvidence obligation is open (DSM-02). | DR-MH tests |
| AC-07 | A Researcher agent can discover, research, normalize, review, promote observations, contest, weaken and propose learning. It is denied every human-only command in the tables. The same command gets the same denial from the UI, API and agent origins. | CHK-DOK-03 |
| AC-08 | Every Accepted transition emits an event carrying actor, actor type, capability, policy version, correlation and causation IDs, and the clock time. Replaying the event log rebuilds every projection identically. | TST-17, EFF-18 |
| AC-09 | Resubmitting a command with the same idempotency key returns the original result and emits no second event. | TST-08, TST-09 |
| AC-10 | Persistence sits behind the Tier 3 store port. The slice store is in-memory or file-based and holds synthetic data only. The port's contract test suite is written so that the GitHub-backed store (WI-0030) must pass it later. | CHK-DOK-04 |
| AC-11 | Applying a LearningRecord submits ordinary hypothesis commands and records each result. A Deferred result leaves the hypothesis unchanged and is visible. The record names exactly one validation dimension, and CLS-10 is tested: a Won opportunity does not advance OutcomeValidation. | LearningRecord tests |
| AC-12 | UI-02 (evidence inspector), UI-04 (lead qualification) and UI-05 (opportunity blockers) run on Forma under UIR-01..UIR-15. They pass CHK-UI-02 at the four widths and two text sizes, with axe reporting zero serious or critical issues. The result presentation map §4A is rendered for every case the slice can produce. | CHK-UI-01..03, CHK-DOK-06 |
| AC-13 | The Limen boundary is live (CHK-UI-04). Aegis is bound. Foundations sets Forma `required: true`. DF-MERCATUS-FND-2026-0001 and -0002 are superseded in the same change. | foundations verify, limen verify --strict |
| AC-14 | For WF-01..WF-06 and WF-14, the gate criteria become true only with evidence paths. Each slice requirement is listed and linked in traceability, and the coverage baseline is raised. | CHK-GATE |
| AC-15 | All fixtures pass the synthetic-data policy (§4). No real personal data exists anywhere in the repository or its history. | CHK-GATE (checkFixtures) |
| AC-16 | A verifier other than the implementer runs AC-02 end to end and records the run as Praxis evidence. | WORKFLOW-BOUNDARY-REVIEW §5 |

## 4. Synthetic-data policy

| ID | Rule | Enforced by |
|---|---|---|
| SDP-01 | Until WI-0037 is decided, the repository holds no real person's name, email address, phone number or other identifier, and no real organization's non-public information. | review, SDP-03..05 |
| SDP-02 | Fixtures live under a `fixtures/` directory and are marked synthetic: JSON at top level with `"synthetic": true`, other formats with a `synthetic: true` or `SYNTHETIC` line. | `checkFixtures` |
| SDP-03 | Every email address and URL in a fixture uses a reserved domain (RFC 2606/6761): `example.com`, `example.org`, `example.net`, `*.example`, `*.test` or `*.invalid`. | `checkFixtures` |
| SDP-04 | Phone values in JSON fixtures use the fictional NANP range 555-0100 to 555-0199. | `checkFixtures` |
| SDP-05 | Fixture text quoted from public sources (for example a forum post) is paraphrased and attributed to a fictional source. Real handles and real URLs are never stored. | review |
| SDP-06 | A fixture that violates SDP-02..04 fails CI before merge. Once committed, it is removed by a new commit, and history rewriting needs the owner's decision. CI catches the problem first because history cannot be cleaned. | `verify-gate.mjs` |

`tools/modernization/data-policy.mjs` implements SDP-02..04. It runs now, in
CI, on every tracked file under any `fixtures/` directory.

## 5. Minimal models introduced by the slice

**CommercialOutcome** (a value object, required by `Opportunity.MarkWon`):

```fsharp
type CommercialOutcome =
    { Offering: OfferingRef
      Value: Money option          // None means "not disclosed", never zero
      TermsRef: DocumentRef option
      RecordedBy: ActorRef
      At: DateTimeOffset }
```

**LearningRecord** (an aggregate; its states are in the transition tables):
Proposed → Accepted → Applied, or Discarded.

```fsharp
type LearningRecord =
    { Id: LearningId
      Dimension: ValidationDimension       // exactly one (CLS-10)
      From: LearningSource NonEmptyList    // outcomes and/or evidence
      Requests: HypothesisCommand NonEmptyList
      Results: (HypothesisCommand * TransitionResultSummary) list   // filled by Apply
      State: LearningState }
```

**Lost vs Rejected, Outcome and regression** follow decisions P5 to P7 in
the accepted transitions (`requirements/SLICE-TRANSITIONS.md` §2).

## 6. Out of scope for the slice

- Outbound sending, contacts, CommunicationEligibility in practice, and
  campaigns.
- Providers (Reddit, Proton and the rest), and all external effects.
- The GitHub-backed store, which WI-0030 builds against the AC-10 contract.
- Mobile-first screens (UI-07, UI-09, UI-12) and the Folio print documents.

## 7. PRD-25 text (accepted and applied)

> ## 25. Initial vertical slice
>
> ID: `PRD-25`
>
> The first complete vertical slice MUST be:
> MarketHypothesis → ProblemHypothesis → Organization discovery →
> Observation/Evidence → Lead → Qualification → Opportunity → Outcome →
> Learning.
>
> It MUST exercise Praxis, Ordo, Limen, F#, states, transitions, evidence,
> obligations, policies, capabilities, audit and agent boundaries before broad
> automation is added.
>
> It MUST satisfy acceptance criteria AC-01 to AC-16 and the synthetic-data
> policy SDP-01 to SDP-06 in `docs/first-slice/PRD-25-ACCEPTANCE.md`. It MUST
> NOT store real personal data until the personal-data placement decision
> (WI-0037) is accepted. Outbound effects are out of scope.

## 8. Owner decisions (all recommendations accepted 2026-11-15)

| # | Question | Accepted answer |
|---|---|---|
| Q1 | Accept the replacement text in §7? | Yes. It makes PRD-25 testable without widening scope. |
| Q2 | Include the three Forma screens (AC-12) in the slice, or defer them to a second slice? | Include them. PRD-25 requires Limen, and screens surface UI-contract defects early. |
| Q3 | Accept SDP-01..06 now, independent of WI-0037? | Yes. They cost nothing and close the irreversible risk. |
| Q4 | Is an in-memory or file store acceptable for the slice (AC-10)? | Yes, behind the port and its contract tests. |
| Q5 | Accept the transition proposal P1..P9? | Yes. See `requirements/SLICE-TRANSITIONS.md` §2. |
| Q6 | Who is the independent verifier for AC-16? | The owner, or a separate agent session under its own identity. |
