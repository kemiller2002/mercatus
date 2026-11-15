namespace Mercatus.Domain

open Mercatus.Domain.Decide

/// Organization (DSM-06, TRN-ORGANIZATION). DoNotEngage is not a state: it
/// lives in CommunicationEligibility (DSM-07A).
module Organization =
    type Core = { Id: string; Name: string }

    [<RequireQualifiedAccess>]
    type State =
        | Discovered of Core
        | Researching of Core
        | Researched of Core
        | Candidate of Core * fitEvidence: EvidenceRef list
        | Engaging of Core
        | ActiveRelationship of Core * basis: string
        | Inactive of Core * reason: string

    [<RequireQualifiedAccess>]
    type Command =
        | StartResearch
        | CompleteResearch
        | MarkCandidate of fitEvidence: EvidenceRef list
        | BeginEngagement
        | EstablishRelationship of basis: string
        | MarkInactive of reason: string
        | Reactivate of reason: string

    let stateName =
        function
        | State.Discovered _ -> "Discovered"
        | State.Researching _ -> "Researching"
        | State.Researched _ -> "Researched"
        | State.Candidate _ -> "Candidate"
        | State.Engaging _ -> "Engaging"
        | State.ActiveRelationship _ -> "ActiveRelationship"
        | State.Inactive _ -> "Inactive"

    let commandName =
        function
        | Command.StartResearch -> "StartResearch"
        | Command.CompleteResearch -> "CompleteResearch"
        | Command.MarkCandidate _ -> "MarkCandidate"
        | Command.BeginEngagement -> "BeginEngagement"
        | Command.EstablishRelationship _ -> "EstablishRelationship"
        | Command.MarkInactive _ -> "MarkInactive"
        | Command.Reactivate _ -> "Reactivate"

    let core =
        function
        | State.Discovered c
        | State.Researching c
        | State.Researched c
        | State.Candidate(c, _)
        | State.Engaging c
        | State.ActiveRelationship(c, _)
        | State.Inactive(c, _) -> c

    let decide (ctx: Ctx) (cmd: Command) (state: State) =
        let go rule invalid missing target =
            transition ctx { Command = commandName cmd; From = stateName state; Rule = rule; Capability = None } invalid missing target

        let c = core state

        match state, cmd with
        | State.Discovered _, Command.StartResearch -> go AgentOrHuman [] [] (State.Researching c)
        // Open ResolveIdentity / ResolveDuplicate obligations defer this through ctx.BlockingFor.
        | State.Researching _, Command.CompleteResearch -> go AgentOrHuman [] [] (State.Researched c)
        | State.Researched _, Command.MarkCandidate evidence ->
            go AgentOrHuman []
                [ if List.isEmpty evidence then MissingInformation "ICP-fit evidence"
                  yield! notCurrent ctx evidence ]
                (State.Candidate(c, evidence))
        | State.Candidate _, Command.BeginEngagement -> go HumanOnly [] [] (State.Engaging c)
        | State.Engaging _, Command.EstablishRelationship basis ->
            go HumanOnly [ if blank basis then "a recorded interaction or won opportunity is required" ] [] (State.ActiveRelationship(c, basis))
        | (State.Researched _ | State.Candidate _ | State.Engaging _ | State.ActiveRelationship _), Command.MarkInactive reason ->
            go AgentOrHuman [ if blank reason then "a reason is required" ] [] (State.Inactive(c, reason))
        | State.Inactive _, Command.Reactivate reason ->
            go AgentOrHuman [ if blank reason then "a reason is required" ] [] (State.Researching c)
        | s, k -> illegal (stateName s) (commandName k)

/// Lead (DSM-08, TRN-LEAD): a candidate commercial connection, not a person.
module Lead =
    type Core =
        { Id: string
          Organization: string
          Problem: string }

    /// Each policy-selected dimension with the evidence that assesses it.
    type Assessment = (string * EvidenceRef list) list

    [<RequireQualifiedAccess>]
    type State =
        | Discovered of Core
        | Researching of Core
        | EvidenceReady of Core * evidence: EvidenceRef list
        | QualificationPending of Core * dimensions: string list
        | Qualified of Core * Assessment
        | Disqualified of Core * reason: string * evidence: EvidenceRef list
        | Deferred of Core * revisit: string
        | Converted of Core * Assessment * opportunity: string

    [<RequireQualifiedAccess>]
    type Command =
        | StartResearch
        | MarkEvidenceReady of evidence: EvidenceRef list
        | RequestQualification of dimensions: string list
        | Qualify of Assessment
        | Disqualify of reason: string * evidence: EvidenceRef list
        | Defer of revisit: string
        | Resume
        | ConvertToOpportunity of opportunity: string
        | Reconsider of reason: string

    let stateName =
        function
        | State.Discovered _ -> "Discovered"
        | State.Researching _ -> "Researching"
        | State.EvidenceReady _ -> "EvidenceReady"
        | State.QualificationPending _ -> "QualificationPending"
        | State.Qualified _ -> "Qualified"
        | State.Disqualified _ -> "Disqualified"
        | State.Deferred _ -> "Deferred"
        | State.Converted _ -> "Converted"

    let commandName =
        function
        | Command.StartResearch -> "StartResearch"
        | Command.MarkEvidenceReady _ -> "MarkEvidenceReady"
        | Command.RequestQualification _ -> "RequestQualification"
        | Command.Qualify _ -> "Qualify"
        | Command.Disqualify _ -> "Disqualify"
        | Command.Defer _ -> "Defer"
        | Command.Resume -> "Resume"
        | Command.ConvertToOpportunity _ -> "ConvertToOpportunity"
        | Command.Reconsider _ -> "Reconsider"

    let core =
        function
        | State.Discovered c
        | State.Researching c
        | State.EvidenceReady(c, _)
        | State.QualificationPending(c, _)
        | State.Qualified(c, _)
        | State.Disqualified(c, _, _)
        | State.Deferred(c, _)
        | State.Converted(c, _, _) -> c

    /// Every required dimension must be assessed with current evidence;
    /// a gap becomes a missing requirement, never a fabricated value (DSM-08).
    let private assessmentGaps (ctx: Ctx) (dimensions: string list) (assessment: Assessment) =
        let assessed = Map.ofList assessment

        [ for d in dimensions do
              match Map.tryFind d assessed with
              | None
              | Some [] -> MissingInformation(sprintf "qualification dimension '%s'" d)
              | Some evidence -> yield! notCurrent ctx evidence ]

    let decide (ctx: Ctx) (cmd: Command) (state: State) =
        let go rule cap invalid missing target =
            transition ctx { Command = commandName cmd; From = stateName state; Rule = rule; Capability = cap } invalid missing target

        let c = core state

        match state, cmd with
        | State.Discovered _, Command.StartResearch -> go AgentOrHuman (Some CanResearch) [] [] (State.Researching c)
        | State.Researching _, Command.MarkEvidenceReady evidence ->
            go AgentOrHuman None []
                [ if List.isEmpty evidence then MissingInformation "at least one evidence item"
                  yield! notCurrent ctx evidence ]
                (State.EvidenceReady(c, evidence))
        | State.EvidenceReady _, Command.RequestQualification dimensions ->
            go AgentOrHuman None [ if List.isEmpty dimensions then "qualification policy dimensions must be selected" ] []
                (State.QualificationPending(c, dimensions))
        | State.QualificationPending(_, dimensions), Command.Qualify assessment ->
            go HumanOnly (Some CanQualify) [] (assessmentGaps ctx dimensions assessment) (State.Qualified(c, assessment))
        | State.QualificationPending _, Command.Disqualify(reason, evidence) ->
            go HumanOnly (Some CanQualify)
                [ if blank reason then "a reason is required"
                  if List.isEmpty evidence then "evidence is required" ]
                [] (State.Disqualified(c, reason, evidence))
        | State.QualificationPending _, Command.Defer revisit ->
            go AgentOrHuman None [ if blank revisit then "a revisit condition is required" ] [] (State.Deferred(c, revisit))
        | State.Deferred _, Command.Resume -> go AgentOrHuman None [] [] (State.Researching c)
        | State.Qualified(_, assessment), Command.ConvertToOpportunity opportunity ->
            go HumanOnly (Some CanConvert) [ if blank opportunity then "the new opportunity id is required" ] []
                (State.Converted(c, assessment, opportunity))
        | State.Disqualified _, Command.Reconsider reason ->
            go AgentOrHuman None [ if blank reason then "new evidence or a reason is required" ] [] (State.Researching c)
        | s, k -> illegal (stateName s) (commandName k)

/// Opportunity (DSM-09, TRN-OPPORTUNITY).
module Opportunity =
    type Core =
        { Id: string
          Organization: string
          Problem: string }

    /// Required to mark an opportunity Won (DSM-09). `Value = None` means
    /// "not disclosed", never zero.
    type CommercialOutcome =
        { Offering: string
          Value: decimal option
          TermsRef: string option }

    type Alternative =
        | Known of string
        | UnknownAlternative

    type Loss =
        { Reason: string
          Alternative: Alternative
          Evidence: EvidenceRef list }

    [<RequireQualifiedAccess>]
    type State =
        | Discovered of Core
        | Researching of Core
        | Engaging of Core
        | ProblemConfirmed of Core
        | Qualified of Core
        | Exploring of Core
        | Proposal of Core * valueContext: string
        | Negotiation of Core
        | Won of Core * CommercialOutcome
        | Lost of Core * Loss
        | Dormant of Core * revisit: string
        | Rejected of Core * reason: string

    [<RequireQualifiedAccess>]
    type Command =
        | StartResearch
        | BeginEngagement of interaction: string
        | ConfirmProblem of buyerEvidence: EvidenceRef list
        | Qualify
        | Explore
        | StartProposal of valueContext: string
        | StartNegotiation
        | MarkWon of CommercialOutcome
        | MarkLost of Loss
        | Reject of reason: string
        | MarkDormant of revisit: string
        | RegressToProblemConfirmed of evidence: EvidenceRef list
        | RegressToQualified of evidence: EvidenceRef list
        | Reopen of reason: string
        | Reconsider of rationale: string

    let stateName =
        function
        | State.Discovered _ -> "Discovered"
        | State.Researching _ -> "Researching"
        | State.Engaging _ -> "Engaging"
        | State.ProblemConfirmed _ -> "ProblemConfirmed"
        | State.Qualified _ -> "Qualified"
        | State.Exploring _ -> "Exploring"
        | State.Proposal _ -> "Proposal"
        | State.Negotiation _ -> "Negotiation"
        | State.Won _ -> "Won"
        | State.Lost _ -> "Lost"
        | State.Dormant _ -> "Dormant"
        | State.Rejected _ -> "Rejected"

    let commandName =
        function
        | Command.StartResearch -> "StartResearch"
        | Command.BeginEngagement _ -> "BeginEngagement"
        | Command.ConfirmProblem _ -> "ConfirmProblem"
        | Command.Qualify -> "Qualify"
        | Command.Explore -> "Explore"
        | Command.StartProposal _ -> "StartProposal"
        | Command.StartNegotiation -> "StartNegotiation"
        | Command.MarkWon _ -> "MarkWon"
        | Command.MarkLost _ -> "MarkLost"
        | Command.Reject _ -> "Reject"
        | Command.MarkDormant _ -> "MarkDormant"
        | Command.RegressToProblemConfirmed _ -> "RegressToProblemConfirmed"
        | Command.RegressToQualified _ -> "RegressToQualified"
        | Command.Reopen _ -> "Reopen"
        | Command.Reconsider _ -> "Reconsider"

    let core =
        function
        | State.Discovered c
        | State.Researching c
        | State.Engaging c
        | State.ProblemConfirmed c
        | State.Qualified c
        | State.Exploring c
        | State.Proposal(c, _)
        | State.Negotiation c
        | State.Won(c, _)
        | State.Lost(c, _)
        | State.Dormant(c, _)
        | State.Rejected(c, _) -> c

    /// A converted Lead enters at ProblemConfirmed (DSM-08, FND-11).
    let fromConvertedLead (core: Core) = State.ProblemConfirmed core

    let decide (ctx: Ctx) (cmd: Command) (state: State) =
        let go rule cap invalid missing target =
            transition ctx { Command = commandName cmd; From = stateName state; Rule = rule; Capability = cap } invalid missing target

        let c = core state

        match state, cmd with
        | State.Discovered _, Command.StartResearch -> go AgentOrHuman None [] [] (State.Researching c)
        | State.Researching _, Command.BeginEngagement interaction ->
            go HumanOnly None [ if blank interaction then "a recorded interaction is required" ] [] (State.Engaging c)
        | State.Engaging _, Command.ConfirmProblem evidence ->
            go HumanOnly None []
                [ if List.isEmpty evidence then MissingInformation "buyer-sourced problem evidence"
                  yield! notCurrent ctx evidence ]
                (State.ProblemConfirmed c)
        // IdentifyDecisionMaker, IdentifyEconomicBuyer and DefineValueHypothesis defer this through ctx.BlockingFor.
        | State.ProblemConfirmed _, Command.Qualify -> go HumanOnly (Some CanQualify) [] [] (State.Qualified c)
        | State.Qualified _, Command.Explore -> go HumanOnly None [] [] (State.Exploring c)
        | State.Exploring _, Command.StartProposal context ->
            go HumanOnly (Some CanPropose) [ if blank context then "problem and value context are required (DR-OPP-01)" ] []
                (State.Proposal(c, context))
        | State.Proposal _, Command.StartNegotiation -> go HumanOnly None [] [] (State.Negotiation c)
        | State.Negotiation _, Command.MarkWon outcome ->
            go HumanOnly None [ if blank outcome.Offering then "the commercial outcome must name the offering" ] [] (State.Won(c, outcome))
        | (State.Engaging _ | State.ProblemConfirmed _ | State.Qualified _ | State.Exploring _ | State.Proposal _ | State.Negotiation _), Command.MarkLost loss ->
            go HumanOnly None [ if blank loss.Reason then "a reason is required" ] [] (State.Lost(c, loss))
        | (State.Discovered _ | State.Researching _ | State.Engaging _ | State.ProblemConfirmed _ | State.Qualified _), Command.Reject reason ->
            go HumanOnly None [ if blank reason then "Echelon's reason is required" ] [] (State.Rejected(c, reason))
        | (State.Researching _ | State.Engaging _ | State.ProblemConfirmed _ | State.Qualified _ | State.Exploring _ | State.Proposal _ | State.Negotiation _), Command.MarkDormant revisit ->
            go HumanOnly None [ if blank revisit then "a revisit condition is required" ] [] (State.Dormant(c, revisit))
        | (State.Qualified _ | State.Exploring _ | State.Proposal _ | State.Negotiation _), Command.RegressToProblemConfirmed evidence ->
            go HumanOnly None [ if List.isEmpty evidence then "the invalidating evidence is required" ] [] (State.ProblemConfirmed c)
        | (State.Exploring _ | State.Proposal _ | State.Negotiation _), Command.RegressToQualified evidence ->
            go HumanOnly None [ if List.isEmpty evidence then "the invalidating evidence is required" ] [] (State.Qualified c)
        | (State.Lost _ | State.Dormant _), Command.Reopen reason ->
            go AgentOrHuman None [ if blank reason then "new evidence or a revisit condition is required" ] [] (State.Researching c)
        | State.Rejected _, Command.Reconsider rationale ->
            go HumanOnly None [ if blank rationale then "a rationale is required" ] [] (State.Researching c)
        | s, k -> illegal (stateName s) (commandName k)
