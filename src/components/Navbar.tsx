"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="https://i.vgy.me/8c68Zb.png"
            alt="OneFrame Logo" 
            width={120} 
            height={40} 
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-gray-300">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                href={link.href} 
                className={`transition-colors hover:text-brand-accent ${
                  pathname === link.href ? "text-brand-accent font-bold" : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Contact Button */}
        <Link 
          href="/contact" 
          className="hidden md:flex bg-white text-black hover:bg-[#007fd4] hover:text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Start Project
        </Link>
      </div>
    </nav>
  );
}
