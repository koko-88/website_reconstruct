# ROADMAP — Haunted Boulder City Reconstruction

## Status

**DECOMPOSITION REQUIRED**

This file is the canonical Spec-of-Specs / project decomposition owner. It records only project structure supported by the current repository truth. It does not invent feature count, feature boundaries, or dependencies that have not yet been derived and validated.

## Epic

**Haunted Boulder City Local Reference-Fidelity Reconstruction**

Product authority: [PRODUCT.md](PRODUCT.md)  
Project-wide rules: [.specify/memory/constitution.md](.specify/memory/constitution.md)  
Evidence entry point: [implementation-scope/pre-build-packet/README.md](implementation-scope/pre-build-packet/README.md)

## Current decomposition state

| Item | Current state |
| --- | --- |
| Whole-product intent and fidelity obligations | Defined in PRODUCT.md |
| Product / experience inventory | Defined in PRODUCT.md from existing evidence |
| Final feature count | **NOT YET DEFINED** |
| Feature boundaries | **NOT YET DEFINED** |
| Cross-feature dependency graph | **NOT YET DEFINED** |
| Product-obligation → feature coverage map | **NOT YET DEFINED** |
| Existing `001-home-entry-fidelity` | **PRE-ROADMAP FEATURE — PENDING VALIDATION AGAINST THIS ROADMAP** |

## Existing pre-roadmap feature

### 001-home-entry-fidelity

Location: `specs/001-home-entry-fidelity/`

The feature exists and contains specification, planning, and task artifacts, but its boundary was created before the project-level Spec-of-Specs decomposition existed. It MUST NOT be treated as an approved project decomposition boundary until it is evaluated against the complete product inventory and resulting dependency graph.

Required disposition after decomposition: **KEEP / RE-SCOPE / MERGE / SPLIT / REPLACE**, based on project-wide coverage and dependency analysis rather than preservation by default.

## Roadmap completion gate

Before project orchestration or further implementation:

- [ ] Derive the smallest coherent set of independently testable features from PRODUCT.md and the canonical evidence.
- [ ] Assign every material product/fidelity obligation to one feature where possible, or to an explicit cross-cutting owner where it genuinely spans features.
- [ ] Identify and resolve uncovered, duplicated, or ambiguous ownership.
- [ ] Define an acyclic dependency graph or explicitly resolve any dependency cycle.
- [ ] Confirm each feature has an independently testable acceptance boundary.
- [ ] Reconcile `001-home-entry-fidelity` against the completed decomposition.
- [ ] Record the final feature count, durable IDs/names, ordering, dependencies, and coverage result here.

Until these items are complete, this roadmap intentionally records the gap rather than fabricating a complete decomposition.
