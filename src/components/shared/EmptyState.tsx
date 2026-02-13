"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Building2,
  Receipt,
  BarChart3,
  CalendarDays,
  Link2Off,
} from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyType = "no-bank" | "no-cards" | "no-transactions" | "no-analytics" | "no-payments";

interface EmptyStateProps {
  type: EmptyType;
  className?: string;
}

const configs: Record<
  EmptyType,
  { icon: React.ElementType; title: string; description: string; color: string }
> = {
  "no-bank": {
    icon: Link2Off,
    title: "Banka Bağlantısı Yok",
    description:
      "Henüz bir banka hesabı bağlamadınız. Açık Bankacılık ile bankanızı bağlayarak tüm finansal verilerinizi tek ekranda görüntüleyebilirsiniz.",
    color: "text-accent",
  },
  "no-cards": {
    icon: CreditCard,
    title: "Kart Bulunamadı",
    description:
      "Bağlı hesabınıza ait kart bilgisi bulunamadı. Banka bağlantınızı kontrol edin.",
    color: "text-warning",
  },
  "no-transactions": {
    icon: Receipt,
    title: "İşlem Bulunamadı",
    description: "Bu dönemde henüz bir işlem gerçekleşmemiş.",
    color: "text-text-muted",
  },
  "no-analytics": {
    icon: BarChart3,
    title: "Analiz Verisi Yok",
    description:
      "Analiz oluşturabilmek için yeterli harcama verisi bulunamadı.",
    color: "text-text-muted",
  },
  "no-payments": {
    icon: CalendarDays,
    title: "Ödeme Planı Yok",
    description: "Bu ay için ödenmesi gereken bir borç bulunmuyor.",
    color: "text-success",
  },
};

export function EmptyState({ type, className }: EmptyStateProps) {
  const { icon: Icon, title, description, color } = configs[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass-card p-8 flex flex-col items-center text-center",
        className
      )}
    >
      <div
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
          color === "text-accent"
            ? "bg-accent/10"
            : color === "text-warning"
            ? "bg-warning/10"
            : color === "text-success"
            ? "bg-success/10"
            : "bg-surface-light/50"
        )}
      >
        <Icon size={28} className={cn(color, "opacity-60")} />
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-xs text-text-muted leading-relaxed max-w-[260px]">
        {description}
      </p>
    </motion.div>
  );
}
