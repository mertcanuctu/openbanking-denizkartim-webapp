"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  CreditCard,
  Landmark,
  Star,
  Layers,
  Banknote,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { CardVisual } from "@/components/cards/CardVisual";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { kartlar, hesaplar, bakiyeler, userData, getBankaMeta } from "@/lib/data";
import {
  formatCurrency,
  getLastFourDigits,
  parseAmount,
  absAmount,
  calcPercentage,
  formatDateShort,
} from "@/lib/utils";
import type { Kart } from "@/lib/types";

type FilterTab = "tumu" | "kredi" | "banka";

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "tumu", label: "Tümü" },
  { id: "kredi", label: "Kredi Kartları" },
  { id: "banka", label: "Banka Kartları" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
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

// ─── Card List Item ───────────────────────────────────
interface CardListItemProps {
  kart: Kart;
  /** Child virtual cards to show nested */
  virtualCards?: Kart[];
}

function CardListItem({ kart, virtualCards }: CardListItemProps) {
  const detay = userData.kartDetaylari[kart.kartRef]?.TRY;
  const isCredit = kart.kartTipi === "K";

  const kalanBorc = detay ? absAmount(detay.kalanEkstreBorcu) : 0;
  const limit = detay ? parseAmount(detay.toplamLimit) : 0;
  const kullanilabilir = detay ? parseAmount(detay.kullanilabilirLimit) : 0;
  const kullanimOrani = limit > 0 ? calcPercentage(limit - kullanilabilir, limit) : 0;
  const taksitYuku = detay ? absAmount(detay.kalanToplamTaksitTutari) : 0;
  const sonOdeme = detay?.sonOdemeTarihi;

  // Points
  const puanlar = detay?.puanBilgisi || [];

  return (
    <div>
      <Link href={`/kartlarim/${kart.kartRef}`}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="glass-card p-4 press-effect group"
        >
          <div className="flex gap-4">
            {/* Mini card visual */}
            <div className="shrink-0">
              <CardVisual
                kartUrunAdi={kart.kartUrunAdi}
                kartNo={kart.kartNo}
                kartSema={kart.kartSema}
                bankaAdi={getBankaMeta(kart.hhsKod)?.bankaAdi}
                size="sm"
                tiltEnabled={false}
              />
            </div>

            {/* Card info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-text-primary font-semibold text-sm truncate">
                    {kart.kartUrunAdi}
                  </p>
                  <ChevronRight
                    size={14}
                    className="text-text-muted shrink-0 group-hover:text-accent transition-colors"
                  />
                </div>
                <p className="text-text-muted text-xs font-mono">
                  •••• {getLastFourDigits(kart.kartNo)}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                <Badge variant={kart.kartSema === "VISA" ? "accent" : kart.kartSema === "MC" ? "danger" : "muted"}>
                  {kart.kartSema}
                </Badge>
                {isCredit && kalanBorc > 0 && sonOdeme && (
                  <Badge variant="warning">
                    {formatDateShort(sonOdeme)}
                  </Badge>
                )}
                {taksitYuku > 0 && (
                  <Badge variant="muted">
                    <Layers size={8} className="mr-0.5" />
                    Taksit
                  </Badge>
                )}
                {puanlar.map((p) => (
                  <Badge key={p.puanTipi} variant="success">
                    <Star size={8} className="mr-0.5" />
                    {parseFloat(p.puanDegeri).toLocaleString("tr-TR")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Credit card balance info */}
          {isCredit && detay && (
            <div className="mt-3 pt-3 border-t border-card-border">
              <div className="flex justify-between items-center text-xs mb-2">
                <div>
                  <span className="text-text-muted">Kalan Borç: </span>
                  <span className="text-text-primary font-semibold">
                    {formatCurrency(kalanBorc)}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Kul. Limit: </span>
                  <span className="text-success font-medium">
                    {formatCurrency(kullanilabilir)}
                  </span>
                </div>
              </div>
              <ProgressBar
                value={kullanimOrani}
                size="sm"
                variant="auto"
                animate={false}
              />
            </div>
          )}
        </motion.div>
      </Link>

      {/* Virtual cards nested under parent */}
      {virtualCards && virtualCards.length > 0 && (
        <div className="ml-6 mt-1.5 space-y-1.5">
          {virtualCards.map((child) => (
            <Link key={child.kartRef} href={`/kartlarim/${child.kartRef}`}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border border-card-border press-effect group"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CreditCard size={14} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-text-primary text-sm font-medium truncate">
                      {child.kartUrunAdi}
                    </p>
                    <Badge variant="accent">Sanal</Badge>
                  </div>
                  <p className="text-text-muted text-[10px] font-mono">
                    •••• {getLastFourDigits(child.kartNo)}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-text-muted shrink-0 group-hover:text-accent transition-colors"
                />
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Account Item ────────────────────────────────────
interface AccountItemProps {
  hspUrunAdi: string;
  kisaAd: string | null;
  bakiye: number;
  prBrm: string;
  hspTip: string;
}

function AccountItem({
  hspUrunAdi,
  kisaAd,
  bakiye,
  prBrm,
  hspTip,
}: AccountItemProps) {
  const isNegative = bakiye < 0;
  const isUSD = prBrm === "USD";
  const isKMH = hspTip === "KREDILI";
  const isKrediKarti = hspTip === "KREDI_KARTI";

  const iconBg = isKrediKarti
    ? "bg-accent/10"
    : isKMH
      ? "bg-danger/10"
      : isUSD
        ? "bg-purple-400/10"
        : "bg-success/10";
  const IconComponent = isKrediKarti
    ? CreditCard
    : isKMH
      ? AlertTriangle
      : isUSD
        ? DollarSign
        : Banknote;
  const iconColor = isKrediKarti
    ? "text-accent"
    : isKMH
      ? "text-danger"
      : isUSD
        ? "text-purple-400"
        : "text-success";

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-surface/50 border border-card-border"
    >
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
      >
        <IconComponent size={18} className={iconColor} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-medium truncate">
          {kisaAd || hspUrunAdi}
        </p>
        <p className="text-text-muted text-[10px]">{hspUrunAdi}</p>
      </div>

      <AmountDisplay
        amount={bakiye}
        currency={prBrm}
        size="sm"
        colorize={isNegative}
        className={
          isNegative
            ? "text-danger"
            : isUSD
              ? "text-purple-300"
              : "text-success"
        }
      />
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────
export default function KartlarimPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("tumu");

  // Build card groups: physical cards with their virtual children
  const cardGroups = useMemo(() => {
    // Separate physical and virtual cards
    const physicalCards = kartlar.filter((k) => k.altKartTipi === "A");
    const virtualCards = kartlar.filter((k) => k.altKartTipi === "S");

    return physicalCards.map((parent) => ({
      parent,
      children: virtualCards.filter(
        (vc) => vc.asilKartNo === parent.kartNo
      ),
    }));
  }, []);

  // Filter based on active tab
  const filteredGroups = useMemo(() => {
    switch (activeFilter) {
      case "kredi":
        return cardGroups.filter((g) => g.parent.kartTipi === "K");
      case "banka":
        return cardGroups.filter((g) => g.parent.kartTipi === "B");
      default:
        return cardGroups;
    }
  }, [activeFilter, cardGroups]);

  // Account data
  const accounts = useMemo(() => {
    return hesaplar.map((hesap) => {
      const bakiye = bakiyeler.find((b) => b.hspRef === hesap.hspRef);
      return {
        ...hesap,
        bakiye: bakiye ? parseAmount(bakiye.bkyTtr) : 0,
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-navy">
      <TopBar userName="Mert" />

      <div className="px-5">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4"
        >
          <CreditCard size={22} className="text-accent" />
          <h1 className="text-xl font-bold text-text-primary">Kartlarım</h1>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {filterTabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeFilter === tab.id
                  ? "bg-accent text-white shadow-glow-sm"
                  : "bg-card border border-card-border text-text-secondary"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Card list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <AnimatePresence mode="wait">
            {filteredGroups.map((group) => (
              <motion.div
                key={group.parent.kartRef}
                variants={itemVariants}
                layout
              >
                <CardListItem
                  kart={group.parent}
                  virtualCards={group.children}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ─── Hesaplarım Section ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Landmark size={18} className="text-accent" />
            <h2 className="text-lg font-bold text-text-primary">Hesaplarım</h2>
          </div>

          <div className="space-y-2.5">
            {accounts.map((account) => (
              <AccountItem
                key={account.hspRef}
                hspUrunAdi={account.hspUrunAdi}
                kisaAd={account.kisaAd}
                bakiye={account.bakiye}
                prBrm={account.prBrm}
                hspTip={account.hspTip}
              />
            ))}
          </div>

          {/* Total balance summary */}
          <div className="mt-3 p-4 rounded-xl bg-card border border-card-border">
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-xs">
                Toplam TRY Bakiye
              </span>
              <AmountDisplay
                amount={accounts
                  .filter((a) => a.prBrm === "TRY")
                  .reduce((sum, a) => sum + a.bakiye, 0)}
                size="sm"
                colorize
                className="font-bold"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
