import { prisma } from "@/auth";
import { Suspense } from "react";
import ProjectsClient from "./ProjectsClient";

export const revalidate = 60;

export const metadata = {
  title: "Project Vault | OneFrame Studios",
  description: "Explore our curated selection of high-end visual masterpieces cut by the OneFrame Studios editing team.",
  openGraph: {
    title: "Project Vault | OneFrame Studios",
    description: "Explore our curated selection of high-end visual masterpieces.",
    images: [{ url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200" }],
  }
};

type ProjectType = {
  id: string;
  title: string;
  category: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  status: string;
  editor: { name: string; slug: string } | null;
};

function ProjectsClientWrapper({ projects }: { projects: ProjectType[] }) {
  return <ProjectsClient projects={projects} />;
}

export default async function ProjectsPage() {
  let projects: {
    id: string;
    title: string;
    category: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    status: string;
    editor: { name: string; slug: string } | null;
  }[] = [];

  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        videoUrl: true,
        thumbnailUrl: true,
        status: true,
        editor: { select: { name: true, slug: true } }
      }
    });
  } catch (e) {
    console.error("Failed to fetch projects:", e);
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030303] flex items-center justify-center"><div className="text-gray-400">Loading projects...</div></div>}>
      <ProjectsClientWrapper projects={projects} />
    </Suspense>
  );
}
