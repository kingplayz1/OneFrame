import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/auth";

async function checkAuth() {
  const session = await auth();
  if (!session) return false;
  return true;
}

function sanitizeUrl(str: unknown): string | null {
  if (typeof str !== "string") return null;
  let clean = str.trim();
  clean = clean.replace(/^[ "'“”`]+|[ "'“”`]+$/g, "").trim();
  return clean || null;
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(projects);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const project = await prisma.project.create({
      data: {
        title: body.title?.trim(),
        description: body.description?.trim() || null,
        category: body.category?.trim(),
        videoUrl: sanitizeUrl(body.videoUrl),
        thumbnailUrl: sanitizeUrl(body.thumbnailUrl),
        status: body.status || "PUBLISHED",
        editorId: body.editorId || null,
      },
      include: { editor: { select: { name: true, slug: true } } },
    });
    return NextResponse.json(project);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[POST /api/admin/projects]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const project = await prisma.project.update({
      where: { id: body.id },
      data: {
        title: body.title?.trim(),
        description: body.description?.trim() || null,
        category: body.category?.trim(),
        videoUrl: sanitizeUrl(body.videoUrl),
        thumbnailUrl: sanitizeUrl(body.thumbnailUrl),
        status: body.status,
        editorId: body.editorId || null,
      },
      include: { editor: { select: { name: true, slug: true } } },
    });
    return NextResponse.json(project);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[PUT /api/admin/projects]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[DELETE /api/admin/projects]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
