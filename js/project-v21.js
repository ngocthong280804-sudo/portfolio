// PROJECT CASE REDESIGN v21 — navigation, labels and recruiter-first scan flow
(() => {
  const CASES = [
    { id: 'project-cntl-social', short: 'CNTL Social' },
    { id: 'project-cntl-influencer', short: 'KOC/KOL' },
    { id: 'project-ecommerce-performance', short: 'E-commerce' },
    { id: 'project-unicamp', short: 'UniCamp' },
    { id: 'project-creator-lab', short: 'Creator Lab' },
    { id: 'project-strategy-lab', short: 'Strategy' }
  ];

  const textReplace = (root, from, to) => {
    root.querySelectorAll('*').forEach((el) => {
      if (el.children.length === 0 && el.textContent && el.textContent.includes(from)) {
        el.textContent = el.textContent.replaceAll(from, to);
      }
    });
  };

  const cleanPublicCopy = () => {
    const projectSection = document.querySelector('#duan');
    if (!projectSection) return;

    // Copy requested in the 18/08 redesign pass.
    textReplace(projectSection, '05 Facebook Reels đã gắn link minh chứng trực tiếp', '05 Facebook Reels');
    textReplace(projectSection, '06 video từ 02 kênh TikTok đã gắn link trực tiếp', '06 TikTok Videos');
    textReplace(projectSection, 'video proof', 'TikTok Videos');
    textReplace(projectSection, 'minh chứng', 'video');
    textReplace(projectSection, 'Minh chứng', 'Video');
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

  const buildCaseNav = (dialog) => {
    const scroll = dialog.querySelector('.case-modal__scroll');
    if (!scroll || scroll.querySelector('.case-v21-nav')) return;

    const sections = [...scroll.querySelectorAll('.case-story > .case-section, .case-story > .case-takeaway')];
    if (!sections.length) return;

    const nav = document.createElement('nav');
    nav.className = 'case-v21-nav';
    nav.setAttribute('aria-label', 'Điều hướng nhanh trong case study');

    const priority = [];
    sections.forEach((section, index) => {
      const id = `${dialog.id}-v21-${index + 1}`;
      section.id ||= id;
      section.classList.add('case-v21-anchor');
      const label = getSectionLabel(section, index);
      const lower = label.toLowerCase();
      if (['overview','challenge','role','execution','results','videos','gallery','learnings'].some(k => lower.includes(k))) {
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
        section.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      });
      nav.appendChild(link);
    });

    const topbar = scroll.querySelector('.case-modal__topbar');
    if (topbar?.nextSibling) topbar.parentNode.insertBefore(nav, topbar.nextSibling);
    else scroll.prepend(nav);
  };

  const normalizeTopbars = () => {
    CASES.forEach((entry, index) => {
      const dialog = document.getElementById(entry.id);
      if (!dialog) return;
      const label = dialog.querySelector('.case-modal__topbar > span:first-child');
      if (label) label.textContent = `CASE ${String(index + 1).padStart(2, '0')} / 06 · ${entry.short.toUpperCase()}`;
      buildCaseNav(dialog);
    });
  };

  const enhanceProjectCards = () => {
    document.querySelectorAll('#duan .project-tab').forEach((tab, index) => {
      tab.dataset.projectIndex = String(index + 1).padStart(2, '0');
      const identityNumber = tab.querySelector('.project-tab__identity > small');
      if (identityNumber) identityNumber.textContent = String(index + 1).padStart(2, '0');
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
    sync();
  };

  const boot = () => {
    cleanPublicCopy();
    normalizeTopbars();
    enhanceProjectCards();
    CASES.forEach(({ id }) => {
      const dialog = document.getElementById(id);
      if (dialog) updateCaseProgress(dialog);
    });
    document.documentElement.dataset.projectUi = 'v21';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
