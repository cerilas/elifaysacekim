const fs = require('fs');
const path = require('path');

const treatmentsPath = path.join(__dirname, '../src/data/treatments.json');
const treatments = JSON.parse(fs.readFileSync(treatmentsPath, 'utf8'));

const translations = {
  'sac-ekimi': {
    titleEn: 'Gaziantep Hair Transplantation — Gold FUE & Natural Hairline',
    metaTitleEn: 'Gaziantep Hair Transplant Prices 2026 | Elif Ay Clinic',
    metaDescriptionEn: 'Hair transplant in Gaziantep: 3000-5000 graft mega sessions, needle-free painless anesthesia, and natural hairline design. Easy regional access.',
    badgeEn: 'SIGNATURE CLINICAL PROCEDURE',
    summaryEn: 'Customized hairline design matched to your facial proportions, tissue-friendly micro-channels using Gold and Sapphire FUE, and high-density graft placement.',
    highlightsEn: [
      'Transparent 2026 all-inclusive hair transplant packages with installment options',
      '3000 to 5000 grafts mega sessions for maximum coverage and crown restoration',
      'Comfortable needle-free and painless local anesthesia (optional sedation)',
      '12-month post-operative clinical follow-up and remote WhatsApp monitoring'
    ],
    candidatesEn: [
      'Individuals experiencing androgenetic (male pattern) baldness or receding temples',
      'Patients with thinning crown (vertex) seeking first or second session restoration',
      'Controlled medical patients (hypertension, diabetes) under specialist supervision',
      'Men and women with a healthy donor area at the back of the head'
    ],
    stepsEn: [
      {
        number: '01',
        title: 'Custom Hairline Design & Graft Planning',
        titleEn: 'Custom Hairline Design & Graft Planning',
        description: 'Using laser calipers and golden ratio facial aesthetics, an undetectable natural hairline is crafted.',
        descriptionEn: 'Using laser calipers and golden ratio facial aesthetics, an undetectable natural hairline is crafted.'
      },
      {
        number: '02',
        title: 'Painless Local Anesthesia & Extraction',
        titleEn: 'Painless Local Anesthesia & Extraction',
        description: 'Needle-free jet-injection anesthesia followed by gentle micro-punch graft extraction preserving donor density.',
        descriptionEn: 'Needle-free jet-injection anesthesia followed by gentle micro-punch graft extraction preserving donor density.'
      },
      {
        number: '03',
        title: 'Gold & Sapphire Micro-Channel Incision',
        titleEn: 'Gold & Sapphire Micro-Channel Incision',
        description: 'Biocompatible gold-plated and sapphire tips open micro-channels matched to natural 38-degree hair angles.',
        descriptionEn: 'Biocompatible gold-plated and sapphire tips open micro-channels matched to natural 38-degree hair angles.'
      },
      {
        number: '04',
        title: 'Precise Implantation & 12-Month Follow-Up',
        titleEn: 'Precise Implantation & 12-Month Follow-Up',
        description: 'Grafts are gently transferred into channels. Clinical first wash is conducted with full annual medical support.',
        descriptionEn: 'Grafts are gently transferred into channels. Clinical first wash is conducted with full annual medical support.'
      }
    ],
    faqEn: [
      {
        question: 'How much does a hair transplant cost in Gaziantep in 2026?',
        answer: 'Prices in 2026 are determined by graft count (3000 to 5000 grafts) and the selected surgical method (Sapphire FUE or DHI). We provide transparent all-inclusive packages covering consultation, anesthesia, PRP, medical care kits, and first wash with no hidden per-graft fees.'
      },
      {
        question: 'How long does the surgery take and does it hurt?',
        answer: 'The procedure takes between 5 and 7 hours. With our needle-free jet injection local anesthesia protocol, you feel no pain during extraction or channel opening.'
      },
      {
        question: 'Does shock loss happen and does the crown area grow successfully?',
        answer: 'Shock loss occurs temporarily between weeks 2 and 8, resolving by month 3. Permanent hair growth begins from month 3 onwards. With Sapphire micro-incisions, crown area graft survival rates exceed 90%.'
      }
    ],
    contentHtmlEn: '<h2>Leading Hair Restoration in Gaziantep: Elif Ay Clinic</h2><p>Hair transplantation is a microsurgical art that restores facial harmony. Led by Specialist Elif Ay with over 15 years of experience, we provide boutique gold-standard Safir FUE and DHI procedures in Gaziantep.</p>',

    // Arabic
    titleAr: 'زراعة الشعر في غازي عنتاب — تقنية جولد FUE وخط الشعر الطبيعي',
    metaTitleAr: 'أسعار زراعة الشعر في غازي عنتاب 2026 | عيادة إليف آي',
    metaDescriptionAr: 'زراعة الشعر في غازي عنتاب: جلسات مكثفة 3000-5000 بصيلة، تخدير غير مؤلم بدون إبر، وخط شعر طبيعي مع متابعة طبية كاملة.',
    badgeAr: 'الإجراء السريري الرائد',
    summaryAr: 'تصميم خط شعر مخصص يتناسب مع ملامح وجهك، فتح قنوات مجهرية لطيفة بتقنية Gold و Safir FUE، وزراعة بصيلات عالية الكثافة تدوم مدى الحياة.',
    highlightsAr: [
      'باقات شاملة وشفافة لأسعار عام 2026 مع تسهيلات الدفع',
      'جلسات مكثفة من 3000 إلى 5000 بصيلة لتغطية كاملة لمنطقة التاج ومقدمة الرأس',
      'تخدير موضعي مريح بدون إبر مع خيار التسكين الخفيف',
      'متابعة طبية سريرية منتظمة لمدة 12 شهراً عبر الواتساب'
    ],
    candidatesAr: [
      'الذين يعانون من الصلع الوراثي وتراجع خط الشعر الأمامي',
      'من يعانون من فراغات في منطقة التاج (قمة الرأس)',
      'مرضى السكري والضغط تحت إشراف بروتوكول طبي خاص',
      'الرجال والنساء الذين يمتلكون منطقة مانحة جيدة في مؤخرة الرأس'
    ],
    stepsAr: [
      {
        number: '01',
        title: 'تخطيط خط الشعر وعدد البصيلات',
        description: 'تحديد خط الشعر الطبيعي باستخدام المقاييس الليزرية والنسبة الذهبية بما يلائم تقاسيم الوجه.'
      },
      {
        number: '02',
        title: 'تخدير بدون إبر واقتطاف البصيلات',
        description: 'تخدير موضعي بالضغط غير مؤلم واقتطاف متوازن للبصيلات من المنطقة المانحة بأجهزة الميكروبنش.'
      },
      {
        number: '03',
        title: 'فتح القنوات برؤوس الذهب والياقوت',
        description: 'فتح قنوات مجهرية فائقة الدقة بزاوية 38 درجة طبيعية تحافظ على حيوية الأنسجة وتمنع النزيف.'
      },
      {
        number: '04',
        title: 'الزراعة الدقيقة والمتابعة السنوية',
        description: 'غرس البصيلات المقتطفة بعناية، وإجراء الغسيل الأول في العيادة مع متابعة مستمرة لمدة 12 شهراً.'
      }
    ],
    faqAr: [
      {
        question: 'كم تبلغ تكلفة زراعة الشعر في غازي عنتاب لعام 2026؟',
        answer: 'تحدد التكلفة بناءً على عدد البصيلات (3000 إلى 5000 بصيلة) والتقنية المستخدمة. نقدم باقات شاملة تتضمن التخدير بدون إبر، علاج بلازما الدم، وحقيبة العلاج الطبي دون أي تكاليف خفية.'
      },
      {
        question: 'كم تستغرق العملية وهل هناك ألم؟',
        answer: 'تستغرق العملية ما بين 5 إلى 7 ساعات. وبفضل تقنية التخدير بدون إبر، لا يشعر المريض بأي ألم طوال فترة العملية.'
      }
    ],
    contentHtmlAr: '<h2>الريادة في زراعة الشعر في غازي عنتاب: نهج إليف آي</h2><p>زراعة الشعر فن جراحي دقيق يعيد التوازن والجاذبية للوجه. تحت إشراف الأخصائية إليف آي بخبرة تتجاوز 15 عاماً، نقدم أعلى معايير الجودة بتقنيات السفير FUE و DHI المتقدمة.</p>',

    // German
    titleDe: 'Haartransplantation Gaziantep — Gold FUE & Natürlicher Haaransatz',
    metaTitleDe: 'Haartransplantation Gaziantep Preise 2026 | Elif Ay Klinik',
    metaDescriptionDe: 'Haartransplantation in Gaziantep: 3000-5000 Grafts Mega-Sitzungen, schmerzfreie Nadelfreie Anästhesie und natürliche Haarlinie. Jetzt kostenlose Analyse anfordern.',
    badgeDe: 'FÜHRENDE KLINISCHE BEHANDLUNG',
    summaryDe: 'Individuelles Design des Haaransatzes passend zu Ihren Gesichtsproportionen, gewebeschonende Gold FUE Mikrokanäle und dauerhafte Dichte.',
    highlightsDe: [
      'Transparente All-Inclusive-Preispakete 2026 ohne versteckte Kosten',
      '3000 bis 5000 Grafts Mega-Sitzung für maximale Haardichte und Tonsurbereich',
      'Nadelfreie und schmerzfreie lokale Anästhesie (optional mit Sedierung)',
      '12 Monate strukturierte klinische Nachsorge und WhatsApp-Fotobegleitung'
    ],
    candidatesDe: [
      'Personen mit erblich bedingtem Haarausfall oder Geheimratsecken',
      'Patienten mit Ausdünnung im Tonsurbereich (Vertex)',
      'Personen mit Bluthochdruck oder Diabetes unter kontrolliertem medizinischem Protokoll',
      'Männer und Frauen mit ausreichendem Spenderbereich am Hinterkopf'
    ],
    stepsDe: [
      {
        number: '01',
        title: 'Haarlinien-Design & Graft-Planung',
        description: 'Mit Lasermessung und dem Goldenen Schnitt wird eine maßgeschneiderte, natürliche Haarlinie gezeichnet.'
      },
      {
        number: '02',
        title: 'Nadelfreie Anästhesie & Entnahme',
        description: 'Schmerzfreie Druckanästhesie und homogene Einzelhaarentnahme mittels Mikromotor-Punch.'
      },
      {
        number: '03',
        title: 'Kanalöffnung mit Gold- & Saphirspitzen',
        description: 'Gewebeschonende Mikrokanäle im natürlichen 38-Grad-Wuchswinkel minimieren Schwellungen.'
      },
      {
        number: '04',
        title: 'Präzise Implantation & 12 Monate Nachsorge',
        description: 'Schonendes Einsetzen der Grafts, Erstwäsche in der Klinik und 1 Jahr ärztliche Betreuung.'
      }
    ],
    faqDe: [
      {
        question: 'Wie hoch sind die Kosten für eine Haartransplantation in Gaziantep 2026?',
        answer: 'Die Preise richten sich nach der Anzahl der Grafts (3000 bis 5000 Grafts) und der gewählten Technik. Wir bieten transparente All-Inclusive-Pakete mit Voruntersuchung, nadelfreier Betäubung, PRP-Behandlung und Pflegeset ohne versteckte Graft-Gebühren.'
      },
      {
        question: 'Wie lange dauert der Eingriff und ist er schmerzhaft?',
        answer: 'Die Behandlung dauert etwa 5 bis 7 Stunden. Dank unserer nadelfreien Komfortanästhesie verläuft die gesamte Behandlung völlig schmerzfrei.'
      }
    ],
    contentHtmlDe: '<h2>Haartransplantation in Gaziantep: Der Ansatz von Elif Ay</h2><p>Eine Haartransplantation ist mikrometergenaue Maßarbeit. Unter der Leitung von Spezialistin Elif Ay bieten wir seit über 15 Jahren modernste Gold FUE und DHI Methoden für dauerhaft dichtes Haar.</p>'
  },

  'kas-ekimi': {
    titleEn: 'Gaziantep Eyebrow Transplantation — Women’s DHI & Natural Arch Design',
    metaTitleEn: 'Gaziantep Eyebrow Transplant Prices 2026 | Elif Ay Clinic',
    metaDescriptionEn: 'Eyebrow transplant in Gaziantep: Restoration for over-plucked brows, scars, and cover-up for microblading tattoos. Natural horizontal growth angles.',
    badgeEn: 'WOMEN’S AESTHETIC SPECIALTY',
    summaryEn: 'Harmonious eyebrow shape customized to your facial arch; ultra-fine single hair follicles transplanted with zero incision scars using DHI Choi implanters.',
    highlightsEn: [
      '100% natural hair camouflage over faded microblading or cosmetic tattoos',
      'Precise 10-15 degree flat exit angle mimicking natural eyebrow growth',
      'Customized arch restoration tailored to eye and forehead proportions',
      'No incisions or stitches: painless 2-3 hour procedure with Choi implanter pen'
    ],
    candidatesEn: [
      'Women with thinned or dormant brows due to frequent over-plucking',
      'Those seeking natural hair volume over faded or discolored microblading tattoos',
      'Patients with trauma, burn, surgery, or stitch scars in the eyebrow area',
      'Individuals with genetically sparse or short eyebrow arches'
    ],
    stepsEn: [
      {
        number: '01',
        title: 'Facial Proportion Eyebrow Design',
        description: 'Eye symmetry and facial expressions are analyzed to draw an authentic, flattering eyebrow curve.'
      },
      {
        number: '02',
        title: 'Single Fine Follicle Selection',
        description: 'Micro-punches delicately extract the finest single hair follicles from the lower nape area.'
      },
      {
        number: '03',
        title: 'Zero-Incision DHI Implantation',
        description: 'Choi implanter pens place each graft at a flat 10-15 degree angle matching natural eyebrow growth.'
      },
      {
        number: '04',
        title: 'Rapid Recovery & Natural Growth',
        description: 'Micro-crusts wash away in 3 days. Permanent, natural growth starts from month 3 onward.'
      }
    ],
    faqEn: [
      {
        question: 'Does eyebrow transplantation work over microblading tattoos?',
        answer: 'Yes, living hair roots thrive over microbladed or tattooed skin. The transplanted hairs cover the artificial ink pigment, giving real 3-dimensional texture.'
      },
      {
        question: 'Do transplanted eyebrows look natural or grow straight out?',
        answer: 'Eyebrow hairs grow at an acute 10 to 15-degree angle flat against the skin. DHI Choi pens replicate this exact angle, ensuring they lie perfectly flat and natural.'
      }
    ],
    contentHtmlEn: '<h2>Redefine Your Expression with Natural Eyebrow Transplantation</h2><p>Eyebrows define facial harmony and eye expression. Sparse or over-plucked eyebrows can be permanently restored in our Gaziantep clinic using gentle DHI Choi implanter technology.</p>',

    // Arabic
    titleAr: 'زراعة الحواجب في غازي عنتاب — تقنية DHI وتصميم القوس الطبيعي للنساء',
    metaTitleAr: 'أسعار زراعة الحواجب في غازي عنتاب 2026 | عيادة إليف آي',
    metaDescriptionAr: 'زراعة الحواجب للنساء في غازي عنتاب: حل دائم لتساقط الحواجب وتغطية تاتو المايكروبليدنج وإخفاء الندبات بزوايا نمو طبيعية 10-15 درجة.',
    badgeAr: 'تجميل متخصص للنساء',
    summaryAr: 'تصميم قوس حاجب طبيعي متناسق مع ملامح الوجه، ونقل بصيلات أحادية فائقة النعومة من مؤخرة الرأس بقلم تشوي DHI بدون أي ندبات.',
    highlightsAr: [
      'تغطية شعر طبيعي بنسبة 100% فوق تاتو المايكروبليدنج الباهت',
      'زاوية خروج أفقية دقيقة تتراوح بين 10 إلى 15 درجة لضمان المظهر الطبيعي',
      'تصميم مخصص لقوس الحاجب يعيد نضارة وجاذبية النظرة',
      'إجراء مريح يستغرق ساعتين إلى ثلاث ساعات بدون جراحة أو خياطة'
    ],
    candidatesAr: [
      'النساء اللاتي يعانين من ترقق أو تلف الحواجب بسبب النتف المتكرر',
      'الراغبات في مظهر شعر حقيقي ثلاثي الأبعاد فوق المايكروبليدنج',
      'حالات وجود ندبات جراحية أو حروق في منطقة الحاجب',
      'من يمتلكن حواجب خفيفة وراثياً'
    ],
    stepsAr: [
      {
        number: '01',
        title: 'رسم وتصميم الحاجب المناسب للوجه',
        description: 'دراسة أبعاد العين والجبين لرسم قوس حاجب جذاب وطبيعي بموافقة المريضة.'
      },
      {
        number: '02',
        title: 'انتقاء البصيلات الأحادية الرقيقة',
        description: 'اقتطاف أدق البصيلات الفردية من أسفل الرقبة لتطابق بنية شعر الحاجب الأصلية.'
      },
      {
        number: '03',
        title: 'الزراعة المباشرة بأقلام DHI تشوي',
        description: 'غرس البصيلات بزاوية مسطحة موازية للجلد (10-15 درجة) دون الحاجة لفتح قنوات مسبقة.'
      },
      {
        number: '04',
        title: 'الشفاء السريع والنمو الطبيعي',
        description: 'تزول القشور الخفيفة خلال 3 أيام، وتبدأ الحواجب بالنمو الدائم ابتداءً من الشهر الثالث.'
      }
    ],
    faqAr: [
      {
        question: 'هل تنجح زراعة الحواجب فوق تاتو المايكروبليدنج؟',
        answer: 'نعم، تنمو البصيلات الحية فوق الجلد المصبوغ بنجاح تام، وتغطي صبغات التاتو مما يمنح مظهراً حقيقياً وطبيعياً 100%.'
      },
      {
        question: 'هل يبدو اتجاه شعر الحاجب المزروع طبيعياً؟',
        answer: 'بفضل أقلام DHI تشوي، تُزرع الشعيرات بزاوية نوم مسطحة موازية للجلد (10 إلى 15 درجة)، فلا تقف الشعيرات مستقيمة أبداً بل تنمو بانسيابية تامة.'
      }
    ],
    contentHtmlAr: '<h2>استعيدي إشراقة نظرتك مع زراعة الحواجب الطبيعية</h2><p>الحواجب هي الإطار الأساسي لجمال الوجه. في عيادة إليف آي بغازي عنتاب، نقوم بتصحيح فراغات الحواجب وتعديل أخطاء المايكروبليدنج بأحدث تقنيات DHI المجهرية الدقيقة.</p>',

    // German
    titleDe: 'Augenbrauentransplantation Gaziantep — Speziell für Frauen mit DHI',
    metaTitleDe: 'Augenbrauentransplantation Gaziantep Preise 2026 | Elif Ay',
    metaDescriptionDe: 'Augenbrauentransplantation in Gaziantep: Dauerhafte Lösung für dünne Brauen, Narben und Microblading-Korrektur mit natürlichen Wuchswinkeln.',
    badgeDe: 'ÄSTHETIK FÜR FRAUEN',
    summaryDe: 'Perfekt geschwungene, natürliche Augenbrauenform abgestimmt auf Ihre Gesichtszüge. Feine Einzelhaarwurzeln ohne Schnittnarben mit DHI Choi-Stift.',
    highlightsDe: [
      '100% natürlicher Haarwuchs über verblasstem Microblading oder Permanent Make-up',
      'Extrem flacher Austrittswinkel von 10-15 Grad für absolut natürliches Anliegen',
      'Individuelle Brauenbogen-Modellierung passend zur Gesichtsgeometrie',
      'Schmerzfreie 2-3 stündige Behandlung ohne Schnitte oder Nähte mit dem DHI-Stift'
    ],
    candidatesDe: [
      'Frauen mit durch wiederholtes Zupfen ausgedünnten Augenbrauen',
      'Personen, die künstliches Microblading durch echte Haare ersetzen möchten',
      'Narben durch Unfälle, Verbrennungen oder Operationen im Brauenbereich',
      'Genetisch bedingt lückenhafte oder kurze Augenbrauen'
    ],
    stepsDe: [
      {
        number: '01',
        title: 'Individuelles Brauendesign',
        description: 'Exakte Vermessung der Augenpartie und Zeichnung des optimalen Brauenbogens.'
      },
      {
        number: '02',
        title: 'Schonende Entnahme feinster Einzelgrafts',
        description: 'Sorgfältige Isolierung feinster Einzelhaare aus dem unteren Nackenbereich.'
      },
      {
        number: '03',
        title: 'Direktimplantation mit dem DHI Choi-Stift',
        description: 'Setzen der Wurzeln im extrem flachen 10-15 Grad Winkel passend zum Naturwuchs.'
      },
      {
        number: '04',
        title: 'Schnelle Heilung & natürlicher Wuchs',
        description: 'Krüstchen lösen sich nach 3 Tagen. Ab dem 3. Monat wachsen dauerhaft dichte Brauen.'
      }
    ],
    faqDe: [
      {
        question: 'Funktioniert eine Augenbrauentransplantation über altem Microblading?',
        answer: 'Ja, lebende Haarwurzeln wachsen auf pigmentierter Haut hervorragend an. Sie überdecken die künstliche Farbzeichnung und erzeugen echte dreidimensionale Haarfülle.'
      },
      {
        question: 'Liegen die transplantierten Brauenhaare natürlich flach an?',
        answer: 'Mit der DHI Choi-Stift-Technik wird der natürliche flache Winkel von 10-15 Grad exakt vorgegeben. Ein borstiges Abstehen wird dadurch vollständig verhindert.'
      }
    ],
    contentHtmlDe: '<h2>Ausdrucksstarke Blicke mit natürlicher Augenbrauentransplantation</h2><p>Augenbrauen prägen die Mimik entscheidend. Ausgedünnte oder durch falsches Zupfen geschädigte Augenbrauen können in unserer Klinik in Gaziantep dauerhaft und narbenfrei wiederhergestellt werden.</p>'
  },

  'sakal-ekimi': {
    titleEn: 'Gaziantep Beard and Mustache Transplantation — Patchy Beard & Scar Repair',
    metaTitleEn: 'Gaziantep Beard Transplant Prices | Elif Ay Hair Center',
    metaDescriptionEn: 'Beard transplant in Gaziantep: Natural angle beard and mustache restoration for patchy areas, burn scars, and sideburn filling. 2026 pricing.',
    badgeEn: 'MEN’S AESTHETIC RESTORATION',
    summaryEn: 'For men with patchy beards, alopecia, or surgical scars: full natural jawline, mustache, and sideburn restoration matched to natural facial angles.',
    highlightsEn: [
      'Complete natural beard restoration for patchy or patchy growth',
      'Scar camouflage for burns, cuts, acne, or surgical suture lines',
      '1000 to 2500 grafts for custom sideburn, cheek, and chin density',
      'Zero visible scarring using micro-punch extraction from under chin or nape'
    ],
    candidatesEn: [
      'Men with genetically patchy, sparse, or completely absent beard growth',
      'Individuals with patchy hair loss on the cheeks, chin, or mustache',
      'Men with burn, trauma, or surgical scars in the facial hair area',
      'Those seeking a sharper, denser sideburn and jawline contour'
    ],
    stepsEn: [
      {
        number: '01',
        title: 'Jawline & Beard Line Design',
        description: 'Cheekbones, jaw contour, and lip symmetry guide the drawing of a masculine, natural beard line.'
      },
      {
        number: '02',
        title: 'Single Fine Follicle Extraction',
        description: 'Compatible single hair follicles are extracted from the nape or lower beard line with micro-punch tools.'
      },
      {
        number: '03',
        title: '25-30 Degree Natural Angle Implantation',
        description: 'Cheek grafts are implanted at a low 25-30 degree angle, adjusting to natural contours towards the chin.'
      },
      {
        number: '04',
        title: 'Scarless Healing & Shaving Freedom',
        description: 'Micro-crusts disappear within 7-10 days. After 3 months, full regular shaving is completely restored.'
      }
    ],
    faqEn: [
      {
        question: 'Does a beard transplant work for patchy or hairless areas?',
        answer: 'Yes, beard transplantation has over 95% survival rates. 1000 grafts can define sideburns and chin, while 2000-2500 grafts provide full cheek coverage.'
      },
      {
        question: 'Can you shave normally after a beard transplant?',
        answer: 'Trimming with scissors is allowed after 1 month. From month 3 onward, you can freely use safety razors or electric shavers as with your natural beard.'
      }
    ],
    contentHtmlEn: '<h2>Personalized Beard and Mustache Restoration in Gaziantep</h2><p>A full, symmetrical beard enhances masculine facial aesthetics and confidence. Our microsurgical techniques ensure scar-free, natural-looking beard and mustache density.</p>',

    // Arabic
    titleAr: 'زراعة اللحية والشارب في غازي عنتاب — علاج فراغات اللحية وإخفاء الندبات',
    metaTitleAr: 'أسعار زراعة اللحية في غازي عنتاب | عيادة إليف آي',
    metaDescriptionAr: 'زراعة اللحية والشارب في غازي عنتاب: حل فراغات الذقن، زراعة السوالف، وتغطية ندبات الحروق والعمليات الجراحية بزوايا نمو طبيعية.',
    badgeAr: 'تجميل متخصص للرجال',
    summaryAr: 'للرجال الذين يعانون من قلة كثافة اللحية أو غيابها أو وجود ندبات: تصميم لحية وسوالف متناسقة مع عظام الفك وبزوايا نمو مطابقة للواقع.',
    highlightsAr: [
      'علاج متكامل لغياب شعر اللحية وبناء خط لحية رجولي وجذاب',
      'تغطية تامة لآثار الحروق والندبات الجراحية وعلامات حب الشباب',
      'كثافة عالية من 1000 إلى 2500 بصيلة مخصصة للسوالف والخدين والذقن',
      'اقتطاف بدون أي أثر ظاهر من أسفل الرقبة أو مؤخرة الرأس'
    ],
    candidatesAr: [
      'الرجال الذين يعانون من انعدام اللحية أو قلة نموها وراثياً',
      'من يعانون من فراغات بقعية في الخدين أو الشارب أو الذقن',
      'حالات وجود ندبات حروق أو خياطة جراحية في الوجه',
      'الراغبون في تحديد خط السوالف والفك بدقة'
    ],
    stepsAr: [
      {
        number: '01',
        title: 'تحديد وتصميم خط اللحية الرجولي',
        description: 'رسم خط السوالف والذقن والوجنتين بما يتناسب مع ملامح الفك وشكل الوجه.'
      },
      {
        number: '02',
        title: 'اقتطاف البصيلات الأحادية المتوافقة',
        description: 'جمع بصيلات فردية ناعمة من المنطقة المانحة تحاكي طبيعة شعر الوجه.'
      },
      {
        number: '03',
        title: 'الزراعة بزاوية طبيعية 25-30 درجة',
        description: 'غرس البصيلات في الخدين بزاوية مائلة 25 إلى 30 درجة لتبدو طبيعية تماماً.'
      },
      {
        number: '04',
        title: 'شفاء سريع وحرية كاملة للحلاقة',
        description: 'تزول القشور خلال 7 إلى 10 أيام، وبعد 3 أشهر يمكن حلاقة اللحية بالشفرة أو الماكينة كالمعتاد.'
      }
    ],
    faqAr: [
      {
        question: 'هل تنجح زراعة اللحية لمن لا تنمو لديهم لحية نهائياً؟',
        answer: 'نعم، تحقق زراعة اللحية نجاحاً يتجاوز 95%. وتكفي 1000 بصيلة لتحديد السوالف والذقن، بينما تحتاج اللحية الكاملة إلى 2000-2500 بصيلة.'
      },
      {
        question: 'متى يمكن حلاقة اللحية بعد الزراعة؟',
        answer: 'يمكن تهذيب اللحية بالمقص بعد شهر، وبعد مرور 3 أشهر يمكن الحلاقة بالموس والشفرات الكهربائية بكل حرية.'
      }
    ],
    contentHtmlAr: '<h2>استعادة كثافة وجاذبية اللحية والشارب في غازي عنتاب</h2><p>تمنح اللحية المتناسقة مظهراً رجولياً وجاذبية خاصة. في عيادتنا بغازي عنتاب، نستخدم أدق التقنيات لزراعة شعر اللحية بزوايا انسيابية دون ترك أي أثر.</p>',

    // German
    titleDe: 'Bart- und Schnurrbarttransplantation Gaziantep — Lücken & Narbenkorrektur',
    metaTitleDe: 'Barttransplantation Gaziantep Preise | Elif Ay Haarklinik',
    metaDescriptionDe: 'Barttransplantation in Gaziantep: Schließen von Lücken im Bart, Koteletten-Verdichtung und Überdeckung von Brandnarben. Natürliche Wuchswinkel.',
    badgeDe: 'MÄNNERÄSTHETIK',
    summaryDe: 'Für Männer mit lückenhaftem Bartwuchs, Narben oder fehlendem Bart: Maskuline Kieferlinien, Schnurrbart und Koteletten im natürlichen Wuchswinkel.',
    highlightsDe: [
      'Gleichmäßiger Vollbart bei genetisch fehlendem oder spärlichem Bartwuchs',
      'Effektive Narbenüberdeckung bei Schnittwunden, Brandnarben oder Akne',
      '1000 bis 2500 Grafts für präzise Koteletten-, Wangen- und Kinndichte',
      'Narbenfreie Entnahme feiner Einzelhaare aus dem Nacken oder Halsbereich'
    ],
    candidatesDe: [
      'Männer mit unregelmäßigem oder genetisch unvollständigem Bartwuchs',
      'Personen mit kreisrunden Lücken im Wangen- oder Kinnbereich',
      'Männer mit Unfall-, OP- oder Brandnarben im Gesichtsbereich',
      'Patienten, die ihre Konturen und Koteletten verdichten möchten'
    ],
    stepsDe: [
      {
        number: '01',
        title: 'Design der Bartkontur',
        description: 'Exakte Vorzeichnung der Wangen- und Kieferlinie abgestimmt auf die Gesichtsform.'
      },
      {
        number: '02',
        title: 'Schonende Entnahme von Barthaar-Grafts',
        description: 'Präzise Einzelhaarentnahme aus Spenderzonen, die der Bartstruktur gleichen.'
      },
      {
        number: '03',
        title: 'Einsetzen im natürlichen 25-30 Grad Winkel',
        description: 'Wangenhaare werden flach nach unten gerichtet implantiert, um Naturtreue zu garantieren.'
      },
      {
        number: '04',
        title: 'Spurenlose Heilung & Rasierfreiheit',
        description: 'Nach 7-10 Tagen ist die Haut abgeheilt. Ab dem 3. Monat ist normales Rasieren möglich.'
      }
    ],
    faqDe: [
      {
        question: 'Wächst ein transplantierter Bart dauerhaft an?',
        answer: 'Ja, die Anwachsrate liegt bei über 95%. Für Koteletten und Kinn genügen oft 1000 Grafts, für einen Vollbart werden 2000-2500 Grafts benötigt.'
      },
      {
        question: 'Wann kann man sich nach der Barttransplantation wieder rasieren?',
        answer: 'Nach einem Monat darf mit der Schere gekürzt werden; ab dem 3. Monat kann wie gewohnt mit Nassrasierer oder Maschine rasiert werden.'
      }
    ],
    contentHtmlDe: '<h2>Maßgeschneiderte Bart- und Schnurrbartkorrektur in Gaziantep</h2><p>Ein dichter, wohlgeformter Bart verleiht maskuline Konturen. In unserer Klinik in Gaziantep pflanzen wir feine Einzelwurzeln im exakten anatomischen Winkel ein.</p>'
  },

  'safir-fue-sac-ekimi': {
    titleEn: 'Gaziantep Sapphire FUE Hair Transplant — Antibacterial Micro-Channels',
    metaTitleEn: 'Gaziantep Sapphire FUE Hair Transplant | Painless Micro-Incision',
    metaDescriptionEn: 'Sapphire FUE in Gaziantep: Ultra-smooth sapphire crystal blades, maximum graft density per cm², fast healing, and zero visible scars.',
    badgeEn: 'ADVANCED TECHNOLOGY',
    summaryEn: 'Genuine gemstone sapphire crystal blades create smooth V-shaped micro-channels, ensuring zero tissue tearing, minimal crusting, and maximum hair density.',
    highlightsEn: [
      'Authentic antibacterial sapphire blades minimizing tissue trauma',
      'V-shaped micro-channel geometry keeping grafts firmly anchored at 38°',
      'Painless needle-free local anesthesia for patient comfort',
      'High-density placement (up to 50-55 grafts/cm²) for rapid recovery'
    ],
    candidatesEn: [
      'Patients demanding maximum graft density per square centimeter',
      'Individuals wishing to return to work and social life within days',
      'Patients with sensitive scalps seeking minimal swelling and redness',
      'Those needing 3000 to 5000 graft mega sessions in a single day'
    ],
    stepsEn: [
      {
        number: '01',
        title: 'Sapphire Blade Sizing',
        description: 'Micro-blades between 1.0 mm and 1.4 mm are matched to the thickness of individual hair follicles.'
      },
      {
        number: '02',
        title: 'Smooth V-Channel Creation',
        description: 'Sapphire crystals open clean incisions along the 38-degree natural exit angle without tissue tearing.'
      },
      {
        number: '03',
        title: 'Secure Graft Placement',
        description: 'Follicles nest securely within V-shaped incisions, preventing displacement or angle deviation.'
      },
      {
        number: '04',
        title: '30% Faster Tissue Healing',
        description: 'Antibacterial crystal contact accelerates recovery; micro-crusts wash away in 5-7 days.'
      }
    ],
    faqEn: [
      {
        question: 'What is the difference between classic steel slits and Sapphire FUE?',
        answer: 'Steel blades can dull and cause microscopic tissue tearing. Sapphire blades are ultra-smooth, hypoallergenic crystals that open clean micro-incisions, healing 30% faster with virtually no scarring.'
      }
    ],
    contentHtmlEn: '<h2>Advantages of Sapphire FUE Technology in Gaziantep</h2><p>Sapphire FUE represents the gold standard in modern surgical hair restoration. At our clinic in Gaziantep, single-use genuine sapphire blades ensure optimal scalp protection and maximum graft density.</p>',

    // Arabic
    titleAr: 'زراعة الشعر بتقنية السفير FUE في غازي عنتاب — قنوات مجهرية بحجر الياقوت',
    metaTitleAr: 'زراعة الشعر بالسفير FUE غازي عنتاب | شفرات الياقوت المجهرية',
    metaDescriptionAr: 'زراعة الشعر بالسفير FUE في غازي عنتاب: شفرات حجر الياقوت المضادة للبكتيريا، كثافة قصوى في السنتيمتر المربع، وشفاء سريع بدون ندبات.',
    badgeAr: 'تكنولوجيا متطورة',
    summaryAr: 'شفرات مصنوعة من حجر الياقوت الطبيعي لفتح قنوات مجهرية على شكل حرف V بدون تمزق الأنسجة، مما يمنح كثافة شعر فائقة وسرعة تعافي قياسية.',
    highlightsAr: [
      'شفرات ياقوت أصلية مضادة للبكتيريا تقلل صدمة الأنسجة بنسبة 30%',
      'قنوات مجهرية على شكل V تثبت البصيلات بزاوية 38 درجة طبيعية تماماً',
      'تخدير مريح بدون إبر لراحة المريض التامة طوال الإجراء',
      'إمكانية زراعة كثافة عالية تصل إلى 50-55 بصيلة في السنتيمتر المربع'
    ],
    candidatesAr: [
      'الراغبون في الحصول على أعلى كثافة شعر ممكنة',
      'من يرغبون في العودة السريعة لعملهم وحياتهم الاجتماعية',
      'أصحاب فروة الرأس الحساسة الراغبين في تفادي التورم والاحمرار',
      'حالات الصلع الكبيرة التي تتطلب زراعة 3000 إلى 5000 بصيلة'
    ],
    stepsAr: [
      {
        number: '01',
        title: 'اختيار مقاس شفرة الياقوت',
        description: 'تحديد قياس شفرات السفير بين 1.0 مم و 1.4 مم بدقة حسب سماكة البصيلات.'
      },
      {
        number: '02',
        title: 'فتح القنوات المجهرية الدقيقة',
        description: 'فتح قنوات سلسة بزاوية 38 درجة تحاكي اتجاه نمو الشعر الأصلي دون أي تمزق.'
      },
      {
        number: '03',
        title: 'تثبيت البصيلات في القنوات',
        description: 'تستقر البصيلات داخل قنوات حرف V بإحكام وتمنع تحركها بعد العملية.'
      },
      {
        number: '04',
        title: 'تعافي سريع للأنسجة',
        description: 'تتساقط القشور خلال 5-7 أيام بفضل النعومة الفائقة لشفرات الياقوت.'
      }
    ],
    faqAr: [
      {
        question: 'ما هو الفرق بين شفرات المعدن التقليدية وشفرات السفير؟',
        answer: 'الشفرات المعدنية قد تفقد حدتها وتسبب تمزقاً مجهرياً للأنسجة، بينما شفرات الياقوت فائقة النعومة ومضادة للبكتيريا، فتفتح شقوقاً أصغر بكثير وتلتئم أسرع بنسبة 30% دون ترك أي ندبة.'
      }
    ],
    contentHtmlAr: '<h2>مزايا تقنية السفير FUE في غازي عنتاب</h2><p>تعتبر تقنية السفير التطور الذهبي لزراعة الشعر. في عيادة إليف آي بغازي عنتاب، نستخدم شفرات ياقوت جديدة ومعقمة لكل مريض لضمان أعلى نسب النجاح والكثافة.</p>',

    // German
    titleDe: 'Saphir FUE Haartransplantation Gaziantep — Antibakterielle Mikroklingen',
    metaTitleDe: 'Saphir FUE Haartransplantation Gaziantep | Schmerzfreie Mikrokanäle',
    metaDescriptionDe: 'Saphir FUE in Gaziantep: Echte Saphirkristallklingen für V-förmige Kanäle, maximale Haardichte pro cm² und 30% schnellere Heilung.',
    badgeDe: 'MODERNSTE TECHNOLOGIE',
    summaryDe: 'Glattgeschliffene Saphirkristall-Klingen öffnen V-förmige Mikrokanäle ohne Gewebetrauma für minimale Krustenbildung und höchste Dichte.',
    highlightsDe: [
      'Echte antibakterielle Saphirklingen für minimale Gewebereizung',
      'V-förmige Kanalgeometrie fixiert Grafts im natürlichen 38-Grad-Winkel',
      'Nadelfreie lokale Anästhesie für maximalen Patientenkomfort',
      'Hohe Dichte von bis zu 50-55 Grafts pro cm² mit schneller Erholung'
    ],
    candidatesDe: [
      'Patienten, die maximale Haardichte pro Quadratzentimeter wünschen',
      'Personen, die schnell in Beruf und Alltag zurückkehren möchten',
      'Patienten mit empfindlicher Kopfhaut, die Schwellungen minimieren wollen',
      'Umfangreiche Haarausfallbereiche mit 3000 bis 5000 Grafts'
    ],
    stepsDe: [
      {
        number: '01',
        title: 'Saphirklingen-Dimensionierung',
        description: 'Mikroklingen zwischen 1,0 mm und 1,4 mm werden passend zur Haardicke gewählt.'
      },
      {
        number: '02',
        title: 'Glatter V-Kanal-Schnitt',
        description: 'Saphirkristalle öffnen Kanäle im 38-Grad-Winkel ohne das Gewebe zu quetschen.'
      },
      {
        number: '03',
        title: 'Stabile Graft-Fixierung',
        description: 'Haarwurzeln sitzen fest in den V-Kanälen und verrutschen nach der OP nicht.'
      },
      {
        number: '04',
        title: '30% schnellere Wundheilung',
        description: 'Antibakterieller Kristallkontakt sorgt für Abfall der Krusten nach 5-7 Tagen.'
      }
    ],
    faqDe: [
      {
        question: 'Was unterscheidet Saphir FUE von herkömmlichen Stahlschlitzen?',
        answer: 'Stahlklingen können mikroskopisch stumpf werden und das Gewebe einreißen. Saphirklingen sind extrem glatte, biokompatible Kristalle, die sauber schneiden, 30% schneller heilen und keine sichtbaren Narben hinterlassen.'
      }
    ],
    contentHtmlDe: '<h2>Vorteile der Saphir FUE Technologie in Gaziantep</h2><p>Die Saphir FUE ist die modernste Weiterentwicklung der FUE-Methode. In unserer Klinik in Gaziantep garantieren originale Saphirspitzen maximale Anwachsraten und schnellste Regeneration.</p>'
  },

  'dhi-sac-ekimi': {
    titleEn: 'Gaziantep DHI Hair Transplant (Choi Pen) — Direct & Unshaven Implantation',
    metaTitleEn: 'Gaziantep DHI Hair Transplant | Unshaven Choi Pen Implanter',
    metaDescriptionEn: 'DHI hair transplant in Gaziantep: Unshaven procedure with Choi implanter pens. Simultaneous channel opening and graft placement for maximum density.',
    badgeEn: 'UNSHAVEN & DIRECT IMPLANTATION',
    summaryEn: 'Choi implanter pens combine channel creation and root placement in a single stroke, allowing seamless implantation between existing long hair without shaving.',
    highlightsEn: [
      'Unshaven hair transplant: maintain your current hairstyle without shaving your head',
      'Choi implanter pens open channels and place grafts simultaneously',
      'Optimal technique for women’s hairline lowering and crown densification',
      'Zero root out-of-body waiting time for maximum graft viability'
    ],
    candidatesEn: [
      'Men and women who cannot shave their hair due to career or social commitments',
      'Patients needing hair densification between existing long hair follicles',
      'Those demanding ultra-precise hairline contouring with 360° angle control',
      'Eyebrow and beard restoration candidates'
    ],
    stepsEn: [
      {
        number: '01',
        title: 'Hidden Donor Area Extraction',
        description: 'Only a small hidden window at the nape is trimmed, keeping surrounding hair long.'
      },
      {
        number: '02',
        title: 'Choi Pen Loading',
        description: 'Grafts are placed into hollow Choi needle tips without any delay or room-temperature exposure.'
      },
      {
        number: '03',
        title: 'Direct One-Step Implantation',
        description: 'With a gentle press, the pen inserts the follicle directly into the scalp at the exact angle desired.'
      },
      {
        number: '04',
        title: 'Immediate Return to Routine',
        description: 'No scalpel cuts or incisions mean minimal bleeding, almost no crusting, and rapid recovery.'
      }
    ],
    faqEn: [
      {
        question: 'How does an unshaven DHI hair transplant work?',
        answer: 'The fine hollow needle of the Choi pen navigates easily between your existing hairs without cutting them. Only a small concealed section of the donor nape is trimmed.'
      },
      {
        question: 'What is the main benefit of DHI for women?',
        answer: 'Women never have to shave their heads. DHI allows dense placement along the forehead hairline and thinning crown areas while keeping hair completely long.'
      }
    ],
    contentHtmlEn: '<h2>DHI Choi Pen: The Pinnacle of Unshaven Hair Restoration</h2><p>Direct Hair Implantation (DHI) places hair follicles directly into recipient sites without pre-made incisions. Grafts spend almost zero time outside the body, preserving optimal cell survival.</p>',

    // Arabic
    titleAr: 'زراعة الشعر بتقنية DHI (أقلام تشوي) في غازي عنتاب — بدون حلاقة وزراعة مباشرة',
    metaTitleAr: 'زراعة الشعر بتقنية DHI غازي عنتاب | أقلام تشوي بدون حلاقة',
    metaDescriptionAr: 'زراعة الشعر بتقنية DHI في غازي عنتاب: زراعة بدون حلاقة بأقلام تشوي، فتح القناة وزرع البصيلة في خطوة واحدة، مثالية للنساء وتكثيف الشعر.',
    badgeAr: 'زراعة مباشرة وبدون حلاقة',
    summaryAr: 'تجمع أقلام تشوي بين فتح القناة وزرع البصيلة في خطوة واحدة، مما يتيح زراعة الشعر بين الخصلات الطويلة الموجودة دون الحاجة لحلاقة الرأس.',
    highlightsAr: [
      'زراعة شعر بدون حلاقة: حافظ على تسريحة شعرك الحالية وعُد لعملك فوراً',
      'أقلام تشوي تفتح القنوات وتغرس البصيلات بلمسة واحدة مريحة',
      'التقنية المفضلة للنساء لتصغير الجبهة وتكثيف قمة الرأس',
      'حماية حيوية البصيلات بتقليل وقت بقائها خارج الجسم إلى الصفر تقريباً'
    ],
    candidatesAr: [
      'الرجال والنساء الذين لا يمكنهم حلاقة شعرهم لظروف العمل أو الحياة الاجتماعية',
      'حالات تكثيف الفراغات بين خصلات الشعر الطويل الحالية',
      'من يطلبون دقة متناهية وتحكماً كاملاً بزاوية واتجاه خط الشعر',
      'عمليات زراعة الحواجب واللحية الدقيقة'
    ],
    stepsAr: [
      {
        number: '01',
        title: 'اقتطاف مخفي من المنطقة المانحة',
        description: 'حلاقة نافذة صغيرة مخفية تحت الشعر الطويل بالخلف دون أن يلاحظ أحد.'
      },
      {
        number: '02',
        title: 'تعبئة أقلام تشوي بالبصيلات',
        description: 'تلقيم البصيلات المقتطفة داخل إبر أقلام تشوي المعقمة فوراً دون انتظار.'
      },
      {
        number: '03',
        title: 'الزرع المباشر بخطوة واحدة',
        description: 'غرس البصيلة مباشرة في فروة الرأس بالعمق والزاوية المثالية بضغطة زر واحدة.'
      },
      {
        number: '04',
        title: 'عودة فورية للحياة اليومية',
        description: 'انعدام الشقوق الجراحية يقلل النزيف والقشور إلى الصفر تقريباً لشفاء فائق السرعة.'
      }
    ],
    faqAr: [
      {
        question: 'كيف تتم زراعة الشعر بتقنية DHI بدون حلاقة؟',
        answer: 'تنفذ إبرة قلم تشوي الرفيعة بين خصلات الشعر الطويلة الموجودة وتزرع البصيلة مباشرة دون الحاجة لقص الشعر أو حلاقته.'
      },
      {
        question: 'ما هي ميزة DHI للنساء؟',
        answer: 'لا تضطر المرأة لحلاقة شعرها على الإطلاق. تتيح التقنية تصغير الجبهة وتكثيف الفراغات مع الاحتفاظ بكامل طول الشعر الطبيعي.'
      }
    ],
    contentHtmlAr: '<h2>تقنية أقلام تشوي DHI: الراحة والخصوصية في غازي عنتاب</h2><p>تتيح تقنية DHI زراعة البصيلات فور اقتطافها دون أي انتظار خارج الجسم. هذا يرفع معدل نمو الشعر المزروع إلى أعلى مستوياته العالمية.</p>',

    // German
    titleDe: 'DHI Haartransplantation Gaziantep (Choi Pen) — Unrasiert & Direktimplantation',
    metaTitleDe: 'DHI Haartransplantation Gaziantep | Unrasierte Methode Choi Stift',
    metaDescriptionDe: 'DHI Haartransplantation in Gaziantep: Unrasiertes Verfahren mit Choi Implanter Stift. Gleichzeitiges Kanalöffnen und Einsetzen für höchste Haardichte.',
    badgeDe: 'UNRASIERT & DIREKT',
    summaryDe: 'Choi-Implanter-Stifte vereinen Kanalöffnung und Wurzelplatzierung in einem Schritt – ideal für dichtes Haar ohne Kahlrasur.',
    highlightsDe: [
      'Unrasierte Haartransplantation: Behalten Sie Ihre aktuelle Frisur ohne Kahlrasur',
      'Choi Implanter Stifte öffnen Kanäle und setzen Grafts simultan ein',
      'Die bevorzugte Methode für Frauen bei Haarlinienabsenkung und Verdichtung',
      'Nahezu null Wartezeit außerhalb des Körpers für maximale Vitalität der Wurzeln'
    ],
    candidatesDe: [
      'Männer und Frauen, die ihr Haar beruflich bedingt nicht abrasieren können',
      'Patienten, die bestehendes langes Haar gezielt verdichten möchten',
      'Patienten mit hohen Ansprüchen an 360-Grad-Winkelkontrolle an der Haarlinie',
      'Behandlungen von Augenbrauen und Bartpartien'
    ],
    stepsDe: [
      {
        number: '01',
        title: 'Verdeckte Entnahme am Hinterkopf',
        description: 'Nur ein kleines, vom Deckhaar verdecktes Fenster wird im Spenderbereich gekürzt.'
      },
      {
        number: '02',
        title: 'Bestückung der Choi-Stifte',
        description: 'Die Grafts werden direkt in die feinen Hohlnadeln steriler Choi-Stifte geladen.'
      },
      {
        number: '03',
        title: 'Direkteingabe in einem Zug',
        description: 'Per Klick wird die Haarwurzel ohne vorherigen Schnitt im exakten Winkel implantiert.'
      },
      {
        number: '04',
        title: 'Sofortige Rückkehr in den Alltag',
        description: 'Minimale Krusten und kein Schnittbluten ermöglichen rasche Gesellschaftsfähigkeit.'
      }
    ],
    faqDe: [
      {
        question: 'Wie funktioniert die unrasierte DHI-Methode?',
        answer: 'Die feine Nadel des Choi-Stifts gleitet geschmeidig zwischen den bestehenden langen Haaren hindurch, sodass das Deckhaar überhaupt nicht gekürzt werden muss.'
      },
      {
        question: 'Warum ist DHI ideal für Frauen?',
        answer: 'Frauen müssen ihr Haar niemals raspelkurz schneiden. DHI erlaubt das Schließen von Stirngeheimratsecken und Verdichten des Scheitels bei voller Haarlänge.'
      }
    ],
    contentHtmlDe: '<h2>DHI Choi Pen: Höchster Komfort ohne Kahlrasur in Gaziantep</h2><p>Die DHI-Methode minimiert die Zeit, die Haarwurzeln außerhalb des Körpers verbringen. Dadurch erreichen wir maximale Anwachsquoten und unübertroffene Natürlichkeit.</p>'
  }
};

treatments.forEach(treatment => {
  const trans = translations[treatment.slug];
  if (trans) {
    Object.assign(treatment, trans);
    console.log(`Translated treatment: ${treatment.slug}`);
  }
});

fs.writeFileSync(treatmentsPath, JSON.stringify(treatments, null, 2), 'utf8');
console.log('Successfully updated treatments.json with EN, AR, DE translations!');
