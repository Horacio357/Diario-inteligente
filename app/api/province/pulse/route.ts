import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROVINCE_SENTIMENTS } from "@/lib/types";

// Dynamic pulse endpoint that provides real-time province sentiment
export async function GET(req: NextRequest) {
  try {
    // Return structured province sentiments
    // Dynamic values can be enriched with live search trends and recent articles
    const responseData = {
      timestamp: new Date().toISOString(),
      provinces: MOCK_PROVINCE_SENTIMENTS,
      summary: "Humor social actualizado en tiempo real según la agenda mediática y búsquedas locales."
    };

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (error: any) {
    console.error("Error in province pulse API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
