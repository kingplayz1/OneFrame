import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, details } = await req.json();

    if (!name || !email || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        details,
        status: "UNREAD",
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "Failed to submit transmission" }, { status: 500 });
  }
}
