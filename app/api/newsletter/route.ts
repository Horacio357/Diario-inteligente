import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// POST /api/newsletter — Subscribe email
export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Ingresá un correo electrónico válido." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (!existing.active) {
        await prisma.newsletterSubscriber.update({
          where: { email: cleanEmail },
          data: { active: true },
        });
      }
      return NextResponse.json({
        message: "¡Ya estás suscripto a El Resumen Matutino de Talos! Recibirás la edición de mañana a las 7:00 AM.",
        alreadySubscribed: true,
      });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        name: name ? name.trim() : null,
      },
    });

    return NextResponse.json({
      message: "¡Suscripción confirmada! Cada mañana a las 7:00 AM recibirás las 5 noticias clave y el índice del Pulso Nacional.",
      subscriber,
    });
  } catch (error) {
    console.error("Error en suscripción de newsletter:", error);
    return NextResponse.json({ error: "Ocurrió un error al procesar tu suscripción." }, { status: 500 });
  }
}

// GET /api/newsletter — List subscribers (admin)
export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token");
  const pass = process.env.ADMIN_PASS ?? "talos2025";

  if (token !== pass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ subscribers, count: subscribers.length });
}
