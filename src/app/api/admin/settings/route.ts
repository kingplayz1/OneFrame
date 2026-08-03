import prisma from "@/database/prisma";
import { NextResponse } from "next/server";

// GET: fetch contact config
export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { key: "contact" } });
    return NextResponse.json(config ?? {});
  } catch (err) {
    console.error("GET /api/admin/settings error:", err);
    return NextResponse.json({}, { status: 500 });
  }
}

// POST: upsert contact config
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const config = await prisma.siteConfig.upsert({
      where: { key: "contact" },
      update: {
        address:       data.address       ?? null,
        contactEmail:  data.contactEmail  ?? null,
        phone:         data.phone         ?? null,
        discordUrl:    data.discordUrl    ?? null,
        discordLabel:  data.discordLabel  ?? null,
        instagramUrl:  data.instagramUrl  ?? null,
        instagramLabel: data.instagramLabel ?? null,
        youtubeUrl:    data.youtubeUrl    ?? null,
        youtubeLabel:  data.youtubeLabel  ?? null,
      },
      create: {
        key:           "contact",
        address:       data.address       ?? null,
        contactEmail:  data.contactEmail  ?? null,
        phone:         data.phone         ?? null,
        discordUrl:    data.discordUrl    ?? null,
        discordLabel:  data.discordLabel  ?? null,
        instagramUrl:  data.instagramUrl  ?? null,
        instagramLabel: data.instagramLabel ?? null,
        youtubeUrl:    data.youtubeUrl    ?? null,
        youtubeLabel:  data.youtubeLabel  ?? null,
      },
    });
    return NextResponse.json(config);
  } catch (e) {
    console.error("SiteConfig update error:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
