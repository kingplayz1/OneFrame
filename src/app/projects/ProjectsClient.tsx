"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Film, X, Search, Layers, Gamepad2, Megaphone,
  Music, Sparkles, Palette, ExternalLink, User, SlidersHorizontal,
  RotateCcw, Video
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  category: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  status: string;
  editor?: { name: string; slug: string } | null;
};

function cleanUrl(url: string | null): string {
  if (!url) return "";
  let cleaned = url.trim();
  cleaned = cleaned.replace(/^[ "'“”`]+|[ "'“”`]+$/g, "").trim();
  return cleaned;
}

// Parse YouTube, Vimeo, or direct video file URLs into an embeddable format
function getEmbedDetails(rawUrl: string | null) {
  const url = cleanUrl(rawUrl);
  if (!url) return { type: "none", embedUrl: "" };

  const trimmed = url;

  // 1. YouTube (watch?v=, youtu.be/, shorts/, embed/)
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "iframe",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
      originalUrl: `https://www.youtube.com/watch?v=${ytMatch[1]}`,
      platform: "YouTube",
    };
  }

  // 2. Vimeo (vimeo.com/123456789)
  const vimeoMatch = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "iframe",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&autopause=0`,
      originalUrl: `https://vimeo.com/${vimeoMatch[1]}`,
      platform: "Vimeo",
    };
  }

  // 3. Direct HTML5 video (.mp4, .webm, .ogg) or raw video stream
  if (
    trimmed.match(/\.(mp4|webm|ogg|m3u8)(\?.*)?$/i) ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:video/")
  ) {
    return {
      type: "video",
      embedUrl: trimmed,
      originalUrl: trimmed,
      platform: "Direct Stream",
    };
  }

  // 4. Fallback — if it's an http link we try iframe embed
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return {
      type: "iframe",
      embedUrl: trimmed,
      originalUrl: trimmed,
      platform: "Web",
    };
  }

  return { type: "none", embedUrl: "" };
}

// Icon helper for category tags
function CategoryIcon({ category, size = 14 }: { category: string; size?: number }) {
  const cat = category.toLowerCase();
  if (cat === "all") return <Layers size={size} />;
  if (cat.includes("gaming")) return <Gamepad2 size={size} />;
  if (cat.includes("commercial")) return <Megaphone size={size} />;
  if (cat.includes("music")) return <Music size={size} />;
  if (cat.includes("vfx") || cat.includes("motion")) return <Sparkles size={size} />;
  if (cat.includes("color") || cat.includes("grade")) return <Palette size={size} />;
  if (cat.includes("reel") || cat.includes("short") || cat.includes("documentary")) return <Video size={size} />;
  return <Film size={size} />;
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "editor">("newest");

  // Only published projects
  const publishedProjects = useMemo(
    () => projects.filter((p) => p.status === "PUBLISHED"),
    [projects]
  );

  // Dynamic category list with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: publishedProjects.length };
    publishedProjects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [publishedProjects]);

  const categories = useMemo(
    () => ["All", ...Object.keys(categoryCounts).filter((c) => c !== "All")],
    [categoryCounts]
  );

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return publishedProjects
      .filter((p) => {
        const matchesCategory =
          activeCategory === "All" || p.category === activeCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.editor?.name &&
            p.editor.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "editor")
          return (a.editor?.name || "").localeCompare(b.editor?.name || "");
        return 0; // Default order (newest from DB)
      });
  }, [publishedProjects, activeCategory, searchQuery, sortBy]);

  const embedInfo = useMemo(
    () => (selectedProject ? getEmbedDetails(selectedProject.videoUrl) : null),
    [selectedProject]
  );

  return (
    <div className="min-h-screen bg-[#030303] text-foreground pt-32 pb-24 px-4 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, #007fd4 0%, transparent 40%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="w-12 h-1 bg-brand-accent mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter text-white drop-shadow-2xl">
            Project Vault
          </h1>
          <p className="text-lg text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
            Explore our curated selection of visual editing, VFX, and color grading masterpieces.
          </p>
        </motion.div>

        {/* ── Search & Filter Controls Toolbar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 space-y-4"
        >
          {/* Top Control Bar: Search Input + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search projects, categories, or editors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-11 pr-8 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#007fd4] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Right side stats & sort dropdown */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-[11px] uppercase tracking-widest text-gray-500 font-mono">
                {filteredProjects.length} of {publishedProjects.length} Projects
              </span>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#007fd4]" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "title" | "editor")
                  }
                  className="bg-black/60 border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#007fd4] cursor-pointer font-bold uppercase tracking-wider"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="title">Sort: Title (A-Z)</option>
                  <option value="editor">Sort: By Editor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sticky Categories Bar */}
          <div className="sticky top-20 z-30 flex items-center gap-2 overflow-x-auto py-3 bg-black/70 backdrop-blur-xl border-y border-white/10 px-4 rounded-2xl scrollbar-none shadow-2xl">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = categoryCounts[cat] || 0;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-[#007fd4] text-white shadow-[0_0_20px_rgba(0,127,212,0.6)]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  <CategoryIcon category={cat} size={14} />
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Project Cards Grid ── */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-zinc-950 border border-white/5 hover:border-[#007fd4] transition-all duration-500 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,127,212,0.25)] hover:-translate-y-2 relative flex flex-col"
                onClick={() => setSelectedProject(project)}
              >
                {/* Dynamic Card Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#007fd4]/15 to-purple-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0 pointer-events-none" />

                {/* Thumbnail Container */}
                <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                  {project.thumbnailUrl && cleanUrl(project.thumbnailUrl) ? (
                    <Image
                      src={cleanUrl(project.thumbnailUrl)}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <Film size={40} className="text-gray-700" />
                  )}

                  {/* Play Icon Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-[#007fd4] text-white flex items-center justify-center shadow-[0_0_30px_#007fd4] group-hover:scale-110 transition-transform">
                      <Play size={26} className="ml-1 fill-white" />
                    </div>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-[10px] text-white font-black tracking-widest uppercase border border-white/10 shadow-lg flex items-center gap-1.5">
                    <CategoryIcon category={project.category} size={12} />
                    {project.category}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 relative overflow-hidden flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter truncate group-hover:text-[#007fd4] transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  {project.editor && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <User size={12} className="text-[#007fd4]" /> Cut by:
                      </span>
                      <span className="text-white group-hover:text-[#007fd4] transition-colors">
                        {project.editor.name}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Empty State ── */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-6 bg-zinc-900/40 border border-white/10 rounded-3xl mt-10 max-w-lg mx-auto"
          >
            <Film size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-400 text-xs mb-6 font-light leading-relaxed">
              No videos match your active filter or search query ("
              <span className="text-[#007fd4]">{searchQuery || activeCategory}</span>
              ").
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 bg-[#007fd4] hover:bg-[#008cf2] text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw size={14} /> Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Universal Video Player Modal ── */}
      <AnimatePresence>
        {selectedProject && embedInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProject(null);
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 rounded-full flex items-center justify-center text-white transition-all border border-white/20 z-[10001] group shadow-2xl cursor-pointer"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-6xl bg-zinc-950 rounded-3xl overflow-hidden border border-white/10 relative shadow-[0_0_100px_rgba(0,127,212,0.25)] flex flex-col z-[10000]"
            >
              {/* Top Bar inside modal */}
              <div className="bg-black/80 border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-[#007fd4]/20 border border-[#007fd4]/40 text-[#007fd4] px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest shrink-0">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-white font-black text-lg md:text-xl uppercase tracking-tighter truncate">
                    {selectedProject.title}
                  </h2>
                </div>

                {/* External link button */}
                {embedInfo.originalUrl && (
                  <a
                    href={embedInfo.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors shrink-0 font-bold uppercase tracking-wider"
                  >
                    <span>{embedInfo.platform}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Video Player Box (16:9 ratio) */}
              <div className="aspect-video relative bg-black w-full flex items-center justify-center overflow-hidden">
                {embedInfo.type === "iframe" ? (
                  <iframe
                    src={embedInfo.embedUrl}
                    title={selectedProject.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : embedInfo.type === "video" ? (
                  <video
                    src={embedInfo.embedUrl}
                    autoPlay
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : selectedProject.thumbnailUrl && cleanUrl(selectedProject.thumbnailUrl) ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={cleanUrl(selectedProject.thumbnailUrl)}
                      alt={selectedProject.title}
                      fill
                      className="object-contain opacity-50"
                    />
                    <div className="relative z-10 text-center p-6 bg-black/80 rounded-2xl border border-white/10 max-w-md">
                      <Film size={40} className="text-gray-500 mx-auto mb-2" />
                      <p className="text-white font-bold text-sm">No Playable Video Stream</p>
                      <p className="text-gray-400 text-xs mt-1">This project does not have a direct video stream link attached.</p>
                    </div>
                  </div>
                ) : (
                  <Film size={64} className="text-gray-700" />
                )}
              </div>

              {/* Bottom Info Footer */}
              {selectedProject.editor && (
                <div className="bg-black/90 border-t border-white/10 px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <span>Editor:</span>
                    <span className="text-white">{selectedProject.editor.name}</span>
                  </div>
                  <Link
                    href={`/team/${selectedProject.editor.slug}`}
                    className="text-[11px] font-black uppercase tracking-widest text-[#007fd4] hover:text-white bg-[#007fd4]/10 hover:bg-[#007fd4] border border-[#007fd4]/30 px-4 py-2 rounded-xl transition-all"
                  >
                    View Profile
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
