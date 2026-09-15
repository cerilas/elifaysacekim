# 64px portreden uzman tanıtımına

Yalnızca iki bölümden oluşan bağımsız React + GSAP örneği. Mevcut klinik sayfasını değiştirmez.

```sh
npm ci
npm run dev
npm run build
```

Node 22.12 veya üstü gerekir. Geliştirme adresi: http://127.0.0.1:5180

## Kullanım

`src/PortraitScrollTransition.tsx` ve `src/portrait-scroll.css` dosyalarını projenize kopyalayın. React, React DOM ve GSAP bağımlılıklarını kurun.

```tsx
import { PortraitScrollTransition } from './PortraitScrollTransition';

<PortraitScrollTransition
  name="Elif Ay"
  title="Saç ekim uzmanı"
  portraitSrc="/images/elif-ay.webp"
  portraitPosition="50% 35%"
/>
```

Fotoğraf verilmediği için örnekte açıkça belirtilmiş temsili bir portre alanı vardır. Gerçek fotoğraf `portraitSrc` ile eklenir. En az 900×1125 px dikey fotoğraf önerilir.

İlk bölümde 64×64 daire, ikinci bölümde büyük dikey portre bulunur. Animasyon sırasında tek bir ortak görsel kullanılır: ölçülen başlangıç ve bitiş alanları arasında konum, ölçek ve kırpma biçimi değişir. İlk bölümün metni kaybolurken ikinci bölümün metni kademeli açılır. Kaydırma tersine çevrildiğinde geçiş de tersine döner.

- Doğal sayfa kaydırması; pinleme veya scroll kilidi yok.
- GSAP ScrollTrigger `scrub: true`; zaman tabanlı otomatik oynatma yok.
- Yeniden boyutlandırmada iki alanın konumları yeniden ölçülür.
- Mobilde ikinci bölüm dikey yerleşime geçer.
- Azaltılmış hareket tercihinde iki görsel sabit gösterilir, geçiş kapatılır.
- Bileşen kaldırıldığında kendi animasyonları, gözlemcileri ve ScrollTrigger kayıtları temizlenir.
- Projenizde özel scroll kapsayıcısı veya smooth-scroll kütüphanesi varsa ScrollTrigger entegrasyonunu buna göre uyarlayın.

`dist/` klasörü derlenmiş örnektir; HTTP sunucusu üzerinden servis edin.
