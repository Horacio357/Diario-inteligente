import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getVoterHash(req: NextRequest): { voterHash: string; voterToken: string } {
  // Check cookie or generate stable token
  let voterToken = req.cookies.get("talos_voter_token")?.value;
  if (!voterToken) {
    voterToken = crypto.randomUUID();
  }

  const forwarded = req.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0].trim() || req.headers.get("x-real-ip") || "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "unknown";

  // SHA-256 combining persistent token + IP + UserAgent for robust rate-limiting
  const voterHash = crypto
    .createHash("sha256")
    .update(`${voterToken}:${ip}:${userAgent}`)
    .digest("hex");

  return { voterHash, voterToken };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawTopic = searchParams.get("topic") || "general";
    const topic = rawTopic.toLowerCase().trim();
    const provinceId = searchParams.get("provinceId")?.toLowerCase().trim();

    const { voterHash } = getVoterHash(req);
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);

    // 1. Check if user already voted in the last 7 days on this topic
    const userVote = await prisma.citizenVote.findFirst({
      where: {
        voterHash,
        topic,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: "desc" },
    });

    const userHasVoted = Boolean(userVote);
    const nextVoteDate = userVote
      ? new Date(userVote.createdAt.getTime() + SEVEN_DAYS_MS).toISOString()
      : null;

    // 2. Aggregate votes in the last 7 days for this topic
    const whereClause: any = {
      topic,
      createdAt: { gte: sevenDaysAgo },
    };

    if (provinceId) {
      whereClause.provinceId = provinceId;
    }

    const [totalVotes, positiveVotes, neutralVotes, negativeVotes] = await Promise.all([
      prisma.citizenVote.count({ where: whereClause }),
      prisma.citizenVote.count({ where: { ...whereClause, sentiment: 1 } }),
      prisma.citizenVote.count({ where: { ...whereClause, sentiment: 0 } }),
      prisma.citizenVote.count({ where: { ...whereClause, sentiment: -1 } }),
    ]);

    const posPct = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0;
    const neuPct = totalVotes > 0 ? Math.round((neutralVotes / totalVotes) * 100) : 0;
    const negPct = totalVotes > 0 ? Math.round((negativeVotes / totalVotes) * 100) : 0;

    // Citizen sentiment score from -1.0 to +1.0
    const citizenSentiment = totalVotes > 0
      ? Number(((positiveVotes - negativeVotes) / totalVotes).toFixed(2))
      : 0;

    // Also get all-topics stats for comparison tabs
    const topicsSummary = await prisma.citizenVote.groupBy({
      by: ["topic", "sentiment"],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { _all: true },
    });

    const topicStats: Record<string, { total: number; positive: number; neutral: number; negative: number; score: number }> = {};
    for (const item of topicsSummary) {
      if (!topicStats[item.topic]) {
        topicStats[item.topic] = { total: 0, positive: 0, neutral: 0, negative: 0, score: 0 };
      }
      const count = item._count._all;
      topicStats[item.topic].total += count;
      if (item.sentiment === 1) topicStats[item.topic].positive += count;
      else if (item.sentiment === 0) topicStats[item.topic].neutral += count;
      else if (item.sentiment === -1) topicStats[item.topic].negative += count;
    }

    for (const key of Object.keys(topicStats)) {
      const t = topicStats[key];
      t.score = t.total > 0 ? Number(((t.positive - t.negative) / t.total).toFixed(2)) : 0;
    }

    // Retrieve recent reasons for this topic
    const recentVotesWithReason = await prisma.citizenVote.findMany({
      where: {
        topic,
        reason: { not: null },
      },
      select: {
        id: true,
        sentiment: true,
        reason: true,
        provinceId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // 3. Calculate 4-week timeline trends (Historical)
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const weeklyTrends: Array<{ weekLabel: string; citizenScore: number; votes: number }> = [];

    for (let i = 3; i >= 0; i--) {
      const start = new Date(now - (i + 1) * oneWeekMs);
      const end = new Date(now - i * oneWeekMs);
      const weekLabel = i === 0 ? "Semana Actual" : `Hace ${i} sem.`;

      const weekVotes = await prisma.citizenVote.findMany({
        where: {
          topic,
          createdAt: { gte: start, lt: end },
        },
        select: { sentiment: true },
      });

      if (weekVotes.length > 0) {
        const sum = weekVotes.reduce((acc, v) => acc + v.sentiment, 0);
        const score = Number((sum / weekVotes.length).toFixed(2));
        weeklyTrends.push({ weekLabel, citizenScore: score, votes: weekVotes.length });
      } else {
        // Smooth baseline if prior weeks had no direct votes yet
        const offset = (3 - i) * 0.05;
        const baseline = Number((citizenSentiment - offset).toFixed(2));
        weeklyTrends.push({
          weekLabel,
          citizenScore: Math.max(-1, Math.min(1, baseline)),
          votes: 0,
        });
      }
    }

    return NextResponse.json({
      topic,
      provinceId: provinceId || null,
      stats: {
        totalVotes,
        positiveVotes,
        neutralVotes,
        negativeVotes,
        positivePct: posPct,
        neutralPct: neuPct,
        negativePct: negPct,
        citizenSentiment,
      },
      userStatus: {
        hasVoted: userHasVoted,
        votedSentiment: userVote?.sentiment ?? null,
        nextVoteDate,
      },
      recentReasons: recentVotesWithReason,
      weeklyTrends,
      topicStats,
    });
  } catch (error: any) {
    console.error("Error in GET /api/opinions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic: rawTopic, category: rawCat, provinceId: rawProv, sentiment, reason: rawReason } = body;

    if (sentiment !== 1 && sentiment !== 0 && sentiment !== -1) {
      return NextResponse.json(
        { error: "El sentimiento debe ser 1 (positivo), 0 (neutro) o -1 (negativo)" },
        { status: 400 }
      );
    }

    const topic = (rawTopic || "general").toLowerCase().trim();
    const category = (rawCat || "general").toLowerCase().trim();
    const provinceId = rawProv ? rawProv.toLowerCase().trim() : null;

    // Sanitize reason (max 140 chars, strip HTML)
    let reason: string | null = null;
    if (typeof rawReason === "string" && rawReason.trim().length > 0) {
      reason = rawReason.trim().replace(/<[^>]*>?/gm, "").slice(0, 140);
    }

    const { voterHash, voterToken } = getVoterHash(req);
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);

    // Rate-limiting check: 1 vote per week per voter per topic
    const existing = await prisma.citizenVote.findFirst({
      where: {
        voterHash,
        topic,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    if (existing) {
      const nextVoteDate = new Date(existing.createdAt.getTime() + SEVEN_DAYS_MS).toISOString();
      return NextResponse.json(
        {
          error: "Ya emitiste tu voto para este tema durante esta semana.",
          hasVoted: true,
          votedSentiment: existing.sentiment,
          nextVoteDate,
        },
        { status: 429 }
      );
    }

    // Save vote with optional micro-reason
    const newVote = await prisma.citizenVote.create({
      data: {
        topic,
        category,
        provinceId,
        sentiment,
        reason,
        voterHash,
      },
    });

    // Recompute topic stats for immediate response
    const whereClause = {
      topic,
      createdAt: { gte: sevenDaysAgo },
    };

    const [totalVotes, positiveVotes, neutralVotes, negativeVotes] = await Promise.all([
      prisma.citizenVote.count({ where: whereClause }),
      prisma.citizenVote.count({ where: { ...whereClause, sentiment: 1 } }),
      prisma.citizenVote.count({ where: { ...whereClause, sentiment: 0 } }),
      prisma.citizenVote.count({ where: { ...whereClause, sentiment: -1 } }),
    ]);

    const posPct = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0;
    const neuPct = totalVotes > 0 ? Math.round((neutralVotes / totalVotes) * 100) : 0;
    const negPct = totalVotes > 0 ? Math.round((negativeVotes / totalVotes) * 100) : 0;
    const citizenSentiment = totalVotes > 0
      ? Number(((positiveVotes - negativeVotes) / totalVotes).toFixed(2))
      : 0;

    const nextVoteDate = new Date(newVote.createdAt.getTime() + SEVEN_DAYS_MS).toISOString();

    const response = NextResponse.json({
      success: true,
      message: "Voto registrado exitosamente. Tu opinión calibra el mapa territorial.",
      stats: {
        totalVotes,
        positiveVotes,
        neutralVotes,
        negativeVotes,
        positivePct: posPct,
        neutralPct: neuPct,
        negativePct: negPct,
        citizenSentiment,
      },
      userStatus: {
        hasVoted: true,
        votedSentiment: sentiment,
        nextVoteDate,
      },
    });

    // Set cookie if needed
    response.cookies.set("talos_voter_token", voterToken, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Error in POST /api/opinions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
