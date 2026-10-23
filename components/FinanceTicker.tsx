"use client";

import React, { useState, useEffect } from "react";
import { CANONICAL_ECONOMIC_FALLBACK, EconomicIndicator } from "@/lib/economicData";

export default function FinanceTicker() {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>(CANONICAL_ECONOMIC_FALLBACK);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    async function fetchIndicators() {
      try {
        const res = await fetch("/api/indicadores");
        if (res.ok) {
          const json = await res.json();
          if (json && json.indicators && Array.isArray(json.indicators)) {
            setIndicators(json.indicators);
            if (json.timestamp) {
              const d = new Date(json.timestamp);
              setLastUpdate(d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }));
            }
          }
        }
      } catch (err) {
        console.warn("Usando datos canónicos para FinanceTicker:", err);
      }
    }

    fetchIndicators();
    // Actualizar de manera controlada cada 5 minutos
    const interval = setInterval(fetchIndicators, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        background: "var(--ticker-bg, #0b1120)",
        borderBottom: "1px solid var(--glass-border, rgba(0, 212, 255, 0.12))",
        fontSize: "0.74rem",
        fontFamily: "'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace",
        display: "flex",
        overflow: "hidden",
        whiteSpace: "nowrap",
        height: "30px",
        alignItems: "center",
        color: "var(--ticker-text, #f1f5f9)",
      }}
    >
      <div
        className="news-ticker-content"
        style={{ paddingLeft: "80px", display: "flex", gap: "2.8rem" }}
      >
        {[...indicators, ...indicators, ...indicators].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span style={{ fontWeight: 700, color: "var(--text-muted, #94a3b8)", fontSize: "0.7rem" }}>
              {item.symbol}
            </span>
            <span style={{ color: "var(--heading-color, #ffffff)", fontWeight: 600 }}>
              {item.value}
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color:
                  item.trend === "up"
                    ? "#00e676"
                    : item.trend === "down"
                    ? "#ff1744"
                    : "var(--text-muted, #94a3b8)",
              }}
            >
              {item.change}
              {item.trend === "up" ? " ▲" : item.trend === "down" ? " ▼" : " ▬"}
            </span>
            <span style={{ fontSize: "0.58rem", color: "rgba(148, 163, 184, 0.5)", marginLeft: "0.15rem" }}>
              ({item.source.split(" ")[0]})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
