"use client";

import React, { useState } from "react";
import { SiteSettings } from "@/lib/settings";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeInjector } from "@/components/ThemeInjector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

interface PublicPageWrapperProps {
  settings: SiteSettings;
  children: React.ReactNode;
}

export function PublicPageWrapper({ settings, children }: PublicPageWrapperProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <LanguageProvider>
      <CartProvider>
        <ThemeInjector settings={settings} />
        <div 
          className="min-h-screen flex flex-col text-[var(--color-rose-brown)] font-sans antialiased selection:bg-[var(--color-powder-pink)] selection:text-[var(--color-deep-rose-gold)]"
          style={{ backgroundColor: "var(--color-ivory)" }}
        >
          <Header
            siteName={settings.site_name}
            logoUrl={settings.logo_url}
            tagline={settings.site_tagline}
            onOpenCart={() => setIsCartOpen(true)}
          />

          <main className="flex-1">{children}</main>

          <Footer
            siteName={settings.site_name}
            logoUrl={settings.logo_url}
            tagline={settings.site_tagline}
            slogan={settings.site_slogan}
            sheinNotice={settings.shein_notice}
          />

          <MobileBottomBar
            onOpenCart={() => setIsCartOpen(true)}
            whatsappNumber={settings.whatsapp_number}
          />

          <FloatingWhatsApp
            whatsappNumber={settings.whatsapp_number}
            instagramUrl={settings.instagram_url}
          />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            exchangeRate={settings.exchange_rate_eur_tnd}
            whatsappNumber={settings.whatsapp_number}
            orderMode={settings.order_mode}
          />
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
