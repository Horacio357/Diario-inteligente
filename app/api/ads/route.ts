import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section");
  const position = req.nextUrl.searchParams.get("position");

  const where: any = { active: true };

  if (section) {
    where.section = { in: [section, "global"] };
  }

  if (position) {
    where.position = position;
  }

  const ads = await prisma.advertisement.findMany({
    where,
    orderBy: { priority: "desc" },
  });

  return NextResponse.json({ ads });
}
