"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  CreditCard,
  Receipt,
  CalendarClock,
  FileText,
  Star,
  Wallet,
  Shield,
  TrendingDown,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { CardVisual } from "@/components/cards/CardVisual";
import { TransactionList } from "@/components/cards/TransactionList";
import { InstallmentProjection } from "@/components/analytics/InstallmentProjection";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import {
  getKart,
  getKartDetaylari,
  getKartDetayTRY,
  getKartDetayUSD,
  getBankaMeta,
} from "@/lib/data";
import { useTransactions, getAllTransactions } from "@/hooks/useTransactions";
import {
  formatDate,
  formatDateShort,
  formatCurrency,
  calcPercentage,
  cn,
} from "@/lib/utils";
import { TURKISH_MONTHS } from "@/lib/constants";
import type { TransactionFilters } from "@/lib/types";

type TabId = "hareketler" | "taksitler" | "ekstre";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "hareketler", label: "Hareketler", icon: Receipt },
  { id: "taksitler", label: "Taksitler", icon: CalendarClock },
  { id: "ekstre", label: "Ekstre", icon: FileText },
];

export default function KartDetayPage({
  params,
}: {
  params: { kartRef: string };
}) {
  const { kartRef } = params;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("hareketler");
  const [txFilter, setTxFilter] = useState<"tumu" | "B" | "A" | "taksitli">("tumu");

  // Load card data
  const kart = getKart(kartRef);
  const detayTRY = getKartDetayTRY(kartRef);
  const detayUSD = getKartDetayUSD(kartRef);

  // Transactions for this card
  const filters: TransactionFilters = useMemo(
    () => ({
      kartRef,
      tip: txFilter,
    }),
    [kartRef, txFilter]
  );
  const { grouped, toplamHarcama, toplamIslem } = useTransactions(filters);

  // All installment transactions for this card
  const installmentTransactions = useMemo(() => {
    return getAllTransactions(kartRef, "TRY").filter(
      (t) => t.isTaksitli && t.borcAlacak === "B"
    );
  }, [kartRef]);

  // --- Scroll-based card parallax (must be before early return) ---
  const scrollY = useMotionValue(0);
  const cardScale = useTransform(scrollY, [0, 200], [1, 0.75]);
  const cardOpacity = useTransform(scrollY, [0, 250], [1, 0.6]);

  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  // Card not found
  if (!kart) {
    return (
      <div className="min-h-screen bg-gradient-navy">
        <TopBar userName="Mert" />
        <div className="px-5 pt-8 text-center">
          <CreditCard size={48} className="text-text-muted mx-auto mb-3 opacity-40" />
          <p className="text-text-muted">Kart bulunamadı</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-accent text-sm font-medium"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const isCredit = kart.kartTipi === "K";
  const isVirtual = kart.altKartTipi === "S";

  // Parse TRY card detail values
  const ekstreBorcu = detayTRY ? Math.abs(parseFloat(detayTRY.kalanEkstreBorcu)) : 0;
  const toplamLimit = detayTRY ? parseFloat(detayTRY.toplamLimit) : 0;
  const kullanilabilirLimit = detayTRY ? parseFloat(detayTRY.kullanilabilirLimit) : 0;
  const asgariOdeme = detayTRY ? Math.abs(parseFloat(detayTRY.kalanAsgariOdemeTutari)) : 0;
  const sonOdemeTarihi = detayTRY?.sonOdemeTarihi || "";
  const hesapKesimTarihi = detayTRY?.hesapKesimTarihi || "";
  const limitKullanim = toplamLimit > 0 ? calcPercentage(toplamLimit - kullanilabilirLimit, toplamLimit) : 0;
  const puanBilgisi = detayTRY?.puanBilgisi || [];
  const donemTaksitTutarBilgisi = detayTRY?.donemTaksitTutarBilgisi || [];
  const kalanToplamTaksitTutari = detayTRY?.kalanToplamTaksitTutari || "0";

  return (
    <div className="min-h-screen bg-gradient-navy">
      {/* Back button + TopBar area */}
      <div className="relative">
        <div className="absolute top-0 left-0 z-20 pt-[env(safe-area-inset-top)] px-2">
          <button
            onClick={() => router.back()}
            aria-label="Kartlarım sayfasına geri dön"
            className="flex items-center gap-1 py-3 px-2 text-text-secondary hover:text-text-primary transition-colors press-effect min-h-[44px]"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Kartlarım</span>
          </button>
        </div>
      </div>

      {/* Card visual + info section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-14 px-5"
      >
        {/* Card Visual (centered, shrinks on scroll) */}
        <motion.div
          style={{ scale: cardScale, opacity: cardOpacity }}
          className="flex justify-center mb-5 origin-top"
        >
          <CardVisual
            kartUrunAdi={kart.kartUrunAdi}
            kartNo={kart.kartNo}
            kartSema={kart.kartSema}
            bankaAdi={getBankaMeta(kart.hhsKod)?.bankaAdi}
            isVirtual={isVirtual}
            size="lg"
            tiltEnabled
          />
        </motion.div>

        {/* Card name + badges */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-lg font-bold text-text-primary">
            {kart.kartUrunAdi}
          </h1>
          {isVirtual && <Badge variant="accent">Sanal</Badge>}
          {isCredit && <Badge variant="muted">Kredi</Badge>}
        </div>

        {/* Info grid — only for credit cards */}
        {isCredit && detayTRY && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-3 mb-3">
              <InfoCard
                icon={<TrendingDown size={14} className="text-danger" />}
                label="Ekstre Borcu"
                value={<AmountDisplay amount={ekstreBorcu} size="sm" className="text-text-primary" />}
              />
              <InfoCard
                icon={<Wallet size={14} className="text-success" />}
                label="Kullanılabilir Limit"
                value={<AmountDisplay amount={kullanilabilirLimit} size="sm" className="text-success" />}
              />
              <InfoCard
                icon={<Shield size={14} className="text-accent" />}
                label="Toplam Limit"
                value={<AmountDisplay amount={toplamLimit} size="sm" className="text-text-primary" />}
              />
              <InfoCard
                icon={<CalendarClock size={14} className="text-warning" />}
                label="Son Ödeme"
                value={
                  <span className="text-sm font-semibold text-warning">
                    {sonOdemeTarihi ? formatDateShort(sonOdemeTarihi) : "—"}
                  </span>
                }
              />
            </div>

            {/* Limit usage bar */}
            <div className="glass-card p-3 mb-3">
              <ProgressBar
                value={limitKullanim}
                variant="auto"
                showLabel
                size="sm"
              />
            </div>

            {/* Points section */}
            {puanBilgisi.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <Star size={14} className="text-warning" />
                {puanBilgisi.map((p, i) => (
                  <Badge key={i} variant="warning">
                    {parseInt(p.puanDegeri).toLocaleString("tr-TR")} {p.puanTipi}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Sticky Tab bar */}
      {isCredit && (
        <>
          <div className="sticky top-0 z-30 bg-navy/90 backdrop-blur-md border-b border-card-border">
            <div className="flex px-5">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all duration-200 border-b-2",
                      isActive
                        ? "text-accent border-accent"
                        : "text-text-muted border-transparent hover:text-text-secondary"
                    )}
                  >
                    <TabIcon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div className="px-5 pt-4 pb-nav">
            <AnimatePresence mode="wait">
              {activeTab === "hareketler" && (
                <motion.div
                  key="hareketler"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <HareketlerTab
                    grouped={grouped}
                    txFilter={txFilter}
                    onFilterChange={setTxFilter}
                    toplamHarcama={toplamHarcama}
                    toplamIslem={toplamIslem}
                  />
                </motion.div>
              )}
              {activeTab === "taksitler" && (
                <motion.div
                  key="taksitler"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <TaksitlerTab
                    donemTaksitTutarBilgisi={donemTaksitTutarBilgisi}
                    installmentTransactions={installmentTransactions}
                    kalanToplamTaksitTutari={kalanToplamTaksitTutari}
                  />
                </motion.div>
              )}
              {activeTab === "ekstre" && (
                <motion.div
                  key="ekstre"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <EkstreTab
                    ekstreBorcu={ekstreBorcu}
                    asgariOdeme={asgariOdeme}
                    hesapKesimTarihi={hesapKesimTarihi}
                    sonOdemeTarihi={sonOdemeTarihi}
                    toplamLimit={toplamLimit}
                    kullanilabilirLimit={kullanilabilirLimit}
                    detayUSD={detayUSD}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Bank card — no tabs, just basic info */}
      {!isCredit && (
        <div className="px-5 pt-4 pb-nav">
          <div className="glass-card p-5 text-center">
            <p className="text-text-muted text-sm">
              Banka kartı detay bilgileri
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================
// Sub-components
// ===========================

/** Small info card used in the 2x2 grid */
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="glass-card p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-[11px] text-text-muted">{label}</span>
      </div>
      {value}
    </div>
  );
}

// --- Hareketler Tab ---
function HareketlerTab({
  grouped,
  txFilter,
  onFilterChange,
  toplamHarcama,
  toplamIslem,
}: {
  grouped: ReturnType<typeof useTransactions>["grouped"];
  txFilter: "tumu" | "B" | "A" | "taksitli";
  onFilterChange: (f: "tumu" | "B" | "A" | "taksitli") => void;
  toplamHarcama: number;
  toplamIslem: number;
}) {
  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-3 mb-4">
        <div className="glass-card flex-1 p-3">
          <p className="text-[11px] text-text-muted mb-0.5">Toplam Harcama</p>
          <AmountDisplay amount={toplamHarcama} size="sm" className="text-text-primary" />
        </div>
        <div className="glass-card flex-1 p-3">
          <p className="text-[11px] text-text-muted mb-0.5">İşlem Sayısı</p>
          <p className="text-sm font-semibold text-text-primary">{toplamIslem}</p>
        </div>
      </div>

      {/* Transaction list */}
      <TransactionList
        grouped={grouped}
        showFilters
        activeFilter={txFilter}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}

// --- Taksitler Tab ---
function TaksitlerTab({
  donemTaksitTutarBilgisi,
  installmentTransactions,
  kalanToplamTaksitTutari,
}: {
  donemTaksitTutarBilgisi: import("@/lib/types").DonemTaksitBilgisi[];
  installmentTransactions: import("@/lib/types").EnrichedTransaction[];
  kalanToplamTaksitTutari: string;
}) {
  return (
    <InstallmentProjection
      donemTaksitTutarBilgisi={donemTaksitTutarBilgisi}
      installmentTransactions={installmentTransactions}
      kalanToplamTaksitTutari={kalanToplamTaksitTutari}
    />
  );
}

// --- Ekstre Tab ---
function EkstreTab({
  ekstreBorcu,
  asgariOdeme,
  hesapKesimTarihi,
  sonOdemeTarihi,
  toplamLimit,
  kullanilabilirLimit,
  detayUSD,
}: {
  ekstreBorcu: number;
  asgariOdeme: number;
  hesapKesimTarihi: string;
  sonOdemeTarihi: string;
  toplamLimit: number;
  kullanilabilirLimit: number;
  detayUSD?: import("@/lib/types").KartDetay;
}) {
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  // Generate period options (current and past 2 months)
  const periods = useMemo(() => {
    const now = new Date();
    return [0, 1, 2].map((offset) => {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      return {
        label: `${TURKISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
        value: offset,
      };
    });
  }, []);

  // USD section
  const usdEkstreBorcu = detayUSD
    ? Math.abs(parseFloat(detayUSD.kalanEkstreBorcu))
    : 0;
  const usdAsgari = detayUSD
    ? Math.abs(parseFloat(detayUSD.kalanAsgariOdemeTutari))
    : 0;

  return (
    <div className="space-y-4">
      {/* Period selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setSelectedPeriod(p.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
              selectedPeriod === p.value
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-surface-light/50 text-text-muted border border-transparent hover:bg-surface-light"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Statement summary — TRY */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-medium text-text-primary mb-4">
          Ekstre Özeti — TRY
        </h3>

        <div className="space-y-3">
          <SummaryRow
            label="Ekstre Borcu"
            value={<AmountDisplay amount={ekstreBorcu} size="sm" className="text-text-primary" />}
          />
          <SummaryRow
            label="Asgari Ödeme Tutarı"
            value={<AmountDisplay amount={asgariOdeme} size="sm" className="text-warning" />}
          />
          <div className="border-t border-card-border my-2" />
          <SummaryRow
            label="Hesap Kesim Tarihi"
            value={
              <span className="text-sm text-text-secondary">
                {hesapKesimTarihi ? formatDate(hesapKesimTarihi) : "—"}
              </span>
            }
          />
          <SummaryRow
            label="Son Ödeme Tarihi"
            value={
              <span className="text-sm font-medium text-warning">
                {sonOdemeTarihi ? formatDate(sonOdemeTarihi) : "—"}
              </span>
            }
          />
          <div className="border-t border-card-border my-2" />
          <SummaryRow
            label="Toplam Limit"
            value={<AmountDisplay amount={toplamLimit} size="sm" className="text-text-secondary" />}
          />
          <SummaryRow
            label="Kullanılabilir Limit"
            value={<AmountDisplay amount={kullanilabilirLimit} size="sm" className="text-success" />}
          />
        </div>
      </motion.div>

      {/* USD statement summary (if exists) */}
      {detayUSD && (usdEkstreBorcu > 0 || usdAsgari > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-medium text-text-primary mb-4">
            Ekstre Özeti — USD
          </h3>
          <div className="space-y-3">
            <SummaryRow
              label="Ekstre Borcu"
              value={
                <AmountDisplay
                  amount={usdEkstreBorcu}
                  currency="USD"
                  size="sm"
                  className="text-text-primary"
                />
              }
            />
            <SummaryRow
              label="Asgari Ödeme"
              value={
                <AmountDisplay
                  amount={usdAsgari}
                  currency="USD"
                  size="sm"
                  className="text-warning"
                />
              }
            />
            <SummaryRow
              label="Toplam Limit"
              value={
                <AmountDisplay
                  amount={parseFloat(detayUSD.toplamLimit)}
                  currency="USD"
                  size="sm"
                  className="text-text-secondary"
                />
              }
            />
            <SummaryRow
              label="Kullanılabilir Limit"
              value={
                <AmountDisplay
                  amount={parseFloat(detayUSD.kullanilabilirLimit)}
                  currency="USD"
                  size="sm"
                  className="text-success"
                />
              }
            />
          </div>
        </motion.div>
      )}

      {/* Pay debt button */}
      {ekstreBorcu > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-xl bg-accent text-white font-semibold text-sm transition-all duration-200 hover:bg-accent/90 active:bg-accent/80"
        >
          Borç Öde — {formatCurrency(ekstreBorcu)}
        </motion.button>
      )}

      {/* Info note */}
      {ekstreBorcu > 0 && (
        <div className="text-center">
          <p className="text-[11px] text-success">
            Tam ödeme yaparsanız 0 ₺ faiz ödersiniz
          </p>
        </div>
      )}
    </div>
  );
}

/** Row for ekstre summary */
function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-muted">{label}</span>
      {value}
    </div>
  );
}
