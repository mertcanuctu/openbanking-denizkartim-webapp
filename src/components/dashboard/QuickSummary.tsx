"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { ProgressBar } from "@/components/shared/ProgressBar";
import type { ExtendedFinancialSummary } from "@/hooks/useFinancialSummary";

interface QuickSummaryProps {
  summary: ExtendedFinancialSummary;
}

export function QuickSummary({ summary }: QuickSummaryProps) {
  const {
    toplamBorc,
    toplamKullanilabilirLimit,
    toplamAsgariOdeme,
    limitKullanimOrani,
  } = summary;

  return (
    <div className="glass-card overflow-hidden">
      {/* Gradient accent bar at top */}
      <div className="h-1 bg-gradient-accent" />

      <div className="p-5">
        {/* Main amount */}
        <div className="text-center mb-4">
          <p className="text-text-secondary text-sm mb-1">Toplam Borç</p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <AmountDisplay
              amount={toplamBorc}
              size="xl"
              className="text-text-primary font-bold"
            />
          </motion.div>
        </div>

        {/* Two columns */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center">
              <TrendingUp size={16} className="text-success" />
            </div>
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider">
                Kullanılabilir Limit
              </p>
              <AmountDisplay
                amount={toplamKullanilabilirLimit}
                size="sm"
                className="text-success"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center">
              <TrendingDown size={16} className="text-warning" />
            </div>
            <div className="text-right">
              <p className="text-text-muted text-[10px] uppercase tracking-wider">
                Bu Ay Asgari
              </p>
              <AmountDisplay
                amount={toplamAsgariOdeme}
                size="sm"
                className="text-warning"
              />
            </div>
          </div>
        </div>

        {/* Limit usage progress */}
        <ProgressBar
          value={limitKullanimOrani}
          size="md"
          variant="auto"
          showLabel
          animate
        />
      </div>
    </div>
  );
}
