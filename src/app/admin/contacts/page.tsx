import { prisma } from "@/auth";
import ContactsAdminClient from "./ContactsAdminClient";

export default async function ContactsAdminPage() {
  let contacts: {
    id: string;
    name: string;
    email: string;
    details: string;
    status: string;
    createdAt: Date;
  }[] = [];

  try {
    contacts = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Failed to fetch contacts:", e);
  }

  const serialized = contacts.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString()
  }));

  return <ContactsAdminClient initialContacts={serialized} />;
}
