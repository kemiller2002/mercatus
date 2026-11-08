# Portfolio Commercial Requirements and Gap Closure

Derived from the Clarity, EDF, HelixNote, and Echelon Foundry go-to-market scenarios.

## 1. Portfolio model

ID: `PCR-01`

The system MUST model Offering independently from Market, ProblemHypothesis, Message, Campaign, and Opportunity.

Initial offerings/capabilities include:
- Clarity;
- Echelon Diagnostic Framework (EDF);
- HelixNote;
- Echelon Foundry advisory/diagnostic engagements.

Offering MUST support:
- type: method, software, service, training, content/productized knowledge, or composite;
- maturity;
- available commercial motions;
- proof level by claim/population;
- target problems;
- target markets/roles;
- prerequisites;
- delivery constraints;
- price/packaging hypotheses;
- related offerings;
- evidence;
- contraindications/poor-fit conditions.

## 2. Problem-first routing

ID: `PCR-02`

Add ProblemPattern as a reusable commercial concept.

A ProblemPattern describes recognizable buyer situations without prematurely selecting an offering.

Examples:
- recurring failure despite repeated fixes;
- consequential decision under uncertainty;
- evidence overload/traceability failure;
- AI spend without measurable value;
- modernization proposed before diagnosis;
- throughput problem with disputed cause.

The system SHOULD route ProblemPattern -> candidate diagnostic question -> candidate offering(s), not keyword -> product pitch.

## 3. Commercial motion

ID: `PCR-03`

Add CommercialMotion.

Examples:
- fixed-scope diagnostic;
- workshop;
- training;
- premium advisory;
- software trial;
- productized report;
- recurring governance;
- implementation;
- book/workbook/content;
- conference session.

CommercialMotion MUST track scalability, delivery effort, human dependency, gross-margin assumptions where known, prerequisites, CTA, conversion path, and expansion path.

This is necessary because the same IP can be monetized differently.

## 4. Offer ladder

ID: `PCR-04`

The system SHOULD model low-friction entry offers and expansion paths.

Example:
problem-led content -> worksheet/self-assessment -> workshop -> diagnostic -> premium advisory -> training/governance/software.

An offer ladder is a hypothesis. The system MUST measure drop-off and conversion at each transition rather than assume the funnel.

## 5. Claim registry

ID: `PCR-05`

Add Claim as a governed first-class concept.

Claim fields:
- exact statement;
- claim type;
- offering;
- audience/population scope;
- evidence links;
- proof level;
- approved channels;
- approval state;
- effective date;
- review/expiry;
- contraindications/limitations.

Marketing agents MUST retrieve approved claims rather than invent benefits.

## 6. Proof asset

ID: `PCR-06`

Add ProofAsset.

Types MAY include case study, demonstration, benchmark, testimonial, code example, workshop result, before/after example, research citation, internal dogfood evidence, and outcome report.

ProofAsset MUST distinguish demonstration from real-world outcome evidence.

## 7. Case study lifecycle

ID: `PCR-07`

CaseStudy states:
Candidate, PermissionReview, Drafting, EvidenceReview, Approved, Published, Restricted, Retired.

Case studies MUST preserve source evidence and permissions. Anonymization MUST not create misleading generality.

## 8. Audience and buying committee

ID: `PCR-08`

Market/ICP alone is insufficient.

Add BuyerRole / StakeholderRole concepts such as economic buyer, technical evaluator, practitioner/user, executive sponsor, legal/compliance reviewer, procurement, blocker, champion, referrer.

Messages and proof SHOULD be role-specific.

## 9. Trigger events

ID: `PCR-09`

Add BuyingTrigger/TriggerPattern as first-class concepts.

Examples:
- recurring incident;
- executive mandate;
- acquisition;
- new AI budget;
- failed implementation;
- vendor renewal;
- rewrite proposal;
- audit;
- litigation/investigation;
- conference;
- leadership change;
- accessibility complaint;
- cost spike.

The system SHOULD measure which triggers actually correlate with engagement and opportunity creation.

## 10. Diagnostic qualification

ID: `PCR-10`

Some Echelon offerings require a diagnostic conversation before a conventional sales pitch.

Add DiagnosticQualification that asks:
- Is the problem consequential?
- Is the cause genuinely uncertain?
- Are multiple plausible explanations present?
- Is evidence available or obtainable?
- Is there authority/budget to act on findings?
- Is independent diagnosis valuable?
- Is Echelon sufficiently independent?
- Are there conflicts or constraints?
- Is the work suitable for a bounded engagement?

## 11. Discovery-question library

ID: `PCR-11`

The system MUST support versioned discovery questions linked to ProblemPattern, BuyerRole, Offering, and commercial stage.

Responses become observations, not automatically facts.

The system SHOULD learn which questions reduce uncertainty most efficiently.

## 12. Objection model

ID: `PCR-12`

Add ObjectionPattern and ObjectionOccurrence.

Examples:
- "We already know the root cause."
- "We need implementation, not another assessment."
- "This sounds like consulting methodology."
- "Why not use ChatGPT directly?"
- "We already have a CRM/knowledge base."
- "We can build this internally."
- "How is this different from ADRs/root-cause analysis/decision matrices?"
- "Where is the proof?"
- "This is too abstract."

The system MUST collect objections verbatim where appropriate, response evidence, outcome, and whether the objection indicates poor fit rather than something to overcome.

## 13. Competitive/alternative framing

ID: `PCR-13`

Alternatives include doing nothing, internal process, generic AI/chat, existing consulting, spreadsheets/docs, CRM/knowledge systems, decision matrices, RCA methods, and specialized software.

The system MUST test alternatives, not merely named competitors.

## 14. Pricing experiments

ID: `PCR-14`

Price is a hypothesis.

Support packaging/price experiments with explicit population, scope, version, approval, result, and ethical/commercial constraints.

The system MUST NOT let agents autonomously discount outside policy.

## 15. Sales-cycle learning

ID: `PCR-15`

Track:
- time from signal to conversation;
- conversation to problem confirmation;
- problem confirmation to paid work;
- reasons for delay;
- reasons for no decision;
- procurement friction;
- delivery-capacity delay;
- expansion/repeat work.

## 16. Content-to-commercial traceability

ID: `PCR-16`

Every strategic content asset SHOULD be linkable to:
ProblemPattern -> MarketHypothesis -> OfferingHypothesis -> Campaign/Experiment -> interactions -> opportunities -> outcomes.

Do not optimize content only for impressions.

## 17. Content atomization

ID: `PCR-17`

One evidence-backed idea SHOULD be reusable into channel-appropriate derivatives while preserving claim scope:
- long article;
- short post;
- diagram;
- email;
- workshop example;
- case vignette;
- conference abstract;
- website section;
- FAQ;
- sales follow-up.

Derivatives retain lineage to the canonical idea/proof.

## 18. CTA experiments

ID: `PCR-18`

CTA is independently testable.

Examples:
- book diagnostic;
- bring a problem to workshop;
- request second opinion;
- download worksheet;
- run self-assessment;
- request case example;
- join training;
- try HelixNote.

The system SHOULD distinguish message failure from CTA failure.

## 19. Website intent capture

ID: `PCR-19`

Website pages SHOULD be organized around problems and use cases as well as products.

The system SHOULD capture privacy-appropriate evidence about which problem pages and proof assets precede meaningful inquiries.

## 20. Referral system

ID: `PCR-20`

Support ReferralSource, ReferralIntroduction, referral context, thank-you/follow-up obligations, resulting opportunity, and repeat-referral evidence.

Do not treat referred contacts as blanket marketing opt-ins.

## 21. Partner/channel hypothesis

ID: `PCR-21`

Support hypotheses around attorneys, investors, fractional executives, agencies, engineering consultancies, accessibility specialists, industry associations, conference organizers, and other complementary channels.

Partner fit requires evidence and conflict checks.

## 22. Workshop as product

ID: `PCR-22`

Workshop MUST be modelable as a repeatable commercial product:
- audience;
- facilitator guide;
- participant artifact;
- duration;
- prerequisites;
- exercises;
- evidence captured;
- CTA/next step;
- outcome measures;
- version.

This is especially relevant to Clarity.

## 23. Diagnostic as product

ID: `PCR-23`

EDF diagnostic MUST support repeatable scoping without pretending every diagnosis is identical:
- intake;
- scope;
- evidence request;
- competing hypotheses;
- investigation plan;
- findings;
- confidence/limitations;
- intervention options;
- deliverable;
- follow-up;
- outcome review.

## 24. HelixNote product-led evidence

ID: `PCR-24`

HelixNote SHOULD support product telemetry that can answer whether users successfully:
- create structured cases;
- add evidence;
- trace claims;
- find contradictions;
- generate useful reports;
- return to long-running cases;
- complete workflows accessibly.

Telemetry MUST respect privacy and data sensitivity.

## 25. Portfolio cross-sell rules

ID: `PCR-25`

Cross-sell is evidence-driven.

The system MAY suggest another Echelon capability when the current work exposes a distinct problem it solves. It MUST explain why and MUST NOT mechanically push the entire portfolio.

## 26. Cannibalization and simplification

ID: `PCR-26`

The system MUST allow evidence to show that two offerings should merge, one should be renamed, or one should remain an internal method rather than a separately marketed product.

Brand architecture is a hypothesis.

## 27. Category comprehension

ID: `PCR-27`

Track whether prospects understand each term without lengthy explanation.

Experiments SHOULD compare named-framework messaging against problem-first language.

If a name adds cognitive load without commercial benefit, the system must surface that evidence.

## 28. Market-language capture

ID: `PCR-28`

Capture exact customer language around problems, desired outcomes, objections, alternatives, urgency, and purchasing.

Marketing generation SHOULD preferentially use validated customer language over internal jargon, while remaining truthful.

## 29. Outcome follow-up

ID: `PCR-29`

Paid engagement completion MUST create future outcome-review obligations where appropriate.

Without follow-up, the portfolio cannot accumulate outcome proof or learn whether recommendations worked.

## 30. Referenceability and permissions

ID: `PCR-30`

Track whether a client/result can be:
- private evidence only;
- anonymized;
- described by industry;
- named;
- quoted/testimonial;
- contacted as a reference.

Permission is versioned and revocable where applicable.

## 31. Delivery capacity and productization

ID: `PCR-31`

For every commercial motion, track estimated founder hours, repeatable components, automation potential, delivery bottlenecks, and dependency on Kevin personally.

The system SHOULD surface opportunities to convert repeated founder work into training, software, templates, or standardized diagnostics.

This requirement supports Echelon's goal of scalable revenue without making hourly consulting the default.

## 32. Portfolio experiment dashboard

ID: `PCR-32`

The system SHOULD answer:
- Which problems produce conversations?
- Which populations care?
- Which triggers create urgency?
- Which messages get meaningful replies?
- Which proof closes credibility gaps?
- Which offers become paid work?
- Which work produces outcomes?
- Which offerings expand?
- Which motions scale without founder time?
- Which assumptions have been disproven?
- What should we stop doing?

No single composite "marketing score" should replace these observations.

## 33. Failure taxonomy

ID: `PCR-33`

Commercial failures SHOULD distinguish:
NoReach, NoAttention, NoProblemRecognition, NoUrgency, NoTrust, NoProof, NoBudget, NoAuthority, WrongRole, WrongMarket, WrongTrigger, WrongOffer, WrongPrice, DeliveryConstraint, ProcurementBlocked, CompetitorChosen, InternalSolution, NoDecision, MessageFailure, CTAFailure, ChannelFailure, and Unknown.

This prevents "campaign failed" from becoming an unhelpful conclusion.

## 34. Portfolio-specific scenario tests

ID: `PCR-34`

The scenario suite MUST include at least:
- Clarity solves a decision problem without EDF;
- EDF discovers the assumed problem is wrong;
- Clarity discovers diagnosis is insufficient and routes to EDF;
- HelixNote is useful without consulting;
- HelixNote evidence triggers EDF investigation;
- EDF findings flow into Clarity without losing evidence provenance;
- a prospect rejects framework terminology but responds to problem language;
- strong engagement produces no commercial intent;
- a workshop produces a qualified diagnostic opportunity;
- a diagnostic produces no implementation work but still creates measurable client value;
- a client needs a custom Echelon engagement not represented by existing offering;
- repeated custom work becomes a candidate productized offering;
- an offering receives attention but fails willingness-to-pay tests;
- an offering works but cannot scale economically;
- cross-sell is inappropriate and is suppressed;
- claim evidence expires before reuse;
- client permission changes after a case study was drafted;
- one buyer role responds while another blocks;
- the same problem appears in a new industry;
- evidence shows an offering name/category should change.
