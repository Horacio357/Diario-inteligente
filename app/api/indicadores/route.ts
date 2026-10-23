import { NextResponse } from "next/server";
import { getUnifiedEconomicData } from "@/lib/economicData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getUnifiedEconomicData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error: any) {
    console.error("Error in /api/indicadores:", error);
    return NextResponse.json(
      { error: "Error al obtener indicadores económicos unificados." },
      { status: 500 }
    );
  }
}
