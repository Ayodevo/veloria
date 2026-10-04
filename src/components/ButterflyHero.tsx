"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Butterfly {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  hue: number;
  wingPhase: number;
  driftX: number;
  driftY: number;
}

export function ButterflyHero({ bannerImageUrl }: { bannerImageUrl?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const butterfliesRef = useRef<Butterfly[]>([]);
  const animFrameRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn butterflies
    const count = 28;
    butterfliesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 10 + Math.random() * 22,
      speed: 0.3 + Math.random() * 0.7,
      opacity: 0.4 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      hue: 330 + Math.random() * 40, // pinks
      wingPhase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.8,
      driftY: -0.2 - Math.random() * 0.5,
    }));

    function drawButterfly(
      ctx: CanvasRenderingContext2D,
      b: Butterfly,
      t: number
    ) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);
      ctx.globalAlpha = b.opacity;

      const wingFlap = Math.sin(t * 0.06 + b.wingPhase) * 0.8;

      // Wing glow
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, b.size * 1.5);
      grd.addColorStop(0, `hsla(${b.hue}, 80%, 85%, 0.6)`);
      grd.addColorStop(1, `hsla(${b.hue}, 60%, 70%, 0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 0, b.size * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Left upper wing
      ctx.save();
      ctx.scale(wingFlap, 1);
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.9, -b.size * 0.4, b.size * 0.9, b.size * 0.7, -0.4, 0, Math.PI * 2);
      const wg1 = ctx.createLinearGradient(-b.size * 1.5, -b.size, 0, 0);
      wg1.addColorStop(0, `hsla(${b.hue}, 90%, 80%, 0.9)`);
      wg1.addColorStop(0.5, `hsla(${b.hue + 10}, 80%, 70%, 0.7)`);
      wg1.addColorStop(1, `hsla(${b.hue - 20}, 70%, 60%, 0.5)`);
      ctx.fillStyle = wg1;
      ctx.fill();

      // Left lower wing
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.7, b.size * 0.3, b.size * 0.6, b.size * 0.5, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${b.hue}, 80%, 75%, 0.7)`;
      ctx.fill();
      ctx.restore();

      // Right upper wing
      ctx.save();
      ctx.scale(-wingFlap, 1);
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.9, -b.size * 0.4, b.size * 0.9, b.size * 0.7, -0.4, 0, Math.PI * 2);
      const wg2 = ctx.createLinearGradient(-b.size * 1.5, -b.size, 0, 0);
      wg2.addColorStop(0, `hsla(${b.hue}, 90%, 80%, 0.9)`);
      wg2.addColorStop(0.5, `hsla(${b.hue + 10}, 80%, 70%, 0.7)`);
      wg2.addColorStop(1, `hsla(${b.hue - 20}, 70%, 60%, 0.5)`);
      ctx.fillStyle = wg2;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.7, b.size * 0.3, b.size * 0.6, b.size * 0.5, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${b.hue}, 80%, 75%, 0.7)`;
      ctx.fill();
      ctx.restore();

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, b.size * 0.1, b.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${b.hue - 30}, 60%, 40%, 0.9)`;
      ctx.fill();

      ctx.restore();
    }

    let t = 0;
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      butterfliesRef.current.forEach((b) => {
        b.x += b.driftX + Math.sin(t * 0.01 + b.id) * 0.5;
        b.y += b.driftY + Math.cos(t * 0.008 + b.id) * 0.3;
        b.rotation += b.rotSpeed;

        // Wrap around
        if (b.y < -50) b.y = canvas.height + 50;
        if (b.x < -50) b.x = canvas.width + 50;
        if (b.x > canvas.width + 50) b.x = -50;

        drawButterfly(ctx, b, t);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const defaultBannerUrl =
    bannerImageUrl ||
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1920&auto=format&fit=crop";

  return (
    <div className="relative w-full overflow-hidden veloria-hero">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat veloria-hero-bg"
        style={{ backgroundImage: `url('${defaultBannerUrl}')` }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2d0a1a]/70 via-[#c4607a]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0510]/60 via-transparent to-transparent" />

      {/* Shimmer particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="veloria-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Butterfly Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Hero Content */}
      <div className="relative z-20 min-h-[75vh] sm:min-h-[82vh] flex items-center px-6 sm:px-12 lg:px-20 py-16">
        <div
          className={`max-w-xl space-y-6 transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#e8b4c8]" />
            <span className="text-[#e8b4c8] text-xs font-bold uppercase tracking-[0.3em]">
              Bienvenue dans l'univers
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold leading-none veloria-title-glow">
            VELORIA
          </h1>

          {/* Subtitle */}
          <p className="text-[#f4d8e4]/90 text-base sm:text-lg font-light leading-relaxed max-w-sm italic">
            Où la beauté rencontre la féminité,
            <br />
            et chaque détail raconte une histoire...
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/select"
              className="veloria-cta-btn group inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300"
            >
              <span>DÉCOUVRIR</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/shein-concierge"
              className="text-[#f4d8e4]/80 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              Shein Concierge
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 27.5C672 35 768 40 864 37.5C960 35 1056 25 1152 20C1248 15 1344 15 1392 15L1440 15V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
            fill="var(--color-ivory, #fdf6f0)"
          />
        </svg>
      </div>
    </div>
  );
}
