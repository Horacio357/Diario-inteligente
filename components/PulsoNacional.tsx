"use client";

import { useMemo } from "react";
import { MOCK_PROVINCE_SENTIMENTS } from "@/lib/types";
import { AlertTriangle, CheckCircle, Activity } from "lucide-react";

const PROVINCE_NAMES: Record<string, string> = {
  "buenos-aires": "Buenos Aires",
  "buenos-aires-ciudad": "CABA",
  "cordoba": "Córdoba",
  "santa-fe": "Santa Fe",
  "mendoza": "Mendoza",
  "tucuman": "Tucumán",
  "salta": "Salta",
  "jujuy": "Jujuy",
  "entre-rios": "Entre Ríos",
  "corrientes": "Corrientes",
  "misiones": "Misiones",
  "chaco": "Chaco",
  "formosa": "Formosa",
  "santiago-del-estero": "Sgo. del Estero",
  "la-rioja": "La Rioja",
  "catamarca": "Catamarca",
  "san-juan": "San Juan",
  "san-luis": "San Luis",
  "la-pampa": "La Pampa",
  "neuquen": "Neuquén",
  "rio-negro": "Río Negro",
  "chubut": "Chubut",
  "santa-cruz": "Santa Cruz",
  "tierra-del-fuego": "Tierra del Fuego",
};

interface PulsoNacionalProps {
  provinceData?: Record<string, { sentiment: number; intensity: number }>;
}

export default function PulsoNacional({ provinceData }: PulsoNacionalProps) {
  const data = provinceData ?? MOCK_PROVINCE_SENTIMENTS;

  const stats = useMemo(() => {
    const entries = Object.entries(data);
    const avg = entries.reduce((sum, [, v]) => sum + v.sentiment, 0) / entries.length;

    // Normalize to 0-100 heat points
    const heatPoints = Math.round(((avg + 1) / 2) * 100);

    const consensus = entries.filter(([, v]) => v.sentiment > 0.2);
    const alert = entries.filter(([, v]) => v.sentiment < -0.2);

    // Sort worst first
    const alertZones = alert
      .sort(([, a], [, b]) => a.sentiment - b.sentiment)
      .slice(0, 3)
      .map(([id, v]) => ({
        name: PROVINCE_NAMES[id] ?? id,
        intensity: Math.round(v.intensity * 100),
        sentiment: v.sentiment,
      }));

    // Sort best first
    const consensusZones = consensus
      .sort(([, a], [, b]) => b.sentiment - a.sentiment)
      .slice(0, 2)
      .map(([id, v]) => ({
        name: PROVINCE_NAMES[id] ?? id,
        approval: Math.round(((v.sentiment + 1) / 2) * 100),
      }));

    let label = "Neutro";
    if (avg > 0.35) label = "Consenso";
    else if (avg > 0.1) label = "Moderado";
    else if (avg < -0.35) label = "Crisis";
    else if (avg < -0.1) label = "Tensión";

    return { heatPoints, label, consensus: consensus.length, discontent: alert.length, alertZones, consensusZones, avg };
  }, [data]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

      {/* ─── PULSO NACIONAL ─── */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "12px",
        padding: "1rem 1.1rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.7rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Activity size={12} color="var(--accent-primary)" />
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.6rem", fontWeight: 700, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Pulso Nacional
            </span>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.6rem", fontFamily: "Outfit, sans-serif", fontWeight: 700, color: "#00e676" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00e676", boxShadow: "0 0 6px #00e676" }} />
            EN VIVO
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.2rem" }}>
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "2.5rem", fontWeight: 900, color: "var(--heading-color)", lineHeight: 1 }}>
            {stats.heatPoints}
          </span>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "var(--text-muted)" }}>puntos de calor</div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: stats.avg > 0.1 ? "#00e676" : stats.avg < -0.1 ? "#ff1744" : "#ffc400" }}>
              {stats.label}
            </div>
          </div>
        </div>

        {/* Slider bar */}
        <div style={{ position: "relative", height: "6px", background: "rgba(128,128,128,0.15)", borderRadius: "3px", margin: "0.75rem 0" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${stats.heatPoints}%`,
            background: "linear-gradient(90deg, #ff1744 0%, #ffc400 50%, #00e676 100%)",
            borderRadius: "3px",
            transition: "width 1s ease",
          }} />
          <div style={{
            position: "absolute",
            top: "50%",
            left: `${stats.heatPoints}%`,
            transform: "translate(-50%, -50%)",
            width: "10px", height: "10px",
            borderRadius: "50%",
            background: "var(--heading-color)",
            boxShadow: "0 0 6px rgba(0,0,0,0.2)",
          }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Outfit, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <span>Tensión / Crisis</span>
          <span>Consenso</span>
        </div>
      </div>

      {/* ─── STATS MINI ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "10px",
          padding: "0.75rem 0.9rem",
        }}>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "Outfit, sans-serif", color: "#00e676", lineHeight: 1 }}>
            {stats.consensus}
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", marginTop: "0.2rem" }}>
            Provincias en consenso
          </div>
        </div>
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "10px",
          padding: "0.75rem 0.9rem",
        }}>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "Outfit, sans-serif", color: "#ff1744", lineHeight: 1 }}>
            {stats.discontent}
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", marginTop: "0.2rem" }}>
            Focos de descontento
          </div>
        </div>
      </div>

      {/* ─── ZONAS DE ALERTA ─── */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "12px",
        padding: "0.9rem 1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <AlertTriangle size={12} color="#ff1744" />
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.62rem", fontWeight: 700, color: "#ff1744", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Zonas de Alerta
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {stats.alertZones.map(z => (
            <div key={z.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff1744", flexShrink: 0 }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--heading-color)" }}>
                  {z.name}
                </span>
              </div>
              <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#ff1744" }}>
                Intensidad: {z.intensity}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ZONAS DE CONSENSO ─── */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "12px",
        padding: "0.9rem 1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <CheckCircle size={12} color="#00e676" />
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.62rem", fontWeight: 700, color: "#00e676", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Zonas de Consenso
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {stats.consensusZones.map(z => (
            <div key={z.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00e676", flexShrink: 0 }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--heading-color)" }}>
                  {z.name}
                </span>
              </div>
              <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#00e676" }}>
                Aprobación: {z.approval}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "var(--text-muted)", textAlign: "center" }} suppressHydrationWarning>
        Datos actualizados · {new Date().toLocaleString("es-AR", { weekday: "short", hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
