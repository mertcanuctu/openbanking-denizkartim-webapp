"use client";

import { motion } from "framer-motion";
import { TopBar } from "@/components/layout/TopBar";
import { QuickSummary } from "@/components/dashboard/QuickSummary";
import { CardCarousel } from "@/components/dashboard/CardCarousel";
import { UpcomingPayments } from "@/components/dashboard/UpcomingPayments";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AccountTransactions } from "@/components/dashboard/AccountTransactions";
import { CampaignBanner } from "@/components/dashboard/CampaignBanner";
import { SalaryBadge } from "@/components/dashboard/SalaryBadge";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAccountInsights } from "@/hooks/useAccountInsights";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function DashboardPage() {
  const summary = useFinancialSummary();
  const subscriptions = useSubscriptions();
  const accountInsights = useAccountInsights();

  return (
    <div className="min-h-screen bg-gradient-navy">
      <TopBar userName="Mert" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-5 space-y-4 pb-4"
      >
        {/* Financial Summary */}
        <motion.div variants={itemVariants}>
          <QuickSummary summary={summary} />
        </motion.div>

        {/* Salary Detection Badge */}
        {accountInsights.maas && (
          <motion.div variants={itemVariants}>
            <SalaryBadge salary={accountInsights.maas} />
          </motion.div>
        )}

        {/* Card Carousel */}
        <motion.div variants={itemVariants}>
          <CardCarousel summary={summary} />
        </motion.div>

        {/* Görevler — Arkadaşını Davet Et */}
        <motion.div variants={itemVariants}>
          <CampaignBanner />
        </motion.div>

        {/* Upcoming Payments */}
        <motion.div variants={itemVariants}>
          <UpcomingPayments payments={summary.yaklasanOdemeler} />
        </motion.div>

        {/* AI Insight */}
        <motion.div variants={itemVariants}>
          <AiInsightCard subscriptions={subscriptions} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>

        {/* Recent Account Transactions */}
        {accountInsights.sonIslemler.length > 0 && (
          <motion.div variants={itemVariants}>
            <AccountTransactions transactions={accountInsights.sonIslemler} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
