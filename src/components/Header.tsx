"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Heart, Search, X, Menu } from "lucide-react";

interface HeaderProps {
  siteName?: string;
  logoUrl?: string;
  tagline?: { fr: string; ar: string };
  onOpenCart?: () => void;
}

export function Header({
  siteName = "VELORIA",
  logoUrl = "/logo.png",
  tagline,
  onOpenCart,
}: HeaderProps) {
  const { locale, t } = useLanguage();
  const { cartCount, wishlist } = useCart();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/select?cat=beaute", label: "Beauté" },
    { href: "/select?cat=mode", label: "Mode" },
    { href: "/select?cat=lifestyle", label: "Life Style" },
    { href: "/select", label: "Nouveautés" },
    { href: "/shein-concierge", label: "Promotions" },
    { href: "/faq", label: "À propos" },
  ];

  return (
    <header
      className="sticky top-0 z-30 w-full"
      style={{
        background: "linear-gradient(180deg, #f2c4cb 0%, #edb8c0 100%)",
        boxShadow: "0 2px 12px rgba(180, 80, 100, 0.08)",
      }}
    >
      {/* ════════════════════════════════
          TOP ROW: Search | Logo | Icons
      ════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-[68px] sm:h-[80px]">

          {/* LEFT — Search */}
          <div className="flex items-center">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/60 w-full max-w-[200px] sm:max-w-[240px]">
                <Search className="w-3.5 h-3.5 text-[#8b3a4a] shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-transparent text-[13px] text-[#6b2535] placeholder-[#b07080] outline-none w-full"
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-3.5 h-3.5 text-[#8b3a4a]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-[#8b3a4a] hover:text-[#6b2535] transition-colors group"
              >
                <Search className="w-[18px] h-[18px]" />
                <span className="hidden sm:inline text-[13px] text-[#a06070] group-hover:text-[#8b3a4a] transition-colors">
                  Rechercher...
                </span>
              </button>
            )}
          </div>

          {/* CENTER — Logo */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center py-2 group select-none"
          >
            {/* Butterfly SVG */}
            <svg
              width="28"
              height="18"
              viewBox="0 0 28 18"
              fill="none"
              className="mb-0.5 group-hover:scale-110 transition-transform duration-300"
            >
              {/* Left wings */}
              <path
                d="M14 9 C10 5, 2 2, 1 7 C0 12, 7 13, 14 9Z"
                fill="#9b3a52"
                opacity="0.85"
              />
              <path
                d="M14 9 C9 10, 3 16, 5 17 C8 18, 12 14, 14 9Z"
                fill="#b04060"
                opacity="0.7"
              />
              {/* Right wings */}
              <path
                d="M14 9 C18 5, 26 2, 27 7 C28 12, 21 13, 14 9Z"
                fill="#9b3a52"
                opacity="0.85"
              />
              <path
                d="M14 9 C19 10, 25 16, 23 17 C20 18, 16 14, 14 9Z"
                fill="#b04060"
                opacity="0.7"
              />
              {/* Body */}
              <ellipse cx="14" cy="9" rx="1.2" ry="5" fill="#7a2840" />
            </svg>

            {/* VELORIA wordmark */}
            <span
              className="font-serif font-bold tracking-[0.18em] leading-none text-[#7a2840] group-hover:text-[#5a1a2e] transition-colors"
              style={{ fontSize: "clamp(22px, 4vw, 30px)", letterSpacing: "0.18em" }}
            >
              VELORIA
            </span>

            {/* Tagline */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[#a06070]" style={{ fontSize: "7px" }}>◆</span>
              <span
                className="text-[#a06070] font-light tracking-[0.12em] uppercase"
                style={{ fontSize: "8px", letterSpacing: "0.15em" }}
              >
                Beauty
              </span>
              <span className="text-[#a06070]" style={{ fontSize: "7px" }}>◆</span>
              <span
                className="text-[#a06070] font-light tracking-[0.12em] uppercase"
                style={{ fontSize: "8px", letterSpacing: "0.15em" }}
              >
                Fashion
              </span>
              <span className="text-[#a06070]" style={{ fontSize: "7px" }}>◆</span>
              <span
                className="text-[#a06070] font-light tracking-[0.12em] uppercase"
                style={{ fontSize: "8px", letterSpacing: "0.15em" }}
              >
                Life Style
              </span>
              <span className="text-[#a06070]" style={{ fontSize: "7px" }}>◆</span>
            </div>
          </Link>

          {/* RIGHT — Icons */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            {/* Wishlist */}
            <Link
              href="/select"
              className="relative text-[#8b3a4a] hover:text-[#5a1a2e] transition-colors hover:scale-110 transform duration-200"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={1.6} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#7a2840] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="relative text-[#8b3a4a] hover:text-[#5a1a2e] transition-colors hover:scale-110 transform duration-200"
              title="Panier"
            >
              <ShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#7a2840] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#8b3a4a] hover:text-[#5a1a2e] transition-colors p-1"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* ════════════════════════════════
            BOTTOM ROW: Navigation
        ════════════════════════════════ */}
        <nav
          className="hidden md:flex items-center justify-center gap-0 border-t"
          style={{ borderColor: "rgba(155, 58, 82, 0.15)" }}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("?")[0]);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 lg:px-6 py-3 text-[13px] font-medium transition-colors duration-200 group"
                style={{ color: isActive ? "#7a2840" : "#9b5060" }}
              >
                {link.label}

                {/* Active underline */}
                <span
                  className="absolute bottom-0 left-4 lg:left-6 right-4 lg:right-6 h-[2px] rounded-full transition-all duration-300"
                  style={{
                    background: "#7a2840",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  }}
                />

                {/* Hover underline */}
                <span
                  className="absolute bottom-0 left-4 lg:left-6 right-4 lg:right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-60 transition-all duration-300"
                  style={{ background: "#7a2840", transform: "scaleX(0.6)" }}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ════════════════════════════════
          MOBILE MENU DRAWER
      ════════════════════════════════ */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t px-4 py-4 space-y-1"
          style={{
            borderColor: "rgba(155, 58, 82, 0.15)",
            background: "rgba(242, 196, 203, 0.97)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 px-2 border-b text-[14px] font-medium"
              style={{
                borderColor: "rgba(155, 58, 82, 0.12)",
                color: "#7a2840",
              }}
            >
              <span>{link.label}</span>
              <span className="text-[#a06070] text-xs">→</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
