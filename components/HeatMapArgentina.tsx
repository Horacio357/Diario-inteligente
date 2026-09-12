"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { ARGENTINA_PROVINCES } from "@/lib/argentina-map-data";
import { PersonalityAnalysis, ProvinceMetric } from "@/lib/types";
import { ARCHETYPE_CONFIG, sentimentToColor } from "@/lib/utils";
import ProvinceDetailPanel from "@/components/ProvinceDetailPanel";

interface HeatMapArgentinaProps {
  provinceData?: Record<string, ProvinceMetric>;
  personalityName?: string;
  archetype?: string;
  mode?: "sentiment" | "intensity";
  topic?: string;
  nationalSummary?: string;
  category?: string;
}

interface HoveredProvince {
  id: string;
  name: string;
  capital: string;
  metric: ProvinceMetric;
  x: number;
  y: number;
}

function sentimentToHeatColor(sentiment: number, intensity: number): string {
  // Interpolar entre rojo profundo y verde esmeralda pasando por gris neutro
  const alpha = 0.35 + intensity * 0.55;

  if (sentiment > 0.5) return `rgba(16, 185, 129, ${alpha})`; // verde intenso
  if (sentiment > 0.25) return `rgba(52, 211, 153, ${alpha})`; // verde suave
  if (sentiment > 0.05) return `rgba(110, 231, 183, ${alpha})`; // verde muy suave
  if (sentiment > -0.05) return `rgba(234, 179, 8, ${alpha})`; // amarillo/neutro
  if (sentiment > -0.25) return `rgba(251, 146, 60, ${alpha})`; // naranja
  if (sentiment > -0.5) return `rgba(239, 68, 68, ${alpha})`; // rojo suave
  return `rgba(220, 38, 38, ${alpha})`; // rojo intenso
}

function sentimentToStroke(sentiment: number): string {
  if (sentiment > 0.2) return "rgba(52, 211, 153, 0.6)";
  if (sentiment > -0.2) return "rgba(234, 179, 8, 0.6)";
  return "rgba(239, 68, 68, 0.6)";
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function HeatMapArgentina({ provinceData, personalityName, archetype = "hero", mode = "sentiment", topic, nationalSummary, category }: HeatMapArgentinaProps) {
  const [hovered, setHovered] = useState<HoveredProvince | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getMetric = (id: string): ProvinceMetric | null => {
    if (!provinceData) return null;
    if (provinceData[id]) return provinceData[id];
    const normId = id.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const [key, val] of Object.entries(provinceData)) {
      const normKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
      if (normKey === normId) return val;
    }
    return null;
  };

  const sentimentLabel = (s: number) => {
    if (s > 0.5) return "Muy favorable";
    if (s > 0.2) return "Favorable";
    if (s > -0.2) return "Neutro";
    if (s > -0.5) return "Desfavorable";
    return "Muy desfavorable";
  };

  const nationalAvg = useMemo(() => {
    if (!provinceData) return 0;
    const values = Object.values(provinceData).map(p => p.sentiment);
    return values.reduce((a, b) => a + b, 0) / (values.length || 1);
  }, [provinceData]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00e676", boxShadow: "0 0 8px #00e676" }} />
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.68rem", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Monitor de Humor Social Territorial
          </span>
        </div>
        <h3 style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: "1.15rem", color: "var(--heading-color)", fontWeight: 800, margin: "0 0 0.4rem" }}>
          {topic || personalityName ? `Percepción Territorial de "${topic || personalityName}"` : "Humor Social Nacional · Argentina"}
        </h3>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0, fontFamily: "Merriweather, Georgia, serif", lineHeight: 1.5 }}>
          Este mapa mide la intensidad del debate público y el sentimiento (favorable vs. crítico) provincia por provincia en tiempo real.
        </p>
      </div>

      {/* SVG Mapa */}
      <div style={{ position: "relative" }}>
        <svg
          viewBox="120 88 260 560"
          style={{ width: "100%", height: "auto", maxHeight: "480px" }}
        >
          <defs>
            <filter id="glow-province">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {ARGENTINA_PROVINCES.map(province => {
            const metric = getMetric(province.id);
            const isHovered = hovered?.id === province.id;

            const fillColor = metric
              ? sentimentToHeatColor(metric.sentiment, metric.intensity || 0.7)
              : "rgba(255, 255, 255, 0.05)";
            const strokeColor = metric
              ? sentimentToStroke(metric.sentiment)
              : "rgba(255, 255, 255, 0.12)";

            return (
              <g key={province.id}>
                <path
                  d={province.path}
                  fill={fillColor}
                  stroke={isHovered ? "var(--accent-primary)" : strokeColor}
                  strokeWidth={isHovered ? 2.5 : 0.8}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    filter: isHovered ? "url(#glow-province)" : "none",
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                    transformOrigin: `${province.cx}px ${province.cy}px`,
                  }}
                  onMouseEnter={e => {
                    if (metric) {
                      const rect = (e.target as SVGPathElement).getBoundingClientRect();
                      setHovered({
                        id: province.id,
                        name: province.name,
                        capital: province.capital,
                        metric,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    if (topic || personalityName) {
                      setSelectedProvince({ id: province.id, name: province.name });
                    }
                  }}
                />
                {/* Labels de TODAS las provincias */}
                {(() => {
                  // Abreviaciones para nombres largos que no caben en el polígono
                  const ABBR: Record<string, string[]> = {
                    "buenos-aires": ["Buenos", "Aires"],
                    "buenos-aires-ciudad": ["CABA"],
                    "catamarca": ["Cata-", "marca"],
                    "corrientes": ["Corr."],
                    "entre-rios": ["E. Ríos"],
                    "formosa": ["Formosa"],
                    "la-pampa": ["L. Pampa"],
                    "la-rioja": ["La Rioja"],
                    "mendoza": ["Mendoza"],
                    "misiones": ["Mis."],
                    "neuquen": ["Neuquén"],
                    "rio-negro": ["R. Negro"],
                    "san-juan": ["S. Juan"],
                    "san-luis": ["S. Luis"],
                    "santa-cruz": ["Sta Cruz"],
                    "santa-fe": ["Sta. Fe"],
                    "santiago-del-estero": ["Stgo.", "Estero"],
                    "tierra-del-fuego": ["T. Fuego"],
                    "tucuman": ["Tucumán"],
                    "chaco": ["Chaco"],
                    "chubut": ["Chubut"],
                    "cordoba": ["Córdoba"],
                    "jujuy": ["Jujuy"],
                    "salta": ["Salta"],
                  };
                  const lines = ABBR[province.id] || [province.name];
                  const fontSize = lines[0].length > 7 ? 4 : 5;
                  const lineHeight = fontSize + 1.5;
                  const totalH = lines.length * lineHeight;
                  return (
                    <text
                      x={province.cx}
                      y={province.cy - totalH / 2 + lineHeight / 2}
                      textAnchor="middle"
                      fill={isHovered ? "var(--accent-primary)" : "var(--heading-color)"}
                      fontSize={fontSize}
                      fontFamily="Outfit, sans-serif"
                      fontWeight={isHovered ? 900 : 700}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {lines.map((line, i) => (
                        <tspan key={i} x={province.cx} dy={i === 0 ? 0 : lineHeight}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  );
                })()}
              </g>
            );
          })}
        </svg>

        {/* Tooltip flotante con alto contraste en todos los temas */}
        {mounted && hovered && createPortal(
          <div style={{
            position: "fixed",
            left: hovered.x,
            top: hovered.y - 12,
            transform: "translate(-50%, -100%)",
            background: "var(--card-bg)",
            border: `2px solid ${sentimentToColor(hovered.metric.sentiment)}`,
            borderRadius: "12px",
            padding: "0.85rem 1.1rem",
            zIndex: 999,
            minWidth: "220px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
            animation: "fadeInUp 0.15s ease both",
            pointerEvents: "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
              <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "var(--heading-color)" }}>
                {hovered.name}
              </span>
              {hovered.metric.dominantArchetype && (
                <span style={{ fontSize: "0.85rem", background: "rgba(0,0,0,0.05)", padding: "2px 6px", borderRadius: "6px" }}>
                  {ARCHETYPE_CONFIG[hovered.metric.dominantArchetype]?.emoji}
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.65rem", fontFamily: "Inter, sans-serif" }}>
              Capital: {hovered.capital}
            </div>

            {/* Sentimiento */}
            <div style={{ marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Sentimiento</span>
                <span style={{
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  color: sentimentToColor(hovered.metric.sentiment),
                  fontFamily: "Outfit, sans-serif"
                }}>
                  {sentimentLabel(hovered.metric.sentiment)}
                </span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.1)", borderRadius: "100px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${((hovered.metric.sentiment + 1) / 2) * 100}%`,
                    background: sentimentToColor(hovered.metric.sentiment),
                    borderRadius: "100px"
                  }}
                />
              </div>
            </div>

            {/* Intensidad */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Intensidad de Debate</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--heading-color)", fontFamily: "Outfit, sans-serif" }}>
                  {Math.round(hovered.metric.intensity * 100)}%
                </span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.1)", borderRadius: "100px", overflow: "hidden" }}>
                <div
                  style={{ height: "100%", width: `${hovered.metric.intensity * 100}%`, background: "var(--accent-primary)", borderRadius: "100px" }}
                />
              </div>
            </div>

            {hovered.metric.dominantArchetype && (
              <div style={{ marginTop: "0.6rem", paddingTop: "0.45rem", borderTop: "1px dashed var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>Arquetipo:</span>
                <span style={{ fontSize: "0.78rem", color: ARCHETYPE_CONFIG[hovered.metric.dominantArchetype]?.color, fontWeight: 800, fontFamily: "Outfit, sans-serif" }}>
                  {ARCHETYPE_CONFIG[hovered.metric.dominantArchetype]?.label}
                </span>
              </div>
            )}
          </div>,
          document.body
        )}
      </div>

      {/* Leyenda del mapa */}
      <div style={{ marginTop: "1rem" }}>
        <div style={{ width: "100%", height: "6px", background: "linear-gradient(to right, #ef4444, #eab308, #10b981)", borderRadius: "3px", marginBottom: "0.5rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif" }}>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>🔴 Muy desfavorable</span>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>🟡 Neutro / Moderado</span>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>🟢 Muy favorable</span>
        </div>
      </div>

      {/* Promedio Nacional */}
      {provinceData && (
        <div style={{
          marginTop: "0.75rem",
          padding: "0.75rem 1rem",
          background: "var(--card-bg)",
          borderRadius: "12px",
          border: "1px solid var(--glass-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>Aprobación Nacional Promedio</span>
          <span style={{ fontSize: "0.95rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", color: sentimentToColor(nationalAvg) }}>
            {sentimentLabel(nationalAvg)} ({Math.round(((nationalAvg + 1) / 2) * 100)}%)
          </span>
        </div>
      )}

      {/* CTA para medir cualquier concepto con IA */}
      <div style={{
        marginTop: "1rem",
        padding: "0.85rem 1rem",
        background: "rgba(0, 212, 255, 0.06)",
        border: "1px solid var(--accent-primary)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        flexWrap: "wrap"
      }}>
        <div style={{ flex: 1, minWidth: "220px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--heading-color)", fontFamily: "Outfit, sans-serif" }}>
            💡 ¿Querés medir la percepción de otro tema o personalidad?
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", marginTop: "0.1rem" }}>
            Ingresá cualquier concepto o figura en nuestro Analizador IA para proyectarlo en el mapa.
          </div>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById("analizador-ia");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          style={{
            background: "var(--accent-primary)",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "0.45rem 0.9rem",
            fontSize: "0.75rem",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 800,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          🔍 Medir cualquier concepto con IA ↓
        </button>
      </div>

      {/* Panel de detalle provincial */}
      <ProvinceDetailPanel
        isOpen={!!selectedProvince}
        onClose={() => setSelectedProvince(null)}
        provinceName={selectedProvince?.name || ""}
        provinceId={selectedProvince?.id || ""}
        topic={topic || personalityName || ""}
        nationalSentiment={nationalAvg}
        nationalSummary={nationalSummary || ""}
        category={category}
      />
    </div>
  );
}
