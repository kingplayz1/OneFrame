"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Clock, X, Save, Loader } from "lucide-react";

type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  description: string;
  createdAt: string;
};

type FormState = { year: string; title: string; description: string; };

const emptyForm: FormState = { year: "", title: "", description: "" };

const input = "w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors";

export default function TimelineAdminClient({ initialEvents }: { initialEvents: TimelineEvent[] }) {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openCreate = () => { setEditingEvent(null); setForm(emptyForm); setError(""); setIsModalOpen(true); };
  const openEdit = (e: TimelineEvent) => {
    setEditingEvent(e);
    setForm({ year: e.year, title: e.title, description: e.description });
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.year || !form.title || !form.description) { setError("All fields are required."); return; }
    setLoading(true); setError("");
    try {
      const method = editingEvent ? "PUT" : "POST";
      const body = { ...form, ...(editingEvent ? { id: editingEvent.id } : {}) };
      const res = await fetch("/api/admin/timeline", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errBody.error || "Unknown error");
      }
      const data = await res.json();
      if (editingEvent) {
        setEvents(events.map(e => e.id === data.id ? data : e));
      } else {
        setEvents([data, ...events].sort((a, b) => parseInt(b.year) - parseInt(a.year)));
      }
      setIsModalOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this timeline event?")) return;
    try {
      await fetch("/api/admin/timeline", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      setEvents(events.filter(e => e.id !== id));
    } catch { alert("Failed to delete."); }
  };

  return (
    <>
      {/* ── Page Content ── */}
      <div>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <Clock className="text-[#007fd4]" /> Timeline
            </h1>
            <p className="text-gray-400 font-light text-sm mt-1">Manage studio milestones & history</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#007fd4] hover:bg-[#008cf2] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
          >
            <Plus size={16} /> Add Event
          </button>
        </div>

        <div className="space-y-4">
          {events.length === 0 && <p className="text-gray-500 italic">No timeline events yet.</p>}
          {events.map(e => (
            <div key={e.id} className="bg-black/50 border border-white/10 rounded-2xl p-6 flex justify-between items-center hover:border-[#007fd4]/30 transition-all">
              <div>
                <span className="text-2xl font-black text-[#007fd4] mr-4">{e.year}</span>
                <span className="text-white font-bold text-lg">{e.title}</span>
                <p className="text-gray-400 text-sm mt-2">{e.description}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 ml-6">
                <button type="button" onClick={() => openEdit(e)} className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                  <Pencil size={12} /> Edit
                </button>
                <button type="button" onClick={() => handleDelete(e.id)} className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-400/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal — outside overflow container ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
              style={{ zIndex: 10000 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                  {editingEvent ? "Edit Event" : "New Event"}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input className={input} placeholder="Year * (e.g. 2024)" value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })} />
                <input className={input} placeholder="Title *" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} />
                <textarea className={`${input} resize-none`} placeholder="Description *" rows={4} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
                {error && <p className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>}
                <button type="button" onClick={handleSave} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#007fd4] hover:bg-[#008cf2] disabled:opacity-50 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-colors cursor-pointer">
                  {loading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                  {loading ? "Saving..." : "Save Event"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
