"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquarePlus, Globe, Share2 } from "lucide-react";

interface FooterProps {
  categoryLabel?: string;
  categoryColor?: string;
}

export default function Footer({ categoryLabel, categoryColor }: FooterProps) {
  const [formData, setFormData] = useState({ name: "", email: "", type: "sugerencia", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Por favor completá todos los campos antes de enviar.");
      return;
    }
    setSending(true);

    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "feedback_submission",
          query: `[${formData.type.toUpperCase()}] ${formData.name} (${formData.email}): ${formData.message}`,
          category: categoryLabel || "General",
        }),
      });
    } catch {}

    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: "", email: "", type: "sugerencia", message: "" });
    }, 5000);
  };

  const accentColor = categoryColor || "var(--accent-primary)";

  return (
    <footer style={{
      borderTop: "1px solid var(--glass-border)",
      marginTop: "3rem",
      padding: "3rem 1.5rem 2rem",
      background: "var(--card-bg)",
      fontFamily: "'Merriweather', Georgia, serif",
    }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2.5rem",
          marginBottom: "2.5rem",
        }}>
          {/* Columna 1: Marca & Contacto Directo */}
          <div>
            <div style={{
              fontFamily: "'Merriweather', Georgia, serif",
              fontSize: "1.6rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}>
              <span style={{ color: "var(--heading-color)" }}>TALOS </span>
              <span style={{ color: accentColor }}>DIARIO</span>
            </div>
            <p style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
              fontFamily: "'Merriweather', Georgia, serif",
            }}>
              El primer diario digital interactivo de Argentina impulsado por Inteligencia Artificial y Periodismo Aumentado.
            </p>

            {/* Email de contacto */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accentColor, marginBottom: "0.35rem" }}>
                📧 Contacto de Redacción
              </div>
              <a href="mailto:contacto@talosdiario.com" style={{
                color: "var(--heading-color)",
                fontSize: "0.85rem",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}>
                <Mail size={14} color={accentColor} /> contacto@talosdiario.com
              </a>
            </div>

            {/* Redes Sociales */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accentColor, marginBottom: "0.5rem" }}>
                🌐 Redes Sociales Oficiales
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    background: "rgba(225, 48, 108, 0.1)",
                    border: "1px solid rgba(225, 48, 108, 0.3)",
                    color: "#e1306c",
                    fontSize: "0.78rem",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  <Share2 size={14} /> Instagram
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    background: "rgba(24, 119, 242, 0.1)",
                    border: "1px solid rgba(24, 119, 242, 0.3)",
                    color: "#1877f2",
                    fontSize: "0.78rem",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  <Globe size={14} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Columna 2: Navegación de Secciones */}
          <div>
            <p style={{
              fontFamily: "'Merriweather', Georgia, serif",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: accentColor,
              marginBottom: "1rem",
            }}>
              Secciones Principales
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {[
                { label: "Política Nacional", path: "/politica" },
                { label: "Deportes & Sociedad", path: "/deportes" },
                { label: "Tecnología e IA", path: "/tecnologia" },
                { label: "Ciencia & Futuro", path: "/ciencia" },
                { label: "Locales & Regiones", path: "/locales" },
              ].map(s => (
                <a key={s.path} href={s.path} style={{
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  fontFamily: "'Merriweather', Georgia, serif",
                  transition: "color 0.2s",
                }}>
                  • {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 3: Caja de Datos / Sugerencias & Participación */}
          <div style={{
            background: "rgba(0, 0, 0, 0.04)",
            border: "1px solid var(--glass-border)",
            borderRadius: "14px",
            padding: "1.25rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <MessageSquarePlus size={16} color={accentColor} />
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--heading-color)", fontFamily: "Outfit, sans-serif" }}>
                Participación & Sugerencias
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.85rem", lineHeight: 1.45, fontFamily: "'Merriweather', Georgia, serif" }}>
              ¿Querés proponer una nota, colaborar como invitado o dejarnos una sugerencia para el diario?
            </p>

            {sent ? (
              <div style={{
                background: "rgba(0, 230, 118, 0.12)",
                border: "1px solid #00e676",
                borderRadius: "10px",
                padding: "0.85rem",
                textAlign: "center",
                color: "#00e676",
                fontSize: "0.8rem",
                fontFamily: "Inter, sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}>
                <CheckCircle2 size={16} /> ¡Gracias! Tu sugerencia fue enviada a la redacción.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: "var(--card-bg)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                      padding: "0.45rem 0.65rem",
                      fontSize: "0.78rem",
                      color: "var(--text-primary)",
                      fontFamily: "Inter, sans-serif",
                      outline: "none",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: "var(--card-bg)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                      padding: "0.45rem 0.65rem",
                      fontSize: "0.78rem",
                      color: "var(--text-primary)",
                      fontFamily: "Inter, sans-serif",
                      outline: "none",
                    }}
                  />
                </div>

                <select
                  value={formData.type}
                  onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "var(--card-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "8px",
                    padding: "0.45rem 0.65rem",
                    fontSize: "0.75rem",
                    color: "var(--text-primary)",
                    fontFamily: "Inter, sans-serif",
                    outline: "none",
                  }}
                >
                  <option value="sugerencia">💡 Sugerencia o Mejora</option>
                  <option value="colaboracion">✍️ Quiero colaborar / Columna de opinión</option>
                  <option value="noticia">📰 Proponer tema o noticia de mi provincia</option>
                  <option value="otro">💬 Consulta general</option>
                </select>

                <textarea
                  rows={2}
                  placeholder="Escribí tu sugerencia o mensaje..."
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "var(--card-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "8px",
                    padding: "0.45rem 0.65rem",
                    fontSize: "0.78rem",
                    color: "var(--text-primary)",
                    fontFamily: "Inter, sans-serif",
                    outline: "none",
                    resize: "vertical",
                  }}
                />

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    background: accentColor,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.78rem",
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    transition: "opacity 0.2s",
                  }}
                >
                  <Send size={12} /> {sending ? "Enviando..." : "Enviar a la Redacción"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bloque Disclaimer & Aviso Legal sobre IA */}
        <div style={{
          marginTop: "2rem",
          marginBottom: "1.5rem",
          background: "rgba(0,212,255,0.03)",
          border: "1px solid rgba(0,212,255,0.15)",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          fontFamily: "Inter, sans-serif",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.85rem" }}>⚖️</span>
            <span style={{ fontSize: "0.72rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Aviso Legal & Descargo de Responsabilidad sobre Periodismo Aumentado con IA
            </span>
          </div>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
            <strong>Talos Diario</strong> es un medio de comunicación digital interactivo respaldado por modelos de inteligencia artificial y minería de fuentes públicas (RSS, medios de prensa y tendencias en redes sociales). Las métricas del <em>Mapa de Calor Territorial</em>, los índices de polaridad y las síntesis narrativas son estimaciones automatizadas generadas con fines periodísticos e informativos. No constituyen asesoramiento financiero, ni encuestas electorales oficiales. Todos los derechos sobre artículos de prensa citados pertenecen a sus respectivos autores y medios emisores.
          </p>
        </div>

        {/* Bottom footer */}
        <div style={{
          borderTop: "1px solid var(--glass-border)",
          paddingTop: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'Merriweather', Georgia, serif" }}>
            © 2026 Proyecto Talos · Todos los derechos reservados · Periodismo Aumentado por IA
          </span>
          <span style={{ fontSize: "0.75rem", color: accentColor, fontFamily: "'Merriweather', Georgia, serif", fontWeight: 700 }}>
            {categoryLabel ? `Sección ${categoryLabel}` : "Edición Impresa Digital"} · Argentina
          </span>
        </div>
      </div>
    </footer>
  );
}
