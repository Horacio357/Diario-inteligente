"use client";

import React, { useState } from "react";
import PersonalityCard from "@/components/PersonalityCard";
import HeatMapArgentina from "@/components/HeatMapArgentina";
import LoadingAnalysis from "@/components/LoadingAnalysis";

// Este componente parsea el texto crudo y convierte [PERSON:Nombre] y [TOPIC:Nombre] en botones interactivos.
export default function InteractiveContent({ content }: { content: string }) {
  const [activeAnalysis, setActiveAnalysis] = useState<{ type: "person" | "topic"; query: string } | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleEntityClick = async (type: "person" | "topic", query: string) => {
    setActiveAnalysis({ type, query });
    setAnalysisData(null);
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/analyze?name=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setAnalysisData(data);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    // Regex para encontrar [PERSON:Nombre] o [TOPIC:Tema]
    const regex = /\[(PERSON|TOPIC):(.*?)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Texto antes del tag
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      const type = match[1].toLowerCase() as "person" | "topic";
      const name = match[2];

      // Botón interactivo incrustado en el texto
      parts.push(
        <button
          key={match.index}
          onClick={() => handleEntityClick(type, name)}
          style={{
            background: type === "person" ? "var(--glass-hover)" : "rgba(180, 83, 9, 0.1)",
            border: `1px solid ${type === "person" ? "var(--card-border)" : "rgba(180, 83, 9, 0.35)"}`,
            color: type === "person" ? "var(--accent-primary)" : "#b45309",
            borderRadius: "6px",
            padding: "0.08rem 0.5rem",
            margin: "0 0.2rem",
            fontWeight: 700,
            fontSize: "0.92em",
            cursor: "pointer",
            fontFamily: "Outfit, sans-serif",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = type === "person" ? "var(--accent-glow)" : "rgba(180, 83, 9, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = type === "person" ? "var(--glass-hover)" : "rgba(180, 83, 9, 0.1)";
          }}
        >
          {type === "person" ? "👤" : "🌎"} {name}
        </button>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    // Convertir saltos de línea en <br/>
    return parts.map((part, i) => {
      if (typeof part === "string") {
        return part.split('\n').map((line, j) => (
          <React.Fragment key={`${i}-${j}`}>
            {line}
            {j !== part.split('\n').length - 1 && <><br /><br /></>}
          </React.Fragment>
        ));
      }
      return part;
    });
  };

  return (
    <>
      <div>{renderContent()}</div>

      {/* Modal / Sidebar con la Inteligencia Artificial */}
      {activeAnalysis && (
        <div style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(500px, 100vw)",
          background: "var(--card-bg)",
          color: "var(--text-primary)",
          backdropFilter: "blur(24px)",
          borderLeft: "2px solid var(--glass-border)",
          boxShadow: "-16px 0 48px rgba(0,0,0,0.28)",
          zIndex: 9999,
          overflowY: "auto",
          padding: "2rem",
          animation: "slideInRight 0.3s ease"
        }}>
          <button
            onClick={() => { setActiveAnalysis(null); setAnalysisData(null); }}
            style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--primary-900)", border: "1px solid var(--glass-border)", borderRadius: "50%", width: "34px", height: "34px", color: "var(--text-primary)", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
          
          <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>
            <div className="section-label" style={{ marginBottom: "0.5rem" }}>
              IA Análisis {activeAnalysis.type === "topic" ? "Territorial" : "de Perfil"}
            </div>
            <h2 style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--heading-color)" }}>
              {activeAnalysis.query}
            </h2>
          </div>

          {isAnalyzing && (
            <LoadingAnalysis name={activeAnalysis.query} isTopic={activeAnalysis.type === "topic"} />
          )}

          {!isAnalyzing && analysisData && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {activeAnalysis.type === "person" ? (
                <>
                  <PersonalityCard analysis={analysisData} onReanalyze={() => {}} />
                  <div className="glass-card">
                    <HeatMapArgentina
                      provinceData={analysisData.provinceData}
                      personalityName={analysisData.name}
                      archetype={analysisData.archetype}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="glass-card" style={{ padding: "1.5rem" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                      {analysisData.summary}
                    </p>
                  </div>
                  <div className="glass-card">
                    <HeatMapArgentina
                      provinceData={analysisData.provinceData}
                      topic={analysisData.name}
                      nationalSummary={analysisData.summary}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
