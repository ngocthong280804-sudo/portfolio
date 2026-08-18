// PROJECT CASE COMPLETE v23 — six distinct case identities, scan flow and cross-case navigation
(() => {
  const CASES = [
    { id: 'project-cntl-social', short: 'CNTL Social', title: 'Social Content & Video Performance', tags: ['Facebook Reels', 'F&B Content', 'Host + Script'] },
    { id: 'project-cntl-influencer', short: 'KOC/KOL', title: 'KOC/KOL Operations', tags: ['Influencer Ops', '50+ Creators', 'Multi-branch'] },
    { id: 'project-ecommerce-performance', short: 'E-commerce', title: 'E-commerce & Performance', tags: ['GrabFood', 'ShopeeFood', 'XanhSM'] },
    { id: 'project-unicamp', short: 'UniCamp', title: 'TikTok UniCamp S-Commerce', tags: ['TikTok Growth', 'S-Commerce', 'Livestream'] },
    { id: 'project-creator-lab', short: 'Creator Lab', title: 'Creator & Creative Technology Lab', tags: ['Creator Lab', 'AI-assisted', 'Remotion'] },
    { id: 'project-strategy-lab', short: 'Strategy', title: 'Marketing Strategy Projects', tags: ['Research', 'Campaign', 'E-commerce'] }
  ];

  const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ensureStyle = (href, marker) => {
    if ([...document.styleSheets].some((sheet) => sheet.href?.includes(href.split('?')[0]))) return;
    const attr = `data-${marker.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    if (document.querySelector(`link[${attr}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute(attr, 'true');
    document.head.appendChild(link);
  };

  const ensureProjectStyles = () => {
    ensureStyle('css/project-v22.css?v=22', 'projectV22');
    ensureStyle('css/project-v23.css?v=23', 'projectV23');
  };

  const loadProjectFilterV24 = () => {
    if (document.querySelector('script[data-project-filter-v24]')) return;
    const script = document.createElement('script');
    script.src = 'js/project-filter-v24.js?v=24';
    script.async = false;
    script.dataset.projectFilterV24 = 'true';
    document.head.appendChild(script);
  };

  const replaceText = (root, from, to) => {
    root.querySelectorAll('*').forEach((el) => {
      if (el.children.length === 0 && el.textContent?.includes(from)) {
        el.textContent = el.textContent.replaceAll(from, to);
      }
      ['aria-label', 'title'].forEach((attr) => {
        const value = el.getAttribute?.(attr);
        if (value?.includes(from)) el.setAttribute(attr, value.replaceAll(from, to));
      });
    });
  };

  const cleanPublicCopy = () => {
    if (!document.body) return;
    [
      ['05 Facebook Reels đã gắn link minh chứng trực tiếp', '05 Facebook Reels'],
      ['05 Facebook Reels đã gắn link video trực tiếp', '05 Facebook Reels'],
      ['05 Facebook Reels minh chứng', '05 Facebook Reels'],
      ['06 video từ 02 kênh TikTok đã gắn link trực tiếp', '06 TikTok Videos'],
      ['06 TikTok videos minh chứng', '06 TikTok Videos'],
      ['Video proof · Direct links', 'Facebook Reels · Direct links'],
      ['Video proof · 02 personal channels', 'TikTok Videos · 02 personal channels'],
      ['Khám phá minh chứng ↗', 'Xem 05 Reels ↗'],
      ['minh chứng trực tiếp', 'mẫu nội dung trực tiếp'],
      ['Minh chứng trực tiếp', 'Mẫu nội dung trực tiếp'],
      ['minh chứng', 'mẫu nội dung'],
      ['Minh chứng', 'Mẫu nội dung']
    ].forEach(([from, to]) => replaceText(document.body, from, to));

    const projects = document.querySelector('#duan');
    if (projects) {
      replaceText(projects, 'video proof', 'TikTok Videos');
      replaceText(projects, 'Video proof', 'TikTok Videos');
    }
  };

  const getSectionLabel = (section, index) => {
    const raw = section.querySelector('.case-label')?.textContent?.trim() || '';
    const normalized = raw.replace(/^\d+\s*·\s*/, '').trim();
    if (!normalized) return `Phần ${index + 1}`;
    const map = [
      ['overview', 'Overview'], ['bối cảnh', 'Overview'], ['giả thuyết', 'Overview'],
      ['challenge', 'Challenge'], ['bài toán', 'Challenge'],
      ['objective', 'Objectives'], ['mục tiêu', 'Objectives'],
      ['role', 'Role'], ['vai trò', 'Role'],
      ['strategy', 'Execution'], ['execution', 'Execution'], ['triển khai', 'Execution'], ['workflow', 'Execution'],
      ['deliverable', 'Deliverables'],
      ['performance', 'Results'], ['result', 'Results'], ['kết quả', 'Results'],
      ['gallery', 'Gallery'], ['video', 'Videos'], ['work sample', 'Gallery'],
      ['learning', 'Learnings'], ['bài học', 'Learnings'],
      ['link', 'Links']
    ];
    const lower = normalized.toLowerCase();
    const found = map.find(([key]) => lower.includes(key));
    return found ? found[1] : normalized.split('·')[0].trim().slice(0, 20);
  };

  const classifySections = (dialog, caseIndex) => {
    const hero = dialog.querySelector('.case-hero');
    if (hero) hero.dataset.caseNumber = String(caseIndex + 1).padStart(2, '0');

    [...dialog.querySelectorAll('.case-story > .case-section')].forEach((section, index) => {
      const label = getSectionLabel(section, index).toLowerCase();
      const raw = section.querySelector('.case-label')?.textContent?.toLowerCase() || '';
      const kinds = new Set();
      if (label.includes('overview')) kinds.add('overview');
      if (label.includes('challenge')) kinds.add('challenge');
      if (label.includes('objectives')) kinds.add('objectives');
      if (label.includes('role')) kinds.add('role');
      if (label.includes('execution') || raw.includes('triển khai') || raw.includes('strategy') || raw.includes('workflow')) kinds.add('execution');
      if (label.includes('results') || raw.includes('kết quả') || raw.includes('performance')) kinds.add('results');
      if (label.includes('videos') || raw.includes('video')) kinds.add('videos');
      if (label.includes('gallery') || raw.includes('gallery') || raw.includes('work sample')) kinds.add('gallery');
      if (label.includes('deliverables')) kinds.add('deliverables');
      section.dataset.caseKind = [...kinds].join(' ');
      kinds.forEach((kind) => {
        section.classList.add(`case-v22-section--${kind}`);
        section.classList.add(`case-v23-section--${kind}`);
      });
    });
  };

  const buildHeroMeta = (dialog, entry) => {
    const copy = dialog.querySelector('.case-hero__copy');
    if (!copy) return;
    copy.querySelector('.case-v23-hero-meta')?.remove();
    const meta = document.createElement('div');
    meta.className = 'case-v23-hero-meta';
    meta.setAttribute('aria-label', 'Tóm tắt case study');
    entry.tags.forEach((tag) => {
      const pill = document.createElement('span');
      pill.textContent = tag;
      meta.appendChild(pill);
    });
    copy.appendChild(meta);
  };

  const syncActiveNav = (dialog, links) => {
    const scroller = dialog.querySelector('.case-modal__scroll');
    if (!scroller || !links.length) return;
    const items = links.map((link) => ({ link, section: dialog.querySelector(link.getAttribute('href')) })).filter((item) => item.section);
    const sync = () => {
      const anchor = scroller.scrollTop + 190;
      let active = items[0];
      items.forEach((item) => { if (item.section.offsetTop <= anchor) active = item; });
      items.forEach((item) => item.link.classList.toggle('is-active', item === active));
    };
    scroller.addEventListener('scroll', sync, { passive: true });
    dialog.addEventListener('toggle', () => { if (dialog.open) requestAnimationFrame(sync); });
    sync();
  };

  const buildCaseNav = (dialog) => {
    const scroll = dialog.querySelector('.case-modal__scroll');
    if (!scroll) return;
    scroll.querySelector('.case-v21-nav')?.remove();
    const sections = [...scroll.querySelectorAll('.case-story > .case-section, .case-story > .case-takeaway')];
    if (!sections.length) return;

    const nav = document.createElement('nav');
    nav.className = 'case-v21-nav';
    nav.setAttribute('aria-label', 'Điều hướng nhanh trong case study');
    const priority = [];

    sections.forEach((section, index) => {
      section.id ||= `${dialog.id}-v23-${index + 1}`;
      section.classList.add('case-v21-anchor');
      const label = getSectionLabel(section, index);
      const lower = label.toLowerCase();
      if (['overview','challenge','objectives','role','execution','results','videos','gallery','learnings'].some((key) => lower.includes(key))) {
        priority.push({ section, label });
      }
    });

    const unique = [];
    const used = new Set();
    priority.forEach((item) => {
      if (!used.has(item.label) && unique.length < 7) {
        used.add(item.label);
        unique.push(item);
      }
    });

    unique.forEach(({ section, label }) => {
      const link = document.createElement('a');
      link.href = `#${section.id}`;
      link.textContent = label;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        section.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      });
      nav.appendChild(link);
    });

    const hero = scroll.querySelector('.case-hero');
    if (hero) scroll.insertBefore(nav, hero);
    else scroll.prepend(nav);
    syncActiveNav(dialog, [...nav.querySelectorAll('a')]);
  };

  const switchCase = (dialog, targetId) => {
    const trigger = document.querySelector(`[data-project-open="${targetId}"]`);
    if (!trigger) return;
    const close = dialog.querySelector('[data-project-close]');
    if (close) close.click();
    else if (dialog.open) dialog.close();
    window.setTimeout(() => trigger.click(), prefersReducedMotion() ? 80 : 500);
  };

  const buildCaseSwitcher = (dialog, index) => {
    const scroll = dialog.querySelector('.case-modal__scroll');
    if (!scroll) return;
    scroll.querySelector('.case-v23-switcher')?.remove();
    const prev = CASES[(index - 1 + CASES.length) % CASES.length];
    const next = CASES[(index + 1) % CASES.length];

    const wrap = document.createElement('nav');
    wrap.className = 'case-v23-switcher';
    wrap.setAttribute('aria-label', 'Chuyển giữa các case study');

    const makeButton = (direction, entry, arrow) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = direction === 'previous'
        ? `<b aria-hidden="true">${arrow}</b><span><small>Case trước</small><strong>${entry.title}</strong></span>`
        : `<span><small>Case tiếp theo</small><strong>${entry.title}</strong></span><b aria-hidden="true">${arrow}</b>`;
      button.setAttribute('aria-label', `${direction === 'previous' ? 'Mở case trước' : 'Mở case tiếp theo'}: ${entry.title}`);
      button.addEventListener('click', () => switchCase(dialog, entry.id));
      return button;
    };

    wrap.appendChild(makeButton('previous', prev, '←'));
    const indexEl = document.createElement('span');
    indexEl.className = 'case-v23-switcher__index';
    indexEl.innerHTML = `<b>${String(index + 1).padStart(2, '0')}</b><small>/ 06 PROJECTS</small>`;
    wrap.appendChild(indexEl);
    wrap.appendChild(makeButton('next', next, '→'));
    scroll.appendChild(wrap);

    dialog.addEventListener('keydown', (event) => {
      if (!dialog.open || !event.altKey) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); switchCase(dialog, prev.id); }
      if (event.key === 'ArrowRight') { event.preventDefault(); switchCase(dialog, next.id); }
    });
  };

  const normalizeCases = () => {
    CASES.forEach((entry, index) => {
      const dialog = document.getElementById(entry.id);
      if (!dialog) return;
      dialog.dataset.caseIndex = String(index + 1).padStart(2, '0');
      dialog.dataset.caseShort = entry.short;
      const label = dialog.querySelector('.case-modal__topbar > span:first-child');
      if (label) label.textContent = `CASE ${String(index + 1).padStart(2, '0')} / 06 · ${entry.short.toUpperCase()}`;
      classifySections(dialog, index);
      buildHeroMeta(dialog, entry);
      buildCaseNav(dialog);
      buildCaseSwitcher(dialog, index);
    });
  };

  const enhanceProjectCards = () => {
    document.querySelectorAll('#duan .project-tab').forEach((tab, index) => {
      const number = String(index + 1).padStart(2, '0');
      tab.dataset.projectIndex = number;
      const identityNumber = tab.querySelector('.project-tab__identity > small');
      if (identityNumber) identityNumber.textContent = number;
      let watermark = tab.querySelector('.project-v22-watermark');
      if (!watermark) {
        watermark = document.createElement('span');
        watermark.className = 'project-v22-watermark';
        watermark.setAttribute('aria-hidden', 'true');
        tab.appendChild(watermark);
      }
      watermark.textContent = number;
    });
  };

  const updateCaseProgress = (dialog) => {
    const scroller = dialog.querySelector('.case-modal__scroll');
    const bar = dialog.querySelector('.case-modal__progress i');
    if (!scroller || !bar) return;
    const sync = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, scroller.scrollTop / max)) : 0;
      bar.style.transformOrigin = 'left center';
      bar.style.transform = `scaleX(${progress})`;
    };
    scroller.addEventListener('scroll', sync, { passive: true });
    dialog.addEventListener('toggle', () => {
      if (dialog.open) {
        scroller.scrollTop = 0;
        requestAnimationFrame(sync);
      }
    });
    sync();
  };

  const boot = () => {
    ensureProjectStyles();
    cleanPublicCopy();
    normalizeCases();
    enhanceProjectCards();
    CASES.forEach(({ id }) => {
      const dialog = document.getElementById(id);
      if (dialog) updateCaseProgress(dialog);
    });
    loadProjectFilterV24();
    document.documentElement.dataset.projectUi = 'v24';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
