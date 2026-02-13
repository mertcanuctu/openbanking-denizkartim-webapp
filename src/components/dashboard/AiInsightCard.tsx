"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import type { AbonelikOzeti } from "@/lib/types";

interface AiInsightCardProps {
  subscriptions: AbonelikOzeti;
}

export function AiInsightCard({ subscriptions }: AiInsightCardProps) {
  const { toplamAdet, toplamTRY, toplamUSD } = subscriptions;

  // Build dynamic insight message
  const tryFormatted = toplamTRY.toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const usdFormatted = toplamUSD.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative glass-card overflow-hidden gradient-border">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.06] to-accent/[0.04]" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-8 h-8 rounded-lg bg-gradient-ai flex items-center justify-center"
          >
            <Sparkles size={16} className="text-white" />
          </motion.div>
          <p className="text-text-primary font-semibold text-sm">
            AI Asistan
          </p>
        </div>

        {/* Insight text */}
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          Bu ay{" "}
          <span className="text-text-primary font-semibold">
            {toplamAdet} aktif aboneliğiniz
          </span>{" "}
          var, toplam{" "}
          <span className="text-accent font-semibold">{tryFormatted} ₺/ay</span>
          {toplamUSD > 0 && (
            <>
              {" "}
              ve{" "}
              <span className="text-accent font-semibold">
                ${usdFormatted}/ay
              </span>
            </>
          )}
          . Bulut depolama hizmetlerinizde (iCloud + Google One) çakışma
          tespit ettik — birini iptal ederek{" "}
          <span className="text-success font-semibold">
            ayda 80-130 ₺ tasarruf
          </span>{" "}
          edebilirsiniz.
        </p>

        {/* CTA button */}
        <Link href="/analizler">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 text-accent text-sm font-semibold group"
          >
            <span>Detaylı Analiz</span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
