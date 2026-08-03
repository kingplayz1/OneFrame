import { prisma } from "@/auth";
import { notFound } from "next/navigation";
import MemberPortfolioClient from "./MemberPortfolioClient";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const member = await prisma.editor.findUnique({
      where: { slug },
      select: { name: true, role: true, bio: true, imageUrl: true }
    });
    if (!member) return {};
    return {
      title: `${member.name} — ${member.role} | OneFrame Studios`,
      description: member.bio?.slice(0, 160) ?? `${member.name} is a ${member.role} at OneFrame Studios.`,
      openGraph: {
        title: `${member.name} | ${member.role}`,
        description: member.bio?.slice(0, 160) ?? `${member.name} is a ${member.role} at OneFrame Studios.`,
        images: member.imageUrl ? [{ url: member.imageUrl }] : [],
        type: 'profile',
      },
      twitter: {
        card: "summary_large_image",
        title: `${member.name} | ${member.role}`,
        description: member.bio?.slice(0, 160) ?? `${member.name} is a ${member.role} at OneFrame Studios.`,
        images: member.imageUrl ? [member.imageUrl] : [],
      }
    };
  } catch { return {}; }
}

export default async function MemberPortfolioPage({ params }: Props) {
  const { slug } = await params;

  let member: {
    id: string; name: string; slug: string; role: string; bio: string | null;
    software: string[]; specialties: string[]; imageUrl: string | null;
    coverImageUrl: string | null; showreelUrl: string | null;
    instagramUrl: string | null; youtubeUrl: string | null; twitterUrl: string | null;
    yearsExp: number | null; projectCount: number | null; location: string | null;
    projects?: { id: string; title: string; category: string; thumbnailUrl: string | null; videoUrl: string | null }[];
  } | null = null;

  try {
    member = await prisma.editor.findUnique({ 
      where: { slug },
      include: { projects: { select: { id: true, title: true, category: true, thumbnailUrl: true, videoUrl: true } } }
    });
  } catch (e) {
    console.error(e);
  }

  if (!member) return notFound();

  return <MemberPortfolioClient member={member} />;
}
