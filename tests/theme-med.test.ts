import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Medical Theme (Med): 3-way toggle and palette styles exist', () => {
  const root = path.resolve(process.cwd());

  // 1. Verify i18n Theme type and translations
  const i18nContent = fs.readFileSync(path.join(root, 'src/i18n/index.ts'), 'utf-8');
  assert.ok(i18nContent.includes("'dark' | 'light' | 'med'"), 'Theme type includes med mode');
  assert.ok(i18nContent.includes('themeToggleMed'), 'themeToggleMed translation exists in i18n');

  // 2. Verify SiteFunctionBar renders Med button with medical icon
  const functionBarContent = fs.readFileSync(path.join(root, 'src/components/layout/SiteFunctionBar.tsx'), 'utf-8');
  assert.ok(functionBarContent.includes("function-bar-theme-btn--med"), 'Med theme button exists in SiteFunctionBar');
  assert.ok(functionBarContent.includes("theme-med-text"), 'Med text label exists');
  assert.ok(functionBarContent.includes("handleThemeClick('med')"), 'Clicking med triggers med theme');

  // 3. Verify main.tsx handles med theme in state and storage
  const mainContent = fs.readFileSync(path.join(root, 'src/main.tsx'), 'utf-8');
  assert.ok(mainContent.includes("saved === 'med'"), 'main.tsx checks for saved med theme');
  assert.ok(mainContent.includes("onSelectTheme={setTheme}"), 'main.tsx passes onSelectTheme');

  // 4. Verify site.css defines [data-theme="med"] with all palette colors including pure white
  const siteCssContent = fs.readFileSync(path.join(root, 'src/site.css'), 'utf-8');
  assert.ok(siteCssContent.includes('[data-theme="med"]'), 'site.css defines [data-theme="med"]');
  assert.ok(siteCssContent.includes('--bg-primary: #FFFFFF;'), 'site.css uses pure white #FFFFFF as --bg-primary');
  assert.ok(siteCssContent.includes('#FBE7F1'), 'site.css uses #FBE7F1');
  assert.ok(siteCssContent.includes('#D7C6FF'), 'site.css uses #D7C6FF');
  assert.ok(siteCssContent.includes('#8FA9FF'), 'site.css uses #8FA9FF');
  assert.ok(siteCssContent.includes('#2D3A5E'), 'site.css uses #2D3A5E');

  // 5. Verify component stylesheets contain [data-theme="med"]
  const heroCss = fs.readFileSync(path.join(root, 'src/components/hair-hero/hair-hero.css'), 'utf-8');
  assert.ok(heroCss.includes('[data-theme="med"]'), 'hair-hero.css defines [data-theme="med"]');

  const clinicCss = fs.readFileSync(path.join(root, 'src/components/clinic-sections/clinic-sections.css'), 'utf-8');
  assert.ok(clinicCss.includes('[data-theme="med"]'), 'clinic-sections.css defines [data-theme="med"]');

  const galleryCss = fs.readFileSync(path.join(root, 'src/components/gallery/gallery.css'), 'utf-8');
  assert.ok(galleryCss.includes('[data-theme="med"]'), 'gallery.css defines [data-theme="med"]');
  assert.ok(galleryCss.includes('[data-theme="med"] .gallery-nav-btn'), 'gallery.css defines category nav buttons for med mode');
  assert.ok(galleryCss.includes('[data-theme="med"] .gallery-modal-box'), 'gallery.css defines modal box for med mode');
  assert.ok(galleryCss.includes('[data-theme="med"] .gallery-modal-backdrop'), 'gallery.css defines modal backdrop for med mode');

  const kbCss = fs.readFileSync(path.join(root, 'src/components/knowledge-base/knowledge-base.css'), 'utf-8');
  assert.ok(kbCss.includes('[data-theme="med"]'), 'knowledge-base.css defines [data-theme="med"]');

  const follicleCss = fs.readFileSync(path.join(root, 'src/components/follicle-animation/follicle.css'), 'utf-8');
  assert.ok(follicleCss.includes('[data-theme="med"]'), 'follicle.css defines [data-theme="med"]');
  assert.ok(follicleCss.includes('[data-theme="med"] .ht-section .treatments-intro h2'), 'follicle.css styles treatments intro heading for med mode');

  const articleCss = fs.readFileSync(path.join(root, 'src/components/article-page/article-page.css'), 'utf-8');
  assert.ok(articleCss.includes('[data-theme="med"] .article-main-title'), 'article-page.css styles article-main-title for med mode');
  assert.ok(articleCss.includes('[data-theme="med"] .article-rich-content'), 'article-page.css styles article-rich-content for med mode');
});

