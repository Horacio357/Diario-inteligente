"use client";

import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, Layers } from "lucide-react";

interface FlipbookPage {
  id: number;
  title: string;
  category: string;
  date: string;
  author: string;
  leadText: string;
  bodyColumns: string[];
  imageUrl?: string;
  imageCaption?: string;
  quote?: string;
  highlights?: string[];
}

const MOCK_PAGES: FlipbookPage[] = [
  {
    id: 1,
    category: "Edición Especial",
    date: new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    title: "El Nuevo Mapa de la Percepción Social en Argentina",
    author: "Redacción Talos · Unidad de Análisis",
    leadText: "Un estudio exhaustivo realizado mediante la orquestación de inteligencia artificial y minería de datos en tiempo real revela cómo han mutado los sentimientos colectivos en las 24 provincias.",
    bodyColumns: [
      "La velocidad a la que se transforman las opiniones en la era digital exige instrumentos de medición quirúrgicos. A través del monitoreo constante de redes sociales, medios digitales e interacciones en plataformas de streaming, el proyecto Talos ha logrado cartografiar el humor social argentino con una precisión inédita.",
      "Los arquetipos dominantes en el debate público muestran una polarización marcada entre la búsqueda de estabilidad institucional y la demanda de disrupción acelerada. Las provincias del centro del país registran índices de expectativa económica moderada, mientras que en los distritos patagónicos predomina una atención centrada en los recursos estratégicos y el empleo."
    ],
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80",
    imageCaption: "Figura 1.1: Cartografía algorítmica de interacciones en tiempo real sobre nodos de discusión federales.",
    quote: "La opinión pública no es estática: es un ecosistema vivo de narrativas en constante colisión.",
    highlights: [
      "✦ 64.2% Concentración del debate en ejes socioeconómicos.",
      "✦ 24 Provincias sincronizadas vía modelos predictivos NLP.",
      "✦ 3.4M Menciones analizadas en la última semana."
    ]
  },
  {
    id: 2,
    category: "Inteligencia Política",
    date: "Septiembre 2025",
    title: "Dinámica de Alianzas y Conflicto en el Escenario Nacional",
    author: "Laboratorio de Datos Talos",
    leadText: "El análisis de redes de poder muestra una reconfiguración de los bloques políticos tradicionales en el Congreso y las gobernaciones.",
    bodyColumns: [
      "La fragmentación de los consensos históricos ha dado lugar a un mapa político fluido donde las alianzas se construyen sobre acuerdos temáticos específicos en lugar de pertenencias partidarias rígidas.",
      "Las métricas de contagio narrativo indican que las intervenciones mediáticas no tradicionales (podcasts, livestreams y redes de mensajería) tienen ahora un peso 300% mayor en la formación de agenda que los discursos formales."
    ],
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80",
    imageCaption: "Figura 2.3: Visualización de densidad de vínculos entre actores clave del parlamento.",
    quote: "Las plataformas de transmisión directa han suplantado a las ruedas de prensa tradicionales.",
    highlights: [
      "✦ +300% Incremento en el impacto de canales digitales descentralizados.",
      "✦ Reconfiguración de 5 bloques parlamentarios clave.",
      "✦ Índice de Volatilidad Narrativa: 7.8/10."
    ]
  },
  {
    id: 3,
    category: "Tecnología & Futuro",
    date: "Septiembre 2025",
    title: "La Revolución del Periodismo Aumentado por IA",
    author: "Unidad de Innovación",
    leadText: "Cómo la integración de LLMs y modelos predictivos transforma la manera en que consumimos e investigamos la realidad nacional.",
    bodyColumns: [
      "El periodismo aumentado no reemplaza la investigación humana: la potencia. Al procesar simultáneamente miles de señales públicas, permite detectar patrones emergentes semanas antes de que se conviertan en titulares.",
      "La transparencia algorítmica y la auditoría de fuentes son el pilar fundamental para garantizar un análisis objetivo, imparcial y de alta densidad informativa."
    ],
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    imageCaption: "Figura 3.1: Arquitectura de procesamiento neuronal para la detección temprana de tendencias.",
    quote: "La síntesis de grandes volúmenes de información otorga superpoderes analíticos al lector.",
    highlights: [
      "✦ 100% Transparencia algorítmica y trazabilidad de datos.",
      "✦ Reducción de latencia en la detección de tendencias: -85%.",
      "✦ Integración multi-fuente en tiempo real."
    ]
  }
];

export default function NewspaperFlipbook({ articles }: { articles?: any[] }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);

  const pages = MOCK_PAGES;
  const page = pages[currentPageIndex];

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setFlipping("next");
      setTimeout(() => {
        setCurrentPageIndex(prev => prev + 1);
        setFlipping(null);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setFlipping("prev");
      setTimeout(() => {
        setCurrentPageIndex(prev => prev - 1);
        setFlipping(null);
      }, 300);
    }
  };

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: "16px",
      padding: "1.5rem",
      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
      position: "relative",
      overflow: "hidden"
    }}>

      {/* Header del Bloque */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "1.25rem", paddingBottom: "0.75rem",
        borderBottom: "1px solid var(--glass-border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookOpen size={18} color="var(--accent-primary)" />
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.88rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent-primary)" }}>
            Diario Interactivo · Edición Impresa Digital
          </span>
        </div>

        {/* Paginador */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "var(--text-muted)" }}>
            Página {currentPageIndex + 1} de {pages.length}
          </span>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <button
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
              style={{
                background: "rgba(0,0,0,0.1)", border: "1px solid var(--glass-border)",
                borderRadius: "6px", width: "32px", height: "32px", display: "flex",
                alignItems: "center", justifyContent: "center", color: "var(--text-primary)",
                cursor: currentPageIndex === 0 ? "not-allowed" : "pointer", opacity: currentPageIndex === 0 ? 0.3 : 1
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPageIndex === pages.length - 1}
              style={{
                background: "rgba(0,0,0,0.1)", border: "1px solid var(--glass-border)",
                borderRadius: "6px", width: "32px", height: "32px", display: "flex",
                alignItems: "center", justifyContent: "center", color: "var(--text-primary)",
                cursor: currentPageIndex === pages.length - 1 ? "not-allowed" : "pointer", opacity: currentPageIndex === pages.length - 1 ? 0.3 : 1
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── HOJA DE PAPEL CON EFECTO DE LIBRO (DOBLE PÁGINA) ─── */}
      <div style={{
        perspective: "1200px",
        minHeight: "440px",
        position: "relative"
      }}>
        <div style={{
          background: "var(--primary-900)",
          border: "1px solid var(--glass-border)",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
          transform: flipping === "next" ? "rotateY(-12deg) scale(0.98)" : flipping === "prev" ? "rotateY(12deg) scale(0.98)" : "rotateY(0deg) scale(1)",
          opacity: flipping ? 0.7 : 1,
          transformOrigin: flipping === "next" ? "left center" : "right center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Contenedor Grilla 2 Hojas (Izquierda / Derecha) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem",
            position: "relative",
            zIndex: 2
          }}>
            {/* ─── PÁGINA IZQUIERDA ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: "2px solid var(--text-primary)", paddingBottom: "0.5rem"
              }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent-primary)" }}>
                  ★ TALOS PRESS · {page.category}
                </span>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "0.72rem", fontStyle: "italic", color: "var(--text-muted)" }}>
                  Página Izq.
                </span>
              </div>

              <h2 style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                fontWeight: 800,
                color: "var(--heading-color)",
                lineHeight: 1.18,
                letterSpacing: "-0.01em"
              }}>
                {page.title}
              </h2>

              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                Por {page.author}
              </div>

              <p style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.98rem",
                lineHeight: 1.6,
                color: "var(--text-primary)",
                fontWeight: 600,
                borderLeft: "3px solid var(--accent-primary)",
                paddingLeft: "0.85rem"
              }}>
                {page.leadText}
              </p>

              {page.bodyColumns[0] && (
                <div style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem", lineHeight: 1.65, color: "var(--text-secondary)", textAlign: "justify" }}>
                  <span style={{
                    float: "left", fontSize: "3rem", lineHeight: 0.8,
                    fontWeight: 900, marginRight: "0.5rem", marginTop: "0.15rem",
                    color: "var(--accent-primary)", fontFamily: "Georgia, serif"
                  }}>
                    {page.bodyColumns[0].charAt(0)}
                  </span>
                  {page.bodyColumns[0].slice(1)}
                </div>
              )}

              {page.quote && (
                <blockquote style={{
                  marginTop: "auto",
                  padding: "0.85rem 1.25rem",
                  background: "rgba(0,0,0,0.03)",
                  borderTop: "1px dashed var(--glass-border)",
                  borderBottom: "1px dashed var(--glass-border)",
                  textAlign: "center",
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.88rem",
                  color: "var(--heading-color)"
                }}>
                  "{page.quote}"
                </blockquote>
              )}
            </div>

            {/* ─── PÁGINA DERECHA ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: "2px solid var(--text-primary)", paddingBottom: "0.5rem"
              }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent-primary)" }}>
                  EDICIÓN DIGITAL IMPRESA
                </span>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "0.72rem", fontStyle: "italic", color: "var(--text-muted)" }}>
                  {page.date}
                </span>
              </div>

              {/* Imagen Periodística Impresa */}
              {page.imageUrl && (
                <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.05)", padding: "0.35rem" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.imageUrl}
                    alt={page.title}
                    style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px", filter: "contrast(1.05) saturate(0.9)" }}
                  />
                  {page.imageCaption && (
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "Georgia, serif", fontStyle: "italic", marginTop: "0.4rem", padding: "0 0.25rem" }}>
                      {page.imageCaption}
                    </div>
                  )}
                </div>
              )}

              {/* Segunda columna de texto */}
              {page.bodyColumns[1] && (
                <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem", lineHeight: 1.65, color: "var(--text-secondary)", textAlign: "justify" }}>
                  {page.bodyColumns[1]}
                </p>
              )}

              {/* Recuadro de Hallazgos Clave */}
              {page.highlights && page.highlights.length > 0 && (
                <div style={{
                  marginTop: "auto",
                  background: "rgba(0,212,255,0.04)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  padding: "0.85rem 1rem",
                }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)", marginBottom: "0.4rem" }}>
                    ✦ Hallazgos Clave de Inteligencia
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {page.highlights.map((h, i) => (
                      <span key={i} style={{ fontFamily: "Georgia, serif", fontSize: "0.78rem", color: "var(--text-primary)" }}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sombra de plegado central estilo libro */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: "50%", width: "40px",
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
            pointerEvents: "none",
            zIndex: 3
          }} />
        </div>
      </div>

      {/* Footer de navegación por hojas */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: "1.25rem", paddingTop: "0.75rem", borderTop: "1px solid var(--glass-border)"
      }}>
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
          style={{
            background: "none", border: "none", color: currentPageIndex === 0 ? "var(--text-muted)" : "var(--accent-primary)",
            fontFamily: "Outfit, sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: currentPageIndex === 0 ? "default" : "pointer",
            display: "flex", alignItems: "center", gap: "0.4rem"
          }}
        >
          ← Dar vuelta hoja anterior
        </button>

        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
          Consejo: Podés cambiar el tema en la barra superior para ver esta versión en papel prensa real.
        </span>

        <button
          onClick={handleNext}
          disabled={currentPageIndex === pages.length - 1}
          style={{
            background: "none", border: "none", color: currentPageIndex === pages.length - 1 ? "var(--text-muted)" : "var(--accent-primary)",
            fontFamily: "Outfit, sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: currentPageIndex === pages.length - 1 ? "default" : "pointer",
            display: "flex", alignItems: "center", gap: "0.4rem"
          }}
        >
          Siguiente página →
        </button>
      </div>
    </div>
  );
}
