# Commercial Learning State Model

This state model prevents Mercatus from confusing awareness, interest, sales, value, and scalable economics.

## ProblemValidation

ID: `CLS-01`
Unobserved -> Anecdotal -> RepeatedObservation -> BuyerConfirmed -> Consequential -> CommerciallyValidated
Alternative exits: Weak, PopulationLimited, Rejected.

CommerciallyValidated requires evidence that a relevant population will expend meaningful resources such as time, access, budget, or organizational effort to address the problem.

## MessageValidation

ID: `CLS-02`
Draft -> Exposed -> Recognized -> Engaging -> ConversationGenerating -> QualifiedConversationGenerating
Alternative exits: Weak, AudienceLimited, TriggerLimited, Rejected.

## OfferValidation

ID: `CLS-03`
Concept -> Discussed -> Requested -> Priced -> Purchased -> Repeated -> Referred
Alternative exits: Weak, PriceMismatch, ScopeMismatch, DeliveryMismatch, Rejected.

## OutcomeValidation

ID: `CLS-04`
Unmeasured -> BaselineDefined -> InterventionDefined -> AwaitingOutcome -> OutcomeObserved -> AttributionReviewed -> RepeatEvidence
Alternative exits: NotImplemented, Confounded, Inconclusive, NegativeOutcome, Unknown.

## DeliveryValidation

ID: `CLS-05`
AdHoc -> Documented -> Repeatable -> Instrumented -> PartiallyProductized -> Scalable
Alternative exits: FounderBound, EvidenceBound, ClientBurdenBound, EconomicallyWeak.

## AcquisitionValidation

ID: `CLS-06`
Unknown -> Reachable -> Responsive -> QualifiedReachable -> RepeatablyAcquirable -> EconomicallyAcquirable.

## ProofValidation

ID: `CLS-07`
Conceptual -> Demonstrated -> InternalUse -> ExternalCase -> MeasuredOutcome -> ReplicatedOutcome.

Transitions cannot skip proof classes merely because later evidence is desired. A MeasuredOutcome is not ReplicatedOutcome.

## Portfolio role

ID: `CLS-08`
OfferingRole states: Unknown, Wedge, Expansion, Retention, Platform, InternalMethod, SupportingCapability, Retired.

This is evidence-driven and may change by population.

## Commercial confidence

ID: `CLS-09`
Do not create a single opaque confidence score. Provide a projection from the independent validation states above, their evidence, recency, sample/population, contradictions, and economics.

## Key invariant

ID: `CLS-10`
Success in one validation dimension must not silently advance another. For example:
- engagement does not validate the problem commercially;
- purchase does not prove outcome;
- outcome does not prove scalable delivery;
- scalable delivery does not prove economical acquisition;
- internal use does not prove external demand.
