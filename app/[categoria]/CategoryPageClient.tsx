"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ExternalLink, TrendingUp, Search, Sparkles, BarChart3, Radio, Landmark, Trophy, Laptop, Microscope, MapPin } from "lucide-react";
import NarrativasEmergentes from "@/components/NarrativasEmergentes";
import PulsoNacional from "@/components/PulsoNacional";
import HeatMapArgentina from "@/components/HeatMapArgentina";
import IAConceptAnalyzer from "@/components/IAConceptAnalyzer";
import PersonalityComparator from "@/components/PersonalityComparator";
import CommercialAdBlock from "@/components/CommercialAdBlock";
import GuestEditorialColumn from "@/components/GuestEditorialColumn";
import { MOCK_PROVINCE_SENTIMENTS } from "@/lib/types";

interface Article {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: number;
  description: string;
  imageUrl?: string | null;
}

interface Config {
  label: string;
  emoji: string;
  description: string;
  query: string;
  color: string;
  topics: string[];
  icon: string;
}

function sentimentBadge(s: number) {
  if (s > 0.2) return { label: "Positivo", color: "#00e676", bg: "rgba(0,230,118,0.12)" };
  if (s < -0.2) return { label: "Crítico", color: "#ff1744", bg: "rgba(255,23,68,0.12)" };
  return { label: "Neutro", color: "#ffc400", bg: "rgba(255,196,0,0.12)" };
}

export default function CategoryPageClient({
  categoria,
  config,
}: {
  categoria: string;
  config: Config;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [provinceSentiments, setProvinceSentiments] = useState<Record<string, number>>(MOCK_PROVINCE_SENTIMENTS);
  const [analyzedTopic, setAnalyzedTopic] = useState<string>(config.label);
  const [analyzedArchetype, setAnalyzedArchetype] = useState<string | undefined>(undefined);

  const fetchNews = (query: string) => {
    setLoading(true);
    fetch(`/api/news?q=${encodeURIComponent(query)}&category=${encodeURIComponent(categoria)}&lang=es&country=ar`)
      .then((r) => r.json())
      .then((d) => {
        setArticles(d.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews(config.query);
  }, [config.query]);

  const handleTopicClick = (topic: string) => {
    setActiveTopic(topic);
    setAnalyzedTopic(topic);
    fetchNews(`argentina ${topic}`);
  };

  const handleAnalysisComplete = (analysis: any) => {
    if (analysis.provinceData) {
      setProvinceSentiments(analysis.provinceData);
    }
    if (analysis.analyzedEntity) {
      setAnalyzedTopic(analysis.analyzedEntity);
    }
    if (analysis.archetype) {
      setAnalyzedArchetype(analysis.archetype);
    }
  };

  const mainArticle = articles[0];
  const gridArticles = articles.slice(1, 7);
  const sideArticles = articles.slice(7);

  return (
    <main
      style={{
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "2rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* ─── HEADER DE SECCIÓN ESTILO DIARIO CLÁSICO ─── */}
      <div
        style={{
          borderBottom: "2px solid var(--glass-border)",
          paddingBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: `${config.color}18`,
              border: `2px solid ${config.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              flexShrink: 0,
            }}
          >
            {categoria === "politica" ? <Landmark size={24} color={config.color} /> :
             categoria === "deportes" ? <Trophy size={24} color={config.color} /> :
             categoria === "tecnologia" ? <Laptop size={24} color={config.color} /> :
             categoria === "ciencia" ? <Microscope size={24} color={config.color} /> :
             <MapPin size={24} color={config.color} />}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: config.color }}>
                SUPLEMENTO ESPECIAL · TALOS DIARIO
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Merriweather', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "var(--heading-color)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "0.2rem 0",
              }}
            >
              {config.label}
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                fontFamily: "'Merriweather', Georgia, serif",
                marginTop: "0.2rem",
                maxWidth: "640px",
                lineHeight: 1.5,
              }}
            >
              {config.description}
            </p>
          </div>
        </div>

        {/* Topics / Filtros Rápidos de Sección */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px dashed var(--glass-border)",
          }}
        >
          <button
            onClick={() => { setActiveTopic(null); setAnalyzedTopic(config.label); fetchNews(config.query); }}
            style={{
              background: !activeTopic ? config.color : "rgba(0,0,0,0.05)",
              border: `1px solid ${!activeTopic ? config.color : "var(--glass-border)"}`,
              borderRadius: "100px",
              padding: "0.35rem 0.95rem",
              color: !activeTopic ? "#fff" : "var(--text-primary)",
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            ★ Cobertura Principal
          </button>
          {config.topics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              style={{
                background: activeTopic === topic ? config.color : "rgba(0,0,0,0.05)",
                border: `1px solid ${activeTopic === topic ? config.color : "var(--glass-border)"}`,
                borderRadius: "100px",
                padding: "0.35rem 0.95rem",
                color: activeTopic === topic ? "#fff" : "var(--text-secondary)",
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* ─── LAYOUT PRINCIPAL DE SECCIÓN (2 COLUMNAS) ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.75rem" }} className="cat-layout">

        {/* ─── COLUMNA PRINCIPAL (NOTICIAS + ANALIZADOR) ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

          {/* NOTA PRINCIPAL DE LA SECCIÓN */}
          {loading ? (
            <div style={{
              height: "380px", borderRadius: "16px",
              background: "rgba(0,0,0,0.05)",
              border: "1px solid var(--glass-border)",
              animation: "shimmer 1.5s ease infinite",
            }} />
          ) : mainArticle ? (
            <a href={mainArticle.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid var(--glass-border)",
                background: "var(--card-bg)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = config.color;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {mainArticle.imageUrl ? (
                  <div style={{ position: "relative", height: "clamp(240px, 30vw, 380px)", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mainArticle.imageUrl} alt={mainArticle.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(10,14,26,0.92) 0%, rgba(10,14,26,0.3) 60%, transparent 100%)" }} />
                    <div style={{ position: "absolute", bottom: 0, padding: "1.5rem 1.75rem", right: 0, left: 0 }}>
                      {(() => { const b = sentimentBadge(mainArticle.sentiment); return (
                        <span style={{ display: "inline-block", background: b.bg, border: `1px solid ${b.color}`, color: b.color, borderRadius: "6px", padding: "0.25rem 0.65rem", fontSize: "0.65rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                          {b.label}
                        </span>
                      ); })()}
                      <h2 style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", fontWeight: 900, color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
                        {mainArticle.title}
                      </h2>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "2rem 1.75rem" }}>
                    <h2 style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", fontWeight: 900, color: "var(--heading-color)", lineHeight: 1.2 }}>
                      {mainArticle.title}
                    </h2>
                  </div>
                )}
                <div style={{ padding: "1.25rem 1.75rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.72rem", fontWeight: 800, color: config.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {mainArticle.source}
                    </span>
                    {mainArticle.description && (
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontFamily: "'Merriweather', Georgia, serif", lineHeight: 1.6, marginTop: "0.4rem" }}>
                        {mainArticle.description.slice(0, 180)}...
                      </p>
                    )}
                  </div>
                  <ExternalLink size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginLeft: "1.25rem" }} />
                </div>
              </div>
            </a>
          ) : null}

          {/* GRILLA DE NOTICIA SECUNDARIAS DE LA SECCIÓN */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ height: "180px", borderRadius: "14px", background: "rgba(0,0,0,0.05)", border: "1px solid var(--glass-border)", animation: "shimmer 1.5s ease infinite" }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {gridArticles.map((article) => {
                const b = sentimentBadge(article.sentiment);
                return (
                  <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      borderRadius: "14px",
                      border: "1px solid var(--glass-border)",
                      background: "var(--card-bg)",
                      padding: "1.1rem 1.25rem",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
                    }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = config.color;
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                        <h3 style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: "0.95rem", fontWeight: 700, color: "var(--heading-color)", lineHeight: 1.4, flex: 1, margin: 0 }}>
                          {article.title}
                        </h3>
                        <span style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          background: b.color, flexShrink: 0, marginTop: "4px",
                          boxShadow: `0 0 6px ${b.color}`,
                        }} title={`Sentimiento: ${b.label}`} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px dashed var(--glass-border)" }}>
                        <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.68rem", fontWeight: 800, color: config.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {article.source}
                        </span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }} suppressHydrationWarning>
                          <Clock size={10} />
                          {new Date(article.publishedAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* ─── ANALIZADOR CONTEXTUAL DE CONCEPTOS DE LA SECCIÓN ─── */}
          <IAConceptAnalyzer onAnalysisComplete={handleAnalysisComplete} />

          {/* MAPA DE CALOR TEMÁTICO DE LA SECCIÓN */}
          <div className="glass-card" style={{ padding: "1.5rem", background: "var(--card-bg)", border: "1px solid var(--glass-border)", borderRadius: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.7rem", fontWeight: 800, color: config.color, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Mapa de Sentimiento Territorial · {analyzedTopic}
              </span>
            </div>
            <div style={{ minHeight: "420px" }}>
              <HeatMapArgentina provinceData={provinceSentiments} topic={analyzedTopic} archetype={analyzedArchetype} />
            </div>
          </div>

          {/* COMPARADOR DE PERSONALIDADES EN LA SECCIÓN */}
          <PersonalityComparator />
        </div>

        {/* ─── SIDEBAR DE LA SECCIÓN (PUBLICIDAD + TENDENCIAS + RADIO) ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Anuncios Comerciales de Sección */}
          <CommercialAdBlock section={categoria} />

          {/* Columna de Opinión & Radio Mundial */}
          <GuestEditorialColumn />

          {/* Pulso de Cobertura Nacional */}
          <div className="glass-card" style={{ padding: "1.25rem", background: "var(--card-bg)", border: "1px solid var(--glass-border)", borderRadius: "16px" }}>
            <PulsoNacional provinceData={provinceSentiments} />
          </div>

          {/* Últimas Noticias Relacionadas */}
          {sideArticles.length > 0 && (
            <div className="glass-card" style={{ padding: "1.25rem", background: "var(--card-bg)", border: "1px solid var(--glass-border)", borderRadius: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <TrendingUp size={14} color={config.color} />
                <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.68rem", fontWeight: 800, color: config.color, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Radar de Cobertura · {config.label}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {sideArticles.slice(0, 5).map((article, i) => (
                  <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{
                      padding: "0.85rem 0",
                      borderBottom: i < 4 ? "1px solid var(--glass-border)" : "none",
                      display: "flex", gap: "0.85rem", alignItems: "flex-start",
                      transition: "all 0.15s"
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft = "0.35rem"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft = "0"; }}>
                      <span style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: "1.1rem", fontWeight: 900, color: "var(--text-muted)", opacity: 0.5, lineHeight: 1, minWidth: "1.4rem" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: "0.83rem", fontWeight: 600, color: "var(--heading-color)", lineHeight: 1.45, margin: 0 }}>
                        {article.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Pulso de la Calle & Narrativas */}
          <div className="glass-card" style={{ padding: "1.25rem", background: "var(--card-bg)", border: "1px solid var(--glass-border)", borderRadius: "16px" }}>
            <NarrativasEmergentes />
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .cat-layout { grid-template-columns: 1fr 380px !important; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </main>
  );
}
