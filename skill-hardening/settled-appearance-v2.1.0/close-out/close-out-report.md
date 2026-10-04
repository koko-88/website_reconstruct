# Reference-reconstruction 2.1.1 close-out

Inspection/hardening is **CLOSED and ready for the first implementation validation** within FC-TARGET-DESIGN-01. No additional inspection correctness problem was found. This patch adds only a resource-safe regression entry point and updates its documentation/version; the inspection and capture implementation is unchanged. No reference recapture, tool installation or website implementation occurred.

The canonical command from either skill directory is `node scripts/run-tests.mjs`. With REFERENCE_PLAYWRIGHT_MODULE set, it runs only the two maintained browser-bearing suites with `--test-concurrency=1`; without it, dependency-free validation retains Node's default concurrency. Unrelated tests are unaffected.

## Removed and retained

Removed **16 redundant files**, with original sizes/hashes recorded in [deletion-audit.json](deletion-audit.json):

- Construction helpers: `ancestor-regressions.py`, `capture-verification.py`, `diagnostics.py`, `docs.py`, `edit.py`, `example.py`, `finalize.py`, `preserve-pending-reasons.py`, `refine.py`, `reveal-regression.py`. They performed intermediate source edits; the committed final source, patch, change inventory and rollback snapshot supersede them. No retained caller needs them.
- Intermediate results: `quick-validation.log`, `synthetic-signals.json`, `tests-appearance.log`, `tests-final-stage.log`, `tests-focused.log`, `tests-installed-serial.log`. Final installed validation and diagnostics supersede these stage/focused/earlier serial-success receipts.

The **55 retained original files remain byte-identical**, including:

- Original final evidence: `hardening-report.md`, `final-verification.json`, `stage-verification.json`, `tests-installed-final.log`, `synthetic-signals-installed.json`, `quick-validation-installed.log`.
- Rollback/reproduction: `baseline.json`, complete `before/`, `changes.json`, `reference-reconstruction-2.1.0.patch`, `verify-hardening.mjs`, `final-evidence.mjs`. Run the historical generators against the original 2.1.0 source at commit `99df74f`, not the newer skill, to reproduce that revision; preserve existing receipts separately.
- Failure audit: `tests-first.log` (startup timeout), `tests-installed.log` (concurrent native-memory exhaustion).
- Complete independent `forward-validation/`, including original failing reproducers/results, separate corrected reproducers/results, data-only adapter/run artifacts, assessment, source hashes and unit receipts. These preserve the discovery and correction trail and its browser limitations.

New canonical close-out evidence is confined to this directory: this report, deletion audit, patch, verification script/receipt, final test/quick-validation logs, repository/installed synthetic diagnostics and current-source forward replay script/receipt. [verification.json](verification.json) inventories and hashes the other close-out artifacts.

## Final validation

| Run | Tests | Passed | Failed | Cancelled | Skipped | Todo |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [Repository, real browser, serial](tests-repository.log) | 25 | 25 | 0 | 0 | 0 | 0 |
| [Installed skill, real browser, serial](tests-installed.log) | 25 | 25 | 0 | 0 | 0 | 0 |
| [Dependency-free, default concurrency](tests-lightweight.log) | 13 | 11 | 0 | 0 | 2 | 0 |

The two dependency-free skips are the deliberately disabled browser suites. Both skill-creator quick validations pass. Byte identity of repository/installed skills passes. Frozen v1 **172 files**, sealed real-v2 **306 inventoried files plus its manifest**, original rollback snapshot, all retained hardening/independent evidence, and the final 2.1.0 inspection/test source pass unchanged checks. The [implementation contract](../../../implementation-scope/fidelity-scope-contract.md) retains its original hash and valid links. The repository hygiene check finds only the enumerated close-out edits/removals/artifacts and no scratch files. Exact receipts and environment versions are in [verification.json](verification.json).

The independent source-hash receipt predates final diagnostic/pending-reason/test refinements in three files; it remains historical evidence for its recorded revision. A fresh [parent replay](forward-replay.json) of both retained corrected reproducers against current source **passes**, covering ancestor appearance/motion, screenshot refusal and policy controls. [replay-forward.mjs](replay-forward.mjs) runs unchanged reproducer scripts in a disposable mirrored workspace. This strengthens current-source reproduction evidence without presenting the replay as a new independent assessment or changing the original receipts.

Reproduction used existing Node **24.19.0**, existing bundled Playwright, sandbox-enabled installed Chrome, and REFERENCE_BROWSER_CHANNEL=`chrome`. Set REFERENCE_PLAYWRIGHT_MODULE to the existing Playwright installation; optionally set REFERENCE_APPEARANCE_RESULTS to a new output file. Run the canonical command once per skill copy, sequentially. Clear those variables for the dependency-free run. Run skill-creator's existing `scripts/quick_validate.py` against each copy. From the repository root, run `node skill-hardening/settled-appearance-v2.1.0/close-out/replay-forward.mjs`, then `node skill-hardening/settled-appearance-v2.1.0/close-out/verify-close-out.mjs`. Copy this directory before generating fresh receipts to preserve the completed close-out. Historical forward evaluation scripts intentionally preserve earlier behavior and output paths; replay them only in an isolated copy with the matching source revision, so their canonical receipts are not overwritten.

## Rollback and implementation readiness

To undo this close-out skill patch, restore `SKILL.md`, `references/capture-plan.md` and `references/settled-appearance.md` from repository commit **99df74f**, remove only `scripts/run-tests.mjs`, and synchronize those same changes to the installed skill. [reference-reconstruction-2.1.1.patch](reference-reconstruction-2.1.1.patch) records the exact patch. Deleted intermediates remain recoverable from that commit; close-out evidence can remain for audit.

To roll the underlying 2.1.0 hardening back to the original installed skill, restore the complete `before/` snapshot to each skill location, removing only additions identified by `changes.json` plus the 2.1.1 runner. Neither rollback touches frozen/sealed reference evidence.

**No inspection/hardening blocker remains.** Starting asset-dependent implementation validation remains conditional on the contract's concrete authorized-asset or documented replacement decisions (U-02/SR-42). Actual target content/data/CTA mappings and stress fixtures remain prerequisites for later target adaptation. Missing Eventbrite selectable states do not block the bounded design scope. This close-out does not clear those separate gates or accept a built product.
