"use client";

import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";
import { CANONICAL_ECONOMIC_FALLBACK, EconomicIndicator } from "@/lib/economicData";

export default function MarketIndicatorsBox() {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>(CANONICAL_ECONOMIC_FALLBACK);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/indicadores");
      if (res.ok) {
        const json = await res.json();
        if (json?.indicators) {
          setIndicators(json.indicators);
          if (json.timestamp) {
            const d = new Date(json.timestamp);
            setUpdatedAt(d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }));
          }
        }
      }
    } catch {
      // Usa fallback canónico sin romper
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const blue = indicators.find((i) => i.id === "dolar-blue") || CANONICAL_ECONOMIC_FALLBACK[0];
  const oficial = indicators.find((i) => i.id === "dolar-oficial") || CANONICAL_ECONOMIC_FALLBACK[1];
  const riesgo = indicators.find((i) => i.id === "riesgo-pais") || CANONICAL_ECONOMIC_FALLBACK[3];
  const merval = indicators.find((i) => i.id === "merval") || CANONICAL_ECONOMIC_FALLBACK[4];
  const ipc = indicators.find((i) => i.id === "inflacion-mensual") || CANONICAL_ECONOMIC_FALLBACK[5];

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.25rem",
        border: "1px solid var(--glass-border)",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <TrendingUp size={14} color="var(--accent-primary)" />
          <span
            style={{
              fontSize: "0.62rem",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 800,
              color: "var(--accent-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            INDICADORES OFICIALES
          </span>
        </div>
        {updatedAt && (
          <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
            {updatedAt} hs
          </span>
        )}
      </div>

      <h4 style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: "0.92rem", fontWeight: 800, color: "var(--heading-color)" }}>
        Cotizaciones & Riesgo País
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.75rem", fontFamily: "Merriweather, Georgia, serif" }}>
        {/* Oficial */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--glass-border)", paddingBottom: "0.3rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Dólar Oficial:</span>
          <b style={{ color: "var(--heading-color)" }}>
            {oficial.value}{" "}
            <span style={{ color: oficial.trend === "up" ? "#00e676" : "#ff1744", fontSize: "0.68rem" }}>
              {oficial.change}
            </span>
          </b>
        </div>

        {/* Blue */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--glass-border)", paddingBottom: "0.3rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Dólar Blue:</span>
          <b style={{ color: "var(--heading-color)" }}>
            {blue.value}{" "}
            <span style={{ color: blue.trend === "up" ? "#00e676" : "#ff1744", fontSize: "0.68rem" }}>
              {blue.change}
            </span>
          </b>
        </div>

        {/* Riesgo País */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--glass-border)", paddingBottom: "0.3rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Riesgo País:</span>
          <b style={{ color: "var(--heading-color)" }}>
            {riesgo.value}{" "}
            <span style={{ color: riesgo.trend === "down" ? "#00e676" : "#ff1744", fontSize: "0.68rem" }}>
              {riesgo.change}
            </span>
          </b>
        </div>

        {/* Merval */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--glass-border)", paddingBottom: "0.3rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>S&P Merval:</span>
          <b style={{ color: "var(--heading-color)" }}>
            {merval.value}{" "}
            <span style={{ color: merval.trend === "up" ? "#00e676" : "#ff1744", fontSize: "0.68rem" }}>
              {merval.change}
            </span>
          </b>
        </div>

        {/* Inflación INDEC */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)" }}>IPC Mensual:</span>
          <b style={{ color: "var(--heading-color)" }}>
            {ipc.value}{" "}
            <span style={{ color: "var(--text-muted)", fontSize: "0.65rem", fontWeight: 400 }}>
              (INDEC)
            </span>
          </b>
        </div>
      </div>

      <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", paddingTop: "0.3rem", borderTop: "1px solid var(--glass-border)" }}>
        Fuente: BCRA / DolarAPI / JP Morgan. Actualización continua.
      </div>
    </div>
  );
}
