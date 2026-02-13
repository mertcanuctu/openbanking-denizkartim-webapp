"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { SpendingChart } from "@/components/analytics/SpendingChart";
import { CategoryBreakdown } from "@/components/analytics/CategoryBreakdown";
import { SubscriptionManager } from "@/components/analytics/SubscriptionManager";
import { AiAssistant } from "@/components/analytics/AiAssistant";
import { IncomeExpenseOverview } from "@/components/analytics/IncomeExpenseOverview";
import { useTransactions } from "@/hooks/useTransactions";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAccountInsights } from "@/hooks/useAccountInsights";
import { cn } from "@/lib/utils";

type TabId = "harcamalar" | "abonelikler" | "ai";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "harcamalar", label: "Harcamalar", icon: BarChart3 },
  { id: "abonelikler", label: "Abonelikler", icon: RotateCw },
  { id: "ai", label: "AI Asistan", icon: Sparkles },
];

export default function AnalizlerPage() {
  const [activeTab, setActiveTab] = useState<TabId>("harcamalar");

  // All transactions across all cards (TRY spending)
  const { transactions, categorySummary, toplamHarcama } = useTransactions({
    paraBirimi: "TRY",
  });

  // Subscriptions
  const subscriptionOzet = useSubscriptions();

  // Account insights (salary, bills, income vs expense)
  const accountInsights = useAccountInsights();

  return (
    <div className="min-h-screen bg-gradient-navy">
      <TopBar userName="Mert" />

      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 mb-2"
      >
        <h1 className="text-xl font-bold text-text-primary">Analizler</h1>
      </motion.div>

      {/* Tab bar */}
      <div className="sticky top-0 z-30 bg-navy/90 backdrop-blur-md border-b border-card-border">
        <div className="flex px-5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all duration-200 border-b-2",
                  isActive
                    ? tab.id === "ai"
                      ? "text-purple-400 border-purple-400"
                      : "text-accent border-accent"
                    : "text-text-muted border-transparent hover:text-text-secondary"
                )}
              >
                <TabIcon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5 pt-4 pb-nav">
        <AnimatePresence mode="wait">
          {activeTab === "harcamalar" && (
            <motion.div
              key="harcamalar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Donut chart */}
              <SpendingChart
                categorySummary={categorySummary}
                toplamHarcama={toplamHarcama}
              />

              {/* Category breakdown */}
              <CategoryBreakdown
                categorySummary={categorySummary}
                transactions={transactions}
              />

              {/* Income vs Expense + Bill Detection */}
              <IncomeExpenseOverview
                maas={accountInsights.maas}
                duzenliGiderler={accountInsights.duzenliGiderler}
                toplamDuzenliGider={accountInsights.toplamDuzenliGider}
                gelirGiderOzeti={accountInsights.gelirGiderOzeti}
              />
            </motion.div>
          )}

          {activeTab === "abonelikler" && (
            <motion.div
              key="abonelikler"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <SubscriptionManager ozet={subscriptionOzet} />
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AiAssistant />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
