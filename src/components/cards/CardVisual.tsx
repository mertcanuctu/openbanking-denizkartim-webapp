"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Wifi } from "lucide-react";
import { maskCardNumber } from "@/lib/utils";
import { CARD_GRADIENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CardVisualProps {
  /** Card product name (e.g. "Axess Platinum") */
  kartUrunAdi: string;
  /** Masked card number */
  kartNo: string;
  /** Card scheme: VISA, MC, TROY */
  kartSema: string;
  /** Bank name displayed on card */
  bankaAdi?: string;
  /** Is virtual card */
  isVirtual?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Enable 3D tilt on hover/touch */
  tiltEnabled?: boolean;
  /** Additional className */
  className?: string;
}

const sizeStyles = {
  sm: { width: 220, height: 139 },
  md: { width: 300, height: 189 },
  lg: { width: 340, height: 214 },
};

function SchemaLogo({
  schema,
  size,
}: {
  schema: string;
  size: "sm" | "md" | "lg";
}) {
  const logoSize = size === "sm" ? "text-[10px]" : size === "md" ? "text-xs" : "text-sm";

  if (schema === "VISA") {
    return (
      <span className={cn("font-bold italic tracking-tight text-white/80", logoSize)}>
        VISA
      </span>
    );
  }
  if (schema === "MC") {
    return (
      <div className="flex items-center -space-x-1.5">
        <div
          className={cn(
            "rounded-full bg-red-500/80",
            size === "sm" ? "w-4 h-4" : "w-5 h-5"
          )}
        />
        <div
          className={cn(
            "rounded-full bg-yellow-500/80",
            size === "sm" ? "w-4 h-4" : "w-5 h-5"
          )}
        />
      </div>
    );
  }
  if (schema === "TROY") {
    return (
      <span className={cn("font-bold tracking-wider text-cyan-300/80", logoSize)}>
        TROY
      </span>
    );
  }
  return <span className={cn("font-medium text-white/60", logoSize)}>{schema}</span>;
}

export function CardVisual({
  kartUrunAdi,
  kartNo,
  kartSema,
  bankaAdi = "Akbank",
  isVirtual = false,
  size = "md",
  tiltEnabled = true,
  className,
}: CardVisualProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const gradient = CARD_GRADIENTS[kartUrunAdi] || {
    from: "#374151",
    to: "#111827",
  };
  const dimensions = sizeStyles[size];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ rotateX, rotateY });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const isSmall = size === "sm";
  const isMedium = size === "md";

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("relative select-none", className)}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Card body */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden border border-white/[0.12] shadow-glass"
        style={{
          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
        }}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-transparent to-black/[0.15]" />

        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Card content */}
        <div className="relative h-full flex flex-col justify-between p-4">
          {/* Top row: Card name + NFC/Virtual badge */}
          <div className="flex justify-between items-start">
            <div>
              <p
                className={cn(
                  "text-white/90 font-medium",
                  isSmall ? "text-[10px]" : "text-xs"
                )}
              >
                {kartUrunAdi}
              </p>
              {isVirtual && (
                <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30">
                  Sanal
                </span>
              )}
            </div>
            <Wifi
              size={isSmall ? 14 : 18}
              className="text-white/40 rotate-90"
            />
          </div>

          {/* Middle: EMV chip + Card number */}
          <div>
            {/* Chip */}
            <div
              className={cn(
                "rounded-md mb-2",
                isSmall ? "w-7 h-5" : "w-9 h-6",
                "bg-gradient-to-br from-yellow-200/80 via-yellow-300/60 to-yellow-600/40"
              )}
              style={{
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
            />
            {/* Card number */}
            <p
              className={cn(
                "text-white/85 font-mono tracking-[0.18em]",
                isSmall ? "text-[11px]" : isMedium ? "text-sm" : "text-base"
              )}
            >
              {maskCardNumber(kartNo)}
            </p>
          </div>

          {/* Bottom: Schema logo + Bank name */}
          <div className="flex justify-between items-end">
            <SchemaLogo schema={kartSema} size={size} />
            <span
              className={cn(
                "font-semibold text-white/50 tracking-wide",
                isSmall ? "text-[8px]" : "text-[10px]"
              )}
            >
              {bankaAdi}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
