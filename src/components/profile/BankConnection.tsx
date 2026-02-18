"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Shield,
  Calendar,
  ChevronRight,
  Unlink,
  Settings2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CONSENT_TYPES, BANK_CONFIG } from "@/lib/constants";
import type { Meta } from "@/lib/types";

interface BankConnectionProps {
  bank: Meta;
  onManageConsents: () => void;
}

const defaultConfig = { color: "#6B7280", letter: "?", gradient: { from: "#6B7280", to: "#374151" } };

export function BankConnection({ bank, onManageConsents }: BankConnectionProps) {
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const connectedDate = formatDate(bank.rizaOlusTrh);
  const expiryDate = formatDate(bank.erisimIzniSonTrh);
  const activeConsents = bank.izinTurleri.length;
  const totalConsents = CONSENT_TYPES.length;

  // Check if access is expiring soon (within 30 days)
  const expiryMs = new Date(bank.erisimIzniSonTrh).getTime();
  const nowMs = Date.now();
  const daysUntilExpiry = Math.ceil((expiryMs - nowMs) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  const config = BANK_CONFIG[bank.hhsKod] || defaultConfig;
  const showLogo = config.logoUrl && !logoError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {/* Bank header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3 mb-4">
          {/* Bank logo */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${config.gradient.from}, ${config.gradient.to})` }}
          >
            {showLogo ? (
              <img
                src={config.logoUrl}
                alt=""
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-white font-bold text-lg">{config.letter}</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-text-primary">
                {bank.bankaAdi}
              </h3>
              <Badge variant="success" dot>
                Bağlı
              </Badge>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
              Açık Bankacılık Bağlantısı
            </p>
          </div>

          <CheckCircle2 size={20} className="text-success" />
        </div>

        {/* Connection details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-light/30 border border-card-border">
            <Calendar size={14} className="text-text-muted flex-shrink-0" />
            <div>
              <p className="text-[9px] text-text-muted">Bağlantı Tarihi</p>
              <p className="text-[11px] text-text-primary font-medium">
                {connectedDate}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-xl border",
              isExpiringSoon
                ? "bg-warning/10 border-warning/20"
                : "bg-surface-light/30 border-card-border"
            )}
          >
            <Calendar
              size={14}
              className={cn(
                "flex-shrink-0",
                isExpiringSoon ? "text-warning" : "text-text-muted"
              )}
            />
            <div>
              <p className="text-[9px] text-text-muted">Bitiş Tarihi</p>
              <p
                className={cn(
                  "text-[11px] font-medium",
                  isExpiringSoon ? "text-warning" : "text-text-primary"
                )}
              >
                {expiryDate}
              </p>
            </div>
          </div>
        </div>

        {/* Expiring soon warning */}
        {isExpiringSoon && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-warning/10 border border-warning/20 mb-4">
            <AlertTriangle size={14} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-warning leading-relaxed">
              Erişim izniniz <span className="font-semibold">{daysUntilExpiry} gün</span> içinde sona erecek. Yenilemeyi unutmayın.
            </p>
          </div>
        )}

        {/* Permissions summary */}
        <button
          onClick={onManageConsents}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-light/50 border border-card-border active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-accent" />
            <div className="text-left">
              <p className="text-xs text-text-primary font-medium">
                İzin Yönetimi
              </p>
              <p className="text-[10px] text-text-muted">
                {activeConsents}/{totalConsents} izin aktif
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">{activeConsents} Aktif</Badge>
            <ChevronRight size={16} className="text-text-muted" />
          </div>
        </button>
      </div>

      {/* Action buttons */}
      <div className="border-t border-card-border px-5 py-3 flex gap-3">
        <button
          onClick={onManageConsents}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-medium active:scale-[0.97] transition-transform"
        >
          <Settings2 size={14} />
          İzinleri Yönet
        </button>
        <button
          onClick={() => setShowDisconnectConfirm(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-transparent border border-danger/30 text-danger text-xs font-medium active:scale-[0.97] transition-transform"
        >
          <Unlink size={14} />
          Bağlantıyı Kaldır
        </button>
      </div>

      {/* Disconnect confirmation */}
      <AnimatePresence>
        {showDisconnectConfirm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-danger/20 bg-danger/5 px-5 py-4">
              <p className="text-xs text-danger font-medium mb-2">
                Bağlantıyı kaldırmak istediğinize emin misiniz?
              </p>
              <p className="text-[11px] text-text-muted mb-3 leading-relaxed">
                Bu işlem {bank.bankaAdi} hesaplarınıza ve kartlarınıza olan tüm erişimi
                kaldıracaktır. Bu demo sürümünde gerçek bir kaldırma işlemi
                yapılmaz.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDisconnectConfirm(false)}
                  className="flex-1 py-2 rounded-lg bg-surface-light/50 border border-card-border text-text-secondary text-xs font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={() => setShowDisconnectConfirm(false)}
                  className="flex-1 py-2 rounded-lg bg-danger text-white text-xs font-medium"
                >
                  Evet, Kaldır
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
