import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "talos-cron-default-key";

  // Check simple authorization if CRON_SECRET is configured
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const results: Record<string, string> = {};

  try {
    // 1. Warm up core news feeds
    const newsEndpoints = [
      `${siteUrl}/api/news?q=argentina`,
      `${siteUrl}/api/news?q=politica&cat=politica`,
      `${siteUrl}/api/news?q=economia&cat=economia`,
    ];

    await Promise.allSettled(
      newsEndpoints.map(url =>
        fetch(url)
          .then(res => {
            results[url] = res.status === 200 ? "OK" : `Status ${res.status}`;
          })
          .catch(err => {
            results[url] = `Error: ${err.message}`;
          })
      )
    );

    // 2. Warm up riesgo país
    try {
      const rpRes = await fetch(`${siteUrl}/api/riesgo-pais`);
      results["/api/riesgo-pais"] = rpRes.status === 200 ? "OK" : `Status ${rpRes.status}`;
    } catch (e: any) {
      results["/api/riesgo-pais"] = `Error: ${e.message}`;
    }

    // 3. Warm up pulse calculation
    try {
      const pulseRes = await fetch(`${siteUrl}/api/province/pulse`);
      results["/api/province/pulse"] = pulseRes.status === 200 ? "OK" : `Status ${pulseRes.status}`;
    } catch (e: any) {
      results["/api/province/pulse"] = `Error: ${e.message}`;
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      warmedEndpoints: results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
