import { PrismaClient } from "@/lib/generated/prisma";
import InteractiveContent from "./InteractiveContent";
import Footer from "@/components/Footer";
import TalosNavbar from "@/app/TalosNavbar";
import NewsTickerBar from "@/components/NewsTickerBar";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";
import MobileAnchorAd from "@/components/MobileAnchorAd";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const prisma = new PrismaClient();

// ─── DYNAMIC OPENGRAPH & SEO METADATA ───
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) {
    return {
      title: "Noticia no encontrada · Talos Diario",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://talosdiario.ar";
  const articleUrl = `${siteUrl}/noticias/${article.slug}`;

  // If article has no custom image, use our dynamic OG image generator route
  const ogImageUrl = article.imageUrl
    ? article.imageUrl
    : `${siteUrl}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}&summary=${encodeURIComponent(article.summary)}`;

  return {
    title: `${article.title} · Talos Diario`,
    description: article.summary,
    keywords: [article.category, "Argentina", "Noticias", "Inteligencia Artificial", "Periodismo Aumentado", article.author || "Redacción Talos"],
    authors: [{ name: article.author || "Redacción Talos" }],
    openGraph: {
      title: article.title,
      description: article.summary,
      url: articleUrl,
      siteName: "Talos Diario",
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author || "Redacción Talos"],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [ogImageUrl],
      site: "@TalosDiario",
    },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) {
    notFound();
  }

  const articleUrl = `https://talosdiario.ar/noticias/${article.slug}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* NAVBAR & TICKER */}
      <TalosNavbar activeSection={article.category.toLowerCase()} />
      <NewsTickerBar />

      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        
        {/* Cabecera del Artículo */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "var(--accent-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              background: "var(--glass-hover)",
              border: "1px solid var(--glass-border)",
              padding: "0.2rem 0.65rem",
              borderRadius: "6px",
            }}>
              {article.category}
            </span>
            {article.isSponsored && (
              <span style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#00d4ff",
                background: "rgba(0, 212, 255, 0.12)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                padding: "0.2rem 0.65rem",
                borderRadius: "6px",
              }}>
                CONTENIDO PATROCINADO {article.sponsorName ? `· ${article.sponsorName}` : ""}
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontFamily: "'Merriweather', Georgia, serif",
            fontWeight: 900,
            lineHeight: 1.12,
            color: "var(--heading-color)",
            marginTop: "0.75rem",
            marginBottom: "1.25rem",
            letterSpacing: "-0.02em",
          }}>
            {article.title}
          </h1>

          <p style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            fontFamily: "'Merriweather', Georgia, serif",
            fontStyle: "italic",
            borderLeft: "3px solid var(--accent-primary)",
            paddingLeft: "1rem",
            margin: "1.25rem 0",
          }}>
            {article.summary}
          </p>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1.5rem",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            fontFamily: "Inter, sans-serif",
            borderTop: "1px solid var(--glass-border)",
            paddingTop: "1rem",
          }}>
            <span>Por <strong style={{ color: "var(--heading-color)" }}>{article.author || "Redacción Talos"}</strong></span>
            <span>&bull;</span>
            <span suppressHydrationWarning>
              {new Date(article.publishedAt).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Botones de Compartir en Redes (WhatsApp, X, LinkedIn, FB, Copiar) */}
        <ShareButtons title={article.title} url={articleUrl} category={article.category} />

        {/* Imagen de la Nota */}
        {article.imageUrl && (
          <div style={{ marginBottom: "2.5rem", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.title} style={{ width: "100%", height: "auto", display: "block", maxHeight: "500px", objectFit: "cover" }} />
          </div>
        )}

        {/* Contenido con Parser Interactivo de Entidades IA */}
        <div style={{
          fontSize: "1.15rem",
          lineHeight: 1.85,
          color: "var(--text-primary)",
          fontFamily: "'Merriweather', Georgia, serif",
        }}>
          <InteractiveContent content={article.content} />
        </div>

        {/* Segundo Bloque de Compartir al Finalizar la Lectura */}
        <div style={{ marginTop: "3rem" }}>
          <ShareButtons title={article.title} url={articleUrl} category={article.category} />
        </div>
      </main>

      {/* BANNER Y ZÓCALO */}
      <AdBanner section={article.category.toLowerCase()} />
      <MobileAnchorAd section={article.category.toLowerCase()} />

      <Footer categoryLabel={article.category} />
    </div>
  );
}
