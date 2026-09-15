import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

test('SEO Checklist Item 1: Language Structure & i18n Configuration', async (t) => {
  const i18nPath = path.join(ROOT_DIR, 'src/i18n/index.ts');
  assert.ok(fs.existsSync(i18nPath), 'i18n module must exist');
  const i18nContent = fs.readFileSync(i18nPath, 'utf8');

  // Must support tr, en, ar, de
  assert.ok(i18nContent.includes("'tr'"), 'Must support Turkish');
  assert.ok(i18nContent.includes("'en'"), 'Must support English');
  assert.ok(i18nContent.includes("'ar'"), 'Must support Arabic');
  assert.ok(i18nContent.includes("'de'"), 'Must support German');
  assert.ok(i18nContent.includes("dir: 'rtl'"), 'Arabic must support RTL layout');

  // Reciprocal hreflangs in index.html
  const indexPath = path.join(ROOT_DIR, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  assert.ok(indexContent.includes('hreflang="tr"'), 'index.html must have tr hreflang');
  assert.ok(indexContent.includes('hreflang="en"'), 'index.html must have en hreflang');
  assert.ok(indexContent.includes('hreflang="ar"'), 'index.html must have ar hreflang');
  assert.ok(indexContent.includes('hreflang="de"'), 'index.html must have de hreflang');
  assert.ok(indexContent.includes('hreflang="x-default"'), 'index.html must have x-default hreflang');
});

test('SEO Checklist Item 2: Dedicated Treatment Pages Exist & Structured', async (t) => {
  const treatmentsPath = path.join(ROOT_DIR, 'src/data/treatments.json');
  assert.ok(fs.existsSync(treatmentsPath), 'treatments.json must exist');
  const treatments = JSON.parse(fs.readFileSync(treatmentsPath, 'utf8'));

  const expectedSlugs = [
    'sac-ekimi',
    'kas-ekimi',
    'sakal-ekimi',
    'safir-fue-sac-ekimi',
    'dhi-sac-ekimi',
  ];

  for (const slug of expectedSlugs) {
    const item = treatments.find((t: any) => t.slug === slug);
    assert.ok(item, `Treatment ${slug} must be defined in treatments.json`);
    assert.ok(item.title, `Treatment ${slug} must have a title`);
    assert.ok(item.metaDescription, `Treatment ${slug} must have a metaDescription`);
    assert.ok(Array.isArray(item.steps) && item.steps.length > 0, `Treatment ${slug} must have steps`);
    assert.ok(Array.isArray(item.faq) && item.faq.length > 0, `Treatment ${slug} must have FAQs`);

    // Check SSG output
    const ssgFile = path.join(DIST_DIR, 'tedaviler', slug, 'index.html');
    assert.ok(fs.existsSync(ssgFile), `SSG page dist/tedaviler/${slug}/index.html must exist`);
    const ssgHtml = fs.readFileSync(ssgFile, 'utf8');
    assert.ok(ssgHtml.includes('MedicalProcedure'), `SSG page must have MedicalProcedure schema`);
    assert.ok(ssgHtml.includes('FAQPage'), `SSG page must have FAQPage schema`);
    assert.ok(ssgHtml.includes('BreadcrumbList'), `SSG page must have BreadcrumbList schema`);
    assert.ok(ssgHtml.includes('hreflang="tr"'), `SSG page must have reciprocal hreflang tr`);
  }
});

test('SEO Checklist Item 3: Gaziantep Central Location & Regional Honesty', async (t) => {
  // Index HTML schema location
  const indexPath = path.join(ROOT_DIR, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  assert.ok(indexContent.includes('"addressLocality": "Gaziantep"'), 'Schema must specify Gaziantep addressLocality');
  assert.ok(indexContent.includes('"addressRegion": "Gaziantep"'), 'Schema must specify Gaziantep addressRegion');
  assert.ok(indexContent.includes('Elif Ay Saç Ekim Merkezi'), 'Must use truthful business name without spam stuffing');

  // Regional article disclosure
  const regionalArticlePath = path.join(DIST_DIR, 'bilgi-bankasi', 'adana-sac-ekimi', 'index.html');
  assert.ok(fs.existsSync(regionalArticlePath), 'Adana article must exist in dist');
  const regionalHtml = fs.readFileSync(regionalArticlePath, 'utf8');
  assert.ok(
    regionalHtml.includes('Gaziantep Merkez Klinik &amp; Çevre İller Bilgilendirmesi') ||
    regionalHtml.includes('Gaziantep Merkez Klinik & Çevre İller Bilgilendirmesi'),
    'Regional articles must contain honest Gaziantep central clinic disclosure box'
  );
});

test('SEO Checklist Item 4: Technical SEO, Sitemap & Robots.txt', async (t) => {
  const sitemapDist = path.join(DIST_DIR, 'sitemap.xml');
  assert.ok(fs.existsSync(sitemapDist), 'dist/sitemap.xml must exist');
  const sitemapXml = fs.readFileSync(sitemapDist, 'utf8');
  assert.ok(sitemapXml.includes('/tedaviler/sac-ekimi'), 'Sitemap must include sac-ekimi treatment');
  assert.ok(sitemapXml.includes('/tedaviler/kas-ekimi'), 'Sitemap must include kas-ekimi treatment');
  assert.ok(sitemapXml.includes('/tedaviler/sakal-ekimi'), 'Sitemap must include sakal-ekimi treatment');
  assert.ok(sitemapXml.includes('/bilgi-bankasi/'), 'Sitemap must include knowledge base articles');

  const robotsDist = path.join(DIST_DIR, 'robots.txt');
  assert.ok(fs.existsSync(robotsDist), 'dist/robots.txt must exist');
  const robotsTxt = fs.readFileSync(robotsDist, 'utf8');
  assert.ok(robotsTxt.includes('Sitemap: https://elifaysacekim.com/sitemap.xml'), 'Robots.txt must link to sitemap.xml');
});

test('Top Function Bar: Ultra-thin utility bar hosts language switcher and theme toggle', async (t) => {
  const functionBarPath = path.join(ROOT_DIR, 'src/components/layout/SiteFunctionBar.tsx');
  assert.ok(fs.existsSync(functionBarPath), 'SiteFunctionBar.tsx must exist');
  const content = fs.readFileSync(functionBarPath, 'utf8');
  assert.ok(content.includes('LanguageSwitcher'), 'Function bar must contain LanguageSwitcher');
  assert.ok(content.includes('onToggleTheme'), 'Function bar must contain theme toggle button');
  assert.ok(content.includes('Gaziantep Merkez Klinik'), 'Function bar must display clinic location');
});

