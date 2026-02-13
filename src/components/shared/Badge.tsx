"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "danger" | "warning" | "success" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** Small dot indicator */
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-card border border-card-border text-text-secondary",
  accent:
    "bg-accent/15 border border-accent/30 text-accent",
  danger:
    "bg-danger/15 border border-danger/30 text-danger",
  warning:
    "bg-warning/15 border border-warning/30 text-warning",
  success:
    "bg-success/15 border border-success/30 text-success",
  muted:
    "bg-surface-light/50 border border-card-border text-text-muted",
};

export function Badge({
  children,
  variant = "default",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium leading-tight whitespace-nowrap",
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "danger" && "bg-danger",
            variant === "warning" && "bg-warning",
            variant === "success" && "bg-success",
            variant === "accent" && "bg-accent",
            (variant === "default" || variant === "muted") && "bg-text-muted"
          )}
        />
      )}
      {children}
    </span>
  );
}
