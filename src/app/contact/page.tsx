import { prisma } from "@/auth";
import ContactClient from "./ContactClient";

export const revalidate = 60;

export default async function ContactPage() {
  let config: {
    address?: string | null;
    contactEmail?: string | null;
    phone?: string | null;
    discordUrl?: string | null;
    discordLabel?: string | null;
    instagramUrl?: string | null;
    instagramLabel?: string | null;
    youtubeUrl?: string | null;
    youtubeLabel?: string | null;
  } = {};

  try {
    const raw = await prisma.siteConfig.findUnique({ where: { key: "contact" } });
    if (raw) config = raw;
  } catch {
    // DB not available, fall back to empty (contact form still works)
  }

  return <ContactClient config={config} />;
}
