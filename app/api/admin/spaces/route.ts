import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

function checkAdminOrEditorAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token");
  return token === "talos2025" || token === "editor2025";
}

// GET /api/admin/spaces
export async function GET(req: NextRequest) {
  try {
    const spaces = await prisma.newspaperSpace.findMany({ orderBy: { spaceKey: "asc" } });
    return NextResponse.json({ spaces });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/spaces
export async function PATCH(req: NextRequest) {
  if (!checkAdminOrEditorAuth(req)) {
    return NextResponse.json({ error: "Unauthorized: Requiere perfil Editor o Administrador" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, spaceKey, name, description, active, contentJson } = body;

    let space;
    if (id) {
      space = await prisma.newspaperSpace.update({
        where: { id },
        data: { name, description, active, contentJson: typeof contentJson === "object" ? JSON.stringify(contentJson) : contentJson },
      });
    } else if (spaceKey) {
      space = await prisma.newspaperSpace.upsert({
        where: { spaceKey },
        update: { name, description, active, contentJson: typeof contentJson === "object" ? JSON.stringify(contentJson) : contentJson },
        create: { spaceKey, name: name || spaceKey, description, active: active ?? true, contentJson: typeof contentJson === "object" ? JSON.stringify(contentJson) : contentJson },
      });
    }

    return NextResponse.json({ space });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
