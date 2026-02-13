"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  RotateCw,
  CreditCard,
  Calendar,
  AlertTriangle,
  DollarSign,
  Bell,
  Sparkles,
} from "lucide-react";
import { cn, formatCurrency, formatDateShort } from "@/lib/utils";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Badge } from "@/components/shared/Badge";
import type { Abonelik, AbonelikOzeti } from "@/lib/types";

interface SubscriptionManagerProps {
  ozet: AbonelikOzeti;
}

/** Icon mapping for known subscriptions */
const SUBSCRIPTION_ICONS: Record<string, string> = {
  NETFLIX: "🎬",
  SPOTIFY: "🎵",
  "YOUTUBE PREMIUM": "▶️",
  "APPLE.COM/BILL": "🍎",
  "ICLOUD STORAGE": "☁️",
  "GOOGLE ONE": "🔵",
  "AMAZON PRIME": "📦",
  "ADOBE CC": "🎨",
  "DUOLINGO PLUS": "🦉",
  CHATGPT: "🤖",
  GITHUB: "🐱",
  MIDJOURNEY: "🎭",
};

function getSubscriptionIcon(name: string): string {
  const upper = name.toUpperCase();
  for (const [key, icon] of Object.entries(SUBSCRIPTION_ICONS)) {
    if (upper.includes(key)) return icon;
  }
  return "📱";
}

export function SubscriptionManager({ ozet }: SubscriptionManagerProps) {
  const { abonelikler, toplamTRY, toplamUSD, toplamAdet } = ozet;

  const tryAbonelikler = useMemo(
    () => abonelikler.filter((a) => a.paraBirimi === "TRY"),
    [abonelikler]
  );
  const usdAbonelikler = useMemo(
    () => abonelikler.filter((a) => a.paraBirimi === "USD"),
    [abonelikler]
  );

  const yillikTRY = toplamTRY * 12;
  const yillikUSD = toplamUSD * 12;

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <RotateCw size={16} className="text-accent" />
          <h3 className="text-sm font-medium text-text-primary">
            Abonelik Özeti
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-text-muted mb-0.5">Aktif Abonelik</p>
            <p className="text-2xl font-bold text-text-primary">{toplamAdet}</p>
          </div>
          <div>
            <p className="text-[11px] text-text-muted mb-0.5">Aylık Toplam</p>
            <div>
              <AmountDisplay amount={toplamTRY} size="sm" className="text-accent block" />
              {toplamUSD > 0 && (
                <AmountDisplay
                  amount={toplamUSD}
                  currency="USD"
                  size="xs"
                  className="text-text-muted block mt-0.5"
                />
              )}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-text-muted mb-0.5">Yıllık Tahmini</p>
            <div>
              <AmountDisplay amount={yillikTRY} size="sm" className="text-warning block" />
              {yillikUSD > 0 && (
                <AmountDisplay
                  amount={yillikUSD}
                  currency="USD"
                  size="xs"
                  className="text-text-muted block mt-0.5"
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insight card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 gradient-border rounded-2xl"
      >
        <div className="flex items-start gap-2.5">
          <Sparkles size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-text-primary mb-1">
              Akıllı Öneri
            </p>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              iCloud Storage + Google One: İkisi de bulut depolama servisi.
              Birini iptal ederek ayda 80-130 ₺ tasarruf edebilirsiniz.
            </p>
          </div>
        </div>
      </motion.div>

      {/* TRY subscriptions */}
      {tryAbonelikler.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1.5">
            <span>🇹🇷</span> TRY Abonelikler ({tryAbonelikler.length})
          </h4>
          <div className="space-y-2">
            {tryAbonelikler.map((a, idx) => (
              <SubscriptionCard key={`try-${idx}`} abonelik={a} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* USD subscriptions */}
      {usdAbonelikler.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1.5">
            <DollarSign size={12} /> USD Abonelikler ({usdAbonelikler.length})
          </h4>
          <div className="space-y-2">
            {usdAbonelikler.map((a, idx) => (
              <SubscriptionCard
                key={`usd-${idx}`}
                abonelik={a}
                index={idx + tryAbonelikler.length}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Individual subscription card */
function SubscriptionCard({
  abonelik,
  index,
}: {
  abonelik: Abonelik;
  index: number;
}) {
  const icon = getSubscriptionIcon(abonelik.ad);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass-card p-3.5 flex items-center gap-3"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-surface-light/50 flex items-center justify-center text-lg">
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {abonelik.ad}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Badge variant="muted" className="text-[9px]">
            {abonelik.kartAdi}
          </Badge>
          <span className="text-[10px] text-text-muted">
            {abonelik.kategori}
          </span>
        </div>
        <p className="text-[10px] text-text-muted mt-0.5">
          Son: {formatDateShort(abonelik.sonIslemTarihi)}
        </p>
      </div>

      {/* Amount + actions */}
      <div className="flex-shrink-0 text-right">
        <AmountDisplay
          amount={abonelik.tutar}
          currency={abonelik.paraBirimi}
          size="sm"
          className="text-text-primary"
        />
        <p className="text-[10px] text-text-muted">/ay</p>
      </div>
    </motion.div>
  );
}
