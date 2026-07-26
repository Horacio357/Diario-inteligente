import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const res = await fetch("https://api.argly.com.ar/v1/riesgo-pais", {
      next: { revalidate: 600 }, // Caché por 10 minutos
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch country risk: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching country risk:", error);
    return NextResponse.json(
      { error: "Error al obtener la información del riesgo país." },
      { status: 500 }
    );
  }
}
