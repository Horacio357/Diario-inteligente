"use client";

import React, { useState, useEffect } from 'react';

const mockFinanceData = [
  { symbol: "DÓLAR BLUE", value: "$1.400,00", change: "+1.2%", trend: "up" },
  { symbol: "RIESGO PAÍS", value: "1.450 pts", change: "-2.1%", trend: "down" },
  { symbol: "MERVAL", value: "1.250.000", change: "+0.5%", trend: "up" },
  { symbol: "BITCOIN", value: "US$ 64.200", change: "-1.8%", trend: "down" },
  { symbol: "INFLACIÓN (EST.)", value: "4.5%", change: "0.0%", trend: "neutral" },
];

export default function FinanceTicker() {
  const [items, setItems] = useState(mockFinanceData);

  useEffect(() => {
    async function fetchRiesgoPais() {
      try {
        const res = await fetch("/api/riesgo-pais");
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            const val = json.data.ultimo;
            const variation = json.data.variacion || 0;
            const trend = json.data.tendencia || "neutro";
            
            setItems(prev => prev.map(item => {
              if (item.symbol === "RIESGO PAÍS") {
                const trendMapped = trend === "alza" ? "up" : trend === "baja" ? "down" : "neutral";
                const changeStr = variation >= 0 ? `+${variation}%` : `${variation}%`;
                return {
                  ...item,
                  value: `${val} pts`,
                  change: changeStr,
                  trend: trendMapped
                };
              }
              return item;
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching live Riesgo Pais:", err);
      }
    }
    fetchRiesgoPais();
  }, []);

  useEffect(() => {
    // Simulamos una actualización en tiempo real del dólar blue cada 30 segundos
    const interval = setInterval(() => {
      setItems(prev => prev.map(item => {
        if (item.symbol === "DÓLAR BLUE") {
          return {
            ...item,
            value: `$1.40${Math.floor(Math.random() * 10)},00`,
            change: `${(Math.random() * 2 - 1).toFixed(1)}%`,
            trend: Math.random() > 0.5 ? "up" : "down"
          };
        }
        return item;
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 text-xs sm:text-sm font-mono flex overflow-hidden whitespace-nowrap h-8 items-center text-slate-300">
      <div className="news-ticker-content" style={{ paddingLeft: "100px", display: "flex", gap: "3rem" }}>
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">{item.symbol}</span>
            <span>{item.value}</span>
            <span className={
              item.trend === 'up' ? 'text-emerald-400' :
              item.trend === 'down' ? 'text-red-400' : 'text-slate-400'
            }>
              {item.change}
              {item.trend === 'up' ? ' ▲' : item.trend === 'down' ? ' ▼' : ' ▬'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
