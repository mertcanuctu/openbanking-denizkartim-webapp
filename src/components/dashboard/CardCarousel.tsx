"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { krediKartlari } from "@/lib/data";
import { formatCurrency, maskCardNumber } from "@/lib/utils";
import { CARD_GRADIENTS } from "@/lib/constants";
import type { ExtendedFinancialSummary } from "@/hooks/useFinancialSummary";
import { userData } from "@/lib/data";

interface CardCarouselProps {
  summary: ExtendedFinancialSummary;
}

export function CardCarousel({ summary }: CardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Only physical credit cards for the carousel
  const cards = krediKartlari.filter((k) => k.altKartTipi === "A");

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = 272; // 260px card + 12px gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, cards.length - 1));
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-text-primary font-semibold text-sm">Kartlarım</p>
        <Link href="/kartlarim" className="text-accent text-xs font-medium">
          Tümünü Gör
        </Link>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5"
      >
        {cards.map((kart) => {
          const gradient = CARD_GRADIENTS[kart.kartUrunAdi] || {
            from: "#374151",
            to: "#111827",
          };
          const detay = userData.kartDetaylari[kart.kartRef]?.TRY;

          return (
            <Link
              key={kart.kartRef}
              href={`/kartlarim/${kart.kartRef}`}
              className="snap-center shrink-0"
            >
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="relative w-[260px] h-[160px] rounded-2xl overflow-hidden border border-white/10 shadow-glass"
                style={{
                  background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                }}
              >
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

                {/* Card content */}
                <div className="relative h-full flex flex-col justify-between p-4">
                  {/* Top: Card name + schema */}
                  <div className="flex justify-between items-start">
                    <p className="text-white/90 text-xs font-medium">
                      {kart.kartUrunAdi}
                    </p>
                    <span className="text-white/60 text-[10px] font-bold tracking-widest">
                      {kart.kartSema}
                    </span>
                  </div>

                  {/* Middle: Card number */}
                  <p className="text-white/80 text-sm font-mono tracking-[0.15em]">
                    {maskCardNumber(kart.kartNo)}
                  </p>

                  {/* Bottom: Balance info */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/50 text-[9px] uppercase tracking-wider">
                        Kalan Borç
                      </p>
                      <p className="text-white text-sm font-semibold">
                        {detay
                          ? formatCurrency(
                              Math.abs(parseFloat(detay.kalanEkstreBorcu))
                            )
                          : "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/50 text-[9px] uppercase tracking-wider">
                        Kul. Limit
                      </p>
                      <p className="text-white/80 text-xs font-medium">
                        {detay
                          ? formatCurrency(
                              parseFloat(detay.kullanilabilirLimit)
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {cards.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === activeIndex ? 16 : 6,
              height: 6,
              backgroundColor:
                i === activeIndex
                  ? "rgb(14, 165, 233)"
                  : "rgba(255,255,255,0.2)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
