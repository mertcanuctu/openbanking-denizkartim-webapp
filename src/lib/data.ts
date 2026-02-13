// ============================================
// DenizKartım — Data Layer
// Import and export typed mock data
// ============================================

import type { UserData, Meta, Kart, KartDetay, KartHareketleriMap, Hesap, Bakiye, HesapIslemi } from "./types";
import rawData from "../../public/mock/user_data.json";

// Cast the raw JSON to our typed interface
export const userData = rawData as unknown as UserData;

// --- Convenience accessors ---

/** All bank connections (meta array) */
export const bankalar: Meta[] = userData._meta;

/** Primary bank meta (backward compat) */
export const meta: Meta = userData._meta[0];

/** Get bank meta by HHS code */
export function getBankaMeta(hhsKod: string): Meta | undefined {
  return bankalar.find((b) => b.hhsKod === hhsKod);
}

/** All accounts */
export const hesaplar: Hesap[] = userData.hesaplar;

/** All balances */
export const bakiyeler: Bakiye[] = userData.bakiyeler;

/** All cards */
export const kartlar: Kart[] = userData.kartlar;

/** Credit cards only */
export const krediKartlari: Kart[] = kartlar.filter((k) => k.kartTipi === "K");

/** Bank cards only */
export const bankaKartlari: Kart[] = kartlar.filter((k) => k.kartTipi === "B");

/** Physical cards only */
export const fizikselKartlar: Kart[] = kartlar.filter((k) => k.altKartTipi === "A");

/** Virtual cards only */
export const sanalKartlar: Kart[] = kartlar.filter((k) => k.altKartTipi === "S");

/** Get a card by kartRef */
export function getKart(kartRef: string): Kart | undefined {
  return kartlar.find((k) => k.kartRef === kartRef);
}

/** Get card details for a given kartRef */
export function getKartDetaylari(kartRef: string): Record<string, KartDetay> | undefined {
  return userData.kartDetaylari[kartRef];
}

/** Get card TRY details */
export function getKartDetayTRY(kartRef: string): KartDetay | undefined {
  return userData.kartDetaylari[kartRef]?.TRY;
}

/** Get card USD details */
export function getKartDetayUSD(kartRef: string): KartDetay | undefined {
  return userData.kartDetaylari[kartRef]?.USD;
}

/** Get card transactions for a given kartRef */
export function getKartHareketleri(kartRef: string): KartHareketleriMap | undefined {
  return userData.kartHareketleri[kartRef];
}

/** Get account transactions for a given hspRef */
export function getHesapIslemleri(hspRef: string): HesapIslemi[] {
  return userData.hesapIslemleri[hspRef] || [];
}

/** Get balance for an account by hspRef */
export function getBakiye(hspRef: string): Bakiye | undefined {
  return bakiyeler.find((b) => b.hspRef === hspRef);
}

/** Get account by hspRef */
export function getHesap(hspRef: string): Hesap | undefined {
  return hesaplar.find((h) => h.hspRef === hspRef);
}

/** Previous period data for subscription detection */
export const oncekiDonemOrnekleri = userData.oncekiDonemOrnekleri;
