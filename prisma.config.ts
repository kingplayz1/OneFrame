import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"]!,
  },
  seed: {
    run: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
});

