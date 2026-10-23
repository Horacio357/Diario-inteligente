"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  FileText,
  Lock,
  ArrowRight,
  Send,
  Building2,
  Users,
  Compass,
  Download,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import Footer from "@/components/Footer";
import { downloadMethodologyPdf } from "@/lib/reportPdfGenerator";

export default function InteligenciaPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    phone: "",
    district: "Nacional (24 Provincias)",
    planInterest: "federal",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadingSample, setDownloadingSample] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar la solicitud");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSamplePdf = () => {
    setDownloadingSample(true);
    try {
      downloadMethodologyPdf({
        topic: "informe-ejecutivo-2027",
        topicLabel: "Escenario Electoral & Humor Social Federal",
        mediaSentiment: 0.12,
        citizenSentiment: -0.08,
        divergence: 20,
        divergenceLabel: "Divergencia marcada entre agenda de medios y demanda ciudadana",
        totalCitizenVotes: 4250,
        positivePct: 48,
        neutralPct: 22,
        negativePct: 30,
        recentReasons: [
          { reason: "Preocupación prioritaria por poder adquisitivo y tarifas de servicios públicos.", sentiment: -0.6 },
          { reason: "Recepción positiva de anuncios de infraestructura y obras viales provinciales.", sentiment: 0.5 },
          { reason: "Expectativa moderada ante desaceleración de índices inflacionarios mayoristas.", sentiment: 0.2 },
        ],
      });
    } catch (e) {
      console.error("Error al generar PDF de muestra:", e);
    } finally {
      setTimeout(() => setDownloadingSample(false), 1500);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .inteligencia-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text-primary);
          background: transparent;
        }
        .hero-b2b {
          max-width: 1140px;
          margin: 0 auto;
          padding: 3.5rem 1.5rem 2.5rem 1.5rem;
          text-align: center;
        }
        .b2b-grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 1.5rem;
          margin-top: 2.5rem;
        }
        .b2b-card {
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .b2b-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 212, 255, 0.35);
        }
        .plan-card {
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .plan-featured {
          border: 2px solid var(--accent-primary);
          box-shadow: 0 8px 30px rgba(0, 212, 255, 0.15);
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.86rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          line-height: 1.45;
        }
        .form-input {
          width: 100%;
          box-sizing: border-box;
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: var(--accent-primary);
        }
      `}} />

      <div className="inteligencia-root">
        {/* Navigation Bar */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10, 14, 26, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "1rem 1.5rem",
        }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "Outfit, sans-serif",
            }}>
              <ChevronLeft size={16} /> Volver al Diario
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link href="/metodologia" style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                textDecoration: "none",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 600,
              }}>
                Metodología & Fuentes
              </Link>
              <a
                href="#solicitar-demo"
                style={{
                  background: "var(--accent-primary)",
                  color: "#050b18",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  fontFamily: "Outfit, sans-serif",
                  textDecoration: "none",
                }}
              >
                Solicitar Acceso
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-b2b">
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(0, 212, 255, 0.08)",
            border: "1px solid rgba(0, 212, 255, 0.25)",
            padding: "0.3rem 0.85rem",
            borderRadius: "100px",
            marginBottom: "1.25rem",
          }}>
            <Sparkles size={13} color="var(--accent-primary)" />
            <span style={{
              fontSize: "0.72rem",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 800,
              color: "var(--accent-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}>
              Plataforma B2B · Escenario Nacional 2027
            </span>
          </div>

          <h1 style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            color: "var(--heading-color)",
            marginBottom: "1.25rem",
          }}>
            Inteligencia Social & Datos Estratégicos para Tomadores de Decisión
          </h1>

          <p style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            maxWidth: "800px",
            margin: "0 auto 2rem auto",
            fontFamily: "Merriweather, Georgia, serif",
          }}>
            Monitoreo en tiempo real del clima social en las 24 provincias argentinas, radares de alerta temprana de crisis y mapas de influencia política para <strong>consultoras, gobiernos, corporaciones y medios</strong>.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#solicitar-demo"
              style={{
                background: "var(--accent-primary)",
                color: "#050b18",
                fontWeight: 800,
                fontSize: "0.95rem",
                fontFamily: "Outfit, sans-serif",
                padding: "0.85rem 1.8rem",
                borderRadius: "10px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 20px rgba(0, 212, 255, 0.3)",
              }}
            >
              Agendar Demo Ejecutiva <ArrowRight size={16} />
            </a>

            <button
              onClick={handleDownloadSamplePdf}
              disabled={downloadingSample}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--glass-border)",
                color: "var(--heading-color)",
                fontWeight: 700,
                fontSize: "0.95rem",
                fontFamily: "Outfit, sans-serif",
                padding: "0.85rem 1.5rem",
                borderRadius: "10px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Download size={16} color="var(--accent-primary)" />
              {downloadingSample ? "Descargando reporte..." : "Descargar Reporte Ejemplo (PDF)"}
            </button>
          </div>
        </section>

        {/* Pilares de Solución */}
        <section style={{ maxWidth: "1140px", margin: "0 auto", padding: "2rem 1.5rem 4rem 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--heading-color)" }}>
              Nuestras 4 Capacidades Principales
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
              Herramientas de alta densidad diseñadas específicamente para la toma de decisiones en coyunturas complejas.
            </p>
          </div>

          <div className="b2b-grid-cards">
            {/* Capacidad 1 */}
            <div className="b2b-card">
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(0, 212, 255, 0.1)",
                border: "1px solid rgba(0, 212, 255, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}>
                <Activity size={22} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "var(--heading-color)", marginBottom: "0.6rem" }}>
                Pulso Federal Continuo
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                Mapeo en tiempo real del humor social en los 24 distritos del país con filtro temático (Economía, Seguridad, Salud, Educación y Empleo). No esperes 3 semanas a un informe de campo estático.
              </p>
            </div>

            {/* Capacidad 2 */}
            <div className="b2b-card">
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}>
                <Users size={22} color="#a78bfa" />
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "var(--heading-color)", marginBottom: "0.6rem" }}>
                Radares de Figuras & Alianzas
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                Comparador cara a cara de actores públicos: aprobación neta, capacidad de movilización, polarización y contagio narrativo para modelar alianzas y medir impacto de discursos.
              </p>
            </div>

            {/* Capacidad 3 */}
            <div className="b2b-card">
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(255, 107, 0, 0.1)",
                border: "1px solid rgba(255, 107, 0, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}>
                <FileText size={22} color="#ff6b00" />
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "var(--heading-color)", marginBottom: "0.6rem" }}>
                Informes Ejecutivos & Whitepapers
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                Generación automatizada de reportes vectoriales para directorios, comités de campaña y ministros, con respaldo de fuentes oficiales (BCRA, INDEC, cables y participación verificada).
              </p>
            </div>

            {/* Capacidad 4 */}
            <div className="b2b-card">
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(0, 230, 118, 0.1)",
                border: "1px solid rgba(0, 230, 118, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}>
                <Layers size={22} color="#00e676" />
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "var(--heading-color)", marginBottom: "0.6rem" }}>
                API REST & Datos Crudos
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                Conectores directos para integrar nuestros índices en tus propios sistemas de BI, dashboards de Tableau/PowerBI o herramientas internas de análisis electoral y reputacional.
              </p>
            </div>
          </div>
        </section>

        {/* Planes & Comparativa B2B */}
        <section style={{ maxWidth: "1140px", margin: "0 auto", padding: "1rem 1.5rem 4rem 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{
              fontSize: "0.72rem",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 800,
              color: "var(--accent-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}>
              Esquema de Suscripciones
            </span>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--heading-color)", marginTop: "0.4rem" }}>
              Planes Adaptados a la Escala de tu Organización
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {/* Plan 1 */}
            <div className="plan-card">
              <div style={{ fontSize: "0.75rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Plan Consultoría
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "var(--heading-color)", margin: "0.4rem 0 0.8rem 0" }}>
                Asesores & Analistas
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Para consultores individuales, analistas de opinión y periodistas de investigación.
              </p>

              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1.25rem", flex: 1 }}>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Acceso a Dashboard Federal 24 Provincias</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Comparador de figuras públicas (hasta 10 perfiles/mes)</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>2 Informes ejecutivos en PDF por mes</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Soporte estándar vía correo electrónico</span>
                </div>
              </div>

              <a
                href="#solicitar-demo"
                onClick={() => setFormData(p => ({ ...p, planInterest: "monitoreo" }))}
                style={{
                  marginTop: "1.5rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--heading-color)",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  fontFamily: "Outfit, sans-serif",
                  textDecoration: "none",
                }}
              >
                Solicitar Cotización
              </a>
            </div>

            {/* Plan 2: Destacado */}
            <div className="plan-card plan-featured">
              <div style={{
                position: "absolute",
                top: "-12px",
                right: "20px",
                background: "var(--accent-primary)",
                color: "#050b18",
                fontSize: "0.65rem",
                fontWeight: 900,
                fontFamily: "Outfit, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                padding: "0.25rem 0.75rem",
                borderRadius: "100px",
              }}>
                Recomendado Campaña 2027
              </div>

              <div style={{ fontSize: "0.75rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Plan Federal Ejecutivo
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "var(--heading-color)", margin: "0.4rem 0 0.8rem 0" }}>
                Gobiernos & Campañas
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Para ministerios, gobernaciones, intendencias y equipos de comando electoral nacional.
              </p>

              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1.25rem", flex: 1 }}>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#00e676" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Todo lo del Plan Consultoría</strong></span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#00e676" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Desglose por secciones electorales y departamentos clave</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#00e676" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Alertas tempranas de crisis y picos de indignación (WhatsApp/Email)</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#00e676" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Informes ejecutivos ilimitados con trazabilidad y marcas blancas</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#00e676" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Reunión mensual de briefing estratégico con nuestro equipo de datos</span>
                </div>
              </div>

              <a
                href="#solicitar-demo"
                onClick={() => setFormData(p => ({ ...p, planInterest: "federal" }))}
                style={{
                  marginTop: "1.5rem",
                  background: "var(--accent-primary)",
                  color: "#050b18",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  fontFamily: "Outfit, sans-serif",
                  textDecoration: "none",
                }}
              >
                Solicitar Acceso Prioritario
              </a>
            </div>

            {/* Plan 3 */}
            <div className="plan-card">
              <div style={{ fontSize: "0.75rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Plan Enterprise
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "var(--heading-color)", margin: "0.4rem 0 0.8rem 0" }}>
                Corporaciones & API
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Para grandes empresas, cámaras empresarias, fondos de inversión y centros universitarios.
              </p>

              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1.25rem", flex: 1 }}>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Todo lo del Plan Federal</strong></span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Acceso full a REST API con endpoints dedicados y webhooks</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Series históricas de datos crudos descargables (CSV / JSON)</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Modelado y afinación de tópicos a medida de la organización</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>Acuerdo de confidencialidad (NDA) y SLA garantizado</span>
                </div>
              </div>

              <a
                href="#solicitar-demo"
                onClick={() => setFormData(p => ({ ...p, planInterest: "enterprise" }))}
                style={{
                  marginTop: "1.5rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--heading-color)",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  fontFamily: "Outfit, sans-serif",
                  textDecoration: "none",
                }}
              >
                Hablar con Dirección
              </a>
            </div>
          </div>
        </section>

        {/* Formulario de Demostración y Contacto B2B */}
        <section id="solicitar-demo" style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem 1.5rem 5rem 1.5rem" }}>
          <div style={{
            background: "var(--card-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "20px",
            padding: "2.5rem 2rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--accent-primary)",
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.72rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "0.5rem",
              }}>
                <Building2 size={14} /> Solicitud Institucional
              </div>
              <h2 style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: "1.8rem", fontWeight: 900, color: "var(--heading-color)", margin: 0 }}>
                Agendá una Demostración de Talos Inteligencia
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                Completá los datos y te presentaremos un diagnóstico inicial adaptado a tu provincia o sector.
              </p>
            </div>

            {submitted ? (
              <div style={{
                background: "rgba(0, 230, 118, 0.08)",
                border: "1px solid #00e676",
                borderRadius: "12px",
                padding: "2rem",
                textAlign: "center",
              }}>
                <CheckCircle2 size={40} color="#00e676" style={{ margin: "0 auto 1rem auto" }} />
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "var(--heading-color)", marginBottom: "0.5rem" }}>
                  Solicitud Registrada con Éxito
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 1.5rem auto" }}>
                  Gracias por tu interés en Talos Inteligencia. Un consultor senior de nuestro equipo de datos se comunicará a tu correo corporativo en menos de 24 horas hábiles.
                </p>
                <Link
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: "var(--accent-primary)",
                    textDecoration: "underline",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  Volver a la portada de noticias →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {errorMsg && (
                  <div style={{
                    background: "rgba(255, 23, 68, 0.1)",
                    border: "1px solid #ff1744",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    color: "#ff1744",
                    fontSize: "0.82rem",
                  }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)", marginBottom: "0.35rem" }}>
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Lic. Martín Ramos"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)", marginBottom: "0.35rem" }}>
                      Correo Corporativo o Institucional *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@organizacion.com / .gob.ar"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)", marginBottom: "0.35rem" }}>
                      Organización, Gobierno o Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Consultora Ágora / Ministerio / Diario..."
                      value={formData.organization}
                      onChange={e => setFormData(p => ({ ...p, organization: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)", marginBottom: "0.35rem" }}>
                      Cargo / Rol
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Director de Asuntos Públicos / Asesor"
                      value={formData.role}
                      onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)", marginBottom: "0.35rem" }}>
                      Teléfono / WhatsApp de Contacto
                    </label>
                    <input
                      type="tel"
                      placeholder="+54 9 11 ..."
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)", marginBottom: "0.35rem" }}>
                      Distrito o Región de Interés Prioritario
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Buenos Aires, Córdoba, CABA, Nacional..."
                      value={formData.district}
                      onChange={e => setFormData(p => ({ ...p, district: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)", marginBottom: "0.35rem" }}>
                    Plan de Interés Inicial
                  </label>
                  <select
                    value={formData.planInterest}
                    onChange={e => setFormData(p => ({ ...p, planInterest: e.target.value }))}
                    className="form-input"
                    style={{ background: "var(--card-bg)" }}
                  >
                    <option value="monitoreo">Plan Consultoría & Asesores</option>
                    <option value="federal">Plan Federal Ejecutivo (Gobiernos / Campañas 2027)</option>
                    <option value="enterprise">Plan Enterprise & Acceso API</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)", marginBottom: "0.35rem" }}>
                    Objetivos o Consulta Específica (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contanos brevemente qué tipo de métricas, distritos o figuras necesitás monitorear..."
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="form-input"
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                  Información confidencial sujeta a secreto profesional. Talos Diario no comparte datos institucionales con terceros.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "var(--accent-primary)",
                    color: "#050b18",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.9rem",
                    fontSize: "0.95rem",
                    fontWeight: 900,
                    fontFamily: "Outfit, sans-serif",
                    cursor: loading ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "opacity 0.2s",
                    marginTop: "0.5rem",
                  }}
                >
                  <Send size={16} />
                  {loading ? "Enviando solicitud..." : "Enviar Solicitud de Demostración"}
                </button>
              </form>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
