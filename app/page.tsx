import { PrismaClient } from "@/lib/generated/prisma";
import NewsTickerBar from "@/components/NewsTickerBar";
import FinanceTicker from "@/components/FinanceTicker";
import ClientNewspaperCover from "./ClientNewspaperCover";
import TalosNavbar from "./TalosNavbar";
import AdBanner from "@/components/AdBanner";
import MobileAnchorAd from "@/components/MobileAnchorAd";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default async function HomePage() {
  const editorialArticles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    take: 5,
  });

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", background: "var(--bg-base)" }}>

      {/* NAVBAR PREMIUM */}
      <TalosNavbar />

      {/* TICKERS */}
      <NewsTickerBar />
      <FinanceTicker />

      {/* MAIN COVER */}
      <ClientNewspaperCover editorialArticles={editorialArticles} />

      {/* SECCIÓN DE PUBLICIDAD (PRE-FOOTER) */}
      <AdBanner section="global" />

      {/* ZÓCALO ADHESIVO MÓVIL */}
      <MobileAnchorAd section="global" />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
