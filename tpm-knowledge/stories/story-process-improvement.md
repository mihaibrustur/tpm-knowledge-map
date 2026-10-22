---
related: [flow-metrics, delivery-metrics, estimation, status-reporting, stakeholder-mapping, operating-cadence, probabilistic-forecasting, scope-baselines, ai-in-delivery, p-visibility-first]
author: ai
---

# Improving how teams deliver

Building a delivery cockpit that made the team's work visible to anyone and moved forecasting from estimates to throughput.

## Prompts

- What problem did you see in how work was getting done?
- What did you change, and how did you get buy-in?
- How did you measure whether it helped?
- What would you keep or drop next time?

## Experience

I built an internal delivery cockpit to act as an information radiator: one place where anyone, from leadership to engineers, could see what the team was building and how it was progressing. It pulls data from the code host and the task tracker, and shows where effort goes, how long work spends in each phase, review flow, release quality, scope changes against each sprint and release baseline, and a forecast of when open work is likely to land.

The forecast runs on historical throughput, not estimates. Estimates are guesses made before the work is understood; throughput is what the team has actually delivered. For that to hold, items need to be of a fairly consistent size, so the tool came with a behaviour change: small pull requests, each linked one-to-one to a ticket.

One deliberate choice was keeping per-engineer stats out of sight. The goal was to make the team's work visible, not to make anyone feel monitored, and individual numbers would have undermined trust in the whole thing.

The biggest change was in the conversations. Instead of "when will it be done?", people started asking "how can we move faster?" and "why do we need this now?". Status questions answered themselves, and the discussion moved to priorities and trade-offs.
