import { useState, useMemo, useEffect, useRef } from 'react';
import type { Article } from '../knowledge-base';
import articlesDataRaw from '../../data/articles.json';
import { SiteFunctionBar } from '../layout/SiteFunctionBar';
import { MobileStickyBar } from '../layout/MobileStickyBar';
import { SiteFooter } from '../layout/SiteFooter';
import { type Language, type Theme, TRANSLATIONS } from '../../i18n';
import './blog-page.css';

const allArticles = articlesDataRaw as Article[];

export interface BlogPageProps {
  onNavigate: (path: string) => void;
  theme?: Theme;
  onToggleTheme?: () => void;
  onSelectTheme?: (theme: Theme) => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const CATEGORIES = [
  'Tümü',
  'Tedavi Yöntemleri',
  'Sıkça Sorulan Sorular',
  'Bölgesel Rehberler',
  'İyileşme ve Bakım',
  'Maliyet ve Planlama',
] as const;

const CATEGORY_LABELS: Record<Language, Record<string, string>> = {
  tr: {
    'Tümü': 'Tümü',
    'Tedavi Yöntemleri': 'Tedavi Yöntemleri',
    'Sıkça Sorulan Sorular': 'Sıkça Sorulanlar',
    'Bölgesel Rehberler': 'Bölgesel Rehberler',
    'İyileşme ve Bakım': 'İyileşme ve Bakım',
    'Maliyet ve Planlama': 'Maliyet ve Planlama',
  },
  en: {
    'Tümü': 'All',
    'Tedavi Yöntemleri': 'Techniques & Methods',
    'Sıkça Sorulan Sorular': 'FAQs',
    'Bölgesel Rehberler': 'Regional Guides',
    'İyileşme ve Bakım': 'Recovery & Aftercare',
    'Maliyet ve Planlama': 'Pricing & Planning',
  },
  ar: {
    'Tümü': 'الكل',
    'Tedavi Yöntemleri': 'تقنيات الزراعة',
    'Sıkça Sorulan Sorular': 'الأسئلة الشائعة',
    'Bölgesel Rehberler': 'أدلة المدن والمناطق',
    'İyileşme ve Bakım': 'التعافي والعناية',
    'Maliyet ve Planlama': 'التكلفة والتخطيط',
  },
  de: {
    'Tümü': 'Alle',
    'Tedavi Yöntemleri': 'Methoden & Techniken',
    'Sıkça Sorulan Sorular': 'Häufige Fragen',
    'Bölgesel Rehberler': 'Regionale Ratgeber',
    'İyileşme ve Bakım': 'Heilung & Pflege',
    'Maliyet ve Planlama': 'Kosten & Planung',
  },
};

const BLOG_I18N = {
  tr: {
    badge: 'UZMAN SAÇ RESTORASYONU VE MEDİKAL REHBER',
    title: 'Gaziantep Saç Ekimi Rehberi, Makaleler ve Bilgi Bankası',
    lead: "Saç ekimi cerrahisinde doğru bilgi en önemli adımdır. Safir FUE ve DHI yöntemlerinden operasyon sonrası şok dökülme evrelerine, greft sağlığından 2026 saç ekimi fiyatlarına kadar tüm merak edilenleri Saç Ekim Uzmanı Elif Ay'ın klinik deneyimiyle hazırlanan kapsamlı rehberlerimizde keşfedin.",
    placeholder: 'Konu, şehir veya yöntem arayın (Örn: Safir FUE, DHI, 3000 greft, Şanlıurfa, Sakal ekimi...)',
    resultsCount: (filtered: number, total: number, page: number, totalPages: number) =>
      `${filtered} makale listeleniyor (Toplam ${total} içerik) · Sayfa ${page} / ${totalPages}`,
    noArticles: 'Aradığınız kriterlere uygun makale bulunamadı',
    noArticlesDesc: 'Farklı anahtar kelimeler deneyebilir veya kategori filtresini değiştirebilirsiniz.',
    showAll: 'Tüm Makaleleri Göster',
    readBtn: 'İncele ↗︎',
    prevPage: '← Önceki',
    nextPage: 'Sonraki →︎',
    metaTitle: 'Saç Ekimi Rehberi ve Bilgi Bankası | Elif Ay Saç Ekim Merkezi Gaziantep',
    metaDesc: 'Gaziantep saç ekimi fiyatları 2026, Safir FUE, DHI Choi kalemi, kadınlarda saç ve kaş ekimi ile şok dökülme evreleri hakkında Saç Ekim Uzmanı Elif Ay tarafından hazırlanan kapsamlı medikal rehber.',
    breadcrumbsHome: 'Ana Sayfa',
    breadcrumbsBlog: 'Bilgi Bankası & Blog',
    topicChips: [
      { label: 'Safir FUE vs DHI', query: 'safir' },
      { label: 'Şok Dökülme Takvimi', query: 'şok dökülme' },
      { label: 'Kadınlarda Saç Ekimi', query: 'kadın' },
      { label: '2026 Fiyatları', query: 'fiyat' },
      { label: 'Sakal & Bıyık Ekimi', query: 'sakal' },
      { label: 'Kaş Ekimi', query: 'kaş' },
    ],
  },
  en: {
    badge: 'SPECIALIST HAIR RESTORATION & MEDICAL GUIDE',
    title: 'Hair Transplant Guide, Clinical Articles & Knowledge Base',
    lead: 'Accurate clinical insights are the cornerstone of successful hair restoration. Explore comprehensive medical guides on Sapphire FUE, DHI implanter pens, shock loss timelines, graft survival, and 2026 hair transplant pricing authored by Hair Specialist Elif Ay.',
    placeholder: 'Search topic, city or technique (e.g. Sapphire FUE, DHI, 3000 grafts, recovery...)',
    resultsCount: (filtered: number, total: number, page: number, totalPages: number) =>
      `${filtered} articles listed (${total} total) · Page ${page} of ${totalPages}`,
    noArticles: 'No articles found matching your query',
    noArticlesDesc: 'Try adjusting your keywords or switching the active category.',
    showAll: 'Show All Articles',
    readBtn: 'Read Guide ↗︎',
    prevPage: '← Previous',
    nextPage: 'Next →︎',
    metaTitle: 'Hair Restoration Guide & Knowledge Base | Elif Ay Gaziantep',
    metaDesc: 'Comprehensive clinical guide on Sapphire FUE, DHI techniques, shock loss recovery, and 2026 hair transplant costs by Hair Restoration Specialist Elif Ay in Gaziantep.',
    breadcrumbsHome: 'Home',
    breadcrumbsBlog: 'Knowledge Base & Blog',
    topicChips: [
      { label: 'Sapphire FUE vs DHI', query: 'fue' },
      { label: 'Shock Loss Timeline', query: 'shock' },
      { label: 'Hair Transplant for Women', query: 'women' },
      { label: '2026 Pricing', query: 'cost' },
      { label: 'Beard Transplant', query: 'beard' },
      { label: 'Eyebrow Design', query: 'eyebrow' },
    ],
  },
  ar: {
    badge: 'دليل استعادة الشعر التخصصي وبنك المعلومات الطبي',
    title: 'دليل زراعة الشعر، المقالات الطبية وبنك المعلومات',
    lead: 'المعلومة الطبية الدقيقة هي الخطوة الأولى نحو نتائج طبيعية تدوم مدى الحياة. استكشف أدلتنا التخصصية حول تقنيات السفير وDHI، ومراحل تساقط الصدمة، ونمو البصيلات وأسعار زراعة الشعر بإشراف الأخصائية إليف آي.',
    placeholder: 'ابحث عن موضوع أو مدينة أو تقنية (مثال: سفير، DHI، 3000 بصيلة، أسعار...)',
    resultsCount: (filtered: number, total: number, page: number, totalPages: number) =>
      `تم العثور على ${filtered} مقال (إجمالي ${total}) · صفحة ${page} من ${totalPages}`,
    noArticles: 'لم يتم العثور على مقالات مطابقة لبحثكم',
    noArticlesDesc: 'يمكنكم تجربة كلمات مفتاحية أخرى أو تغيير التصنيف.',
    showAll: 'عرض كافة المقالات',
    readBtn: 'اقرأ الدليل ↗︎',
    prevPage: '← السابق',
    nextPage: 'التالي →︎',
    metaTitle: 'دليل زراعة الشعر وبنك المعلومات الطبي | عيادة إليف آي غازي عنتاب',
    metaDesc: 'دليل طبي شامل حول زراعة الشعر بتقنيات السفير وDHI ومراحل التعافي والأسعار بإشراف الأخصائية إليف آي في غازي عنتاب.',
    breadcrumbsHome: 'الرئيسية',
    breadcrumbsBlog: 'بنك المعلومات والمدونة',
    topicChips: [
      { label: 'السفير مقابل DHI', query: 'dhi' },
      { label: 'مراحل تساقط الصدمة', query: 'صدمة' },
      { label: 'زراعة الشعر للنساء', query: 'نساء' },
      { label: 'أسعار 2026', query: 'سعر' },
      { label: 'زراعة اللحية', query: 'لحية' },
    ],
  },
  de: {
    badge: 'FACHRATGEBER FÜR HAARRESTORATION & KLINISCHE LEITFÄDEN',
    title: 'Haartransplantation Ratgeber, Fachartikel & Wissensdatenbank',
    lead: 'Fundierte medizinische Informationen sind der Schlüssel zu natürlichem und dauerhaftem Haarwuchs. Entdecken Sie umfassende Leitfäden zu Saphir FUE, DHI Choi-Methode, Schockausfall-Phasen und aktuellen Kosten, verfasst von Haarspezialistin Elif Ay.',
    placeholder: 'Thema, Stadt oder Technik suchen (z. B. Saphir FUE, DHI, 3000 Grafts, Kosten...)',
    resultsCount: (filtered: number, total: number, page: number, totalPages: number) =>
      `${filtered} Artikel gelistet (${total} gesamt) · Seite ${page} von ${totalPages}`,
    noArticles: 'Keine Artikel für Ihre Suche gefunden',
    noArticlesDesc: 'Versuchen Sie andere Suchbegriffe oder wechseln Sie die Kategorie.',
    showAll: 'Alle Artikel anzeigen',
    readBtn: 'Lesen ↗︎',
    prevPage: '← Zurück',
    nextPage: 'Weiter →︎',
    metaTitle: 'Haartransplantation Ratgeber & Wissensdatenbank | Elif Ay Gaziantep',
    metaDesc: 'Umfassender Ratgeber zu Saphir FUE, DHI, Heilungsphasen und Kosten für Haartransplantationen in der Klinik von Elif Ay.',
    breadcrumbsHome: 'Startseite',
    breadcrumbsBlog: 'Wissensdatenbank & Blog',
    topicChips: [
      { label: 'Saphir FUE vs. DHI', query: 'fue' },
      { label: 'Schockausfall-Zeitplan', query: 'schock' },
      { label: 'Haartransplantation Frauen', query: 'frauen' },
      { label: 'Preise 2026', query: 'kosten' },
      { label: 'Barttransplantation', query: 'bart' },
    ],
  },
};

const ITEMS_PER_PAGE = 12;

function getReadingTime(html: string, suffix: string = 'dk okuma'): string {
  const text = html.replace(/<[^>]*>/g, ' ');
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(wordCount / 180));
  return `${minutes} ${suffix}`;
}

function formatDate(dateStr: string, lang: Language = 'tr'): string {
  try {
    const d = new Date(dateStr);
    const localeMap: Record<Language, string> = {
      tr: 'tr-TR',
      en: 'en-US',
      ar: 'ar-SA',
      de: 'de-DE',
    };
    return d.toLocaleDateString(localeMap[lang] || 'tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '2026';
  }
}

function getSnippet(html: string, fallback: string = '', maxLen: number = 130): string {
  if (fallback) {
    return fallback.length > maxLen ? fallback.slice(0, maxLen).trim() + '...' : fallback;
  }
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

export function BlogPage({
  onNavigate,
  theme = 'dark',
  onToggleTheme,
  onSelectTheme,
  currentLang = 'tr',
  onLanguageChange,
}: BlogPageProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.tr;
  const bI18n = BLOG_I18N[currentLang] || BLOG_I18N.tr;
  const categoryLabels = CATEGORY_LABELS[currentLang] || CATEGORY_LABELS.tr;

  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const gridTopRef = useRef<HTMLDivElement>(null);

  // Dynamic SEO Tags & Schema.org JSON-LD
  useEffect(() => {
    document.title = bI18n.metaTitle;

    // Meta Description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = bI18n.metaDesc;

    // Canonical
    const canonicalUrl = 'https://elifaysacekim.com/bilgi-bankasi';
    let linkCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    // OpenGraph
    const ogTags: Record<string, string> = {
      'og:title': bI18n.metaTitle,
      'og:description': bI18n.metaDesc,
      'og:url': canonicalUrl,
      'og:type': 'website',
      'og:image': 'https://elifaysacekim.com/elif-ay-portrait.jpg',
      'twitter:card': 'summary_large_image',
      'twitter:title': bI18n.metaTitle,
      'twitter:description': bI18n.metaDesc,
      'twitter:image': 'https://elifaysacekim.com/elif-ay-portrait.jpg',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector<HTMLMetaElement>(
        `meta[property="${property}"], meta[name="${property}"]`
      );
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('twitter:')) {
          meta.name = property;
        } else {
          meta.setAttribute('property', property);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // JSON-LD Structured Data
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${canonicalUrl}#collection`,
          'url': canonicalUrl,
          'name': bI18n.title,
          'description': bI18n.metaDesc,
          'isPartOf': {
            '@type': 'WebSite',
            '@id': 'https://elifaysacekim.com/#website',
            'name': 'Elif Ay Saç Ekim Merkezi',
            'url': 'https://elifaysacekim.com/',
          },
          'publisher': {
            '@type': 'MedicalOrganization',
            'name': 'Elif Ay Saç Ekim Merkezi',
            'url': 'https://elifaysacekim.com/',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://elifaysacekim.com/elif-ay-portrait.jpg',
            },
            'medicalSpecialty': 'PlasticSurgery',
            'telephone': '+905364916040',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Gaziantep',
              'addressCountry': 'TR',
            },
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': bI18n.breadcrumbsHome,
              'item': 'https://elifaysacekim.com/',
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': bI18n.breadcrumbsBlog,
              'item': canonicalUrl,
            },
          ],
        },
      ],
    };

    let scriptTag = document.querySelector<HTMLScriptElement>('#blog-jsonld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'blog-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLdData);

    return () => {
      const tag = document.querySelector('#blog-jsonld-schema');
      if (tag) tag.remove();
    };
  }, [bI18n]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'Tümü': allArticles.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'Tümü') {
        counts[cat] = allArticles.filter((a) => a.category === cat).length;
      }
    });
    return counts;
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'Tümü' || article.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const titleMatch = article.title.toLowerCase().includes(q);
      const descMatch = article.metaDescription?.toLowerCase().includes(q);
      const keywordMatch = article.metaKeywords?.toLowerCase().includes(q);
      const contentSnippetMatch = article.contentHtml.toLowerCase().includes(q);

      return titleMatch || descMatch || keywordMatch || contentSnippetMatch;
    });
  }, [selectedCategory, searchQuery]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));

  // Current page articles
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      const topOffset = gridTopRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const readingTimeSuffix =
    currentLang === 'en'
      ? 'min read'
      : currentLang === 'ar'
      ? 'دقيقة قراءة'
      : currentLang === 'de'
      ? 'Min. Lesezeit'
      : 'dk okuma';

  return (
    <div className="blog-page-root" data-theme={theme}>
      {/* Top Function Bar */}
      <SiteFunctionBar
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSelectTheme={onSelectTheme}
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
      />

      {/* Subpage Header */}
      <header className="blog-page-header">
        <div className="blog-header-left">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="blog-brand-link"
          >
            <span className="brand-symbol" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
            </span>
            ELİF AY
          </a>
          <span className="blog-brand-badge">GAZİANTEP SAÇ EKİMİ &amp; TIP REHBERİ</span>
        </div>

        <div className="header-actions">
          <a
            className="header-icon-btn header-phone-btn"
            href="tel:+905364916040"
            aria-label="Telefonla ara: 0 536 491 60 40"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span className="header-contact-text">0 536 491 60 40</span>
          </a>

          <a
            className="header-icon-btn header-whatsapp-btn"
            href="https://wa.me/905364916040?text=Merhaba%2C%20saç%20ekimi%20rehberi%20ve%20ücretsiz%20analiz%20hakkında%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp ile Danışın"
          >
            <img
              src="/icons/whatsapp-icon.webp"
              alt="WhatsApp"
              width="18"
              height="18"
              style={{ display: 'block' }}
            />
            <span className="header-contact-text">WhatsApp</span>
          </a>

          <a
            className="header-cta"
            href="/#care"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/#care');
            }}
          >
            {t.ctaAnalysis}
          </a>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <nav className="blog-breadcrumb" aria-label="Ekmek Kırıntısı">
        <ol>
          <li>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
            >
              {bI18n.breadcrumbsHome}
            </a>{' '}
            /
          </li>
          <li aria-current="page">{bI18n.breadcrumbsBlog}</li>
        </ol>
      </nav>

      {/* Main Content */}
      <main className="blog-main-container">
        {/* Hero Banner */}
        <section className="blog-hero-section">
          <div className="blog-hero-badge">
            <span className="pulse-dot" />
            {bI18n.badge}
          </div>
          <h1 className="blog-main-title">{bI18n.title}</h1>
          <p className="blog-main-lead">{bI18n.lead}</p>

          {/* Quick Topic Chips */}
          <div className="blog-topic-chips" aria-label="Popüler Konu Başlıkları">
            {bI18n.topicChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                className="topic-chip-btn"
                onClick={() => {
                  setSearchQuery(chip.query);
                  setSelectedCategory('Tümü');
                }}
              >
                <span>#</span> {chip.label}
              </button>
            ))}
          </div>
        </section>

        {/* Filter Controls (Search + Categories) */}
        <div className="blog-controls-section" ref={gridTopRef}>
          <div className="blog-search-wrapper">
            <svg
              className="search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="blog-search-input"
              placeholder={bI18n.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={bI18n.placeholder}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Aramayı temizle"
              >
                ✕
              </button>
            )}
          </div>

          <div className="blog-categories-bar" role="tablist">
            {CATEGORIES.map((category) => {
              const count = categoryCounts[category] || 0;
              const isActive = selectedCategory === category;
              const label = categoryLabels[category] || category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`blog-category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {label} <span className="cat-count">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="blog-status-meta">
            <span>
              {bI18n.resultsCount(
                filteredArticles.length,
                allArticles.length,
                currentPage,
                totalPages
              )}
            </span>
          </div>
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="blog-articles-grid">
            {paginatedArticles.map((article) => {
              const displayTitle =
                currentLang === 'en' && article.titleEn
                  ? article.titleEn
                  : currentLang === 'ar' && article.titleAr
                  ? article.titleAr
                  : currentLang === 'de' && article.titleDe
                  ? article.titleDe
                  : article.title;

              const displayContent =
                currentLang === 'en' && article.contentHtmlEn
                  ? article.contentHtmlEn
                  : currentLang === 'ar' && article.contentHtmlAr
                  ? article.contentHtmlAr
                  : currentLang === 'de' && article.contentHtmlDe
                  ? article.contentHtmlDe
                  : article.contentHtml;

              const displayDesc =
                currentLang === 'en' && article.metaDescriptionEn
                  ? article.metaDescriptionEn
                  : currentLang === 'ar' && article.metaDescriptionAr
                  ? article.metaDescriptionAr
                  : currentLang === 'de' && article.metaDescriptionDe
                  ? article.metaDescriptionDe
                  : article.metaDescription;

              const cover = article.coverImage || '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
              const readingTime = getReadingTime(displayContent, readingTimeSuffix);
              const dateText = formatDate(article.publishedAt, currentLang);
              const snippet = getSnippet(displayContent, displayDesc);

              return (
                <a
                  key={article.id}
                  href={`/bilgi-bankasi/${article.slug}`}
                  className="blog-card"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/bilgi-bankasi/${article.slug}`);
                  }}
                >
                  <div className="blog-card-thumb">
                    <img
                      src={cover}
                      alt={article.coverImageAlt || displayTitle}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
                      }}
                    />
                    <span className="blog-card-tag">{article.category}</span>
                  </div>

                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>{dateText}</span>
                      <span>•</span>
                      <span>{readingTime}</span>
                    </div>

                    <h2 className="blog-card-title">{displayTitle}</h2>
                    <p className="blog-card-snippet">{snippet}</p>

                    <div className="blog-card-footer">
                      <div className="blog-author-info">
                        <img
                          src="/elif-ay-portrait.jpg"
                          alt="Elif Ay"
                          className="author-mini-avatar"
                        />
                        <span>Elif Ay</span>
                      </div>
                      <span className="blog-read-btn">{bI18n.readBtn}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="blog-no-results">
            <h3>{bI18n.noArticles}</h3>
            <p>{bI18n.noArticlesDesc}</p>
            <button
              type="button"
              className="blog-category-pill active"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tümü');
              }}
            >
              {bI18n.showAll}
            </button>
          </div>
        )}

        {/* Full Pagination Controls */}
        {totalPages > 1 && (
          <nav
            className="blog-pagination"
            aria-label={
              currentLang === 'en'
                ? 'Blog Pagination'
                : currentLang === 'ar'
                ? 'تنقل صفحات المقالات'
                : currentLang === 'de'
                ? 'Blog-Seitennavigation'
                : 'Sayfa Numaraları'
            }
          >
            <button
              type="button"
              className="page-btn page-nav"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label={bI18n.prevPage}
            >
              {bI18n.prevPage}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 2
                );
              })
              .map((page, index, array) => {
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                return (
                  <span key={page} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {showEllipsis && <span className="page-ellipsis">…</span>}
                    <button
                      type="button"
                      className={`page-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  </span>
                );
              })}

            <button
              type="button"
              className="page-btn page-nav"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label={bI18n.nextPage}
            >
              {bI18n.nextPage}
            </button>
          </nav>
        )}
      </main>

      {/* Footer & Mobile Sticky Bar */}
      <SiteFooter currentLang={currentLang} onNavigate={onNavigate} />
      <MobileStickyBar currentLang={currentLang} />
    </div>
  );
}

export default BlogPage;
