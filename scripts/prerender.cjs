const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ARTICLES_PATH = path.join(ROOT_DIR, 'src/data/articles.json');
const TREATMENTS_PATH = path.join(ROOT_DIR, 'src/data/treatments.json');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const BASE_URL = 'https://elifaysacekim.com';

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
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

function getReadingTime(html) {
  const text = html.replace(/<[^>]*>/g, ' ');
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(wordCount / 180));
  return `${minutes} dk okuma`;
}

function main() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error('dist/index.html not found! Run vite build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
  const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8'));
  const treatments = fs.existsSync(TREATMENTS_PATH)
    ? JSON.parse(fs.readFileSync(TREATMENTS_PATH, 'utf8'))
    : [];

  console.log(`Starting SSG Pre-render for ${treatments.length} treatments and ${articles.length} articles...`);

  // Ensure directories
  const bbDistDir = path.join(DIST_DIR, 'bilgi-bankasi');
  if (!fs.existsSync(bbDistDir)) {
    fs.mkdirSync(bbDistDir, { recursive: true });
  }

  const treatDistDir = path.join(DIST_DIR, 'tedaviler');
  if (!fs.existsSync(treatDistDir)) {
    fs.mkdirSync(treatDistDir, { recursive: true });
  }

  // ==========================================
  // 1. PRE-RENDER TREATMENTS
  // ==========================================
  treatments.forEach((treatment) => {
    const treatmentDir = path.join(treatDistDir, treatment.slug);
    if (!fs.existsSync(treatmentDir)) {
      fs.mkdirSync(treatmentDir, { recursive: true });
    }

    const title = treatment.metaTitle || `${treatment.title} | Elif Ay Saç Ekim Merkezi Gaziantep`;
    const cleanDesc = treatment.metaDescription || treatment.summary || '';
    const canonicalUrl = `${BASE_URL}/tedaviler/${treatment.slug}`;
    const heroImgUrl = treatment.heroImage ? `${BASE_URL}${treatment.heroImage}` : `${BASE_URL}/elif-ay-portrait.jpg`;
    const treatmentFaqs = treatment.faq || treatment.faqs || [];
    const keywordsStr = treatment.keywords ? treatment.keywords.join(', ') : `${treatment.title}, gaziantep saç ekimi, elif ay saç ekim, gold fue`;

    // Schema.org MedicalProcedure + FAQPage + BreadcrumbList
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'MedicalProcedure',
          '@id': `${canonicalUrl}#procedure`,
          'name': treatment.title,
          'description': cleanDesc,
          'procedureType': 'SurgicalProcedure',
          'bodyLocation': 'Head/Hair',
          'url': canonicalUrl,
          'image': [heroImgUrl],
          'performer': {
            '@type': 'Person',
            'name': 'Elif Ay',
            'jobTitle': 'Saç Ekim Koordinatörü ve Danışmanı',
            'url': `${BASE_URL}/#specialist`
          },
          'offers': {
            '@type': 'Offer',
            'priceCurrency': 'TRY',
            'price': 'Ücretsiz Ön Muayene ve Greft Analizi',
            'availability': 'https://schema.org/InStock',
            'url': `${canonicalUrl}#consultation`
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Ana Sayfa',
              'item': `${BASE_URL}/`
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Tedaviler',
              'item': `${BASE_URL}/#treatments`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': treatment.title,
              'item': canonicalUrl
            }
          ]
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          'mainEntity': treatmentFaqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer
            }
          }))
        }
      ]
    };

    const headMeta = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(cleanDesc)}" />
    <meta name="keywords" content="${escapeHtml(keywordsStr)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="tr" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="en" href="${canonicalUrl}?lang=en" />
    <link rel="alternate" hreflang="ar" href="${canonicalUrl}?lang=ar" />
    <link rel="alternate" hreflang="de" href="${canonicalUrl}?lang=de" />
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(cleanDesc)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${heroImgUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(cleanDesc)}" />
    <meta name="twitter:image" content="${heroImgUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

    const faqsHtml = treatmentFaqs.map((faq, i) => `
      <div class="treatment-faq-item">
        <h3 class="treatment-faq-question">${escapeHtml(faq.question)}</h3>
        <p class="treatment-faq-answer">${escapeHtml(faq.answer)}</p>
      </div>
    `).join('');

    const stepsHtml = (treatment.steps || []).map((step, i) => `
      <div class="treatment-step-card">
        <span class="step-num">${String(i + 1).padStart(2, '0')}</span>
        <h4>${escapeHtml(step.title)}</h4>
        <p>${escapeHtml(step.description)}</p>
      </div>
    `).join('');

    const staticBody = `
      <div class="treatment-page-root">
        <header class="treatment-page-header">
          <div class="treatment-header-left">
            <a href="/" class="treatment-brand-link">
              <span class="brand-symbol" aria-hidden="true"><i></i><i></i><i></i></span>
              ELİF AY
            </a>
            <span class="treatment-brand-badge">GAZİANTEP SAÇ EKİMİ</span>
          </div>
          <div class="header-actions">
            <a class="header-icon-btn header-phone-btn" href="tel:+905364916040" aria-label="Telefonla ara: 0 536 491 60 40">
              <span class="header-contact-text">0 536 491 60 40</span>
            </a>
            <a class="header-icon-btn header-whatsapp-btn" href="https://wa.me/905364916040" aria-label="WhatsApp ile Danışın">
              <span class="header-contact-text">WhatsApp</span>
            </a>
            <a class="header-cta" href="/#care">Ücretsiz Analiz ↗</a>
          </div>
        </header>
        <nav class="treatment-breadcrumb" aria-label="Ekmek Kırıntısı">
          <ol>
            <li><a href="/">Ana Sayfa</a> /</li>
            <li><a href="/#treatments">Tedaviler</a> /</li>
            <li aria-current="page">${escapeHtml(treatment.title)}</li>
          </ol>
        </nav>
        <main class="treatment-main-content">
          <article class="treatment-article">
            <header class="treatment-hero">
              <span class="treatment-badge">${escapeHtml(treatment.badge)}</span>
              <h1>${escapeHtml(treatment.title)}</h1>
              <p class="treatment-lead">${escapeHtml(treatment.summary || '')}</p>
            </header>
            <section class="treatment-specs">
              <div class="spec-card"><span>Süre:</span> <strong>${escapeHtml(treatment.duration || '5 - 7 Saat')}</strong></div>
              <div class="spec-card"><span>Anestezi:</span> <strong>${escapeHtml(treatment.anesthesia || 'Konforlu Lokal Anestezi')}</strong></div>
              <div class="spec-card"><span>İyileşme:</span> <strong>${escapeHtml(treatment.recoveryTime || '5 - 7 Gün')}</strong></div>
            </section>
            <section class="treatment-section">
              <h2>Tedavi ve Operasyon Adımları</h2>
              <div class="treatment-steps-grid">${stepsHtml}</div>
            </section>
            <section class="treatment-section">
              <h2>Sıkça Sorulan Sorular</h2>
              <div class="treatment-faq-list">${faqsHtml}</div>
            </section>
          </article>
        </main>
      </div>
    `;

    let outputHtml = baseHtml;
    outputHtml = outputHtml.replace(/<title>.*?<\/script>/s, headMeta);
    outputHtml = outputHtml.replace('<html lang="en">', '<html lang="tr">');
    outputHtml = outputHtml.replace('<div id="root"></div>', `<div id="root">${staticBody}</div>`);

    const targetFile = path.join(treatmentDir, 'index.html');
    fs.writeFileSync(targetFile, outputHtml, 'utf8');
  });

  console.log(`Successfully generated ${treatments.length} static treatment pages in dist/tedaviler/`);

  // ==========================================
  // 2. PRE-RENDER ARTICLES
  // ==========================================
  articles.forEach((article) => {
    const articleDir = path.join(bbDistDir, article.slug);
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    const title = article.metaTitle
      ? (article.metaTitle.includes('Elif Ay') ? article.metaTitle : `${article.metaTitle} | Elif Ay Saç Ekim Merkezi`)
      : `${article.title} | Elif Ay Saç Ekim Merkezi`;
    const cleanDesc = article.metaDescription || article.contentHtml.replace(/<[^>]*>/g, ' ').slice(0, 160).trim();
    const canonicalUrl = `${BASE_URL}/bilgi-bankasi/${article.slug}`;
    const coverImgUrl = article.coverImage ? `${BASE_URL}${article.coverImage}` : `${BASE_URL}/sac-ekimi-bilgi-bankasi-gorsel.jpg`;
    const readingTime = getReadingTime(article.contentHtml);
    const dateFormatted = formatDate(article.publishedAt);
    const isRegionalArticle = article.category === 'Bölgesel Rehber' || article.slug.includes('-sac-ekimi');

    // Build Schema.org JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${canonicalUrl}#article`,
          'isPartOf': {
            '@type': 'WebPage',
            '@id': canonicalUrl,
            'url': canonicalUrl,
            'name': title,
            'description': cleanDesc
          },
          'headline': article.title,
          'description': cleanDesc,
          'image': [coverImgUrl],
          'datePublished': article.publishedAt,
          'dateModified': article.publishedAt,
          'author': {
            '@type': 'Person',
            'name': 'Elif Ay',
            'jobTitle': 'Saç Ekim Koordinatörü ve Danışmanı',
            'url': `${BASE_URL}/#specialist`
          },
          'publisher': {
            '@type': 'MedicalOrganization',
            'name': 'Elif Ay Saç Ekim Merkezi',
            'url': BASE_URL,
            'logo': {
              '@type': 'ImageObject',
              'url': `${BASE_URL}/elif-ay-portrait.jpg`
            }
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Ana Sayfa',
              'item': `${BASE_URL}/`
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Bilgi Bankası',
              'item': `${BASE_URL}/#knowledge-base`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': article.category,
              'item': `${BASE_URL}/#knowledge-base`
            },
            {
              '@type': 'ListItem',
              'position': 4,
              'name': article.title,
              'item': canonicalUrl
            }
          ]
        }
      ]
    };

    // Construct head injection with reciprocal hreflang links
    const headMeta = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(cleanDesc)}" />
    ${article.metaKeywords ? `<meta name="keywords" content="${escapeHtml(article.metaKeywords)}" />` : ''}
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="tr" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="en" href="${canonicalUrl}?lang=en" />
    <link rel="alternate" hreflang="ar" href="${canonicalUrl}?lang=ar" />
    <link rel="alternate" hreflang="de" href="${canonicalUrl}?lang=de" />
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(cleanDesc)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="${coverImgUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(cleanDesc)}" />
    <meta name="twitter:image" content="${coverImgUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

    const regionalDisclaimer = isRegionalArticle ? `
      <aside class="regional-disclosure-box" aria-label="Bölgesel Hizmet ve Ulaşım Bilgilendirmesi" style="margin: 24px 0; padding: 20px; border-radius: 12px; background: rgba(181, 164, 143, 0.08); border-left: 4px solid #b5a48f;">
        <h4 style="margin: 0 0 8px 0; color: #b5a48f; font-size: 1.05rem;">Gaziantep Merkez Klinik &amp; Çevre İller Bilgilendirmesi</h4>
        <p style="margin: 0 0 12px 0; font-size: 0.92rem; line-height: 1.6; color: inherit;">
          Elif Ay Saç Ekim Merkezi fiziksel cerrahi operasyonlarını Gaziantep ana kliniğinde gerçekleştirmektedir. Gaziantep'in merkezi konumu sayesinde çevre illerden gelen misafirlerimiz aynı gün operasyonunu tamamlayıp rahatlıkla dönebilmektedir. Gelmeden önce WhatsApp üzerinden ücretsiz fotoğraflı ön analiz sağlanmaktadır.
        </p>
        <a href="https://wa.me/905364916040?text=Merhaba%2C%20sehir%20disindan%20sac%20ekimi%20icin%20ucretsiz%20on%20analiz%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" style="color: #b5a48f; font-weight: 600; text-decoration: underline;">
          WhatsApp ile Ücretsiz Fotoğraflı Ön Analiz Alın ↗
        </a>
      </aside>
    ` : '';

    // Static crawler-friendly markup for body
    const staticBody = `
      <div class="article-page-root">
        <header class="article-page-header">
          <div class="article-header-left">
            <a href="/" class="article-brand-link">
              <span class="brand-symbol" aria-hidden="true"><i></i><i></i><i></i></span>
              ELİF AY
            </a>
            <span class="article-brand-badge">SAÇ EKİM MERKEZİ</span>
          </div>
          <div class="header-actions">
            <a class="header-icon-btn header-phone-btn" href="tel:+905364916040" aria-label="Telefonla ara: 0 536 491 60 40">
              <span class="header-contact-text">0 536 491 60 40</span>
            </a>
            <a class="header-icon-btn header-whatsapp-btn" href="https://wa.me/905364916040" aria-label="WhatsApp ile Danışın">
              <span class="header-contact-text">WhatsApp</span>
            </a>
            <a class="header-cta" href="/#care">Ücretsiz Analiz ↗</a>
          </div>
        </header>
        <nav class="article-breadcrumb-container" aria-label="Ekmek kırıntısı">
          <ol class="article-breadcrumbs">
            <li><a href="/">Ana Sayfa</a> /</li>
            <li><a href="/bilgi-bankasi">Bilgi Bankası</a> /</li>
            <li><span>${escapeHtml(article.category)}</span> /</li>
            <li class="breadcrumb-current">${escapeHtml(article.title)}</li>
          </ol>
        </nav>
        <main class="article-main-container">
          <article class="article-container">
            <header class="article-post-header">
              <span class="article-category-badge">${escapeHtml(article.category)}</span>
              <h1 class="article-main-title">${escapeHtml(article.title)}</h1>
              <div class="article-meta-row">
                <div class="article-author-chip">
                  <img src="/elif-ay-portrait.jpg" alt="Saç Ekim Koordinatörü Elif Ay" width="38" height="38" />
                  <div>
                    <span class="article-author-name">Saç Ekim Koordinatörü Elif Ay</span>
                    <span class="article-author-role">12+ Yıl Klinik Deneyim • Gold FUE</span>
                  </div>
                </div>
                <span>${readingTime}</span>
                <time datetime="${article.publishedAt}">${dateFormatted}</time>
              </div>
            </header>
            <div class="article-cover-wrapper">
              <img src="${article.coverImage || '/sac-ekimi-bilgi-bankasi-gorsel.jpg'}" alt="${escapeHtml(article.coverImageAlt || article.title)}" />
            </div>
            ${regionalDisclaimer}
            <div class="article-rich-content">
              ${article.contentHtml}
            </div>
            <div class="article-inline-cta">
              <p class="article-inline-cta-kicker">UZMAN DOKUNUŞU & ÜCRETSİZ DEĞERLENDİRME</p>
              <h3>Bu Konuda Saç Ekim Koordinatörü ve Danışmanı Elif Ay'dan Doğrudan Görüş Alın</h3>
              <p>Saç fotoğraflarınızı WhatsApp üzerinden ileterek durumunuza özel greft analizi ve kişiselleştirilmiş tedavi planınızı 15 dakika içinde ücretsiz öğrenebilirsiniz.</p>
              <div class="article-inline-cta-actions">
                <a class="article-cta-btn-wa" href="https://wa.me/905364916040">WhatsApp ile Fotoğraf Gönder & Bilgi Al</a>
                <a class="article-cta-btn-phone" href="tel:+905364916040">Telefon ile Arayın: 0 536 491 60 40</a>
              </div>
            </div>
          </article>
        </main>
      </div>
    `;

    // Replace <title> ... </script> in baseHtml head
    let outputHtml = baseHtml;
    outputHtml = outputHtml.replace(/<title>.*?<\/script>/s, headMeta);
    outputHtml = outputHtml.replace('<html lang="en">', '<html lang="tr">');
    // Inject static body inside root for instant crawler rendering
    outputHtml = outputHtml.replace('<div id="root"></div>', `<div id="root">${staticBody}</div>`);

    const targetFile = path.join(articleDir, 'index.html');
    fs.writeFileSync(targetFile, outputHtml, 'utf8');
  });

  console.log(`Successfully generated ${articles.length} static article pages in dist/bilgi-bankasi/`);

  // ==========================================
  // 2.5 PRE-RENDER BILGI-BANKASI & BLOG HUB
  // ==========================================
  const hubCanonical = `${BASE_URL}/bilgi-bankasi`;
  const hubTitle = 'Saç Ekimi Rehberi & Bilgi Bankası 2026 | Elif Ay Gaziantep';
  const hubDesc = 'Gaziantep saç ekimi, Safir FUE, DHI, sakal & kaş ekimi, greft hesaplama, operasyon öncesi ve sonrası bakım hakkında 112+ kapsamlı uzman makalesi ve rehber.';
  const hubImg = `${BASE_URL}/elif-ay-portrait.jpg`;

  const hubJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${hubCanonical}#webpage`,
        'url': hubCanonical,
        'name': hubTitle,
        'description': hubDesc,
        'isPartOf': {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          'url': `${BASE_URL}/`,
          'name': 'Elif Ay Saç Ekim Merkezi'
        }
      },
      {
        '@type': 'Blog',
        '@id': `${hubCanonical}#blog`,
        'name': 'Elif Ay Saç Ekimi Bilgi Bankası & Blog',
        'description': 'Saç ekimi cerrahisi, medikal estetik ve saç sağlığı alanında uzman rehberler.',
        'url': hubCanonical,
        'publisher': {
          '@type': 'MedicalOrganization',
          'name': 'Elif Ay Saç Ekim Merkezi',
          'url': `${BASE_URL}/`,
          'logo': {
            '@type': 'ImageObject',
            'url': `${BASE_URL}/elif-ay-portrait.jpg`
          }
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${hubCanonical}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Ana Sayfa',
            'item': `${BASE_URL}/`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Bilgi Bankası',
            'item': hubCanonical
          }
        ]
      }
    ]
  };

  const hubHeadMeta = `
    <title>${escapeHtml(hubTitle)}</title>
    <meta name="description" content="${escapeHtml(hubDesc)}" />
    <link rel="canonical" href="${hubCanonical}" />
    <meta property="og:title" content="${escapeHtml(hubTitle)}" />
    <meta property="og:description" content="${escapeHtml(hubDesc)}" />
    <meta property="og:url" content="${hubCanonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${hubImg}" />
    <meta property="og:locale" content="tr_TR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(hubTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(hubDesc)}" />
    <meta name="twitter:image" content="${hubImg}" />
    <link rel="alternate" hreflang="tr" href="${hubCanonical}" />
    <link rel="alternate" hreflang="en" href="${hubCanonical}?lang=en" />
    <link rel="alternate" hreflang="ar" href="${hubCanonical}?lang=ar" />
    <link rel="alternate" hreflang="de" href="${hubCanonical}?lang=de" />
    <link rel="alternate" hreflang="x-default" href="${hubCanonical}" />
    <script type="application/ld+json">${JSON.stringify(hubJsonLd)}</script>`;

  const firstPageArticles = articles.slice(0, 12);
  const totalPages = Math.ceil(articles.length / 12);

  const hubCardsHtml = firstPageArticles.map(art => {
    const readingTime = art.readTime || getReadingTime(art.contentHtml || '');
    const dateFormatted = formatDate(art.publishedAt);
    const summaryClean = art.summary ? escapeHtml(art.summary) : '';
    const cover = art.coverImage || '/sac-ekimi-bilgi-bankasi-gorsel.jpg';
    return `
      <article class="blog-card">
        <a href="/bilgi-bankasi/${art.slug}" class="blog-card-thumb-link" aria-label="${escapeHtml(art.title)}">
          <div class="blog-card-thumb">
            <img src="${cover}" alt="${escapeHtml(art.title)}" loading="lazy" width="380" height="210" />
            <span class="blog-card-tag">${escapeHtml(art.category)}</span>
          </div>
        </a>
        <div class="blog-card-body">
          <div class="blog-card-meta-top">
            <span class="blog-card-time">${readingTime}</span>
            <time datetime="${art.publishedAt}">${dateFormatted}</time>
          </div>
          <h3 class="blog-card-title">
            <a href="/bilgi-bankasi/${art.slug}">${escapeHtml(art.title)}</a>
          </h3>
          <p class="blog-card-snippet">${summaryClean}</p>
          <div class="blog-card-footer">
            <div class="blog-card-author">
              <img src="/elif-ay-portrait.jpg" alt="Elif Ay" width="28" height="28" />
              <span>Saç Ekim Koordinatörü Elif Ay</span>
            </div>
            <a href="/bilgi-bankasi/${art.slug}" class="blog-read-btn">
              Rehberi Oku <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const hubStaticBody = `
    <div class="blog-page-root">
      <header class="blog-page-header">
        <div class="blog-header-left">
          <a href="/" class="blog-brand-link">
            <span class="brand-symbol" aria-hidden="true"><i></i><i></i><i></i></span>
            ELİF AY
          </a>
          <span class="blog-brand-badge">SAÇ EKİM MERKEZİ</span>
        </div>
        <div class="header-actions">
          <a class="header-icon-btn header-phone-btn" href="tel:+905364916040" aria-label="Telefonla ara: 0 536 491 60 40">
            <span class="header-contact-text">0 536 491 60 40</span>
          </a>
          <a class="header-icon-btn header-whatsapp-btn" href="https://wa.me/905364916040" aria-label="WhatsApp ile Danışın">
            <span class="header-contact-text">WhatsApp</span>
          </a>
          <a class="header-cta" href="/#care">Ücretsiz Analiz ↗</a>
        </div>
      </header>

      <div class="blog-breadcrumb-wrapper">
        <nav aria-label="Ekmek Kırıntısı">
          <ol class="blog-breadcrumb">
            <li><a href="/">Ana Sayfa</a></li>
            <li class="breadcrumb-sep" aria-hidden="true">/</li>
            <li aria-current="page">Bilgi Bankası</li>
          </ol>
        </nav>
      </div>

      <main class="blog-hub-container">
        <header class="blog-hero-section">
          <div class="blog-hero-content">
            <span class="blog-hero-badge">UZMAN SAÇ SAĞLIĞI &amp; EKİM KÜTÜPHANESİ</span>
            <h1 class="blog-main-title">Saç Ekimi Rehberi &amp; Bilgi Bankası</h1>
            <p class="blog-main-lead">
              Gaziantep Elif Ay Saç Ekim Merkezi klinik tecrübesiyle hazırlanan; Safir FUE, DHI saç ekimi, kadınlarda saç dökülmesi, sakal &amp; kaş ekimi, operasyon süreçleri ve greft hesaplama hakkında güncel, kanıta dayalı ve kapsamlı rehberler.
            </p>
            <div class="blog-topic-chips" aria-label="Popüler Başlıklar">
              <span class="topic-chip-label">Öne Çıkan Başlıklar:</span>
              <a href="/bilgi-bankasi?q=Safir%20FUE" class="topic-chip-btn"><span>#</span>Safir FUE vs DHI</a>
              <a href="/bilgi-bankasi?q=%C5%9Eok%20D%C3%B6k%C3%BClme" class="topic-chip-btn"><span>#</span>Şok Dökülme Takvimi</a>
              <a href="/bilgi-bankasi?q=Fiyatlar%C4%B1" class="topic-chip-btn"><span>#</span>2026 Saç Ekimi Fiyatları</a>
              <a href="/bilgi-bankasi?q=Greft" class="topic-chip-btn"><span>#</span>Greft Hesaplama</a>
              <a href="/bilgi-bankasi?q=Y%C4%B1kama" class="topic-chip-btn"><span>#</span>İlk Yıkama Protokolü</a>
              <a href="/bilgi-bankasi?q=Kad%C4%B1nlarda" class="topic-chip-btn"><span>#</span>Kadınlarda Saç Ekimi</a>
            </div>
          </div>
        </header>

        <section class="blog-list-section" aria-label="Tüm Makaleler">
          <div class="blog-articles-grid" id="articles-grid">
            ${hubCardsHtml}
          </div>
          <nav class="blog-pagination" aria-label="Sayfalama">
            <span class="page-status">Sayfa 1 / ${totalPages} (${articles.length} Rehber)</span>
          </nav>
        </section>
      </main>
    </div>
  `;

  let hubHtml = baseHtml;
  hubHtml = hubHtml.replace(/<title>.*?<\/script>/s, hubHeadMeta);
  hubHtml = hubHtml.replace('<html lang="en">', '<html lang="tr">');
  hubHtml = hubHtml.replace('<div id="root"></div>', `<div id="root">${hubStaticBody}</div>`);

  fs.writeFileSync(path.join(bbDistDir, 'index.html'), hubHtml, 'utf8');

  const blogDistDir = path.join(DIST_DIR, 'blog');
  if (!fs.existsSync(blogDistDir)) {
    fs.mkdirSync(blogDistDir, { recursive: true });
  }
  fs.writeFileSync(path.join(blogDistDir, 'index.html'), hubHtml, 'utf8');

  console.log('Successfully generated static hub pages in dist/bilgi-bankasi/index.html and dist/blog/index.html');

  // ==========================================
  // 3. SITEMAP.XML GENERATION
  // ==========================================
  const today = new Date().toISOString().split('T')[0];
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/bilgi-bankasi</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // Treatments
  treatments.forEach(treatment => {
    sitemapXml += `  <url>
    <loc>${BASE_URL}/tedaviler/${treatment.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });

  // Articles
  articles.forEach(article => {
    const modDate = article.publishedAt ? article.publishedAt.split('T')[0] : today;
    sitemapXml += `  <url>
    <loc>${BASE_URL}/bilgi-bankasi/${article.slug}</loc>
    <lastmod>${modDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  sitemapXml += `</urlset>\n`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'public/sitemap.xml'), sitemapXml, 'utf8');
  console.log(`Generated sitemap.xml with ${treatments.length + articles.length + 1} URLs in dist/ and public/`);

  // ==========================================
  // 4. ROBOTS.TXT GENERATION
  // ==========================================
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'public/robots.txt'), robotsTxt, 'utf8');
  console.log('Generated robots.txt in dist/ and public/');
}

main();
