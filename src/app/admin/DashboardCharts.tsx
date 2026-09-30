"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const sampleChartData = [
  { name: "Lun", demandes: 4, marge: 65 },
  { name: "Mar", demandes: 7, marge: 110 },
  { name: "Mer", demandes: 5, marge: 85 },
  { name: "Jeu", demandes: 9, marge: 140 },
  { name: "Ven", demandes: 12, marge: 210 },
  { name: "Sam", demandes: 15, marge: 260 },
  { name: "Dim", demandes: 11, marge: 180 },
];

export function DashboardCharts() {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-slate-100">
          Évolution des Demandes & Marges cette Semaine
        </h3>
        <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/40">
          Recharts Live Analytics
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleChartData}>
            <defs>
              <linearGradient id="colorMarge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9827A" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#C9827A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="marge"
              stroke="#C9827A"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMarge)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
