"use client";

import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Flame,
  Smartphone,
  Droplets,
  Send,
  Landmark,
  Building2,
} from "lucide-react";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { formatDateShort, cn } from "@/lib/utils";
import type { RecentAccountTransaction } from "@/hooks/useAccountInsights";

interface AccountTransactionsProps {
  transactions: RecentAccountTransaction[];
}

/** Map transaction descriptions to icons */
function getTransactionIcon(aciklama: string) {
  const upper = aciklama.toUpperCase();
  if (upper.includes("ATM")) return { icon: Banknote, color: "text-warning", bg: "bg-warning/15" };
  if (upper.includes("IGDAS") || upper.includes("DOGALGAZ")) return { icon: Flame, color: "text-orange-400", bg: "bg-orange-400/15" };
  if (upper.includes("TELEKOM")) return { icon: Smartphone, color: "text-blue-400", bg: "bg-blue-400/15" };
  if (upper.includes("ISKI") || upper.includes("SU")) return { icon: Droplets, color: "text-cyan-400", bg: "bg-cyan-400/15" };
  if (upper.includes("TRANSFER") || upper.includes("ARKADAS")) return { icon: Send, color: "text-purple-400", bg: "bg-purple-400/15" };
  if (upper.includes("MAAS")) return { icon: Landmark, color: "text-success", bg: "bg-success/15" };
  if (upper.includes("KIRA")) return { icon: Building2, color: "text-rose-400", bg: "bg-rose-400/15" };
  return { icon: ArrowDownLeft, color: "text-text-muted", bg: "bg-surface-light" };
}

/** Clean up the raw transaction description for display */
function cleanDescription(aciklama: string): string {
  return aciklama
    .replace("OTOMATIK ODEME - ", "")
    .replace("NISAN 2026 ", "")
    .split(" ")
    .map((w) => {
      if (w.length <= 2) return w;
      return w.charAt(0) + w.slice(1).toLowerCase();
    })
    .join(" ");
}

export function AccountTransactions({
  transactions,
}: AccountTransactionsProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <Landmark size={16} className="text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">
            Son Hesap Hareketleri
          </h3>
        </div>
        <span className="text-[10px] text-text-muted">Tüm Hesaplar</span>
      </div>

      {/* Transaction list */}
      <div className="divide-y divide-card-border">
        {transactions.map((tx, idx) => {
          const { icon: Icon, color, bg } = getTransactionIcon(tx.aciklama);
          const isCredit = tx.brcAlc === "A";

          return (
            <motion.div
              key={tx.islNo}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center gap-3 px-4 py-3"
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  bg
                )}
              >
                <Icon size={16} className={color} />
              </div>

              {/* Description + date + source */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary font-medium truncate">
                  {cleanDescription(tx.aciklama)}
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] text-text-muted">
                    {formatDateShort(tx.tarih)}
                  </p>
                  <span className="text-[10px] text-text-muted">·</span>
                  <p className="text-[10px] text-accent/70 truncate">
                    {tx.hesapAdi}
                  </p>
                </div>
              </div>

              {/* Amount + balance */}
              <div className="text-right flex-shrink-0">
                <p
                  className={cn(
                    "text-xs font-semibold tabular-nums",
                    isCredit ? "text-success" : "text-danger"
                  )}
                >
                  {isCredit ? "+" : "-"}
                  <AmountDisplay
                    amount={tx.tutar}
                    size="xs"
                    className={isCredit ? "text-success" : "text-danger"}
                  />
                </p>
                <p className="text-[9px] text-text-muted tabular-nums">
                  Bakiye: {tx.guncelBakiye.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
