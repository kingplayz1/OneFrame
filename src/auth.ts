import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/database/prisma";

export { prisma };

const MASTER_ADMIN_DISCORD_IDS = [
  "786249176010194954", // Master Admin ID
];

const ADMIN_DISCORD_IDS = [
  "668857098867834940", // Admin ID
  ...(process.env.ADMIN_DISCORD_IDS ? process.env.ADMIN_DISCORD_IDS.split(",").map(s => s.trim()) : []),
];

const WEB_ADMIN_ROLE_ID = process.env.DISCORD_WEB_ADMIN_ROLE_ID || "1533832432476749885";

/**
 * Checks if the Discord user holds the Web Admin role in any guild.
 * Only called on fresh sign-in (when a new access_token is issued).
 */
async function hasDiscordWebAdminRole(accessToken: string): Promise<boolean> {
  try {
    // Fetch all guilds the user is in
    const guildsRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!guildsRes.ok) {
      console.warn("[Discord Auth] Failed to fetch guilds. Scope may be missing.");
      return false;
    }

    const guilds = await guildsRes.json();
    if (!Array.isArray(guilds)) return false;

    // If a specific guild is configured, check it first
    const targetGuildId = process.env.DISCORD_GUILD_ID;
    const guildsToCheck = targetGuildId
      ? guilds.filter((g: { id: string }) => g.id === targetGuildId)
      : guilds;

    for (const guild of guildsToCheck) {
      const memberRes = await fetch(
        `https://discord.com/api/v10/users/@me/guilds/${guild.id}/member`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (memberRes.ok) {
        const member = await memberRes.json();
        if (Array.isArray(member?.roles) && member.roles.includes(WEB_ADMIN_ROLE_ID)) {
          return true;
        }
      }
    }
  } catch (err) {
    console.error("[Discord Auth] Error checking Web Admin role:", err);
  }
  return false;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "super-secure-random-secret-key-12345",
  adapter: PrismaAdapter(prisma as any),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          // Request guild scopes for role checking
          scope: "identify email guilds guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "discord" && account?.providerAccountId) {
        const discordId = account.providerAccountId;

        // 1. Check hardcoded / env Discord User IDs
        let isAdmin = MASTER_ADMIN_DISCORD_IDS.includes(discordId) || ADMIN_DISCORD_IDS.includes(discordId);

        // 2. Check SiteConfig in DB for dynamically added Admin Discord IDs
        if (!isAdmin) {
          try {
            const config = await prisma.siteConfig.findUnique({ where: { key: "contact" } });
            if (config?.adminDiscordIds) {
              const allowedIds = config.adminDiscordIds.split(",").map((s) => s.trim());
              if (allowedIds.includes(discordId)) {
                isAdmin = true;
              }
            }
          } catch {
            // Ignore config read error
          }
        }

        // 3. Fall back to Discord Server Role check
        if (!isAdmin && account.access_token && account.scope?.includes("guilds")) {
          isAdmin = await hasDiscordWebAdminRole(account.access_token);
        }

        // Grant ADMIN role in DB if verified
        if (isAdmin && user.id) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: "ADMIN" },
            });
            console.log(`[Discord Auth] Granted ADMIN role to user ${user.email} (Discord ID: ${discordId})`);
          } catch (e) {
            console.error("[Discord Auth] Failed to update user role:", e);
          }
        }
      }
      return true;
    },

    async session({ session, user }) {
      if (session.user) {
        // Always read the authoritative role from the Prisma DB (not from token/cache)
        // This ensures manual DB changes (like the set-admin script) take effect immediately.
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true, id: true },
          });
          // @ts-ignore
          session.user.id = user.id;
          // @ts-ignore
          session.user.role = dbUser?.role ?? "USER";
        } catch {
          // @ts-ignore
          session.user.role = "USER";
        }
      }
      return session;
    },
  },
});
