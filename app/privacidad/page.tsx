import { ShieldAlert, Lock, ChevronLeft, ArrowRight, Eye, Database, CheckCircle2, UserCheck, KeyRound } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Política de Privacidad y Protección de Datos | Talos Diario",
  description: "Tratamiento de datos personales, cookies, anonimización y derechos de acceso conforme a la Ley Argentina Nº 25.326.",
};

export default function PrivacidadPage() {
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
          background: "var(--navbar-bg)",
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
              <Link href="/terminos" style={{ color: "var(--text-muted)", fontSize: "0.82rem", textDecoration: "none", fontFamily: "Outfit, sans-serif" }}>
                Términos
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
              background: "rgba(0, 230, 118, 0.1)",
              border: "1px solid rgba(0, 230, 118, 0.25)",
              color: "#00e676",
              fontSize: "0.72rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "1rem"
            }}>
              <Lock size={13} /> Ley Nacional Nº 25.326
            </div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 900,
              color: "var(--heading-color)",
              letterSpacing: "-0.02em",
              marginBottom: "0.85rem"
            }}>
              Política de Privacidad y Datos
            </h1>
            <p style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              maxWidth: "650px",
              margin: "0 auto",
              fontFamily: "'Merriweather', Georgia, serif",
              lineHeight: 1.6
            }}>
              Cómo protegemos tu información, qué datos recopilamos y cómo garantizamos el anonimato de las opiniones ciudadanas.
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
                El presente documento es un borrador de política de protección de datos conforme a la Ley de Protección de los Datos Personales Nº 25.326 de la República Argentina y sus disposiciones complementarias ante la Agencia de Acceso a la Información Pública (AAIP).
              </div>
            </div>
          </div>

          {/* Cláusulas */}
          <div className="legal-card">
            <h2 className="legal-h2"><Database size={18} color="var(--accent-primary)" /> 1. Datos que Recopilamos</h2>
            <p className="legal-p">
              En Talos Diario aplicamos un principio estricto de <strong>minimización de datos</strong>. Solo recopilamos los datos estrictamente necesarios para brindar la experiencia de lectura, asegurar el sistema contra manipulación y gestionar solicitudes comerciales:
            </p>
            <ul className="legal-list">
              <li><strong>Formularios de contacto y demos B2B:</strong> Nombre, dirección de correo electrónico institucional, teléfono (opcional) y entidad/organización cuando el usuario solicita una cotización o demostración para <em>Talos Inteligencia</em>.</li>
              <li><strong>Suscripción a Newsletter:</strong> Dirección de correo electrónico voluntariamente provista por el lector para recibir el informe semanal.</li>
              <li><strong>Huella criptográfica anti-bot (voterHash):</strong> En las votaciones de pulso y encuestas participativas ciudadanas, no almacenamos nombres ni direcciones IP completas; se computa un hash criptográfico unidireccional (SHA-256) combinado con salt para evitar la duplicación de votos por bot o granjas de bots, imposibilitando la ingeniería inversa para identificar a la persona física.</li>
            </ul>
          </div>

          <div className="legal-card">
            <h2 className="legal-h2"><Lock size={18} color="var(--accent-primary)" /> 2. No Venta de Información Personal</h2>
            <p className="legal-p">
              <strong>Talos Diario no comercializa, no alquila y no cede datos personales de sus lectores a terceros</strong> bajo ningún concepto. El modelo de negocio se basa exclusivamente en suscripciones a informes analíticos agregados e inteligencia de tendencias para organizaciones e instituciones, nunca en la comercialización de perfiles individuales.
            </p>
          </div>

          <div className="legal-card">
            <h2 className="legal-h2"><Eye size={18} color="var(--accent-primary)" /> 3. Cookies y Almacenamiento Local</h2>
            <p className="legal-p">
              Utilizamos cookies técnicas y almacenamiento local (localStorage) exclusivamente para:
            </p>
            <ul className="legal-list">
              <li>Recordar las preferencias de interfaz (modo noche, modo papel o modo claro).</li>
              <li>Mantener la sesión de redacción y administración interna para usuarios autorizados.</li>
              <li>Métricas agregadas anónimas de visualización de notas para calibrar la agenda temática del diario.</li>
            </ul>
          </div>

          <div className="legal-card">
            <h2 className="legal-h2"><UserCheck size={18} color="var(--accent-primary)" /> 4. Derechos de Acceso, Rectificación y Supresión (Habeas Data)</h2>
            <p className="legal-p">
              De conformidad con el artículo 14 de la Ley Nº 25.326, el titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto.
            </p>
            <p className="legal-p">
              Asimismo, el usuario tiene derecho a solicitar la rectificación, actualización o supresión de sus datos personales de nuestras listas de correo o registros de contacto institucional escribiendo a <a href="mailto:privacidad@talosdiario.ar" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>privacidad@talosdiario.ar</a> con el asunto &ldquo;Ejercicio de Derechos Ley 25.326&rdquo;.
            </p>
            <div style={{
              marginTop: "1.25rem",
              padding: "1rem",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--glass-border)",
              fontSize: "0.82rem",
              color: "var(--text-muted)"
            }}>
              <em>La Agencia de Acceso a la Información Pública (AAIP), Órgano de Control de la Ley Nº 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.</em>
            </div>
          </div>

          <div className="legal-card">
            <h2 className="legal-h2"><KeyRound size={18} color="var(--accent-primary)" /> 5. Seguridad de la Información</h2>
            <p className="legal-p">
              Implementamos protocolos seguros (cifrado SSL/TLS de 256 bits en todas las transmisiones web), almacenamiento restringido en base de datos con acceso controlado por tokens RBAC, y respaldos periódicos con salvaguardas perimetrales para evitar accesos no autorizados o alteraciones indebidas.
            </p>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1rem" }}>
              Última actualización preliminar: Octubre 2026 · Versión 1.0 (Borrador)
            </div>
          </div>
        </main>

        <Footer categoryLabel="Legal & Privacidad" />
      </div>
    </>
  );
}
