# Website Reconstruction Constitution

## Core Principles

### I. Canonical Authority & Progressive Disclosure
Every agent MUST start from the repository's root `AGENTS.md` and follow the canonical ownership
declared there. Agents MUST load only the smallest authoritative context needed for the current task
instead of recursively ingesting the repository. Search rank, filename age, directory depth, model
memory, or retrieval confidence MUST NOT override the canonical owner of a decision.

### II. Evidence Integrity & Explicit Uncertainty
Observed facts, source-declared mechanisms, inferences, decisions, and unknowns MUST remain
distinguishable. Frozen or sealed evidence MUST remain immutable. A later product or scope decision
may change what the implementation requires, but it MUST NOT rewrite historical observations,
capture results, or prior gate outcomes. Missing evidence MUST remain missing unless new authorized
evidence is actually collected.

### III. Fidelity Without Destructive Simplification
Scoped visual hierarchy, typography relationships, responsive behavior, interaction/state behavior,
motion character, accessibility behavior, and other obligations defined by the active product/domain
contract MUST be preserved. An implementation MUST NOT pass by deleting content, hiding overflow,
flattening distinctive motion, replacing stateful behavior with unrelated shortcuts, or weakening a
scoped requirement. Internally simpler mechanisms are permitted only when the observable contract
remains equivalent and verified.

### IV. Verification Over Self-Report
Agent completion is not acceptance. Critical work MUST be validated by the executable checks required
by its specification and plan, including browser or deterministic checks where applicable, and by any
independent review required by the active routing policy. Static screenshots MUST NOT substitute for
temporal/state verification. Thresholds, fixtures, or comparison references MUST NOT be changed only
to hide a failure.

### V. Portable Specifications & Reproducible Execution
Specification artifacts MUST describe product intent, behavior, constraints, acceptance, and
implementation planning without binding product requirements to a particular model vendor. Runtime
routing, model qualification, orchestration, and provider selection belong to their execution-policy
owners. Critical execution MUST remain reproducible from recorded task/spec revision, repository
revision, runtime route/configuration, and verification result.

## Project Constraints

- `AGENTS.md` is the tool-neutral repository entry point and ownership map.
- Feature/site-specific truth belongs in the active product/domain contract and linked evidence, not
  in this constitution.
- Spec Kit artifacts MUST reference canonical evidence instead of duplicating whole evidence packages.
- Historical evidence, skill-hardening artifacts, benchmark research, and receipts MAY remain in the
  repository for traceability, but they MUST NOT become active requirements unless a canonical owner
  explicitly adopts them.
- Rights, licensing, publication, target-adaptation, and third-party-service boundaries MUST follow
  the active product/domain contract. This constitution does not grant reuse rights.
- New governance Markdown files MUST NOT be created when an existing canonical owner can hold the
  rule. Significant long-lived architectural decisions MAY use an ADR when preserving rationale is
  materially useful.

## Development Workflow & Quality Gates

- Large work MUST be decomposed into bounded, independently testable slices before implementation.
- A slice MUST have an explicit specification and acceptance obligations before technical planning.
- Ambiguities that materially affect scope or behavior MUST be resolved before implementation rather
  than filled with invented assumptions.
- Technical planning MUST remain consistent with the specification and this constitution.
- Tasks MUST be traceable to requirements, acceptance criteria, or plan decisions.
- Cross-artifact analysis MUST run before critical implementation when the Spec Kit workflow provides
  it, and material inconsistencies MUST be resolved first.
- Concurrent agent writes MUST either be isolated or serialized so multiple agents do not mutate the
  same working tree or overlapping ownership surface unsafely.
- Implementation MUST be followed by the applicable review, browser/runtime checks, repository checks,
  and convergence/consistency verification required by the active slice.
- Git history is the durable record of changes. Documentation that only explains a superseded
  transition SHOULD be removed from the active tree once its unique current truth has been folded into
  the canonical owner.

## Governance

This constitution is the canonical source for project-wide non-negotiable rules. Product/domain
contracts own feature or reference-specific scope; Spec Kit feature artifacts own bounded feature
intent and planning; routing/runtime policies own execution selection.

Amendments MUST:
1. update this canonical file rather than create a competing copy;
2. preserve or explicitly reconcile affected canonical owners;
3. update `AGENTS.md` when the read path or ownership map changes;
4. be reviewed for impact on active specifications, plans, tasks, and verification gates.

Versioning follows semantic versioning:
- MAJOR for backward-incompatible removal or redefinition of a governing principle;
- MINOR for a new principle or materially expanded governance requirement;
- PATCH for non-semantic clarification or wording corrections.

**Version**: 1.0.0 | **Ratified**: 2026-10-05 | **Last Amended**: 2026-10-05
