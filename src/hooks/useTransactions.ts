// ============================================
// DenizKartım — useTransactions Hook
// Merges, enriches, filters, and groups
// transactions from all cards
// ============================================

import { useMemo } from "react";
import { kartlar, userData } from "@/lib/data";
import { absAmount, formatDateGroup } from "@/lib/utils";
import { getCategoryFromMCC } from "@/lib/categories";
import type {
  EnrichedTransaction,
  GroupedTransaction,
  TransactionFilters,
  CategorySummary,
  KartHareket,
} from "@/lib/types";

/**
 * Enrich a raw card transaction with card info and category data
 */
function enrichTransaction(
  hareket: KartHareket,
  kartRef: string,
  kartAdi: string,
  kartSema: string
): EnrichedTransaction {
  const categoryInfo = getCategoryFromMCC(hareket.saticiKategoriKodu);

  return {
    ...hareket,
    kartRef,
    kartAdi,
    kartSema,
    kategoriAdi: categoryInfo.ad,
    kategoriIkon: categoryInfo.ikon,
    kategoriRenk: categoryInfo.renk,
    isTaksitli:
      hareket.toplamTaksitSayisi !== null && hareket.toplamTaksitSayisi > 1,
  };
}

/**
 * Get all enriched transactions from all cards (or a specific card).
 * This is a pure function (not a hook) for flexibility.
 */
export function getAllTransactions(
  kartRef?: string,
  paraBirimi?: string
): EnrichedTransaction[] {
  const transactions: EnrichedTransaction[] = [];

  const cardsToProcess = kartRef
    ? kartlar.filter((k) => k.kartRef === kartRef)
    : kartlar;

  for (const kart of cardsToProcess) {
    if (kart.kartTipi !== "K") continue; // Only credit cards have hareketler

    const hareketler = userData.kartHareketleri[kart.kartRef];
    if (!hareketler) continue;

    const currencies = paraBirimi
      ? [paraBirimi]
      : Object.keys(hareketler);

    for (const prBrm of currencies) {
      const donemBilgisi = hareketler[prBrm];
      if (!donemBilgisi) continue;

      for (const hareket of donemBilgisi.hareketBilgileri) {
        transactions.push(
          enrichTransaction(
            hareket,
            kart.kartRef,
            kart.kartUrunAdi,
            kart.kartSema
          )
        );
      }
    }
  }

  // Sort by date (newest first)
  transactions.sort(
    (a, b) =>
      new Date(b.islemTarihi).getTime() - new Date(a.islemTarihi).getTime()
  );

  return transactions;
}

/**
 * Apply filters to a list of enriched transactions
 */
function applyFilters(
  transactions: EnrichedTransaction[],
  filters: TransactionFilters
): EnrichedTransaction[] {
  let result = transactions;

  // Filter by card
  if (filters.kartRef) {
    result = result.filter((t) => t.kartRef === filters.kartRef);
  }

  // Filter by category
  if (filters.kategori) {
    result = result.filter((t) => t.kategoriAdi === filters.kategori);
  }

  // Filter by currency
  if (filters.paraBirimi) {
    result = result.filter(
      (t) => t.islemTutari.prBrm === filters.paraBirimi
    );
  }

  // Filter by type
  if (filters.tip && filters.tip !== "tumu") {
    switch (filters.tip) {
      case "B":
        result = result.filter((t) => t.borcAlacak === "B");
        break;
      case "A":
        result = result.filter((t) => t.borcAlacak === "A");
        break;
      case "taksitli":
        result = result.filter((t) => t.isTaksitli);
        break;
    }
  }

  return result;
}

/**
 * Group transactions by date
 */
function groupByDate(
  transactions: EnrichedTransaction[]
): GroupedTransaction[] {
  const groups = new Map<string, EnrichedTransaction[]>();

  for (const t of transactions) {
    // Extract date part only (YYYY-MM-DD)
    const dateKey = t.islemTarihi.split("T")[0];
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(t);
  }

  // Convert to array and sort by date (newest first)
  return Array.from(groups.entries())
    .sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    )
    .map(([tarih, islemler]) => ({
      tarih,
      tarihLabel: formatDateGroup(tarih),
      islemler,
    }));
}

/**
 * Calculate category-wise spending summary
 */
function calculateCategorySummary(
  transactions: EnrichedTransaction[]
): CategorySummary[] {
  // Only debit TRY transactions for spending analysis
  const spendingTransactions = transactions.filter(
    (t) => t.borcAlacak === "B" && t.islemTutari.prBrm === "TRY"
  );

  const categoryMap = new Map<
    string,
    { toplam: number; islemSayisi: number; ikon: string; renk: string }
  >();

  for (const t of spendingTransactions) {
    const key = t.kategoriAdi;
    const existing = categoryMap.get(key) || {
      toplam: 0,
      islemSayisi: 0,
      ikon: t.kategoriIkon,
      renk: t.kategoriRenk,
    };

    existing.toplam += absAmount(t.islemTutari.ttr);
    existing.islemSayisi += 1;
    categoryMap.set(key, existing);
  }

  const totalSpending = Array.from(categoryMap.values()).reduce(
    (sum, c) => sum + c.toplam,
    0
  );

  const categories: CategorySummary[] = Array.from(
    categoryMap.entries()
  ).map(([kategori, data]) => ({
    kategori,
    ikon: data.ikon,
    renk: data.renk,
    toplam: Math.round(data.toplam * 100) / 100,
    yuzde:
      totalSpending > 0
        ? Math.round((data.toplam / totalSpending) * 1000) / 10
        : 0,
    islemSayisi: data.islemSayisi,
  }));

  // Sort by amount (highest first)
  categories.sort((a, b) => b.toplam - a.toplam);

  return categories;
}

/**
 * Main hook result
 */
export interface UseTransactionsResult {
  /** All enriched transactions (filtered) */
  transactions: EnrichedTransaction[];
  /** Transactions grouped by date */
  grouped: GroupedTransaction[];
  /** Category spending summary */
  categorySummary: CategorySummary[];
  /** Total spending (TRY, debit only) */
  toplamHarcama: number;
  /** Total payments/credits (TRY) */
  toplamOdeme: number;
  /** Total transaction count */
  toplamIslem: number;
}

/**
 * Hook for transaction listing, filtering, grouping, and analysis.
 *
 * @param filters - Optional filters for card, category, type, currency
 */
export function useTransactions(
  filters: TransactionFilters = {}
): UseTransactionsResult {
  const { kartRef, kategori, tip, paraBirimi } = filters;

  return useMemo(() => {
    const activeFilters: TransactionFilters = { kartRef, kategori, tip, paraBirimi };

    // Get all transactions (optionally pre-filtered by card and currency)
    const allTransactions = getAllTransactions(kartRef, paraBirimi);

    // Apply remaining filters
    const transactions = applyFilters(allTransactions, activeFilters);

    // Group by date
    const grouped = groupByDate(transactions);

    // Category summary (from all TRY debit transactions, not filtered by type)
    // We use the card/currency filtered set but not the type filter for category summary
    const forCategorySummary = applyFilters(allTransactions, {
      ...activeFilters,
      tip: undefined, // Don't filter by type for category analysis
    });
    const categorySummary = calculateCategorySummary(forCategorySummary);

    // Calculate totals from TRY transactions
    const tryTransactions = transactions.filter(
      (t) => t.islemTutari.prBrm === "TRY"
    );
    const toplamHarcama = tryTransactions
      .filter((t) => t.borcAlacak === "B")
      .reduce((sum, t) => sum + absAmount(t.islemTutari.ttr), 0);
    const toplamOdeme = tryTransactions
      .filter((t) => t.borcAlacak === "A")
      .reduce((sum, t) => sum + absAmount(t.islemTutari.ttr), 0);

    return {
      transactions,
      grouped,
      categorySummary,
      toplamHarcama: Math.round(toplamHarcama * 100) / 100,
      toplamOdeme: Math.round(toplamOdeme * 100) / 100,
      toplamIslem: transactions.length,
    };
  }, [kartRef, kategori, tip, paraBirimi]);
}
