/* ==========================================================================
   flowers.js — hand-built SVG flower library
   Injects one SVG sprite (roses, tulips, blossoms, daisies, wildflowers,
   leaves, buds, hearts) and exposes builders that compose them into
   plants, garden beds, branches, vines and corner bouquets.
   ========================================================================== */
(function () {
  "use strict";

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const f = (n) => Math.round(n * 10) / 10; // keep markup short

  /* ---------- Palettes (pastel, slightly deepened toward the centre) ---------- */
  const ROSE = {
    blush: ["#fde3e8", "#f5bccb", "#eb9bb1", "#d97c95", "#b95c77"],
    cream: ["#fff8ee", "#fae6d0", "#f2d0b0", "#e2b38f", "#c29373"],
    lav: ["#f2eafc", "#dccdf3", "#c5ade7", "#a98ed5", "#8a70ba"],
  };
  const TULIP = {
    pink: ["#fff0f3", "#f5b9c8", "#e48ea5"],
    lav: ["#f4eefc", "#cdb8ec", "#a88cd8"],
    cream: ["#fffaf1", "#f7dfc4", "#e6bf97"],
  };
  const BLOSSOM = {
    pink: ["#fff5f7", "#f9d2dc", "#eca2b6"],
    white: ["#ffffff", "#fcecf0", "#f1c3cf"],
  };
  const FORGET = {
    lav: ["#d8cbf4", "#a993dc"],
    blue: ["#cfdcf7", "#9fb4e5"],
    pink: ["#f9d4de", "#e3a0b3"],
  };

  /* ---------- Symbol generators ---------- */
  function rose(id, c) {
    const P = "M50 50 C28 48 18 24 38 14 C45 10 55 10 62 14 C82 24 72 48 50 50Z";
    const RIM = "M40 17 C46 13.5 54 13.5 60 17";
    const layer = (s, rot, fill, stroke, rim) => {
      let g = `<g transform="translate(50 50) scale(${s}) rotate(${rot}) translate(-50 -50)">`;
      for (let k = 0; k < 5; k++) {
        g += `<g transform="rotate(${k * 72} 50 50)"><path d="${P}" fill="${fill}" stroke="${stroke}" stroke-width="${f(0.9 / s)}"/>`;
        g += `<path d="${RIM}" fill="none" stroke="${rim}" stroke-width="${f(2.2 / s)}" stroke-linecap="round" opacity=".75"/></g>`;
      }
      return g + "</g>";
    };
    return (
      `<symbol id="${id}" viewBox="0 0 100 100">` +
      layer(1, 0, c[1], c[2], c[0]) +
      layer(0.74, 36, c[2], c[3], c[1]) +
      layer(0.5, 14, c[3], c[4], c[2]) +
      layer(0.28, 52, c[3], c[4], c[2]) +
      `<path d="M50 47 c3 0 5 2 5 4.5 c0 3.5 -3 6 -6.5 6 c-4.5 0 -7.5 -3.5 -7.5 -8" fill="none" stroke="${c[4]}" stroke-width="1.5" stroke-linecap="round"/>` +
      `</symbol>`
    );
  }

  function tulip(id, c) {
    return (
      `<symbol id="${id}" viewBox="0 0 60 70">` +
      `<path d="M30 5 C18 17 15 44 30 58 C45 44 42 17 30 5Z" fill="${c[2]}"/>` +
      `<path d="M10 21 C7 44 16 60 31 63 C28 46 24 29 10 21Z" fill="${c[1]}" stroke="${c[2]}" stroke-width=".8"/>` +
      `<path d="M50 21 C53 44 44 60 29 63 C32 46 36 29 50 21Z" fill="${c[1]}" stroke="${c[2]}" stroke-width=".8"/>` +
      `<path d="M30 22 C22 34 22 53 30 63 C38 53 38 34 30 22Z" fill="${c[1]}" stroke="${c[2]}" stroke-width=".7"/>` +
      `<path d="M14 28 C13.5 40 17 50 23 56" fill="none" stroke="${c[0]}" stroke-width="2" stroke-linecap="round" opacity=".85"/>` +
      `<path d="M30 28 C27 38 27 48 29 56" fill="none" stroke="${c[0]}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>` +
      `</symbol>`
    );
  }

  function blossom(id, c) {
    const P = "M50 50 C39 42 32 27 39 15 C42 10 47 11 50 17 C53 11 58 10 61 15 C68 27 61 42 50 50Z";
    let s =
      `<radialGradient id="g-${id}" gradientUnits="userSpaceOnUse" cx="50" cy="50" r="42">` +
      `<stop offset="0" stop-color="${c[2]}"/><stop offset=".35" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[0]}"/></radialGradient>` +
      `<symbol id="${id}" viewBox="0 0 100 100">`;
    for (let k = 0; k < 5; k++) {
      s += `<g transform="rotate(${k * 72} 50 50)"><path d="${P}" fill="url(#g-${id})" stroke="${c[2]}" stroke-width=".6"/>`;
      s += `<path d="M50 46 L50 24" stroke="${c[2]}" stroke-width="1" opacity=".45"/></g>`;
    }
    for (let k = 0; k < 11; k++) {
      const a = (k / 11) * Math.PI * 2 + 0.2;
      const r = 11 + (k % 3) * 2;
      const x = f(50 + Math.cos(a) * r), y = f(50 + Math.sin(a) * r);
      s += `<line x1="50" y1="50" x2="${x}" y2="${y}" stroke="#d6948c" stroke-width=".9"/><circle cx="${x}" cy="${y}" r="1.7" fill="#efc16a"/>`;
    }
    return s + `<circle cx="50" cy="50" r="4" fill="#f3d18a"/></symbol>`;
  }

  function daisy(id) {
    let s =
      `<radialGradient id="g-${id}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fbe39a"/><stop offset="1" stop-color="#d7a142"/></radialGradient>` +
      `<symbol id="${id}" viewBox="0 0 100 100">`;
    for (let k = 0; k < 14; k++)
      s += `<ellipse cx="50" cy="27" rx="6.4" ry="20" fill="#fffaf2" stroke="#e9dcc7" stroke-width=".8" transform="rotate(${f((k * 360) / 14)} 50 50)"/>`;
    for (let k = 0; k < 14; k++)
      s += `<ellipse cx="50" cy="32" rx="4.6" ry="15" fill="#f7eee1" stroke="#e5d6bf" stroke-width=".6" transform="rotate(${f((k * 360) / 14 + 12.8)} 50 50)"/>`;
    s += `<circle cx="50" cy="50" r="11.5" fill="url(#g-${id})"/>`;
    for (let k = 0; k < 9; k++) {
      const a = k * 2.4, r = 2.5 + k * 0.85;
      s += `<circle cx="${f(50 + Math.cos(a) * r)}" cy="${f(50 + Math.sin(a) * r)}" r=".9" fill="#b98232" opacity=".55"/>`;
    }
    return s + `</symbol>`;
  }

  function forget(id, c) {
    let s = `<symbol id="${id}" viewBox="0 0 40 40">`;
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      s += `<circle cx="${f(20 + Math.cos(a) * 8.5)}" cy="${f(20 + Math.sin(a) * 8.5)}" r="7.6" fill="${c[0]}" stroke="${c[1]}" stroke-width=".7"/>`;
    }
    return s + `<circle cx="20" cy="20" r="4.6" fill="none" stroke="#fff" stroke-width="1" opacity=".6"/><circle cx="20" cy="20" r="3.2" fill="#f6df9c"/></symbol>`;
  }

  function leaf(id, a, b, rib) {
    return (
      `<linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>` +
      `<symbol id="${id}" viewBox="0 0 60 24"><path d="M2 12 C14 0 40 -1 58 12 C40 25 14 24 2 12Z" fill="url(#g-${id})"/>` +
      `<path d="M4 12 C20 10.5 40 10.5 56 12" fill="none" stroke="${rib}" stroke-width="1" opacity=".7"/></symbol>`
    );
  }

  function bud(id, c) {
    return (
      `<symbol id="${id}" viewBox="0 0 30 44">` +
      `<path d="M15 3 C24 12 25.5 26 15 34 C4.5 26 6 12 15 3Z" fill="${c[1]}" stroke="${c[2]}" stroke-width=".8"/>` +
      `<path d="M12 10 C9.5 16 9.5 24 12.5 30" fill="none" stroke="${c[0]}" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>` +
      `<path d="M15 35 C10 33 6 29 5 24 C9 28 12 30 15 30 C18 30 21 28 25 24 C24 29 20 33 15 35Z" fill="#86a67d"/>` +
      `<path d="M15 35 L15 44" stroke="#7c9a73" stroke-width="2" stroke-linecap="round"/></symbol>`
    );
  }

  const HEART =
    `<symbol id="heart" viewBox="0 0 32 30"><path d="M16 28 C6 20 1 14 1 8.5 C1 4.4 4.3 1 8.4 1 C11.6 1 14.3 3 16 5.8 C17.7 3 20.4 1 23.6 1 C27.7 1 31 4.4 31 8.5 C31 14 26 20 16 28Z"/></symbol>`;

  const GLOW =
    `<radialGradient id="g-glow"><stop offset="0" stop-color="#fff1d6" stop-opacity=".55"/><stop offset=".45" stop-color="#f7d7e0" stop-opacity=".18"/><stop offset="1" stop-color="#f7d7e0" stop-opacity="0"/></radialGradient>`;

  function injectSprite() {
    let d = GLOW + HEART;
    for (const k in ROSE) d += rose(`rose-${k}`, ROSE[k]);
    for (const k in TULIP) d += tulip(`tulip-${k}`, TULIP[k]);
    for (const k in BLOSSOM) d += blossom(`blossom-${k}`, BLOSSOM[k]);
    for (const k in FORGET) d += forget(`forget-${k}`, FORGET[k]);
    d += daisy("daisy");
    d += leaf("leaf", "#c3dab7", "#7fa177", "#5f7f59");
    d += leaf("leaf-dark", "#9dbb93", "#5f7f5b", "#4a6647");
    d += bud("bud-blush", ROSE.blush);
    d += bud("bud-lav", ROSE.lav);
    const wrap = document.createElement("div");
    wrap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden"><defs>${d}</defs></svg>`;
    document.body.prepend(wrap.firstChild);
  }

  /* ---------- Small helpers producing SVG markup ---------- */
  const use = (id, x, y, w, h, extra = "") =>
    `<use href="#${id}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${extra}/>`;

  // head wrapped so CSS can "bloom" it (scale from centre) with a stagger
  const head = (inner, delay) => `<g class="head" style="--hd:${f(delay)}s">${inner}</g>`;

  const leafAt = (x, y, ang, s, dark) =>
    `<use href="#${dark ? "leaf-dark" : "leaf"}" x="0" y="-12" width="60" height="24" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)}) scale(${f(s)})"/>`;

  /* ---------- Plant (flower on a stem) ---------- */
  const HEADS = {
    rose: () => pick(["rose-blush", "rose-blush", "rose-cream", "rose-lav"]),
    tulip: () => pick(["tulip-pink", "tulip-lav", "tulip-cream"]),
    daisy: () => "daisy",
    forget: () => pick(["forget-lav", "forget-blue", "forget-pink"]),
  };

  function plantSVG(kind, H, glow) {
    const bend = rnd(-10, 10);
    const tipX = 50 + rnd(-8, 8);
    let hs, headY;
    if (kind === "rose") { hs = rnd(44, 56); headY = hs * 0.55; }
    else if (kind === "tulip") { hs = rnd(34, 42); headY = hs * 1.05; }
    else if (kind === "daisy") { hs = rnd(38, 48); headY = hs * 0.55; }
    else { hs = 20; headY = 14; }
    const dark = Math.random() < 0.5;
    const stemW = kind === "forget" ? 1.8 : 2.6;
    let s = `<path d="M50 ${H} C${f(50 + bend)} ${f(H * 0.66)} ${f(50 - bend * 0.5)} ${f(H * 0.35)} ${f(tipX)} ${f(headY)}" fill="none" stroke="#7d9b75" stroke-width="${stemW}" stroke-linecap="round"/>`;
    // leaves
    const ly = H * rnd(0.55, 0.75);
    s += leafAt(50 + bend * 0.4, ly, rnd(-45, -25), rnd(0.55, 0.75), dark);
    if (H > 140) s += leafAt(50 - bend * 0.2, H * rnd(0.35, 0.5), rnd(-160, -135), rnd(0.5, 0.65), !dark);

    if (glow) s += `<circle class="glow" cx="${f(tipX)}" cy="${f(headY)}" r="${f(hs)}" fill="url(#g-glow)"/>`;

    if (kind === "tulip") {
      s += head(use(HEADS.tulip(), tipX - hs / 2, headY - hs * 1.05, hs, hs * (70 / 60)), rnd(0, 0.6));
    } else if (kind === "forget") {
      // a little sprig of three wildflowers
      const id = HEADS.forget();
      s += head(use(id, tipX - 10, headY - 10, 20, 20) + use(id, tipX - 22, headY + 8, 15, 15) + use(id, tipX + 6, headY + 14, 13, 13), rnd(0, 0.6));
    } else {
      s += head(use(HEADS[kind](), tipX - hs / 2, headY - hs / 2, hs, hs), rnd(0, 0.6));
    }
    return s;
  }

  function lavenderSVG(H) {
    const tipX = 50 + rnd(-6, 6);
    const cols = ["#d9ccf3", "#c3aee8", "#ab92da", "#9b83cf"];
    let s = `<path d="M50 ${H} Q${f(50 + rnd(-6, 6))} ${f(H * 0.5)} ${f(tipX)} 8" fill="none" stroke="#86a07c" stroke-width="2" stroke-linecap="round"/>`;
    s += leafAt(50, H * 0.8, -60, 0.5, true) + leafAt(50, H * 0.75, -120, 0.45, false);
    let florets = "";
    const n = 11;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const y = 10 + t * H * 0.42;
      const x = tipX + (50 - tipX) * t * 0.5;
      const sz = 3 + t * 3.2;
      const c = cols[i % cols.length];
      florets += `<ellipse cx="${f(x - sz * 0.7)}" cy="${f(y)}" rx="${f(sz * 0.55)}" ry="${f(sz)}" fill="${c}" transform="rotate(-28 ${f(x - sz * 0.7)} ${f(y)})"/>`;
      florets += `<ellipse cx="${f(x + sz * 0.7)}" cy="${f(y + 1.5)}" rx="${f(sz * 0.55)}" ry="${f(sz)}" fill="${c}" transform="rotate(28 ${f(x + sz * 0.7)} ${f(y + 1.5)})"/>`;
    }
    return s + head(florets, rnd(0, 0.6));
  }

  function grassSVG(H) {
    let s = "";
    const blades = 6;
    for (let i = 0; i < blades; i++) {
      const x0 = 30 + i * 8 + rnd(-3, 3);
      const h = H * rnd(0.35, 0.8);
      const tip = x0 + rnd(-22, 22);
      const c = pick(["#7f9f78", "#94b28b", "#6d8b67", "#a7c29d"]);
      s += `<path d="M${f(x0)} ${H} Q${f(x0 + (tip - x0) * 0.2)} ${f(H - h * 0.55)} ${f(tip)} ${f(H - h)} Q${f(x0 + (tip - x0) * 0.2 + 3)} ${f(H - h * 0.5)} ${f(x0 + 5)} ${H}Z" fill="${c}"/>`;
    }
    return s;
  }

  /**
   * Build a single swaying plant element.
   * @param {string} kind rose|tulip|daisy|forget|lavender|grass
   * @param {number} px  rendered height in px
   */
  function plant(kind, px, { glow = false } = {}) {
    const H = kind === "grass" ? 120 : Math.round(rnd(170, 260));
    const el = document.createElement("div");
    el.className = "plant sway";
    const inner =
      kind === "lavender" ? lavenderSVG(H) : kind === "grass" ? grassSVG(H) : plantSVG(kind, H, glow);
    el.innerHTML = `<svg viewBox="0 0 100 ${H}" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${inner}</svg>`;
    el.style.height = `${Math.round(px)}px`;
    el.style.width = `${Math.round((px * 100) / H)}px`;
    el.style.setProperty("--dur", `${f(rnd(4.5, 7.5))}s`);
    el.style.setProperty("--delay", `${f(-rnd(0, 7))}s`);
    el.style.setProperty("--amp", `${f(rnd(1.6, 3.4))}deg`);
    return el;
  }

  /**
   * Fill a container with 3 depth layers of plants (back → front).
   * Heights scale with the viewport so it looks lush on phones and desktops.
   */
  function garden(container, { density = 1, maxVh = 0.36, glow = true } = {}) {
    const vw = Math.min(window.innerWidth, 1600);
    const vh = window.innerHeight;
    const base = Math.min(vh * maxVh, 340);
    const layers = [
      { cls: "back", count: Math.round((vw / 34) * density), h: [0.4, 0.62], kinds: ["lavender", "forget", "grass", "daisy", "tulip"] },
      { cls: "mid", count: Math.round((vw / 46) * density), h: [0.55, 0.82], kinds: ["tulip", "rose", "daisy", "lavender", "grass", "forget"] },
      { cls: "front", count: Math.round((vw / 70) * density), h: [0.72, 1], kinds: ["rose", "tulip", "grass", "daisy", "rose", "forget"] },
    ];
    layers.forEach((L, li) => {
      const layer = document.createElement("div");
      layer.className = `garden-layer ${L.cls}`;
      layer.dataset.depth = String(li);
      for (let i = 0; i < L.count; i++) {
        const kind = pick(L.kinds);
        const p = plant(kind, base * rnd(L.h[0], L.h[1]) * (kind === "grass" ? 0.55 : 1), {
          glow: glow && li === 2 && kind !== "grass" && Math.random() < 0.45,
        });
        p.style.left = `${f(((i + rnd(-0.35, 0.35)) / L.count) * 104 - 2)}%`;
        layer.appendChild(p);
      }
      container.appendChild(layer);
    });
  }

  /* ---------- Blossom branch (hangs from a top corner) ---------- */
  function branch() {
    const el = document.createElement("div");
    el.className = "branch";
    let s = `<path d="M-10 18 C60 20 120 50 170 70 C210 86 250 110 290 150" fill="none" stroke="#7c6468" stroke-width="5" stroke-linecap="round"/>`;
    s += `<path d="M95 40 C110 20 130 12 150 10" fill="none" stroke="#7c6468" stroke-width="2.6" stroke-linecap="round"/>`;
    s += `<path d="M170 70 C180 100 176 124 166 144" fill="none" stroke="#7c6468" stroke-width="2.4" stroke-linecap="round"/>`;
    s += `<path d="M230 104 C248 96 262 84 270 70" fill="none" stroke="#7c6468" stroke-width="2" stroke-linecap="round"/>`;
    const spots = [
      [40, 22, 30], [78, 34, 36], [118, 26, 26], [150, 10, 30], [136, 58, 40], [178, 96, 30],
      [166, 144, 26], [205, 88, 34], [250, 112, 30], [270, 70, 26], [290, 150, 32], [60, 40, 18],
    ];
    spots.forEach(([x, y, sz], i) => {
      const id = Math.random() < 0.7 ? "blossom-pink" : "blossom-white";
      s += head(`<g transform="rotate(${f(rnd(0, 72))} ${x} ${y})">${use(id, x - sz / 2, y - sz / 2, sz, sz)}</g>`, 0.15 * i);
    });
    [[100, 44], [196, 72], [226, 120]].forEach(([x, y]) => (s += use("bud-blush", x - 6, y - 4, 12, 18, `transform="rotate(${f(rnd(-30, 30))} ${x} ${y})"`)));
    [[60, 22, 20], [160, 76, -30], [240, 106, 40]].forEach(([x, y, a]) => (s += leafAt(x, y, a, 0.45, true)));
    el.innerHTML = `<svg viewBox="0 0 300 200" aria-hidden="true">${s}</svg>`;
    return el;
  }

  /* ---------- Vine for section edges (draws itself in) ---------- */
  function vine(H = 900) {
    const el = document.createElement("div");
    el.className = "vine";
    let d = `M30 0`;
    for (let y = 0; y <= H; y += 60) d += ` Q${y % 120 === 0 ? 48 : 12} ${y + 30} 30 ${y + 60}`;
    let s = `<path class="vine-path" d="${d}" pathLength="1" fill="none" stroke="#86a07c" stroke-width="2" stroke-linecap="round"/>`;
    let i = 0;
    for (let y = 40; y < H; y += 48, i++) {
      const left = i % 2 === 0;
      s += head(leafAt(30, y, left ? -150 : -30, rnd(0.34, 0.46), i % 3 === 0), 0.08 * i);
      if (i % 3 === 1) s += head(use(pick(["forget-lav", "forget-pink", "forget-blue"]), left ? 34 : 6, y - 8, 16, 16), 0.08 * i + 0.2);
      if (i % 5 === 3) s += head(use("blossom-pink", left ? 30 : 0, y - 14, 24, 24), 0.08 * i + 0.3);
    }
    el.innerHTML = `<svg viewBox="0 0 60 ${H}" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${s}</svg>`;
    return el;
  }

  /* ---------- Corner bouquet (rose + blossoms + tulip + wildflowers + leaves) ---------- */
  function bouquet(variant = 0) {
    const el = document.createElement("div");
    el.className = "bouquet";
    const roseId = ["rose-blush", "rose-cream", "rose-lav"][variant % 3];
    const tulipId = ["tulip-lav", "tulip-pink", "tulip-cream"][variant % 3];
    let s = "";
    s += leafAt(30, 30, 20, 1.1, true) + leafAt(30, 30, 70, 1.05, false) + leafAt(30, 30, 45, 0.9, false);
    s += leafAt(40, 40, 5, 0.8, false) + leafAt(40, 40, 88, 0.75, true);
    s += head(use(tulipId, 96, 44, 26, 30, `transform="rotate(62 109 59)"`), 0.35);
    s += head(use("blossom-pink", 70, 6, 32, 32), 0.2);
    s += head(use("blossom-white", 4, 74, 28, 28), 0.3);
    s += head(use("daisy", 72, 62, 24, 24), 0.45);
    s += head(use("forget-lav", 108, 18, 16, 16) + use("forget-blue", 20, 110, 14, 14) + use("forget-pink", 52, 92, 14, 14), 0.55);
    s += head(use("bud-blush", 60, 104, 12, 18, `transform="rotate(150 66 113)"`), 0.6);
    s += head(use(roseId, 10, 10, 60, 60), 0);
    el.innerHTML = `<svg viewBox="0 0 140 140" aria-hidden="true">${s}</svg>`;
    return el;
  }

  /* ---------- A single loose flower head (used for scattered accents) ---------- */
  function bloom(id, size) {
    const el = document.createElement("div");
    el.className = "accent";
    el.style.width = el.style.height = `${size}px`;
    el.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true">${head(use(id, 0, 0, 100, 100), rnd(0, 0.5))}</svg>`;
    return el;
  }

  window.Flowers = { injectSprite, plant, garden, branch, vine, bouquet, bloom, rnd, pick };
})();
