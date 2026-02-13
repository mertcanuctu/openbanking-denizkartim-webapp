"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { ChevronDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { ProgressBar } from "@/components/shared/ProgressBar";
import type { CategorySummary, EnrichedTransaction } from "@/lib/types";

interface CategoryBreakdownProps {
  /** Category summaries sorted by amount */
  categorySummary: CategorySummary[];
  /** All transactions (for expandable detail) */
  transactions: EnrichedTransaction[];
}

function getIcon(iconName: string): Icons.LucideIcon {
  const icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName];
  return icon || Icons.CircleDot;
}

export function CategoryBreakdown({
  categorySummary,
  transactions,
}: CategoryBreakdownProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const maxAmount = categorySummary.length > 0 ? categorySummary[0].toplam : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="space-y-2"
    >
      <h3 className="text-sm font-medium text-text-primary mb-3">
        Kategori Kırılımı
      </h3>

      {categorySummary.map((cat, idx) => {
        const IconComponent = getIcon(cat.ikon);
        const isExpanded = expandedCategory === cat.kategori;

        // Transactions in this category
        const categoryTxns = isExpanded
          ? transactions.filter(
              (t) =>
                t.kategoriAdi === cat.kategori &&
                t.borcAlacak === "B" &&
                t.islemTutari.prBrm === "TRY"
            )
          : [];

        return (
          <motion.div
            key={cat.kategori}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="glass-card overflow-hidden"
          >
            {/* Category row */}
            <button
              onClick={() =>
                setExpandedCategory(isExpanded ? null : cat.kategori)
              }
              className="w-full flex items-center gap-3 p-3.5 press-effect"
            >
              {/* Icon */}
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${cat.renk}20` }}
              >
                <IconComponent size={16} style={{ color: cat.renk }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-primary">
                    {cat.kategori}
                  </span>
                  <AmountDisplay
                    amount={cat.toplam}
                    size="sm"
                    className="text-text-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <ProgressBar
                    value={(cat.toplam / maxAmount) * 100}
                    size="sm"
                    variant="accent"
                    animate={false}
                    className="flex-1"
                  />
                  <span className="text-[10px] text-text-muted whitespace-nowrap">
                    %{cat.yuzde} · {cat.islemSayisi} işlem
                  </span>
                </div>
              </div>

              {/* Expand chevron */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown size={16} className="text-text-muted" />
              </motion.div>
            </button>

            {/* Expanded transactions */}
            <AnimatePresence>
              {isExpanded && categoryTxns.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-3.5 pb-3 border-t border-card-border">
                    <div className="divide-y divide-card-border">
                      {categoryTxns.slice(0, 5).map((t) => (
                        <div
                          key={t.islemNo}
                          className="flex items-center justify-between py-2.5"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-text-secondary truncate">
                              {t.islemAciklamasi}
                            </p>
                            <p className="text-[10px] text-text-muted">
                              {t.kartAdi}
                              {t.isTaksitli &&
                                t.taksitDonemi &&
                                t.toplamTaksitSayisi &&
                                ` · ${t.taksitDonemi}/${t.toplamTaksitSayisi} taksit`}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-text-primary ml-2">
                            {formatCurrency(
                              Math.abs(parseFloat(t.islemTutari.ttr))
                            )}
                          </span>
                        </div>
                      ))}
                      {categoryTxns.length > 5 && (
                        <p className="text-[10px] text-text-muted text-center py-2">
                          +{categoryTxns.length - 5} işlem daha
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
