"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingDown,
  Info,
  Calculator,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { PaymentCalendar } from "@/components/payments/PaymentCalendar";
import { PaymentCard } from "@/components/payments/PaymentCard";
import { AmountDisplay } from "@/components/shared/AmountDisplay";
import { Badge } from "@/components/shared/Badge";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { formatCurrency, cn } from "@/lib/utils";
import { CREDIT_CARD_INTEREST_RATE } from "@/lib/constants";

export default function OdemelerPage() {
  const financial = useFinancialSummary();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Interest calculator state
  const [sliderCard, setSliderCard] = useState(0); // index into yaklasanOdemeler
  const activeOdeme = financial.yaklasanOdemeler[sliderCard];
  const [paymentAmount, setPaymentAmount] = useState<number>(
    activeOdeme?.ekstreBorcu || 0
  );

  // When slider card changes, reset payment amount
  const handleSliderCardChange = (idx: number) => {
    setSliderCard(idx);
    const odeme = financial.yaklasanOdemeler[idx];
    if (odeme) setPaymentAmount(odeme.ekstreBorcu);
  };

  // Interest calculation
  const interestCalc = useMemo(() => {
    if (!activeOdeme) return { faiz: 0, remaining: 0 };
    const borc = activeOdeme.ekstreBorcu;
    const asgari = activeOdeme.asgariOdeme;

    if (paymentAmount >= borc) {
      return { faiz: 0, remaining: 0 };
    }

    const remaining = borc - paymentAmount;
    // Turkish credit card monthly interest on remaining balance
    const faiz = remaining * (CREDIT_CARD_INTEREST_RATE / 100);
    return {
      faiz: Math.round(faiz * 100) / 100,
      remaining: Math.round(remaining * 100) / 100,
    };
  }, [activeOdeme, paymentAmount]);

  // Next month installment projection
  const nextMonthTaksit = useMemo(() => {
    if (financial.toplamTaksitYuku.length < 2) return 0;
    return Math.abs(parseFloat(financial.toplamTaksitYuku[1].taksitTutari));
  }, [financial.toplamTaksitYuku]);

  return (
    <div className="min-h-screen bg-gradient-navy">
      <TopBar userName="Mert" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 pb-nav"
      >
        <h1 className="text-xl font-bold text-text-primary mb-4">Ödemeler</h1>

        {/* === Payment Summary === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={16} className="text-accent" />
            <h2 className="text-sm font-medium text-text-primary">
              Bu Ay Ödenecek
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-[11px] text-text-muted mb-0.5">Toplam Borç</p>
              <AmountDisplay
                amount={financial.toplamBorc}
                size="lg"
                className="text-text-primary"
                animate
              />
            </div>
            <div>
              <p className="text-[11px] text-text-muted mb-0.5">
                Asgari Ödeme
              </p>
              <AmountDisplay
                amount={financial.toplamAsgariOdeme}
                size="lg"
                className="text-warning"
                animate
              />
            </div>
          </div>

          {/* Zero interest note */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
            <Info size={14} className="text-success flex-shrink-0" />
            <p className="text-[11px] text-success">
              Tam ödeme yaparsanız 0 ₺ faiz ödersiniz
            </p>
          </div>
        </motion.div>

        {/* === Calendar === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <PaymentCalendar
            yaklasanOdemeler={financial.yaklasanOdemeler}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </motion.div>

        {/* === Payment Cards === */}
        <div className="space-y-3 mb-5">
          {financial.yaklasanOdemeler.map((odeme, idx) => (
            <PaymentCard key={odeme.kartRef} odeme={odeme} index={idx} />
          ))}

          {financial.yaklasanOdemeler.length === 0 && (
            <div className="glass-card p-8 text-center">
              <Wallet
                size={36}
                className="text-text-muted mx-auto mb-2 opacity-40"
              />
              <p className="text-sm text-text-muted">
                Bu ay ödenmesi gereken borç yok
              </p>
            </div>
          )}
        </div>

        {/* === Interest Calculator === */}
        {financial.yaklasanOdemeler.length > 0 && activeOdeme && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={16} className="text-accent" />
              <h3 className="text-sm font-medium text-text-primary">
                Faiz Hesaplayıcı
              </h3>
            </div>

            {/* Card selector (if multiple) */}
            {financial.yaklasanOdemeler.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                {financial.yaklasanOdemeler.map((o, idx) => (
                  <button
                    key={o.kartRef}
                    onClick={() => handleSliderCardChange(idx)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all",
                      sliderCard === idx
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-surface-light/50 text-text-muted border border-transparent"
                    )}
                  >
                    {o.kartAdi}
                  </button>
                ))}
              </div>
            )}

            {/* Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted">
                  Ne kadar ödeyeceksiniz?
                </span>
                <span className="text-sm font-semibold text-accent">
                  {formatCurrency(paymentAmount)}
                </span>
              </div>
              <input
                type="range"
                min={activeOdeme.asgariOdeme}
                max={activeOdeme.ekstreBorcu}
                step={100}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-accent bg-surface-light"
                style={{
                  background: `linear-gradient(to right, #0EA5E9 0%, #0EA5E9 ${((paymentAmount - activeOdeme.asgariOdeme) / (activeOdeme.ekstreBorcu - activeOdeme.asgariOdeme)) * 100}%, #1F2937 ${((paymentAmount - activeOdeme.asgariOdeme) / (activeOdeme.ekstreBorcu - activeOdeme.asgariOdeme)) * 100}%, #1F2937 100%)`,
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-text-muted">
                  Asgari: {formatCurrency(activeOdeme.asgariOdeme)}
                </span>
                <span className="text-[9px] text-text-muted">
                  Tam: {formatCurrency(activeOdeme.ekstreBorcu)}
                </span>
              </div>
            </div>

            {/* Interest result */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={cn(
                  "p-3 rounded-xl text-center",
                  interestCalc.faiz === 0
                    ? "bg-success/10 border border-success/20"
                    : "bg-danger/10 border border-danger/20"
                )}
              >
                <p className="text-[10px] text-text-muted mb-0.5">
                  Tahmini Faiz
                </p>
                <p
                  className={cn(
                    "text-base font-bold",
                    interestCalc.faiz === 0 ? "text-success" : "text-danger"
                  )}
                >
                  {interestCalc.faiz === 0
                    ? "0 ₺"
                    : `~${formatCurrency(interestCalc.faiz)}`}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-light/30 border border-card-border text-center">
                <p className="text-[10px] text-text-muted mb-0.5">
                  Kalan Borç
                </p>
                <p className="text-base font-bold text-text-primary">
                  {formatCurrency(interestCalc.remaining)}
                </p>
              </div>
            </div>

            {/* Quick info */}
            <div className="mt-3 space-y-1.5">
              <InterestHint
                label="Asgari öderseniz"
                faiz={
                  (activeOdeme.ekstreBorcu - activeOdeme.asgariOdeme) *
                  (CREDIT_CARD_INTEREST_RATE / 100)
                }
                variant="danger"
              />
              <InterestHint label="Tam öderseniz" faiz={0} variant="success" />
            </div>
          </motion.div>
        )}

        {/* === Next Month Projection === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock size={16} className="text-accent" />
            <h3 className="text-sm font-medium text-text-primary">
              Gelecek Ay Projeksiyonu
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Taksit Ödemeleri</span>
              <AmountDisplay
                amount={nextMonthTaksit}
                size="sm"
                className="text-text-primary"
              />
            </div>

            <div className="border-t border-card-border" />

            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted font-medium">
                Minimum Ödeme
              </span>
              <AmountDisplay
                amount={nextMonthTaksit}
                size="sm"
                className="text-warning font-bold"
              />
            </div>
          </div>

          {/* Warning */}
          {nextMonthTaksit > 0 && (
            <div className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle
                size={14}
                className="text-warning flex-shrink-0 mt-0.5"
              />
              <p className="text-[11px] text-warning leading-relaxed">
                Gelecek ay minimum{" "}
                <span className="font-semibold">
                  {formatCurrency(nextMonthTaksit)}
                </span>{" "}
                taksit ödemesi olacak.
              </p>
            </div>
          )}

          {/* Salary comparison */}
          {financial.hesapBakiyesi > 0 && (
            <div className="flex items-start gap-2 mt-2 px-3 py-2.5 rounded-lg bg-success/10 border border-success/20">
              <Info size={14} className="text-success flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-success leading-relaxed">
                Maaş hesabınızdaki{" "}
                <span className="font-semibold">
                  {formatCurrency(financial.hesapBakiyesi)}
                </span>{" "}
                bakiye ile bu ödemeyi karşılayabilirsiniz.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Small interest hint row */
function InterestHint({
  label,
  faiz,
  variant,
}: {
  label: string;
  faiz: number;
  variant: "danger" | "success";
}) {
  const roundedFaiz = Math.round(faiz * 100) / 100;
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-text-muted">{label}</span>
      <span
        className={cn(
          "font-medium",
          variant === "danger" ? "text-danger" : "text-success"
        )}
      >
        {roundedFaiz === 0
          ? "0 ₺ faiz"
          : `~${formatCurrency(roundedFaiz)} faiz`}
      </span>
    </div>
  );
}
