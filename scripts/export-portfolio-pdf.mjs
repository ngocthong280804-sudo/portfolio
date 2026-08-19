import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });

await page.goto('http://127.0.0.1:8000/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(6000);

const exportInfo = await page.evaluate(async () => {
  document.documentElement.classList.add('portfolio-pdf-export');

  // Remove interaction-only overlays that can cover the exported page.
  ['#preloader', '.preloader', '.cursor', '.custom-cursor', '.cursor-dot', '.cursor-ring']
    .forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));

  // Freeze every animated/reveal element in its fully visible state.
  const style = document.createElement('style');
  style.textContent = `
    @media print { @page { margin: 0; } }
    html, body {
      width: 1440px !important;
      max-width: 1440px !important;
      min-width: 1440px !important;
      height: auto !important;
      min-height: 0 !important;
      overflow: visible !important;
      scroll-behavior: auto !important;
      print-color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
    }
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }
    .reveal, [class*="reveal"], [data-reveal] {
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
      translate: none !important;
      scale: 1 !important;
      filter: none !important;
    }
    #portfolio-pdf-cases {
      position: relative !important;
      z-index: 2 !important;
      display: block !important;
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
      background: #050816;
    }
    dialog.pdf-case-export,
    #portfolio-pdf-cases dialog.pdf-case-export,
    .pdf-case-export {
      position: relative !important;
      inset: auto !important;
      top: auto !important;
      right: auto !important;
      bottom: auto !important;
      left: auto !important;
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      height: auto !important;
      max-height: none !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      border: 0 !important;
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
      translate: none !important;
      scale: 1 !important;
      background: transparent !important;
      color: inherit !important;
    }
    dialog.pdf-case-export::backdrop { display: none !important; }
    .pdf-case-export .case-modal__shell,
    .pdf-case-export .case-modal__scroll,
    .pdf-case-export .case-layout,
    .pdf-case-export .case-story,
    .pdf-case-export .case-section,
    .pdf-case-export [class*="case-"] {
      max-height: none !important;
      overflow: visible !important;
    }
    .pdf-case-export .case-modal__shell,
    .pdf-case-export .case-modal__scroll {
      position: relative !important;
      height: auto !important;
      min-height: 0 !important;
    }
    .pdf-case-export [data-project-close],
    .pdf-case-export .case-modal__close { display: none !important; }
    .pdf-case-export .case-modal__topbar {
      position: sticky !important;
      top: 0 !important;
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('img').forEach(img => {
    img.loading = 'eager';
    img.decoding = 'sync';
  });

  // Current case studies live as dialogs in the real DOM. Legacy archived cases are
  // inside <template> and therefore are not included by document.querySelectorAll().
  const dialogs = [...document.querySelectorAll('dialog')].filter(d => !d.closest('template'));
  if (!dialogs.length) {
    throw new Error('No live project case dialogs found in current portfolio DOM');
  }

  const cases = document.createElement('section');
  cases.id = 'portfolio-pdf-cases';
  cases.setAttribute('aria-label', 'Full project case studies');

  dialogs.forEach((dialog, index) => {
    try { dialog.close?.(); } catch {}
    dialog.removeAttribute('open');
    dialog.style.display = 'none';

    const clone = dialog.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('open', '');
    clone.classList.add('pdf-case-export');
    clone.dataset.pdfCase = String(index + 1);
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    clone.querySelectorAll('[data-project-close], .case-modal__close').forEach(el => el.remove());
    clone.querySelectorAll('img').forEach(img => {
      img.loading = 'eager';
      img.decoding = 'sync';
    });
    cases.appendChild(clone);
  });

  const projectSection = document.querySelector('#duan') || document.querySelector('[id*="duan"]');
  if (projectSection?.parentNode) projectSection.insertAdjacentElement('afterend', cases);
  else document.querySelector('main')?.appendChild(cases) || document.body.appendChild(cases);

  document.body.classList.remove('modal-open', 'no-scroll', 'project-open');
  document.documentElement.classList.remove('modal-open', 'no-scroll', 'project-open');

  await Promise.all([...document.images].map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
      setTimeout(resolve, 8000);
    });
  }));

  window.scrollTo(0, 0);
  return {
    projectCount: dialogs.length,
    projectIds: dialogs.map(d => d.id || d.getAttribute('aria-labelledby') || d.className)
  };
});

await page.waitForTimeout(3000);
await page.emulateMedia({ media: 'screen' });

const dims = await page.evaluate(() => ({
  width: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, 1440),
  height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
}));

// Keep the entire portfolio on ONE continuous PDF page. Chromium has a practical
// page-height ceiling, so proportionally scale the source if the scroll is very tall.
const CSS_DPI = 96;
const MAX_HEIGHT_IN = 180;
const rawHeightIn = dims.height / CSS_DPI;
const scale = Math.max(0.1, Math.min(1, MAX_HEIGHT_IN / rawHeightIn));
const pageWidthIn = (dims.width / CSS_DPI) * scale;
const pageHeightIn = (dims.height / CSS_DPI) * scale;

console.log(JSON.stringify({ exportInfo, dims, scale, pageWidthIn, pageHeightIn }, null, 2));

await page.pdf({
  path: 'Tran-Ngoc-Thong-Portfolio-GitHub.pdf',
  printBackground: true,
  preferCSSPageSize: false,
  width: `${pageWidthIn}in`,
  height: `${pageHeightIn}in`,
  scale,
  margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
  displayHeaderFooter: false,
  tagged: true,
  outline: true
});

await browser.close();

if (!fs.existsSync('Tran-Ngoc-Thong-Portfolio-GitHub.pdf')) {
  throw new Error('Portfolio PDF was not created');
}

const bytes = fs.statSync('Tran-Ngoc-Thong-Portfolio-GitHub.pdf').size;
if (bytes < 100_000) throw new Error(`Portfolio PDF looks too small: ${bytes} bytes`);
console.log(`PDF created: ${bytes} bytes`);
