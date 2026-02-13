// ============================================
// DenizKartım — Constants
// Design tokens, colors, static values
// ============================================

export const COLORS = {
  primary: "#0A1628",
  accent: "#0EA5E9",
  accentLight: "#38BDF8",
  accentDark: "#0284C7",
  danger: "#EF4444",
  dangerLight: "#FCA5A5",
  success: "#10B981",
  successLight: "#6EE7B7",
  warning: "#F59E0B",
  warningLight: "#FCD34D",
  surface: "#111827",
  surfaceLight: "#1F2937",
  card: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.1)",
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
} as const;

export const CARD_GRADIENTS: Record<string, { from: string; to: string }> = {
  "Axess Platinum": { from: "#374151", to: "#111827" },
  "Wings Mastercard": { from: "#991B1B", to: "#450A0A" },
  "Axess Sanal Kart": { from: "#1E3A5F", to: "#0A1628" },
  "Akbank Banka Kartı": { from: "#0369A1", to: "#0C4A6E" },
  "Denizbank Bonus": { from: "#003DA6", to: "#001A4D" },
  "Miles&Smiles": { from: "#00854A", to: "#003D22" },
};

export const SCHEMA_COLORS: Record<string, string> = {
  VISA: "#1A1F71",
  MC: "#EB001B",
  TROY: "#00A4E4",
};

// Category chart colors
export const CHART_COLORS = [
  "#0EA5E9", // Accent blue
  "#8B5CF6", // Purple
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#A855F7", // Violet
  "#FB923C", // Light orange
  "#4ADE80", // Light green
  "#38BDF8", // Light blue
];

export const APP_NAME = "DenizKartım";
export const BANK_NAME = "Akbank"; // Primary bank (backward compat)
export const BANK_CODE = "0046"; // HHS Kodu
export const YOS_NAME = "Denizbank - Denizkartım";
export const YOS_CODE = "0134"; // YÖS Kodu

// Bank visual config for profile/connections
export const BANK_CONFIG: Record<string, { color: string; letter: string; gradient: { from: string; to: string } }> = {
  "0046": { color: "#DC2626", letter: "A", gradient: { from: "#DC2626", to: "#991B1B" } },  // Akbank
  "0134": { color: "#003DA6", letter: "D", gradient: { from: "#003DA6", to: "#001A4D" } },  // Denizbank
  "0062": { color: "#00854A", letter: "G", gradient: { from: "#00854A", to: "#003D22" } },  // Garanti BBVA
};

// Navigation routes
export const ROUTES = {
  home: "/",
  kartlarim: "/kartlarim",
  kartDetay: (kartRef: string) => `/kartlarim/${kartRef}`,
  analizler: "/analizler",
  odemeler: "/odemeler",
  profil: "/profil",
} as const;

// Navigation items for BottomNav
export const NAV_ITEMS = [
  { label: "Ana Sayfa", href: ROUTES.home, icon: "Home" },
  { label: "Kartlarım", href: ROUTES.kartlarim, icon: "CreditCard" },
  { label: "Analizler", href: ROUTES.analizler, icon: "BarChart3" },
  { label: "Ödemeler", href: ROUTES.odemeler, icon: "Calendar" },
  { label: "Profil", href: ROUTES.profil, icon: "User" },
] as const;

// Turkish month names (short form for charts)
export const TURKISH_MONTHS_SHORT = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
] as const;

// Turkish month names (full form)
export const TURKISH_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
] as const;

// Open Banking consent types
export const CONSENT_TYPES = [
  { kod: "01", ad: "Temel Hesap Bilgisi" },
  { kod: "02", ad: "Ayrıntılı Hesap Bilgisi" },
  { kod: "03", ad: "Bakiye Bilgisi" },
  { kod: "04", ad: "İşlem Bilgisi" },
  { kod: "05", ad: "Temel Kart Bilgisi" },
  { kod: "06", ad: "Ayrıntılı Kart Bilgisi" },
  { kod: "07", ad: "Kart Bakiye Bilgisi" },
  { kod: "08", ad: "Kart İşlem Bilgisi" },
  { kod: "09", ad: "Kart Ekstre Bilgisi" },
] as const;

// Annual interest rate for credit card debt (typical Turkish rate)
export const CREDIT_CARD_INTEREST_RATE = 4.42; // Monthly %
export const CREDIT_CARD_ANNUAL_RATE = 52.98; // Annual %

// Animation durations (ms)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  stagger: 50,
} as const;
