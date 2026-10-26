"use client";

import { useEffect, useState } from "react";

interface AdItem {
  id: string;
  title?: string;
  imageUrl?: string;
  linkUrl?: string;
  code?: string;
}

interface AdBannerProps {
  section?: string; // "global" | "politica" | "deportes" | "tecnologia" | "ciencia" | "locales"
  ads?: AdItem[];
  compact?: boolean;
}

const SECTION_LABELS: Record<string, string> = {
  global: "Talos Diario",
  politica: "Sección Política",
  deportes: "Sección Deportes",
  tecnologia: "Sección Tecnología",
  ciencia: "Sección Ciencia",
  locales: "Sección Locales",
};

const SECTION_COLORS: Record<string, string> = {
  global: "#991b1b",
  politica: "#7c3aed",
  deportes: "#059669",
  tecnologia: "#0ea5e9",
  ciencia: "#d97706",
  locales: "#dc2626",
};

export default function AdBanner({ section = "global", ads: propAds, compact }: AdBannerProps) {
  const [fetchedAds, setFetchedAds] = useState<AdItem[]>([]);

  useEffect(() => {
    if (!propAds) {
      fetch(`/api/ads?section=${encodeURIComponent(section)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.ads) setFetchedAds(d.ads);
        })
        .catch(() => {});
    }
  }, [section, propAds]);

  const adsList = propAds ?? fetchedAds;
  const color = SECTION_COLORS[section] ?? "#991b1b";
  const sectionLabel = SECTION_LABELS[section] ?? "Talos Diario";

  // Si hay un aviso real cargado, mostrarlo
  const activeAd = adsList?.find((a) => a.imageUrl || a.code);

  return (
    <div
      style={{
        maxWidth: "1440px",
        margin: "3rem auto",
        padding: "0 1.25rem",
      }}
    >
      {activeAd ? (
        // Aviso real
        <a
          href={activeAd.linkUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "block" }}
        >
          {activeAd.code ? (
            <div dangerouslySetInnerHTML={{ __html: activeAd.code }} />
          ) : activeAd.imageUrl ? (
            <div
              style={{
                width: "100%",
                borderRadius: "14px",
                overflow: "hidden",
                border: `1px solid ${color}30`,
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeAd.imageUrl}
                alt={activeAd.title ?? "Publicidad"}
                style={{ width: "100%", display: "block", maxHeight: "250px", objectFit: "cover" }}
              />
              <span style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                fontSize: "0.55rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                color: "rgba(255,255,255,0.6)",
                background: "rgba(0,0,0,0.6)",
                padding: "2px 6px",
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}>
                Publicidad · {sectionLabel}
              </span>
            </div>
          ) : null}
        </a>
      ) : (
        // Placeholder de aviso vacío
        <div
          style={{
            width: "100%",
            minHeight: compact ? "90px" : "160px",
            background: "var(--card-bg)",
            border: "1px dashed var(--glass-border)",
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Badge de sección */}
          <span
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.55rem",
              fontWeight: 700,
              color: color,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              background: `${color}12`,
              border: `1px solid ${color}25`,
              padding: "0.2rem 0.65rem",
              borderRadius: "100px",
            }}
          >
            {sectionLabel}
          </span>

          <span
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
            }}
          >
            Espacio Publicitario
          </span>

          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.68rem",
              color: "var(--text-muted)",
            }}
          >
            728 × 90 · Contacto:{" "}
            <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>publicidad@talos.ar</span>
          </span>
        </div>
      )}
    </div>
  );
}
