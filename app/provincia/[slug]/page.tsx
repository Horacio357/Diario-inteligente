import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  Lock,
  FileText,
  Activity,
  CheckCircle2,
  Sparkles,
  Share2
} from "lucide-react";
import { PROVINCES_CATALOG, getDetailedProvinceAnalysis } from "@/lib/provincesData";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PROVINCES_CATALOG).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const analysis = getDetailedProvinceAnalysis(slug);
  if (!analysis) {
    return { title: "Provincia no encontrada | Talos Diario" };
  }

  return {
    title: `${analysis.province.name}: Clima Político, Humor Social y Métricas 2027 | Talos Diario`,
    description: `Radiografía de opinión pública y ánimo social en ${analysis.province.name}. Evaluación de la gestión de ${analysis.province.governor}, 6 ejes temáticos territoriales y proyección electoral 2027.`,
    openGraph: {
      title: `${analysis.province.name} · Radiografía de Ánimo Social`,
      description: `Índice de ánimo social y clima político en ${analysis.province.name} auditado por Talos Data Lab.`,
    },
  };
}

export default async function ProvincePage({ params }: PageProps) {
  const { slug } = await params;
  const analysis = getDetailedProvinceAnalysis(slug);

  if (!analysis) {
    notFound();
  }

  const { province, generalScore, generalStatus, nationalRank, vsNationalAverage, totalInteractions, thematicAxes, emotionalBreakdown, localFactors, politicalContext, weeklyTrend } = analysis;

  const generalPct = Math.round(((generalScore + 1) / 2) * 100);
  const statusColor = generalScore > 0.15 ? "#10b981" : generalScore > -0.15 ? "#f59e0b" : "#ef4444";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .prov-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.25rem 5rem 1.25rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text-primary);
        }
        .prov-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .b2b-cta-card {
          background: linear-gradient(135deg, var(--card-bg) 0%, rgba(153, 27, 27, 0.04) 100%);
          border: 2px solid var(--accent-primary);
          border-radius: 16px;
          padding: 2.25rem;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        [data-theme="cyberpunk"] .b2b-cta-card {
          background: linear-gradient(135deg, rgba(13, 21, 40, 0.8) 0%, rgba(0, 212, 255, 0.06) 100%);
          border-color: rgba(0, 212, 255, 0.4);
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
          padding: "0.85rem 1.25rem",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
              <ChevronLeft size={16} /> Volver a Portada Nacional
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <Link href="/metodologia" style={{ color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none", fontFamily: "Outfit, sans-serif" }}>
                Metodología
              </Link>
              <Link
                href={`/inteligencia?provincia=${encodeURIComponent(province.name)}#solicitar-demo`}
                style={{
                  background: "var(--accent-primary)",
                  color: "#ffffff",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  textDecoration: "none",
                  fontFamily: "Outfit, sans-serif",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}
              >
                Informe Provincial 2027 <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </header>

        <main className="prov-container">
          {/* Breadcrumb & Región */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "0.7rem",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              padding: "0.25rem 0.65rem",
              borderRadius: "100px",
              background: "var(--glass-hover)",
              border: "1px solid var(--card-border)",
              color: "var(--accent-primary)",
            }}>
              Región {province.region}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
              · Jurisdicción {nationalRank} de 24 · Actualización Continua 2026
            </span>
          </div>

          {/* Hero Provincial */}
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(2rem, 4vw, 2.85rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "var(--heading-color)",
              margin: "0 0 0.5rem 0",
            }}>
              {province.name}
            </h1>
            <p style={{
              fontFamily: "Merriweather, Georgia, serif",
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: "850px",
              margin: 0,
            }}>
              {province.description}
            </p>

            {/* Fila de Datos Clave de la Jurisdicción */}
            <div style={{
              display: "flex",
              gap: "1.5rem",
              marginTop: "1.25rem",
              flexWrap: "wrap",
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
              borderTop: "1px solid var(--glass-border)",
              paddingTop: "1rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Building2 size={15} color="var(--accent-primary)" />
                <span>Gobernador: <strong style={{ color: "var(--heading-color)" }}>{province.governor}</strong> ({province.governorParty})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <MapPin size={15} color="var(--accent-primary)" />
                <span>Capital: <strong style={{ color: "var(--heading-color)" }}>{province.capital}</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Users size={15} color="var(--accent-primary)" />
                <span>Población: <strong style={{ color: "var(--heading-color)" }}>{province.population}</strong></span>
              </div>
            </div>
          </div>

          {/* Tarjetas de Métricas de Resumen */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}>
            {/* Card 1: Índice de Ánimo Social */}
            <div className="prov-card" style={{ borderLeft: `4px solid ${statusColor}` }}>
              <div style={{ fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
                Índice de Ánimo Social
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "Outfit, sans-serif", color: statusColor }}>
                  {generalPct}%
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: statusColor, fontFamily: "Outfit, sans-serif" }}>
                  {generalStatus}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Score analítico: {generalScore > 0 ? `+${generalScore}` : generalScore} (escala -1 a +1)
              </div>
            </div>

            {/* Card 2: Posición Nacional */}
            <div className="prov-card">
              <div style={{ fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
                Posición Federal
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)" }}>
                  #{nationalRank}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "Outfit, sans-serif" }}>
                  de 24 provincias
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: vsNationalAverage >= 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                {vsNationalAverage >= 0 ? `+${vsNationalAverage}` : vsNationalAverage} pts vs promedio nacional
              </div>
            </div>

            {/* Card 3: Muestreo e Interacciones */}
            <div className="prov-card">
              <div style={{ fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
                Señales Territoriales Auditadas
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "Outfit, sans-serif", color: "var(--heading-color)" }}>
                  {totalInteractions.toLocaleString("es-AR")}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                65% Medios locales + 35% Votaciones ciudadanas
              </div>
            </div>
          </div>

          {/* Grilla Principal de 2 Columnas */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}>
            {/* ─── COLUMNA 1: LOS 6 EJES TEMÁTICOS PROVINCIALES ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "var(--heading-color)",
                  margin: 0,
                }}>
                  📊 Desglose en 6 Ejes Temáticos
                </h2>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
                  Evaluación local
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {thematicAxes.map((axis) => {
                  const axisColor = axis.score > 0.15 ? "#10b981" : axis.score > -0.15 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={axis.axisId} className="prov-card" style={{ padding: "1.15rem 1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--heading-color)" }}>
                          {axis.name}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "0.95rem", color: axisColor }}>
                            {axis.percentagePositive}%
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            ({axis.nationalComparison >= 0 ? `+${axis.nationalComparison}` : axis.nationalComparison} pts vs nac.)
                          </span>
                        </div>
                      </div>

                      {/* Barra de Progreso */}
                      <div style={{
                        width: "100%",
                        height: "7px",
                        background: "var(--glass-border)",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginBottom: "0.6rem",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${axis.percentagePositive}%`,
                          background: axisColor,
                          borderRadius: "4px",
                        }} />
                      </div>

                      <p style={{
                        fontSize: "0.78rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.45,
                        margin: 0,
                        fontFamily: "Inter, sans-serif",
                      }}>
                        {axis.keyTakeaway}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── COLUMNA 2: ESPECTRO EMOCIONAL & FACTORES LOCALES ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Espectro Emocional */}
              <div className="prov-card">
                <h3 style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "var(--heading-color)",
                  marginBottom: "1rem",
                }}>
                  🧠 Espectro Emocional Colectivo
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { label: "Esperanza", value: emotionalBreakdown.esperanza, color: "#10b981" },
                    { label: "Orgullo Regional", value: emotionalBreakdown.orgullo, color: "#3b82f6" },
                    { label: "Fatiga / Desgaste", value: emotionalBreakdown.fatiga, color: "#a855f7" },
                    { label: "Bronca / Enojo", value: emotionalBreakdown.bronca, color: "#f97316" },
                    { label: "Incertidumbre / Miedo", value: emotionalBreakdown.miedo, color: "#ef4444" },
                  ].map((emo) => (
                    <div key={emo.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.25rem" }}>
                        <span style={{ color: "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}>{emo.label}</span>
                        <strong style={{ color: emo.color, fontFamily: "Outfit, sans-serif" }}>{emo.value}%</strong>
                      </div>
                      <div style={{ width: "100%", height: "6px", background: "var(--glass-border)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${emo.value}%`, background: emo.color, borderRadius: "3px" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factores Territoriales Clave */}
              <div className="prov-card">
                <h3 style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "var(--heading-color)",
                  marginBottom: "1rem",
                }}>
                  📍 Factores Locales Determinantes
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {localFactors.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.82rem", lineHeight: 1.5, color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-primary)", fontWeight: 800 }}>•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contexto Político-Electoral 2027 */}
              <div className="prov-card" style={{ background: "var(--glass-hover)", borderLeft: "3px solid var(--accent-primary)" }}>
                <div style={{ fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>
                  Escenario Electoral & Coyuntura 2027
                </div>
                <p style={{
                  fontSize: "0.82rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.55,
                  margin: 0,
                  fontFamily: "Merriweather, Georgia, serif",
                }}>
                  {politicalContext}
                </p>
              </div>

              {/* Evolución de 4 Semanas */}
              <div className="prov-card">
                <div style={{ fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.65rem" }}>
                  Tendencia Últimas 4 Semanas
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {weeklyTrend.map((w, idx) => {
                    const wPct = Math.round(((w.score + 1) / 2) * 100);
                    const isLast = idx === weeklyTrend.length - 1;
                    return (
                      <div key={w.weekLabel} style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", color: isLast ? "var(--accent-primary)" : "var(--heading-color)" }}>
                          {wPct}%
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
                          {w.weekLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ─── BLOQUE FREEMIUM / PUENTE B2B PARA GOBIERNOS Y CONSULTORAS ─── */}
          <div className="b2b-cta-card">
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", justifyContent: "space-between" }}>
              <div style={{ maxWidth: "720px" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "100px",
                  background: "rgba(153, 27, 27, 0.1)",
                  border: "1px solid var(--accent-primary)",
                  color: "var(--accent-primary)",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  fontFamily: "Outfit, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: "0.85rem",
                }}>
                  <Sparkles size={12} /> Solución B2B para Gobiernos y Consultoría Política
                </div>

                <h2 style={{
                  fontFamily: "Merriweather, Georgia, serif",
                  fontSize: "clamp(1.25rem, 2.8vw, 1.65rem)",
                  fontWeight: 900,
                  color: "var(--heading-color)",
                  marginBottom: "0.65rem",
                  lineHeight: 1.3,
                }}>
                  ¿Necesitás el informe semanal confidencial de {province.name}?
                </h2>

                <p style={{
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "1.25rem",
                  fontFamily: "Inter, sans-serif",
                }}>
                  Proveemos a ministros provinciales, intendentes, legisladores y consultoras de campaña con datos desagregados por municipio, micro-argumentos ciudadanos geolocalizados, cruces electorales 2027 y alertas de anomalía tempranas vía bot o API privada.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.6rem", marginBottom: "1.5rem" }}>
                  {[
                    "Desglose por municipios y comunas",
                    "Alertas tempranas de crisis temática",
                    "Cruce con padrón e intención de voto 2027",
                    "Informe ejecutivo en PDF los lunes a las 7 AM",
                  ].map((feat) => (
                    <div key={feat} style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.8rem", color: "var(--heading-color)", fontFamily: "Inter, sans-serif" }}>
                      <CheckCircle2 size={14} color="#10b981" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                minWidth: "220px",
                alignSelf: "center",
              }}>
                <Link
                  href={`/inteligencia?provincia=${encodeURIComponent(province.name)}#solicitar-demo`}
                  style={{
                    background: "var(--accent-primary)",
                    color: "#ffffff",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "10px",
                    fontWeight: 800,
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "0.88rem",
                    textDecoration: "none",
                    textAlign: "center",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>Solicitar Informe 2027</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/metodologia"
                  style={{
                    background: "var(--glass-hover)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-secondary)",
                    padding: "0.65rem 1.25rem",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Auditoría y Fuentes
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer categoryLabel={province.name} />
      </div>
    </>
  );
}
