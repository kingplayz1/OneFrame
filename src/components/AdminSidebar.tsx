"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Home, Grid, Users, Clock, Mail } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: <Home size={18} /> },
    { name: "Project Vault", href: "/admin/projects", icon: <Grid size={18} /> },
    { name: "Personnel", href: "/admin/team", icon: <Users size={18} /> },
    { name: "Timeline", href: "/admin/timeline", icon: <Clock size={18} /> },
    { name: "Transmissions", href: "/admin/contacts", icon: <Mail size={18} /> },
  ];

  return (
    <aside className="w-full md:w-72 bg-black/80 backdrop-blur-xl border-r border-white/10 p-8 flex flex-col z-10 shrink-0">
      <div className="mb-12 flex items-center gap-3">
        <div className="w-4 h-4 bg-brand-accent animate-pulse rounded-sm shadow-[0_0_10px_rgba(229,9,20,0.8)]"></div>
        <div>
          <h2 className="text-xl font-black tracking-tighter uppercase leading-none">SYSTEM <span className="text-brand-accent">ADMIN</span></h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mt-1">Access Level: OVERRIDE</p>
        </div>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`flex items-center gap-4 text-sm font-bold uppercase tracking-widest p-4 rounded-xl transition-all border group ${
                isActive 
                  ? "bg-white/10 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10"
              }`}
            >
              <span className={`${isActive ? "text-[#007fd4]" : "text-brand-accent group-hover:scale-110 transition-transform"}`}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-white/10 mt-8">
        <Link href="/" className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-brand-accent transition-colors p-4">
          <LogOut size={18} /> Exit Matrix
        </Link>
      </div>
    </aside>
  );
}
