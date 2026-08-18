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
const preloaderMinimumDuration = reducedMotion ? 1 : 2700;
const preProgress = document.getElementById("preProgress");
const preProgressFill = document.getElementById("preProgressFill");
const prePercent = document.getElementById("prePercent");
const preStatus = document.getElementById("preStatus");
let preloaderPageReady = document.readyState === "complete";

/* Tiến trình hiển thị bám thời gian tải thật: chờ ở 94% nếu tài nguyên chưa sẵn sàng. */
(function preloaderProgressMotion() {
  if (!preProgress || !preProgressFill || !prePercent) return;

  let lastValue = -1;
  function update(now) {
    const elapsedProgress = Math.min((now - preloaderStartedAt) / preloaderMinimumDuration, 1);
    const visibleProgress = preloaderPageReady
      ? elapsedProgress
      : Math.min(elapsedProgress * .94, .94);
    const value = Math.round(visibleProgress * 100);

    preProgressFill.style.transform = `scaleX(${visibleProgress.toFixed(4)})`;
    if (value !== lastValue) {
      prePercent.textContent = `${value}%`;
      preProgress.setAttribute("aria-valuenow", String(value));
      if (preStatus) {
        preStatus.textContent = value >= 100
          ? "Sẵn sàng khám phá"
          : value >= 72
            ? "Đang hoàn thiện không gian"
            : "Đang chuẩn bị trải nghiệm";
      }
      lastValue = value;
    }

    if (!preloaderPageReady || visibleProgress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();
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

  const duration = 2600;
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
  preloaderPageReady = true;
  const pre = document.getElementById("preloader");
  const wait = Math.max(0, preloaderMinimumDuration - (performance.now() - preloaderStartedAt));
  setTimeout(() => {
    pre.classList.add("done");
    document.body.classList.remove("is-loading");
    document.querySelectorAll(".hero-chrome").forEach(el => el.classList.add("popped"));
    document.getElementById("mascotHero")?.classList.add("landed");
    document.getElementById("portraitStage")?.classList.add("landed");
  }, wait + (reducedMotion ? 0 : 180));
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
/* định dạng số theo kiểu Việt Nam */
function formatVN(value, decimals) {
  const [intPart, decPart] = value.toFixed(decimals).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decPart ? grouped + "," + decPart : grouped;
}
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimal || "0", 10);
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = formatVN(target * (1 - Math.pow(1 - p, 4)), decimals);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (reducedMotion) {
        el.textContent = formatVN(parseFloat(el.dataset.count), parseInt(el.dataset.decimal || "0", 10));
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

/* ═══════════════════════════════════════════════
   PROJECT FILTERS
   Một hệ lọc chung cho launcher và các liên kết "View Related Work".
   ═══════════════════════════════════════════════ */
(function projectFilters() {
  const filters = [...document.querySelectorAll("[data-project-filter]")];
  const tabs = [...document.querySelectorAll("[data-project-categories]")];
  const jumps = [...document.querySelectorAll("[data-filter-jump]")];
  if (!filters.length || !tabs.length) return;

  function setFilter(value) {
    filters.forEach(button => {
      const active = button.dataset.projectFilter === value;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    tabs.forEach(tab => {
      const categories = (tab.dataset.projectCategories || "").split(/\s+/);
      const visible = value === "all" || categories.includes(value);
      tab.classList.toggle("is-hidden", !visible);
      tab.setAttribute("aria-hidden", String(!visible));
    });
  }

  filters.forEach(button => {
    button.addEventListener("click", () => setFilter(button.dataset.projectFilter));
  });

  jumps.forEach(link => {
    link.addEventListener("click", () => {
      setFilter(link.dataset.filterJump);
      window.setTimeout(() => document.getElementById("duan")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }), 20);
    });
  });
})();

/* ═══════════════════════════════════════════════
   PROJECT CINEMA
   Tab nhỏ morph thành case study, sau đó mới mở nội dung đọc.
   Native <dialog> giữ focus và phím Escape đúng chuẩn truy cập.
   ═══════════════════════════════════════════════ */
(function projectCinema() {
  const triggers = [...document.querySelectorAll("[data-project-open]")];
  const dialogs = [...document.querySelectorAll(".project-case")];
  if (!triggers.length || !dialogs.length) return;

  let activeTrigger = null;
  let closeTimer = 0;

  /* Media chỉ tải khi case được mở để trang đầu nhẹ hơn.
     Facebook iframe được reset khi đóng; TikTok Embed giữ nguyên để
     trình phát chính thức và liên kết từng video không phải khởi tạo lại. */
  function loadTikTokEmbeds(dialog) {
    if (!dialog.querySelector(".tiktok-embed")) return;
    if (document.getElementById("tiktok-embed-script")) return;

    const script = document.createElement("script");
    script.id = "tiktok-embed-script";
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    script.dataset.projectMedia = "ai-tiktok-studio";
    document.body.appendChild(script);
  }

  function loadProjectEmbeds(dialog) {
    dialog.querySelectorAll("iframe[data-src]").forEach(frame => {
      if (frame.src === "about:blank") frame.src = frame.dataset.src;
    });
    loadTikTokEmbeds(dialog);
  }

  function unloadProjectEmbeds(dialog) {
    dialog.querySelectorAll("iframe[data-src]").forEach(frame => {
      frame.src = "about:blank";
    });
  }

  function setReadable(dialog) {
    dialog.classList.add("is-readable");
    const scrollArea = dialog.querySelector(".case-modal__scroll");
    window.setTimeout(() => scrollArea?.focus({ preventScroll: true }), reducedMotion ? 0 : 620);
  }

  function animateOpen(dialog, trigger) {
    const shell = dialog.querySelector(".case-modal__shell");
    if (!shell || reducedMotion || typeof shell.animate !== "function") {
      setReadable(dialog);
      return;
    }

    const from = trigger.getBoundingClientRect();
    const to = shell.getBoundingClientRect();
    const scaleX = Math.max(.03, from.width / to.width);
    const scaleY = Math.max(.03, from.height / to.height);
    const translateX = from.left - to.left;
    const translateY = from.top - to.top;

    shell.animate([
      {
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`,
        borderRadius: "18px",
        opacity: .45,
        filter: "brightness(1.8) saturate(1.35)"
      },
      {
        offset: .66,
        transform: "translate3d(0, 0, 0) scale(1.012, 1.012)",
        borderRadius: "28px",
        opacity: 1,
        filter: "brightness(1.15) saturate(1.08)"
      },
      {
        transform: "translate3d(0, 0, 0) scale(1, 1)",
        borderRadius: "28px",
        opacity: 1,
        filter: "none"
      }
    ], {
      duration: 820,
      easing: "cubic-bezier(.19, 1, .22, 1)",
      fill: "both"
    });

    window.setTimeout(() => setReadable(dialog), 760);
  }

  function openProject(trigger) {
    const dialog = document.getElementById(trigger.dataset.projectOpen);
    if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;

    window.clearTimeout(closeTimer);
    activeTrigger = trigger;
    dialog.classList.remove("is-readable", "is-closing");
    dialog.classList.add("is-opening");
    trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("case-open");
    dialog.showModal();
    loadProjectEmbeds(dialog);
    dialog.querySelector(".case-modal__scroll")?.scrollTo({ top: 0 });

    requestAnimationFrame(() => requestAnimationFrame(() => animateOpen(dialog, trigger)));
  }

  function finishClose(dialog) {
    unloadProjectEmbeds(dialog);
    if (dialog.open) dialog.close();
    dialog.classList.remove("is-opening", "is-readable", "is-closing");
    document.body.classList.remove("case-open");
    if (activeTrigger) {
      activeTrigger.setAttribute("aria-expanded", "false");
      activeTrigger.focus({ preventScroll: true });
    }
    activeTrigger = null;
  }

  function closeProject(dialog) {
    if (!dialog.open || dialog.classList.contains("is-closing")) return;
    const shell = dialog.querySelector(".case-modal__shell");
    dialog.classList.add("is-closing");
    dialog.classList.remove("is-readable");

    if (reducedMotion || !shell || typeof shell.animate !== "function" || !activeTrigger) {
      finishClose(dialog);
      return;
    }

    const from = shell.getBoundingClientRect();
    const to = activeTrigger.getBoundingClientRect();
    const scaleX = Math.max(.03, to.width / from.width);
    const scaleY = Math.max(.03, to.height / from.height);
    const translateX = to.left - from.left;
    const translateY = to.top - from.top;

    shell.animate([
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1, filter: "none" },
      {
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`,
        opacity: 0,
        filter: "blur(5px) brightness(1.5)"
      }
    ], {
      duration: 430,
      easing: "cubic-bezier(.55, .06, .68, .19)",
      fill: "both"
    });
    closeTimer = window.setTimeout(() => finishClose(dialog), 420);
  }

  triggers.forEach(trigger => {
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", () => openProject(trigger));
  });

  dialogs.forEach(dialog => {
    dialog.querySelectorAll("[data-project-close]").forEach(button => {
      button.addEventListener("click", () => closeProject(dialog));
    });
    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      closeProject(dialog);
    });
    dialog.addEventListener("click", event => {
      if (event.target === dialog) closeProject(dialog);
    });
  });
})();

/* ── Chuẩn bị khi in / xuất PDF ──
   IntersectionObserver chỉ chạy khi phần tử lọt vào khung nhìn, nên lúc in
   các khối phía dưới có thể còn ẩn và số liệu còn đứng ở 0.
   Hàm này ép hiện hết nội dung và chốt số về giá trị cuối. */
function prepareForPrint() {
  document.body.classList.remove("is-loading");
  const pre = document.getElementById("preloader");
  if (pre) pre.style.display = "none";

  document.querySelectorAll(".reveal, .bar").forEach(el => el.classList.add("in"));
  document.querySelectorAll(".bar__pct").forEach(el => {
    el.textContent = (el.dataset.pct || "0") + "%";
  });
  document.querySelectorAll(".count").forEach(el => {
    el.textContent = formatVN(
      parseFloat(el.dataset.count),
      parseInt(el.dataset.decimal || "0", 10)
    );
  });
}
window.addEventListener("beforeprint", prepareForPrint);

/* Mở kèm ?print=1 để chốt nội dung ngay — dùng khi render PDF bằng trình duyệt headless */
if (new URLSearchParams(location.search).has("print")) {
  prepareForPrint();
  window.addEventListener("load", prepareForPrint);
}
