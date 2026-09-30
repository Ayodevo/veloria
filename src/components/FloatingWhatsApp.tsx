"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  instagramUrl?: string;
}

export function FloatingWhatsApp({
  whatsappNumber = "21620123456",
  instagramUrl = "https://instagram.com/veloria.tn",
}: FloatingWhatsAppProps) {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Bonjour Veloria ! 🌸 J'ai une question concernant un article.")}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col gap-3">
      {/* Instagram Button */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        title="Instagram @veloria.tn"
      >
        <InstagramIcon className="w-6 h-6" />
      </a>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-13 h-13 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300"
        title="Contacter Veloria sur WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 relative z-10" />
      </a>
    </div>
  );
}
