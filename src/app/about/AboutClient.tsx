"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight, MapPin, Film, Sparkles, Award, Users, Wrench, CheckCircle2
} from "lucide-react";

type Editor = {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
  coverImageUrl: string | null;
  location: string | null;
  specialties: string[];
  software: string[];
  yearsExp: number | null;
  projectCount: number | null;
};

type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  description: string;
};

function cleanUrl(url: string | null): string {
  if (!url) return "";
  return url.trim().replace(/^[ "'“”`]+|[ "'“”`]+$/g, "").trim();
}

export default function AboutClient({
  team,
  timeline,
}: {
  team: Editor[];
  timeline: TimelineEvent[];
}) {
  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 pb-28 px-4 relative overflow-hidden">
      {/* Background Cinematic Glows */}
      <div
        className="absolute top-0 right-0 w-full h-full opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 75% 15%, #007fd4 0%, transparent 45%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 85%, #9c27b0 0%, transparent 45%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center max-w-4xl mx-auto"
        >
          <div className="w-12 h-1 bg-brand-accent mx-auto mb-6" />
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 uppercase tracking-tighter text-white drop-shadow-2xl">
            The Roster
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
            Meet the elite editors, colorists, and VFX artists pushing the boundaries of cinematic storytelling.
          </p>

          {/* Roster Quick Stats Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 mt-8 bg-zinc-900/80 backdrop-blur-xl border border-white/10 px-8 py-3.5 rounded-full shadow-2xl">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#007fd4]" />
              <span className="text-xs font-black uppercase tracking-widest text-white">
                {team.length} Active Crew Members
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" />
              <span className="text-xs font-black uppercase tracking-widest text-white">
                100% Custom Visuals
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── High-Impact Master Roster Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-28">
          {team.length === 0 ? (
            <div className="col-span-3 text-center py-20 bg-zinc-950/60 border border-white/10 rounded-3xl">
              <Users size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">
                Crew records are currently syncing...
              </p>
            </div>
          ) : (
            team.map((member, idx) => {
              const avatarSrc = cleanUrl(member.imageUrl);
              const coverSrc = cleanUrl(member.coverImageUrl);

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <Link
                    href={`/team/${member.slug}`}
                    className="group relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-[#007fd4] transition-all duration-500 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,127,212,0.25)] hover:-translate-y-2 flex flex-col h-full block"
                  >
                    {/* Card Top Banner / Cover */}
                    <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-[#007fd4]/20 via-zinc-900 to-purple-900/20">
                      {coverSrc ? (
                        <Image
                          src={coverSrc}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                      {/* Status Tag */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-green-400">
                          Available
                        </span>
                      </div>
                    </div>

                    {/* Avatar Overlap */}
                    <div className="px-6 -mt-16 relative z-10 flex items-end justify-between">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 bg-zinc-900 shadow-2xl group-hover:border-[#007fd4] transition-colors">
                        {avatarSrc ? (
                          <Image
                            src={avatarSrc}
                            alt={member.name}
                            fill
                            sizes="96px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/30">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Experience / Projects badge if present */}
                      {member.yearsExp ? (
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-xl text-center shadow-lg">
                          <span className="text-sm font-black text-[#007fd4]">
                            {member.yearsExp}+ Yrs
                          </span>
                          <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-widest">
                            Exp.
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Member Details */}
                    <div className="p-6 pt-4 flex-1 flex flex-col justify-between space-y-6">
                      <div>
                        {/* Name & Role */}
                        <div className="w-6 h-1 bg-brand-accent mb-2 group-hover:w-12 transition-all duration-300" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-[#007fd4] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-[#007fd4] font-bold text-xs uppercase tracking-widest mt-1">
                          {member.role}
                        </p>

                        {member.location && (
                          <p className="text-gray-500 text-xs flex items-center gap-1 mt-2 font-mono uppercase tracking-wider">
                            <MapPin size={12} className="text-gray-400" /> {member.location}
                          </p>
                        )}

                        {/* Bio summary */}
                        {member.bio && (
                          <p className="text-gray-400 text-xs mt-3 line-clamp-2 font-light leading-relaxed">
                            {member.bio}
                          </p>
                        )}
                      </div>

                      {/* Core Skills Badges */}
                      <div className="space-y-4">
                        {member.specialties && member.specialties.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">
                              Core Skills
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {member.specialties.slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="bg-[#007fd4]/10 border border-[#007fd4]/30 text-[#007fd4] text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Software Badges */}
                        {member.software && member.software.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">
                              Software Suite
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {member.software.slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="bg-white/5 border border-white/10 text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded-md"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer Action */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-[#007fd4] transition-colors flex items-center gap-1">
                            Explore Portfolio <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#007fd4] group-hover:text-white flex items-center justify-center transition-colors">
                            <ArrowUpRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>

        {/* ── Studio Genesis Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28 bg-zinc-950/60 border border-white/10 p-8 md:p-14 rounded-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="w-10 h-1 bg-brand-accent" />
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
              Studio Protocol
            </h2>
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              OneFrame Studio operates as an agile, high-throughput collective of specialized post-production artists. We combine elite hardware, custom workflows, and artistic precision to deliver uncompromised motion pictures.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div>
                <p className="text-3xl font-black text-[#007fd4]">Zero Friction</p>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1">Direct Editor Access</p>
              </div>
              <div>
                <p className="text-3xl font-black text-purple-400">4K / 8K</p>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1">Master Delivery</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              "Dedicated Lead Editors & Colorists for every project",
              "Customized DaVinci & Premiere Color Grading Pipeline",
              "Turnaround times tailored for viral creators & cinematic brands",
              "Direct communication & real-time revision review",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-black/50 border border-white/10 p-4 rounded-2xl"
              >
                <CheckCircle2 size={20} className="text-[#007fd4] shrink-0" />
                <span className="text-sm font-bold uppercase tracking-wider text-gray-200">
                  {feature}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Studio History Timeline ── */}
        {timeline.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                Studio Timeline
              </h2>
            </motion.div>

            <div className="space-y-6">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="bg-zinc-950/80 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#007fd4]/40 transition-colors"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-black text-[#007fd4] shrink-0">
                      {event.year}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 font-light leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
