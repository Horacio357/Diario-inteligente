"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquare, Globe, Share2, ShieldAlert } from "lucide-react";

interface FooterProps {
  categoryLabel?: string;
  categoryColor?: string;
}

export default function Footer({ categoryLabel, categoryColor }: FooterProps) {
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      alert("Por favor completá tu correo y mensaje antes de enviar.");
      return;
    }
    setSending(true);

    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "feedback_submission",
          query: `[SUGERENCIA] (${formData.email}): ${formData.message}`,
          category: categoryLabel || "General",
        }),
      });
    } catch {}

    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ email: "", message: "" });
    }, 4000);
  };

  const accentColor = categoryColor || "var(--accent-primary)";

  return (
    <footer style={{
      borderTop: "1px solid var(--glass-border)",
      marginTop: "3rem",
      padding: "3rem 1.5rem 2rem",
      background: "var(--card-bg)",
      color: "var(--text-primary)",
      fontFamily: "'Merriweather', Georgia, serif",
    }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2.5rem",
          marginBottom: "2.5rem",
        }}>
          {/* Columna 1: Marca & Contacto Institucional */}
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
              Periódico digital interactivo de Argentina. Análisis de opinión pública y periodismo de investigación respaldado por tecnología.
            </p>

            {/* Email de contacto */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: accentColor,
                marginBottom: "0.35rem",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontFamily: "Outfit, sans-serif",
              }}>
                <Mail size={12} color={accentColor} /> Contacto de Redacción
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
                contacto@talosdiario.com
              </a>
            </div>

            {/* Redes Sociales */}
            <div>
              <div style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: accentColor,
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontFamily: "Outfit, sans-serif",
              }}>
                <Globe size={12} color={accentColor} /> Redes Sociales Oficiales
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
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-primary)",
                    fontSize: "0.78rem",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  <Share2 size={13} /> Instagram
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
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-primary)",
                    fontSize: "0.78rem",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  <Globe size={13} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Columna 2: Navegación de Secciones */}
          <div>
            <p style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.72rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: accentColor,
              marginBottom: "1rem",
            }}>
              Secciones
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

          {/* Columna 3: Captador de Email & Sugerencias (Rediseñado Simple) */}
          <div style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "12px",
            padding: "1.25rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.4rem" }}>
              <MessageSquare size={15} color={accentColor} />
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--heading-color)", fontFamily: "Outfit, sans-serif" }}>
                Contacto & Sugerencias
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.85rem", lineHeight: 1.45, fontFamily: "'Merriweather', Georgia, serif" }}>
              Dejanos tu correo y comentario para ponernos en contacto con la redacción.
            </p>

            {sent ? (
              <div style={{
                background: "rgba(0, 230, 118, 0.1)",
                border: "1px solid #00e676",
                borderRadius: "8px",
                padding: "0.75rem",
                textAlign: "center",
                color: "#00e676",
                fontSize: "0.78rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
              }}>
                <CheckCircle2 size={15} /> Mensaje recibido. Gracias por comunicarte.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "var(--card-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "8px",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.8rem",
                    color: "var(--text-primary)",
                    fontFamily: "Inter, sans-serif",
                    outline: "none",
                  }}
                />

                <textarea
                  rows={2}
                  placeholder="Escribí tu mensaje o sugerencia aquí..."
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "var(--card-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "8px",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.8rem",
                    color: "var(--text-primary)",
                    fontFamily: "Inter, sans-serif",
                    outline: "none",
                    resize: "none",
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
                    marginTop: "0.2rem",
                  }}
                >
                  <Send size={12} /> {sending ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bloque Disclaimer & Aviso Legal sin Emojis */}
        <div style={{
          marginTop: "2rem",
          marginBottom: "1.5rem",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          fontFamily: "Inter, sans-serif",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.4rem" }}>
            <ShieldAlert size={14} color={accentColor} />
            <span style={{ fontSize: "0.72rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Aviso Legal & Descargo de Responsabilidad Institucional
            </span>
          </div>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
            <strong>Proyecto Talos</strong> es una plataforma de periodismo interactivo respaldada por modelos analíticos automatizados y recopilación de fuentes informativas públicas. Las métricas del <em>Mapa de Calor Territorial</em>, los índices de opinión y los resúmenes temáticos constituyen estimaciones periodísticas automatizadas generadas con fines exclusivamente informativos. No constituyen asesoramiento financiero, consultoría política ni son encuestas electorales oficiales. Todos los derechos sobre artículos y fuentes citadas corresponden a sus respectivos autores y medios emisores.
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
            © 2026 Proyecto Talos · Todos los derechos reservados · Periodismo Aumentado
          </span>
          <span style={{ fontSize: "0.75rem", color: accentColor, fontFamily: "'Merriweather', Georgia, serif", fontWeight: 700 }}>
            {categoryLabel ? `Sección ${categoryLabel}` : "Edición Impresa Digital"} · Argentina
          </span>
        </div>
      </div>
    </footer>
  );
}
