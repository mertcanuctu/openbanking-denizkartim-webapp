"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, ChevronRight } from "lucide-react";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Badge } from "@/components/shared/Badge";
import { formatDateShort, formatRemainingDays } from "@/lib/utils";
import type { YaklasanOdeme } from "@/lib/types";

interface UpcomingPaymentsProps {
  payments: YaklasanOdeme[];
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  if (payments.length === 0) return null;

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
            <CalendarClock size={16} className="text-accent" />
          </div>
          <p className="text-text-primary font-semibold text-sm">
            Yaklaşan Ödemeler
          </p>
        </div>
        <Link href="/odemeler" className="text-accent text-xs font-medium">
          Tümünü Gör
        </Link>
      </div>

      {/* Payment list */}
      <div className="space-y-2.5">
        {payments.map((payment, index) => {
          const remaining = formatRemainingDays(payment.sonOdemeTarihi);
          const urgencyVariant =
            remaining.urgency === "danger"
              ? "danger"
              : remaining.urgency === "warning"
                ? "warning"
                : "muted";

          return (
            <motion.div
              key={payment.kartRef}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link
                href={`/kartlarim/${payment.kartRef}`}
                className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-card-border press-effect group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-text-primary text-sm font-medium truncate">
                      {payment.kartAdi}
                    </p>
                    <Badge variant={urgencyVariant} dot>
                      {remaining.text}
                    </Badge>
                  </div>
                  <p className="text-text-muted text-xs">
                    Son Ödeme: {formatDateShort(payment.sonOdemeTarihi)}
                    {" · "}
                    <span className="text-text-secondary">
                      Asgari:{" "}
                      {payment.asgariOdeme.toLocaleString("tr-TR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}{" "}
                      ₺
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 ml-3">
                  <AmountDisplay
                    amount={payment.ekstreBorcu}
                    size="sm"
                    className="text-text-primary"
                  />
                  <ChevronRight
                    size={14}
                    className="text-text-muted group-hover:text-accent transition-colors"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
