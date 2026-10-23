"use client";

import { useMemo, useState } from "react";
import { MOCK_PROVINCE_SENTIMENTS } from "@/lib/types";
import { AlertTriangle, CheckCircle, Activity, Scale, FileText } from "lucide-react";
import MethodologyModal from "./MethodologyModal";

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

export interface ContrastData {
  mediaSentiment: number;
  citizenSentiment: number;
  divergence: number;
  divergenceLabel: string;
  totalCitizenVotes: number;
}

interface PulsoNacionalProps {
  provinceData?: Record<string, { sentiment: number; intensity?: number } | number | any>;
  contrastData?: ContrastData;
  onOpenVoteModal?: () => void;
  topicName?: string;
}

export default function PulsoNacional({ provinceData, contrastData, onOpenVoteModal, topicName }: PulsoNacionalProps) {
  const [showMethodology, setShowMethodology] = useState(false);
  const data = provinceData ?? MOCK_PROVINCE_SENTIMENTS;

  const stats = useMemo(() => {
    const entries = Object.entries(data);
    if (!entries.length) {
      return { heatPoints: 50, label: "Neutro", consensus: 0, discontent: 0, alertZones: [], consensusZones: [], avg: 0 };
    }

    const getSentiment = (v: any): number => {
      if (typeof v === "number") return v;
      if (v && typeof v.sentiment === "number") return v.sentiment;
      return 0;
    };

    const getIntensity = (v: any): number => {
      if (v && typeof v.intensity === "number") return Math.round(v.intensity * 100);
      return 50;
    };

    const totalSentiment = entries.reduce((sum, [, v]) => sum + getSentiment(v), 0);
    const avg = totalSentiment / entries.length;

    // Normalize to 0-100 heat points
    const heatPoints = Math.max(0, Math.min(100, Math.round(((avg + 1) / 2) * 100)));

    const consensus = entries.filter(([, v]) => getSentiment(v) > 0.2);
    const alert = entries.filter(([, v]) => getSentiment(v) < -0.2);

    // Sort worst first
    const alertZones = alert
      .sort(([, a], [, b]) => getSentiment(a) - getSentiment(b))
      .slice(0, 3)
      .map(([id, v]) => ({
        name: PROVINCE_NAMES[id] ?? id,
        intensity: getIntensity(v),
        sentiment: getSentiment(v),
      }));

    // Sort best first
    const consensusZones = consensus
      .sort(([, a], [, b]) => getSentiment(b) - getSentiment(a))
      .slice(0, 2)
      .map(([id, v]) => ({
        name: PROVINCE_NAMES[id] ?? id,
        approval: Math.round(((getSentiment(v) + 1) / 2) * 100),
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.7rem", flexWrap: "wrap", gap: "0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Activity size={12} color="var(--accent-primary)" />
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.6rem", fontWeight: 700, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Pulso Nacional
            </span>
            <span style={{
              fontSize: "0.55rem",
              background: "rgba(0,212,255,0.08)",
              color: "var(--accent-primary)",
              padding: "0.1rem 0.35rem",
              borderRadius: "4px",
              border: "1px solid rgba(0,212,255,0.2)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Estimación automatizada
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

      {/* ─── CONTRASTE: MEDIOS VS. LECTORES ─── */}
      {contrastData && (
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "12px",
          padding: "0.85rem 1rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Scale size={13} color="var(--accent-primary)" />
              <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.62rem", fontWeight: 700, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Medios vs. Lectores
              </span>
            </div>
            {contrastData.totalCitizenVotes > 0 && (
              <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                {contrastData.totalCitizenVotes} {contrastData.totalCitizenVotes === 1 ? "voto" : "votos"}
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{ background: "rgba(255,255,255,0.02)", padding: "0.45rem 0.6rem", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
              <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>📰 Medios</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)", lineHeight: 1.2 }}>
                {Math.round(((contrastData.mediaSentiment + 1) / 2) * 100)}%
              </div>
            </div>

            <div style={{ background: "rgba(0,212,255,0.04)", padding: "0.45rem 0.6rem", borderRadius: "8px", border: "1px solid rgba(0,212,255,0.2)" }}>
              <div style={{ fontSize: "0.62rem", color: "var(--accent-primary)", fontFamily: "Inter, sans-serif" }}>👥 Lectores</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "var(--accent-primary)", lineHeight: 1.2 }}>
                {Math.round(((contrastData.citizenSentiment + 1) / 2) * 100)}%
              </div>
            </div>
          </div>

          <div style={{
            fontSize: "0.68rem",
            fontFamily: "Inter, sans-serif",
            padding: "0.3rem 0.5rem",
            borderRadius: "6px",
            background: Math.abs(contrastData.divergence) > 12 ? "rgba(255,196,0,0.08)" : "rgba(0,230,118,0.08)",
            color: Math.abs(contrastData.divergence) > 12 ? "#ffc400" : "#00e676",
            border: `1px solid ${Math.abs(contrastData.divergence) > 12 ? "rgba(255,196,0,0.2)" : "rgba(0,230,118,0.2)"}`,
            textAlign: "center",
          }}>
            {contrastData.divergenceLabel}
          </div>

          {/* Botón de Transparencia Metodológica y PDF */}
          <button
            type="button"
            onClick={() => setShowMethodology(true)}
            style={{
              marginTop: "0.5rem",
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
              borderRadius: "8px",
              padding: "0.4rem 0.6rem",
              fontSize: "0.7rem",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "var(--accent-primary)";
              e.currentTarget.style.borderColor = "var(--accent-primary)";
              e.currentTarget.style.background = "rgba(0,212,255,0.05)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--glass-border)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
          >
            <FileText size={12} color="var(--accent-primary)" />
            <span>¿Cómo se calcula? · Fuentes & PDF</span>
          </button>

          {onOpenVoteModal && (
            <button
              type="button"
              onClick={onOpenVoteModal}
              style={{
                marginTop: "0.6rem",
                width: "100%",
                background: "var(--glass-hover)",
                border: "1px solid var(--accent-primary)",
                color: "var(--accent-primary)",
                borderRadius: "8px",
                padding: "0.45rem 0.65rem",
                fontSize: "0.74rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--accent-primary)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--glass-hover)";
                e.currentTarget.style.color = "var(--accent-primary)";
              }}
            >
              <span>🗳️ Emitir Voto Semanal</span>
              <span style={{ fontSize: "0.65rem", opacity: 0.85 }}>(1 por semana)</span>
            </button>
          )}

          {/* Compartir contraste */}
          <div style={{ marginTop: "0.4rem", display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => {
                const text = `📊 Brecha Medios vs. Lectores en Talos Diario: Medios ${Math.round(((contrastData.mediaSentiment + 1) / 2) * 100)}% vs Lectores ${Math.round(((contrastData.citizenSentiment + 1) / 2) * 100)}% (${contrastData.divergenceLabel}). Mirá el mapa y votá en:`;
                const url = typeof window !== "undefined" ? window.location.origin : "https://talosdiario.ar";
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.66rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.2rem 0.4rem",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <span>📲 Compartir este pulso en redes</span>
            </button>
          </div>
        </div>
      )}

      {/* Si aún no hay contrastData pero está disponible el callback del modal */}
      {!contrastData && onOpenVoteModal && (
        <button
          type="button"
          onClick={onOpenVoteModal}
          style={{
            width: "100%",
            background: "var(--glass-hover)",
            border: "1px dashed var(--accent-primary)",
            color: "var(--accent-primary)",
            borderRadius: "8px",
            padding: "0.55rem 0.75rem",
            fontSize: "0.75rem",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--accent-primary)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "var(--glass-hover)";
            e.currentTarget.style.color = "var(--accent-primary)";
          }}
        >
          <span>🗳️ Emitir Voto en el Pulso Semanal</span>
        </button>
      )}

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
          {stats.alertZones.length > 0 ? (
            stats.alertZones.map(z => (
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
            ))
          ) : (
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", padding: "0.2rem 0" }}>
              Sin focos de alerta crítica en el periodo actual.
            </div>
          )}
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
          {stats.consensusZones.length > 0 ? (
            stats.consensusZones.map(z => (
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
            ))
          ) : (
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", padding: "0.2rem 0" }}>
              Sin provincias con consenso marcado.
            </div>
          )}
        </div>
      </div>

      <div style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "0.64rem",
        color: "var(--text-muted)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "0.2rem",
        paddingTop: "0.25rem",
      }} suppressHydrationWarning>
        <span>Índice sintético territorial · Actualización continua ({new Date().toLocaleString("es-AR", { weekday: "short", hour: "2-digit", minute: "2-digit" })} hs)</span>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
          <button
            onClick={() => setShowMethodology(true)}
            style={{ background: "none", border: "none", color: "var(--accent-primary)", fontSize: "0.64rem", cursor: "pointer", textDecoration: "underline", padding: 0 }}
          >
            Descargar informe PDF
          </button>
          <span>·</span>
          <a
            href="/metodologia"
            style={{ color: "var(--accent-primary)", textDecoration: "underline" }}
          >
            Metodología & Fuentes
          </a>
        </div>
      </div>

      {/* MODAL DE METODOLOGÍA, TRANSPARENCIA Y DESCARGA PDF */}
      <MethodologyModal
        isOpen={showMethodology}
        onClose={() => setShowMethodology(false)}
        pdfData={{
          topic: topicName ? topicName.toLowerCase() : "general",
          topicLabel: topicName || "Humor General",
          mediaSentiment: contrastData?.mediaSentiment ?? stats.avg,
          citizenSentiment: contrastData?.citizenSentiment ?? stats.avg,
          divergence: contrastData?.divergence ?? 0,
          divergenceLabel: contrastData?.divergenceLabel ?? "En sincronía con la agenda informativa",
          totalCitizenVotes: contrastData?.totalCitizenVotes ?? 0,
        }}
      />
    </div>
  );
}
