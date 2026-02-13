// ============================================
// DenizKartım — MCC Category Mapping
// Maps Merchant Category Codes to Turkish categories
// with Lucide icon names and colors
// ============================================

export interface CategoryInfo {
  kod: string;
  ad: string;
  ikon: string; // Lucide icon name
  renk: string; // Hex color
}

/**
 * MCC Code → Category mapping
 * Based on real Turkish banking MCC codes
 */
export const MCC_CATEGORIES: Record<string, CategoryInfo> = {
  // Dijital İçerik — Netflix, YouTube
  "4899": {
    kod: "4899",
    ad: "Dijital İçerik",
    ikon: "Play",
    renk: "#E50914",
  },

  // Market — Migros, CarrefourSA, Getir
  "5411": {
    kod: "5411",
    ad: "Market",
    ikon: "ShoppingCart",
    renk: "#10B981",
  },

  // Akaryakıt — Shell, BP
  "5541": {
    kod: "5541",
    ad: "Akaryakıt",
    ikon: "Fuel",
    renk: "#F59E0B",
  },

  // Giyim — Zara
  "5651": {
    kod: "5651",
    ad: "Giyim",
    ikon: "Shirt",
    renk: "#EC4899",
  },

  // Teknoloji — Teknosa, electronics
  "5732": {
    kod: "5732",
    ad: "Teknoloji",
    ikon: "Laptop",
    renk: "#0EA5E9",
  },

  // Teknoloji — Software subscriptions (ChatGPT, GitHub, iCloud, Google One, Adobe)
  "5734": {
    kod: "5734",
    ad: "Teknoloji",
    ikon: "Code",
    renk: "#6366F1",
  },

  // Apple — Apple.com/Bill
  "5735": {
    kod: "5735",
    ad: "Apple",
    ikon: "Smartphone",
    renk: "#A1A1AA",
  },

  // Yeme & İçme — Restaurants
  "5812": {
    kod: "5812",
    ad: "Yeme & İçme",
    ikon: "UtensilsCrossed",
    renk: "#F97316",
  },

  // Yeme & İçme — Cafes (Starbucks)
  "5814": {
    kod: "5814",
    ad: "Yeme & İçme",
    ikon: "Coffee",
    renk: "#F97316",
  },

  // Müzik — Spotify
  "5815": {
    kod: "5815",
    ad: "Müzik",
    ikon: "Music",
    renk: "#1DB954",
  },

  // Eğitim — Duolingo
  "5818": {
    kod: "5818",
    ad: "Eğitim",
    ikon: "GraduationCap",
    renk: "#8B5CF6",
  },

  // Kişisel Bakım — Watsons
  "5912": {
    kod: "5912",
    ad: "Kişisel Bakım",
    ikon: "Heart",
    renk: "#F472B6",
  },

  // Kitap & Hobi — D&R, Amazon
  "5942": {
    kod: "5942",
    ad: "Kitap & Hobi",
    ikon: "BookOpen",
    renk: "#A855F7",
  },

  // Abonelik — Amazon Prime
  "5968": {
    kod: "5968",
    ad: "Abonelik",
    ikon: "RotateCw",
    renk: "#06B6D4",
  },

  // Eğlence — Biletix
  "7922": {
    kod: "7922",
    ad: "Eğlence",
    ikon: "Ticket",
    renk: "#EF4444",
  },

  // Havayolu — THY
  "3000": {
    kod: "3000",
    ad: "Havayolu",
    ikon: "Plane",
    renk: "#DC2626",
  },

  // E-Ticaret — Trendyol
  "5311": {
    kod: "5311",
    ad: "E-Ticaret",
    ikon: "Package",
    renk: "#F97316",
  },

  // Spor — Decathlon
  "5941": {
    kod: "5941",
    ad: "Spor",
    ikon: "Dumbbell",
    renk: "#14B8A6",
  },
};

/**
 * Default category for unknown MCC codes
 */
export const DEFAULT_CATEGORY: CategoryInfo = {
  kod: "0000",
  ad: "Diğer",
  ikon: "CircleDot",
  renk: "#6B7280",
};

/**
 * Get category info from MCC code
 */
export function getCategoryFromMCC(mccCode: string | null): CategoryInfo {
  if (!mccCode) return DEFAULT_CATEGORY;
  return MCC_CATEGORIES[mccCode] || DEFAULT_CATEGORY;
}

/**
 * Get a merged category name — some MCC codes map to the same category
 * This normalizes "5812" and "5814" both to "Yeme & İçme"
 * and "5732" and "5734" both to "Teknoloji" etc.
 */
export function getMergedCategoryName(mccCode: string | null): string {
  return getCategoryFromMCC(mccCode).ad;
}

/**
 * All unique category names (for filters, charts)
 */
export const ALL_CATEGORIES = Array.from(
  new Set(Object.values(MCC_CATEGORIES).map((c) => c.ad))
).sort();

/**
 * Get the primary icon and color for a merged category name
 * (picks the first match)
 */
export function getCategoryByName(
  categoryName: string
): CategoryInfo | undefined {
  return Object.values(MCC_CATEGORIES).find((c) => c.ad === categoryName);
}
