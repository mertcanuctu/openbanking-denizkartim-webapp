"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** Value from 0 to 100 */
  value: number;
  /** Height variant */
  size?: "sm" | "md" | "lg";
  /** Color variant - auto will pick based on value thresholds */
  variant?: "accent" | "success" | "warning" | "danger" | "auto";
  /** Show percentage label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: "top" | "inside";
  /** Animate on mount */
  animate?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

function getAutoColor(value: number): string {
  if (value >= 80) return "bg-danger";
  if (value >= 60) return "bg-warning";
  if (value >= 40) return "bg-accent";
  return "bg-success";
}

const variantColors: Record<string, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function ProgressBar({
  value,
  size = "md",
  variant = "accent",
  showLabel = false,
  labelPosition = "top",
  animate = true,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const barColor =
    variant === "auto" ? getAutoColor(clampedValue) : variantColors[variant];

  return (
    <div className={cn("w-full", className)}>
      {showLabel && labelPosition === "top" && (
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>Kullanım</span>
          <span>%{clampedValue.toFixed(1)}</span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full overflow-hidden bg-surface-light",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Yüzde ${clampedValue.toFixed(1)} kullanım`}
      >
        {animate ? (
          <motion.div
            className={cn("h-full rounded-full", barColor)}
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        ) : (
          <div
            className={cn("h-full rounded-full transition-all duration-500", barColor)}
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>
    </div>
  );
}
