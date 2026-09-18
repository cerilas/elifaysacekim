import { useEffect, useMemo } from 'react';
import type { Article } from '../knowledge-base';
import articlesDataRaw from '../../data/articles.json';
import { SiteFunctionBar } from '../layout/SiteFunctionBar';
import { MobileStickyBar } from '../layout/MobileStickyBar';
import { SiteFooter } from '../layout/SiteFooter';
import { type Language, type Theme, TRANSLATIONS } from '../../i18n';
import './article-page.css';

const allArticles = articlesDataRaw as Article[];

interface ArticlePageProps {
  article: Article;
  onNavigate: (path: string) => void;
  theme?: Theme;
  onToggleTheme?: () => void;
  onSelectTheme?: (theme: Theme) => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

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
      year: 'numeric'
    });
  } catch {
    return '2026';
  }
}

export function ArticlePage({
  article,
  onNavigate,
  theme = 'dark',
  onToggleTheme,
  onSelectTheme,
  currentLang = 'tr',
  onLanguageChange,
}: ArticlePageProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.tr;
  const isRegionalArticle = article.category === 'Bölgesel Rehber' || article.slug.includes('-sac-ekimi');

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

  const displayMetaTitle = (currentLang === 'en' && article.metaTitleEn)
    ? article.metaTitleEn
    : (currentLang === 'ar' && article.metaTitleAr)
    ? article.metaTitleAr
    : (currentLang === 'de' && article.metaTitleDe)
    ? article.metaTitleDe
    : (article.metaTitle || displayTitle);

  const displayMetaDescription = (currentLang === 'en' && article.metaDescriptionEn)
    ? article.metaDescriptionEn
    : (currentLang === 'ar' && article.metaDescriptionAr)
    ? article.metaDescriptionAr
    : (currentLang === 'de' && article.metaDescriptionDe)
    ? article.metaDescriptionDe
    : (article.metaDescription || displayContent.replace(/<[^>]*>/g, ' ').slice(0, 160).trim());

  // Update document title, meta tags and canonical link dynamically for SEO
  useEffect(() => {
    const pageTitle = `${displayMetaTitle} | Elif Ay Saç Ekim Merkezi`;
    document.title = pageTitle;

    // Meta Description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    const cleanDesc = displayMetaDescription;
    metaDesc.content = cleanDesc;

    // Meta Keywords
    if (article.metaKeywords) {
      let metaKw = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
      if (!metaKw) {
        metaKw = document.createElement('meta');
        metaKw.name = 'keywords';
        document.head.appendChild(metaKw);
      }
      metaKw.content = article.metaKeywords;
    }

    // Canonical link
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://elifaysacekim.com/bilgi-bankasi/${article.slug}`;

    // Schema.org Article & BreadcrumbList JSON-LD
    let script = document.querySelector<HTMLScriptElement>('#article-ld-json');
    if (!script) {
      script = document.createElement('script');
      script.id = 'article-ld-json';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `https://elifaysacekim.com/bilgi-bankasi/${article.slug}#article`,
          'isPartOf': {
            '@type': 'WebPage',
            '@id': `https://elifaysacekim.com/bilgi-bankasi/${article.slug}`,
            'url': `https://elifaysacekim.com/bilgi-bankasi/${article.slug}`,
            'name': `${displayTitle} | Elif Ay Saç Ekim Merkezi`,
            'description': cleanDesc
          },
          'headline': displayTitle,
          'description': cleanDesc,
          'image': article.coverImage ? [`https://elifaysacekim.com${article.coverImage}`] : undefined,
          'datePublished': article.publishedAt,
          'dateModified': article.publishedAt,
          'author': {
            '@type': 'Person',
            'name': 'Elif Ay',
            'jobTitle': 'Saç Ekim Koordinatörü ve Danışmanı',
            'url': 'https://elifaysacekim.com/#specialist'
          },
          'publisher': {
            '@type': 'MedicalOrganization',
            'name': 'Elif Ay Saç Ekim Merkezi',
            'url': 'https://elifaysacekim.com',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://elifaysacekim.com/elif-ay-portrait.jpg'
            }
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `https://elifaysacekim.com/bilgi-bankasi/${article.slug}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': t.breadcrumbHome,
              'item': 'https://elifaysacekim.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': t.breadcrumbKnowledge,
              'item': 'https://elifaysacekim.com/bilgi-bankasi'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': article.category,
              'item': `https://elifaysacekim.com/bilgi-bankasi?kategori=${encodeURIComponent(article.category)}`
            },
            {
              '@type': 'ListItem',
              'position': 4,
              'name': displayTitle,
              'item': `https://elifaysacekim.com/bilgi-bankasi/${article.slug}`
            }
          ]
        }
      ]
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [article, displayTitle, displayMetaTitle, displayMetaDescription, t]);

  // Find related articles (same category, different slug)
  const relatedArticles = useMemo(() => {
    return allArticles
      .filter((a) => a.category === article.category && a.slug !== article.slug)
      .slice(0, 3);
  }, [article]);

  const cover = article.coverImage || '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
  const readingTime = getReadingTime(displayContent, t.readingTimeSuffix);
  const dateText = formatDate(article.publishedAt, currentLang);
  const whatsappPreFilled = `https://wa.me/905364916040?text=${encodeURIComponent(
    currentLang === 'en'
      ? `Hello, I read your article "${displayTitle}" and would like to get a free analysis and information about hair transplant.`
      : currentLang === 'ar'
      ? `مرحباً، قرأت مقالكم "${displayTitle}"، وأود الحصول على استشارة مجانية ومعلومات عن زراعة الشعر.`
      : currentLang === 'de'
      ? `Hallo, ich habe Ihren Artikel "${displayTitle}" gelesen und möchte eine kostenlose Analyse und Beratung zur Haartransplantation anfordern.`
      : `Merhaba, "${displayTitle}" başlıklı makalenizi okudum, ücretsiz analiz ve saç ekimi hakkında bilgi almak istiyorum.`
  )}`;

  return (
    <div className="article-page-root">
      {/* Ultra-thin Top Function Bar */}
      <SiteFunctionBar
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSelectTheme={onSelectTheme}
      />

      {/* Header */}
      <header className="article-page-header">
        <div className="article-header-left">
          <a
            href="/"
            className="article-brand-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            aria-label="Ana Sayfaya Dön"
          >
            <span className="brand-symbol" aria-hidden="true">
              <i /><i /><i />
            </span>
            ELİF AY
          </a>
          <span className="article-brand-badge">SAÇ EKİM KOORDİNATÖRÜ VE DANIŞMANI</span>
        </div>

        <div className="header-actions">
          <a
            className="header-icon-btn header-phone-btn"
            href="tel:+905364916040"
            title="Elif Ay Saç Ekimi Telefon Hattı: 0 536 491 60 40"
            aria-label="Telefon ile ara: 0 536 491 60 40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="header-contact-text">0 536 491 60 40</span>
          </a>

          <a
            className="header-icon-btn header-whatsapp-btn"
            href={whatsappPreFilled}
            target="_blank"
            rel="noopener noreferrer"
            title="Elif Ay Saç Ekimi WhatsApp Danışma ve Ön Analiz Hattı"
            aria-label="WhatsApp ile Danışın"
          >
            <img
              src="/icons/whatsapp-icon.webp"
              alt="Elif Ay Saç Ekimi WhatsApp Danışma ve Ücretsiz Analiz Hattı"
              className="header-whatsapp-icon"
              width="20"
              height="20"
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
            Ücretsiz Analiz <span aria-hidden="true">↗︎</span>
          </a>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb-container" aria-label="Ekmek kırıntısı">
        <ol className="article-breadcrumbs" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a
              href="/"
              itemProp="item"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
            >
              <span itemProp="name">Ana Sayfa</span>
            </a>
            <meta itemProp="position" content="1" />
          </li>
          <li className="breadcrumb-sep" aria-hidden="true">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a
              href="/bilgi-bankasi"
              itemProp="item"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/bilgi-bankasi');
              }}
            >
              <span itemProp="name">{t.breadcrumbKnowledge}</span>
            </a>
            <meta itemProp="position" content="2" />
          </li>
          <li className="breadcrumb-sep" aria-hidden="true">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="breadcrumb-category">{article.category}</span>
            <meta itemProp="position" content="3" />
          </li>
          <li className="breadcrumb-sep" aria-hidden="true">/</li>
          <li className="breadcrumb-current" aria-current="page">
            {article.title}
          </li>
        </ol>
      </nav>

      {/* Main Article Container */}
      <main className="article-main-container">
        <article className="article-container">
          {/* Post Header */}
          <header className="article-post-header">
            <span className="article-category-badge">{article.category}</span>
            <h1 className="article-main-title">{displayTitle}</h1>

            <div className="article-meta-row">
              <div className="article-author-chip">
                <img
                  src="/elif-ay-portrait.jpg"
                  alt="Saç Ekim Koordinatörü ve Danışmanı Elif Ay"
                  width="38"
                  height="38"
                />
                <div>
                  <span className="article-author-name">Saç Ekim Koordinatörü Elif Ay</span>
                  <span className="article-author-role">12+ Yıl Klinik Deneyim • Gold FUE</span>
                </div>
              </div>

              <div className="article-meta-divider" aria-hidden="true" />
              <span>{readingTime}</span>
              <div className="article-meta-divider" aria-hidden="true" />
              <time dateTime={article.publishedAt}>{dateText}</time>
            </div>
          </header>

          {/* Cover Image */}
          <div className="article-cover-wrapper">
            <img
              src={cover}
              alt={article.coverImageAlt || displayTitle}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
              }}
            />
          </div>

          {/* Regional Honesty Disclosure Box for Surrounding Provinces */}
          {isRegionalArticle && (
            <aside className="regional-disclosure-box" aria-label="Bölgesel Hizmet ve Ulaşım Bilgilendirmesi">
              <div className="regional-disclosure-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h4>
                  {currentLang === 'en'
                    ? 'Gaziantep Central Clinic & Regional Patient Information'
                    : currentLang === 'ar'
                    ? 'معلومات عيادة غازي عنتاب المركزية والمرضى الإقليميين'
                    : currentLang === 'de'
                    ? 'Gaziantep Zentralklinik & Regionale Patienteninformation'
                    : 'Gaziantep Merkez Klinik & Çevre İller Bilgilendirmesi'}
                </h4>
              </div>
              <p>
                {currentLang === 'en'
                  ? "Elif Ay Hair Transplant Center performs all consultations and procedures exclusively at our main clinic in Gaziantep. Patients traveling from surrounding cities can easily complete their procedure and return with convenient regional transport. Free online digital pre-analysis via WhatsApp is provided before your visit. All procedures are personally supervised by Hair Transplant Coordinator & Consultant Elif Ay in Gaziantep."
                  : currentLang === 'ar'
                  ? "يقوم مركز إليف آي لزراعة الشعر بجميع العمليات واستقبال المرضى حصرياً في عيادتنا الرئيسية في غازي عنتاب. تتيح شبكة النقل الإقليمية المريحة للمرضى القادمين من المدن المجاورة العودة براحة تامة. تتوفر استشارة رقمية أولية مجانية عبر واتساب قبل الحضور تحت إشراف منسقة ومستشارة زراعة الشعر إليف آي مباشرة."
                  : currentLang === 'de'
                  ? "Das Elif Ay Haartransplantationszentrum führt alle Behandlungen und Patientenaufnahmen ausschließlich in unserer Hauptklinik in Gaziantep durch. Dank der guten regionalen Verkehrsanbindung können Patienten aus Nachbarstädten bequem anreisen. Vorab bieten wir eine kostenlose digitale Foto-Analyse via WhatsApp unter persönlicher Aufsicht von Haartransplantations-Koordinatorin & Beraterin Elif Ay an."
                  : "Elif Ay Saç Ekim Merkezi, operasyonlarını ve hasta kabulünü Gaziantep ana kliniğinde gerçekleştirmektedir. Gaziantep'in bölgedeki merkezi konumu ve gelişmiş ulaşım ağı sayesinde çevre illerden gelen hastalarımız aynı gün içinde operasyonunu tamamlayıp rahatlıkla dönebilmektedir. Gelmeden önce WhatsApp üzerinden ücretsiz uzaktan dijital ön analiz imkânı sağlanmaktadır. İlgili şehirde fiziksel şubemiz bulunmamakta olup tüm cerrahi işlemler bizzat Saç Ekim Koordinatörü ve Danışmanı Elif Ay denetiminde Gaziantep'te yapılmaktadır."}
              </p>
              <a
                className="regional-disclosure-link"
                href={whatsappPreFilled}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.ctaSendPhoto} ↗︎
              </a>
            </aside>
          )}

          {/* Rich Content Body */}
          <div
            className="article-rich-content"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />

          {/* In-Article WhatsApp CTA Box */}
          <div className="article-inline-cta">
            <p className="article-inline-cta-kicker">
              {currentLang === 'en'
                ? 'EXPERT MEDICAL CONSULTATION & FREE ANALYSIS'
                : currentLang === 'ar'
                ? 'استشارة طبية متخصصة وتحليل مجاني'
                : currentLang === 'de'
                ? 'ÄRZTLICHE EXPERTENBERATUNG & KOSTENLOSE ANALYSE'
                : 'UZMAN DOKUNUŞU & ÜCRETSİZ DEĞERLENDİRME'}
            </p>
            <h3>
              {currentLang === 'en'
                ? "Get a Direct Consultation from Hair Transplant Coordinator & Consultant Elif Ay"
                : currentLang === 'ar'
                ? "احصل على استشارة مباشرة من منسقة ومستشارة زراعة الشعر إليف آي"
                : currentLang === 'de'
                ? "Direkte Beratung von Haartransplantations-Koordinatorin & Beraterin Elif Ay erhalten"
                : "Bu Konuda Saç Ekim Koordinatörü ve Danışmanı Elif Ay'dan Doğrudan Görüş Alın"}
            </h3>
            <p>
              {currentLang === 'en'
                ? 'Send your hair photos via WhatsApp to receive a personalized graft evaluation and custom treatment plan within 15 minutes.'
                : currentLang === 'ar'
                ? 'أرسل صور شعرك عبر الواتساب لتلقي خطة علاجية مخصصة وتحديد عدد البصيلات خلال 15 دقيقة مجاناً.'
                : currentLang === 'de'
                ? 'Senden Sie Ihre Fotos per WhatsApp, um innerhalb von 15 Minuten eine persönliche Graft-Analyse und einen individuellen Behandlungsplan zu erhalten.'
                : 'Saç fotoğraflarınızı WhatsApp üzerinden ileterek durumunuza özel greft analizi ve kişiselleştirilmiş tedavi planınızı 15 dakika içinde ücretsiz öğrenebilirsiniz.'}
            </p>
            <div className="article-inline-cta-actions">
              <a
                className="article-cta-btn-wa"
                href={whatsappPreFilled}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/icons/whatsapp-icon.webp"
                  alt="WhatsApp"
                  width="22"
                  height="22"
                  style={{ display: 'block' }}
                />
                {t.ctaSendPhoto}
              </a>
              <a className="article-cta-btn-phone" href="tel:+905364916040">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {t.stickyCall}: 0 536 491 60 40
              </a>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="article-related-section" aria-label="İlgili Makaleler">
            <h2 className="article-related-title">{t.articleRelated}</h2>
            <div className="article-related-grid">
              {relatedArticles.map((rel) => {
                const relCover = rel.coverImage || '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
                return (
                  <a
                    key={rel.id}
                    href={`/bilgi-bankasi/${rel.slug}`}
                    className="article-related-card"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/bilgi-bankasi/${rel.slug}`);
                    }}
                  >
                    <div className="article-related-thumb">
                      <img
                        src={relCover}
                        alt={rel.coverImageAlt || rel.title}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
                        }}
                      />
                    </div>
                    <div className="article-related-body">
                      <span className="article-related-card-tag">{rel.category}</span>
                      <h3 className="article-related-card-title">{rel.title}</h3>
                      <span className="article-related-card-action">Makaleyi Oku ↗︎</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <SiteFooter
        currentLang={currentLang}
        onNavigate={onNavigate}
        isSubpage={true}
      />

      {/* Mobile Sticky Action Bar */}
      <MobileStickyBar whatsappMessage={whatsappPreFilled} currentLang={currentLang} />
    </div>
  );
}
