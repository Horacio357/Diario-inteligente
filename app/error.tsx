"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error capturado en Talos Diario:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "75vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background: "var(--bg-base)",
      fontFamily: "'Merriweather', Georgia, serif",
    }}>
      <div style={{
        maxWidth: "520px",
        width: "100%",
        background: "var(--card-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "16px",
        padding: "2.5rem 2rem",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          display: "inline-flex",
          padding: "0.8rem",
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
          marginBottom: "1rem",
        }}>
          <AlertCircle size={36} />
        </div>
        
        <h2 style={{
          fontSize: "1.4rem",
          fontWeight: 800,
          color: "var(--heading-color)",
          marginBottom: "0.6rem",
        }}>
          Interrupción en la Redacción
        </h2>
        
        <p style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: "1.8rem",
        }}>
          Ocurrió un inconveniente al procesar la información. El sistema de contingencia editorial está activo.
        </p>

        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--accent-primary)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1.1rem",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} /> Reintentar Carga
          </button>
          
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255,255,255,0.06)",
              color: "var(--text-secondary)",
              border: "1px solid var(--glass-border)",
              borderRadius: "8px",
              padding: "0.6rem 1.1rem",
              fontSize: "0.82rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <Home size={14} /> Ir a la Portada
          </a>
        </div>
      </div>
    </div>
  );
}
