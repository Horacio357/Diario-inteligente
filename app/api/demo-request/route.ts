import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, organization, role, phone, district, planInterest, message } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Ingresá un correo electrónico válido" },
        { status: 400 }
      );
    }

    if (!organization || !organization.trim()) {
      return NextResponse.json(
        { error: "La institución, consultora o empresa es obligatoria" },
        { status: 400 }
      );
    }

    const demo = await prisma.demoRequest.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        organization: organization.trim(),
        role: role?.trim() || null,
        phone: phone?.trim() || null,
        district: district?.trim() || null,
        planInterest: planInterest?.trim() || "federal",
        message: message?.trim() || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Solicitud registrada con éxito. Nuestro equipo de analistas de Talos Inteligencia se comunicará en menos de 24 horas hábiles.",
      id: demo.id,
    });
  } catch (error: any) {
    console.error("Error al registrar solicitud de demo B2B:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar tu solicitud. Por favor escribinos directamente a comercial@talosdiario.ar" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Endpoint de recepción de solicitudes de demostración B2B Talos Inteligencia." },
    { status: 200 }
  );
}
