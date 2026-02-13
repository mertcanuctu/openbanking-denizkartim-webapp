"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { COLORS } from "@/lib/constants";
import type { CategorySummary } from "@/lib/types";

interface SpendingChartProps {
  /** Category spending summaries */
  categorySummary: CategorySummary[];
  /** Total spending amount */
  toplamHarcama: number;
}

/** Custom tooltip */
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { renk: string; yuzde: number } }>;
}) {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  return (
    <div className="glass-card px-3 py-2 text-xs border border-card-border">
      <div className="flex items-center gap-2 mb-0.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: data.payload.renk }}
        />
        <span className="text-text-primary font-medium">{data.name}</span>
      </div>
      <p className="text-accent font-semibold">{formatCurrency(data.value)}</p>
      <p className="text-text-muted">%{data.payload.yuzde}</p>
    </div>
  );
}

export function SpendingChart({
  categorySummary,
  toplamHarcama,
}: SpendingChartProps) {
  const chartData = useMemo(() => {
    return categorySummary.map((c) => ({
      name: c.kategori,
      value: c.toplam,
      renk: c.renk,
      yuzde: c.yuzde,
    }));
  }, [categorySummary]);

  if (chartData.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-muted text-sm">Harcama verisi bulunamadı</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-medium text-text-primary mb-4">
        Harcama Dağılımı
      </h3>

      {/* Donut chart with center label */}
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationBegin={100}
              animationDuration={800}
            >
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.renk} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] text-text-muted">Toplam</span>
          <span className="text-xl font-bold text-text-primary">
            {formatCurrencyCompact(toplamHarcama)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        {chartData.slice(0, 8).map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.renk }}
            />
            <span className="text-[11px] text-text-secondary truncate flex-1">
              {item.name}
            </span>
            <span className="text-[11px] text-text-muted font-medium">
              %{item.yuzde}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
