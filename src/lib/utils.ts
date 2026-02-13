// ============================================
// DenizKartım — Utility Functions
// Currency formatting, date formatting, helpers
// ============================================

/**
 * Format number as Turkish Lira
 * Example: 42800 → "42.800,00 ₺"
 */
export function formatCurrency(
  amount: number | string,
  currency: string = "TRY",
  showSymbol: boolean = true
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const absNum = Math.abs(num);

  const formatted = absNum.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const prefix = num < 0 ? "-" : "";

  if (!showSymbol) return `${prefix}${formatted}`;

  switch (currency) {
    case "TRY":
      return `${prefix}${formatted} ₺`;
    case "USD":
      return `${prefix}$${formatted}`;
    case "EUR":
      return `${prefix}€${formatted}`;
    default:
      return `${prefix}${formatted} ${currency}`;
  }
}

/**
 * Format compact currency (no decimals for large numbers)
 * Example: 42800 → "42.800 ₺"
 */
export function formatCurrencyCompact(
  amount: number | string,
  currency: string = "TRY"
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const absNum = Math.abs(num);
  const prefix = num < 0 ? "-" : "";

  const formatted = absNum.toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  switch (currency) {
    case "TRY":
      return `${prefix}${formatted} ₺`;
    case "USD":
      return `${prefix}$${formatted}`;
    case "EUR":
      return `${prefix}€${formatted}`;
    default:
      return `${prefix}${formatted} ${currency}`;
  }
}

/**
 * Turkish month names
 */
const TURKISH_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const TURKISH_DAYS = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
];

/**
 * Format date as Turkish format
 * Example: "2026-04-18" → "18 Nisan 2026"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = TURKISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format short date (no year)
 * Example: "2026-04-18" → "18 Nisan"
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = TURKISH_MONTHS[date.getMonth()];
  return `${day} ${month}`;
}

/**
 * Format date for transaction grouping
 * Returns "Bugün", "Dün", or "8 Nisan" etc.
 */
export function formatDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - dateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Bugün";
  if (diffDays === 1) return "Dün";
  if (diffDays < 7) {
    return `${TURKISH_DAYS[date.getDay()]}, ${date.getDate()} ${TURKISH_MONTHS[date.getMonth()]}`;
  }
  return `${date.getDate()} ${TURKISH_MONTHS[date.getMonth()]}`;
}

/**
 * Format relative time from now
 * Example: "3 gün kaldı", "7 gün kaldı"
 */
export function formatRemainingDays(dateStr: string): {
  text: string;
  urgency: "danger" | "warning" | "normal";
} {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)} gün geçti`, urgency: "danger" };
  }
  if (diffDays === 0) {
    return { text: "Bugün son gün!", urgency: "danger" };
  }
  if (diffDays <= 3) {
    return { text: `${diffDays} gün kaldı`, urgency: "danger" };
  }
  if (diffDays <= 7) {
    return { text: `${diffDays} gün kaldı`, urgency: "warning" };
  }
  return { text: `${diffDays} gün kaldı`, urgency: "normal" };
}

/**
 * Mask credit card number for display
 * Example: "465895******4532" → "**** **** **** 4532"
 */
export function maskCardNumber(cardNo: string): string {
  const lastFour = cardNo.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
}

/**
 * Get last 4 digits of card number
 */
export function getLastFourDigits(cardNo: string): string {
  return cardNo.slice(-4);
}

/**
 * Calculate percentage
 */
export function calcPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 1000) / 10;
}

/**
 * Parse Turkish bank amounts (they come as strings, often negative)
 */
export function parseAmount(amount: string): number {
  return parseFloat(amount);
}

/**
 * Get absolute value of amount
 */
export function absAmount(amount: string): number {
  return Math.abs(parseFloat(amount));
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * cn - Tailwind class merge helper (simple version)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
