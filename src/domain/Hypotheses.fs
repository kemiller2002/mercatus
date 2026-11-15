namespace Mercatus.Domain

open Mercatus.Domain.Decide

/// MarketHypothesis (DSM-02, TRN-MARKET-HYPOTHESIS).
module MarketHypothesis =
    type Core =
        { Id: string
          Proposition: string
          MarketScope: string
          Population: string option
          Assumptions: string list }

    [<RequireQualifiedAccess>]
    type State =
        | Draft of Core
        | Proposed of Core
        | Researching of Core
        | Testable of Core
        | Testing of Core * testPlan: string
        | Supported of Core * evidence: EvidenceRef list
        | Weak of Core * evidence: EvidenceRef list
        | Rejected of Core * rationale: string
        | Dormant of Core * revisit: string
        | Reopened of Core * reason: string

    [<RequireQualifiedAccess>]
    type Command =
        | Propose
        | StartResearch
        | MarkTestable
        | StartTest of testPlan: string
        | Support of evidence: EvidenceRef list
        | Weaken of evidence: EvidenceRef list
        | Reject of rationale: string
        | MarkDormant of revisit: string
        | Reopen of reason: string
        | ResumeResearch

    let stateName =
        function
        | State.Draft _ -> "Draft"
        | State.Proposed _ -> "Proposed"
        | State.Researching _ -> "Researching"
        | State.Testable _ -> "Testable"
        | State.Testing _ -> "Testing"
        | State.Supported _ -> "Supported"
        | State.Weak _ -> "Weak"
        | State.Rejected _ -> "Rejected"
        | State.Dormant _ -> "Dormant"
        | State.Reopened _ -> "Reopened"

    let commandName =
        function
        | Command.Propose -> "Propose"
        | Command.StartResearch -> "StartResearch"
        | Command.MarkTestable -> "MarkTestable"
        | Command.StartTest _ -> "StartTest"
        | Command.Support _ -> "Support"
        | Command.Weaken _ -> "Weaken"
        | Command.Reject _ -> "Reject"
        | Command.MarkDormant _ -> "MarkDormant"
        | Command.Reopen _ -> "Reopen"
        | Command.ResumeResearch -> "ResumeResearch"

    let core =
        function
        | State.Draft c
        | State.Proposed c
        | State.Researching c
        | State.Testable c
        | State.Testing(c, _)
        | State.Supported(c, _)
        | State.Weak(c, _)
        | State.Rejected(c, _)
        | State.Dormant(c, _)
        | State.Reopened(c, _) -> c

    let decide (ctx: Ctx) (cmd: Command) (state: State) =
        let go rule cap invalid missing target =
            transition ctx { Command = commandName cmd; From = stateName state; Rule = rule; Capability = cap } invalid missing target

        let c = core state

        match state, cmd with
        | State.Draft _, Command.Propose ->
            go AgentOrHuman (Some CanPropose)
                [ if blank c.Proposition then "proposition is required"
                  if blank c.MarketScope then "market scope is required" ]
                [] (State.Proposed c)
        | State.Proposed _, Command.StartResearch -> go AgentOrHuman (Some CanStartResearch) [] [] (State.Researching c)
        | State.Researching _, Command.MarkTestable ->
            go AgentOrHuman (Some CanMarkTestable) []
                [ if c.Population.IsNone then MissingInformation "defined population"
                  if List.isEmpty c.Assumptions then MissingInformation "explicit assumptions" ]
                (State.Testable c)
        | State.Testable _, Command.StartTest plan ->
            go HumanOnly (Some CanStartTest) [ if blank plan then "a test plan or experiment is required" ] [] (State.Testing(c, plan))
        | State.Testing _, Command.Support evidence ->
            go HumanOnly (Some CanSupport) [ if List.isEmpty evidence then "supporting evidence is required" ]
                (notCurrent ctx evidence) (State.Supported(c, evidence))
        | (State.Testing _ | State.Supported _), Command.Weaken evidence ->
            go AgentOrHuman (Some CanWeaken) [ if List.isEmpty evidence then "contradicting or missing evidence must be cited" ] []
                (State.Weak(c, evidence))
        | (State.Researching _ | State.Testable _ | State.Testing _ | State.Weak _), Command.Reject rationale ->
            go HumanOnly (Some CanReject) [ if blank rationale then "a rationale is required" ] [] (State.Rejected(c, rationale))
        | (State.Proposed _ | State.Researching _ | State.Testable _ | State.Supported _ | State.Weak _), Command.MarkDormant revisit ->
            go HumanOnly (Some CanDormant) [ if blank revisit then "a revisit condition is required" ] [] (State.Dormant(c, revisit))
        | (State.Supported _ | State.Weak _ | State.Rejected _ | State.Dormant _), Command.Reopen reason ->
            go AgentOrHuman (Some CanReopen) [ if blank reason then "a reason is required" ] [] (State.Reopened(c, reason))
        | State.Reopened _, Command.ResumeResearch -> go AgentOrHuman (Some CanStartResearch) [] [] (State.Researching c)
        | s, k -> illegal (stateName s) (commandName k)

/// ProblemHypothesis (DSM-03, TRN-PROBLEM-HYPOTHESIS). Problems are modelled
/// independently of any Echelon solution (PRD-05).
module ProblemHypothesis =
    type Workaround =
        | Recorded of string
        | UnknownWorkaround

    type Core =
        { Id: string
          Statement: string
          AffectedActor: string option
          Consequence: string option
          Workaround: Workaround }

    [<RequireQualifiedAccess>]
    type State =
        | Draft of Core
        | Observed of Core * first: ObservationRef
        | Investigating of Core
        | Corroborated of Core * evidence: EvidenceRef list
        | CommerciallyRelevant of Core * evidence: EvidenceRef list
        | Weak of Core * evidence: EvidenceRef list
        | Rejected of Core * rationale: string
        | Reopened of Core * reason: string

    [<RequireQualifiedAccess>]
    type Command =
        | AttachFirstObservation of ObservationRef
        | Investigate
        | Corroborate of evidence: EvidenceRef list
        | ConfirmCommercialRelevance of evidence: EvidenceRef list
        | Weaken of evidence: EvidenceRef list
        | Reject of rationale: string
        | Reopen of reason: string
        | ResumeInvestigation

    let stateName =
        function
        | State.Draft _ -> "Draft"
        | State.Observed _ -> "Observed"
        | State.Investigating _ -> "Investigating"
        | State.Corroborated _ -> "Corroborated"
        | State.CommerciallyRelevant _ -> "CommerciallyRelevant"
        | State.Weak _ -> "Weak"
        | State.Rejected _ -> "Rejected"
        | State.Reopened _ -> "Reopened"

    let commandName =
        function
        | Command.AttachFirstObservation _ -> "AttachFirstObservation"
        | Command.Investigate -> "Investigate"
        | Command.Corroborate _ -> "Corroborate"
        | Command.ConfirmCommercialRelevance _ -> "ConfirmCommercialRelevance"
        | Command.Weaken _ -> "Weaken"
        | Command.Reject _ -> "Reject"
        | Command.Reopen _ -> "Reopen"
        | Command.ResumeInvestigation -> "ResumeInvestigation"

    let core =
        function
        | State.Draft c
        | State.Observed(c, _)
        | State.Investigating c
        | State.Corroborated(c, _)
        | State.CommerciallyRelevant(c, _)
        | State.Weak(c, _)
        | State.Rejected(c, _)
        | State.Reopened(c, _) -> c

    let decide (ctx: Ctx) (cmd: Command) (state: State) =
        let go rule cap invalid missing target =
            transition ctx { Command = commandName cmd; From = stateName state; Rule = rule; Capability = cap } invalid missing target

        let c = core state

        match state, cmd with
        | State.Draft _, Command.AttachFirstObservation o ->
            go AgentOrHuman (Some CanAttachObservation) [ if blank c.Statement then "a problem statement is required" ] []
                (State.Observed(c, o))
        | State.Observed _, Command.Investigate -> go AgentOrHuman (Some CanInvestigate) [] [] (State.Investigating c)
        | State.Investigating _, Command.Corroborate evidence ->
            go HumanOnly (Some CanCorroborate) []
                [ if c.AffectedActor.IsNone then MissingInformation "affected actor"
                  if c.Consequence.IsNone then MissingInformation "consequence"
                  if List.length (List.distinct evidence) < 2 then MissingInformation "two independent evidence items"
                  yield! notCurrent ctx evidence ]
                (State.Corroborated(c, evidence))
        | State.Corroborated _, Command.ConfirmCommercialRelevance evidence ->
            go HumanOnly (Some CanTestCommercialRelevance) [ if List.isEmpty evidence then "evidence beyond social attention is required" ]
                (notCurrent ctx evidence) (State.CommerciallyRelevant(c, evidence))
        | (State.Investigating _ | State.Corroborated _ | State.CommerciallyRelevant _), Command.Weaken evidence ->
            go AgentOrHuman None [ if List.isEmpty evidence then "contradicting evidence must be cited" ] [] (State.Weak(c, evidence))
        | (State.Observed _ | State.Investigating _ | State.Weak _), Command.Reject rationale ->
            go HumanOnly (Some CanReject) [ if blank rationale then "a rationale is required" ] [] (State.Rejected(c, rationale))
        | (State.Weak _ | State.Rejected _), Command.Reopen reason ->
            go AgentOrHuman (Some CanRevisit) [ if blank reason then "new evidence or a reason is required" ] [] (State.Reopened(c, reason))
        | State.Reopened _, Command.ResumeInvestigation -> go AgentOrHuman (Some CanInvestigate) [] [] (State.Investigating c)
        | s, k -> illegal (stateName s) (commandName k)
