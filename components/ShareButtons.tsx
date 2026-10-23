"use client";

import { useState } from "react";
import { Share2, Check, Copy, MessageCircle, Globe, ExternalLink } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
  category?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? (url || window.location.href) : (url || "https://talosdiario.ar");
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(`${title} · Talos Diario`);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=TalosDiario`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.65rem",
      flexWrap: "wrap",
      padding: "1rem 1.25rem",
      background: "var(--card-bg)",
      border: "1px solid var(--glass-border)",
      borderRadius: "12px",
      margin: "2rem 0",
      fontFamily: "Outfit, sans-serif",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        fontSize: "0.75rem",
        fontWeight: 800,
        color: "var(--accent-primary)",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginRight: "0.5rem",
      }}>
        <Share2 size={14} color="var(--accent-primary)" /> Compartir Nota:
      </div>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir en WhatsApp"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "rgba(37, 211, 102, 0.12)",
          border: "1px solid rgba(37, 211, 102, 0.35)",
          color: "#25D366",
          borderRadius: "8px",
          padding: "0.4rem 0.75rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        <MessageCircle size={14} /> WhatsApp
      </a>

      {/* X / Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir en X (Twitter)"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          color: "var(--text-primary)",
          borderRadius: "8px",
          padding: "0.4rem 0.75rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        <ExternalLink size={14} /> X / Twitter
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir en LinkedIn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "rgba(10, 102, 194, 0.12)",
          border: "1px solid rgba(10, 102, 194, 0.35)",
          color: "#0a66c2",
          borderRadius: "8px",
          padding: "0.4rem 0.75rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        <Globe size={14} /> LinkedIn
      </a>

      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir en Facebook"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "rgba(24, 119, 242, 0.12)",
          border: "1px solid rgba(24, 119, 242, 0.35)",
          color: "#1877f2",
          borderRadius: "8px",
          padding: "0.4rem 0.75rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        <Globe size={14} /> Facebook
      </a>

      {/* Copiar enlace */}
      <button
        onClick={handleCopy}
        title="Copiar enlace al portapapeles"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          background: copied ? "rgba(0, 230, 118, 0.15)" : "var(--glass-bg)",
          border: `1px solid ${copied ? "#00e676" : "var(--glass-border)"}`,
          color: copied ? "#00e676" : "var(--text-secondary)",
          borderRadius: "8px",
          padding: "0.4rem 0.75rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          cursor: "pointer",
          marginLeft: "auto",
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "¡Copiado!" : "Copiar Enlace"}
      </button>
    </div>
  );
}
