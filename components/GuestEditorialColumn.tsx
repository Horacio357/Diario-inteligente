"use client";

import { useState } from "react";
import { UserCheck, Award, ExternalLink, Send, Radio, MessageSquareText, Sparkles, ChevronRight } from "lucide-react";
import WorldRadioPlayer from "./WorldRadioPlayer";

interface GuestArticle {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  mediaSource: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  content: string[];
  quote: string;
}

const GUEST_ARTICLES: GuestArticle[] = [
  {
    id: "1",
    authorName: "Dr. Gonzalo Benítez",
    authorTitle: "Analista de Geopolítica & Algoritmos Social",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    mediaSource: "Pluma Invitada Exclusiva",
    category: "Análisis Internacional",
    date: "12 de Septiembre, 2026",
    title: "La Guerra Silenciosa de Narrativas en la Era de los Algoritmos Generativos",
    excerpt: "Las batallas geopolíticas del siglo XXI no se libran únicamente en fronteras físicas, sino en la distribución automatizada de sesgos informativos.",
    content: [
      "El fenómeno de la polarización asistida por modelos de lenguaje no es un accidente técnico: representa la evolución natural de la propaganda adaptativa. Cuando las plataformas optimizan sus algoritmos para maximizar el tiempo de retención, las narrativas hiperbólicas ganan espacio sistemáticamente sobre los discursos ponderados.",
      "En América Latina, la convergencia entre medios tradicionales y canales digitales de alta velocidad ha creado un laboratorio único. Los ciudadanos consumen datos a una velocidad inédita, pero la verificación de fuentes sigue rezagada. El desafío de los medios independientes es construir filtros de auditoría sintética capaces de devolver la confianza al lector sin perder agilidad."
    ],
    quote: "La soberanía del siglo XXI se mide en la capacidad de una sociedad para auditar sus propios flujos de información."
  },
  {
    id: "2",
    authorName: "Dra. Marina Silveira",
    authorTitle: "Directora de Investigaciones · Diario El Faro",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    mediaSource: "Diario El Faro (Mendoza)",
    category: "Federalismo & Recursos",
    date: "10 de Septiembre, 2026",
    title: "El Impacto de la Transición Energética en las Provincias Productoras",
    excerpt: "Una mirada regional sobre cómo la demanda global de minerales estratégicos está reconfigurando la economía de la franja cordillerana.",
    content: [
      "Las provincias del oeste argentino se encuentran en el epicentro de una transformación histórica. El aumento acelerado de proyectos de litio y cobre no solo ha atraído inversiones internacionales, sino que ha desplazado las discusiones sobre empleo joven y formación técnica al centro de las agendas locales.",
      "Sin embargo, la clave del desarrollo sustentable reside en el equilibrio ambiental y la redistribución transparente de las regalías. Las comunidades demandan participar activamente en la gobernanza de sus recursos primarios."
    ],
    quote: "No hay verdadera prosperidad regional sin licencias sociales sólidas y fiscalización comunitaria."
  },
  {
    id: "3",
    authorName: "Lic. Ignacio Morales",
    authorTitle: "Economista Jefe · Observatorio del Interior",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    mediaSource: "Observatorio Económico Federal",
    category: "Economía del Conocimiento",
    date: "8 de Septiembre, 2026",
    title: "Pymes de Exportación de Servicios: El Nuevo Motor Silencioso",
    excerpt: "Más de 4.000 emprendimientos de software y análisis de datos en el interior exportan servicios sin depender de la infraestructura física tradicional.",
    content: [
      "El crecimiento del trabajo remoto y los servicios basados en conocimiento ha generado un superávit comercial no registrado en las métricas aduaneras convencionales. Ciudades intermedias como Tandil, Rosario, Córdoba y San Rafael lideran este crecimiento.",
      "Para consolidar este polo tecnológico, se requieren incentivos fiscales estables y una conectividad de fibra óptica garantizada en cada municipio del país."
    ],
    quote: "El talento no tiene límites geográficos cuando la conectividad y la estabilidad normativa acompañan."
  }
];

export default function GuestEditorialColumn() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"column" | "radio">("column");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [userSubmission, setUserSubmission] = useState({ name: "", email: "", topic: "", proposal: "" });
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const article = GUEST_ARTICLES[selectedIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(true);
    setTimeout(() => {
      setShowSubmitModal(false);
      setSubmittedMessage(false);
      setUserSubmission({ name: "", email: "", topic: "", proposal: "" });
    }, 2500);
  };

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: "16px",
      padding: "1.25rem",
      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      gap: "1.1rem"
    }}>
      {/* Header del Bloque */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: "0.75rem", borderBottom: "1px solid var(--glass-border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(255,107,0,0.12)", border: "1px solid #ff6b00",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <UserCheck size={16} color="#ff6b00" />
          </div>
          <div>
            <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "var(--heading-color)", margin: 0 }}>
              Columna de Invitados & Medios Aliados
            </h3>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
              Firmas especiales · Colaboraciones de diarios de la región
            </span>
          </div>
        </div>

        {/* Toggle Pestañas: Columna / Radio */}
        <div style={{ display: "flex", background: "rgba(0,0,0,0.06)", padding: "3px", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
          <button
            onClick={() => setActiveTab("column")}
            style={{
              background: activeTab === "column" ? "var(--accent-primary)" : "transparent",
              color: activeTab === "column" ? "#fff" : "var(--text-muted)",
              border: "none", borderRadius: "6px", padding: "0.25rem 0.6rem",
              fontSize: "0.7rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            ✍️ Columna
          </button>
          <button
            onClick={() => setActiveTab("radio")}
            style={{
              background: activeTab === "radio" ? "var(--accent-primary)" : "transparent",
              color: activeTab === "radio" ? "#fff" : "var(--text-muted)",
              border: "none", borderRadius: "6px", padding: "0.25rem 0.6rem",
              fontSize: "0.7rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.3rem", transition: "all 0.2s"
            }}
          >
            <Radio size={12} /> Radio
          </button>
        </div>
      </div>

      {activeTab === "radio" ? (
        <WorldRadioPlayer />
      ) : (
        <>
          {/* Selector de Artículos de Invitados */}
          <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", pb: "0.2rem" }}>
            {GUEST_ARTICLES.map((art, idx) => (
              <button
                key={art.id}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  background: selectedIndex === idx ? "rgba(255,107,0,0.12)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${selectedIndex === idx ? "#ff6b00" : "var(--glass-border)"}`,
                  borderRadius: "8px", padding: "0.4rem 0.65rem", textAlign: "left", cursor: "pointer",
                  whiteSpace: "nowrap", transition: "all 0.2s", flexShrink: 0
                }}
              >
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: selectedIndex === idx ? "#ff6b00" : "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>
                  {art.authorName}
                </div>
                <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
                  {art.mediaSource}
                </div>
              </button>
            ))}
          </div>

          {/* Tarjeta del Autor Invitado */}
          <div style={{
            background: "rgba(0,0,0,0.03)",
            border: "1px solid var(--glass-border)",
            borderRadius: "12px",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem"
          }}>
            {/* Perfil Autor */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ff6b00" }}
              />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <h4 style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "var(--heading-color)", margin: 0 }}>
                    {article.authorName}
                  </h4>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 700, background: "rgba(255,107,0,0.15)",
                    color: "#ff6b00", padding: "0.15rem 0.4rem", borderRadius: "4px", fontFamily: "Outfit, sans-serif"
                  }}>
                    {article.mediaSource}
                  </span>
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif", display: "block", marginTop: "0.1rem" }}>
                  {article.authorTitle}
                </span>
              </div>
            </div>

            {/* Titular de la Columna */}
            <h3 style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "var(--heading-color)",
              lineHeight: 1.25,
              margin: 0
            }}>
              "{article.title}"
            </h3>

            {/* Copete */}
            <p style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.88rem",
              lineHeight: 1.55,
              color: "var(--text-primary)",
              fontStyle: "italic",
              borderLeft: "2px solid #ff6b00",
              paddingLeft: "0.75rem",
              margin: 0
            }}>
              {article.excerpt}
            </p>

            {/* Cuerpo del Artículo */}
            <div style={{
              display: "flex", flexDirection: "column", gap: "0.75rem",
              fontFamily: "Georgia, serif", fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text-secondary)"
            }}>
              {article.content.map((pText, i) => (
                <p key={i} style={{ margin: 0, textAlign: "justify" }}>
                  {pText}
                </p>
              ))}
            </div>

            {/* Cita Destacada de la Pluma */}
            <blockquote style={{
              margin: "0.4rem 0 0",
              padding: "0.75rem",
              background: "rgba(255,107,0,0.04)",
              border: "1px dashed rgba(255,107,0,0.3)",
              borderRadius: "8px",
              textAlign: "center",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: "var(--heading-color)"
            }}>
              "{article.quote}"
            </blockquote>
          </div>

          {/* Footer de Invitados & Solicitud de Notas Propias */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingTop: "0.5rem", borderTop: "1px solid var(--glass-border)"
          }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
              ¿Tenés un medio o columna de opinión?
            </span>
            <button
              onClick={() => setShowSubmitModal(true)}
              style={{
                background: "none", border: "none", color: "var(--accent-primary)",
                fontFamily: "Outfit, sans-serif", fontSize: "0.75rem", fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem"
              }}
            >
              Enviar propuesta de nota <ChevronRight size={14} />
            </button>
          </div>
        </>
      )}

      {/* Modal de Envío de Colaboraciones / Notas Propias */}
      {showSubmitModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
          zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
        }}>
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--card-border)",
            borderRadius: "16px", padding: "1.5rem", maxWidth: "460px", width: "100%",
            boxShadow: "0 24px 48px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={18} color="var(--accent-primary)" />
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--heading-color)", margin: 0 }}>
                  Espacio para Colaboradores
                </h3>
              </div>
              <button onClick={() => setShowSubmitModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>
            </div>

            {submittedMessage ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "#00e676", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                ✓ ¡Propuesta recibida! Nuestro equipo editorial analizará tu nota para la próxima edición.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Tu Nombre / Firma</label>
                  <input
                    required
                    type="text"
                    value={userSubmission.name}
                    onChange={e => setUserSubmission({ ...userSubmission, name: e.target.value })}
                    placeholder="Ej: Lic. Martín Rossi"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.05)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Email o Medio de Contacto</label>
                  <input
                    required
                    type="email"
                    value={userSubmission.email}
                    onChange={e => setUserSubmission({ ...userSubmission, email: e.target.value })}
                    placeholder="contacto@diario.com"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.05)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Título / Tema de la Nota</label>
                  <input
                    required
                    type="text"
                    value={userSubmission.topic}
                    onChange={e => setUserSubmission({ ...userSubmission, topic: e.target.value })}
                    placeholder="Ej: Columna sobre Innovación Agroindustrial"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.05)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Resumen o Texto de la Nota</label>
                  <textarea
                    required
                    rows={3}
                    value={userSubmission.proposal}
                    onChange={e => setUserSubmission({ ...userSubmission, proposal: e.target.value })}
                    placeholder="Ingresá los párrafos principales de tu nota propia o colaboración..."
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.05)", color: "var(--text-primary)", fontSize: "0.85rem", resize: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: "var(--accent-primary)", border: "none", borderRadius: "8px",
                    padding: "0.65rem", color: "#fff", fontFamily: "Outfit, sans-serif",
                    fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "0.5rem"
                  }}
                >
                  <Send size={14} /> Enviar Propuesta a Redacción
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
