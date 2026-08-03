"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Play, Pause, Activity, Aperture, Film, MonitorPlay,
  ArrowRight, ArrowUpRight, Plus, ChevronDown
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

/* ── Animated counter ── */
function Counter({ to, suffix = "" }: { to: number | string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const target = typeof to === 'string' ? parseInt(to) : to;
  const isNumber = !isNaN(target);

  useEffect(() => {
    if (!isNumber) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 16);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, isNumber]);

  if (!isNumber) return <span>{to}{suffix}</span>;
  return <span ref={ref}>{count}{suffix}</span>;
}

const services = [
  { title: "Visual Effects", desc: "Seamless integration of digital assets, particle systems, and complex compositing for hyper-real realities.", icon: <Activity size={24} /> },
  { title: "Color Grading", desc: "Setting the exact emotional tone. Native HDR grading pipelines and bespoke show LUTs.", icon: <Aperture size={24} /> },
  { title: "Offline Editing", desc: "Crafting the perfect narrative rhythm. Finding the beat before the final polish.", icon: <Film size={24} /> },
  { title: "Finishing & QC", desc: "High-end mastering, conform, and broadcast-ready delivery across all cinema standards.", icon: <MonitorPlay size={24} /> },
];

const clients = ["Netflix", "HBO Max", "Sony Music", "Riot Games", "Nike", "Porsche", "Apple", "Amazon", "A24"];

function cleanUrl(url: string | null): string {
  if (!url) return "";
  let cleaned = url.trim();
  cleaned = cleaned.replace(/^[ "'“”`]+|[ "'“”`]+$/g, "").trim();
  return cleaned;
}

type FeaturedProject = {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  editor?: { name: string; slug: string } | null;
}

export default function HomeClient({ 
  featuredProjects, 
  teamCount, 
  projectCount 
}: { 
  featuredProjects: FeaturedProject[],
  teamCount: number,
  projectCount: number
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [activeService, setActiveService] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Reduced scale transform to avoid the "too zoom" feeling
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  const stats = [
    { value: `${projectCount || 500}+`, label: "Projects Mastered" },
    { value: `${teamCount || 10}`, label: "Elite Artists" },
    { value: "8K+", label: "Native Resolution" },
    { value: "0ms", label: "Creative Friction" },
  ];

  /* Timecode */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      let f = 0, s = 0, m = 0;
      interval = setInterval(() => {
        f++;
        if (f >= 24) { f = 0; s++; }
        if (s >= 60) { s = 0; m++; }
        setTimecode(`01:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`);
      }, 1000 / 24);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full bg-[#030303] text-white selection:bg-[#007fd4] selection:text-white font-sans">
      
      {/* ── Global Cinematic Grain ── */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

      {/* ══════════════════════════════════════════════
          HERO — Immersive Reel Background
      ══════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#030303]">

        {/* Dynamic Background Video */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <video
            autoPlay loop muted playsInline
            className="w-full h-full object-cover opacity-[0.45] mix-blend-screen filter contrast-125 saturate-50"
            poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1920"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-2256-large.mp4" type="video/mp4" />
          </video>
          {/* Deep Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] opacity-80" />
          <div className="absolute inset-0 bg-[#007fd4]/10 mix-blend-color" />
        </motion.div>

        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 z-[1] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0zOS0xdjM5SDFWMWgzOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-30 pointer-events-none" />

        {/* Post-Production HUD Specs */}
        <div className="absolute top-32 left-6 md:left-12 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-sm w-max">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE STREAM
          </div>
          <div className="text-white/40 text-[10px] font-mono tracking-widest">SEQ: MAIN_MASTER_V7</div>
          <div className="text-white/40 text-[10px] font-mono tracking-widest">LUT: ARRI_LOGC3_TO_REC709</div>
        </div>

        <div className="absolute top-32 right-6 md:right-12 z-10 flex flex-col items-end gap-2 text-right pointer-events-none hidden sm:flex">
          <div className="text-white/40 text-[10px] font-mono tracking-widest">RES: 8192 x 4320 (8K)</div>
          <div className="text-white/40 text-[10px] font-mono tracking-widest">FPS: 23.976</div>
          <div className="text-white/40 text-[10px] font-mono tracking-widest">AUDIO: 5.1 ATMOS</div>
        </div>

        {/* Hero Central Content */}
        <motion.div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-12" style={{ opacity: heroOpacity }}>
          
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-6 flex items-center justify-center gap-3">
             <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#007fd4]" />
             <span className="text-[#007fd4] text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">Post-Production Studio</span>
             <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#007fd4]" />
          </motion.div>

          {/* Scaled down the massive font size */}
          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl">
            One<span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-200 via-gray-500 to-gray-800">Frame</span>
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-sm md:text-base lg:text-lg text-gray-400 font-light tracking-wide mt-8 max-w-2xl mx-auto leading-relaxed">
            We architect cinematic realities. A collective of rogue editors and color scientists operating at the absolute bleeding edge of digital media.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <Link href="/projects"
              className="group relative overflow-hidden flex items-center gap-3 bg-white text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <span className="relative z-10 flex items-center gap-3">
                Explore Vault <Play size={16} className="fill-current" />
              </span>
              <div className="absolute inset-0 bg-[#007fd4] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-0" />
              <span className="absolute z-10 flex items-center gap-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore Vault <Play size={16} className="fill-current" />
              </span>
            </Link>
            
            <Link href="/contact"
              className="group flex items-center gap-3 bg-transparent border border-white/20 hover:border-white/60 hover:bg-white/5 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-md">
              Book Studio <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} 
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
           <span className="text-[9px] uppercase tracking-[0.3em] font-mono">Scroll</span>
           <ChevronDown size={16} className="animate-bounce" />
        </motion.div>

        {/* Timeline UI (Bottom Edge) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-2xl border-t border-white/10 pt-4 pb-5 px-6 md:px-12 flex flex-col gap-3">
          <div className="flex justify-between items-end mb-1">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#007fd4] hover:bg-[#008cf2] transition-transform hover:scale-105 shadow-[0_0_20px_rgba(0,127,212,0.4)] text-white">
                {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="ml-1 fill-current" />}
              </button>
              <div>
                <div className="text-white font-mono text-xl md:text-2xl font-bold leading-none tracking-tight">{timecode}</div>
                <div className="text-[#007fd4] text-[10px] uppercase tracking-[0.2em] font-black mt-1.5">Timeline_V4_Master</div>
              </div>
            </div>
            <div className="hidden md:flex gap-1.5">
              {['V3', 'V2', 'V1', 'A1', 'A2', 'A3'].map(track => (
                <div key={track} className="bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-[10px] font-mono text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">{track}</div>
              ))}
            </div>
          </div>

          {/* Scrubber track */}
          <div className="relative h-8 w-full group cursor-pointer mt-1 flex items-center">
            {/* Track background lines */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMCIgeT0iNCIgd2lkdGg9IjEiIGhlaWdodD0iMiIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==')] opacity-40" />
            <div className="absolute left-0 right-0 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#007fd4] w-1/3 relative shadow-[0_0_10px_#007fd4]">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/80" />
              </div>
            </div>
            {/* Playhead */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-white left-1/3 shadow-[0_0_15px_#fff]">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-black font-black bg-white px-1.5 py-0.5 rounded shadow-lg">
                {timecode.split(':')[3]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CLIENT TICKER
      ══════════════════════════════════════════════ */}
      <div className="w-full bg-[#030303] border-b border-white/5 py-10 overflow-hidden relative z-10">
        <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[#030303] to-transparent z-10" />
        <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[#030303] to-transparent z-10" />
        
        <div className="flex whitespace-nowrap animate-ticker gap-24 px-8 opacity-30 hover:opacity-60 transition-opacity duration-500">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="flex gap-24 items-center">
              {clients.map(c => (
                <span key={c} className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-transparent" 
                      style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>
                  {c}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CAPABILITIES
      ══════════════════════════════════════════════ */}
      <section className="py-24 md:py-36 relative z-10 overflow-hidden">
        {/* Abstract Ambient Glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#007fd4]/5 blur-[200px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-2 gap-16 md:gap-20 items-center">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="relative z-10">
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-4 mb-6">
               <div className="w-12 h-1 bg-[#007fd4]" />
               <span className="text-[#007fd4] text-[10px] font-black uppercase tracking-[0.3em]">Infrastructure</span>
            </motion.div>
            <motion.h2 custom={0} variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 uppercase tracking-tighter leading-none">
              System<br />Capabilities
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="text-gray-400 text-base md:text-lg mb-12 max-w-lg font-light leading-relaxed">
              We operate exclusively on custom-built workstations and secure networks, designed to process native RAW media with zero latency.
            </motion.p>
            
            <div className="space-y-4 relative">
              {/* Active glow indicator line */}
              <div 
                className="absolute left-0 w-1 bg-[#007fd4] rounded-full transition-all duration-500 ease-out z-10 shadow-[0_0_15px_#007fd4]" 
                style={{ top: `${activeService * 25}%`, height: '25%' }} 
              />
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/5 rounded-full" />

              {services.map((s, i) => (
                <motion.div key={i} custom={i + 2} variants={fadeUp}
                  onMouseEnter={() => setActiveService(i)}
                  className={`pl-8 pr-6 py-6 rounded-2xl cursor-pointer transition-all duration-500 flex items-start gap-6 group
                    ${activeService === i
                      ? 'bg-gradient-to-r from-white/5 to-transparent'
                      : 'hover:bg-white/[0.02]'}`}>
                  <div className={`p-3 rounded-2xl transition-all duration-500 mt-1
                    ${activeService === i ? 'bg-[#007fd4] text-white shadow-[0_0_20px_rgba(0,127,212,0.5)] scale-110' : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300'}`}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-black uppercase tracking-wider transition-colors duration-300 
                      ${activeService === i ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{s.title}</h3>
                    
                    <div className={`grid transition-all duration-500 ease-in-out overflow-hidden
                      ${activeService === i ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                      <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed overflow-hidden">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Premium Cinematic Preview */}
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden hidden md:block border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-zinc-950">
            <AnimatePresence mode="wait">
              <motion.div key={activeService}
                initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }} 
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)' }} 
                transition={{ duration: 0.8, ease: "easeOut" }} 
                className="absolute inset-0">
                <Image
                  src={[
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=1200",
                  ][activeService]}
                  alt="Service preview" fill sizes="(max-width: 1280px) 50vw, 40vw" className="object-cover mix-blend-luminosity opacity-50" />
                
                {/* Vignettes & Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#007fd4]/20 to-transparent mix-blend-overlay" />
                
                {/* HUD Elements on Image */}
                <div className="absolute top-8 left-8 flex flex-col gap-2 opacity-50">
                   <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                     <div className="w-1 h-1 bg-white rounded-full" />
                   </div>
                   <div className="w-px h-12 bg-white/30 ml-4" />
                </div>

                <div className="absolute bottom-10 left-10 right-10">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#007fd4] font-black mb-2">{String(activeService + 1).padStart(2, '0')} // PROTOCOL</p>
                    <p className="text-2xl font-black text-white uppercase tracking-tight">{services[activeService].title}</p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED WORK
      ══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative z-10 overflow-hidden bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-4">
              <div className="w-12 h-1 bg-white" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">The Vault</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white">
              Featured Work
            </motion.h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Link href="/projects" className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full text-white transition-all text-xs uppercase tracking-widest font-black">
              View All Projects <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {featuredProjects.length > 0 ? featuredProjects.map((project, i) => (
            <Link key={project.id} href={`/projects`} passHref legacyBehavior>
                <motion.a initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: i * 0.15 }}
                  className={`group relative bg-zinc-900 rounded-[1.5rem] overflow-hidden cursor-pointer block border border-white/10 hover:border-white/30 transition-colors shadow-2xl
                    ${i % 2 === 1 ? 'md:mt-16' : ''} aspect-[16/10]`}>
                  
                  {project.thumbnailUrl ? (
                    <Image src={cleanUrl(project.thumbnailUrl)} alt={project.title} fill sizes="(max-width: 768px) 100vw, 50vw" 
                           className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-zinc-950"><Film size={48} /></div>
                  )}
                  
                  {/* Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#007fd4]/20 to-transparent opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-95 group-hover:scale-100">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                      <Play size={24} className="ml-1 fill-current" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[#007fd4] text-[10px] uppercase tracking-[0.3em] font-black mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#007fd4] rounded-full" />
                        {project.category}
                      </p>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter truncate leading-none mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400">
                        {project.title}
                      </h3>
                      {project.editor && (
                          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            Cut by <span className="text-white">{project.editor.name}</span>
                          </p>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500 delay-100 shrink-0">
                       <ArrowUpRight size={18} />
                    </div>
                  </div>
                </motion.a>
            </Link>
          )) : (
              <div className="col-span-2 text-center text-gray-500 py-20 border border-white/5 rounded-[1.5rem] bg-zinc-900/50">
                <Film size={40} className="mx-auto mb-4 opacity-50" />
                <p className="font-mono text-sm uppercase tracking-widest">No featured projects yet.</p>
              </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS (HUD Style)
      ══════════════════════════════════════════════ */}
      <section className="py-20 relative z-10 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[1.5rem] text-center hover:bg-white/[0.04] hover:border-white/10 transition-colors">
                <h4 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tighter">
                  <Counter to={stat.value.replace(/\D/g, '') || stat.value} suffix={stat.value.replace(/[\d]/g, '')} />
                </h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA (Final Transmission)
      ══════════════════════════════════════════════ */}
      <section className="py-24 px-6 max-w-5xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center shadow-2xl">
          
          {/* Internal Glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#007fd4]/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#9c27b0]/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

          <div className="md:w-[55%] relative z-10">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
               <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Network Open</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter leading-none text-white">
              Initiate<br />Contact
            </h2>
            <p className="text-gray-400 mb-8 font-light text-base leading-relaxed">
              Secure a slot in our pipeline. Transmit your project scope, budget, and timeline. Our producers will respond within 24 hours.
            </p>
            <ul className="space-y-3">
              {["End-to-End Encryption", "Priority Rendering Allocation", "Dedicated Lead Editor"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs text-gray-300 font-bold uppercase tracking-wider">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#007fd4]">
                    <ArrowRight size={12} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-[45%] flex items-center justify-center relative z-10 w-full">
            <Link href="/contact"
              className="relative w-full max-w-[16rem] aspect-square bg-[#007fd4] hover:bg-white rounded-full flex flex-col items-center justify-center p-10 transition-all duration-700 group shadow-[0_0_40px_rgba(0,127,212,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
              
              <div className="relative z-10 flex flex-col items-center text-white group-hover:text-black transition-colors duration-500">
                <Plus size={36} className="mb-3 group-hover:rotate-90 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="text-2xl font-black uppercase tracking-tighter mb-1 text-center leading-none">Book<br/>Studio</span>
              </div>
              
              {/* Spinning text ring - pure css animation */}
              <div className="absolute inset-3 border border-white/20 group-hover:border-black/10 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-6 border border-white/10 group-hover:border-black/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
