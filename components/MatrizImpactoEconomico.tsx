"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, ShoppingBag, ShieldAlert, Zap, ArrowRight, Sparkles } from "lucide-react";

interface RegionEconomicData {
  id: string;
  name: string;
  provinces: string;
  ipcMonthly: number; // e.g. 3.8%
  ipcFood: number; // e.g. 4.2%
  sentimentScore: number; // -1.0 to +1.0
  heatPoints: number; // 0 to 100
  alertLevel: "baja" | "moderada" | "alta" | "critica";
  mainDriver: string;
  expectation6Months: "favorable" | "estable" | "desfavorable";
  summary: string;
}

const REGIONS_DATA: RegionEconomicData[] = [
  {
    id: "amba",
    name: "CABA & Conurbano (AMBA)",
    provinces: "CABA, GBA (1° y 2° cordón)",
    ipcMonthly: 3.8,
    ipcFood: 4.1,
    sentimentScore: -0.32,
    heatPoints: 34,
    alertLevel: "alta",
    mainDriver: "Ajuste de tarifas de servicios, transporte y alquileres",
    expectation6Months: "desfavorable",
    summary: "Fuerte sensibilidad al costo del transporte público y servicios públicos. El consumo masivo registra cautela con alta dispersión de precios en supermercados."
  },
  {
    id: "centro",
    name: "Región Centro",
    provinces: "Córdoba, Santa Fe, Entre Ríos, La Pampa",
    ipcMonthly: 3.2,
    ipcFood: 3.5,
    sentimentScore: 0.18,
    heatPoints: 59,
    alertLevel: "baja",
    mainDriver: "Tracción del sector agroindustrial y exportaciones de granos",
    expectation6Months: "favorable",
    summary: "El repunte del agro e industria de maquinaria sostiene el humor social. La inflación de alimentos es moderada comparada con la media nacional."
  },
  {
    id: "patagonia",
    name: "Región Patagonia",
    provinces: "Neuquén, Río Negro, Chubut, Santa Cruz, Tierra del Fuego",
    ipcMonthly: 4.1,
    ipcFood: 4.6,
    sentimentScore: 0.25,
    heatPoints: 63,
    alertLevel: "moderada",
    mainDriver: "Boom energético de Vaca Muerta y minería pesada",
    expectation6Months: "favorable",
    summary: "Salarios del sector hidrocarburífero amortiguan el IPC regional más alto del país. Alto costo de vida compensado por fuerte actividad de empleo técnico."
  },
  {
    id: "cuyo",
    name: "Región Cuyo",
    provinces: "Mendoza, San Juan, San Luis",
    ipcMonthly: 3.5,
    ipcFood: 3.8,
    sentimentScore: 0.05,
    heatPoints: 53,
    alertLevel: "baja",
    mainDriver: "Vitivinicultura, turismo internacional y proyectos de cobre",
    expectation6Months: "estable",
    summary: "Expectativas estables impulsadas por el turismo de frontera y minería. La presión inflacionaria se concentra en vestimenta y gastronomía."
  },
  {
    id: "noa",
    name: "Región NOA (Norte Grande)",
    provinces: "Jujuy, Salta, Tucumán, Catamarca, Sgo. del Estero, La Rioja",
    ipcMonthly: 3.7,
    ipcFood: 4.3,
    sentimentScore: -0.15,
    heatPoints: 42,
    alertLevel: "moderada",
    mainDriver: "Inversión en litio vs. presión sobre la canasta familiar",
    expectation6Months: "estable",
    summary: "Dualidad entre la expansión minera (litio) y la fatiga del consumo de las familias dependientes de empleo estatal y comercio local."
  },
  {
    id: "nea",
    name: "Región NEA",
    provinces: "Chaco, Corrientes, Misiones, Formosa",
    ipcMonthly: 3.9,
    ipcFood: 4.5,
    sentimentScore: -0.28,
    heatPoints: 36,
    alertLevel: "alta",
    mainDriver: "Comercio fronterizo y encarecimiento de la canasta básica",
    expectation6Months: "desfavorable",
    summary: "Impacto por caída de compras de países limítrofes y aumento en productos esenciales. Alto nivel de atención en el costo del gas y electricidad."
  }
];

export default function MatrizImpactoEconomico() {
  const [selectedRegionId, setSelectedRegionId] = useState<string>("amba");

  const selectedRegion = REGIONS_DATA.find(r => r.id === selectedRegionId) || REGIONS_DATA[0];

  const getAlertBadge = (level: string) => {
    switch (level) {
      case "critica": return { color: "#ff1744", label: "Alerta Crítica", bg: "rgba(255,23,68,0.12)" };
      case "alta": return { color: "#ff6b00", label: "Atención Alta", bg: "rgba(255,107,0,0.12)" };
      case "moderada": return { color: "#ffc400", label: "Tensión Moderada", bg: "rgba(255,196,0,0.12)" };
      default: return { color: "#00e676", label: "Consenso Económico", bg: "rgba(0,230,118,0.12)" };
    }
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.15) return { text: "Optimismo / Crecimiento", color: "#00e676" };
    if (score < -0.15) return { text: "Preocupación / Cautela", color: "#ff1744" };
    return { text: "Estabilidad / Neutro", color: "#ffc400" };
  };

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--glass-border)",
      borderRadius: "16px",
      padding: "1.25rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem"
    }}>
      {/* Header Widget */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.25rem" }}>
            <DollarSign size={14} color="var(--accent-primary)" />
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.65rem", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.18em" }}>
              Inteligencia Financiera & Territorial
            </span>
          </div>
          <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--heading-color)", margin: 0 }}>
            Matriz de Impacto Económico vs. Humor Social
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "Merriweather, Georgia, serif", marginTop: "0.2rem", margin: 0 }}>
            Cruze directo entre inflación regional (IPC Indec) y la percepción del consumidor en cada zona del país.
          </p>
        </div>

        {/* Badge Vaca Muerta / INDEC */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          background: "rgba(0,212,255,0.08)", border: "1px solid var(--glass-border)",
          padding: "0.35rem 0.75rem", borderRadius: "100px"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00e676", boxShadow: "0 0 6px #00e676" }} />
          <span style={{ fontSize: "0.68rem", fontFamily: "Outfit, sans-serif", fontWeight: 700, color: "var(--accent-primary)" }}>
            IPC Promedio Nacional: 3.7%
          </span>
        </div>
      </div>

      {/* Selector de Región: Tab bar optimizado para Mobile con Scroll Horizontal */}
      <div style={{
        display: "flex",
        gap: "0.4rem",
        overflowX: "auto",
        paddingBottom: "0.3rem",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none"
      }}>
        {REGIONS_DATA.map(r => {
          const isSelected = r.id === selectedRegionId;
          const badge = getAlertBadge(r.alertLevel);
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRegionId(r.id)}
              style={{
                flexShrink: 0,
                background: isSelected ? "rgba(0,212,255,0.12)" : "rgba(0,0,0,0.05)",
                border: `1px solid ${isSelected ? "var(--accent-primary)" : "var(--glass-border)"}`,
                borderRadius: "10px",
                padding: "0.55rem 0.85rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                outline: "none"
              }}
            >
              <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.8rem", fontWeight: 800, color: isSelected ? "var(--accent-primary)" : "var(--heading-color)", whiteSpace: "nowrap" }}>
                {r.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.2rem" }}>
                <span style={{ fontSize: "0.68rem", fontFamily: "Outfit, sans-serif", fontWeight: 700, color: badge.color }}>
                  IPC {r.ipcMonthly}%
                </span>
                <span style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>•</span>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
                  Humor {r.heatPoints} pts
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid Principal de la Región Seleccionada */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
        alignItems: "stretch"
      }}>

        {/* Tarjeta 1: Métricas de Inflación y Sentimiento */}
        <div style={{
          background: "rgba(0,0,0,0.04)",
          border: "1px solid var(--glass-border)",
          borderRadius: "14px",
          padding: "1.1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {selectedRegion.name}
              </span>
              <span style={{
                fontSize: "0.68rem", fontFamily: "Outfit, sans-serif", fontWeight: 800,
                color: getAlertBadge(selectedRegion.alertLevel).color,
                background: getAlertBadge(selectedRegion.alertLevel).bg,
                padding: "0.25rem 0.6rem", borderRadius: "100px", border: `1px solid ${getAlertBadge(selectedRegion.alertLevel).color}40`
              }}>
                {getAlertBadge(selectedRegion.alertLevel).label}
              </span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", marginBottom: "0.85rem" }}>
              📍 Jurisdicciones: <b>{selectedRegion.provinces}</b>
            </div>

            {/* Dos Indicadores Clave: IPC vs Humor */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ background: "rgba(0,0,0,0.06)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Outfit, sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
                  IPC Mensual (Indec)
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "Outfit, sans-serif", color: selectedRegion.ipcMonthly > 3.7 ? "#ff1744" : "#00e676", marginTop: "0.1rem" }}>
                  +{selectedRegion.ipcMonthly}%
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", marginTop: "0.2rem" }}>
                  Alimentos: +{selectedRegion.ipcFood}%
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.06)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Outfit, sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
                  Humor Social Económico
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "Outfit, sans-serif", color: getSentimentLabel(selectedRegion.sentimentScore).color, marginTop: "0.1rem" }}>
                  {selectedRegion.heatPoints} <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>pts</span>
                </div>
                <div style={{ fontSize: "0.65rem", color: getSentimentLabel(selectedRegion.sentimentScore).color, fontFamily: "Outfit, sans-serif", fontWeight: 700, marginTop: "0.2rem" }}>
                  {getSentimentLabel(selectedRegion.sentimentScore).text}
                </div>
              </div>
            </div>
          </div>

          {/* Motor / Driver Principal */}
          <div style={{ borderTop: "1px dashed var(--glass-border)", paddingTop: "0.75rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--accent-primary)", fontFamily: "Outfit, sans-serif", textTransform: "uppercase" }}>
              ⚡ Factor Clave de Impacto:
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--heading-color)", fontFamily: "Merriweather, Georgia, serif", marginTop: "0.2rem" }}>
              {selectedRegion.mainDriver}
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Síntesis de Inteligencia & Análisis de IA */}
        <div style={{
          background: "linear-gradient(135deg, rgba(0,212,255,0.04), rgba(124,58,237,0.04))",
          border: "1px solid var(--glass-border)",
          borderRadius: "14px",
          padding: "1.1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.65rem" }}>
              <Sparkles size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Diagnóstico de Tendencia Regional (IA)
              </span>
            </div>

            <p style={{
              fontSize: "0.83rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              fontFamily: "Merriweather, Georgia, serif",
              margin: 0
            }}>
              "{selectedRegion.summary}"
            </p>
          </div>

          <div style={{ background: "rgba(0,0,0,0.1)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Outfit, sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
                Expectativa del Consumidor (6 Meses):
              </span>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", color: selectedRegion.expectation6Months === "favorable" ? "#00e676" : selectedRegion.expectation6Months === "desfavorable" ? "#ff1744" : "#ffc400", textTransform: "capitalize" }}>
                {selectedRegion.expectation6Months === "favorable" ? "↗ Tendencia Favorable" : selectedRegion.expectation6Months === "desfavorable" ? "↘ Tendencia Cautelosa" : "→ Tendencia Estable"}
              </div>
            </div>
            <a href="/politica" style={{ textDecoration: "none", fontSize: "0.72rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", color: "var(--accent-primary)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              Ver detalles →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
