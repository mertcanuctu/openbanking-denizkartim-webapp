"use client";

import { motion } from "framer-motion";
import { CreditCard, Clock, AlertCircle } from "lucide-react";
import { cn, formatCurrency, formatDateShort, formatRemainingDays } from "@/lib/utils";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import type { YaklasanOdeme } from "@/lib/types";

interface PaymentCardProps {
  odeme: YaklasanOdeme;
  index?: number;
}

export function PaymentCard({ odeme, index = 0 }: PaymentCardProps) {
  const remaining = formatRemainingDays(odeme.sonOdemeTarihi);

  const urgencyColors = {
    danger: { bg: "bg-danger/10", border: "border-danger/20", text: "text-danger" },
    warning: { bg: "bg-warning/10", border: "border-warning/20", text: "text-warning" },
    normal: { bg: "bg-accent/10", border: "border-accent/20", text: "text-accent" },
  };
  const colors = urgencyColors[remaining.urgency];

  // Payment progress: what portion of debt is the asgari?
  const asgariRatio =
    odeme.ekstreBorcu > 0
      ? (odeme.asgariOdeme / odeme.ekstreBorcu) * 100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      className="glass-card p-4"
    >
      {/* Header: card name + urgency badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              colors.bg
            )}
          >
            <CreditCard size={14} className={colors.text} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {odeme.kartAdi}
            </p>
            <p className="text-[10px] text-text-muted">
              {odeme.kartSema}
            </p>
          </div>
        </div>
        <Badge
          variant={remaining.urgency === "danger" ? "danger" : remaining.urgency === "warning" ? "warning" : "accent"}
          dot
        >
          {remaining.text}
        </Badge>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-text-muted mb-0.5">Ekstre Borcu</p>
          <AmountDisplay
            amount={odeme.ekstreBorcu}
            size="md"
            className="text-text-primary"
          />
        </div>
        <div>
          <p className="text-[10px] text-text-muted mb-0.5">Asgari Ödeme</p>
          <AmountDisplay
            amount={odeme.asgariOdeme}
            size="md"
            className="text-warning"
          />
        </div>
      </div>

      {/* Due date + mini progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-text-muted" />
          <span className="text-[11px] text-text-muted">
            Son Ödeme: {formatDateShort(odeme.sonOdemeTarihi)}
          </span>
        </div>
        <span className="text-[10px] text-text-muted">
          Asgari: %{asgariRatio.toFixed(0)}
        </span>
      </div>

      {/* Asgari ödeme bar */}
      <div className="mb-4">
        <div className="w-full h-1.5 rounded-full bg-surface-light overflow-hidden relative">
          <div
            className="h-full rounded-full bg-warning/60 absolute left-0 top-0"
            style={{ width: `${Math.min(asgariRatio, 100)}%` }}
          />
          <div
            className="h-full rounded-full bg-accent absolute left-0 top-0"
            style={{ width: "100%" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-warning">
            Asgari {formatCurrency(odeme.asgariOdeme)}
          </span>
          <span className="text-[9px] text-accent">
            Tam {formatCurrency(odeme.ekstreBorcu)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold transition-colors hover:bg-accent/90"
        >
          Borç Öde
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-2.5 rounded-xl bg-surface-light/60 text-text-secondary text-xs font-semibold border border-card-border transition-colors hover:bg-surface-light"
        >
          Asgari Öde
        </motion.button>
      </div>
    </motion.div>
  );
}
