import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });

await page.goto('http://127.0.0.1:8000/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(6000);

// Freeze the live experience into a print-safe version without changing the website source.
const projectCount = await page.evaluate(async () => {
  document.documentElement.classList.add('portfolio-pdf-export');

  // Remove loading/interaction-only UI that can cover printed content.
  const disposable = [
    '#preloader', '.preloader', '.cursor', '.custom-cursor', '.cursor-dot', '.cursor-ring',
    '[data-project-close]', '.case-modal__close'
  ];
  disposable.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));

  // Make all images load for export.
  document.querySelectorAll('img').forEach(img => {
    img.loading = 'eager';
    img.decoding = 'sync';
  });

  // Find the real case-study dialogs that are part of the current DOM.
  // Content inside <template> (legacy archive) is not returned here.
  const dialogs = [...document.querySelectorAll('dialog')].filter(d => !d.closest('template'));

  // Add the full project cases directly after the Projects section so the PDF reads
  // like one continuous scroll: website -> project overview -> all case studies -> rest of site.
  const anchor = document.querySelector('#duan') || document.querySelector('[id*="duan"]') || document.querySelector('main');
  const container = document.createElement('section');
  container.id = 'portfolio-pdf-cases';
  container.setAttribute('aria-label', 'Full project case studies');

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
    container.appendChild(clone);
  });

  if (anchor && anchor.parentNode) anchor.insertAdjacentElement('afterend', container);
  else document.body.appendChild(container);

  const style = document.createElement('style');
  style.id = 'portfolio-pdf-export-style';
  style.textContent = `
    @media print {
      @page { margin: 0; }
    }
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
    #portfolio-pdf-cases dialog.pdf-case-export {
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
    .pdf-case-export .case-modal__topbar {
      position: sticky !important;
      top: 0 !important;
    }
    body:has(#portfolio-pdf-cases) { overflow: visible !important; }
  `;
  document.head.appendChild(style);

  // Wait for local and remote images currently visible in the print DOM.
  await Promise.all([...document.images].map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  }));

  window.scrollTo(0, 0);
  return dialogs.length;
});

await page.waitForTimeout(3000);
await page.emulateMedia({ media: 'screen' });

const dims = await page.evaluate(() => ({
  width: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, 1440),
  height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
}));

// Chromium caps very large PDF page dimensions. Scale the whole website proportionally
// so the complete portfolio fits on ONE continuous PDF page, with vector text retained.
const MAX_HEIGHT_IN = 180;
const CSS_DPI = 96;
const rawHeightIn = dims.height / CSS_DPI;
const scale = Math.max(0.1, Math.min(1, MAX_HEIGHT_IN / rawHeightIn));
const pageWidthIn = (dims.width / CSS_DPI) * scale;
const pageHeightIn = (dims.height / CSS_DPI) * scale;

console.log(JSON.stringify({ projectCount, dims, scale, pageWidthIn, pageHeightIn }, null, 2));

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
  throw new Error('PDF was not created');
}

try {
  const info = execFileSync('pdfinfo', ['Tran-Ngoc-Thong-Portfolio-GitHub.pdf'], { encoding: 'utf8' });
  console.log(info);
  const pageMatch = info.match(/^Pages:\s+(\d+)/m);
  if (pageMatch && Number(pageMatch[1]) !== 1) {
    throw new Error(`Expected one continuous PDF page, got ${pageMatch[1]}`);
  }
} catch (error) {
  console.warn('pdfinfo verification unavailable or failed:', error.message);
}
