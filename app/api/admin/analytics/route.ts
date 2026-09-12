import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

function checkAdminAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token");
  const validTokens = ["talos2025", "editor2025", "redactor2025"];
  return token && validTokens.includes(token);
}

// GET /api/admin/analytics - Return full consolidated analytics stats
export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalEvents = await prisma.analyticsEvent.count();
    const articleViewsCount = await prisma.analyticsEvent.count({ where: { eventType: "view_article" } });
    const aiQueriesCount = await prisma.analyticsEvent.count({ where: { eventType: "ai_query" } });
    const categoryVisitsCount = await prisma.analyticsEvent.count({ where: { eventType: "category_visit" } });

    // Recent events log
    const recentEvents = await prisma.analyticsEvent.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    // Top AI queries
    const aiEvents = await prisma.analyticsEvent.findMany({
      where: { eventType: "ai_query" },
      select: { query: true },
    });

    const aiQueryMap: Record<string, number> = {};
    aiEvents.forEach(e => {
      if (e.query) {
        aiQueryMap[e.query] = (aiQueryMap[e.query] || 0) + 1;
      }
    });

    const topAiQueries = Object.entries(aiQueryMap)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top read article targets
    const viewEvents = await prisma.analyticsEvent.findMany({
      where: { eventType: "view_article" },
      select: { targetId: true },
    });

    const articleViewMap: Record<string, number> = {};
    viewEvents.forEach(e => {
      if (e.targetId) {
        articleViewMap[e.targetId] = (articleViewMap[e.targetId] || 0) + 1;
      }
    });

    const topArticles = Object.entries(articleViewMap)
      .map(([targetId, count]) => ({ targetId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Popular categories
    const catEvents = await prisma.analyticsEvent.findMany({
      select: { category: true },
    });

    const categoryMap: Record<string, number> = {};
    catEvents.forEach(e => {
      const cat = e.category || "General";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const popularCategories = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      summary: {
        totalEvents,
        articleViewsCount,
        aiQueriesCount,
        categoryVisitsCount,
      },
      topAiQueries,
      topArticles,
      popularCategories,
      recentEvents,
    });
  } catch (error: any) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
