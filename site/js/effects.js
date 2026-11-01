/* ==========================================================================
   effects.js — ambient life: fireflies & stars (canvas), falling petals,
   butterflies on curved paths, sparse floating hearts, petal bursts.
   Everything is decorative, pointer-events:none and paused when hidden.
   ========================================================================== */
(function () {
  "use strict";

  const { rnd, pick } = window.Flowers;
  const isSmall = () => window.innerWidth < 768;

  /* ---------------- Fireflies + stars on one canvas ---------------- */
  function Sky(canvas, { reduced = false } = {}) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0, dpr = 1, stars = [], flies = [], raf = 0, last = 0, running = false;

    // Pre-rendered glow sprites: drawing images is far cheaper than gradients per frame
    const makeSprite = (r, g, b) => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const x = c.getContext("2d");
      const grd = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, `rgba(255,255,245,1)`);
      grd.addColorStop(0.12, `rgba(${r},${g},${b},0.95)`);
      grd.addColorStop(0.4, `rgba(${r},${g},${b},0.28)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.fillStyle = grd;
      x.fillRect(0, 0, 64, 64);
      return c;
    };
    const sprites = [makeSprite(255, 226, 150), makeSprite(255, 226, 150), makeSprite(255, 206, 220), makeSprite(230, 215, 255)];

    function spawnFly(f = {}) {
      f.x = rnd(0, w);
      f.y = rnd(h * 0.15, h * 0.98);
      f.a = rnd(0, Math.PI * 2);           // heading
      f.v = rnd(7, 18);                     // px / second
      f.size = rnd(14, isSmall() ? 26 : 32);
      f.period = rnd(3.5, 8);               // glow on/off cycle
      f.t = rnd(0, f.period);
      f.sprite = pick(sprites);
      return f;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const starCount = Math.min(130, Math.round((w * h) / 9000));
      stars = Array.from({ length: starCount }, () => ({
        x: rnd(0, w), y: rnd(0, h * 0.75), r: rnd(0.4, 1.2), p: rnd(0, 6.28), s: rnd(0.4, 1.3),
      }));
      const flyCount = isSmall() ? 16 : 30;
      while (flies.length < flyCount) flies.push(spawnFly());
      flies.length = flyCount;
      if (reduced) drawStatic();
    }

    function drawStars(time) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#fff6e6";
      for (const s of stars) {
        ctx.globalAlpha = reduced ? 0.5 : 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(time * s.s + s.p));
        ctx.fillRect(s.x, s.y, s.r * 1.6, s.r * 1.6);
      }
    }

    function drawFly(f, alpha) {
      ctx.globalAlpha = alpha;
      ctx.drawImage(f.sprite, f.x - f.size / 2, f.y - f.size / 2, f.size, f.size);
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      drawStars(0);
      ctx.globalCompositeOperation = "lighter";
      flies.forEach((f, i) => i % 2 === 0 && drawFly(f, 0.55));
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      const time = now / 1000;
      ctx.clearRect(0, 0, w, h);
      drawStars(time);
      ctx.globalCompositeOperation = "lighter";
      for (const f of flies) {
        f.t += dt;
        if (f.t > f.period) { spawnFly(f); f.t = 0; }       // fades out, reappears elsewhere
        f.a += rnd(-1.2, 1.2) * dt;                          // gentle wandering
        f.x += Math.cos(f.a) * f.v * dt;
        f.y += Math.sin(f.a) * f.v * dt - 2 * dt;            // slight upward drift
        if (f.x < -20) f.x = w + 20; else if (f.x > w + 20) f.x = -20;
        if (f.y < -20) f.y = h + 20; else if (f.y > h + 20) f.y = -20;
        const k = Math.sin((f.t / f.period) * Math.PI);    // 0 → 1 → 0
        drawFly(f, k * k * 0.9);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (reduced || running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    resize();
    return { start, stop };
  }

  /* ---------------- Falling petals (pure CSS animation) ---------------- */
  function Petals(container) {
    const max = isSmall() ? 12 : 18;
    const els = [];
    for (let i = 0; i < max; i++) {
      const p = document.createElement("div");
      p.className = "petal-fall";
      const dur = rnd(12, 21);
      p.style.setProperty("--x", `${rnd(0, 100)}vw`);
      p.style.setProperty("--dur", `${dur.toFixed(1)}s`);
      p.style.setProperty("--delay", `${(-rnd(0, dur)).toFixed(1)}s`);
      p.style.setProperty("--drift", `${rnd(-40, 70).toFixed(0)}px`);
      p.innerHTML = `<i style="--w:${rnd(9, 15).toFixed(1)}px;--sd:${rnd(2.4, 4.4).toFixed(1)}s"></i>`;
      container.appendChild(p);
      els.push(p);
    }
    return {
      setCount(n) { els.forEach((p, i) => (p.style.display = i < n ? "" : "none")); },
    };
  }

  /* ---------------- Butterflies ---------------- */
  let bfId = 0;
  const BF_COLORS = [
    ["#f7cfd9", "#c9b3ea"],
    ["#fdf1dc", "#e8b8c6"],
    ["#d9ccf3", "#f3c2cf"],
    ["#f3dcae", "#f1b6c6"],
  ];
  function butterflySVG() {
    const [a, b] = pick(BF_COLORS);
    const id = `bf${bfId++}`;
    const wing =
      `<path d="M50 40 C38 12 11 4 5 21 C1 35 21 46 50 46Z" fill="url(#${id})" stroke="#e6c78b" stroke-width=".8"/>` +
      `<path d="M50 49 C34 50 17 60 21 74 C25 87 44 73 50 55Z" fill="url(#${id})" stroke="#e6c78b" stroke-width=".8"/>` +
      `<circle cx="20" cy="22" r="3.2" fill="#fffaf0" opacity=".75"/><circle cx="29" cy="65" r="2.4" fill="#fffaf0" opacity=".65"/>`;
    return (
      `<svg viewBox="0 0 100 90"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
      `<g class="wings">${wing}<g transform="matrix(-1 0 0 1 100 0)">${wing}</g></g>` +
      `<ellipse cx="50" cy="48" rx="2.6" ry="15" fill="#5e4c62"/>` +
      `<path d="M49 34 C46 26 42 22 38 20 M51 34 C54 26 58 22 62 20" stroke="#5e4c62" stroke-width="1" fill="none" stroke-linecap="round"/></svg>`
    );
  }

  function Butterflies(container) {
    let alive = 0, timer = 0, enabled = false;

    function fly() {
      if (!enabled || document.hidden || alive >= 2) return;
      alive++;
      const el = document.createElement("div");
      el.className = "butterfly";
      el.style.setProperty("--flap", `${rnd(0.22, 0.36).toFixed(2)}s`);
      const size = rnd(24, isSmall() ? 34 : 42);
      el.style.width = `${size}px`;
      el.style.height = `${size * 0.9}px`;
      el.innerHTML = butterflySVG();
      container.appendChild(el);

      const W = window.innerWidth, H = window.innerHeight;
      const ltr = Math.random() < 0.5;
      const p0 = [ltr ? -60 : W + 60, rnd(H * 0.2, H * 0.75)];
      const p3 = [ltr ? W + 60 : -60, rnd(H * 0.1, H * 0.7)];
      const p1 = [W * rnd(0.2, 0.4) * (ltr ? 1 : -1) + (ltr ? 0 : W), rnd(0, H)];
      const p2 = [W * rnd(0.6, 0.8) * (ltr ? 1 : -1) + (ltr ? 0 : W), rnd(0, H)];
      const bez = (t, i) => {
        const u = 1 - t;
        return u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i];
      };
      const N = 48, frames = [];
      for (let k = 0; k <= N; k++) {
        const t = k / N;
        const x = bez(t, 0), y = bez(t, 1) + Math.sin(t * 28) * 6;     // gentle flutter bob
        const nx = bez(Math.min(1, t + 0.02), 0), ny = bez(Math.min(1, t + 0.02), 1);
        const ang = (Math.atan2(ny - y, nx - x) * 180) / Math.PI + 90;
        frames.push({ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${ang.toFixed(1)}deg)` });
      }
      const anim = el.animate(frames, { duration: rnd(13000, 19000), easing: "linear" });
      anim.onfinish = () => { el.remove(); alive--; };
    }

    function schedule(delay) {
      clearTimeout(timer);
      timer = setTimeout(() => { fly(); schedule(rnd(9000, 16000)); }, delay);
    }
    return {
      start(first = 3000) { enabled = true; schedule(first); },
      stop() { enabled = false; clearTimeout(timer); },
    };
  }

  /* ---------------- Floating hearts (sparse) ---------------- */
  function Hearts(container) {
    let timer = 0, alive = 0, enabled = false;
    const colors = ["#f5c6d2", "#e8a0b4", "#e6c78b", "#cbbbea"];

    function spawn(x) {
      if (document.hidden || alive >= 3) return;
      alive++;
      const el = document.createElement("div");
      el.className = "float-heart";
      el.style.setProperty("--x", x != null ? `${x}px` : `${rnd(6, 92)}vw`);
      el.style.setProperty("--s", `${rnd(10, 18).toFixed(0)}px`);
      el.style.setProperty("--dur", `${rnd(9, 13).toFixed(1)}s`);
      el.style.setProperty("--dx", `${rnd(-40, 40).toFixed(0)}px`);
      el.style.fill = pick(colors);
      el.innerHTML = `<svg viewBox="0 0 32 30"><use href="#heart"/></svg>`;
      el.addEventListener("animationend", () => { el.remove(); alive--; }, { once: true });
      container.appendChild(el);
    }
    function schedule(delay) {
      clearTimeout(timer);
      timer = setTimeout(() => { if (enabled) spawn(); schedule(rnd(5000, 9000)); }, delay);
    }
    return {
      start() { enabled = true; schedule(2500); },
      stop() { enabled = false; clearTimeout(timer); },
      spawn,
    };
  }

  /* ---------------- One-off petal burst (button taps) ---------------- */
  function burst(container, x, y, n = 18) {
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      p.className = "petal-fall";
      p.style.cssText = `left:${x}px;top:${y}px;animation:none`;
      p.innerHTML = `<i style="--w:${rnd(8, 14).toFixed(1)}px;animation:none"></i>`;
      container.appendChild(p);
      const a = rnd(0, Math.PI * 2), d = rnd(60, 170);
      const dx = Math.cos(a) * d, dy = Math.sin(a) * d - 30;
      const anim = p.animate(
        [
          { transform: "translate(0,0) rotate(0deg) scale(.6)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) rotate(${rnd(90, 300)}deg) scale(1)`, opacity: 0.9, offset: 0.55 },
          { transform: `translate(${dx * 1.2}px, ${dy + 120}px) rotate(${rnd(300, 520)}deg) scale(.9)`, opacity: 0 },
        ],
        { duration: rnd(1800, 2600), easing: "cubic-bezier(.2,.7,.3,1)" }
      );
      anim.onfinish = () => p.remove();
    }
  }

  window.Effects = { Sky, Petals, Butterflies, Hearts, burst };
})();
