# Demand Creation: Implementation Requirements

**Status:** Proposed | **Date:** 2026-10-14 | **Source:** `docs/strategy/DEMAND-CREATION.md` v1.0
**Canonical repository:** `kemiller2002/mercatus` (verified). **Ingestion state:** source candidates for reconciliation with existing requirements; not approved runnable ROS work. Preserve original DC identifiers through intake.

## Intent and scope

Extend the existing Marketing OS, which already defines market/problem hypotheses, ICPs, provenance-preserving evidence, strategy transitions, campaigns, approved assets and results. Avoid duplicating existing requirements. Requirements below focus on gaps that make demand creation repeatable and measurable: problem maps, recognition journeys, diagnostics, consequence models, controlled experiments, stakeholder support, proof, and responsible distribution.

All requirements are **proposals**, not verified implementation status. `P0` is foundational/necessary for a safe first end-to-end path; `P1` completes production-quality pilots; `P2` is deliberate future enhancement. Phase 1 = foundation/research; Phase 2 = first journeys/pilots; Phase 3 = scale/optimization. Implementation sequencing should honor actual dependencies rather than assume every P0 must precede every P1.

### Preserved foundation contracts

- Existing Marketing OS domain owns hypotheses, evidence, ICPs, campaign decisions, approvals and results.
- Ordo handles legal state transitions when installed; Praxis tracks work/evidence and preserves the original requirement IDs.
- Forma owns interactive UI, Folio owns printable/PDF artifacts, Aegis owns unexpected boundary faults, and Limen owns applicable browser interactions. Pin immutable/released dependency versions and validate actual use.
- No autonomous marketing publication, direct messaging or contact enrichment without scoped authorization. Do not adopt Fides or Arca as a mandatory dependency before verifying integration maturity.

### Definition of ready

A work slice is ready when requirements are identified, dependencies mapped, customer hypothesis stated, data permissions understood, UX/testing approach selected, verification plan defined and any unresolved unknowns explicit. Discovery work is allowed to resolve unknowns; unknowns must not be silently treated as completed work.

### Definition of done

A work item is done only with merged versioned implementation (where applicable), applicable passing validation, evidence for acceptance criteria, accessibility/privacy/security review for external flows, an up-to-date status and a Praxis-recorded link to the relevant requirement(s). Writing a requirement or a draft asset is not proof that the behavior has shipped.

## Requirement catalog


### Portfolio governance

**DC-001 | P0 | Phase 1**  System MUST maintain an inventory of every Echelon initiative with accountable owner and campaign eligibility.  
*Acceptance:* A newly added initiative is discoverable with owner, status, and last review; unassessed initiatives are marked unassessed.

**DC-002 | P0 | Phase 1**  Every initiative MUST link to at least one explicit customer-problem hypothesis or have a documented no-market-campaign decision.  
*Acceptance:* An initiative cannot be activated without a linked hypothesis; report lists exceptions.

**DC-003 | P0 | Phase 1**  Problem maps MUST include symptom, causal hypothesis, audience, workaround, consequence, trigger, alternative, differentiator, evidence, counterevidence, and owner.  
*Acceptance:* Schema validation rejects a problem map missing required fields while permitting typed unknown values.

**DC-004 | P0 | Phase 1**  System MUST track current versions and states of existing MarketHypothesis, ProblemHypothesis, ICP, Campaign, Evidence, Asset, and Result rather than duplicate their authority.  
*Acceptance:* Entity map demonstrates stable existing IDs and no competing canonical records.

**DC-005 | P0 | Phase 1**  Opportunity prioritization MUST use explicitly defined criteria and expose evidence coverage and uncertainty separately from score.  
*Acceptance:* Two reviewers can explain a priority outcome from source-linked criterion values; unknown is not silently zero.

**DC-006 | P0 | Phase 1**  System MUST distinguish demand creation, demand capture, customer education, research, and promotional sales activity.  
*Acceptance:* Campaign records and reports expose explicit mode; shared campaigns can contain separately measured modes.

**DC-007 | P0 | Phase 1**  Commercial campaign approval MUST require buyer hypothesis, recognized symptom, plausible impact, identified buying trigger, evidence review, credible offer, and measurement plan.  
*Acceptance:* Attempted promotion with one missing gate remains in research/blocked state with reason.

**DC-008 | P1 | Phase 2**  Related initiatives MUST be represented as options for a shared problem without forcing a separate campaign for each product.  
*Acceptance:* One problem map can link EDF, Clarity, and HelixNote with role-specific distinctions and no duplicate journey required.

**DC-009 | P1 | Phase 3**  Priority decisions MUST be periodically reevaluated when contradictory research, offers, or conversion evidence arrives.  
*Acceptance:* A material disconfirming finding creates a review candidate with immutable earlier decision.


### Research and evidence

**DC-010 | P0 | Phase 1**  Research intake MUST preserve provenance, capture time, original observation, interpretation, support and contradiction classification.  
*Acceptance:* Given five findings, every one can be traced to an original source and claims remain separate from opinions.

**DC-011 | P0 | Phase 1**  Research plans MUST seek counterevidence and alternative explanations before advancing a problem hypothesis.  
*Acceptance:* Review cannot be approved without recorded counterevidence search or explicit no-results rationale.

**DC-012 | P0 | Phase 1**  Customer interviews MUST capture role, purchase involvement, recent concrete example, current workaround, severity, urgency, and authorization-safe notes.  
*Acceptance:* Structured interview template produces those fields, with declined/unavailable values preserved.

**DC-013 | P0 | Phase 1**  Customer-language snippets MUST be available as sourced quotation or paraphrase with authorization and handling metadata.  
*Acceptance:* Unsupported or non-consented quote cannot enter approved public claims.

**DC-014 | P1 | Phase 1**  Research MUST differentiate practitioner, sponsor, economic buyer, approver, and veto/influencer roles.  
*Acceptance:* A discovery record shows distinct persons/roles or explicit overlap and unknowns.

**DC-015 | P0 | Phase 1**  Evidence strength MUST distinguish attention, recognition, stated intent, behavioral commitment, buying activity, and paid action.  
*Acceptance:* A popular post cannot automatically be promoted into evidence of demand or revenue.

**DC-016 | P1 | Phase 2**  System SHOULD classify recurring normalized symptoms and maintain a frequency/segment map without claiming a representative sample from small studies.  
*Acceptance:* Report includes sample counts, sampling method, and limitation flag.

**DC-017 | P1 | Phase 2**  System MUST compare nonpurchase and competitor alternatives for each validated problem.  
*Acceptance:* A buyer report shows viable alternatives and recorded situations where Echelon is not recommended.

**DC-018 | P1 | Phase 2**  System SHOULD support structured coding of problem severity and trigger timing without overriding researcher judgment.  
*Acceptance:* Codebook version and reviewer edits are preserved for each categorized conversation.

**DC-019 | P1 | Phase 3**  Research findings SHOULD drive proposed product positioning and roadmap changes through versioned recommendations.  
*Acceptance:* Recommendation identifies supporting/contrary evidence and affected requirement or initiative.


### Recognition journeys

**DC-020 | P0 | Phase 1**  Every approved demand-creation campaign MUST describe an observable entry symptom in customer's own language before describing product features.  
*Acceptance:* Reviewer sees problem-first entry asset with no feature-dependent opening statement.

**DC-021 | P0 | Phase 2**  A recognition journey MUST define ordered stages Recognition, Consequence, Possibility, Proof, Action, and Learning.  
*Acceptance:* Journey validator rejects missing stage and displays its intended evidence/action.

**DC-022 | P1 | Phase 2**  Each stage MUST serve a distinct customer question and connect to a relevant next step or a legitimate exit.  
*Acceptance:* Usability test can complete journey or leave without forced product pitch.

**DC-023 | P0 | Phase 2**  Recognition assets MUST disclose when scenarios are composites or illustrative rather than actual customer outcomes.  
*Acceptance:* Publishing gate flags a case study without verifiable provenance or illustration label.

**DC-024 | P1 | Phase 2**  Journeys MUST support practitioner, executive, and cross-functional approver perspectives without contradictory claims.  
*Acceptance:* Same problem map renders appropriate evidence for each role with consistent source data.

**DC-025 | P1 | Phase 2**  Every journey SHOULD include a usable independent action or lesson that remains valuable without buying.  
*Acceptance:* Pilot users can identify at least one actionable insight without surrendering contact information.

**DC-026 | P1 | Phase 3**  System SHOULD support sharing educational artifacts across channels while tracking source version and permissible claims.  
*Acceptance:* Derived posts map to approved canonical narrative and list material edits.

**DC-027 | P1 | Phase 3**  Cross-initiative next steps MUST be driven by diagnosed conditions rather than indiscriminate cross-sell.  
*Acceptance:* A diagnostic finding unrelated to HelixNote does not recommend HelixNote.

**DC-028 | P2 | Phase 3**  System MAY support multilingual customer-language variants after evidence of channel demand.  
*Acceptance:* Variant claims remain traceable to source and human review of meaning.


### Impact and economics

**DC-030 | P0 | Phase 1**  An impact model MUST distinguish measured, observed, calculated, estimated, and unavailable inputs.  
*Acceptance:* Report labels each parameter with type, units, origin, and date.

**DC-031 | P0 | Phase 1**  Missing cost, probability, severity or baseline data MUST remain unknown and MUST NOT default to zero.  
*Acceptance:* Tests with missing inputs produce unavailable/range-needed, not a misleading numeric ROI.

**DC-032 | P0 | Phase 2**  Impact estimates MUST show method, assumptions, uncertainty, and sensitivity to material inputs.  
*Acceptance:* Changing a key assumption visibly changes interval or outcome and report exposes formula version.

**DC-033 | P0 | Phase 2**  Every diagnostic report MUST separate possible correlation from causal attribution.  
*Acceptance:* Report cannot claim time savings caused by a product from before/after alone.

**DC-034 | P1 | Phase 2**  System SHOULD support role-relevant consequence categories including rework, defects, delivery delay, risk, turnover, and foregone opportunities.  
*Acceptance:* One problem can report relevant categories without double counting the same loss.

**DC-035 | P1 | Phase 2**  Business cases MUST compare at least doing nothing, process change, existing tooling, and Echelon offer where feasible.  
*Acceptance:* Comparison labels unknown results and excludes inapplicable options with rationale.

**DC-036 | P1 | Phase 2**  Public quantified claims MUST be backed by versioned evidence and approval scoped to their specific wording and context.  
*Acceptance:* An edited public claim cannot publish based on an approval of older wording.

**DC-037 | P2 | Phase 3**  System MAY calibrate cost-model error against customer-observed outcomes without revealing sensitive client inputs.  
*Acceptance:* Calibration shows error distribution and anonymization controls.


### Interactive diagnostics

**DC-040 | P0 | Phase 2**  Pilot campaigns MUST offer a short self-assessment or demonstrator with clearly documented intended use and limitations.  
*Acceptance:* Each pilot has an accessible artifact delivering actionable results without requiring a sales meeting.

**DC-041 | P0 | Phase 2**  Diagnostic scoring MUST be versioned, explainable, reproducible, and tested against published fixtures.  
*Acceptance:* Given same inputs and version, scores and explanations match golden results.

**DC-042 | P0 | Phase 2**  A diagnostic MUST support unknown, prefer-not-to-answer, and insufficient-evidence outcomes instead of inventing precision.  
*Acceptance:* Sparse answers yield limited conclusions and display missing evidence needs.

**DC-043 | P0 | Phase 2**  Ungated diagnostic use MUST be possible unless individualized follow-up genuinely requires contact data.  
*Acceptance:* An anonymous visitor can complete the basic self-check and view results.

**DC-044 | P1 | Phase 2**  A diagnostic result MUST display strengths, suspected risks, suggested validation, alternative remedies, and relevant next step.  
*Acceptance:* Result report includes these sections and distinguishes suspicion from confirmed failure.

**DC-045 | P1 | Phase 2**  Interactive assets MUST work on mobile, keyboard, screen reader, and reduced-motion settings following Forma guidance.  
*Acceptance:* Automated and manual accessibility verification covers all pilot diagnostics.

**DC-046 | P1 | Phase 2**  Printable diagnostic and executive briefs MUST use Folio and remain legible across supported page sizes.  
*Acceptance:* PDF/print fixture tests show no clipped charts, headings, or missing source notes.

**DC-047 | P1 | Phase 2**  Demo examples MUST not expose real customer data and MUST clearly identify synthetic input.  
*Acceptance:* Privacy review and fixture tests show demo artifacts use approved fictional examples.

**DC-048 | P2 | Phase 3**  Diagnostics SHOULD be extensible to future initiatives through registered problem definitions rather than per-product forks.  
*Acceptance:* A fourth diagnostic can be added through manifest and reused components.


### Experiments

**DC-050 | P0 | Phase 1**  Every campaign experiment MUST preregister hypothesis, audience, comparator, assignment, success metric, measurement window and stopping rule.  
*Acceptance:* No experiment may enter running state while required preregistration fields are absent.

**DC-051 | P0 | Phase 2**  Pilots MUST compare problem-first messaging with a suitable product/service-led comparator where ethically and operationally practical.  
*Acceptance:* Pilot design documents both variants and controlled differences, or reason comparison is unavailable.

**DC-052 | P0 | Phase 2**  Experiments MUST preserve exposure denominators, qualified visitors, conversion events, and eligibility definitions.  
*Acceptance:* Analysis can reproduce conversion measures from captured event records.

**DC-053 | P0 | Phase 2**  System MUST warn against interpreting sparse, selected, or nonrandom samples as causal proof.  
*Acceptance:* A low-volume nonrandom campaign yields descriptive findings and limitation text.

**DC-054 | P1 | Phase 2**  Experiment review MUST report both supporting and disconfirming outcomes, objections, and unexpected segments.  
*Acceptance:* Outcome record includes failure cases and does not discard nonconverters.

**DC-055 | P1 | Phase 3**  Experiments MUST have explicit stop, refine, continue, and scale decisions supported by evidence and human authorization.  
*Acceptance:* At end-of-window, workflow produces a decision candidate with traceable basis.

**DC-056 | P1 | Phase 3**  When multiple versions exist, the system SHOULD record change history and avoid untracked mid-test edits.  
*Acceptance:* Changing copy after start creates new variant/version and preserves prior assignment.

**DC-057 | P2 | Phase 3**  System MAY estimate incremental commercial lift with appropriate experiment design and honest uncertainty bounds.  
*Acceptance:* Analysis states design assumptions and declines causal claim when violated.


### Distribution

**DC-060 | P0 | Phase 1**  Each channel MUST declare authorized account, permissions, content policy, rate limits, audience, and escalation owner.  
*Acceptance:* Unknown channel cannot publish or access credentials by default.

**DC-061 | P0 | Phase 2**  Public publishing and prospect outreach MUST require scoped human approval by channel, audience, asset version and action volume.  
*Acceptance:* Unapproved publish or send action is rejected and logged.

**DC-062 | P0 | Phase 2**  LinkedIn, Reddit, Facebook and X integrations MUST respect platform rules and use supported access methods; unavailable permissions MUST remain blocked.  
*Acceptance:* Adapter without approved access provides draft/export-only workflow, not workaround scraping.

**DC-063 | P1 | Phase 2**  System SHOULD support approved educational participation as distinct from promotional posting and outreach.  
*Acceptance:* Editorial plan records community benefit and prohibits generic unsolicited mass posting.

**DC-064 | P1 | Phase 3**  Each distributed asset MUST retain canonical narrative ID, variant, channel, timestamp and source URL where available.  
*Acceptance:* Campaign analytics trace a LinkedIn post to the original approved claim package.

**DC-065 | P1 | Phase 3**  Outreach MUST enforce recipient suppression, consent/legitimate basis policies, opt-out and deduplication.  
*Acceptance:* Suppressed contact cannot be contacted from a different campaign.

**DC-066 | P1 | Phase 3**  Channel selection MUST be hypothesis-led, not blanket distribution to every supported platform.  
*Acceptance:* Campaign plan states why the target decision maker is reachable through each chosen channel.

**DC-067 | P2 | Phase 3**  Distribution SHOULD support agent-prepared drafts with a human approval queue and content diff.  
*Acceptance:* Reviewer can approve, reject, request edits or expire authorization without publishing.


### Commercial conversion

**DC-070 | P0 | Phase 2**  Every journey MUST have a relevant action offer, from no-cost assessment to scoped paid diagnostic, with clear expected effort and outcome.  
*Acceptance:* Landing page makes next step and its obligations understandable before contact details.

**DC-071 | P1 | Phase 2**  CRM and prospect records MUST distinguish anonymous interest, awareness gain, contact consent, qualified conversation, and active sales opportunity.  
*Acceptance:* A diagnostic completion without contact consent never creates a contactable lead automatically.

**DC-072 | P1 | Phase 3**  Qualification MUST capture problem ownership, urgency, economic impact hypothesis, buyer/approver access, and feasible next step.  
*Acceptance:* A qualified conversation record contains required fields or explicit unknowns.

**DC-073 | P1 | Phase 3**  Offers MUST include bounded scope, deliverables, exclusions, confidentiality, commercial terms, and success criteria.  
*Acceptance:* A paid diagnostic template can be completed and reviewed without inventing client terms.

**DC-074 | P1 | Phase 3**  System SHOULD capture objection taxonomy, reasons for loss, no-decision and alternative chosen.  
*Acceptance:* Analysis can distinguish lack of recognized need from lack of budget or solution fit.

**DC-075 | P2 | Phase 3**  System MAY generate tailored buying-group briefs using approved evidence only.  
*Acceptance:* Generated executive/finance/procurement versions preserve same underlying claims.


### Measurement

**DC-080 | P0 | Phase 1**  Success metrics MUST distinguish distribution, problem recognition, perceived relevance, commercial intent, revenue, and profitability.  
*Acceptance:* Reporting never shows reach as if it were verified commercial demand.

**DC-081 | P0 | Phase 2**  Recognition measurement SHOULD include a before/after or suitable comparator rather than treating clicks as awareness change.  
*Acceptance:* Pilot collects or explicitly marks unavailable an evidence-backed recognition measure.

**DC-082 | P0 | Phase 2**  Event records MUST carry campaign ID, problem ID, channel, variant, timestamp, consent basis where relevant, and data quality.  
*Acceptance:* Sample journey can be traced from exposure to qualified action when consent permits.

**DC-083 | P0 | Phase 2**  Attribution MUST support unattributed and multi-touch paths and MUST not falsely claim causal attribution.  
*Acceptance:* Organic/direct/unknown conversions remain visible and attributed totals do not exceed eligible events.

**DC-084 | P1 | Phase 3**  A decision dashboard MUST show uncertainty, evidence coverage, funnel conversion, acquisition effort, objections and commercial outcomes.  
*Acceptance:* An initiative with no opportunities displays zero observed opportunities and measurement coverage.

**DC-085 | P1 | Phase 3**  System MUST separate observed results from forecast and modeled estimates in all executive reports.  
*Acceptance:* Dashboards and exports visibly label actuals, estimates and unavailable data.

**DC-086 | P1 | Phase 3**  The learning loop MUST update hypothesis and priority proposals without silently promoting them to accepted truth.  
*Acceptance:* New results trigger review state; older decisions and supporting evidence remain preserved.

**DC-087 | P2 | Phase 3**  System SHOULD report cohorts and time lags so slow B2B purchasing cycles are not misread as immediate failure.  
*Acceptance:* Quarterly results indicate age of cohort and pending outcomes rather than automatic zero conversion.


### Architecture and traceability

**DC-090 | P0 | Phase 1**  Each requirement MUST retain stable identity, priority, intended behavior, acceptance, source strategy section, and dependencies.  
*Acceptance:* Praxis import/reconciliation can preserve IDs without conflating requirement and work item.

**DC-091 | P0 | Phase 1**  New features MUST reuse existing Marketing OS hypotheses, evidence, campaigns, approvals, and learning entities where equivalent.  
*Acceptance:* Implementation design documents reuse map before proposing schema additions.

**DC-092 | P0 | Phase 1**  Ordo-controlled legal states and guarded transitions MUST protect campaign approval and measurement integrity where deployed.  
*Acceptance:* Direct invalid transition attempt is rejected without partial persisted effects.

**DC-093 | P0 | Phase 1**  Praxis intake MUST preserve provenance, requirement IDs, decisions, work-item relationships, implementation tests and acceptance evidence.  
*Acceptance:* A requirement can be traced end-to-end without a GitHub issue being mistaken for canonical requirement source.

**DC-094 | P0 | Phase 2**  Interactive browser implementations MUST use pinned Forma components and the approved Limen/browser boundary when applicable.  
*Acceptance:* Tests detect release-pin drift and show components are actually used.

**DC-095 | P0 | Phase 2**  Printable reports MUST use pinned Folio; unexpected integration failures MUST use Aegis, not domain-state error aliases.  
*Acceptance:* Integration tests cover printable report and a redacted Aegis fault at API/storage boundary.

**DC-096 | P1 | Phase 2**  Implementations SHOULD be static-first and GitHub Pages compatible when feasible; backend dependencies require explicit justification.  
*Acceptance:* Pilot build runs locally and deploys without mandatory Kubernetes or unreviewed hosted services.

**DC-097 | P1 | Phase 3**  Fides and Arca integration MUST remain optional until verified as supported, with explicit provider-neutral contracts.  
*Acceptance:* Feature can run in approved test environment without assuming production Fides/Arca availability.

**DC-098 | P1 | Phase 2**  External content and collected data MUST be treated as untrusted, with sanitization, injection defenses and redacted telemetry.  
*Acceptance:* Adversarial source content cannot alter agent permissions or expose credentials.

**DC-099 | P1 | Phase 2**  Rules for agents MUST define permitted tools, inputs, outputs, approval gates, escalation, and no-send defaults.  
*Acceptance:* Agent attempting external post without authorization is denied and auditable.


### Privacy and quality

**DC-100 | P0 | Phase 1**  Diagnostic and prospect collection MUST minimize personal information and distinguish anonymous from identified flows.  
*Acceptance:* Anonymous run creates no contact identity; personal data fields have documented necessity.

**DC-101 | P0 | Phase 2**  Retention, deletion, access control, and legal basis/consent MUST be specified before storing personal diagnostic responses or prospect data.  
*Acceptance:* Data removal request can find and delete or legally retain records with stated rationale.

**DC-102 | P0 | Phase 2**  All public claims MUST pass a claim-substantiation review; fabricated testimonials, false urgency and invented benchmarks are prohibited.  
*Acceptance:* Test case with synthetic success story cannot be released as real case study.

**DC-103 | P1 | Phase 2**  Diagnostics MUST document limitations, failure modes and inappropriate applications, and provide readable explanations.  
*Acceptance:* Result includes why score may be wrong and next verification steps.

**DC-104 | P1 | Phase 2**  Usability and accessibility MUST be validated on supported browser/device classes before launch.  
*Acceptance:* Keyboard/mobile/screen-reader/reduced-motion smoke tests pass for each new visitor journey.

**DC-105 | P1 | Phase 2**  Reports MUST avoid unverified causal claims, over-precise ROI, manipulative nudges or product-only outcomes.  
*Acceptance:* Automated policy checks flag risky wording and human reviewer records resolution.

**DC-106 | P1 | Phase 3**  Operational dashboards MUST show broken instrumentation, sample-selection issues and missing events.  
*Acceptance:* Zero conversions can be distinguished from missing tracking.

**DC-107 | P1 | Phase 3**  System MUST have a tested campaign rollback / publishing stop path for inaccurate claims or unauthorized content.  
*Acceptance:* Reviewer can stop delivery, withdraw approved variants and preserve incident audit trail.

**DC-108 | P2 | Phase 3**  Continuous validation SHOULD detect changed platform policies or diagnostic model versions requiring reevaluation.  
*Acceptance:* Material change creates review work and blocks unsafe automatic continuation.

## Cross-cutting test scenarios

1. **No fabricated need:** A weak/problem-disconfirmed hypothesis cannot become a published urgency claim.
2. **Insufficient data:** An anonymous self-check with missing inputs returns appropriately uncertain guidance, not a fabricated cost estimate.
3. **Blocked external action:** An agent attempts Reddit or LinkedIn publication without scoped authorization; no post is made and the event is recorded.
4. **Safe alternative:** An assessment recommends process change or existing tooling when it is a better fit; an irrelevant Echelon product is not cross-sold.
5. **Hidden buyer:** A technical champion can share an executive and procurement-appropriate brief using exactly the same approved evidence.
6. **Measurement integrity:** A pilot with high engagement but no buyer-qualified actions is reported as awareness/interest only, not validated demand.
7. **Version integrity:** A public case study with a changed number cannot inherit the earlier approval.
8. **Reconciliation:** Every requirement ID maps to its work item and evidence; orphaned items, duplicates and rejected intake are explicitly visible.
9. **Accessibility:** All three pilot assessments support keyboard, screen reader and narrow mobile screen, including error and unknown states.
10. **Stop and learn:** Disconfirming buyer research can halt a campaign, retain its full history, and create product/positioning review work.

## Initial execution slices

- **Slice S1, Evidence foundation:** DC-001–007, DC-010–015, DC-020, DC-030–031, DC-050, DC-060, DC-080, DC-090–093, DC-100; create three ranked problem maps and a decision register.
- **Slice S2, EDF reference journey:** DC-021–025, DC-032–036, DC-040–047, DC-051–054, DC-061–062, DC-070–071, DC-081–083, DC-094–096, DC-098–105; ship and instrument one honest diagnostic.
- **Slice S3, Clarity and HelixNote:** Reuse platform capabilities; build two more journeys, segment-specific proof, and paired message tests. Track incremental requirements rather than cloning every foundation work item.
- **Slice S4, Learning and expansion:** DC-008–009, DC-016–019, DC-026–028, DC-037, DC-048, DC-055–057, DC-063–067, DC-072–075, DC-084–087, DC-097, DC-106–108; analyze commercial quality, then expand.

Use Praxis to regroup work by coherent implementation slices while preserving exact requirement IDs and every original acceptance criterion. Do not auto-start all items merely because they appear in this file.

## Reconciliation gate

Before creating executable ROS/Praxis work, match each `DC-###` source requirement to existing Mercatus requirements, mark duplicate/extension/new explicitly, preserve original IDs in provenance, identify implementation slices, and record acceptance evidence. Existing domain truth is not superseded by this proposed catalog. See `docs/strategy/DEMAND-CREATION-RECONCILIATION.md`.
