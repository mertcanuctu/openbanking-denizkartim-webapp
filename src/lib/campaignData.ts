// ============================================
// DenizKartım — Kampanya Verileri
// Mock campaign data for the campaigns page
// ============================================

export type KampanyaKategori = "yakit" | "market" | "yemek" | "e-ticaret" | "ulasim" | "seyahat";

export interface Kampanya {
  id: string;
  baslik: string;
  aciklama: string;
  marka: string;
  kategori: KampanyaKategori;
  cashbackOrani: number;
  uyumluKartlar: string[];
  uyumluHHSKodlari: string[];
  gradientFrom: string;
  gradientTo: string;
  ikon: string;
  sonTarih: string;
  sartlar: string;
}

export const KAMPANYA_KATEGORILERI = [
  { id: "tumu", label: "Tümü" },
  { id: "yakit", label: "Yakıt" },
  { id: "market", label: "Market" },
  { id: "yemek", label: "Yemek" },
  { id: "e-ticaret", label: "E-ticaret" },
  { id: "ulasim", label: "Ulaşım" },
  { id: "seyahat", label: "Seyahat" },
] as const;

export const mockKampanyalar: Kampanya[] = [
  {
    id: "k1",
    baslik: "Shell'den yakıt alımlarında %5 cashback kazan!",
    aciklama: "DenizKartım'a ekli kartlarınla Shell istasyonlarından yapacağın tüm akaryakıt alımlarında %5 cashback kazanırsın. Minimum tutar: ₺200.",
    marka: "Shell",
    kategori: "yakit",
    cashbackOrani: 5,
    uyumluKartlar: ["Denizbank", "Garanti BBVA"],
    uyumluHHSKodlari: ["0134", "0062"],
    gradientFrom: "#F97316",
    gradientTo: "#DC2626",
    ikon: "Fuel",
    sonTarih: "2026-02-28",
    sartlar: "Kampanya 1-28 Şubat 2026 tarihleri arasında geçerlidir. Minimum tek seferlik işlem tutarı ₺200'dir. Aylık maksimum cashback tutarı ₺150'dir. Cashback, işlem tarihinden itibaren 5 iş günü içinde hesaba yansır. Kampanya sadece Shell markalı istasyonlarda geçerlidir.",
  },
  {
    id: "k2",
    baslik: "Migros'ta her 500₺ alışverişe 100 puan!",
    aciklama: "Migros mağazaları ve Migros Sanal Market'te yapacağın 500₺ ve üzeri alışverişlerde 100 DenizPuan kazanırsın.",
    marka: "Migros",
    kategori: "market",
    cashbackOrani: 0,
    uyumluKartlar: ["Denizbank", "Yapı Kredi"],
    uyumluHHSKodlari: ["0134", "0067"],
    gradientFrom: "#DC2626",
    gradientTo: "#F97316",
    ikon: "ShoppingCart",
    sonTarih: "2026-03-15",
    sartlar: "Kampanya 1 Şubat - 15 Mart 2026 tarihleri arasında geçerlidir. Minimum sepet tutarı ₺500'dir. Puanlar haftalık olarak hesaba tanımlanır. Migros Jet ve Migros Sanal Market dahildir. 5M Migros hariçtir.",
  },
  {
    id: "k3",
    baslik: "Getir'de ilk 3 siparişinde %10 cashback!",
    aciklama: "Bu ay Getir'den yapacağın ilk 3 siparişinde toplam ödemenin %10'u hesabına cashback olarak yansır. Maks. ₺50 cashback.",
    marka: "Getir",
    kategori: "yemek",
    cashbackOrani: 10,
    uyumluKartlar: ["Garanti BBVA", "Yapı Kredi"],
    uyumluHHSKodlari: ["0062", "0067"],
    gradientFrom: "#A855F7",
    gradientTo: "#EC4899",
    ikon: "UtensilsCrossed",
    sonTarih: "2026-02-28",
    sartlar: "Kampanya Şubat 2026 dönemi için geçerlidir. Maksimum 3 sipariş için cashback uygulanır. Toplam cashback üst limiti ₺50'dir. Getir uygulaması üzerinden yapılan siparişler geçerlidir. GetirYemek ve GetirÇarşı dahildir.",
  },
  {
    id: "k4",
    baslik: "Trendyol'da 1.000₺ üzeri alışverişe ₺75 indirim!",
    aciklama: "Trendyol'da 1.000₺ ve üzeri sepetlerde kampanya kodunu kullanarak anında ₺75 indirim kazan. Kampanya kodu uygulama içinden kopyalanabilir.",
    marka: "Trendyol",
    kategori: "e-ticaret",
    cashbackOrani: 0,
    uyumluKartlar: ["Denizbank", "Garanti BBVA", "Yapı Kredi"],
    uyumluHHSKodlari: ["0134", "0062", "0067"],
    gradientFrom: "#F97316",
    gradientTo: "#FB923C",
    ikon: "ShoppingBag",
    sonTarih: "2026-03-10",
    sartlar: "Kampanya 1 Şubat - 10 Mart 2026 tarihleri arasında geçerlidir. Minimum sepet tutarı ₺1.000'dir. Her kullanıcı kampanyayı 1 kez kullanabilir. Trendyol Market hariçtir. İndirim kodu tek kullanımlıktır.",
  },
  {
    id: "k5",
    baslik: "BiTaksi'de 5 seferde %15 cashback!",
    aciklama: "Bu ay BiTaksi ile yapacağın 5 veya daha fazla seferde toplam ücretin %15'ini cashback olarak kazan.",
    marka: "BiTaksi",
    kategori: "ulasim",
    cashbackOrani: 15,
    uyumluKartlar: ["Denizbank", "Yapı Kredi"],
    uyumluHHSKodlari: ["0134", "0067"],
    gradientFrom: "#F59E0B",
    gradientTo: "#F97316",
    ikon: "Car",
    sonTarih: "2026-02-28",
    sartlar: "Kampanya Şubat 2026 dönemi için geçerlidir. Minimum 5 sefer tamamlanmalıdır. Cashback, ay sonunda toplam tutar üzerinden hesaplanır. Maksimum cashback tutarı ₺100'dir. Sadece BiTaksi uygulaması üzerinden yapılan ödemeler geçerlidir.",
  },
  {
    id: "k6",
    baslik: "Pegasus biletinde 500 bonus puan kazan!",
    aciklama: "Pegasus Airlines'tan alacağın her iç hat bileti için 500, dış hat bileti için 1.000 DenizPuan hesabına tanımlanır.",
    marka: "Pegasus",
    kategori: "seyahat",
    cashbackOrani: 0,
    uyumluKartlar: ["Garanti BBVA", "Denizbank"],
    uyumluHHSKodlari: ["0062", "0134"],
    gradientFrom: "#3B82F6",
    gradientTo: "#1E3A5F",
    ikon: "Plane",
    sonTarih: "2026-03-31",
    sartlar: "Kampanya 1 Şubat - 31 Mart 2026 tarihleri arasında geçerlidir. İç hat biletlerde 500, dış hat biletlerde 1.000 puan kazanılır. Puanlar bilet tarihinden itibaren 10 iş günü içinde tanımlanır. Promosyonlu biletler dahildir. BolBol puanlarıyla alınan biletler hariçtir.",
  },
  {
    id: "k7",
    baslik: "Yemeksepeti'nde ₺30 iade kazan!",
    aciklama: "Yemeksepeti'nden bu ay yapacağın 150₺ ve üzeri ilk siparişinde ₺30 cashback kazan. Bir kerelik kullanım.",
    marka: "Yemeksepeti",
    kategori: "yemek",
    cashbackOrani: 0,
    uyumluKartlar: ["Yapı Kredi", "Garanti BBVA"],
    uyumluHHSKodlari: ["0067", "0062"],
    gradientFrom: "#DC2626",
    gradientTo: "#EF4444",
    ikon: "Pizza",
    sonTarih: "2026-02-28",
    sartlar: "Kampanya Şubat 2026 dönemi için geçerlidir. Minimum sipariş tutarı ₺150'dir. Her kullanıcı kampanyayı 1 kez kullanabilir. Cashback 3 iş günü içinde hesaba yansır. Yemeksepeti Banabi siparişleri hariçtir.",
  },
  {
    id: "k8",
    baslik: "Hepsiburada'da 750₺ üzeri alışverişe 2X puan!",
    aciklama: "Hepsiburada'da 750₺ ve üzeri alışverişlerde normal puan kazanımının 2 katını DenizPuan olarak kazan.",
    marka: "Hepsiburada",
    kategori: "e-ticaret",
    cashbackOrani: 0,
    uyumluKartlar: ["Denizbank"],
    uyumluHHSKodlari: ["0134"],
    gradientFrom: "#F97316",
    gradientTo: "#FB923C",
    ikon: "Package",
    sonTarih: "2026-03-20",
    sartlar: "Kampanya 1 Şubat - 20 Mart 2026 tarihleri arasında geçerlidir. Minimum sepet tutarı ₺750'dir. Ekstra puanlar sipariş tesliminden 7 iş günü sonra tanımlanır. İptal veya iade edilen siparişlerde puan kazanımı geçersiz olur. Hepsiburada Premium üyelik dahildir.",
  },
  {
    id: "k9",
    baslik: "CarrefourSA'da hafta sonları %8 cashback!",
    aciklama: "Her hafta Cumartesi ve Pazar günleri CarrefourSA mağazalarında yapacağın alışverişlerin %8'ini cashback olarak kazan. Maks. ₺40/hafta.",
    marka: "CarrefourSA",
    kategori: "market",
    cashbackOrani: 8,
    uyumluKartlar: ["Garanti BBVA", "Yapı Kredi", "Denizbank"],
    uyumluHHSKodlari: ["0062", "0067", "0134"],
    gradientFrom: "#0EA5E9",
    gradientTo: "#10B981",
    ikon: "Store",
    sonTarih: "2026-03-31",
    sartlar: "Kampanya 1 Şubat - 31 Mart 2026 tarihleri arasında geçerlidir. Sadece Cumartesi ve Pazar günleri geçerlidir. Haftalık maksimum cashback tutarı ₺40'tır. CarrefourSA online sipariş dahildir. Alkol ve tütün ürünleri hariçtir.",
  },
  {
    id: "k10",
    baslik: "Booking.com'da otel rezervasyonuna ₺150 indirim!",
    aciklama: "Booking.com üzerinden yapacağın 500₺ ve üzeri otel rezervasyonlarında ₺150 indirim kazan. Yurt içi ve yurt dışı tüm oteller geçerli.",
    marka: "Booking.com",
    kategori: "seyahat",
    cashbackOrani: 0,
    uyumluKartlar: ["Denizbank", "Garanti BBVA"],
    uyumluHHSKodlari: ["0134", "0062"],
    gradientFrom: "#1E3A5F",
    gradientTo: "#0F172A",
    ikon: "Hotel",
    sonTarih: "2026-04-30",
    sartlar: "Kampanya 1 Şubat - 30 Nisan 2026 tarihleri arasında geçerlidir. Minimum rezervasyon tutarı ₺500'dir. İndirim, rezervasyon onayından sonra 5 iş günü içinde kart ekstresine yansır. İptal edilen rezervasyonlarda indirim geçersiz olur. Booking.com mobil uygulama ve web sitesi üzerinden yapılan rezervasyonlar geçerlidir.",
  },
];

/** Get campaigns compatible with a given HHS bank code */
export function getKampanyalarByHHS(hhsKod: string): Kampanya[] {
  return mockKampanyalar.filter((k) =>
    k.uyumluHHSKodlari.includes(hhsKod)
  );
}
