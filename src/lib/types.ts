// ============================================
// DenizKartım — TypeScript Type Definitions
// Full types for Open Banking mock data
// ============================================

// --- Meta ---
export interface Meta {
  aciklama: string;
  hhs: string;
  hhsKod: string;
  bankaAdi: string;
  yos: string;
  izinTurleri: string[];
  rizaOlusTrh: string;
  erisimIzniSonTrh: string;
  ohkTip: string;
}

// --- Hesaplar (Accounts) ---
export interface Hesap {
  hspRef: string;
  hspNo: string;
  hspShb: string;
  subeAdi: string;
  kisaAd: string | null;
  prBrm: string;
  hspTur: string;
  hspTip: string;
  hspUrunAdi: string;
  hspDrm: string;
  hspAclsTrh: string;
}

// --- Bakiyeler (Balances) ---
export interface KrediHesap {
  kulKrdTtr: string;
  krdDhlGstr: string;
}

export interface Bakiye {
  hspRef: string;
  bkyTtr: string;
  blkTtr: string | null;
  prBrm: string;
  bkyZmn: string;
  krdHsp: KrediHesap | null;
}

// --- Hesap İşlemleri (Account Transactions) ---
export interface KarsiTransfer {
  krsMskIBAN: string | null;
  krsUnvan: string;
  krsKimlikVrs: string | null;
}

export interface HesapIslemi {
  islNo: string;
  refNo: string;
  islTtr: string;
  gnclBky: string;
  prBrm: string;
  islGrckZaman: string;
  kanal: string;
  brcAlc: string;
  islTur: string;
  islAmc: string;
  odmStmNo: string | null;
  islAcklm: string;
  krsTrf: KarsiTransfer | null;
}

// --- Kartlar (Cards) ---
export interface EkstreTuru {
  ekstreTuru: string;
  ekstreStatu: string;
}

export interface Kart {
  kartRef: string;
  kartNo: string;
  asilKartNo: string | null;
  kartTipi: string; // K = Kredi, B = Banka
  altKartTipi: string; // A = Asıl, S = Sanal
  kartFormu: string; // F = Fiziksel, D = Dijital
  kartTuru: string;
  kartStatu: string;
  kartSema: string; // VISA, MC, TROY
  kartUrunAdi: string;
  hhsKod: string; // Banka HHS kodu
  ekstreTurleri: EkstreTuru[];
}

// --- Kart Detayları (Card Details) ---
export interface PuanBilgisi {
  puanDegeri: string;
  puanTipi: string;
}

export interface DonemTaksitBilgisi {
  donem: number;
  taksitTutari: string;
}

export interface KartDetay {
  toplamLimit: string;
  kullanilabilirLimit: string;
  donemIciHareketToplami: string;
  ekstreBorcu: string;
  kalanEkstreBorcu: string;
  asgariOdemeTutari: string;
  kalanAsgariOdemeTutari: string;
  hesapKesimTarihi: string;
  sonOdemeTarihi: string;
  nakitCekimLimiti: string;
  kalanNakitCekimLimiti: string;
  prBrm: string;
  puanBilgisi: PuanBilgisi[];
  kalanToplamTaksitTutari: string;
  donemTaksitTutarBilgisi: DonemTaksitBilgisi[];
}

// Card details keyed by currency (TRY, USD, EUR)
export type KartDetaylari = Record<string, KartDetay>;

// --- Kart Hareketleri (Card Transactions) ---
export interface IslemTutari {
  ttr: string;
  prBrm: string;
}

export interface IslemPuanBilgisi {
  islemPuani: string;
  islemPuanBirimi: string;
  islemPuanDurumu: string;
}

export interface KartHareket {
  islemNo: string;
  islemTutari: IslemTutari;
  orijinalIslemTutari: IslemTutari | null;
  islemTarihi: string;
  borcAlacak: string; // B = Borç, A = Alacak
  islemAciklamasi: string;
  islemPuanBilgileri: IslemPuanBilgisi[];
  toplamTaksitTutari: IslemTutari | null;
  toplamTaksitSayisi: number | null;
  taksitDonemi: number | null;
  saticiKategoriKodu: string | null;
}

export interface DonemHareketleri {
  donem: number;
  hareketBilgileri: KartHareket[];
}

// Card transactions keyed by currency
export type KartHareketleriMap = Record<string, DonemHareketleri>;

// --- Önceki Dönem (Previous Period for Subscription Detection) ---
export interface OncekiDonemHareket {
  islemNo: string;
  islemTutari: IslemTutari;
  islemTarihi: string;
  borcAlacak: string;
  islemAciklamasi: string;
  saticiKategoriKodu: string;
  toplamTaksitTutari?: IslemTutari;
  toplamTaksitSayisi?: number;
  taksitDonemi?: number;
}

export interface OncekiDonemBilgisi {
  donem: number;
  hareketBilgileri: OncekiDonemHareket[];
}

// --- Root Data Structure ---
export interface UserData {
  _meta: Meta[];
  hesaplar: Hesap[];
  bakiyeler: Bakiye[];
  hesapIslemleri: Record<string, HesapIslemi[]>;
  kartlar: Kart[];
  kartDetaylari: Record<string, KartDetaylari>;
  kartHareketleri: Record<string, KartHareketleriMap>;
  oncekiDonemOrnekleri: Record<string, Record<string, OncekiDonemBilgisi>>;
}

// --- App-level types ---
export interface FinancialSummary {
  toplamBorc: number;
  toplamLimit: number;
  toplamKullanilabilirLimit: number;
  toplamAsgariOdeme: number;
  limitKullanimOrani: number;
  hesapBakiyesi: number;
  hesapBakiyesiUSD: number;
  yaklasanOdemeler: YaklasanOdeme[];
  puanOzeti: PuanOzeti[];
}

export interface YaklasanOdeme {
  kartRef: string;
  kartAdi: string;
  kartSema: string;
  sonOdemeTarihi: string;
  ekstreBorcu: number;
  asgariOdeme: number;
  kalanGun: number;
}

export interface PuanOzeti {
  puanTipi: string;
  toplam: number;
}

export interface Abonelik {
  ad: string;
  tutar: number;
  paraBirimi: string;
  kartRef: string;
  kartAdi: string;
  kategori: string;
  sonIslemTarihi: string;
}

export interface AbonelikOzeti {
  abonelikler: Abonelik[];
  toplamTRY: number;
  toplamUSD: number;
  toplamAdet: number;
}

export interface TransactionFilters {
  kategori?: string;
  kartRef?: string;
  tip?: "B" | "A" | "taksitli" | "tumu";
  paraBirimi?: string;
}

export interface GroupedTransaction {
  tarih: string;
  tarihLabel: string;
  islemler: EnrichedTransaction[];
}

export interface EnrichedTransaction extends KartHareket {
  kartRef: string;
  kartAdi: string;
  kartSema: string;
  kategoriAdi: string;
  kategoriIkon: string;
  kategoriRenk: string;
  isTaksitli: boolean;
}

export interface CategorySummary {
  kategori: string;
  ikon: string;
  renk: string;
  toplam: number;
  yuzde: number;
  islemSayisi: number;
}
