"use client";

import React, { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   FloatingButterflies
   Renders N animated 3-D butterflies that fly freely across the
   page.  Each butterfly is a pair of SVG wings that flap using
   CSS perspective + rotateY, and the insect drifts along a
   randomised bezier-like path.
   Props:
     count   – number of butterflies (default 8)
     zIndex  – CSS z-index of the canvas wrapper (default 0)
───────────────────────────────────────────────────────────── */

interface ButterflyConfig {
  id: number;
  startX: number;   // vw %
  startY: number;   // vh %
  size: number;     // px
  delay: number;    // s
  duration: number; // s
  driftX: number;   // vw units to drift horizontally
  driftY: number;   // vh units to drift vertically
  flapSpeed: number;// ms per flap
  opacity: number;
  color1: string;
  color2: string;
  rotate: number;   // initial rotation deg
}

const COLORS: [string, string][] = [
  ["#d4708a", "#f0a0b8"],
  ["#c45070", "#e880a0"],
  ["#b06878", "#e8a0b8"],
  ["#ca8090", "#f0b8c8"],
  ["#9a4060", "#d07090"],
  ["#e090a8", "#f8c0d0"],
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generateButterflies(count: number): ButterflyConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const [c1, c2] = COLORS[i % COLORS.length];
    return {
      id: i,
      startX: randomBetween(0, 100),
      startY: randomBetween(0, 100),
      size: randomBetween(20, 40),
      delay: randomBetween(0, 10),
      duration: randomBetween(18, 35),
      driftX: randomBetween(-40, 40),
      driftY: randomBetween(-35, 35),
      flapSpeed: Math.round(randomBetween(380, 750)),
      opacity: randomBetween(0.55, 0.85),
      color1: c1,
      color2: c2,
      rotate: randomBetween(-20, 20),
    };
  });
}

/* SVG butterfly — two wing pairs with 3D perspective flap */
function Butterfly({ cfg }: { cfg: ButterflyConfig }) {
  const { size, flapSpeed, color1, color2, opacity, rotate,
          startX, startY, driftX, driftY, duration, delay } = cfg;

  const animId = `bf-${cfg.id}`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: `${startX}vw`,
        top: `${startY}vh`,
        width: size,
        height: size * 0.7,
        opacity,
        pointerEvents: "none",
        zIndex: 9999,
        transform: `rotate(${rotate}deg)`,
        animation: `bf-drift-${animId} ${duration}s ${delay}s ease-in-out infinite alternate`,
        willChange: "transform",
      }}
    >
      <style>{`
        @keyframes bf-drift-${animId} {
          0%   { transform: rotate(${rotate}deg) translate(0,0); }
          25%  { transform: rotate(${rotate + 8}deg) translate(${driftX * 0.3}vw, ${driftY * 0.4}vh); }
          50%  { transform: rotate(${rotate - 6}deg) translate(${driftX * 0.7}vw, ${driftY * 0.7}vh); }
          75%  { transform: rotate(${rotate + 4}deg) translate(${driftX * 0.9}vw, ${driftY * 0.3}vh); }
          100% { transform: rotate(${rotate - 10}deg) translate(${driftX}vw, ${driftY}vh); }
        }
        @keyframes bf-flap-left-${animId} {
          0%,100% { transform: perspective(120px) rotateY(0deg); }
          50%     { transform: perspective(120px) rotateY(-65deg); }
        }
        @keyframes bf-flap-right-${animId} {
          0%,100% { transform: perspective(120px) rotateY(0deg); }
          50%     { transform: perspective(120px) rotateY(65deg); }
        }
        @keyframes bf-body-bob-${animId} {
          0%,100% { transform: translateY(0px) scaleY(1); }
          50%     { transform: translateY(-1.5px) scaleY(0.95); }
        }
      `}</style>

      <svg
        width={size}
        height={size * 0.7}
        viewBox="0 0 60 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* ── Left upper wing ── */}
        <g style={{ transformOrigin: "30px 21px",
                    animation: `bf-flap-left-${animId} ${flapSpeed}ms ease-in-out infinite` }}>
          <ellipse cx="16" cy="14" rx="15" ry="12"
            fill={color1}
            style={{ filter: `drop-shadow(1px 2px 4px ${color1}88)` }} />
          <ellipse cx="13" cy="12" rx="7" ry="5.5" fill={color2} opacity="0.55" />
        </g>

        {/* ── Left lower wing ── */}
        <g style={{ transformOrigin: "30px 21px",
                    animation: `bf-flap-left-${animId} ${flapSpeed}ms ease-in-out infinite` }}>
          <ellipse cx="16" cy="30" rx="13" ry="9"
            fill={color1} opacity="0.85" />
          <ellipse cx="14" cy="30" rx="6" ry="4" fill={color2} opacity="0.5" />
        </g>

        {/* ── Right upper wing ── */}
        <g style={{ transformOrigin: "30px 21px",
                    animation: `bf-flap-right-${animId} ${flapSpeed}ms ease-in-out infinite` }}>
          <ellipse cx="44" cy="14" rx="15" ry="12"
            fill={color1}
            style={{ filter: `drop-shadow(-1px 2px 4px ${color1}88)` }} />
          <ellipse cx="47" cy="12" rx="7" ry="5.5" fill={color2} opacity="0.55" />
        </g>

        {/* ── Right lower wing ── */}
        <g style={{ transformOrigin: "30px 21px",
                    animation: `bf-flap-right-${animId} ${flapSpeed}ms ease-in-out infinite` }}>
          <ellipse cx="44" cy="30" rx="13" ry="9"
            fill={color1} opacity="0.85" />
          <ellipse cx="46" cy="30" rx="6" ry="4" fill={color2} opacity="0.5" />
        </g>

        {/* ── Body ── */}
        <ellipse cx="30" cy="21" rx="2" ry="11"
          fill="#7a2840"
          style={{ animation: `bf-body-bob-${animId} ${flapSpeed}ms ease-in-out infinite` }} />

        {/* ── Antennae ── */}
        <path d="M28 11 Q24 4 22 2" stroke="#9a4060" strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="22" cy="2" r="1.2" fill="#c4607a" />
        <path d="M32 11 Q36 4 38 2" stroke="#9a4060" strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="38" cy="2" r="1.2" fill="#c4607a" />
      </svg>
    </div>
  );
}

interface FloatingButterfliesProps {
  count?: number;
}

export function FloatingButterflies({ count = 8 }: FloatingButterfliesProps) {
  const butterflies = useRef<ButterflyConfig[]>([]);

  // Generate once (stable across re-renders)
  if (butterflies.current.length === 0) {
    butterflies.current = generateButterflies(count);
  }

  return (
    <>
      {butterflies.current.map((cfg) => (
        <Butterfly key={cfg.id} cfg={cfg} />
      ))}
    </>
  );
}
