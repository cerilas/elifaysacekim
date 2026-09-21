import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getChapters } from '../src/components/follicle-animation/story';
import { type Language } from '../src/i18n';
import { FOOTER_I18N, getFooterFaqLinks, getFooterRegionLinks } from '../src/components/layout/footerLinks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const ALL_LANGUAGES: Language[] = ['tr', 'en', 'ar', 'de'];

test('Home i18n: FollicleSection story chapters exist for all 4 languages', () => {
  for (const lang of ALL_LANGUAGES) {
    const chapters = getChapters(lang);
    assert.ok(Array.isArray(chapters), `getChapters(${lang}) must return an array`);
    assert.equal(chapters.length, 7, `getChapters(${lang}) must have 7 chapters`);
    for (const c of chapters) {
      assert.ok(c.label, `Chapter in ${lang} must have label`);
      assert.ok(c.title, `Chapter in ${lang} must have title`);
      assert.ok(c.subtitle, `Chapter in ${lang} must have subtitle`);
    }
  }
});

test('Home i18n: main.tsx, HairHero, SpecialistSection, Gallery, and KB include full 4-language support', () => {
  const mainPath = path.join(ROOT_DIR, 'src/main.tsx');
  const mainContent = fs.readFileSync(mainPath, 'utf8');

  // Verify main.tsx passes currentLang to components
  assert.ok(mainContent.includes('HairTransplantHero header={headerContent} currentLang={lang}'), 'HairTransplantHero receives currentLang');
  assert.ok(mainContent.includes('SpecialistSection portraitSrc="/elif-ay-portrait.jpg" currentLang={lang}'), 'SpecialistSection receives currentLang');
  assert.ok(mainContent.includes('TreatmentsSection currentLang={lang}'), 'TreatmentsSection receives currentLang');
  assert.ok(mainContent.includes('ElifAyGallerySection currentLang={lang}'), 'ElifAyGallerySection receives currentLang');
  assert.ok(mainContent.includes('KnowledgeBaseSection onNavigate={navigateTo} currentLang={lang}'), 'KnowledgeBaseSection receives currentLang');
  assert.ok(mainContent.includes('<MobileStickyBar currentLang={lang} />'), 'MobileStickyBar receives currentLang');

  // Verify HairHero has HERO_I18N for all 4 languages
  const heroPath = path.join(ROOT_DIR, 'src/components/hair-hero/HairHero.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf8');
  for (const lang of ALL_LANGUAGES) {
    assert.ok(heroContent.includes(`${lang}: {`), `HairHero must have entries for ${lang}`);
  }

  // Verify SpecialistSection has SPECIALIST_I18N for all 4 languages
  const clinicPath = path.join(ROOT_DIR, 'src/components/clinic-sections/ClinicSections.tsx');
  const clinicContent = fs.readFileSync(clinicPath, 'utf8');
  for (const lang of ALL_LANGUAGES) {
    assert.ok(clinicContent.includes(`${lang}: {`), `ClinicSections must have entries for ${lang}`);
  }

  // Verify Gallery has GALLERY_SLIDES_I18N for all 4 languages
  const galleryPath = path.join(ROOT_DIR, 'src/components/gallery/ElifAyGallerySection.tsx');
  const galleryContent = fs.readFileSync(galleryPath, 'utf8');
  for (const lang of ALL_LANGUAGES) {
    assert.ok(galleryContent.includes(`${lang}: [`), `Gallery must have entries for ${lang}`);
  }

  // Verify KnowledgeBaseSection has CATEGORY_LABELS and KB_I18N
  const kbPath = path.join(ROOT_DIR, 'src/components/knowledge-base/KnowledgeBaseSection.tsx');
  const kbContent = fs.readFileSync(kbPath, 'utf8');
  for (const lang of ALL_LANGUAGES) {
    assert.ok(kbContent.includes(`${lang}: {`), `KnowledgeBaseSection must have entries for ${lang}`);
  }
});

test('Footer i18n: Quick links, treatments, contact, FAQs, and regions are localized across all 4 languages', () => {
  for (const lang of ALL_LANGUAGES) {
    const f = FOOTER_I18N[lang];
    assert.ok(f, `FOOTER_I18N must have entry for ${lang}`);
    assert.ok(f.quickLinksTitle, `quickLinksTitle must exist for ${lang}`);
    assert.ok(f.treatmentsTitle, `treatmentsTitle must exist for ${lang}`);
    assert.ok(f.contactTitle, `contactTitle must exist for ${lang}`);
    assert.ok(f.faqTitle, `faqTitle must exist for ${lang}`);
    assert.ok(f.regionsTitle, `regionsTitle must exist for ${lang}`);
    assert.ok(f.developedBy, `developedBy must exist for ${lang}`);
    assert.ok(f.navPhilosophy, `navPhilosophy must exist for ${lang}`);
    assert.ok(f.navSpecialist, `navSpecialist must exist for ${lang}`);
    assert.ok(f.navTreatments, `navTreatments must exist for ${lang}`);
    assert.ok(f.navGallery, `navGallery must exist for ${lang}`);
    assert.ok(f.navKnowledge, `navKnowledge must exist for ${lang}`);
    assert.ok(f.navContact, `navContact must exist for ${lang}`);

    // Verify quickLinksTitle translations are distinct per language
    if (lang === 'tr') {
      assert.equal(f.quickLinksTitle, 'HIZLI BAĞLANTILAR');
      assert.equal(f.developedBy, 'Cerilas tarafından geliştirildi');
    }
    if (lang === 'en') assert.equal(f.quickLinksTitle, 'QUICK LINKS');
    if (lang === 'ar') assert.equal(f.quickLinksTitle, 'روابط سريعة');
    if (lang === 'de') assert.equal(f.quickLinksTitle, 'SCHNELLZUGRIFF');

    // Verify FAQ links are translated
    const faqs = getFooterFaqLinks(lang);
    assert.ok(faqs.length >= 20, `faqs must have at least 20 items for ${lang}`);
    for (const faq of faqs) {
      assert.ok(faq.label && faq.label.length > 5, `faq label must be populated for ${faq.slug} in ${lang}`);
    }

    // Verify Regional links are translated
    const regions = getFooterRegionLinks(lang);
    assert.ok(regions.length >= 25, `regions must have at least 25 items for ${lang}`);
    for (const reg of regions) {
      assert.ok(reg.label && reg.label.length > 5, `region label must be populated for ${reg.slug} in ${lang}`);
    }
  }

  // Verify SiteFooter includes Cerilas link
  const footerPath = path.join(ROOT_DIR, 'src/components/layout/SiteFooter.tsx');
  const footerContent = fs.readFileSync(footerPath, 'utf8');
  assert.ok(footerContent.includes('href="https://www.cerilas.com"'), 'SiteFooter must link to https://www.cerilas.com');
  assert.ok(footerContent.includes('footer-cerilas-link'), 'SiteFooter must have footer-cerilas-link class');

  // Verify ArticlePage and TreatmentPage use SiteFooter
  const articlePath = path.join(ROOT_DIR, 'src/components/article-page/ArticlePage.tsx');
  const articleContent = fs.readFileSync(articlePath, 'utf8');
  assert.ok(articleContent.includes('<SiteFooter'), 'ArticlePage must render SiteFooter');

  const treatmentPath = path.join(ROOT_DIR, 'src/components/treatment-page/TreatmentPage.tsx');
  const treatmentContent = fs.readFileSync(treatmentPath, 'utf8');
  assert.ok(treatmentContent.includes('<SiteFooter'), 'TreatmentPage must render SiteFooter');
});
