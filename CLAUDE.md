# TPM Knowledge Map: project context

A personal, interactive map of technical program management knowledge, used to revise concepts and to highlight experience in interviews. Static site (HTML, CSS, vanilla JS, D3 from a CDN), no build step, hosted on GitHub Pages.

## Files
- `data.js`: all content (domains, concepts, stories). `window.TPM_DATA.nodes`.
- `app.js`: force graph, drill-down, side panel, search, revisit tracking (localStorage).
- `index.html`, `styles.css`: page and theming (light/dark).
- `check-names.sh`: fails if any term in the local, git-ignored `.banned-terms` appears in site files.

## Hard rules
- The repo is public. Never write company, client, person or identifying product names in any file, including this one, commit messages and code comments.
- Avoid indirect identifiers too (distinctive project names, very specific numbers, dates, locations).
- Run `./check-names.sh` before every commit or push.

## Content conventions
- Node types: `domain`, `concept` (has `parent`), `story`. Links come from `parent` and `related`.
- `author`: `"ai"` for text drafted by Claude, `"mine"` once the owner has written or rewritten it. Be explicit about which is which; never mark AI text as `"mine"`.
- Stories have `experience: null` until the owner writes them. Do not invent experience. Interview the owner, keep it anonymous, then fill `experience`.

## Working style
- The owner wants to learn or revisit concepts while building. Explain a concept briefly when adding or editing it, and pressure-test ideas instead of validating automatically. Acknowledge trade-offs rather than calling choices "the best".
- Keep writing calm, clear and simple. No corporate fluff or heavy frameworks.

## Next steps
1. Fill in the story nodes one at a time (start with the high-stakes release or the cross-team dependency).
2. Push to a GitHub repo and enable Pages (see README).
