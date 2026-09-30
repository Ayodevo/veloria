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
  Search,
  ChevronRight,
  Menu,
  X,
  FileSpreadsheet,
  Image,
} from "lucide-react";

interface AdminLayoutClientProps {
  user: { name: string; role: string; email: string };
  logoUrl?: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({ user, logoUrl = "/logo.png", children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex antialiased">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Admin Logo */}
          <Link href="/admin" className="flex items-center gap-3 group px-1">
            <img
              src={logoUrl || "/logo.png"}
              alt="VELORIA"
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <span className="block text-[10px] text-rose-400 font-mono tracking-widest">
                ADMIN v2.0
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-rose-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-rose-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
              <span className="inline-block text-[10px] font-mono uppercase bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded-md border border-rose-800/40">
                {user.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 text-xs font-medium flex items-center justify-center gap-2 border border-slate-700/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm font-bold text-slate-200 hidden sm:block">
              Gestion Boutique Veloria
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/admin/export?type=requests"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-900 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </a>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Voir le Site Public</span>
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
