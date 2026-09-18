export type Language = 'tr' | 'en' | 'ar' | 'de';
export type Theme = 'dark' | 'light' | 'med';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  tr: {
    code: 'tr',
    name: 'Türkçe',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
  },
};

export interface Translations {
  navPhilosophy: string;
  navTreatments: string;
  navSpecialist: string;
  navProcess: string;
  navGallery: string;
  navKnowledge: string;
  navHome: string;
  ctaAnalysis: string;
  ctaWhatsApp: string;
  ctaCall: string;
  ctaSendPhoto: string;
  stickyCall: string;
  stickyWhatsApp: string;
  stickySubtitleCall: string;
  stickySubtitleWA: string;
  themeToggleDark: string;
  themeToggleLight: string;
  themeToggleMed: string;
  clinicTagline: string;
  expertTitle: string;
  gaziantepCenter: string;
  allRightsReserved: string;

  // Breadcrumbs & Navigation
  breadcrumbHome: string;
  breadcrumbTreatments: string;
  breadcrumbKnowledge: string;

  // Treatment Page
  highlightsTitle: string;
  stepsKicker: string;
  stepsTitle: string;
  candidatesTitle: string;
  faqKicker: string;
  faqTitle: string;
  bottomCtaTitle: string;
  bottomCtaDesc: string;
  bottomCtaBtn: string;

  // Article Page
  readingTimeSuffix: string;
  articleAuthorLabel: string;
  articleShare: string;
  articleRelated: string;
  articleBackToKnowledge: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  tr: {
    navPhilosophy: 'Felsefemiz',
    navTreatments: 'Tedaviler',
    navSpecialist: 'Uzmanımız',
    navProcess: 'Süreç',
    navGallery: 'Klinik Galeri',
    navKnowledge: 'Bilgi Bankası',
    navHome: 'Ana Sayfa',
    ctaAnalysis: 'Ücretsiz Analiz ↗︎',
    ctaWhatsApp: 'WhatsApp ile Danışın',
    ctaCall: '0 536 491 60 40',
    ctaSendPhoto: 'Fotoğraf Gönder & Analiz Al',
    stickyCall: 'Telefon ile Ara',
    stickyWhatsApp: "WhatsApp'tan Yaz",
    stickySubtitleCall: '0 536 491 60 40',
    stickySubtitleWA: 'Hızlı Ücretsiz Analiz',
    themeToggleDark: 'Koyu temaya geç',
    themeToggleLight: 'Açık temaya geç',
    themeToggleMed: 'Medikal temaya geç (Med)',
    clinicTagline: 'Doğal Çizgi. Hassas Planlama. Kalıcı Sonuç.',
    expertTitle: 'Saç Ekim Koordinatörü',
    gaziantepCenter: 'Gaziantep Merkez & Çevre İllerden Kolay Ulaşım',
    allRightsReserved: 'Tüm hakları saklıdır.',

    breadcrumbHome: 'Ana Sayfa',
    breadcrumbTreatments: 'Tedaviler',
    breadcrumbKnowledge: 'Bilgi Bankası',

    highlightsTitle: 'Öne Çıkan Klinik Avantajları',
    stepsKicker: 'ADIM ADIM RESTORASYON SÜRECİ',
    stepsTitle: 'Operasyon Aşamaları Nasıl İlerler?',
    candidatesTitle: 'Bu Tedavi Kimler İçin Uygundur?',
    faqKicker: 'MERAK EDİLENLER',
    faqTitle: 'Sıkça Sorulan Sorular',
    bottomCtaTitle: 'Gaziantep Kliniğimizde Uzman Görüşü Alın',
    bottomCtaDesc: "Saç veya kaş fotoğraflarınızı ileterek Saç Ekim Koordinatörü ve Danışmanı Elif Ay'dan kişiselleştirilmiş greft planlaması hakkında 15 dakikada bilgi edinin.",
    bottomCtaBtn: 'Hemen Analiz Başlatın',

    readingTimeSuffix: 'dk okuma',
    articleAuthorLabel: 'Saç Ekim Koordinatörü',
    articleShare: 'Paylaş',
    articleRelated: 'İlgili Klinik Rehberleri',
    articleBackToKnowledge: 'Tüm Makalelere Dön',
  },
  en: {
    navPhilosophy: 'Philosophy',
    navTreatments: 'Treatments',
    navSpecialist: 'Our Specialist',
    navProcess: 'Process',
    navGallery: 'Gallery',
    navKnowledge: 'Knowledge Base',
    navHome: 'Home',
    ctaAnalysis: 'Free Analysis ↗︎',
    ctaWhatsApp: 'Contact on WhatsApp',
    ctaCall: '+90 536 491 60 40',
    ctaSendPhoto: 'Send Photos & Get Analysis',
    stickyCall: 'Call Clinic',
    stickyWhatsApp: 'Chat on WhatsApp',
    stickySubtitleCall: '+90 536 491 60 40',
    stickySubtitleWA: 'Fast Free Analysis',
    themeToggleDark: 'Switch to dark theme',
    themeToggleLight: 'Switch to light theme',
    themeToggleMed: 'Switch to medical theme (Med)',
    clinicTagline: 'Natural Hairline. Precision Planning. Permanent Results.',
    expertTitle: 'Hair Transplant Coordinator',
    gaziantepCenter: 'Gaziantep Central Clinic & Regional Access',
    allRightsReserved: 'All rights reserved.',

    breadcrumbHome: 'Home',
    breadcrumbTreatments: 'Treatments',
    breadcrumbKnowledge: 'Knowledge Base',

    highlightsTitle: 'Key Clinical Advantages',
    stepsKicker: 'STEP-BY-STEP PROCEDURE',
    stepsTitle: 'How Does the Operation Proceed?',
    candidatesTitle: 'Who Is This Treatment Suitable For?',
    faqKicker: 'FREQUENTLY ASKED',
    faqTitle: 'Frequently Asked Questions',
    bottomCtaTitle: 'Get an Expert Medical Opinion in Gaziantep',
    bottomCtaDesc: 'Send your hair or eyebrow photos via WhatsApp to receive a personalized graft plan from Hair Transplant Coordinator & Consultant Elif Ay within 15 minutes.',
    bottomCtaBtn: 'Start Free Analysis Now',

    readingTimeSuffix: 'min read',
    articleAuthorLabel: 'Hair Transplant Coordinator',
    articleShare: 'Share',
    articleRelated: 'Related Clinical Guides',
    articleBackToKnowledge: 'Back to Knowledge Base',
  },
  ar: {
    navPhilosophy: 'فلسفتنا',
    navTreatments: 'العلاجات',
    navSpecialist: 'أخصائيتنا',
    navProcess: 'المراحل',
    navGallery: 'معرض الصور',
    navKnowledge: 'بنك المعلومات',
    navHome: 'الرئيسية',
    ctaAnalysis: 'تحليل مجاني ↗︎',
    ctaWhatsApp: 'استشر عبر واتساب',
    ctaCall: '+90 536 491 60 40',
    ctaSendPhoto: 'أرسل الصور واحصل على تحليل',
    stickyCall: 'اتصال هاتفي',
    stickyWhatsApp: 'مراسلة عبر واتساب',
    stickySubtitleCall: '+90 536 491 60 40',
    stickySubtitleWA: 'تحليل فوري مجاني',
    themeToggleDark: 'الوضع الليلي',
    themeToggleLight: 'الوضع الفاتح',
    themeToggleMed: 'الوضع الطبي (Med)',
    clinicTagline: 'خط شعر طبيعي. تخطيط دقيق. نتائج دائمة.',
    expertTitle: 'منسقة زراعة الشعر',
    gaziantepCenter: 'مركز غازي عنتاب وسهولة الوصول من المدن المجاورة',
    allRightsReserved: 'جميع الحقوق محفوظة.',

    breadcrumbHome: 'الرئيسية',
    breadcrumbTreatments: 'العلاجات',
    breadcrumbKnowledge: 'بنك المعلومات',

    highlightsTitle: 'أبرز المزايا السريرية',
    stepsKicker: 'مراحل العملية خطوة بخطوة',
    stepsTitle: 'كيف تسير مراحل العملية؟',
    candidatesTitle: 'لمن يناسب هذا العلاج؟',
    faqKicker: 'الأسئلة الأكثر تداولاً',
    faqTitle: 'الأسئلة الشائعة',
    bottomCtaTitle: 'احصل على استشارة تخصصية في عيادتنا بغازي عنتاب',
    bottomCtaDesc: 'أرسل صور شعرك أو حاجبيك عبر الواتساب لتلقي خطة علاجية مخصصة وتحديد عدد البصيلات من منسقة ومستشارة زراعة الشعر إليف آي خلال 15 دقيقة.',
    bottomCtaBtn: 'ابدأ التحليل المجاني الآن',

    readingTimeSuffix: 'دقائق قراءة',
    articleAuthorLabel: 'منسقة زراعة الشعر',
    articleShare: 'مشاركة',
    articleRelated: 'أدلة إكلينيكية ذات صلة',
    articleBackToKnowledge: 'العودة لبنك المعلومات',
  },
  de: {
    navPhilosophy: 'Philosophie',
    navTreatments: 'Behandlungen',
    navSpecialist: 'Unsere Spezialistin',
    navProcess: 'Ablauf',
    navGallery: 'Klinik Galerie',
    navKnowledge: 'Wissensdatenbank',
    navHome: 'Startseite',
    ctaAnalysis: 'Kostenlose Analyse ↗︎',
    ctaWhatsApp: 'Über WhatsApp beraten',
    ctaCall: '+90 536 491 60 40',
    ctaSendPhoto: 'Fotos senden & Analyse erhalten',
    stickyCall: 'Jetzt anrufen',
    stickyWhatsApp: 'WhatsApp Chat',
    stickySubtitleCall: '+90 536 491 60 40',
    stickySubtitleWA: 'Schnelle Gratis-Analyse',
    themeToggleDark: 'Dunkles Design',
    themeToggleLight: 'Helles Design',
    themeToggleMed: 'Medizinisches Design (Med)',
    clinicTagline: 'Natürlicher Haaransatz. Präzise Planung. Dauerhafte Ergebnisse.',
    expertTitle: 'Haartransplantations-Koordinatorin',
    gaziantepCenter: 'Gaziantep Zentralklinik & Regionale Anbindung',
    allRightsReserved: 'Alle Rechte vorbehalten.',

    breadcrumbHome: 'Startseite',
    breadcrumbTreatments: 'Behandlungen',
    breadcrumbKnowledge: 'Wissensdatenbank',

    highlightsTitle: 'Klinische Spitzenvorteile',
    stepsKicker: 'SCHRITT-FÜR-SCHRITT VERFAHREN',
    stepsTitle: 'Wie läuft die Behandlung ab?',
    candidatesTitle: 'Für wen ist diese Behandlung geeignet?',
    faqKicker: 'HÄUFIG GESTELLT',
    faqTitle: 'Häufig gestellte Fragen',
    bottomCtaTitle: 'Holen Sie eine Expertenmeinung in unserer Klinik ein',
    bottomCtaDesc: 'Senden Sie Ihre Fotos über WhatsApp, um innerhalb von 15 Minuten einen persönlichen Graft-Plan von Haartransplantations-Koordinatorin & Beraterin Elif Ay zu erhalten.',
    bottomCtaBtn: 'Kostenlose Analyse starten',

    readingTimeSuffix: 'Min. Lesezeit',
    articleAuthorLabel: 'Haartransplantations-Koordinatorin',
    articleShare: 'Teilen',
    articleRelated: 'Verwandte Ratgeber',
    articleBackToKnowledge: 'Zurück zur Wissensdatenbank',
  },
};
