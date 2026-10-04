# Implementation, adaptation and acceptance handoff

Use after scoped integrity/fidelity/asset-reuse passage or when preparing an evidence-only handoff. These requirements do not mandate a new stack or duplicate application.

## Packet

Provide contract path/revision, package path/revision, four gate results and exact implementation clearance, source authority, artifact manifest, State & Route Coverage Matrix, Environment Matrix, Non-DOM Rendering Detection and Public Artifact/source-map reports, environment/reset recipes, evidence-linked design/component/responsive/behavior/motion requirements, asset/font decisions and residual low-impact issues. Include acceptance cases even if Playwright comes later. The recipient must locate artifacts and replay states without chat history.

Read target repository constraints before translating requirements into components. Library defaults cannot replace observed contracts. Keep reference tracking, secrets and backend hosts out of the target.

## 1. Reference-equivalent reconstruction

- Implement approved scope with measured tokens, layout, state and motion rules, preserving line lengths, density, crop, rhythm and layer order.
- Use approved reference content or reusable reference-equivalent fixtures; record any substitution that changes visual comparison.
- Establish equivalence across the evidence matrix before replacing content/data. Fixtures may live in the same codebase; a duplicate site is unnecessary.
- Compare matching environments and states with both screenshot review and behavioral assertions. A snapshot generated from the implementation alone cannot prove reference fidelity.

## 2. Real project adaptation

Copy `assets/adaptation-contract.md` into the evidence area and map reference slots/components/actions to real fields, semantic roles, formatting, fallback, asset strategy, cardinality and target actions/API contracts before integration.

Preserve tokens, hierarchy, layout relationships, responsive transitions, interaction patterns and motion. Words, counts and resulting geometry may legitimately change: distinguish expected content differences from design drift. Probe shortest/longest values, missing values, no results, long unbroken strings, large datasets, image ratios, localization and RTL where relevant, using real or labeled test fixtures.

Use demonstrated wrapping, truncation, expansion, pagination and overflow rules. If content conflicts with them, record the conflict and choose a compatible treatment; seek a user decision when it changes meaningful content or the requested design. Do not silently shrink type, remove sections, hide overflow, replace fonts, flatten animation or truncate meaningful content to make screenshots pass.

Wire actions to real target domain behavior while preserving interaction contracts. Do not invent unavailable production data or label mocks real integration. Record intentional accessibility corrections as deviations.

## 3. Deterministic Playwright acceptance

Copy `assets/acceptance-plan.md` and later translate cases using project-appropriate setup/current APIs. The reusable capture plan/probe can inform replay, but raw reference runs are not target acceptance tests. No fixed target test scaffold is required by this skill.

- Keep two comparisons: reconstruction versus reference-equivalent evidence, and adapted UI versus design/behavior contracts plus approved adapted baselines. Changed content cannot be judged by blindly diffing the entire adapted page against the original.
- Control browser/version, OS/rendering environment, viewport/height/DPR, zoom, fonts, locale/timezone, theme, motion preference, fixtures and storage/session. Use observable readiness, not arbitrary sleeps or blanket network-idle waits.
- Separate settled-layout screenshots from motion tests. Animation disabling helps image stability but proves nothing about motion. Check triggers, sequences, timing tolerances, interruption and reduced-motion outcomes separately.
- Include keyboard/focus, names/states, URL/history, persistence and relevant loading/empty/error/success states. Cover sizes and breakpoint/container edges from evidence.
- Set per-case geometric/image tolerances before evaluating results. Investigate structural shifts even with low aggregate pixel difference. Mask only documented uncontrollable regions, never the typography/layout/interaction being assessed.
- Calibrate rendering environment differences. Inspect overlays/diffs and behavior results. Do not auto-accept generated baselines or update them to hide failures. Baseline updates require an evidence-backed intended change, not a new approval ceremony by default.

## Completion record

Record commands/environment, case IDs, pass/fail/not-run, outputs, deviations and unresolved defects. Distinguish execution from visual inspection. Claim fidelity only for tested scope; reconstruction alone does not establish production readiness or authorize publication.
