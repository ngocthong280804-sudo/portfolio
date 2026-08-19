// PROJECT FILTER CONTROL DECK v24 — dynamic counters, icons and category accents
(() => {
  const styleHref = 'css/project-filter-v24.css?v=24';
  if (!document.querySelector(`link[href*="project-filter-v24.css"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = styleHref;
    link.dataset.projectFilterV24 = 'true';
    document.head.appendChild(link);
  }

  const THEMES = {
    all:        { rgb: '126, 206, 255', accent: '#7eceff', accent2: '#a38cff' },
    social:     { rgb: '37, 244, 238',  accent: '#25f4ee', accent2: '#fe2c55' },
    influencer: { rgb: '248, 193, 20',  accent: '#f8c114', accent2: '#ff8a4d' },
    ecommerce:  { rgb: '69, 216, 255',  accent: '#45d8ff', accent2: '#2e7bff' },
    campaign:   { rgb: '159, 124, 255', accent: '#9f7cff', accent2: '#55d8ff' },
    data:       { rgb: '86, 218, 255',  accent: '#56daff', accent2: '#70ffb8' },
    technology: { rgb: '176, 118, 255', accent: '#b076ff', accent2: '#49e6ff' }
  };

  const ICONS = {
    all: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>`,
    social: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.5v9l7-4.5-7-4.5Z"/><path d="M18.5 4.5 20 3m-1.5 16.5L20 21M4 5l1.5 1.5M4 19l1.5-1.5"/></svg>`,
    influencer: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.3"/><path d="M3.5 19c.7-3.2 2.6-5 5.5-5s4.8 1.8 5.5 5M14.5 15.2c2.8-.7 5.1.8 6 3.8"/></svg>`,
    ecommerce: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h2l2 10h10l2-7H6"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/><path d="M10 10h5m-2.5-2.5V12.5"/></svg>`,
    campaign: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="m16.5 7.5 4-4m-1 0h1v1"/></svg>`,
    data: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/><path d="M3 19h18"/></svg>`,
    technology: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2.5-11-3 14"/><path d="M18.5 3.5v3m-1.5-1.5h3"/></svg>`
  };

  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const boot = () => {
    const projects = document.getElementById('duan');
    const filterBar = projects?.querySelector('.project-filters');
    const filters = [...(projects?.querySelectorAll('[data-project-filter]') || [])];
    const tabs = [...(projects?.querySelectorAll('[data-project-categories]') || [])];
    const jumps = [...document.querySelectorAll('[data-filter-jump]')];
    if (!projects || !filterBar || !filters.length || !tabs.length) return;
    if (projects.classList.contains('project-filter-enhanced')) return;

    const categoriesFor = (tab) => (tab.dataset.projectCategories || '').split(/\s+/).filter(Boolean);
    const countFor = (value) => value === 'all'
      ? tabs.length
      : tabs.filter((tab) => categoriesFor(tab).includes(value)).length;

    projects.classList.add('project-filter-enhanced');

    const shell = document.createElement('div');
    shell.className = 'project-filter-shell';
    filterBar.parentNode.insertBefore(shell, filterBar);
    shell.appendChild(filterBar);

    const connector = document.createElement('span');
    connector.className = 'project-filter-connector';
    connector.setAttribute('aria-hidden', 'true');
    shell.appendChild(connector);

    const glow = document.createElement('span');
    glow.className = 'project-filter-glow';
    glow.setAttribute('aria-hidden', 'true');
    filterBar.appendChild(glow);

    const status = document.createElement('div');
    status.className = 'project-filter-status';
    status.setAttribute('aria-live', 'polite');
    status.innerHTML = `<span><i class="project-filter-status__pulse" aria-hidden="true"></i>Active view · <strong>All Projects</strong></span><span data-project-filter-status-count>${tabs.length}/${tabs.length} projects</span>`;
    shell.insertAdjacentElement('afterend', status);

    filters.forEach((button) => {
      const value = button.dataset.projectFilter || 'all';
      const label = button.textContent.trim();
      const count = countFor(value);
      button.dataset.projectFilterLabel = label;
      button.textContent = '';

      const icon = document.createElement('span');
      icon.className = 'project-filter__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = ICONS[value] || ICONS.all;

      const text = document.createElement('span');
      text.className = 'project-filter__label';
      text.textContent = label;

      const badge = document.createElement('span');
      badge.className = 'project-filter__count';
      badge.textContent = String(count).padStart(2, '0');
      badge.setAttribute('aria-hidden', 'true');

      button.append(icon, text, badge);
      button.setAttribute('aria-label', `${label}, ${count} dự án`);
    });

    const applyTheme = (value) => {
      const theme = THEMES[value] || THEMES.all;
      projects.style.setProperty('--project-filter-rgb', theme.rgb);
      projects.style.setProperty('--project-filter-accent', theme.accent);
      projects.style.setProperty('--project-filter-accent-2', theme.accent2);
      projects.dataset.activeFilter = value;
    };

    const moveGlow = (button) => {
      if (!button) return;
      filterBar.style.setProperty('--pill-x', `${button.offsetLeft}px`);
      filterBar.style.setProperty('--pill-y', `${button.offsetTop}px`);
      filterBar.style.setProperty('--pill-w', `${button.offsetWidth}px`);
      filterBar.style.setProperty('--pill-h', `${button.offsetHeight}px`);
    };

    const updateStatus = (value) => {
      const current = filters.find((button) => button.dataset.projectFilter === value);
      const count = countFor(value);
      const label = current?.dataset.projectFilterLabel || 'All Projects';
      status.querySelector('strong').textContent = label;
      status.querySelector('[data-project-filter-status-count]').textContent = `${count}/${tabs.length} projects`;
    };

    const update = (value, animate = true) => {
      const activeButton = filters.find((button) => button.dataset.projectFilter === value) || filters[0];
      const normalized = activeButton?.dataset.projectFilter || 'all';
      applyTheme(normalized);

      filters.forEach((button) => {
        const active = button === activeButton;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });

      tabs.forEach((tab, index) => {
        const visible = normalized === 'all' || categoriesFor(tab).includes(normalized);
        tab.classList.toggle('is-hidden', !visible);
        tab.classList.toggle('is-filter-match', visible);
        tab.setAttribute('aria-hidden', String(!visible));
        tab.classList.remove('is-filter-entering');
        if (visible && animate && !reducedMotion()) {
          setTimeout(() => {
            tab.classList.add('is-filter-entering');
            setTimeout(() => tab.classList.remove('is-filter-entering'), 500);
          }, index * 35);
        }
      });

      updateStatus(normalized);
      requestAnimationFrame(() => moveGlow(activeButton));
    };

    filters.forEach((button) => button.addEventListener('click', () => {
      requestAnimationFrame(() => update(button.dataset.projectFilter || 'all', true));
    }));

    jumps.forEach((link) => link.addEventListener('click', () => {
      setTimeout(() => update(link.dataset.filterJump || 'all', true), 0);
    }));

    let resizeTimer = 0;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const active = filters.find((button) => button.classList.contains('is-active')) || filters[0];
        moveGlow(active);
      }, 80);
    }, { passive: true });

    filterBar.addEventListener('scroll', () => {
      const active = filters.find((button) => button.classList.contains('is-active')) || filters[0];
      moveGlow(active);
    }, { passive: true });

    const resync = () => {
      const active = filters.find((button) => button.classList.contains('is-active')) || filters[0];
      moveGlow(active);
    };
    document.querySelector('link[data-project-filter-v24]')?.addEventListener('load', () => requestAnimationFrame(resync), { once: true });
    document.fonts?.ready?.then(resync).catch(() => {});

    const initial = filters.find((button) => button.classList.contains('is-active'))?.dataset.projectFilter || 'all';
    update(initial, false);
    document.documentElement.dataset.projectFilterUi = 'v24';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();

// ABOUT REDESIGN v25 — remove language block, use official UEF identity and rebalance the section
(() => {
  const UEF_LOGO = 'data:image/png;base64,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';

  const ensureStyle = () => {
    if (document.querySelector('link[data-about-v25]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/about-v25.css?v=25';
    link.dataset.aboutV25 = 'true';
    document.head.appendChild(link);
  };

  const enhanceAbout = () => {
    const about = document.querySelector('#vetoi.about');
    if (!about || about.dataset.aboutV25 === 'true') return;
    ensureStyle();

    const profileGrid = about.querySelector('.about__profile-grid');
    const academic = profileGrid?.querySelector('.about-info-card--academic');
    const credentials = profileGrid?.querySelector('.about-info-card--credentials');

    if (academic) {
      academic.classList.add('about-info-card--academic-v25');
      const head = academic.querySelector('.about-info-card__head');
      const title = head?.querySelector('strong');
      if (title) title.textContent = 'Học vấn';

      academic.querySelector('.about-language-list')?.remove();

      const hero = academic.querySelector('.about-academic-hero');
      if (hero) {
        hero.classList.add('about-academic-hero--v25');
        const mark = hero.querySelector('.about-academic-hero__mark');
        if (mark) {
          mark.classList.add('about-academic-hero__mark--logo');
          mark.removeAttribute('aria-hidden');
          mark.innerHTML = `<img src="${UEF_LOGO}" alt="Logo UEF">`;
        }
        const copy = hero.children[1];
        if (copy) copy.classList.add('about-academic-hero__copy');
        const meta = hero.querySelector('small');
        if (meta) meta.textContent = 'UEF · 2022–2026';
      }
    }

    if (credentials) credentials.classList.add('about-info-card--credentials-v25');

    if (profileGrid) {
      profileGrid.classList.add('about__profile-grid--wide');
      if (profileGrid.parentElement !== about) about.appendChild(profileGrid);
    }

    about.classList.add('about-v25');
    about.dataset.aboutV25 = 'true';
    document.documentElement.dataset.aboutUi = 'v25';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceAbout, { once: true });
  else enhanceAbout();
})();
