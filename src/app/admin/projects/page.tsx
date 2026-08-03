import { prisma } from "@/auth";
import ProjectsAdminClient from "./ProjectsAdminClient";

export default async function ProjectVaultPage() {
  let projects: any[] = [];
  let editors: { id: string; name: string }[] = [];

  try {
    projects = await prisma.project.findMany({ 
      orderBy: { createdAt: "desc" },
      include: { editor: { select: { name: true } } }
    });
    editors = await prisma.editor.findMany({ select: { id: true, name: true } });
  } catch (e) {
    console.error("Failed to fetch projects/editors:", e);
  }

  const serialized = projects.map(p => ({ 
    ...p, 
    createdAt: p.createdAt.toISOString() 
  }));

  return <ProjectsAdminClient initialProjects={serialized} editors={editors} />;
}
