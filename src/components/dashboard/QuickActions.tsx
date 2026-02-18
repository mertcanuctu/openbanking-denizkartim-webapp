"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, PlusCircle, BarChart3, Tag } from "lucide-react";

const actions = [
  {
    label: "Borç Öde",
    icon: Wallet,
    href: "/odemeler",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Kart Ekle",
    icon: PlusCircle,
    href: "/profil",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Harcamalarım",
    icon: BarChart3,
    href: "/analizler",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    label: "Kampanyalar",
    icon: Tag,
    href: "/kampanyalar",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {actions.map((action, index) => (
        <Link key={action.label} href={action.href}>
          <motion.div
            whileTap={{ scale: 0.93 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-card-border press-effect"
          >
            <div
              className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center`}
            >
              <action.icon size={20} className={action.color} />
            </div>
            <span className="text-[10px] text-text-secondary font-medium text-center leading-tight">
              {action.label}
            </span>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
