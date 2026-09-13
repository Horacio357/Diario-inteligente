import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";
import TalosNavbar from "@/app/TalosNavbar";
import NewsTickerBar from "@/components/NewsTickerBar";
import AdBanner from "@/components/AdBanner";
import MobileAnchorAd from "@/components/MobileAnchorAd";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const CATEGORY_CONFIG: Record<string, {
  label: string;
  emoji: string;
  description: string;
  query: string;
  color: string;
  topics: string[];
  icon: string;
}> = {
  politica: {
    label: "Política",
    emoji: "🏛️",
    description: "Gobierno, Congreso, partidos, elecciones y poder. El análisis político más profundo con inteligencia artificial.",
    query: "argentina política gobierno milei congreso",
    color: "#7c3aed",
    topics: ["Gobierno Nacional", "Congreso", "Elecciones", "Oposición", "Economía Política"],
    icon: "🏛️",
  },
  deportes: {
    label: "Deportes",
    emoji: "⚽",
    description: "Fútbol, tenis, rugby y más. Resultados, análisis y el pulso del deporte argentino.",
    query: "argentina deportes fútbol messi selección",
    color: "#059669",
    topics: ["Fútbol AFA", "Selección Argentina", "Liga Profesional", "Tenis", "Rugby"],
    icon: "⚽",
  },
  tecnologia: {
    label: "Tecnología",
    emoji: "💻",
    description: "Inteligencia artificial, startups, innovación y el futuro digital. Tecnología con contexto argentino.",
    query: "argentina tecnología inteligencia artificial startup innovación",
    color: "#0ea5e9",
    topics: ["Inteligencia Artificial", "Startups AR", "Fintech", "Ciberseguridad", "Telecomunicaciones"],
    icon: "💻",
  },
  ciencia: {
    label: "Ciencia",
    emoji: "🔬",
    description: "Investigación, salud, ambiente y descubrimientos. La ciencia argentina al frente.",
    query: "argentina ciencia investigación salud ambiente CONICET",
    color: "#d97706",
    topics: ["CONICET", "Salud Pública", "Medio Ambiente", "Astronomía", "Medicina"],
    icon: "🔬",
  },
  locales: {
    label: "Locales",
    emoji: "📍",
    description: "Noticias de cada provincia y municipio. Lo que pasa en tu territorio.",
    query: "argentina provincia municipio localidad interior",
    color: "#dc2626",
    topics: ["Buenos Aires", "Córdoba", "Santa Fe", "Patagonia", "NOA", "NEA", "Cuyo"],
    icon: "📍",
  },
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const config = CATEGORY_CONFIG[categoria];

  if (!config) {
    return { title: "Sección no encontrada · Talos Diario" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://talosdiario.ar";
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(`Sección ${config.label} · Talos Diario`)}&category=${encodeURIComponent(config.label.toUpperCase())}&summary=${encodeURIComponent(config.description)}`;

  return {
    title: `Sección ${config.label} · Talos Diario`,
    description: config.description,
    openGraph: {
      title: `Sección ${config.label} · Talos Diario`,
      description: config.description,
      url: `${siteUrl}/${categoria}`,
      siteName: "Talos Diario",
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Sección ${config.label} · Talos Diario`,
      description: config.description,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const config = CATEGORY_CONFIG[categoria];

  if (!config) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <TalosNavbar activeSection={categoria} />
      <NewsTickerBar />
      <CategoryPageClient categoria={categoria} config={config} />

      {/* BANNER PUBLICITARIO DE SECCIÓN */}
      <AdBanner section={categoria} />

      {/* ZÓCALO ADHESIVO MÓVIL */}
      <MobileAnchorAd section={categoria} />

      {/* FOOTER */}
      <Footer categoryLabel={config.label} categoryColor={config.color} />
    </div>
  );
}
