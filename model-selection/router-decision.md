# Router decision — superseded

Status: **SUPERSEDED**  
Date: **2026-10-05**

This file was an earlier placeholder for a separate router-selection decision. It is intentionally retained only to prevent stale tooling or agents from treating an empty file as an unresolved production decision.

Authoritative routing artifacts are now:

- [RP-HBC-01 routing policy](routing-policy.md) — task classification, lane policy, review/escalation rules and model-family preferences.
- [RR-HBC-01 runtime route registry](runtime-route-registry.md) — exact runnable route and qualification state for model/engine/configuration combinations.

The first implementation runtime is **Claw Orchestrator**, driven from Codex through the Claw MCP integration. A separate dynamic-router product is **not a prerequisite** for the current path. Introduce one only if a concrete Claw/engine integration gap justifies it and it preserves explicit resolved-model identity, qualification state, reproducibility receipts and the no-silent-paid-provider rule.
