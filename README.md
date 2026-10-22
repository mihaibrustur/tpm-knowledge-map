# TPM Knowledge Map

An interactive map of technical program management competencies, concepts and stories. Static site, no build step.

## Run locally

Open `index.html` in a browser. Everything is loaded from `data.js`, so no server is needed (D3 loads from a CDN, so you need an internet connection).

## Publish on GitHub Pages

1. Create a new repository and push these files to the `main` branch.
2. In the repository go to Settings, then Pages.
3. Under Build and deployment choose "Deploy from a branch", select `main` and the `/ (root)` folder, and save.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

Deep links work: `.../#risk-register` opens that node directly, handy to share or bookmark before an interview.

## Edit content

All content lives as markdown in `tpm-knowledge/` (see its README for the format). `data.js` is generated from it, so do not edit it by hand. After changing the markdown, run:

```
node build.js
```

and commit both the markdown and the regenerated `data.js` (GitHub Pages serves the files as they are, with no build step).

- A folder like `01-planning/` is a top-level competency (its `index.md`). Each other file in it is a concept. `stories/` holds your experiences.
- `related` in the front matter lists ids (file names) of connected nodes. Links are drawn automatically.
- `author` is `ai` for text drafted by Claude and `mine` once you have written or rewritten it.
- For a story, write a short anonymized account under `## Experience` (the `## Prompts` list is the guide). Once filled, the panel shows it.

## Keeping it anonymous

This repository will be public. Do not put company, client or person names, or product names that identify them, in any file.

Create a local file named `.banned-terms` (one term per line, it is git-ignored so the list itself is never published; start a line with `=` to match a name case-sensitively when it is also a common word) and run:

```
./check-names.sh
```

It fails if any of those terms appear in the site files. Run it before every push. Also watch for indirect identifiers such as very specific numbers, dates, locations or project names that someone could trace back.

## Revisit tracking

"Mark as revisited" is saved in your browser's local storage, so it stays on your device and is not part of the published site.
