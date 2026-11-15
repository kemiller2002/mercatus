/// Tier 1 and Tier 2 shared kernel (DSM-01, TRN-00). Pure: no I/O, no clock,
/// no mutable state. Everything a transition needs arrives in `Ctx`.
namespace Mercatus.Domain

open System

/// A list that cannot be empty, so "at least one" is a type, not a check.
type NonEmptyList<'a> = { Head: 'a; Tail: 'a list }

module NonEmptyList =
    let singleton x = { Head = x; Tail = [] }
    let toList (xs: NonEmptyList<'a>) = xs.Head :: xs.Tail
    let ofList =
        function
        | [] -> None
        | x :: xs -> Some { Head = x; Tail = xs }
    let length (xs: NonEmptyList<'a>) = 1 + List.length xs.Tail

type EvidenceRef = EvidenceRef of string
type ObligationRef = ObligationRef of string
type ObservationRef = ObservationRef of string
type ActorId = ActorId of string
type EffectId = EffectId of string

/// Capabilities named in DOMAIN-STATE-MODEL and the accepted transition tables.
type Capability =
    | CanPropose
    | CanStartResearch
    | CanMarkTestable
    | CanStartTest
    | CanSupport
    | CanWeaken
    | CanReject
    | CanDormant
    | CanReopen
    | CanAttachObservation
    | CanInvestigate
    | CanCorroborate
    | CanTestCommercialRelevance
    | CanRevisit
    | CanNormalize
    | CanReview
    | CanPromote
    | CanDismiss
    | CanSupersede
    | CanAccept
    | CanContest
    | CanInvalidate
    | CanResearch
    | CanQualify
    | CanConvert
    | CanWaive
    | CanAcceptLearning

module Capability =
    let all =
        [ CanPropose; CanStartResearch; CanMarkTestable; CanStartTest; CanSupport; CanWeaken; CanReject
          CanDormant; CanReopen; CanAttachObservation; CanInvestigate; CanCorroborate
          CanTestCommercialRelevance; CanRevisit; CanNormalize; CanReview; CanPromote; CanDismiss
          CanSupersede; CanAccept; CanContest; CanInvalidate; CanResearch; CanQualify; CanConvert
          CanWaive; CanAcceptLearning ]

    let name (c: Capability) = sprintf "%A" c

type ActorKind =
    | Human
    | Agent
    | System

/// Who may issue a command (TRN-00 actor values).
type ActorRule =
    | HumanOnly
    | AgentOrHuman
    | SystemOnly

/// Actor identity and grants come from the host session, never from a command (C3).
type Actor =
    { Id: ActorId
      Kind: ActorKind
      Grants: Set<Capability> }

/// Freshness is a projection over the clock, never a stored state (DSM-05, FND-15).
type EvidenceStatus =
    | Current
    | Stale
    | NotAccepted
    | UnknownEvidence

type Ctx =
    { Now: DateTimeOffset
      Actor: Actor
      /// Effective-current status of an evidence item at `Now`.
      EvidenceStatus: EvidenceRef -> EvidenceStatus
      /// Open obligations on this aggregate that block the named command.
      BlockingFor: string -> ObligationRef list }

type Violation =
    | IllegalTransition of state: string * command: string
    | MissingCapability of Capability
    | ActorNotPermitted of rule: ActorRule * actor: ActorKind
    | InvalidInput of string

type MissingRequirement =
    | OpenObligation of ObligationRef
    | EvidenceNotCurrent of EvidenceRef * EvidenceStatus
    | MissingInformation of string

/// The five transition outcomes (DSM-01). Tier 2 produces the first three;
/// Conflict and UnknownExternalEffect belong to Tier 3 and effects.
type TransitionResult<'event> =
    | Accepted of 'event NonEmptyList
    | Rejected of Violation NonEmptyList
    | Deferred of MissingRequirement NonEmptyList
    | Conflict of expected: int64 * actual: int64
    | UnknownExternalEffect of EffectId * ObligationRef

/// The event every accepted transition emits. Event metadata such as
/// correlation, causation and policy version is added by Tier 3.
type Transitioned<'state> =
    { Command: string
      From: string
      To: 'state
      At: DateTimeOffset
      By: ActorId }

type Validity =
    { ValidFrom: DateTimeOffset
      ValidUntil: DateTimeOffset }

module Validity =
    let isWellFormed v = v.ValidFrom < v.ValidUntil
    let covers (now: DateTimeOffset) v = v.ValidFrom <= now && now < v.ValidUntil

/// Tier 2 decision helpers shared by every aggregate.
module Decide =
    type Gate =
        { Command: string
          From: string
          Rule: ActorRule
          Capability: Capability option }

    let private permits rule kind =
        match rule, kind with
        | HumanOnly, Human
        | AgentOrHuman, (Human | Agent)
        | SystemOnly, System -> true
        | _ -> false

    let private actorViolations (ctx: Ctx) (gate: Gate) =
        [ if not (permits gate.Rule ctx.Actor.Kind) then
              ActorNotPermitted(gate.Rule, ctx.Actor.Kind)
          match gate.Capability with
          | Some c when not (Set.contains c ctx.Actor.Grants) -> MissingCapability c
          | _ -> () ]

    /// Evidence that does not satisfy a current-evidence requirement.
    let notCurrent (ctx: Ctx) (refs: EvidenceRef list) =
        refs
        |> List.choose (fun r ->
            match ctx.EvidenceStatus r with
            | Current -> None
            | status -> Some(EvidenceNotCurrent(r, status)))

    let blank (s: string) = String.IsNullOrWhiteSpace s

    /// Evaluate a legal edge. Order: who may act, then whether the input is
    /// well formed (Rejected), then what is still missing (Deferred).
    let transition
        (ctx: Ctx)
        (gate: Gate)
        (invalid: string list)
        (missing: MissingRequirement list)
        (target: 'state)
        : TransitionResult<Transitioned<'state>> =
        let violations = actorViolations ctx gate @ List.map InvalidInput invalid
        let waiting = (gate.Command |> ctx.BlockingFor |> List.map OpenObligation) @ missing

        match NonEmptyList.ofList violations, NonEmptyList.ofList waiting with
        | Some v, _ -> Rejected v
        | None, Some w -> Deferred w
        | None, None ->
            Accepted(
                NonEmptyList.singleton
                    { Command = gate.Command
                      From = gate.From
                      To = target
                      At = ctx.Now
                      By = ctx.Actor.Id }
            )

    /// Any command from a state the table does not list (TRN-00).
    let illegal (state: string) (command: string) : TransitionResult<'event> =
        Rejected(NonEmptyList.singleton (IllegalTransition(state, command)))
