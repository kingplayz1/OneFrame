"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ExternalLink, MapPin, Play, ArrowLeft,
  Link2, Camera, Radio, ArrowUpRight,
  ChevronDown, Film, Sparkles, Award,
} from "lucide-react";

type Member = {
  id: string; name: string; slug: string; role: string; bio: string | null;
  software: string[]; specialties: string[]; imageUrl: string | null;
  coverImageUrl: string | null; showreelUrl: string | null;
  instagramUrl: string | null; youtubeUrl: string | null; twitterUrl: string | null;
  yearsExp: number | null; projectCount: number | null; location: string | null;
  projects?: { id: string; title: string; category: string; thumbnailUrl: string | null; videoUrl: string | null }[];
};

/* ── Animated counter ── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(to / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= to) { setCount(to); clearInterval(timer); }
          else setCount(start);
        }, 16);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Skill bar ── */
function SkillBar({ label, level }: { label: string; level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-xs font-mono text-gray-400">
        <span>{label}</span>
        <span className="text-[#007fd4]">{level}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: visible ? `${level}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="h-full bg-gradient-to-r from-[#007fd4] to-[#9c27b0] rounded-full shadow-[0_0_8px_#007fd4]"
        />
      </div>
    </div>
  );
}

/* ── Infinite marquee strip ── */
function MarqueeStrip({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden py-6 border-y border-white/5 my-24">
      <div className="flex whitespace-nowrap animate-ticker gap-12">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 flex items-center gap-12">
            {item} <span className="w-1 h-1 rounded-full bg-[#007fd4] inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } })
};

export default function MemberPortfolioClient({ member }: { member: Member }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const coverY = useTransform(smooth, [0, 1], ["0%", "35%"]);
  const textY = useTransform(smooth, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(smooth, [0, 0.8], [1, 0]);

  // Read progress bar
  const { scrollYProgress: pageProgress } = useScroll();
  const scaleX = useSpring(pageProgress, { stiffness: 100, damping: 30 });

  const socials = [
    member.instagramUrl && { href: member.instagramUrl, label: "Instagram", Icon: Camera, color: "#E1306C" },
    member.youtubeUrl  && { href: member.youtubeUrl,  label: "YouTube",   Icon: Radio,  color: "#FF0000" },
    member.twitterUrl  && { href: member.twitterUrl,  label: "Twitter / X", Icon: Link2, color: "#1DA1F2" },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Camera; color: string }[];

  // Software skill levels (hardcoded progression visuals)
  const softwareLevels: Record<string, number> = {
    "Premiere Pro": 95, "DaVinci Resolve": 90, "After Effects": 88, "Nuke": 85,
    "Houdini": 75, "Avid Media Composer": 80, "Final Cut Pro": 82,
  };

  const marqueeItems = [
    ...(member.specialties.length ? member.specialties : ["Post-Production"]),
    ...(member.software.length ? member.software : ["Premier Pro"]),
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

      {/* ── Progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007fd4] via-white to-[#9c27b0] z-[9999] origin-left"
        style={{ scaleX }}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative h-screen flex flex-col justify-end overflow-hidden">

        {/* Cover with parallax */}
        <motion.div className="absolute inset-0" style={{ y: coverY }}>
          {member.coverImageUrl ? (
            <Image src={member.coverImageUrl} alt={member.name} fill sizes="100vw" className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#007fd4]/20 via-zinc-900 to-[#9c27b0]/20" />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-[#030303]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/80 to-transparent" />
        </motion.div>

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="absolute top-28 left-6 md:left-14 z-20">
          <Link href="/about" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gray-500 hover:text-white transition-colors font-bold">
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" /> Roster
          </Link>
        </motion.div>

        {/* Content */}
        <motion.div className="relative z-10 px-6 md:px-14 pb-16 md:pb-24" style={{ y: textY, opacity: heroOpacity }}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            
            {/* Left: identity */}
            <div>
              {/* Avatar + online dot */}
              <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-white/10 mb-8 shadow-2xl bg-zinc-900">
                {member.imageUrl
                  ? <Image src={member.imageUrl} alt={member.name} fill sizes="128px" className="object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/20">{member.name.charAt(0)}</div>}
                {/* Online status */}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#007fd4] rounded-full shadow-[0_0_12px_#007fd4] border-2 border-[#030303]" />
              </motion.div>

              {/* Status pill */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_#4ade80]" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-green-400 font-bold">Available for Projects</span>
              </motion.div>

              <div className="w-10 h-1 bg-brand-accent mb-5" />
              <motion.h1 custom={0} initial="hidden" animate="visible" variants={fadeUp}
                className="text-6xl sm:text-8xl md:text-[9rem] font-black uppercase tracking-tighter leading-none text-white">
                {member.name}
              </motion.h1>
              <motion.p custom={1} initial="hidden" animate="visible" variants={fadeUp}
                className="text-[#007fd4] font-bold uppercase tracking-[0.3em] text-sm mt-4">
                {member.role}
              </motion.p>
              {member.location && (
                <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp}
                  className="text-gray-500 flex items-center gap-1.5 mt-3 text-xs font-mono uppercase tracking-widest">
                  <MapPin size={12} /> {member.location}
                </motion.p>
              )}
            </div>

            {/* Right: stat cards */}
            {(member.yearsExp || member.projectCount) && (
              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex gap-3 shrink-0">
                {member.yearsExp && (
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-6 text-center hover:border-[#007fd4]/30 transition-colors">
                    <p className="text-5xl font-black text-white"><Counter to={member.yearsExp} suffix="+" /></p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-2">Yrs Exp.</p>
                  </div>
                )}
                {member.projectCount && (
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-6 text-center hover:border-[#9c27b0]/30 transition-colors">
                    <p className="text-5xl font-black text-white"><Counter to={member.projectCount} suffix="+" /></p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-2">Projects</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 text-gray-600">
          <ChevronDown size={16} className="animate-bounce" />
          <div className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════ CONTENT ═══════════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-28">

        {/* Bio */}
        {member.bio && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-32">
            <div className="grid lg:grid-cols-12 gap-14 items-start">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">01 / Profile</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mt-3">The Story</h2>
                <div className="flex gap-3 mt-8">
                  <div className="text-center p-4 bg-zinc-900/60 border border-white/10 rounded-2xl">
                    <Film size={20} className="text-[#007fd4] mx-auto mb-2" />
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Editor</p>
                  </div>
                  <div className="text-center p-4 bg-zinc-900/60 border border-white/10 rounded-2xl">
                    <Award size={20} className="text-[#9c27b0] mx-auto mb-2" />
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Award</p>
                  </div>
                  <div className="text-center p-4 bg-zinc-900/60 border border-white/10 rounded-2xl">
                    <Sparkles size={20} className="text-green-400 mx-auto mb-2" />
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Pro</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <div className="relative pl-8 border-l-2 border-[#007fd4]/40">
                  <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#007fd4] shadow-[0_0_15px_#007fd4]" />
                  <p className="text-gray-300 text-xl font-light leading-[1.9]">{member.bio}</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Marquee strip */}
        <MarqueeStrip items={marqueeItems} />

        {/* Specialties */}
        {member.specialties.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-32">
            <div className="grid lg:grid-cols-12 gap-14 items-start">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">02 / Expertise</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mt-3">Core Skills</h2>
              </div>
              <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {member.specialties.map((s, i) => (
                  <motion.div key={s} custom={i} variants={fadeUp}
                    className="group relative overflow-hidden border border-white/8 hover:border-[#007fd4]/50 rounded-2xl px-6 py-5 cursor-default transition-all duration-400 hover:shadow-[0_0_40px_rgba(0,127,212,0.12)] bg-zinc-900/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#007fd4]/5 to-[#9c27b0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="relative">
                      <div className="w-6 h-6 bg-[#007fd4]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#007fd4]/20 transition-colors">
                        <div className="w-1.5 h-1.5 bg-[#007fd4] rounded-full" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-white block leading-tight">{s}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Software + Skill Bars */}
        {member.software.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-32">
            <div className="grid lg:grid-cols-12 gap-14 items-start">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">03 / Arsenal</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mt-3">Software</h2>
                <p className="text-gray-500 text-sm font-light mt-4 leading-relaxed">Proficiency levels based on production hours and project complexity.</p>
              </div>
              <div className="lg:col-span-8 space-y-5 pt-2">
                {member.software.map(s => (
                  <SkillBar key={s} label={s} level={softwareLevels[s] ?? 80} />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Showreel */}
        {member.showreelUrl && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-32">
            <div className="grid lg:grid-cols-12 gap-14 items-start">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">04 / Work</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mt-3">Showreel</h2>
                <p className="text-gray-500 text-sm font-light mt-4 leading-relaxed">Click to watch the official reel on YouTube.</p>
              </div>
              <div className="lg:col-span-8">
                <a href={member.showreelUrl} target="_blank" rel="noopener noreferrer"
                  className="group relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 flex items-center justify-center hover:border-[#007fd4]/40 transition-all duration-500 shadow-2xl hover:shadow-[0_0_80px_rgba(0,127,212,0.12)] block">
                  {member.coverImageUrl && (
                    <Image src={member.coverImageUrl} alt="Showreel" fill sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Animated rings */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="absolute w-32 h-32 rounded-full border border-[#007fd4]/20 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
                    <div className="absolute w-24 h-24 rounded-full border border-[#007fd4]/30 group-hover:scale-125 group-hover:opacity-0 transition-all duration-500" />
                    <motion.div whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:bg-[#007fd4] group-hover:text-white group-hover:shadow-[0_0_40px_#007fd4] transition-all duration-300">
                      <Play size={28} className="ml-2" />
                    </motion.div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
                    <div>
                      <p className="text-white font-black text-xl uppercase tracking-tighter">{member.name} — Official Showreel</p>
                      <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-1"><ExternalLink size={10} /> Opens on YouTube</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#007fd4] group-hover:bg-[#007fd4]/10 transition-all">
                      <ArrowUpRight size={16} className="text-white/40 group-hover:text-[#007fd4] transition-colors" />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </motion.section>
        )}

        {/* Selected Works (Projects) */}
        {member.projects && member.projects.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-32">
            <div className="grid lg:grid-cols-12 gap-14 items-start">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">05 / Vault</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mt-3">Selected Works</h2>
                <p className="text-gray-500 text-sm font-light mt-4 leading-relaxed">Projects cut and delivered by {member.name}.</p>
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {member.projects.map((project, i) => (
                  <Link key={project.id} href={`/projects`} className="group relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer block border border-white/5 hover:border-white/20 transition-colors">
                    {project.thumbnailUrl ? (
                      <Image src={project.thumbnailUrl} alt={project.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <Film size={32} className="text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        <Play size={18} className="ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-[#007fd4] text-[9px] uppercase tracking-widest font-black mb-1">{project.category}</p>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter truncate">{project.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Socials */}
        {socials.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-32">
            <div className="grid lg:grid-cols-12 gap-14 items-start">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">06 / Connect</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mt-3">Channels</h2>
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {socials.map(({ href, label, Icon, color }) => (
                  <motion.a key={label} whileHover={{ y: -4, scale: 1.02 }}
                    href={href} target="_blank" rel="noopener noreferrer"
                    className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 bg-zinc-900/60 border border-white/10 hover:border-white/20 p-8 rounded-2xl transition-all shadow-lg hover:shadow-2xl text-center">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `radial-gradient(ellipse at center, ${color}10 0%, transparent 70%)` }} />
                    <Icon size={24} className="relative z-10 text-gray-500 group-hover:text-white transition-colors" />
                    <span className="relative z-10 font-black text-xs text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">{label}</span>
                    <ArrowUpRight size={12} className="relative z-10 text-gray-700 group-hover:text-gray-400 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 bg-zinc-900/50">
            <div className="absolute inset-0 bg-gradient-to-br from-[#007fd4]/10 via-transparent to-[#9c27b0]/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#007fd4]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#9c27b0]/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10 text-center md:text-left">
              <div className="w-8 h-1 bg-brand-accent mb-6 mx-auto md:mx-0" />
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
                Work with {member.name}
              </h2>
              <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">Ready to create something extraordinary? Let's make it happen.</p>
            </div>
            <Link href="/contact"
              className="relative z-10 shrink-0 group flex items-center gap-3 bg-white text-black hover:bg-[#007fd4] hover:text-white font-black uppercase tracking-widest px-10 py-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-[0_0_60px_rgba(0,127,212,0.4)] text-sm">
              Initiate Contact
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
