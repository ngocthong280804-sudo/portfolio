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
