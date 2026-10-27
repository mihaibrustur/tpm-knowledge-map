(function () {
  "use strict";

  var DATA = window.TPM_DATA;
  var STORE_KEY = "tpm-map-revisited";

  // ---------- state ----------
  var nodes = DATA.nodes.map(function (n) { return Object.assign({}, n); });
  var byId = new Map(nodes.map(function (n) { return [n.id, n]; }));
  var state = { expanded: new Set(), selected: null, query: "", showStories: true };
  var revisited = loadRevisited();

  function loadRevisited() {
    try { return new Set(JSON.parse(localStorage.getItem(STORE_KEY) || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveRevisited() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(Array.from(revisited))); } catch (e) { /* ignore */ }
  }

  // ---------- helpers ----------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function radius(n) { return n.type === "domain" ? 26 : n.type === "story" ? 15 : 12; }

  function isVisible(n) {
    if (n.type === "domain") return true;
    if (n.type === "story") return state.showStories;
    return state.expanded.has(n.parent);
  }

  function allLinks() {
    var seen = new Set(), out = [];
    function add(a, b, type) {
      if (!byId.has(a) || !byId.has(b)) return;
      var k = type + "|" + [a, b].sort().join("|");
      if (seen.has(k)) return;
      seen.add(k);
      out.push({ source: a, target: b, type: type });
    }
    nodes.forEach(function (n) {
      if (n.parent) add(n.parent, n.id, "child");
      (n.related || []).forEach(function (r) { add(n.id, r, "related"); });
    });
    return out;
  }
  var LINKS = allLinks();

  function matches(n) {
    var q = state.query.trim().toLowerCase();
    if (!q) return true;
    var hay = [n.label, n.summary, n.why || "", (n.pitfalls || []).join(" "), (n.practice || []).join(" ")].join(" ").toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  // ---------- svg setup ----------
  var svg = d3.select("#graph");
  var defs = svg.append("defs");
  var glow = defs.append("filter").attr("id", "glow").attr("x", "-100%").attr("y", "-100%").attr("width", "300%").attr("height", "300%");
  glow.append("feGaussianBlur").attr("stdDeviation", 2.5).attr("result", "blur");
  var merge = glow.append("feMerge");
  merge.append("feMergeNode").attr("in", "blur");
  merge.append("feMergeNode").attr("in", "SourceGraphic");

  // starfield sits outside the zoomed group and drifts slowly for parallax
  var gStars = svg.append("g");
  d3.range(260).forEach(function () {
    gStars.append("circle").attr("class", "star")
      .attr("cx", (Math.random() - 0.5) * 3200).attr("cy", (Math.random() - 0.5) * 2200)
      .attr("r", Math.random() < 0.9 ? 0.4 + Math.random() * 0.6 : 1.1 + Math.random() * 0.6)
      .attr("opacity", 0.25 + Math.random() * 0.6);
  });

  var root = svg.append("g");

  // sensors-manager range rings and bearing lines
  var gGrid = root.append("g").attr("class", "grid");
  d3.range(12).forEach(function (i) {
    var a = (i / 12) * Math.PI * 2;
    gGrid.append("line").attr("x1", 0).attr("y1", 0).attr("x2", Math.cos(a) * 720).attr("y2", Math.sin(a) * 720);
  });
  [120, 240, 360, 480, 600, 720].forEach(function (r, i) {
    gGrid.append("circle").attr("r", r).attr("class", i % 2 ? "major" : null);
    gGrid.append("text").attr("y", -r - 4).text(String(r / 120).padStart(2, "0") + " · RANGE");
  });

  var gLinks = root.append("g");
  var gNodes = root.append("g");
  var width = 800, height = 600;

  var zoom = d3.zoom().scaleExtent([0.3, 3]).on("zoom", function (ev) {
    var t = ev.transform;
    root.attr("transform", t);
    gStars.attr("transform", "translate(" + t.x * 0.12 + "," + t.y * 0.12 + ") scale(" + (1 + (t.k - 1) * 0.08) + ")");
  });
  svg.call(zoom).on("dblclick.zoom", null);

  var sim = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; })
      .distance(function (l) { return l.type === "child" ? 80 : 170; })
      .strength(function (l) { return l.type === "child" ? 0.9 : 0.04; }))
    .force("charge", d3.forceManyBody().strength(function (d) { return d.type === "domain" ? -700 : -240; }))
    .force("collide", d3.forceCollide().radius(function (d) { return radius(d) + 14; }))
    .force("x", d3.forceX().strength(0.03))
    .force("y", d3.forceY().strength(0.03))
    .on("tick", ticked);

  function resize() {
    var r = svg.node().getBoundingClientRect();
    width = r.width; height = r.height;
    svg.attr("viewBox", [-width / 2, -height / 2, width, height].join(" "));
  }
  window.addEventListener("resize", resize);
  resize();

  // initial layout: domains on a circle
  var domains = nodes.filter(function (n) { return n.type === "domain"; });
  domains.forEach(function (n, i) {
    var a = (i / domains.length) * Math.PI * 2;
    n.x = Math.cos(a) * 190; n.y = Math.sin(a) * 190;
  });
  nodes.filter(function (n) { return n.type === "story"; }).forEach(function (n, i, arr) {
    var a = (i / arr.length) * Math.PI * 2 + 0.3;
    n.x = Math.cos(a) * 90; n.y = Math.sin(a) * 90;
  });

  var linkSel, nodeSel;

  function render() {
    var vis = nodes.filter(isVisible);
    var ids = new Set(vis.map(function (n) { return n.id; }));
    var links = LINKS.filter(function (l) { return ids.has(l.source) && ids.has(l.target); })
      .map(function (l) { return { source: l.source, target: l.target, type: l.type }; });

    // spawn newly shown concepts next to their parent
    vis.forEach(function (n) {
      if (n.x == null && n.parent && byId.get(n.parent).x != null) {
        var p = byId.get(n.parent);
        n.x = p.x + (Math.random() - 0.5) * 40; n.y = p.y + (Math.random() - 0.5) * 40;
      }
    });

    linkSel = gLinks.selectAll("line").data(links).join("line")
      .attr("class", function (d) { return "link " + d.type; });

    nodeSel = gNodes.selectAll("g.node").data(vis, function (d) { return d.id; }).join(
      function (enter) {
        var g = enter.append("g").on("click", function (ev, d) { onNodeClick(d); })
          .call(d3.drag()
            .on("start", function (ev, d) { if (!ev.active) sim.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
            .on("drag", function (ev, d) { d.fx = ev.x; d.fy = ev.y; })
            .on("end", function (ev, d) { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));
        g.each(drawBlip);
        g.append("text").attr("dy", function (d) { return radius(d) + (d.type === "domain" ? 22 : 18); }).text(function (d) { return d.label; });
        g.append("title").text(function (d) { return d.label; });
        return g;
      },
      function (update) { return update; },
      function (exit) { return exit.remove(); }
    );
    styleNodes();

    sim.nodes(vis);
    sim.force("link").links(links);
    sim.alpha(0.7).restart();
  }

  // domains are hollow rings with a core, concepts are small blips, stories are diamond-shaped like resources
  function drawBlip(d) {
    var g = d3.select(this), r = radius(d);
    if (d.type === "domain") {
      g.append("circle").attr("class", "halo").attr("r", r + 9);
      g.append("circle").attr("class", "shell").attr("r", r).attr("filter", "url(#glow)");
      g.append("circle").attr("class", "core").attr("r", 5).attr("filter", "url(#glow)");
    } else if (d.type === "story") {
      var s = r * 0.8;
      g.append("rect").attr("class", "core").attr("x", -s).attr("y", -s).attr("width", s * 2).attr("height", s * 2)
        .attr("transform", "rotate(45)").attr("filter", "url(#glow)");
    } else {
      g.append("circle").attr("class", "shell").attr("r", r);
      g.append("circle").attr("class", "core").attr("r", 4).attr("filter", "url(#glow)");
    }
    g.append("circle").attr("class", "mark").attr("r", r + 5);
    var b = r + 8, l = 5;
    g.append("path").attr("class", "bracket").attr("d",
      "M" + -b + "," + (-b + l) + "V" + -b + "H" + (-b + l) +
      "M" + (b - l) + "," + -b + "H" + b + "V" + (-b + l) +
      "M" + b + "," + (b - l) + "V" + b + "H" + (b - l) +
      "M" + (-b + l) + "," + b + "H" + -b + "V" + (b - l));
  }

  function styleNodes() {
    if (!nodeSel) return;
    var q = state.query.trim();
    nodeSel
      .attr("class", function (d) {
        var c = "node " + d.type;
        if (revisited.has(d.id)) c += " revisited";
        if (state.selected === d.id) c += " selected";
        if (q && !matches(d)) c += " dim";
        return c;
      });
  }

  function ticked() {
    if (linkSel) linkSel
      .attr("x1", function (d) { return d.source.x; }).attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; }).attr("y2", function (d) { return d.target.y; });
    if (nodeSel) nodeSel.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  // ---------- interaction ----------
  function onNodeClick(d) {
    if (d.type === "domain") {
      if (state.expanded.has(d.id) && state.selected === d.id) state.expanded.delete(d.id);
      else state.expanded.add(d.id);
      select(d.id, true);
    } else {
      select(d.id);
    }
  }

  function select(id, keepHash) {
    var n = byId.get(id);
    if (!n) return;
    var needRender = false;
    if (n.type === "concept" && !state.expanded.has(n.parent)) { state.expanded.add(n.parent); needRender = true; }
    if (n.type === "story" && !state.showStories) { state.showStories = true; document.getElementById("stories").checked = true; needRender = true; }
    state.selected = id;
    if (needRender || keepHash) render(); else styleNodes();
    if (needRender && !keepHash) { /* already rendered */ }
    styleNodes();
    showPanel(n);
    try { history.replaceState(null, "", "#" + id); } catch (e) { /* ignore */ }
  }

  function closePanel() {
    state.selected = null;
    document.getElementById("panel").hidden = true;
    styleNodes();
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* ignore */ }
  }

  function chip(id) {
    var n = byId.get(id);
    var b = el("button", "chip", n.label);
    b.type = "button";
    b.addEventListener("click", function () { select(id); });
    return b;
  }

  function section(panel, title, content) {
    panel.appendChild(el("h3", null, title));
    panel.appendChild(content);
  }

  function listOf(items) {
    var ul = el("ul");
    items.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    return ul;
  }

  function showPanel(n) {
    var p = document.getElementById("panel");
    p.hidden = false;
    p.textContent = "";

    var close = el("button", "close", "Close");
    close.type = "button";
    close.addEventListener("click", closePanel);
    p.appendChild(close);

    var head = el("div");
    head.appendChild(el("span", "badge " + n.type, n.type === "domain" ? "Competency" : n.type === "story" ? "Story" : "Concept"));
    p.appendChild(head);
    p.appendChild(el("h2", null, n.label));
    p.appendChild(el("p", null, n.summary));

    if (n.type === "domain") {
      var kids = nodes.filter(function (c) { return c.parent === n.id; });
      var chips = el("div", "chips");
      kids.forEach(function (c) { chips.appendChild(chip(c.id)); });
      section(p, "Concepts", chips);
      var stories = nodes.filter(function (s) { return s.type === "story" && (s.related || []).some(function (r) { return byId.get(r) && (r === n.id || byId.get(r).parent === n.id); }); });
      if (stories.length) {
        var sc = el("div", "chips");
        stories.forEach(function (s) { sc.appendChild(chip(s.id)); });
        section(p, "Stories that use these", sc);
      }
    }

    if (n.type === "concept") {
      if (n.why) section(p, "Why it matters", el("p", null, n.why));
      if (n.practice) section(p, "In practice", listOf(n.practice));
      if (n.pitfalls) section(p, "Common pitfalls", listOf(n.pitfalls));
      if (n.reflect) section(p, "Connect it to my experience", listOf(n.reflect));
      var stories2 = nodes.filter(function (s) { return s.type === "story" && (s.related || []).indexOf(n.id) !== -1; });
      if (stories2.length) {
        var sc2 = el("div", "chips");
        stories2.forEach(function (s) { sc2.appendChild(chip(s.id)); });
        section(p, "Stories that show it", sc2);
      }
    }

    if (n.type === "story") {
      if (n.experience) section(p, "What happened", el("p", null, n.experience));
      else {
        var box = el("div", "todo");
        box.appendChild(el("p", null, "Not written yet. Keep it anonymous: describe the type of company, team and situation, never names."));
        box.appendChild(listOf(n.prompts || []));
        section(p, "Yours to write", box);
      }
    }

    var rel = (n.related || []).filter(function (r) { return byId.has(r); });
    if (rel.length) {
      var rc = el("div", "chips");
      rel.forEach(function (r) { rc.appendChild(chip(r)); });
      section(p, "Related", rc);
    }

    if (n.type !== "domain") {
      var row = el("div", "row");
      var done = revisited.has(n.id);
      var btn = el("button", null, done ? "Revisited ✓ (undo)" : "Mark as revisited");
      btn.type = "button";
      btn.addEventListener("click", function () {
        if (revisited.has(n.id)) revisited.delete(n.id); else revisited.add(n.id);
        saveRevisited(); styleNodes(); showPanel(n);
      });
      row.appendChild(btn);
      p.appendChild(row);
    }
    p.scrollTop = 0;
  }

  // ---------- controls ----------
  document.getElementById("expand").addEventListener("click", function () {
    domains.forEach(function (d) { state.expanded.add(d.id); });
    render();
  });
  document.getElementById("collapse").addEventListener("click", function () {
    state.expanded.clear(); render();
  });
  document.getElementById("stories").addEventListener("change", function (e) {
    state.showStories = e.target.checked; render();
  });
  document.getElementById("search").addEventListener("input", function (e) {
    state.query = e.target.value;
    if (state.query.trim()) {
      nodes.forEach(function (n) { if (n.type === "concept" && matches(n)) state.expanded.add(n.parent); });
    }
    render();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanel(); });
  window.addEventListener("hashchange", function () {
    var id = location.hash.slice(1);
    if (id && id !== state.selected && byId.has(id)) select(id);
  });

  // ---------- start ----------
  render();
  var startId = location.hash.slice(1);
  if (startId && byId.has(startId)) select(startId);
})();
