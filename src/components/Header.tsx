"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Heart, Globe, Menu, X, Sparkles } from "lucide-react";

interface HeaderProps {
  siteName?: string;
  logoUrl?: string;
  tagline?: { fr: string; ar: string };
  onOpenCart?: () => void;
}

export function Header({ siteName = "VELORIA", logoUrl = "/logo.png", tagline, onOpenCart }: HeaderProps) {
  const { locale, setLocale, t, getTrans } = useLanguage();
  const { cartCount, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/select", label: t("nav.select") },
    { href: "/shein-concierge", label: t("nav.shein") },
    { href: "/special-order", label: t("nav.special") },
    { href: "/tracking", label: t("nav.tracking") },
    { href: "/faq", label: t("nav.faq") },
  ];

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[var(--color-ivory)]/85 border-b border-[var(--color-powder-pink)] shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[var(--color-rose-brown)] hover:text-[var(--color-rose-gold)] transition-colors"
          aria-label="Menu navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center group py-1">
          <img
            src={logoUrl || "/logo.png"}
            alt={siteName || "VELORIA"}
            className="h-12 sm:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-rose-brown)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[var(--color-rose-gold)] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--color-rose-gold)] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions: Language, Wishlist, Cart */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLocale(locale === "fr" ? "ar" : "fr")}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-[var(--color-blush-pink)] text-[var(--color-rose-brown)] hover:bg-[var(--color-powder-pink)]/50 transition-all"
            title="Changer de langue / تغيير اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--color-rose-gold)]" />
            <span>{locale === "fr" ? "العربية" : "FR"}</span>
          </button>

          {/* Wishlist Link */}
          <Link
            href="/select"
            className="relative p-2 text-[var(--color-rose-brown)] hover:text-[var(--color-rose-gold)] transition-colors"
            title={t("nav.wishlist")}
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-rose-gold)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Bag Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-xs font-semibold hover:bg-[var(--color-rose-gold)] transition-all shadow-sm group"
          >
            <ShoppingBag className="w-4 h-4 text-[var(--color-powder-pink)] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">{t("nav.cart")}</span>
            <span className="w-5 h-5 bg-white text-[var(--color-deep-rose-gold)] text-[11px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--color-ivory)] border-b border-[var(--color-powder-pink)] px-4 py-6 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4 text-base font-medium text-[var(--color-rose-brown)]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[var(--color-powder-pink)]/40 hover:text-[var(--color-rose-gold)] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <Sparkles className="w-4 h-4 text-[var(--color-soft-gold)]" />
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
