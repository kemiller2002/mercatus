namespace Mercatus.Domain

open System
open Mercatus.Domain.Decide

/// Obligation (DSM-20, TRN-OBLIGATION). Each obligation declares the commands
/// it blocks on its subject; `blocking` turns open obligations into the
/// `Ctx.BlockingFor` a host passes to any aggregate's `decide`.
module Obligation =
    type Core =
        { Id: ObligationRef
          Kind: string
          Subject: string
          Blocks: Set<string>
          Expirable: bool
          Due: DateTimeOffset option }

    [<RequireQualifiedAccess>]
    type State =
        | Open of Core
        | Satisfied of Core * evidence: EvidenceRef list
        | Waived of Core * rationale: string
        | Expired of Core
        | Superseded of Core * by: ObligationRef

    [<RequireQualifiedAccess>]
    type Command =
        | Satisfy of evidence: EvidenceRef list
        | Waive of rationale: string
        | Expire
        | Supersede of by: ObligationRef
        | Reopen of reason: string

    let stateName =
        function
        | State.Open _ -> "Open"
        | State.Satisfied _ -> "Satisfied"
        | State.Waived _ -> "Waived"
        | State.Expired _ -> "Expired"
        | State.Superseded _ -> "Superseded"

    let commandName =
        function
        | Command.Satisfy _ -> "Satisfy"
        | Command.Waive _ -> "Waive"
        | Command.Expire -> "Expire"
        | Command.Supersede _ -> "Supersede"
        | Command.Reopen _ -> "Reopen"

    let core =
        function
        | State.Open c
        | State.Satisfied(c, _)
        | State.Waived(c, _)
        | State.Expired c
        | State.Superseded(c, _) -> c

    /// Open obligations on `subject` that block `command`.
    let blocking (obligations: State list) (subject: string) (command: string) =
        obligations
        |> List.choose (function
            | State.Open o when o.Subject = subject && Set.contains command o.Blocks -> Some o.Id
            | _ -> None)

    let decide (ctx: Ctx) (cmd: Command) (state: State) =
        let go rule cap invalid missing target =
            transition ctx { Command = commandName cmd; From = stateName state; Rule = rule; Capability = cap } invalid missing target

        let c = core state

        match state, cmd with
        | State.Open _, Command.Satisfy evidence ->
            go AgentOrHuman None [ if List.isEmpty evidence then "satisfying evidence is required" ] (notCurrent ctx evidence)
                (State.Satisfied(c, evidence))
        | State.Open _, Command.Waive rationale ->
            go HumanOnly (Some CanWaive) [ if blank rationale then "a rationale is required (DSM-20)" ] [] (State.Waived(c, rationale))
        | State.Open _, Command.Expire ->
            go SystemOnly None
                [ if not c.Expirable then sprintf "obligation kind '%s' never expires silently" c.Kind
                  match c.Due with
                  | Some due when due <= ctx.Now -> ()
                  | Some _ -> "the obligation is not yet due"
                  | None -> "the obligation has no due time" ]
                [] (State.Expired c)
        | State.Open _, Command.Supersede by ->
            go AgentOrHuman None [ if by = c.Id then "an obligation cannot supersede itself" ] [] (State.Superseded(c, by))
        | State.Satisfied _, Command.Reopen reason ->
            go SystemOnly None [ if blank reason then "the invalidated evidence must be named" ] [] (State.Open c)
        | s, k -> illegal (stateName s) (commandName k)

/// LearningRecord (DSM-23, TRN-LEARNING-RECORD). Applying a record submits
/// ordinary hypothesis commands; it never writes hypothesis state directly.
module LearningRecord =
    /// Exactly one validation dimension per record (CLS-10).
    type ValidationDimension =
        | ProblemValidation
        | MessageValidation
        | OfferValidation
        | OutcomeValidation
        | DeliveryValidation
        | AcquisitionValidation
        | ProofValidation

    type Source =
        | FromOutcome of opportunity: string
        | FromEvidence of EvidenceRef

    /// A hypothesis command the record asks for, described by target and command.
    type Request = { Hypothesis: string; Command: string }

    type Core =
        { Id: string
          Dimension: ValidationDimension
          Sources: Source NonEmptyList
          Requests: Request NonEmptyList }

    /// The recorded TransitionResult of one request, including Deferred.
    type RequestResult = { Request: Request; Outcome: string }

    [<RequireQualifiedAccess>]
    type State =
        | Proposed of Core
        | Accepted of Core
        | Applied of Core * results: RequestResult list
        | Discarded of Core * reason: string

    [<RequireQualifiedAccess>]
    type Command =
        | Accept
        | Apply of results: RequestResult list
        | Discard of reason: string

    let stateName =
        function
        | State.Proposed _ -> "Proposed"
        | State.Accepted _ -> "Accepted"
        | State.Applied _ -> "Applied"
        | State.Discarded _ -> "Discarded"

    let commandName =
        function
        | Command.Accept -> "Accept"
        | Command.Apply _ -> "Apply"
        | Command.Discard _ -> "Discard"

    let core =
        function
        | State.Proposed c
        | State.Accepted c
        | State.Applied(c, _)
        | State.Discarded(c, _) -> c

    let decide (ctx: Ctx) (cmd: Command) (state: State) =
        let go rule cap invalid missing target =
            transition ctx { Command = commandName cmd; From = stateName state; Rule = rule; Capability = cap } invalid missing target

        let c = core state

        match state, cmd with
        | State.Proposed _, Command.Accept -> go HumanOnly (Some CanAcceptLearning) [] [] (State.Accepted c)
        | State.Accepted _, Command.Apply results ->
            let requested = NonEmptyList.toList c.Requests |> Set.ofList
            let recorded = results |> List.map (fun r -> r.Request) |> Set.ofList

            go SystemOnly None
                [ if recorded <> requested then "every requested command must have exactly one recorded result" ]
                [] (State.Applied(c, results))
        | (State.Proposed _ | State.Accepted _), Command.Discard reason ->
            go HumanOnly None [ if blank reason then "a reason is required" ] [] (State.Discarded(c, reason))
        | s, k -> illegal (stateName s) (commandName k)
