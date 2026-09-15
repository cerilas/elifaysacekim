import { type Language } from '../../i18n';

export interface Chapter {
  start: number;
  end: number;
  label: string;
  title: string;
  subtitle: string;
  annotation: string;
  annotationDetail: string;
}

const CHAPTERS_I18N: Record<Language, Chapter[]> = {
  tr: [
    {
      start: 0,
      end: 0.15,
      label: 'Başlangıç',
      title: 'Doğal sonuçlar,\nyüzeyin altında başlar.',
      subtitle: 'Gaziantep saç ekimi kliniğimizde her bir saç kökü eşsizdir ve mikroskobik hassasiyet gerektirir.',
      annotation: 'Donör Bölge',
      annotationDetail: 'Sağlıklı kök rezervi'
    },
    {
      start: 0.15,
      end: 0.35,
      label: 'Donör Alan',
      title: 'Sağlıklı Greft\nSeçimi',
      subtitle: 'Safir FUE ve Gold FUE için en güçlü, dökülmeye dirençli foliküler üniteler ense donör bölgesinden özenle belirlenir.',
      annotation: 'Foliküler Ünite',
      annotationDetail: 'Doku bütünlüğü korunmuş kökler'
    },
    {
      start: 0.35,
      end: 0.50,
      label: 'Hassas Alım',
      title: 'Mikro Punch ile\nHassas Alım',
      subtitle: 'Köklerin canlılığı ve biyolojik yapısı korunarak mikro punch uçlarıyla tek tek ve homojen toplanır.',
      annotation: 'Hassas FUE Punch',
      annotationDetail: 'Ağrısız, tek tek mikro alım'
    },
    {
      start: 0.50,
      end: 0.65,
      label: 'Transfer',
      title: 'Küçük Ölçekte,\nSınırsız Potansiyel.',
      subtitle: 'Tek bir greft; özel besleyici solüsyonda korunur, Safir ve DHI kanal açımı için titizlikle hazırlanır.',
      annotation: 'Tek Foliküler Greft',
      annotationDetail: 'Saç kılıfı · kök · soğan yapısı'
    },
    {
      start: 0.65,
      end: 0.82,
      label: 'Yerleşim',
      title: 'Yön.\nAçı.\nYoğunluk.',
      subtitle: 'Her bir greft, doğal saç çıkış yönüne ve 38° ideal açıya uygun olarak mikro kanallara yerleştirilir.',
      annotation: '38° Doğal Açı',
      annotationDetail: 'Doğal ön çizgi yerleşimi'
    },
    {
      start: 0.82,
      end: 0.95,
      label: 'Dönüşüm',
      title: 'Kişiye Özel\nDoğal Çizgi.',
      subtitle: 'Bireysel planlama ile uyumlu kök tutunması, şok dökülme sonrası aşamalı ve gür yoğunluk artışı.',
      annotation: 'Aşamalı Uzama',
      annotationDetail: 'Doğal yoğunluk evresi'
    },
    {
      start: 0.95,
      end: 1.0,
      label: 'Sonuç',
      title: 'Kalıcı ve doğal bir saç çizgisi\nasla tesadüf değildir.',
      subtitle: 'Santim santim, kök kök tasarlanır; ömür boyu kalıcı özgüven sağlar.',
      annotation: 'Elif Ay Saç Çizgisi',
      annotationDetail: 'Kalıcı ve doğal sonuç'
    }
  ],
  en: [
    {
      start: 0,
      end: 0.15,
      label: 'Beginning',
      title: 'Natural results\nstart below the surface.',
      subtitle: 'In our Gaziantep clinic, every single hair follicle is unique and demands microscopic precision.',
      annotation: 'Donor Zone',
      annotationDetail: 'Healthy follicle reserve'
    },
    {
      start: 0.15,
      end: 0.35,
      label: 'Donor Area',
      title: 'Healthy Graft\nSelection',
      subtitle: 'For Sapphire FUE and Gold FUE, the strongest, DHT-resistant follicular units are carefully selected.',
      annotation: 'Follicular Unit',
      annotationDetail: 'Intact tissue integrity'
    },
    {
      start: 0.35,
      end: 0.50,
      label: 'Extraction',
      title: 'Gentle Extraction\nvia Micro Punch',
      subtitle: 'Preserving graft vitality and biological structure, follicles are harvested homogeneously.',
      annotation: 'Micro FUE Punch',
      annotationDetail: 'Painless microscopic extraction'
    },
    {
      start: 0.50,
      end: 0.65,
      label: 'Transfer',
      title: 'Infinite Potential\non a Micro Scale.',
      subtitle: 'Each individual graft is protected in nutrient solution and prepped for Sapphire and DHI incisions.',
      annotation: 'Single Follicular Graft',
      annotationDetail: 'Sheath · root · bulb anatomy'
    },
    {
      start: 0.65,
      end: 0.82,
      label: 'Placement',
      title: 'Direction.\nAngle.\nDensity.',
      subtitle: 'Each graft is placed into micro-channels matching natural hair growth direction and the optimal 38° angle.',
      annotation: '38° Natural Angle',
      annotationDetail: 'Natural hairline placement'
    },
    {
      start: 0.82,
      end: 0.95,
      label: 'Transformation',
      title: 'Personalized\nNatural Line.',
      subtitle: 'Harmonious graft adherence, followed by gradual and dense growth after the shock loss phase.',
      annotation: 'Gradual Growth',
      annotationDetail: 'Natural density phase'
    },
    {
      start: 0.95,
      end: 1.0,
      label: 'Outcome',
      title: 'A permanent and natural hairline\nis never an accident.',
      subtitle: 'Designed millimeter by millimeter, root by root; ensuring lifelong confidence.',
      annotation: 'Elif Ay Hairline',
      annotationDetail: 'Permanent, natural results'
    }
  ],
  ar: [
    {
      start: 0,
      end: 0.15,
      label: 'البداية',
      title: 'النتائج الطبيعية\nتبدأ تحت السطح.',
      subtitle: 'في عيادتنا بغازي عنتاب، كل بصيلة شعر هي نسيج فريد يتطلب دقة مجهرية متناهية.',
      annotation: 'المنطقة المانحة',
      annotationDetail: 'مخزون بصيلات سليم'
    },
    {
      start: 0.15,
      end: 0.35,
      label: 'المنطقة المانحة',
      title: 'انتقاء البصيلات\nالسليمة',
      subtitle: 'لتقنيات السفير وغولد FUE، يتم اختيار أقوى البصيلات المقاومة للتساقط من المنطقة المانحة.',
      annotation: 'الوحدة البصيلية',
      annotationDetail: 'بصيلات مكتملة البنية'
    },
    {
      start: 0.35,
      end: 0.50,
      label: 'الاقتطاف الدقيق',
      title: 'اقتطاف لطيف\nبالميكرو بانش',
      subtitle: 'الحفاظ على حيوية البصيلات وبنيتها البيولوجية عبر اقتطاف متجانس وبدون ألم.',
      annotation: 'ميكرو بانش FUE',
      annotationDetail: 'اقتطاف مجهري بدون ألم'
    },
    {
      start: 0.50,
      end: 0.65,
      label: 'التحضير',
      title: 'طاقة لا نهائية\nفي مقياس مجهري.',
      subtitle: 'حفظ البصيلات في محاليل مغذية خاصة وتجهيزها لقنوات السفير وDHI بدقة عالية.',
      annotation: 'طعم بصيلي أحادي',
      annotationDetail: 'الغمد · الجذر · البصيلة'
    },
    {
      start: 0.65,
      end: 0.82,
      label: 'الزراعة والتوجيه',
      title: 'الاتجاه.\nالزاوية.\nالكثافة.',
      subtitle: 'تزرع كل بصيلة باتجاه نمو الشعر الطبيعي وبزاوية مثالية 38 درجة في القنوات المجهرية.',
      annotation: 'زاوية طبيعية 38°',
      annotationDetail: 'رسم خط شعر طبيعي'
    },
    {
      start: 0.82,
      end: 0.95,
      label: 'التحول والنمو',
      title: 'خط شعر طبيعي\nمخصص لكل مريض.',
      subtitle: 'ثبات وتكامل الجذور مع نمو تدريجي وكثيف بعد مرحلة التساقط المؤقت الطبيعية.',
      annotation: 'النمو التدريجي',
      annotationDetail: 'مرحلة الكثافة الطبيعية'
    },
    {
      start: 0.95,
      end: 1.0,
      label: 'النتيجة',
      title: 'خط الشعر الدائم والطبيعي\nليس وليد الصدفة.',
      subtitle: 'تخطيط دقيق بصيلة تلو الأخرى يمنحكم ثقة دائمة ومظهراً ممتلئاً مدى الحياة.',
      annotation: 'خط إليف آي الطبيعي',
      annotationDetail: 'نتائج دائمة وطبيعية'
    }
  ],
  de: [
    {
      start: 0,
      end: 0.15,
      label: 'Beginn',
      title: 'Natürliche Ergebnisse\nbeginnen unter der Oberfläche.',
      subtitle: 'In unserer Klinik in Gaziantep ist jeder Haarfollikel einzigartig und erfordert mikroskopische Präzision.',
      annotation: 'Spenderbereich',
      annotationDetail: 'Gesunde Wurzelreserve'
    },
    {
      start: 0.15,
      end: 0.35,
      label: 'Spenderzone',
      title: 'Auswahl robuster\nGrafts',
      subtitle: 'Für Saphir FUE und Gold FUE werden die widerstandsfähigsten Follikeleinheiten sorgfältig ausgewählt.',
      annotation: 'Follikuläre Einheit',
      annotationDetail: 'Geschütztes Wurzelgewebe'
    },
    {
      start: 0.35,
      end: 0.50,
      label: 'Entnahme',
      title: 'Sanfte Entnahme\nper Mikro-Punch',
      subtitle: 'Schonung der Vitalität und biologischen Struktur durch homogene Einzelentnahme.',
      annotation: 'Mikro FUE Punch',
      annotationDetail: 'Schmerzfreie Mikro-Entnahme'
    },
    {
      start: 0.50,
      end: 0.65,
      label: 'Transfer',
      title: 'Grenzenloses Potenzial\nim kleinsten Maßstab.',
      subtitle: 'Jedes Graft wird in einer Nährlösung geschützt und für Saphir- und DHI-Kanäle vorbereitet.',
      annotation: 'Einzelnes Follikelgraft',
      annotationDetail: 'Haarschaft · Wurzel · Zwiebel'
    },
    {
      start: 0.65,
      end: 0.82,
      label: 'Platzierung',
      title: 'Richtung.\nWinkel.\nDichte.',
      subtitle: 'Jedes Graft wird im natürlichen Wuchs- und 38°-Winkel in Mikrokanäle eingesetzt.',
      annotation: '38° Natürlicher Winkel',
      annotationDetail: 'Natürliche Haarlinie'
    },
    {
      start: 0.82,
      end: 0.95,
      label: 'Wachstum',
      title: 'Maßgeschneiderte\nnatürliche Linie.',
      subtitle: 'Optimale Anwachsrate und stetige Zunahme der Dichte nach der Schockausfallphase.',
      annotation: 'Stetiges Wachstum',
      annotationDetail: 'Volle Dichtephase'
    },
    {
      start: 0.95,
      end: 1.0,
      label: 'Ergebnis',
      title: 'Ein dauerhafter Haaransatz\nist niemals Zufall.',
      subtitle: 'Wurzel für Wurzel, Millimeter für Millimeter geplant – für lebenslanges Selbstvertrauen.',
      annotation: 'Elif Ay Haarlinie',
      annotationDetail: 'Dauerhafte, natürliche Ergebnisse'
    }
  ],
};

export function getChapters(lang: Language = 'tr'): Chapter[] {
  return CHAPTERS_I18N[lang] || CHAPTERS_I18N.tr;
}

export const chapters: Chapter[] = getChapters('tr');

export const clamp = (x: number): number => Math.max(0, Math.min(1, x));

export const smooth = (a: number, b: number, p: number): number => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function chapterAt(p: number): number {
  const idx = chapters.findIndex((c, i) => p >= c.start && (p < c.end || i === 6));
  return idx >= 0 ? idx : 0;
}

export interface Pose {
  release: number;
  travel: number;
  insert: number;
  cut: number;
  donor: number;
  recipient: number;
  growth: number;
  graftX: number;
  graftY: number;
  graftAngle: number;
}

export function pose(p: number): Pose {
  const release = smooth(0.43, 0.51, p);
  const travel = smooth(0.51, 0.66, p);
  const insert = smooth(0.71, 0.81, p);
  return {
    release,
    travel,
    insert,
    cut: smooth(0.10, 0.24, p),
    donor: 1 - smooth(0.50, 0.59, p),
    recipient: smooth(0.60, 0.68, p),
    growth: smooth(0.82, 0.97, p),
    graftX: travel * 1.3,
    graftY: release * 2.6 - insert * 2.6,
    graftAngle: travel * 0.18 + insert * 0.73
  };
}
