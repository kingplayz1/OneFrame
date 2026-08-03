import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/auth";

async function checkAuth() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
}

const editorFields = (body: Record<string, unknown>) => ({
  name: body.name as string,
  slug: body.slug as string,
  role: body.role as string,
  bio: (body.bio as string) || null,
  software: (body.software as string[]) || [],
  specialties: (body.specialties as string[]) || [],
  imageUrl: (body.imageUrl as string) || null,
  coverImageUrl: (body.coverImageUrl as string) || null,
  showreelUrl: (body.showreelUrl as string) || null,
  instagramUrl: (body.instagramUrl as string) || null,
  youtubeUrl: (body.youtubeUrl as string) || null,
  twitterUrl: (body.twitterUrl as string) || null,
  yearsExp: body.yearsExp != null ? Number(body.yearsExp) : null,
  projectCount: body.projectCount != null ? Number(body.projectCount) : null,
  location: (body.location as string) || null,
});

export async function GET() {
  await checkAuth();
  try {
    const editors = await prisma.editor.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(editors);
  } catch { return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  await checkAuth();
  try {
    const body = await req.json();
    const editor = await prisma.editor.create({ data: editorFields(body) });
    return NextResponse.json(editor);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await checkAuth();
  try {
    const body = await req.json();
    const editor = await prisma.editor.update({
      where: { id: body.id as string },
      data: editorFields(body),
    });
    return NextResponse.json(editor);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await checkAuth();
  try {
    const { id } = await req.json();
    await prisma.editor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed to delete" }, { status: 500 }); }
}
