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
    <div style={{
      width: "100%",
      background: "var(--ticker-bg)",
      borderBottom: "1px solid var(--glass-border)",
      fontSize: "0.78rem",
      fontFamily: "monospace",
      display: "flex",
      overflow: "hidden",
      whiteSpace: "nowrap",
      height: "32px",
      alignItems: "center",
      color: "var(--ticker-text)"
    }}>
      <div className="news-ticker-content" style={{ paddingLeft: "100px", display: "flex", gap: "3rem" }}>
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>{item.symbol}</span>
            <span style={{ color: "var(--ticker-text)" }}>{item.value}</span>
            <span style={{
              color: item.trend === 'up' ? '#00e676' : item.trend === 'down' ? '#ff1744' : 'var(--text-muted)'
            }}>
              {item.change}
              {item.trend === 'up' ? ' ▲' : item.trend === 'down' ? ' ▼' : ' ▬'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
