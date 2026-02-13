"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Badge } from "@/components/shared/Badge";
import type { EnrichedTransaction } from "@/lib/types";
import { absAmount } from "@/lib/utils";

interface TransactionItemProps {
  transaction: EnrichedTransaction;
  index?: number;
}

/**
 * Get a Lucide icon component by name string
 */
function getIcon(iconName: string): Icons.LucideIcon {
  const icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName];
  return icon || Icons.CircleDot;
}

export function TransactionItem({ transaction, index = 0 }: TransactionItemProps) {
  const {
    islemAciklamasi,
    islemTutari,
    borcAlacak,
    kategoriAdi,
    kategoriIkon,
    kategoriRenk,
    isTaksitli,
    toplamTaksitSayisi,
    taksitDonemi,
  } = transaction;

  const IconComponent = getIcon(kategoriIkon);
  const amount = absAmount(islemTutari.ttr);
  const isDebit = borcAlacak === "B";
  const currency = islemTutari.prBrm;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="flex items-center gap-3 py-3 press-effect"
    >
      {/* Category icon */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${kategoriRenk}20` }}
      >
        <IconComponent size={18} style={{ color: kategoriRenk }} />
      </div>

      {/* Transaction info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {islemAciklamasi}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-text-muted">{kategoriAdi}</span>
          {isTaksitli && toplamTaksitSayisi && taksitDonemi && (
            <Badge variant="accent" className="text-[9px] px-1.5 py-0">
              {taksitDonemi}/{toplamTaksitSayisi} Taksit
            </Badge>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="flex-shrink-0 text-right">
        <AmountDisplay
          amount={isDebit ? -amount : amount}
          currency={currency}
          size="sm"
          colorize
          className={cn(
            isDebit ? "text-text-primary" : "text-success"
          )}
        />
      </div>
    </motion.div>
  );
}
