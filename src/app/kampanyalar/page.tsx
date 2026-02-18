"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  SlidersHorizontal,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Percent,
  Fuel,
  ShoppingCart,
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Plane,
  Pizza,
  Package,
  Store,
  Hotel,
  type LucideIcon,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/shared/Badge";
import { bankalar } from "@/lib/data";
import { BANK_CONFIG } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  mockKampanyalar,
  KAMPANYA_KATEGORILERI,
  type Kampanya,
} from "@/lib/campaignData";

// ─── Icon Map ────────────────────────────────────────
const KAMPANYA_ICONS: Record<string, LucideIcon> = {
  Fuel,
  ShoppingCart,
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Plane,
  Pizza,
  Package,
  Store,
  Hotel,
};

// ─── Animation Variants ─────────────────────────────
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

// ─── Campaign Card ──────────────────────────────────
function KampanyaCard({
  kampanya,
  onSelect,
}: {
  kampanya: Kampanya;
  onSelect: (k: Kampanya) => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(kampanya)}
      className="overflow-hidden rounded-2xl bg-card border border-card-border press-effect cursor-pointer"
    >
      {/* Gradient hero area */}
      <div
        className="relative h-28 flex flex-col justify-between p-4"
        style={{
          background: `linear-gradient(135deg, ${kampanya.gradientFrom}, ${kampanya.gradientTo})`,
        }}
      >
        {/* Top row: brand + category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = KAMPANYA_ICONS[kampanya.ikon];
              return Icon ? (
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon size={18} className="text-white" />
                </div>
              ) : null;
            })()}
            <span className="text-white/90 text-sm font-semibold">
              {kampanya.marka}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-black/20 backdrop-blur-sm text-white/90 text-[10px] font-medium">
            {KAMPANYA_KATEGORILERI.find((k) => k.id === kampanya.kategori)
              ?.label || kampanya.kategori}
          </span>
        </div>

        {/* Bottom row: cashback badge */}
        {kampanya.cashbackOrani > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm">
              <Percent size={12} className="text-white" />
              <span className="text-white text-xs font-bold">
                %{kampanya.cashbackOrani} Cashback
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1.5">
          {kampanya.baslik}
        </h3>
        <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2 mb-3">
          {kampanya.aciklama}
        </p>

        {/* Footer: date + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-text-muted" />
            <span className="text-[10px] text-text-muted">
              Son: {formatDate(kampanya.sonTarih)}
            </span>
          </div>
          <span className="text-[11px] text-accent font-medium">
            Detayları Gör →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Detail Bottom Sheet ────────────────────────────
function KampanyaDetaySheet({
  kampanya,
  userBankCodes,
  onClose,
  onKullan,
}: {
  kampanya: Kampanya;
  userBankCodes: string[];
  onClose: () => void;
  onKullan: (k: Kampanya) => void;
}) {
  const [showSartlar, setShowSartlar] = useState(false);

  // Compatible banks for this user
  const uyumluBankalar = kampanya.uyumluHHSKodlari.filter((code) =>
    userBankCodes.includes(code)
  );

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[60] max-w-[430px] mx-auto"
      >
        <div className="bg-surface rounded-t-3xl border-t border-x border-card-border max-h-[85vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-card-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-card-border flex-shrink-0">
            <h2 className="text-base font-semibold text-text-primary">
              Kampanya Detayı
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-card border border-card-border active:scale-95 transition-transform"
            >
              <X size={16} className="text-text-muted" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4">
            {/* Gradient banner */}
            <div
              className="h-32 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: `linear-gradient(135deg, ${kampanya.gradientFrom}, ${kampanya.gradientTo})`,
              }}
            >
              <div className="text-center flex flex-col items-center">
                {(() => {
                  const Icon = KAMPANYA_ICONS[kampanya.ikon];
                  return Icon ? (
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                      <Icon size={28} className="text-white" />
                    </div>
                  ) : null;
                })()}
                <span className="text-white text-lg font-bold">
                  {kampanya.marka}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-text-primary leading-snug mb-2">
              {kampanya.baslik}
            </h3>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {kampanya.cashbackOrani > 0 && (
                <Badge variant="success">%{kampanya.cashbackOrani} Cashback</Badge>
              )}
              <Badge variant="warning">
                <Clock size={10} className="mr-1" />
                {formatDate(kampanya.sonTarih)}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-xs text-text-secondary leading-relaxed mb-5">
              {kampanya.aciklama}
            </p>

            {/* Compatible cards */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-text-primary mb-2.5">
                Uyumlu Kartlarınız
              </h4>
              <div className="space-y-2">
                {uyumluBankalar.map((code) => {
                  const config = BANK_CONFIG[code];
                  const bankaAdi =
                    bankalar.find((b) => b.hhsKod === code)?.bankaAdi || code;
                  return (
                    <div
                      key={code}
                      className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/15"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: (config?.color || "#0EA5E9") + "20",
                        }}
                      >
                        <span
                          className="font-bold text-xs"
                          style={{ color: config?.color || "#0EA5E9" }}
                        >
                          {config?.letter || "?"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-text-primary font-medium">
                          {bankaAdi}
                        </p>
                      </div>
                      <CheckCircle2 size={16} className="text-success" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terms accordion */}
            <div className="mb-5">
              <button
                onClick={() => setShowSartlar(!showSartlar)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-card border border-card-border active:scale-[0.98] transition-transform"
              >
                <span className="text-xs text-text-primary font-medium">
                  Kampanya Şartları
                </span>
                {showSartlar ? (
                  <ChevronUp size={16} className="text-text-muted" />
                ) : (
                  <ChevronDown size={16} className="text-text-muted" />
                )}
              </button>
              <AnimatePresence>
                {showSartlar && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 py-3 text-[11px] text-text-muted leading-relaxed">
                      {kampanya.sartlar}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="flex-shrink-0 px-5 py-4 border-t border-card-border">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onKullan(kampanya)}
              className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-semibold shadow-glow active:scale-[0.97] transition-transform"
            >
              Kampanyayı Kullan
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Toast ──────────────────────────────────────────
function Toast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-24 left-0 right-0 z-[70] px-5 max-w-[430px] mx-auto"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-success/20 border border-success/30 backdrop-blur-md">
        <CheckCircle2 size={18} className="text-success flex-shrink-0" />
        <p className="text-sm text-text-primary font-medium flex-1">
          {message}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────
export default function KampanyalarPage() {
  const [activeFilter, setActiveFilter] = useState<string>("tumu");
  const [selectedKampanya, setSelectedKampanya] = useState<Kampanya | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Body scroll lock when bottom sheet is open
  useEffect(() => {
    if (selectedKampanya) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedKampanya]);

  // User's connected bank codes
  const userBankCodes = useMemo(() => bankalar.map((b) => b.hhsKod), []);

  // Filter campaigns: first by user's banks, then by category
  const filteredKampanyalar = useMemo(() => {
    return mockKampanyalar
      .filter((k) =>
        k.uyumluHHSKodlari.some((code) => userBankCodes.includes(code))
      )
      .filter(
        (k) => activeFilter === "tumu" || k.kategori === activeFilter
      );
  }, [activeFilter, userBankCodes]);

  const handleKullan = (kampanya: Kampanya) => {
    setSelectedKampanya(null);
    setToastMessage("Kampanya bilgisi kopyalandı!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-navy">
      <TopBar userName="Mert" />

      <div className="px-5">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <Tag size={22} className="text-accent" />
            <h1 className="text-xl font-bold text-text-primary">
              Kampanyalar
            </h1>
          </div>
          <button className="p-2 rounded-xl bg-card border border-card-border">
            <SlidersHorizontal size={18} className="text-text-muted" />
          </button>
        </motion.div>

        {/* Category filter chips */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
          {KAMPANYA_KATEGORILERI.map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? "bg-accent text-white shadow-glow-sm"
                  : "bg-card border border-card-border text-text-secondary"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Campaign feed */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {filteredKampanyalar.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 pb-nav"
              >
                {filteredKampanyalar.map((kampanya) => (
                  <KampanyaCard
                    key={kampanya.id}
                    kampanya={kampanya}
                    onSelect={setSelectedKampanya}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Tag size={40} className="text-text-muted/30 mb-3" />
                <p className="text-sm text-text-muted">
                  Bu kategoride kampanya bulunamadı
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Detail bottom sheet */}
      <AnimatePresence>
        {selectedKampanya && (
          <KampanyaDetaySheet
            kampanya={selectedKampanya}
            userBankCodes={userBankCodes}
            onClose={() => setSelectedKampanya(null)}
            onKullan={handleKullan}
          />
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage} />}
      </AnimatePresence>
    </div>
  );
}
