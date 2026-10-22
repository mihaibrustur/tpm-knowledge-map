---
related: [estimation, flow-metrics, p-context-forecasting]
author: ai
---

# Probabilistic forecasting

Using past throughput to simulate many possible futures (a Monte Carlo forecast) and giving dates with a confidence level.

## Why it matters

It answers "when?" from what the team actually delivered rather than from guesses, and it makes uncertainty visible instead of hiding it in a single date.

## Pitfalls

- Feeding it items of wildly different sizes, which breaks the main assumption.
- Too little history, or history from a team that has since changed.
- Presenting the 50% date as if it were a promise.

## Reflect

- How could Monte Carlo forecasting help, and what data makes it unreliable?
- When a release date is fixed, is a probabilistic forecast still useful?
