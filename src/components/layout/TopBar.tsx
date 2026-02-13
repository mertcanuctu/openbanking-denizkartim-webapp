"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TopBarProps {
  userName?: string;
  /** Enable compact mode on scroll */
  scrollAware?: boolean;
}

export function TopBar({ userName = "Mert", scrollAware = true }: TopBarProps) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (!scrollAware) return;

    const handleScroll = () => {
      setIsCompact(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollAware]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex items-center justify-between px-5 safe-top transition-all duration-300 z-40",
        isCompact
          ? "py-2 sticky top-0 bg-navy/80 backdrop-blur-xl border-b border-card-border"
          : "pt-4 pb-2"
      )}
    >
      {/* Left: Avatar + Greeting */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-semibold shadow-glow-sm transition-all duration-300",
            isCompact ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
          )}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          {!isCompact && (
            <p className="text-text-secondary text-xs">Merhaba</p>
          )}
          <p
            className={cn(
              "text-text-primary font-semibold transition-all duration-300",
              isCompact ? "text-sm" : "text-base"
            )}
          >
            {userName} {!isCompact && "👋"}
          </p>
        </div>
      </div>

      {/* Right: Notification bell */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className={cn(
          "relative rounded-xl bg-card border border-card-border transition-all duration-300",
          isCompact ? "p-1.5" : "p-2"
        )}
        aria-label="Bildirimler"
      >
        <Bell size={isCompact ? 18 : 20} className="text-text-secondary" />
        {/* Notification badge */}
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger rounded-full flex items-center justify-center">
          <span className="text-[9px] font-bold text-white">3</span>
        </span>
      </motion.button>
    </motion.header>
  );
}
