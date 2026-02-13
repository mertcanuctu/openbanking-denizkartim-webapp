# DenizKartim Build Plan

## Overview

**App:** DenizKartim — Mobile-first fintech web app prototype (Turkish banking)
**Tech Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Lucide React + Recharts
**Design:** Mobile-first 390px viewport, max-width 430px, dark theme, glassmorphism, iOS app feel
**Data:** Static JSON mock data (`public/mock/user_data.json`), no API calls
**Language:** All UI text in Turkish

### Design Tokens

```
Primary:        #0A1628 (Navy)
Accent:         #0EA5E9 (Teal/Sky)
Danger:         #EF4444 (Red)
Success:        #10B981 (Green)
Warning:        #F59E0B (Amber)
Surface:        #111827 (Dark surface)
Card:           rgba(255,255,255,0.05) (Glass card)
Border:         rgba(255,255,255,0.1)
Text Primary:   #F9FAFB
Text Secondary: #9CA3AF
```

---

## Project Structure

```
src/
  app/
    layout.tsx                — Mobile shell (max-w-[430px], mx-auto, min-h-screen)
    page.tsx                  — Ana Sayfa / Dashboard
    kartlarim/
      page.tsx                — Kartlarım listesi
      [kartRef]/
        page.tsx              — Kart detay sayfası
    analizler/
      page.tsx                — Harcama analizleri + AI asistan
    odemeler/
      page.tsx                — Ödeme takvimi
    profil/
      page.tsx                — Profil ve banka bağlantıları
  components/
    layout/
      BottomNav.tsx           — Alt navigasyon (5 tab)
      TopBar.tsx              — Üst bar (isim, bildirim, avatar)
      MobileShell.tsx         — App container wrapper
    dashboard/
      QuickSummary.tsx        — Toplam borç, limit, ödeme özeti
      CardCarousel.tsx        — Kart carousel
      UpcomingPayments.tsx    — Yaklaşan ödemeler widget
      QuickActions.tsx        — Hızlı aksiyonlar
      AiInsightCard.tsx       — AI öneri kartı
    cards/
      CardVisual.tsx          — 3D kart görseli
      CardDetail.tsx          — Kart detay bilgileri
      TransactionList.tsx     — İşlem listesi
      TransactionItem.tsx     — Tekil işlem satırı
    analytics/
      SpendingChart.tsx       — Harcama dağılım grafiği
      CategoryBreakdown.tsx   — Kategori kırılımı
      SubscriptionManager.tsx — Abonelik yönetimi
      AiAssistant.tsx         — AI asistan chat/öneri arayüzü
      InstallmentProjection.tsx — Taksit projeksiyon tablosu
    payments/
      PaymentCalendar.tsx     — Ödeme takvimi
      PaymentCard.tsx         — Tekil ödeme kartı
    profile/
      BankConnection.tsx      — Banka bağlantı kartı
      ConsentManager.tsx      — İzin yönetimi
    shared/
      AmountDisplay.tsx       — Para formatı component
      Badge.tsx               — Durum badge'i
      ProgressBar.tsx         — İlerleme çubuğu
  lib/
    data.ts                   — Mock data import ve type'lar
    types.ts                  — TypeScript type tanımları
    utils.ts                  — Yardımcı fonksiyonlar (para format, tarih, kategori)
    categories.ts             — MCC kod → kategori eşleştirme
    constants.ts              — Sabit değerler, renkler
  hooks/
    useFinancialSummary.ts    — Finansal özet hesaplamaları
    useSubscriptions.ts       — Abonelik tespit hook'u
    useTransactions.ts        — İşlem filtreleme/gruplama
```

---

## Step 0: Project Setup & Foundation

**Goal:** Create the Next.js project skeleton with all dependencies and base architecture.

### Tasks

- 0.1: Initialize Next.js 14 project with App Router, TypeScript, Tailwind CSS
- 0.2: Install dependencies — `framer-motion`, `lucide-react`, `recharts`
- 0.3: Configure Tailwind with custom color palette (Navy, Teal, Red, Green, Amber), glassmorphism utilities
- 0.4: Create `src/app/layout.tsx` — Mobile shell with `max-w-[430px]`, `mx-auto`, `min-h-screen`, dark theme, Geist font
- 0.5: Create `MobileShell.tsx` — App container wrapper with safe area padding
- 0.6: Create `BottomNav.tsx` — 5 tabs: Ana Sayfa, Kartlarım, Analizler, Ödemeler, Profil — active tab animated
- 0.7: Create `TopBar.tsx` — Left: avatar + "Merhaba Mert" / Right: notification icon + badge
- 0.8: Create `src/lib/types.ts` — Full TypeScript types for all mock data structures (hesaplar, bakiyeler, kartlar, kartDetaylari, kartHareketleri, oncekiDonemOrnekleri, etc.)
- 0.9: Copy mock data to `public/mock/user_data.json`
- 0.10: Create `src/lib/data.ts` — Import and export typed mock data
- 0.11: Create `src/lib/utils.ts` — Currency formatting (`42.800,00 ₺`), Turkish date formatting (`18 Nisan 2026`), MCC category matching
- 0.12: Create route stubs — Empty pages for `/kartlarim`, `/analizler`, `/odemeler`, `/profil`

**Deliverable:** App runs, shows dark shell with BottomNav + TopBar, all routes navigate.

---

## Step 1: Data Layer & Custom Hooks

**Goal:** Build the entire data/business logic layer that all screens depend on.

### Tasks

- 1.1: Create `src/lib/categories.ts` — MCC code-to-category mapping:
  - 4899 → "Dijital İçerik" (Netflix, YouTube)
  - 5411 → "Market" (Migros, CarrefourSA, Getir)
  - 5541 → "Akaryakıt" (Shell, BP)
  - 5651 → "Giyim" (Zara)
  - 5732, 5734 → "Teknoloji" (Teknosa, software subscriptions)
  - 5735 → "Apple"
  - 5812, 5814 → "Yeme & İçme" (restaurants, cafes)
  - 5815 → "Müzik" (Spotify)
  - 5818 → "Eğitim" (Duolingo)
  - 5912 → "Kişisel Bakım" (Watsons)
  - 5942 → "Kitap & Hobi" (D&R, Amazon)
  - 5968 → "Abonelik" (Amazon Prime)
  - 7922 → "Eğlence" (Biletix)
  - 3000 → "Havayolu" (THY)
  - 5311 → "E-Ticaret" (Trendyol)
  - 5941 → "Spor" (Decathlon)
  - Each with a Lucide icon name + color code

- 1.2: Create `src/lib/constants.ts` — Design tokens, colors, static values

- 1.3: Create `hooks/useFinancialSummary.ts` — Consolidates all card data:
  - toplamBorc: Sum of all kalanEkstreBorcu (42,800 TL)
  - toplamLimit: Sum of all toplamLimit (200,000 TL)
  - toplamKullanilabilirLimit: (132,570 TL)
  - toplamAsgariOdeme: Sum of all kalanAsgariOdemeTutari (9,900 TL)
  - yaklasanOdemeler: Sorted by sonOdemeTarihi [{kart, tarih, tutar, asgari}]
  - toplamTaksitYuku: 12-month installment projection (merge donemTaksitTutarBilgisi)
  - hesapBakiyesi: All account balances (TRY)
  - puanOzeti: [{puanTipi, toplam}] merged points

- 1.4: Create `hooks/useSubscriptions.ts` — Subscription detection:
  - Compare oncekiDonemOrnekleri + kartHareketleri
  - Same islemAciklamasi + similar amount = subscription
  - Detect: Netflix (279 TL), Spotify (59.99 TL), YouTube Premium (149.99 TL), Apple.com/Bill (199 TL), iCloud Storage (79.99 TL), Google One (129.99 TL), Amazon Prime (49.99 TL), Adobe CC (189.99 TL), Duolingo Plus (34.99 TL), ChatGPT ($49.99), GitHub ($12.99), Midjourney ($22.00)
  - Each: {ad, tutar, paraBirimi, kartRef, kartAdi, kategori, sonIslemTarihi}
  - toplamAylikAbonelik: TRY and USD separate

- 1.5: Create `hooks/useTransactions.ts` — Transaction listing/filtering:
  - Merge transactions from all cards
  - Sort by date (newest first)
  - Category-based filtering
  - Card-based filtering
  - Spending/payment separation (borcAlacak: B/A)
  - Installment transaction flag

**Deliverable:** All hooks return correct calculated data from mock JSON.

---

## Step 2: Dashboard (Home Screen)

**Goal:** Build the main screen — "entire financial picture at a glance."

### Tasks

- 2.1: Create `QuickSummary.tsx` — Glassmorphism card, gradient background:
  - Center large: "Toplam Borç" → 42.800,00 ₺ (animated counter)
  - Two columns below: "Kullanılabilir Limit" → 132.570,35 ₺ (green) | "Bu Ay Asgari" → 9.900,00 ₺ (orange)
  - Bottom: Limit usage progress bar (33.7% used)

- 2.2: Create `CardCarousel.tsx` — Horizontal scroll:
  - 3 cards: Axess Platinum (VISA), Wings Mastercard (MC), Axess Sanal (VISA)
  - Each card: kartUrunAdi, masked kartNo, kartSema logo
  - Below card: Remaining debt | Available limit | Due date
  - Active card centered, sides blur + scale-down
  - Dot indicators

- 2.3: Create `UpcomingPayments.tsx`:
  - Wings MC: 18 April → 18,250 TL (red, 3 days left warning)
  - Axess: 22 April → 24,550 TL (yellow, 7 days)
  - Minimum payment amount shown small

- 2.4: Create `AiInsightCard.tsx`:
  - Example: "💡 Bu ay 12 aktif aboneliğiniz var, toplam 1.173 TL/ay..."
  - Gradient border (AI feel, purple-blue)
  - "İncele" button → /analizler

- 2.5: Create `QuickActions.tsx` — 4-grid:
  - Borç Öde | Kart Ekle | Harcamalarım | Taksitlerim
  - Icon + label, bounce animation

- 2.6: Create `AmountDisplay.tsx` — Shared Turkish Lira formatting component
- 2.7: Create `Badge.tsx` + `ProgressBar.tsx` — Shared UI components

- 2.8: Assemble `app/page.tsx`:
  - Stack all widgets top to bottom
  - Framer Motion staggered entrance animations
  - Dark theme, glassmorphism cards, subtle gradients

**Deliverable:** Dashboard fully functional with all widgets, animations, and real data.

---

## Step 3: Card Visual Component + Cards List Page

**Goal:** Build the realistic credit card visual and "My Cards" listing page.

### Tasks

- 3.1: Create `CardVisual.tsx` — Realistic credit card:
  - Aspect ratio 1.586:1 (credit card ratio)
  - Gradient per card type:
    - Axess Platinum → dark grey → black (premium)
    - Wings Mastercard → dark red → burgundy
    - Axess Sanal → dark blue → navy, "SANAL" label
    - Banka Kartı → light blue → dark blue
  - Card contents: kartUrunAdi (top-left), masked kartNo (center, monospace), kartSema logo (bottom-left), "Akbank" (bottom-right)
  - 3D tilt effect (mouse/touch parallax)
  - Glassmorphism overlay

- 3.2: Create `app/kartlarim/page.tsx`:
  - Title: "Kartlarım" + filter (All / Credit / Bank)
  - Each card: CardVisual (small) + name + last 4 digits + type badge + balance info + installment badge + points badge
  - Card tap → /kartlarim/[kartRef]

- 3.3: Group virtual card — Axess Sanal shown under parent (asilKartNo match)

- 3.4: Account section — "Hesaplarım":
  - Salary: 47.832,56 ₺ (green) — "Axess Vadesiz Hesap"
  - USD: $1.245,80 — "Döviz Vadesiz Hesap"
  - KMH: -3.200,00 ₺ (red) — "KMH Vadesiz Hesap"

**Deliverable:** Cards page shows all 4 cards + 3 accounts with visual cards and proper grouping.

---

## Step 4: Card Detail Page

**Goal:** Build the dynamic card detail page with 3 tabs.

### Tasks

- 4.1: Create `app/kartlarim/[kartRef]/page.tsx` — Dynamic route, loads card by kartRef

- 4.2: Card header — Large CardVisual + 4-column info grid:
  - Ekstre Borcu: 24.550,00 ₺
  - Kullanılabilir Limit: 74.250,35 ₺
  - Toplam Limit: 120.000,00 ₺
  - Son Ödeme: 22 Nisan 2026
  - Limit usage progress bar
  - Points: "12.840 Axess Puan | 3.200 Chip Para"

- 4.3: Sticky tab bar — Hareketler | Taksitler | Ekstre

- 4.4: Hareketler tab (default):
  - Create `TransactionList.tsx` + `TransactionItem.tsx`
  - Date-grouped: "Bugün", "Dün", "8 Nisan"...
  - Each item: category icon (colored circle) + transaction name + amount (red debit, green credit) + installment badge + MCC category
  - TRY and USD sections or toggle
  - Filter: All / Harcama / Ödeme / Taksitli

- 4.5: Taksitler tab:
  - Create `InstallmentProjection.tsx`
  - Active installments: Teknosa 18,500 TL (6x, 3,083 TL/mo), D&R 6,500 TL (3x, 2,167 TL/mo), THY 8,900 TL (4x, 2,225 TL/mo)
  - 12-month Recharts bar chart from donemTaksitTutarBilgisi
  - X-axis: month names, Y-axis: amount, current period highlighted

- 4.6: Ekstre tab:
  - Period selector (April 2026, March 2026...)
  - Statement summary: ekstre borcu, asgari ödeme, hesap kesim tarihi
  - "Borç Öde" full-width primary button

**Deliverable:** Full card detail with all 3 tabs working, transactions listed, installment chart rendered.

---

## Step 5: Analytics Page (Spending Analytics + AI Assistant)

**Goal:** Build the "smart layer" — the highest-value screen.

### Tasks

- 5.1: Create `app/analizler/page.tsx` — Top tab bar: Harcamalar | Abonelikler | AI Asistan

- 5.2: **Harcamalar tab** — Create `SpendingChart.tsx`:
  - Recharts donut/pie chart — merged spending from all cards
  - Center: total spending amount
  - Categories (calculated from mock data):
    - Teknoloji: 18,500 TL (30%)
    - E-Ticaret: 6,785 TL (11%)
    - Market: ~4,713 TL (8%)
    - Havayolu: 8,900 TL (15%)
    - Yeme & İçme: ~4,770 TL (8%)
    - Giyim: 3,750 TL (6%)
    - Abonelikler: ~1,173 TL (2%)
    - Diğer: remaining

- 5.3: Create `CategoryBreakdown.tsx`:
  - Each category: icon + name + amount + percentage + progress bar
  - Tap to expand transactions in that category
  - Month-over-month change (↑15% or ↓8%)

- 5.4: Spending trend — Line chart, last 3 months, above/below average color change

- 5.5: **Abonelikler tab** — Create `SubscriptionManager.tsx`:
  - Summary card: "12 Aktif Abonelik", Total: 1,173 TL/mo + $84.98/mo, Annual: ~14,076 TL + ~$1,020
  - Subscription cards: logo/icon + name + amount + which card (badge) + last charge date + usage status + actions ("Hatırlatma Kur" | "Detay")
  - Grouped: TRY subscriptions / USD subscriptions

- 5.6: Subscription insights — AI tip: "iCloud Storage + Google One: both cloud storage. Cancel one to save 80-130 TL/month."

- 5.7: **AI Asistan tab** — Create `AiAssistant.tsx`:
  - 5 proactive suggestion cards (swipeable):
    a) Subscription warning: 12 subscriptions, 1,173 TL/mo, iCloud + Google One overlap
    b) Installment warning: Next month 6,800 TL installments, covered by 47,832 TL salary account
    c) KMH warning: -3,200 TL overdraft, high interest, transfer from salary account
    d) Spending pattern: Highest category Teknoloji (18,500 TL Teknosa), non-installment highest Yeme & İçme (4,770 TL)
    e) Points optimization: 12,840 Axess Puan + 45,200 Wings Mil, domestic round-trip possible
  - Quick question buttons: "Bu ay ne kadar harcadım?", "Taksit yüküm ne kadar?", "Aboneliklerimi göster", "Tasarruf önerisi ver"
  - Purple-blue gradient "smart" feel

**Deliverable:** Full analytics page with charts, subscription management, and AI assistant.

---

## Step 6: Payment Calendar Page

**Goal:** Build payment schedule with calendar view and interest calculator.

### Tasks

- 6.1: Create `app/odemeler/page.tsx`

- 6.2: Create `PaymentCalendar.tsx`:
  - April 2026 calendar view
  - Payment days highlighted: 18th (red dot, close), 22nd (yellow dot)
  - Date tap shows detail card
  - Month navigation (prev/next)

- 6.3: Payment summary:
  - "Bu Ay Ödenecek" — Total: 42.800,00 ₺, Asgari: 9.900,00 ₺
  - "Tam ödeme yaparsanız 0 ₺ faiz" info note

- 6.4: Create `PaymentCard.tsx` — Per card:
  - Wings MC: Son ödeme 18 April (3 days left, red badge), 18,250 TL, asgari 5,475 TL, "Borç Öde" + "Asgari Öde" buttons
  - Axess Platinum: Son ödeme 22 April (7 days), 24,550 TL, asgari 4,425 TL, same buttons

- 6.5: Interest calculator widget:
  - Slider: "Ne kadar ödeyeceksiniz?" (minimum → full range)
  - Real-time interest calculation display
  - "Asgari öderseniz → ~X TL faiz" / "Tam öderseniz → 0 TL faiz"

- 6.6: Next month projection:
  - Estimated next month debt (installments + estimated spending)
  - donemTaksitTutarBilgisi period 1 total: 6,800 TL installments only
  - Warning: "Gelecek ay minimum 6.800 TL taksit ödemesi olacak"

**Deliverable:** Payment calendar with interactive elements and financial projections.

---

## Step 7: Profile & Bank Connections

**Goal:** Build profile page with Open Banking consent management.

### Tasks

- 7.1: Create `app/profil/page.tsx`

- 7.2: User info card — Avatar + "Mert Yılmaz" + "DenizKartım kullanıcısı" + last login

- 7.3: Create `BankConnection.tsx`:
  - Akbank: logo placeholder (colored circle + "A"), "Akbank — Bağlı"
  - Connected: 15 April 2026, Expires: 15 October 2026
  - Permissions: "9/9 izin aktif" (green badge)
  - "İzinleri Yönet" button → ConsentManager modal
  - "Bağlantıyı Kaldır" button (red, outline)

- 7.4: Add bank flow — "Yeni Banka Bağla" dashed card:
  - Bank selection grid (bank logos)
  - Permission explanation screen
  - "Bankaya Yönlendiriliyorsunuz" loading
  - Success screen

- 7.5: Create `ConsentManager.tsx` — Bottom sheet/modal:
  - 9 permission types with toggle switches:
    - 01: Temel Hesap Bilgisi ✅
    - 02: Ayrıntılı Hesap Bilgisi ✅
    - 03: Bakiye Bilgisi ✅
    - 04: İşlem Bilgisi ✅
    - 05: Temel Kart Bilgisi ✅
    - 06: Ayrıntılı Kart Bilgisi ✅
    - 07: Kart Bakiye Bilgisi ✅
    - 08: Kart İşlem Bilgisi ✅
    - 09: Kart Ekstre Bilgisi ✅
  - "Erişim izni 15 Ekim 2026'da sona erecek"
  - "İzinleri Güncelle" button

- 7.6: Settings section:
  - Notification preferences (toggle)
  - Payment reminder time
  - Currency preference
  - App language
  - About / KVKK

**Deliverable:** Profile page with bank connection management and consent controls.

---

## Step 8: Account Transactions & Cross-Screen Integration

**Goal:** Add account-level data and integrate financial insights across screens.

### Tasks

- 8.1: Dashboard — "Son Hesap Hareketleri" widget:
  - 12 April: ATM Para Çekme → -2.500 TL
  - 10 April: İSKİ Su Faturası → -1.355,50 TL
  - 8 April: Türk Telekom → -385,50 TL
  - 7 April: İGDAŞ Doğalgaz → -960,00 TL
  - 5 April: Arkadaşa Transfer → -1.850,00 TL
  - Each: icon + description + amount + current balance

- 8.2: Dashboard — Salary detection badge:
  - "Maaş Geliri Tespit Edildi: 42.500 TL/ay" subtle info card below QuickSummary

- 8.3: Analytics — Bill detection (regular payments):
  - İGDAŞ Doğalgaz: 960 TL/ay
  - Türk Telekom: 385,50 TL/ay
  - İSKİ Su: 1.355,50 TL/ay
  - Kira: 8.750 TL/ay
  - Total regular expenses: ~11.451 TL/ay

- 8.4: Analytics — Income vs Expense summary:
  - Maaş: 42.500 TL
  - Düzenli gider: 11.451 TL
  - Kart ödemeleri: ~9.900 TL (asgari)
  - Kalan: ~21.149 TL

**Deliverable:** Account data integrated into dashboard and analytics, income/expense overview working.

---

## Step 9: Animations, Transitions & Final Polish

**Goal:** Add production-quality animations, micro-interactions, PWA support, and accessibility.

### Tasks

- 9.1: Page transitions — Framer Motion fade-up on every page (y:20→0, opacity:0→1), layout animations, tab slide transitions

- 9.2: Scroll behaviors:
  - Dashboard TopBar: compact mode on scroll (shrink + blur background)
  - Card detail: card visual shrink on scroll (parallax)
  - Sticky tab bars working correctly

- 9.3: Micro-interactions:
  - Card tap: scale pulse
  - Button press: scale 0.97
  - Toggle switch animation
  - Amount counter animation (number slides up)
  - Pull-down refresh simulation
  - Skeleton loading states for every component

- 9.4: Empty states & edge cases:
  - No bank connected dashboard view
  - No cards state
  - Loading skeletons

- 9.5: PWA setup:
  - `manifest.json` (DenizKartım, Denizbank colors)
  - viewport meta: width=device-width, viewport-fit=cover
  - safe-area-inset paddings (especially bottom nav)
  - Status bar color
  - Splash screen

- 9.6: Accessibility:
  - `aria-label` on all currency amounts (screen reader)
  - Tab navigation working
  - Color contrasts WCAG AA compliant
  - Touch targets minimum 44x44px

**Deliverable:** Polished, production-ready prototype with smooth animations and PWA capabilities.

---

## Execution Order

Steps **must** be executed in order — each depends on the previous:

```
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9
```

Verify each step runs without errors before proceeding to the next.

## Quick Reference

| Step | Area              | Key Components                              | Complexity |
|------|-------------------|---------------------------------------------|------------|
| 0    | Project Setup     | Layout, Nav, Types, Utils                   | Medium     |
| 1    | Data Layer        | 3 hooks, categories, constants              | Medium     |
| 2    | Dashboard         | QuickSummary, Carousel, Payments, AI, Actions | High     |
| 3    | Cards List        | CardVisual, Cards page, Accounts            | Medium     |
| 4    | Card Detail       | 3 tabs, Transactions, Installment chart     | High       |
| 5    | Analytics         | Charts, Subscriptions, AI Assistant         | High       |
| 6    | Payments          | Calendar, Interest calc, Projections        | Medium     |
| 7    | Profile           | Bank connections, Consent manager, Settings | Medium     |
| 8    | Integration       | Account data across screens                 | Low        |
| 9    | Polish            | Animations, PWA, Accessibility              | Medium     |

## Mock Data Location

- Source file: `user_mock_data.json` (root)
- App reads from: `public/mock/user_data.json`
- Data structures: hesaplar (3 accounts), bakiyeler (3 balances), hesapIslemleri (account transactions), kartlar (4 cards), kartDetaylari (card details with TRY/USD), kartHareketleri (card transactions), oncekiDonemOrnekleri (previous period for subscription detection)
