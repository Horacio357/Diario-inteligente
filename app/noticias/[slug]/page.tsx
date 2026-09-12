import { PrismaClient } from "@/lib/generated/prisma";
import InteractiveContent from "./InteractiveContent";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    notFound();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Header simple (se puede hacer un componente compartido después) */}
      <nav style={{
        background: "rgba(10, 14, 26, 0.85)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--glass-border)",
        padding: "1rem 1.5rem",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 800, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--accent-primary)" }}>●</span> Ojo Social Diario
          </a>
        </div>
      </nav>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{
            color: "var(--accent-primary)",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em"
          }}>
            {article.category}
          </span>
          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontFamily: "Outfit",
            fontWeight: 900,
            lineHeight: 1.1,
            marginTop: "0.5rem",
            marginBottom: "1rem"
          }}>
            {article.title}
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {article.summary}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            <span>Por <strong>{article.author}</strong></span>
            <span>&bull;</span>
            <span suppressHydrationWarning>{new Date(article.publishedAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>

        {article.imageUrl && (
          <div style={{ marginBottom: "3rem", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.title} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        )}

        {/* Content with Interactive Parser */}
        <div style={{
          fontSize: "1.15rem",
          lineHeight: 1.8,
          color: "var(--text-primary)",
          fontFamily: "Inter, sans-serif"
        }}>
          <InteractiveContent content={article.content} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
