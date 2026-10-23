import { ShieldAlert, FileText, ChevronLeft, ArrowRight, Scale, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Términos y Condiciones de Uso | Talos Diario",
  description: "Términos de servicio, propiedad intelectual y condiciones de uso de la plataforma Talos Diario e Inteligencia Social.",
};

export default function TerminosPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .legal-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 5rem 1.5rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text-primary);
        }
        .legal-card {
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 2.25rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .legal-h2 {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.35rem;
          color: var(--heading-color);
          margin-bottom: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .legal-p {
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        .legal-list {
          padding-left: 1.4rem;
          margin-bottom: 1rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.65;
        }
        .legal-list li {
          margin-bottom: 0.5rem;
        }
        .draft-banner {
          background: rgba(255, 171, 0, 0.12);
          border: 1px solid rgba(255, 171, 0, 0.4);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 2.5rem;
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }
      `}} />

      <div style={{ minHeight: "100vh", background: "transparent" }}>
        {/* Top Header */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10, 14, 26, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "1rem 1.5rem"
        }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
              <ChevronLeft size={16} /> Volver al Diario
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/privacidad" style={{ color: "var(--text-muted)", fontSize: "0.82rem", textDecoration: "none", fontFamily: "Outfit, sans-serif" }}>
                Privacidad
              </Link>
              <Link href="/metodologia" style={{ color: "var(--text-muted)", fontSize: "0.82rem", textDecoration: "none", fontFamily: "Outfit, sans-serif" }}>
                Metodología
              </Link>
              <Link href="/inteligencia" style={{
                background: "var(--accent-primary)",
                color: "#fff",
                padding: "0.4rem 0.85rem",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "Outfit, sans-serif",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}>
                Talos B2B <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </header>

        <main className="legal-container">
          {/* Header Title */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.3rem 0.8rem",
              borderRadius: "100px",
              background: "rgba(0, 212, 255, 0.1)",
              border: "1px solid rgba(0, 212, 255, 0.25)",
              color: "var(--accent-primary)",
              fontSize: "0.72rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "1rem"
            }}>
              <Scale size={13} /> Marco Regulatorio e Institucional
            </div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 900,
              color: "var(--heading-color)",
              letterSpacing: "-0.02em",
              marginBottom: "0.85rem"
            }}>
              Términos y Condiciones de Uso
            </h1>
            <p style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              maxWidth: "650px",
              margin: "0 auto",
              fontFamily: "'Merriweather', Georgia, serif",
              lineHeight: 1.6
            }}>
              Reglas de uso del servicio periodístico libre y de la suite de analítica territorial de Talos Diario en la República Argentina.
            </p>
          </div>

          {/* Aviso Legal - Borrador para Abogado */}
          <div className="draft-banner">
            <ShieldAlert size={22} color="#ffab00" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#ffab00", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
                [A REVISAR POR UN ABOGADO MATRICULADO]
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                El presente documento constituye un borrador de condiciones contractuales y de servicio preliminar para la fase pública de Talos Diario. Requiere ratificación y firma letrada conforme a las normativas de la República Argentina (Código Civil y Comercial de la Nación, Ley de Defensa del Consumidor Nº 24.240 y Ley de Protección de Datos Personales Nº 25.326).
              </div>
            </div>
          </div>

          {/* Cláusulas */}
          <div className="legal-card">
            <h2 className="legal-h2">1. Objeto y Naturaleza del Servicio</h2>
            <p className="legal-p">
              Talos Diario es una publicación digital de información periodística y de análisis cuantitativo del debate público argentino. Nuestro sistema genera resúmenes noticiosos, paneles de tendencias e <strong>índices de ánimo social</strong> construidos mediante algoritmos de procesamiento de lenguaje natural (NLP) sobre fuentes públicas de información.
            </p>
            <p className="legal-p">
              El acceso a la edición digital abierta es público y gratuito. Las funcionalidades avanzadas de cruce territorial, alertas tempranas, API y reportes ejecutivos están reservadas a los clientes suscriptos a <strong>Talos Inteligencia</strong> bajo acuerdos de servicio específicos.
            </p>
          </div>

          <div className="legal-card">
            <h2 className="legal-h2">2. Declaración Expresa sobre Índices de Opinión Pública</h2>
            <p className="legal-p">
              Las estimaciones difundidas en el <em>Pulso Nacional</em>, mapas de calor provincial y balances de líderes políticos constituyen <strong>aproximaciones analíticas automatizadas</strong> sobre fuentes de texto y tendencias digitales.
            </p>
            <ul className="legal-list">
              <li><strong>No son encuestas electorales oficiales:</strong> No deben equipararse ni interpretarse como sondeos de opinión pública por muestreo probabilístico domiciliario o telefónico tradicional.</li>
              <li><strong>Sin fines de pronóstico vinculante:</strong> Los datos describen la temperatura de la conversación y no constituyen una predicción formal de resultados comiciales ni electorales.</li>
              <li><strong>Trazabilidad metodológica:</strong> Para detalles técnicos de cálculo, ponderaciones 65/35 y márgenes de error estadístico, el usuario puede consultar libremente nuestra <Link href="/metodologia" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>sección de Metodología</Link>.</li>
            </ul>
          </div>

          <div className="legal-card">
            <h2 className="legal-h2">3. Exención de Responsabilidad sobre Indicadores Financieros</h2>
            <p className="legal-p">
              Los valores de cotizaciones (Dólar Oficial, Dólar Blue, Dólar MEP, Dólar CCL) y el índice de Riesgo País reflejados en el sitio se obtienen a través de canales unificados que toman como referencia valores publicados por entidades oficiales y de mercado (Banco Central de la República Argentina, INDEC, JP Morgan).
            </p>
            <p className="legal-p">
              Estos indicadores se proporcionan exclusivamente con propósitos informativos y periodísticos de contexto. En ningún caso constituyen asesoramiento financiero, recomendación de inversión ni oferta de compra o venta de divisas o activos financieros.
            </p>
          </div>

          <div className="legal-card">
            <h2 className="legal-h2">4. Propiedad Intelectual y Licencia de Citas</h2>
            <p className="legal-p">
              Todos los contenidos propios, interfaces, marcas, desarrollos algorítmicos, logotipos y diseños gráficos de Talos Diario y Talos Inteligencia son propiedad exclusiva del proyecto o se encuentran licenciados legítimamente para su uso.
            </p>
            <ul className="legal-list">
              <li><strong>Citas periodísticas y académicas:</strong> Se autoriza la cita parcial de artículos o datos de nuestros índices siempre que se incluya mención explícita con enlace a <em>Talos Diario (talosdiario.ar)</em> y referencia a la metodología.</li>
              <li><strong>Prohibición de scraping masivo:</strong> Queda prohibida la extracción masiva de datos sin autorización previa por escrito o sin la contratación de la API institucional de Talos Inteligencia.</li>
            </ul>
          </div>

          <div className="legal-card">
            <h2 className="legal-h2">5. Servicios B2B y Suscripciones Corporativas</h2>
            <p className="legal-p">
              Las suscripciones a <strong>Talos Inteligencia</strong> (Planes Consultoría, Federal Ejecutivo 2027 y Enterprise/API) se rigen por contratos de servicio individualizados (SLA). Las métricas avanzadas, predicciones de escenarios y asesoramiento estratégico provistos en dichos informes responden a criterios de debida diligencia metodológica sin implicar garantía de resultados electorales ni comerciales.
            </p>
          </div>

          <div className="legal-card">
            <h2 className="legal-h2">6. Jurisdicción y Ley Aplicable</h2>
            <p className="legal-p">
              Cualquier controversia derivada de la interpretación o ejecución de los presentes términos se regirá por las leyes de la República Argentina, con sumisión expresa a la jurisdicción de los Tribunales Ordinarios en lo Comercial de la Ciudad Autónoma de Buenos Aires, con renuncia a cualquier otro fuero o jurisdicción.
            </p>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1rem" }}>
              Última actualización preliminar: Octubre 2026 · Versión 1.0 (Borrador)
            </div>
          </div>
        </main>

        <Footer categoryLabel="Legal & Términos" />
      </div>
    </>
  );
}
