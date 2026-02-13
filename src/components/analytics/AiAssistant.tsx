"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  CalendarClock,
  AlertTriangle,
  TrendingUp,
  Star,
  MessageCircle,
  Wallet,
  ListChecks,
  PiggyBank,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useTransactions } from "@/hooks/useTransactions";

interface AiInsight {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  actionLabel?: string;
}

/** Quick question preset */
interface QuickQuestion {
  icon: React.ReactNode;
  label: string;
  answer: string;
}

export function AiAssistant() {
  const [activeInsight, setActiveInsight] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const financial = useFinancialSummary();
  const subscriptions = useSubscriptions();
  const { toplamHarcama, categorySummary } = useTransactions();

  // --- Build the 5 proactive AI insights ---
  const insights: AiInsight[] = [
    {
      id: "subscriptions",
      icon: <RotateCw size={18} className="text-purple-400" />,
      title: "Abonelik Uyarısı",
      description: `${subscriptions.toplamAdet} aktif aboneliğiniz var, aylık toplam ${formatCurrency(subscriptions.toplamTRY)}${subscriptions.toplamUSD > 0 ? ` + $${subscriptions.toplamUSD.toFixed(2)}` : ""}. iCloud Storage ve Google One ikisi de bulut depolama — birini iptal ederek ayda 80-130 ₺ tasarruf edebilirsiniz.`,
      color: "#8B5CF6",
    },
    {
      id: "installments",
      icon: <CalendarClock size={18} className="text-blue-400" />,
      title: "Taksit Yükü",
      description: `Gelecek ay ${formatCurrency(Math.abs(parseFloat(financial.toplamTaksitYuku[1]?.taksitTutari || "0")))} taksit ödemesi olacak. Maaş hesabınızdaki ${formatCurrency(financial.hesapBakiyesi)} bakiye ile bu ödemeyi karşılayabilirsiniz.`,
      color: "#0EA5E9",
    },
    {
      id: "kmh",
      icon: <AlertTriangle size={18} className="text-red-400" />,
      title: "KMH Borcu",
      description: financial.kmhBorcu > 0
        ? `KMH hesabınızda ${formatCurrency(financial.kmhBorcu)} eksi bakiye var. Yüksek faiz uygulanıyor! Maaş hesabınızdan transfer yaparak faiz yükünü azaltabilirsiniz.`
        : "KMH hesabınızda borç bulunmuyor. Harika bir durum!",
      color: "#EF4444",
    },
    {
      id: "spending",
      icon: <TrendingUp size={18} className="text-amber-400" />,
      title: "Harcama Analizi",
      description: (() => {
        const top = categorySummary[0];
        const nonInstallment = categorySummary.find(
          (c) => c.kategori !== "Teknoloji" && c.kategori !== "Havayolu"
        );
        if (!top) return "Bu dönem harcama verisi henüz yeterli değil.";
        let msg = `En yüksek harcama kategoriniz ${top.kategori}: ${formatCurrency(top.toplam)} (%${top.yuzde}).`;
        if (nonInstallment) {
          msg += ` Taksitsiz en yüksek harcama: ${nonInstallment.kategori} (${formatCurrency(nonInstallment.toplam)}).`;
        }
        return msg;
      })(),
      color: "#F59E0B",
    },
    {
      id: "points",
      icon: <Star size={18} className="text-yellow-400" />,
      title: "Puan Optimizasyonu",
      description: (() => {
        const puanlar = financial.puanOzeti;
        if (puanlar.length === 0) return "Henüz biriken puanınız yok.";
        const puanStr = puanlar
          .map(
            (p) =>
              `${p.toplam.toLocaleString("tr-TR")} ${p.puanTipi}`
          )
          .join(" + ");
        return `${puanStr} biriktiniz. Wings Mil puanlarınızla yurtiçi gidiş-dönüş uçuş biletleri alabilirsiniz!`;
      })(),
      color: "#EAB308",
    },
  ];

  // --- Quick questions ---
  const quickQuestions: QuickQuestion[] = [
    {
      icon: <Wallet size={14} />,
      label: "Bu ay ne kadar harcadım?",
      answer: `Bu ay toplam ${formatCurrency(toplamHarcama)} harcama yaptınız. Toplam borcunuz ${formatCurrency(financial.toplamBorc)}, asgari ödemeniz ${formatCurrency(financial.toplamAsgariOdeme)}.`,
    },
    {
      icon: <CalendarClock size={14} />,
      label: "Taksit yüküm ne kadar?",
      answer: `Aktif taksit yükünüz: Bu dönem ${formatCurrency(Math.abs(parseFloat(financial.toplamTaksitYuku[0]?.taksitTutari || "0")))}, gelecek dönem ${formatCurrency(Math.abs(parseFloat(financial.toplamTaksitYuku[1]?.taksitTutari || "0")))}. Toplamda ${financial.toplamTaksitYuku.filter((t) => Math.abs(parseFloat(t.taksitTutari)) > 0).length} dönem taksit ödemesi devam edecek.`,
    },
    {
      icon: <ListChecks size={14} />,
      label: "Aboneliklerimi göster",
      answer: `${subscriptions.toplamAdet} aktif aboneliğiniz var. Aylık toplam: ${formatCurrency(subscriptions.toplamTRY)}${subscriptions.toplamUSD > 0 ? ` + $${subscriptions.toplamUSD.toFixed(2)}` : ""}. En pahalı abonelik: ${subscriptions.abonelikler[0]?.ad || "—"} (${subscriptions.abonelikler[0] ? formatCurrency(subscriptions.abonelikler[0].tutar, subscriptions.abonelikler[0].paraBirimi) : "—"}).`,
    },
    {
      icon: <PiggyBank size={14} />,
      label: "Tasarruf önerisi ver",
      answer: `1) iCloud Storage veya Google One'dan birini iptal edin (~80-130 ₺/ay). 2) Yeme & İçme harcamalarını izleyin. 3) KMH borcunu hemen kapatarak yüksek faizden kurtulun. 4) Axess Puan ve Wings Mil'lerinizi değerlendirin.`,
    },
  ];

  const scrollToInsight = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? Math.max(0, activeInsight - 1)
        : Math.min(insights.length - 1, activeInsight + 1);
    setActiveInsight(newIndex);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            AI Finansal Asistan
          </h3>
          <p className="text-[10px] text-text-muted">
            Verilerinize dayalı akıllı öneriler
          </p>
        </div>
      </motion.div>

      {/* Insight cards carousel */}
      <div className="relative">
        {/* Navigation arrows */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] text-text-muted">
            {activeInsight + 1} / {insights.length} Öneri
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => scrollToInsight("prev")}
              disabled={activeInsight === 0}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                activeInsight === 0
                  ? "bg-surface-light/30 text-text-muted/30"
                  : "bg-surface-light/50 text-text-secondary hover:bg-surface-light"
              )}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => scrollToInsight("next")}
              disabled={activeInsight === insights.length - 1}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                activeInsight === insights.length - 1
                  ? "bg-surface-light/30 text-text-muted/30"
                  : "bg-surface-light/50 text-text-secondary hover:bg-surface-light"
              )}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Active insight card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={insights[activeInsight].id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="glass-card p-5 gradient-border rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${insights[activeInsight].color}15`,
                }}
              >
                {insights[activeInsight].icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">
                  {insights[activeInsight].title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {insights[activeInsight].description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {insights.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveInsight(idx)}
              className={cn(
                "rounded-full transition-all duration-300",
                idx === activeInsight
                  ? "w-5 h-1.5 bg-accent"
                  : "w-1.5 h-1.5 bg-surface-light"
              )}
            />
          ))}
        </div>
      </div>

      {/* Quick questions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={14} className="text-accent" />
          <h4 className="text-xs font-medium text-text-muted">Hızlı Sorular</h4>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() =>
                setActiveQuestion(activeQuestion === idx ? null : idx)
              }
              className={cn(
                "text-left p-3 rounded-xl text-xs transition-all duration-200 press-effect",
                activeQuestion === idx
                  ? "bg-accent/15 border border-accent/30 text-accent"
                  : "bg-surface-light/40 border border-card-border text-text-secondary hover:bg-surface-light/60"
              )}
            >
              <div className="flex items-center gap-1.5 mb-1 text-text-muted">
                {q.icon}
              </div>
              <span className="font-medium leading-tight">{q.label}</span>
            </button>
          ))}
        </div>

        {/* Answer display */}
        <AnimatePresence>
          {activeQuestion !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-4 mt-3 gradient-border rounded-2xl">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {quickQuestions[activeQuestion].answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
