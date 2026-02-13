"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TransactionItem } from "./TransactionItem";
import type { GroupedTransaction } from "@/lib/types";

type FilterType = "tumu" | "B" | "A" | "taksitli";

interface TransactionListProps {
  /** Grouped transactions (by date) */
  grouped: GroupedTransaction[];
  /** Whether to show the filter tabs */
  showFilters?: boolean;
  /** External filter change handler */
  onFilterChange?: (filter: FilterType) => void;
  /** Active filter (controlled) */
  activeFilter?: FilterType;
  /** Max items to show initially (for preview mode) */
  maxItems?: number;
}

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "Tümü", value: "tumu" },
  { label: "Harcama", value: "B" },
  { label: "Ödeme", value: "A" },
  { label: "Taksitli", value: "taksitli" },
];

export function TransactionList({
  grouped,
  showFilters = true,
  onFilterChange,
  activeFilter: controlledFilter,
  maxItems,
}: TransactionListProps) {
  const [internalFilter, setInternalFilter] = useState<FilterType>("tumu");
  const filter = controlledFilter ?? internalFilter;

  const handleFilterChange = (f: FilterType) => {
    setInternalFilter(f);
    onFilterChange?.(f);
  };

  // Flatten and optionally limit for preview mode
  let itemCount = 0;
  const shouldLimit = typeof maxItems === "number";

  return (
    <div>
      {/* Filter tabs */}
      {showFilters && (
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
                filter === opt.value
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "bg-surface-light/50 text-text-muted border border-transparent hover:bg-surface-light"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Transaction groups */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {grouped.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-text-muted text-sm">İşlem bulunamadı</p>
            </div>
          ) : (
            grouped.map((group) => {
              if (shouldLimit && itemCount >= maxItems!) return null;

              return (
                <div key={group.tarih} className="mb-4">
                  {/* Date header */}
                  <div className="sticky top-0 z-10 pb-1 pt-1 bg-navy/80 backdrop-blur-sm">
                    <p className="text-xs font-medium text-text-muted">
                      {group.tarihLabel}
                    </p>
                  </div>

                  {/* Transactions */}
                  <div className="divide-y divide-card-border">
                    {group.islemler.map((t, idx) => {
                      if (shouldLimit && itemCount >= maxItems!) return null;
                      itemCount++;
                      return (
                        <TransactionItem
                          key={t.islemNo}
                          transaction={t}
                          index={idx}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
