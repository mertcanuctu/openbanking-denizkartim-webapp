"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { formatDate, cn } from "@/lib/utils";
import { CONSENT_TYPES } from "@/lib/constants";
import type { Meta } from "@/lib/types";

interface ConsentManagerProps {
  isOpen: boolean;
  onClose: () => void;
  bank: Meta;
}

// Icons for each consent type
const consentIcons: Record<string, string> = {
  "01": "🏦",
  "02": "📋",
  "03": "💰",
  "04": "📊",
  "05": "💳",
  "06": "📄",
  "07": "💵",
  "08": "🧾",
  "09": "📑",
};

// Descriptions for each consent type
const consentDescriptions: Record<string, string> = {
  "01": "Hesap numarası, IBAN, hesap türü gibi temel bilgiler",
  "02": "Hesap adı, şube bilgisi, açılış tarihi gibi detaylı bilgiler",
  "03": "Anlık bakiye, kullanılabilir bakiye bilgileri",
  "04": "Hesap hareketleri ve işlem geçmişi",
  "05": "Kart numarası, kart türü, kart şeması bilgileri",
  "06": "Kart limitleri, son ödeme tarihi, ekstre borcu",
  "07": "Kart bakiye ve limit bilgileri",
  "08": "Kart harcama işlemleri ve detayları",
  "09": "Kart ekstre bilgileri ve dönem detayları",
};

export function ConsentManager({ isOpen, onClose, bank }: ConsentManagerProps) {
  // Initialize consent states from bank meta data
  const [consents, setConsents] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CONSENT_TYPES.forEach(({ kod }) => {
      initial[kod] = bank.izinTurleri.includes(kod);
    });
    return initial;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const activeCount = Object.values(consents).filter(Boolean).length;
  const expiryDate = formatDate(bank.erisimIzniSonTrh);

  const toggleConsent = useCallback(
    (kod: string) => {
      setConsents((prev) => {
        const newState = { ...prev, [kod]: !prev[kod] };
        setHasChanges(true);
        return newState;
      });
    },
    []
  );

  const handleSave = useCallback(() => {
    setShowSuccess(true);
    setHasChanges(false);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto"
          >
            <div className="bg-surface rounded-t-3xl border-t border-x border-card-border max-h-[85vh] flex flex-col">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-card-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-card-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
                    <Shield size={18} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-text-primary">
                      İzin Yönetimi
                    </h2>
                    <p className="text-[10px] text-text-muted">
                      Açık Bankacılık Erişim İzinleri
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-card border border-card-border active:scale-95 transition-transform"
                >
                  <X size={16} className="text-text-muted" />
                </button>
              </div>

              {/* Summary */}
              <div className="px-5 py-3 flex items-center justify-between bg-surface-light/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-success" />
                  <span className="text-xs text-text-secondary">
                    {activeCount}/{CONSENT_TYPES.length} izin aktif
                  </span>
                </div>
                <Badge variant="accent">{bank.bankaAdi}</Badge>
              </div>

              {/* Consent list */}
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
                {CONSENT_TYPES.map(({ kod, ad }, idx) => (
                  <motion.div
                    key={kod}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl border transition-colors",
                      consents[kod]
                        ? "bg-success/5 border-success/15"
                        : "bg-surface-light/30 border-card-border"
                    )}
                  >
                    {/* Consent icon */}
                    <span className="text-lg mt-0.5 flex-shrink-0">
                      {consentIcons[kod]}
                    </span>

                    {/* Consent info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-text-muted font-mono">
                          {kod}
                        </span>
                        <p className="text-xs text-text-primary font-medium truncate">
                          {ad}
                        </p>
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed">
                        {consentDescriptions[kod]}
                      </p>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => toggleConsent(kod)}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-1",
                        consents[kod] ? "bg-success" : "bg-surface-light"
                      )}
                    >
                      <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md",
                          consents[kod] ? "left-[22px]" : "left-0.5"
                        )}
                      />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Expiry notice */}
              <div className="px-5 py-3 border-t border-card-border">
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/20 mb-3">
                  <Info size={14} className="text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-accent leading-relaxed">
                    Erişim izni{" "}
                    <span className="font-semibold">{expiryDate}</span>
                    &apos;da sona erecek. İzinler bu tarihten sonra otomatik
                    olarak kaldırılacaktır.
                  </p>
                </div>

                {/* Success message */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-success/10 border border-success/20 mb-3"
                    >
                      <CheckCircle2 size={14} className="text-success" />
                      <p className="text-[11px] text-success font-medium">
                        İzinler başarıyla güncellendi
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={cn(
                    "w-full py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.97]",
                    hasChanges
                      ? "bg-accent text-white shadow-glow"
                      : "bg-surface-light text-text-muted cursor-not-allowed"
                  )}
                >
                  İzinleri Güncelle
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
