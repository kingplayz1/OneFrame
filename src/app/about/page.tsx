import { prisma } from "@/auth";
import AboutClient from "./AboutClient";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: "The Roster | OneFrame Studios",
  description: "Meet the elite editors, color scientists, and VFX artists at OneFrame Studios.",
  openGraph: {
    title: "The OneFrame Roster",
    description: "Meet the elite editors, color scientists, and VFX artists behind the magic.",
  }
};

export default async function AboutPage() {
  let team: any[] = [];
  let timeline: any[] = [];

  try {
    team = await prisma.editor.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        role: true,
        bio: true,
        imageUrl: true,
        coverImageUrl: true,
        location: true,
        specialties: true,
        software: true,
        yearsExp: true,
        projectCount: true,
      }
    });

    timeline = await prisma.timelineEvent.findMany({
      orderBy: { year: "desc" },
      select: {
        id: true,
        year: true,
        title: true,
        description: true,
      }
    });
  } catch (e) {
    console.error("Failed to fetch about data:", e);
  }

  return <AboutClient team={team} timeline={timeline} />;
}
