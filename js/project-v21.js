// PROJECT CASE REDESIGN v22 — premium scan flow, navigation and recruiter-first hierarchy
(() => {
  const CASES = [
    { id: 'project-cntl-social', short: 'CNTL Social' },
    { id: 'project-cntl-influencer', short: 'KOC/KOL' },
    { id: 'project-ecommerce-performance', short: 'E-commerce' },
    { id: 'project-unicamp', short: 'UniCamp' },
    { id: 'project-creator-lab', short: 'Creator Lab' },
    { id: 'project-strategy-lab', short: 'Strategy' }
  ];

  const ensurePolishStyles = () => {
    if (document.querySelector('link[data-project-v22]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/project-v22.css?v=22';
    link.dataset.projectV22 = 'true';
    document.head.appendChild(link);
  };

  const textReplace = (root, from, to) => {
    root.querySelectorAll('*').forEach((el) => {
      if (el.children.length === 0 && el.textContent && el.textContent.includes(from)) {
        el.textContent = el.textContent.replaceAll(from, to);
      }
    });
  };

  const cleanPublicCopy = () => {
    const root = document.body;
    if (!root) return;
    const replacements = [
      ['05 Facebook Reels đã gắn link minh chứng trực tiếp', '05 Facebook Reels'],
      ['05 Facebook Reels đã gắn link video trực tiếp', '05 Facebook Reels'],
      ['06 video từ 02 kênh TikTok đã gắn link trực tiếp', '06 TikTok Videos'],
      ['video proof', 'TikTok Videos'],
      ['Video proof', 'TikTok Videos'],
      ['minh chứng trực tiếp', 'video trực tiếp'],
      ['Minh chứng trực tiếp', 'Video trực tiếp'],
      ['minh chứng', 'video'],
      ['Minh chứng', 'Video']
    ];
    replacements.forEach(([from, to]) => textReplace(root, from, to));
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
      ['strategy', 'Execution'], ['execution', 'Execution'], ['triển khai', 'Execution'],
      ['deliverable', 'Deliverables'],
      ['performance', 'Results'], ['result', 'Results'], ['kết quả', 'Results'],
      ['gallery', 'Gallery'], ['video', 'Videos'], ['work sample', 'Gallery'],
      ['learning', 'Learnings'], ['bài học', 'Learnings'],
      ['link', 'Links']
    ];
    const lower = normalized.toLowerCase();
    const found = map.find(([key]) => lower.includes(key));
    return found ? found[1] : normalized.split('·')[0].trim().slice(0, 18);
  };

  const classifySections = (dialog) => {
    const hero = dialog.querySelector('.case-hero');
    const caseIndex = CASES.findIndex((item) => item.id === dialog.id) + 1;
    if (hero) hero.dataset.caseNumber = String(caseIndex).padStart(2, '0');

    const sections = [...dialog.querySelectorAll('.case-story > .case-section')];
    sections.forEach((section, index) => {
      const label = getSectionLabel(section, index).toLowerCase();
      const raw = section.querySelector('.case-label')?.textContent?.toLowerCase() || '';
      const add = (name) => section.classList.add(`case-v22-section--${name}`);

      if (label.includes('overview')) add('overview');
      if (label.includes('challenge')) add('challenge');
      if (label.includes('objectives')) add('objectives');
      if (label.includes('role')) add('role');
      if (label.includes('execution') || raw.includes('triển khai') || raw.includes('strategy')) add('execution');
      if (label.includes('results') || raw.includes('kết quả') || raw.includes('performance')) add('results');
      if (label.includes('videos') || raw.includes('video')) add('videos');
      if (label.includes('gallery') || raw.includes('gallery') || raw.includes('work sample')) add('gallery');
    });
  };

  const syncActiveNav = (dialog, links) => {
    const scroller = dialog.querySelector('.case-modal__scroll');
    if (!scroller || !links.length) return;

    const items = links.map((link) => ({
      link,
      section: dialog.querySelector(link.getAttribute('href'))
    })).filter((item) => item.section);

    const sync = () => {
      const anchor = scroller.scrollTop + 170;
      let active = items[0];
      items.forEach((item) => {
        if (item.section.offsetTop <= anchor) active = item;
      });
      items.forEach((item) => item.link.classList.toggle('is-active', item === active));
    };

    scroller.addEventListener('scroll', sync, { passive: true });
    sync();
  };

  const buildCaseNav = (dialog) => {
    const scroll = dialog.querySelector('.case-modal__scroll');
    if (!scroll) return;

    const existing = scroll.querySelector('.case-v21-nav');
    if (existing) existing.remove();

    const sections = [...scroll.querySelectorAll('.case-story > .case-section, .case-story > .case-takeaway')];
    if (!sections.length) return;

    const nav = document.createElement('nav');
    nav.className = 'case-v21-nav';
    nav.setAttribute('aria-label', 'Điều hướng nhanh trong case study');

    const priority = [];
    sections.forEach((section, index) => {
      section.id ||= `${dialog.id}-v22-${index + 1}`;
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
        section.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start'
        });
      });
      nav.appendChild(link);
    });

    const topbar = scroll.querySelector('.case-modal__topbar');
    if (topbar?.nextSibling) topbar.parentNode.insertBefore(nav, topbar.nextSibling);
    else scroll.prepend(nav);

    syncActiveNav(dialog, [...nav.querySelectorAll('a')]);
  };

  const normalizeTopbars = () => {
    CASES.forEach((entry, index) => {
      const dialog = document.getElementById(entry.id);
      if (!dialog) return;
      const label = dialog.querySelector('.case-modal__topbar > span:first-child');
      if (label) label.textContent = `CASE ${String(index + 1).padStart(2, '0')} / 06 · ${entry.short.toUpperCase()}`;
      classifySections(dialog);
      buildCaseNav(dialog);
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
    ensurePolishStyles();
    cleanPublicCopy();
    normalizeTopbars();
    enhanceProjectCards();
    CASES.forEach(({ id }) => {
      const dialog = document.getElementById(id);
      if (dialog) updateCaseProgress(dialog);
    });
    document.documentElement.dataset.projectUi = 'v22';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
