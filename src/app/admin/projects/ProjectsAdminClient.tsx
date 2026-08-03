"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Film, X, Save, Loader } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  status: string;
  editorId?: string | null;
  editor?: { name: string } | null;
  createdAt: string;
};

type FormState = {
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: string;
  editorId: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  category: "Music Video",
  videoUrl: "",
  thumbnailUrl: "",
  status: "PUBLISHED",
  editorId: "",
};

export default function ProjectsAdminClient({
  initialProjects,
  editors,
}: {
  initialProjects: Project[];
  editors: { id: string; name: string }[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setError("");
    setIsModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setForm({
      title: p.title,
      description: p.description || "",
      category: p.category,
      videoUrl: p.videoUrl || "",
      thumbnailUrl: p.thumbnailUrl || "",
      status: p.status,
      editorId: p.editorId || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category) {
      setError("Title and Category are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const method = editingProject ? "PUT" : "POST";
      const body = editingProject ? { ...form, id: editingProject.id } : form;
      const payload = { ...body, editorId: body.editorId || null };

      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errBody.error || "Unknown error");
      }

      const data = await res.json();
      const assignedEditor = editors.find((e) => e.id === data.editorId);
      if (assignedEditor) data.editor = { name: assignedEditor.name };

      if (editingProject) {
        setProjects(projects.map((p) => (p.id === data.id ? data : p)));
      } else {
        setProjects([data, ...projects]);
      }
      setIsModalOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project from the vault?")) return;
    try {
      await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setProjects(projects.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete.");
    }
  };

  return (
    <>
      {/* ── Page Content ────────────────────────────────────────────── */}
      <div>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <Film className="text-[#007fd4]" /> Project Vault
            </h1>
            <p className="text-gray-400 font-light text-sm mt-1">
              {projects.length} archived projects
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#007fd4] hover:bg-[#008cf2] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(0,127,212,0.4)] cursor-pointer"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.length === 0 && (
            <p className="text-gray-500 italic col-span-3">
              No projects in the vault yet. Add your first one!
            </p>
          )}
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden group relative hover:border-[#007fd4]/40 transition-all"
            >
              {p.thumbnailUrl ? (
                <img
                  src={p.thumbnailUrl}
                  alt={p.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                  <Film size={32} className="text-gray-600" />
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#007fd4] font-bold">
                    {p.category}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                      p.status === "PUBLISHED"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                {p.editor && (
                  <div className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-1">
                    Editor: {p.editor.name}
                  </div>
                )}
                <h3 className="text-white font-bold text-lg mb-1 truncate">{p.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {p.description || "No description."}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-400/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal ── rendered at React Fragment root so it escapes overflow-y-auto ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
              style={{ zIndex: 10000 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                  {editingProject ? "Edit Project" : "New Project"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                <input
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors"
                  placeholder="Project Title *"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <select
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>Music Video</option>
                  <option>Commercial</option>
                  <option>Short Film</option>
                  <option>Documentary</option>
                  <option>VFX Reel</option>
                  <option>Gaming</option>
                  <option>Reel</option>
                  <option>Motion Graphics</option>
                  <option>Color Grading</option>
                  <option>Long-Form</option>
                  <option>Other</option>
                </select>
                <select
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors"
                  value={form.editorId}
                  onChange={(e) => setForm({ ...form, editorId: e.target.value })}
                >
                  <option value="">-- No Editor Assigned --</option>
                  {editors.map((ed) => (
                    <option key={ed.id} value={ed.id}>
                      {ed.name}
                    </option>
                  ))}
                </select>
                <textarea
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors resize-none"
                  placeholder="Description"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <input
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors"
                  placeholder="Video URL (YouTube/Vimeo)"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                />
                <input
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors"
                  placeholder="Thumbnail Image URL"
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                />
                <select
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>

                {error && (
                  <p className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#007fd4] hover:bg-[#008cf2] disabled:opacity-50 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-colors cursor-pointer"
                >
                  {loading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                  {loading ? "Saving..." : "Save Project"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
