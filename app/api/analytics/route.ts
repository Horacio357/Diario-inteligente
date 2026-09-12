import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// POST /api/analytics - Record analytics events dynamically
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, targetId, query, category } = body;

    if (!eventType) {
      return NextResponse.json({ error: "Missing eventType" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || "unknown";

    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        targetId: targetId ? String(targetId) : null,
        query: query ? String(query) : null,
        category: category ? String(category) : null,
        userAgent: userAgent.slice(0, 200),
      },
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error: any) {
    console.error("Analytics log error:", error);
    return NextResponse.json({ error: "Failed to record analytics" }, { status: 500 });
  }
}
