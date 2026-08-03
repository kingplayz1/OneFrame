"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ── Page Wipe Entrance ── */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-[#007fd4] z-[999999] origin-bottom pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      
      {/* ── Page Wipe Entrance (Secondary Color) ── */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-[#030303] z-[999998] origin-bottom pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />

      {/* ── Content Fade & Slide ── */}
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.main>
    </>
  );
}
