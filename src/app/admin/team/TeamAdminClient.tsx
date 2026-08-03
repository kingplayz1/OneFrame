"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Users, X, Save, Loader,
  Film, Sparkles, Tv, Link2, Share2, FileText, Wrench, Award, MapPin
} from "lucide-react";

type Editor = {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string | null;
  software: string[];
  specialties: string[];
  imageUrl: string | null;
  coverImageUrl: string | null;
  showreelUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
  yearsExp: number | null;
  projectCount: number | null;
  location: string | null;
  createdAt: string;
};

type FormState = {
  name: string;
  slug: string;
  role: string;
  bio: string;
  software: string;
  specialties: string;
  imageUrl: string;
  coverImageUrl: string;
  showreelUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  yearsExp: string;
  projectCount: string;
  location: string;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  role: "",
  bio: "",
  software: "",
  specialties: "",
  imageUrl: "",
  coverImageUrl: "",
  showreelUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  twitterUrl: "",
  yearsExp: "",
  projectCount: "",
  location: "",
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function sanitizeUrl(str: string) {
  return str.trim().replace(/^[ "'“”`]+|[ "'“”`]+$/g, "").trim();
}

export default function TeamAdminClient({ initialEditors }: { initialEditors: Editor[] }) {
  const [editors, setEditors] = useState<Editor[]>(initialEditors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEditor, setEditingEditor] = useState<Editor | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditingEditor(null);
    setForm(emptyForm);
    setError("");
    setIsModalOpen(true);
  };

  const openEdit = (e: Editor) => {
    setEditingEditor(e);
    setForm({
      name: e.name,
      slug: e.slug,
      role: e.role,
      bio: e.bio || "",
      software: e.software ? e.software.join(", ") : "",
      specialties: e.specialties ? e.specialties.join(", ") : "",
      imageUrl: e.imageUrl || "",
      coverImageUrl: e.coverImageUrl || "",
      showreelUrl: e.showreelUrl || "",
      instagramUrl: e.instagramUrl || "",
      youtubeUrl: e.youtubeUrl || "",
      twitterUrl: e.twitterUrl || "",
      yearsExp: e.yearsExp?.toString() || "",
      projectCount: e.projectCount?.toString() || "",
      location: e.location || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.slug) {
      setError("Name, Slug, and Role are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const method = editingEditor ? "PUT" : "POST";
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        role: form.role.trim(),
        bio: form.bio.trim() || null,
        software: form.software
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        specialties: form.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        imageUrl: sanitizeUrl(form.imageUrl) || null,
        coverImageUrl: sanitizeUrl(form.coverImageUrl) || null,
        showreelUrl: sanitizeUrl(form.showreelUrl) || null,
        instagramUrl: sanitizeUrl(form.instagramUrl) || null,
        youtubeUrl: sanitizeUrl(form.youtubeUrl) || null,
        twitterUrl: sanitizeUrl(form.twitterUrl) || null,
        yearsExp: form.yearsExp ? parseInt(form.yearsExp) : null,
        projectCount: form.projectCount ? parseInt(form.projectCount) : null,
        location: form.location.trim() || null,
        ...(editingEditor ? { id: editingEditor.id } : {}),
      };

      const res = await fetch("/api/admin/team", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errBody.error || "Failed to save portfolio.");
      }

      const data = await res.json();
      if (editingEditor) {
        setEditors(editors.map((e) => (e.id === data.id ? data : e)));
      } else {
        setEditors([data, ...editors]);
      }
      setIsModalOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this editor portfolio?")) return;
    try {
      await fetch("/api/admin/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setEditors(editors.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete.");
    }
  };

  const inputClass =
    "w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors placeholder-gray-500";

  return (
    <>
      {/* ── Page Header ── */}
      <div>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <Users className="text-[#007fd4]" /> Roster & Portfolios
            </h1>
            <p className="text-gray-400 font-light text-sm mt-1">
              {editors.length} crew members · Manage bio, showreel, channels, skills, & software
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#007fd4] hover:bg-[#008cf2] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {editors.length === 0 && (
            <p className="text-gray-500 italic col-span-3">No team members yet. Add your first editor!</p>
          )}
          {editors.map((e) => (
            <div
              key={e.id}
              className="bg-black/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-6 hover:border-[#007fd4]/40 transition-all shadow-xl group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center gap-4">
                  {e.imageUrl ? (
                    <img
                      src={e.imageUrl}
                      alt={e.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#007fd4]/40"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#007fd4] to-purple-600 flex items-center justify-center text-xl font-black text-white">
                      {e.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-black text-lg uppercase tracking-tight truncate">
                      {e.name}
                    </h3>
                    <p className="text-[#007fd4] text-xs uppercase tracking-widest font-bold">
                      {e.role}
                    </p>
                    <p className="text-gray-500 text-[11px] font-mono mt-0.5">
                      /team/{e.slug}
                    </p>
                  </div>
                </div>

                {/* Bio preview */}
                {e.bio && (
                  <p className="text-gray-400 text-xs line-clamp-2 font-light leading-relaxed">
                    {e.bio}
                  </p>
                )}

                {/* Core Skills */}
                {e.specialties && e.specialties.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
                      Core Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {e.specialties.map((s) => (
                        <span
                          key={s}
                          className="bg-[#007fd4]/10 border border-[#007fd4]/30 text-[#007fd4] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Software */}
                {e.software && e.software.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
                      Software:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {e.software.map((s) => (
                        <span
                          key={s}
                          className="bg-white/5 border border-white/10 text-gray-300 text-[10px] px-2 py-0.5 rounded font-mono"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => openEdit(e)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs text-white bg-[#007fd4]/20 hover:bg-[#007fd4] border border-[#007fd4]/40 hover:border-[#007fd4] py-2 rounded-xl transition-all cursor-pointer font-bold uppercase tracking-wider"
                >
                  <Pencil size={13} /> Edit Portfolio
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(e.id)}
                  className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/40 px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Editor Portfolio Admin Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh]"
              style={{ zIndex: 10000 }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-8 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                    {editingEditor ? `Edit Portfolio — ${editingEditor.name}` : "New Team Member"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage full editor profile, story, showreel, skills, and channel links
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Form Content */}
              <div className="overflow-y-auto p-8 space-y-8">
                {/* 1. Basic Identity */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#007fd4] flex items-center gap-2">
                    <Users size={14} /> 01. Basic Identity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Name *
                      </label>
                      <input
                        className={inputClass}
                        placeholder="e.g. Vivek"
                        value={form.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            name: e.target.value,
                            slug: editingEditor ? form.slug : slugify(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        URL Slug *
                      </label>
                      <input
                        className={inputClass}
                        placeholder="e.g. vivek"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Role / Title *
                      </label>
                      <input
                        className={inputClass}
                        placeholder="e.g. Heads Editor / Lead VFX"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Location
                      </label>
                      <input
                        className={inputClass}
                        placeholder="e.g. Mumbai, India"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. The Story (Bio) */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#007fd4] flex items-center gap-2">
                    <FileText size={14} /> 02. The Story (Bio)
                  </h3>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Bio Description — Public Portfolio Biography
                    </label>
                    <textarea
                      className={`${inputClass} resize-none`}
                      placeholder="Write a long-form description about their background, editing philosophy, and achievements..."
                      rows={4}
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    />
                  </div>
                </div>

                {/* 3. Core Skills & Software */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#007fd4] flex items-center gap-2">
                    <Wrench size={14} /> 03. Core Skills & Software Arsenal
                  </h3>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Core Skills (Comma-separated)
                    </label>
                    <input
                      className={inputClass}
                      placeholder="e.g. Color Grading, VFX, Sound Design, Storyboarding"
                      value={form.specialties}
                      onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Software Suite (Comma-separated)
                    </label>
                    <input
                      className={inputClass}
                      placeholder="e.g. Premiere Pro, DaVinci Resolve, After Effects, Houdini"
                      value={form.software}
                      onChange={(e) => setForm({ ...form, software: e.target.value })}
                    />
                  </div>
                </div>

                {/* 4. Showreel & Visual Assets */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#007fd4] flex items-center gap-2">
                    <Film size={14} /> 04. Showreel & Visual Assets
                  </h3>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Showreel Video Link (YouTube or Video URL)
                    </label>
                    <input
                      className={inputClass}
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      value={form.showreelUrl}
                      onChange={(e) => setForm({ ...form, showreelUrl: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Profile Avatar Image URL
                      </label>
                      <input
                        className={inputClass}
                        placeholder="https://..."
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Hero Cover Banner Image URL
                      </label>
                      <input
                        className={inputClass}
                        placeholder="https://..."
                        value={form.coverImageUrl}
                        onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Channels & Social Links */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#007fd4] flex items-center gap-2">
                    <Share2 size={14} /> 05. Channels & External Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Instagram URL
                      </label>
                      <input
                        className={inputClass}
                        placeholder="https://instagram.com/..."
                        value={form.instagramUrl}
                        onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        YouTube Channel URL / Vitrine
                      </label>
                      <input
                        className={inputClass}
                        placeholder="https://youtube.com/... or ytjobs.co/..."
                        value={form.youtubeUrl}
                        onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Twitter / Behance / Portfolio Link
                      </label>
                      <input
                        className={inputClass}
                        placeholder="https://behance.net/... or x.com/..."
                        value={form.twitterUrl}
                        onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Stats & Experience */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#007fd4] flex items-center gap-2">
                    <Award size={14} /> 06. Experience Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Years Experience
                      </label>
                      <input
                        className={inputClass}
                        type="number"
                        placeholder="e.g. 5"
                        value={form.yearsExp}
                        onChange={(e) => setForm({ ...form, yearsExp: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                        Projects Completed Count
                      </label>
                      <input
                        className={inputClass}
                        type="number"
                        placeholder="e.g. 150"
                        value={form.projectCount}
                        onChange={(e) => setForm({ ...form, projectCount: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <p className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#007fd4] hover:bg-[#008cf2] disabled:opacity-50 text-white font-black uppercase tracking-widest py-3.5 rounded-xl transition-colors cursor-pointer shadow-lg"
                >
                  {loading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                  {loading ? "Saving Portfolio..." : "Save Portfolio"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
