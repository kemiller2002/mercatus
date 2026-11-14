# Mercatus research queue

Open questions whose answers change what gets built. Each one names the work
item that owns it. Updated 2026-11-14 (WI-0048); the earlier template rows
about a "communication problem" pilot no longer apply (DF-MERCATUS-DOM-2026-0001).

| Priority | Question | Decision affected | Discriminating evidence | Owner | Status |
|---:|---|---|---|---|---|
| 1 | Where may personal data live so that erasure and retention are possible (crypto-shredding, a separate deletable store, or neither)? | Persistence design for the first slice | Threat and erasure walkthrough against PRD-27 and DSM-22; GitHub history behaviour | WI-0037 | open |
| 2 | What exactly must the first vertical slice demonstrate, and on what data? | PRD-25 scope and definition of done | Numbered acceptance criteria; synthetic-fixture policy | WI-0038 | open |
| 3 | Which legal regimes and provider terms gate any real outbound effect? | Gate B (outreach) | CAN-SPAM, GDPR/ePrivacy, CASL and provider terms, confirmed by counsel | WI-0039, WI-0042 | open |
| 4 | How are agents kept from acting on injected instructions or bypassing transitions? | Agent and storage architecture | Injection test corpus; command-gateway design review | WI-0041 | open |
| 5 | When will Folio be Forma 1.x aligned? | Print documents and icons | `npm run probe:folio-forma` reports 80 icons loaded | WI-0045 | open |
| 6 | Does the single-operator reality change approval and attention design? | Approval surface, attention queue | Owner's operating-mode decision | WI-0044 | open |
