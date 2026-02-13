# DenizKartım Prototip — Cursor Prompt Planı

## Genel Bilgi

**Teknoloji:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
**Yaklaşım:** Mobile-first web app, 390px viewport öncelikli, max-width 430px
**Veri:** Statik JSON mock data (API simülasyonu yok, doğrudan import)
**Ekranlar:** 8 ana ekran + alt ekranlar

---

## Ön Hazırlık

Cursor'da projeye başlamadan önce şu dosyaları oluşturmanız gerekiyor:

1. `public/mock/user_data.json` — Paylaştığınız mock data dosyasını buraya koyun
2. Aşağıdaki prompt'ları sırayla Cursor'a verin
3. Her prompt bir öncekinin çıktısına bağımlıdır — sırayı bozmayın

---

## PROMPT 0: Proje Kurulumu ve Yapı

```
DenizKartım adında bir mobile-first fintech web uygulaması prototipi oluşturuyorum.
Bu bir Türk bankacılık uygulaması prototipi — tüm metinler Türkçe olacak.

Teknoloji stack:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animasyonlar için)
- Lucide React (ikonlar için)
- Recharts (grafikler için)

Proje yapısı:
```
src/
  app/
    layout.tsx          — Mobile shell (max-w-[430px], mx-auto, min-h-screen)
    page.tsx            — Ana Sayfa / Dashboard
    kartlarim/
      page.tsx          — Kartlarım listesi
      [kartRef]/
        page.tsx        — Kart detay sayfası
    analizler/
      page.tsx          — Harcama analizleri + AI asistan
    odemeler/
      page.tsx          — Ödeme takvimi
    profil/
      page.tsx          — Profil ve banka bağlantıları
  components/
    layout/
      BottomNav.tsx     — Alt navigasyon (5 tab)
      TopBar.tsx        — Üst bar (isim, bildirim, avatar)
      MobileShell.tsx   — App container wrapper
    dashboard/
      QuickSummary.tsx  — Toplam borç, limit, ödeme özeti
      CardCarousel.tsx  — Kart carousel
      UpcomingPayments.tsx — Yaklaşan ödemeler widget
      QuickActions.tsx  — Hızlı aksiyonlar
      AiInsightCard.tsx — AI öneri kartı
    cards/
      CardVisual.tsx    — 3D kart görseli
      CardDetail.tsx    — Kart detay bilgileri
      TransactionList.tsx — İşlem listesi
      TransactionItem.tsx — Tekil işlem satırı
    analytics/
      SpendingChart.tsx — Harcama dağılım grafiği
      CategoryBreakdown.tsx — Kategori kırılımı
      SubscriptionManager.tsx — Abonelik yönetimi
      AiAssistant.tsx   — AI asistan chat/öneri arayüzü
      InstallmentProjection.tsx — Taksit projeksiyon tablosu
    payments/
      PaymentCalendar.tsx — Ödeme takvimi
      PaymentCard.tsx   — Tekil ödeme kartı
    profile/
      BankConnection.tsx — Banka bağlantı kartı
      ConsentManager.tsx — İzin yönetimi
    shared/
      AmountDisplay.tsx — Para formatı component
      Badge.tsx         — Durum badge'i
      ProgressBar.tsx   — İlerleme çubuğu
  lib/
    data.ts            — Mock data import ve type'lar
    types.ts           — TypeScript type tanımları
    utils.ts           — Yardımcı fonksiyonlar (para format, tarih, kategori eşleştirme)
    categories.ts      — MCC kod → kategori eşleştirme
    constants.ts       — Sabit değerler, renkler
  hooks/
    useFinancialSummary.ts — Finansal özet hesaplamaları
    useSubscriptions.ts    — Abonelik tespit hook'u
    useTransactions.ts     — İşlem filtreleme/gruplama
```

Design prensipleri:
- Mobile-first: Tüm tasarım 390px viewport için optimize, max-width 430px
- App-like UX: iOS native app hissi — safe area padding, bottom nav, smooth transitions
- Renk paleti: Navy (#0A1628) primary, Teal (#0EA5E9) accent, Red (#EF4444) dikkat/borç, Green (#10B981) gelir/olumlu, arka plan gradient koyu mavi-siyah
- Font: Geist Sans (veya SF Pro benzeri sistem fontu)
- Glassmorphism efektleri kart bileşenlerinde
- Framer Motion ile sayfa geçişleri ve list animasyonları

Lütfen proje kurulumunu yap:
1. Next.js projesini oluştur
2. Tüm bağımlılıkları ekle
3. Tailwind config'i kur (renk paleti dahil)
4. Temel layout.tsx ve MobileShell wrapper'ını oluştur
5. BottomNav component'ini oluştur (Ana Sayfa, Kartlarım, Analizler, Ödemeler, Profil — 5 tab, aktif tab animasyonlu)
6. TopBar component'ini oluştur (sol: avatar + "Merhaba Mert" / sağ: bildirim ikonu + badge)
7. types.ts dosyasını oluştur — mock data'daki tüm yapıları TypeScript type olarak tanımla
8. Mock data'yı public/mock/user_data.json'dan import eden data.ts'i oluştur
9. utils.ts'e para formatlama (Türk lirası: 42.800,00 ₺), tarih formatlama, MCC kategori eşleştirme fonksiyonlarını ekle

Mock data'yı sana ayrıca vereceğim, şimdilik type tanımlarını ve boş data import yapısını kur.
```

> **Not:** Bu prompt'tan sonra mock data JSON dosyasını Cursor'a yapıştırın veya dosya olarak ekleyin.

---

## PROMPT 1: Veri Katmanı ve Yardımcı Fonksiyonlar

```
Mock data dosyamı (public/mock/user_data.json) projeye ekledim.
Şimdi veri katmanını oluştur:

1. lib/categories.ts — MCC (Merchant Category Code) eşleştirme:
   - 4899 → "Dijital İçerik" (Netflix, YouTube)
   - 5411 → "Market" (Migros, CarrefourSA, Getir)
   - 5541 → "Akaryakıt" (Shell, BP)
   - 5651 → "Giyim" (Zara)
   - 5732, 5734 → "Teknoloji" (Teknosa, yazılım abonelikleri)
   - 5735 → "Apple" 
   - 5812, 5814 → "Yeme & İçme" (restoran, kafe)
   - 5815 → "Müzik" (Spotify)
   - 5818 → "Eğitim" (Duolingo)
   - 5912 → "Kişisel Bakım" (Watsons)
   - 5942 → "Kitap & Hobi" (D&R, Amazon)
   - 5968 → "Abonelik" (Amazon Prime)
   - 7922 → "Eğlence" (Biletix)
   - 3000 → "Havayolu" (THY)
   - 5311 → "E-Ticaret" (Trendyol)
   Her kategori için bir ikon adı (lucide-react) ve renk kodu belirle.

2. hooks/useFinancialSummary.ts — Tüm kart verilerini konsolide eden hook:
   - toplamBorc: Tüm kartların kalanEkstreBorcu toplamı (42.800 TL)
   - toplamLimit: Tüm kartların toplamLimit toplamı (200.000 TL)
   - toplamKullanilabilirLimit: (132.570 TL)
   - toplamAsgariOdeme: Tüm kartların kalanAsgariOdemeTutari toplamı (9.900 TL)
   - yaklasanOdemeler: sonOdemeTarihi'ne göre sıralı [{kart, tarih, tutar, asgari}]
   - toplamTaksitYuku: Gelecek 12 ay taksit projeksiyonu (donemTaksitTutarBilgisi birleştir)
   - hesapBakiyesi: Tüm hesap bakiyeleri toplamı (TRY)
   - puanOzeti: [{puanTipi, toplam}] birleştirilmiş puan bilgisi

3. hooks/useSubscriptions.ts — Abonelik tespit eden hook:
   - oncekiDonemOrnekleri ve kartHareketleri'ni karşılaştır
   - Aynı islemAciklamasi + benzer tutar = abonelik
   - Tespit edilecekler: Netflix (279 TL), Spotify (59.99 TL), YouTube Premium (149.99 TL), 
     Apple.com/Bill (199 TL), iCloud Storage (79.99 TL), Google One (129.99 TL), 
     Amazon Prime (49.99 TL), Adobe Creative Cloud (189.99 TL), Duolingo Plus (34.99 TL),
     ChatGPT ($49.99), GitHub ($12.99), Midjourney ($22.00)
   - Her abonelik: {ad, tutar, paraBirimi, kartRef, kartAdi, kategori, sonIslemTarihi}
   - toplamAylikAbonelik: TRY ve USD ayrı

4. hooks/useTransactions.ts — İşlem listeleme/filtreleme hook'u:
   - Tüm kartlardan işlemleri birleştir
   - Tarihe göre sırala (en yeni önce)
   - Kategori bazlı filtreleme
   - Kart bazlı filtreleme
   - Harcama/ödeme ayrımı (borcAlacak: B/A)
   - Taksitli işlem flag'i
```

---

## PROMPT 2: Dashboard (Ana Sayfa)

```
Ana Sayfa (Dashboard) ekranını oluştur — app/page.tsx

Bu, kullanıcının uygulamayı açtığında gördüğü ilk ekran. "Tek bakışta tüm finansal durum" prensibinde olacak.

Ekran düzeni (yukarıdan aşağıya scroll):

1. **TopBar** — "Merhaba Mert" + bildirim ikonu (mevcut component)

2. **QuickSummary** — Glassmorphism kart, gradient arka plan (koyu mavi → siyah)
   - Ortada büyük: "Toplam Borç" → 42.800,00 ₺ (animasyonlu sayaç efekti)
   - Altında iki kolon:
     - Sol: "Kullanılabilir Limit" → 132.570,35 ₺ (yeşil)
     - Sağ: "Bu Ay Asgari" → 9.900,00 ₺ (turuncu)
   - En altta: Limit kullanım oranı progress bar (%33.7 kullanılmış)

3. **CardCarousel** — Yatay scroll kart carousel
   - Her kart: 3D perspektif efekti olan kart görseli
     - Kart üzerinde: kartUrunAdi, kartNo (maskelenmiş), kartSema logosu
     - Kart altında: Kalan borç | Kullanılabilir limit | Son ödeme
   - Kartlar: Axess Platinum (VISA), Wings Mastercard (MC), Axess Sanal (VISA)
   - Aktif kart ortalanmış, yanlar blur + scale-down efekti
   - Dot indicator altta

4. **UpcomingPayments** — "Yaklaşan Ödemeler" widget
   - Başlık: "Yaklaşan Ödemeler" + "Tümünü Gör" link
   - Wings MC: 18 Nisan → 18.250 TL (kırmızı, 3 gün kaldı uyarısı)
   - Axess: 22 Nisan → 24.550 TL (sarı, 7 gün)
   - Her birinde asgari ödeme tutarı da küçük yazıyla gösterilsin

5. **AiInsightCard** — AI öneri kartı (tek kart, swipe ile farklı öneriler)
   - Örnek: "💡 Bu ay 12 aktif aboneliğiniz var, toplam 1.173 TL/ay. 
     Geçen ay kullanmadığınız 2 abonelik tespit ettik. Detayları görmek ister misiniz?"
   - Gradient border efekti (AI hissi veren mor-mavi)
   - "İncele" butonu → /analizler sayfasına yönlendir

6. **QuickActions** — 4'lü grid hızlı aksiyon butonları
   - Borç Öde | Kart Ekle | Harcamalarım | Taksitlerim
   - Her biri ikon + label, tıklanabilir, hafif bounce animasyonu

Tüm bileşenlerde:
- Framer Motion ile staggered entrance animasyonları (yukarıdan aşağı sırayla)
- Pull-to-refresh hissi için scroll snap
- Koyu tema, glassmorphism kartlar, subtle gradient arka planlar
- Para tutarları AmountDisplay component ile formatlanacak (42.800,00 ₺ formatı)
- Tarihler Türkçe format (18 Nisan 2026)
```

---

## PROMPT 3: Kart Görsel Bileşeni ve Kartlarım Sayfası

```
Kartlarım sayfasını (app/kartlarim/page.tsx) ve kart görsel bileşenini oluştur.

1. **CardVisual.tsx** — 3D kredi kartı görseli:
   - Gerçekçi kart tasarımı (rounded-2xl, aspect-[1.586/1] kredi kartı oranı)
   - Kart renkleri kartUrunAdi'na göre:
     - Axess Platinum → Gradient: koyu gri → siyah (premium his)
     - Wings Mastercard → Gradient: koyu kırmızı → bordo
     - Axess Sanal → Gradient: koyu mavi → lacivert, "SANAL" etiketi
     - Banka Kartı → Gradient: açık mavi → koyu mavi
   - Kart üzerinde:
     - Sol üst: kartUrunAdi
     - Orta: kartNo (maskelenmiş, monospace font, letter-spacing)
     - Sol alt: kartSema logosu (VISA/MC/TROY text olarak stilize)
     - Sağ alt: "Akbank" yazısı
   - Hafif 3D tilt efekti (mouse/touch'ta parallax)
   - Glassmorphism overlay pattern

2. **Kartlarım sayfası** — Tüm kartların listesi:
   - Sayfa başlığı: "Kartlarım" + filtre (Tümü / Kredi / Banka)
   - Her kart için tam genişlik kart alanı:
     - CardVisual component (küçük boyut)
     - Yanında: Kart adı, son 4 hane, kart tipi badge
     - Altında: Ekstre borcu | Kullanılabilir limit | Son ödeme
     - Taksitli işlem varsa: "X TL taksit yükü" badge
     - Puan bilgisi varsa: "12.840 Axess Puan" badge
   - Karta tıklayınca /kartlarim/[kartRef] sayfasına git
   - Sanal kart, asıl kartın (asilKartNo) altında grouped gösterilsin
   - Banka kartı ayrı seksiyonda

3. **Hesap Bilgileri** bölümü (kartlar altında):
   - "Hesaplarım" başlığı
   - Maaş hesabı: 47.832,56 ₺ (yeşil) — "Axess Vadesiz Hesap"
   - Döviz hesabı: $1.245,80 — "Döviz Vadesiz Hesap"  
   - KMH: -3.200,00 ₺ (kırmızı) — "KMH Vadesiz Hesap"
   - Her hesap minimal kart tasarımı
```

---

## PROMPT 4: Kart Detay Sayfası

```
Kart detay sayfasını (app/kartlarim/[kartRef]/page.tsx) oluştur.

Dinamik route: kartRef parametresine göre ilgili kartın verisi yüklenecek.

Ekran düzeni:

1. **Üst bölüm** — Kart görseli + özet
   - CardVisual (büyük, ekran genişliği)
   - Altında 4'lü bilgi grid:
     - Ekstre Borcu: 24.550,00 ₺
     - Kullanılabilir Limit: 74.250,35 ₺
     - Toplam Limit: 120.000,00 ₺
     - Son Ödeme: 22 Nisan 2026
   - Limit kullanım progress bar
   - Puan bilgisi: "12.840 Axess Puan | 3.200 Chip Para"

2. **Tab navigasyonu** — Sticky tab bar (ekran scroll'unda yapışır):
   - Hareketler | Taksitler | Ekstre

3. **Hareketler tab'ı** (varsayılan):
   - TransactionList component
   - Tarih bazlı gruplama ("Bugün", "Dün", "8 Nisan", "7 Nisan"...)
   - Her TransactionItem:
     - Sol: Kategori ikonu (renkli daire) + İşlem adı + kart bilgisi
     - Sağ: Tutar (kırmızı harcama, yeşil ödeme/iade)
     - Alt satır: Taksit bilgisi varsa "1/6 taksit" badge + puan bilgisi
     - MCC'den gelen kategori adı küçük yazıyla
   - TRY ve USD işlemleri ayrı seksiyon veya toggle
   - Filtre: Tümü / Harcama / Ödeme / Taksitli

4. **Taksitler tab'ı**:
   - InstallmentProjection component
   - Aktif taksitli işlemler listesi:
     - Teknosa: 18.500 TL (6 taksit, 1. taksit → 3.083 TL/ay)
     - D&R: 6.500 TL (3 taksit → 2.167 TL/ay)
     - THY: 8.900 TL (4 taksit → 2.225 TL/ay) — Wings kartında
   - Gelecek 12 ay taksit projeksiyon grafiği (Recharts bar chart)
     - donemTaksitTutarBilgisi verisini kullan
     - X ekseni: ay isimleri, Y ekseni: tutar
     - Renk kodlu: mevcut dönem highlight

5. **Ekstre tab'ı**:
   - Dönem seçici (Nisan 2026, Mart 2026...)
   - Ekstre özet kartı: Ekstre borcu, asgari ödeme, hesap kesim tarihi
   - "Borç Öde" butonu (primary, tam genişlik)
```

---

## PROMPT 5: Analizler Sayfası (Harcama Analitikleri + AI Asistan)

```
Analizler sayfasını (app/analizler/page.tsx) oluştur.
Bu sayfa uygulamanın "akıllı" katmanı — en çok değer üreten bölüm.

Üstte tab bar: Harcamalar | Abonelikler | AI Asistan

### Tab 1: Harcamalar

1. **SpendingChart** — Donut/pie chart (Recharts)
   - Tüm kartlardan birleşik harcama dağılımı
   - Merkezde: Toplam harcama tutarı
   - Kategori renkleri categories.ts'den
   - Kategoriler (mock data'dan hesaplanmış):
     - Teknoloji: 18.500 TL (%30)
     - E-Ticaret: 6.785 TL (%11)
     - Market: ~4.713 TL (%8)
     - Havayolu: 8.900 TL (%15)
     - Yeme & İçme: ~4.770 TL (%8)
     - Giyim: 3.750 TL (%6)
     - Abonelikler: ~1.173 TL (%2)
     - Diğer: kalan
   - Animasyonlu geçiş

2. **CategoryBreakdown** — Kategori detay listesi
   - Her kategori: İkon + Ad + Tutar + Yüzde + Progress bar
   - Tıklayınca o kategorideki işlemler expand olur
   - "Geçen aya göre" değişim göstergesi (↑%15 veya ↓%8)

3. **Harcama Trendi** — Son 3 ay çizgi grafik
   - Aylık toplam harcama trend çizgisi
   - Ortalamanın üstünde/altında renk değişimi

### Tab 2: Abonelikler (SubscriptionManager)

Bu bölüm useSubscriptions hook'unu kullanır.

1. **Abonelik Özeti Kartı**
   - "12 Aktif Abonelik" başlık
   - Toplam: 1.173 TL/ay + $84.98/ay
   - Yıllık projeksiyon: ~14.076 TL + ~$1.020

2. **Abonelik Listesi** — Kartlar halinde
   Her abonelik kartı:
   - Logo/ikon + İsim + Tutar
   - Hangi karttan çekildiği (badge)
   - Son çekim tarihi
   - "Kullanıyor" veya "Kullanım tespit edilemedi" durumu
   - Aksiyon: "Hatırlatma Kur" | "Detay"
   
   Grupla: TRY abonelikler / USD abonelikler

3. **Abonelik İpuçları** — AI insight kartı
   - "iCloud Storage + Google One: İkisi de bulut depolama. 
     Birini iptal ederek ayda 80-130 TL tasarruf edebilirsiniz."

### Tab 3: AI Asistan (AiAssistant)

Chat benzeri arayüz ama gerçek AI değil, önceden tanımlanmış senaryolar:

1. **Proaktif Öneriler** — Kart listesi (swipeable):
   Önceden tanımlı 5 öneri kartı (mock data'dan türetilmiş):
   
   a) Abonelik Uyarısı:
   "12 aktif aboneliğiniz var (1.173 TL/ay). iCloud Storage ve Google One 
   ikisi de bulut depolama servisi — birini iptal ederek ayda 80-130 TL 
   tasarruf edebilirsiniz."
   
   b) Taksit Yükü Uyarısı:
   "Gelecek ay toplam taksit yükünüz 6.800 TL olacak (Axess: 4.800 TL + 
   Wings: 2.000 TL). Maaş hesabınızdaki 47.832 TL ile karşılanabilir 
   durumda."
   
   c) KMH Uyarısı:
   "Kredili Mevduat Hesabınızda -3.200 TL eksi bakiye var. KMH faiz oranı 
   yüksektir. Maaş hesabınızdan aktarma yaparak faiz yükünü azaltabilirsiniz."
   
   d) Harcama Pattern:
   "Bu dönem en yüksek harcama kategoriniz Teknoloji (18.500 TL - Teknosa). 
   Bu, 6 taksitli bir alım. Taksit dışı en yüksek kategoriniz Yeme & İçme 
   (4.770 TL)."
   
   e) Puan Optimizasyonu:
   "12.840 Axess Puanınız ve 45.200 Wings Mil'iniz var. Wings Mil'lerinizi 
   THY bilet alımında kullanarak önemli tasarruf sağlayabilirsiniz. 
   Mevcut 45.200 mil ile yurt içi gidiş-dönüş bilet alabilirsiniz."

2. **Hızlı Soru Butonları** (öneri kartlarının altında):
   - "Bu ay ne kadar harcadım?"
   - "Taksit yüküm ne kadar?"
   - "Aboneliklerimi göster"
   - "Tasarruf önerisi ver"
   
   Her buton tıklandığında ilgili öneri kartı genişler/detaylanır.

Tasarım: AI bölümü gradient border ile vurgulanmış, mor-mavi tonlarında, 
diğer bölümlerden farklı bir "akıllı" hissi vermeli.
```

---

## PROMPT 6: Ödeme Takvimi Sayfası

```
Ödemeler sayfasını (app/odemeler/page.tsx) oluştur.

1. **PaymentCalendar** — Aylık takvim görünümü
   - Nisan 2026 takvimi
   - Ödeme günleri vurgulu:
     - 18 Nisan: Wings MC → kırmızı dot (yakın, 3 gün kaldı)  
     - 22 Nisan: Axess Platinum → sarı dot (7 gün kaldı)
   - Tarih seçilince altında detay kartı açılır
   - Ay navigasyonu (ileri/geri)

2. **Ödeme Özeti** (takvim altı)
   - "Bu Ay Ödenecek" başlık
   - Toplam: 42.800,00 ₺
   - Asgari: 9.900,00 ₺
   - "Tam ödeme yaparsanız 0 ₺ faiz" bilgi notu

3. **PaymentCard** — Her kart için ödeme kartı:
   
   Wings Mastercard:
   - Son ödeme: 18 Nisan 2026 (3 gün kaldı! — kırmızı badge)
   - Ekstre borcu: 18.250,00 ₺
   - Asgari ödeme: 5.475,00 ₺
   - "Borç Öde" butonu (primary)
   - "Asgari Öde" butonu (secondary/outline)
   
   Axess Platinum:
   - Son ödeme: 22 Nisan 2026 (7 gün)
   - Ekstre borcu: 24.550,00 ₺
   - Asgari ödeme: 4.425,00 ₺
   - Aynı butonlar

4. **Faiz Hesaplayıcı** — Küçük interaktif widget
   - Slider: "Ne kadar ödeyeceksiniz?" (asgari → tam arası)
   - Gerçek zamanlı faiz hesaplama gösterimi
   - "Asgari öderseniz → ~X TL faiz ödenir"
   - "Tam öderseniz → 0 TL faiz"

5. **Gelecek Ay Projeksiyonu**
   - Gelecek ayın tahmini borcu (taksitler + tahmini harcama)
   - donemTaksitTutarBilgisi'nden dönem 1 toplamı: 6.800 TL sadece taksit
   - Uyarı: "Gelecek ay minimum 6.800 TL taksit ödemesi olacak"
```

---

## PROMPT 7: Profil ve Banka Bağlantıları

```
Profil sayfasını (app/profil/page.tsx) oluştur.

1. **Kullanıcı Bilgi Kartı**
   - Avatar + "Mert Yılmaz"
   - Üyelik bilgisi: "DenizKartım kullanıcısı"
   - Son giriş tarihi

2. **Banka Bağlantıları** bölümü
   
   **Bağlı Bankalar:**
   - Akbank kartı:
     - Akbank logosu (placeholder olarak renkli daire + "A" harfi)
     - "Akbank — Bağlı"
     - Bağlantı tarihi: 15 Nisan 2026
     - Erişim izni bitiş: 15 Ekim 2026
     - İzin durumu: "9/9 izin aktif" (yeşil badge)
     - "İzinleri Yönet" butonu → ConsentManager modal
     - "Bağlantıyı Kaldır" butonu (kırmızı, outline)
   
   **Banka Ekle** butonu:
   - Büyük, dashed border kart
   - "+" ikonu + "Yeni Banka Bağla"
   - Tıklayınca onboarding flow mockup (basit):
     - Banka seçim ekranı (grid: banka logoları)
     - İzin açıklama ekranı ("Şu bilgileri alacağız: ...")
     - "Bankaya Yönlendiriliyorsunuz" loading ekranı
     - Başarı ekranı

3. **ConsentManager** (bottom sheet / modal):
   - İzin türleri listesi (9 adet):
     - 01: Temel Hesap Bilgisi ✅
     - 02: Ayrıntılı Hesap Bilgisi ✅
     - 03: Bakiye Bilgisi ✅
     - 04: İşlem Bilgisi ✅
     - 05: Temel Kart Bilgisi ✅
     - 06: Ayrıntılı Kart Bilgisi ✅
     - 07: Kart Bakiye Bilgisi ✅
     - 08: Kart İşlem Bilgisi ✅
     - 09: Kart Ekstre Bilgisi ✅
   - Her biri toggle switch ile
   - "Erişim izni 15 Ekim 2026'da sona erecek" bilgisi
   - "İzinleri Güncelle" butonu

4. **Ayarlar** bölümü (basit):
   - Bildirim tercihleri (toggle)
   - Ödeme hatırlatma zamanı
   - Para birimi tercihi
   - Uygulama dili
   - Hakkında / KVKK bilgilendirme
```

---

## PROMPT 8: Hesap İşlemleri ve Detaylar

```
Hesap işlemlerini dashboard ve kart detay sayfasına entegre et.

1. **Dashboard'a ekle:** Hesap hareketleri widget
   - "Son Hesap Hareketleri" başlığı
   - Son 5 hesap işlemi:
     - 12 Nisan: ATM Para Çekme → -2.500 TL
     - 10 Nisan: İSKİ Su Faturası → -1.355,50 TL
     - 8 Nisan: Türk Telekom → -385,50 TL
     - 7 Nisan: İGDAŞ Doğalgaz → -960,00 TL
     - 5 Nisan: Arkadaşa Transfer → -1.850,00 TL
   - Her işlem: ikon + açıklama + tutar + güncel bakiye

2. **Maaş tespiti badge'i** dashboard'a ekle:
   - QuickSummary altına: "Maaş Geliri Tespit Edildi: 42.500 TL/ay" 
   - Küçük, subtle bilgi kartı
   - Bu, Faz 3'teki "anlık limit teklifi" feature'ının temelidir

3. **Fatura tespiti** analizler sayfasına ekle:
   - Düzenli ödemeler bölümü:
     - İGDAŞ Doğalgaz: 960 TL/ay
     - Türk Telekom: 385,50 TL/ay
     - İSKİ Su: 1.355,50 TL/ay
     - Kira: 8.750 TL/ay
   - Toplam düzenli gider: ~11.451 TL/ay
   - "Gelir vs Gider" basit özet:
     - Maaş: 42.500 TL
     - Düzenli gider: 11.451 TL
     - Kart ödemeleri: ~9.900 TL (asgari)
     - Kalan: ~21.149 TL
```

---

## PROMPT 9: Animasyonlar, Geçişler ve Son Dokunuşlar

```
Uygulamaya son dokunuşları ekle:

1. **Sayfa Geçişleri** (Framer Motion):
   - Her sayfa fade-up animasyonla giriş (y: 20 → 0, opacity: 0 → 1)
   - Sayfa geçişlerinde layout animation
   - Tab değişimlerinde slide animasyonu

2. **Scroll Davranışları**:
   - Dashboard TopBar: scroll'da compact mode (küçülen, blur arka plan)
   - Kart detay: kart görseli scroll'da shrink efekti (parallax)
   - Sticky tab barlar doğru çalışsın

3. **Mikro Etkileşimler**:
   - Kart tıklanınca hafif scale pulse
   - Buton press efekti (scale: 0.97)
   - Toggle switch animasyonu
   - Amount counter animasyonu (sayı yukarı kayarak değişir)
   - Pull-down refresh animasyonu (simüle)
   - Skeleton loading states her bileşen için

4. **Empty States & Edge Cases**:
   - Banka bağlı değilken dashboard görünümü
   - Kart yok durumu
   - Loading skeleton'lar

5. **PWA Dokunuşları**:
   - manifest.json (DenizKartım, Denizbank renkleri)
   - viewport meta tag: width=device-width, viewport-fit=cover
   - safe-area-inset padding'ler (özellikle bottom nav)
   - status bar rengi
   - splash screen

6. **Accessibility**:
   - Tüm para tutarlarında aria-label (ekran okuyucu için)
   - Tab navigation çalışsın
   - Renk kontrastları WCAG AA uyumlu
   - Touch target'lar minimum 44x44px
```

---

## Notlar

### Cursor Kullanım İpuçları
- Her prompt'u ayrı bir Cursor chat'inde verin (Composer mode tercih edin)
- Prompt sonrası hata varsa, hata mesajını Cursor'a yapıştırıp "fix this" deyin
- Component'ler arası bağımlılıklarda Cursor'a ilgili dosyaları @mention ile gösterin
- Mock data dosyasını @file ile referans verin

### Sıralama Önerisi
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 sırasıyla ilerleyin.
Her adımda çalışır durumda olduğundan emin olun, sonraki adıma geçin.

### Design Token'lar (Tüm Prompt'larda Geçerli)
```
Primary: #0A1628 (Navy)
Accent: #0EA5E9 (Teal/Sky)
Danger: #EF4444 (Red)
Success: #10B981 (Green)  
Warning: #F59E0B (Amber)
Surface: #111827 (Dark surface)
Card: rgba(255,255,255,0.05) (Glass card)
Border: rgba(255,255,255,0.1)
Text Primary: #F9FAFB
Text Secondary: #9CA3AF
```
