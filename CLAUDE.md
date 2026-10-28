# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OneFrame Studios** — A Next.js 16.2.10 portfolio/admin site for a video editing studio. Built with React 19, TypeScript, Tailwind CSS 4, Prisma (MongoDB), NextAuth (Discord), Framer Motion, and Three.js (@react-three/fiber + drei).

## Commands

```bash
# Development
npm run dev              # Start dev server (Turbopack)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run postinstall      # Runs prisma generate

# Database
npx prisma db push       # Push schema changes to MongoDB
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts    # Seed database
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/set-admin.ts  # Promote users to ADMIN
```

## Architecture

### Key Directories
```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin dashboard (protected, ADMIN role required)
│   ├── api/                # API routes
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   └── admin/          # Admin API endpoints
│   ├── about/, contact/, projects/, services/, team/  # Public pages
│   ├── globals.css         # Tailwind + custom CSS
│   ├── layout.tsx          # Root layout (Navbar, Footer, CustomCursor, SoundEffects)
│   ├── page.tsx            # Home page (server component, fetches data)
│   └── HomeClient.tsx      # Heavy client component (hero, services, featured work, stats, CTA)
├── components/             # Shared components
│   ├── Navbar.tsx, Footer.tsx, AdminSidebar.tsx
│   ├── Cinematic3D.tsx     # Three.js hero background (react-three-fiber)
│   ├── CustomCursor.tsx, SoundEffects.tsx
│   └── AdminCharts.tsx     # Recharts dashboard
├── auth.ts                 # NextAuth config (Discord provider, role logic)
├── database/prisma.ts      # Prisma singleton
└── generated/              # Generated Prisma client
```

### Database (MongoDB via Prisma)
Models: `User`, `Account`, `Session`, `VerificationToken`, `Project`, `Editor`, `TimelineEvent`, `ContactSubmission`, `SiteConfig`

Key relationships:
- `User` has `role` (default "USER", promoted to "ADMIN" via Discord ID checks)
- `Editor` — team members with portfolio data (slug-based URLs)
- `Project` — showcase work linked to `Editor`
- `SiteConfig` — key-value store for contact info + dynamic admin Discord IDs

### Authentication (NextAuth v5 beta)
- Provider: Discord OAuth (scopes: `identify email guilds guilds.members.read`)
- Admin detection (in `auth.ts:79-119`):
  1. Hardcoded `MASTER_ADMIN_DISCORD_IDS` + `ADMIN_DISCORD_IDS` env
  2. `SiteConfig.adminDiscordIds` from DB
  3. Discord guild role check (`WEB_ADMIN_ROLE_ID`)
- Session callback reads role fresh from DB on every request

### Styling
- Tailwind CSS 4 with `@theme` directive
- Custom colors: `--color-brand-accent` (#007fd4), `--color-brand-dark` (#050505)
- Cinematic aesthetic: dark theme, film grain overlays, custom cursor, sound effects

### 3D/Animation Stack
- `@react-three/fiber` + `@react-three/drei` for WebGL hero background
- `framer-motion` for scroll/page animations
- `CustomCursor` + `SoundEffects` for immersive UX

## Important Patterns

### Server vs Client Components
- `page.tsx` files are Server Components by default (fetch data, pass to Client Components)
- Heavy interactive sections use `"use client"` (HomeClient, Cinematic3D, AdminCharts)
- Admin pages are Server Components with `auth()` call for protection

### API Routes
- Admin APIs under `src/app/api/admin/` — CRUD for projects, editors, contacts, timeline, settings
- All admin APIs check `session?.user?.role === "ADMIN"` before operations

### Prisma Usage
- Singleton in `src/database/prisma.ts` (prevents hot-reload connection exhaustion)
- Import via `import { prisma } from "@/auth"` (re-exported from auth.ts)

### Path Aliases
- `@/*` → `./src/*` (configured in tsconfig.json)

## Environment Variables
Required in `.env`:
- `DATABASE_URL` — MongoDB connection string
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` — Discord OAuth
- `AUTH_SECRET` / `NEXTAUTH_SECRET` — NextAuth secret
- `DISCORD_WEB_ADMIN_ROLE_ID` — Discord role for admin check
- `DISCORD_GUILD_ID` (optional) — Specific guild for role check
- `ADMIN_DISCORD_IDS` (optional) — Comma-separated additional admin Discord IDs

## Notes for Future Work
- The codebase uses **Next.js 16** with **React 19** — some patterns may differ from older versions
- All admin routes require ADMIN role; middleware not used, checks are inline in page/API
- Cinematic 3D background is heavy — lazy-load or optimize for production if needed
- `Cinematic3D` uses module-level mouse state for SSR compatibility
- `HomeClient.tsx` is ~500 lines — consider splitting if adding more sections