/* ═══════════════════════════════════════════════
   TRẦN MAI ANH — PORTFOLIO v3
   Holographic Pearl — Y2K chrome + kinetic type
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
    s.textContent = ch === " " ? " " : ch;
    el.appendChild(s);
  });
});

/* ── Preloader → kích hoạt pop chữ hero ── */
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  setTimeout(() => {
    pre.classList.add("done");
    document.querySelectorAll(".hero-chrome").forEach(el => el.classList.add("popped"));
    document.getElementById("mascotHero")?.classList.add("landed"); // linh vật nhảy vào
  }, reducedMotion ? 0 : 800);
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
const typeText = "trần ngọc thông — marketing strategist";
if (typeTarget) {
  if (reducedMotion) {
    typeTarget.textContent = typeText;
  } else {
    let i = 0;
    setTimeout(function typeNext() {
      typeTarget.textContent = typeText.slice(0, ++i);
      if (i < typeText.length) setTimeout(typeNext, 34 + Math.random() * 40);
    }, 1200);
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

/* ── Reveal + kích hoạt hiệu ứng con ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("in");
    // chữ chrome trong section → pop khi hiện
    entry.target.querySelectorAll(".chrome[data-letters]").forEach(c => c.classList.add("popped"));
    if (entry.target.classList.contains("chrome")) entry.target.classList.add("popped");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* chữ chrome đứng ngoài .reveal (vd. trong section-head .reveal đã bao) —
   đảm bảo mọi chrome section đều pop khi vào tầm nhìn */
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
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(target * eased) + "%";
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
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = (target * eased).toFixed(decimals);
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
   HERO 3D — Three.js
   Ngôi sao 4 cánh chrome holographic bay lơ lửng
   (như sparkle trong ảnh tham khảo), phản ứng
   theo chuột + cuộn trang
   ═══════════════════════════════════════════════ */
async function initScene() {
  const canvas = document.getElementById("scene");
  if (!canvas) return;

  let THREE, RoomEnvironment;
  try {
    THREE = await import("three");
    ({ RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js"));
  } catch (e) {
    canvas.remove(); // offline → giữ nền gradient CSS
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  /* hình ngôi sao 4 cánh (như sparkle ✦) */
  function starShape(long = 1, short = 0.22) {
    const s = new THREE.Shape();
    s.moveTo(0, long);
    s.lineTo(short, short);
    s.lineTo(long, 0);
    s.lineTo(short, -short);
    s.lineTo(0, -long);
    s.lineTo(-short, -short);
    s.lineTo(-long, 0);
    s.lineTo(-short, short);
    s.closePath();
    return s;
  }
  const starGeo = new THREE.ExtrudeGeometry(starShape(), {
    depth: 0.16, bevelEnabled: true,
    bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 4
  });
  starGeo.center();

  /* vật liệu holographic chrome — sáng, tươi */
  const holo = new THREE.MeshPhysicalMaterial({
    color: 0xeae4ff, metalness: 0.9, roughness: 0.18,
    envMapIntensity: 2.4,
    iridescence: 0.85, iridescenceIOR: 1.4,
    iridescenceThicknessRange: [140, 420]
  });
  const group = new THREE.Group();
  scene.add(group);

  /* sao lớn bên phải + sao đối xứng bên trái cho cân bố cục */
  const bigStar = new THREE.Mesh(starGeo, holo);
  bigStar.scale.setScalar(2.1);
  bigStar.position.set(6.3, 0.2, -0.5);
  group.add(bigStar);

  const leftStar = new THREE.Mesh(starGeo, holo);
  leftStar.scale.setScalar(1.5);
  leftStar.position.set(-6.4, -0.8, -1.2);
  leftStar.rotation.z = 0.5;
  group.add(leftStar);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xf0e8ff, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(5, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x4de1ff, 0.8);
  rim.position.set(-6, -3, 4);
  scene.add(rim);

  const hero = canvas.parentElement;
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  if (finePointer) {
    window.addEventListener("mousemove", e => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  const clock = new THREE.Clock();
  function render() {
    const t = clock.getElapsedTime();
    const scroll = window.scrollY / window.innerHeight;

    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;

    bigStar.rotation.y = t * 0.35 + curX * 0.55;
    bigStar.rotation.x = curY * 0.4;
    bigStar.position.y = 0.2 + Math.sin(t * 0.6) * 0.25;

    leftStar.rotation.y = -t * 0.3 + curX * 0.4;
    leftStar.position.y = -0.8 + Math.sin(t * 0.5 + 2) * 0.22;

    group.rotation.y = scroll * 0.9 + curX * 0.05;
    group.position.y = scroll * 2.4;
    camera.position.z = 11 + scroll * 2.5;

    /* linh vật nghiêng nhẹ theo chuột (parallax) */
    const mImg = document.getElementById("mascotImg");
    if (mImg) mImg.style.transform = `translate(${curX * 14}px, ${curY * 10}px) rotate(${curX * 3}deg)`;

    renderer.render(scene, camera);
  }

  if (reducedMotion) { render(); return; }

  let heroVisible = true;
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
  }).observe(hero);

  renderer.setAnimationLoop(() => { if (heroVisible) render(); });
}

initScene();
