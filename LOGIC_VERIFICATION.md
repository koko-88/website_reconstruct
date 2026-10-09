# Logic verification

This is the sole centralized Markdown authority for verification of product intent, requirements,
roadmap coverage, specifications, constitution and cross-artifact consistency. Code/runtime acceptance
and review belong to [implementation verification](IMPLEMENTATION_VERIFICATION.md). Feature criteria
remain in their specifications and linked contracts; these documents define the process, not new scope.

## Checks and acceptance

1. Follow [AGENTS.md](AGENTS.md) ownership. Reconcile constitution, PRODUCT, ROADMAP and the affected
   spec/plan/tasks before implementation. Resolve material contradictions through the owning document.
   Governance maintenance does not advance the roadmap's product-delivery gate.
2. Use installed Spec Kit `speckit-analyze` for cross-artifact analysis and `speckit-checklist` for
   requirements quality. Use `speckit-converge` when comparing completed code to specified intent;
   its runtime evidence is evaluated under implementation verification. These are workflows, not
   additional verification authorities. Do not reproduce them in custom validation frameworks.
3. Check requirement-to-task/test traceability, feature boundaries, dependencies, coverage and
   phase permissions. `[P]` denotes eligibility, never execution approval. Pending user selection
   is not BLOCKED. An unresolved material requirement conflict prevents dependent work.
4. Verify cited paths/anchors and frozen evidence identity with the existing
   [packet checker](implementation-scope/pre-build-packet/verify.py). It checks SR coverage, source
   mechanics, corrections, canonical phase precedence and linked documentation. It cannot certify
   requirement meaning, rights, target behavior or execution mode; inspect those explicitly.
5. For an authorized ProductShape change, use its installed deterministic validate/recovery CLI and
   recorded brief. Recovery candidates and historical receipts are not accepted product authority.

Run from the repository root with an available Python 3.11+:

```powershell
python implementation-scope/pre-build-packet/verify.py
```

The default prints results without overwriting the historical packet receipt. For retained results,
use `--output artifacts/<unique-run>/logic.json`; the destination must be new. The historical
`verification.json` supplies the immutable reference digest, not a current PASS. Do not change it
to conceal evidence drift.

Retain a concise disposition in the owning plan/task or native report: affected revisions,
checks actually performed, findings, resolved contradictions and remaining limits. PASS requires
all applicable obligations satisfied; FAIL, missing evidence and NOT_RUN stay visible. A passing
script is only evidence for the checks it implements. No parallel receipt/journal is required.
