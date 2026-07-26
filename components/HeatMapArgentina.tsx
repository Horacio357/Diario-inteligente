"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { ARGENTINA_PROVINCES } from "@/lib/argentina-map-data";
import { ProvinceMetric, ArchetypeKey } from "@/lib/types";
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
  "94": "tierra-del-fuego",
  "90": "tucuman"
};

const PROVINCE_LABELS: Record<string, string> = {
  "buenos-aires": "Bs. As.",
  "buenos-aires-ciudad": "CABA",
  "catamarca": "Catamarca",
  "corrientes": "Corrientes",
  "entre-rios": "E. Ríos",
  "formosa": "Formosa",
  "la-pampa": "La Pampa",
  "la-rioja": "La Rioja",
  "mendoza": "Mendoza",
  "misiones": "Misiones",
  "neuquen": "Neuquén",
  "rio-negro": "R. Negro",
  "san-juan": "San Juan",
  "san-luis": "San Luis",
  "santa-cruz": "Sta. Cruz",
  "santa-fe": "Santa Fe",
  "santiago-del-estero": "Sgo. Estero",
  "tierra-del-fuego": "T. Fuego",
  "tucuman": "Tucumán",
  "chaco": "Chaco",
  "chubut": "Chubut",
  "cordoba": "Córdoba",
  "jujuy": "Jujuy",
  "salta": "Salta",
};

/* ── Coordinates optimized for province labels & pings ── */
const PROVINCE_COORDS: Record<string, [number, number]> = {
  "buenos-aires-ciudad": [-58.4, -34.6],
  "buenos-aires": [-60.5, -36.5],
  "catamarca": [-66.8, -27.2],
  "chaco": [-60.5, -26.3],
  "chubut": [-68.5, -44.0],
  "cordoba": [-64.0, -31.8],
  "corrientes": [-57.8, -28.8],
  "entre-rios": [-59.2, -32.2],
  "formosa": [-60.2, -24.8],
  "jujuy": [-65.5, -23.3],
  "la-pampa": [-65.4, -37.2],
  "la-rioja": [-67.2, -29.8],
  "mendoza": [-68.5, -34.5],
  "misiones": [-54.8, -26.8],
  "neuquen": [-70.2, -38.5],
  "rio-negro": [-67.5, -40.5],
  "salta": [-64.5, -24.8],
  "san-juan": [-68.8, -31.0],
  "san-luis": [-66.0, -33.8],
  "santa-cruz": [-70.2, -48.5],
  "santa-fe": [-61.2, -31.2],
  "santiago-del-estero": [-63.8, -27.8],
  "tierra-del-fuego": [-67.8, -54.0],
  "tucuman": [-65.3, -26.8]
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

/* ── Color helpers ── */
function sentimentToNeonColor(sentiment: number): string {
  if (sentiment > 0.15) return "#00ff66";   // Neon green — favorable
  if (sentiment < -0.15) return "#ff0055";  // Neon red — desfavorable
  return "#ffb700";                         // Neon amber — neutro
}

function sentimentToFill(sentiment: number): string {
  if (sentiment > 0.15) return "rgba(0, 255, 102, 0.15)";
  if (sentiment < -0.15) return "rgba(255, 0, 85, 0.15)";
  return "rgba(255, 183, 0, 0.15)";
}

function sentimentToStroke(sentiment: number): string {
  if (sentiment > 0.2) return "rgba(52, 211, 153, 0.6)";
  if (sentiment > -0.2) return "rgba(234, 179, 8, 0.6)";
  return "rgba(239, 68, 68, 0.6)";
}

const NEON = "#39ff14";

const HeatMapArgentina = React.memo(function HeatMapArgentinaComponent({
  provinceData,
  personalityName,
  archetype = "hero",
  mode = "sentiment",
  topic,
  nationalSummary,
  category
}: HeatMapArgentinaProps) {
  const [hovered, setHovered] = useState<HoveredProvince | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<{ id: string; name: string } | null>(null);
  const [position, setPosition] = useState({ coordinates: [-64, -38.5] as [number, number], zoom: 1 });

  useEffect(() => { setMounted(true); }, []);

  const getMetric = (id: string): ProvinceMetric | null => provinceData?.[id] || null;

  const sentimentLabel = (s: number) => {
    if (s > 0.5) return "Muy favorable";
    if (s > 0.2) return "Favorable";
    if (s > -0.2) return "Neutro";
    if (s > -0.5) return "Desfavorable";
    return "Muy desfavorable";
  };

  const provinceCapitals = useMemo(() => {
    const map: Record<string, string> = {};
    ARGENTINA_PROVINCES.forEach(p => { map[p.id] = p.capital; });
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
          <div className="section-label" style={{ margin: 0, color: NEON, textShadow: `0 0 8px ${NEON}` }}>Mapa de Calor Territorial</div>
        </div>
        <h3 style={{ fontFamily: "Outfit", fontSize: "1rem", color: NEON, textShadow: `0 0 6px rgba(57, 255, 20, 0.4)` }}>
          {personalityName ? `Percepción de ${personalityName}` : "Humor Social · Argentina"}
        </h3>
        <p style={{ fontSize: "0.78rem", color: "rgba(57, 255, 20, 0.5)", marginTop: "0.2rem" }}>
          Arrastra para desplazar · Rueda para zoom · <span style={{ color: NEON }}>Click para análisis detallado IA</span>
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          SVG MAP — Threatbutt OSINT radar style
         ══════════════════════════════════════════════════ */}
      <div style={{
        position: "relative",
        background: "#02040a",
        borderRadius: "var(--radius-md)",
        border: `1px solid rgba(57, 255, 20, 0.25)`,
        overflow: "hidden",
        boxShadow: `0 0 40px rgba(0, 0, 0, 0.8), inset 0 0 50px rgba(57, 255, 20, 0.05)`,
      }}>

        {/* Scanlines layer for CRT retro style */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 3px)",
        }} />

        {/* Flashing grid points for radar background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          opacity: 0.15,
          backgroundImage: `radial-gradient(${NEON} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }} />

        {/* Floating Zoom Controls */}
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
            onClick={() => setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom + 0.5, 8) }))}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "#02040a", border: `1px solid ${NEON}`,
              color: NEON, cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", fontWeight: "bold",
              boxShadow: `0 0 10px rgba(57, 255, 20, 0.2)`, transition: "all 0.2s"
            }}
            title="Acercar"
          >
            +
          </button>
          <button 
            onClick={() => setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom - 0.5, 0.8) }))}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "#02040a", border: `1px solid ${NEON}`,
              color: NEON, cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", fontWeight: "bold",
              boxShadow: `0 0 10px rgba(57, 255, 20, 0.2)`, transition: "all 0.2s"
            }}
            title="Alejar"
          >
            -
          </button>
          <button 
            onClick={() => setPosition({ coordinates: [-64, -38.5], zoom: 1 })}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "#02040a", border: `1px solid ${NEON}`,
              color: NEON, cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 10px rgba(57, 255, 20, 0.2)`, transition: "all 0.2s"
            }}
            title="Restablecer vista"
          >
            🎯
          </button>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1400,
            center: [-64, -38.5]
          }}
          width={800}
          height={900}
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          {/* Neon SVG filter */}
          <defs>
            <filter id="neon-glow-map">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="radar-glow">
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
            maxZoom={8}
            onMoveEnd={(pos) => setPosition(pos)}
            onMoveStart={() => setHovered(null)}
          >
            {/* Geographies (Base map outlines) */}
            <Geographies geography="/argentina-provinces.json">
              {({ geographies }) =>
                geographies.map(geo => {
                  const geoId = geo.properties.id;
                  const appId = geoJsonToAppId[geoId];
                  if (!appId) return null;

                  const metric = getMetric(appId);
                  const isHovered = hovered?.id === appId;

                  let fill = "rgba(0, 0, 0, 0.4)";
                  let stroke = "rgba(57, 255, 20, 0.25)"; // Translucent green borders
                  let strokeWidth = 0.5;

                  if (metric) {
                    fill = sentimentToFill(metric.sentiment);
                    stroke = sentimentToNeonColor(metric.sentiment) + "80"; // 50% opacity
                  }

                  if (isHovered && metric) {
                    fill = sentimentToFill(metric.sentiment).replace("0.15", "0.35");
                    stroke = sentimentToNeonColor(metric.sentiment);
                    strokeWidth = 1.8;
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      style={{
                        default: { outline: "none", transition: "all 0.2s" },
                        hover: {
                          outline: "none",
                          fill: metric ? sentimentToFill(metric.sentiment).replace("0.15", "0.3") : "rgba(57, 255, 20, 0.08)",
                          stroke: metric ? sentimentToNeonColor(metric.sentiment) : NEON,
                          strokeWidth: 1.5,
                          cursor: "pointer"
                        },
                        pressed: { outline: "none" }
                      }}
                      onMouseEnter={e => {
                        if (metric) {
                          const rect = (e.target as SVGPathElement).getBoundingClientRect();
                          setHovered({
                            id: appId,
                            name: geo.properties.nombre,
                            capital: provinceCapitals[appId] || "",
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
                  );
                })
              }
            </Geographies>

            {/* Markers: Animated Radar Pings and Labels */}
            {Object.entries(PROVINCE_COORDS).map(([appId, coords]) => {
              const metric = getMetric(appId);
              const label = PROVINCE_LABELS[appId] || appId;
              const isHovered = hovered?.id === appId;

              // Default green scanner dot if no metric, colored ping if there is data
              const color = metric ? sentimentToNeonColor(metric.sentiment) : NEON;
              const hasData = !!metric;

              return (
                <Marker key={appId} coordinates={coords}>
                  {/* Outer animated radar pulse */}
                  {hasData && (
                    <circle r={2} fill="none" stroke={color} strokeWidth={1} filter="url(#radar-glow)">
                      <animate attributeName="r" from={2} to={18} dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from={0.8} to={0} dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Core solid scanner point */}
                  <circle
                    r={hasData ? 3 : 1.5}
                    fill={color}
                    opacity={hasData ? 0.9 : 0.4}
                    style={{ transition: "all 0.2s" }}
                  />

                  {/* Text label underneath the radar ping */}
                  {appId !== "buenos-aires-ciudad" && (
                    <text
                      y={hasData ? 12 : 8}
                      textAnchor="middle"
                      style={{
                        pointerEvents: "none",
                        fontFamily: "'Courier New', monospace",
                        fontWeight: "bold",
                        fontSize: "6.5px",
                        fill: isHovered ? "#ffffff" : (hasData ? color : "rgba(57, 255, 20, 0.4)"),
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        textShadow: isHovered 
                          ? "0 0 6px #fff" 
                          : `0 0 3px ${hasData ? color : "rgba(57, 255, 20, 0.2)"}`,
                        transition: "all 0.2s"
                      }}
                    >
                      {label}
                    </text>
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Tooltip flotante via portal */}
      {mounted && hovered && createPortal(
        <div style={{
          position: "fixed",
          left: hovered.x,
          top: hovered.y - 8,
          transform: "translate(-50%, -100%)",
          background: "rgba(2, 4, 10, 0.95)",
          border: `1px solid ${sentimentToNeonColor(hovered.metric.sentiment)}`,
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          zIndex: 9999,
          backdropFilter: "blur(20px)",
          minWidth: "200px",
          boxShadow: `0 0 20px ${sentimentToNeonColor(hovered.metric.sentiment)}30`,
          animation: "fadeInUp 0.15s ease both",
          pointerEvents: "none",
          fontFamily: "'Courier New', monospace",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: NEON }}>{hovered.name}</span>
            {hovered.metric.dominantArchetype && (
              <span style={{ fontSize: "0.75rem" }}>
                {ARCHETYPE_CONFIG[hovered.metric.dominantArchetype]?.emoji}
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.7rem", color: "rgba(57, 255, 20, 0.5)", marginBottom: "0.6rem" }}>{hovered.capital}</div>

          {/* Sentiment */}
          <div style={{ marginBottom: "0.4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.72rem", color: "rgba(57, 255, 20, 0.5)" }}>Sentimiento</span>
              <span style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: sentimentToNeonColor(hovered.metric.sentiment),
              }}>
                {sentimentLabel(hovered.metric.sentiment)}
              </span>
            </div>
            <div style={{ width: "100%", height: "4px", background: "rgba(57, 255, 20, 0.1)", borderRadius: "2px" }}>
              <div style={{
                width: `${((hovered.metric.sentiment + 1) / 2) * 100}%`,
                height: "100%",
                borderRadius: "2px",
                background: `linear-gradient(90deg, #ff0055, #ffb700, #00ff66)`,
                boxShadow: `0 0 6px ${sentimentToNeonColor(hovered.metric.sentiment)}`,
              }} />
            </div>
          </div>

          {/* Intensidad */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.72rem", color: "rgba(57, 255, 20, 0.5)" }}>Intensidad</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: NEON }}>
                {Math.round(hovered.metric.intensity * 100)}%
              </span>
            </div>
            <div style={{ width: "100%", height: "4px", background: "rgba(57, 255, 20, 0.1)", borderRadius: "2px" }}>
              <div style={{
                width: `${hovered.metric.intensity * 100}%`,
                height: "100%",
                borderRadius: "2px",
                background: NEON,
                boxShadow: `0 0 6px ${NEON}`,
              }} />
            </div>
          </div>

          {hovered.metric.dominantArchetype && (
            <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(57, 255, 20, 0.2)" }}>
              <span style={{ fontSize: "0.72rem", color: "rgba(57, 255, 20, 0.5)" }}>Arquetipo: </span>
              <span style={{ fontSize: "0.78rem", color: ARCHETYPE_CONFIG[hovered.metric.dominantArchetype]?.color, fontWeight: 600 }}>
                {ARCHETYPE_CONFIG[hovered.metric.dominantArchetype]?.label}
              </span>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Leyenda del mapa */}
      <div style={{ marginTop: "1rem" }}>
        <div style={{
          width: "100%", height: "4px",
          background: "linear-gradient(to right, #ff0055 0%, #ffb700 50%, #00ff66 100%)",
          borderRadius: "2px", marginBottom: "0.5rem",
          boxShadow: "0 0 8px rgba(57, 255, 20, 0.2)",
        }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.65rem", color: "#ff0055", fontFamily: "'Courier New', monospace" }}>▮ Desfavorable</span>
          <span style={{ fontSize: "0.65rem", color: "#ffb700", fontFamily: "'Courier New', monospace" }}>▮ Neutro</span>
          <span style={{ fontSize: "0.65rem", color: "#00ff66", fontFamily: "'Courier New', monospace" }}>▮ Favorable</span>
        </div>
      </div>

      {/* Promedio Nacional */}
      {provinceData && (
        <div style={{
          marginTop: "0.75rem",
          padding: "0.75rem",
          background: "rgba(0,0,0,0.6)",
          borderRadius: "var(--radius-md)",
          border: "1px solid rgba(57, 255, 20, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "'Courier New', monospace",
        }}>
          <span style={{ fontSize: "0.78rem", color: "rgba(57, 255, 20, 0.5)" }}>Aprobación Nacional Promedio</span>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: sentimentToNeonColor(nationalAvg), textShadow: `0 0 8px ${sentimentToNeonColor(nationalAvg)}` }}>
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
});

export default HeatMapArgentina;
