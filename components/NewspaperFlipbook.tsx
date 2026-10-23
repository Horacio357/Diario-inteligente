"use client";

import { useState, useRef, useMemo, TouchEvent } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Smartphone, Sparkles, Layers, Eye, MoveHorizontal } from "lucide-react";

interface FlipbookPage {
  id: number | string;
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

const DEFAULT_MOCK_PAGES: FlipbookPage[] = [
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
    date: "Edición Federal",
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
    date: "Investigación Especial",
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
  const [flipPhase, setFlipPhase] = useState<"idle" | "folding-out" | "folding-in">("idle");
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [mobileSection, setMobileSection] = useState<"all" | "left" | "right">("all");

  // Touch tracking for swipe gestures
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Map real articles if provided, otherwise use curated edition
  const pages: FlipbookPage[] = useMemo(() => {
    if (articles && articles.length > 0) {
      const mapped = articles.slice(0, 4).map((art, idx) => ({
        id: art.id || idx + 1,
        category: art.category || "Actualidad",
        date: art.publishedAt ? new Date(art.publishedAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }) : "Edición de Hoy",
        title: art.title || "Crónica de Coyuntura Nacional",
        author: art.author || "Redacción Talos",
        leadText: art.summary || "Resumen de coyuntura y monitoreo algorítmico de hechos destacados.",
        bodyColumns: [
          art.content ? art.content.slice(0, 320) + "..." : "Análisis de cobertura periodística y repercusión comunitaria en el territorio argentino.",
          art.content && art.content.length > 320 ? art.content.slice(320, 640) + "..." : "Los registros de opinión reflejan un alto interés en las implicancias de esta temática a escala federal."
        ],
        imageUrl: art.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80",
        imageCaption: `Foto periodística: Cobertura de ${art.title || "la jornada"}.`,
        quote: art.summary ? `"${art.summary.slice(0, 90)}..."` : "El monitoreo en tiempo real brinda una perspectiva transparente.",
        highlights: [
          `✦ Repercusión mediática en tiempo real.`,
          `✦ Sección: ${art.category || "General"}.`,
          `✦ Mapeo territorial sincronizado.`
        ]
      }));

      // If fewer than 2, fill with mock pages
      return mapped.length >= 2 ? mapped : [...mapped, ...DEFAULT_MOCK_PAGES.slice(mapped.length)];
    }
    return DEFAULT_MOCK_PAGES;
  }, [articles]);

  const page = pages[currentPageIndex] || pages[0];

  const handleNext = () => {
    if (currentPageIndex >= pages.length - 1 || flipPhase !== "idle") return;

    setFlipDirection("next");
    setFlipPhase("folding-out");

    setTimeout(() => {
      setCurrentPageIndex((prev) => prev + 1);
      setFlipPhase("folding-in");

      setTimeout(() => {
        setFlipPhase("idle");
        setFlipDirection(null);
      }, 220);
    }, 220);
  };

  const handlePrev = () => {
    if (currentPageIndex <= 0 || flipPhase !== "idle") return;

    setFlipDirection("prev");
    setFlipPhase("folding-out");

    setTimeout(() => {
      setCurrentPageIndex((prev) => prev - 1);
      setFlipPhase("folding-in");

      setTimeout(() => {
        setFlipPhase("idle");
        setFlipDirection(null);
      }, 220);
    }, 220);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe must be significantly greater than vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        handleNext(); // Deslizar hacia la izquierda = siguiente
      } else {
        handlePrev(); // Deslizar hacia la derecha = anterior
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      className="flipbook-root"
      style={{
        background: "var(--card-bg, #0d1528)",
        border: "1px solid var(--card-border, rgba(0, 212, 255, 0.15))",
        borderRadius: "16px",
        padding: "1.25rem",
        boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ─── ESTILOS Y ANIMACIONES REALISTAS DE PAPEL DE DIARIO ─── */}
      <style>{`
        /* Animaciones 3D de hoja física de diario */
        @keyframes flipPaperFoldOutNext {
          0% {
            transform: rotateY(0deg) skewY(0deg);
            filter: brightness(1);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          50% {
            transform: rotateY(-40deg) skewY(-2deg) scale(0.98);
            filter: brightness(0.88);
            box-shadow: -15px 10px 30px rgba(0,0,0,0.35);
          }
          100% {
            transform: rotateY(-85deg) skewY(-3deg) scale(0.94);
            filter: brightness(0.65);
            opacity: 0.1;
          }
        }

        @keyframes flipPaperFoldInNext {
          0% {
            transform: rotateY(85deg) skewY(3deg) scale(0.94);
            filter: brightness(0.65);
            opacity: 0.1;
          }
          50% {
            transform: rotateY(35deg) skewY(2deg) scale(0.98);
            filter: brightness(0.9);
            opacity: 0.9;
          }
          100% {
            transform: rotateY(0deg) skewY(0deg) scale(1);
            filter: brightness(1);
            opacity: 1;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
        }

        @keyframes flipPaperFoldOutPrev {
          0% {
            transform: rotateY(0deg) skewY(0deg);
            filter: brightness(1);
          }
          50% {
            transform: rotateY(40deg) skewY(2deg) scale(0.98);
            filter: brightness(0.88);
            box-shadow: 15px 10px 30px rgba(0,0,0,0.35);
          }
          100% {
            transform: rotateY(85deg) skewY(3deg) scale(0.94);
            filter: brightness(0.65);
            opacity: 0.1;
          }
        }

        @keyframes flipPaperFoldInPrev {
          0% {
            transform: rotateY(-85deg) skewY(-3deg) scale(0.94);
            filter: brightness(0.65);
            opacity: 0.1;
          }
          50% {
            transform: rotateY(-35deg) skewY(-2deg) scale(0.98);
            filter: brightness(0.9);
            opacity: 0.9;
          }
          100% {
            transform: rotateY(0deg) skewY(0deg) scale(1);
            filter: brightness(1);
            opacity: 1;
          }
        }

        /* Brillo de curvatura cilíndrica de papel */
        @keyframes paperCurlShineSweep {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 0.35;
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .flip-anim-next-out {
          animation: flipPaperFoldOutNext 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
          transform-origin: left center;
        }
        .flip-anim-next-in {
          animation: flipPaperFoldInNext 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
          transform-origin: left center;
        }
        .flip-anim-prev-out {
          animation: flipPaperFoldOutPrev 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
          transform-origin: right center;
        }
        .flip-anim-prev-in {
          animation: flipPaperFoldInPrev 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
          transform-origin: right center;
        }

        /* Dog-ear corner fold en la hoja */
        .dog-ear-corner {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 28px 28px;
          border-color: transparent transparent var(--accent-primary) transparent;
          opacity: 0.4;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .dog-ear-corner:hover {
          border-width: 0 0 38px 38px;
          opacity: 0.9;
          filter: drop-shadow(-3px -3px 5px rgba(0,0,0,0.5));
        }

        /* Responsive Layout: Desktop vs Mobile */
        .flipbook-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          position: relative;
          z-index: 2;
        }
        .flipbook-spine {
          display: block;
        }
        .mobile-section-nav {
          display: none;
        }
        .mobile-swipe-hint {
          display: none;
        }

        @media (max-width: 820px) {
          .flipbook-root {
            padding: 0.85rem !important;
          }
          .flipbook-paper-container {
            padding: 1.15rem 0.9rem !important;
            border-radius: 10px !important;
          }
          .flipbook-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          /* Ocultar la línea vertical de lomo central para que NO corte el contenido por la mitad */
          .flipbook-spine {
            display: none !important;
          }
          .mobile-section-nav {
            display: flex !important;
          }
          .mobile-swipe-hint {
            display: flex !important;
          }
        }
      `}</style>

      {/* ─── ENCABEZADO DEL BLOQUE ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--glass-border)",
          flexWrap: "wrap",
          gap: "0.6rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookOpen size={18} color="var(--accent-primary)" />
          <div>
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.82rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--accent-primary)",
                display: "block",
                lineHeight: 1.2,
              }}
            >
              Diario Interactivo · Edición Impresa
            </span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
              Pliego editorial digitalizado · Lectura periódica
            </span>
          </div>
        </div>

        {/* Paginador y Controles Táctiles */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.72rem",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              color: "var(--text-muted)",
              background: "rgba(255,255,255,0.03)",
              padding: "0.25rem 0.6rem",
              borderRadius: "6px",
              border: "1px solid var(--glass-border)",
            }}
          >
            Pliego {currentPageIndex + 1} de {pages.length}
          </span>

          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button
              onClick={handlePrev}
              disabled={currentPageIndex === 0 || flipPhase !== "idle"}
              title="Página anterior (Deslizar hacia la derecha)"
              aria-label="Página anterior"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: currentPageIndex === 0 ? "var(--text-muted)" : "var(--accent-primary)",
                cursor: currentPageIndex === 0 ? "not-allowed" : "pointer",
                opacity: currentPageIndex === 0 ? 0.35 : 1,
                transition: "all 0.2s ease",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPageIndex === pages.length - 1 || flipPhase !== "idle"}
              title="Página siguiente (Deslizar hacia la izquierda)"
              aria-label="Página siguiente"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: currentPageIndex === pages.length - 1 ? "var(--text-muted)" : "var(--accent-primary)",
                cursor: currentPageIndex === pages.length - 1 ? "not-allowed" : "pointer",
                opacity: currentPageIndex === pages.length - 1 ? 0.35 : 1,
                transition: "all 0.2s ease",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── SELECTOR DE PESTAÑAS MÓVIL (EVITA TEXTO CORTADO Y PERMITE LECTURA CÓMODA) ─── */}
      <div
        className="mobile-section-nav"
        style={{
          display: "flex",
          gap: "0.35rem",
          marginBottom: "0.85rem",
          background: "rgba(255,255,255,0.02)",
          padding: "0.25rem",
          borderRadius: "8px",
          border: "1px solid var(--glass-border)",
        }}
      >
        <button
          onClick={() => setMobileSection("all")}
          style={{
            flex: 1,
            background: mobileSection === "all" ? "var(--accent-primary)" : "transparent",
            color: mobileSection === "all" ? "#000000" : "var(--text-secondary)",
            border: "none",
            borderRadius: "6px",
            padding: "0.35rem 0.4rem",
            fontSize: "0.68rem",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📑 Pliego Completo
        </button>
        <button
          onClick={() => setMobileSection("left")}
          style={{
            flex: 1,
            background: mobileSection === "left" ? "var(--accent-primary)" : "transparent",
            color: mobileSection === "left" ? "#000000" : "var(--text-secondary)",
            border: "none",
            borderRadius: "6px",
            padding: "0.35rem 0.4rem",
            fontSize: "0.68rem",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📰 Crónica
        </button>
        <button
          onClick={() => setMobileSection("right")}
          style={{
            flex: 1,
            background: mobileSection === "right" ? "var(--accent-primary)" : "transparent",
            color: mobileSection === "right" ? "#000000" : "var(--text-secondary)",
            border: "none",
            borderRadius: "6px",
            padding: "0.35rem 0.4rem",
            fontSize: "0.68rem",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📊 Infografía & Claves
        </button>
      </div>

      {/* ─── HOJA DE PAPEL CON EFECTO DE VUELTA REALISTA (3D PERSPECTIVE) ─── */}
      <div
        style={{
          perspective: "1600px",
          position: "relative",
          minHeight: "420px",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flipbook-paper-container ${
            flipPhase === "folding-out" && flipDirection === "next"
              ? "flip-anim-next-out"
              : flipPhase === "folding-in" && flipDirection === "next"
              ? "flip-anim-next-in"
              : flipPhase === "folding-out" && flipDirection === "prev"
              ? "flip-anim-prev-out"
              : flipPhase === "folding-in" && flipDirection === "prev"
              ? "flip-anim-prev-in"
              : ""
          }`}
          style={{
            background: "linear-gradient(135deg, #0b1120 0%, #0d1528 50%, #0a0f1d 100%)",
            border: "1px solid rgba(0, 212, 255, 0.18)",
            borderRadius: "12px",
            padding: "1.75rem 2rem",
            boxShadow: "inset 0 0 50px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3)",
            position: "relative",
            overflow: "hidden",
            transition: "filter 0.2s ease",
          }}
        >
          {/* Brillo de reflejo de papel al pasar la hoja */}
          {flipPhase !== "idle" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.08) 50%, transparent 100%)",
                animation: "paperCurlShineSweep 0.22s ease-out forwards",
                pointerEvents: "none",
                zIndex: 20,
              }}
            />
          )}

          {/* Grilla de Pliego (Desktop: 2 columnas lado a lado / Móvil: 1 columna fluida) */}
          <div className="flipbook-grid">
            {/* ─── COLUMNA IZQUIERDA: CRÓNICA Y TITULAR PRINCIPAL ─── */}
            {(mobileSection === "all" || mobileSection === "left") && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", minWidth: 0 }}>
                {/* Cabezal de Hoja Izquierda */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "2px solid var(--accent-primary)",
                    paddingBottom: "0.45rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "var(--accent-primary)",
                    }}
                  >
                    ★ TALOS PRESS · {page.category}
                  </span>
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "0.7rem",
                      fontStyle: "italic",
                      color: "var(--text-muted)",
                    }}
                  >
                    Pliego #{page.id}
                  </span>
                </div>

                {/* Titular de Noticia */}
                <h2
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "clamp(1.25rem, 2.8vw, 1.75rem)",
                    fontWeight: 800,
                    color: "var(--heading-color, #ffffff)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                    margin: "0.2rem 0",
                  }}
                >
                  {page.title}
                </h2>

                {/* Firma de Autor */}
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Por {page.author}
                </div>

                {/* Bajada / Copete */}
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.92rem",
                    lineHeight: 1.55,
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    borderLeft: "3px solid var(--accent-primary)",
                    paddingLeft: "0.75rem",
                    margin: "0.2rem 0",
                  }}
                >
                  {page.leadText}
                </p>

                {/* Primera Columna de Texto con Letra Capital */}
                {page.bodyColumns[0] && (
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "0.88rem",
                      lineHeight: 1.6,
                      color: "var(--text-secondary)",
                      textAlign: "justify",
                    }}
                  >
                    <span
                      style={{
                        float: "left",
                        fontSize: "2.8rem",
                        lineHeight: 0.8,
                        fontWeight: 900,
                        marginRight: "0.45rem",
                        marginTop: "0.1rem",
                        color: "var(--accent-primary)",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {page.bodyColumns[0].charAt(0)}
                    </span>
                    {page.bodyColumns[0].slice(1)}
                  </div>
                )}

                {/* Cita Destacada / Pull Quote */}
                {page.quote && (
                  <blockquote
                    style={{
                      marginTop: "auto",
                      padding: "0.75rem 1rem",
                      background: "rgba(0, 212, 255, 0.03)",
                      borderTop: "1px dashed rgba(0, 212, 255, 0.25)",
                      borderBottom: "1px dashed rgba(0, 212, 255, 0.25)",
                      textAlign: "center",
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "0.84rem",
                      color: "var(--heading-color)",
                      lineHeight: 1.45,
                    }}
                  >
                    "{page.quote}"
                  </blockquote>
                )}
              </div>
            )}

            {/* ─── COLUMNA DERECHA: IMAGEN PERIODÍSTICA, GRÁFICO & HALLAZGOS ─── */}
            {(mobileSection === "all" || mobileSection === "right") && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", minWidth: 0 }}>
                {/* Cabezal de Hoja Derecha */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "2px solid var(--accent-primary)",
                    paddingBottom: "0.45rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "var(--accent-primary)",
                    }}
                  >
                    EDICIÓN IMPRESA DIGITAL
                  </span>
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "0.7rem",
                      fontStyle: "italic",
                      color: "var(--text-muted)",
                    }}
                  >
                    {page.date}
                  </span>
                </div>

                {/* Imagen Periodística */}
                {page.imageUrl && (
                  <div
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid var(--glass-border)",
                      background: "rgba(0,0,0,0.2)",
                      padding: "0.3rem",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.imageUrl}
                      alt={page.title}
                      style={{
                        width: "100%",
                        height: "170px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        filter: "contrast(1.05) saturate(0.9)",
                      }}
                    />
                    {page.imageCaption && (
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--text-muted)",
                          fontFamily: "Georgia, serif",
                          fontStyle: "italic",
                          marginTop: "0.35rem",
                          padding: "0 0.2rem",
                          lineHeight: 1.35,
                        }}
                      >
                        {page.imageCaption}
                      </div>
                    )}
                  </div>
                )}

                {/* Segunda Columna de Contenido */}
                {page.bodyColumns[1] && (
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "0.88rem",
                      lineHeight: 1.6,
                      color: "var(--text-secondary)",
                      textAlign: "justify",
                    }}
                  >
                    {page.bodyColumns[1]}
                  </p>
                )}

                {/* Módulo de Hallazgos Clave */}
                {page.highlights && page.highlights.length > 0 && (
                  <div
                    style={{
                      marginTop: "auto",
                      background: "rgba(0, 212, 255, 0.04)",
                      border: "1px solid rgba(0, 212, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "0.75rem 0.9rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--accent-primary)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      ✦ Hallazgos Clave de Inteligencia
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {page.highlights.map((h, i) => (
                        <span
                          key={i}
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "0.75rem",
                            color: "var(--text-primary)",
                            lineHeight: 1.35,
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sombra de plegado central estilo libro (SOLO visible en Desktop, oculta en móvil) */}
          <div
            className="flipbook-spine"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "48px",
              transform: "translateX(-50%)",
              background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 50%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />

          {/* Punta de hoja doblada interactiva (Dog-ear) */}
          {currentPageIndex < pages.length - 1 && (
            <div
              className="dog-ear-corner"
              onClick={handleNext}
              title="Dar vuelta a la siguiente hoja"
            />
          )}
        </div>
      </div>

      {/* ─── PUNTOS DE NAVEGACIÓN Y FOOTER ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--glass-border)",
          flexWrap: "wrap",
          gap: "0.6rem",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0 || flipPhase !== "idle"}
          style={{
            background: "none",
            border: "none",
            color: currentPageIndex === 0 ? "var(--text-muted)" : "var(--accent-primary)",
            fontFamily: "Outfit, sans-serif",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: currentPageIndex === 0 ? "default" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.25rem 0.5rem",
            borderRadius: "6px",
            transition: "all 0.2s ease",
          }}
        >
          ← Hoja anterior
        </button>

        {/* Indicador de lectura (Puntos de páginas) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx !== currentPageIndex && flipPhase === "idle") {
                  if (idx > currentPageIndex) handleNext();
                  else handlePrev();
                }
              }}
              title={`Ir al pliego ${idx + 1}`}
              aria-label={`Ir al pliego ${idx + 1}`}
              style={{
                width: idx === currentPageIndex ? "18px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: idx === currentPageIndex ? "var(--accent-primary)" : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPageIndex === pages.length - 1 || flipPhase !== "idle"}
          style={{
            background: "none",
            border: "none",
            color: currentPageIndex === pages.length - 1 ? "var(--text-muted)" : "var(--accent-primary)",
            fontFamily: "Outfit, sans-serif",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: currentPageIndex === pages.length - 1 ? "default" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.25rem 0.5rem",
            borderRadius: "6px",
            transition: "all 0.2s ease",
          }}
        >
          Siguiente hoja →
        </button>
      </div>

      {/* Indicador Táctil para Celulares */}
      <div
        className="mobile-swipe-hint"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          marginTop: "0.5rem",
          fontSize: "0.65rem",
          color: "var(--text-muted)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <MoveHorizontal size={13} color="var(--accent-primary)" />
        <span>Deslizá con el dedo para pasar la hoja</span>
      </div>
    </div>
  );
}
