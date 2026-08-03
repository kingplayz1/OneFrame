import { prisma } from "@/auth";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export default async function Home() {
  let featuredProjects: any[] = [];
  let teamCount = 0;
  let projectCount = 0;

  try {
    featuredProjects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        category: true,
        thumbnailUrl: true,
        videoUrl: true,
        editor: { select: { name: true, slug: true } },
      },
    });

    teamCount = await prisma.editor.count();
    projectCount = await prisma.project.count({ where: { status: "PUBLISHED" } });
  } catch (e) {
    console.error("Home page DB error:", e);
  }

  return (
    <HomeClient
      featuredProjects={featuredProjects}
      teamCount={teamCount}
      projectCount={projectCount}
    />
  );
}
