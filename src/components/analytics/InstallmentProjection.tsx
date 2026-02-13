"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { CalendarClock } from "lucide-react";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { TURKISH_MONTHS_SHORT, COLORS } from "@/lib/constants";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import type { DonemTaksitBilgisi, EnrichedTransaction } from "@/lib/types";

interface InstallmentProjectionProps {
  /** 12-period installment data from card details */
  donemTaksitTutarBilgisi: DonemTaksitBilgisi[];
  /** Active installment transactions (for breakdown list) */
  installmentTransactions?: EnrichedTransaction[];
  /** Remaining total installment amount */
  kalanToplamTaksitTutari?: string;
}

/**
 * Custom tooltip for installment chart
 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card px-3 py-2 text-xs border border-card-border">
      <p className="text-text-muted mb-0.5">{label}</p>
      <p className="text-accent font-semibold">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export function InstallmentProjection({
  donemTaksitTutarBilgisi,
  installmentTransactions = [],
  kalanToplamTaksitTutari,
}: InstallmentProjectionProps) {
  // Prepare chart data — map periods to month names
  const chartData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed

    return donemTaksitTutarBilgisi.map((d) => {
      const monthIndex = (currentMonth + d.donem) % 12;
      const amount = Math.abs(parseFloat(d.taksitTutari));

      return {
        donem: d.donem,
        ay: TURKISH_MONTHS_SHORT[monthIndex],
        tutar: amount,
        isCurrent: d.donem === 0,
      };
    });
  }, [donemTaksitTutarBilgisi]);

  const kalanToplam = kalanToplamTaksitTutari
    ? Math.abs(parseFloat(kalanToplamTaksitTutari))
    : 0;

  const buDonemTaksit = chartData.length > 0 ? chartData[0].tutar : 0;

  if (donemTaksitTutarBilgisi.length === 0) {
    return (
      <div className="py-12 text-center">
        <CalendarClock size={40} className="text-text-muted mx-auto mb-3 opacity-40" />
        <p className="text-text-muted text-sm">Aktif taksitli işlem bulunmuyor</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <p className="text-[11px] text-text-muted mb-1">Bu Dönem Taksit</p>
          <AmountDisplay amount={buDonemTaksit} size="lg" className="text-accent" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4"
        >
          <p className="text-[11px] text-text-muted mb-1">Kalan Toplam</p>
          <AmountDisplay amount={kalanToplam} size="lg" className="text-warning" />
        </motion.div>
      </div>

      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-medium text-text-primary mb-4">
          Taksit Projeksiyonu (12 Ay)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, bottom: 0, left: -15 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="ay"
                tick={{ fill: COLORS.textMuted, fontSize: 10 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: COLORS.textMuted, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => formatCurrencyCompact(v)}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="tutar" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {chartData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.isCurrent ? COLORS.accent : `${COLORS.accent}40`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Active installment transactions */}
      {installmentTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-medium text-text-primary mb-3">
            Aktif Taksitli İşlemler
          </h3>
          <div className="space-y-3">
            {installmentTransactions.map((t) => {
              const toplamTutar = t.toplamTaksitTutari
                ? Math.abs(parseFloat(t.toplamTaksitTutari.ttr))
                : 0;
              const taksitSayisi = t.toplamTaksitSayisi || 0;
              const aylikTutar =
                taksitSayisi > 0 ? toplamTutar / taksitSayisi : 0;
              const taksitDonemi = t.taksitDonemi || 0;
              const kalanTaksit = taksitSayisi - taksitDonemi;

              // Progress percentage
              const progress =
                taksitSayisi > 0 ? (taksitDonemi / taksitSayisi) * 100 : 0;

              return (
                <div
                  key={t.islemNo}
                  className="p-3 rounded-xl bg-surface-light/30 border border-card-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {t.islemAciklamasi}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {t.kategoriAdi} · {taksitDonemi}/{taksitSayisi} taksit
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-semibold text-text-primary">
                        {formatCurrency(toplamTutar)}
                      </p>
                      <p className="text-[11px] text-accent">
                        {formatCurrency(aylikTutar)}/ay
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-surface-light overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">
                    {kalanTaksit} taksit kaldı
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
