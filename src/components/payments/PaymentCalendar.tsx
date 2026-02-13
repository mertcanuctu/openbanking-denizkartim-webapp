"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatCurrency, formatDateShort } from "@/lib/utils";
import { TURKISH_MONTHS } from "@/lib/constants";
import type { YaklasanOdeme } from "@/lib/types";

interface PaymentCalendarProps {
  /** Upcoming payments sorted by date */
  yaklasanOdemeler: YaklasanOdeme[];
  /** Currently selected date (YYYY-MM-DD) */
  selectedDate: string | null;
  /** On date select callback */
  onDateSelect: (date: string | null) => void;
}

const WEEKDAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

/**
 * Get calendar grid for a given month.
 * Returns an array of 42 cells (6 weeks x 7 days).
 * Each cell is { day: number | null, dateStr: string | null }.
 */
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  // Monday = 0, Sunday = 6 (Turkish week starts Monday)
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number | null; dateStr: string | null }> = [];

  // Empty cells before first day
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, dateStr: null });
  }

  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, dateStr });
  }

  // Pad to complete 6 rows (42 cells) or 5 rows (35 cells)
  const totalRows = cells.length > 35 ? 42 : 35;
  while (cells.length < totalRows) {
    cells.push({ day: null, dateStr: null });
  }

  return cells;
}

export function PaymentCalendar({
  yaklasanOdemeler,
  selectedDate,
  onDateSelect,
}: PaymentCalendarProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const cells = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  // Build a map of payment days: dateStr -> urgency color
  const paymentDayMap = useMemo(() => {
    const map = new Map<string, "danger" | "warning" | "normal">();
    for (const odeme of yaklasanOdemeler) {
      const d = new Date(odeme.sonOdemeTarihi);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const urgency: "danger" | "warning" | "normal" =
        odeme.kalanGun <= 3 ? "danger" : odeme.kalanGun <= 7 ? "warning" : "normal";
      map.set(dateStr, urgency);
    }
    return map;
  }, [yaklasanOdemeler]);

  // Selected date payment info
  const selectedPayment = useMemo(() => {
    if (!selectedDate) return null;
    return yaklasanOdemeler.find((o) => {
      const d = new Date(o.sonOdemeTarihi);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return dateStr === selectedDate;
    });
  }, [selectedDate, yaklasanOdemeler]);

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    } else {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
    }
    onDateSelect(null);
  };

  return (
    <div className="glass-card p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-light/50 hover:bg-surface-light transition-colors press-effect"
        >
          <ChevronLeft size={16} className="text-text-secondary" />
        </button>
        <h3 className="text-sm font-semibold text-text-primary">
          {TURKISH_MONTHS[viewMonth]} {viewYear}
        </h3>
        <button
          onClick={() => navigateMonth("next")}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-light/50 hover:bg-surface-light transition-colors press-effect"
        >
          <ChevronRight size={16} className="text-text-secondary" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[10px] font-medium text-text-muted py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          if (!cell.day || !cell.dateStr) {
            return <div key={idx} className="aspect-square" />;
          }

          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;
          const paymentUrgency = paymentDayMap.get(cell.dateStr);
          const hasPayment = !!paymentUrgency;

          return (
            <button
              key={idx}
              onClick={() =>
                onDateSelect(isSelected ? null : cell.dateStr!)
              }
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all duration-150 relative press-effect",
                isSelected
                  ? "bg-accent text-white"
                  : isToday
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "text-text-secondary hover:bg-surface-light/50"
              )}
            >
              {cell.day}
              {/* Payment dot */}
              {hasPayment && !isSelected && (
                <div
                  className={cn(
                    "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                    paymentUrgency === "danger" && "bg-danger",
                    paymentUrgency === "warning" && "bg-warning",
                    paymentUrgency === "normal" && "bg-accent"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date detail */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-text-primary">
                    {selectedPayment.kartAdi}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    Son Ödeme: {formatDateShort(selectedPayment.sonOdemeTarihi)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">
                    {formatCurrency(selectedPayment.ekstreBorcu)}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    Asgari: {formatCurrency(selectedPayment.asgariOdeme)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
