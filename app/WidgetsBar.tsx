"use client";

import { useEffect, useState, useRef } from "react";
import { Cloud, Sun, CloudRain, TrendingUp, TrendingDown, Minus, Search, Cpu, Plane } from "lucide-react";

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

// ─── ECONOMÍA ───────────────────────────────────────────────────────────────
function EconomyWidget() {
  const [rp, setRp] = useState<{ value: string; change: number } | null>(null);
  const [dolar, setDolar] = useState({ value: "$ 1.400", change: 0.5 });

  useEffect(() => {
    fetch("/api/riesgo-pais")
      .then(r => r.json())
      .then(d => {
        if (d?.data) {
          setRp({ value: `${d.data.ultimo} pts`, change: parseFloat(d.data.variacion ?? 0) });
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: "Dólar Blue", value: dolar.value, change: dolar.change },
    { label: "Riesgo País", value: rp?.value ?? "...", change: rp?.change ?? 0 },
    { label: "Inflación Est.", value: "4.5%", change: -0.3 },
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
              color: s.change > 0 ? "#00e676" : s.change < 0 ? "#ff1744" : "#ffc400",
              display: "flex", alignItems: "center", gap: "1px",
            }}>
              {s.change > 0 ? <TrendingUp size={9} /> : s.change < 0 ? <TrendingDown size={9} /> : <Minus size={9} />}
              {s.change > 0 ? "+" : ""}{s.change}%
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

// ─── WIDGET VUELOS ──────────────────────────────────────────────────────────
function FlightsWidget() {
  const flights = [
    { from: "EZE", to: "MIA", time: "23:50", status: "A tiempo", statusColor: "#00e676" },
    { from: "AEP", to: "COR", time: "07:15", status: "Demorado", statusColor: "#ffc400" },
    { from: "EZE", to: "SCL", time: "08:40", status: "A tiempo", statusColor: "#00e676" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", height: "100%" }}>
      {flights.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", fontWeight: 800, color: "var(--heading-color)" }}>
              {f.from}
            </span>
            <span style={{ color: "var(--text-muted)", margin: "0 0.3rem", fontSize: "0.75rem" }}>→</span>
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", fontWeight: 800, color: "var(--heading-color)" }}>
              {f.to}
            </span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "var(--text-muted)" }}>
            {f.time}
          </span>
          <span style={{
            fontSize: "0.6rem", fontWeight: 700, fontFamily: "Outfit, sans-serif",
            color: f.statusColor,
            background: f.statusColor + "18",
            border: `1px solid ${f.statusColor}40`,
            padding: "0.15rem 0.5rem",
            borderRadius: "100px",
          }}>
            {f.status}
          </span>
        </div>
      ))}
      <a href="#" style={{
        fontSize: "0.65rem",
        color: "var(--accent-primary)",
        fontFamily: "Outfit, sans-serif",
        fontWeight: 600,
        textDecoration: "none",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginTop: "auto",
      }}>
        Ver todos los vuelos →
      </a>
    </div>
  );
}

// ─── WIDGET PRINCIPAL ────────────────────────────────────────────────────────
export default function WidgetsBar() {
  const widgets = [
    {
      id: "clima",
      icon: <Sun size={14} color="var(--accent-primary)" />,
      label: "Clima",
      sublabel: "Buenos Aires",
      content: <WeatherWidget />,
    },
    {
      id: "economia",
      icon: <TrendingUp size={14} color="var(--accent-primary)" />,
      label: "Economía",
      sublabel: "Indicadores clave",
      content: <EconomyWidget />,
    },
    {
      id: "analisis",
      icon: <Cpu size={14} color="var(--accent-primary)" />,
      label: "Análisis IA",
      sublabel: "Perfil rápido de figura pública",
      content: <QuickAnalysisWidget />,
    },
    {
      id: "vuelos",
      icon: <Plane size={14} color="var(--accent-primary)" />,
      label: "Vuelos",
      sublabel: "Estado en tiempo real",
      content: <FlightsWidget />,
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem",
    }}
    className="widgets-bar-grid">
      {widgets.map(w => (
        <div key={w.id} className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {/* Widget Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--glass-border)" }}>
            <span style={{ fontSize: "1rem" }}>{w.icon}</span>
            <div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                {w.label}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "var(--text-muted)" }}>
                {w.sublabel}
              </div>
            </div>
          </div>

          {/* Widget Content */}
          <div style={{ flex: 1 }}>
            {w.content}
          </div>
        </div>
      ))}

      <style>{`
        @media (min-width: 600px) {
          .widgets-bar-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
