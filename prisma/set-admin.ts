import { PrismaClient } from "@prisma/client";

// Load env from .env file
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const TARGET_EMAIL = "bhaktaprince094@gmail.com";

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.user.updateMany({
      where: { email: TARGET_EMAIL },
      data: { role: "ADMIN" },
    });

    if (result.count === 0) {
      console.log(`❌ No user found with email: ${TARGET_EMAIL}`);
      console.log("Make sure you have signed in at least once via Discord on the live site.");
    } else {
      console.log(`✅ Successfully promoted ${TARGET_EMAIL} to ADMIN (${result.count} record updated).`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
