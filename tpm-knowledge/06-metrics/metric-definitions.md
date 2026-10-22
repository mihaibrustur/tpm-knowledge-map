---
related: [delivery-metrics, scope-baselines, p-metric-semantics]
author: ai
---

# Metric definitions

Being precise about what a metric counts: the unit, the source, the time window and what is in or out.

## Why it matters

A release feature, a sprint subtask, a production bug and a regression task are different units. Mixing them produces numbers that look solid and mean nothing.

## Pitfalls

- Copying a metric name from a framework without agreeing what it counts here.
- Changing a definition silently, which breaks every trend.
- Trusting a number before checking that the underlying data (like ticket links) is reliable.

## Reflect

- What makes an engineering delivery metric actionable?
- For a metric you used, what were its source, unit and exclusion rules?
