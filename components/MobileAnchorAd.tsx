"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface AdItem {
  id: string;
  title?: string;
  imageUrl?: string;
  linkUrl?: string;
  code?: string;
}

export default function MobileAnchorAd({ section = "global" }: { section?: string }) {
  const [ad, setAd] = useState<AdItem | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    fetch(`/api/ads?position=mobile_anchor&section=${encodeURIComponent(section)}`)
      .then(r => r.json())
      .then(d => {
        if (d?.ads && d.ads.length > 0) {
          setAd(d.ads[0]);
        }
      })
      .catch(() => {});
  }, [section]);

  if (closed || !ad) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9990,
      background: "rgba(6, 8, 18, 0.96)",
      backdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(0, 212, 255, 0.25)",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.6)",
      padding: "0.5rem 1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        maxWidth: "500px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
      }}>
        {ad.code ? (
          <div style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: ad.code }} />
        ) : (
          <a
            href={ad.linkUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flex: 1,
              overflow: "hidden",
            }}
          >
            {ad.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ad.imageUrl}
                alt={ad.title ?? "Aviso"}
                style={{
                  width: "50px",
                  height: "36px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ overflow: "hidden" }}>
              <span style={{
                display: "block",
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.55rem",
                fontWeight: 700,
                color: "#00d4ff",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}>
                Patrocinado
              </span>
              <span style={{
                display: "block",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {ad.title ?? "Promoción Especial"}
              </span>
            </div>
          </a>
        )}

        <button
          onClick={() => setClosed(true)}
          aria-label="Cerrar publicidad"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255,255,255,0.7)",
            flexShrink: 0,
          }}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
