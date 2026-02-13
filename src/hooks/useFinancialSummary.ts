// ============================================
// DenizKartım — useFinancialSummary Hook
// Consolidates all card and account data into
// a single financial summary object
// ============================================

import { useMemo } from "react";
import {
  krediKartlari,
  bakiyeler,
  userData,
} from "@/lib/data";
import { parseAmount, absAmount } from "@/lib/utils";
import type {
  FinancialSummary,
  YaklasanOdeme,
  PuanOzeti,
  DonemTaksitBilgisi,
} from "@/lib/types";

/**
 * Extended financial summary with installment projection
 */
export interface ExtendedFinancialSummary extends FinancialSummary {
  /** 12-month installment projection (merged from all cards) */
  toplamTaksitYuku: DonemTaksitBilgisi[];
  /** KMH (overdraft) balance */
  kmhBorcu: number;
}

/**
 * Hook that consolidates all financial data from all cards and accounts.
 *
 * Returns:
 * - toplamBorc: Sum of all kalanEkstreBorcu (credit cards, TRY)
 * - toplamLimit: Sum of all toplamLimit (TRY)
 * - toplamKullanilabilirLimit: Sum of all kullanilabilirLimit (TRY)
 * - toplamAsgariOdeme: Sum of all kalanAsgariOdemeTutari (TRY)
 * - limitKullanimOrani: Usage percentage
 * - yaklasanOdemeler: Sorted by sonOdemeTarihi
 * - toplamTaksitYuku: 12-month installment projection
 * - hesapBakiyesi: TRY account balances
 * - hesapBakiyesiUSD: USD account balances
 * - puanOzeti: Merged points from all cards
 * - kmhBorcu: KMH overdraft balance
 */
export function useFinancialSummary(): ExtendedFinancialSummary {
  return useMemo(() => {
    // --- Aggregate credit card TRY data ---
    let toplamBorc = 0;
    let toplamLimit = 0;
    let toplamKullanilabilirLimit = 0;
    let toplamAsgariOdeme = 0;

    const yaklasanOdemeler: YaklasanOdeme[] = [];
    const puanMap = new Map<string, number>();

    // Max installment periods across all cards (for projection)
    const maxDonem = 12;
    const taksitProjection: number[] = new Array(maxDonem + 1).fill(0);

    for (const kart of krediKartlari) {
      // Only physical/main credit cards (skip virtual cards for debt totals)
      // Virtual cards share the same limit as their parent
      if (kart.altKartTipi === "S") continue;

      const detaylar = userData.kartDetaylari[kart.kartRef];
      if (!detaylar) continue;

      const tryDetay = detaylar.TRY;
      if (!tryDetay) continue;

      // Accumulate totals (amounts are negative strings for debts)
      toplamBorc += absAmount(tryDetay.kalanEkstreBorcu);
      toplamLimit += parseAmount(tryDetay.toplamLimit);
      toplamKullanilabilirLimit += parseAmount(tryDetay.kullanilabilirLimit);
      toplamAsgariOdeme += absAmount(tryDetay.kalanAsgariOdemeTutari);

      // Upcoming payment
      const kalanEkstre = absAmount(tryDetay.kalanEkstreBorcu);
      if (kalanEkstre > 0) {
        const sonOdeme = tryDetay.sonOdemeTarihi;
        const now = new Date();
        const sonOdemeDate = new Date(sonOdeme);
        const diffTime = sonOdemeDate.getTime() - now.getTime();
        const kalanGun = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        yaklasanOdemeler.push({
          kartRef: kart.kartRef,
          kartAdi: kart.kartUrunAdi,
          kartSema: kart.kartSema,
          sonOdemeTarihi: sonOdeme,
          ekstreBorcu: kalanEkstre,
          asgariOdeme: absAmount(tryDetay.kalanAsgariOdemeTutari),
          kalanGun,
        });
      }

      // Points
      for (const puan of tryDetay.puanBilgisi) {
        const existing = puanMap.get(puan.puanTipi) || 0;
        puanMap.set(puan.puanTipi, existing + parseFloat(puan.puanDegeri));
      }

      // Installment projection — merge donemTaksitTutarBilgisi
      for (const donemBilgisi of tryDetay.donemTaksitTutarBilgisi) {
        if (donemBilgisi.donem >= 0 && donemBilgisi.donem <= maxDonem) {
          taksitProjection[donemBilgisi.donem] += absAmount(
            donemBilgisi.taksitTutari
          );
        }
      }
    }

    // Sort upcoming payments by date (soonest first)
    yaklasanOdemeler.sort(
      (a, b) =>
        new Date(a.sonOdemeTarihi).getTime() -
        new Date(b.sonOdemeTarihi).getTime()
    );

    // Build points summary
    const puanOzeti: PuanOzeti[] = Array.from(puanMap.entries()).map(
      ([puanTipi, toplam]) => ({
        puanTipi,
        toplam,
      })
    );

    // Build installment projection
    const toplamTaksitYuku: DonemTaksitBilgisi[] = taksitProjection.map(
      (tutari, donem) => ({
        donem,
        taksitTutari: (-tutari).toFixed(2), // Keep the negative convention
      })
    );

    // --- Account balances ---
    let hesapBakiyesi = 0;
    let hesapBakiyesiUSD = 0;
    let kmhBorcu = 0;

    for (const bakiye of bakiyeler) {
      const amount = parseAmount(bakiye.bkyTtr);
      if (bakiye.prBrm === "TRY") {
        if (amount < 0) {
          // KMH (overdraft) — negative TRY balance
          kmhBorcu = Math.abs(amount);
        } else {
          hesapBakiyesi += amount;
        }
      } else if (bakiye.prBrm === "USD") {
        hesapBakiyesiUSD += amount;
      }
    }

    // --- Limit usage ---
    const limitKullanimOrani =
      toplamLimit > 0
        ? Math.round(
            ((toplamLimit - toplamKullanilabilirLimit) / toplamLimit) * 1000
          ) / 10
        : 0;

    return {
      toplamBorc,
      toplamLimit,
      toplamKullanilabilirLimit,
      toplamAsgariOdeme,
      limitKullanimOrani,
      hesapBakiyesi,
      hesapBakiyesiUSD,
      yaklasanOdemeler,
      puanOzeti,
      toplamTaksitYuku,
      kmhBorcu,
    };
  }, []);
}
