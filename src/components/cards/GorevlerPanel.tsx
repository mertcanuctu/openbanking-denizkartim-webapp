"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Wallet,
  Gift,
  History,
  CheckCircle2,
  Clock,
  Circle,
} from "lucide-react";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Badge } from "@/components/shared/Badge";
import { calcPercentage, formatDateShort } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────
type GorevDurumu = "tamamlandi" | "devam" | "beklemede";

interface Gorev {
  id: string;
  baslik: string;
  aciklama: string;
  odul: string;
  durum: GorevDurumu;
  ilerleme?: { mevcut: number; hedef: number };
  ctaLabel?: string;
}

interface KazanimGecmisi {
  id: string;
  tarih: string;
  aciklama: string;
  kazanim: string;
  tip: "puan" | "cashback";
}

// ─── Level Config ──────────────────────────────────
const SEVIYELER = [
  { id: 0, ad: "Yeni Üye", minPuan: 0, maxPuan: 500 },
  { id: 1, ad: "Aktif Kullanıcı", minPuan: 500, maxPuan: 1500 },
  { id: 2, ad: "Finansal Usta", minPuan: 1500, maxPuan: 3000 },
  { id: 3, ad: "DenizKartım Pro", minPuan: 3000, maxPuan: 3000 },
] as const;

const MEVCUT_PUAN = 1250;
const MEVCUT_CASHBACK = 47.5;

// ─── Task Data ─────────────────────────────────────
const GOREVLER: Gorev[] = [
  {
    id: "ilk-kart",
    baslik: "İlk Kartını Ekle",
    aciklama: "DenizKartım'a ilk kartını ekleyerek başla",
    odul: "500 Puan",
    durum: "tamamlandi",
  },
  {
    id: "arkadasini-davet-et",
    baslik: "Arkadaşını Davet Et",
    aciklama:
      "Davet ettiğin arkadaşın kart eklediğinde ikiniz de bonus kazanırsınız",
    odul: "+250 Puan / davet",
    durum: "devam",
    ilerleme: { mevcut: 2, hedef: 5 },
    ctaLabel: "Davet Linki Kopyala",
  },
  {
    id: "ilk-odeme",
    baslik: "İlk Kart Ödemeni Yap",
    aciklama: "Uygulama üzerinden ilk kart ekstrenizi ödeyin",
    odul: "₺25 Cashback",
    durum: "beklemede",
    ctaLabel: "Ödeme Yap",
  },
  {
    id: "otomatik-odeme",
    baslik: "Otomatik Ödeme Kur",
    aciklama: "Herhangi bir kartın için otomatik ödeme talimatı verin",
    odul: "300 Puan + ₺10",
    durum: "beklemede",
    ctaLabel: "Otomatik Ödeme Ayarla",
  },
];

// ─── Activity History ───────────────────────────────
const KAZANIM_GECMISI: KazanimGecmisi[] = [
  {
    id: "1",
    tarih: "2026-02-15",
    aciklama: "İlk Kartını Ekle görevi tamamlandı",
    kazanim: "+500 Puan",
    tip: "puan",
  },
  {
    id: "2",
    tarih: "2026-02-12",
    aciklama: "Arkadaş daveti — Ahmet K.",
    kazanim: "+250 Puan",
    tip: "puan",
  },
  {
    id: "3",
    tarih: "2026-02-08",
    aciklama: "Arkadaş daveti — Selin T.",
    kazanim: "+250 Puan",
    tip: "puan",
  },
  {
    id: "4",
    tarih: "2026-01-28",
    aciklama: "Hoş geldin bonusu",
    kazanim: "+250 Puan",
    tip: "puan",
  },
  {
    id: "5",
    tarih: "2026-01-15",
    aciklama: "İlk giriş cashback ödülü",
    kazanim: "+₺47,50",
    tip: "cashback",
  },
];

// ─── Animation Variants ────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ─── Summary Cards ─────────────────────────────────
function SummaryCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Toplam Puanım */}
      <div className="relative glass-card p-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-accent/5" />
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center mb-2">
            <Star size={16} className="text-accent" />
          </div>
          <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">
            Toplam Puanım
          </p>
          <p className="text-text-primary text-lg font-bold tabular-nums">
            {MEVCUT_PUAN.toLocaleString("tr-TR")}
          </p>
          <p className="text-accent text-[10px] font-medium">Puan</p>
        </div>
      </div>

      {/* Toplam Cashback'im */}
      <div className="relative glass-card p-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-success/15 to-success/5" />
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-success/20 flex items-center justify-center mb-2">
            <Wallet size={16} className="text-success" />
          </div>
          <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">
            Cashback&apos;im
          </p>
          <p className="text-text-primary text-lg font-bold tabular-nums">
            ₺
            {MEVCUT_CASHBACK.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-success text-[10px] font-medium">Kazanıldı</p>
        </div>
      </div>
    </div>
  );
}

// ─── Level Widget ──────────────────────────────────
function LevelWidget() {
  const mevcutSeviye =
    [...SEVIYELER].reverse().find((s) => MEVCUT_PUAN >= s.minPuan) ??
    SEVIYELER[0];
  const sonrakiSeviye =
    mevcutSeviye.id < SEVIYELER.length - 1
      ? SEVIYELER[mevcutSeviye.id + 1]
      : null;

  const ilerlemeYuzdesi = sonrakiSeviye
    ? calcPercentage(
        MEVCUT_PUAN - mevcutSeviye.minPuan,
        sonrakiSeviye.minPuan - mevcutSeviye.minPuan
      )
    : 100;

  const kalanPuan = sonrakiSeviye ? sonrakiSeviye.minPuan - MEVCUT_PUAN : 0;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={18} className="text-warning" />
        <h2 className="text-base font-bold text-text-primary">Seviyem</h2>
      </div>

      {/* Level name + next */}
      <div className="flex items-center justify-between mb-1">
        <Badge variant="warning">{mevcutSeviye.ad}</Badge>
        {sonrakiSeviye && (
          <span className="text-text-muted text-[10px]">
            Sıradaki: {sonrakiSeviye.ad}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={ilerlemeYuzdesi}
        size="md"
        variant="accent"
        animate
        className="my-3"
      />

      {/* Points info */}
      <div className="flex justify-between text-xs">
        <span className="text-text-muted">
          {MEVCUT_PUAN.toLocaleString("tr-TR")} Puan
        </span>
        {sonrakiSeviye ? (
          <span className="text-accent font-medium">
            {kalanPuan.toLocaleString("tr-TR")} puan kaldı
          </span>
        ) : (
          <Badge variant="success">Maksimum Seviye</Badge>
        )}
      </div>

      {/* Level milestones */}
      <div className="flex justify-between mt-3 pt-3 border-t border-card-border">
        {SEVIYELER.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                MEVCUT_PUAN >= s.minPuan ? "bg-accent" : "bg-surface-light"
              }`}
            />
            <span
              className={`text-[9px] ${
                MEVCUT_PUAN >= s.minPuan ? "text-accent" : "text-text-muted"
              }`}
            >
              {s.id === 0
                ? "Yeni"
                : s.id === 3
                  ? "Pro"
                  : s.id === 1
                    ? "Aktif"
                    : "Usta"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Task Card ─────────────────────────────────────
function GorevKarti({
  gorev,
  highlighted,
}: {
  gorev: Gorev;
  highlighted?: boolean;
}) {
  const tamamlandi = gorev.durum === "tamamlandi";
  const devam = gorev.durum === "devam";

  return (
    <div
      className={`glass-card p-4 transition-all duration-500 ${tamamlandi ? "opacity-80" : ""} ${
        highlighted
          ? "ring-2 ring-accent/60 shadow-glow-sm bg-accent/5"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div
          className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
            tamamlandi
              ? "bg-success/15"
              : devam
                ? "bg-accent/15"
                : "bg-warning/10"
          }`}
        >
          {tamamlandi ? (
            <CheckCircle2 size={18} className="text-success" />
          ) : devam ? (
            <Clock size={18} className="text-accent" />
          ) : (
            <Circle size={18} className="text-warning" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <p className="text-text-primary text-sm font-semibold leading-snug">
              {gorev.baslik}
            </p>
            <Badge
              variant={
                tamamlandi ? "success" : devam ? "accent" : "warning"
              }
            >
              {gorev.odul}
            </Badge>
          </div>
          <p className="text-text-muted text-xs mb-2 leading-relaxed">
            {gorev.aciklama}
          </p>

          {/* Progress bar for active tasks */}
          {devam && gorev.ilerleme && (
            <div className="mb-3">
              <ProgressBar
                value={calcPercentage(
                  gorev.ilerleme.mevcut,
                  gorev.ilerleme.hedef
                )}
                size="sm"
                variant="accent"
                animate
              />
              <p className="text-text-muted text-[10px] mt-1">
                {gorev.ilerleme.mevcut}/{gorev.ilerleme.hedef} davet
                tamamlandı
              </p>
            </div>
          )}

          {/* CTA button */}
          {!tamamlandi && gorev.ctaLabel && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              className={`mt-1 px-3 py-1.5 rounded-lg text-xs font-medium press-effect ${
                devam
                  ? "bg-accent/15 border border-accent/30 text-accent"
                  : "bg-warning/15 border border-warning/30 text-warning"
              }`}
            >
              {gorev.ctaLabel}
            </motion.button>
          )}

          {/* Completed indicator */}
          {tamamlandi && (
            <span className="text-success text-[10px] font-medium">
              Tamamlandı
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Activity History Item ─────────────────────────
function KazanimGecmisiItem({ item }: { item: KazanimGecmisi }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border border-card-border">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          item.tip === "puan" ? "bg-accent/10" : "bg-success/10"
        }`}
      >
        {item.tip === "puan" ? (
          <Star size={14} className="text-accent" />
        ) : (
          <Wallet size={14} className="text-success" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-xs font-medium truncate">
          {item.aciklama}
        </p>
        <p className="text-text-muted text-[10px]">
          {formatDateShort(item.tarih)}
        </p>
      </div>
      <span
        className={`text-xs font-semibold tabular-nums shrink-0 ${
          item.tip === "puan" ? "text-accent" : "text-success"
        }`}
      >
        {item.kazanim}
      </span>
    </div>
  );
}

// ─── Main Export ────────────────────────────────────
export function GorevlerPanel({
  highlightGorevId,
}: {
  highlightGorevId?: string;
} = {}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 pb-6"
    >
      {/* Summary cards */}
      <motion.div variants={itemVariants}>
        <SummaryCards />
      </motion.div>

      {/* Level widget */}
      <motion.div variants={itemVariants}>
        <LevelWidget />
      </motion.div>

      {/* Tasks section */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-3">
          <Gift size={18} className="text-accent" />
          <h2 className="text-lg font-bold text-text-primary">Bonus Kazan</h2>
        </div>
        <div className="space-y-3">
          {GOREVLER.map((gorev) => (
            <motion.div key={gorev.id} variants={itemVariants}>
              <GorevKarti
                gorev={gorev}
                highlighted={gorev.id === highlightGorevId}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity history */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-3">
          <History size={18} className="text-accent" />
          <h2 className="text-lg font-bold text-text-primary">
            Kazanım Geçmişi
          </h2>
        </div>
        <div className="space-y-2">
          {KAZANIM_GECMISI.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <KazanimGecmisiItem item={item} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
