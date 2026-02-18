"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Users, Gift, Copy, Check } from "lucide-react";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { calcPercentage } from "@/lib/utils";

const DAVET_ILERLEME = { mevcut: 2, hedef: 5 };
const DAVET_LINKI = "https://denizkartim.app/davet/MERT2026";

export function CampaignBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(DAVET_LINKI);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
    }
  };

  return (
    <Link href="/kartlarim?tab=gorevler">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden rounded-2xl p-4 press-effect"
        style={{
          background: "linear-gradient(135deg, #0284C7, #0EA5E9)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -right-2 -bottom-8 w-16 h-16 rounded-full bg-white/5" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Arkadaşını Davet Et
                </p>
                <p className="text-[11px] text-white/70">
                  Her davet için +250 Puan kazan
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/70" />
          </div>

          {/* Progress */}
          <div className="bg-white/10 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Gift size={12} className="text-white/80" />
                <span className="text-[11px] text-white/80 font-medium">
                  {DAVET_ILERLEME.mevcut}/{DAVET_ILERLEME.hedef} davet
                  tamamlandı
                </span>
              </div>
              <span className="text-[11px] text-white font-semibold">
                {DAVET_ILERLEME.hedef - DAVET_ILERLEME.mevcut} kaldı
              </span>
            </div>
            <ProgressBar
              value={calcPercentage(
                DAVET_ILERLEME.mevcut,
                DAVET_ILERLEME.hedef
              )}
              size="sm"
              variant="accent"
              animate
            />
          </div>

          {/* CTA Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/10 press-effect"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} className="text-green-300" />
                  <span className="text-xs font-semibold text-green-300">
                    Kopyalandı!
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy size={14} className="text-white" />
                  <span className="text-xs font-semibold text-white">
                    Davet Linki Kopyala
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
}
