// ============================================
// DenizKartım — useSubscriptions Hook
// Detects recurring subscriptions by comparing
// current + previous period transactions
// ============================================

import { useMemo } from "react";
import { kartlar, userData } from "@/lib/data";
import { absAmount } from "@/lib/utils";
import { getCategoryFromMCC } from "@/lib/categories";
import type { Abonelik, AbonelikOzeti, KartHareket, OncekiDonemHareket } from "@/lib/types";

/**
 * Normalize transaction description for matching
 * Removes extra spaces, uppercases, trims
 */
function normalizeDescription(desc: string): string {
  return desc.toUpperCase().trim().replace(/\s+/g, " ");
}

/**
 * Check if two amounts are "similar" (within 10% tolerance)
 * Subscriptions might have slight price changes
 */
function isSimilarAmount(a: number, b: number): boolean {
  if (a === 0 && b === 0) return true;
  if (a === 0 || b === 0) return false;
  const ratio = Math.abs(a - b) / Math.max(a, b);
  return ratio < 0.1; // 10% tolerance
}

/**
 * MCC codes that should NEVER be detected as subscriptions.
 * These represent one-off or irregular spending categories.
 */
const NON_SUBSCRIPTION_MCC = new Set([
  "5541", // Akaryakıt (gas stations)
  "5542", // Akaryakıt (automated)
  "5814", // Fast food
  "5812", // Restoran
  "5813", // Bar/Kafe
  "5411", // Market/Süpermarket
  "5912", // Eczane
  "5651", // Giyim
  "5311", // Mağaza
  "5944", // Kuyumcu
  "5722", // Ev aletleri
  "7011", // Otel
  "4511", // Havayolu
]);

/**
 * Hook that detects subscriptions by comparing current and previous period.
 *
 * Logic:
 * 1. Get all current period transactions from all cards
 * 2. Get all previous period transactions (oncekiDonemOrnekleri)
 * 3. Match by islemAciklamasi (normalized) + similar amount
 * 4. Matched = subscription
 *
 * Returns:
 * - abonelikler: List of detected subscriptions
 * - toplamTRY: Total monthly subscriptions in TRY
 * - toplamUSD: Total monthly subscriptions in USD
 * - toplamAdet: Number of active subscriptions
 */
export function useSubscriptions(): AbonelikOzeti {
  return useMemo(() => {
    const abonelikler: Abonelik[] = [];
    const seenDescriptions = new Set<string>();

    for (const kart of kartlar) {
      // Skip non-credit cards
      if (kart.kartTipi !== "K") continue;

      const hareketler = userData.kartHareketleri[kart.kartRef];
      const oncekiDonem = userData.oncekiDonemOrnekleri[kart.kartRef];

      if (!hareketler || !oncekiDonem) continue;

      // Iterate over each currency (TRY, USD, etc.)
      for (const prBrm of Object.keys(hareketler)) {
        const currentDonem = hareketler[prBrm];
        const prevDonem = oncekiDonem[prBrm];

        if (!currentDonem || !prevDonem) continue;

        const currentHareketler = currentDonem.hareketBilgileri;
        const prevHareketler = prevDonem.hareketBilgileri;

        // For each current transaction, check if it appeared in previous period
        for (const current of currentHareketler) {
          // Only debit transactions
          if (current.borcAlacak !== "B") continue;
          // Skip installment transactions (those are not subscriptions)
          if (current.toplamTaksitSayisi && current.toplamTaksitSayisi > 1) continue;
          // Skip non-subscription categories (gas, fast food, market, etc.)
          if (current.saticiKategoriKodu && NON_SUBSCRIPTION_MCC.has(current.saticiKategoriKodu)) continue;

          const currentDesc = normalizeDescription(current.islemAciklamasi);
          const currentAmount = absAmount(current.islemTutari.ttr);

          // Check if this description was seen in previous period
          const prevMatch = prevHareketler.find((prev: OncekiDonemHareket) => {
            if (prev.borcAlacak !== "B") return false;
            // Skip installment entries in previous period too
            if (prev.toplamTaksitSayisi && prev.toplamTaksitSayisi > 1) return false;

            const prevDesc = normalizeDescription(prev.islemAciklamasi);
            const prevAmount = absAmount(prev.islemTutari.ttr);

            return prevDesc === currentDesc && isSimilarAmount(currentAmount, prevAmount);
          });

          if (prevMatch) {
            // Avoid duplicates (same description from different currencies counted once)
            const uniqueKey = `${kart.kartRef}:${prBrm}:${currentDesc}`;
            if (seenDescriptions.has(uniqueKey)) continue;
            seenDescriptions.add(uniqueKey);

            const categoryInfo = getCategoryFromMCC(current.saticiKategoriKodu);

            abonelikler.push({
              ad: current.islemAciklamasi,
              tutar: currentAmount,
              paraBirimi: current.islemTutari.prBrm,
              kartRef: kart.kartRef,
              kartAdi: kart.kartUrunAdi,
              kategori: categoryInfo.ad,
              sonIslemTarihi: current.islemTarihi,
            });
          }
        }
      }
    }

    // Sort subscriptions by amount (highest first)
    abonelikler.sort((a, b) => {
      // Group by currency first (TRY first, then USD)
      if (a.paraBirimi !== b.paraBirimi) {
        return a.paraBirimi === "TRY" ? -1 : 1;
      }
      return b.tutar - a.tutar;
    });

    // Calculate totals
    const toplamTRY = abonelikler
      .filter((a) => a.paraBirimi === "TRY")
      .reduce((sum, a) => sum + a.tutar, 0);

    const toplamUSD = abonelikler
      .filter((a) => a.paraBirimi === "USD")
      .reduce((sum, a) => sum + a.tutar, 0);

    return {
      abonelikler,
      toplamTRY,
      toplamUSD,
      toplamAdet: abonelikler.length,
    };
  }, []);
}
