/* ═══════════════════════════════════════════════
   TRẦN NGỌC THÔNG — PORTFOLIO
   Neon Studio + linh vật THÔNG
   ═══════════════════════════════════════════════ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ── Letter-split cho chữ chrome (kinetic pop) ── */
document.querySelectorAll("[data-letters]").forEach(el => {
  const text = el.textContent;
  const offset = parseInt(el.dataset.offset || "0", 10);
  el.textContent = "";
  [...text].forEach((ch, i) => {
    const s = document.createElement("span");
    s.className = "ltr";
    s.style.setProperty("--i", offset + i);
    s.textContent = ch;
    el.appendChild(s);
  });
});

/* ── Preloader: dựng nét rồi bật sáng từng ký tự ── */
const preloaderStartedAt = performance.now();
const preName = document.getElementById("preName");
if (preName) {
  const text = preName.textContent;
  preName.textContent = "";
  [...text].forEach((ch, i) => {
    const s = document.createElement("span");
    s.className = ch === " " ? "pltr pltr--space" : "pltr";
    s.style.setProperty("--i", i);
    s.dataset.char = ch;
    s.textContent = ch === " " ? "\u00a0" : ch;
    preName.appendChild(s);
  });
}

/* Linh vật chạy theo ellipse, lướt sau chữ ở nửa trên và ra trước ở nửa dưới. */
(function preloaderMascotMotion() {
  const stage = document.getElementById("preStage");
  const mascot = document.getElementById("preMascot");
  if (!stage || !mascot || reducedMotion) return;

  const duration = 4200;
  const startAngle = Math.PI * 1.08;
  const turns = Math.PI * 2.42;

  function move(now) {
    const progress = Math.min((now - preloaderStartedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const angle = startAngle + turns * eased;
    const rx = Math.min(stage.clientWidth * 0.425, 395);
    const ry = Math.min(stage.clientHeight * 0.31, 118);
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry + Math.sin(progress * Math.PI * 8) * 4;
    const tilt = Math.cos(angle) * 12;
    const pulse = 1 + Math.sin(progress * Math.PI * 7) * 0.025;

    mascot.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${pulse.toFixed(3)})`;
    mascot.style.zIndex = y > 4 ? "5" : "2";

    if (progress < 1) requestAnimationFrame(move);
  }

  requestAnimationFrame(move);
})();

window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  const minimumDuration = reducedMotion ? 0 : 4300;
  const wait = Math.max(0, minimumDuration - (performance.now() - preloaderStartedAt));
  setTimeout(() => {
    pre.classList.add("done");
    document.body.classList.remove("is-loading");
    document.querySelectorAll(".hero-chrome").forEach(el => el.classList.add("popped"));
    document.getElementById("mascotHero")?.classList.add("landed");
  }, wait);
});

/* ── Nav ── */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ── Mobile menu ── */
const burger = document.getElementById("navBurger");
const mobileMenu = document.getElementById("mobileMenu");
burger.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});
mobileMenu.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  })
);

/* ── Typewriter ── */
const typeTarget = document.getElementById("typewriter");
const typeText = "trần ngọc thông";
if (typeTarget) {
  if (reducedMotion) {
    typeTarget.textContent = typeText;
  } else {
    let i = 0;
    setTimeout(function typeNext() {
      typeTarget.textContent = typeText.slice(0, ++i);
      if (i < typeText.length) setTimeout(typeNext, 34 + Math.random() * 40);
    }, 2600);
  }
}

/* ── Rotator ── */
const rotator = document.getElementById("rotator");
const words = ["câu chuyện", "doanh thu", "cảm xúc", "di sản"];
let wordIndex = 0;
if (rotator && !reducedMotion) {
  rotator.style.transition = "opacity .45s ease, transform .45s ease";
  setInterval(() => {
    rotator.style.opacity = "0";
    rotator.style.transform = "translateY(12px) rotate(-3deg)";
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      rotator.textContent = words[wordIndex];
      rotator.style.opacity = "1";
      rotator.style.transform = "translateY(0) rotate(0)";
    }, 450);
  }, 3200);
}

/* ── Reveal + pop chữ chrome ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("in");
    entry.target.querySelectorAll(".chrome[data-letters]").forEach(c => c.classList.add("popped"));
    if (entry.target.classList.contains("chrome")) entry.target.classList.add("popped");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const chromeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("popped");
      chromeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll(".chrome[data-letters]:not(.hero-chrome)").forEach(el => chromeObserver.observe(el));

/* ── Skill bars: đếm % ── */
function animatePct(el) {
  const target = parseInt(el.dataset.pct, 10);
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + "%";
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const pctObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (reducedMotion) entry.target.textContent = entry.target.dataset.pct + "%";
      else animatePct(entry.target);
      pctObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll(".bar__pct").forEach(el => pctObserver.observe(el));

/* ── Đếm số liệu ── */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimal || "0", 10);
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = (target * (1 - Math.pow(1 - p, 4))).toFixed(decimals);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (reducedMotion) {
        el.textContent = parseFloat(el.dataset.count).toFixed(parseInt(el.dataset.decimal || "0", 10));
      } else {
        animateCount(el);
      }
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll(".count").forEach(el => countObserver.observe(el));

/* ── Custom cursor ── */
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
if (finePointer && !reducedMotion) {
  let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
  window.addEventListener("mousemove", e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  }, { passive: true });
  (function ringLoop() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(ringLoop);
  })();
  document.querySelectorAll("[data-hover]").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
  });
}

/* ── Magnetic buttons ── */
if (finePointer && !reducedMotion) {
  document.querySelectorAll("[data-magnetic]").forEach(el => {
    const strength = 0.35;
    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

/* ── 3D TILT ── */
if (finePointer && !reducedMotion) {
  document.querySelectorAll("[data-tilt]").forEach(el => {
    const maxDeg = 7;
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(900px) rotateY(${px * maxDeg}deg) rotateX(${-py * maxDeg}deg) scale3d(1.015, 1.015, 1)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform .6s cubic-bezier(.19,1,.22,1)";
      el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
      setTimeout(() => { el.style.transition = ""; }, 600);
    });
  });
}

/* ═══════════════════════════════════════════════
   LINH VẬT — chuyển động lò xo mượt
   - lơ lửng nhẹ nhàng (bob)
   - né ra xa khi chuột lại gần (repel)
   - nghiêng theo hướng di chuyển
   - rê thẳng chuột vào → nhảy tinh nghịch
   ═══════════════════════════════════════════════ */
(function mascotMotion() {
  const wrap = document.getElementById("mascotHero");
  const img = document.getElementById("mascotImg");
  if (!wrap || !img || reducedMotion) return;

  let mx = -9999, my = -9999;       // vị trí chuột
  let px = 0, py = 0;               // vị trí hiện tại (spring)
  let vx = 0, vy = 0;               // vận tốc lò xo
  const stiffness = 0.045, damping = 0.82;

  if (finePointer) {
    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    /* rê chuột vào → nhảy */
    wrap.addEventListener("mouseenter", () => {
      if (!wrap.classList.contains("jump")) {
        wrap.classList.add("jump");
        img.addEventListener("animationend", () => wrap.classList.remove("jump"), { once: true });
      }
    });
  }

  const start = performance.now();
  (function loop(now) {
    const t = (now - start) / 1000;

    /* mục tiêu: bob sin + parallax nhẹ theo chuột */
    let tx = Math.sin(t * 0.9) * 10;
    let ty = Math.sin(t * 0.7 + 1.3) * 14;

    if (finePointer && mx > -999) {
      /* parallax theo chuột (toàn màn hình) */
      tx += (mx / window.innerWidth - 0.5) * 26;
      ty += (my / window.innerHeight - 0.5) * 18;

      /* né ra khi chuột lại gần linh vật */
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = cx - mx, dy = cy - my;
      const dist = Math.hypot(dx, dy);
      const radius = r.width * 0.75;
      if (dist < radius && dist > 1) {
        const push = (1 - dist / radius) * 46;
        tx += (dx / dist) * push;
        ty += (dy / dist) * push;
      }
    }

    /* lò xo: mượt và có đà */
    vx = (vx + (tx - px) * stiffness) * damping;
    vy = (vy + (ty - py) * stiffness) * damping;
    px += vx; py += vy;

    const tilt = Math.max(-8, Math.min(8, vx * 2.2));
    img.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`;

    requestAnimationFrame(loop);
  })(start);
})();
