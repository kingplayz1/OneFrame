import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, details } = await req.json();

    if (!name || !email || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Send email via Mailtrap
    const mailtrapToken = process.env.MAILTRAP_TOKEN;
    if (mailtrapToken) {
      const { MailtrapClient } = require("mailtrap");
      const client = new MailtrapClient({ token: mailtrapToken });

      await client.send({
        from: {
          email: process.env.MAILTRAP_SENDER_EMAIL || "no-reply@oneframestudios.com",
          name: process.env.MAILTRAP_SENDER_NAME || "OneFrame Studios",
        },
        to: [{ email }],
        subject: "New Project Brief from OneFrame Studios",
        text: `New project brief submission:\n\nName: ${name}\nEmail: ${email}\n\nDetails: ${details}`,
        category: "project-submission",
      });
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
    // Still save to DB even if email fails
    try {
      const { name, email, details } = await req.json();
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          details,
          status: "UNREAD",
        },
      });
    } catch (dbError) {
      console.error("DB save fallback error:", dbError);
    }
    return NextResponse.json({ error: "Failed to submit transmission" }, { status: 500 });
  }
}
