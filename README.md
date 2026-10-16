# Echelon Sales and Marketing

Echelon Sales and Marketing is an evidence-driven commercial intelligence and execution system.

It is not intended to be a conventional CRM, autonomous spam system, social-content factory, or collection of disconnected agents. The system treats sales and marketing as explicit state, evidence, hypotheses, controlled transitions, obligations, experiments, external effects, outcomes, and learning.

## Governing capabilities

This repository is governed by:

- State-Directed Engineering / Ordo
- Repository Operating System (ROS)
- Visual Engineering
- Communication Engineering
- Limen for browser application architecture

See `requirements/` for the canonical product requirements.

## Core loop

Market hypothesis -> problem hypothesis -> evidence -> ICP -> experiment -> campaign -> execution -> result -> learning -> revised belief.

Agents do not turn assumptions into truth. Evidence and interpretation remain distinct, contradictory evidence is retained, and consequential external actions require explicit capability and policy checks.

## Architecture direction

The browser application will use Limen. GitHub is the initial durable backing store. Provider-specific integrations are isolated behind canonical integration contracts. Proton Mail is the initial email integration. Reddit is initially prioritized for listening and market intelligence. Meta, X, LinkedIn, and future providers plug into the same capability-based integration boundary.

## Requirements index

- `requirements/PRODUCT-REQUIREMENTS.md` - canonical product requirements
- `requirements/INTEGRATION-REQUIREMENTS.md` - provider-neutral integration architecture
- `requirements/LEGACY-MARKETING-OS.md` - requirements retained from the predecessor Marketing OS repository
- `requirements/OPPORTUNITY-DISCOVERY.md` - diversification and market exploration requirements
- `requirements/IMPLEMENTATION-PLAN.md` - recommended build order and parallel workstreams

The older `kemiller2002/sales-and-marketing` repository is treated as predecessor research. Relevant concepts have been carried forward here rather than making the new system depend on the old repository.


## Domain engineering

The requirements have been expanded into explicit state-directed design and scenario pressure tests:

- `requirements/DOMAIN-STATE-MODEL.md` - aggregate states, legal transitions, invariants, capabilities, obligations, and cross-aggregate rules
- `requirements/SCENARIOS-AND-EXPANSION.md` - 50 operational/commercial scenarios used to discover missing capabilities
- `requirements/EFFICIENCY-AND-SCALE.md` - projections, progressive enrichment, deduplication, cost controls, human-attention optimization, simulation, replay, and graceful degradation
- `requirements/DOMAIN-VERIFICATION.md` - executable test expectations and architecture checks

The scenario catalog is intended to continue growing. A scenario that exposes an unsafe, inefficient, ambiguous, or unrepresentable condition is treated as requirements evidence.


## Portfolio commercialization pressure test

The system now includes a dedicated commercialization test for Echelon Foundry's current portfolio:

- `requirements/PORTFOLIO-GTM-SCENARIOS.md` - problem-led sales and marketing scenarios for Clarity, EDF, HelixNote, Echelon Foundry, portfolio combinations, distribution experiments, and the proof ladder.
- `requirements/PORTFOLIO-COMMERCIAL-REQUIREMENTS.md` - requirements discovered by trying to sell the portfolio, including ProblemPattern, CommercialMotion, Claim, ProofAsset, buying triggers, diagnostic qualification, objections, CTA experiments, referrals, workshops/diagnostics as products, portfolio cross-sell controls, category-comprehension testing, outcome follow-up, reference permissions, founder-time/productization analysis, and commercial failure taxonomy.

A core rule is that external messaging starts with the buyer's recognizable problem rather than requiring the buyer to understand Echelon's internal framework/product names.

## License

Source available under PolyForm Noncommercial 1.0.0 for permitted noncommercial uses. Commercial use requires a separate license from Echelon Foundry. Previously distributed versions remain subject to the licenses under which they were released.

Commercial licensing information is forthcoming.
