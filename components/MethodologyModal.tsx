"use client";

import { useState } from "react";
import { X, FileText, CheckCircle2, ShieldCheck, Scale, Newspaper, Users, Sparkles, ExternalLink, Download, ArrowRight } from "lucide-react";
import { downloadMethodologyPdf, ReportPdfData } from "@/lib/reportPdfGenerator";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfData?: Partial<ReportPdfData>;
}

export default function MethodologyModal({ isOpen, onClose, pdfData }: MethodologyModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currentData: ReportPdfData = {
    topic: pdfData?.topic || "general",
    topicLabel: pdfData?.topicLabel || "Humor General",
    mediaSentiment: pdfData?.mediaSentiment ?? 0.05,
    citizenSentiment: pdfData?.citizenSentiment ?? 0.12,
    divergence: pdfData?.divergence ?? 7,
    divergenceLabel: pdfData?.divergenceLabel || "En sincronía con la agenda informativa",
    totalCitizenVotes: pdfData?.totalCitizenVotes ?? 0,
    positivePct: pdfData?.positivePct ?? 52,
    neutralPct: pdfData?.neutralPct ?? 28,
    negativePct: pdfData?.negativePct ?? 20,
    recentReasons: pdfData?.recentReasons || [],
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      downloadMethodologyPdf(currentData);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Error al generar PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(5, 10, 24, 0.85)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "var(--card-bg, #0d1528)",
          border: "1px solid var(--glass-border, rgba(0, 212, 255, 0.2))",
          borderRadius: "16px",
          padding: "1.75rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: "1.35rem",
          color: "var(--text-primary, #f0f4ff)",
          position: "relative",
        }}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--glass-border)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          }}
        >
          <X size={16} />
        </button>

        {/* Encabezado del Modal */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "var(--accent-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                background: "rgba(0, 212, 255, 0.1)",
                border: "1px solid rgba(0, 212, 255, 0.25)",
                padding: "0.2rem 0.6rem",
                borderRadius: "100px",
              }}
            >
              Transparencia Algorítmica · Talos Data Lab
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Merriweather, serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--heading-color, #ffffff)",
              lineHeight: 1.25,
            }}
          >
            ¿Cómo se calculan estos datos?
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.85rem",
              color: "var(--text-secondary, #94a3b8)",
              marginTop: "0.35rem",
              lineHeight: 1.5,
            }}
          >
            El índice de Talos Diario no es una encuesta tradicional ni una simple lectura de redes: surge del{" "}
            <strong style={{ color: "var(--heading-color)" }}>cruce algorítmico entre la agenda de los medios y el voto directo de la ciudadanía</strong>.
          </p>
        </div>

        {/* Esquema visual del "Choque de Datos" */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--glass-border)",
            borderRadius: "12px",
            padding: "1rem",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            alignItems: "center",
            gap: "0.6rem",
            textAlign: "center",
          }}
        >
          {/* Bloque 1: Medios */}
          <div style={{ padding: "0.5rem" }}>
            <Newspaper size={20} color="var(--accent-primary)" style={{ margin: "0 auto 0.3rem" }} />
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.75rem", fontWeight: 700 }}>Agenda de Medios</div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
              NLP sobre portales y cables en tiempo real
            </div>
          </div>

          <span style={{ color: "var(--accent-primary)", fontWeight: 800, fontSize: "1rem" }}>+</span>

          {/* Bloque 2: Lectores */}
          <div style={{ padding: "0.5rem" }}>
            <Users size={20} color="#00e676" style={{ margin: "0 auto 0.3rem" }} />
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.75rem", fontWeight: 700 }}>Voz Ciudadana</div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
              Votos auditados (1 por semana por lector)
            </div>
          </div>

          <span style={{ color: "var(--accent-primary)", fontWeight: 800, fontSize: "1rem" }}>=</span>

          {/* Bloque 3: Choque / Calibración */}
          <div style={{ padding: "0.5rem", background: "rgba(0, 212, 255, 0.05)", borderRadius: "8px", border: "1px solid rgba(0, 212, 255, 0.2)" }}>
            <Scale size={20} color="#ffc400" style={{ margin: "0 auto 0.3rem" }} />
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-primary)" }}>
              Brecha & Calibración
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
              Divergencia % + Mapa 65/35
            </div>
          </div>
        </div>

        {/* Las 3 Fases Explicadas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            style={{
              padding: "0.75rem 0.9rem",
              background: "rgba(255,255,255,0.02)",
              borderLeft: "3px solid var(--accent-primary)",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "var(--heading-color)", marginBottom: "0.2rem" }}>
              1. Monitoreo y Procesamiento de la Agenda Informativa
            </div>
            <p style={{ fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              Rastreamos minuto a minuto las publicaciones de los principales medios periodísticos del país. Mediante modelos de Procesamiento de Lenguaje Natural (NLP) y diccionarios de polaridad tonal ajustados a la coyuntura argentina, se cuantifica el clima editorial (favorable, neutro o crítico) asignado a cada tema.
            </p>
          </div>

          <div
            style={{
              padding: "0.75rem 0.9rem",
              background: "rgba(255,255,255,0.02)",
              borderLeft: "3px solid #00e676",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "var(--heading-color)", marginBottom: "0.2rem" }}>
              2. Voto Popular Directo y Mecanismo Anti-Manipulación
            </div>
            <p style={{ fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              Los lectores emiten su postura voluntaria sobre la situación del país y pueden añadir una justificación breve (hasta 140 caracteres). Para impedir granjas de bots, astroturfing o votos duplicados masivos, el sistema restringe estrictamente a <strong>1 voto por semana</strong> por lector mediante verificación criptográfica anónima.
            </p>
          </div>

          <div
            style={{
              padding: "0.75rem 0.9rem",
              background: "rgba(255,255,255,0.02)",
              borderLeft: "3px solid #ffc400",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "var(--heading-color)", marginBottom: "0.2rem" }}>
              3. El Choque de Datos (Divergencia y Calibración Federal)
            </div>
            <p style={{ fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              Al contrastar ambos vectores matemáticos, el sistema detecta si existe una <strong>brecha de percepción</strong> (cuando los medios reflejan un panorama desconectado del sentir cotidiano de la gente). Para el Mapa Territorial, se pondera un <strong>65% de cobertura periodística</strong> y un <strong>35% de voto ciudadano directo</strong> geolocalizado.
            </p>
          </div>
        </div>

        {/* Fuentes Citadas */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--glass-border)",
            borderRadius: "10px",
            padding: "0.85rem 1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.5rem" }}>
            <ShieldCheck size={14} color="var(--accent-primary)" />
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Fuentes de Información Auditadas
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {[
              "Clarín",
              "La Nación",
              "Ámbito Financiero",
              "Perfil",
              "La Gaceta Tucumán",
              "Olé",
              "NewsData.io Intelligence API",
              "Votación Ciudadana Talos (Últimos 7 días)",
            ].map((fuente) => (
              <span
                key={fuente}
                style={{
                  fontSize: "0.68rem",
                  fontFamily: "Inter, sans-serif",
                  background: "rgba(0, 212, 255, 0.08)",
                  border: "1px solid rgba(0, 212, 255, 0.2)",
                  color: "var(--heading-color)",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "6px",
                }}
              >
                {fuente}
              </span>
            ))}
          </div>
        </div>

        {/* Botón de Descarga del Informe PDF */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "0.5rem",
            borderTop: "1px solid var(--glass-border)",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
            Reporte conforme a estándares de periodismo de datos y código ético.
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            style={{
              background: downloadSuccess ? "#00e676" : "var(--accent-primary)",
              color: downloadSuccess ? "#000000" : "#000000",
              border: "none",
              borderRadius: "8px",
              padding: "0.55rem 1.1rem",
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.78rem",
              fontWeight: 800,
              cursor: downloading ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              boxShadow: "0 0 15px rgba(0, 212, 255, 0.3)",
              transition: "all 0.2s ease",
            }}
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 size={15} />
                <span>¡Informe PDF Descargado!</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>{downloading ? "Generando documento..." : "Descargar Informe Metodológico (PDF)"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
