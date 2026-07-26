"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Search, 
  X, 
  Loader2, 
  MapPin, 
  Calendar, 
  Award, 
  ExternalLink, 
  Share2, 
  User, 
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import { MissingPerson, MissingPersonsResponse } from "@/lib/types";

// Lista de provincias y palabras clave asociadas en las descripciones
const PROVINCES = [
  { id: "all", name: "Todas las Provincias", keywords: [] },
  { id: "buenos-aires", name: "Buenos Aires", keywords: ["buenos aires", "provincia de buenos aires", "pcia. de buenos aires", "banfield", "lomas de zamora", "ranchos", "mar del plata", "bahía blanca", "la plata", "conurbano", "quilmes", "lanús"] },
  { id: "caba", name: "CABA", keywords: ["caba", "ciudad autónoma", "caballito", "capital federal", "palermo", "recoleta", "belgrano"] },
  { id: "cordoba", name: "Córdoba", keywords: ["córdoba", "cordoba", "san javier", "la paz", "villa maría", "río cuarto"] },
  { id: "santa-fe", name: "Santa Fe", keywords: ["santa fe", "santa fe", "montefiore", "rosario", "reconquista"] },
  { id: "mendoza", name: "Mendoza", keywords: ["mendoza", "lavalle", "san rafael", "goycochea"] },
  { id: "tucuman", name: "Tucumán", keywords: ["tucumán", "tucuman", "san miguel de tucumán"] },
  { id: "chubut", name: "Chubut", keywords: ["chubut", "los altares", "puerto madryn", "trelew", "comodoro rivadavia"] },
  { id: "entre-rios", name: "Entre Ríos", keywords: ["entre ríos", "entre rios", "gualeguaychú", "paraná", "san benito"] },
  { id: "santa-cruz", name: "Santa Cruz", keywords: ["santa cruz", "lago posadas", "río gallegos", "calafate"] },
];

export default function MissingPersonsSearch() {
  const [persons, setPersons] = useState<MissingPerson[]>([]);
  const [sourceInfo, setSourceInfo] = useState({ fuente: "", url: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [onlyRewards, setOnlyRewards] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Paginación
  const [visibleCount, setVisibleCount] = useState(12);

  // Modal de Detalle
  const [selectedPerson, setSelectedPerson] = useState<MissingPerson | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Fetch inicial
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/personas");
        if (!res.ok) throw new Error("No se pudo obtener el listado de personas.");
        const data: MissingPersonsResponse = await res.json();
        
        if (data && data.data) {
          setPersons(data.data.personas || []);
          setSourceInfo({
            fuente: data.data.fuente || "SIFEBU - Ministerio de Seguridad de la Nación",
            url: data.data.url_fuente || "https://www.argentina.gob.ar/seguridad/personasextraviadas"
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error inesperado al conectar con el servidor.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Lógica de filtrado
  const filteredPersons = useMemo(() => {
    return persons.filter(person => {
      // 1. Filtro de búsqueda (nombre o descripción)
      const matchesSearch = 
        person.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Filtro de Recompensa
      const matchesReward = !onlyRewards || person.recompensa?.tiene_recompensa;

      // 3. Filtro de Provincia
      let matchesProvince = true;
      if (selectedProvince !== "all") {
        const provConfig = PROVINCES.find(p => p.id === selectedProvince);
        if (provConfig) {
          const descLower = person.descripcion.toLowerCase();
          const nameLower = person.nombre.toLowerCase();
          // Verificamos si alguna keyword coincide en la descripción o nombre de la persona
          matchesProvince = provConfig.keywords.some(keyword => 
            descLower.includes(keyword) || nameLower.includes(keyword)
          );
        }
      }

      return matchesSearch && matchesReward && matchesProvince;
    });
  }, [persons, searchQuery, selectedProvince, onlyRewards]);

  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedProvince, onlyRewards]);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => prev + 12);
  }, []);

  const handleShare = useCallback((person: MissingPerson) => {
    navigator.clipboard.writeText(person.url || window.location.href);
    setCopiedSlug(person.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }, []);

  const selectedProvinceName = useMemo(() => {
    return PROVINCES.find(p => p.id === selectedProvince)?.name || "Todas las Provincias";
  }, [selectedProvince]);

  return (
    <section id="personas-perdidas" style={{ padding: "3rem 1.5rem", borderTop: "1px solid var(--glass-border)" }}>
      {/* Estilos responsive integrados */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-filter-container {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100% !important;
          }
          .mobile-filter-item {
            width: 100% !important;
            min-width: 100% !important;
          }
          .mobile-quick-tags {
            justify-content: center !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* Encabezado */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>
            <AlertTriangle size={12} color="var(--heat-warm)" /> Base SIFEBU integrada
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/red-mundial.png" alt="Red Mundial" style={{ width: "32px", height: "32px", objectFit: "contain", opacity: 0.85 }} />
            <h2 style={{ fontFamily: "Outfit", fontSize: "2rem", fontWeight: 800, margin: 0 }}>
              Búsqueda de <span className="text-gradient">Personas Perdidas</span>
            </h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.4rem", maxWidth: "600px", margin: "0.4rem auto 0" }}>
            Monitoreo oficial de personas extraviadas y desaparecidas en la República Argentina. Datos obtenidos del Sistema Federal de Búsqueda de Personas.
          </p>
        </div>

        {/* Panel de control de Filtros y Búsqueda */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: "rgba(13, 21, 40, 0.5)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-xl)",
          padding: "1.25rem",
          marginBottom: "2rem",
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 60, // Asegurar que el panel se apile por sobre la grilla de tarjetas
        }}>
          <div className="mobile-filter-container" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {/* Input de búsqueda */}
            <div className="mobile-filter-item" style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(10, 14, 26, 0.6)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-md)",
              padding: "0.6rem 1rem",
              flex: 1,
              minWidth: "260px",
            }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, localidad, detalles..."
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  width: "100%",
                  fontSize: "0.9rem",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Selector de provincia (Dropdown Custom) */}
            <div className="mobile-filter-item" style={{ position: "relative", minWidth: "220px" }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(10, 14, 26, 0.6)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.67rem 1rem",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>{selectedProvinceName}</span>
                <ChevronDown size={16} color="var(--text-muted)" style={{ transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </button>

              {showDropdown && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: "rgba(10, 14, 26, 0.95)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 100, // Z-index elevado para superponerse a las imágenes de tarjetas
                  maxHeight: "260px",
                  overflowY: "auto",
                }}>
                  {PROVINCES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProvince(p.id);
                        setShowDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "0.6rem 1rem",
                        background: selectedProvince === p.id ? "rgba(0, 212, 255, 0.1)" : "transparent",
                        border: "none",
                        color: selectedProvince === p.id ? "var(--accent-primary)" : "var(--text-primary)",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { if (selectedProvince !== p.id) e.currentTarget.style.background = "var(--glass-hover)"; }}
                      onMouseLeave={e => { if (selectedProvince !== p.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Checkbox de recompensas */}
            <label className="mobile-filter-item" style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              userSelect: "none",
              padding: "0.5rem 0.75rem",
            }}>
              <input
                type="checkbox"
                checked={onlyRewards}
                onChange={e => setOnlyRewards(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "var(--accent-primary)",
                  cursor: "pointer",
                }}
              />
              <span>Solo con Recompensa Activa</span>
            </label>
          </div>

          {/* Quick-Tags de Provincias */}
          <div className="mobile-quick-tags" style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.8rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center", marginRight: "0.4rem" }}>Filtro rápido:</span>
            {PROVINCES.slice(0, 6).map(prov => (
              <button
                key={prov.id}
                onClick={() => setSelectedProvince(prov.id)}
                style={{
                  padding: "0.25rem 0.65rem",
                  background: selectedProvince === prov.id ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${selectedProvince === prov.id ? "var(--accent-primary)" : "var(--glass-border)"}`,
                  borderRadius: "100px",
                  color: selectedProvince === prov.id ? "var(--accent-primary)" : "var(--text-secondary)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {prov.name === "Todas las Provincias" ? "Todas" : prov.name}
              </button>
            ))}
          </div>
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <Loader2 size={36} color="var(--accent-primary)" style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Cargando registros oficiales del SIFEBU...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="glass-card" style={{ padding: "2rem", textAlign: "center", borderColor: "rgba(239,68,68,0.3)" }}>
            <p style={{ color: "var(--heat-hot)", fontWeight: 600 }}>⚠️ {error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", cursor: "pointer" }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Contenido (Grilla) */}
        {!isLoading && !error && (
          <>
            {filteredPersons.length === 0 ? (
              <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ color: "var(--text-secondary)" }}>No se encontraron personas cargadas que coincidan con la búsqueda o filtros aplicados.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedProvince("all");
                    setOnlyRewards(false);
                  }}
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid var(--accent-primary)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--accent-primary)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "0 0.5rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Mostrando <b>{Math.min(visibleCount, filteredPersons.length)}</b> de <b>{filteredPersons.length}</b> registros
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Fuente: <a href={sourceInfo.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>{sourceInfo.fuente} <ExternalLink size={10} style={{ display: "inline" }} /></a>
                  </span>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                  gap: "1.5rem",
                }}>
                  {filteredPersons.slice(0, visibleCount).map(person => (
                    <div 
                      key={person.slug}
                      className="glass-card"
                      style={{
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        overflow: "hidden",
                        border: person.recompensa?.tiene_recompensa ? "1px solid rgba(245,158,11,0.25)" : "1px solid var(--glass-border)",
                      }}
                      onClick={() => setSelectedPerson(person)}
                    >
                      {/* Imagen de perfil de la persona */}
                      <div style={{
                        position: "relative",
                        width: "100%",
                        height: "250px",
                        background: "rgba(10, 14, 26, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}>
                        {person.foto_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={person.foto_url}
                            alt={person.nombre}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.4s ease",
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1.0)"}
                            onError={(e) => {
                              // Si falla el link absoluto de argentina.gob.ar
                              e.currentTarget.style.display = "none";
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const placeholder = parent.querySelector(".img-placeholder");
                                if (placeholder) (placeholder as HTMLElement).style.display = "flex";
                              }
                            }}
                          />
                        ) : null}

                        {/* Placeholder fallback */}
                        <div 
                          className="img-placeholder"
                          style={{
                            display: !person.foto_url ? "flex" : "none",
                            width: "100%",
                            height: "100%",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(135deg, rgba(13,21,40,0.8), rgba(10,14,26,1))",
                            color: "var(--text-muted)",
                            gap: "0.5rem"
                          }}
                        >
                          <User size={48} strokeWidth={1} />
                          <span style={{ fontSize: "0.72rem" }}>Sin foto oficial disponible</span>
                        </div>

                        {/* Badge de recompensa */}
                        {person.recompensa?.tiene_recompensa && (
                          <div style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                            color: "#0a0e1a",
                            padding: "0.25rem 0.6rem",
                            borderRadius: "4px",
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
                          }}>
                            <Award size={12} />
                            RECOMPENSA
                          </div>
                        )}
                      </div>

                      {/* Info de la persona */}
                      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1 }}>
                        <h3 style={{ fontFamily: "Outfit", fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                          {person.nombre}
                        </h3>

                        {/* Metadatos breves */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          {person.fecha_desaparicion && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                              <Calendar size={12} className="text-gradient" />
                              <span>Ausente desde: <b>{person.fecha_desaparicion}</b></span>
                            </div>
                          )}
                          
                          {/* Deducir provincia a partir de keywords para mostrar badge */}
                          {(() => {
                            const detected = PROVINCES.find(prov => 
                              prov.id !== "all" && 
                              (person.descripcion.toLowerCase().includes(prov.name.toLowerCase()) || 
                               prov.keywords.some(kw => person.descripcion.toLowerCase().includes(kw)))
                            );
                            if (detected) {
                              return (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                  <MapPin size={12} color="var(--accent-primary)" />
                                  <span>Región: <b style={{ color: "var(--accent-primary)" }}>{detected.name}</b></span>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        {/* Descripción breve */}
                        <p style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {person.descripcion}
                        </p>

                        {/* Botón de acción */}
                        <button
                          style={{
                            width: "100%",
                            marginTop: "auto",
                            padding: "0.5rem",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--glass-border)",
                            borderRadius: "var(--radius-sm)",
                            color: "var(--text-secondary)",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            textAlign: "center",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = "var(--glass-hover)";
                            e.currentTarget.style.color = "var(--accent-primary)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                            e.currentTarget.style.color = "var(--text-secondary)";
                          }}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón cargar más / ver menos */}
                {(filteredPersons.length > 12) && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
                    {filteredPersons.length > visibleCount && (
                      <button
                        onClick={loadMore}
                        style={{
                          padding: "0.75rem 2rem",
                          background: "rgba(0, 212, 255, 0.08)",
                          border: "1px solid rgba(0, 212, 255, 0.25)",
                          borderRadius: "var(--radius-md)",
                          color: "var(--accent-primary)",
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          boxShadow: "var(--shadow-sm)",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(0, 212, 255, 0.15)";
                          e.currentTarget.style.boxShadow = "var(--shadow-glow)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(0, 212, 255, 0.08)";
                          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                        }}
                      >
                        Cargar Más Registros
                      </button>
                    )}

                    {visibleCount > 12 && (
                      <button
                        onClick={() => {
                          setVisibleCount(12);
                          setTimeout(() => {
                            document.getElementById("personas-perdidas")?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 50);
                        }}
                        style={{
                          padding: "0.75rem 2rem",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid var(--glass-border)",
                          borderRadius: "var(--radius-md)",
                          color: "var(--text-secondary)",
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          boxShadow: "var(--shadow-sm)",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "var(--glass-hover)";
                          e.currentTarget.style.color = "var(--text-primary)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                          e.currentTarget.style.color = "var(--text-secondary)";
                        }}
                      >
                        Ver Menos
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>

      {/* Modal de Detalle */}
      {selectedPerson && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(3, 7, 18, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: "1rem",
        }}
        onClick={() => setSelectedPerson(null)}
        >
          <div style={{
            background: "rgba(10, 14, 26, 0.98)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-xl)",
            width: "100%",
            maxWidth: "760px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "var(--shadow-lg), 0 0 50px rgba(0,212,255,0.1)",
            animation: "fadeInUp 0.3s ease both",
          }}
          onClick={e => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button
              onClick={() => setSelectedPerson(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                cursor: "pointer",
                transition: "all 0.2s",
                zIndex: 10,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <X size={18} />
            </button>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            }}>
              {/* Imagen Grande */}
              <div style={{
                height: "400px",
                background: "rgba(5, 8, 16, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
                {selectedPerson.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPerson.foto_url}
                    alt={selectedPerson.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      background: "rgba(0,0,0,0.3)",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector(".modal-img-fallback");
                        if (fallback) (fallback as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                ) : null}

                {/* Fallback en Modal */}
                <div 
                  className="modal-img-fallback"
                  style={{
                    display: !selectedPerson.foto_url ? "flex" : "none",
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, rgba(13,21,40,1), rgba(10,14,26,1))",
                    color: "var(--text-muted)",
                    gap: "0.5rem"
                  }}
                >
                  <User size={64} strokeWidth={1} />
                  <span style={{ fontSize: "0.8rem" }}>Sin foto oficial</span>
                </div>

                {/* Badge Recompensa en Modal */}
                {selectedPerson.recompensa?.tiene_recompensa && (
                  <div style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                    color: "#0a0e1a",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    boxShadow: "0 4px 15px rgba(245,158,11,0.4)",
                  }}>
                    RECOMPENSA ACTIVA
                  </div>
                )}
              </div>

              {/* Información Detallada */}
              <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Ficha de Búsqueda SIFEBU
                  </span>
                  <h3 style={{ fontFamily: "Outfit", fontSize: "1.6rem", fontWeight: 800, margin: "0.25rem 0 0.5rem 0" }}>
                    {selectedPerson.nombre}
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
                  {selectedPerson.fecha_desaparicion && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                      <Calendar size={14} color="var(--accent-primary)" />
                      <span style={{ color: "var(--text-secondary)" }}>Fecha de desaparición:</span>
                      <strong style={{ color: "var(--text-primary)" }}>{selectedPerson.fecha_desaparicion}</strong>
                    </div>
                  )}

                  {selectedPerson.recompensa?.tiene_recompensa && selectedPerson.recompensa.monto && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                      <Award size={14} color="#f59e0b" />
                      <span style={{ color: "var(--text-secondary)" }}>Monto Ofrecido:</span>
                      <strong style={{ color: "#fcd34d" }}>{selectedPerson.recompensa.monto}</strong>
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                    <MapPin size={14} color="var(--accent-primary)" />
                    <span style={{ color: "var(--text-secondary)" }}>Jurisdicción de Búsqueda:</span>
                    <strong style={{ color: "var(--text-primary)" }}>Argentina</strong>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 600 }}>
                    Descripción del caso:
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.6, background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--accent-primary)" }}>
                    {selectedPerson.descripcion}
                  </p>
                </div>

                {/* Acciones del Modal */}
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto", paddingTop: "1rem" }}>
                  <a
                    href={selectedPerson.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      color: "#0a0e1a",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      padding: "0.75rem",
                      textAlign: "center",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1.0"}
                  >
                    Ficha Oficial <ExternalLink size={14} />
                  </a>

                  <button
                    onClick={() => handleShare(selectedPerson)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "var(--radius-md)",
                      color: copiedSlug === selectedPerson.slug ? "var(--accent-primary)" : "var(--text-secondary)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { if (copiedSlug !== selectedPerson.slug) e.currentTarget.style.background = "var(--glass-hover)"; }}
                    onMouseLeave={e => { if (copiedSlug !== selectedPerson.slug) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  >
                    <Share2 size={14} />
                    <span>{copiedSlug === selectedPerson.slug ? "Enlace copiado!" : "Compartir"}</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
