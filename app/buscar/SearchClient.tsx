"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Calendar, Clock, ExternalLink, RefreshCw, ArrowLeft, SlidersHorizontal, Tag } from "lucide-react";
import NewsTickerBar from "@/components/NewsTickerBar";
import TalosNavbar from "@/app/TalosNavbar";
import Footer from "@/components/Footer";

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  imageUrl?: string | null;
  isSponsored?: boolean;
  isInternal: boolean;
  sentiment: number;
}

const CATEGORIES = [
  { id: "all", label: "Todas las Secciones" },
  { id: "politica", label: "Política" },
  { id: "deportes", label: "Deportes" },
  { id: "tecnologia", label: "Tecnología" },
  { id: "ciencia", label: "Ciencia" },
  { id: "locales", label: "Locales" },
];

const DATE_RANGES = [
  { id: "all", label: "Cualquier Fecha" },
  { id: "24h", label: "Últimas 24 horas" },
  { id: "week", label: "Esta semana" },
  { id: "month", label: "Este mes" },
];

const POPULAR_QUERIES = [
  "Javier Milei", "Presupuesto", "Fútbol AFA", "CONICET", "Inflación", "Córdoba", "Inteligencia Artificial"
];

export default function SearchClient({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery || "");
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const url = `/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&dateRange=${encodeURIComponent(dateRange)}&sortBy=${encodeURIComponent(sortBy)}`;
      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.articles || []);
      setTotalResults(data.totalResults || 0);
    } catch {
      setArticles([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [category, dateRange, sortBy]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") performSearch();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <TalosNavbar />
      <NewsTickerBar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
        
        {/* Cabecera del Buscador */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Search size={16} color="var(--accent-primary)" />
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.72rem", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Buscador Avanzado & Archivo Histórico
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Merriweather', Georgia, serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 900,
            color: "var(--heading-color)",
            lineHeight: 1.15,
            marginBottom: "1.25rem",
          }}>
            Buscar en Talos Diario
          </h1>

          {/* Caja de Búsqueda Principal */}
          <div style={{
            display: "flex",
            gap: "0.5rem",
            background: "var(--card-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "14px",
            padding: "0.5rem 0.65rem 0.5rem 1rem",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}>
            <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Buscar noticias, políticos, temas, normativas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                color: "var(--text-primary)",
                fontFamily: "'Merriweather', Georgia, serif",
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  padding: "0 0.5rem",
                }}
              >
                Limpiar
              </button>
            )}
            <button
              onClick={performSearch}
              disabled={loading}
              style={{
                background: "var(--accent-primary)",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "0.65rem 1.4rem",
                fontSize: "0.85rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                flexShrink: 0,
              }}
            >
              {loading ? <RefreshCw size={14} className="spin" /> : <Search size={14} />} Buscar
            </button>
          </div>

          {/* Búsquedas Populares */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
              Sugerencias:
            </span>
            {POPULAR_QUERIES.map((pop) => (
              <button
                key={pop}
                onClick={() => { setQuery(pop); }}
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "100px",
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.72rem",
                  color: "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {pop}
              </button>
            ))}
          </div>
        </div>

        {/* Panel de Filtros */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "14px",
          padding: "1.25rem",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <SlidersHorizontal size={14} color="var(--accent-primary)" />
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.72rem", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Filtros Avanzados
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}>
            {/* Categoría */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>
                Sección
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-base)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.82rem",
                  color: "var(--text-primary)",
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                }}
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            {/* Rango de Fecha */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>
                Fecha de Publicación
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-base)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.82rem",
                  color: "var(--text-primary)",
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                }}
              >
                {DATE_RANGES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </div>

            {/* Ordenamiento */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>
                Ordenar Por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-base)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.82rem",
                  color: "var(--text-primary)",
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                }}
              >
                <option value="newest">Más recientes primero</option>
                <option value="oldest">Más antiguos primero</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {hasSearched && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.75rem" }}>
              <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "var(--heading-color)" }}>
                {loading ? "Buscando noticias..." : `${totalResults} ${totalResults === 1 ? "resultado encontrado" : "resultados encontrados"}`}
              </span>
              {query && (
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
                  Búsqueda: <strong>"{query}"</strong>
                </span>
              )}
            </div>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ height: "110px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--glass-border)", animation: "pulse 1.5s infinite" }} />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "4rem 1.5rem",
                background: "var(--card-bg)",
                border: "1px dashed var(--glass-border)",
                borderRadius: "14px",
              }}>
                <Search size={32} color="var(--text-muted)" style={{ marginBottom: "1rem" }} />
                <h3 style={{ fontFamily: "'Merriweather', Georgia, serif", fontSize: "1.2rem", color: "var(--heading-color)", marginBottom: "0.5rem" }}>
                  No se encontraron noticias
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", maxWidth: "400px", margin: "0 auto" }}>
                  Intenta cambiar los términos de búsqueda o ajustar los filtros de sección y fecha.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {articles.map((art) => (
                  <div
                    key={art.id}
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "14px",
                      padding: "1.25rem 1.5rem",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "260px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{
                            fontFamily: "Outfit, sans-serif",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            color: "var(--accent-primary)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            background: "var(--glass-hover)",
                            border: "1px solid var(--glass-border)",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                          }}>
                            {art.category}
                          </span>
                          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>
                            {art.source}
                          </span>
                          {art.isSponsored && (
                            <span style={{ fontSize: "0.65rem", background: "rgba(0,212,255,0.15)", color: "var(--accent-primary)", borderRadius: "4px", padding: "0.15rem 0.5rem", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                              PATROCINADO
                            </span>
                          )}
                        </div>

                        {art.isInternal ? (
                          <Link href={art.url} style={{ textDecoration: "none" }}>
                            <h2 style={{
                              fontFamily: "'Merriweather', Georgia, serif",
                              fontSize: "1.15rem",
                              fontWeight: 800,
                              color: "var(--heading-color)",
                              lineHeight: 1.35,
                              marginBottom: "0.4rem",
                            }}>
                              {art.title}
                            </h2>
                          </Link>
                        ) : (
                          <a href={art.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <h2 style={{
                              fontFamily: "'Merriweather', Georgia, serif",
                              fontSize: "1.15rem",
                              fontWeight: 800,
                              color: "var(--heading-color)",
                              lineHeight: 1.35,
                              marginBottom: "0.4rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}>
                              {art.title} <ExternalLink size={14} color="var(--text-muted)" />
                            </h2>
                          </a>
                        )}

                        <p style={{
                          fontSize: "0.82rem",
                          color: "var(--text-muted)",
                          fontFamily: "Inter, sans-serif",
                          lineHeight: 1.55,
                          margin: 0,
                        }}>
                          {art.summary.slice(0, 220)}...
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem", flexShrink: 0 }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Clock size={11} /> {new Date(art.publishedAt).toLocaleDateString("es-AR")}
                        </span>
                        {art.isInternal ? (
                          <Link href={art.url} style={{
                            textDecoration: "none",
                            fontSize: "0.75rem",
                            fontFamily: "Outfit, sans-serif",
                            fontWeight: 700,
                            color: "var(--accent-primary)",
                            marginTop: "0.5rem",
                          }}>
                            Leer nota completa →
                          </Link>
                        ) : (
                          <a href={art.url} target="_blank" rel="noopener noreferrer" style={{
                            textDecoration: "none",
                            fontSize: "0.75rem",
                            fontFamily: "Outfit, sans-serif",
                            fontWeight: 700,
                            color: "var(--text-secondary)",
                            marginTop: "0.5rem",
                          }}>
                            Ver en {art.source} →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
