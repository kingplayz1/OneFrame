"use client";

import { motion } from "framer-motion";
import { MonitorPlay, Scissors, Aperture, Cpu, Zap, Activity } from "lucide-react";

const services = [
  {
    id: "offline",
    title: "Offline Editing",
    description: "The structural foundation of your narrative. We piece together raw data into a compelling, rhythm-driven story.",
    icon: <Scissors size={48} />,
    features: ["Narrative Structuring", "Rhythm & Pacing", "Multi-Cam Sync", "Rough Cut Assemblies"]
  },
  {
    id: "color",
    title: "Color Grading",
    description: "Hyper-real emotional mapping. We engineer custom LUTs and node trees to define the exact mood of your visuals.",
    icon: <Aperture size={48} />,
    features: ["HDR Mastering", "Custom Look Development", "Skin Tone Retouching", "Shot Matching"]
  },
  {
    id: "vfx",
    title: "VFX & Compositing",
    description: "Seamless integration of digital artifacts into organic plates. Removing the impossible, adding the incredible.",
    icon: <Activity size={48} />,
    features: ["Green Screen Extraction", "Rotoscoping", "2D/3D Tracking", "Asset Integration"]
  },
  {
    id: "finishing",
    title: "Online Finishing",
    description: "The final polish before deployment. Conforming, mastering, and packaging for any broadcast or digital platform.",
    icon: <MonitorPlay size={48} />,
    features: ["4K/8K Conforming", "Broadcast Safe QC", "Subtitling & CC", "DCP Creation"]
  },
  {
    id: "motion",
    title: "Motion Graphics",
    description: "Dynamic kinetic typography and 2D/3D animated assets that elevate the production value of the final cut.",
    icon: <Zap size={48} />,
    features: ["Title Sequences", "Lower Thirds", "Data Visualization", "HUD Design"]
  },
  {
    id: "pipeline",
    title: "Pipeline Architecture",
    description: "Consulting and building high-speed rendering pipelines and storage networks for heavy media workloads.",
    icon: <Cpu size={48} />,
    features: ["NAS/SAN Setup", "Remote Edit Workflows", "Render Farm Logic", "Asset Management"]
  }
];

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-foreground pt-32 pb-24 px-4 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-brand-accent/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-20 text-center max-w-4xl mx-auto">
          <div className="w-12 h-1 bg-brand-accent mx-auto mb-6"></div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter text-white drop-shadow-2xl">Core Systems</h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            Our infrastructure is built for scale. From raw ingest to final master, we offer an end-to-end post-production pipeline engineered for elite visual output.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.id} 
              variants={fadeUp} 
              className="bg-black/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:bg-white/5 hover:border-brand-accent/30 transition-all duration-300 group"
            >
              <div className="text-brand-accent mb-8 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 origin-left">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-4">{service.title}</h3>
              <p className="text-gray-400 font-light mb-8 leading-relaxed h-24">{service.description}</p>
              
              <div className="h-px w-full bg-white/10 mb-6 group-hover:bg-brand-accent/50 transition-colors"></div>
              
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
