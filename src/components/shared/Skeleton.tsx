"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  /** Rounded variant */
  rounded?: "sm" | "md" | "lg" | "full" | "2xl";
}

/**
 * Shimmer skeleton loading placeholder.
 * Use inside glass-card containers to match the app theme.
 */
export function Skeleton({ className, rounded = "lg" }: SkeletonProps) {
  const roundedClass = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
    "2xl": "rounded-2xl",
  }[rounded];

  return (
    <div
      className={cn(
        "animate-pulse bg-surface-light/60",
        roundedClass,
        className
      )}
    />
  );
}

/** Pre-built skeleton for a card summary */
export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-40" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

/** Pre-built skeleton for a credit card visual */
export function SkeletonCardVisual() {
  return (
    <div className="glass-card aspect-[1.586/1] w-full max-w-[320px] mx-auto p-5 space-y-3">
      <Skeleton className="h-4 w-32" />
      <div className="flex-1" />
      <Skeleton className="h-5 w-48" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

/** Pre-built skeleton for a transaction item */
export function SkeletonTransaction() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="w-9 h-9 flex-shrink-0" rounded="lg" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <div className="space-y-1.5 text-right">
        <Skeleton className="h-3 w-16 ml-auto" />
        <Skeleton className="h-2 w-12 ml-auto" />
      </div>
    </div>
  );
}

/** Pre-built skeleton for a list of transactions */
export function SkeletonTransactionList({ count = 5 }: { count?: number }) {
  return (
    <div className="glass-card overflow-hidden divide-y divide-card-border">
      <div className="p-4 pb-2">
        <Skeleton className="h-4 w-36" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTransaction key={i} />
      ))}
    </div>
  );
}

/** Dashboard skeleton layout */
export function SkeletonDashboard() {
  return (
    <div className="px-5 space-y-4 pb-4 animate-in fade-in duration-300">
      <SkeletonCard />
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-light/30">
        <Skeleton className="w-8 h-8" rounded="lg" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <SkeletonCardVisual />
      <SkeletonTransactionList count={3} />
    </div>
  );
}
