"use client";

import { useEffect } from "react";
import { SiteSettings } from "@/lib/settings";

interface ThemeInjectorProps {
  settings: SiteSettings;
}

export function ThemeInjector({ settings }: ThemeInjectorProps) {
  useEffect(() => {
    const root = document.documentElement;

    if (settings.colors) {
      root.style.setProperty("--color-powder-pink", settings.colors.powder_pink || "#F7DAD7");
      root.style.setProperty("--color-blush-pink", settings.colors.blush_pink || "#EFB9B7");
      root.style.setProperty("--color-rose-gold", settings.colors.rose_gold || "#C9827A");
      root.style.setProperty("--color-deep-rose-gold", settings.colors.deep_rose_gold || "#A85F5A");
      root.style.setProperty("--color-ivory", settings.colors.ivory || "#FFF8F6");
      root.style.setProperty("--color-rose-brown", settings.colors.rose_brown || "#5A3A3A");
      root.style.setProperty("--color-soft-gold", settings.colors.soft_gold || "#D8B48A");

      // Set global background and foreground for the body
      root.style.setProperty("--background", settings.colors.ivory || "#FFF8F6");
      root.style.setProperty("--foreground", settings.colors.rose_brown || "#5A3A3A");
    }

    if (settings.button_radius) {
      root.style.setProperty("--button-radius", settings.button_radius);
    }
  }, [settings]);

  return null;
}
