# DenizKartım - CTO Sunum Metni

---

## INTRO

DenizKartım, Türkiye'deki açık bankacılık (Open Banking) altyapısını kullanarak birden fazla bankadaki hesap ve kredi kartı bilgilerini tek bir mobil arayüzde birleştiren bir kişisel finans yönetim uygulamasıdır.

**Problem:** Türkiye'de ortalama bir kullanıcı 2-3 farklı bankada hesap ve kredi kartına sahip. Her banka için ayrı mobil uygulama kullanmak, toplam borç takibi, harcama analizi ve ödeme planlaması yapmayı zorlaştırıyor.

**Çözüm:** DenizKartım, BDDK/TCMB düzenlemelerine uygun şekilde HHS (Hesap Hizmeti Sağlayıcısı) entegrasyonları üzerinden kullanıcının tüm finansal verilerini tek noktada topluyor. Uygulama bu verileri sadece göstermekle kalmıyor; harcama analizi, abonelik tespiti, faiz hesaplama ve yapay zeka destekli finansal öneriler sunuyor.

### Teknik Özet

| Alan | Detay |
|------|-------|
| **Framework** | Next.js 14.2 (App Router) + React 18.3 |
| **Dil** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 3.4 |
| **Animasyon** | Framer Motion 11 |
| **Grafikler** | Recharts 2.15 |
| **İkonlar** | Lucide React |
| **Mimari** | Client-side SPA, mobile-first (430px shell) |
| **Veri Katmanı** | Şu an mock JSON; Open Banking API'ye hazır arayüz yapısı |
| **State Yönetimi** | React Hooks + Custom Data Hooks (Redux/Zustand yok) |
| **Routing** | Next.js App Router (5 ana sayfa + 1 dinamik) |

### Mevcut Durum
Uygulama şu an **demo/prototype** aşamasında. Gerçek API entegrasyonu yok; tüm veriler `/public/mock/user_data.json` dosyasından okunuyor. Ancak veri yapıları TCMB Open Banking standartlarına (HHS, hesap, kart, işlem şemaları) uygun modellenmiş durumda. Bu sayede gerçek API entegrasyonu yapıldığında sadece veri katmanının değişmesi yeterli olacak, UI katmanı büyük ölçüde aynı kalacak.

---

## SAYFA HİYERARŞİSİ

```
/                          → Ana Sayfa (Dashboard)
├── /kartlarim             → Kartlarım (Kart Listesi)
│   └── /kartlarim/[ref]   → Kart Detay (Dinamik Sayfa)
├── /analizler             → Analizler (3 tab: Harcama, Abonelik, AI)
├── /odemeler              → Ödemeler (Takvim, Faiz Hesaplama)
└── /profil                → Profil (Banka Bağlantıları, Ayarlar)
```

Alt navigasyon çubuğu (BottomNav) ile 5 ana sayfa arasında geçiş sağlanıyor. Tüm sayfalar `MobileShell` layout bileşeni içinde render ediliyor (max 430px genişlik, mobil deneyim).

---

## SAYFA SAYFA DETAY

### 1. Ana Sayfa (Dashboard) — `/`

Uygulamanın giriş noktası. Kullanıcının tüm finansal durumunu tek bakışta özetliyor.

**Bileşenler:**
- **QuickSummary** — Toplam borç, toplam limit, kullanılabilir limit ve limit kullanım oranı. Tek bir kart içinde finansal snapshot.
- **SalaryBadge** — Hesap işlemlerinden tespit edilen maaş yatırımını gösteriyor (tutarı ve bankayı). Algoritmik olarak "maaş" pattern'i arıyor.
- **CardCarousel** — Yatay kaydırılabilir kart galerisi. Her kart gerçekçi bir 3D kart görseli ile temsil ediliyor (gradient, banka logosu, kart numarası maskeli).
- **UpcomingPayments** — Yaklaşan ödeme tarihleri ve tutarları. Gün sayısına göre renk kodlu aciliyet göstergesi (kırmızı: <3 gün, turuncu: <7 gün).
- **AiInsightCard** — Yapay zeka destekli finansal öneri kartı. Harcama patternlerine dayalı kişiselleştirilmiş tavsiyeler.
- **QuickActions** — Hızlı erişim butonları (Ödeme Yap, Kart Detay, Harcama Analizi).
- **AccountTransactions** — Son 8 hesap hareketi. Tarih, açıklama, tutar ve işlem yönü (gelen/giden).

**Veri Kaynağı:** `useFinancialSummary` ve `useAccountInsights` custom hook'ları.

---

### 2. Kartlarım — `/kartlarim`

Kullanıcının tüm bankalardan çekilen kartlarını ve hesaplarını listeleyen sayfa.

**Bileşenler:**
- **Filtre Tabları** — "Tümü", "Kredi Kartları", "Banka Kartları" filtreleme seçenekleri.
- **Kart Listesi** — Her kart için:
  - Mini kart görseli (gradient + şema rengi)
  - Kart adı ve son 4 hane
  - Badge'ler: VISA/MC/TROY, son ödeme tarihi, taksit durumu, puan bilgisi
  - Kredi kartları için: kalan borç, kullanılabilir limit, limit kullanım progress bar'ı
  - Sanal kartlar parent kartın altında indentli gösteriliyor
- **Hesaplarım Bölümü** — Banka hesapları listesi (hesap adı, bakiye, para birimi). Toplam TRY bakiye özet kartı.

**Navigasyon:** Herhangi bir karta tıklama → Kart Detay sayfasına yönlendirme.

---

### 3. Kart Detay — `/kartlarim/[kartRef]`

Tek bir kartın tüm detaylarını gösteren dinamik sayfa. Kredi kartları ve banka kartları için farklı görünümler sunar.

**Kredi Kartı Görünümü:**

- **Kart Görseli** — Büyük boyutlu 3D kart, parallax scroll efekti ile.
- **Bilgi Grid'i** (2x2):
  - Ekstre Borcu
  - Kullanılabilir Limit
  - Toplam Limit
  - Son Ödeme Tarihi
  - + Limit kullanım progress bar + Puan göstergesi

- **3 Tab (Sticky):**
  1. **Hareketler** — Kart işlemleri listesi. Tarih bazlı gruplama. Filtreler: Tümü, Borç (B), Alacak (A), Taksitli. Toplam harcama özeti.
  2. **Taksitler** — Devam eden taksitli işlemler ve aylık taksit projeksiyonu. 12 aylık timeline görünümü.
  3. **Ekstre** — Dönem seçici (son 3 ay). TRY ve USD ayrı ekstre özetleri. Kalan borç, asgari ödeme, hesap kesim tarihi, son ödeme tarihi, toplam/kullanılabilir limit. "Borç Öde" butonu.

**Banka Kartı Görünümü:** Basitleştirilmiş — sadece kart bilgileri, tab yok.

---

### 4. Analizler — `/analizler`

Kullanıcının finansal durumunu derinlemesine analiz eden sayfa. 3 tab barındırıyor.

**Tab 1: Harcamalar**
- **SpendingChart** — Donut/pasta grafik ile kategori bazlı harcama dağılımı. Recharts kütüphanesi ile interaktif.
- **CategoryBreakdown** — Kategori listesi: ikon, isim, toplam tutar, yüzde. MCC kodlarından otomatik kategori eşlemesi (Market, Akaryakıt, Yeme-İçme, Teknoloji, Giyim vb. 16+ kategori).
- **IncomeExpenseOverview** — Gelir vs gider karşılaştırması. Tespit edilen maaş, düzenli faturalar (doğalgaz, elektrik, su, internet, kira), taksit yükleri.

**Tab 2: Abonelikler**
- **SubscriptionManager** — Algoritmik olarak tespit edilen yinelenen ödemeler (Netflix, Spotify, YouTube Premium, ChatGPT, Apple iCloud vb.). Her abonelik için: isim, tutar, hangi kart, kategori, son işlem tarihi. Tespit algoritması: önceki dönem ile karşılaştırma, %10 tutar toleransı, tek seferlik kategorileri dışlama.

**Tab 3: AI Asistan**
- **AiAssistant** — 5 adet AI-üretilmiş finansal öneri kartı (carousel). Soru-cevap tarzı arayüz ile kullanıcının finansal sorularını yanıtlama (demo amaçlı).

**Veri Kaynağı:** `useTransactions`, `useSubscriptions`, `useAccountInsights` hook'ları.

---

### 5. Ödemeler — `/odemeler`

Ödeme takibi, faiz hesaplama ve gelecek ay projeksiyonu sunan sayfa.

**Bileşenler:**
- **Ödeme Özet Kartı** — Tüm kartların toplam borcu, toplam asgari ödeme. "Tam ödeme yaparak 0₺ faiz ödeyin" bilgi notu.
- **Ödeme Takvimi** — Görsel takvim üzerinde ödeme tarihleri işaretli. Tarih seçilebilir.
- **Kart Bazlı Ödeme Listesi** — Her kredi kartı için ayrı kart: kart adı, son ödeme tarihi, kalan borç, asgari ödeme, kart görseli.
- **Faiz Hesaplayıcı** — Kart seçici dropdown + ödeme tutarı slider (asgari ↔ tam borç aralığı). Gerçek zamanlı faiz hesaplaması:
  - Aylık faiz oranı: %4.42
  - Yıllık faiz oranı: %52.98
  - Sonuç: Tahmini faiz tutarı (yeşil: 0₺, kırmızı: faiz var) + kalan bakiye
  - Karşılaştırma: "Asgari ödersen X₺ faiz, tam ödersen 0₺ faiz"
- **Gelecek Ay Projeksiyonu** — Beklenen taksit ödemeleri, tahmini asgari ödeme, hesap bakiyesi karşılaştırması.

---

### 6. Profil — `/profil`

Kullanıcı profili, banka bağlantı yönetimi ve uygulama ayarları.

**Bileşenler:**
- **Kullanıcı Bilgi Kartı** — Avatar (baş harf), isim, son giriş zamanı. Hızlı istatistikler: hesap sayısı, kart sayısı, bağlı banka sayısı.
- **Banka Bağlantıları** — Bağlı bankalar listesi (banka adı, logo, bağlantı tarihi). Her banka için "Rızaları Yönet" butonu → ConsentManager modal.
- **Yeni Banka Ekle** — 4 adımlı modal akışı:
  1. Banka Seçimi (8 Türk bankası grid'i — henüz bağlı olmayanlar)
  2. İzin Açıklaması (hangi verilere erişim isteniyor: hesap bilgileri, bakiyeler, kart bilgileri, hareketler)
  3. Yönlendirme (loading animasyonu — gerçek entegrasyonda banka sayfasına yönlendirilecek)
  4. Başarı Onayı
- **Bildirim Tercihleri** — Toggle switch'ler: Ödeme hatırlatmaları, harcama uyarıları, AI önerileri.
- **Hatırlatma Zamanı** — Ödeme öncesi kaç gün hatırlat: 1, 3, 5, 7 gün.
- **Genel Ayarlar** — Para birimi seçici (TRY/USD/EUR), dil seçici (Türkçe/İngilizce).
- **Hakkında/Yasal** — KVKK Aydınlatma Metni, Gizlilik Politikası, Kullanım Koşulları, uygulama versiyonu (v1.0.0).
- **Açık Bankacılık Güvenlik Notu** — BDDK/TCMB uyumluluğu ve veri güvenliği bildirimi.

---

## MİMARİ NOTLAR

### Veri Akışı
```
Mock JSON → data.ts (accessor fonksiyonlar) → Custom Hooks (iş mantığı) → Sayfa Bileşenleri (UI)
```
Gerçek entegrasyonda sadece `data.ts` katmanı API çağrılarıyla değiştirilecek. Hook'lar ve UI katmanı aynı kalacak.

### Custom Hook'lar (İş Mantığı Katmanı)
- `useFinancialSummary` — Tüm kartları birleştirip toplam borç, limit, yaklaşan ödemeler, taksit projeksiyonu hesaplıyor.
- `useTransactions` — İşlemleri birleştirip filtreleme, gruplama, kategori özeti çıkarıyor.
- `useSubscriptions` — İki dönem karşılaştırarak otomatik abonelik tespiti yapıyor.
- `useAccountInsights` — Maaş tespiti, düzenli fatura tespiti, gelir-gider analizi.

### UI Pattern'ler
- Glass-morphism kartlar (yarı saydam buğulu efekt)
- Framer Motion ile giriş animasyonları ve tab geçişleri
- Mobile-first tasarım (430px shell içinde render)
- Sticky tab bar'lar (Kart Detay, Analizler)
- Bottom sheet modal'lar (Banka ekleme, rıza yönetimi)
- Animasyonlu sayı gösterimleri (AmountDisplay bileşeni)
