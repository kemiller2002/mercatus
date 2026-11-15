/// Domain guards the transition tables state in prose (AC-04, AC-05, AC-06,
/// AC-07, AC-11), plus a pure walk through the first slice (part of AC-02).
module Mercatus.Domain.Tests.GuardTests

open Xunit
open Mercatus.Domain
open Mercatus.Domain.Tests.Conformance
open Mercatus.Domain.Tests.Samples

let human = ctxFor Human Capability.all
let researcher = ctxFor Agent [ CanResearch; CanNormalize; CanReview; CanPromote; CanContest; CanWeaken; CanStartResearch ]
let staleFor (stale: EvidenceRef list) ctx = { ctx with EvidenceStatus = fun r -> if List.contains r stale then Stale else Current }

let missing =
    function
    | Deferred ms -> NonEmptyList.toList ms
    | _ -> []

let violations =
    function
    | Rejected vs -> NonEmptyList.toList vs
    | _ -> []

let target (result: TransitionResult<Transitioned<'s>>) : 's option =
    match result with
    | Accepted events -> Some events.Head.To
    | _ -> None

// AC-05: stale evidence cannot satisfy a current-evidence requirement.
[<Fact>]
let ``stale evidence defers Lead.Qualify`` () =
    let r = Lead.decide (staleFor [ e1 ] human) (Lead.Command.Qualify LEAD.assessment) (Lead.State.QualificationPending(LEAD.c, [ "fit" ]))
    Assert.Equal<MissingRequirement list>([ EvidenceNotCurrent(e1, Stale) ], missing r)

[<Fact>]
let ``stale evidence defers ProblemHypothesis.Corroborate and MarketHypothesis.Support`` () =
    let corroborate = ProblemHypothesis.decide (staleFor [ e2 ] human) (ProblemHypothesis.Command.Corroborate [ e1; e2 ]) (ProblemHypothesis.State.Investigating PH.c)
    let support = MarketHypothesis.decide (staleFor [ e1 ] human) (MarketHypothesis.Command.Support [ e1 ]) (MarketHypothesis.State.Testing(MH.c, "EXP-1"))
    Assert.Equal<MissingRequirement list>([ EvidenceNotCurrent(e2, Stale) ], missing corroborate)
    Assert.Equal<MissingRequirement list>([ EvidenceNotCurrent(e1, Stale) ], missing support)

[<Fact>]
let ``freshness is a projection over the clock, not a stored state`` () =
    let accepted = Evidence.State.Accepted(EV.c, EV.v)
    Assert.Equal(Current, Evidence.effectiveCurrent now accepted)
    Assert.Equal(Stale, Evidence.effectiveCurrent (now.AddDays 81.0) accepted)
    Assert.Equal(NotAccepted, Evidence.effectiveCurrent now (Evidence.State.Candidate EV.c))

// AC-06: Support waits for the counter-evidence review.
[<Fact>]
let ``an open FindCounterEvidence obligation defers MarketHypothesis.Support`` () =
    let review =
        Obligation.State.Open
            { Id = ObligationRef "OB-CE"; Kind = "FindCounterEvidence"; Subject = "MH-1"
              Blocks = Set.ofList [ "Support" ]; Expirable = false; Due = None }

    let ctx = { human with BlockingFor = Obligation.blocking [ review ] "MH-1" }
    let r = MarketHypothesis.decide ctx (MarketHypothesis.Command.Support [ e1 ]) (MarketHypothesis.State.Testing(MH.c, "EXP-1"))
    Assert.Equal<MissingRequirement list>([ OpenObligation(ObligationRef "OB-CE") ], missing r)

[<Fact>]
let ``only open obligations on the same subject block`` () =
    let ob subject = { OBL.c with Subject = subject; Blocks = Set.ofList [ "Support" ] }
    let obligations = [ Obligation.State.Open(ob "MH-1"); Obligation.State.Satisfied(ob "MH-1", [ e1 ]); Obligation.State.Open(ob "MH-2") ]
    Assert.Equal<ObligationRef list>([ OBL.c.Id ], Obligation.blocking obligations "MH-1" "Support")
    Assert.Empty(Obligation.blocking obligations "MH-1" "Reject")

// AC-07: the agent boundary.
[<Fact>]
let ``a researcher agent can research but cannot accept evidence, qualify, convert or mark Won`` () =
    Assert.True((target (Lead.decide researcher Lead.Command.StartResearch (Lead.State.Discovered LEAD.c))).IsSome)
    let denied r = violations r |> List.exists (function ActorNotPermitted(HumanOnly, Agent) -> true | _ -> false)
    Assert.True(denied (Evidence.decide researcher (Evidence.Command.Accept EV.v) (Evidence.State.Candidate EV.c)))
    Assert.True(denied (Lead.decide researcher (Lead.Command.Qualify LEAD.assessment) (Lead.State.QualificationPending(LEAD.c, [ "fit" ]))))
    Assert.True(denied (Lead.decide researcher (Lead.Command.ConvertToOpportunity "OPP-1") (Lead.State.Qualified(LEAD.c, LEAD.assessment))))
    Assert.True(denied (Opportunity.decide researcher (Opportunity.Command.MarkWon OPP.outcome) (Opportunity.State.Negotiation OPP.c)))

// Missing information becomes a requirement, never a fabricated value (DSM-08).
[<Fact>]
let ``an unassessed qualification dimension defers Qualify`` () =
    let r = Lead.decide human (Lead.Command.Qualify [ "fit", [ e1 ] ]) (Lead.State.QualificationPending(LEAD.c, [ "fit"; "budget" ]))
    Assert.Equal<MissingRequirement list>([ MissingInformation "qualification dimension 'budget'" ], missing r)

[<Fact>]
let ``corroboration needs two independent evidence items and an explicit actor and consequence`` () =
    let bare = { PH.c with AffectedActor = None; Consequence = None }
    let r = ProblemHypothesis.decide human (ProblemHypothesis.Command.Corroborate [ e1; e1 ]) (ProblemHypothesis.State.Investigating bare)

    Assert.Equal<MissingRequirement list>(
        [ MissingInformation "affected actor"; MissingInformation "consequence"; MissingInformation "two independent evidence items" ],
        missing r)

[<Fact>]
let ``MarkTestable waits for a population and explicit assumptions`` () =
    let r = MarketHypothesis.decide human MarketHypothesis.Command.MarkTestable (MarketHypothesis.State.Researching { MH.c with Population = None; Assumptions = [] })
    Assert.Equal<MissingRequirement list>([ MissingInformation "defined population"; MissingInformation "explicit assumptions" ], missing r)

// Rejected for malformed input; the input never reaches state.
[<Fact>]
let ``evidence with a backwards validity window is rejected`` () =
    let r = Evidence.decide human (Evidence.Command.Accept { ValidFrom = now; ValidUntil = now.AddDays -1.0 }) (Evidence.State.Candidate EV.c)
    Assert.Equal<Violation list>([ InvalidInput "the validity window must end after it starts" ], violations r)

[<Fact>]
let ``a legal-deadline obligation never expires silently`` () =
    let system = ctxFor System []
    let r = Obligation.decide system Obligation.Command.Expire (Obligation.State.Open { OBL.c with Kind = "OptOutDeadline"; Expirable = false })
    Assert.Equal<Violation list>([ InvalidInput "obligation kind 'OptOutDeadline' never expires silently" ], violations r)
    let early = Obligation.decide system Obligation.Command.Expire (Obligation.State.Open { OBL.c with Due = Some(now.AddDays 1.0) })
    Assert.Equal<Violation list>([ InvalidInput "the obligation is not yet due" ], violations early)

// AC-11: a learning record records a result for every request it made.
[<Fact>]
let ``applying a learning record requires a result for every request`` () =
    let r = LearningRecord.decide (ctxFor System []) (LearningRecord.Command.Apply []) (LearningRecord.State.Accepted LR.c)
    Assert.Equal<Violation list>([ InvalidInput "every requested command must have exactly one recorded result" ], violations r)

// AC-04: Rejected for an illegal state and for a missing capability.
[<Fact>]
let ``illegal transitions and missing capabilities are rejected distinctly`` () =
    let illegal = Opportunity.decide human (Opportunity.Command.MarkWon OPP.outcome) (Opportunity.State.Discovered OPP.c)
    Assert.Equal<Violation list>([ IllegalTransition("Discovered", "MarkWon") ], violations illegal)
    let noGrant = Lead.decide (ctxFor Human []) (Lead.Command.ConvertToOpportunity "OPP-1") (Lead.State.Qualified(LEAD.c, LEAD.assessment))
    Assert.Equal<Violation list>([ MissingCapability CanConvert ], violations noGrant)

/// Apply a decision and return the new state, failing the test otherwise.
let private step (decide: Ctx -> 'c -> 's -> TransitionResult<Transitioned<'s>>) (ctx: Ctx) (cmd: 'c) (state: 's) : 's =
    match target (decide ctx cmd state) with
    | Some next -> next
    | None -> failwithf "expected Accepted for %A from %A" cmd state

// Part of AC-02: the happy path through every slice aggregate, using only decide.
[<Fact>]
let ``the first slice happy path runs from hypothesis to applied learning`` () =
    let mh =
        MarketHypothesis.State.Draft MH.c
        |> step MarketHypothesis.decide human MarketHypothesis.Command.Propose
        |> step MarketHypothesis.decide human MarketHypothesis.Command.StartResearch
        |> step MarketHypothesis.decide human MarketHypothesis.Command.MarkTestable
        |> step MarketHypothesis.decide human (MarketHypothesis.Command.StartTest "EXP-1")

    let ph =
        ProblemHypothesis.State.Draft PH.c
        |> step ProblemHypothesis.decide human (ProblemHypothesis.Command.AttachFirstObservation PH.o)
        |> step ProblemHypothesis.decide human ProblemHypothesis.Command.Investigate
        |> step ProblemHypothesis.decide human (ProblemHypothesis.Command.Corroborate [ e1; e2 ])

    let observation =
        Observation.State.Captured OBS.c
        |> step Observation.decide researcher Observation.Command.Normalize
        |> step Observation.decide researcher Observation.Command.Review
        |> step Observation.decide researcher (Observation.Command.Promote e1)

    let evidence = Evidence.State.Candidate EV.c |> step Evidence.decide human (Evidence.Command.Accept EV.v)

    let org =
        Organization.State.Discovered ORG.c
        |> step Organization.decide researcher Organization.Command.StartResearch
        |> step Organization.decide researcher Organization.Command.CompleteResearch
        |> step Organization.decide researcher (Organization.Command.MarkCandidate [ e1 ])

    let lead =
        Lead.State.Discovered LEAD.c
        |> step Lead.decide researcher Lead.Command.StartResearch
        |> step Lead.decide researcher (Lead.Command.MarkEvidenceReady [ e1 ])
        |> step Lead.decide researcher (Lead.Command.RequestQualification [ "fit" ])
        |> step Lead.decide human (Lead.Command.Qualify LEAD.assessment)
        |> step Lead.decide human (Lead.Command.ConvertToOpportunity "OPP-1")

    let opportunity =
        Opportunity.fromConvertedLead OPP.c
        |> step Opportunity.decide human Opportunity.Command.Qualify
        |> step Opportunity.decide human Opportunity.Command.Explore
        |> step Opportunity.decide human (Opportunity.Command.StartProposal "two days saved per release")
        |> step Opportunity.decide human Opportunity.Command.StartNegotiation
        |> step Opportunity.decide human (Opportunity.Command.MarkWon OPP.outcome)

    let learning =
        LearningRecord.State.Proposed LR.c
        |> step LearningRecord.decide human LearningRecord.Command.Accept
        |> step LearningRecord.decide (ctxFor System []) (LearningRecord.Command.Apply LR.results)

    let supported = mh |> step MarketHypothesis.decide human (MarketHypothesis.Command.Support [ e1 ])

    Assert.Equal("Supported", MarketHypothesis.stateName supported)
    Assert.Equal("Corroborated", ProblemHypothesis.stateName ph)
    Assert.Equal("PromotedToEvidence", Observation.stateName observation)
    Assert.Equal(Current, Evidence.effectiveCurrent now evidence)
    Assert.Equal("Candidate", Organization.stateName org)
    Assert.Equal("Converted", Lead.stateName lead)
    Assert.Equal("Won", Opportunity.stateName opportunity)
    Assert.Equal("Applied", LearningRecord.stateName learning)

[<Fact>]
let ``a converted lead lands in ProblemConfirmed and qualification waits for buyer obligations`` () =
    let entry = Opportunity.fromConvertedLead OPP.c
    Assert.Equal("ProblemConfirmed", Opportunity.stateName entry)
    let ctx = { human with BlockingFor = fun cmd -> if cmd = "Qualify" then [ ObligationRef "OB-DM" ] else [] }
    Assert.Equal<MissingRequirement list>([ OpenObligation(ObligationRef "OB-DM") ], missing (Opportunity.decide ctx Opportunity.Command.Qualify entry))
