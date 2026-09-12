"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, Sparkles, Brain, TrendingUp, ChevronRight, X, Lightbulb, Activity } from "lucide-react";
import { PersonalityAnalysis } from "@/lib/types";
import PersonalityCard from "./PersonalityCard";
import IntelligenceHub from "./IntelligenceHub";

const POPULAR_QUICK_SEARCHES = [
  { name: "Javier Milei", icon: "🏛️" },
  { name: "Inflación", icon: "📈" },
  { name: "Dólar Blue", icon: "💵" },
  { name: "Seguridad", icon: "🔒" },
  { name: "Lionel Messi", icon: "⚽" },
  { name: "Cristina Kirchner", icon: "🔥" },
  { name: "Pobreza", icon: "📉" },
  { name: "Educación", icon: "📚" },
];

interface IAConceptAnalyzerProps {
  onAnalysisComplete?: (analysis: PersonalityAnalysis) => void;
}

export default function IAConceptAnalyzer({ onAnalysisComplete }: IAConceptAnalyzerProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (searchName: string) => {
    if (!searchName.trim() || loading) return;
    setLoading(true);
    setError(null);
    setQuery(searchName);

    try {
      const res = await fetch(`/api/analyze?name=${encodeURIComponent(searchName.trim())}`);
      if (!res.ok) throw new Error("Error al analizar");
      const data: PersonalityAnalysis = await res.json();
      
      setCurrentAnalysis(data);
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch {
      setError("No se pudo completar el análisis en tiempo real. Por favor intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [loading, onAnalysisComplete]);

  return (
    <div className="glass-card" style={{
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      border: "1px solid var(--glass-border)",
      background: "var(--card-bg)",
    }}>
      {/* Header del Analizador IA */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))",
            border: "1px solid var(--accent-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(0,212,255,0.2)",
            flexShrink: 0
          }}>
            <Brain size={22} color="var(--accent-primary)" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h2 style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: "1.25rem", fontWeight: 800, color: "var(--heading-color)" }}>
                Analizador de Inteligencia IA & Conceptos
              </h2>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.62rem",
                fontWeight: 700,
                color: "var(--accent-primary)",
                background: "var(--glass-hover)",
                border: "1px solid var(--glass-border)",
                padding: "0.15rem 0.5rem",
                borderRadius: "100px",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              }}>
                <Sparkles size={10} /> En Vivo
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
              Medí cualquier persona, concepto o tema nacional. El resultado actualiza el mapa de calor de Argentina en tiempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Buscador Principal */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          background: "var(--primary-900)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-md)",
          padding: "0.75rem 1rem",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
        }}>
          {loading ? (
            <Loader2 size={18} color="var(--accent-primary)" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />
          ) : (
            <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          )}

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runAnalysis(query)}
            placeholder="Ingresá una persona, tema o concepto (ej: Milei, Inflación, Dólar, Messi, Seguridad...)"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--heading-color)",
              fontSize: "0.92rem",
              fontFamily: "Merriweather, Georgia, serif",
            }}
          />

          {query && (
            <button
              onClick={() => { setQuery(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
            >
              <X size={15} />
            </button>
          )}

          <button
            onClick={() => runAnalysis(query)}
            disabled={!query.trim() || loading}
            className="btn-primary"
            style={{
              padding: "0.45rem 1.1rem",
              fontSize: "0.82rem",
              opacity: query.trim() && !loading ? 1 : 0.5,
              cursor: query.trim() && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Analizando..." : "Analizar con IA"}
          </button>
        </div>

        {/* Accesos rápidos sugeridos */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "0.2rem" }}>
            Búsquedas frecuentes:
          </span>
          {POPULAR_QUICK_SEARCHES.map((item) => (
            <button
              key={item.name}
              onClick={() => runAnalysis(item.name)}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.25rem 0.65rem",
                background: "var(--glass-hover)",
                border: "1px solid var(--glass-border)",
                borderRadius: "100px",
                color: "var(--text-primary)",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.73rem",
                fontFamily: "Merriweather, Georgia, serif",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)";
                (e.currentTarget as HTMLElement).style.color = "var(--accent-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--glass-border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
              }}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{
          padding: "0.85rem 1rem",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "var(--radius-md)",
          color: "#ef4444",
          fontSize: "0.8rem"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Resultados completos del Análisis */}
      {currentAnalysis && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", animation: "fadeInUp 0.4s ease both" }}>
          {/* Cartel de sincronización con el Mapa */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            padding: "0.65rem 1rem",
            background: "rgba(0, 212, 255, 0.08)",
            border: "1px solid var(--accent-primary)",
            borderRadius: "10px",
            fontSize: "0.78rem",
            color: "var(--heading-color)",
            fontWeight: 600,
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity size={16} color="var(--accent-primary)" />
              <span>Los datos de percepción de <b>"{currentAnalysis.name}"</b> han sido cargados en el Mapa de Calor de Argentina.</span>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById("mapa-argentina");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              style={{
                background: "var(--accent-primary)",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "0.35rem 0.8rem",
                fontSize: "0.72rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              Ver Mapa de Calor ↑
            </button>
          </div>

          {/* Tarjeta Completa de Análisis */}
          <PersonalityCard analysis={currentAnalysis} />

          {/* Ficha de Inteligencia & Recomendaciones PR */}
          <IntelligenceHub analysis={currentAnalysis} />
        </div>
      )}
    </div>
  );
}
