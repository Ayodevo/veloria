"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Truck,
  Settings,
  Users,
  Layers,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  FileSpreadsheet,
  Image,
  ExternalLink,
} from "lucide-react";

interface AdminLayoutClientProps {
  user: { name: string; role: string; email: string };
  logoUrl?: string;
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Tableau de Bord", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Commandes & Demandes", icon: ShoppingBag },
  { href: "/admin/products", label: "Catalogue Produits", icon: PackageCheck },
  { href: "/admin/categories", label: "Catégories & Marques", icon: Layers },
  { href: "/admin/banners", label: "Bannières & Slider", icon: Image },
  { href: "/admin/shipments", label: "Envois & Batches", icon: Truck },
  { href: "/admin/customers", label: "Clients & Export", icon: Users },
  { href: "/admin/settings", label: "Paramètres du Site", icon: Settings },
];

export function AdminLayoutClient({ user, logoUrl = "/logo.png", children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans flex antialiased"
      style={{ background: "linear-gradient(135deg, #0a0410 0%, #120818 50%, #0a0410 100%)" }}>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ═══════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════ */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background: "linear-gradient(180deg, #1a0520 0%, #120818 60%, #0d0614 100%)",
          borderRight: "1px solid rgba(196, 96, 122, 0.12)",
        }}
      >
        {/* Top section */}
        <div className="flex flex-col">
          {/* Logo area */}
          <div className="px-5 pt-6 pb-5"
            style={{ borderBottom: "1px solid rgba(196, 96, 122, 0.08)" }}>
            <Link href="/admin" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
              <div className="relative">
                <img
                  src={logoUrl || "/logo.png"}
                  alt="VELORIA"
                  className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {/* Glow */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                  style={{ background: "radial-gradient(circle, #e891aa 0%, transparent 70%)", filter: "blur(8px)" }} />
              </div>
              <div>
                <span className="block text-[9px] text-[#c4607a] font-mono tracking-[0.3em] uppercase">
                  Admin v2.0
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  Gestion boutique
                </span>
              </div>
            </Link>
          </div>

          {/* Butterfly separator */}
          <div className="flex items-center justify-center gap-2 py-3 px-5">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196, 96, 122, 0.2))" }} />
            <svg className="w-3.5 h-3.5 text-[#c4607a]/40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10 2 6 4 6 8c0 2 1 3.5 2 4.5C6 13 2 15 2 18c0 2 2 4 6 3.5C9.5 21 11 20 12 19c1 1 2.5 2 4 2.5C20 22 22 20 22 18c0-3-4-5-6-5.5C17 11.5 18 10 18 8c0-4-4-6-6-6z" />
            </svg>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(196, 96, 122, 0.2), transparent)" }} />
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-0.5 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 group ${
                    isActive
                      ? "admin-nav-active text-[#e891aa]"
                      : "text-slate-500 hover:text-slate-200 hover:bg-white/4"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-[#e891aa]" : "text-slate-600 group-hover:text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#c4607a]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User info + Logout */}
        <div className="p-4 space-y-3"
          style={{ borderTop: "1px solid rgba(196, 96, 122, 0.08)" }}>
          {/* User card */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #c4607a 0%, #e891aa 100%)" }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#1a0520]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
              <span className="inline-block text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(196, 96, 122, 0.15)", color: "#e891aa", border: "1px solid rgba(196, 96, 122, 0.25)" }}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3.5 rounded-xl text-slate-400 hover:text-red-300 text-[11px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-red-500/8 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-8 flex items-center justify-between"
          style={{
            background: "rgba(10, 4, 16, 0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(196, 96, 122, 0.08)",
          }}>
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-200">Veloria Admin</p>
              <p className="text-[10px] text-slate-600">Panneau de gestion boutique</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Excel export */}
            <a
              href="/api/admin/export?type=requests"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
              style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(16, 185, 129, 0.08)")}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Excel</span>
            </a>

            {/* View site */}
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e891aa]" />
              <span className="hidden sm:inline">Voir le Site</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
