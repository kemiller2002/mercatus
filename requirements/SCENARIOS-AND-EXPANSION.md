# Scenario Analysis and System Expansion Requirements

These scenarios are deliberately chosen to expose inefficiency, missing state, unsafe automation, or architecture pressure. Each scenario includes the capability the system needs in response.

## Scenario 1: 500 companies discovered overnight

ID: `SCN-01`

A research agent discovers 500 organizations after a market event.

Naive behavior: research all 500 deeply and generate 500 messages.

Required solution:
- cheap first-pass triage;
- deduplication/entity resolution;
- evidence-density and relevance filters;
- bounded research budgets;
- batch observations with per-organization provenance;
- priority queues based on explicit criteria;
- human attention budget;
- progressive enrichment only when the next decision requires it.

Add ResearchBudget, ResearchQueue, and TriageDecision concepts.

## Scenario 2: Same company appears through Reddit, conference list, website, and referral

ID: `SCN-02`

Required solution:
- canonical identity resolution;
- alias/external identity graph;
- merge candidates with confidence/evidence;
- reversible merge;
- preserve source-specific provenance;
- aggregate without double-counting independent evidence incorrectly.

## Scenario 3: A contact changes jobs

ID: `SCN-03`

Required solution:
- time-bounded PersonRole/OrganizationAffiliation;
- historical relationships preserved;
- new employer does not inherit old employer's permissions/context;
- campaigns using stale role information generate RefreshContact obligation.

## Scenario 4: Strong engagement but no commercial intent

ID: `SCN-04`

A post gets large engagement and many positive comments.

Required solution:
- separate attention, engagement, problem recognition, buying intent, opportunity, and revenue evidence;
- prohibit automatic promotion from engagement to demand;
- require commercial validation experiment.

## Scenario 5: One message works for CTOs and fails for CFOs

ID: `SCN-05`

Required solution:
- message variants tied to audience/role/problem/channel;
- segmented results;
- avoid averaging away cohort differences;
- hierarchical experiment results;
- recommendation scoped to the population actually tested.

## Scenario 6: Agent wants to repeat a failed campaign

ID: `SCN-06`

Required solution:
- commercial-memory similarity search;
- retrieve prior hypothesis, audience, message, conditions, result, and failure explanation;
- agent must identify changed assumptions/conditions before rerun;
- intentional replication supported and labeled.

## Scenario 7: Prospect replies "not now, call me in six months"

ID: `SCN-07`

Required solution:
- FollowUpLater classification;
- explicit deferred-until date/window;
- relationship preserved;
- campaign sequence stops;
- future obligation created;
- contact eligibility rechecked when obligation becomes actionable.

## Scenario 8: Prospect unsubscribes while an email is queued

ID: `SCN-08`

Required solution:
- send-time eligibility check;
- suppression state has precedence;
- queued effect is cancelled if not yet externally committed;
- if effect status is Unknown, reconcile rather than assume cancellation.

## Scenario 9: Email provider accepts send but response is lost

ID: `SCN-09`

Required solution:
- Unknown external effect;
- idempotency/provider correlation;
- reconciliation workflow;
- no blind resend;
- UI clearly distinguishes "unknown" from "failed."

## Scenario 10: Two agents edit the same opportunity

ID: `SCN-10`

Required solution:
- optimistic concurrency/version checks;
- stale command rejection;
- conflict UI showing changed facts;
- semantic merge only for explicitly mergeable fields;
- no last-writer-wins for state transitions.

## Scenario 11: Evidence becomes stale during a long sales cycle

ID: `SCN-11`

Required solution:
- effective-current evidence projection;
- evidence expiry/refresh policies;
- transition checks reevaluate required evidence;
- refresh obligations generated without destroying historical evidence.

## Scenario 12: A customer says something that contradicts the ICP

ID: `SCN-12`

Required solution:
- contradiction linked to ICP/market/problem hypotheses;
- counterevidence queue;
- learning agent surfaces repeated contradictions;
- thresholds may require reevaluation, not automatic strategy rewrite.

## Scenario 13: A conference generates 80 conversations in one day

ID: `SCN-13`

Required solution:
- mobile rapid capture;
- offline/poor-connectivity staging if feasible;
- voice-to-structured-note integration boundary;
- rapid tags;
- contact dedupe;
- minimal required fields at capture;
- deferred enrichment queue;
- automatic follow-up obligations;
- event attribution without claiming causality.

## Scenario 14: User takes a photo of a badge/business card

ID: `SCN-14`

Required solution:
- optional document/image ingestion boundary;
- extracted text is candidate data until reviewed;
- source artifact provenance;
- no sensitive/irrelevant data retained unnecessarily;
- identity resolution before creating duplicate contact.

## Scenario 15: Meeting notes contain multiple commitments

ID: `SCN-15`

Required solution:
- extract candidate obligations separately;
- human/agent review;
- assign owner, due window, dependency, opportunity/campaign relationship;
- completion evidence;
- unresolved commitments visible in opportunity blockers.

## Scenario 16: Customer asks a technical question during outreach

ID: `SCN-16`

Required solution:
- classify Question;
- stop generic sequence;
- create response obligation;
- retrieve approved technical evidence/assets;
- require review when answer contains consequential claim;
- response becomes relationship/opportunity evidence.

## Scenario 17: Pricing differs by customer

ID: `SCN-17`

Required solution:
- pricing/proposal domain separated from generic content;
- authorization policy;
- versioned offer;
- expiry;
- approval thresholds;
- never allow a content agent to invent price/discount.

## Scenario 18: Referral introduces three people

ID: `SCN-18`

Required solution:
- referral as first-class relationship event;
- preserve referrer;
- create candidate contacts without marking them opted into marketing;
- contextual outreach policy distinct from cold marketing;
- measure referral path.

## Scenario 19: One organization has several simultaneous problems

ID: `SCN-19`

Required solution:
- multiple leads/opportunities can reference same organization;
- do not collapse organization into one pipeline stage;
- opportunity/problem-specific obligations and evidence;
- shared relationship context.

## Scenario 20: One problem maps to several Echelon offerings

ID: `SCN-20`

Required solution:
- OfferingFit assessment with evidence;
- options can coexist;
- recommendation retains alternatives;
- avoid prematurely locking problem to first product.

## Scenario 21: New offering emerges from repeated conversations

ID: `SCN-21`

Required solution:
- cluster problem evidence/customer language;
- detect repeated unmet need;
- create candidate OfferingHypothesis;
- trace back to source conversations;
- run explicit market/offer experiment before making it canonical.

## Scenario 22: A channel changes API capability or policy

ID: `SCN-22`

Required solution:
- runtime/provider capability registry;
- provider contract version;
- integration health;
- feature degradation instead of corrupt state;
- obligations for unsupported pending actions;
- no core-domain assumption that every provider can publish/search/message.

## Scenario 23: API rate limit hits mid-campaign

ID: `SCN-23`

Required solution:
- provider-aware rate budget;
- backpressure;
- resumable effect queue;
- priority;
- retry-after handling;
- campaign remains logically Active while individual effects are delayed;
- operational status distinct from commercial state.

## Scenario 24: Website visitor becomes known later

ID: `SCN-24`

Required solution:
- anonymous session data remains privacy-bounded;
- identity stitching only when permitted and evidenced;
- historical attribution can be linked without claiming certainty;
- confidence/provenance retained.

## Scenario 25: Multiple touches precede a sale

ID: `SCN-25`

Required solution:
- attribution model as analysis, not fact;
- preserve complete touch timeline;
- support first/last/equal/time-decay/custom analytical models;
- revenue outcome remains factual while attributed contribution remains modeled.

## Scenario 26: Campaign is successful but unprofitable

ID: `SCN-26`

Required solution:
- revenue, gross margin where available, human effort, agent/API cost, advertising/event cost, and opportunity cost;
- value-realization analysis;
- success criteria may include economic thresholds, not only conversions.

## Scenario 27: Agent/API costs spike

ID: `SCN-27`

Required solution:
- per-agent/model/workflow/campaign budgets;
- budget obligations/stop rules;
- cheaper research stages before expensive synthesis;
- cache/reuse prior evidence;
- cost anomaly signal;
- require approval above thresholds.

## Scenario 28: Research source disappears

ID: `SCN-28`

Required solution:
- retain citation/reference metadata and permitted snapshot/hash;
- derived evidence does not pretend source is still available;
- verification state can degrade;
- high-consequence claims may require re-verification.

## Scenario 29: Two sources repeat the same underlying press release

ID: `SCN-29`

Required solution:
- evidence dependency/lineage graph;
- do not count derivative sources as independent corroboration;
- identify shared origin when known;
- evidence-strength calculation must account for dependency.

## Scenario 30: Evidence forms a circular support chain

ID: `SCN-30`

Required solution:
- evidence dependency-cycle validation;
- conclusions cannot support their own premises through derived artifacts;
- graph diagnostics identify cycles.

## Scenario 31: Agent hallucinates a company fact

ID: `SCN-31`

Required solution:
- sourced-fact fields require evidence reference;
- unsourced output stored as hypothesis/candidate interpretation;
- publication/qualification policies reject unsupported factual claims;
- corrections propagate to affected projections.

## Scenario 32: Human overrides agent recommendation

ID: `SCN-32`

Required solution:
- override is legal;
- preserve recommendation and human decision separately;
- capture rationale optionally/when policy requires;
- learn from outcome without treating disagreement as agent error by definition.

## Scenario 33: Human approves copy, then agent edits one sentence

ID: `SCN-33`

Required solution:
- approval bound to content hash/version;
- modification invalidates approval;
- trivial-formatting policy MAY permit defined non-semantic transformations.

## Scenario 34: Opportunity appears dead, then resurfaces a year later

ID: `SCN-34`

Required solution:
- Dormant/Reopen lifecycle;
- historical evidence retained;
- stale facts refreshed;
- prior objections/alternatives available;
- new cycle distinguishable from original interaction history.

## Scenario 35: Customer has a negative experience

ID: `SCN-35`

Required solution:
- relationship risk signal;
- suppress inappropriate automated marketing;
- escalation obligation;
- preserve complaint and resolution context with appropriate access controls;
- do not let campaign optimization override relationship safety.

## Scenario 36: Sensitive information enters notes accidentally

ID: `SCN-36`

Required solution:
- data classification;
- redaction/removal workflow;
- restricted fields/artifacts;
- retention policy;
- audit without unnecessarily reproducing removed sensitive content;
- agents receive least data necessary.

## Scenario 37: GitHub repository grows too large

ID: `SCN-37`

Required solution:
- storage abstraction at domain boundary;
- projections/indexes;
- archival policy;
- external artifact references;
- migration/export capability;
- performance telemetry;
- GitHub remains initial implementation, not permanent domain assumption.

## Scenario 38: User needs answer on phone in 30 seconds

ID: `SCN-38`

Required solution:
- decision-oriented home screen;
- saved views;
- command/search palette;
- "needs my attention" projection;
- cached/current projections;
- progressive detail;
- avoid forcing repository navigation.

## Scenario 39: User asks "what should I do next?"

ID: `SCN-39`

Required solution:
- NextBestWork projection built from obligations, deadlines, expected value, reversibility, evidence gaps, relationship timing, and human-only approvals;
- explanation required;
- it is decision support, not opaque prioritization.

## Scenario 40: Several agents can work in parallel

ID: `SCN-40`

Required solution:
- WorkClaim/lease or equivalent;
- dedupe semantically equivalent research tasks;
- bounded concurrency;
- shared evidence cache;
- conflict detection;
- cancellation when upstream hypothesis is invalidated;
- results merged through domain transitions, not shared mutable files.

## Scenario 41: Research never ends

ID: `SCN-41`

Required solution:
- research stopping criteria;
- evidence sufficiency policies;
- time/cost budget;
- diminishing-return detection;
- explicit decision to continue, test, defer, or reject.

## Scenario 42: No evidence is found

ID: `SCN-42`

Required solution:
- NegativeKnowledge with search scope, sources, method, time, expected evidence, and expiry;
- absence is not automatically evidence of absence;
- repeated scoped negative searches may influence confidence according to policy.

## Scenario 43: Competitor launches similar offering

ID: `SCN-43`

Required solution:
- competitor signal;
- compare positioning, evidence, buyer, pricing if legitimately available, and differentiation;
- trigger hypothesis review;
- do not automatically copy competitor strategy.

## Scenario 44: Client wants a custom engagement

ID: `SCN-44`

Required solution:
- Opportunity can create EngagementHypothesis/solution configuration without requiring a pre-existing catalog SKU;
- reusable capabilities linked to custom configuration;
- learn whether custom patterns should become standard offerings.

## Scenario 45: Existing client presents expansion opportunity

ID: `SCN-45`

Required solution:
- customer/account relationship context;
- expansion opportunity distinct from acquisition;
- existing commitments and delivery outcomes inform evidence;
- outreach policies distinguish customer success from prospecting.

## Scenario 46: Marketing creates more qualified work than delivery can handle

ID: `SCN-46`

Required solution:
- capacity signal;
- commercial throttling;
- promised-start constraints;
- campaign pacing;
- avoid creating demand the business cannot responsibly service;
- integrate future operational capacity source through a boundary.

## Scenario 47: A campaign targets different countries

ID: `SCN-47`

Required solution:
- jurisdiction/channel policy attached to recipient/context;
- do not assume one outreach rule applies globally;
- policy version/effective date retained;
- uncertain compliance blocks consequential automation pending review.

## Scenario 48: User wants to know why a recommendation changed

ID: `SCN-48`

Required solution:
- decision/recommendation provenance;
- prior projection retained;
- identify new/expired/contradictory evidence and policy changes;
- reproducible explanation.

## Scenario 49: System makes a bad recommendation

ID: `SCN-49`

Required solution:
- outcome linked to decision;
- retrospective;
- distinguish bad evidence, missing evidence, flawed interpretation, policy defect, execution defect, and irreducible uncertainty;
- feed learning into requirements/experiments rather than silently tuning an opaque score.

## Scenario 50: Business adds a completely new market

ID: `SCN-50`

Required solution:
- no code change should be required merely to represent a new market/ICP/problem/offer;
- policy and domain configuration are versioned data;
- specialized integrations remain optional;
- core lifecycle remains reusable.
