import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { fetchArgentineRSS } from "@/lib/rss";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") ?? "";
    const category = req.nextUrl.searchParams.get("category") ?? "all";
    const dateRange = req.nextUrl.searchParams.get("dateRange") ?? "all"; // 24h, week, month, all
    const sortBy = req.nextUrl.searchParams.get("sortBy") ?? "newest"; // newest, oldest

    // 1. Search in editorial DB articles
    const articleWhere: any = { published: true };

    if (q.trim()) {
      articleWhere.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { content: { contains: q } },
        { author: { contains: q } },
      ];
    }

    if (category !== "all") {
      articleWhere.category = { equals: category };
    }

    if (dateRange !== "all") {
      const now = new Date();
      if (dateRange === "24h") {
        now.setHours(now.getHours() - 24);
      } else if (dateRange === "week") {
        now.setDate(now.getDate() - 7);
      } else if (dateRange === "month") {
        now.setMonth(now.getMonth() - 1);
      }
      articleWhere.publishedAt = { gte: now };
    }

    const dbArticles = await prisma.article.findMany({
      where: articleWhere,
      orderBy: { publishedAt: sortBy === "oldest" ? "asc" : "desc" },
      take: 20,
    });

    const formattedDbArticles = dbArticles.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      content: a.content,
      source: "Editorial Talos",
      url: `/noticias/${a.slug}`,
      publishedAt: a.publishedAt.toISOString(),
      category: a.category,
      imageUrl: a.imageUrl,
      isSponsored: a.isSponsored,
      sponsorName: a.sponsorName,
      isInternal: true,
      sentiment: a.sentiment ?? 0.1,
    }));

    // 2. Search in live RSS feeds if query provided
    let rssArticles: any[] = [];
    if (q.trim()) {
      try {
        const rawRss = await fetchArgentineRSS(q);
        rssArticles = rawRss.map((item, idx) => ({
          id: `rss-${idx}-${Date.now()}`,
          title: item.title,
          slug: "",
          summary: item.description || "",
          content: item.description || "",
          source: item.source_name || "Agencia",
          url: item.link,
          publishedAt: item.pubDate,
          category: category !== "all" ? category : "Actualidad",
          imageUrl: null,
          isSponsored: false,
          isInternal: false,
          sentiment: Math.random() * 0.8 - 0.4,
        }));
      } catch {}
    }

    // Merge and sort
    const combined = [...formattedDbArticles, ...rssArticles];

    if (sortBy === "oldest") {
      combined.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    } else {
      combined.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return NextResponse.json({
      query: q,
      category,
      dateRange,
      totalResults: combined.length,
      articles: combined,
    });
  } catch (error) {
    console.error("Error en /api/search:", error);
    return NextResponse.json({ error: "Error al realizar la búsqueda" }, { status: 500 });
  }
}
