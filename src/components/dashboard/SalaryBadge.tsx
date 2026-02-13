"use client";

import { motion } from "framer-motion";
import { Landmark, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { DetectedSalary } from "@/hooks/useAccountInsights";

interface SalaryBadgeProps {
  salary: DetectedSalary;
}

export function SalaryBadge({ salary }: SalaryBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-success/5 border border-success/15">
        <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center flex-shrink-0">
          <Landmark size={16} className="text-success" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-success" />
            <p className="text-[11px] text-success font-medium">
              Maaş Geliri Tespit Edildi
            </p>
          </div>
          <p className="text-xs text-text-primary font-semibold mt-0.5">
            {formatCurrency(salary.tutar)}/ay
          </p>
        </div>

        <p className="text-[9px] text-text-muted flex-shrink-0">
          {salary.gonderen.split(" ").slice(0, 2).join(" ")}
        </p>
      </div>
    </motion.div>
  );
}
