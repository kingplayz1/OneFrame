import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/auth";

async function checkAuth() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
}

export async function PUT(req: NextRequest) {
  await checkAuth();
  try {
    const { id, status } = await req.json();
    const contact = await prisma.contactSubmission.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(contact);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await checkAuth();
  try {
    const { id } = await req.json();
    await prisma.contactSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
