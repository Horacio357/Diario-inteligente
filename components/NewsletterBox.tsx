"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Send, Clock, ShieldCheck } from "lucide-react";

export default function NewsletterBox({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Ingresá un correo electrónico válido.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al suscribir.");
      }

      setSuccessMsg(data.message);
      setEmail("");
      setName("");
    } catch (err: any) {
      setErrorMsg(err.message || "No se pudo completar la suscripción.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--glass-border)",
      borderRadius: "14px",
      padding: compact ? "1.25rem" : "2rem 1.75rem",
      color: "var(--text-primary)",
      fontFamily: "'Merriweather', Georgia, serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <Mail size={16} color="var(--accent-primary)" />
        <span style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "0.72rem",
          fontWeight: 800,
          color: "var(--accent-primary)",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
        }}>
          Edición Matutina por Email
        </span>
      </div>

      <h3 style={{
        fontFamily: "'Merriweather', Georgia, serif",
        fontSize: compact ? "1.1rem" : "1.4rem",
        fontWeight: 900,
        color: "var(--heading-color)",
        lineHeight: 1.25,
        marginBottom: "0.4rem",
      }}>
        El Resumen Matutino de Talos
      </h3>

      <p style={{
        fontSize: "0.8rem",
        color: "var(--text-muted)",
        lineHeight: 1.55,
        marginBottom: "1.25rem",
        fontFamily: "'Merriweather', Georgia, serif",
        maxWidth: "600px",
      }}>
        Recibí cada mañana a las <strong>7:00 AM</strong> en tu casilla las 5 noticias imprescindibles del día, el análisis de opinión pública y el índice actualizado del <em>Pulso Nacional</em>.
      </p>

      {successMsg ? (
        <div style={{
          background: "rgba(0, 230, 118, 0.1)",
          border: "1px solid #00e676",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          color: "#00e676",
          fontSize: "0.82rem",
          fontFamily: "Outfit, sans-serif",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}>
          <CheckCircle2 size={18} flexShrink={0} />
          <div>{successMsg}</div>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.65rem",
          }}>
            {!compact && (
              <input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "var(--bg-base)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  padding: "0.6rem 0.85rem",
                  fontSize: "0.82rem",
                  color: "var(--text-primary)",
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                }}
              />
            )}
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "var(--bg-base)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                padding: "0.6rem 0.85rem",
                fontSize: "0.82rem",
                color: "var(--text-primary)",
                fontFamily: "Inter, sans-serif",
                outline: "none",
              }}
            />
          </div>

          {errorMsg && (
            <span style={{ fontSize: "0.75rem", color: "#ff1744", fontFamily: "Inter, sans-serif" }}>
              {errorMsg}
            </span>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontFamily: "Inter, sans-serif",
            }}>
              <ShieldCheck size={12} color="var(--accent-primary)" /> Sin spam. Podés desuscribirte en un clic.
            </span>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "var(--accent-primary)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "0.6rem 1.25rem",
                fontSize: "0.82rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 800,
                cursor: loading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                transition: "opacity 0.2s",
              }}
            >
              <Send size={13} /> {loading ? "Procesando..." : "Suscribirme Gratis"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
