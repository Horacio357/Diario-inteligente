import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const res = await fetch("https://api.argly.com.ar/v1/personas-desaparecidas", {
      next: { revalidate: 3600 }, // Caché por 1 hora
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch SIFEBU data: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching personas desaparecidas:", error);
    return NextResponse.json(
      { error: "Error al obtener la información de personas desaparecidas." },
      { status: 500 }
    );
  }
}
