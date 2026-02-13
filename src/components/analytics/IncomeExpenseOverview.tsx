"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Flame,
  Smartphone,
  Droplets,
  Building2,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Badge } from "@/components/shared/Badge";
import { formatCurrency, cn } from "@/lib/utils";
import type { DetectedBill, DetectedSalary } from "@/hooks/useAccountInsights";

interface IncomeExpenseOverviewProps {
  maas: DetectedSalary | null;
  duzenliGiderler: DetectedBill[];
  toplamDuzenliGider: number;
  gelirGiderOzeti: {
    maas: number;
    duzenliGider: number;
    kartOdemeleri: number;
    kalan: number;
  };
}

/** Map bill names to icons */
function getBillIcon(ad: string) {
  if (ad.includes("Doğalgaz") || ad.includes("İGDAŞ"))
    return { icon: Flame, color: "text-orange-400", bg: "bg-orange-400/15" };
  if (ad.includes("Telekom"))
    return { icon: Smartphone, color: "text-blue-400", bg: "bg-blue-400/15" };
  if (ad.includes("Su") || ad.includes("İSKİ"))
    return { icon: Droplets, color: "text-cyan-400", bg: "bg-cyan-400/15" };
  if (ad.includes("Kira"))
    return { icon: Building2, color: "text-rose-400", bg: "bg-rose-400/15" };
  return { icon: Receipt, color: "text-text-muted", bg: "bg-surface-light" };
}

export function IncomeExpenseOverview({
  maas,
  duzenliGiderler,
  toplamDuzenliGider,
  gelirGiderOzeti,
}: IncomeExpenseOverviewProps) {
  const { maas: gelir, duzenliGider, kartOdemeleri, kalan } = gelirGiderOzeti;
  const toplamGider = duzenliGider + kartOdemeleri;
  const giderOrani = gelir > 0 ? Math.round((toplamGider / gelir) * 100) : 0;

  // Filter out kredi (credit card payments) from the displayed bills
  const faturalar = duzenliGiderler.filter((g) => g.kategori !== "kredi");

  return (
    <div className="space-y-4">
      {/* ===== Income vs Expense Summary ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={16} className="text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">
            Gelir & Gider Özeti
          </h3>
          <Badge variant="accent">Aylık</Badge>
        </div>

        {/* Income */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center">
              <TrendingUp size={16} className="text-success" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted">Maaş Geliri</p>
              <AmountDisplay
                amount={gelir}
                size="sm"
                className="text-success"
              />
            </div>
          </div>
        </div>

        {/* Divider with flow arrow */}
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-card-border" />
          <ArrowRight size={12} className="text-text-muted" />
          <div className="flex-1 h-px bg-card-border" />
        </div>

        {/* Expenses breakdown */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center">
                <Receipt size={16} className="text-warning" />
              </div>
              <p className="text-xs text-text-secondary">Düzenli Giderler</p>
            </div>
            <AmountDisplay
              amount={duzenliGider}
              size="sm"
              className="text-warning"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-danger/15 flex items-center justify-center">
                <CreditCard size={16} className="text-danger" />
              </div>
              <p className="text-xs text-text-secondary">
                Kart Ödemeleri{" "}
                <span className="text-[9px] text-text-muted">(asgari)</span>
              </p>
            </div>
            <AmountDisplay
              amount={kartOdemeleri}
              size="sm"
              className="text-danger"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-card-border pt-3 mb-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-primary font-semibold">
              Kalan Tutar
            </p>
            <AmountDisplay
              amount={kalan}
              size="md"
              className={cn(
                "font-bold",
                kalan > 10000 ? "text-success" : kalan > 5000 ? "text-warning" : "text-danger"
              )}
            />
          </div>
        </div>

        {/* Usage bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-text-muted">
              Gelir kullanım oranı
            </span>
            <span
              className={cn(
                "text-[10px] font-medium",
                giderOrani <= 60
                  ? "text-success"
                  : giderOrani <= 80
                  ? "text-warning"
                  : "text-danger"
              )}
            >
              %{giderOrani}
            </span>
          </div>
          <ProgressBar value={giderOrani} size="sm" variant="auto" />
        </div>
      </motion.div>

      {/* ===== Bill Detection ===== */}
      {faturalar.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-5 pb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} className="text-warning" />
                <h3 className="text-sm font-semibold text-text-primary">
                  Düzenli Ödemeler
                </h3>
              </div>
              <Badge variant="warning">
                {formatCurrency(toplamDuzenliGider, "TRY", false)}/ay
              </Badge>
            </div>
            <p className="text-[10px] text-text-muted mb-3">
              Hesap hareketlerinizden tespit edilen düzenli ödemeler
            </p>
          </div>

          <div className="divide-y divide-card-border">
            {faturalar.map((bill, idx) => {
              const { icon: Icon, color, bg } = getBillIcon(bill.ad);
              return (
                <motion.div
                  key={bill.ad}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                      bg
                    )}
                  >
                    <Icon size={16} className={color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary font-medium">
                      {bill.ad}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {bill.kategori === "kira" ? "Kira" : "Otomatik Ödeme"} •
                      Aylık
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <AmountDisplay
                      amount={bill.tutar}
                      size="xs"
                      className="text-text-primary font-semibold"
                    />
                    <p className="text-[9px] text-text-muted">/ay</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Total */}
          <div className="border-t border-card-border px-5 py-3 flex items-center justify-between bg-surface-light/20">
            <p className="text-xs text-text-secondary font-medium">
              Toplam Düzenli Gider
            </p>
            <AmountDisplay
              amount={toplamDuzenliGider}
              size="sm"
              className="text-warning font-bold"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
