import { NextRequest, NextResponse } from "next/server";

let lastValidData: any = {
  valor: 640,
  variacion: -1.2,
  fecha: new Date().toISOString(),
  fuente: "JP Morgan EMBI+ (Estimado)",
};
let lastFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos

export async function GET(request: NextRequest) {
  const now = Date.now();

  // Return cached value if within TTL
  if (now - lastFetchTime < CACHE_TTL_MS && lastValidData) {
    return NextResponse.json(lastValidData, {
      headers: {
        "X-Cache": "HIT",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      },
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch("https://api.argly.com.ar/v1/riesgo-pais", {
      next: { revalidate: 600 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch country risk: ${res.statusText}`);
    }

    const data = await res.json();
    lastValidData = data;
    lastFetchTime = now;

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.warn("Using fallback cache for riesgo-pais due to network error:", error);
    // Graceful fallback to last valid data instead of returning 500
    return NextResponse.json(lastValidData, {
      headers: {
        "X-Cache": "FALLBACK",
        "Cache-Control": "public, s-maxage=60",
      },
    });
  }
}
