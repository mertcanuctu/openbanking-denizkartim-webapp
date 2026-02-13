import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1628",
          50: "#1E2D45",
          100: "#162238",
          200: "#0F1A2C",
          300: "#0A1628",
          400: "#070F1C",
          500: "#040A12",
        },
        accent: {
          DEFAULT: "#0EA5E9",
          light: "#38BDF8",
          dark: "#0284C7",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FCA5A5",
          dark: "#DC2626",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#6EE7B7",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          dark: "#D97706",
        },
        surface: {
          DEFAULT: "#111827",
          light: "#1F2937",
          dark: "#0D1117",
        },
        card: "rgba(255,255,255,0.05)",
        "card-hover": "rgba(255,255,255,0.08)",
        "card-border": "rgba(255,255,255,0.1)",
        "text-primary": "#F9FAFB",
        "text-secondary": "#9CA3AF",
        "text-muted": "#6B7280",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "SF Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-navy": "linear-gradient(to bottom, #0A1628, #050D18)",
        "gradient-card":
          "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        "gradient-accent":
          "linear-gradient(135deg, #0EA5E9, #6366F1)",
        "gradient-ai":
          "linear-gradient(135deg, #8B5CF6, #0EA5E9)",
        "gradient-danger":
          "linear-gradient(135deg, #EF4444, #F97316)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.2)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(14, 165, 233, 0.3)",
        "glow-sm": "0 0 10px rgba(14, 165, 233, 0.2)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s infinite",
        shimmer: "shimmer 2s infinite linear",
        "bounce-in": "bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
