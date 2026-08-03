"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Camera, MessageCircle, Loader } from "lucide-react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", service: "vfx", budget: "10k", details: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.details) {
      setError("Please fill out all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          details: `Service: ${formData.service} | Budget: ${formData.budget}\n\n${formData.details}`
        })
      });
      
      if (!res.ok) throw new Error("Failed to send transmission");
      setSuccess(true);
      setFormData({ name: "", email: "", service: "vfx", budget: "10k", details: "" });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#030303] text-foreground pt-32 pb-24 px-4 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#007fd4]/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#e50914]/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Info */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="w-12 h-1 bg-brand-accent mb-6"></div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter text-white drop-shadow-2xl">
            Initiate <br /> <span className="text-[#007fd4]">Transmission</span>
          </h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-lg">
            Ready to push your project through our post-production pipeline? Secure a slot and let's build something cinematic.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <MapPin className="text-[#007fd4]" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-1">Global Headquarters</h3>
                <p className="text-gray-400 font-light">101 Cinematic Way, Suite 4K<br/>Los Angeles, CA 90028</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Mail className="text-[#007fd4]" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-1">Encrypted Comms</h3>
                <p className="text-gray-400 font-light">post@oneframestudios.com<br/>careers@oneframestudios.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Phone className="text-[#007fd4]" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-1">Direct Line</h3>
                <p className="text-gray-400 font-light">+1 (310) 555-0199</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <MessageCircle className="text-[#007fd4]" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-1">Discord</h3>
                <a href="https://discord.gg/tnuFPZS3QF" target="_blank" rel="noopener noreferrer" className="text-gray-400 font-light hover:text-[#007fd4] transition-colors">Join our Server</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Camera className="text-[#007fd4]" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-1">Instagram</h3>
                <a href="https://www.instagram.com/1frame_studios?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 font-light hover:text-[#007fd4] transition-colors">@1frame_studios</a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          {success ? (
            <div className="text-center space-y-4 py-10">
              <div className="w-16 h-16 bg-[#007fd4]/20 text-[#007fd4] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#007fd4]/50">
                <Send size={30} className="translate-x-0.5" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Transmission Sent</h3>
              <p className="text-gray-400 font-light">Your project details have been successfully transmitted to our team. We'll be in touch shortly.</p>
              <button onClick={() => setSuccess(false)} className="mt-6 text-[#007fd4] font-bold uppercase tracking-widest text-sm hover:text-white transition-colors">
                Send Another
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Transmission Alias (Name) *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#007fd4] transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Return Vector (Email) *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#007fd4] transition-colors" placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Service Required</label>
                <select value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#007fd4] transition-colors appearance-none cursor-pointer">
                  <option value="vfx">Visual Effects (VFX)</option>
                  <option value="color">Color Grading</option>
                  <option value="offline">Offline Editing</option>
                  <option value="full">Full Post-Production Package</option>
                  <option value="other">Other / Consultation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Estimated Budget</label>
                <select value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#007fd4] transition-colors appearance-none cursor-pointer">
                  <option value="10k">Under $10,000</option>
                  <option value="10k-50k">$10,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k+">$100,000+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Project Coordinates (Details) *</label>
                <textarea required value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} rows={5} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#007fd4] transition-colors resize-none" placeholder="Provide link to rough cut, timeline, or visual references..."></textarea>
              </div>

              {error && <div className="text-red-400 text-sm font-mono">{error}</div>}

              <button type="submit" disabled={loading} className="w-full group bg-[#007fd4] text-white hover:bg-[#008cf2] font-black uppercase tracking-widest py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50">
                {loading ? (
                  <><Loader className="animate-spin" size={18} /> Transmitting...</>
                ) : (
                  <>Transmit Project Meta <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </div>
  );
}
