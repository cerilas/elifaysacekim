import { type Language } from '../../i18n';

export interface FooterLinkItem {
  label: string;
  slug: string;
}

export interface FooterTranslations {
  kicker: string;
  bannerTitleMain: string;
  bannerTitleEm: string;
  bannerDesc: string;
  bannerWa: string;
  bannerWaMsg: string;
  bannerPhone: string;
  slogan: string;
  desc: string;
  treatmentsTitle: string;
  treatments: {
    hair: string;
    eyebrow: string;
    beard: string;
    sapphire: string;
    dhi: string;
  };
  quickLinksTitle: string;
  navPhilosophy: string;
  navSpecialist: string;
  navTreatments: string;
  navGallery: string;
  navKnowledge: string;
  navContact: string;
  contactTitle: string;
  location: string;
  locationNote: string;
  hours: string;
  faqTitle: string;
  regionsTitle: string;
}

export const FOOTER_I18N: Record<Language, FooterTranslations> = {
  tr: {
    kicker: 'DOĞRUDAN UZMAN İLETİŞİMİ & KLİNİK DANIŞMANLIĞI',
    bannerTitleMain: 'Gaziantep Saç Ekimi Fiyatları &',
    bannerTitleEm: 'Ücretsiz Greft Analizi.',
    bannerDesc:
      "Gaziantep, çevre iller ve yurt dışından gelen hastalarımız için: Saç veya sakal fotoğraflarınızı WhatsApp üzerinden ileterek Saç Ekim Koordinatörü ve Danışmanı Elif Ay'dan 15 dakika içinde 3000-5000 greft ihtiyacınızı ve şeffaf paket fiyatını öğrenin.",
    bannerWa: 'WhatsApp ile Fotoğraf Gönder & Ücretsiz Analiz Al',
    bannerWaMsg:
      'Merhaba, saç fotoğraflarımı gönderip Gaziantep saç ekimi için ücretsiz greft analizi ve fiyat bilgisi almak istiyorum.',
    bannerPhone: 'Kliniği Arayın: 0 536 491 60 40',
    slogan: 'Hassas planlama. Doğal çizgi. Kalıcı sonuç.',
    desc: 'Gaziantep merkezli kliniğimizde Safir FUE, DHI, sakal ve kadınlarda kaş ekimi uygulamaları. Şehir merkezinde kolay ulaşım, aynı gün analiz ve kişiye özel saç çizgisi tasarımı.',
    treatmentsTitle: 'TEDAVİLERİMİZ',
    treatments: {
      hair: 'Saç Ekimi',
      eyebrow: 'Kaş Ekimi',
      beard: 'Sakal Ekimi',
      sapphire: 'Safir FUE Saç Ekimi',
      dhi: 'DHI Saç Ekimi',
    },
    quickLinksTitle: 'HIZLI BAĞLANTILAR',
    navPhilosophy: 'Felsefemiz',
    navSpecialist: 'Uzmanımız',
    navTreatments: 'Uygulamalar',
    navGallery: 'Klinik Galeri',
    navKnowledge: 'Bilgi Bankası',
    navContact: 'İletişim',
    contactTitle: 'İLETİŞİM VE KLİNİK BİLGİLERİ',
    location: 'Gaziantep Merkez Kliniği, Türkiye',
    locationNote:
      '(Çevre illerden ve yurt dışından gelen misafirlerimiz için WhatsApp üzerinden hızlı uzaktan fotoğraflı ön değerlendirme ve randevu planlaması yapılmaktadır.)',
    hours: 'Pazartesi – Cumartesi, 09:00 – 19:00',
    faqTitle: 'SIK SORULAN SORULAR',
    regionsTitle: 'HİZMET BÖLGELERİMİZ',
  },
  en: {
    kicker: 'DIRECT SPECIALIST CONSULTATION & CLINICAL CARE',
    bannerTitleMain: 'Gaziantep Hair Transplant Prices &',
    bannerTitleEm: 'Free Graft Analysis.',
    bannerDesc:
      'For patients from Turkey and abroad: Send your hair or beard photos via WhatsApp to receive a detailed 3,000–5,000 graft assessment and transparent all-inclusive quote from Hair Transplant Coordinator & Consultant Elif Ay within 15 minutes.',
    bannerWa: 'Send Photos via WhatsApp & Get Free Analysis',
    bannerWaMsg:
      'Hello, I would like to send my hair photos to receive a free graft analysis and price details for hair transplantation in Gaziantep.',
    bannerPhone: 'Call the Clinic: +90 536 491 60 40',
    slogan: 'Precision planning. Natural hairline. Lifelong results.',
    desc: 'Leading center in Gaziantep for Sapphire FUE, DHI, beard restoration, and specialized eyebrow transplantation. Convenient central access, same-day analysis, and personalized hairline planning.',
    treatmentsTitle: 'OUR TREATMENTS',
    treatments: {
      hair: 'Hair Transplant',
      eyebrow: 'Eyebrow Transplant',
      beard: 'Beard Transplant',
      sapphire: 'Sapphire FUE Hair Transplant',
      dhi: 'DHI Hair Transplant',
    },
    quickLinksTitle: 'QUICK LINKS',
    navPhilosophy: 'Philosophy',
    navSpecialist: 'Our Specialist',
    navTreatments: 'Treatments',
    navGallery: 'Gallery',
    navKnowledge: 'Knowledge Base',
    navContact: 'Contact',
    contactTitle: 'CONTACT & CLINICAL INFO',
    location: 'Gaziantep Central Clinic, Turkey',
    locationNote:
      '(For our guests arriving from surrounding regions and overseas, fast remote photo evaluation and priority scheduling via WhatsApp are provided.)',
    hours: 'Monday – Saturday, 09:00 – 19:00',
    faqTitle: 'FREQUENTLY ASKED QUESTIONS',
    regionsTitle: 'SERVICE REGIONS',
  },
  ar: {
    kicker: 'استشارة مباشرة مع الأخصائية ورعاية طبية موثوقة',
    bannerTitleMain: 'أسعار زراعة الشعر في غازي عنتاب &',
    bannerTitleEm: 'وتحليل مجاني للبصيلات.',
    bannerDesc:
      'لكافة مرضانا من تركيا ومختلف دول العالم: أرسل صور شعرك أو لحيتك عبر واتساب لتلقي تحليل مفصل للبصيلات (3000-5000 بصيلة) وعرض سعر شامل وشفاف من منسقة ومستشارة زراعة الشعر إليف آي خلال 15 دقيقة.',
    bannerWa: 'أرسل الصور عبر واتساب واحصل على تحليل مجاني',
    bannerWaMsg:
      'مرحباً، أود إرسال صور شعري للحصول على تحليل مجاني وعرض سعر لزراعة الشعر في غازي عنتاب.',
    bannerPhone: 'اتصل بالعيادة: 40 60 491 536 90+',
    slogan: 'تخطيط دقيق. خط شعر طبيعي. نتائج دائمة.',
    desc: 'المركز التخصصي الرائد في غازي عنتاب لتقنيات السفير وDHI وزراعة اللحية والحواجب للنساء. وصول مريح وتحليل فوري في نفس اليوم مع تخطيط مخصص لكل حالة.',
    treatmentsTitle: 'علاجاتنا',
    treatments: {
      hair: 'زراعة الشعر',
      eyebrow: 'زراعة الحواجب',
      beard: 'زراعة اللحية',
      sapphire: 'زراعة الشعر بالسفير FUE',
      dhi: 'زراعة الشعر بتقنية DHI',
    },
    quickLinksTitle: 'روابط سريعة',
    navPhilosophy: 'فلسفتنا',
    navSpecialist: 'أخصائيتنا',
    navTreatments: 'العلاجات',
    navGallery: 'معرض الصور',
    navKnowledge: 'بنك المعلومات',
    navContact: 'تواصل معنا',
    contactTitle: 'معلومات التواصل والعيادة',
    location: 'عيادة غازي عنتاب المركزية، تركيا',
    locationNote:
      '(نوفر لضيوفنا القادمين من المحافظات الأخرى وخارج البلاد استشارة أولية مجانية عن بعد عبر صور الواتساب وحجز مواعيد فوري.)',
    hours: 'الإثنين – السبت، 09:00 – 19:00',
    faqTitle: 'الأسئلة الشائعة',
    regionsTitle: 'المناطق المخدومة',
  },
  de: {
    kicker: 'DIREKTE FACHBERATUNG & ERSTKLASSIGE KLINISCHE BETREUUNG',
    bannerTitleMain: 'Haartransplantation Preise Gaziantep &',
    bannerTitleEm: 'Kostenlose Graft-Analyse.',
    bannerDesc:
      'Für Patienten aus der Region und dem Ausland: Senden Sie Ihre Fotos bequem per WhatsApp und erhalten Sie innerhalb von 15 Minuten eine Analyse von 3.000–5.000 Grafts und ein transparentes Angebot von Haartransplantations-Koordinatorin & Beraterin Elif Ay.',
    bannerWa: 'Fotos per WhatsApp senden & Gratis-Analyse erhalten',
    bannerWaMsg:
      'Hallo, ich möchte Fotos senden, um eine kostenlose Haartransplantations-Analyse und Preise für Gaziantep zu erhalten.',
    bannerPhone: 'Klinik anrufen: +90 536 491 60 40',
    slogan: 'Präzise Planung. Natürlicher Haaransatz. Dauerhafte Ergebnisse.',
    desc: 'Führendes Zentrum in Gaziantep für Saphir FUE, DHI, Bart- und Augenbrauentransplantation für Frauen. Zentrale Lage, Vor-Ort-Analyse am selben Tag und individuelle Planung.',
    treatmentsTitle: 'UNSERE BEHANDLUNGEN',
    treatments: {
      hair: 'Haartransplantation',
      eyebrow: 'Augenbrauentransplantation',
      beard: 'Barttransplantation',
      sapphire: 'Saphir FUE Haartransplantation',
      dhi: 'DHI Haartransplantation',
    },
    quickLinksTitle: 'SCHNELLZUGRIFF',
    navPhilosophy: 'Philosophie',
    navSpecialist: 'Unsere Spezialistin',
    navTreatments: 'Behandlungen',
    navGallery: 'Klinik Galerie',
    navKnowledge: 'Wissensdatenbank',
    navContact: 'Kontakt',
    contactTitle: 'KONTAKT & KLINIKDATEN',
    location: 'Gaziantep Zentralklinik, Türkei',
    locationNote:
      '(Für Patienten aus anderen Städten und dem Ausland bieten wir kostenlose Online-Fotoanalysen und schnelle Terminvereinbarung per WhatsApp.)',
    hours: 'Montag – Samstag, 09:00 – 19:00',
    faqTitle: 'HÄUFIG GESTELLTE FRAGEN',
    regionsTitle: 'EINZUGSGEBIETE',
  },
};

export interface FooterFaqItem {
  slug: string;
  label: Record<Language, string>;
}

export const FOOTER_FAQ_DATA: FooterFaqItem[] = [
  {
    slug: 'sac-ekimi-fiyatlari-2026-ne-kadar',
    label: {
      tr: 'Gaziantep saç ekimi fiyatları 2026 ne kadar?',
      en: 'How much are Gaziantep hair transplant prices in 2026?',
      ar: 'كم تبلغ أسعار زراعة الشعر في غازي عنتاب 2026؟',
      de: 'Wie hoch sind die Preise für Haartransplantation in Gaziantep 2026?',
    },
  },
  {
    slug: 'gaziantep-en-iyi-sac-ekim-merkezi-nasil-secilir',
    label: {
      tr: 'Gaziantep en iyi saç ekim merkezi nasıl seçilir?',
      en: 'How to choose the best hair transplant clinic in Gaziantep?',
      ar: 'كيف تختار أفضل مركز لزراعة الشعر في غازي عنتاب؟',
      de: 'Wie wählt man das beste Haartransplantationszentrum in Gaziantep?',
    },
  },
  {
    slug: 'gaziantep-sac-ekimi-fiyatlari-ve-merkezleri',
    label: {
      tr: 'Gaziantep saç ekimi fiyatları ve merkezleri',
      en: 'Gaziantep hair transplant prices and clinics',
      ar: 'أسعار ومراكز زراعة الشعر في غازي عنتاب',
      de: 'Preise und Zentren für Haartransplantation in Gaziantep',
    },
  },
  {
    slug: 'sac-ekiminde-greft-hesaplama-nasil-yapilir',
    label: {
      tr: '1, 3000 ve 5000 greft saç ekimi hesaplama',
      en: '1, 3000 and 5000 graft hair transplant calculation',
      ar: 'حساب عدد البصيلات: 1000، 3000 و5000 بصيلة',
      de: 'Berechnung für 1.000, 3.000 und 5.000 Grafts',
    },
  },
  {
    slug: 'fue-mi-yoksa-dhi-sac-ekimi-mi-daha-iyi',
    label: {
      tr: 'Safir FUE mi yoksa DHI saç ekimi mi daha iyi?',
      en: 'Sapphire FUE or DHI: which is better?',
      ar: 'أيهما أفضل: السفير FUE أم DHI؟',
      de: 'Saphir FUE oder DHI: Was ist besser?',
    },
  },
  {
    slug: 'sac-ekimi-operasyonu-kac-saat-surer',
    label: {
      tr: 'Saç ekimi operasyonu kaç saat sürer?',
      en: 'How many hours does a hair transplant take?',
      ar: 'كم ساعة تستغرق عملية زراعة الشعر؟',
      de: 'Wie viele Stunden dauert eine Haartransplantation?',
    },
  },
  {
    slug: 'sac-ekimi-islemi-acitir-mi-agrili-midir',
    label: {
      tr: 'İğnesiz ve ağrısız saç ekimi acıtır mı?',
      en: 'Is needleless and painless hair transplant painful?',
      ar: 'هل زراعة الشعر بدون إبر مؤلمة؟',
      de: 'Ist eine nadelfreie Haartransplantation schmerzhaft?',
    },
  },
  {
    slug: 'sac-ekimi-sonrasi-sok-dokulme-sureci',
    label: {
      tr: 'Saç ekimi sonrası şok dökülme süreci ne zaman biter?',
      en: 'When does post-transplant shock loss end?',
      ar: 'متى تنتهي مرحلة التساقط المؤقت بعد الزراعة؟',
      de: 'Wann endet der Schockausfall nach der Haartransplantation?',
    },
  },
  {
    slug: 'sac-ekimi-sonrasi-ilk-yikama-ne-zaman-yapilir',
    label: {
      tr: 'Saç ekimi sonrası ilk yıkama nasıl yapılır?',
      en: 'How to perform the first wash after hair transplant?',
      ar: 'كيف يتم الغسيل الأول بعد زراعة الشعر؟',
      de: 'Wie wird die erste Haarwäsche nach der OP durchgeführt?',
    },
  },
  {
    slug: 'tirassiz-sac-ekimi-mumkun-mu-kimlere-yapilir',
    label: {
      tr: 'Tıraşsız saç ekimi Gaziantep: Kimlere yapılır?',
      en: 'Unshaven hair transplant in Gaziantep: Who is eligible?',
      ar: 'زراعة الشعر بدون حلاقة في غازي عنتاب: لمن تناسب؟',
      de: 'Unrasierte Haartransplantation in Gaziantep: Für wen geeignet?',
    },
  },
  {
    slug: 'gaziantep-sac-ekimi-tavsiye-ve-kullanici-yorumlari',
    label: {
      tr: 'Gaziantep saç ekimi tavsiye ve kullanıcı yorumları',
      en: 'Gaziantep hair transplant recommendations & patient reviews',
      ar: 'توصيات وتجارب المرضى لزراعة الشعر في غازي عنتاب',
      de: 'Erfahrungsberichte und Empfehlungen zur Haartransplantation',
    },
  },
  {
    slug: 'kadinlarda-sac-ekimi-gaziantep',
    label: {
      tr: 'Kadınlarda saç ekimi Gaziantep rehberi',
      en: 'Women’s hair transplant guide in Gaziantep',
      ar: 'دليل زراعة الشعر للنساء في غازي عنتاب',
      de: 'Leitfaden für Haartransplantation bei Frauen in Gaziantep',
    },
  },
  {
    slug: 'gaziantep-kas-ekimi-fiyatlari-ve-dogal-tasarim',
    label: {
      tr: 'Gaziantep kaş ekimi ve microblading üstü ekim',
      en: 'Eyebrow transplant & correction over microblading',
      ar: 'زراعة الحواجب فوق المايكروبليدنج وتصميم طبيعي',
      de: 'Augenbrauentransplantation über Microblading in Gaziantep',
    },
  },
  {
    slug: 'gaziantep-sakal-ekimi-ve-koselik-tedavisi',
    label: {
      tr: 'Gaziantep sakal ekimi ve köselik tedavisi',
      en: 'Beard transplantation & patchy beard treatment',
      ar: 'زراعة اللحية وعلاج فراغات الذقن في غازي عنتاب',
      de: 'Barttransplantation und Behandlung schütterer Bärte',
    },
  },
  {
    slug: 'gaziantep-vip-sac-ekimi-paketleri',
    label: {
      tr: 'Gaziantep her şey dahil saç ekimi paketleri',
      en: 'All-inclusive hair transplant packages in Gaziantep',
      ar: 'باقات زراعة الشعر الشاملة في غازي عنتاب',
      de: 'All-inclusive Haartransplantations-Pakete in Gaziantep',
    },
  },
  {
    slug: 'guneydogu-anadolu-sac-ekimi',
    label: {
      tr: 'Güneydoğu Anadolu saç ekimi ve hasta rehberi',
      en: 'Southeastern Anatolia hair transplant patient guide',
      ar: 'دليل المرضى لزراعة الشعر في جنوب شرق الأناضول',
      de: 'Patientenleitfaden für Haartransplantation in Südostanatolien',
    },
  },
  {
    slug: 'seker-ve-tansiyon-hastalari-sac-ekimi-yaptirabilir-mi',
    label: {
      tr: 'Şeker ve tansiyon hastaları saç ektirebilir mi?',
      en: 'Can patients with diabetes or hypertension get a hair transplant?',
      ar: 'هل يمكن لمرضى السكري والضغط إجراء زراعة الشعر؟',
      de: 'Können Diabetiker und Bluthochdruck-Patienten Haare transplantieren?',
    },
  },
  {
    slug: 'sac-ekimi-yaz-aylarinda-sicakta-yapilir-mi',
    label: {
      tr: 'Yaz aylarında sıcakta saç ekimi yapılır mı?',
      en: 'Can hair transplantation be done in summer heat?',
      ar: 'هل تجرى زراعة الشعر في حرارة الصيف؟',
      de: 'Kann eine Haartransplantation im heißen Sommer durchgeführt werden?',
    },
  },
  {
    slug: 'ekilen-saclar-ileride-dokulur-mu-kalici-midir',
    label: {
      tr: 'Ekilen saçlar dökülür mü, tepe bölgesi tutar mı?',
      en: 'Will transplanted hair fall out, is it permanent?',
      ar: 'هل يتساقط الشعر المزروع مستقبلاً وهل النتيجة دائمة؟',
      de: 'Fallen transplantierte Haare wieder aus, sind sie dauerhaft?',
    },
  },
  {
    slug: 'sac-ekimi-sonuclari-ne-zaman-tam-belli-olur',
    label: {
      tr: 'Saç ekimi sonuçları ne zaman tam belli olur?',
      en: 'When will full hair transplant results be visible?',
      ar: 'متى تظهر النتائج النهائية الكاملة لزراعة الشعر؟',
      de: 'Wann sind die endgültigen Ergebnisse sichtbar?',
    },
  },
  {
    slug: 'on-sac-cizgisi-tasarimi-nasil-yapilir',
    label: {
      tr: 'Ön saç çizgisi tasarımı nasıl yapılır?',
      en: 'How is the natural front hairline designed?',
      ar: 'كيف يتم تصميم خط الشعر الأمامي الطبيعي؟',
      de: 'Wie wird ein natürlicher vorderer Haaransatz entworfen?',
    },
  },
];

export interface FooterRegionItem {
  slug: string;
  label: Record<Language, string>;
}

export const FOOTER_REGION_DATA: FooterRegionItem[] = [
  {
    slug: 'gaziantep-sac-ekimi',
    label: {
      tr: 'Gaziantep Saç Ekimi',
      en: 'Gaziantep Hair Transplant',
      ar: 'زراعة الشعر في غازي عنتاب',
      de: 'Haartransplantation Gaziantep',
    },
  },
  {
    slug: 'sanliurfa-sac-ekimi',
    label: {
      tr: 'Şanlıurfa Saç Ekimi',
      en: 'Sanliurfa Hair Transplant',
      ar: 'زراعة الشعر في شانلي أورفا',
      de: 'Haartransplantation Sanliurfa',
    },
  },
  {
    slug: 'diyarbakir-sac-ekimi',
    label: {
      tr: 'Diyarbakır Saç Ekimi',
      en: 'Diyarbakir Hair Transplant',
      ar: 'زراعة الشعر في ديار بكر',
      de: 'Haartransplantation Diyarbakir',
    },
  },
  {
    slug: 'kahramanmaras-sac-ekimi',
    label: {
      tr: 'Kahramanmaraş Saç Ekimi',
      en: 'Kahramanmaras Hair Transplant',
      ar: 'زراعة الشعر في كهرمان مرعش',
      de: 'Haartransplantation Kahramanmaras',
    },
  },
  {
    slug: 'adiyaman-sac-ekimi',
    label: {
      tr: 'Adıyaman Saç Ekimi',
      en: 'Adiyaman Hair Transplant',
      ar: 'زراعة الشعر في أديامان',
      de: 'Haartransplantation Adiyaman',
    },
  },
  {
    slug: 'mardin-sac-ekimi',
    label: {
      tr: 'Mardin Saç Ekimi',
      en: 'Mardin Hair Transplant',
      ar: 'زراعة الشعر في ماردين',
      de: 'Haartransplantation Mardin',
    },
  },
  {
    slug: 'batman-sac-ekimi',
    label: {
      tr: 'Batman Saç Ekimi',
      en: 'Batman Hair Transplant',
      ar: 'زراعة الشعر في باتمان',
      de: 'Haartransplantation Batman',
    },
  },
  {
    slug: 'kilis-sac-ekimi',
    label: {
      tr: 'Kilis Saç Ekimi',
      en: 'Kilis Hair Transplant',
      ar: 'زراعة الشعر في كلس',
      de: 'Haartransplantation Kilis',
    },
  },
  {
    slug: 'osmaniye-sac-ekimi',
    label: {
      tr: 'Osmaniye Saç Ekimi',
      en: 'Osmaniye Hair Transplant',
      ar: 'زراعة الشعر في عثمانية',
      de: 'Haartransplantation Osmaniye',
    },
  },
  {
    slug: 'hatay-sac-ekimi',
    label: {
      tr: 'Hatay Saç Ekimi',
      en: 'Hatay Hair Transplant',
      ar: 'زراعة الشعر في هاتاي',
      de: 'Haartransplantation Hatay',
    },
  },
  {
    slug: 'malatya-sac-ekimi',
    label: {
      tr: 'Malatya Saç Ekimi',
      en: 'Malatya Hair Transplant',
      ar: 'زراعة الشعر في ملاطية',
      de: 'Haartransplantation Malatya',
    },
  },
  {
    slug: 'elazig-sac-ekimi',
    label: {
      tr: 'Elazığ Saç Ekimi',
      en: 'Elazig Hair Transplant',
      ar: 'زراعة الشعر في إلازيغ',
      de: 'Haartransplantation Elazig',
    },
  },
  {
    slug: 'sirnak-sac-ekimi',
    label: {
      tr: 'Şırnak Saç Ekimi',
      en: 'Sirnak Hair Transplant',
      ar: 'زراعة الشعر في شرناق',
      de: 'Haartransplantation Sirnak',
    },
  },
  {
    slug: 'gaziantep-sehitkamil-sac-ekimi',
    label: {
      tr: 'Şehitkamil Saç Ekimi',
      en: 'Sehitkamil Hair Transplant',
      ar: 'زراعة الشعر في شهيد كامل',
      de: 'Haartransplantation Sehitkamil',
    },
  },
  {
    slug: 'gaziantep-sahinbey-sac-ekimi',
    label: {
      tr: 'Şahinbey Saç Ekimi',
      en: 'Sahinbey Hair Transplant',
      ar: 'زراعة الشعر في شاهين بيه',
      de: 'Haartransplantation Sahinbey',
    },
  },
  {
    slug: 'urfa-karakopru-sac-ekimi',
    label: {
      tr: 'Karaköprü Saç Ekimi',
      en: 'Karakopru Hair Transplant',
      ar: 'زراعة الشعر في كاراكوبرو',
      de: 'Haartransplantation Karakopru',
    },
  },
  {
    slug: 'diyarbakir-kayapinar-sac-ekimi',
    label: {
      tr: 'Kayapınar Saç Ekimi',
      en: 'Kayapinar Hair Transplant',
      ar: 'زراعة الشعر في كايابينار',
      de: 'Haartransplantation Kayapinar',
    },
  },
  {
    slug: 'diyarbakir-yenisehir-sac-ekimi',
    label: {
      tr: 'Yenişehir Saç Ekimi',
      en: 'Yenisehir Hair Transplant',
      ar: 'زراعة الشعر في يني شهير',
      de: 'Haartransplantation Yenisehir',
    },
  },
  {
    slug: 'nizip-sac-ekimi',
    label: {
      tr: 'Nizip Saç Ekimi',
      en: 'Nizip Hair Transplant',
      ar: 'زراعة الشعر في نيزيب',
      de: 'Haartransplantation Nizip',
    },
  },
  {
    slug: 'adana-sac-ekimi',
    label: {
      tr: 'Adana Saç Ekimi',
      en: 'Adana Hair Transplant',
      ar: 'زراعة الشعر في أضنة',
      de: 'Haartransplantation Adana',
    },
  },
  {
    slug: 'mersin-sac-ekimi',
    label: {
      tr: 'Mersin Saç Ekimi',
      en: 'Mersin Hair Transplant',
      ar: 'زراعة الشعر في مرسين',
      de: 'Haartransplantation Mersin',
    },
  },
  {
    slug: 'istanbul-sac-ekimi',
    label: {
      tr: 'İstanbul Saç Ekimi',
      en: 'Istanbul Hair Transplant',
      ar: 'زراعة الشعر في إسطنبول',
      de: 'Haartransplantation Istanbul',
    },
  },
  {
    slug: 'ankara-sac-ekimi',
    label: {
      tr: 'Ankara Saç Ekimi',
      en: 'Ankara Hair Transplant',
      ar: 'زراعة الشعر في أنقرة',
      de: 'Haartransplantation Ankara',
    },
  },
  {
    slug: 'izmir-sac-ekimi',
    label: {
      tr: 'İzmir Saç Ekimi',
      en: 'Izmir Hair Transplant',
      ar: 'زراعة الشعر في إزمير',
      de: 'Haartransplantation Izmir',
    },
  },
  {
    slug: 'bursa-sac-ekimi',
    label: {
      tr: 'Bursa Saç Ekimi',
      en: 'Bursa Hair Transplant',
      ar: 'زراعة الشعر في بورصة',
      de: 'Haartransplantation Bursa',
    },
  },
  {
    slug: 'antalya-sac-ekimi',
    label: {
      tr: 'Antalya Saç Ekimi',
      en: 'Antalya Hair Transplant',
      ar: 'زراعة الشعر في أنطاليا',
      de: 'Haartransplantation Antalya',
    },
  },
  {
    slug: 'kayseri-sac-ekimi',
    label: {
      tr: 'Kayseri Saç Ekimi',
      en: 'Kayseri Hair Transplant',
      ar: 'زراعة الشعر في قيصري',
      de: 'Haartransplantation Kayseri',
    },
  },
  {
    slug: 'konya-sac-ekimi',
    label: {
      tr: 'Konya Saç Ekimi',
      en: 'Konya Hair Transplant',
      ar: 'زراعة الشعر في قونية',
      de: 'Haartransplantation Konya',
    },
  },
];

export function getFooterFaqLinks(lang: Language = 'tr'): FooterLinkItem[] {
  return FOOTER_FAQ_DATA.map((item) => ({
    slug: item.slug,
    label: item.label[lang] || item.label.tr,
  }));
}

export function getFooterRegionLinks(lang: Language = 'tr'): FooterLinkItem[] {
  return FOOTER_REGION_DATA.map((item) => ({
    slug: item.slug,
    label: item.label[lang] || item.label.tr,
  }));
}

// Backwards compatibility default exports for TR
export const FOOTER_FAQ_LINKS: FooterLinkItem[] = getFooterFaqLinks('tr');
export const FOOTER_REGION_LINKS: FooterLinkItem[] = getFooterRegionLinks('tr');
