"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Home, Sparkles, ShoppingBag, Search, MessageCircle } from "lucide-react";

interface MobileBottomBarProps {
  onOpenCart: () => void;
  whatsappNumber?: string;
}

export function MobileBottomBar({ onOpenCart, whatsappNumber = "21620123456" }: MobileBottomBarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { cartCount } = useCart();

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Bonjour Veloria ! Je souhaite avoir des informations sur mes commandes.")}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-[var(--color-ivory)]/90 border-t border-[var(--color-powder-pink)] px-2 py-2 shadow-lg">
      <div className="flex items-center justify-around text-center">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            pathname === "/" ? "text-[var(--color-deep-rose-gold)] font-bold" : "text-[var(--color-rose-brown)]/80 hover:text-[var(--color-rose-gold)]"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{t("nav.home")}</span>
        </Link>

        <Link
          href="/select"
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            pathname === "/select" ? "text-[var(--color-deep-rose-gold)] font-bold" : "text-[var(--color-rose-brown)]/80 hover:text-[var(--color-rose-gold)]"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Select</span>
        </Link>

        {/* Cart Trigger */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-1 p-1 text-[10px] font-medium text-[var(--color-rose-brown)]/80 hover:text-[var(--color-rose-gold)] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[var(--color-deep-rose-gold)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>{t("nav.cart")}</span>
        </button>

        <Link
          href="/tracking"
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            pathname === "/tracking" ? "text-[var(--color-deep-rose-gold)] font-bold" : "text-[var(--color-rose-brown)]/80 hover:text-[var(--color-rose-gold)]"
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Suivi</span>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 p-1 text-[10px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
