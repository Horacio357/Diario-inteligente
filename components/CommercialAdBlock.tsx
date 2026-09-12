"use client";

import { useEffect, useState } from "react";
import { DollarSign, ExternalLink, Sparkles, Megaphone } from "lucide-react";

interface AdItem {
  id: string;
  title?: string;
  imageUrl?: string;
  linkUrl?: string;
  code?: string;
  section?: string;
}

export default function CommercialAdBlock({ section = "global" }: { section?: string }) {
  const [ads, setAds] = useState<AdItem[]>([]);

  useEffect(() => {
    fetch(`/api/ads?section=${encodeURIComponent(section)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.ads && d.ads.length > 0) setAds(d.ads);
      })
      .catch(() => {});
  }, [section]);

  const activeAd = ads.find((a) => a.imageUrl || a.code);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      {activeAd ? (
        <a
          href={activeAd.linkUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "block" }}
        >
          {activeAd.code ? (
            <div dangerouslySetInnerHTML={{ __html: activeAd.code }} />
          ) : (
            <div className="glass-card" style={{
              padding: "0",
              overflow: "hidden",
              border: "1px solid var(--glass-border)",
              position: "relative",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeAd.imageUrl}
                alt={activeAd.title ?? "Publicidad"}
                style={{ width: "100%", display: "block", maxHeight: "280px", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "0.6rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                color: "#fff",
                background: "rgba(0,0,0,0.7)",
                padding: "3px 8px",
                borderRadius: "100px",
                backdropFilter: "blur(4px)",
              }}>
                ANUNCIO SPONSOR
              </div>
            </div>
          )}
        </a>
      ) : (
        <>
          {/* Bloque Publicitario 1 - Espacio Destacado */}
          <div className="glass-card" style={{
            padding: "1.5rem",
            background: "linear-gradient(135deg, rgba(0, 212, 255, 0.04) 0%, rgba(124, 58, 237, 0.04) 100%)",
            border: "1px dashed var(--accent-primary)",
            borderRadius: "16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            minHeight: "220px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "rgba(0, 212, 255, 0.12)",
              border: "1px solid var(--accent-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Megaphone size={20} color="var(--accent-primary)" />
            </div>

            <div>
              <span style={{
                fontSize: "0.62rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 800,
                color: "var(--accent-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                display: "block",
                marginBottom: "0.2rem"
              }}>
                ESPACIO PUBLICITARIO DISPONIBLE
              </span>
              <h3 style={{
                fontFamily: "Merriweather, Georgia, serif",
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "var(--heading-color)",
                lineHeight: 1.2
              }}>
                Anunciá tu Marca en Talos Diario
              </h3>
            </div>

            <p style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              lineHeight: 1.5,
              maxWidth: "280px",
              fontFamily: "Merriweather, Georgia, serif"
            }}>
              Alcanzá a miles de lectores y decisores diarios con banners de alta visibilidad e impacto.
            </p>

            <a
              href="mailto:publicidad@talos.ar?subject=Consulta%20Espacio%20Publicitario"
              className="btn-primary"
              style={{
                fontSize: "0.78rem",
                padding: "0.45rem 1.1rem",
                marginTop: "0.25rem",
                textDecoration: "none"
              }}
            >
              Comprar Espacio Banners <ExternalLink size={12} />
            </a>
          </div>

          {/* Bloque Publicitario 2 - Banner Comercial Secundario */}
          <div className="glass-card" style={{
            padding: "1.25rem",
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.04) 0%, rgba(239, 68, 68, 0.04) 100%)",
            border: "1px dashed rgba(245, 158, 11, 0.4)",
            borderRadius: "16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            minHeight: "150px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sparkles size={14} color="#f59e0b" />
              <span style={{
                fontSize: "0.6rem",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 800,
                color: "#f59e0b",
                textTransform: "uppercase",
                letterSpacing: "0.15em"
              }}>
                SPONSOR EXCLUSIVO TALOS
              </span>
            </div>

            <h4 style={{
              fontFamily: "Merriweather, Georgia, serif",
              fontSize: "0.95rem",
              fontWeight: 800,
              color: "var(--heading-color)"
            }}>
              Banner Comercial 300 x 250
            </h4>

            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              Contacto de Ventas: <b>publicidad@talos.ar</b>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
