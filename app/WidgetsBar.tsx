"use client";

import { useEffect, useState, useRef } from "react";
import { Cloud, Sun, CloudRain, TrendingUp, TrendingDown, Minus, Search, Cpu, Activity } from "lucide-react";
import { CANONICAL_ECONOMIC_FALLBACK, EconomicIndicator } from "@/lib/economicData";
import { MOCK_PROVINCE_SENTIMENTS } from "@/lib/types";

// ─── CLIMA ──────────────────────────────────────────────────────────────────
function WeatherWidget() {
  const [data, setData] = useState<{ temp: number; desc: string; city: string; code: number } | null>(null);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.6&longitude=-58.4&current=temperature_2m,weathercode&timezone=America/Argentina/Buenos_Aires")
      .then(r => r.json())
      .then(d => {
        const code = d?.current?.weathercode ?? 0;
        const temp = Math.round(d?.current?.temperature_2m ?? 18);
        let desc = "Despejado";
        if (code >= 80) desc = "Lluvia";
        else if (code >= 61) desc = "Llovizna";
        else if (code >= 45) desc = "Niebla";
        else if (code >= 2) desc = "Nublado";
        setData({ temp, desc, city: "Buenos Aires", code });
      })
      .catch(() => setData({ temp: 18, desc: "Despejado", city: "Buenos Aires", code: 0 }));
  }, []);

  const Icon = !data ? Sun : data.code >= 61 ? CloudRain : data.code >= 2 ? Cloud : Sun;
  const iconColor = !data ? "#fbbf24" : data.code >= 61 ? "#60a5fa" : data.code >= 2 ? "#94a3b8" : "#fbbf24";

  return (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      height: "100%", gap: "0.5rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Icon size={28} color={iconColor} strokeWidth={1.5} />
        <div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.8rem", fontWeight: 900, color: "var(--heading-color)", lineHeight: 1 }}>
            {data ? `${data.temp}°` : "—"}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
            {data?.desc ?? "Cargando..."}
          </div>
        </div>
      </div>
      <div style={{ fontSize: "0.65rem", fontFamily: "Outfit, sans-serif", fontWeight: 700, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        📍 {data?.city ?? "Buenos Aires"}
      </div>
    </div>
  );
}

// ─── ECONOMÍA UNIFICADA ─────────────────────────────────────────────────────
function EconomyWidget() {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>(CANONICAL_ECONOMIC_FALLBACK);

  useEffect(() => {
    fetch("/api/indicadores")
      .then(r => r.json())
      .then(d => {
        if (d?.indicators && Array.isArray(d.indicators)) {
          setIndicators(d.indicators);
        }
      })
      .catch(() => {});
  }, []);

  const blue = indicators.find(i => i.id === "dolar-blue") || CANONICAL_ECONOMIC_FALLBACK[0];
  const riesgo = indicators.find(i => i.id === "riesgo-pais") || CANONICAL_ECONOMIC_FALLBACK[3];
  const ipc = indicators.find(i => i.id === "inflacion-mensual") || CANONICAL_ECONOMIC_FALLBACK[5];

  const stats = [
    { label: "Dólar Blue", value: blue.value, change: blue.change, trend: blue.trend },
    { label: "Riesgo País", value: riesgo.value, change: riesgo.change, trend: riesgo.trend },
    { label: "IPC Mensual", value: ipc.value, change: "(INDEC)", trend: "neutral" as const },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", height: "100%" }}>
      {stats.map(s => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "var(--text-muted)" }}>
            {s.label}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "var(--heading-color)" }}>
              {s.value}
            </span>
            <span style={{
              fontSize: "0.65rem", fontWeight: 700, fontFamily: "Outfit, sans-serif",
              color: s.trend === "up" ? "#00e676" : s.trend === "down" ? "#ff1744" : "var(--text-muted)",
              display: "flex", alignItems: "center", gap: "1px",
            }}>
              {s.trend === "up" ? <TrendingUp size={9} /> : s.trend === "down" ? <TrendingDown size={9} /> : <Minus size={9} />}
              {s.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── BUSCADOR RÁPIDO ─────────────────────────────────────────────────────────
function QuickAnalysisWidget() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ name: string; archetype: string; summary: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/analyze?name=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const d = await res.json();
        setResult({ name: d.name, archetype: d.archetype, summary: d.summary?.slice(0, 100) + "..." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", height: "100%" }}>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Milei, Messi, Cristina..."
          style={{
            flex: 1,
            background: "var(--primary-900)",
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            padding: "0.45rem 0.75rem",
            color: "var(--text-primary)",
            fontSize: "0.8rem",
            fontFamily: "Inter, sans-serif",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            background: "rgba(0,212,255,0.15)",
            border: "1px solid var(--accent-primary)",
            borderRadius: "8px",
            padding: "0.45rem 0.65rem",
            cursor: "pointer",
            color: "var(--accent-primary)",
            display: "flex", alignItems: "center",
            transition: "all 0.2s",
          }}
        >
          <Search size={13} />
        </button>
      </div>

      {loading && (
        <div style={{ height: "40px", background: "rgba(0,212,255,0.05)", borderRadius: "8px", animation: "pulse 1s infinite" }} />
      )}

      {result && (
        <div style={{
          background: "rgba(0,212,255,0.05)",
          border: "1px solid var(--glass-border)",
          borderRadius: "8px",
          padding: "0.6rem 0.75rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "var(--heading-color)" }}>
              {result.name}
            </span>
            <span style={{ fontSize: "0.65rem", color: "var(--accent-primary)", fontFamily: "Outfit, sans-serif", fontWeight: 600, textTransform: "uppercase" }}>
              {result.archetype}
            </span>
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.4, margin: 0 }}>
            {result.summary}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── WIDGET ÁNIMO SOCIAL ───────────────────────────────────────────────────
function SocialPulseWidget() {
  const values = Object.values(MOCK_PROVINCE_SENTIMENTS);
  const avg = values.reduce((a, b) => a + b.sentiment, 0) / values.length;
  const positive = values.filter(p => p.sentiment > 0.05).length;
  const negative = values.filter(p => p.sentiment < -0.05).length;
  const neutral = 24 - positive - negative;
  const score100 = Math.round((avg + 1) * 50);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.7rem", fontWeight: 900, color: "var(--heading-color)", lineHeight: 1 }}>
            {score100}<span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>/100</span>
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", marginTop: "2px" }}>
            Promedio 24 distritos
          </div>
        </div>
        <span style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          fontFamily: "Outfit, sans-serif",
          color: avg >= 0 ? "#00e676" : "#ff1744",
          background: avg >= 0 ? "rgba(0,230,118,0.12)" : "rgba(255,23,68,0.12)",
          padding: "0.2rem 0.5rem",
          borderRadius: "100px",
          border: `1px solid ${avg >= 0 ? "rgba(0,230,118,0.3)" : "rgba(255,23,68,0.3)"}`
        }}>
          {avg >= 0 ? "Favorable +" : "Tensión −"}
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.4rem", fontSize: "0.68rem", fontFamily: "Inter, sans-serif" }}>
        <span style={{ color: "#00e676" }}>🟢 {positive} fav.</span>
        <span style={{ color: "#ffc400" }}>🟡 {neutral} neut.</span>
        <span style={{ color: "#ff1744" }}>🔴 {negative} tens.</span>
      </div>

      <a href="#pulso-nacional" style={{
        fontSize: "0.65rem",
        color: "var(--accent-primary)",
        fontFamily: "Outfit, sans-serif",
        fontWeight: 700,
        textDecoration: "none",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginTop: "auto"
      }}>
        Ver mapa federal →
      </a>
    </div>
  );
}

// ─── WIDGET PRINCIPAL ────────────────────────────────────────────────────────
export default function WidgetsBar() {
  const [activeTab, setActiveTab] = useState<string>("economia");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const widgets = [
    {
      id: "economia",
      icon: <TrendingUp size={15} color="var(--accent-primary)" />,
      shortLabel: "Economía",
      label: "Economía & Finanzas",
      sublabel: "Dólar Blue · Riesgo País · Inflación",
      content: <EconomyWidget />,
    },
    {
      id: "pulso",
      icon: <Activity size={15} color="var(--accent-primary)" />,
      shortLabel: "Ánimo Social",
      label: "Ánimo Social Federal",
      sublabel: "Pulso en 24 Provincias",
      content: <SocialPulseWidget />,
    },
    {
      id: "analisis",
      icon: <Cpu size={15} color="var(--accent-primary)" />,
      shortLabel: "Analizador IA",
      label: "Analizador con IA",
      sublabel: "Consultá cualquier figura pública o tema",
      content: <QuickAnalysisWidget />,
    },
    {
      id: "clima",
      icon: <Sun size={15} color="var(--accent-primary)" />,
      shortLabel: "Clima",
      label: "Clima en Tiempo Real",
      sublabel: "Servicio Meteorológico",
      content: <WeatherWidget />,
    },
  ];

  const handleSelectTab = (id: string, idx: number) => {
    setActiveTab(id);
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth * 0.88;
      scrollContainerRef.current.scrollTo({
        left: idx * (cardWidth + 12),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="widgets-bar-wrapper">
      {/* Selector de Chips/Pestañas táctiles para versión celular */}
      <div className="widgets-mobile-tabs">
        {widgets.map((w, idx) => {
          const isActive = activeTab === w.id;
          return (
            <button
              key={w.id}
              onClick={() => handleSelectTab(w.id, idx)}
              className={`widgets-tab-chip ${isActive ? "active" : ""}`}
            >
              <span style={{ display: "flex", alignItems: "center" }}>{w.icon}</span>
              <span>{w.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Contenedor: En desktop 4 columnas amplias, en celular carrusel fluido con snap */}
      <div ref={scrollContainerRef} className="widgets-bar-grid">
        {widgets.map((w) => (
          <div
            key={w.id}
            id={`widget-${w.id}`}
            className="glass-card widget-card-item"
            style={{
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              background: "var(--card-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            {/* Widget Header con jerarquía clara */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--glass-border)",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "var(--glass-hover)",
                  border: "1px solid var(--glass-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {w.icon}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: "var(--accent-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {w.label}
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {w.sublabel}
                </div>
              </div>
            </div>

            {/* Widget Content con alto completo */}
            <div style={{ flex: 1, minHeight: "95px", display: "flex", flexDirection: "column" }}>
              {w.content}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .widgets-bar-wrapper {
          width: 100%;
        }

        /* Selector de pestañas móvil */
        .widgets-mobile-tabs {
          display: none;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .widgets-mobile-tabs::-webkit-scrollbar {
          display: none;
        }

        .widgets-tab-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          border-radius: 100px;
          border: 1px solid var(--glass-border);
          background: var(--card-bg);
          color: var(--text-secondary);
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .widgets-tab-chip.active {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: 0 2px 8px rgba(153, 27, 27, 0.25);
        }

        /* Desktop: 4 columnas balanceadas */
        .widgets-bar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .widget-card-item {
          min-width: 0;
        }

        /* Celular y pantallas pequeñas (<= 768px): carrusel fluido horizontal táctil */
        @media (max-width: 768px) {
          .widgets-mobile-tabs {
            display: flex;
          }

          .widgets-bar-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 0.75rem !important;
            padding-bottom: 0.5rem !important;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .widgets-bar-grid::-webkit-scrollbar {
            display: none;
          }

          .widget-card-item {
            flex: 0 0 88% !important;
            min-width: 88% !important;
            scroll-snap-align: center !important;
            padding: 1.1rem !important;
            border-radius: 14px !important;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
