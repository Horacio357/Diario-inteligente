"use client";

import { useEffect, useState } from "react";
import { Megaphone, Award, Sparkles } from "lucide-react";

interface SponsorItem {
  id: string;
  name: string;
  logoUrl?: string;
  message?: string;
  linkUrl?: string;
}

const DEFAULT_SPONSORS: SponsorItem[] = [
  { id: "1", name: "Mercado Pago", message: "⚡ Pagá en cuotas con Mercado Pago y disfrutá de beneficios exclusivos." },
  { id: "2", name: "Proyecto Talos", message: "✦ Espacio para patrocinadores e institucionales. Contacto: publicidad@talos.ar" },
  { id: "3", name: "Cerveza Quilmes", message: "⚽ Sponsor Oficial del Fútbol Argentino y del Pulso Nacional." },
  { id: "4", name: "BBVA Argentina", message: "🏦 Sumá puntos con tus consumos e invirtió con asesoramiento IA." },
];

export default function SponsorTickerBar() {
  const [sponsors, setSponsors] = useState<SponsorItem[]>(DEFAULT_SPONSORS);

  useEffect(() => {
    fetch("/api/ads")
      .then(r => r.json())
      .then(data => {
        if (data.ads && data.ads.length > 0) {
          const mapped: SponsorItem[] = data.ads
            .filter((ad: any) => ad.active)
            .map((ad: any) => ({
              id: ad.id,
              name: ad.title || "Patrocinador",
              logoUrl: ad.imageUrl,
              message: ad.code || ad.title || "Espacio patrocinado",
              linkUrl: ad.linkUrl,
            }));
          if (mapped.length > 0) {
            setSponsors([...DEFAULT_SPONSORS, ...mapped]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const doubled = [...sponsors, ...sponsors];

  return (
    <div style={{
      background: "var(--card-bg)",
      borderTop: "1px solid var(--glass-border)",
      borderBottom: "1px solid var(--glass-border)",
      padding: "0.6rem 0",
      overflow: "hidden",
      position: "relative",
      marginTop: "2rem",
    }}>
      {/* Gradientes laterales */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "80px",
        background: "linear-gradient(90deg, var(--card-bg), transparent)",
        zIndex: 10, pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "80px",
        background: "linear-gradient(270deg, var(--card-bg), transparent)",
        zIndex: 10, pointerEvents: "none"
      }} />

      {/* Badge Admin / Sponsors */}
      <div style={{
        position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)",
        display: "flex", alignItems: "center", gap: "0.4rem",
        zIndex: 20, background: "var(--card-bg)", paddingRight: "0.75rem",
      }}>
        <Award size={12} color="var(--accent-primary)" />
        <span style={{
          fontSize: "0.65rem", fontWeight: 800, color: "var(--accent-primary)",
          fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: "0.15em"
        }}>
          Sponsors & Anuncios
        </span>
      </div>

      {/* Ticker marquee */}
      <div
        className="news-ticker-content"
        style={{
          paddingLeft: "170px",
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        {doubled.map((sp, i) => (
          <a
            key={`${sp.id}-${i}`}
            href={sp.linkUrl || "#"}
            target={sp.linkUrl ? "_blank" : "_self"}
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              textDecoration: "none",
              color: "var(--text-primary)",
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {sp.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sp.logoUrl} alt={sp.name} style={{ height: "20px", objectFit: "contain", borderRadius: "3px" }} />
            ) : (
              <span style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid var(--accent-primary)",
                color: "var(--accent-primary)",
                fontSize: "0.6rem",
                fontWeight: 800,
                padding: "0.15rem 0.45rem",
                borderRadius: "4px",
                fontFamily: "Outfit, sans-serif",
                textTransform: "uppercase",
              }}>
                {sp.name}
              </span>
            )}
            <span style={{ fontFamily: "Inter, sans-serif", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
              {sp.message}
            </span>
            <span style={{ color: "var(--glass-border)", marginLeft: "1rem" }}>│</span>
          </a>
        ))}
      </div>
    </div>
  );
}
