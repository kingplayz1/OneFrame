"use client";

import { useState, useEffect } from "react";
import { Save, Loader, CheckCircle, MapPin, Mail, Phone, MessageCircle, Camera, Video } from "lucide-react";

type Config = {
  address?: string;
  contactEmail?: string;
  phone?: string;
  discordUrl?: string;
  discordLabel?: string;
  instagramUrl?: string;
  instagramLabel?: string;
  youtubeUrl?: string;
  youtubeLabel?: string;
};

export default function SettingsAdminClient() {
  const [form, setForm] = useState<Config>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then((d: Config) => { setForm(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: keyof Config, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#007fd4] transition-colors placeholder:text-gray-600";
  const labelClass = "text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2 block";

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <Loader size={24} className="animate-spin mr-3" /> Loading config...
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage contact info shown on the public Contact page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#007fd4] hover:bg-[#008cf2] disabled:opacity-50 text-white font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all text-xs shadow-[0_0_20px_rgba(0,127,212,0.3)]">
          {saving ? <Loader size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {saved && (
        <div className="mb-6 flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-5 py-4 text-sm font-bold">
          <CheckCircle size={18} /> Contact info updated successfully. Changes are live immediately.
        </div>
      )}

      <div className="space-y-6">

        {/* Location */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-2 bg-[#007fd4]/10 rounded-lg"><MapPin size={18} className="text-[#007fd4]" /></div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wide">Location / Address</p>
              <p className="text-gray-500 text-xs">Shown in the "Global Headquarters" section</p>
            </div>
          </div>
          <label className={labelClass}>Address</label>
          <textarea
            rows={2} value={form.address ?? ""} onChange={e => set("address", e.target.value)}
            placeholder="e.g. 101 Cinematic Way, Suite 4K, Los Angeles, CA 90028"
            className={inputClass + " resize-none"} />
        </div>

        {/* Email */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-2 bg-[#007fd4]/10 rounded-lg"><Mail size={18} className="text-[#007fd4]" /></div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wide">Email</p>
              <p className="text-gray-500 text-xs">Shown as the contact email address</p>
            </div>
          </div>
          <label className={labelClass}>Contact Email</label>
          <input type="email" value={form.contactEmail ?? ""} onChange={e => set("contactEmail", e.target.value)}
            placeholder="e.g. contact@oneframestudios.com" className={inputClass} />
        </div>

        {/* Phone */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-2 bg-[#007fd4]/10 rounded-lg"><Phone size={18} className="text-[#007fd4]" /></div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wide">Phone / WhatsApp</p>
            </div>
          </div>
          <label className={labelClass}>Phone Number</label>
          <input type="text" value={form.phone ?? ""} onChange={e => set("phone", e.target.value)}
            placeholder="e.g. +91 98765 43210" className={inputClass} />
        </div>

        {/* Discord */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-2 bg-[#007fd4]/10 rounded-lg"><MessageCircle size={18} className="text-[#007fd4]" /></div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wide">Discord</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Discord Server Invite URL</label>
              <input type="url" value={form.discordUrl ?? ""} onChange={e => set("discordUrl", e.target.value)}
                placeholder="https://discord.gg/xxxxxx" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Label (Button Text)</label>
              <input type="text" value={form.discordLabel ?? ""} onChange={e => set("discordLabel", e.target.value)}
                placeholder="Join our Server" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Instagram */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-2 bg-[#007fd4]/10 rounded-lg"><Camera size={18} className="text-[#007fd4]" /></div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wide">Instagram</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Instagram Profile URL</label>
              <input type="url" value={form.instagramUrl ?? ""} onChange={e => set("instagramUrl", e.target.value)}
                placeholder="https://instagram.com/yourhandle" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Handle / Label</label>
              <input type="text" value={form.instagramLabel ?? ""} onChange={e => set("instagramLabel", e.target.value)}
                placeholder="@1frame_studios" className={inputClass} />
            </div>
          </div>
        </div>

        {/* YouTube */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-2 bg-[#007fd4]/10 rounded-lg"><Video size={18} className="text-[#007fd4]" /></div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wide">YouTube</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>YouTube Channel URL</label>
              <input type="url" value={form.youtubeUrl ?? ""} onChange={e => set("youtubeUrl", e.target.value)}
                placeholder="https://youtube.com/@yourchannel" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Channel Name / Label</label>
              <input type="text" value={form.youtubeLabel ?? ""} onChange={e => set("youtubeLabel", e.target.value)}
                placeholder="@OneFrameStudios" className={inputClass} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
