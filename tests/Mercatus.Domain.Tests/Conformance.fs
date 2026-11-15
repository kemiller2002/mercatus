/// Table conformance (AC-03, TST-01, TST-02, CHK-DOK-02): every aggregate's
/// `decide` must agree with requirements/slice-transitions.json, for every
/// command from every state, including actor rules, capabilities and blocking.
module Mercatus.Domain.Tests.Conformance

open System
open System.IO
open System.Text.Json
open Mercatus.Domain

type Row =
    { Command: string
      From: string list
      To: string
      Actor: string
      Capability: string option }

type Table =
    { Aggregate: string
      States: string list
      Rows: Row list }

let private repoRoot =
    let rec up (dir: DirectoryInfo | null) =
        match dir with
        | null -> failwith "requirements/slice-transitions.json not found above the test directory"
        | d when File.Exists(Path.Combine(d.FullName, "requirements", "slice-transitions.json")) -> d.FullName
        | d -> up d.Parent

    up (DirectoryInfo AppContext.BaseDirectory)

let private str (e: JsonElement) =
    match e.GetString() with
    | null -> failwith "unexpected null string in slice-transitions.json"
    | s -> s

let tables: Map<string, Table> =
    use doc = JsonDocument.Parse(File.ReadAllText(Path.Combine(repoRoot, "requirements", "slice-transitions.json")))
    let strings (e: JsonElement) = [ for x in e.EnumerateArray() -> str x ]

    [ for a in doc.RootElement.GetProperty("aggregates").EnumerateArray() ->
          let id = str (a.GetProperty("id"))

          id,
          { Aggregate = id
            States = [ for s in a.GetProperty("states").EnumerateArray() -> str (s.GetProperty("name")) ]
            Rows =
              [ for c in a.GetProperty("commands").EnumerateArray() ->
                    let cap = c.GetProperty("capability")

                    { Command = str (c.GetProperty("name"))
                      From = strings (c.GetProperty("from"))
                      To = str (c.GetProperty("to"))
                      Actor = str (c.GetProperty("actor"))
                      Capability = if cap.ValueKind = JsonValueKind.Null then None else Some(str cap) } ] } ]
    |> Map.ofList

/// What an aggregate module exposes, plus valid samples of every state and command.
type Spec<'s, 'c> =
    { Aggregate: string
      States: 's list
      Commands: 'c list
      StateName: 's -> string
      CommandName: 'c -> string
      Decide: Ctx -> 'c -> 's -> TransitionResult<Transitioned<'s>> }

let now = DateTimeOffset(2026, 11, 15, 12, 0, 0, TimeSpan.Zero)

let actor kind grants =
    { Id = ActorId "test-actor"
      Kind = kind
      Grants = Set.ofList grants }

let ctxFor kind grants =
    { Now = now
      Actor = actor kind grants
      EvidenceStatus = fun _ -> Current
      BlockingFor = fun _ -> [] }

let private kindFor row =
    match row.Actor with
    | "system" -> System
    | _ -> Human

let private violations =
    function
    | Rejected vs -> NonEmptyList.toList vs
    | _ -> []

/// Every disagreement between the code and the table, as readable strings.
let check (spec: Spec<'s, 'c>) : string list =
    let table = tables.[spec.Aggregate]
    let row cmd state = table.Rows |> List.tryFind (fun r -> r.Command = cmd && List.contains state r.From)
    let stateNames = spec.States |> List.map spec.StateName |> Set.ofList
    let commandNames = spec.Commands |> List.map spec.CommandName |> Set.ofList
    let tableCommands = table.Rows |> List.map (fun r -> r.Command) |> Set.ofList
    let tag = spec.Aggregate

    let coverage =
        [ if stateNames <> Set.ofList table.States then
              sprintf "%s: sample states %A differ from table states %A" tag stateNames (Set.ofList table.States)
          if commandNames <> tableCommands then
              sprintf "%s: sample commands %A differ from table commands %A" tag commandNames tableCommands ]

    let pairs = [ for s in spec.States do for c in spec.Commands -> s, c ]

    let edges =
        pairs
        |> List.collect (fun (s, c) ->
            let sn, cn = spec.StateName s, spec.CommandName c

            match row cn sn with
            | Some r ->
                match spec.Decide (ctxFor (kindFor r) Capability.all) c s with
                | Accepted events when events.Head.To |> spec.StateName = r.To && events.Head.From = sn && events.Head.Command = cn -> []
                | other -> [ sprintf "%s.%s from %s: expected Accepted -> %s, got %A" tag cn sn r.To other ]
            | None ->
                match spec.Decide (ctxFor Human Capability.all) c s with
                | Rejected vs when NonEmptyList.toList vs = [ IllegalTransition(sn, cn) ] -> []
                | other -> [ sprintf "%s.%s from %s: expected IllegalTransition, got %A" tag cn sn other ])

    let legal =
        pairs
        |> List.choose (fun (s, c) -> row (spec.CommandName c) (spec.StateName s) |> Option.map (fun r -> r, s, c))

    let actors =
        legal
        |> List.collect (fun (r, s, c) ->
            let attempt kind = spec.Decide (ctxFor kind Capability.all) c s
            let denied kind = violations (attempt kind) |> List.exists (function ActorNotPermitted _ -> true | _ -> false)
            let accepted kind = match attempt kind with Accepted _ -> true | _ -> false
            let where = sprintf "%s.%s from %s (%s)" tag r.Command (spec.StateName s) r.Actor

            match r.Actor with
            | "human" ->
                [ if not (denied Agent) then where + ": an agent must be denied"
                  if not (denied System) then where + ": the system must be denied" ]
            | "agent-or-human" ->
                [ if not (accepted Agent) then where + ": an agent with the capability must be accepted"
                  if not (denied System) then where + ": the system must be denied" ]
            | "system" ->
                [ if not (denied Human) then where + ": a human must be denied"
                  if not (denied Agent) then where + ": an agent must be denied" ]
            | other -> [ sprintf "%s: unknown actor '%s'" where other ])

    let capabilities =
        legal
        |> List.collect (fun (r, s, c) ->
            let where = sprintf "%s.%s from %s" tag r.Command (spec.StateName s)

            match r.Capability with
            | Some name ->
                match Capability.all |> List.tryFind (fun cap -> Capability.name cap = name) with
                | None -> [ sprintf "%s: capability '%s' does not exist in the domain" where name ]
                | Some cap ->
                    let without = Capability.all |> List.filter ((<>) cap)

                    if violations (spec.Decide (ctxFor (kindFor r) without) c s) |> List.contains (MissingCapability cap) then []
                    else [ sprintf "%s: must require %s" where name ]
            | None ->
                match spec.Decide (ctxFor (kindFor r) []) c s with
                | Accepted _ -> []
                | other -> [ sprintf "%s: the table names no capability, but an actor without grants got %A" where other ])

    let blocking =
        legal
        |> List.collect (fun (r, s, c) ->
            let ob = ObligationRef "OB-1"
            let ctx = { ctxFor (kindFor r) Capability.all with BlockingFor = fun cmd -> if cmd = r.Command then [ ob ] else [] }

            match spec.Decide ctx c s with
            | Deferred missing when NonEmptyList.toList missing |> List.contains (OpenObligation ob) -> []
            | other -> [ sprintf "%s.%s from %s: a blocking obligation must defer it, got %A" tag r.Command (spec.StateName s) other ])

    coverage @ edges @ actors @ capabilities @ blocking
