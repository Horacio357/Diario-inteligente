"use client";

import { useState, useEffect } from "react";
import { Vote, ThumbsUp, ThumbsDown, Minus, CheckCircle, Clock, Sparkles, MapPin, AlertCircle, MessageSquare, Share2, Copy, Check, TrendingUp, FileText, Download } from "lucide-react";
import PulsoHistorico from "./PulsoHistorico";
import MethodologyModal from "./MethodologyModal";

interface CitizenStats {
  totalVotes: number;
  positiveVotes: number;
  neutralVotes: number;
  negativeVotes: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  citizenSentiment: number;
}

interface UserStatus {
  hasVoted: boolean;
  votedSentiment: number | null;
  nextVoteDate: string | null;
}

const TOPICS = [
  { id: "general", label: "Humor General", emoji: "🇦🇷" },
  { id: "economia", label: "Economía", emoji: "📈" },
  { id: "politica", label: "Política", emoji: "🏛️" },
  { id: "seguridad", label: "Seguridad", emoji: "🛡️" },
  { id: "sociedad", label: "Sociedad", emoji: "👥" },
];

const PROVINCES = [
  { id: "", label: "Toda la Argentina" },
  { id: "buenos-aires-ciudad", label: "CABA" },
  { id: "buenos-aires", label: "Buenos Aires" },
  { id: "cordoba", label: "Córdoba" },
  { id: "santa-fe", label: "Santa Fe" },
  { id: "mendoza", label: "Mendoza" },
  { id: "tucuman", label: "Tucumán" },
  { id: "entre-rios", label: "Entre Ríos" },
  { id: "salta", label: "Salta" },
  { id: "neuquen", label: "Neuquén" },
];

interface CitizenOpinionBoxProps {
  onVoteSubmitted?: () => void;
  activeTopic?: string;
  isModal?: boolean;
}

export default function CitizenOpinionBox({ onVoteSubmitted, activeTopic, isModal }: CitizenOpinionBoxProps) {
  const [selectedTopic, setSelectedTopic] = useState(activeTopic || "general");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [stats, setStats] = useState<CitizenStats | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus>({ hasVoted: false, votedSentiment: null, nextVoteDate: null });
  const [reasonInput, setReasonInput] = useState("");
  const [recentReasons, setRecentReasons] = useState<any[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<any[]>([]);
  const [showTrends, setShowTrends] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Sync with activeTopic prop if provided
  useEffect(() => {
    if (activeTopic) {
      const match = TOPICS.find(t => t.id === activeTopic.toLowerCase() || t.label.toLowerCase() === activeTopic.toLowerCase());
      if (match) setSelectedTopic(match.id);
    }
  }, [activeTopic]);

  // Fetch stats and user voting status for selected topic
  const loadStats = async (topicId: string, provId?: string) => {
    setLoading(true);
    try {
      const provParam = provId ? `&provinceId=${encodeURIComponent(provId)}` : "";
      const res = await fetch(`/api/opinions?topic=${encodeURIComponent(topicId)}${provParam}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUserStatus(data.userStatus);
        if (data.recentReasons) setRecentReasons(data.recentReasons);
        if (data.weeklyTrends) setWeeklyTrends(data.weeklyTrends);
      }
    } catch (e) {
      console.error("Error loading opinion stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats(selectedTopic, selectedProvince);
  }, [selectedTopic, selectedProvince]);

  const handleVote = async (sentiment: number) => {
    if (submitting || userStatus.hasVoted) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/opinions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          category: selectedTopic,
          provinceId: selectedProvince || undefined,
          sentiment,
          reason: reasonInput.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStats(data.stats);
        setUserStatus(data.userStatus);
        setReasonInput("");
        setFeedback({
          message: "¡Voto registrado! Tu opinión ha calibrado el Mapa de Calor.",
          type: "success",
        });
        loadStats(selectedTopic, selectedProvince);
        if (onVoteSubmitted) {
          onVoteSubmitted();
        }
      } else {
        setFeedback({
          message: data.error || "No se pudo registrar el voto.",
          type: "error",
        });
        if (data.hasVoted) {
          setUserStatus({
            hasVoted: true,
            votedSentiment: data.votedSentiment,
            nextVoteDate: data.nextVoteDate,
          });
        }
      }
    } catch {
      setFeedback({
        message: "Error de conexión. Por favor reintentá en unos segundos.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatNextDate = (isoDate: string | null) => {
    if (!isoDate) return "";
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  return (
    <div
      className={isModal ? "" : "glass-card"}
      style={{
        padding: isModal ? "1.5rem" : "1.5rem",
        borderRadius: isModal ? "0px" : "16px",
        background: isModal ? "transparent" : "var(--card-bg)",
        border: isModal ? "none" : "1px solid var(--glass-border)",
        boxShadow: isModal ? "none" : "0 8px 32px rgba(0,0,0,0.12)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background ambient accent */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1rem",
        flexWrap: "wrap",
        gap: "0.5rem",
        paddingRight: isModal ? "2.5rem" : 0,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.25rem" }}>
            <Vote size={15} color="var(--accent-primary)" />
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "var(--accent-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              Termómetro de Lectores
            </span>
          </div>
          <h3
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "var(--heading-color)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Tu Percepción Ciudadana
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem", margin: 0 }}>
            Como medio independiente, medimos la voz de la gente y la contrastamos con las noticias.
          </p>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "0.62rem",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            color: "var(--accent-primary)",
            background: "rgba(0,212,255,0.08)",
            border: "1px solid var(--accent-primary)",
            padding: "0.2rem 0.6rem",
            borderRadius: "100px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <Sparkles size={11} /> 1 voto semanal
        </span>
      </div>

      {/* Topic selector pills */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {TOPICS.map(t => {
          const isSelected = selectedTopic === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              style={{
                border: isSelected ? "1px solid var(--accent-primary)" : "1px solid var(--glass-border)",
                background: isSelected ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.03)",
                color: isSelected ? "var(--accent-primary)" : "var(--text-secondary)",
                padding: "0.35rem 0.75rem",
                borderRadius: "100px",
                fontSize: "0.75rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: isSelected ? 700 : 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.2s ease",
              }}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          );
        })}
      </div>

      {/* Province selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <MapPin size={13} color="var(--text-muted)" />
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
          Provincia:
        </span>
        <select
          value={selectedProvince}
          onChange={e => setSelectedProvince(e.target.value)}
          style={{
            background: "var(--primary-900)",
            color: "var(--heading-color)",
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            padding: "0.25rem 0.5rem",
            fontSize: "0.75rem",
            fontFamily: "Inter, sans-serif",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {PROVINCES.map(p => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Voting Buttons (Active or Already Voted) */}
      {!userStatus.hasVoted ? (
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--heading-color)", marginBottom: "0.6rem" }}>
            ¿Cómo percibís este tema actualmente?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
            {/* Positivo */}
            <button
              onClick={() => handleVote(1)}
              disabled={submitting}
              style={{
                border: "1px solid rgba(0,230,118,0.3)",
                background: "rgba(0,230,118,0.06)",
                color: "#00e676",
                padding: "0.75rem 0.5rem",
                borderRadius: "12px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: submitting ? "wait" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,230,118,0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,230,118,0.06)")}
            >
              <ThumbsUp size={18} />
              <span>Favorable</span>
              <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>+1 Positivo</span>
            </button>

            {/* Neutro */}
            <button
              onClick={() => handleVote(0)}
              disabled={submitting}
              style={{
                border: "1px solid rgba(255,196,0,0.3)",
                background: "rgba(255,196,0,0.06)",
                color: "#ffc400",
                padding: "0.75rem 0.5rem",
                borderRadius: "12px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: submitting ? "wait" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,196,0,0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,196,0,0.06)")}
            >
              <Minus size={18} />
              <span>Neutro</span>
              <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>0 Expectante</span>
            </button>

            {/* Negativo */}
            <button
              onClick={() => handleVote(-1)}
              disabled={submitting}
              style={{
                border: "1px solid rgba(255,23,68,0.3)",
                background: "rgba(255,23,68,0.06)",
                color: "#ff1744",
                padding: "0.75rem 0.5rem",
                borderRadius: "12px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: submitting ? "wait" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,23,68,0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,23,68,0.06)")}
            >
              <ThumbsDown size={18} />
              <span>Desfavorable</span>
              <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>-1 Crítico</span>
            </button>
          </div>

          {/* Micro-argumento opcional */}
          <div style={{ marginTop: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <MessageSquare size={12} color="var(--accent-primary)" />
                <span>¿Por qué votás así? (Opcional)</span>
              </label>
              <span style={{ fontSize: "0.65rem", color: reasonInput.length > 120 ? "#ffc400" : "var(--text-muted)" }}>
                {reasonInput.length}/140
              </span>
            </div>
            <input
              type="text"
              maxLength={140}
              placeholder="Ej: Medidas económicas correctas / Preocupación por salarios..."
              value={reasonInput}
              onChange={e => setReasonInput(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                padding: "0.55rem 0.75rem",
                color: "var(--heading-color)",
                fontSize: "0.78rem",
                fontFamily: "Inter, sans-serif",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--accent-primary)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--glass-border)")}
            />
          </div>
        </div>
      ) : (
        /* Status when user already voted */
        <div
          style={{
            background: "rgba(0,212,255,0.05)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={16} color="#00e676" />
            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--heading-color)" }}>
                Tu voto semanal fue registrado
              </span>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                Votaste:{" "}
                <strong style={{ color: userStatus.votedSentiment === 1 ? "#00e676" : userStatus.votedSentiment === -1 ? "#ff1744" : "#ffc400" }}>
                  {userStatus.votedSentiment === 1 ? "Favorable (+)" : userStatus.votedSentiment === -1 ? "Desfavorable (−)" : "Neutro (=)"}
                </strong>
              </div>
            </div>
          </div>
          {userStatus.nextVoteDate && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.68rem", color: "var(--text-muted)" }}>
              <Clock size={12} />
              <span>Renovación: {formatNextDate(userStatus.nextVoteDate)}</span>
            </div>
          )}
        </div>
      )}

      {/* Feedback banner */}
      {feedback && (
        <div
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: feedback.type === "success" ? "rgba(0,230,118,0.12)" : "rgba(255,23,68,0.12)",
            color: feedback.type === "success" ? "#00e676" : "#ff1744",
            border: `1px solid ${feedback.type === "success" ? "rgba(0,230,118,0.3)" : "rgba(255,23,68,0.3)"}`,
          }}
        >
          {feedback.type === "success" ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Community Results Progress Bars */}
      <div style={{ marginTop: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--heading-color)", fontFamily: "Outfit, sans-serif" }}>
            Voz de la Comunidad esta semana
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
            {stats?.totalVotes ?? 0} votos
          </span>
        </div>

        {/* Progress Bar composite */}
        <div
          style={{
            height: "10px",
            background: "rgba(128,128,128,0.15)",
            borderRadius: "5px",
            overflow: "hidden",
            display: "flex",
            marginBottom: "0.6rem",
          }}
        >
          {stats && stats.totalVotes > 0 ? (
            <>
              <div
                style={{
                  width: `${stats.positivePct}%`,
                  background: "#00e676",
                  transition: "width 0.8s ease",
                }}
                title={`Favorable: ${stats.positivePct}%`}
              />
              <div
                style={{
                  width: `${stats.neutralPct}%`,
                  background: "#ffc400",
                  transition: "width 0.8s ease",
                }}
                title={`Neutro: ${stats.neutralPct}%`}
              />
              <div
                style={{
                  width: `${stats.negativePct}%`,
                  background: "#ff1744",
                  transition: "width 0.8s ease",
                }}
                title={`Desfavorable: ${stats.negativePct}%`}
              />
            </>
          ) : (
            <div style={{ width: "100%", background: "rgba(128,128,128,0.2)" }} />
          )}
        </div>

        {/* Breakdown percentages */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#00e676" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00e676" }} />
            <span>Favorable {stats?.positivePct ?? 0}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#ffc400" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ffc400" }} />
            <span>Neutro {stats?.neutralPct ?? 0}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#ff1744" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff1744" }} />
            <span>Crítico {stats?.negativePct ?? 0}%</span>
          </div>
        </div>

        {/* Social Share Bar */}
        <div style={{
          marginTop: "1rem",
          padding: "0.6rem 0.8rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--glass-border)",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "var(--heading-color)", fontWeight: 700 }}>
            <Share2 size={13} color="var(--accent-primary)" />
            <span>Compartir resultado:</span>
          </div>

          <div style={{ display: "flex", gap: "0.35rem" }}>
            {/* WhatsApp */}
            <button
              onClick={() => {
                const topicName = TOPICS.find(t => t.id === selectedTopic)?.label || "Actualidad";
                const text = `📊 Termómetro Social sobre ${topicName} en Talos Diario:\n• Favorable: ${stats?.positivePct ?? 0}%\n• Neutro: ${stats?.neutralPct ?? 0}%\n• Crítico: ${stats?.negativePct ?? 0}%\n¿Qué opinás vos? Votá tu postura en: ${typeof window !== "undefined" ? window.location.origin : "https://talosdiario.ar"}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
              }}
              title="Compartir en WhatsApp"
              style={{
                background: "rgba(37,211,102,0.1)",
                border: "1px solid rgba(37,211,102,0.3)",
                color: "#25d366",
                borderRadius: "6px",
                padding: "0.25rem 0.55rem",
                fontSize: "0.68rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              WhatsApp
            </button>

            {/* X / Twitter */}
            <button
              onClick={() => {
                const topicName = TOPICS.find(t => t.id === selectedTopic)?.label || "Actualidad";
                const text = `Humor social sobre ${topicName} en @TalosDiario: ${stats?.positivePct ?? 0}% Favorable vs ${stats?.negativePct ?? 0}% Crítico. Votá tu postura y calibrá el mapa:`;
                const url = typeof window !== "undefined" ? window.location.origin : "https://talosdiario.ar";
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
              }}
              title="Compartir en X"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#ffffff",
                borderRadius: "6px",
                padding: "0.25rem 0.55rem",
                fontSize: "0.68rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              X / Twitter
            </button>

            {/* Copiar enlace */}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.origin);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }
              }}
              title="Copiar enlace"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.25)",
                color: "var(--accent-primary)",
                borderRadius: "6px",
                padding: "0.25rem 0.55rem",
                fontSize: "0.68rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              {copiedLink ? <Check size={11} color="#00e676" /> : <Copy size={11} />}
              <span>{copiedLink ? "¡Copiado!" : "Copiar"}</span>
            </button>

            {/* Informe Metodológico y Fuentes en PDF */}
            <button
              onClick={() => setShowMethodology(true)}
              title="Descargar informe metodológico y datos en PDF"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.25)",
                color: "var(--accent-primary)",
                borderRadius: "6px",
                padding: "0.25rem 0.55rem",
                fontSize: "0.68rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <FileText size={11} color="var(--accent-primary)" />
              <span>Informe PDF</span>
            </button>
          </div>
        </div>

        {/* Toggle Histórico de 4 semanas */}
        <div style={{ marginTop: "0.75rem" }}>
          <button
            onClick={() => setShowTrends(prev => !prev)}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px dashed var(--glass-border)",
              color: "var(--heading-color)",
              borderRadius: "8px",
              padding: "0.45rem 0.75rem",
              fontSize: "0.72rem",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent-primary)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--glass-border)")}
          >
            <TrendingUp size={13} color="var(--accent-primary)" />
            <span>{showTrends ? "Ocultar Línea de Tiempo" : "Ver Evolución Histórica (4 Semanas)"}</span>
          </button>

          {showTrends && (
            <PulsoHistorico
              weeklyTrends={weeklyTrends}
              topicName={TOPICS.find(t => t.id === selectedTopic)?.label || "Actualidad"}
            />
          )}
        </div>

        {/* Motivos destacados de los lectores */}
        {recentReasons && recentReasons.length > 0 && (
          <div style={{ marginTop: "0.85rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
              💬 Motivos de los lectores ({recentReasons.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", maxHeight: "150px", overflowY: "auto" }}>
              {recentReasons.map((r: any) => {
                const isPos = r.sentiment === 1;
                const isNeg = r.sentiment === -1;
                const color = isPos ? "#00e676" : isNeg ? "#ff1744" : "#ffc400";
                return (
                  <div
                    key={r.id}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--glass-border)",
                      borderLeft: `3px solid ${color}`,
                      padding: "0.4rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.74rem",
                      color: "var(--heading-color)",
                      lineHeight: 1.35,
                    }}
                  >
                    "{r.reason}"
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Calibration note footer */}
      <div
        style={{
          marginTop: "1rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--glass-border)",
          fontSize: "0.68rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.4rem",
        }}
      >
        <button
          type="button"
          onClick={() => setShowMethodology(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.68rem",
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: 0,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <span>⚡ Calibra el 35% del Mapa Territorial ·</span>
          <span style={{ textDecoration: "underline", color: "var(--accent-primary)" }}>¿Cómo se calcula este índice?</span>
        </button>
        <button
          type="button"
          onClick={() => setShowMethodology(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.68rem",
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          Auditoría y Fuentes
        </button>
      </div>

      {/* MODAL DE METODOLOGÍA */}
      <MethodologyModal
        isOpen={showMethodology}
        onClose={() => setShowMethodology(false)}
        pdfData={{
          topic: selectedTopic,
          topicLabel: TOPICS.find(t => t.id === selectedTopic)?.label || "Actualidad",
          citizenSentiment: stats?.citizenSentiment ?? 0,
          mediaSentiment: 0.08,
          divergence: stats ? Math.round((stats.citizenSentiment - 0.08) * 100) : 0,
          divergenceLabel: stats && stats.citizenSentiment > 0.2
            ? "Lectores más optimistas que los medios"
            : stats && stats.citizenSentiment < -0.2
            ? "Lectores más críticos que los medios"
            : "En sincronía con la agenda informativa",
          totalCitizenVotes: stats?.totalVotes ?? 0,
          positivePct: stats?.positivePct ?? 0,
          neutralPct: stats?.neutralPct ?? 0,
          negativePct: stats?.negativePct ?? 0,
          recentReasons: recentReasons,
        }}
      />
    </div>
  );
}
