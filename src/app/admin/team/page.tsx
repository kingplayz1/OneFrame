import { prisma } from "@/auth";
import TeamAdminClient from "./TeamAdminClient";

export default async function TeamPage() {
  let editors: {
    id: string; name: string; slug: string; role: string; bio: string | null;
    software: string[]; specialties: string[]; imageUrl: string | null;
    coverImageUrl: string | null; showreelUrl: string | null;
    instagramUrl: string | null; youtubeUrl: string | null; twitterUrl: string | null;
    yearsExp: number | null; projectCount: number | null; location: string | null;
    createdAt: Date;
  }[] = [];

  try {
    editors = await prisma.editor.findMany({ orderBy: { createdAt: "asc" } });
  } catch (e) { console.error(e); }

  const serialized = editors.map(e => ({ ...e, createdAt: e.createdAt.toISOString() }));
  return <TeamAdminClient initialEditors={serialized} />;
}
