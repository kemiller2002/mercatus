<!-- Proposal: no campaign or outbound action approved by this document. -->

# Demand Creation: Three Pilot Campaigns

**Status:** Experiment designs requiring research and approval, not launched campaigns.
**Date:** 2026-10-14
**Parent strategy:** `STRATEGY.md` | **Requirements:** `REQUIREMENTS.md` / `REQUIREMENTS.json`

## Common experiment contract

For all three pilots, capture: target segment; role and economic buyer; problem statement; baseline awareness and severity; disconfirming evidence; triggering event; comparator; asset versions; offer and authority to fulfill it; channel and budget; exposure/eligible-visitor counts; primary success measure; data/consent basis; allocated duration or stopping condition; risk-review owner; and post-test learning decision.

Run exploratory interviews **before** claiming the problem is common. Ten to fifteen conversations per problem area is an initial learning target, not proof of market prevalence. Mix practitioners, engineering leaders and buyers where possible. Do not launch an experiment without an approved claim package and truthful measurement. A/B allocation should be randomized or balanced when feasible; otherwise label it observational.

## Pilot A: EDF

**Customer-facing concept:** *The Hidden Cost of Engineering Rework*

**Hypothesis ID:** DC-HYP-EDF-001 (proposed)

**Customer problem hypothesis:** Many software teams repeatedly correct visible defects or missed schedules while underlying system constraints, handoffs, assumptions and root causes remain unidentified. The financial importance and extent of this failure mode are unknown until researched.

**Recognition moment:** A leadership team sees recurring missed delivery commitments despite multiple improvement initiatives. Ask: "When the same symptoms return, what evidence shows you corrected their cause?"

**Audience:** Directors/VPs of engineering and CTOs in software organizations with repeated delivery variability; finance or operations may be a co-buyer if material operational cost is demonstrated.

**Trigger hypotheses:** New leader, roadmap slippage, customer escalation, recurring incidents, modernization after a failed improvement initiative.

**Diagnostic concept (5–8 minutes):** A structured walkthrough of one recent recurring delivery or quality problem: observed symptom, interventions attempted, changes measured, competing explanations, repeated occurrence. Result should be a **cause-investigation readiness profile**, not a fabricated numerical health score. Missing answers remain unknown. Give three questions to investigate next.

**Evidence asset:** A transparent case pattern with at least one competing explanation, a causal-loop diagram, and examples of how symptom treatment can hide systemic constraints. Illustrative diagrams must be explicitly labeled.

**Comparison:** Problem-led narrative/diagnostic vs conventional "Engineering modernization and advisory" service explanation using equivalent audience, distribution and CTA.

**Offer:** Scoping conversation for a bounded diagnostic engagement. Paid diagnostic only if scope, work product and price are approved.

**Primary early measure:** Percentage of eligible interviewed or diagnostic participants who can identify a previously unrecognized material root-cause investigation need and can state a feasible owner/next step. **Primary commercial measure:** buyer-qualified diagnostic conversation rate, with clear numerator/denominator and no assumed benchmark.

**Failure signals:** Visitor perceives generic consulting rhetoric; real cause already known; remedy is straightforward internal process change; leadership sees no urgency; financial impact too speculative.

**Linked requirement families:** DC-001–025, DC-030–036, DC-040–047, DC-050–054, DC-070–073, DC-080–083.

## Pilot B: Clarity

**Customer-facing concept:** *Your Decisions Aren't Disappearing in Meetings. They're Disappearing Between Decisions and Execution.*

**Hypothesis ID:** DC-HYP-CLARITY-001 (proposed)

**Customer problem hypothesis:** Teams lose assumptions, owners, evidence and rationale as decisions move into implementation, leading to repeated debates and rework. Some teams may already have adequate decision records; the experiment must detect those cases.

**Recognition moment:** A decision is technically recorded but no longer has an accountable owner, expiry condition, or connection to subsequent implementation. Ask: "Can you reconstruct why your last architectural decision was made and what would invalidate it?"

**Audience:** Cross-team engineering leaders, architects, principal engineers, senior product leaders. Economic buyer likely engineering management.

**Trigger hypotheses:** Team growth, architecture reorganization, multiple concurrent agents or teams, expensive rework, high employee turnover.

**Diagnostic concept (5 minutes):** Trace two recent consequential decisions through assumption, evidence, owner, options rejected, reversal condition and downstream requirements. Present gaps and a no-product checklist for improving traceability.

**Evidence asset:** Side-by-side hypothetical decision journeys with and without structured provenance. Do **not** claim percentage savings without measured evidence.

**Comparison:** Problem-led decision trace exercise vs product-led description of Clarity capabilities.

**Offer:** Decision-trace workshop with explicit deliverable such as a reversible decision-recording practice and first two migrated decisions.

**Primary early measure:** Newly recognized decision-trace gaps among eligible participants. **Primary commercial measure:** qualified workshop acceptance / stakeholder introduction. Record cases where teams have adequate traceability and no compelling need.

**Failure signals:** Problem already solved by existing lightweight tools; decision quality is not the bottleneck; no budget owner; diagnostic resembles generic architecture advice.

**Linked requirement families:** DC-003–025, DC-030–037, DC-040–048, DC-050–057, DC-070–075, DC-080–087.

## Pilot C: HelixNote

**Customer-facing concept:** *You Have the Evidence. Why Is the Explanation Still Uncertain?*

**Hypothesis ID:** DC-HYP-HELIX-001 (proposed)

**Customer problem hypothesis:** Technical teams struggle to connect fragmented logs, notes, traces and operational observations into supported, reproducible explanations. The opportunity is only strong if HelixNote produces meaningfully better explanations than current tools and practices.

**Recognition moment:** Two experienced engineers can read the same evidence and arrive at conflicting explanations, with no common provenance or confidence representation.

**Audience:** Engineering reliability and platform leaders, incident managers, senior engineers responsible for diagnostics. Security or compliance may be an important approver depending on data sources.

**Trigger hypotheses:** Repeated hard-to-diagnose incidents, postmortem disputes, long escalation cycles, unreliable AI summaries, audit preparation.

**Diagnostic/demonstrator (5–10 minutes):** Present a **synthetic, reproducible technical evidence bundle** containing supporting facts, confounders, missing data, and a tempting false conclusion. Visitors follow the proposed explanation and its source links. Demonstrate proper abstention when evidence is inadequate. Include a side-by-side baseline analysis when available.

**Evidence asset:** Provenance graph showing observation -> interpretation -> rival explanation -> conclusion -> remaining unknowns. Clearly distinguish prototype, product behavior, and illustrative output.

**Comparison:** Problem-led evidence challenge vs feature-led description of HelixNote. Where possible measure interpretation accuracy and traceability on a predefined synthetic fixture.

**Offer:** Small-scope evidence quality assessment using sanitized or synthetic records, then a client-approved real-data pilot if warranted.

**Primary early measure:** Eligible participants identify a previously overlooked risk in untraceable technical conclusions. **Primary commercial measure:** buyer-qualified pilot exploration with permitted data context.

**Failure signals:** Existing observability stack already solves the problem; product cannot demonstrate transparent provenance; restricted data makes a pilot impractical; misleading AI confidence or hallucination risk.

**Linked requirement families:** DC-003–025, DC-030–036, DC-040–047, DC-050–057, DC-070–075, DC-080–083, DC-098–105.

## Common data collection / interpretation

| Question | Evidence to retain | Avoid concluding |
|---|---|---|
| Did the message reach the intended person? | Eligible reach, segment, channel | Reach = demand |
| Did recognition change? | Baseline/comparator and post-test understanding | Click = problem awareness |
| Is the problem worth acting on? | Severity, urgency, recent incident, economic owner | Pain = budget |
| Do buyers trust the demonstration? | Accuracy/provenance feedback, objections, alternatives | Interesting demo = differentiation |
| Was a meaningful commercial step taken? | Buyer-qualified meeting, approved evaluation, paid diagnostic | Email address = qualified opportunity |
| What was learned? | Evidence, counterevidence, decision, next test | No purchase = no problem |

## Initial launch sequencing

1. Choose EDF as the **first reference implementation** of the complete Marketing OS loop. Do not assume it has the strongest demand before research.
2. Interview target roles, validate the symptom language and alternative explanations, and record the baseline for each pilot.
3. Implement a reusable problem map, diagnostic scoring/unknown model, evidence package, landing journey and event tracking for EDF.
4. Compare problem-led and conventional messages on the same outcome. Maintain a documented small-sample limitation.
5. Reuse the tested platform for Clarity and HelixNote rather than reproducing three independent stacks.
6. Review evidence after the predetermined observation windows and explicitly decide advance, refine, pause or stop.

**Pilot outcome target:** A repeatable, credible mechanism to learn whether unrecognized problems translate into actionable commercial demand. No preselected conversion-rate or revenue claim is being made.