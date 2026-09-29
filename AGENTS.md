# Agent Operating Guide

## Execution discipline

- Preserve existing repository behavior and user work.
- Make incremental commits and pushes at coherent recovery boundaries so another agent can resume from the branch.
- Keep working after an incremental push when independent in-scope work remains.
- Do not wait for remote CI after every push.
- Run local checks when they materially inform implementation.
- Inspect remote CI/build status at the final implementation boundary by default.
- Inspect it earlier only when the result gates the next action, protects a high-risk boundary, or is required for release, publication, or merge.
- Never treat queued, cancelled, unavailable, or unobserved CI as passing.
- Do not add dependencies or frameworks without an explicit repository need.
- Record unresolved risks and next actions in the work item or pull request.

## CI batching

Ordinary commit-driven validation uses a 10-minute quiet-period debounce. A newer
push to the same ref should supersede the older waiting run. Explicit manual
commands and irreversible release/publish work stay immediate unless the
debounce occurs in a separate cancellable gate before side effects begin.
