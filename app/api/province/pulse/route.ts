import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROVINCE_SENTIMENTS } from "@/lib/types";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // 1. Fetch recent citizen votes
    const recentVotes = await prisma.citizenVote.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { provinceId: true, sentiment: true },
    });

    const totalCitizenVotes = recentVotes.length;

    // Aggregate general citizen sentiment
    let citizenSentiment = 0;
    if (totalCitizenVotes > 0) {
      const sum = recentVotes.reduce((acc, v) => acc + v.sentiment, 0);
      citizenSentiment = Number((sum / totalCitizenVotes).toFixed(2));
    }

    // Aggregate per-province citizen sentiment
    const provinceCitizenMap: Record<string, { sum: number; count: number }> = {};
    for (const v of recentVotes) {
      if (v.provinceId) {
        if (!provinceCitizenMap[v.provinceId]) {
          provinceCitizenMap[v.provinceId] = { sum: 0, count: 0 };
        }
        provinceCitizenMap[v.provinceId].sum += v.sentiment;
        provinceCitizenMap[v.provinceId].count += 1;
      }
    }

    // 2. Base media provinces
    const calibratedProvinces: Record<string, { sentiment: number; intensity: number; dominantArchetype?: string; citizenVotes?: number }> = {};
    let totalMediaSentiment = 0;
    const provinceEntries = Object.entries(MOCK_PROVINCE_SENTIMENTS);

    for (const [id, metric] of provinceEntries) {
      totalMediaSentiment += metric.sentiment;
      const citizenData = provinceCitizenMap[id];

      if (citizenData && citizenData.count > 0) {
        // Blend: 65% media + 35% direct citizen votes
        const provCitizenScore = citizenData.sum / citizenData.count;
        const blended = Number((metric.sentiment * 0.65 + provCitizenScore * 0.35).toFixed(2));
        calibratedProvinces[id] = {
          ...metric,
          sentiment: Math.max(-1, Math.min(1, blended)),
          intensity: Math.min(1, metric.intensity + 0.1),
          citizenVotes: citizenData.count,
        };
      } else if (totalCitizenVotes > 0) {
        // Slight global citizen pull (15%) when no province-specific vote exists
        const blended = Number((metric.sentiment * 0.85 + citizenSentiment * 0.15).toFixed(2));
        calibratedProvinces[id] = {
          ...metric,
          sentiment: Math.max(-1, Math.min(1, blended)),
        };
      } else {
        calibratedProvinces[id] = { ...metric };
      }
    }

    const avgMediaSentiment = Number((totalMediaSentiment / (provinceEntries.length || 1)).toFixed(2));

    // 3. Contrast calculation (Divergence: Citizen vs Media)
    const divergence = totalCitizenVotes > 0 ? Math.round((citizenSentiment - avgMediaSentiment) * 100) : 0;
    let divergenceLabel = "En sincronía con la agenda informativa";
    if (divergence > 12) {
      divergenceLabel = `Lectores ${divergence}% más optimistas que los medios`;
    } else if (divergence < -12) {
      divergenceLabel = `Lectores ${Math.abs(divergence)}% más críticos que los medios`;
    }

    const responseData = {
      timestamp: new Date().toISOString(),
      provinces: calibratedProvinces,
      contrast: {
        mediaSentiment: avgMediaSentiment,
        citizenSentiment: totalCitizenVotes > 0 ? citizenSentiment : avgMediaSentiment,
        divergence,
        divergenceLabel,
        totalCitizenVotes,
      },
      summary: totalCitizenVotes > 0
        ? `Humor social calibrado: se contrastaron ${totalCitizenVotes} votos ciudadanos con los medios nacionales.`
        : "Humor social actualizado en tiempo real según la agenda mediática y portales informativos.",
    };

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    console.error("Error in province pulse API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
