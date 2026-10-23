"use client";

import { useMemo } from "react";
import { TrendingUp, Calendar, Info } from "lucide-react";

interface WeeklyPoint {
  weekLabel: string;
  citizenScore: number; // -1.0 to 1.0
  votes?: number;
}

interface PulsoHistoricoProps {
  weeklyTrends?: WeeklyPoint[];
  topicName?: string;
}

/**
 * Creates a smooth cubic Bezier SVG path through points
 */
function createSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}

export default function PulsoHistorico({ weeklyTrends = [], topicName = "Actualidad" }: PulsoHistoricoProps) {
  // Normalize points or fallback to default 4 weeks
  const points = useMemo(() => {
    if (weeklyTrends && weeklyTrends.length > 0) return weeklyTrends;
    return [
      { weekLabel: "Hace 3 semanas", citizenScore: 0.0, votes: 24 },
      { weekLabel: "Hace 2 semanas", citizenScore: -0.04, votes: 48 },
      { weekLabel: "Semana anterior", citizenScore: -0.1, votes: 82 },
      { weekLabel: "Semana actual", citizenScore: -0.14, votes: 115 },
    ];
  }, [weeklyTrends]);

  // Wide, high-resolution viewBox for crisp rendering on any screen
  const width = 740;
  const height = 210;
  const padLeft = 65;
  const padRight = 65;
  const padTop = 38;
  const padBottom = 42;

  // Map sentiment (-1.0 to 1.0) to Y coordinate
  const getY = (score: number) => {
    const clamped = Math.max(-1, Math.min(1, score));
    const normalized = (clamped + 1) / 2; // 0 (bottom) to 1 (top)
    const plotHeight = height - padTop - padBottom;
    return height - padBottom - normalized * plotHeight;
  };

  const getX = (index: number) => {
    if (points.length <= 1) return width / 2;
    const plotWidth = width - padLeft - padRight;
    return padLeft + (index / (points.length - 1)) * plotWidth;
  };

  const xyPoints = useMemo(() => {
    return points.map((p, i) => ({
      x: getX(i),
      y: getY(p.citizenScore),
      score: p.citizenScore,
      pct: Math.round(((p.citizenScore + 1) / 2) * 100),
      label: p.weekLabel,
      votes: p.votes || 0,
    }));
  }, [points]);

  const smoothLinePath = useMemo(() => createSmoothPath(xyPoints), [xyPoints]);

  const smoothAreaPath = useMemo(() => {
    if (!xyPoints.length) return "";
    const firstX = xyPoints[0].x.toFixed(1);
    const lastX = xyPoints[xyPoints.length - 1].x.toFixed(1);
    const bottomY = (height - padBottom).toFixed(1);
    return `${smoothLinePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [smoothLinePath, xyPoints]);

  const y100 = getY(1);
  const y75 = getY(0.5);
  const y50 = getY(0);
  const y25 = getY(-0.5);
  const y0 = getY(-1);

  const lastPoint = xyPoints[xyPoints.length - 1];
  const firstPoint = xyPoints[0];
  const isUp = lastPoint.pct >= firstPoint.pct;

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "16px",
        padding: "1.25rem 1.5rem",
        marginTop: "1.25rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* Editorial Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid var(--glass-border)",
          paddingBottom: "0.85rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span
              style={{
                width: "4px",
                height: "14px",
                background: "var(--accent-primary)",
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "var(--accent-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              Serie Temporal · Infografía Talos
            </span>
          </div>

          <h4
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--heading-color)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Evolución del Humor Social sobre {topicName}
          </h4>

          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              margin: "0.2rem 0 0 0",
              lineHeight: 1.4,
            }}
          >
            Índice de aprobación ciudadana semanal en escala de 0 a 100 puntos (50 = Neutro).
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              background: isUp ? "rgba(0,230,118,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${isUp ? "rgba(0,230,118,0.25)" : "rgba(239,68,68,0.25)"}`,
              borderRadius: "100px",
              padding: "0.25rem 0.65rem",
              fontSize: "0.72rem",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 800,
              color: isUp ? "#00e676" : "var(--accent-primary)",
            }}
          >
            <span>{isUp ? "▲" : "▼"}</span>
            <span>{lastPoint.pct}% actual</span>
          </div>
        </div>
      </div>

      {/* SVG Chart with Editorial Polish */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <defs>
            <linearGradient id="editorialAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.14" />
              <stop offset="70%" stopColor="var(--accent-primary)" stopOpacity="0.03" />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
            </linearGradient>

            <filter id="badgeShadow" x="-10%" y="-20%" width="120%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Reference Guideline Hairlines */}
          <line
            x1={padLeft - 10}
            y1={y100}
            x2={width - padRight + 10}
            y2={y100}
            stroke="var(--glass-border)"
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />
          <line
            x1={padLeft - 10}
            y1={y75}
            x2={width - padRight + 10}
            y2={y75}
            stroke="var(--glass-border)"
            strokeWidth="0.6"
            strokeDasharray="2 4"
            opacity="0.6"
          />
          {/* Neutral Baseline (50%) - prominent and clear */}
          <line
            x1={padLeft - 10}
            y1={y50}
            x2={width - padRight + 10}
            y2={y50}
            stroke="var(--glass-border)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <line
            x1={padLeft - 10}
            y1={y25}
            x2={width - padRight + 10}
            y2={y25}
            stroke="var(--glass-border)"
            strokeWidth="0.6"
            strokeDasharray="2 4"
            opacity="0.6"
          />
          <line
            x1={padLeft - 10}
            y1={y0}
            x2={width - padRight + 10}
            y2={y0}
            stroke="var(--glass-border)"
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />

          {/* Left Y-Axis Labels */}
          <text
            x={padLeft - 16}
            y={y100 + 3}
            fill="var(--text-muted)"
            fontSize="9.5"
            fontWeight="600"
            textAnchor="end"
            fontFamily="Inter, sans-serif"
          >
            100%
          </text>
          <text
            x={padLeft - 16}
            y={y50 + 3.5}
            fill="var(--heading-color)"
            fontSize="9.5"
            fontWeight="700"
            textAnchor="end"
            fontFamily="Inter, sans-serif"
          >
            50% (Neutro)
          </text>
          <text
            x={padLeft - 16}
            y={y0 + 3}
            fill="var(--text-muted)"
            fontSize="9.5"
            fontWeight="600"
            textAnchor="end"
            fontFamily="Inter, sans-serif"
          >
            0%
          </text>

          {/* Smooth Gradient Area */}
          <path d={smoothAreaPath} fill="url(#editorialAreaGrad)" />

          {/* Smooth Curve */}
          <path
            d={smoothLinePath}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical Guides and Points */}
          {xyPoints.map((pt, i) => {
            const isLast = i === xyPoints.length - 1;
            return (
              <g key={pt.label}>
                {/* Vertical subtle indicator line */}
                <line
                  x1={pt.x}
                  y1={pt.y + 7}
                  x2={pt.x}
                  y2={height - padBottom}
                  stroke="var(--glass-border)"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                  opacity="0.5"
                />

                {/* Point dot with ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isLast ? "5" : "4"}
                  fill={isLast ? "var(--accent-primary)" : "var(--card-bg)"}
                  stroke="var(--accent-primary)"
                  strokeWidth={isLast ? "2.5" : "2"}
                />

                {/* Value pill / tag above point */}
                <g transform={`translate(${pt.x}, ${pt.y - 14})`}>
                  <rect
                    x={isLast ? "-24" : "-18"}
                    y="-13"
                    width={isLast ? "48" : "36"}
                    height="17"
                    rx="4"
                    fill="var(--card-bg)"
                    stroke={isLast ? "var(--accent-primary)" : "var(--glass-border)"}
                    strokeWidth={isLast ? "1.2" : "0.8"}
                    filter="url(#badgeShadow)"
                  />
                  <text
                    x="0"
                    y="-1"
                    fill={isLast ? "var(--accent-primary)" : "var(--heading-color)"}
                    fontSize="9.5"
                    fontWeight={isLast ? "800" : "700"}
                    textAnchor="middle"
                    fontFamily="Outfit, sans-serif"
                  >
                    {pt.pct}%
                  </text>
                </g>

                {/* Bottom X-Axis Label */}
                <text
                  x={pt.x}
                  y={height - 18}
                  fill={isLast ? "var(--heading-color)" : "var(--text-muted)"}
                  fontSize="10"
                  fontWeight={isLast ? "700" : "500"}
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Editorial Legend & Methodology Footnote */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.85rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--glass-border)",
          fontSize: "0.68rem",
          color: "var(--text-muted)",
          fontFamily: "Inter, sans-serif",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Info size={12} color="var(--accent-primary)" />
          <span>
            Metodología: Votos verificados únicos por dispositivo · Calibración semántica con IA
          </span>
        </div>
        <span style={{ fontWeight: 600, color: "var(--heading-color)" }}>
          Talos Data & Analytics © 2026
        </span>
      </div>
    </div>
  );
}
