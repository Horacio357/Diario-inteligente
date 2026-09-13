import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Proyecto Talos · Periódico Digital Interactivo";
    const category = searchParams.get("category") || "ARGENTINA";
    const author = searchParams.get("author") || "Redacción Talos";
    const summary = searchParams.get("summary") || "Análisis periodístico, datos de opinión pública e Inteligencia Artificial.";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#060812",
            backgroundImage: "radial-gradient(ellipse 80% 60% at 20% -10%, rgba(124, 58, 237, 0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 110%, rgba(0, 212, 255, 0.2) 0%, transparent 60%)",
            padding: "50px 60px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Header Brand */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#00d4ff",
                  boxShadow: "0 0 12px #00d4ff",
                }}
              />
              <span style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", color: "#ffffff" }}>
                TALOS <span style={{ color: "#00d4ff" }}>DIARIO</span>
              </span>
            </div>

            <div
              style={{
                backgroundColor: "rgba(0, 212, 255, 0.15)",
                border: "1px solid rgba(0, 212, 255, 0.35)",
                borderRadius: "100px",
                padding: "6px 18px",
                color: "#00d4ff",
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {category}
            </div>
          </div>

          {/* Body Title & Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "1050px" }}>
            <div
              style={{
                fontSize: "46px",
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#ffffff",
                letterSpacing: "-1px",
              }}
            >
              {title.length > 90 ? title.slice(0, 90) + "..." : title}
            </div>

            <div style={{ fontSize: "20px", color: "#94a3b8", lineHeight: 1.45 }}>
              {summary.length > 150 ? summary.slice(0, 150) + "..." : summary}
            </div>
          </div>

          {/* Footer Metadata */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              paddingTop: "24px",
            }}
          >
            <span style={{ fontSize: "16px", color: "#64748b" }}>
              Por <strong style={{ color: "#e2e8f0" }}>{author}</strong> · Periodismo Aumentado por IA
            </span>

            <span style={{ fontSize: "16px", color: "#00d4ff", fontWeight: 700 }}>
              talosdiario.ar
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image: ${e.message}`, { status: 500 });
  }
}
