"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  CreditCard,
  BarChart3,
  CalendarDays,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Ana Sayfa",
    href: "/",
    icon: Home,
  },
  {
    label: "Kartlarım",
    href: "/kartlarim",
    icon: CreditCard,
  },
  {
    label: "Analizler",
    href: "/analizler",
    icon: BarChart3,
  },
  {
    label: "Ödemeler",
    href: "/odemeler",
    icon: CalendarDays,
  },
  {
    label: "Profil",
    href: "/profil",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      role="navigation"
      aria-label="Ana navigasyon"
    >
      <div className="bg-surface/90 backdrop-blur-xl border-t border-card-border safe-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-colors relative min-w-[56px] min-h-[44px]",
                  isActive
                    ? "text-accent"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-8 h-0.5 rounded-full bg-accent"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.1 }}
                >
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </motion.div>
                <span
                  className={cn(
                    "text-[10px] leading-tight",
                    isActive ? "font-semibold" : "font-normal"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
