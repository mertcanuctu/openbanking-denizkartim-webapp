"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogIn,
  Shield,
  Building2,
  Plus,
  Bell,
  Clock,
  Globe,
  Languages,
  Info,
  ChevronRight,
  FileText,
  Lock,
  Smartphone,
  CheckCircle2,
  X,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { BankConnection } from "@/components/profile/BankConnection";
import { ConsentManager } from "@/components/profile/ConsentManager";
import { Badge } from "@/components/shared/Badge";
import { formatDate, cn } from "@/lib/utils";
import { bankalar, hesaplar, kartlar } from "@/lib/data";
import { APP_NAME, BANK_CONFIG, BANK_ID_TO_HHS } from "@/lib/constants";
import type { Meta } from "@/lib/types";

// Bank list for "Add Bank" flow
const AVAILABLE_BANKS = [
  { id: "garanti", name: "Garanti BBVA", color: "#00854A", letter: "G" },
  { id: "isbank", name: "Türkiye İş Bankası", color: "#003DA6", letter: "İ" },
  { id: "yapi_kredi", name: "Yapı Kredi", color: "#00205B", letter: "Y" },
  { id: "ziraat", name: "Ziraat Bankası", color: "#E21A23", letter: "Z" },
  { id: "halkbank", name: "Halkbank", color: "#0066B3", letter: "H" },
  { id: "vakifbank", name: "Vakıfbank", color: "#FFD100", letter: "V" },
  { id: "qnb", name: "QNB Finansbank", color: "#5C2D91", letter: "Q" },
  { id: "denizbank", name: "Denizbank", color: "#003DA6", letter: "D" },
];

type AddBankStep = "select" | "permissions" | "redirect" | "success";

export default function ProfilPage() {
  const [consentBank, setConsentBank] = useState<Meta | null>(null);
  const [showAddBank, setShowAddBank] = useState(false);
  const [addBankStep, setAddBankStep] = useState<AddBankStep>("select");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [addBankLogoErrors, setAddBankLogoErrors] = useState<Set<string>>(() => new Set());
  const [selectedBankLogoError, setSelectedBankLogoError] = useState(false);

  // Reset selected-bank logo error when selection changes
  useEffect(() => {
    setSelectedBankLogoError(false);
  }, [selectedBank]);

  // Lock body scroll when any modal is open
  const isModalOpen = !!consentBank || showAddBank;
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Notification & settings toggles
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifSpending, setNotifSpending] = useState(true);
  const [notifInsight, setNotifInsight] = useState(false);
  const [reminderTime, setReminderTime] = useState("3");
  const [currency, setCurrency] = useState("TRY");
  const [language, setLanguage] = useState("tr");

  const userName = hesaplar[0]?.hspShb || "MERT YILMAZ";
  const formattedName =
    userName
      .split(" ")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");

  const lastLogin = formatDate(bankalar[0].rizaOlusTrh);
  const totalAccounts = hesaplar.length;
  const totalCards = kartlar.length;
  const totalBanks = bankalar.length;

  // Filter out already connected banks from available list
  const connectedBankNames = new Set(bankalar.map((b) => b.bankaAdi.toLowerCase()));
  const availableBanks = AVAILABLE_BANKS.filter(
    (b) => !connectedBankNames.has(b.name.toLowerCase())
  );

  // Add bank flow handlers
  const handleSelectBank = (bankId: string) => {
    setSelectedBank(bankId);
    setAddBankStep("permissions");
  };

  const handlePermissionContinue = () => {
    setAddBankStep("redirect");
    // Simulate redirect delay
    setTimeout(() => {
      setAddBankStep("success");
    }, 2500);
  };

  const handleAddBankClose = () => {
    setShowAddBank(false);
    setAddBankStep("select");
    setSelectedBank(null);
  };

  const selectedBankData = AVAILABLE_BANKS.find((b) => b.id === selectedBank);

  return (
    <div className="min-h-screen bg-gradient-navy">
      <TopBar userName="Mert" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 pb-nav"
      >
        <h1 className="text-xl font-bold text-text-primary mb-4">Profil</h1>

        {/* ============ USER INFO CARD ============ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-5 mb-4"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-2xl">
                {formattedName.charAt(0)}
              </span>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-text-primary">
                {formattedName}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {APP_NAME} kullanıcısı
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <LogIn size={11} className="text-text-muted" />
                <p className="text-[10px] text-text-muted">
                  Son giriş: {lastLogin}
                </p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-card-border">
            <div className="text-center">
              <p className="text-lg font-bold text-accent">{totalAccounts}</p>
              <p className="text-[10px] text-text-muted">Hesap</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-accent">{totalCards}</p>
              <p className="text-[10px] text-text-muted">Kart</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-success">{totalBanks}</p>
              <p className="text-[10px] text-text-muted">Banka</p>
            </div>
          </div>
        </motion.div>

        {/* ============ BANK CONNECTIONS ============ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">
              Banka Bağlantıları
            </h2>
          </div>

          {/* Active connections */}
          <div className="space-y-3">
            {bankalar.map((bank) => (
              <BankConnection
                key={bank.hhsKod}
                bank={bank}
                onManageConsents={() => setConsentBank(bank)}
              />
            ))}
          </div>

          {/* Add new bank - Dashed card */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddBank(true)}
            className="w-full mt-3 p-5 rounded-2xl border-2 border-dashed border-card-border hover:border-accent/30 transition-colors group"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Plus size={20} className="text-accent" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">
                  Yeni Banka Bağla
                </p>
                <p className="text-[10px] text-text-muted">
                  Açık Bankacılık ile başka bankalarınızı ekleyin
                </p>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* ============ SETTINGS ============ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">
              Bildirim Tercihleri
            </h2>
          </div>

          <div className="glass-card divide-y divide-card-border">
            {/* Payment reminder */}
            <SettingsToggle
              icon={<Bell size={16} className="text-accent" />}
              label="Ödeme Hatırlatıcısı"
              description="Son ödeme tarihi yaklaştığında bildirim al"
              enabled={notifPayment}
              onToggle={() => setNotifPayment(!notifPayment)}
            />

            {/* Spending alerts */}
            <SettingsToggle
              icon={<Smartphone size={16} className="text-accent" />}
              label="Harcama Bildirimleri"
              description="Büyük harcamalarda anlık bildirim"
              enabled={notifSpending}
              onToggle={() => setNotifSpending(!notifSpending)}
            />

            {/* AI insights */}
            <SettingsToggle
              icon={<Info size={16} className="text-accent" />}
              label="AI Önerileri"
              description="Akıllı tasarruf önerilerini bildirimle al"
              enabled={notifInsight}
              onToggle={() => setNotifInsight(!notifInsight)}
            />
          </div>
        </motion.div>

        {/* Payment reminder time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <Clock size={16} className="text-accent" />
              <div>
                <p className="text-xs text-text-primary font-medium">
                  Hatırlatma Zamanı
                </p>
                <p className="text-[10px] text-text-muted">
                  Son ödeme tarihinden kaç gün önce hatırlat
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {["1", "3", "5", "7"].map((days) => (
                <button
                  key={days}
                  onClick={() => setReminderTime(days)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-medium transition-all",
                    reminderTime === days
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-surface-light/50 text-text-muted border border-card-border"
                  )}
                >
                  {days} gün
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* General settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">
              Genel Ayarlar
            </h2>
          </div>

          <div className="glass-card divide-y divide-card-border">
            {/* Currency */}
            <SettingsSelect
              icon={<Globe size={16} className="text-accent" />}
              label="Para Birimi"
              value={currency}
              options={[
                { value: "TRY", label: "₺ Türk Lirası" },
                { value: "USD", label: "$ Amerikan Doları" },
                { value: "EUR", label: "€ Euro" },
              ]}
              onChange={setCurrency}
            />

            {/* Language */}
            <SettingsSelect
              icon={<Languages size={16} className="text-accent" />}
              label="Uygulama Dili"
              value={language}
              options={[
                { value: "tr", label: "Türkçe" },
                { value: "en", label: "English" },
              ]}
              onChange={setLanguage}
            />
          </div>
        </motion.div>

        {/* About section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="glass-card divide-y divide-card-border">
            <SettingsLink
              icon={<FileText size={16} className="text-text-muted" />}
              label="KVKK Aydınlatma Metni"
            />
            <SettingsLink
              icon={<Lock size={16} className="text-text-muted" />}
              label="Gizlilik Politikası"
            />
            <SettingsLink
              icon={<Shield size={16} className="text-text-muted" />}
              label="Kullanım Koşulları"
            />
            <SettingsLink
              icon={<Info size={16} className="text-text-muted" />}
              label="Hakkında"
              detail={`${APP_NAME} v1.0.0`}
            />
          </div>
        </motion.div>

        {/* Open Banking info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-6"
        >
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-accent/5 border border-accent/10">
            <Shield size={16} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-accent font-medium mb-1">
                Açık Bankacılık Güvencesi
              </p>
              <p className="text-[10px] text-text-muted leading-relaxed">
                Verileriniz BDDK ve TCMB düzenlemeleri kapsamında, BKM
                altyapısı üzerinden güvenle aktarılmaktadır. Hiçbir banka
                şifreniz veya giriş bilginiz paylaşılmaz.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ============ CONSENT MANAGER MODAL ============ */}
      {consentBank && (
        <ConsentManager
          isOpen={!!consentBank}
          onClose={() => setConsentBank(null)}
          bank={consentBank}
        />
      )}

      {/* ============ ADD BANK FLOW MODAL ============ */}
      <AnimatePresence>
        {showAddBank && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleAddBankClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[60] max-w-[430px] mx-auto"
            >
              <div className="bg-surface rounded-t-3xl border-t border-x border-card-border max-h-[85vh] flex flex-col">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full bg-card-border" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-card-border flex-shrink-0">
                  <h2 className="text-base font-semibold text-text-primary">
                    {addBankStep === "select" && "Banka Seçin"}
                    {addBankStep === "permissions" && "Erişim İzinleri"}
                    {addBankStep === "redirect" && "Yönlendirme"}
                    {addBankStep === "success" && "Başarılı!"}
                  </h2>
                  <button
                    onClick={handleAddBankClose}
                    className="p-2 rounded-xl bg-card border border-card-border active:scale-95 transition-transform"
                  >
                    <X size={16} className="text-text-muted" />
                  </button>
                </div>

                {/* Step content */}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4">
                  <AnimatePresence mode="wait">
                    {/* STEP: Bank Selection */}
                    {addBankStep === "select" && (
                      <motion.div
                        key="select"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-2 gap-3"
                      >
                        {availableBanks.map((bank) => {
                          const hhsKod = BANK_ID_TO_HHS[bank.id];
                          const bankConfig = hhsKod ? BANK_CONFIG[hhsKod] : undefined;
                          const logoUrl = bankConfig?.logoUrl;
                          const showLogo = logoUrl && !addBankLogoErrors.has(bank.id);
                          return (
                            <button
                              key={bank.id}
                              onClick={() => handleSelectBank(bank.id)}
                              className="flex items-center gap-3 p-4 rounded-2xl bg-surface-light/30 border border-card-border hover:border-accent/30 active:scale-[0.97] transition-all"
                            >
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                                style={{ backgroundColor: bank.color + "20" }}
                              >
                                {showLogo ? (
                                  <img
                                    src={logoUrl}
                                    alt=""
                                    className="w-full h-full object-contain"
                                    onError={() => setAddBankLogoErrors((prev) => new Set(prev).add(bank.id))}
                                  />
                                ) : (
                                  <span
                                    className="font-bold text-sm"
                                    style={{ color: bank.color }}
                                  >
                                    {bank.letter}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-text-primary font-medium text-left leading-tight">
                                {bank.name}
                              </p>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* STEP: Permission Explanation */}
                    {addBankStep === "permissions" && selectedBankData && (
                      <motion.div
                        key="permissions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <button
                          onClick={() => {
                            setAddBankStep("select");
                            setSelectedBank(null);
                          }}
                          className="flex items-center gap-1.5 mb-4 text-xs text-text-muted hover:text-accent active:scale-95 transition-all"
                        >
                          <ArrowLeft size={14} />
                          <span>Banka Seçimine Dön</span>
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                          {(() => {
                            const hhsKod = BANK_ID_TO_HHS[selectedBankData.id];
                            const bankConfig = hhsKod ? BANK_CONFIG[hhsKod] : undefined;
                            const logoUrl = bankConfig?.logoUrl;
                            const showLogo = logoUrl && !selectedBankLogoError;
                            return (
                              <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
                                style={{
                                  backgroundColor: selectedBankData.color + "20",
                                }}
                              >
                                {showLogo ? (
                                  <img
                                    src={logoUrl}
                                    alt=""
                                    className="w-full h-full object-contain"
                                    onError={() => setSelectedBankLogoError(true)}
                                  />
                                ) : (
                                  <span
                                    className="font-bold text-lg"
                                    style={{ color: selectedBankData.color }}
                                  >
                                    {selectedBankData.letter}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                          <div>
                            <h3 className="text-sm font-semibold text-text-primary">
                              {selectedBankData.name}
                            </h3>
                            <p className="text-[10px] text-text-muted">
                              Aşağıdaki verilere erişim sağlanacaktır
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-5">
                          {[
                            "Hesap bilgileri ve bakiyeler",
                            "Hesap hareketleri",
                            "Kredi kartı bilgileri",
                            "Kart hareketleri ve ekstre",
                          ].map((perm, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/15"
                            >
                              <CheckCircle2
                                size={16}
                                className="text-success flex-shrink-0"
                              />
                              <p className="text-xs text-text-primary">
                                {perm}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/20 mb-5">
                          <Shield
                            size={14}
                            className="text-accent flex-shrink-0 mt-0.5"
                          />
                          <p className="text-[11px] text-accent leading-relaxed">
                            Banka giriş bilgileriniz hiçbir zaman {APP_NAME}{" "}
                            ile paylaşılmaz. Yetkilendirme doğrudan banka
                            üzerinden yapılır.
                          </p>
                        </div>

                        <button
                          onClick={handlePermissionContinue}
                          className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-semibold shadow-glow active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
                        >
                          Devam Et
                          <ArrowRight size={16} />
                        </button>
                      </motion.div>
                    )}

                    {/* STEP: Redirect Loading */}
                    {addBankStep === "redirect" && selectedBankData && (
                      <motion.div
                        key="redirect"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-12"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                          className="mb-4"
                        >
                          <Loader2
                            size={40}
                            className="text-accent"
                          />
                        </motion.div>
                        <h3 className="text-sm font-semibold text-text-primary mb-2">
                          {selectedBankData.name}&apos;na Yönlendiriliyorsunuz
                        </h3>
                        <p className="text-[11px] text-text-muted text-center leading-relaxed">
                          Lütfen bekleyin, güvenli bağlantı kuruluyor...
                        </p>
                      </motion.div>
                    )}

                    {/* STEP: Success */}
                    {addBankStep === "success" && selectedBankData && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-12"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4"
                        >
                          <CheckCircle2 size={32} className="text-success" />
                        </motion.div>
                        <h3 className="text-base font-semibold text-text-primary mb-2">
                          Bağlantı Başarılı!
                        </h3>
                        <p className="text-xs text-text-muted text-center mb-6 leading-relaxed">
                          {selectedBankData.name} hesabınız başarıyla
                          bağlandı. Hesap ve kart bilgileriniz kısa süre
                          içinde görüntülenecek.
                        </p>
                        <p className="text-[10px] text-text-muted italic text-center mb-6">
                          (Bu demo sürümünde gerçek bir bağlantı yapılmaz)
                        </p>
                        <button
                          onClick={handleAddBankClose}
                          className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-semibold shadow-glow active:scale-[0.97] transition-transform"
                        >
                          Tamam
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ SETTINGS HELPER COMPONENTS ============

function SettingsToggle({
  icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-primary font-medium">{label}</p>
        <p className="text-[10px] text-text-muted">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
          enabled ? "bg-accent" : "bg-surface-light"
        )}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md",
            enabled ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function SettingsSelect({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex-shrink-0">{icon}</div>
      <p className="flex-1 text-xs text-text-primary font-medium">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-light/50 border border-card-border rounded-lg px-3 py-1.5 text-xs text-text-primary appearance-none cursor-pointer outline-none focus:border-accent/50 transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SettingsLink({
  icon,
  label,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  detail?: string;
}) {
  return (
    <button className="w-full flex items-center gap-3 p-4 active:bg-surface-light/20 transition-colors">
      <div className="flex-shrink-0">{icon}</div>
      <p className="flex-1 text-xs text-text-primary font-medium text-left">
        {label}
      </p>
      {detail && (
        <span className="text-[10px] text-text-muted">{detail}</span>
      )}
      <ChevronRight size={14} className="text-text-muted" />
    </button>
  );
}
