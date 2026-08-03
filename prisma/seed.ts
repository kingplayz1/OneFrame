import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎬 Seeding OneFrame Studios database...");

  // ── Upsert Editors ──────────────────────────────────────────────────────────

  const vivek = await prisma.editor.upsert({
    where: { slug: "vivek" },
    update: {},
    create: {
      name: "Vivek",
      slug: "vivek",
      role: "Heads Editor",
      bio: "Lead editor at OneFrame Studios with a sharp eye for storytelling, rhythm, and cinematic pacing. Specialising in high-octane gaming montages and long-form content that keeps viewers locked in till the last frame.",
      software: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
      specialties: ["Gaming Videos", "Long-Form Editing", "Reels", "Motion Graphics"],
      location: "India",
      yearsExp: 3,
      projectCount: 50,
    },
  });

  const anurag = await prisma.editor.upsert({
    where: { slug: "anurag-edits" },
    update: {},
    create: {
      name: "Anurag Edits",
      slug: "anurag-edits",
      role: "Video Editor",
      bio: "A versatile video editor with a strong portfolio of commercial, branded content, and short-form social media edits. Passionate about visual storytelling and delivering polished finishes on every frame.",
      software: ["Premiere Pro", "After Effects", "Final Cut Pro"],
      specialties: ["Short-Form Content", "Reels", "Commercial Editing", "Social Media"],
      instagramUrl: "https://ytjobs.co/talent/vitrine/390730",
      location: "India",
      yearsExp: 2,
      projectCount: 30,
    },
  });

  const niloy = await prisma.editor.upsert({
    where: { slug: "niloy-das" },
    update: {},
    create: {
      name: "Niloy Das",
      slug: "niloy-das",
      role: "Video Editor",
      bio: "Creative video editor with a strong design sensibility, blending visual effects, motion graphics, and precise cutting to craft immersive visual experiences. Portfolio available on Behance.",
      software: ["Premiere Pro", "After Effects", "Photoshop"],
      specialties: ["VFX Integration", "Motion Graphics", "Color Grading", "Short Films"],
      instagramUrl: "https://www.behance.net/niloydas15",
      location: "India",
      yearsExp: 2,
      projectCount: 25,
    },
  });

  console.log(`✅ Editors seeded: ${vivek.name}, ${anurag.name}, ${niloy.name}`);

  // ── Upsert Showcase Projects ─────────────────────────────────────────────────

  const projects = [
    // Vivek's projects
    {
      title: "NEON BATTLEGROUND",
      category: "Gaming",
      description: "A high-octane gaming montage featuring rapid cuts, VFX overlays, and cinematic slow-mos that push the energy to the limit.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200",
      editorSlug: "vivek",
    },
    {
      title: "APEX CHRONICLES",
      category: "Gaming",
      description: "Long-form documentary-style gaming content, following the journey of a pro player through ranked matches and tournaments.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200",
      editorSlug: "vivek",
    },
    {
      title: "KILL STREAK VOL.2",
      category: "Gaming",
      description: "Explosive gaming reel featuring frame-perfect cuts timed to a custom soundtrack drop.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=1200",
      editorSlug: "vivek",
    },
    {
      title: "GRID SERIES — EP.4",
      category: "Gaming",
      description: "A full long-form gaming episode with story-driven commentary, lower-thirds, and cinematic b-roll transitions.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&q=80&w=1200",
      editorSlug: "vivek",
    },
    // Anurag's projects
    {
      title: "BRAND PULSE",
      category: "Commercial",
      description: "A branded short-form commercial cut for a lifestyle brand. Clean, confident edits with a sharp colour grade.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=1200",
      editorSlug: "anurag-edits",
    },
    {
      title: "REELFIRE — SOCIAL CUT",
      category: "Reel",
      description: "A fast-paced Instagram Reel cut with trending audio and dynamic transitions designed for maximum engagement.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
      editorSlug: "anurag-edits",
    },
    // Niloy's projects
    {
      title: "SYNTHETIC SOULS",
      category: "Short Film",
      description: "A sci-fi short film with deep VFX integration, particle effects, and a desaturated, moody color grade.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
      editorSlug: "niloy-das",
    },
    {
      title: "MOTION THEORY",
      category: "Motion Graphics",
      description: "A motion design showcase reel with kinetic typography, 2.5D parallax, and fluid animated sequences.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
      editorSlug: "niloy-das",
    },
    {
      title: "CHROMATIC DRIFT",
      category: "Color Grading",
      description: "A color grading showcase demonstrating teal-orange Hollywood LUTs, skin tone preservation, and scene-to-scene grade matching.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200",
      editorSlug: "niloy-das",
    },
  ];

  for (const project of projects) {
    const editor = project.editorSlug === "vivek" ? vivek : project.editorSlug === "anurag-edits" ? anurag : niloy;
    const existing = await prisma.project.findFirst({ where: { title: project.title } });
    if (!existing) {
      await prisma.project.create({
        data: {
          title: project.title,
          category: project.category,
          description: project.description,
          videoUrl: project.videoUrl,
          thumbnailUrl: project.thumbnailUrl,
          status: "PUBLISHED",
          editorId: editor.id,
        },
      });
      console.log(`  + Project: "${project.title}" → ${editor.name}`);
    } else {
      console.log(`  ⏭  Skipping existing project: "${project.title}"`);
    }
  }

  console.log("\n✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
