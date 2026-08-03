import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/auth";

async function checkAuth() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
}

export async function GET() {
  await checkAuth();
  try {
    const events = await prisma.timelineEvent.findMany({ orderBy: { year: "desc" } });
    return NextResponse.json(events);
  } catch { return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  await checkAuth();
  try {
    const body = await req.json();
    const event = await prisma.timelineEvent.create({
      data: { year: body.year, title: body.title, description: body.description },
    });
    return NextResponse.json(event);
  } catch { return NextResponse.json({ error: "Failed to create" }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  await checkAuth();
  try {
    const body = await req.json();
    const event = await prisma.timelineEvent.update({
      where: { id: body.id },
      data: { year: body.year, title: body.title, description: body.description },
    });
    return NextResponse.json(event);
  } catch { return NextResponse.json({ error: "Failed to update" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  await checkAuth();
  try {
    const { id } = await req.json();
    await prisma.timelineEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed to delete" }, { status: 500 }); }
}
