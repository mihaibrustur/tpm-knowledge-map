# TPM knowledge

The source for the knowledge map. Every node on the site is one markdown file here; `node build.js` (from the repo root) compiles them into `data.js`.

## Layout

```
NN-<domain-id>/index.md   a domain (competency); NN sets the order on the site
NN-<domain-id>/<id>.md    a concept in that domain
stories/<id>.md           a story
```

The file name is the node's id, and a concept's parent is the folder it sits in. To link nodes, use ids in `related`.

## File format

```markdown
---
related: [change-control, okrs]
author: ai
---

# Label shown on the map

One-paragraph summary.

## Why it matters
## Pitfalls        (bulleted list)
## Reflect         (bulleted list)
```

Stories use `## Prompts` (bulleted list) and `## Experience` (free text, left empty until written) instead.

`author` is `ai` for text drafted by Claude and `mine` once you have written or rewritten it.
