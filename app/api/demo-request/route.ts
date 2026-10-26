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

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token");
  const pass = process.env.ADMIN_PASS ?? "talos2025";

  if (!token) {
    return NextResponse.json(
      { message: "Endpoint de recepción de solicitudes de demostración B2B Talos Inteligencia." },
      { status: 200 }
    );
  }

  if (token !== pass && token !== "editor2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const demoRequests = await prisma.demoRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ demoRequests, count: demoRequests.length });
  } catch {
    return NextResponse.json({ demoRequests: [], count: 0 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token");
  const pass = process.env.ADMIN_PASS ?? "talos2025";

  if (token !== pass && token !== "editor2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    const updated = await prisma.demoRequest.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, demoRequest: updated });
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar el estado" }, { status: 500 });
  }
}
