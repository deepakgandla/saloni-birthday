/* ==========================================================================
   main.js — wires config → page, intro transition, scroll reveals,
   parallax, countdown, final bloom, music.
   ========================================================================== */
(function () {
  "use strict";

  const C = window.SITE_CONFIG;
  const F = window.Flowers;
  const E = window.Effects;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HEART = "\u2665\uFE0E"; // text-style heart (never a red emoji)

  F.injectSprite();

  /* ---------------- Fill text from config ---------------- */
  document.title = C.pageTitle || `Happy Birthday, ${C.name}`;

  $("[data-message]").textContent = C.message;
  $("[data-final-teaser]").textContent = C.final.teaser;
  $("[data-final-hint]").textContent = C.final.tapHint;
  $("[data-final-signoff]").textContent = C.final.signoff;
  $("[data-text-intro-sub]").textContent = C.intro.subtitle;
  $("[data-text-intro-btn]").textContent = C.intro.button;

  /* Render text with any ♥ shown as a soft blush heart that never wraps onto its own line */
  function setRich(el, text) {
    el.textContent = "";
    const parts = String(text).split(/\u2665\uFE0E?/);
    parts.forEach((part, i) => {
      if (i < parts.length - 1) part = part.replace(/ $/, "\u00A0"); // glue heart to previous word
      if (part) el.appendChild(document.createTextNode(part));
      if (i < parts.length - 1) {
        const h = document.createElement("span");
        h.className = "heart";
        h.textContent = HEART;
        el.appendChild(h);
      }
    });
  }

  $$("[data-name]").forEach((el) => !el.closest("#intro") && setRich(el, C.name));
  setRich($("[data-story-title]"), C.storyTitle);

  /* ---------------- Intro title: letter-by-letter reveal ---------------- */
  // Letters are grouped per word (nowrap) so a word never breaks mid-letter on small screens
  function splitChars(el, text, startIndex, heart) {
    let i = startIndex;
    const words = text.trim().split(/\s+/);
    words.forEach((word, wi) => {
      const w = document.createElement("span");
      w.className = "word";
      [...word].forEach((ch) => {
        const s = document.createElement("span");
        s.className = "ch";
        s.style.setProperty("--i", i++);
        s.textContent = ch;
        w.appendChild(s);
      });
      if (heart && wi === words.length - 1) {
        const s = document.createElement("span");
        s.className = "ch heart";
        s.style.setProperty("--i", i++ + 2);
        s.textContent = "\u00A0" + HEART;
        w.appendChild(s);
      }
      el.appendChild(w);
      if (wi < words.length - 1) { el.appendChild(document.createTextNode(" ")); i++; }
    });
    el.setAttribute("aria-hidden", "true");
    return i;
  }
  const introTitle = $("#intro-title");
  introTitle.setAttribute("aria-label", `Happy Birthday, ${C.name}`);
  const [line1, line2] = $$(".t-line", introTitle);
  let n = splitChars(line1, line1.dataset.text, 0, false);
  n = splitChars(line2, C.name, n + 3, false);

  const titleDone = 0.9 + (n * 70) / 1000 + 0.6; // seconds until the last letter settles
  const sub = $(".intro-sub");
  const openBtn = $("#open-btn");
  sub.classList.add("fade-up");
  sub.style.setProperty("--d", `${titleDone}s`);
  openBtn.classList.add("fade-up");
  openBtn.style.setProperty("--d", `${titleDone + 0.9}s`);

  /* ---------------- Build scenery ---------------- */
  const intro = $("#intro");
  F.garden($(".intro-garden"), { density: 1 });
  $$(".corner-branch", intro).forEach((c) => c.appendChild(F.branch()));
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $(".intro-garden").classList.add("in-view");
    $$(".corner-branch", intro).forEach((c) => c.classList.add("in-view"));
  }));

  const sky = E.Sky($("#sky"), { reduced });
  sky.start();
  const flyers = $("#flyers");
  const petals = reduced ? null : E.Petals($("#petals"));
  const butterflies = reduced ? null : E.Butterflies(flyers);
  const hearts = null; // floating hearts removed — the tone here is friendly, not romantic
  if (butterflies) butterflies.start(6000);

  // Main-page scenery is built up-front (while hidden) so opening is instant
  const main = $("#main");
  const greetGarden = $(".greeting-garden");
  const finaleGarden = $(".finale-garden");
  F.garden(greetGarden, { density: 0.9, maxVh: 0.34 });
  F.garden(finaleGarden, { density: 1.1, maxVh: 0.34 });
  $$(".message-card .corner").forEach((c, i) => c.appendChild(F.bouquet(i)));

  // Parallax accent flowers around the greeting, kept away from the text column
  const accents = $(".parallax-accents");
  const accentIds = ["blossom-pink", "forget-lav", "daisy", "rose-lav", "blossom-white", "forget-pink", "rose-blush", "forget-blue"];
  accentIds.forEach((id, i) => {
    const a = F.bloom(id, F.rnd(18, 40));
    const left = i % 2 === 0 ? F.rnd(2, 14) : F.rnd(84, 94);
    a.style.left = `${left}%`;
    // phones: keep them around the heading; desktop: along the sides of the card too
    const span = window.innerWidth < 768 ? 22 : 44;
    a.style.top = `${6 + (i / accentIds.length) * span + F.rnd(-2, 2)}%`;
    a.dataset.speed = F.rnd(0.12, 0.4).toFixed(2);
    accents.appendChild(a);
  });

  /* ---------------- Story cards ---------------- */
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const placeholderIds = ["rose-blush", "tulip-pink", "blossom-pink", "rose-lav", "daisy", "tulip-lav"];
  const timeline = $("#timeline");
  C.story.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "story-card" + (i === C.story.length - 1 ? " last" : "");
    li.style.transitionDelay = "0.1s";

    const tr = document.createElement("div");
    tr.className = "corner tr";
    tr.setAttribute("aria-hidden", "true");
    tr.appendChild(F.bouquet(i));
    const bl = document.createElement("div");
    bl.className = "corner bl";
    bl.setAttribute("aria-hidden", "true");
    bl.appendChild(F.bouquet(i + 1));

    const photo = document.createElement("div");
    photo.className = "photo";
    const showPlaceholder = () => {
      photo.innerHTML = "";
      const ph = document.createElement("div");
      ph.className = "placeholder";
      ph.setAttribute("aria-hidden", "true");
      ph.appendChild(F.bloom(placeholderIds[i % placeholderIds.length], 96));
      photo.appendChild(ph);
    };
    if (item.photo) {
      const img = new Image();
      img.src = item.photo;
      img.alt = item.title;
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = showPlaceholder;
      photo.appendChild(img);
    } else {
      showPlaceholder();
    }

    const body = document.createElement("div");
    body.className = "card-body";
    const chapter = document.createElement("span");
    chapter.className = "chapter";
    chapter.textContent = `Chapter ${ROMAN[i] || i + 1}`;
    body.appendChild(chapter);
    if (item.date) {
      const d = document.createElement("span");
      d.className = "card-date";
      d.textContent = item.date;
      body.appendChild(d);
    }
    const h3 = document.createElement("h3");
    h3.className = "card-title";
    setRich(h3, item.title);
    const p = document.createElement("p");
    p.className = "card-text";
    p.textContent = item.text;
    body.append(h3, p);

    li.append(tr, bl, photo, body);
    timeline.appendChild(li);
  });

  /* ---------------- Final bloom petals ---------------- */
  (function buildBloom() {
    const svg = $("#bloom-btn svg");
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML =
      `<linearGradient id="g-fpo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e493aa"/><stop offset=".6" stop-color="#f6c3d0"/><stop offset="1" stop-color="#fff0f3"/></linearGradient>` +
      `<linearGradient id="g-fpi" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c77f9c"/><stop offset=".6" stop-color="#e8a7bd"/><stop offset="1" stop-color="#f9dbe3"/></linearGradient>`;
    svg.prepend(defs);
    const P = "M100 100 C78 84 74 48 100 24 C126 48 122 84 100 100Z";
    const ring = (g, count, fill, delayStep) => {
      let s = "";
      for (let k = 0; k < count; k++) {
        const a = k * (360 / count) - 180 + 180 / count;
        s += `<path class="fp" d="${P}" fill="url(#${fill})" stroke="#d98aa2" stroke-width=".8" style="--a:${a.toFixed(1)}deg;--pd:${(Math.abs(a) / 180) * delayStep}s"/>`;
      }
      g.innerHTML = s;
    };
    ring($(".fb-outer", svg), 8, "g-fpo", 0.35);
    ring($(".fb-inner", svg), 6, "g-fpi", 0.25);
  })();

  /* ---------------- Fairy lights across the finale ---------------- */
  function buildLights() {
    const wrap = $(".fairy-lights");
    const W = Math.max(320, wrap.clientWidth || window.innerWidth);
    const strands = [[0, 10, W * 0.5, 90, W, 14], [W * 0.1, -6, W * 0.62, 62, W * 1.02, 30]];
    let s = `<defs><radialGradient id="g-bulb"><stop offset="0" stop-color="#fff3d6" stop-opacity=".95"/><stop offset=".35" stop-color="#ffd99a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd99a" stop-opacity="0"/></radialGradient></defs>`;
    strands.forEach(([x0, y0, cx, cy, x1, y1], si) => {
      s += `<path d="M${x0} ${y0} Q${cx} ${cy * 2 - (y0 + y1) / 2} ${x1} ${y1}" stroke="rgba(230,199,139,.35)" stroke-width="1" fill="none"/>`;
      const count = Math.round(W / (si ? 70 : 55));
      for (let k = 1; k < count; k++) {
        const t = k / count, u = 1 - t;
        const qy = cy * 2 - (y0 + y1) / 2;
        const x = u * u * x0 + 2 * u * t * cx + t * t * x1;
        const y = u * u * y0 + 2 * u * t * qy + t * t * y1;
        s += `<g class="bulb" style="--t:${F.rnd(2, 4.5).toFixed(1)}s;--td:${(-F.rnd(0, 4)).toFixed(1)}s"><circle cx="${x.toFixed(1)}" cy="${(y + 5).toFixed(1)}" r="12" fill="url(#g-bulb)"/><circle cx="${x.toFixed(1)}" cy="${(y + 5).toFixed(1)}" r="2.4" fill="#fff1d0"/></g>`;
      }
    });
    wrap.innerHTML = `<svg viewBox="0 0 ${W} 120" aria-hidden="true">${s}</svg>`;
  }

  /* ---------------- Observers ---------------- */
  // One-shot reveals: text, cards, and flower groups bloom as they enter
  const revealIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in-view"); revealIO.unobserve(e.target); }
    }),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );
  // Sections toggle .is-visible so off-screen loops pause (saves battery)
  const visibleSections = new Set();
  const visIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      e.target.classList.toggle("is-visible", e.isIntersecting);
      e.isIntersecting ? visibleSections.add(e.target) : visibleSections.delete(e.target);
    }),
    { rootMargin: "10% 0px" }
  );

  /* ---------------- Parallax (transform only, rAF-throttled) ---------------- */
  let parallaxItems = [];
  function collectParallax() {
    parallaxItems = [];
    $$(".greeting-garden .garden-layer, .finale-garden .garden-layer").forEach((layer) => {
      const speed = [0.16, 0.08, -0.04][Number(layer.dataset.depth)] || 0;
      parallaxItems.push({ el: layer, speed, section: layer.closest(".section") });
    });
    $$(".parallax-accents .accent").forEach((el) => parallaxItems.push({ el, speed: Number(el.dataset.speed), section: el.closest(".section") }));
  }
  let ticking = false;
  function updateParallax() {
    ticking = false;
    const y = window.scrollY;
    for (const it of parallaxItems) {
      if (!visibleSections.has(it.section)) continue;
      const delta = y - it.section.offsetTop;
      it.el.style.transform = `translate3d(0, ${(delta * it.speed).toFixed(1)}px, 0)`;
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
  }

  /* ---------------- Music ---------------- */
  const audio = $("#bg-music");
  const musicBtn = $("#music-toggle");
  let fadeTimer = 0, wantMusic = false;
  function fadeTo(vol, ms, after) {
    clearInterval(fadeTimer);
    const start = audio.volume, t0 = performance.now();
    fadeTimer = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      audio.volume = Math.max(0, Math.min(1, start + (vol - start) * k));
      if (k === 1) { clearInterval(fadeTimer); after && after(); }
    }, 40);
  }
  function setMusicUI(on) {
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  }
  function playMusic() {
    if (!audio.src) audio.src = C.music.src;
    audio.volume = 0;
    wantMusic = true;
    const p = audio.play();
    setMusicUI(true);
    if (p && p.catch) p.catch((err) => { console.warn("[music] could not play:", err.message); wantMusic = false; setMusicUI(false); });
    fadeTo(C.music.volume ?? 0.45, 1800);
  }
  function pauseMusic() {
    wantMusic = false;
    setMusicUI(false);
    fadeTo(0, 600, () => audio.pause());
  }
  musicBtn.addEventListener("click", () => (audio.paused || !wantMusic ? playMusic() : pauseMusic()));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !audio.paused) audio.pause();
    else if (!document.hidden && wantMusic) audio.play().catch(() => {});
  });

  /* ---------------- Open the surprise ---------------- */
  let opened = false;
  openBtn.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    if (C.music.startOnOpen && !wantMusic) playMusic(); // user gesture → allowed
    const r = openBtn.getBoundingClientRect();
    if (!reduced) E.burst(flyers, r.left + r.width / 2, r.top + r.height / 2, 22);

    intro.classList.add("is-leaving");
    main.hidden = false;
    document.body.classList.remove("is-intro");
    window.scrollTo(0, 0);
    buildLights();

    requestAnimationFrame(() => {
      main.classList.add("is-shown");
      $$(".reveal, .story-card, .garden, .corner, .vine-edge, .parallax-accents, .fairy-lights", main).forEach((el) => revealIO.observe(el));
      $$(".section", main).forEach((s) => visIO.observe(s));
      collectParallax();
      if (!reduced) window.addEventListener("scroll", onScroll, { passive: true });
      buildVines();
    });

    if (petals) petals.setCount(window.innerWidth < 768 ? 6 : 9);
    if (butterflies) butterflies.start(2500);
    if (hearts) hearts.start();

    setTimeout(() => {
      intro.remove();
      const h = $(".greeting .script-title");
      h.setAttribute("tabindex", "-1");
      h.focus({ preventScroll: true });
    }, reduced ? 50 : 1900);
  });

  /* ---------------- Vines on the story edges ---------------- */
  function buildVines() {
    const story = $("#story");
    $$(".vine-edge", story).forEach((edge) => {
      edge.innerHTML = "";
      const w = edge.clientWidth || 44;
      edge.appendChild(F.vine(Math.round((story.clientHeight * 60) / w)));
    });
  }

  /* ---------------- Final bloom interaction ---------------- */
  const bloomBtn = $("#bloom-btn");
  const finalMsg = $("#final-message");
  const signoff = $("[data-final-signoff]");
  C.final.lines.forEach((line, i) => {
    const p = document.createElement("p");
    p.className = "fline" + (i === 0 ? " first" : "");
    setRich(p, line);
    finalMsg.appendChild(p);
  });
  bloomBtn.addEventListener("click", () => {
    if (bloomBtn.classList.contains("is-open")) return;
    bloomBtn.classList.add("is-open");
    bloomBtn.setAttribute("aria-expanded", "true");
    bloomBtn.setAttribute("aria-label", "The flower has bloomed");
    $(".tap-hint").classList.add("gone");
    const r = bloomBtn.getBoundingClientRect();
    if (!reduced) E.burst(flyers, r.left + r.width / 2, r.top + r.height * 0.43, 26);

    const lines = $$(".fline", finalMsg);
    const step = reduced ? 0 : 1100, first = reduced ? 0 : 1400;
    lines.forEach((l, i) => setTimeout(() => l.classList.add("show"), first + i * step));
    setTimeout(() => {
      signoff.classList.add("show");
      if (hearts) [0, 700, 1400].forEach((d) => setTimeout(() => hearts.spawn(), d));
    }, first + lines.length * step + (reduced ? 0 : 700));
    setTimeout(() => finalMsg.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }), reduced ? 0 : 900);
  });

  /* ---------------- Resize: rebuild width-dependent scenery ---------------- */
  let lastW = window.innerWidth, rz;
  window.addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      if (Math.abs(window.innerWidth - lastW) < 80) return; // ignore mobile URL-bar height changes
      lastW = window.innerWidth;
      const introGarden = document.querySelector(".intro-garden");
      [[greetGarden, { density: 0.9, maxVh: 0.34 }], [finaleGarden, { density: 1.1, maxVh: 0.34 }], [introGarden, { density: 1 }]].forEach(([g, opts]) => {
        if (!g) return;
        g.innerHTML = "";
        F.garden(g, opts);
      });
      if (opened) { buildLights(); buildVines(); collectParallax(); updateParallax(); }
    }, 250);
  });
})();
