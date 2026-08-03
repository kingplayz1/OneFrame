import { PrismaClient } from "@/generated/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma || !("siteConfig" in global.prisma)) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

