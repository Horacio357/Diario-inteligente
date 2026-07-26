"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { ARGENTINA_PROVINCES } from "@/lib/argentina-map-data";
import { PersonalityAnalysis, ProvinceMetric, ArchetypeKey } from "@/lib/types";
import { ARCHETYPE_CONFIG, sentimentToColor } from "@/lib/utils";
import ProvinceDetailPanel from "@/components/ProvinceDetailPanel";

const geoJsonToAppId: Record<string, string> = {
  "02": "buenos-aires-ciudad",
  "06": "buenos-aires",
  "10": "catamarca",
  "22": "chaco",
  "26": "chubut",
  "14": "cordoba",
  "18": "corrientes",
  "30": "entre-rios",
  "34": "formosa",
  "38": "jujuy",
  "42": "la-pampa",
  "46": "la-rioja",
  "50": "mendoza",
  "54": "misiones",
  "58": "neuquen",
  "62": "rio-negro",
  "66": "salta",
  "70": "san-juan",
  "74": "san-luis",
  "78": "santa-cruz",
  "82": "santa-fe",
  "86": "santiago-del-estero",
  "94": "tierra-del-fuego", // Mapea Tierra del Fuego, Antártida e Islas del Atlántico Sur
  "90": "tucuman"
};

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
  const [position, setPosition] = useState({ coordinates: [0, 0] as [number, number], zoom: 1 });
  const [viewMode, setViewMode] = useState<"cyberpunk" | "sentiment">("cyberpunk");

  useEffect(() => {
    setMounted(true);
  }, []);

  const getMetric = (id: string): ProvinceMetric | null => {
    return provinceData?.[id] || null;
  };

  const sentimentLabel = (s: number) => {
    if (s > 0.5) return "Muy favorable";
    if (s > 0.2) return "Favorable";
    if (s > -0.2) return "Neutro";
    if (s > -0.5) return "Desfavorable";
    return "Muy desfavorable";
  };

  const provinceCapitals = useMemo(() => {
    const map: Record<string, string> = {};
    ARGENTINA_PROVINCES.forEach(p => {
      map[p.id] = p.capital;
    });
    return map;
  }, []);

  const nationalAvg = useMemo(() => {
    if (!provinceData) return 0;
    const values = Object.values(provinceData).map(p => p.sentiment);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [provinceData]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/globo-terraqueo-con-mapas-de-continentes.png" alt="Globe Icon" style={{ width: "18px", height: "18px", objectFit: "contain", opacity: 0.8 }} />
          <div className="section-label" style={{ margin: 0 }}>Mapa de Calor Territorial</div>
        </div>
        <h3 style={{ fontFamily: "Outfit", fontSize: "1rem", color: "var(--text-primary)" }}>
          {personalityName ? `Percepción de ${personalityName}` : "Humor Social · Argentina"}
        </h3>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
          Pasa el cursor sobre una provincia · <span style={{ color: "var(--accent-primary)" }}>Click para análisis detallado IA</span>
        </p>
      </div>

      {/* Control panel de modos de visualización */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setViewMode("cyberpunk")}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "8px",
            background: viewMode === "cyberpunk" ? "rgba(0, 255, 102, 0.12)" : "rgba(255,255,255,0.02)",
            color: viewMode === "cyberpunk" ? "#00ff66" : "var(--text-muted)",
            border: `1px solid ${viewMode === "cyberpunk" ? "#00ff66" : "var(--glass-border)"}`,
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          🟢 Ciber-Mapa Neon (Threatbutt)
        </button>
        <button
          onClick={() => setViewMode("sentiment")}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "8px",
            background: viewMode === "sentiment" ? "rgba(0, 212, 255, 0.12)" : "rgba(255,255,255,0.02)",
            color: viewMode === "sentiment" ? "var(--accent-primary)" : "var(--text-muted)",
            border: `1px solid ${viewMode === "sentiment" ? "var(--accent-primary)" : "var(--glass-border)"}`,
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          📊 Térmico Convencional
        </button>
      </div>

      {/* SVG Mapa usando react-simple-maps con Zoom y Pan */}
      <div style={{ position: "relative", overflow: "hidden", background: "rgba(5, 8, 17, 0.4)", borderRadius: "var(--radius-md)", border: "1px solid var(--glass-border)" }}>
        
        {/* Controles de Zoom Flotantes */}
        <div style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          zIndex: 10,
        }}>
          <button 
            onClick={() => setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom + 0.3, 6) }))}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "rgba(10, 14, 26, 0.85)", border: "1px solid var(--glass-border)",
              color: "white", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", fontWeight: "bold",
              backdropFilter: "blur(8px)", transition: "all 0.2s", fontSize: "1.1rem"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-primary)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--glass-border)"}
            title="Acercar"
          >
            +
          </button>
          <button 
            onClick={() => setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom - 0.3, 0.6) }))}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "rgba(10, 14, 26, 0.85)", border: "1px solid var(--glass-border)",
              color: "white", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", fontWeight: "bold",
              backdropFilter: "blur(8px)", transition: "all 0.2s", fontSize: "1.1rem"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-primary)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--glass-border)"}
            title="Alejar"
          >
            -
          </button>
          <button 
            onClick={() => setPosition({ coordinates: [0, 0], zoom: 1 })}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "rgba(10, 14, 26, 0.85)", border: "1px solid var(--glass-border)",
              color: "white", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "0.85rem",
              backdropFilter: "blur(8px)", transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-primary)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--glass-border)"}
            title="Restablecer vista"
          >
            🎯
          </button>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1100, // Escala base
            center: [-63.5, -40] // Centro de proyección original para evitar singularidad polar
          }}
          style={{ width: "100%", height: "auto", maxHeight: "480px" }}
        >
          <defs>
            <filter id="glow-province">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            minZoom={0.5}
            maxZoom={6}
            onMoveEnd={(pos) => setPosition(pos)}
            onMoveStart={() => setHovered(null)}
          >
            <Geographies geography="/argentina-provinces.json">
              {({ geographies, projection }) =>
                geographies.map(geo => {
                  const geoId = geo.properties.id;
                  const appId = geoJsonToAppId[geoId];
                  if (!appId) return null;

                  const metric = getMetric(appId);
                  const isHovered = hovered?.id === appId;
                  const baseColorHex = ARCHETYPE_CONFIG[archetype as ArchetypeKey]?.color || "#34d399";
                  
                  const getThemedColor = (sentiment: number, intensity: number) => {
                    const normalized = (sentiment + 1) / 2;
                    const alpha = 0.15 + (normalized * 0.75) * intensity;
                    return hexToRgba(baseColorHex, alpha);
                  };

                  const getCyberSentimentColor = (sentiment: number) => {
                    if (sentiment > 0.15) return "rgba(0, 255, 102, 0.4)"; // Neon Green
                    if (sentiment < -0.15) return "rgba(255, 0, 85, 0.4)"; // Neon Red
                    return "rgba(255, 183, 0, 0.4)"; // Neon Yellow/Orange
                  };

                  const getCyberSentimentStroke = (sentiment: number) => {
                    if (sentiment > 0.15) return "#00ff66";
                    if (sentiment < -0.15) return "#ff0055";
                    return "#ffb700";
                  };

                  let fillColor = "rgba(255, 255, 255, 0.03)";
                  let strokeColor = "rgba(255, 255, 255, 0.08)";

                  if (viewMode === "cyberpunk") {
                    fillColor = isHovered && metric
                      ? getCyberSentimentColor(metric.sentiment)
                      : "rgba(5, 8, 17, 0.85)";
                    strokeColor = isHovered && metric
                      ? getCyberSentimentStroke(metric.sentiment)
                      : "#39ff14"; // Neon green outline like Threatbutt map
                  } else {
                    fillColor = metric
                      ? getThemedColor(metric.sentiment, metric.intensity)
                      : "rgba(255, 255, 255, 0.03)";
                    strokeColor = metric
                      ? hexToRgba(baseColorHex, 0.5)
                      : "rgba(255, 255, 255, 0.08)";
                  }

                  const capital = provinceCapitals[appId] || "";

                  // Calcular centroide proyectado por D3 para situar las etiquetas de texto
                  const centroidGeo = geoCentroid(geo);
                  const projectedCentroid = projection(centroidGeo);
                  const [cx, cy] = projectedCentroid || [0, 0];

                  const lines = ABBR[appId] || [geo.properties.nombre];
                  const fontSize = lines[0].length > 7 ? 10 : 12; // Tamaño adaptado a la cuadrícula 800x600
                  const lineHeight = fontSize + 2.5;
                  const totalH = lines.length * lineHeight;

                  return (
                    <g key={geo.rsmKey}>
                      <Geography
                        geography={geo}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isHovered ? 2.2 : (viewMode === "cyberpunk" ? 1.0 : 0.8)}
                        style={{
                          default: { outline: "none", transition: "all 0.2s ease" },
                          hover: { 
                            outline: "none", 
                            fill: viewMode === "cyberpunk" && metric ? getCyberSentimentColor(metric.sentiment) : fillColor, 
                            stroke: viewMode === "cyberpunk" && metric ? getCyberSentimentStroke(metric.sentiment) : "var(--accent-primary)", 
                            strokeWidth: 2.2, 
                            cursor: "pointer", 
                            filter: "url(#glow-province)" 
                          },
                          pressed: { outline: "none" }
                        }}
                        onMouseEnter={e => {
                          if (metric) {
                            const rect = (e.target as SVGPathElement).getBoundingClientRect();
                            setHovered({
                              id: appId,
                              name: geo.properties.nombre,
                              capital,
                              metric,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }
                        }}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => {
                          if (topic || personalityName) {
                            setSelectedProvince({ id: appId, name: geo.properties.nombre });
                          }
                        }}
                      />
                      
                      {/* Renderizar etiquetas si la provincia no es CABA y las coordenadas del centroide son válidas */}
                      {appId !== "buenos-aires-ciudad" && cx !== 0 && cy !== 0 && (
                        <text
                          x={cx}
                          y={cy - totalH / 2 + lineHeight / 2}
                          textAnchor="middle"
                          style={{
                            pointerEvents: "none",
                            fontFamily: "Outfit, sans-serif",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.2px",
                            textShadow: viewMode === "cyberpunk" ? "0 0 5px rgba(57, 255, 20, 0.6)" : "none",
                          }}
                        >
                          {lines.map((line, li) => (
                            <tspan
                              key={li}
                              x={cx}
                              dy={li === 0 ? 0 : lineHeight}
                              style={{
                                fontSize: `${fontSize}px`,
                                fill: isHovered 
                                  ? "white" 
                                  : viewMode === "cyberpunk" 
                                    ? "rgba(57, 255, 20, 0.85)" 
                                    : "rgba(255,255,255,0.85)",
                              }}
                            >
                              {line}
                            </tspan>
                          ))}
                        </text>
                      )}
                    </g>
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip flotante */}
        {mounted && hovered && createPortal(
          <div style={{
            position: "fixed",
            left: hovered.x,
            top: hovered.y - 8,
            transform: "translate(-50%, -100%)",
            background: "rgba(10, 14, 26, 0.97)",
            border: `1px solid ${sentimentToStroke(hovered.metric.sentiment)}`,
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            zIndex: 100,
            backdropFilter: "blur(20px)",
            minWidth: "180px",
            boxShadow: "var(--shadow-lg)",
            animation: "fadeInUp 0.15s ease both",
            pointerEvents: "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: "0.95rem" }}>{hovered.name}</span>
              {hovered.metric.dominantArchetype && (
                <span style={{ fontSize: "0.75rem" }}>
                  {ARCHETYPE_CONFIG[hovered.metric.dominantArchetype]?.emoji}
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.6rem" }}>{hovered.capital}</div>

            {/* Sentiment */}
            <div style={{ marginBottom: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Sentimiento</span>
                <span style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: sentimentToColor(hovered.metric.sentiment),
                }}>
                  {sentimentLabel(hovered.metric.sentiment)}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((hovered.metric.sentiment + 1) / 2) * 100}%`,
                    background: `linear-gradient(90deg, #ef4444, #6b7280, ${sentimentToColor(hovered.metric.sentiment)})`,
                  }}
                />
              </div>
            </div>

            {/* Intensidad */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Intensidad</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  {Math.round(hovered.metric.intensity * 100)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${hovered.metric.intensity * 100}%` }}
                />
              </div>
            </div>

            {hovered.metric.dominantArchetype && (
              <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--glass-border)" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Arquetipo dominante: </span>
                <span style={{ fontSize: "0.78rem", color: ARCHETYPE_CONFIG[hovered.metric.dominantArchetype]?.color, fontWeight: 600 }}>
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
        <div style={{ width: "100%", height: "6px", background: viewMode === "cyberpunk" ? "linear-gradient(to right, #ff0055 0%, #ffb700 50%, #00ff66 100%)" : `linear-gradient(to right, rgba(255,255,255,0.05), ${ARCHETYPE_CONFIG[archetype as ArchetypeKey]?.color || "#34d399"})`, borderRadius: "3px", marginBottom: "0.5rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Muy desfavorable</span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Neutro</span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Muy favorable</span>
        </div>
      </div>

      {/* Promedio Nacional */}
      {provinceData && (
        <div style={{
          marginTop: "0.75rem",
          padding: "0.75rem",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--glass-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Aprobación Nacional Promedio</span>
          <span style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "Outfit", color: sentimentToColor(nationalAvg) }}>
            {sentimentLabel(nationalAvg)} ({Math.round(((nationalAvg + 1) / 2) * 100)}%)
          </span>
        </div>
      )}

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
