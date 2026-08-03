import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/database/prisma";

export { prisma };

const WEB_ADMIN_ROLE_ID = process.env.DISCORD_ADMIN_ROLE_ID || "1533832432476749885";

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
      // On fresh sign-in with Discord, attempt role detection via API
      if (account?.provider === "discord" && account?.access_token) {
        const hasGuildScope = account.scope?.includes("guilds");

        let assignedRole = "USER";
        if (hasGuildScope) {
          const isAdmin = await hasDiscordWebAdminRole(account.access_token);
          if (isAdmin) assignedRole = "ADMIN";
        }

        // Always persist (upsert) role if we can detect it
        if (user.id && hasGuildScope) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: assignedRole },
            });
            console.log(`[Discord Auth] Set role="${assignedRole}" for user ${user.email}`);
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
