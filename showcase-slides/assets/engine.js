(function () {
  "use strict";

  var W = 1920;
  var H = 1080;
  var SAFE_W = W - 220;
  var params = new URLSearchParams(location.search);
  var QA = params.has("qa");
  var STATIC = QA || params.has("static");
  var root = document.documentElement;
  if (STATIC) root.classList.add("static");

  var config = {};
  try { config = JSON.parse(document.getElementById("deck-config").textContent || "{}"); } catch (err) { config = {}; }

  var stage = document.getElementById("stage");
  var slides = [].slice.call(stage.querySelectorAll(":scope > section.slide"));
  var N = slides.length;
  var cur = -1;
  var timerStart = null;

  var TONES = {
    accent: ["var(--accent)", "var(--accent-ink)"],
    pos: ["var(--pos)", "var(--pos-ink)"],
    neg: ["var(--neg)", "var(--neg-ink)"],
    warn: ["var(--warn)", "var(--warn-ink)"],
    muted: ["var(--bar-muted)", "var(--muted)"],
    ink: ["var(--ink)", "var(--ink)"]
  };

  function tone(name, fallback) { return TONES[name] || TONES[fallback || "accent"]; }
  function num(s) { return parseFloat(String(s == null ? "" : s).replace(/,/g, "")); }
  function decimalsOf(s) { var m = String(s == null ? "" : s).match(/\.(\d+)/); return m ? m[1].length : 0; }
  function fmt(v, dec) { return v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function make(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function all(scope, sel) { return [].slice.call(scope.querySelectorAll(sel)); }
  function viewScale() { return Math.min(window.innerWidth / W, window.innerHeight / H) || 0; }
  function fitStage() { stage.style.transform = "translate(-50%, -50%) scale(" + (viewScale() || 1) + ")"; }
  function valueText(i, suffix) { return i.dataset.text || (fmt(num(i.dataset.v), decimalsOf(i.dataset.v)) + (i.dataset.suffix != null ? i.dataset.suffix : suffix)); }

  function buildVchart(c) {
    var max = num(c.dataset.max || 100);
    var suffix = c.dataset.suffix || "";
    var groups = all(c, ":scope > .grp").map(function (g) { return { label: g.dataset.label || "", items: all(g, "i") }; });
    if (!groups.length) groups = all(c, ":scope > i").map(function (i) { return { label: i.dataset.label || "", items: [i] }; });
    var plot = make("div", "plot");
    var axis = make("div", "axis");
    var names = [];
    var j = 0;
    groups.forEach(function (g) {
      var grp = make("div", "grp");
      g.items.forEach(function (i) {
        var t = tone(i.dataset.tone, "accent");
        var bar = make("div", "bar");
        var fill = make("div", "fill");
        fill.style.setProperty("--hv", Math.max(0, Math.min(100, num(i.dataset.v) / max * 100)) + "%");
        fill.style.setProperty("--c", t[0]);
        fill.style.setProperty("--j", j++);
        var val = make("div", "val", valueText(i, suffix));
        val.style.setProperty("--vc", t[1]);
        fill.appendChild(val);
        bar.appendChild(fill);
        grp.appendChild(bar);
        if (i.dataset.name && !names.some(function (n) { return n.name === i.dataset.name; })) names.push({ name: i.dataset.name, c: t[0] });
      });
      plot.appendChild(grp);
      axis.appendChild(make("div", null, g.label));
    });
    if (c.dataset.ref) {
      var ref = make("div", "ref");
      ref.style.setProperty("--r", Math.min(1, num(c.dataset.ref) / max));
      ref.appendChild(make("span", null, c.dataset.refLabel || c.dataset.ref));
      plot.appendChild(ref);
    }
    c.innerHTML = "";
    c.appendChild(plot);
    c.appendChild(axis);
    if (names.length) {
      var lg = make("div", "legend");
      names.forEach(function (n) { lg.appendChild(make("span", null, '<i class="sw" style="--c:' + n.c + '"></i>' + n.name)); });
      c.appendChild(lg);
    }
  }

  function buildHchart(c) {
    var items = all(c, ":scope > i");
    var max = num(c.dataset.max) || Math.max.apply(null, items.map(function (i) { return num(i.dataset.v); })) * 1.05;
    var suffix = c.dataset.suffix || "";
    if (c.dataset.labelWidth) c.style.setProperty("--lw", c.dataset.labelWidth);
    c.innerHTML = "";
    items.forEach(function (i, j) {
      var t = tone(i.dataset.tone, "muted");
      var row = make("div", "hrow" + (i.hasAttribute("data-hl") ? " hl" : ""));
      row.appendChild(make("span", null, i.dataset.label || ""));
      var track = make("div", "track");
      var bar = make("i");
      bar.style.setProperty("--wv", Math.max(0, Math.min(100, num(i.dataset.v) / max * 100)) + "%");
      bar.style.setProperty("--c", t[0]);
      bar.style.setProperty("--j", j);
      track.appendChild(bar);
      row.appendChild(track);
      var n = make("span", "num", valueText(i, suffix));
      if (i.dataset.tone && i.dataset.tone !== "muted") n.style.color = t[1];
      row.appendChild(n);
      c.appendChild(row);
    });
  }

  function buildDotplot(c) {
    var items = all(c, ":scope > i");
    var vals = items.map(function (i) { return num(i.dataset.v); });
    var min = c.dataset.min != null ? num(c.dataset.min) : Math.floor(Math.min.apply(null, vals));
    var max = c.dataset.max != null ? num(c.dataset.max) : Math.ceil(Math.max.apply(null, vals));
    var step = num(c.dataset.step) || (max - min) / 5;
    var suffix = c.dataset.suffix || "";
    if (c.dataset.labelWidth) c.style.setProperty("--lw", c.dataset.labelWidth);
    c.innerHTML = "";
    items.forEach(function (i, j) {
      var hl = i.hasAttribute("data-hl");
      var t = tone(i.dataset.tone, hl ? "accent" : "muted");
      var row = make("div", "drow" + (hl ? " hl" : ""));
      row.appendChild(make("span", null, i.dataset.label || ""));
      var line = make("div", "line");
      var dot = make("i");
      dot.style.left = Math.max(0, Math.min(100, (num(i.dataset.v) - min) / (max - min) * 100)) + "%";
      dot.style.setProperty("--c", t[0]);
      dot.style.setProperty("--j", j);
      line.appendChild(dot);
      row.appendChild(line);
      var n = make("span", "num", valueText(i, suffix));
      if (hl || (i.dataset.tone && i.dataset.tone !== "muted")) n.style.color = t[1];
      row.appendChild(n);
      c.appendChild(row);
    });
    var ticks = make("div", "ticks");
    ticks.appendChild(make("span"));
    var scaleRow = make("div");
    var dec = decimalsOf(step);
    for (var v = min; v <= max + step / 1000; v += step) scaleRow.appendChild(make("span", null, fmt(v, dec)));
    ticks.appendChild(scaleRow);
    ticks.appendChild(make("span"));
    c.appendChild(ticks);
  }

  function buildHeat(c) {
    var cols = (c.dataset.cols || "").split("|");
    var rows = (c.dataset.rows || "").split("|");
    var values = (c.dataset.values || "").split(";").map(function (r) { return r.split(",").map(num); });
    var mode = c.dataset.mode || "row";
    var diag = c.hasAttribute("data-diag");
    var maxAll = Math.max.apply(null, values.map(function (r) { return Math.max.apply(null, r); }));
    c.style.gridTemplateColumns = (c.dataset.rowWidth || "220px") + " repeat(" + cols.length + ", minmax(0, 1fr))";
    c.innerHTML = "";
    c.appendChild(make("div", "hh"));
    cols.forEach(function (h) { c.appendChild(make("div", "hh", h)); });
    values.forEach(function (r, ri) {
      var total = r.reduce(function (a, b) { return a + b; }, 0);
      c.appendChild(make("div", "hh", rows[ri] || ""));
      r.forEach(function (v, ci) {
        var share = mode === "all" || mode === "none" ? v / maxAll : (total ? v / total : 0);
        var pct = Math.round(6 + 46 * share);
        var cell = make("div", "cell" + (diag && ri === ci ? " diag" : ""));
        cell.style.background = "color-mix(in srgb, var(--accent-strong) " + pct + "%, var(--card))";
        var label = mode === "none" ? "" : (mode === "all" ? "" : Math.round(total ? v / total * 100 : 0) + "%");
        cell.innerHTML = "<b>" + fmt(v, decimalsOf(v)) + "</b>" + label;
        c.appendChild(cell);
      });
    });
  }

  function buildDonut(c) {
    var v = num(c.dataset.v);
    var max = num(c.dataset.max || 100);
    var t = tone(c.dataset.tone, "accent");
    var circ = 2 * Math.PI * 48;
    var dec = decimalsOf(c.dataset.v);
    var suffix = c.dataset.suffix != null ? c.dataset.suffix : "%";
    c.style.setProperty("--c", t[0]);
    c.style.setProperty("--dash", (Math.max(0, Math.min(1, v / max)) * circ).toFixed(2));
    c.innerHTML = '<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="48"></circle><circle class="fg" cx="60" cy="60" r="48"></circle></svg>' +
      '<div class="in"><div class="v"><span data-count="' + c.dataset.v + '" data-dec="' + dec + '">' + fmt(v, dec) + "</span>" + (suffix ? "<small>" + suffix + "</small>" : "") + "</div>" +
      (c.dataset.label ? '<div class="l">' + c.dataset.label + "</div>" : "") + "</div>";
  }

  function buildMix(c) {
    var parts = (c.dataset.parts || "").split("|").filter(Boolean).map(function (p) { var x = p.split(":"); return { name: x[0], v: num(x[1]), raw: x[1], tone: x[2] }; });
    var total = parts.reduce(function (a, p) { return a + p.v; }, 0) || 1;
    var suffix = c.dataset.suffix != null ? c.dataset.suffix : "%";
    var bar = make("div", "mbar");
    var legend = make("div", "mlegend");
    parts.forEach(function (p, j) {
      var t = tone(p.tone, "accent");
      var s = make("span");
      s.style.setProperty("--w", (p.v / total * 100) + "%");
      s.style.setProperty("--c", t[0]);
      s.style.setProperty("--j", j);
      bar.appendChild(s);
      var l = make("span", null, p.name + " <b>" + p.raw + suffix + "</b>");
      l.style.setProperty("--c", t[0]);
      legend.appendChild(l);
    });
    c.innerHTML = "";
    c.appendChild(bar);
    c.appendChild(legend);
  }

  function buildFlow(c) {
    var nodes = all(c, ":scope > .node");
    if (!c.querySelector(":scope > .arrow")) {
      nodes.slice(1).forEach(function (n) { c.insertBefore(make("div", "arrow"), n); });
    }
    if (c.classList.contains("numbered")) {
      nodes.forEach(function (n, k) { if (!n.querySelector(".badge")) n.insertBefore(make("span", "badge", String(k + 1)), n.firstChild); });
    }
  }

  function buildComponents(s) {
    all(s, ".vchart").forEach(buildVchart);
    all(s, ".hchart").forEach(buildHchart);
    all(s, ".dotplot").forEach(buildDotplot);
    all(s, ".heat").forEach(buildHeat);
    all(s, ".donut").forEach(buildDonut);
    all(s, ".mix[data-parts]").forEach(buildMix);
    all(s, ".flow").forEach(buildFlow);
    all(s, ".arrow").forEach(function (a, k) { a.style.setProperty("--k", k); });
    all(s, "[data-count]").forEach(function (e) {
      var dec = e.dataset.dec != null ? +e.dataset.dec : decimalsOf(e.dataset.count);
      e.dataset.dec = dec;
      e._final = fmt(num(e.dataset.count), dec);
      e.textContent = e._final;
    });
  }

  function prepareSlide(s, i) {
    buildComponents(s);
    var title = s.querySelector(":scope > h2.title");
    if (!s.dataset.title) {
      var t = s.querySelector("h2.title, h1.display, .quote, .h3");
      s.dataset.title = t ? t.textContent.trim().replace(/\s+/g, " ").slice(0, 96) : "Slide " + (i + 1);
    }
    var body = make("div", "body");
    var fit = make("div", "fit");
    body.appendChild(fit);
    [].slice.call(s.children).forEach(function (c) {
      var outside = c.classList.contains("notes") || c.classList.contains("glow") || (title && (c === title || (c.classList.contains("kicker") && c.nextElementSibling === title)));
      if (!outside) fit.appendChild(c);
    });
    s.appendChild(body);
    if (s.dataset.bg) {
      s.classList.add("photo");
      var bg = make("div", "photo-bg");
      bg.style.backgroundImage = "url(\"" + s.dataset.bg.replace(/"/g, "%22") + "\")";
      if (s.dataset.bgPos) bg.style.setProperty("--bg-pos", s.dataset.bgPos);
      s.insertBefore(bg, s.firstChild);
      var probe = new Image();
      probe.onerror = function () { s.dataset.bgError = "1"; };
      probe.src = s.dataset.bg;
    } else if ((s.matches(".cover, .divider, .closing, .inverse")) && s.dataset.glow !== "off") {
      s.insertBefore(make("div", "glow"), s.firstChild);
    }
    if (!s.classList.contains("cover") && s.dataset.foot !== "none") {
      var foot = make("div", "foot");
      foot.appendChild(make("span", null, s.dataset.source || config.footer || ""));
      foot.appendChild(make("span", null, (i + 1) + " / " + N));
      s.appendChild(foot);
    }
    if (!s.querySelector(".a")) {
      var kicker = s.querySelector(":scope > .kicker");
      if (kicker) kicker.classList.add("a");
      if (title) title.classList.add("a");
      [].slice.call(fit.children).forEach(function (c) { c.classList.add("a"); });
    }
    all(s, ".a").forEach(function (e, k) { if (!e.style.getPropertyValue("--i")) e.style.setProperty("--i", k); });
    s._steps = all(s, ".step");
    s._stepIdx = 0;
  }

  function sizeStatRows(s) {
    all(s, ".stat-row:not(.bare)").forEach(function (row) {
      var cards = [].slice.call(row.children);
      row.style.gridTemplateColumns = "";
      row.style.gridAutoFlow = "";
      function intrinsic(e, mode) {
        var w = e.style.width;
        var d = e.style.display;
        e.style.display = "block";
        e.style.width = mode;
        var r = e.getBoundingClientRect().width / ((stage.getBoundingClientRect().width / W) || 1) / (parseFloat(row.closest(".fit").style.zoom) || 1);
        e.style.width = w;
        e.style.display = d;
        return r;
      }
      var needs = cards.map(function (card) {
        var cs = getComputedStyle(card);
        var pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        var v = card.querySelector(".v");
        var l = card.querySelector(".l");
        var need = 120;
        if (v) { v.style.fontSize = ""; need = Math.max(need, intrinsic(v, "max-content")); }
        if (l) need = Math.max(need, intrinsic(l, "min-content"));
        return need + pad + 16;
      });
      row.style.gridAutoFlow = "row";
      row.style.gridTemplateColumns = needs.map(function (n) { return "minmax(0, " + Math.round(n) + "fr)"; }).join(" ");
    });
  }

  function shrinkNumbers(s) {
    all(s, ".stat .v, .donut .in .v, .vchart .val").forEach(function (v) {
      v.style.fontSize = "";
      var base = parseFloat(getComputedStyle(v).fontSize);
      var size = base;
      var guard = v.classList.contains("val") ? v.parentNode.parentNode : v;
      var limit = guard.clientWidth || v.clientWidth;
      while ((v.classList.contains("val") ? v.scrollWidth > limit + 30 : v.scrollWidth > v.clientWidth + 1) && size > base * 0.55) {
        size -= 1;
        v.style.fontSize = size + "px";
      }
    });
  }

  function sizeChartLabels(s) {
    all(s, ".dotplot, .hchart").forEach(function (c) {
      var rows = all(c, ".drow, .hrow");
      if (!rows.length) return;
      var widest = function (sel) {
        return rows.reduce(function (m, r) {
          var e = r.querySelector(sel);
          if (!e) return m;
          var d = e.style.display;
          e.style.display = "inline-block";
          var w = e.offsetWidth;
          e.style.display = d;
          return Math.max(m, w);
        }, 0);
      };
      if (!c.dataset.labelWidth) c.style.setProperty("--lw", Math.ceil(widest(":scope > span:first-child") + 8) + "px");
      c.style.setProperty("--nw", Math.ceil(Math.max(70, widest(".num")) + 4) + "px");
    });
  }

  function shrinkCells(s) {
    all(s, ".heat .cell, .node").forEach(function (cell) {
      var b = cell.querySelector(":scope > b");
      if (!b) return;
      b.style.fontSize = "";
      var base = parseFloat(getComputedStyle(b).fontSize);
      var size = base;
      while (cell.scrollWidth > cell.clientWidth + 1 && size > base * 0.6) {
        size -= 1;
        b.style.fontSize = size + "px";
      }
    });
  }

  function lockCounts(s) {
    all(s, "[data-count]").forEach(function (e) {
      e.style.minWidth = "";
      e.textContent = e._final;
      e.style.minWidth = e.offsetWidth + "px";
    });
  }

  function fitSlide(s) {
    var body = s.querySelector(":scope > .body");
    var fit = body.firstChild;
    var title = s.querySelector(":scope > h2.title");
    var kicker = s.querySelector(":scope > .kicker");
    var top = title ? title.offsetTop + title.offsetHeight + 40 : (kicker ? kicker.offsetTop + kicker.offsetHeight + 32 : 84);
    var bottom = s.querySelector(":scope > .foot") ? 100 : 80;
    var availH = H - top - bottom;
    body.style.top = top + "px";
    body.style.height = availH + "px";
    var sc = stage.getBoundingClientRect().width / W;
    if (!sc) return false;
    var prev = s.style.transition;
    s.style.transition = "none";
    s.style.transform = "none";
    fit.style.zoom = 1;
    all(s, "[data-count]").forEach(function (e) { e.style.minWidth = ""; e.textContent = e._final; });
    sizeStatRows(s);
    sizeChartLabels(s);
    var maxZ = num(s.dataset.zoomMax || config.zoomMax || 1.6);
    var minZ = 0.6;
    function test(z) {
      fit.style.zoom = z;
      shrinkNumbers(s);
      shrinkCells(s);
      var h = fit.getBoundingClientRect().height / sc;
      return { ok: h <= availH - 4 && fit.scrollWidth * z <= SAFE_W + 2, h: h };
    }
    var lo = minZ;
    var hi = maxZ;
    if (test(maxZ).ok) {
      lo = maxZ;
    } else {
      for (var n = 0; n < 11; n++) {
        var mid = (lo + hi) / 2;
        if (test(mid).ok) lo = mid; else hi = mid;
      }
    }
    var r = test(lo);
    s.dataset.zoom = lo.toFixed(3);
    s.dataset.zoomMaxUsed = maxZ;
    s.dataset.fill = (r.h / availH).toFixed(3);
    s.dataset.overflow = r.ok ? "0" : "1";
    lockCounts(s);
    s.style.transform = "";
    void s.offsetWidth;
    s.style.transition = prev;
    return true;
  }

  function layoutAll() {
    fitStage();
    slides.forEach(fitSlide);
  }

  function countUp(s) {
    if (STATIC) return;
    all(s, "[data-count]").forEach(function (e) {
      var target = num(e.dataset.count);
      var dec = +e.dataset.dec;
      var token = {};
      e._token = token;
      e.textContent = fmt(0, dec);
      setTimeout(function () {
        var t0 = null;
        requestAnimationFrame(function tick(t) {
          if (e._token !== token) return;
          if (t0 === null) t0 = t;
          var p = Math.min((t - t0) / 1500, 1);
          var k = 1 - Math.pow(1 - p, 4);
          e.textContent = p < 1 ? fmt(target * k, dec) : e._final;
          if (p < 1) requestAnimationFrame(tick);
        });
      }, 420);
    });
  }

  var ui = {};

  function buildUI() {
    ui.bar = make("div");
    ui.bar.id = "bar";
    ui.wrap = make("div");
    ui.wrap.id = "ui";
    ui.prev = make("button", null, "&#8592;");
    ui.prev.setAttribute("aria-label", "Previous");
    ui.count = make("button");
    ui.count.id = "count";
    ui.count.setAttribute("aria-label", "Slide list");
    ui.next = make("button", null, "&#8594;");
    ui.next.setAttribute("aria-label", "Next");
    ui.fs = make("button", null, "Fullscreen (F)");
    ui.notesBtn = make("button", null, "Notes (N)");
    [ui.prev, ui.count, ui.next, ui.fs, ui.notesBtn].forEach(function (b) { ui.wrap.appendChild(b); });
    ui.menu = make("div", "overlay");
    ui.menu.id = "menu";
    ui.list = make("ol");
    ui.menu.appendChild(ui.list);
    slides.forEach(function (s, i) {
      var li = make("li", null, "");
      li.textContent = s.dataset.title;
      li.addEventListener("click", function () { closeOverlays(); go(i); });
      ui.list.appendChild(li);
    });
    ui.help = make("div", "overlay", '<div class="box"><h3>Presenter controls</h3><dl>' +
      "<dt>&#8594; / &#8595;</dt><dd>Next step or slide</dd><dt>&#8592; / &#8593;</dt><dd>Previous step or slide</dd>" +
      "<dt>Home / End</dt><dd>First / last slide</dd><dt>F</dt><dd>Fullscreen</dd><dt>N</dt><dd>Speaker notes and timer</dd>" +
      "<dt>G</dt><dd>Slide list</dd><dt>B</dt><dd>Black screen</dd><dt>?</dt><dd>This help</dd><dt>Esc</dt><dd>Close panels</dd>" +
      "<dt>Ctrl + P</dt><dd>Save the deck as PDF</dd></dl></div>");
    ui.help.id = "help";
    ui.notes = make("div", null, '<div class="meta"><span class="t"></span><span class="clock"></span></div><div class="text"></div><div class="next"></div>');
    ui.notes.id = "notes";
    ui.black = make("div");
    ui.black.id = "black";
    ui.hint = make("div", null, "&#8592; &#8594; move &nbsp;&middot;&nbsp; F fullscreen &nbsp;&middot;&nbsp; N notes &nbsp;&middot;&nbsp; G slides &nbsp;&middot;&nbsp; ? help");
    ui.hint.id = "hint";
    [ui.bar, ui.wrap, ui.menu, ui.help, ui.notes, ui.black, ui.hint].forEach(function (e) { document.body.appendChild(e); });
    function press(fn) { return function (e) { fn(); e.currentTarget.blur(); focusPage(); }; }
    ui.prev.addEventListener("click", press(prev));
    ui.next.addEventListener("click", press(next));
    ui.fs.addEventListener("click", press(toggleFs));
    ui.count.addEventListener("click", press(function () { toggle(ui.menu); }));
    ui.notesBtn.addEventListener("click", press(function () { toggle(ui.notes); renderNotes(); }));
    [ui.menu, ui.help].forEach(function (o) { o.addEventListener("click", function (e) { if (e.target === o || o === ui.help) closeOverlays(); }); });
    setTimeout(function () { ui.hint.classList.add("gone"); }, 4500);
  }

  function toggle(o) { var open = !o.classList.contains("open"); if (o !== ui.notes) closeOverlays(); o.classList.toggle("open", open); }
  function closeOverlays() { ui.menu.classList.remove("open"); ui.help.classList.remove("open"); }

  function clock() {
    if (timerStart === null) return "00:00";
    var s = Math.floor((Date.now() - timerStart) / 1000);
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  function renderNotes() {
    if (!ui.notes || cur < 0) return;
    var s = slides[cur];
    var n = s.querySelector(".notes");
    ui.notes.querySelector(".t").textContent = (cur + 1) + " / " + N + "  ·  " + s.dataset.title;
    ui.notes.querySelector(".clock").textContent = "elapsed " + clock();
    ui.notes.querySelector(".text").innerHTML = n ? n.innerHTML : "No notes for this slide.";
    var nx = slides[cur + 1];
    var left = s._steps.length - s._stepIdx;
    ui.notes.querySelector(".next").textContent = left > 0 ? left + " more step(s) on this slide" : (nx ? "Next: " + nx.dataset.title : "Last slide");
  }

  function updateUI() {
    ui.bar.style.width = ((cur + 1) / N * 100) + "%";
    ui.count.textContent = (cur + 1) + " / " + N;
    [].slice.call(ui.list.children).forEach(function (li, i) { li.classList.toggle("cur", i === cur); });
    renderNotes();
    try { history.replaceState(null, "", location.pathname + location.search + "#" + (cur + 1)); } catch (err) {}
  }

  function go(n, back) {
    n = Math.max(0, Math.min(N - 1, n));
    if (n === cur) return;
    slides.forEach(function (s, i) {
      s.classList.toggle("active", i === n);
      s.classList.toggle("past", i < n);
    });
    var s = slides[n];
    var reveal = STATIC || !!back;
    s._steps.forEach(function (st) { st.classList.toggle("shown", reveal); });
    s._stepIdx = reveal ? s._steps.length : 0;
    cur = n;
    countUp(s);
    if (ui.bar) updateUI();
  }

  function next() {
    var s = slides[cur];
    if (s && s._stepIdx < s._steps.length) { s._steps[s._stepIdx++].classList.add("shown"); renderNotes(); return; }
    go(cur + 1);
  }

  function prev() {
    var s = slides[cur];
    if (s && s._stepIdx > 0) { s._steps[--s._stepIdx].classList.remove("shown"); renderNotes(); return; }
    go(cur - 1, true);
  }

  function toggleFs() {
    var d = document.documentElement;
    try {
      if (!(document.fullscreenElement || document.webkitFullscreenElement)) (d.requestFullscreen || d.webkitRequestFullscreen).call(d);
      else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } catch (err) {}
  }

  function focusPage() { try { window.focus(); document.body.focus({ preventScroll: true }); } catch (err) {} }

  var idleTimer;
  function wake() {
    if (!ui.wrap) return;
    ui.wrap.classList.remove("hide");
    document.body.classList.remove("idle");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { ui.wrap.classList.add("hide"); document.body.classList.add("idle"); }, 2600);
  }

  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key;
    var c = e.keyCode;
    var handled = true;
    if (k === "ArrowRight" || k === "ArrowDown" || c === 39 || c === 40) { ui.black.classList.remove("on"); next(); }
    else if (k === "ArrowLeft" || k === "ArrowUp" || c === 37 || c === 38) { ui.black.classList.remove("on"); prev(); }
    else if (k === "Home" || c === 36) go(0);
    else if (k === "End" || c === 35) go(N - 1, true);
    else if (k === "f" || k === "F" || c === 70) toggleFs();
    else if (k === "g" || k === "G" || c === 71) toggle(ui.menu);
    else if (k === "n" || k === "N" || c === 78) { toggle(ui.notes); renderNotes(); }
    else if (k === "b" || k === "B" || k === "." || c === 66) ui.black.classList.toggle("on");
    else if (k === "?" || k === "h" || k === "H") toggle(ui.help);
    else if (k === "Escape" || c === 27) { closeOverlays(); ui.notes.classList.remove("open"); ui.black.classList.remove("on"); }
    else handled = false;
    if (handled) {
      e.preventDefault();
      if (timerStart === null) timerStart = Date.now();
      ui.hint.classList.add("gone");
    }
    wake();
  }

  function parseColor(str) {
    var m = /rgba?\(([^)]+)\)/.exec(str);
    if (m) { var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
    m = /color\(srgb\s+([^)]+)\)/.exec(str);
    if (m) { var q = m[1].split(/[\s\/]+/).filter(Boolean).map(parseFloat); return [q[0] * 255, q[1] * 255, q[2] * 255, q.length > 3 ? q[3] : 1]; }
    return null;
  }
  function over(top, bottom) { var a = top[3]; return [top[0] * a + bottom[0] * (1 - a), top[1] * a + bottom[1] * (1 - a), top[2] * a + bottom[2] * (1 - a), 1]; }
  function lum(c) { var f = c.slice(0, 3).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; }
  function ratio(a, b) { var x = lum(a); var y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function backdrop(node) {
    var layers = [];
    for (var n = node; n && n.nodeType === 1; n = n.parentElement) {
      var c = parseColor(getComputedStyle(n).backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
    }
    var base = [255, 255, 255, 1];
    for (var i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return base;
  }
  function words(t) { return (t.trim().match(/\S+/g) || []).length; }

  function runQA() {
    var report = { deck: document.title, theme: root.dataset.theme || "paper", slides: [], errors: 0, warnings: 0 };
    var signatures = [];
    var visual = 0;
    var content = 0;
    slides.forEach(function (s, i) {
      go(i, true);
      var issues = [];
      function add(level, rule, msg) { issues.push({ level: level, rule: rule, msg: msg }); if (level === "error") report.errors++; else report.warnings++; }
      var z = +s.dataset.zoom;
      var maxZ = +s.dataset.zoomMaxUsed;
      var fill = +s.dataset.fill;
      var fit = s.querySelector(".fit");
      var special = s.matches(".cover, .divider, .closing, .photo") || !!s.querySelector(".fit > .quote, .fit > .a.quote");
      if (s.dataset.overflow === "1") add("error", "overflow", "content does not fit even at " + Math.round(z * 100) + "% zoom: cut content or split the slide");
      if (!special && fill < 0.74 && z >= maxZ - 0.005) add("warn", "underfill", "content fills only " + Math.round(fill * 100) + "% of the free height at maximum zoom: add or enlarge an exhibit, or merge with a neighbour");
      if (z < 0.86) add("warn", "dense", "content had to shrink to " + Math.round(z * 100) + "%: cut words or split the slide");
      var seen = 0;
      all(s, "*").forEach(function (e) {
        if (e.closest(".notes") || e.tagName === "SCRIPT" || e.tagName === "STYLE") return;
        var own = [].slice.call(e.childNodes).some(function (n) { return n.nodeType === 3 && n.textContent.trim(); });
        if (!own) return;
        var cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        var inFit = !!e.closest(".fit");
        var eff = parseFloat(cs.fontSize) * (inFit ? z : 1);
        var sample = e.textContent.trim().replace(/\s+/g, " ").slice(0, 40);
        if (eff < 19.5) add("error", "small-text", Math.round(eff) + "px text is unreadable from the back of a room: \"" + sample + "\"");
        var fg = parseColor(cs.color);
        if (fg && !e.closest(".media")) {
          var bg = backdrop(e.classList.contains("val") ? e.closest(".plot") : e);
          var col = fg[3] < 1 ? over(fg, bg) : fg;
          var cr = ratio(col, bg);
          var large = eff >= 32 || (eff >= 24 && parseInt(cs.fontWeight, 10) >= 600);
          var need = large ? 3 : 4.5;
          if (cr < need && seen < 6) { seen++; add("error", "contrast", "contrast " + cr.toFixed(2) + ":1 (needs " + need + ":1) for \"" + sample + "\""); }
        }
        if (e.matches(".v, .val, .num, .pill, .chip, .node b, h2.title, .h3") && e.scrollWidth > e.clientWidth + 2 && cs.whiteSpace === "nowrap") add("error", "clipped", "text overflows its box: \"" + sample + "\"");
      });
      all(s, ".fit .card, .fit .node").forEach(function (b) {
        if (b.scrollWidth > b.clientWidth + 2 || b.scrollHeight > b.clientHeight + 2) {
          var t = b.textContent.trim().replace(/\s+/g, " ").slice(0, 40);
          add("error", "box-overflow", "content spills out of a card or node by " + Math.max(b.scrollWidth - b.clientWidth, b.scrollHeight - b.clientHeight) + "px (wrap the row, shorten text or widen the box): \"" + t + "\"");
        }
      });
      var wc = fit ? words(fit.innerText) - all(fit, ".chip").reduce(function (a, c) { return a + words(c.textContent); }, 0) : 0;
      if (!s.querySelector(".refs")) {
        if (wc > 110) add("error", "wordy", wc + " words of body text: a slide is not a document, keep it under 80");
        else if (wc > 80) add("warn", "wordy", wc + " words of body text: aim for 40 to 80");
      }
      var title = s.querySelector(":scope > h2.title");
      if (!title && !special) add("warn", "no-title", "content slide without an action title");
      if (title && words(title.textContent) > 16) add("warn", "long-title", "action title has " + words(title.textContent) + " words: keep it to one line or two short ones");
      if (!s.querySelector(".notes")) add("warn", "no-notes", "no speaker notes: add <aside class=\"notes\"> with what to say");
      if (/⟦|\[\[|lorem ipsum|TBD/i.test(s.innerText)) add("error", "placeholder", "unresolved placeholder text on the slide");
      if (s.dataset.bgError) add("error", "image", "background photo failed to load: " + s.dataset.bg);
      if (s.dataset.bg && s.dataset.scrim === "none" && s.querySelector(".fit h1, .fit h2, .fit .p, .fit .lead")) add("warn", "scrim", "text over a photo with data-scrim=\"none\": readability depends on the photo");
      all(s, "img").forEach(function (img) {
        if (!img.alt) add("warn", "alt", "image without alt text");
        if (img.complete && !img.naturalWidth) add("error", "image", "image failed to load: " + img.getAttribute("src"));
      });
      if (!special) {
        content++;
        if (s.querySelector(".vchart, .hchart, .dotplot, .heat, .donut, .mix, .flow, .flow-grid, .timeline, .seg, .stat, .figure, .vs, .eq, .media, .gallery")) visual++;
      }
      signatures.push(fit ? [].slice.call(fit.children).map(function (c) { return (c.className || c.tagName).replace(/\b(a|step|shown|grow)\b/g, "").replace(/\s+/g, " ").trim(); }).join("+") : "");
      report.slides.push({ n: i + 1, title: s.dataset.title, zoom: z, fill: fill, words: wc, issues: issues });
    });
    for (var i = 2; i < signatures.length; i++) {
      if (signatures[i] && signatures[i] === signatures[i - 1] && signatures[i] === signatures[i - 2]) {
        report.slides[i].issues.push({ level: "warn", rule: "repetition", msg: "third slide in a row with the same layout: vary the exhibit" });
        report.warnings++;
      }
    }
    report.deckIssues = [];
    if (N > 25) { report.deckIssues.push({ level: "warn", rule: "length", msg: N + " slides: long for a talk, consider an appendix" }); report.warnings++; }
    if (content && visual / content < 0.6) { report.deckIssues.push({ level: "warn", rule: "too-texty", msg: "only " + visual + " of " + content + " content slides carry a visual exhibit (aim for 60% or more)" }); report.warnings++; }
    var out = document.createElement("script");
    out.type = "application/json";
    out.id = "qa-result";
    out.textContent = JSON.stringify(report);
    document.body.appendChild(out);
    window.__QA = report;
    var panel = make("div");
    panel.id = "qa-panel";
    var lines = ["QA  " + report.errors + " error(s), " + report.warnings + " warning(s)", ""];
    report.deckIssues.forEach(function (d) { lines.push("deck  " + d.level.toUpperCase() + "  " + d.msg); });
    report.slides.forEach(function (r) {
      lines.push("#" + r.n + "  zoom " + r.zoom.toFixed(2) + "  fill " + Math.round(r.fill * 100) + "%  " + r.words + "w  " + r.title.slice(0, 48));
      r.issues.forEach(function (x) { lines.push("     " + x.level.toUpperCase() + " " + x.rule + ": " + x.msg); });
    });
    panel.textContent = lines.join("\n");
    document.body.appendChild(panel);
    go(0);
  }

  slides.forEach(prepareSlide);
  buildUI();
  document.body.tabIndex = -1;
  window.addEventListener("keydown", onKey, true);
  window.addEventListener("pointerdown", focusPage, true);
  document.addEventListener("mousemove", wake);
  window.addEventListener("beforeprint", function () {
    slides.forEach(function (s) { s._steps.forEach(function (st) { st.classList.add("shown"); }); all(s, "[data-count]").forEach(function (e) { e._token = null; e.textContent = e._final; }); });
  });
  var resizeTimer;
  window.addEventListener("resize", function () { fitStage(); clearTimeout(resizeTimer); resizeTimer = setTimeout(layoutAll, 120); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) layoutAll(); });
  window.addEventListener("hashchange", function () { var h = parseInt(location.hash.slice(1), 10); if (h) go(h - 1); });
  setInterval(function () { if (ui.notes.classList.contains("open")) ui.notes.querySelector(".clock").textContent = "elapsed " + clock(); }, 1000);

  layoutAll();
  var start = parseInt(location.hash.slice(1), 10);
  go(start ? start - 1 : 0, STATIC);
  wake();
  focusPage();

  var settle = function () {
    layoutAll();
    if (QA) setTimeout(runQA, 120);
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(settle, 60); });
  else setTimeout(settle, 300);
  window.addEventListener("load", function () { setTimeout(layoutAll, 30); });
})();
