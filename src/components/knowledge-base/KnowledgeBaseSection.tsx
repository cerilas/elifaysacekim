import { useState, useMemo, useEffect, useRef } from 'react';
import articlesDataRaw from '../../data/articles.json';
import { type Language } from '../../i18n';
import './knowledge-base.css';

export interface Article {
  id: string;
  slug: string;
  category: string;
  coverImage?: string;
  coverImageAlt?: string;
  coverImageAltEn?: string;
  coverImageAltAr?: string;
  coverImageAltDe?: string;
  title: string;
  titleEn?: string;
  titleAr?: string;
  titleDe?: string;
  contentHtml: string;
  contentHtmlEn?: string;
  contentHtmlAr?: string;
  contentHtmlDe?: string;
  author: string;
  publishedAt: string;
  metaTitle?: string;
  metaTitleEn?: string;
  metaTitleAr?: string;
  metaTitleDe?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  metaDescriptionAr?: string;
  metaDescriptionDe?: string;
  metaKeywords?: string;
  metaKeywordsEn?: string;
  metaKeywordsAr?: string;
  metaKeywordsDe?: string;
}

const articlesData = articlesDataRaw as Article[];

const CATEGORIES = [
  'Tümü',
  'Tedavi Yöntemleri',
  'Sıkça Sorulan Sorular',
  'Bölgesel Rehberler',
  'İyileşme ve Bakım',
  'Maliyet ve Planlama'
] as const;

export const CATEGORY_LABELS: Record<Language, Record<string, string>> = {
  tr: {
    'Tümü': 'Tümü',
    'Tedavi Yöntemleri': 'Tedavi Yöntemleri',
    'Sıkça Sorulan Sorular': 'Sıkça Sorulan Sorular',
    'Bölgesel Rehberler': 'Bölgesel Rehberler',
    'İyileşme ve Bakım': 'İyileşme ve Bakım',
    'Maliyet ve Planlama': 'Maliyet ve Planlama',
  },
  en: {
    'Tümü': 'All',
    'Tedavi Yöntemleri': 'Treatment Methods',
    'Sıkça Sorulan Sorular': 'FAQ',
    'Bölgesel Rehberler': 'Regional Guides',
    'İyileşme ve Bakım': 'Recovery & Care',
    'Maliyet ve Planlama': 'Cost & Planning',
  },
  ar: {
    'Tümü': 'الكل',
    'Tedavi Yöntemleri': 'طرق العلاج',
    'Sıkça Sorulan Sorular': 'الأسئلة الشائعة',
    'Bölgesel Rehberler': 'أدلة المحافظات',
    'İyileşme ve Bakım': 'التعافي والرعاية',
    'Maliyet ve Planlama': 'التكلفة والتخطيط',
  },
  de: {
    'Tümü': 'Alle',
    'Tedavi Yöntemleri': 'Behandlungsmethoden',
    'Sıkça Sorulan Sorular': 'Häufige Fragen',
    'Bölgesel Rehberler': 'Regionale Ratgeber',
    'İyileşme ve Bakım': 'Heilung & Pflege',
    'Maliyet ve Planlama': 'Kosten & Planung',
  },
};

export const KB_I18N = {
  tr: {
    badge: 'KLİNİK REHBERİ & GAZİANTEP SAÇ EKİMİ BİLGİ BANKASI',
    stats: (n: number) => `TOPLAM ${n} BİLİMSEL VE UZMAN İÇERİK`,
    title: <>Gaziantep Saç Ekimi Rehberi &amp;<br /><em>Uzman Görüşleri.</em></>,
    lead: "Gaziantep saç ekimi fiyatları 2026, Safir FUE ve DHI yöntemleri, köselik tedavisi sakal ekimi, kadınlarda kaş ekimi ve şok dökülme evreleri; Saç Ekim Koordinatörü ve Danışmanı Elif Ay'ın deneyimiyle aydınlanıyor.",
    placeholder: 'Konu, şehir veya yöntem arayın (Örn: Gaziantep saç ekimi fiyatları, Şanlıurfa, DHI, Sakal ekimi, 3000 greft...)',
    resultsCount: (n: number) => `${n} makale listeleniyor`,
    noArticles: 'Aradığınız kriterlere uygun makale bulunamadı',
    noArticlesDesc: 'Farklı anahtar kelimeler deneyebilir veya kategori filtresini değiştirebilirsiniz.',
    showAll: 'Tüm Makaleleri Göster',
    viewAll: 'Tümünü Göster',
    viewAllCount: (n: number) => `(${n} Yazı)`,
  },
  en: {
    badge: 'CLINICAL GUIDE & RESTORATION KNOWLEDGE BASE',
    stats: (n: number) => `${n} SCIENTIFIC & CLINICAL ARTICLES`,
    title: <>Hair Restoration Guides &amp;<br /><em>Expert Clinical Insights.</em></>,
    lead: 'Hair transplant costs, Sapphire FUE & DHI techniques, beard restoration, eyebrow design for women, and recovery phases — illuminated by Specialist Elif Ay’s experience.',
    placeholder: 'Search topic, city or method (e.g. hair transplant prices, DHI, beard transplant, 3000 grafts...)',
    resultsCount: (n: number) => `${n} articles listed`,
    noArticles: 'No articles found matching your criteria',
    noArticlesDesc: 'Try different keywords or switch your category filter.',
    showAll: 'Show All Articles',
    viewAll: 'View All Articles & Guides',
    viewAllCount: (n: number) => `(${n} Articles)`,
  },
  ar: {
    badge: 'الدليل السريري وبنك معلومات زراعة الشعر',
    stats: (n: number) => `${n} مقال علمي وطبي متخصص`,
    title: <>أدلة زراعة الشعر &amp;<br /><em>ورؤى طبية تخصصية.</em></>,
    lead: 'تكاليف زراعة الشعر، تقنيات السفير وDHI، زراعة اللحية، وتصميم الحواجب للنساء، ومراحل تساقط الصدمة والتعافي؛ بخبرة الأخصائية إليف آي.',
    placeholder: 'ابحث عن موضوع أو مدينة أو تقنية (مثال: أسعار زراعة الشعر، DHI، زراعة اللحية، 3000 بصيلة...)',
    resultsCount: (n: number) => `${n} مقال معروض`,
    noArticles: 'لم يتم العثور على مقالات مطابقة لبحثكم',
    noArticlesDesc: 'يمكنكم تجربة كلمات مفتاحية أخرى أو تغيير تصنيف البحث.',
    showAll: 'عرض كافة المقالات',
    viewAll: 'عرض جميع المقالات والأدلة',
    viewAllCount: (n: number) => `(${n} مقال)`,
  },
  de: {
    badge: 'KLINISCHER RATGEBER & WISSENSDATENBANK',
    stats: (n: number) => `${n} WISSENSCHAFTLICHE & FACHÄRZTLICHE ARTIKEL`,
    title: <>Haartransplantation Ratgeber &amp;<br /><em>Expertenberichte.</em></>,
    lead: 'Haartransplantation Preise, Saphir FUE & DHI Methoden, Barttransplantation, Augenbrauentransplantation für Frauen und Heilungsphasen — fundiert erklärt von Spezialistin Elif Ay.',
    placeholder: 'Thema, Stadt oder Methode suchen (z. B. Haartransplantation Kosten, DHI, Barttransplantation...)',
    resultsCount: (n: number) => `${n} Artikel gelistet`,
    noArticles: 'Keine passenden Artikel gefunden',
    noArticlesDesc: 'Versuchen Sie andere Suchbegriffe oder wechseln Sie die Kategorie.',
    showAll: 'Alle Artikel anzeigen',
    viewAll: 'Alle Artikel & Leitfäden ansehen',
    viewAllCount: (n: number) => `(${n} Artikel)`,
  },
};

const ITEMS_PER_PAGE = 6;

function getReadingTime(html: string): string {
  const text = html.replace(/<[^>]*>/g, ' ');
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(wordCount / 180));
  return `${minutes} dk okuma`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return '2026';
  }
}

function getSnippet(html: string, fallbackDesc?: string): string {
  if (fallbackDesc && fallbackDesc.length > 20) {
    return fallbackDesc.length > 150 ? fallbackDesc.substring(0, 147) + '...' : fallbackDesc;
  }
  const clean = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.length > 150 ? clean.substring(0, 147) + '...' : clean;
}

export function openArticleBySlug(slug: string) {
  window.dispatchEvent(new CustomEvent('open-article', { detail: { slug } }));
  const kb = document.getElementById('knowledge-base');
  if (kb) {
    const topOffset = kb.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: topOffset, behavior: 'smooth' });
  }
}

export interface KnowledgeBaseSectionProps {
  onNavigate?: (path: string) => void;
  currentLang?: Language;
}

export function KnowledgeBaseSection({ onNavigate, currentLang = 'tr' }: KnowledgeBaseSectionProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const modalPanelRef = useRef<HTMLDivElement>(null);

  const openArticle = (article: Article) => {
    if (onNavigate) {
      onNavigate(`/bilgi-bankasi/${article.slug}`);
      return;
    }
    setSelectedArticle(article);
    if (window.location.hash !== `#article-${article.slug}`) {
      window.history.pushState(null, '', `#article-${article.slug}`);
    }
  };

  const closeModal = () => {
    setSelectedArticle(null);
    if (window.location.hash.startsWith('#article-')) {
      window.history.replaceState(null, '', '#knowledge-base');
    }
  };

  // Listen to custom event 'open-article'
  useEffect(() => {
    const handleOpenArticle = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug: string }>;
      if (customEvent.detail?.slug) {
        const found = articlesData.find(a => a.slug === customEvent.detail.slug);
        if (found) {
          if (onNavigate) {
            onNavigate(`/bilgi-bankasi/${found.slug}`);
            return;
          }
          setSelectedArticle(found);
          if (window.location.hash !== `#article-${found.slug}`) {
            window.history.pushState(null, '', `#article-${found.slug}`);
          }
          if (sectionRef.current) {
            const topOffset = sectionRef.current.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: topOffset, behavior: 'smooth' });
          }
        }
      }
    };
    window.addEventListener('open-article', handleOpenArticle);
    return () => window.removeEventListener('open-article', handleOpenArticle);
  }, [onNavigate]);

  // Check URL hash on initial mount and hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      let targetSlug = '';
      if (hash.startsWith('#article-')) {
        targetSlug = hash.replace('#article-', '').trim();
      } else if (hash.includes('article=')) {
        const match = hash.match(/article=([^&]+)/);
        if (match && match[1]) targetSlug = match[1];
      }

      if (targetSlug) {
        const found = articlesData.find(a => a.slug === targetSlug);
        if (found) {
          setSelectedArticle(found);
          if (sectionRef.current) {
            const topOffset = sectionRef.current.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: topOffset, behavior: 'smooth' });
          }
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'Tümü': articlesData.length };
    CATEGORIES.forEach(cat => {
      if (cat !== 'Tümü') {
        counts[cat] = articlesData.filter(a => a.category === cat).length;
      }
    });
    return counts;
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return articlesData.filter(article => {
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

  // Homepage articles: first 6 items of filtered results
  const paginatedArticles = useMemo(() => {
    return filteredArticles.slice(0, ITEMS_PER_PAGE);
  }, [filteredArticles]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedArticle) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);


  const kbI18n = KB_I18N[currentLang] || KB_I18N.tr;
  const categoryLabels = CATEGORY_LABELS[currentLang] || CATEGORY_LABELS.tr;

  return (
    <section id="knowledge-base" className="knowledge-section" ref={sectionRef}>
      <div className="knowledge-container">
        {/* Intro */}
        <div className="knowledge-intro">
          <div className="knowledge-topline">
            <span className="knowledge-badge">
              <span className="pulse-dot" />
              {kbI18n.badge}
            </span>
            <span className="knowledge-stats-tag">
              {kbI18n.stats(articlesData.length)}
            </span>
          </div>

          <div className="knowledge-header-grid">
            <div className="knowledge-title">
              <h2>{kbI18n.title}</h2>
            </div>
            <div>
              <p className="knowledge-lead">{kbI18n.lead}</p>
            </div>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="knowledge-controls">
          <div className="knowledge-search-wrapper">
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
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="knowledge-search-input"
              placeholder={kbI18n.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={kbI18n.placeholder}
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

          <div className="knowledge-categories" role="tablist">
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
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {label} ({count})
                </button>
              );
            })}
            <span className="results-count">
              {kbI18n.resultsCount(filteredArticles.length)}
            </span>
          </div>
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="articles-grid">
            {paginatedArticles.map((article) => {
              const displayTitle = (currentLang === 'en' && article.titleEn)
                ? article.titleEn
                : (currentLang === 'ar' && article.titleAr)
                ? article.titleAr
                : (currentLang === 'de' && article.titleDe)
                ? article.titleDe
                : article.title;

              const displayContent = (currentLang === 'en' && article.contentHtmlEn)
                ? article.contentHtmlEn
                : (currentLang === 'ar' && article.contentHtmlAr)
                ? article.contentHtmlAr
                : (currentLang === 'de' && article.contentHtmlDe)
                ? article.contentHtmlDe
                : article.contentHtml;

              const displayDesc = (currentLang === 'en' && article.metaDescriptionEn)
                ? article.metaDescriptionEn
                : (currentLang === 'ar' && article.metaDescriptionAr)
                ? article.metaDescriptionAr
                : (currentLang === 'de' && article.metaDescriptionDe)
                ? article.metaDescriptionDe
                : article.metaDescription;

              const cover = article.coverImage || '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
              const readingTime = getReadingTime(displayContent);
              const dateText = formatDate(article.publishedAt);
              const snippet = getSnippet(displayContent, displayDesc);

              return (
                <a
                  key={article.id}
                  href={`/bilgi-bankasi/${article.slug}`}
                  className="article-card"
                  onClick={(e) => {
                    e.preventDefault();
                    openArticle(article);
                  }}
                >
                  <div className="article-card-thumb">
                    <img
                      src={cover}
                      alt={article.coverImageAlt || displayTitle}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
                      }}
                    />
                    <span className="article-card-tag">{article.category}</span>
                  </div>

                  <div className="article-card-body">
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#8c7e6b', marginBottom: '10px' }}>
                      <span>{dateText}</span>
                      <span>•</span>
                      <span>{readingTime}</span>
                    </div>

                    <h3 className="article-card-title">{displayTitle}</h3>
                    <p className="article-card-snippet">{snippet}</p>

                    <div className="article-card-footer">
                      <div className="article-author-info">
                        <img
                          src="/elif-ay-portrait.jpg"
                          alt="Elif Ay"
                          className="author-mini-avatar"
                        />
                        <span>Elif Ay</span>
                      </div>
                      <span className="article-read-btn">
                        {currentLang === 'en' ? 'Read ↗︎' : currentLang === 'ar' ? 'اقرأ ↗︎' : currentLang === 'de' ? 'Lesen ↗︎' : 'İncele ↗︎'}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="no-articles-found">
            <h3>{kbI18n.noArticles}</h3>
            <p style={{ margin: '10px 0 20px', fontSize: '13px', color: '#7a6f5f' }}>
              {kbI18n.noArticlesDesc}
            </p>
            <button
              type="button"
              className="category-pill active"
              style={{ display: 'inline-block' }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tümü');
              }}
            >
              {kbI18n.showAll}
            </button>
          </div>
        )}

        {/* View All Button */}
        <div className="knowledge-view-all">
          <a
            href="/bilgi-bankasi"
            className="btn-view-all-articles"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate('/bilgi-bankasi');
              } else {
                window.location.href = '/bilgi-bankasi';
              }
            }}
          >
            <span className="btn-view-all-text">{kbI18n.viewAll}</span>
            <span className="view-all-count">{kbI18n.viewAllCount(articlesData.length)}</span>
            <span className="view-all-arrow" aria-hidden="true">↗︎</span>
          </a>
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div
          className="article-modal-backdrop"
          onClick={() => closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-article-title"
        >
          <div
            className="article-modal-panel"
            onClick={(e) => e.stopPropagation()}
            ref={modalPanelRef}
          >
            {/* Topbar */}
            <div className="article-modal-topbar">
              <button
                type="button"
                className="modal-back-btn"
                onClick={() => closeModal()}
              >
                ← Bilgi Bankasına Dön
              </button>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => closeModal()}
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="article-modal-content">
              <div className="article-modal-header">
                <span className="article-modal-category">
                  {selectedArticle.category}
                </span>
                <h1 id="modal-article-title" className="article-modal-title">
                  {selectedArticle.title}
                </h1>
                <div className="article-modal-meta">
                  <div className="author-badge">
                    <img src="/elif-ay-portrait.jpg" alt="Elif Ay" />
                    <span>Saç Ekim Koordinatörü ve Danışmanı Elif Ay</span>
                  </div>
                  <span>•</span>
                  <span>{getReadingTime(selectedArticle.contentHtml)}</span>
                  <span>•</span>
                  <span>{formatDate(selectedArticle.publishedAt)}</span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="article-modal-cover">
                <img
                  src={selectedArticle.coverImage || '/sac-ekimi-bilgi-bankasi-gorsel.jpg'}
                  alt={selectedArticle.coverImageAlt || selectedArticle.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
                  }}
                />
              </div>

              {/* HTML Body */}
              <div
                className="article-rich-body"
                dangerouslySetInnerHTML={{ __html: selectedArticle.contentHtml }}
              />

              {/* CTA Box */}
              <div className="article-modal-cta">
                <h3>Kişiselleştirilmiş Saç Analizi Almak İster Misiniz?</h3>
                <p>
                  Saç Ekim Koordinatörü ve Danışmanı Elif Ay ile doğrudan ön görüşme yapın. Greft ihtiyacınızı ve size özel 
                  doğal saç çizgisi planlamanızı birlikte değerlendirelim.
                </p>
                <div className="modal-cta-actions">
                  <a
                    href="https://wa.me/905364916040?text=Merhaba%2C%20saç%20ekimi%20hakkında%20bilgi%20ve%20ücretsiz%20analiz%20almak%20istiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-cta-primary"
                  >
                    WhatsApp ile Danışın ↗︎
                  </a>
                  <a
                    href="#care"
                    onClick={() => closeModal()}
                    className="modal-cta-primary"
                    style={{ background: 'transparent', border: '1px solid rgba(216, 187, 145, 0.3)', color: '#eee7db' }}
                  >
                    Felsefemizi İnceleyin
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
