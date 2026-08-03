import { prisma } from "@/auth";
import TimelineAdminClient from "./TimelineAdminClient";

export default async function TimelinePage() {
  let events: {
    id: string; year: string; title: string; description: string; createdAt: Date;
  }[] = [];
  try {
    events = await prisma.timelineEvent.findMany({ orderBy: { year: "desc" } });
  } catch (e) { console.error(e); }
  const serialized = events.map(e => ({ ...e, createdAt: e.createdAt.toISOString() }));
  return <TimelineAdminClient initialEvents={serialized} />;
}
