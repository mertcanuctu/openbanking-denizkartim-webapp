// ============================================
// DenizKartım — useAccountInsights Hook
// Detects salary, regular bills, and computes
// income vs expense summary from account data
// ============================================

import { useMemo } from "react";
import { userData, hesaplar, bakiyeler } from "@/lib/data";
import { parseAmount, absAmount } from "@/lib/utils";
import type { HesapIslemi } from "@/lib/types";

// --- Types ---

export interface DetectedSalary {
  tutar: number;
  aciklama: string;
  tarih: string;
  gonderen: string;
}

export interface DetectedBill {
  ad: string;
  tutar: number;
  aciklama: string;
  tarih: string;
  kategori: "fatura" | "kira" | "kredi" | "diger";
}

export interface RecentAccountTransaction {
  islNo: string;
  aciklama: string;
  tutar: number;
  brcAlc: string; // B = Borç (debit), A = Alacak (credit)
  tarih: string;
  guncelBakiye: number;
  kanal: string;
  islTur: string;
  hesapAdi: string;
}

export interface AccountInsights {
  /** Detected monthly salary */
  maas: DetectedSalary | null;
  /** Detected regular bills */
  duzenliGiderler: DetectedBill[];
  /** Total regular expenses per month */
  toplamDuzenliGider: number;
  /** Recent account transactions (sorted newest first) */
  sonIslemler: RecentAccountTransaction[];
  /** Income vs Expense summary */
  gelirGiderOzeti: {
    maas: number;
    duzenliGider: number;
    kartOdemeleri: number;
    kalan: number;
  };
}

// Keywords for salary detection
const SALARY_KEYWORDS = ["MAAS", "MAAŞ", "MAAS ODEMESI", "UCRET"];

// Keywords and patterns for bill detection
const BILL_PATTERNS: {
  keyword: string;
  ad: string;
  kategori: DetectedBill["kategori"];
}[] = [
  { keyword: "IGDAS", ad: "İGDAŞ Doğalgaz", kategori: "fatura" },
  { keyword: "TURK TELEKOM", ad: "Türk Telekom", kategori: "fatura" },
  { keyword: "ISKI", ad: "İSKİ Su Faturası", kategori: "fatura" },
  { keyword: "KIRA", ad: "Kira Ödemesi", kategori: "kira" },
  { keyword: "ELEKTRIK", ad: "Elektrik Faturası", kategori: "fatura" },
  { keyword: "DOGALGAZ", ad: "Doğalgaz Faturası", kategori: "fatura" },
  { keyword: "KREDI KARTI ODEME", ad: "Kredi Kartı Ödemesi", kategori: "kredi" },
];

/**
 * Hook that analyzes account transactions to detect:
 * - Monthly salary income
 * - Regular bill payments
 * - Income vs expense summary
 */
export function useAccountInsights(): AccountInsights {
  return useMemo(() => {
    // Gather all TRY account transactions with source account name
    const allTransactions: (HesapIslemi & { _hesapAdi: string })[] = [];

    for (const hesap of hesaplar) {
      if (hesap.prBrm !== "TRY") continue;
      const islemler = userData.hesapIslemleri[hesap.hspRef];
      if (islemler) {
        const hesapAdi = hesap.kisaAd || hesap.hspUrunAdi;
        allTransactions.push(...islemler.map((i) => ({ ...i, _hesapAdi: hesapAdi })));
      }
    }

    // Sort by date (newest first)
    allTransactions.sort(
      (a, b) =>
        new Date(b.islGrckZaman).getTime() - new Date(a.islGrckZaman).getTime()
    );

    // --- Detect salary ---
    let maas: DetectedSalary | null = null;
    for (const islem of allTransactions) {
      if (islem.brcAlc !== "A") continue; // Only credits
      const aciklama = islem.islAcklm.toUpperCase();
      const isSalary = SALARY_KEYWORDS.some((kw) => aciklama.includes(kw));
      if (isSalary) {
        maas = {
          tutar: parseAmount(islem.islTtr),
          aciklama: islem.islAcklm,
          tarih: islem.islGrckZaman,
          gonderen: islem.krsTrf?.krsUnvan || "Bilinmiyor",
        };
        break; // Take the most recent salary
      }
    }

    // --- Detect regular bills ---
    const duzenliGiderler: DetectedBill[] = [];
    const detectedBills = new Set<string>();

    for (const islem of allTransactions) {
      if (islem.brcAlc !== "B") continue; // Only debits
      const aciklama = islem.islAcklm.toUpperCase();

      for (const pattern of BILL_PATTERNS) {
        if (aciklama.includes(pattern.keyword) && !detectedBills.has(pattern.keyword)) {
          detectedBills.add(pattern.keyword);
          duzenliGiderler.push({
            ad: pattern.ad,
            tutar: parseAmount(islem.islTtr),
            aciklama: islem.islAcklm,
            tarih: islem.islGrckZaman,
            kategori: pattern.kategori,
          });
          break;
        }
      }
    }

    // Sort bills by amount (largest first)
    duzenliGiderler.sort((a, b) => b.tutar - a.tutar);

    const toplamDuzenliGider = duzenliGiderler
      .filter((g) => g.kategori !== "kredi") // Exclude credit card payments from regular bills
      .reduce((sum, g) => sum + g.tutar, 0);

    // --- Recent account transactions ---
    const sonIslemler: RecentAccountTransaction[] = allTransactions
      .filter((islem) => {
        // Exclude credit card payments from the recent list to avoid duplication
        const aciklama = islem.islAcklm.toUpperCase();
        return !aciklama.includes("KREDI KARTI ODEME");
      })
      .slice(0, 8) // Last 8 transactions
      .map((islem) => ({
        islNo: islem.islNo,
        aciklama: islem.islAcklm,
        tutar: parseAmount(islem.islTtr),
        brcAlc: islem.brcAlc,
        tarih: islem.islGrckZaman,
        guncelBakiye: parseAmount(islem.gnclBky),
        kanal: islem.kanal,
        islTur: islem.islTur,
        hesapAdi: islem._hesapAdi,
      }));

    // --- Income vs Expense summary ---
    // Card minimum payments from financial summary (we calculate a rough estimate)
    // Using asgari ödeme from card details
    let kartOdemeleri = 0;
    for (const kart of userData.kartlar) {
      if (kart.kartTipi !== "K" || kart.altKartTipi === "S") continue;
      const detay = userData.kartDetaylari[kart.kartRef]?.TRY;
      if (detay) {
        kartOdemeleri += absAmount(detay.kalanAsgariOdemeTutari);
      }
    }

    const maasGelir = maas?.tutar || 0;
    const kalan = maasGelir - toplamDuzenliGider - kartOdemeleri;

    return {
      maas,
      duzenliGiderler,
      toplamDuzenliGider,
      sonIslemler,
      gelirGiderOzeti: {
        maas: maasGelir,
        duzenliGider: toplamDuzenliGider,
        kartOdemeleri,
        kalan: Math.max(0, kalan),
      },
    };
  }, []);
}
