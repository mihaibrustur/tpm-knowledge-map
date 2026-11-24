// Builds cockpit/index.html (the Delivery Cockpit pitch deck) from deck.json, deck.css and slides/*.html.
// Standalone: not part of the main build.js. Run: node cockpit/build.js
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const deck = JSON.parse(fs.readFileSync(path.join(dir, 'deck.json'), 'utf8'));
const css = fs.readFileSync(path.join(dir, 'deck.css'), 'utf8');

const arrow = '<svg class="arrow-svg" width="36" height="18" viewBox="0 0 36 18" aria-hidden="true"><path d="M0 5h22V0l14 9-14 9v-5H0z" fill="#985300"/></svg>';

const slides = deck.order.map((id) => {
  let html = fs.readFileSync(path.join(dir, 'slides', id + '.html'), 'utf8').trim();
  html = html.replace(/<x-shape kind="arrow-right"[^>]*><\/x-shape>/g, arrow);
  return html;
}).join('\n');

const fonts = Object.values(deck.faces).map((f) => `<link rel="stylesheet" href="${f.href}">`).join('\n');
const description = 'Delivery Cockpit: one shared view of how engineering delivers, and an assistant that flags risks while there is still time to act.';

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${deck.title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="https://mihaibrustur.github.io/tpm-knowledge-map/cockpit/">
<meta property="og:title" content="${deck.title}">
<meta property="og:description" content="${description}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts}
<style>
${css}
/* viewer */
html, body { margin: 0; height: 100%; background: #0B141C; overflow: hidden; }
#stage { position: absolute; left: 50%; top: 50%; width: 1920px; height: 1080px; transform-origin: center center; }
#stage > section { position: absolute; inset: 0; width: 1920px; height: 1080px; overflow: hidden; }
#stage > section:not(.active) { display: none; }
section aside { display: none; }
.arrow-svg { align-self: center; flex: none; }
#bar { position: fixed; left: 50%; bottom: 16px; transform: translateX(-50%); display: flex; gap: 8px; align-items: center; padding: 6px 8px; border-radius: 999px; background: rgba(21,36,47,0.88); border: 1px solid #2A3B48; font: 14px 'Inter', Arial, sans-serif; color: #C3D1D8; opacity: 0.25; transition: opacity 200ms; z-index: 10; }
#bar:hover, #bar:focus-within, body.show-bar #bar { opacity: 1; }
#bar button { background: none; border: 0; color: inherit; font: inherit; padding: 6px 12px; border-radius: 999px; cursor: pointer; }
#bar a { color: inherit; text-decoration: none; padding: 6px 12px; border-radius: 999px; }
#bar button:hover, #bar button:focus-visible, #bar a:hover, #bar a:focus-visible { background: #2A3B48; outline: none; }
#count { min-width: 64px; text-align: center; font-variant-numeric: tabular-nums; }
#notes { position: fixed; left: 16px; right: 16px; bottom: 72px; max-width: 900px; margin: 0 auto; max-height: 32vh; overflow: auto; padding: 16px 20px; border-radius: 12px; background: rgba(21,36,47,0.96); border: 1px solid #2A3B48; color: #E6ECEF; font: 16px/1.5 'Inter', Arial, sans-serif; z-index: 10; }
#notes[hidden] { display: none; }
@media print {
  @page { size: 1920px 1080px; margin: 0; }
  html, body { height: auto; overflow: visible; background: none; }
  #stage { position: static; transform: none !important; width: auto; height: auto; }
  #stage > section, #stage > section:not(.active) { display: flex; position: relative; page-break-after: always; break-after: page; }
  #bar, #notes { display: none; }
  * { animation: none !important; }
}
</style>
</head>
<body>
<main id="stage" aria-live="polite">
${slides}
</main>
<div id="notes" hidden></div>
<nav id="bar" aria-label="Slide controls">
<a id="home" href="../" title="Behind the Delivery">Home</a>
<button id="prev" aria-label="Previous slide">&#8592;</button>
<span id="count"></span>
<button id="next" aria-label="Next slide">&#8594;</button>
<button id="toggle-notes" aria-pressed="false" title="Speaker notes (N)">Notes</button>
<button id="full" title="Full screen (F)">Full screen</button>
</nav>
<script>
(function () {
  var stage = document.getElementById('stage');
  var slides = Array.prototype.slice.call(stage.children);
  var count = document.getElementById('count');
  var notes = document.getElementById('notes');
  var notesBtn = document.getElementById('toggle-notes');
  var i = 0;

  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
  }
  function fromHash() {
    var n = parseInt((location.hash.match(/slide-(\\d+)/) || [])[1], 10);
    return n >= 1 && n <= slides.length ? n - 1 : 0;
  }
  function show(n, push) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, k) { s.classList.toggle('active', k === i); });
    count.textContent = (i + 1) + ' / ' + slides.length;
    var aside = slides[i].querySelector('aside');
    notes.textContent = aside ? aside.textContent : 'No notes for this slide.';
    var h = '#slide-' + (i + 1);
    if (push !== false && location.hash !== h) history.replaceState(null, '', h);
  }
  function toggleNotes() {
    notes.hidden = !notes.hidden;
    notesBtn.setAttribute('aria-pressed', String(!notes.hidden));
  }
  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }

  document.getElementById('prev').onclick = function () { show(i - 1); };
  document.getElementById('next').onclick = function () { show(i + 1); };
  notesBtn.onclick = toggleNotes;
  document.getElementById('full').onclick = toggleFull;

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'ArrowDown') { e.preventDefault(); show(i + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'ArrowUp') { e.preventDefault(); show(i - 1); }
    else if (k === 'Home') show(0);
    else if (k === 'End') show(slides.length - 1);
    else if (k === 'n' || k === 'N') toggleNotes();
    else if (k === 'f' || k === 'F') toggleFull();
  });

  var x0 = null;
  document.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; document.body.classList.add('show-bar'); }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', function () { show(fromHash(), false); });
  fit();
  show(fromHash(), false);
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(dir, 'index.html'), page);
console.log('Wrote index.html with ' + deck.order.length + ' slides.');
