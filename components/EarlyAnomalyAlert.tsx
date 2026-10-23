"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight, ShieldCheck, ChevronRight, X } from "lucide-react";
import { getDailyAnomalyAlert, DailyAnomalyAlert } from "@/lib/provincesData";

export default function EarlyAnomalyAlert() {
  const [dismissed, setDismissed] = useState(false);
  const alertData: DailyAnomalyAlert = getDailyAnomalyAlert();

  if (dismissed) return null;

  const isDrop = alertData.direction === "caida";
  const badgeColor = isDrop ? "#ef4444" : "#10b981";

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderLeft: `4px solid ${badgeColor}`,
        borderRadius: "12px",
        padding: "0.85rem 1.15rem",
        marginBottom: "1.25rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", flex: 1, minWidth: "260px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: isDrop ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "2px",
            }}
          >
            <Zap size={16} color={badgeColor} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
              <span
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: badgeColor,
                }}
              >
                ⚡ Alerta Temprana del Día · Talos Data Lab
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 700,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "100px",
                  background: isDrop ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                  color: badgeColor,
                }}
              >
                {alertData.deltaPoints > 0 ? `+${alertData.deltaPoints}` : alertData.deltaPoints} pts ({alertData.timeframe})
              </span>
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
                · {alertData.auditedInteractions.toLocaleString("es-AR")} señales territoriales
              </span>
            </div>

            <div
              style={{
                fontFamily: "Merriweather, Georgia, serif",
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "var(--heading-color)",
                lineHeight: 1.35,
                marginBottom: "0.3rem",
              }}
            >
              {alertData.headline}
            </div>

            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                margin: 0,
                lineHeight: 1.45,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {alertData.explanation}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", alignSelf: "center" }}>
          <Link
            href={`/provincia/${alertData.provinceSlug}`}
            style={{
              background: "var(--accent-primary)",
              color: "#ffffff",
              textDecoration: "none",
              padding: "0.45rem 0.85rem",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 800,
              fontFamily: "Outfit, sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "opacity 0.2s ease",
            }}
          >
            <span>Ver Radiografía Provincial</span>
            <ArrowRight size={13} />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            title="Ocultar alerta del día"
            aria-label="Cerrar alerta"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.35rem",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
