import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "@/components/AdminSidebar";
import { ShieldAlert, LogOut, Home } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to sign in if unauthenticated
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  // Check if user possesses the ADMIN role (Granted via Discord Web Admin Role ID: 1533832432476749885)
  const userRole = (session.user as any)?.role;

  if (userRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Background Glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, #e50914 0%, transparent 60%)",
          }}
        />

        <div className="bg-zinc-950 border border-red-500/30 p-8 md:p-12 rounded-3xl max-w-lg shadow-[0_0_80px_rgba(229,9,20,0.15)] text-center relative z-10 space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto shadow-xl">
            <ShieldAlert size={40} />
          </div>

          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
              Access Restricted
            </h1>
            <p className="text-red-400 font-mono text-xs uppercase tracking-widest mt-1">
              Web Admin Discord Role Required
            </p>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed font-light">
            Your Discord account (<span className="text-white font-bold">{session.user?.email || session.user?.name}</span>) does not have the required <span className="text-white font-mono font-bold">Web Admin</span> role (Role ID: <span className="text-[#007fd4] font-mono">1533832432476749885</span>) in the Discord server.
          </p>

          <div className="bg-black/60 border border-white/10 p-4 rounded-xl text-[11px] text-gray-400 font-mono text-left space-y-1">
            <p><span className="text-gray-500">Required Role:</span> Web Admin</p>
            <p><span className="text-gray-500">Role ID:</span> 1533832432476749885</p>
            <p><span className="text-gray-500">Your Current Status:</span> Unauthorized</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
            >
              <Home size={14} /> Back to Website
            </a>
            <a
              href="/api/auth/signout"
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col md:flex-row font-sans selection:bg-brand-accent selection:text-white">
      {/* Background Matrix */}
      <div
        className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      <AdminSidebar />

      <main className="flex-1 p-6 md:p-12 h-screen overflow-y-auto relative z-10">
        {/* Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 blur-[150px] rounded-full pointer-events-none" />
        {children}
      </main>
    </div>
  );
}
