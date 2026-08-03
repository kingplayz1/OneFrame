"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SoundEffects() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Web Audio API on first user interaction to comply with browser autoplay policies
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };

    window.addEventListener("click", initAudio, { once: true });
    return () => window.removeEventListener("click", initAudio);
  }, []);

  const playHoverSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Very subtle, short, high-pitched tech "tick"
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.01); // Very quiet (2% volume)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  const playClickSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Deeper, punchier "thud/click"
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01); // 5% volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    const interactiveElements = document.querySelectorAll("a, button, [role='button']");
    
    const attachHover = () => playHoverSound();
    const attachClick = () => playClickSound();

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", attachHover);
      el.addEventListener("mousedown", attachClick);
    });

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", attachHover);
        el.removeEventListener("mousedown", attachClick);
      });
    };
  }, [pathname]);

  return null; // This component is invisible
}
