/// Valid sample data for every state and command of every first-slice
/// aggregate. All values are synthetic (SDP-01).
module Mercatus.Domain.Tests.Samples

open System
open Mercatus.Domain
open Mercatus.Domain.Tests.Conformance

let e1, e2 = EvidenceRef "EV-1", EvidenceRef "EV-2"

module MH =
    open MarketHypothesis

    let c =
        { Id = "MH-1"
          Proposition = "Regulated mid-market software teams lose release time to manual evidence collection."
          MarketScope = "regulated mid-market software teams"
          Population = Some "teams of 20 to 200 engineers"
          Assumptions = [ "audits recur at least yearly" ] }

    let spec =
        { Aggregate = "MarketHypothesis"
          States =
            [ State.Draft c; State.Proposed c; State.Researching c; State.Testable c; State.Testing(c, "EXP-1")
              State.Supported(c, [ e1 ]); State.Weak(c, [ e2 ]); State.Rejected(c, "contradicted"); State.Dormant(c, "after Q2")
              State.Reopened(c, "new evidence") ]
          Commands =
            [ Command.Propose; Command.StartResearch; Command.MarkTestable; Command.StartTest "EXP-1"; Command.Support [ e1 ]
              Command.Weaken [ e2 ]; Command.Reject "contradicted"; Command.MarkDormant "after Q2"; Command.Reopen "new evidence"
              Command.ResumeResearch ]
          StateName = stateName
          CommandName = commandName
          Decide = decide }

module PH =
    open ProblemHypothesis

    let c =
        { Id = "PH-1"
          Statement = "Audit evidence is assembled by hand before each release."
          AffectedActor = Some "release manager"
          Consequence = Some "release delayed by days"
          Workaround = Recorded "spreadsheet checklist" }

    let o = ObservationRef "OBS-1"

    let spec =
        { Aggregate = "ProblemHypothesis"
          States =
            [ State.Draft c; State.Observed(c, o); State.Investigating c; State.Corroborated(c, [ e1; e2 ])
              State.CommerciallyRelevant(c, [ e1 ]); State.Weak(c, [ e2 ]); State.Rejected(c, "not recurring")
              State.Reopened(c, "new evidence") ]
          Commands =
            [ Command.AttachFirstObservation o; Command.Investigate; Command.Corroborate [ e1; e2 ]
              Command.ConfirmCommercialRelevance [ e1 ]; Command.Weaken [ e2 ]; Command.Reject "not recurring"
              Command.Reopen "new evidence"; Command.ResumeInvestigation ]
          StateName = stateName
          CommandName = commandName
          Decide = decide }

module OBS =
    open Observation

    let c =
        { Id = ObservationRef "OBS-1"
          Source = "fixture forum post (paraphrased)"
          ObservedAt = now.AddDays -3.0
          CapturedAt = now.AddDays -2.0 }

    let spec =
        { Aggregate = "Observation"
          States =
            [ State.Captured c; State.Normalized c; State.Reviewed c; State.PromotedToEvidence(c, e1); State.Dismissed(c, "off topic")
              State.Superseded(c, ObservationRef "OBS-2") ]
          Commands = [ Command.Normalize; Command.Review; Command.Promote e1; Command.Dismiss "off topic"; Command.Supersede(ObservationRef "OBS-2") ]
          StateName = stateName
          CommandName = commandName
          Decide = decide }

module EV =
    open Evidence

    let c =
        { Id = e1
          Claim = "Release managers spend two days per release on audit evidence."
          Scope = "fixture organizations"
          Source = "OBS-1"
          Observations = [ ObservationRef "OBS-1" ]
          Origin = SourceEvidence }

    let v = { ValidFrom = now.AddDays -10.0; ValidUntil = now.AddDays 80.0 }

    let spec =
        { Aggregate = "Evidence"
          States =
            [ State.Candidate c; State.Accepted(c, v); State.Contested(c, v, NonEmptyList.singleton e2); State.Superseded(c, e2)
              State.Invalidated(c, "source retracted") ]
          Commands = [ Command.Accept v; Command.Contest e2; Command.Uphold "contradiction reviewed"; Command.Supersede e2; Command.Invalidate "source retracted" ]
          StateName = stateName
          CommandName = commandName
          Decide = decide }

module ORG =
    open Organization

    let c = { Id = "ORG-1"; Name = "Northwind Assay (fictional)" }

    let spec =
        { Aggregate = "Organization"
          States =
            [ State.Discovered c; State.Researching c; State.Researched c; State.Candidate(c, [ e1 ]); State.Engaging c
              State.ActiveRelationship(c, "interaction INT-1"); State.Inactive(c, "acquired") ]
          Commands =
            [ Command.StartResearch; Command.CompleteResearch; Command.MarkCandidate [ e1 ]; Command.BeginEngagement
              Command.EstablishRelationship "interaction INT-1"; Command.MarkInactive "acquired"; Command.Reactivate "spun out" ]
          StateName = stateName
          CommandName = commandName
          Decide = decide }

module LEAD =
    open Lead

    let c = { Id = "LEAD-1"; Organization = "ORG-1"; Problem = "PH-1" }
    let assessment = [ "fit", [ e1 ] ]

    let spec =
        { Aggregate = "Lead"
          States =
            [ State.Discovered c; State.Researching c; State.EvidenceReady(c, [ e1 ]); State.QualificationPending(c, [ "fit" ])
              State.Qualified(c, assessment); State.Disqualified(c, "no budget", [ e2 ]); State.Deferred(c, "after audit season")
              State.Converted(c, assessment, "OPP-1") ]
          Commands =
            [ Command.StartResearch; Command.MarkEvidenceReady [ e1 ]; Command.RequestQualification [ "fit" ]; Command.Qualify assessment
              Command.Disqualify("no budget", [ e2 ]); Command.Defer "after audit season"; Command.Resume
              Command.ConvertToOpportunity "OPP-1"; Command.Reconsider "budget approved" ]
          StateName = stateName
          CommandName = commandName
          Decide = decide }

module OPP =
    open Opportunity

    let c = { Id = "OPP-1"; Organization = "ORG-1"; Problem = "PH-1" }
    let outcome = { Offering = "evidence diagnostic"; Value = None; TermsRef = Some "TERMS-1" }
    let loss = { Reason = "chose an internal tool"; Alternative = Known "internal tool"; Evidence = [ e2 ] }

    let spec =
        { Aggregate = "Opportunity"
          States =
            [ State.Discovered c; State.Researching c; State.Engaging c; State.ProblemConfirmed c; State.Qualified c; State.Exploring c
              State.Proposal(c, "two days saved per release"); State.Negotiation c; State.Won(c, outcome); State.Lost(c, loss)
              State.Dormant(c, "after reorg"); State.Rejected(c, "outside fit") ]
          Commands =
            [ Command.StartResearch; Command.BeginEngagement "call INT-1"; Command.ConfirmProblem [ e1 ]; Command.Qualify; Command.Explore
              Command.StartProposal "two days saved per release"; Command.StartNegotiation; Command.MarkWon outcome; Command.MarkLost loss
              Command.Reject "outside fit"; Command.MarkDormant "after reorg"; Command.RegressToProblemConfirmed [ e2 ]
              Command.RegressToQualified [ e2 ]; Command.Reopen "budget returned"; Command.Reconsider "fit changed" ]
          StateName = stateName
          CommandName = commandName
          Decide = decide }

module OBL =
    open Obligation

    let c =
        { Id = ObligationRef "OB-9"
          Kind = "FollowUp"
          Subject = "OPP-1"
          Blocks = Set.ofList [ "StartProposal" ]
          Expirable = true
          Due = Some(now.AddDays -1.0) }

    let spec =
        { Aggregate = "Obligation"
          States = [ State.Open c; State.Satisfied(c, [ e1 ]); State.Waived(c, "not needed"); State.Expired c; State.Superseded(c, ObligationRef "OB-10") ]
          Commands = [ Command.Satisfy [ e1 ]; Command.Waive "not needed"; Command.Expire; Command.Supersede(ObligationRef "OB-10"); Command.Reopen "EV-1 invalidated" ]
          StateName = stateName
          CommandName = commandName
          Decide = decide }

module LR =
    open LearningRecord

    let request = { Hypothesis = "MH-1"; Command = "Support" }

    let c =
        { Id = "LR-1"
          Dimension = ProblemValidation
          Sources = NonEmptyList.singleton (FromOutcome "OPP-1")
          Requests = NonEmptyList.singleton request }

    let results = [ { Request = request; Outcome = "Accepted" } ]

    let spec =
        { Aggregate = "LearningRecord"
          States = [ State.Proposed c; State.Accepted c; State.Applied(c, results); State.Discarded(c, "superseded by LR-2") ]
          Commands = [ Command.Accept; Command.Apply results; Command.Discard "superseded by LR-2" ]
          StateName = stateName
          CommandName = commandName
          Decide = decide }
