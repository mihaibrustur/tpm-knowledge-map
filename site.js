// Generates the portfolio pages (home, case studies) from tpm-knowledge/case-studies/*.md.
// Called by build.js after data.js is written. No dependencies.
//
// Case study file: front matter (title, context, challenge, outcome, description, status, related),
// then "## " sections: The situation, The challenge, My role, The decisions, The outcome, What I learned.
// Only status: published is built, unless build.js runs with --drafts (local preview only).
// A paragraph starting with "TODO:" is an editorial placeholder; a published file must not contain one.
const fs = require("fs");
const path = require("path");

const SITE_URL = "https://mihaibrustur.github.io/tpm-knowledge-map/";
const NAME = "Mihai Brustur";
const LINKEDIN = "https://www.linkedin.com/in/mihai-brustur/";
const EMAIL = "mihai.brustur@gmail.com";
const BRAND = "Behind the Delivery";
const TAGLINE = "Real problems. Difficult decisions. Lessons from leading engineering programs.";

const SECTIONS = ["The situation", "The challenge", "My role", "The decisions", "The outcome", "What I learned"];

// ---------- markdown ----------
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}
function blocks(text) {
  const out = [];
  for (const chunk of text.trim().split(/\n\s*\n/)) {
    const lines = chunk.split("\n");
    if (lines.every(l => l.startsWith("- "))) {
      out.push("<ul>" + lines.map(l => "<li>" + inline(l.slice(2).trim()) + "</li>").join("") + "</ul>");
    } else if (/^### /.test(lines[0])) {
      out.push("<h3>" + inline(lines[0].slice(4)) + "</h3>");
      if (lines.length > 1) out.push(blocks(lines.slice(1).join("\n")));
    } else if (chunk.startsWith("TODO:")) {
      out.push('<p class="todo" data-draft>' + inline(chunk) + "</p>");
    } else {
      out.push("<p>" + inline(lines.join(" ")) + "</p>");
    }
  }
  return out.join("\n");
}

function parseCaseStudy(file) {
  let text = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const meta = {};
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    text = text.slice(fm[0].length);
    for (const line of fm[1].split("\n")) {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (!m) continue;
      const v = m[2].trim();
      meta[m[1]] = v.startsWith("[") ? v.slice(1, -1).split(",").map(x => x.trim()).filter(Boolean) : v;
    }
  }
  const sections = {};
  for (const part of text.split(/^## /m).slice(1)) {
    const nl = part.indexOf("\n");
    const heading = part.slice(0, nl).trim();
    if (!SECTIONS.includes(heading)) throw new Error(file + ": unknown section '## " + heading + "'");
    sections[heading] = part.slice(nl + 1).trim();
  }
  for (const k of ["title", "context", "challenge", "outcome", "description"]) {
    if (!meta[k]) throw new Error(file + ": missing front matter '" + k + "'");
  }
  const slug = path.basename(file, ".md");
  const hasTodo = /^TODO:/m.test(text) || /TODO:/.test(fm ? fm[1] : "");
  return { slug, meta, sections, hasTodo, draft: meta.status !== "published" };
}

// ---------- templates ----------
function page({ depth, title, description, url, body, draft, active }) {
  const up = depth ? "../".repeat(depth) : "./";
  const nav = [["My work", "work/", "work"], ["Knowledge map", "map/", "map"]]
    .map(([label, href, key]) => '<a href="' + up + href + '"' + (active === key ? ' aria-current="page"' : "") + ">" + label + "</a>")
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta name="twitter:card" content="summary">
${draft ? '  <meta name="robots" content="noindex" data-draft>\n' : ""}  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600&family=Rajdhani:wght@500;600;700&display=swap">
  <link rel="stylesheet" href="${up}site.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="${up}">${BRAND}</a>
    <nav aria-label="Main">${nav}</nav>
  </header>
${draft ? '  <div class="draft-banner" data-draft>Draft preview. Not for publishing.</div>\n' : ""}  <main id="main">
${body}
  </main>
  <footer class="site-footer">
    <span>${NAME}</span>
    <a href="${LINKEDIN}" rel="me">LinkedIn</a>
    <a href="mailto:${EMAIL}">${EMAIL}</a>
  </footer>
</body>
</html>
`;
}

function conceptChips(ids, byId, up) {
  const items = (ids || []).filter(id => byId.has(id)).map(id =>
    '<li><a href="' + up + "map/#" + id + '">' + esc(byId.get(id).label) + "</a></li>");
  return items.length ? '<ul class="chips">' + items.join("") + "</ul>" : "";
}

function row(cs, up) {
  return `<article class="work-row">
      <div>
        <p class="label">${esc(cs.meta.context)}</p>
        <h2><a href="${up}work/${cs.slug}/">${esc(cs.meta.title)}</a></h2>
        <p>${inline(cs.meta.description)}</p>
        <p><a class="more" href="${up}work/${cs.slug}/">Read the case study</a></p>
      </div>
      <dl>
        <dt class="k">Challenge</dt><dd>${inline(cs.meta.challenge)}</dd>
        <dt class="k">Outcome</dt><dd>${inline(cs.meta.outcome)}</dd>
      </dl>
    </article>`;
}

function card(cs, up) {
  return `<article class="card">
      <p class="label">${esc(cs.meta.context)}</p>
      <h3><a href="${up}work/${cs.slug}/">${esc(cs.meta.title)}</a></h3>
      <p><span class="k">Challenge</span> ${inline(cs.meta.challenge)}</p>
      <p><span class="k">Outcome</span> ${inline(cs.meta.outcome)}</p>
    </article>`;
}

// A small static drawing of the map: competencies on a ring, concepts around them, stories in the middle.
function mapPreview(nodes) {
  const domains = nodes.filter(n => n.type === "domain");
  const stories = nodes.filter(n => n.type === "story" && n.experience);
  const pos = new Map();
  const parts = [];
  domains.forEach((d, i) => {
    const a = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * 120, y = Math.sin(a) * 120;
    pos.set(d.id, [x, y]);
    const kids = nodes.filter(n => n.parent === d.id);
    kids.forEach((k, j) => {
      const b = a + ((j - (kids.length - 1) / 2) * 0.11);
      const kx = Math.cos(b) * 168, ky = Math.sin(b) * 168;
      pos.set(k.id, [kx, ky]);
      parts.push(`<line class="l" x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${kx.toFixed(1)}" y2="${ky.toFixed(1)}"/>`);
      parts.push(`<circle class="c" cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="2.6"/>`);
    });
  });
  stories.forEach((s, i) => {
    const a = (i / stories.length) * Math.PI * 2;
    const x = Math.cos(a) * 46, y = Math.sin(a) * 46;
    const seen = new Set();
    (s.related || []).forEach(r => {
      const n = nodes.find(m => m.id === r);
      const d = n && (n.type === "domain" ? n.id : n.parent);
      if (d && pos.has(d) && !seen.has(d)) {
        seen.add(d);
        const [dx, dy] = pos.get(d);
        parts.push(`<line class="r" x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${dx.toFixed(1)}" y2="${dy.toFixed(1)}"/>`);
      }
    });
    parts.push(`<rect class="s" x="${(x - 4).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="8" height="8" transform="rotate(45 ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
  });
  domains.forEach(d => {
    const [x, y] = pos.get(d.id);
    parts.push(`<circle class="d" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/>`);
  });
  return `<svg class="map-preview" viewBox="-200 -200 400 400" role="img" aria-label="Preview of the knowledge map: ${domains.length} competencies, their concepts, and ${stories.length} stories">${parts.join("")}</svg>`;
}

// ---------- pages ----------
function homePage(nodes, studies) {
  const up = "./";
  const highlights = [
    ["~100 engineers", "The R&D organization I supported as its only program manager, at a cybersecurity scale-up."],
    ["$1M+ a year", "Cost savings from a mapping and location-services rollout I worked on with engineering and product teams at a large tech platform."],
    ["~3 months", "To compliance sign-off for a card-payment platform built by four teams at a software consultancy, where I was scrum master for two of them."]
  ].map(([n, t]) => `<li><span class="num">${esc(n)}</span><span>${esc(t)}</span></li>`).join("\n        ");
  const featured = studies.slice(0, 3);
  const body = `
    <section class="hero">
      <p class="label">${NAME} · Technical program leader</p>
      <h1>Making complex engineering work easier to execute.</h1>
      <p class="lede">I'm a technical program leader with a software engineering background and experience across cybersecurity, large-scale platforms, and fintech.</p>
      <p class="lede">I work on the challenges that emerge as engineering organizations grow: competing priorities, complex dependencies, fragmented information, and difficult decisions.</p>
      <p class="ctas"><a class="btn primary" href="work/">Explore my work</a><a class="btn" href="map/">Explore the knowledge map</a></p>
    </section>

    <section aria-labelledby="h-highlights">
      <h2 id="h-highlights" class="label">Experience highlights</h2>
      <ul class="highlights">
        ${highlights}
      </ul>
    </section>
${featured.length ? `
    <section aria-labelledby="h-work">
      <h2 id="h-work" class="label">Case studies</h2>
      ${featured.length < 3
        ? '<div class="work-list">' + featured.map(cs => row(cs, up)).join("\n    ") + "</div>"
        : '<div class="cards">' + featured.map(cs => card(cs, up)).join("\n    ") + "</div>"}
      <p><a class="more" href="work/">All case studies</a></p>
    </section>
` : ""}
    <section class="map-teaser" aria-labelledby="h-map">
      <div>
        <h2 id="h-map" class="label">The knowledge map</h2>
        <p>Every competency, concept and principle I work with, connected to the real stories behind them. Start from a concept and find where it was put to the test.</p>
        <p><a class="btn" href="map/">Explore the knowledge map</a></p>
      </div>
      <a href="map/" tabindex="-1" aria-hidden="true">${mapPreview(nodes)}</a>
    </section>

    <script>
      // old links pointed map nodes at the site root, e.g. /#risk-register; send them to the map
      if (location.hash.length > 1 && !document.getElementById(decodeURIComponent(location.hash.slice(1)))) location.replace("map/" + location.hash);
    </script>`;
  return page({
    depth: 0, title: NAME + " · " + BRAND,
    description: "Technical program leader. Real problems, difficult decisions and lessons from leading engineering programs, connected to an interactive map of TPM knowledge.",
    url: SITE_URL, body, draft: studies.some(s => s.draft), active: "home"
  });
}

function workIndex(studies) {
  const up = "../";
  const body = `
    <section class="intro">
      <h1>My work</h1>
      <p class="lede">Case studies from programs I've worked on: what was happening, what made it hard, what I decided and what changed.</p>
    </section>
    <div class="work-list">
    ${studies.map(cs => row(cs, up)).join("\n    ")}
    </div>`;
  return page({
    depth: 1, title: "My work · " + NAME, description: "Case studies from engineering programs: the situation, the decisions and the outcome.",
    url: SITE_URL + "work/", body, draft: studies.some(s => s.draft), active: "work"
  });
}

function caseStudyPage(cs, byId) {
  const up = "../../";
  const sections = SECTIONS.filter(h => cs.sections[h]).map(h =>
    `<section>\n      <h2>${h}</h2>\n      ${blocks(cs.sections[h])}\n    </section>`).join("\n    ");
  const chips = conceptChips(cs.meta.related, byId, up);
  const body = `
    <article class="case-study">
      <p class="label"><a href="${up}work/">My work</a> · ${esc(cs.meta.context)}</p>
      <h1>${esc(cs.meta.title)}</h1>
      <p class="lede">${inline(cs.meta.description)}</p>
    ${sections}
    ${chips ? `<section class="related">\n      <h2>Related concepts</h2>\n      <p>Open any of these in the knowledge map to see how it connects to the rest of my work.</p>\n      ${chips}\n    </section>` : ""}
    </article>`;
  return page({
    depth: 2, title: cs.meta.title + " · " + NAME, description: cs.meta.description,
    url: SITE_URL + "work/" + cs.slug + "/", body, draft: cs.draft, active: "work"
  });
}

function write(rel, html) {
  const file = path.join(__dirname, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function build(nodes, root, opts) {
  const dir = path.join(root, "case-studies");
  const byId = new Map(nodes.map(n => [n.id, n]));
  let studies = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort().map(f => parseCaseStudy(path.join(dir, f)))
    : [];
  for (const cs of studies) {
    if (!cs.draft && cs.hasTodo) throw new Error("case-studies/" + cs.slug + ".md is published but still has a TODO");
    for (const r of cs.meta.related || []) if (!byId.has(r)) console.warn("warning: case study " + cs.slug + " links to unknown id " + r);
  }
  if (!opts.drafts) studies = studies.filter(s => !s.draft);

  // remove pages for case studies that are no longer built
  const workDir = path.join(__dirname, "work");
  if (fs.existsSync(workDir)) {
    for (const d of fs.readdirSync(workDir)) {
      if (d !== "index.html" && !studies.some(s => s.slug === d)) fs.rmSync(path.join(workDir, d), { recursive: true });
    }
  }

  write("index.html", homePage(nodes, studies));
  write("work/index.html", workIndex(studies));
  for (const cs of studies) write("work/" + cs.slug + "/index.html", caseStudyPage(cs, byId));

  const urls = ["", "work/", "map/"].concat(studies.filter(s => !s.draft).map(s => "work/" + s.slug + "/"));
  write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(u => "  <url><loc>" + SITE_URL + u + "</loc></url>").join("\n") + "\n</urlset>\n");
  console.log("Wrote site pages: home, work index, " + studies.length + " case stud" + (studies.length === 1 ? "y" : "ies") +
    (opts.drafts ? " (drafts included: preview only, do not commit)" : "") + ".");
}

module.exports = { build };
