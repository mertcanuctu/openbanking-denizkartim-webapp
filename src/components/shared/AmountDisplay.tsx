"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AmountDisplayProps {
  /** The numeric amount */
  amount: number;
  /** Currency code (TRY, USD, EUR) */
  currency?: string;
  /** Size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Show sign (+/-) */
  showSign?: boolean;
  /** Color based on debit/credit */
  colorize?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Animate the number on mount */
  animate?: boolean;
}

/**
 * Format amount for display in Turkish locale
 */
function formatAmount(amount: number, currency: string): string {
  const absNum = Math.abs(amount);
  const formatted = absNum.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  switch (currency) {
    case "TRY":
      return `${formatted} ₺`;
    case "USD":
      return `$${formatted}`;
    case "EUR":
      return `€${formatted}`;
    default:
      return `${formatted} ${currency}`;
  }
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-3xl",
};

export function AmountDisplay({
  amount,
  currency = "TRY",
  size = "md",
  showSign = false,
  colorize = false,
  className,
  animate = false,
}: AmountDisplayProps) {
  const isNegative = amount < 0;
  const sign = showSign ? (isNegative ? "-" : "+") : isNegative ? "-" : "";

  const colorClass = colorize
    ? isNegative
      ? "text-danger"
      : "text-success"
    : "";

  const displayText = `${sign}${formatAmount(amount, currency)}`;

  const content = (
    <span
      className={cn(
        "font-semibold tabular-nums tracking-tight",
        sizeClasses[size],
        colorClass,
        className
      )}
      aria-label={`${Math.abs(amount)} ${currency === "TRY" ? "Türk Lirası" : currency}`}
    >
      {displayText}
    </span>
  );

  if (animate) {
    return (
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {content}
      </motion.span>
    );
  }

  return content;
}
