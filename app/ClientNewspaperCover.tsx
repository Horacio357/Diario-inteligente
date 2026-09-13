"use client";

import { useEffect, useState } from "react";
import NarrativasEmergentes from "@/components/NarrativasEmergentes";
import { Zap, Clock, TrendingUp, Wifi, Sparkles, BarChart3, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";
import HeatMapArgentina from "@/components/HeatMapArgentina";
import { MOCK_PROVINCE_SENTIMENTS } from "@/lib/types";
import WidgetsBar from "./WidgetsBar";
import PulsoNacional from "@/components/PulsoNacional";
import NewspaperFlipbook from "@/components/NewspaperFlipbook";
import GuestEditorialColumn from "@/components/GuestEditorialColumn";
import WorldRadioPlayer from "@/components/WorldRadioPlayer";
import PersonalityComparator from "@/components/PersonalityComparator";
import SponsorTickerBar from "@/components/SponsorTickerBar";
import IAConceptAnalyzer from "@/components/IAConceptAnalyzer";
import CommercialAdBlock from "@/components/CommercialAdBlock";
import MatrizImpactoEconomico from "@/components/MatrizImpactoEconomico";

function sentimentDot(s: number) {
  if (s > 0.2) return { color: "#00e676", label: "+" };
  if (s < -0.2) return { color: "#ff1744", label: "−" };
  return { color: "#ffc400", label: "=" };
}

const DEFAULT_SECONDARY_FALLBACKS = [
  {
    id: "fb-1",
    slug: "tension-en-el-congreso-debate-presupuestario",
    title: "Tensión en el Congreso: El debate presupuestario polariza la opinión pública",
    category: "POLÍTICA",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80",
    summary: "El monitoreo de redes y medios digitales refleja opiniones divididas sobre el rumbo fiscal del país."
  },
  {
    id: "fb-2",
    slug: "radar-economico-inflacion-salarios-2026",
    title: "Radar Económico: Expectativas de inflación y poder adquisitivo en las provincias",
    category: "ECONOMÍA",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80",
    summary: "Las métricas de consumo y salario real marcan diferencias clave entre el Centro y la Patagonia."
  },
  {
    id: "fb-3",
    slug: "tecnologia-y-futuro-periodismo-aumentado-ia",
    title: "Innovación Tecnológica: Cómo la Inteligencia Artificial transforma la lectura de noticias",
    category: "TECNOLOGÍA",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    summary: "El uso de modelos de lenguaje permite detectar tendencias y narrativas antes de que lleguen a la agenda masiva."
  },
  {
    id: "fb-4",
    slug: "matriz-energetica-y-desarrollo-regional",
    title: "Matriz Energética: Proyectos de energía limpia impulsan el empleo en el Norte Grande",
    category: "REGIONALES",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80",
    summary: "Inversiones fotovoltaicas y eólicas generan empleo técnico cualificado en Jujuy, Salta y San Juan."
  },
  {
    id: "fb-5",
    slug: "sociedad-y-tendencias-digitales-2026",
    title: "Transformación Cultural: El auge del trabajo híbrido en ciudades intermedias",
    category: "SOCIEDAD",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    summary: "Nuevas dinámicas poblacionales benefician el comercio local y los servicios en municipios del interior."
  }
];

export default function ClientNewspaperCover({ editorialArticles }: { editorialArticles: any[] }) {
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [provinceSentiments, setProvinceSentiments] = useState<Record<string, number>>(MOCK_PROVINCE_SENTIMENTS);
  const [analyzedTopic, setAnalyzedTopic] = useState<string>("Actualidad");
  const [analyzedArchetype, setAnalyzedArchetype] = useState<string | undefined>(undefined);

  const handleAnalysisComplete = (analysis: any) => {
    if (analysis.provinceData) {
      setProvinceSentiments(analysis.provinceData);
    }
    setAnalyzedTopic(analysis.name);
    setAnalyzedArchetype(analysis.archetype);

    // Desplazar suavemente al mapa para mostrar el resultado reflejado
    setTimeout(() => {
      const mapElement = document.getElementById("mapa-argentina");
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  };

  useEffect(() => {
    fetch("/api/news?q=argentina")
      .then(res => res.json())
      .then(data => {
        setLiveNews(data.articles || []);
        setLoadingNews(false);
      })
      .catch(() => setLoadingNews(false));

    fetch("/api/province/pulse")
      .then(res => res.json())
      .then(data => {
        if (data.provinces) setProvinceSentiments(data.provinces);
      })
      .catch(() => {});
  }, []);

  const mainArticle = editorialArticles[0];
  const fetchedSecondary = editorialArticles.slice(1);
  const secondaryArticles = fetchedSecondary.length >= 4 
    ? fetchedSecondary 
    : [...fetchedSecondary, ...DEFAULT_SECONDARY_FALLBACKS.slice(0, 5 - fetchedSecondary.length)];

  return (
    <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "2rem 1.25rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* ─── ENCABEZADO DE PORTADA ─── */}
      <div style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
          <h1 style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--heading-color)",
            lineHeight: 1,
          }}>
            La Tapa de Hoy
          </h1>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--accent-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            background: "rgba(0,212,255,0.08)",
            border: "1px solid var(--accent-primary)",
            padding: "0.25rem 0.75rem",
            borderRadius: "100px",
          }} suppressHydrationWarning>
            {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>
        <p style={{ marginTop: "0.4rem", color: "var(--subtext-color)", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>
          Noticias curadas · Análisis IA · Mapa de sentimiento en vivo
        </p>
      </div>

      {/* ─── HERO: MAPA + PULSO + NOTA PRINCIPAL ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }} className="hero-grid" id="mapa-argentina">
        
        {/* MAPA DE CALOR */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#00e676",
              boxShadow: "0 0 8px #00e676",
              animation: "pulse 2s infinite",
            }} />
            <span style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "var(--subtext-color)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}>
              Monitor de Humor Social · {analyzedTopic}
            </span>
          </div>
          <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--heading-color)", marginBottom: "1.25rem" }}>
            Pulso Nacional en Tiempo Real
          </h3>
          <div style={{ width: "100%", minHeight: "420px" }}>
            <HeatMapArgentina provinceData={provinceSentiments} topic={analyzedTopic} archetype={analyzedArchetype} />
          </div>
        </div>

        {/* PULSO NACIONAL (Centro) */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <PulsoNacional provinceData={provinceSentiments} />
        </div>

        {/* NOTA PRINCIPAL */}
        {mainArticle && (
          <Link href={`/noticias/${mainArticle.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
            <div style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              cursor: "pointer",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,212,255,0.3)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}>
              {mainArticle.imageUrl && (
                <div style={{ position: "relative", height: "clamp(220px, 35vw, 420px)", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mainArticle.imageUrl} alt={mainArticle.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(0deg, rgba(6,8,18,0.97) 0%, rgba(6,8,18,0.4) 50%, transparent 100%)",
                  }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem 1.75rem" }}>
                    <span style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#00d4ff",
                      background: "rgba(0,212,255,0.12)",
                      border: "1px solid rgba(0,212,255,0.25)",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                      display: "inline-block",
                      marginBottom: "0.75rem",
                    }}>
                      ✦ Lectura Interactiva
                    </span>
                    <h2 style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                    }}>
                      {mainArticle.title}
                    </h2>
                  </div>
                </div>
              )}
              <div style={{ padding: "1.25rem 1.75rem 1.5rem" }}>
                <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontFamily: "Inter, sans-serif" }}>
                  {mainArticle.summary}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "rgba(0,212,255,0.7)", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}>
                    Leer análisis completo →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* ─── BLOQUE CENTRO: DIARIO INTERACTIVO (FLIPBOOK) + COLUMNA DE INVITADOS & RADIO MUNDIAL ─── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "1.5rem",
        alignItems: "start",
      }}>
        {/* Lado izquierdo: Lector estilo libro impreso */}
        <div style={{ minWidth: 0, flex: 2 }}>
          <NewspaperFlipbook articles={editorialArticles} />
        </div>

        {/* Lado derecho (Escritorio): Columna de Invitados + Sintonizador de Radio Mundial en simultáneo */}
        <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <GuestEditorialColumn />
          <WorldRadioPlayer />
        </div>
      </div>

      {/* ─── ANALIZADOR DE CONCEPTOS & FIGURAS CON IA ─── */}
      <IAConceptAnalyzer onAnalysisComplete={handleAnalysisComplete} />

      {/* ─── MATRIZ DE IMPACTO ECONÓMICO VS HUMOR SOCIAL ─── */}
      <MatrizImpactoEconomico />

      {/* ─── COMPARADOR DE PERSONALIDADES E INFORME IA ─── */}
      <PersonalityComparator />

      {/* ─── WIDGETS BAR ─── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <span style={{ width: "20px", height: "1px", background: "#00d4ff", opacity: 0.4 }} />
          <span style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "0.62rem",
            fontWeight: 700,
            color: "rgba(0,212,255,0.7)",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
          }}>
            Datos del Sistema
          </span>
        </div>
        <WidgetsBar />
      </div>

      {/* ─── SECCIÓN SECUNDARIA: NOTAS + PUBLICIDAD & PROMOS + SIDEBAR ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }} className="secondary-grid">

        {/* COLUMNA 1: NOTICIAS SECUNDARIAS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {secondaryArticles.map((article, i) => (
            <Link key={article.id} href={`/noticias/${article.slug}`}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{
                borderRadius: "14px",
                border: "1px solid var(--glass-border)",
                background: "var(--card-bg)",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s",
                cursor: "pointer",
              }}>
                {article.imageUrl && (
                  <div style={{ height: "160px", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={article.imageUrl} alt={article.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ padding: "1rem 1.1rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "var(--accent-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: "0.4rem",
                    display: "block",
                  }}>
                    {article.category}
                  </span>
                  <h3 style={{
                    fontFamily: "Merriweather, Georgia, serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--heading-color)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                    flex: 1,
                  }}>
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.4rem", lineHeight: 1.5, fontFamily: "Merriweather, Georgia, serif" }}>
                      {article.summary.slice(0, 110)}...
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* COLUMNA 2 (CENTRAL): PUBLICIDAD + PROMOCIONES + INFORMACIÓN GENERAL */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Anuncio Principal / Comercial */}
          <CommercialAdBlock section="global" />

          {/* Promoción Exclusiva: Talos Premium / Newsletter */}
          <div className="glass-card" style={{
            padding: "1.25rem",
            background: "linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(124, 58, 237, 0.05))",
            border: "1px solid var(--glass-border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sparkles size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: "0.62rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                PROMOCIÓN EXCLUSIVA TALOS
              </span>
            </div>
            <h4 style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: "0.95rem", fontWeight: 800, color: "var(--heading-color)" }}>
              Dossier Ejecutivo & Alertas Tempranas
            </h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5, fontFamily: "Merriweather, Georgia, serif" }}>
              Recibí todas las mañanas el resumen de inteligencia con los cambios de humor social y tendencias clave del país.
            </p>
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.2rem" }}>
              <input
                type="email"
                placeholder="Tu e-mail corporativo..."
                style={{
                  flex: 1,
                  background: "var(--primary-900)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  padding: "0.4rem 0.65rem",
                  color: "var(--heading-color)",
                  fontSize: "0.75rem",
                  fontFamily: "Merriweather, Georgia, serif",
                  outline: "none"
                }}
              />
              <button className="btn-primary" style={{ fontSize: "0.72rem", padding: "0.4rem 0.75rem" }}>
                Suscribir
              </button>
            </div>
          </div>

          {/* Bloque de Información General & Indicadores */}
          <div className="glass-card" style={{
            padding: "1.25rem",
            background: "var(--card-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <BarChart3 size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: "0.62rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                INFORMACIÓN GENERAL
              </span>
            </div>
            <h4 style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: "0.92rem", fontWeight: 800, color: "var(--heading-color)" }}>
              Índices de Cobertura Nacional
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "Merriweather, Georgia, serif" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--glass-border)", paddingBottom: "0.3rem" }}>
                <span>Monitoreo Político en Redes:</span>
                <b style={{ color: "var(--heading-color)" }}>48% del volumen</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--glass-border)", paddingBottom: "0.3rem" }}>
                <span>Atención en Economía & Precios:</span>
                <b style={{ color: "var(--heading-color)" }}>36% del volumen</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Sociedad & Deportes:</span>
                <b style={{ color: "var(--heading-color)" }}>16% del volumen</b>
              </div>
            </div>
          </div>

          {/* Indicadores Financieros & Mercado */}
          <div className="glass-card" style={{
            padding: "1.25rem",
            background: "var(--card-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <TrendingUp size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: "0.62rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                INDICADORES DE MERCADO
              </span>
            </div>
            <h4 style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: "0.92rem", fontWeight: 800, color: "var(--heading-color)" }}>
              Cotizaciones & Riesgo País
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.75rem", fontFamily: "Merriweather, Georgia, serif" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--glass-border)", paddingBottom: "0.3rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Dólar Oficial:</span>
                <b style={{ color: "var(--heading-color)" }}>$1.045,50 <span style={{ color: "#00e676", fontSize: "0.68rem" }}>+0.2%</span></b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--glass-border)", paddingBottom: "0.3rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Dólar Blue:</span>
                <b style={{ color: "var(--heading-color)" }}>$1.385,00 <span style={{ color: "#ff1744", fontSize: "0.68rem" }}>-0.5%</span></b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--glass-border)", paddingBottom: "0.3rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Riesgo País (EMBI):</span>
                <b style={{ color: "var(--heading-color)" }}>1.240 pts <span style={{ color: "#00e676", fontSize: "0.68rem" }}>-12 pts</span></b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>S&P Merval:</span>
                <b style={{ color: "var(--heading-color)" }}>1.840.500 <span style={{ color: "#00e676", fontSize: "0.68rem" }}>+1.4%</span></b>
              </div>
            </div>
          </div>

          {/* Anuncio Comercial Ventas */}
          <div className="glass-card" style={{
            padding: "1.25rem",
            background: "linear-gradient(135deg, rgba(255,107,0,0.06), rgba(0,212,255,0.06))",
            border: "1px solid rgba(255,107,0,0.3)",
            borderRadius: "16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}>
            <div style={{ fontSize: "0.65rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "#ff6b00", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              ESPACIO PATROCINADO · ADVERTORIAL
            </div>
            <h4 style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: "0.92rem", fontWeight: 800, color: "var(--heading-color)" }}>
              Publicitá tu Empresa o Lanzamiento en Talos Diario
            </h4>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "Merriweather, Georgia, serif" }}>
              Llegá a decisores, ejecutivos y líderes de opinión en todo el país.
            </p>
            <a href="mailto:publicidad@talos.ar" style={{
              textDecoration: "none", background: "#ff6b00", color: "#fff",
              fontSize: "0.72rem", fontWeight: 800, fontFamily: "Outfit, sans-serif",
              padding: "0.45rem 0.85rem", borderRadius: "8px", display: "inline-block", marginTop: "0.2rem"
            }}>
              Contactar Departamento de Ventas →
            </a>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* ÚLTIMO MOMENTO */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.1rem" }}>
              <Wifi size={13} color="var(--accent-primary)" />
              <span style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.62rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "var(--accent-primary)",
              }}>
                En tiempo real
              </span>
              <span style={{
                marginLeft: "auto",
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: "#00e676",
                boxShadow: "0 0 8px #00e676",
              }} />
            </div>
            <h3 style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "var(--heading-color)",
              letterSpacing: "-0.02em",
              marginBottom: "1.1rem",
            }}>
              Último Momento
            </h3>

            {loadingNews ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{
                    height: "60px",
                    borderRadius: "10px",
                    background: "rgba(0,0,0,0.05)",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {liveNews.slice(0, 6).map((news, i) => {
                  const dot = sentimentDot(news.sentiment ?? 0);
                  return (
                    <a key={news.id} href={news.url} target="_blank" rel="noopener noreferrer"
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      <div style={{
                        padding: "0.85rem 0",
                        borderBottom: i < 5 ? "1px solid var(--glass-border)" : "none",
                        display: "flex",
                        gap: "0.85rem",
                        alignItems: "flex-start",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft = "0.4rem"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft = "0"; }}>
                        {/* Número de orden */}
                        <span style={{
                          fontFamily: "Outfit, sans-serif",
                          fontSize: "1.2rem",
                          fontWeight: 900,
                          color: "var(--text-muted)",
                          opacity: 0.4,
                          lineHeight: 1,
                          minWidth: "1.4rem",
                          paddingTop: "2px",
                        }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Contenido */}
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.83rem",
                            fontWeight: 500,
                            color: "var(--text-primary)",
                            lineHeight: 1.45,
                            marginBottom: "0.35rem",
                          }}>
                            {news.title}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                            <span style={{
                              fontFamily: "Outfit, sans-serif",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "var(--accent-primary)",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}>
                              {news.source}
                            </span>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.5rem" }}>●</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }} suppressHydrationWarning>
                              <Clock size={9} />
                              {new Date(news.publishedAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {/* Indicador de sentimiento */}
                            <span style={{
                              marginLeft: "auto",
                              width: "5px", height: "5px",
                              borderRadius: "50%",
                              background: dot.color,
                              boxShadow: `0 0 6px ${dot.color}`,
                              flexShrink: 0,
                            }} title={`Sentimiento: ${dot.label}`} />
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* PULSO DE LA CALLE */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.1rem" }}>
              <TrendingUp size={13} color="#00d4ff" />
              <span style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.62rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "#00d4ff",
              }}>
                El Pulso de la Calle
              </span>
            </div>
            <NarrativasEmergentes />
          </div>

        </div>
      </div>

      {/* ─── CINTA DE SPONSORS & ANUNCIOS DEL ADMIN ─── */}
      <SponsorTickerBar />

      <style>{`
        @media (min-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr 320px 1.4fr !important; }
          .secondary-grid { grid-template-columns: 1.1fr 320px 360px !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .secondary-grid { grid-template-columns: 1fr 320px !important; }
        }
        @media (max-width: 767px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .secondary-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </main>
  );
}
