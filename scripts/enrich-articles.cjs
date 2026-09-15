const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../src/data/articles.json');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

console.log(`Loaded ${articles.length} articles.`);

// Helper to update an article by slug
function updateArticle(slug, updates) {
  const idx = articles.findIndex(a => a.slug === slug);
  if (idx !== -1) {
    articles[idx] = { ...articles[idx], ...updates, updatedAt: new Date().toISOString() };
    console.log(`Updated: ${slug}`);
  } else {
    console.warn(`Not found: ${slug}`);
  }
}

// 1. gaziantep-sac-ekimi
updateArticle('gaziantep-sac-ekimi', {
  title: 'Gaziantep Saç Ekimi: En İyi Merkezler, 2026 Fiyatları ve Uzman Tavsiyeleri',
  metaTitle: 'Gaziantep Saç Ekimi Fiyatları 2026 | Elif Ay Saç Ekim Merkezi',
  metaDescription: 'Gaziantep saç ekimi fiyatları 2026, 3000-5000 greft saç ekimi, Safir FUE ve DHI yöntemleri. Gaziantep saç ekimi doktorları ve Elif Ay güvencesiyle kalıcı sonuçlar.',
  metaKeywords: 'Gaziantep saç ekimi, Gaziantep en iyi saç ekim merkezi, Gaziantep saç ekimi yapan hastaneler, Gaziantep saç ekimi doktorları, Gaziantep saç ekimi fiyatları 2026, 3000 greft saç ekimi fiyatı, 5000 greft saç ekimi fiyatı, DHI saç ekimi Gaziantep, Safir FUE saç ekimi Gaziantep, İğnesiz ağrısız saç ekimi',
  contentHtml: `
    <h2>Gaziantep Saç Ekimi ve Bölgesel Liderlik</h2>
    <p><strong>Gaziantep saç ekimi</strong> alanında son yıllarda Türkiye'nin ve bölgenin en önemli sağlık merkezlerinden biri haline gelmiştir. <strong>Gaziantep en iyi saç ekim merkezi</strong> arayışında olan hastalarımız için Saç Ekim Uzmanı <a href="#specialist" class="text-gold hover:underline font-medium">Elif Ay</a>, 15 yılı aşkın mikrocerrahi tecrübesiyle kişiye özel doğal saç çizgisi tasarımı ve doku koruyucu Gold &amp; <a href="/tedaviler/safir-fue-sac-ekimi" class="text-gold hover:underline font-medium">Safir FUE saç ekimi Gaziantep</a> protokollerini uygulamaktadır.</p>
    
    <h3>Gaziantep Saç Ekimi Yapan Hastaneler ve Klinik Standartları</h3>
    <p>Saç ekimi cerrahi bir operasyondur ve mutlaka Sağlık Bakanlığı onaylı, tam teşekküllü ameliyathane koşullarında gerçekleştirilmelidir. <strong>Gaziantep saç ekimi yapan hastaneler</strong> ve uzman klinikler arasında fark yaratan yaklaşımımız; her hastayı butik olarak ele almak, donör alanı homojen biçimde korumak ve 38 derecelik doğal çıkış açısıyla ömür boyu kalıcı sonuçlar inşa etmektir.</p>

    <h3>Gaziantep Saç Ekimi Fiyatları 2026: Greft ve Paket Detayları</h3>
    <p>2026 yılı itibarıyla <strong>Gaziantep saç ekimi fiyatları</strong>; ekilecek greft miktarına (örneğin <strong>3000 greft saç ekimi fiyatı</strong> veya <strong>5000 greft saç ekimi fiyatı</strong>), uygulanan yönteme (<a href="/tedaviler/dhi-sac-ekimi" class="text-gold hover:underline font-medium">DHI saç ekimi Gaziantep</a> ya da Safir FUE) ve anestezi tercihlerine göre belirlenir. Kliniğimizde greft başı gizli maliyetler yerine, tüm operasyon ve medikal bakım basamaklarını kapsayan <strong>her şey dahil saç ekim paketi Gaziantep</strong> seçenekleri sunulmaktadır. Ayrıca bütçenizi zorlamamak adına <strong>Gaziantep saç ekimi taksit yapan yerler</strong> arasında anlaşmalı bankalarla uygun ödeme kolaylıkları sağlanır.</p>

    <h3>Çevre İllerden Gelen Hastalarımız İçin Kolay Ulaşım ve Aynı Gün Dönüş</h3>
    <p>Gaziantep merkez kliniğimiz; <strong>Şanlıurfa saç ekimi</strong>, <strong>Diyarbakır saç ekimi</strong>, <strong>Kahramanmaraş saç ekimi</strong>, <strong>Adıyaman saç ekim merkezleri</strong>, <strong>Mardin saç ekimi yapan yerler</strong>, <strong>Batman saç ekim klinikleri</strong> ve <strong>Kilis Gaziantep saç ekimi</strong> arayışındaki hastalarımız için ana referans merkezdir. Gaziantep'in bölgedeki merkezi konumu ve çevre illere 1-2 saatlik sürüş mesafesinde olması sayesinde hastalarımız aynı gün içinde operasyonunu tamamlayıp evine konforla dönebilmektedir.</p>

    <hr/>
    <h2>Gaziantep Saç Ekimi Hakkında Sıkça Sorulan Sorular</h2>
    <h3>1. Saç ekimi kaç saat sürer ve acıtır mı?</h3>
    <p>Operasyon ortalama 5 ila 7 saat sürer. İğnesiz basınçlı lokal anestezi protokolümüz ve sedasyonlu saç ekimi alternatifimiz sayesinde operasyon sırasında hiçbir ağrı hissedilmez.</p>
    <h3>2. Saç ekimi sonrası şok dökülme ne zaman biter?</h3>
    <p>Şok dökülme 2. haftada başlar ve 2-3 ay içinde tamamlanır. 3. aydan itibaren uzayan yeni saçlar kalıcıdır ve dökülmez.</p>
    <h3>3. Saç ekiminde tepe bölgesi tutar mı?</h3>
    <p>Evet, Safir kristal uçlarla açılan mikro kanallar sayesinde tepe (vertex) bölgesinde de yüksek kan dolaşımı ve %90'ın üzerinde kök tutunması sağlanır.</p>
    <h3>4. 3000 greft veya 5000 greft ekimi ne kadar alanı kapatır?</h3>
    <p>3000 greft ön çizgi ve orta alanı tamamen kapatabilirken; 5000 greftlik mega seanslar geniş kelliklerde tepe bölgesini de kapsayacak biçimde maksimum yoğunluk sağlar.</p>
    <h3>5. WhatsApp üzerinden ücretsiz greft analizi nasıl alınır?</h3>
    <p>Ön, yan, tepe ve ense fotoğraflarınızı WhatsApp hattımıza (+90 536 491 60 40) ileterek 15 dakika içinde Uzman Elif Ay'dan analiz ve fiyat teklifi alabilirsiniz.</p>
  `
});

// 2. gaziantep-en-iyi-sac-ekim-merkezi-nasil-secilir
updateArticle('gaziantep-en-iyi-sac-ekim-merkezi-nasil-secilir', {
  title: 'Gaziantep En İyi Saç Ekim Merkezi Nasıl Seçilir? (2026 Rehberi)',
  metaTitle: 'Gaziantep En İyi Saç Ekim Merkezi | Seçim Kriterleri & Tavsiyeler',
  metaDescription: 'Gaziantep en iyi saç ekim merkezi arayışında dikkat edilmesi gerekenler: Doktor tecrübesi, Safir FUE ve DHI teknolojisi, steril hastane ortamı ve gerçek hasta yorumları.',
  metaKeywords: 'Gaziantep en iyi saç ekim merkezi, Gaziantep saç ekimi tavsiye, Gaziantep saç ekimi doktorları, Güneydoğu en iyi saç ekim merkezi, Gaziantep saç ekimi şikayet, Elif Ay saç ekimi yorumları',
  contentHtml: `
    <h2>Gaziantep'te En İyi Saç Ekim Merkezini Seçerken 5 Kritik Kriter</h2>
    <p><strong>Gaziantep en iyi saç ekim merkezi</strong> seçimi, hayatınız boyunca taşıyacağınız saç çizginizin ve özgüveninizin garantisidir. Şehirde onlarca klinik ve hastane seçeneği bulunurken, doğru merkezi seçmek için şu altın kriterlere dikkat etmelisiniz:</p>
    
    <h3>1. Doğrudan Uzman ve Doktor Katılımı</h3>
    <p>Saç ekimi bir ekip işi olmakla birlikte, operasyonun ön çizgi tasarımı, kanal açımı ve greft açılarının belirlenmesi mutlaka deneyimli bir <strong>saç ekimi uzmanı</strong> kontrolünde yapılmalıdır. Saç Ekim Uzmanı <a href="#specialist" class="text-gold hover:underline font-medium">Elif Ay</a>, her hastanın konsültasyonunu bizzat gerçekleştirir.</p>

    <h3>2. Kullanılan Teknoloji: Safir FUE ve DHI Choi Kalem</h3>
    <p>Geleneksel metal bistüriler yerine doku dostu <strong>Safir FUE saç ekimi Gaziantep</strong> ve tıraşsız operasyon sağlayan <strong>DHI saç ekimi</strong> teknolojilerini sunabilen klinikler tercih edilmelidir. Safir uçlar doku travmasını minimuma indirerek iyileşmeyi 2 kat hızlandırır.</p>

    <h3>3. Donör Alanı Koruma İlkesi</h3>
    <p>İyi bir klinik sadece ekilen yere değil, saçın alındığı ense bölgesine de saygı duyar. Homojen ve mikro punch uçlarla alım yapılmazsa ensede seyreklik ve güve yeniği görüntüsü kalabilir. Uzman ekibimiz donör rezervinizi ömür boyu koruyacak şekilde planlama yapar.</p>

    <h3>4. Gerçek Öncesi / Sonrası Fotoğrafları ve Sosyal Kanıt</h3>
    <p><strong>Gaziantep saç ekimi tavsiye</strong> ve kullanıcı yorumları incelenirken, filtre uygulanmamış net ışık altındaki 12. ay sonuçları incelenmelidir. <strong>Gaziantep saç ekimi şikayet</strong> oranlarının sıfıra yakın olduğu, hasta memnuniyetinin yüksek olduğu merkezler güven verir.</p>

    <h3>5. Güneydoğu Bölge Hastalarına Özel Hızlı Planlama</h3>
    <p><strong>Şanlıurfa saç ekimi</strong>, <strong>Diyarbakır saç ekim merkezleri</strong> ve <strong>Kahramanmaraş saç ekimi</strong> hastaları için Gaziantep'te aynı gün içinde tamamlanan operasyon ve uzaktan fotoğraflı takip hizmeti sunan merkezler tercih edilmelidir.</p>
  `
});

// 3. gaziantep-sac-ekimi-fiyatlari-ve-merkezleri
updateArticle('gaziantep-sac-ekimi-fiyatlari-ve-merkezleri', {
  title: 'Gaziantep Saç Ekimi Fiyatları 2026: Greft Paketleri ve Merkez Analizi',
  metaTitle: 'Gaziantep Saç Ekimi Fiyatları 2026 | 3000 - 5000 Greft Paketleri',
  metaDescription: 'Gaziantep saç ekimi fiyatları 2026: 1 greft ne kadar, 3000 ve 5000 greft saç ekim fiyatı, taksit seçenekleri ve her şey dahil paketler. Ücretsiz fiyat teklifi alın.',
  metaKeywords: 'Gaziantep saç ekimi fiyatları 2026, 1 greft saç ekimi ne kadar, 3000 greft saç ekimi fiyatı, 5000 greft saç ekimi fiyatı, Her şey dahil saç ekim paketi Gaziantep, Gaziantep saç ekimi taksit yapan yerler, Saç ekimi fiyatları Şanlıurfa, Diyarbakır saç ekim fiyatları',
  contentHtml: `
    <h2>Gaziantep Saç Ekimi Fiyatları 2026 Yılında Nasıl Belirlenir?</h2>
    <p><strong>Gaziantep saç ekimi fiyatları 2026</strong> yılında hastanın kellik derecesine, ihtiyaç duyulan greft sayısına ve seçilen cerrahi tekniğe göre şekillenmektedir. İstanbul gibi metropollere kıyasla Gaziantep, aynı yüksek kalitedeki Safir FUE ve DHI hizmetini çok daha ulaşılabilir ve bütçe dostu fiyatlarla sunmaktadır.</p>

    <h3>Greft Sayısına Göre Fiyat Aralıkları</h3>
    <ul>
      <li><strong>1 Greft Saç Ekimi Ne Kadar?</strong> Greft başı ücretlendirme yerine klinikler genelde paket fiyat uygular. Tek greft maliyeti ortalama olarak yönteme göre hesaplanır.</li>
      <li><strong>3000 Greft Saç Ekimi Fiyatı:</strong> Ön hat ve şakak açılmaları için en sık tercih edilen seanstır; tek günde tamamlanır.</li>
      <li><strong>5000 Greft Saç Ekimi Fiyatı (Mega Seans):</strong> Tepe bölgesini de kapsayan geniş dökülmelerde donör alan uygunsa tek seansta maksimum yoğunluk hedeflenir.</li>
    </ul>

    <h3>Her Şey Dahil Saç Ekim Paketi Gaziantep</h3>
    <p>Kliniğimizde sürpriz ücretlere yer yoktur. <strong>Her şey dahil saç ekim paketi</strong> kapsamında:
    <ul>
      <li>Saç Ekim Uzmanı Elif Ay ile kişiye özel saç çizgisi tasarımı</li>
      <li>İğnesiz ağrısız lokal anestezi (sedasyon seçeneği)</li>
      <li>Maksimum greft alımı ve Safir FUE / DHI uygulaması</li>
      <li>Operasyon sırasında medikal PRP veya kök hücre desteği</li>
      <li>Operasyon sonrası ilk yıkama, medikal şampuan ve losyon seti</li>
      <li>12 aylık düzenli klinik ve uzaktan WhatsApp fotoğraf takibi</li>
    </ul>
    </p>

    <h3>Gaziantep Saç Ekimi Taksit Yapan Yerler</h3>
    <p>Kliniğimizde anlaşmalı kredi kartlarına taksit imkanları sunulmaktadır. Güncel fiyat ve taksit planlamanızı öğrenmek için WhatsApp'tan iletişime geçebilirsiniz.</p>
  `
});

// 4. sanliurfa-sac-ekimi
updateArticle('sanliurfa-sac-ekimi', {
  title: 'Şanlıurfa Saç Ekimi: Gaziantep Merkez Kliniğimize Kolay Ulaşım ve Doğal Çizgi',
  metaTitle: 'Şanlıurfa Saç Ekimi | Gaziantep Elif Ay Saç Ekim Merkezi',
  metaDescription: 'Şanlıurfa saç ekimi ve saç ekim merkezleri arayışındaki hastalarımız için 1 saat mesafedeki Gaziantep Elif Ay kliniğinde Safir FUE ve DHI. Kolay ulaşım ve aynı gün dönüş.',
  metaKeywords: 'Şanlıurfa saç ekimi, Şanlıurfa saç ekim merkezleri, Saç ekimi fiyatları Şanlıurfa, Urfa\'dan Gaziantep\'e saç ekimine gidenler, Şanlıurfa sakal ekimi, Şanlıurfa kaş ekimi, Gaziantep saç ekimi',
  contentHtml: `
    <h2>Şanlıurfa Saç Ekimi Hastalarımız İçin Gaziantep Avantajı</h2>
    <p><strong>Şanlıurfa saç ekimi</strong> arayışında olan yüzlerce danışanımız; Karaköprü, Haliliye, Eyyübiye, Birecik ve Siverek'ten yalnızca 1-1.5 saatlik mesafedeki <strong>Gaziantep Elif Ay Saç Ekim Merkezi</strong>'ni tercih etmektedir. <strong>Urfa'dan Gaziantep'e saç ekimine gidenler</strong> arasında en büyük tercih sebebi, yüksek cerrahi teknoloji ve doğal ön çizgi başarısıdır.</p>

    <h3>Neden Şanlıurfa Saç Ekim Merkezleri Yerine Gaziantep?</h3>
    <p>Gaziantep merkez kliniğimizde Saç Ekim Uzmanı Elif Ay liderliğinde;
    <ul>
      <li>İğnesiz ve ağrısız lokal anesteziyle sıfır acı garantisi</li>
      <li>Safir FUE ve DHI Choi implanter kalemleri ile maksimum sıklık</li>
      <li>3000 greft ile 5000 greft arası mega seans imkanı</li>
      <li>Urfa'dan gelen misafirlerimiz için aynı gün operasyon ve konforlu dönüş imkanı</li>
    </ul>
    hizmetleri eksiksiz sunulur.</p>

    <h3>Şanlıurfa Sakal ve Kaş Ekimi Talepleri</h3>
    <p>Şanlıurfa'dan gelen danışanlarımız için sadece saç değil; köselik tedavisi için <strong>Şanlıurfa sakal ekimi</strong> ve dökülen/küsen kaşlar için kadınlara özel <strong>Şanlıurfa kaş ekimi</strong> uygulamalarımız da aynı gün içinde tamamlanmaktadır.</p>
  `
});

// 5. diyarbakir-sac-ekimi
updateArticle('diyarbakir-sac-ekimi', {
  title: 'Diyarbakır Saç Ekimi: Gaziantep Elif Ay Kliniğinde Safir FUE ve Doğal Çizgi',
  metaTitle: 'Diyarbakır Saç Ekimi | Gaziantep Saç Ekim Merkezi Elif Ay',
  metaDescription: 'Diyarbakır saç ekim merkezleri ve fiyatları araştırması yapanlar için Gaziantep Elif Ay kliniğinde Safir FUE, DHI ve köselik sakal ekimi. Merkezi konum ve kolay ulaşım.',
  metaKeywords: 'Diyarbakır saç ekimi, Diyarbakır saç ekim merkezleri, Diyarbakır saç ekim fiyatları, Diyarbakır sakal ekim merkezleri, Diyarbakır kaş ekim merkezleri, Gaziantep saç ekimi'
});

// 6. gaziantep-sakal-ekimi-ve-koselik-tedavisi
updateArticle('gaziantep-sakal-ekimi-ve-koselik-tedavisi', {
  contentHtml: `
    <h2>Gaziantep Sakal ve Bıyık Ekimi ile Karizmatik Hatlar</h2>
    <p>Erkek estetiğinde gür ve simetrik bir sakal yapısı, yüz profilini ve çene hattını belirginleştiren en önemli unsurdur. <strong>Gaziantep sakal ekimi</strong> kliniğimizde, sakalı hiç çıkmayan köse erkeklerden bölgesel yara veya yanık izi olan hastalara kadar kişiye özel çözümler sunulmaktadır.</p>

    <h3>Köselere Sakal Ekimi Tutar mı? Kaç Greft Gerekir?</h3>
    <p>Genetik olarak köse olan kişilerde kıl folikülü bulunmadığı için ilaç veya serumlar fayda sağlamaz; tek kesin çözüm sakal ekimidir. Ense veya boyun bölgesinden alınan dökülmeye dirençli kökler yanak ve çene hattına nakledildiğinde <strong>%95'in üzerinde başarıyla tutar</strong>. Favori ve çene belirginleştirmek için <strong>1000 greft sakal ekimi yeterli</strong> olabilirken, tam köselikte yanakları da doldurmak için 2000-2500 greft planlanır.</p>

    <h3>Yanık ve Ameliyat İzine Sakal Ekimi Yapılır mı?</h3>
    <p>Evet. Çocukluk çağı yanıkları, trafik kazası dikişleri, akne skarları veya yarık dudak ameliyat izleri sakal ve bıyık ekimiyle tamamen kamufle edilebilir. Kılcal kan dolaşımının olduğu her skarlı doku ekilen kökleri besler ve izleri görünmez kılar.</p>

    <h3>Sakal Ekimi Kaç Günde İyileşir ve Ne Zaman Tıraş Olunur?</h3>
    <p>Operasyon sonrası yüz bölgesindeki mikro kabuklanma <strong>7 ila 10 gün</strong> içinde kendiliğinden temizlenir. 1. ayda makasla düzeltme yapılabilir. 3. aydan sonra ise normal tıraş bıçağı veya makineyle sakallarınızı dilediğiniz gibi tıraş edebilirsiniz.</p>

    <h3>Gaziantep Sakal Ekimi Fiyatları 2026</h3>
    <p><strong>Gaziantep sakal ekimi fiyatları</strong> greft sayısına ve köselik derecesine göre kişiselleştirilir. <strong>Şanlıurfa sakal ekimi</strong>, <strong>Diyarbakır sakal ekim merkezleri</strong> ve <strong>Kahramanmaraş sakal ekimi</strong> hastalarımız için merkezi konumumuzla kolay ulaşım ve her şey dahil paket avantajlarımız geçerlidir.</p>
  `
});

// 7. gaziantep-sac-ekimi-tavsiye-ve-kullanici-yorumlari
updateArticle('gaziantep-sac-ekimi-tavsiye-ve-kullanici-yorumlari', {
  contentHtml: `
    <h2>Gaziantep Saç Ekimi Tavsiye ve Kullanıcı Deneyimleri</h2>
    <p>Saç ekimi kararı alırken en önemli referans kaynağı, daha önce operasyon geçirmiş hastaların deneyimleridir. <strong>Gaziantep saç ekimi tavsiye</strong> başlıkları altında <em>Kadınlar Kulübü</em>, <em>Ekşi Sözlük</em> ve bağımsız hasta forumlarında kliniğimiz ve Saç Ekim Uzmanı <a href="#specialist" class="text-gold hover:underline font-medium">Elif Ay</a> hakkında paylaşılan geri bildirimler yüksek memnuniyet oranını ortaya koymaktadır.</p>

    <h3>Urfa'dan Gaziantep'e Saç Ekimine Gidenlerin Deneyimleri</h3>
    <p><strong>Urfa'dan Gaziantep'e saç ekimine gidenler</strong> için mesafe yalnızca 1.5 saattir. Danışanlarımız yerel sınırlı imkanlar yerine, Gaziantep'te tam donanımlı ameliyathane koşullarında Safir FUE ve DHI yöntemleriyle operasyon olmanın getirdiği konforu öne çıkarmaktadır. Kliniğimizin merkezi konumu ve uzaktan WhatsApp analizi sayesinde süreç stressiz ve günübirlik şekilde tamamlanmaktadır.</p>

    <h3>Gaziantep Saç Ekimi Şikayet Konuları Nelerdir? Nelere Dikkat Edilmeli?</h3>
    <p>İnternette <strong>Gaziantep saç ekimi şikayet</strong> aramaları incelendiğinde en büyük hayal kırıklıklarının merdiven altı, yetkisiz yerlerde yapılan hatalı operasyonlardan kaynaklandığı görülmektedir:
    <ul>
      <li><strong>Yapay Çim Adam Görünümü:</strong> Greftlerin 90 derece dik açıyla ekilmesinden kaynaklanır. Kliniğimizde kökler 38 derecelik doğal açıyla ekilir.</li>
      <li><strong>Donör Bölgenin Talan Edilmesi:</strong> Fazla greft almak uğruna ensenin bozulması. Kliniğimiz mikromotor punch ile homojen alım yapar.</li>
      <li><strong>Şok Dökülme Korkusu:</strong> Hastaların süreç hakkında bilgilendirilmemesi. Uzmanımız operasyon sonrasında 12 ay boyunca hastayı düzenli takip eder.</li>
    </ul>
    </p>

    <h3>Gaziantep Saç Ekimi Öncesi ve Sonrası Fotoğrafları</h3>
    <p>Kliniğimizde gerçekleştirilen gerçek hasta operasyonlarının 1. gün, 3. ay, 6. ay ve 12. ay <strong>öncesi sonrası fotoğrafları</strong>, saç çizgisinin doğallığını ve ekilen greftlerin tutunma başarısını açıkça sergilemektedir. Fotoğraflı vaka galerimizi WhatsApp üzerinden talep edebilirsiniz.</p>
  `
});

// 8. gaziantep-vip-sac-ekimi-paketleri -> Renamed concept to Her Şey Dahil Paketler
updateArticle('gaziantep-vip-sac-ekimi-paketleri', {
  title: 'Gaziantep Her Şey Dahil Saç Ekimi Paketleri: 2026 Fiyatları ve Hizmet Kapsamı',
  metaTitle: 'Gaziantep Her Şey Dahil Saç Ekimi Paketleri | Elif Ay',
  metaDescription: 'Gaziantep her şey dahil saç ekimi paketi: Ön çizgi tasarımı, iğnesiz anestezi, PRP tedavisi, medikal bakım seti ve ilk yıkama dahil şeffaf fiyatlar.',
  contentHtml: `
    <h2>Gaziantep Her Şey Dahil Saç Ekimi Paketleri</h2>
    <p>Saç ekimi sürecinde sürpriz ek maliyetlerle karşılaşmamak hastalarımız için en önemli konulardan biridir. Kliniğimizde sunulan <strong>Her Şey Dahil Saç Ekimi Paketi</strong>; operasyonun planlamasından 1 yıllık tıbbi takibe kadar tüm medikal aşamaları tek ve şeffaf bir fiyatta birleştirir.</p>

    <h3>Paket İçeriğinde Neler Var?</h3>
    <ul>
      <li><strong>Ön Çizgi ve Greft Analizi:</strong> Altın oran cetvelleriyle yüzünüze özel tasarım.</li>
      <li><strong>İğnesiz Lokal Anestezi:</strong> Basınçlı anesteziyle sıfır acı garantisi (isteğe bağlı sedasyon).</li>
      <li><strong>Maksimum Greft Alımı ve Safir FUE / DHI:</strong> Donör alandan homojen kök toplanması ve doğal açılı ekim.</li>
      <li><strong>Medikal PRP Tedavisi:</strong> Köklerin daha hızlı tutunması için operasyon sırasında uygulanan büyüme faktörleri.</li>
      <li><strong>Klinik İlk Yıkama ve Medikal Set:</strong> Özel şampuan ve losyon içeren operasyon sonrası bakım seti.</li>
      <li><strong>12 Aylık Düzenli Takip:</strong> Uzman kontrolü ve WhatsApp üzerinden fotoğraf değerlendirmesi.</li>
    </ul>
  `
});

// 9. Sanitize remaining articles for any leftover patient transfer/hotel mentions
articles.forEach(art => {
  let changed = false;
  ['title', 'metaTitle', 'metaDescription', 'contentHtml', 'titleEn', 'metaTitleEn', 'metaDescriptionEn', 'contentHtmlEn', 'titleAr', 'metaTitleAr', 'metaDescriptionAr', 'contentHtmlAr'].forEach(field => {
    if (typeof art[field] === 'string') {
      let val = art[field];

      // Remove / replace patient transfer and hotel terms
      val = val.replace(/VIP transfer, fiyatlar ve Safir FUE yöntemleri/gi, 'fiyatlar, Safir FUE ve DHI yöntemleri');
      val = val.replace(/için VIP transfer, fiyatlar/gi, 'için fiyatlar');
      val = val.replace(/hastalarına VIP transfer ve konaklama imkanı sunarak süreci zahmetsiz bir tatile dönüştürür/gi, 'hastalarına merkezi konumu ve uzaktan ön analiz imkanıyla süreci son derece konforlu hale getirir');
      val = val.replace(/İsteğe bağlı olarak VIP araçlarımızla transfer hizmetimiz bulunur\./gi, 'Otogardan veya kendi aracınızla kliniğimize ulaşım son derece kolaydır; aynı gün operasyonunuz tamamlanıp dönebilirsiniz.');
      val = val.replace(/VIP araçlarımızla transfer hizmetimiz bulunur/gi, 'Kliniğimize ulaşım son derece kolaydır');
      val = val.replace(/VIP araç transferi, anlaşmalı otel konaklaması ve /gi, '');
      val = val.replace(/VIP araç karşılama ve otel konaklaması/gi, 'merkezi konumu ve kolay ulaşımı');
      val = val.replace(/VIP transfer ve otel konaklaması/gi, 'kolay ulaşım ve aynı gün dönüş');
      val = val.replace(/VIP transfer ve konaklama/gi, 'kolay ulaşım');
      val = val.replace(/VIP transfer/gi, 'kolay ulaşım');
      val = val.replace(/otel konaklaması/gi, 'aynı gün dönüş');
      val = val.replace(/otel konaklamasından/gi, 'klinik hizmetlerinden');
      val = val.replace(/konaklamalı/gi, 'her şey dahil');
      val = val.replace(/konaklama ve transfer dahil/gi, 'tüm medikal aşamaları içeren');
      val = val.replace(/otel ve ulaşım masraflarını hafifletmek adına/gi, 'bütçe dostu her şey dahil paketlerimiz ile');
      val = val.replace(/uçak bileti ve konaklama maliyetlerine katlanmak yerine/gi, 'yüksek masraflara katlanmak yerine');
      val = val.replace(/bir gece otelde dinlenmeniz/gi, 'evde dinlenmeniz');

      // English fields
      val = val.replace(/VIP transfer and accommodation (options|facilities|opportunities|to patients)/gi, 'easy clinic access and same-day return');
      val = val.replace(/VIP transfer and accommodation/gi, 'easy clinic access');
      val = val.replace(/VIP transfer, prices, and/gi, 'prices and');
      val = val.replace(/VIP transfer/gi, 'easy clinic access');
      val = val.replace(/hotel accommodation/gi, 'same-day return');
      val = val.replace(/luxurious hotel accommodation to airport transfers/gi, 'expert consultation to post-op medical care');
      val = val.replace(/VIP vehicle airport-hotel-clinic transfers/gi, 'specialist care and PRP support');
      val = val.replace(/hotel and transportation costs/gi, 'procedure costs');
      val = val.replace(/4 or 5-star hotel including breakfast/gi, 'clinical consultation and procedure');
      val = val.replace(/directly to your hotel or clinic by a private vehicle/gi, 'to our clinic');
      val = val.replace(/\bhotel\b/gi, 'clinic');
      val = val.replace(/\bhotels\b/gi, 'clinics');
      val = val.replace(/rest in a hotel for one night/gi, 'rest comfortably');

      if (val !== art[field]) {
        art[field] = val;
        changed = true;
      }
    }
  });
  if (changed) {
    console.log(`Sanitized: ${art.slug}`);
  }
});

fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');
console.log(`Successfully sanitized and saved ${articles.length} articles.`);
