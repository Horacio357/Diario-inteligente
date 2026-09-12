import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "REDACTOR";
}

// Auth & RBAC resolver
async function resolveAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const token = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token");
  if (!token) return null;

  // Fallback defaults
  if (token === "talos2025") return { id: "admin-default", name: "Director Talos", email: "admin@talos.com", role: "ADMIN" };
  if (token === "editor2025") return { id: "editor-default", name: "Editor Jefe", email: "editor@talos.com", role: "EDITOR" };
  if (token === "redactor2025") return { id: "redactor-default", name: "Colaborador Invitado", email: "colaborador@talos.com", role: "REDACTOR" };

  // DB User lookup
  const user = await prisma.user.findFirst({ where: { passToken: token } });
  if (user) {
    return { id: user.id, name: user.name, email: user.email, role: user.role as any };
  }

  return null;
}

// GET /api/admin?resource=articles|ads|settings|auth
export async function GET(req: NextRequest) {
  const user = await resolveAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resource = req.nextUrl.searchParams.get("resource");

  if (resource === "auth") {
    return NextResponse.json({ user });
  }

  if (resource === "articles") {
    let articles;
    if (user.role === "REDACTOR") {
      // Redactor can only see articles authored by them or unassigned
      articles = await prisma.article.findMany({
        where: {
          OR: [
            { authorId: user.id },
            { author: user.name },
            { author: "Colaborador Invitado" },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // ADMIN and EDITOR see all articles
      articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
    }
    return NextResponse.json({ articles, user });
  }

  if (resource === "ads") {
    if (user.role === "REDACTOR") {
      return NextResponse.json({ error: "Forbidden: Redactores no tienen acceso a publicidad" }, { status: 403 });
    }
    const ads = await prisma.advertisement.findMany({ orderBy: { priority: "desc" } });
    return NextResponse.json({ ads, user });
  }

  if (resource === "settings") {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Requiere rol de Administrador" }, { status: 403 });
    }
    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json({ settings, user });
  }

  return NextResponse.json({ error: "Unknown resource" }, { status: 400 });
}

// POST /api/admin — create article or ad
export async function POST(req: NextRequest) {
  const user = await resolveAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type } = body;

  if (type === "article") {
    const { title, summary, content, category, imageUrl, videoUrl, author, published, isSponsored, sponsorName, sponsorLogo } = body;
    const slug = title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80)
      + "-" + Date.now();

    const article = await prisma.article.create({
      data: {
        title, slug, summary, content, category, imageUrl, videoUrl,
        author: user.role === "REDACTOR" ? user.name : (author || user.name),
        authorId: user.id !== "admin-default" && user.id !== "editor-default" && user.id !== "redactor-default" ? user.id : null,
        published: user.role === "REDACTOR" ? false : (published ?? true), // Redactor creates as draft for review
        isSponsored: isSponsored ?? false,
        sponsorName, sponsorLogo,
      },
    });
    return NextResponse.json({ article });
  }

  if (type === "ad") {
    if (user.role === "REDACTOR") {
      return NextResponse.json({ error: "Forbidden: Redactores no pueden crear anuncios" }, { status: 403 });
    }
    const { section, position, title, imageUrl, linkUrl, code, active, priority } = body;
    const ad = await prisma.advertisement.create({
      data: {
        section: section ?? "global",
        position: position ?? "footer",
        title, imageUrl, linkUrl, code,
        active: active ?? true,
        priority: priority ?? 0,
      },
    });
    return NextResponse.json({ ad });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

// PATCH /api/admin — update article or ad
export async function PATCH(req: NextRequest) {
  const user = await resolveAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, id, ...data } = body;

  if (type === "article") {
    if (user.role === "REDACTOR") {
      // Check ownership
      const existing = await prisma.article.findUnique({ where: { id } });
      if (!existing || (existing.authorId && existing.authorId !== user.id && existing.author !== user.name)) {
        return NextResponse.json({ error: "Forbidden: Solo podés modificar tus propias notas" }, { status: 403 });
      }
      // Redactors cannot auto-publish without review unless specified
      delete data.published;
    }

    const article = await prisma.article.update({ where: { id }, data });
    return NextResponse.json({ article });
  }

  if (type === "ad") {
    if (user.role === "REDACTOR") {
      return NextResponse.json({ error: "Forbidden: Redactores no pueden modificar anuncios" }, { status: 403 });
    }
    const ad = await prisma.advertisement.update({ where: { id }, data });
    return NextResponse.json({ ad });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

// DELETE /api/admin?type=article|ad&id=xxx
export async function DELETE(req: NextRequest) {
  const user = await resolveAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = req.nextUrl.searchParams.get("type");
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (type === "article") {
    if (user.role === "REDACTOR") {
      const existing = await prisma.article.findUnique({ where: { id } });
      if (!existing || (existing.authorId && existing.authorId !== user.id && existing.author !== user.name)) {
        return NextResponse.json({ error: "Forbidden: Solo podés eliminar tus propias notas" }, { status: 403 });
      }
    }
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  if (type === "ad") {
    if (user.role === "REDACTOR") {
      return NextResponse.json({ error: "Forbidden: Redactores no pueden eliminar anuncios" }, { status: 403 });
    }
    await prisma.advertisement.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}
