namespace Mercatus.Domain

open System
open Mercatus.Domain.Decide

/// Observation (DSM-04, TRN-OBSERVATION). The original source is immutable;
/// interpretation lives on Evidence, not here.
module Observation =
    type Core =
        { Id: ObservationRef
          Source: string
          ObservedAt: DateTimeOffset
          CapturedAt: DateTimeOffset }

    [<RequireQualifiedAccess>]
    type State =
        | Captured of Core
        | Normalized of Core
        | Reviewed of Core
        | PromotedToEvidence of Core * evidence: EvidenceRef
        | Dismissed of Core * reason: string
        | Superseded of Core * by: ObservationRef

    [<RequireQualifiedAccess>]
    type Command =
        | Normalize
        | Review
        | Promote of newEvidence: EvidenceRef
        | Dismiss of reason: string
        | Supersede of by: ObservationRef

    let stateName =
        function
        | State.Captured _ -> "Captured"
        | State.Normalized _ -> "Normalized"
        | State.Reviewed _ -> "Reviewed"
        | State.PromotedToEvidence _ -> "PromotedToEvidence"
        | State.Dismissed _ -> "Dismissed"
        | State.Superseded _ -> "Superseded"

    let commandName =
        function
        | Command.Normalize -> "Normalize"
        | Command.Review -> "Review"
        | Command.Promote _ -> "Promote"
        | Command.Dismiss _ -> "Dismiss"
        | Command.Supersede _ -> "Supersede"

    let core =
        function
        | State.Captured c
        | State.Normalized c
        | State.Reviewed c
        | State.PromotedToEvidence(c, _)
        | State.Dismissed(c, _)
        | State.Superseded(c, _) -> c

    let decide (ctx: Ctx) (cmd: Command) (state: State) =
        let go rule cap invalid missing target =
            transition ctx { Command = commandName cmd; From = stateName state; Rule = rule; Capability = cap } invalid missing target

        let c = core state

        match state, cmd with
        | State.Captured _, Command.Normalize ->
            go AgentOrHuman (Some CanNormalize) [ if blank c.Source then "the source reference is required" ] [] (State.Normalized c)
        | State.Normalized _, Command.Review -> go AgentOrHuman (Some CanReview) [] [] (State.Reviewed c)
        | State.Reviewed _, Command.Promote e -> go AgentOrHuman (Some CanPromote) [] [] (State.PromotedToEvidence(c, e))
        | (State.Captured _ | State.Normalized _ | State.Reviewed _), Command.Dismiss reason ->
            go AgentOrHuman (Some CanDismiss) [ if blank reason then "a reason is required" ] [] (State.Dismissed(c, reason))
        | (State.Captured _ | State.Normalized _ | State.Reviewed _), Command.Supersede by ->
            go AgentOrHuman (Some CanSupersede) [ if by = c.Id then "an observation cannot supersede itself" ] [] (State.Superseded(c, by))
        | s, k -> illegal (stateName s) (commandName k)

/// Evidence (DSM-05, TRN-EVIDENCE). There is no stored Stale state:
/// freshness is `effectiveCurrent`, a projection over the clock (FND-15).
module Evidence =
    type Origin =
        | SourceEvidence
        | AgentInference

    type Core =
        { Id: EvidenceRef
          Claim: string
          Scope: string
          Source: string
          Observations: ObservationRef list
          Origin: Origin }

    [<RequireQualifiedAccess>]
    type State =
        | Candidate of Core
        | Accepted of Core * Validity
        | Contested of Core * Validity * contradictions: EvidenceRef NonEmptyList
        | Superseded of Core * by: EvidenceRef
        | Invalidated of Core * reason: string

    [<RequireQualifiedAccess>]
    type Command =
        | Accept of Validity
        | Contest of contradiction: EvidenceRef
        | Uphold of rationale: string
        | Supersede of by: EvidenceRef
        | Invalidate of reason: string

    let stateName =
        function
        | State.Candidate _ -> "Candidate"
        | State.Accepted _ -> "Accepted"
        | State.Contested _ -> "Contested"
        | State.Superseded _ -> "Superseded"
        | State.Invalidated _ -> "Invalidated"

    let commandName =
        function
        | Command.Accept _ -> "Accept"
        | Command.Contest _ -> "Contest"
        | Command.Uphold _ -> "Uphold"
        | Command.Supersede _ -> "Supersede"
        | Command.Invalidate _ -> "Invalidate"

    let core =
        function
        | State.Candidate c
        | State.Accepted(c, _)
        | State.Contested(c, _, _)
        | State.Superseded(c, _)
        | State.Invalidated(c, _) -> c

    /// The freshness projection: only accepted or contested evidence inside
    /// its validity window is current at `now`.
    let effectiveCurrent (now: DateTimeOffset) =
        function
        | State.Accepted(_, v)
        | State.Contested(_, v, _) -> if Validity.covers now v then Current else Stale
        | State.Candidate _
        | State.Superseded _
        | State.Invalidated _ -> NotAccepted

    let decide (ctx: Ctx) (cmd: Command) (state: State) =
        let go rule cap invalid missing target =
            transition ctx { Command = commandName cmd; From = stateName state; Rule = rule; Capability = cap } invalid missing target

        let c = core state

        match state, cmd with
        | State.Candidate _, Command.Accept validity ->
            go HumanOnly (Some CanAccept)
                [ if blank c.Claim then "a claim is required"
                  if blank c.Scope then "a scope is required"
                  if blank c.Source then "a source is required"
                  if not (Validity.isWellFormed validity) then "the validity window must end after it starts" ]
                [ if List.isEmpty c.Observations then MissingInformation "observation references" ]
                (State.Accepted(c, validity))
        | State.Accepted(_, v), Command.Contest e ->
            go AgentOrHuman (Some CanContest) [ if e = c.Id then "evidence cannot contradict itself" ] []
                (State.Contested(c, v, NonEmptyList.singleton e))
        | State.Contested(_, v, _), Command.Uphold rationale ->
            go HumanOnly (Some CanAccept) [ if blank rationale then "a rationale is required" ] [] (State.Accepted(c, v))
        | (State.Accepted _ | State.Contested _), Command.Supersede by ->
            go AgentOrHuman (Some CanSupersede) [ if by = c.Id then "evidence cannot supersede itself" ] [] (State.Superseded(c, by))
        | (State.Candidate _ | State.Accepted _ | State.Contested _), Command.Invalidate reason ->
            go HumanOnly (Some CanInvalidate) [ if blank reason then "a reason is required" ] [] (State.Invalidated(c, reason))
        | s, k -> illegal (stateName s) (commandName k)
