import { ShieldCheck, Scale, Cpu, Database, CheckCircle2, AlertTriangle, FileText, ChevronLeft, ArrowRight, Lock, BarChart3, Radio } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Metodología y Trazabilidad de Datos | Talos Diario",
  description: "Conocé en detalle las fuentes, modelos de procesamiento NLP, ponderación territorial y salvaguardas anti-manipulación del índice de ánimo social de Talos Diario.",
};

export default function MetodologiaPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .metodologia-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 5rem 1.5rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text-primary);
        }
        .section-card {
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .highlight-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
        }
      `}} />

      <div style={{ minHeight: "100vh", background: "transparent" }}>
        {/* Barra superior de navegación */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10, 14, 26, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "1rem 1.5rem"
        }}>
          <div style={{ maxWidth: "1040px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "Outfit, sans-serif"
            }}>
              <ChevronLeft size={16} /> Volver a Portada
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="highlight-badge" style={{ background: "rgba(0,212,255,0.1)", color: "var(--accent-primary)", border: "1px solid rgba(0,212,255,0.3)" }}>
                TRANSPARENCIA ALGORÍTMICA
              </span>
            </div>
          </div>
        </header>

        <main className="metodologia-container">
          {/* Hero Header */}
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Scale size={20} color="var(--accent-primary)" />
              <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.78rem", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Unidad de Inteligencia Social & Ciencia de Datos
              </span>
            </div>
            <h1 style={{
              fontFamily: "Merriweather, Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "var(--heading-color)",
              marginBottom: "1rem"
            }}>
              Metodología, Fuentes & Trazabilidad Algorítmica
            </h1>
            <p style={{
              fontFamily: "Merriweather, Georgia, serif",
              fontSize: "1.05rem",
              lineHeight: 1.65,
              color: "var(--text-secondary)",
              maxWidth: "850px"
            }}>
              Talos Diario procesa miles de señales de medios digitales, indicadores económicos oficiales y participación comunitaria auditada para medir el <strong>ánimo social en las 24 provincias argentinas</strong>. Este documento detalla la recolección, el cálculo matemático, los filtros anti-manipulación y las limitaciones reconocidas.
            </p>
          </div>

          {/* Distinción Fundamental: Ánimo Social vs Encuesta Tradicional */}
          <div className="section-card" style={{ borderLeft: "4px solid var(--accent-primary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <ShieldCheck size={18} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--heading-color)" }}>
                1. Definición Conceptual: Índice de Ánimo Social vs. Encuesta
              </h2>
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Las métricas publicadas en Talos Diario (como el <em>Pulso Nacional</em>, los mapas de calor distritales y los radares temáticos) constituyen un <strong>índice sintético de clima de conversación</strong>, generado en tiempo real mediante procesamiento de lenguaje natural (NLP).
            </p>
            <div style={{
              background: "rgba(255, 107, 0, 0.06)",
              border: "1px solid rgba(255, 107, 0, 0.3)",
              borderRadius: "10px",
              padding: "1rem 1.25rem",
              fontSize: "0.85rem",
              lineHeight: 1.55,
              color: "var(--text-primary)"
            }}>
              <strong>Diferencia clave [A REVISAR POR UN ABOGADO]:</strong> Talos Diario <u>no realiza encuestas electorales de intención de voto</u> basadas en muestras censales presenciales o telefónicas domiciliarias (normativa CNV/DINE). Mide la <strong>temperatura del debate público territorial</strong>: de qué se habla, con qué valencia emocional se discute y cómo impactan las noticias en cada provincia con miras al escenario socio-político de 2026-2027.
            </div>
          </div>

          {/* Fuentes de Información */}
          <div className="section-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Database size={18} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--heading-color)" }}>
                2. Fuentes de Información Integradas
              </h2>
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Para garantizar que ningún dato provenga de cifras aisladas o inconsistentes, Talos Diario utiliza una arquitectura de datos canónica:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ fontSize: "0.72rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "#00e676", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                  Indicadores Económicos
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--heading-color)" }}>
                  Fuentes Oficiales y de Mercado
                </h3>
                <ul style={{ fontSize: "0.82rem", color: "var(--text-secondary)", paddingLeft: "1.2rem", margin: 0, lineHeight: 1.5 }}>
                  <li><strong>Dólar Oficial y Mayorista:</strong> Banco Central de la República Argentina (BCRA).</li>
                  <li><strong>Dólar Blue y Financieros (MEP/CCL):</strong> DolarAPI / agregadores de mesas de cambio verificadas.</li>
                  <li><strong>Riesgo País (EMBI+):</strong> JP Morgan / analistas bursátiles.</li>
                  <li><strong>S&P Merval:</strong> Bolsas y Mercados Argentinos (BYMA).</li>
                  <li><strong>Inflación (IPC):</strong> Instituto Nacional de Estadística y Censos (INDEC).</li>
                </ul>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ fontSize: "0.72rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                  Contenido Periodístico
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--heading-color)" }}>
                  Medios Federales y Cables
                </h3>
                <ul style={{ fontSize: "0.82rem", color: "var(--text-secondary)", paddingLeft: "1.2rem", margin: 0, lineHeight: 1.5 }}>
                  <li>Monitoreo automatizado de más de 30 medios nacionales y provinciales (Clarín, La Nación, Ámbito Financiero, Perfil, La Gaceta de Tucumán, El Día, Río Negro, etc.).</li>
                  <li>Cables de agencias públicas y feeds RSS institucionales.</li>
                  <li>Clasificación temática por distritos y entidades clave.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fórmula de Ponderación Territorial */}
          <div className="section-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Cpu size={18} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--heading-color)" }}>
                3. Ponderación Territorial: 65% Medios / 35% Ciudadanos
              </h2>
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              El valor final de sentimiento provincial se normaliza en una escala de <strong>-1.00 (Máxima Tensión / Negatividad) a +1.00 (Máximo Consenso / Favorable)</strong>, proyectado como Índice de Calor de 0 a 100 puntos:
            </p>

            <div style={{
              background: "var(--card-bg)",
              border: "1px dashed var(--glass-border)",
              borderRadius: "12px",
              padding: "1.25rem",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: "var(--accent-primary)",
              marginBottom: "1.25rem"
            }}>
              Índice Provincial = (0.65 × Sentimiento_Medios) + (0.35 × Voto_Ciudadano_Auditado)<br />
              Puntos_de_Calor = Math.round((Índice Provincial + 1) × 50)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
              <div style={{ padding: "0.75rem", borderLeft: "3px solid var(--accent-primary)" }}>
                <strong style={{ fontSize: "0.88rem", color: "var(--heading-color)" }}>65% Componente Mediático</strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.3rem 0 0 0" }}>
                  Analiza el volumen de artículos y la valencia semántica de titulares y párrafos clave de noticias que mencionan a la provincia o a sus autoridades.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderLeft: "3px solid #00e676" }}>
                <strong style={{ fontSize: "0.88rem", color: "var(--heading-color)" }}>35% Componente Ciudadano</strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.3rem 0 0 0" }}>
                  Incorpora las votaciones verificadas emitidas por lectores reales en el módulo de portada, filtrando patrones anómalos.
                </p>
              </div>
            </div>
          </div>

          {/* Salvaguardas Anti-Manipulación y Bots */}
          <div className="section-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Lock size={18} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--heading-color)" }}>
                4. Protección Anti-Bots y Auditoría de Integridad
              </h2>
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)", marginBottom: "1rem" }}>
              En períodos pre-electorales y de alta polarización, los sistemas de votación digital son blanco recurrente de brigadas coordinadas y bots automáticos. Talos implementa tres niveles de protección:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
                <CheckCircle2 size={16} color="#00e676" style={{ marginTop: "3px", flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: "0.88rem", color: "var(--heading-color)" }}>Fingerprint Criptográfico (voterHash):</strong>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "block" }}>
                    Cada voto genera una firma única computada a partir de cabeceras de cliente seguras y salt de servidor. No requiere que el usuario entregue datos personales invasivos pero previene la multiplicación artificial de votos.
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
                <CheckCircle2 size={16} color="#00e676" style={{ marginTop: "3px", flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: "0.88rem", color: "var(--heading-color)" }}>Límite de Frecuencia Semanal:</strong>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "block" }}>
                    Un mismo identificador verificado solo puede emitir un voto por provincia cada 7 días corridos. Los votos subsiguientes dentro del período no alteran el índice.
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
                <CheckCircle2 size={16} color="#00e676" style={{ marginTop: "3px", flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: "0.88rem", color: "var(--heading-color)" }}>Atenuación de Picos Inusuales (Dampening):</strong>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "block" }}>
                    Si una provincia experimenta un incremento de votos superior al 300% de su media móvil histórica en menos de una hora, el algoritmo reduce el peso de los votos extraordinarios para neutralizar campañas orquestadas.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sesgos Reconocidos y Limitaciones */}
          <div className="section-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <AlertTriangle size={18} color="#ffc400" />
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--heading-color)" }}>
                5. Sesgos Conocidos y Limitaciones Técnicas
              </h2>
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)", marginBottom: "1rem" }}>
              La honestidad intelectual exige declarar con transparencia los límites del método algorítmico:
            </p>
            <ul style={{ fontSize: "0.85rem", color: "var(--text-secondary)", paddingLeft: "1.25rem", lineHeight: 1.65 }}>
              <li><strong>Sesgo de penetración digital:</strong> Las opiniones expresadas reflejan preferentemente a la población con acceso habitual a internet y dispositivos conectados.</li>
              <li><strong>Asimetría mediática:</strong> Los medios nacionales dedican mayor volumen a los distritos centrales (CABA, Provincia de Buenos Aires, Córdoba, Santa Fe), lo que exige factores de corrección por densidad poblacional en provincias de menor tamaño demográfico.</li>
              <li><strong>Sarcasmo e ironía:</strong> Aunque los modelos de lenguaje modernos identifican giros lingüísticos con más del 85% de precisión en modismos argentinos, existe un margen residual de ambigüedad en oraciones complejas.</li>
            </ul>
          </div>

          {/* Contacto & Solicitud de Informes B2B */}
          <div style={{
            background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(0,212,255,0.3)",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{ fontSize: "0.72rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              SERVICIOS INSTITUCIONALES · B2B
            </div>
            <h3 style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: "1.4rem", fontWeight: 900, color: "var(--heading-color)", margin: 0 }}>
              ¿Necesitás reportes a medida o acceso al API de datos?
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", maxWidth: "650px", lineHeight: 1.6, margin: 0 }}>
              Ofrecemos dashboards privados, alertas en tiempo real y reportes ejecutivos desglosados por departamento provincial para equipos de gobierno, consultoras políticas y corporaciones.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
              <Link href="/inteligencia" style={{
                background: "var(--accent-primary)",
                color: "#050b18",
                fontWeight: 800,
                fontSize: "0.85rem",
                fontFamily: "Outfit, sans-serif",
                padding: "0.7rem 1.4rem",
                borderRadius: "10px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}>
                Conocer Talos Inteligencia <ArrowRight size={15} />
              </Link>
              <a href="mailto:metodologia@talosdiario.ar" style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                color: "var(--heading-color)",
                fontWeight: 700,
                fontSize: "0.85rem",
                fontFamily: "Outfit, sans-serif",
                padding: "0.7rem 1.4rem",
                borderRadius: "10px",
                textDecoration: "none"
              }}>
                Consultas metodológicas: metodologia@talosdiario.ar
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
