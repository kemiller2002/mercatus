module Mercatus.Domain.Tests.ConformanceTests

open Xunit
open Mercatus.Domain.Tests.Conformance
open Mercatus.Domain.Tests.Samples

let private conforms (failures: string list) =
    Assert.True(List.isEmpty failures, String.concat "\n" failures)

[<Fact>]
let ``every first-slice aggregate in the table has a conformance spec`` () =
    let covered =
        set [ MH.spec.Aggregate; PH.spec.Aggregate; OBS.spec.Aggregate; EV.spec.Aggregate; ORG.spec.Aggregate
              LEAD.spec.Aggregate; OPP.spec.Aggregate; OBL.spec.Aggregate; LR.spec.Aggregate ]

    Assert.Equal<Set<string>>(tables |> Map.keys |> Set.ofSeq, covered)

[<Fact>]
let ``MarketHypothesis conforms to TRN-MARKET-HYPOTHESIS`` () = conforms (check MH.spec)

[<Fact>]
let ``ProblemHypothesis conforms to TRN-PROBLEM-HYPOTHESIS`` () = conforms (check PH.spec)

[<Fact>]
let ``Observation conforms to TRN-OBSERVATION`` () = conforms (check OBS.spec)

[<Fact>]
let ``Evidence conforms to TRN-EVIDENCE`` () = conforms (check EV.spec)

[<Fact>]
let ``Organization conforms to TRN-ORGANIZATION`` () = conforms (check ORG.spec)

[<Fact>]
let ``Lead conforms to TRN-LEAD`` () = conforms (check LEAD.spec)

[<Fact>]
let ``Opportunity conforms to TRN-OPPORTUNITY`` () = conforms (check OPP.spec)

[<Fact>]
let ``Obligation conforms to TRN-OBLIGATION`` () = conforms (check OBL.spec)

[<Fact>]
let ``LearningRecord conforms to TRN-LEARNING-RECORD`` () = conforms (check LR.spec)
